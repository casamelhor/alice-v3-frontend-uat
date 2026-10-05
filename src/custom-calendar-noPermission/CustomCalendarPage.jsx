/**
 * @file Demo page for the custom calendar
 * This page demonstrates the custom calendar with mock data
 */

"use client"

import { useState, useCallback, useMemo, useEffect } from 'react';
import { format, addMonths, subMonths, addDays, subDays } from 'date-fns';
import {
  CalendarGrid,
  AtAGlanceDashboard,
  BookingOverviewModal,
  RoomOverviewModal,
  SetRoomAvailabilityModal,
  // FiltersModal,
  PropertyFilterDropdown
} from './components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
// import clsx from 'clsx';
import { useCalendarLayout, useCheckRoomAvailability } from './hooks';
import Header from '@/Components/Header/Header';
import { FilterDropdown } from '@/Components/calendar/FilterDropdown';
import { useIsCasaMelhorUser, useCalendarStore } from '@/stores/calendarStore';
// Import mock data - we'll transform it to match the API format
import { Container } from 'react-bootstrap';
import { BlockOverviewAPI, BookingOverviewAPI, CalendorSnapFull, FilterOptionAPI, PermissionsCalAndDash } from '@/services/provider';
import { formatYMD, isNotPastDate } from '@/utils/formatTime';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';

/**
 * Transform mock data to API-like format
 * This simulates what would come from the backend
 */
// function transformMockDataToAPIFormat(dateColumns) {  
//   const properties = mockProperties.slice(0, 5).map(prop => {
//     const rooms = mockRooms[prop.id] || [];

//     // Get daily availability for each date column
//     const daily_availability = dateColumns.map(col => {
//       const avail = getPropertyAvailability(prop.id, col.dateStr);
//       return {
//         date: col.dateStr,
//         available_rooms: avail.availableRooms,
//         available_beds: avail.availableBeds,
//         display_text: `R-${avail.availableRooms}, B-${avail.availableBeds}`,
//       };
//     });

//     // Transform rooms with bookings and blocks
//     const transformedRooms = rooms.map(room => {
//       // Get bookings for this room
//       const roomBookings = mockBookings
//         .filter(b => b.roomId === room.id)
//         .map(b => ({
//           booking_uid: b.id,
//           guest_display_name: b.traveler?.name || 'Guest',
//           check_in_date: b.checkInDate,
//           check_out_date: b.checkOutDate,
//           booking_status: b.status,
//           status_category: b.status,
//           bed_index: b.bedId ? (b.bedId.includes('-a') ? 0 : 1) : null,
//           is_exclusive: b.isExclusiveRoomBooking || false,
//           span_days: b.nights,
//           guest_photo_url: b.traveler?.photo,
//           arrivalTime: b.arrivalTime,
//         }));

//       // Get blocks for this room
//       const roomBlocks = mockMaintenanceBlocks
//         .filter(m => m.roomId === room.id)
//         .map(m => ({
//           block_uid: m.id,
//           block_type: m.blockType,
//           start_date: m.startDate,
//           end_date: m.endDate,
//           bed_index: m.bedId ? (m.bedId.includes('-a') ? 0 : 1) : null,
//           has_reason: !!m.reason,
//           reason: m.reason,
//           span_days: 1,
//         }));

//       // Transform beds
//       const beds = room.beds?.map((bed, index) => ({
//         bed_index: index,
//         bed_name: bed.name,
//         bed_type: bed.bedType || 'Single',
//         current_gender_lock: bed.genderLock,
//       })) || [];

//       return {
//         room_uid: room.id,
//         room_name: room.name,
//         room_type: room.isTwinSharing ? 'Twin-Sharing' : 'Private',
//         room_status: room.status,
//         max_guests: room.isTwinSharing ? 2 : 1,
//         bedroom_preference: null,
//         beds,
//         bookings: roomBookings,
//         blocks: roomBlocks,
//       };
//     });

//     return {
//       property_uid: prop.id,
//       property_name: prop.name,
//       city: prop.city,
//       property_image_url: prop.photo,
//       total_rooms: prop.roomCount,
//       total_beds: prop.bedCount,
//       checkin_time: prop.checkInTime,
//       checkout_time: prop.checkOutTime,
//       assigned_company: null,
//       rooms: transformedRooms,
//       daily_availability,
//     };
//   });  
//   return properties;
// }
function transformMockDataToAPIFormat(propertiesList) {

  const setProperties = propertiesList?.map(prop => {

    const rooms = prop?.rooms || [];

    // Get daily availability for each date column
    const daily_availability = prop?.daily_availability?.map(col => {
      return {
        date: col.date,
        available_rooms: col.available_rooms,
        available_beds: col.available_beds,
        display_text: col.display_text,
      };
    });

    // Transform rooms with bookings and blocks
    const transformedRooms = rooms.map(room => {
      // Get bookings for this room
      const roomBookings = room?.bookings
        // .filter(b => b.roomId === room?.room_uid)
        ?.map(b => ({
          booking_uid: b.booking_uid,
          guest_display_name: b.guest_display_name || 'Guest',
          check_in_date: b.check_in_date,
          check_out_date: b.check_out_date,
          booking_status: b.booking_status,
          status_category: b.booking_status,
          // bed_index: b.bed_index ? (String(b.bed_index).includes('-a') ? 0 : 1) : null,
          bed_index: b.bed_index,
          is_exclusive: b.is_exclusive || false,
          span_days: b.span_days,
          guest_photo_url: b.guest_photo_url,
          arrivalTime: b.arrivalTime || '13:00',
        }));

      // Get blocks for this room
      const roomBlocks = room?.blocks
        // .filter(m => m.roomId === room.id)
        ?.map(m => ({
          block_uid: m.block_uid,
          block_type: m.block_type,
          start_date: m.start_date,
          end_date: m.end_date,
          // bed_index: m.bed_index ? (String(m.bed_index).includes('-a') ? 0 : 1) : null,
          // bed_index:m.bed_index,
          has_reason: !!m.has_reason,
          reason: m.has_reason,
          span_days: m.span_days,
        }));

      // Transform beds
      const beds = room.beds?.map((bed, index) => ({
        bed_index: bed.bed_index,
        bed_name: bed.bed_name,
        bed_type: bed.bed_type || 'Single',
        current_gender_lock: bed.current_gender_lock,
      })) || [];

      return {
        room_uid: room.room_uid,
        room_name: room.room_name,
        room_type: room.room_type,
        room_status: room.room_status,
        max_guests: room.max_guests ? 2 : 1,
        bedroom_preference: room.bedroom_preference,
        beds: room.beds,
        available_beds: room?.available_beds,
        bookings: roomBookings,
        blocks: roomBlocks,
      };
    });

    return {
      property_uid: prop?.property_uid,
      property_name: prop?.property_name,
      city: prop?.city,
      property_image_url: prop?.property_image_url,
      total_rooms: prop?.total_rooms,
      total_beds: prop?.total_beds,
      checkin_time: prop?.checkin_time,
      checkout_time: prop?.checkout_time,
      assigned_company: prop?.assigned_company?.company_name,
      company_id: prop?.assigned_company?.company_id,
      rooms: transformedRooms,
      daily_availability,
    };

  })

  return setProperties;
}

/**
 * Custom Calendar Demo Page
 */
export function CustomCalendarPage() {
  // State
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState('');
  const [expandedPropertyIds, setExpandedPropertyIds] = useState(new Set(['prop-1', 'prop-3']));
  const [expandedRoomIds, setExpandedRoomIds] = useState(new Set(['room-1-3']));
  const [isLoading] = useState(false);
  const [isAtAGlanceMinimized, setIsAtAGlanceMinimized] = useState(false);

  // Modal states
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [availabilityModalData, setAvailabilityModalData] = useState(null);
  // const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  //state defines
  const [options, setOptions] = useState({});
  const [calendarData, setCalendorData] = useState({});

  const searchParams = useSearchParams();
  const paramCompanyUid = searchParams.get("company_uid");


  // Filter states
  const [filters, setFilters] = useState({
    properties: [],
    companies: '',
    location: '',
    // roomTypes: '',
    // roomStatuses: [],
    // bookingStatuses: []
  });
  const [permissionData, setPermissionData] = useState({});

  const hydrateUserRoleFromStorage = useCalendarStore((s) => s.hydrateUserRoleFromStorage);
  const isCasaMelhor = useIsCasaMelhorUser();
  useEffect(() => {
    hydrateUserRoleFromStorage();
  }, [hydrateUserRoleFromStorage]);

  const { startDate, endDate } = useCalendarLayout({ selectedDate, currentMonth, viewMode });

  // API hook for availability checking
  const { checkAvailability } = useCheckRoomAvailability();

  // Generate date columns for mock data transformation
  const dateColumnsForMock = useMemo(() => {
    const cols = [];
    const start = viewMode === 'daily'
      ? addDays(selectedDate, -4)
      : new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const end = viewMode === 'daily'
      ? addDays(selectedDate, 6)
      : new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    let current = start;
    while (current <= end) {
      cols.push({ dateStr: format(current, 'yyyy-MM-dd') });
      current = addDays(current, 1);
    }
    return cols;
  }, [selectedDate, currentMonth, viewMode]);

  // Transform mock data to API format
  // const properties = useMemo(() => {
  //   return transformMockDataToAPIFormat(dateColumnsForMock);
  // }, [dateColumnsForMock]);

  const properties = useMemo(() => {
    return transformMockDataToAPIFormat(calendarData?.properties);
  }, [calendarData]);

  // Extract available locations from properties
  const availableLocations = useMemo(() => {
    const locations = properties
      ?.map(p => p.city)
      .filter((city, index, self) => city && self.indexOf(city) === index)
      .sort();
    return locations;
  }, [properties]);

  // Mock "At a Glance" data for the selected date
  const atAGlanceData = useMemo(() => {
    // In real app, this would come from API based on selectedDate
    if (calendarData) {
      return {
        total_bookings: calendarData?.at_a_glance?.total_bookings,
        reference_date: calendarData?.at_a_glance?.reference_date,
        status_breakdown: {
          current: calendarData?.at_a_glance?.status_breakdown?.current,
          checkin_pending: calendarData?.at_a_glance?.status_breakdown?.check_in_pending,
          checkout_pending: calendarData?.at_a_glance?.status_breakdown?.checkout_pending,
          // checkout_upcoming: 0,
          upcoming: calendarData?.at_a_glance?.status_breakdown?.upcoming,
          no_show: calendarData?.at_a_glance?.status_breakdown?.no_show
        },
        status_progress: {
          current_percent: calendarData?.at_a_glance?.status_progress?.current_percent,
          check_in_pending_percent: calendarData?.at_a_glance?.status_progress?.check_in_pending_percent,
          checkout_pending_percent: calendarData?.at_a_glance?.status_progress?.checkout_pending_percent,
          upcoming_percent: calendarData?.at_a_glance?.status_progress?.upcoming_percent,
          no_show_percent: calendarData?.at_a_glance?.status_progress?.no_show_percent
        }
      };
    }
  }, [selectedDate, calendarData]);

  // Handlers
  const handleToggleProperty = useCallback((propertyId) => {
    setExpandedPropertyIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId);
      } else {
        newSet.add(propertyId);
      }
      return newSet;
    });
  }, []);

  const handleToggleRoom = useCallback((roomId) => {
    setExpandedRoomIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(roomId)) {
        newSet.delete(roomId);
      } else {
        newSet.add(roomId);
      }
      return newSet;
    });
  }, []);

  const handleBookingClick = useCallback((booking) => {
    // setSelectedBooking(booking);
    // debugger
    getBookingOverviewData(booking?.booking_uid)
  }, []);

  const handleBlockClick = useCallback((block) => {
    // setSelectedBlock(block);
    getBlockOverviewData(block?.block_uid)
  }, []);

  const handleAvailableCellClick = useCallback((room, date) => {
    setAvailabilityModalData({
      room,
      startDate: date,
      endDate: addDays(date, 1)
    });
  }, []);

  const handleSaveAvailability = useCallback(async (data) => {
    console.log('Saving availability:', data);
    // In real app, this would call the API
    // For now, just close the modal
    setAvailabilityModalData(null);
  }, []);

  // Cascade-reset setters: narrowing the scope at one level clears dependent
  // selections so we never show/send stale IDs.
  const handleCompanyChange = useCallback((companyId) => {
    setFilters((prev) => ({
      ...prev,
      companies: companyId ?? null,
      location: [],
      properties: [],
    }));
  }, []);

  const handleLocationChange = useCallback((nextLocations) => {
    setFilters((prev) => ({
      ...prev,
      location: Array.isArray(nextLocations) ? nextLocations : [],
      properties: [],
    }));
  }, []);

  const handlePropertiesChange = useCallback((nextProperties) => {
    setFilters((prev) => ({
      ...prev,
      properties: Array.isArray(nextProperties) ? nextProperties : [],
    }));
  }, []);

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth(prev => subMonths(prev, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth(prev => addMonths(prev, 1));
  }, []);

  const handleToday = useCallback(() => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(today);
  }, []);

  const handlePrevDay = useCallback(() => {
    setSelectedDate(prev => subDays(prev, 1));
  }, []);

  const handleNextDay = useCallback(() => {
    setSelectedDate(prev => addDays(prev, 1));
  }, []);
  //<--------------------------------------------------------------------------------------------------------------->
  const DynamicPermission = async () => {
    try {
      const res = await PermissionsCalAndDash();
      if (res?.data?.success) {
        setPermissionData(res.data.response)
      }
    } catch (error) {
      console.log(error);
    }
  }
  const getFilterOptionData = async () => {
    try {
      const response = await FilterOptionAPI({
        companyId: filters.companies,
        location: filters.location,
      })
      if (response?.data?.success) {
        setOptions(response?.data?.response);
        if (!viewMode) {
          setViewMode(response?.data?.response?.defaults?.view_type || 'daily');
        }
        if (!filters.companies && response?.data?.response?.defaults?.company_id) {
          setFilters((prev) => ({
            ...prev,
            companies: response.data.response.defaults.company_id,
          }));
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  const getFullCalendorData = async () => {
    try {
      const response = await CalendorSnapFull({
        startDate: formatYMD(startDate),
        endDate: formatYMD(endDate),
        companyId: filters.companies,
        referenceDate: formatYMD(selectedDate),
        locations: filters.location ? (Array.isArray(filters.location) ? filters.location : [filters.location]) : [],
        propertyIds: filters.properties || [],
        viewType: viewMode,
      });
      if (response?.data?.success) {
        setCalendorData(response?.data?.response)
      }
    } catch (error) {
      console.log(error);
    }
  }
  // Re-fetch filter options whenever the cascade scope narrows.
  useEffect(() => {
    getFilterOptionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.companies, filters.location])

  // Re-fetch calendar data on any filter change, view switch, or date change.
  useEffect(() => {
    if (viewMode && filters.companies) {
      getFullCalendorData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, filters.companies, filters.location, filters.properties, selectedDate, currentMonth])
  useEffect(()=>{
    DynamicPermission();
  },[])

  const getBookingOverviewData = async (b_uid) => {
    try {
      const response = await BookingOverviewAPI(b_uid);
      if (response?.data?.success) {
        setSelectedBooking(response.data.response)
      }
    } catch (error) {
      console.log(error);
    }
  }
  const getBlockOverviewData = async (b_uid) => {
    try {
      const response = await BlockOverviewAPI(b_uid);
      if (response?.data?.success) {
        setSelectedBlock(response.data.response)
      }
    } catch (error) {
      console.log(error);
    }
  }
  console.log(filters, properties)

  return (

    <>
      <Header />
      {/* <ToastContainer /> */}
      <Toaster position="top-right" />
      <Container >
        <div className="h-screen flex flex-col mb-5">
          {/* Header */}
          <header className="flex items-center justify-between  py-3  border-b border-[#E5E2DC]">
            <div className="flex items-center gap-4">
              {/* Month/Year Selector */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h3 className="page-title font-semibold text-gray-900 min-w-[180px] text-center">
                  {format(currentMonth, 'MMMM yyyy')}
                </h3>
                <button
                  onClick={handleNextMonth}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Today Button */}
              <button
                onClick={handleToday}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Today
              </button>
            </div>

            {/* Filters Section — cascade: Company -> Location -> Property */}
            <div className="flex items-center gap-3 flex-wrap">
              {isCasaMelhor && (
                <FilterDropdown
                  label="Company"
                  items={options?.options?.companies || []}
                  selectedIds={filters.companies}
                  onChange={handleCompanyChange}
                  multiple={false}
                  getId={(c) => c.id}
                  getLabel={(c) => c.name}
                  allLabel="Select Company"
                  emptyLabel="No companies"
                  minWidth={200}
                />
              )}

              <FilterDropdown
                label="Location"
                items={options?.options?.locations || []}
                selectedIds={filters.location}
                onChange={handleLocationChange}
                multiple
                getId={(l) => l.city}
                getLabel={(l) => l.city}
                allLabel="All Locations"
                emptyLabel="No locations"
                disabled={!filters.companies}
                disabledReason="Select a company first"
                minWidth={180}
              />

              <PropertyFilterDropdown
                selectedProperties={filters.properties}
                availableProperties={options?.options?.properties || []}
                onPropertiesChange={handlePropertiesChange}
              />
            </div>
          </header>

          {/* At a Glance Dashboard */}
          <AtAGlanceDashboard
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            atAGlanceData={atAGlanceData}
            isMinimized={isAtAGlanceMinimized}
            onToggleMinimize={() => setIsAtAGlanceMinimized(!isAtAGlanceMinimized)}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            style={{ backgroundColor: '#F2F2F2' }}
          />

          {/* Calendar Grid */}
          <div className="flex-1  overflow-hidden">
            <CalendarGrid
              properties={properties}
              selectedDate={selectedDate}
              currentMonth={currentMonth}
              viewMode={viewMode}
              expandedPropertyIds={expandedPropertyIds}
              expandedRoomIds={expandedRoomIds}
              onToggleProperty={handleToggleProperty}
              onToggleRoom={handleToggleRoom}
              onBookingClick={handleBookingClick}
              onBlockClick={handleBlockClick}
              isLoading={isLoading}
              calendarData={{ properties }}
              statsRow={calendarData?.stats_summary}
              style={{ backgroundColor: '#F2F2F2' }}
              onCellClick={(resource, dateStr) => {
                const isNotPast = isNotPastDate(dateStr)
                if (isNotPast && resource?.data?.room_type !== "Twin-Sharing" && resource.type !== "property") {
                  setAvailabilityModalData({
                    room: resource,
                    startDate: new Date(dateStr),
                    endDate: new Date(dateStr)
                  });
                }
              }}
            />
          </div>

          {/* Modals */}
          <BookingOverviewModal
            booking={selectedBooking}
            isOpen={!!selectedBooking}
            onClose={() => setSelectedBooking(null)}
          />

          <RoomOverviewModal
            block={selectedBlock}
            isOpen={!!selectedBlock}
            onClose={() => setSelectedBlock(null)}
            onMakeAvailable={(block) => {
              setSelectedBlock(null);
              setAvailabilityModalData({
                room: {
                  room_uid: block?.room?.room_uid,
                  room_name: block?.room?.room_name,
                  bed_name: block?.room?.bed_name,
                  property_name: block?.property?.property_name
                },
                startDate: new Date(block?.block_details?.start_date),
                endDate: new Date(block?.block_details?.end_date)
              });
            }}
          />

          <SetRoomAvailabilityModal
            room={availabilityModalData?.room}
            initialStartDate={availabilityModalData?.startDate}
            initialEndDate={availabilityModalData?.endDate}
            isOpen={!!availabilityModalData}
            onClose={() => setAvailabilityModalData(null)}
            propertyName={availabilityModalData?.room?.data?.propertyItem?.property_name}
            companyName={availabilityModalData?.room?.data?.propertyItem?.assigned_company}
            onSave={handleSaveAvailability}
            onCheckAvailability={checkAvailability}
            getFullCalendorData={getFullCalendorData}
            filters={filters}
          />
        </div>
      </Container>

    </>
  );
}

export default CustomCalendarPage;