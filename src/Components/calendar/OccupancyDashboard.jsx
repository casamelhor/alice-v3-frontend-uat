import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useCalendarStore } from '@/stores/calendarStore';
import { format, addDays, subDays } from 'date-fns';
import { useState } from 'react';
import { calculateOccupancyStats } from '@/mocks/data';

const statusItems = [
  { key: 'current', label: 'current', color: 'bg-emerald-500' },
  { key: 'checkInPending', label: 'check-in pending', color: 'bg-orange-500' },
  { key: 'checkoutPending', label: 'checkout pending', color: 'bg-yellow-500' },
  { key: 'checkoutUpcoming', label: 'checkout upcoming', color: 'bg-purple-500' },
  { key: 'upcoming', label: 'upcoming', color: 'bg-blue-500' },
  { key: 'noShow', label: 'no show', color: 'bg-gray-400' },
];

/**
 * Occupancy dashboard component showing booking statistics
 * @returns {JSX.Element}
 */
export function OccupancyDashboard() {
  const {
    selectedDate,
    setSelectedDate,
    viewMode,
    setViewMode,
    isSnapshotMinimized,
    toggleSnapshotMinimized,
  } = useCalendarStore();

  const [isViewModeOpen, setIsViewModeOpen] = useState(false);

  // Calculate stats for selected date
  const stats = calculateOccupancyStats(format(selectedDate, 'yyyy-MM-dd'));

  const handlePreviousDay = () => {
    setSelectedDate(subDays(selectedDate, viewMode === 'daily' ? 1 : 7));
  };

  const handleNextDay = () => {
    setSelectedDate(addDays(selectedDate, viewMode === 'daily' ? 1 : 7));
  };

  // Calculate total for progress bar
  const total = stats.current + stats.checkInPending + stats.checkoutPending + 
                stats.checkoutUpcoming + stats.upcoming + stats.noShow;

  /**
   * Calculate segment width percentage
   * @param {number} value
   * @returns {number}
   */
  const getWidth = (value) => total > 0 ? (value / total) * 100 : 0;

  if (isSnapshotMinimized) {
    return (
      <div className=" py-3 border-b border-[var(--color-alice-sand)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">At a glance</span>
            <span className="text-2xl font-display font-semibold text-gray-800">
              {stats.totalBookings} Bookings
            </span>
          </div>
          <button
            onClick={toggleSnapshotMinimized}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <ChevronDown className="w-4 h-4" />
            <span>View snapshot</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" py-3 ">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600">At a glance</span>
          
          {/* Date Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousDay}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <span className="text-sm font-medium text-gray-800 min-w-[120px] text-center">
              {format(selectedDate, 'd MMMM yyyy')}
            </span>
            
            <button
              onClick={handleNextDay}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="relative">
            <button
              onClick={() => setIsViewModeOpen(!isViewModeOpen)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span>{viewMode === 'daily' ? 'Daily' : 'Monthly'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isViewModeOpen ? 'rotate-180' : ''}`} />
            </button>

            {isViewModeOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={() => {
                    setViewMode('daily');
                    setIsViewModeOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center justify-between ${
                    viewMode === 'daily' ? 'text-gray-900' : 'text-gray-600'
                  }`}
                >
                  <span>Daily</span>
                  {viewMode === 'daily' && (
                    <svg className="w-4 h-4 text-[var(--color-alice-brown)]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => {
                    setViewMode('monthly');
                    setIsViewModeOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center justify-between ${
                    viewMode === 'monthly' ? 'text-gray-900' : 'text-gray-600'
                  }`}
                >
                  <span>Monthly</span>
                  {viewMode === 'monthly' && (
                    <svg className="w-4 h-4 text-[var(--color-alice-brown)]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Minimize Button */}
        <button
          onClick={toggleSnapshotMinimized}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronUp className="w-4 h-4" />
          <span>Minimize snapshot</span>
        </button>
      </div>

      {/* Booking Count */}
      <div className="mb-3">
        <span className="text-3xl font-display font-semibold text-gray-800">
          {stats.totalBookings}
        </span>
        <span className="text-lg text-gray-600 ml-2">Bookings</span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-gray-100  overflow-hidden flex mb-3">
        {stats.current > 0 && (
          <div 
            className="bg-emerald-500 rounded-l-2xl h-full transition-all duration-300" 
            style={{ width: `${getWidth(stats.current)}%` }}
          />
        )}
        {stats.checkInPending > 0 && (
          <div 
            className="bg-orange-500 h-full transition-all duration-300" 
            style={{ width: `${getWidth(stats.checkInPending)}%` }}
          />
        )}
        {stats.checkoutPending > 0 && (
          <div 
            className="bg-yellow-500 rounded-r-2xl h-full transition-all duration-300" 
            style={{ width: `${getWidth(stats.checkoutPending)}%` }}
          />
        )}
        {stats.checkoutUpcoming > 0 && (
          <div 
            className="bg-purple-500 h-full transition-all duration-300" 
            style={{ width: `${getWidth(stats.checkoutUpcoming)}%` }}
          />
        )}
        {stats.upcoming > 0 && (
          <div 
            className="bg-blue-500 h-full transition-all duration-300" 
            style={{ width: `${getWidth(stats.upcoming)}%` }}
          />
        )}
        {stats.noShow > 0 && (
          <div 
            className="bg-gray-400 h-full rounded transition-all duration-300" 
            style={{ width: `${getWidth(stats.noShow)}%` }}
          />
        )}
      </div>

      {/* Status Legend */}
      <div className="flex items-center gap-6 flex-wrap">
        {statusItems.map((item) => {
          const value = stats[item.key];
          return (
            <div key={item.key} className="flex items-center gap-2">
              <span className={`w-2 h-2  ${item.color} rounded-2xl`} />
              <span className={`text-sm ${value > 0 ? 'text-gray-700' : 'text-gray-400'}`}>
                {value} {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
