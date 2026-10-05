import React from 'react';
import PropTypes from 'prop-types';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

/**
 * Calculate daily stats for all dates
 * Shared logic used by both sidebar and timeline components
 */
export function calculateDailyStats(dateColumns, calendarData) {
  return dateColumns.map(dateColumn => {
    const dateStr = dateColumn.dateStr;
    const date = dateColumn.date;
    const dayData = calendarData?.daily_availability?.[dateStr];
    
    if (dayData) {
      return {
        date: dateStr,
        total_rooms: dayData.total_rooms || 0,
        available_rooms: dayData.available_rooms || 0,
        booked_rooms: dayData.booked_rooms || 0,
        blocked_rooms: dayData.blocked_rooms || 0
      };
    }
    
    // Fallback calculation from nested properties data when the API does not
    // provide a precomputed daily/monthly stats array.
    let total = 0;
    let available = 0;
    let booked = 0;
    let blocked = 0;
    
    calendarData?.properties?.forEach(property => {
      property.rooms?.forEach(room => {
        total++;

        const roomBookings = room.bookings || [];
        const roomBlocks = room.blocks || [];
        
        const hasBooking = roomBookings.some(booking => {
          const checkIn = new Date(booking.check_in_date);
          const checkOut = new Date(booking.check_out_date);
          return date >= checkIn && date < checkOut;
        });
        
        const hasBlock = roomBlocks.some(block => {
          const startDate = new Date(block.start_date);
          const endDate = new Date(block.end_date);
          return date >= startDate && date <= endDate;
        });
        
        if (hasBooking) {
          booked++;
        } else if (hasBlock) {
          blocked++;
        } else {
          available++;
        }
      });
    });
    
    return {
      date: dateStr,
      total_rooms: total,
      available_rooms: available,
      booked_rooms: booked,
      blocked_rooms: blocked,
    };
  });
}

function normalizeStatEntry(stat, fallbackDate) {
  if (!stat) {
    return {
      date: fallbackDate,
      total_rooms: 0,
      available_rooms: 0,
      booked_rooms: 0,
      blocked_rooms: 0,
    };
  }

  return {
    date: stat.date || stat.dateStr || fallbackDate,
    total_rooms: stat.total_rooms ?? stat.total ?? stat.totalRooms ?? 0,
    available_rooms: stat.available_rooms ?? stat.available ?? stat.availableRooms ?? 0,
    booked_rooms: stat.booked_rooms ?? stat.booked ?? stat.bookedRooms ?? 0,
    blocked_rooms: stat.blocked_rooms ?? stat.blocked ?? stat.blockedRooms ?? 0,
  };
}

function getStatsRowEntries(statsRow) {
  if (Array.isArray(statsRow)) {
    return statsRow;
  }

  return (
    statsRow?.daily_stats ||
    statsRow?.monthly_stats ||
    statsRow?.stats ||
    statsRow?.data ||
    []
  );
}

/**
 * StatsRowSidebar Component
 * 
 * Renders the labels for stats in the sidebar (left side):
 * - "Stats (Total Rooms)" header with expand/collapse chevron
 * - When expanded: "Available Rooms", "Booked Rooms", "Blocked" labels
 */
export function StatsRowSidebar({ isExpanded = false, onToggle }) {
  return (
    <div className="custom-calendar__stats-row-sidebar">
      {/* Main header row - always visible */}
      <div 
        className="stats-sidebar-header cursor-pointer hover:bg-[#F0E9E1] transition-colors"
        onClick={onToggle}
      >
        <span className="font-medium text-sm text-[#57534E]">Stats (Total Rooms)</span>
        {isExpanded ? (
          <ChevronDownIcon className="h-4 w-4 text-[#8B7355]" />
        ) : (
          <ChevronRightIcon className="h-4 w-4 text-[#8B7355]" />
        )}
      </div>

      {/* Expanded rows - visible when isExpanded is true */}
      {isExpanded && (
        <div className="stats-sidebar-details">
          {/* Available Rooms Label */}
          <div className="stats-sidebar-row">
            <span className="text-sm text-[#78716C]">Available Rooms</span>
          </div>

          {/* Booked Rooms Label */}
          <div className="stats-sidebar-row">
            <span className="text-sm text-[#78716C]">Booked Rooms</span>
          </div>

          {/* Blocked Label */}
          <div className="stats-sidebar-row">
            <span className="text-sm text-[#78716C]">Blocked</span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * StatsRowTimeline Component
 * 
 * Renders the numerical data in the timeline (right side):
 * - Top row: Total room counts per day
 * - When expanded: Available, Booked, Blocked counts per day
 */
export function StatsRowTimeline({ 
  dateColumns, 
  calendarData, 
  dayWidth,
  totalWidth,
  isExpanded = false,
  statsRow,
  scrollLeft = 0,
}) {
  const computedStats = calculateDailyStats(dateColumns, calendarData);
  const statsEntries = getStatsRowEntries(statsRow);

  const statsByDate = new Map();

  computedStats.forEach((stat, index) => {
    const normalized = normalizeStatEntry(stat, dateColumns[index]?.dateStr);
    statsByDate.set(normalized.date, normalized);
  });

  statsEntries.forEach((stat, index) => {
    const fallbackDate = dateColumns[index]?.dateStr;
    const normalized = normalizeStatEntry(stat, fallbackDate);

    if (normalized.date) {
      statsByDate.set(normalized.date, {
        ...(statsByDate.get(normalized.date) || {}),
        ...normalized,
      });
    }
  });

  const dailyStats = dateColumns.map((dateColumn) => {
    const dateStr = dateColumn.dateStr;
    return statsByDate.get(dateStr) || normalizeStatEntry(null, dateStr);
  });

  return (
    <div className="custom-calendar__stats-row-timeline">
      <div className="custom-calendar__stats-row-scroll">
        <div
          className="custom-calendar__stats-row-track"
          style={{
            width: totalWidth,
            transform: `translateX(-${scrollLeft}px)`,
          }}
        >
          {/* Main header row - always visible */}
          <div className="stats-timeline-header bg-[#F8F5F1]">
          {dailyStats.map((stat) => (
            <div 
              key={stat.date}
              className="stats-timeline-cell text-sm font-medium text-[#57534E]"
              style={{ width: `${dayWidth}px` }}
            >
              {stat.total_rooms}
            </div>
          ))}
          </div>

          {/* Expanded rows - visible when isExpanded is true */}
          {isExpanded && (
            <div className="stats-timeline-details">
              {/* Available Rooms Row */}
              <div className="stats-timeline-row ">
                {dailyStats.map((stat) => (
                  <div 
                    key={`available-${stat.date}`}
                    className={`stats-timeline-cell text-sm ${
                      stat.available_rooms === 0 ? 'text-[#DC2626] font-medium' : 'text-[#10B981]'
                    }`}
                    style={{ width: `${dayWidth}px` }}
                  >
                    {stat.available_rooms}
                  </div>
                ))}
              </div>

              {/* Booked Rooms Row */}
              <div className="stats-timeline-row ">
                {dailyStats.map((stat) => (
                  <div 
                    key={`booked-${stat.date}`}
                    className="stats-timeline-cell text-sm text-[#3B82F6]"
                    style={{ width: `${dayWidth}px` }}
                  >
                    {stat.booked_rooms}
                  </div>
                ))}
              </div>

              {/* Blocked Rooms Row */}
              <div className="stats-timeline-row ">
                {dailyStats.map((stat) => (
                  <div 
                    key={`blocked-${stat.date}`}
                    className="stats-timeline-cell text-sm text-[#8B7355]"
                    style={{ width: `${dayWidth}px` }}
                  >
                    {stat.blocked_rooms}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

StatsRowTimeline.propTypes = {
  dateColumns: PropTypes.array.isRequired,
  calendarData: PropTypes.object,
  dayWidth: PropTypes.number.isRequired,
  totalWidth: PropTypes.number.isRequired,
  isExpanded: PropTypes.bool,
  statsRow: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  scrollLeft: PropTypes.number,
};

// Legacy export for backwards compatibility (will be removed after CalendarGrid is updated)
export function StatsRow(props) {
  console.warn('StatsRow is deprecated. Use StatsRowSidebar and StatsRowTimeline instead.');
  return null;
}
