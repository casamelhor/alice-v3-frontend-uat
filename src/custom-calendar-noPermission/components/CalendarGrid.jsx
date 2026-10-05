/**
 * @file Main calendar grid component - orchestrates sidebar and timeline
 */

"use client"

import { useRef, useCallback, forwardRef, useImperativeHandle, useState } from 'react';
import PropTypes from 'prop-types';
import { PropertyTreeSidebar } from './PropertyTreeSidebar';
import { TimelineGrid } from './TimelineGrid';
import { DateHeader } from './DateHeader';
import { StatsRowSidebar, StatsRowTimeline } from './StatsRow';
import { useCalendarLayout } from '../hooks/useCalendarLayout';
import { useResourceTree } from '../hooks/useResourceTree';
import '../styles/calendar.css';

/**
 * Main calendar grid component
 * Orchestrates the sidebar (property tree) and timeline grid with scroll synchronization
 */
export const CalendarGrid = forwardRef(function CalendarGrid({
  properties,
  selectedDate,
  currentMonth,
  viewMode,
  expandedPropertyIds,
  expandedRoomIds,
  onToggleProperty,
  onToggleRoom,
  onBookingClick,
  onBlockClick,
  isLoading,
  calendarData,
  statsRow,
  onCellClick
}, ref) {
  const sidebarScrollRef = useRef(null);
  const timelineScrollRef = useRef(null);
  const dateHeaderScrollRef = useRef(null);
  const [timelineScrollLeft, setTimelineScrollLeft] = useState(0);
  
  // State for stats row expansion
  const [isStatsExpanded, setIsStatsExpanded] = useState(false);

  // Calculate layout dimensions
  const {
    startDate,
    endDate,
    dateColumns,
    dayWidth,
    totalWidth,
    numDays,
  } = useCalendarLayout({ selectedDate, currentMonth, viewMode });

  // Build resource tree
  const {
    resources,
    toggleProperty,
    toggleRoom,
  } = useResourceTree({
    properties,
    expandedPropertyIds,
    expandedRoomIds,
    onToggleProperty,
    onToggleRoom,
  });

  // Synchronize vertical scroll between sidebar and timeline
  const handleSidebarScroll = useCallback((e) => {
    if (timelineScrollRef.current) {
      timelineScrollRef.current.scrollTop = e.target.scrollTop;
    }
  }, []);

  const handleTimelineScroll = useCallback((e) => {
    if (sidebarScrollRef.current) {
      sidebarScrollRef.current.scrollTop = e.target.scrollTop;
    }
    if (dateHeaderScrollRef.current) {
      dateHeaderScrollRef.current.scrollLeft = e.target.scrollLeft;
    }
    setTimelineScrollLeft(e.target.scrollLeft);
  }, []);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    getDateRange: () => ({ startDate, endDate }),
    getViewMode: () => viewMode,
    scrollToDate: (date) => {
      // TODO: Implement scroll to specific date
    },
  }), [startDate, endDate, viewMode]);

  // Extract all bookings and blocks from properties
  const { allBookings, allBlocks } = extractEventsFromProperties(properties);

  // Loading state
  if (isLoading) {
    return (
      <div className="custom-calendar">
        <div className="custom-calendar__loading">
          <div className="custom-calendar__loading-spinner" />
          <span className="text-sm text-gray-500">Loading calendar data...</span>
        </div>
      </div>
    );
  }

  // Empty state
  if (!properties || properties.length === 0) {
    return (
      <div className="custom-calendar">
        <div className="custom-calendar__empty">
          <p className="custom-calendar__empty-text">No properties found.</p>
          <p className="text-sm text-gray-400 mt-1">
            Select a company and location to view the calendar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-calendar">
      <div className="custom-calendar__container">
        {/* Left Sidebar - Property Tree */}
        <div className="custom-calendar__sidebar">
          <div className="custom-calendar__sidebar-header">
            {properties.length} Properties
          </div>
          
          {/* Stats Row Sidebar - labels */}
          <StatsRowSidebar
            isExpanded={isStatsExpanded}
            onToggle={() => setIsStatsExpanded(!isStatsExpanded)}
          />
          
          <div 
            className="custom-calendar__sidebar-content"
            ref={sidebarScrollRef}
            onScroll={handleSidebarScroll}
          >
            <PropertyTreeSidebar
              resources={resources}
              onToggleProperty={toggleProperty}
              onToggleRoom={toggleRoom}
            />
          </div>
        </div>

        {/* Right Timeline */}
        <div className="custom-calendar__timeline">
          {/* Date Header */}
          <div className="custom-calendar__date-header">
            <div 
              className="custom-calendar__date-header-scroll"
              ref={dateHeaderScrollRef}
              style={{ width: totalWidth }}
            >
              <DateHeader
                dateColumns={dateColumns}
                dayWidth={dayWidth}
              />
            </div>
          </div>

          {/* Stats Row Timeline - numerical data */}
          <StatsRowTimeline
            dateColumns={dateColumns}
            calendarData={calendarData}
            dayWidth={dayWidth}
            totalWidth={totalWidth}
            isExpanded={isStatsExpanded}
            statsRow={statsRow}
            scrollLeft={timelineScrollLeft}
          />

          {/* Timeline Content */}
          <div 
            className="custom-calendar__timeline-content"
            ref={timelineScrollRef}
            onScroll={handleTimelineScroll}
          >
            <TimelineGrid
              resources={resources}
              dateColumns={dateColumns}
              dayWidth={dayWidth}
              totalWidth={totalWidth}
              viewStart={startDate}
              allBookings={allBookings}
              allBlocks={allBlocks}
              onBookingClick={onBookingClick}
              onBlockClick={onBlockClick}
              onCellClick={onCellClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

/**
 * Extract all bookings and blocks from properties structure
 * @param {Array} properties - Properties with nested rooms and bookings
 * @returns {{ allBookings: Array, allBlocks: Array }}
 */
function extractEventsFromProperties(properties) {
  const allBookings = [];
  const allBlocks = [];

  if (!properties) return { allBookings, allBlocks };

  properties.forEach(property => {
    const propId = property.property_uid || property.id;
    const rooms = property.rooms || [];

    rooms.forEach(room => {
      const roomId = room.room_uid || room.id;
      const bookings = room.bookings || [];
      const blocks = room.blocks || [];

      // Add bookings with room context
      bookings.forEach(booking => {
        allBookings.push({
          ...booking,
          roomId,
          propertyId: propId,
          roomName: room.room_name || room.name,
          propertyName: property.property_name || property.name,
          defaultCheckInTime: property.checkin_time || property.checkInTime || '12:00',
          defaultCheckOutTime: property.checkout_time || property.checkOutTime || '11:00',
        });
      });

      // Add blocks with room context
      blocks.forEach(block => {
        allBlocks.push({
          ...block,
          roomId,
          propertyId: propId,
        });
      });
    });
  });

  return { allBookings, allBlocks };
}

CalendarGrid.propTypes = {
  properties: PropTypes.array,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  currentMonth: PropTypes.instanceOf(Date).isRequired,
  viewMode: PropTypes.oneOf(['daily', 'monthly']).isRequired,
  expandedPropertyIds: PropTypes.instanceOf(Set).isRequired,
  expandedRoomIds: PropTypes.instanceOf(Set).isRequired,
  onToggleProperty: PropTypes.func.isRequired,
  onToggleRoom: PropTypes.func.isRequired,
  onBookingClick: PropTypes.func,
  onBlockClick: PropTypes.func,
  isLoading: PropTypes.bool,
  calendarData: PropTypes.object,
};

CalendarGrid.defaultProps = {
  properties: [],
  onBookingClick: () => {},
  onBlockClick: () => {},
  isLoading: false,
};
