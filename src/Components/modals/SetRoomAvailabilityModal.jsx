import { useState } from 'react';
import PropTypes from 'prop-types';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Calendar, Building2, Bed, Minus, Plus } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { Button } from 'react-bootstrap';
import Select from 'react-select';
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
export function SetRoomAvailabilityModal({
  isOpen,
  onClose,
  roomName = 'Room 3',
  bedName = 'Bed B',
  propertyName = 'CasaMelhor Areca Exotica B1-1103, Parshvanath E...',
  companyName = 'Schlumberger Asia Service Ltd',
  startDate: initialStartDate = new Date(),
  endDate: initialEndDate,
  maxGuests = 2,
  onSave,
  onContinueToGuests,
  existingBookingConflict = false,
  maintenanceConflict = false,
}) {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate || initialStartDate);
  /** @type {[AvailabilityOption, (value: AvailabilityOption) => void]} */
  const [availability, setAvailability] = useState('available');
  const [guestCount, setGuestCount] = useState(1);
  const [privateNote, setPrivateNote] = useState('');

  const nights = endDate ? differenceInDays(endDate, startDate) : 0;
  const hasConflict = existingBookingConflict || maintenanceConflict;

  const handleSave = () => {
    if (availability === 'book_room' && onContinueToGuests) {
      onContinueToGuests({
        startDate,
        endDate,
        guests: guestCount,
      });
    } else if (onSave) {
      onSave({
        availability,
        startDate,
        endDate,
        guests: guestCount,
        note: privateNote,
      });
    }
    onClose();
  };

  /** @type {{ id: AvailabilityOption; label: string }[]} */
  const availabilityOptions = [
    // { id: 'available', label: 'Available' },
    { id: 'blocked_maintenance', label: 'Blocked for Maintenance' },
    // { id: 'unavailable', label: 'Unavailable' },
    { id: 'book_room', label: 'Book Room' },
  ];

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl  shadow-2xl z-50 max-h-[90vh] overflow-hidden" style={{background:'#F2F2F2'}}  >
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
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 ">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {format(startDate, 'd MMM, yyyy')}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">End date</label>
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 ">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {endDate ? format(endDate, 'd MMM, yyyy') : 'Select date'}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{nights} nights</p>
              
              {/* Conflict Warning */}
              {hasConflict && (
                <p className="text-sm text-amber-600 mt-2">
                  {existingBookingConflict 
                    ? `Unable to book the room. ${roomName} is already booked for the chosen date range.`
                    : `Unable to book the room. ${roomName} is marked for maintenance for the chosen date range.`
                  }
                </p>
              )}

              <hr></hr>

                <div className="d-flex items-center gap-2 text-gray-700 mb-2">
                <span className="font-medium">{roomName}</span>
                <span className="text-gray-400">|</span>
                {bedName && (
                  <>
                    <Bed className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500" style={{fontSize:'14px'}}>{bedName}</span>
                  </>
                )}
                <span className="text-gray-400">|</span>
                <span className=" text-gray-500 truncate" style={{fontSize:'14px'}}>{propertyName}</span>
              </div>
              {companyName && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Building2 className="w-4 h-4" />
                  <span>{companyName}</span>
                </div>
              )}
            </div>


            {/* Availability Options */}
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
                    <span className="text-sm text-gray-700">{option.label}</span>
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
                    onClick={() => setGuestCount(Math.min(maxGuests, guestCount + 1))}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {bedName} Sleeps {maxGuests}
                </p>
              </div>
            )}


             {availability === 'blocked_maintenance' && (
              <>
              <div className="mb-6">
                 <p className=" mb-2">Reason</p>
                <Select
                  options={[
                    { value: 'Renovation', label: 'Renovation' },
                    { value: 'Maintenance', label: 'Maintenance' },
                    { value: 'Blocked', label: 'Blocked' }
                  ]}
                  className="basic-multi-select react_selectbox"
                  classNamePrefix="select"
                />
                 </div>
              

               <div className="mb-0">
                 <p className=" mb-2">Maintenance Note</p>
                 <textarea
                   value={setPrivateNote}
                   onChange={(e) => setPrivateNote(e.target.value)}
                   placeholder="Add maintenance details here"
                   className="w-full px-3 py-2 text-sm border border-gray-200 bg-gray-100 resize-none er-transparent"
                   rows={3}
                 />
               </div>
               </>
             )}

            </div>

         

           
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
              {availability === 'book_room' ? 'Continue to Guests' : 'Save'}
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
};