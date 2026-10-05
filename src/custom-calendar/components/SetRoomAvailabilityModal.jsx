import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Calendar, Building2, Bed, Minus, Plus } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { Button, Spinner } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { CheckRoomAvailabilityAPI, SetRoomAvailabilityAPI } from '@/services/provider';
import { calculateNights, changeToNextDate, formatLabel, formatYMD } from '@/utils/formatTime';
import { alert_danger, alert_success } from '@/utils/Alerts/TostifyAlerts';
import { useRouter } from 'next/navigation';
import { setItemLocalStorage } from '@/utils/browserStorage';
import toast from 'react-hot-toast';
/**
 * @typedef {'available' | 'blocked_maintenance' | 'unavailable' | 'book_room'} AvailabilityOption
 */

/**
 * Set room availability modal component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {() => void} props.onClose - Close callback
 * @param {string} [props.roomName='Room 3'] - Room name
 * @param {string} [props.bedName='Bed B'] - Bed name
 * @param {string} [props.propertyName] - Property name
 * @param {string} [props.companyName] - Company name
 * @param {Date} [props.startDate] - Start date
 * @param {Date} [props.endDate] - End date
 * @param {number} [props.maxGuests=2] - Maximum guests
 * @param {(data: Object) => void} [props.onSave] - Save callback
 * @param {(data: Object) => void} [props.onContinueToGuests] - Continue to guests callback
 * @param {boolean} [props.existingBookingConflict=false] - Existing booking conflict
 * @param {boolean} [props.maintenanceConflict=false] - Maintenance conflict
 * @returns {JSX.Element}
 */

function transformToPropertyFormat(data, roomInner, guestCount) {
  return [
    {
      property_id: data.property_details.property_id ?? null,
      property_uid: data.property_details.property_uid,
      property_name: data.property_details.property_name,
      property_slug: data.property_details.property_slug,
      address: data.property_details.property_address,
      city: data.property_details.city,
      check_in_datetime: data.booking_draft.check_in_date,
      check_out_datetime: data.booking_draft.check_out_date,
      // adultCount: data.room_details.max_guests,
      adultCount: guestCount,
      cover_photo: data.room_details.room_cover_photo,
      latitude: data.property_details?.latitude,
      longitude: data.property_details?.longitude,

      rooms: [
        {
          room_id: data.room_details.room_id ?? null,
          room_uid: data.room_details.room_uid,
          room_name: data.room_details.room_name,
          room_slug: data.room_details.room_slug,
          room_type: data.room_details.room_type,
          room_size_sqft: data.room_details.room_size_sqft,
          max_guests: data.room_details.max_guests,
          total_beds: data.room_details.total_beds,
          bedroom_preference: data.room_details.bedroom_preference,
          bedroom_preference_badge:
            data.room_details.bedroom_preference?.toUpperCase() + " PREFERRED",
          bed_index: data.room_details.bed_index,
          bed_name: data.room_details.bed_name,
          bed_sleeps: data.room_details.bed_sleeps,
          beds: roomInner?.beds,
          available_beds: roomInner?.available_beds,

          availability_status: "available",
          availability_score: 100,
          is_available: true,

          price_per_night: data.room_details.price_per_night,
          bathrooms: data.room_details.bathrooms,
          room_description: data.room_details.room_description,
          room_amenities: [],
          booking_info: null,
          cover_photo: `${data.property_details.cover_photo}`,
          gender_lock: null,
          property_id: data.property_details.property_id ?? null,
          can_book_exclusive: roomInner?.can_book_exclusive
        }
      ]
    }
  ];
}

export function SetRoomAvailabilityModal({
  room,
  initialStartDate,
  initialEndDate,
  isOpen,
  onClose,
  roomName = 'Room 3',
  bedName = 'Bed B',
  propertyName,
  companyName,
  // startDate: initialStartDate = new Date(),
  // endDate: initialEndDate,
  maxGuests = 2,
  onSave,
  onContinueToGuests,
  existingBookingConflict = false,
  maintenanceConflict = false,
  getFullCalendorData,
  filters,
  permissions = {},
}) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  /** @type {[AvailabilityOption, (value: AvailabilityOption) => void]} */
  const [availability, setAvailability] = useState('available');
  const [guestCount, setGuestCount] = useState(1);
  const [reason, setReason] = useState('');
  const [privateNote, setPrivateNote] = useState('');
  const [error, setError] = useState('');
  const [availabilityOptions, setAvailabilityOptions] = useState([]);
  const [CheckAvailability, setCheckAvailability] = useState({})
  const router = useRouter();
  // const nights = endDate ? differenceInDays(endDate, startDate) : 0;
  const nights = endDate ? calculateNights(startDate, endDate) : 0;
  const hasConflict = existingBookingConflict || maintenanceConflict;
  const [is_available, setIs_Available] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize dates when modal opens
  useEffect(() => {
    if (isOpen) {
      const startDateStr = initialStartDate
        ? format(new Date(initialStartDate), 'yyyy-MM-dd')
        : format(new Date(), 'yyyy-MM-dd');
      const endDateStr = initialEndDate
        ? format(new Date(initialEndDate), 'yyyy-MM-dd')
        : format(addDays(new Date(), 1), 'yyyy-MM-dd');

      setStartDate(startDateStr);
      // setEndDate(endDateStr);
      setAvailability('available');
      setGuestCount(1);
      setPrivateNote('');
      setError('');
    }
  }, [isOpen, initialStartDate, initialEndDate]);

  const handleSave = async () => {
    try {
      setIsLoading(true)
      const payload = {
        action: availability,
        start_date: formatYMD(startDate),
        end_date: formatYMD(endDate)
      }
      // if (typeof room?.data?.bed_index == "number") payload.bed_index = room?.data?.bed_index
      if (typeof room?.data?.bedIndex == "number") payload.bed_index = room?.data?.bedIndex
      if (availability == "book_room") {
        if (CheckAvailability.room_details.bed_index) payload.bed_index = CheckAvailability.room_details.bed_index;
        payload.num_guests = guestCount;
        payload.company_id = filters?.companies
      } else {
        if (CheckAvailability.room_details.bed_index) payload.bed_index = CheckAvailability.room_details.bed_index;
        payload.block_type = "Maintenance";
        payload.reason = reason;
        payload.note = privateNote;
      }
      const response = await SetRoomAvailabilityAPI(room?.data?.room_uid || room?.data?.roomId, payload)
      if (response.data.success) {
        setIsLoading(false)
        if (availability == "book_room") {
          const bookingCity = response.data.response?.property_details?.city
            || (Array.isArray(filters?.location) ? filters.location[0] : filters?.location)
            || '';
          const transform = transformToPropertyFormat(response.data.response, room?.data ? room?.data : room, guestCount)
          setItemLocalStorage("reserveRoom", JSON.stringify(transform))
          const updatedSearchFieldData = {
            company_id: filters?.companies,
            // city: filters?.location,
            city: bookingCity,
            check_in_date: formatYMD(startDate),
            rooms: [{ adults: guestCount }],
            check_out_date: formatYMD(endDate) || changeToNextDate(startDate),
            company_name: room?.data?.propertyItem?.assigned_company
          };
          const searchRes = {
            company_id: filters?.companies,
            company_name: room?.data?.propertyItem?.assigned_company,
            // city: filters?.location,
            city: bookingCity,
            check_in_date: formatYMD(startDate),
            check_out_date: formatYMD(endDate) || changeToNextDate(startDate),
            total_nights: response.data.response.booking_draft.total_nights,
            rooms_requested: 1,
            room_type_preference: "Any",
            budget_range: null,
            availability_filter: true,
            sort_by: "availability",
            gender_filter: "Any"
          }

          setItemLocalStorage("basicSecrchItemObj", JSON.stringify(updatedSearchFieldData));
          setItemLocalStorage("searchParam", JSON.stringify(searchRes))
          // router.push(response.data.response.redirect_url)
          window.location.href = `${response.data.response.redirect_url}`;
        } else {
          setItemLocalStorage('blockInfo', JSON.stringify(response?.data?.response?.block_draft))
          router.push(response.data.response.redirect_url)
        }
      } else {
        setIsLoading(false);
        if (response.data.response) toast.error(response.data.response);
        if (response.data.error.message) toast.error(response.data.error.message);
      }
    } catch (error) {
      setIsLoading(false)
      // console.log(error);
    }
  };

  /** @type {{ id: AvailabilityOption; label: string }[]} */
  // const availabilityOptions = [
  //   // { id: 'available', label: 'Available' },
  //   { id: 'blocked_maintenance', label: 'Blocked for Maintenance' },
  //   // { id: 'unavailable', label: 'Unavailable' },
  //   { id: 'book_room', label: 'Book Room' },
  // ];

  const getCheckAvailabilityData = async () => {
    try {
      const payload = {
        start_date: formatYMD(startDate),
        end_date: formatYMD(endDate)
        //   "bed_index": 1  // is required for twin sharing room 
      }
      // if (typeof room?.data?.bed_index == "number") payload.bed_index = room?.data?.bed_index
      if (typeof room?.data?.bedIndex == "number") payload.bed_index = room?.data?.bedIndex
      const response = await CheckRoomAvailabilityAPI(room?.data?.room_uid ? room?.data?.room_uid : room?.data?.roomId, payload)
      if (response?.data?.success) {
        // Server sends back the actions available for this room/date range; drop any
        // action the current user isn't permitted to perform, even if the server
        // included it (defense-in-depth alongside server-side enforcement).
        const allowedActions = (response?.data?.response?.available_actions || []).filter((action) => {
          if (action === 'book_room') return permissions.createBooking;
          if (action === 'block_maintenance' || action === 'blocked_maintenance') return permissions.markRoomInactive;
          return true;
        });
        setAvailabilityOptions(allowedActions.map((cv) => ({ id: cv, label: cv })))
        setCheckAvailability(response.data.response)
        setIs_Available(response.data.response.is_available)
      } else {
        getFullCalendorData()
        // setEndDate('')
        // onClose()
        // alert_danger(response.data.response)
        toast.error(response.data.response)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (endDate) {
      getCheckAvailabilityData()
    }
  }, [endDate])
  console.log(CheckAvailability, availability);
  console.log("===================>oooooo", room, availabilityOptions)

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => { !open && onClose(); setEndDate(''); setIs_Available(false) }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl  shadow-2xl z-50 max-h-[90vh] overflow-hidden" style={{ background: '#F2F2F2' }}  >
          {/* Header */}
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="mb-0 page-title">
                Set Room Availability
              </h3>
              <Dialog.Close asChild>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Date Selection */}
            <div className="mb-6 bg-white rounded-xl p-3">
              <p className="font-18">Selected dates</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Start date</label>
                  {/* <div className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 "> */}
                  {/* <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {format(startDate, 'd MMM, yyyy')}
                    </span> */}
                  <DatePicker
                    selected={startDate}
                    onChange={(e) => setStartDate(e)}
                    placeholderText="Select date"
                    className="form-control  custom-date-picker"
                    minDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                  />
                  {/* </div> */}
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">End date</label>
                  {/* <div className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 ">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {endDate ? format(endDate, 'd MMM, yyyy') : 'Select date'}
                    </span>
                  </div> */}
                  <DatePicker
                    selected={endDate}
                    onChange={(e) => setEndDate(e)}
                    placeholderText="Select date"
                    className="form-control custom-date-picker"
                    minDate={startDate || new Date()}
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{nights} nights</p>
              <p>{CheckAvailability?.message ? CheckAvailability?.message : ""}</p>
              {/* Conflict Warning */}
              {hasConflict && (
                <p className="text-sm text-amber-600 mt-2">
                  {existingBookingConflict
                    ? `Unable to book the room. ${room?.data?.room_name} is already booked for the chosen date range.`
                    : `Unable to book the room. ${room?.data?.room_name} is marked for maintenance for the chosen date range.`
                  }
                </p>
              )}

              <hr></hr>

              <div className="d-flex items-center gap-2 text-gray-700 mb-2">
                {(room?.data?.room_name || room?.room_name) && (
                  <>
                    <span className="font-medium">{room?.data?.room_name || room?.room_name}</span>
                    <span className="text-gray-400">|</span>
                  </>
                )}
                {room?.data?.roomName && (
                  <>
                    <span className="font-medium">{room?.data?.roomName}</span>
                    <span className="text-gray-400">|</span>
                  </>
                )}

                {/* {room?.data?.beds?.length && (
                  <>
                    <Bed className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500" style={{ fontSize: '14px' }}>{room?.data?.beds?.[0]?.bed_name}</span>
                  </>
                )}
                {room?.beds?.length && (
                  <>
                    <Bed className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500" style={{ fontSize: '14px' }}>{room?.beds?.[0]?.bed_name}</span>
                    <span className="text-gray-400">|</span>
                  </>
                )}     */}
                {room?.data?.bed_name && (
                  <>
                    <Bed className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500" style={{ fontSize: '14px' }}>{room?.data?.bed_name}</span>
                    <span className="text-gray-400">|</span>
                  </>
                )}
                <span className=" text-gray-500 truncate" style={{ fontSize: '14px' }}>{propertyName}</span>
              </div>
              {companyName && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Building2 className="w-4 h-4" />
                  <span>{companyName}</span>
                </div>
              )}
            </div>


            {/* Availability Options */}
            {is_available && (
              <div className="mb-6 bg-white rounded-xl p-3">
                <p className="font-18 mb-2">Availability</p>
                <div className="space-y-2">
                  {availabilityOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`
                      w-100 d-flex align-items-center gap-3 p-3  border cursor-pointer transition-colors
                      ${availability === option.id
                          ? 'border-[var(--color-alice-brown)] bg-[var(--color-alice-cream)]'
                          : 'border-gray-200 hover:bg-gray-50'
                        }
                    `}
                    >
                      <input
                        type="radio"
                        name="availability"
                        value={option.id}
                        checked={availability === option.id}
                        onChange={(e) => setAvailability(e.target.value)}
                        className="w-4 h-4 text-[var(--color-alice-brown)] border-gray-300 focus:ring-[var(--color-alice-brown)]"
                      />
                      <span className="text-sm text-gray-700">{formatLabel(option?.label)}</span>
                    </label>
                  ))}
                </div>
                <hr></hr>
                {/* Guest Count (only for book_room) */}
                {availability === 'book_room' && (
                  <div className="mb-6">
                    <p className="font-18 mb-3">No. of Guests</p>
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <button
                        onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-medium text-gray-900">{guestCount}</span>
                      <button
                        onClick={() => setGuestCount(Math.min(CheckAvailability?.room_details?.max_guests, guestCount + 1))}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {CheckAvailability?.room_details?.bed_name} Sleeps {CheckAvailability?.room_details?.max_guests}
                    </p>
                  </div>
                )}


                {availability === 'block_maintenance' && (
                  <>
                    <div className="mb-6">
                      <p className=" mb-2">Reason</p>
                      <Select
                        options={[
                          { value: 'Renovation', label: 'Renovation' },
                          { value: 'Maintenance', label: 'Maintenance' },
                          { value: 'Blocked', label: 'Blocked' }
                        ]}
                        onChange={(e) => setReason(e.value)}
                        className="basic-multi-select react_selectbox"
                        classNamePrefix="select"
                      />
                    </div>


                    <div className="mb-0">
                      <p className=" mb-2">Maintenance Note</p>
                      <textarea
                        value={privateNote}
                        onChange={(e) => setPrivateNote(e.target.value)}
                        placeholder="Add maintenance details here"
                        className="w-full px-3 py-2 text-sm border border-gray-200 bg-gray-100 resize-none er-transparent"
                        rows={3}
                      />
                    </div>
                  </>
                )}

              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <Button
              variant=''
              onClick={handleSave}
              disabled={hasConflict && availability === 'book_room'}
              className={`
                w-full px-4 py-3 text-sm font-medium rounded-lg  
                ${hasConflict && availability === 'book_room'
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'text-white complete-form-btn hover:complete-form-btn-bg-hover'
                }
              `}
            >
              {isLoading ? <Spinner animation="border" variant="light" size='sm' /> : availability === 'block_maintenance' ? 'Block' : 'Continue to Guests'}
              {/* {availability === 'book_room' ? 'Continue to Guests' : 'Block'} */}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

SetRoomAvailabilityModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  roomName: PropTypes.string,
  bedName: PropTypes.string,
  propertyName: PropTypes.string,
  companyName: PropTypes.string,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  maxGuests: PropTypes.number,
  onSave: PropTypes.func,
  onContinueToGuests: PropTypes.func,
  existingBookingConflict: PropTypes.bool,
  maintenanceConflict: PropTypes.bool,
  permissions: PropTypes.object,
};