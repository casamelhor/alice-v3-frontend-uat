"use client";
import { useMemo, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import FullCalendar from '@fullcalendar/react';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin from '@fullcalendar/interaction';
import { useCalendarStore } from '@/stores/calendarStore';
import {
  mockProperties,
  mockRooms,
  mockBookings,
  mockMaintenanceBlocks,
  getPropertyAvailability,
} from '@/mocks/data';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { STATUS_COLORS } from '@/types';
import { truncateText } from '@/utils/formatters';
import { ChevronRight, ChevronDown } from 'lucide-react';

/**
 * Calendar grid component using FullCalendar resource timeline
 * @param {object} props - Component props
 * @param {React.Ref} ref - Forwarded ref for exposing calendar data
 * @returns {JSX.Element}
 */
export const CalendarGrid = forwardRef(function CalendarGrid(props, ref) {
  const calendarRef = useRef(null);
  const wrapperRef = useRef(null);

  const {
    currentMonth,
    viewMode,
    selectedDate,
    openBookingModal,
    openRoomAvailabilityModal,
    openRoomOverviewModal,
    openMaintenanceModal,
    expandedPropertyIds,
    expandedRoomIds,
    togglePropertyExpanded,
    toggleRoomExpanded,
  } = useCalendarStore();

  // Date range for the view
  const dateRange = useMemo(() => {
    if (viewMode === 'daily') {
      // Show 11 days centered around selected date
      const start = addDays(selectedDate, -4);
      const end = addDays(selectedDate, 7);
      return { start, end };
    } else {
      // Show full month
      return {
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
      };
    }
  }, [currentMonth, viewMode, selectedDate]);

  // Expose calendar data and methods to parent via ref
  useImperativeHandle(ref, () => ({
    getDateRange: () => dateRange,
    getViewMode: () => viewMode,
    getWrapperElement: () => wrapperRef.current,
  }), [dateRange, viewMode]);

  // Pre-calculate property availability for all visible dates
  const propertyAvailability = useMemo(() => {
    const availability = {};
    const dates = eachDayOfInterval({ start: dateRange.start, end: dateRange.end });

    mockProperties.forEach(property => {
      availability[property.id] = {};
      dates.forEach(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        availability[property.id][dateStr] = getPropertyAvailability(property.id, dateStr);
      });
    });

    return availability;
  }, [dateRange]);

  // Build resources from mock data - always include all levels for events to display
  const resources = useMemo(() => {
    /** @type {import('@/types').CalendarResource[]} */
    const result = [];

    // NOTE: Stats rows temporarily disabled due to FullCalendar rendering issues
    // TODO: Re-enable stats rows with proper custom cell rendering approach
    // The stats functionality (Total/Available/Booked/Blocked) would need 
    // a different approach like using FullCalendar's resourceRender or 
    // custom slots implementation

    mockProperties.forEach((property) => {
      const isPropertyExpanded = expandedPropertyIds.has(property.id);

      // Add property
      result.push({
        id: property.id,
        title: property.name,
        extendedProps: {
          type: 'property',
          photo: property.photo,
          roomCount: property.roomCount,
          bedCount: property.bedCount,
        },
      });

      // Always add rooms for resource mapping (but hide if not expanded visually)
      const rooms = mockRooms[property.id] || [];
      rooms.forEach((room) => {
        const isRoomExpanded = expandedRoomIds.has(room.id);

        result.push({
          id: room.id,
          title: room.name,
          parentId: property.id,
          extendedProps: {
            type: 'room',
            roomType: room.roomType,
            propertyId: property.id,
            isTwinSharing: room.isTwinSharing,
            status: room.status,
            isHidden: !isPropertyExpanded,
          },
        });

        // Add beds for twin-sharing rooms
        if (room.isTwinSharing) {
          room.beds.forEach((bed) => {
            result.push({
              id: bed.id,
              title: bed.name,
              parentId: room.id,
              extendedProps: {
                type: 'bed',
                propertyId: property.id,
                roomId: room.id,
                status: bed.status,
                isHidden: !isPropertyExpanded || !isRoomExpanded,
              },
            });
          });
        }
      });
    });

    return result;
  }, [expandedPropertyIds, expandedRoomIds]);

  // Build events from bookings and maintenance blocks
  const events = useMemo(() => {
    /** @type {import('@/types').CalendarEvent[]} */
    const result = [];

    // Add bookings - assign to bed level if specified, otherwise room level
    mockBookings.forEach((booking) => {
      const statusColors = STATUS_COLORS[booking.status];
      const room = Object.values(mockRooms).flat().find(r => r.id === booking.roomId);
      const isTwinSharingRoom = room?.isTwinSharing && room?.beds?.length > 0;

      // Check if this is an exclusive room booking (whole twin-sharing room booked)
      const isExclusive = booking.isExclusiveRoomBooking && isTwinSharingRoom && !booking.bedId;

      if (isExclusive && room.beds.length >= 2) {
        // For exclusive bookings, create event on FIRST bed with special styling
        const firstBedId = room.beds[0].id;
        const secondBedId = room.beds[1].id;

        // Primary event on first bed (spans both visually)
        result.push({
          id: booking.id,
          resourceId: firstBedId,
          title: booking.traveler.name,
          start: booking.checkInDate,
          end: booking.checkOutDate,
          backgroundColor: statusColors.bg,
          borderColor: statusColors.border,
          textColor: statusColors.text,
          classNames: ['exclusive-booking-primary'],
          extendedProps: {
            booking,
            type: 'booking',
            isExclusive: true,
            isPrimary: true,
          },
        });

        // Secondary event on second bed (for visual continuation)
        result.push({
          id: `${booking.id}-continuation`,
          resourceId: secondBedId,
          title: booking.traveler.name,
          start: booking.checkInDate,
          end: booking.checkOutDate,
          backgroundColor: statusColors.bg,
          borderColor: statusColors.border,
          textColor: statusColors.text,
          classNames: ['exclusive-booking-secondary'],
          extendedProps: {
            booking,
            type: 'booking',
            isExclusive: true,
            isPrimary: false,
            parentEventId: booking.id,
          },
        });
      } else {
        // Normal booking - use bedId if specified, otherwise roomId
        const resourceId = booking.bedId || booking.roomId;

        result.push({
          id: booking.id,
          resourceId,
          title: booking.traveler.name,
          start: booking.checkInDate,
          end: booking.checkOutDate,
          backgroundColor: statusColors.bg,
          borderColor: statusColors.border,
          textColor: statusColors.text,
          extendedProps: {
            booking,
            type: 'booking',
          },
        });
      }
    });

    // Add maintenance blocks
    mockMaintenanceBlocks.forEach((block) => {
      // Use bedId if specified, otherwise roomId
      const resourceId = block.bedId || block.roomId || block.propertyId || '';

      result.push({
        id: block.id,
        resourceId,
        title: 'Maintenance',
        start: block.startDate,
        end: block.endDate,
        backgroundColor: 'rgba(107, 114, 128, 0.1)',
        borderColor: '#6B7280',
        textColor: '#374151',
        extendedProps: {
          maintenanceBlock: block,
          type: 'maintenance',
        },
      });
    });

    return result;
  }, []);

  // Handle event click
  const handleEventClick = useCallback((info) => {
    if (info.event.extendedProps.type === 'booking') {
      openBookingModal(info.event.id);
    }
  }, [openBookingModal]);

  // Handle date cell click
  const handleDateClick = useCallback((info) => {
    openRoomAvailabilityModal(info);
  }, [openRoomAvailabilityModal]);

  const handleRoomNameClick = useCallback((roomResource) => {
    if (roomResource._resource.extendedProps.type == "room") {
      openRoomOverviewModal(roomResource._resource.id)
    }
  }, [openRoomOverviewModal]);

  const handleMaintenanceClick = useCallback((Val) => {
    if (Val.type == "maintenance") {
      openMaintenanceModal(Val.maintenanceBlock.roomId)
    }
  }, [openMaintenanceModal]);

  // Custom resource content renderer (left sidebar)
  const resourceContent = useCallback((arg) => {
    const resource = arg.resource;
    const type = resource.extendedProps?.type;

    // Property row
    if (type === 'property') {
      const isExpanded = expandedPropertyIds.has(resource.id);
      const rooms = mockRooms[resource.id] || [];
      const hasRooms = rooms.length > 0;

      return (
        <div
          className="flex items-center gap-2 py-2 px-2 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => hasRooms && togglePropertyExpanded(resource.id)}
        >
          {hasRooms ? (
            isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
            )
          ) : (
            <div className="w-4" />
          )}
          {resource.extendedProps?.photo && (
            <img
              src={resource.extendedProps.photo}
              alt={resource.title}
              className="w-10 h-10  object-cover flex-shrink-0"
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 truncate">
              {truncateText(resource.title, 20)}
            </div>
            <div className="text-xs text-gray-500">
              {resource.extendedProps?.roomCount} Rooms
              {resource.extendedProps?.bedCount ? `, ${resource.extendedProps.bedCount} Beds` : ''}
            </div>
          </div>
        </div>
      );
    }

    // Room row
    if (type === 'room') {
      const isTwinSharing = resource.extendedProps?.isTwinSharing;
      const isExpanded = expandedRoomIds.has(resource.id);

      return (
        <div
          className={`flex items-center gap-2 py-2 pl-8 pr-2 ${isTwinSharing ? 'cursor-pointer hover:bg-gray-50' : ''} transition-colors`}
          onClick={() => isTwinSharing && toggleRoomExpanded(resource.id)}
        >
          {isTwinSharing ? (
            isExpanded ? (
              <ChevronDown className="w-3 h-3 text-gray-400 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
            )
          ) : (
            <div className="w-3" />
          )}
          <div className="min-w-0"
            onClick={(e) => {
              e.stopPropagation();
              handleRoomNameClick(resource);
            }}
          >
            <div className="text-sm text-gray-800">{resource.title}</div>
            <div className="text-xs text-gray-500">{resource.extendedProps?.roomType}</div>
          </div>
        </div>
      );
    }

    // Bed row
    if (type === 'bed') {
      return (
        <div className="flex items-center gap-2 py-2 pl-14 pr-2">
          <span className="text-sm">🛏️</span>
          <span className="text-sm text-gray-700">{resource.title}</span>
        </div>
      );
    }

    return <span>{resource.title}</span>;
  }, [expandedPropertyIds, expandedRoomIds, togglePropertyExpanded, toggleRoomExpanded]);

  // Generate display events for stats rows and property availability
  const displayEvents = useMemo(() => {
    /** @type {any[]} */
    const dispEvents = [];
    const dates = eachDayOfInterval({ start: dateRange.start, end: dateRange.end });

    dates.forEach(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const nextDateStr = format(addDays(date, 1), 'yyyy-MM-dd');

      // Property availability
      mockProperties.forEach(property => {
        const availability = propertyAvailability[property.id]?.[dateStr];
        if (availability) {
          dispEvents.push({
            id: `avail-${property.id}-${dateStr}`,
            resourceId: property.id,
            start: dateStr,
            end: nextDateStr,
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            classNames: ['availability-cell'],
            extendedProps: {
              type: 'availability-display',
              availableRooms: availability.availableRooms,
              availableBeds: availability.availableBeds,
            },
          });
        }
      });
    });

    return dispEvents;
  }, [dateRange, propertyAvailability]);

  // Custom event content renderer
  const eventContent = useCallback((arg) => {
    const { event } = arg;

    // Handle stat display background events
    if (event.extendedProps.type === 'stat-display') {
      return (
        <div className="flex items-center justify-center h-full w-full text-sm text-gray-600 font-medium">
          {event.extendedProps.value}
        </div>
      );
    }

    // Handle availability display background events
    if (event.extendedProps.type === 'availability-display') {
      const { availableRooms, availableBeds } = event.extendedProps;
      const isZero = availableRooms === 0 && availableBeds === 0;
      return (
        <div className={`flex items-center justify-center h-full w-full text-xs ${isZero ? 'text-red-500' : 'text-gray-500'}`}>
          R-{availableRooms}, B-{availableBeds}
        </div>
      );
    }

    if (event.extendedProps.type === 'maintenance') {
      return (
        <div className="flex items-center gap-1 px-2 py-1 h-full border-dashed border-2 border-gray-400 rounded bg-gray-50"
          onClick={() => handleMaintenanceClick(event.extendedProps)}
        >
          <span className="text-xs">🔧</span>
          <span className="text-xs text-gray-600 truncate">Maintenance</span>
        </div>
      );
    }

    const booking = event.extendedProps.booking;
    if (!booking) return <span>{event.title}</span>;

    const isNoShow = booking.status === 'NO_SHOW_MANUAL' || booking.status === 'NO_SHOW_AUTO';
    const isCheckedOut = booking.status === 'CHECKED_OUT';
    const isExclusive = event.extendedProps.isExclusive;
    const isPrimary = event.extendedProps.isPrimary;

    // For exclusive booking secondary event (continuation), show a minimal connected view
    if (isExclusive && !isPrimary) {
      return (
        <div className="flex items-center gap-2 px-2 py-1 h-full overflow-hidden opacity-80">
          <div className="text-[10px] text-gray-500 italic truncate">
            (Same booking - {booking.traveler.name})
          </div>
        </div>
      );
    }

    return (
      <div className={`flex items-center gap-2 px-1 py-1 h-full overflow-hidden ${isCheckedOut ? 'opacity-60' : ''}`}>
        <img
          src={booking.traveler.photo}
          alt={booking.traveler.name}
          className="w-8 h-8 object-cover flex-shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className={`text-xs font-medium truncate ${isNoShow ? 'line-through' : ''}`}>
            {booking.traveler.name}
            {isExclusive && <span className="ml-1 text-[9px] bg-amber-100 text-amber-700 px-1 rounded">Exclusive</span>}
          </div>
          <div className="text-[10px] opacity-75 truncate">
            {format(new Date(booking.checkInDate), 'd MMM')} - {format(new Date(booking.checkOutDate), 'd MMM')}
          </div>
        </div>
      </div>
    );
  }, []);

  return (
    <div ref={wrapperRef} className="h-full overflow-hidden calendar-wrapper">
      <style>{`
        .calendar-wrapper .fc {
          height: 100%;
        }
        .calendar-wrapper .fc-view-harness {
          height: 100% !important;
        }
        .calendar-wrapper .fc-scroller {
          overflow: auto !important;
        }
        .calendar-wrapper .fc-timeline-slot {
          min-width: ${viewMode === 'daily' ? '80px' : '40px'};
        }
        .calendar-wrapper .fc-datagrid-cell-frame {
          min-height: 50px;
        }
        .calendar-wrapper .fc-event {
          border-radius: 6px;
          border-width: 2px;
          cursor: pointer;
          transition: box-shadow 0.15s ease;
        }
        .calendar-wrapper .fc-event:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        .calendar-wrapper .fc-timeline-event {
          margin: 2px 0;
        }
        .calendar-wrapper .fc-day-today {
          background-color: rgba(139, 115, 85, 0.08) !important;
        }
        .calendar-wrapper .fc-col-header-cell {
          background-color: var(--color-alice-cream);
          padding: 8px 4px;
        }
        .calendar-wrapper .fc-resource-group {
          background-color: var(--color-alice-beige);
        }
        .calendar-wrapper .fc-datagrid-cell {
          border-color: var(--color-alice-sand);
        }
        .calendar-wrapper .fc-timeline-slot {
          border-color: var(--color-alice-sand);
        }
        /* Stats rows styling */
        .calendar-wrapper [data-resource-id="stats-header"] .fc-timeline-lane-frame,
        .calendar-wrapper [data-resource-id="stats-available"] .fc-timeline-lane-frame,
        .calendar-wrapper [data-resource-id="stats-booked"] .fc-timeline-lane-frame,
        .calendar-wrapper [data-resource-id="stats-blocked"] .fc-timeline-lane-frame {
          background-color: rgba(249, 250, 251, 0.8);
        }
        /* Property rows - show availability cells */
        .calendar-wrapper .fc-timeline-lane[data-resource-type="property"] {
          background-color: rgba(249, 250, 251, 0.5);
        }
        /* Exclusive booking spanning - primary event */
        .calendar-wrapper .fc-event.exclusive-booking-primary {
          height: calc(200% + 4px) !important;
          z-index: 10;
          position: relative;
        }
        /* Exclusive booking spanning - secondary event (continuation) */
        .calendar-wrapper .fc-event.exclusive-booking-secondary {
          border-style: dashed;
          border-top-width: 0;
          border-top-left-radius: 0;
          border-top-right-radius: 0;
          opacity: 0.7;
        }
        /* No-show booking strikethrough styling */
        .calendar-wrapper .fc-event.no-show-booking {
          opacity: 0.7;
        }
        /* Stat cell styling */
        .calendar-wrapper .fc-event.stat-cell,
        .calendar-wrapper .fc-event.availability-cell {
          cursor: default;
          box-shadow: none !important;
          border: none !important;
          background: transparent !important;
          border-radius: 0;
          margin: 0;
          padding: 0;
        }
        .calendar-wrapper .fc-event.stat-cell:hover,
        .calendar-wrapper .fc-event.availability-cell:hover {
          box-shadow: none !important;
        }
        .calendar-wrapper .fc-event.stat-cell .fc-event-main,
        .calendar-wrapper .fc-event.availability-cell .fc-event-main {
          padding: 0;
        }

        .fc .fc-timeline-lane-frame{
          display: flex;
          align-items: center;
        }

      `}</style>

      <FullCalendar
        ref={calendarRef}
        plugins={[resourceTimelinePlugin, interactionPlugin]}
        initialView="resourceTimeline"
        headerToolbar={false}
        initialDate={selectedDate}
        resources={resources}
        events={[...events, ...displayEvents]}
        resourceAreaWidth="280px"
        resourceAreaHeaderContent={`${mockProperties.length} Properties`}
        slotDuration={{ days: 1 }}
        slotLabelFormat={{
          weekday: 'short',
          day: 'numeric',
        }}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        resourceLabelContent={resourceContent}
        eventContent={eventContent}
        height="100%"
        scrollTime="00:00:00"
        nowIndicator={true}
        visibleRange={dateRange}
        schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
      />
    </div>
  );
});
