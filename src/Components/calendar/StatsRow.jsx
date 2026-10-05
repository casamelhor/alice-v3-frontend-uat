import { useState, useMemo, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { format, eachDayOfInterval, isToday } from 'date-fns';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { calculateDailyStats } from '@/mocks/data';
import PropTypes from 'prop-types';

// Border color using CSS variable
const borderStyle = { borderColor: 'var(--color-alice-sand)' };

/**
 * StatsRow component displays aggregated room statistics per day
 * Sits above the FullCalendar grid and syncs horizontal scroll
 * 
 * @param {object} props
 * @param {{ start: Date, end: Date }} props.dateRange - The visible date range
 * @param {'daily' | 'monthly'} props.viewMode - Current view mode
 * @param {React.RefObject} props.calendarScrollRef - Reference to sync scroll with FullCalendar
 */
export const StatsRow = forwardRef(function StatsRow({ dateRange, viewMode, calendarScrollRef }, ref) {
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollContainerRef = useRef(null);
  const isScrollingSelf = useRef(false);

  // Expose scroll methods to parent
  useImperativeHandle(ref, () => ({
    getScrollContainer: () => scrollContainerRef.current,
    setScrollLeft: (value) => {
      if (scrollContainerRef.current) {
        isScrollingSelf.current = true;
        scrollContainerRef.current.scrollLeft = value;
        // Reset flag after scroll completes
        setTimeout(() => { isScrollingSelf.current = false; }, 50);
      }
    }
  }));

  // Calculate slot width based on view mode
  const slotWidth = viewMode === 'daily' ? 84 : 59;

  // Get all dates in range
  const dates = useMemo(() => {
    if (!dateRange?.start || !dateRange?.end) return [];
    return eachDayOfInterval({ start: dateRange.start, end: dateRange.end });
  }, [dateRange]);

  // Calculate stats for each date
  const dailyStats = useMemo(() => {
    const stats = {};
    dates.forEach(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      stats[dateStr] = calculateDailyStats(dateStr);
    });
    return stats;
  }, [dates]);

  // Get the calendar wrapper element from the ref
  const getCalendarWrapper = useCallback(() => {
    if (!calendarScrollRef?.current) return null;
    // If it's a component ref with getWrapperElement method
    if (typeof calendarScrollRef.current.getWrapperElement === 'function') {
      return calendarScrollRef.current.getWrapperElement();
    }
    // If it's a direct DOM ref
    return calendarScrollRef.current;
  }, [calendarScrollRef]);

  // Handle scroll and sync with calendar
  const handleScroll = (e) => {
    if (isScrollingSelf.current) return;
    
    const wrapperEl = getCalendarWrapper();
    if (wrapperEl) {
      const fcScroller = wrapperEl.querySelector('.fc-scroller-liquid-absolute');
      if (fcScroller) {
        fcScroller.scrollLeft = e.target.scrollLeft;
      }
    }
  };

  // Sync scroll from calendar to stats row
  useEffect(() => {
    // Use a timeout to ensure FullCalendar has rendered
    const timer = setTimeout(() => {
      const wrapperEl = getCalendarWrapper();
      if (!wrapperEl) return;

      const fcScroller = wrapperEl.querySelector('.fc-scroller-liquid-absolute');
      if (!fcScroller) return;

      const syncFromCalendar = () => {
        if (scrollContainerRef.current && !isScrollingSelf.current) {
          scrollContainerRef.current.scrollLeft = fcScroller.scrollLeft;
        }
      };

      fcScroller.addEventListener('scroll', syncFromCalendar);
      
      // Initial sync
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = fcScroller.scrollLeft;
      }

      // Cleanup on unmount
      return () => fcScroller.removeEventListener('scroll', syncFromCalendar);
    }, 100);

    return () => clearTimeout(timer);
  }, [getCalendarWrapper]);

  if (dates.length === 0) return null;

  return (
    <div 
      className="stats-row-wrapper flex border border-color-alice-sand  select-none"
      style={{overflowY:'scroll', borderColor: 'var(--color-alice-sand)'}}
      role="region"
      aria-label="Room Statistics"
    >
      {/* Fixed label column - matches FullCalendar's resourceAreaWidth */}
      <div 
        className="w-[280px] flex-shrink-0 border-r"
        style={borderStyle}
      >
        {/* Header row with toggle */}
        <div 
          className="flex items-center gap-2 py-2 px-3 cursor-pointer hover:bg-gray-100 border-b h-[50px]"
          style={borderStyle}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
          )}
          <span className="text-sm font-medium text-gray-600">Stats (Total Rooms)</span>
        </div>
        
        {/* Expanded rows */}
        {isExpanded && (
          <>
            <div 
              className="flex items-center py-3 pl-10 pr-3 border-b h-[50px]"
              style={borderStyle}
            >
              <span className="text-xs text-gray-500">Available Rooms</span>
            </div>
            <div 
              className="flex items-center py-3 pl-10 pr-3 border-b h-[50px]"
              style={borderStyle}
            >
              <span className="text-xs text-gray-500">Booked Rooms</span>
            </div>
            <div className="flex items-center py-3 pl-10 pr-3 h-[50px]">
              <span className="text-xs text-gray-500">Blocked</span>
            </div>
          </>
        )}
      </div>
      
      {/* Scrollable date columns */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-x-auto stats-scroll-container"
        onScroll={handleScroll}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex justify-between">
          {dates.map((date) => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const stats = dailyStats[dateStr] || { totalRooms: 0, availableRooms: 0, bookedRooms: 0, blockedRooms: 0 };
            const isTodayDate = isToday(date);
            
            return (
              <div 
                key={dateStr} 
                className={`flex-shrink-0  ${isTodayDate ? 'bg-[rgba(139,115,85,0.05)]' : ''}`}
                style={{ minWidth: slotWidth, width: slotWidth, ...borderStyle , borderLeft:'1px solid #dedede', borderCollapse:'collapse'}}
              >
                {/* Total rooms row */}
                <div 
                  className="flex items-center justify-center border-b h-[50px]"
                  style={borderStyle}
                >
                  <span className="text-sm font-medium text-gray-700">{stats.totalRooms}</span>
                </div>
                
                {/* Expanded stat rows */}
                {isExpanded && (
                  <>
                    <div 
                      className="flex items-center justify-center border-b h-[50px]"
                      style={borderStyle}
                    >
                      <span className={`text-xs ${stats.availableRooms === 0 ? 'text-red-500 font-medium' : 'text-green-600'}`}>
                        {stats.availableRooms}
                      </span>
                    </div>
                    <div 
                      className="flex items-center justify-center border-b h-[50px]"
                      style={borderStyle}
                    >
                      <span className="text-xs text-blue-600">{stats.bookedRooms}</span>
                    </div>
                    <div className="flex items-center justify-center h-[50px]">
                      <span className={`text-xs ${stats.blockedRooms > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
                        {stats.blockedRooms}
                      </span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Hide scrollbar but keep functionality */}
      <style>{`
        .stats-scroll-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
});

StatsRow.propTypes = {
  dateRange: PropTypes.shape({
    start: PropTypes.instanceOf(Date).isRequired,
    end: PropTypes.instanceOf(Date).isRequired,
  }),
  viewMode: PropTypes.oneOf(['daily', 'monthly']),
  calendarScrollRef: PropTypes.shape({
    current: PropTypes.any,
  }),
};

StatsRow.defaultProps = {
  viewMode: 'daily',
};
