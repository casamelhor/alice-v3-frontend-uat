"use client";
import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import Header from '@/Components/Header/Header';
import { useCalendarStore } from '@/stores/calendarStore';
import { mockBookings } from '@/mocks/data';
import { addDays, startOfMonth, endOfMonth, format } from 'date-fns';
import { Container } from 'react-bootstrap';
import '@/index.css';
import { BookingOverviewModal, RoomOverviewModal, SetRoomAvailabilityModal } from '@/Components/modals';
import { CalendarGrid, CalendarHeader, OccupancyDashboard, StatsRow } from '@/Components/calendar';
import { MaintenanceOverviewModal } from '../modals/MaintenanceModal';
import { CalendorSnapFull, FilterOptionAPI } from '@/services/provider';

const fmt = (d) => format(d, 'yyyy-MM-dd');

/**
 * Main calendar page component. Drives the cascading
 * Company -> Location -> Property filter flow: filter options are re-fetched
 * whenever Company or Locations change (so the next dropdown shows only
 * relevant items), and calendar data is re-fetched on any filter change.
 */
export function CalendarPage() {
  const calendarGridRef = useRef(null);
  const statsRowRef = useRef(null);

  const {
    isBookingModalOpen,
    isRoomAvailabilityModalOpen,
    isRoomOverviewModalOpen,
    isMaintenanceModalOpen,
    selectedBookingId,
    selectedResourceDate,
    selectedRoomOverviewId,
    selectedMaintenanceId,
    closeBookingModal,
    closeRoomAvailabilityModal,
    closeRoomOverviewModal,
    closeMaintenanceModal,
    viewMode,
    selectedDate,
    currentMonth,
    filters,
    setCompanyFilter,
    hydrateUserRoleFromStorage,
  } = useCalendarStore();

  const dateRange = useMemo(() => {
    if (viewMode === 'daily') {
      return { start: addDays(selectedDate, -4), end: addDays(selectedDate, 7) };
    }
    return { start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) };
  }, [currentMonth, viewMode, selectedDate]);

  const [options, setOptions] = useState({});
  const [calendarData, setCalendorData] = useState({});

  const selectedBooking = selectedBookingId
    ? mockBookings.find((b) => b.id === selectedBookingId) || null
    : null;
  const selectedAvailability = selectedResourceDate?.resource?._resource?.id
    ? mockBookings.find((b) => b.roomId === selectedResourceDate.resource._resource.id) || null
    : null;
  const selectedRoomOverview = selectedRoomOverviewId
    ? mockBookings.find((b) => b.roomId === selectedRoomOverviewId) || null
    : null;
  const selectedMaintenance = selectedMaintenanceId
    ? mockBookings.find((b) => b.roomId === selectedMaintenanceId) || null
    : null;

  const handleCheckIn = (bookingId) => {
    console.log('Check in:', bookingId);
    closeBookingModal();
  };
  const handleCheckOut = (bookingId) => {
    console.log('Check out:', bookingId);
    closeBookingModal();
  };
  const handleViewFullDetails = (bookingId) => {
    console.log('View full details:', bookingId);
  };

  // Hydrate role from localStorage once on mount (login writes it there).
  useEffect(() => {
    hydrateUserRoleFromStorage();
  }, [hydrateUserRoleFromStorage]);

  // Fetch filter options, re-running whenever the cascade scope narrows.
  const fetchFilterOptions = useCallback(async () => {
    try {
      const response = await FilterOptionAPI({
        companyId: filters.companyId,
        location: filters.locations,
      });
      if (response?.data?.success) {
        const payload = response.data.response;
        setOptions(payload?.options || payload || {});
        // On initial load (no company yet), adopt the server default.
        if (!filters.companyId && payload?.defaults?.company_id) {
          setCompanyFilter(payload.defaults.company_id);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [filters.companyId, filters.locations, setCompanyFilter]);

  const fetchCalendarData = useCallback(async () => {
    if (!filters.companyId) return;
    try {
      const response = await CalendorSnapFull({
        startDate: fmt(dateRange.start),
        endDate: fmt(dateRange.end),
        companyId: filters.companyId,
        referenceDate: fmt(selectedDate),
        locations: filters.locations,
        propertyIds: filters.propertyIds,
        viewType: viewMode,
      });
      if (response?.data?.success) {
        setCalendorData(response.data.response);
      }
    } catch (error) {
      console.log(error);
    }
  }, [
    dateRange.start,
    dateRange.end,
    filters.companyId,
    filters.locations,
    filters.propertyIds,
    selectedDate,
    viewMode,
  ]);

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  useEffect(() => {
    fetchCalendarData();
  }, [fetchCalendarData]);

  return (
    <>
      <Header />
      <Container>
        <div className="flex flex-col pb-5">
          <CalendarHeader FilterOption={options} />

          <OccupancyDashboard />

          <StatsRow
            ref={statsRowRef}
            dateRange={dateRange}
            viewMode={viewMode}
            calendarScrollRef={calendarGridRef}
          />

          <div className="flex-1 overflow-hidden">
            <CalendarGrid ref={calendarGridRef} />
          </div>

          <BookingOverviewModal
            isOpen={isBookingModalOpen}
            onClose={closeBookingModal}
            booking={selectedBooking}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onViewFullDetails={handleViewFullDetails}
          />

          <RoomOverviewModal
            isOpen={isRoomOverviewModalOpen}
            onClose={closeRoomOverviewModal}
            block={false}
            roomName={selectedRoomOverview?.roomName}
            bedName={selectedRoomOverview?.bedName}
            propertyName={selectedRoomOverview?.propertyName}
            companyName={selectedRoomOverview?.companyName}
          />

          <SetRoomAvailabilityModal
            isOpen={isRoomAvailabilityModalOpen}
            onClose={closeRoomAvailabilityModal}
            roomName={selectedAvailability?.roomName}
            bedName={selectedAvailability?.bedName}
            propertyName={selectedAvailability?.propertyName}
            companyName={selectedAvailability?.companyName}
          />

          <MaintenanceOverviewModal
            isOpen={isMaintenanceModalOpen}
            onClose={closeMaintenanceModal}
            roomName={selectedMaintenance?.roomName}
            bedName={selectedMaintenance?.bedName}
            propertyName={selectedMaintenance?.propertyName}
            companyName={selectedMaintenance?.companyName}
          />
        </div>
      </Container>
    </>
  );
}
