import React from 'react';
import { format, addDays, subDays } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

/**
 * Status colors matching PRD
 */
const STATUS_COLORS = {
  current: '#10B981',           // Green
  checkin_pending: '#F59E0B',   // Orange
  checkout_pending: '#FBBF24',  // Yellow
  checkout_upcoming: '#8B5CF6', // Purple
  upcoming: '#3B82F6',          // Blue
  no_show: '#EF4444'            // Red
};

/**
 * AtAGlanceDashboard Component
 * 
 * Displays daily snapshot with:
 * - Date navigation
 * - Total bookings count
 * - Status breakdown with progress bar
 * - Minimize/maximize toggle
 */
export function AtAGlanceDashboard({
  selectedDate,
  onDateChange,
  atAGlanceData,
  isMinimized = false,
  onToggleMinimize,
  viewMode = 'daily',
  onViewModeChange
}) {
  // Default data structure if not provided
  const defaultData = {
    total_bookings: 0,
    status_breakdown: {
      current: 0,
      checkin_pending: 0,
      checkout_pending: 0,
      checkout_upcoming: 0,
      upcoming: 0,
      no_show: 0
    }
  };

  const data = atAGlanceData || defaultData;
  const statusBreakdown = data.status_breakdown || defaultData.status_breakdown;
  const statusProgress = data.status_progress

  // Calculate total for progress bar
  const total = data.total_bookings || 0;

  // Calculate percentages for progress bar segments
  const getPercentage = (count) => total > 0 ? (count / total) * 100 : 0;

  const handlePrevDay = () => {
    onDateChange(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    onDateChange(addDays(selectedDate, 1));
  };
console.log(data)
  return (
    <div className="at-a-glance-dashboard  border-b border-[#E5E2DC]">
      {/* Header Row */}
      <div className="flex items-center justify-between py-3 border-b border-[#E5E2DC]">
        <div className="flex items-center gap-6">
          {/* Title with Date Navigation */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[#6B6B6B]">At a glance</span>
            
            {viewMode === 'daily' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevDay}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  aria-label="Previous day"
                >
                  <ChevronLeftIcon className="h-4 w-4 text-[#6B6B6B]" />
                </button>
                
                <span className="text-sm font-medium text-[#1F1F1F] min-w-[100px] text-center">
                  {format(selectedDate, 'MMM d, yyyy')}
                </span>
                
                <button
                  onClick={handleNextDay}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  aria-label="Next day"
                >
                  <ChevronRightIcon className="h-4 w-4 text-[#6B6B6B]" />
                </button>
              </div>
            )}
          </div>

          {/* Total Bookings */}
          <div className="flex items-center gap-2">
            <div className="bg-[#F5F3EF] px-3 py-1.5 rounded-md">
              <span className="text-lg font-semibold text-[#1F1F1F]">{total}</span>
            </div>
            <span className="text-sm text-[#6B6B6B]">Total Bookings</span>
          </div>
        </div>

        {/* View Mode Toggle and Minimize Button */}
        <div className="flex items-center gap-4">
          {/* View Mode Selector */}
          {onViewModeChange && (
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('daily')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  viewMode === 'daily'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => onViewModeChange('monthly')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  viewMode === 'monthly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
            </div>
          )}

          {/* Minimize Toggle */}
          <button
            onClick={onToggleMinimize}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#8B7355] hover:bg-[#F5F3EF] rounded transition-colors"
          >
            {isMinimized ? (
              <>
                <ChevronDownIcon className="h-3.5 w-3.5" />
                View snapshot
              </>
            ) : (
              <>
                <ChevronUpIcon className="h-3.5 w-3.5" />
                Minimize snapshot
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expanded Content - Status Breakdown */}
      {!isMinimized && (
        <div className="py-3">
          {/* Progress Bar */}
          <div className="mb-3">
            <div className=" w-full bg-gray-100 rounded-lg overflow-hidden flex">
              {statusProgress.current_percent > 0 && (
                <div
                  className=" rounded-l-2xl flex items-center justify-center text-xs font-medium text-white"
                  style={{
                    width: `${getPercentage(statusProgress.current_percent)}%`,
                    backgroundColor: STATUS_COLORS.current,
                    minWidth: statusProgress.current_percent > 0 ? '24px' : '0',
                    height:'10px',
                    fontSize: '10px'
                  }}
                  title={`${statusProgress.current_percent} Current`}
                >
                  {/* {statusBreakdown.current > 0 && statusBreakdown.current} */}
                </div>
              )}
              {statusProgress.check_in_pending_percent > 0 && (
                <div
                  className="h-full flex items-center justify-center text-xs font-medium text-white"
                  style={{
                    width: `${getPercentage(statusProgress.check_in_pending_percent)}%`,
                    backgroundColor: STATUS_COLORS.checkin_pending,
                    minWidth: statusProgress.check_in_pending_percent > 0 ? '24px' : '0',
                    height:'10px',
                    fontSize: '10px'
                  }}
                  title={`${statusProgress.check_in_pending_percent} Check-in Pending`}
                >
                  {/* {statusBreakdown.checkin_pending > 0 && statusBreakdown.checkin_pending} */}
                </div>
              )}
              {statusProgress.checkout_pending_percent > 0 && (
                <div
                  className="h-full flex items-center justify-center text-xs font-medium text-white"
                  style={{
                    width: `${getPercentage(statusProgress.checkout_pending_percent)}%`,
                    backgroundColor: STATUS_COLORS.checkout_pending,
                    minWidth: statusProgress.checkout_pending_percent > 0 ? '24px' : '0',
                    height:'10px',
                    fontSize: '10px'
                  }}
                  title={`${statusProgress.checkout_pending_percent} Checkout Pending`}
                >
                  {/* {statusBreakdown.checkout_pending > 0 && statusBreakdown.checkout_pending} */}
                </div>
              )}
              {statusProgress.checkout_upcoming > 0 && (
                <div
                  className="h-full flex items-center justify-center text-xs font-medium text-white"
                  style={{
                    width: `${getPercentage(statusProgress.checkout_upcoming)}%`,
                    backgroundColor: STATUS_COLORS.checkout_upcoming,
                    minWidth: statusProgress.checkout_upcoming > 0 ? '24px' : '0',
                    height:'10px',
                    fontSize: '10px'
                  }}
                  title={`${statusProgress.checkout_upcoming} Checkout Upcoming`}
                >
                  {/* {statusBreakdown.checkout_upcoming > 0 && statusBreakdown.checkout_upcoming} */}
                </div>
              )}
              {statusProgress.upcoming_percent > 0 && (
                <div
                  className="h-full flex items-center justify-center text-xs font-medium text-white"
                  style={{
                    width: `${getPercentage(statusProgress.upcoming_percent)}%`,
                    backgroundColor: STATUS_COLORS.upcoming,
                    minWidth: statusProgress.upcoming_percent > 0 ? '24px' : '0',
                    height:'10px',
                    fontSize: '10px'
                  }}
                  title={`${statusProgress.upcoming_percent} Upcoming`}
                >
                  {/* {statusBreakdown.upcoming > 0 && statusBreakdown.upcoming} */}
                </div>
              )}
              {statusProgress.no_show_percent > 0 && (
                <div
                  className="h-full flex items-center justify-center text-xs font-medium text-white"
                  style={{
                    width: `${getPercentage(statusProgress.no_show_percent)}%`,
                    backgroundColor: STATUS_COLORS.no_show,
                    minWidth: statusProgress.no_show_percent > 0 ? '24px' : '0',
                    height:'10px'
                  }}
                  title={`${statusProgress.no_show_percent} No Show`}
                >
                  {/* {statusBreakdown.no_show > 0 && statusBreakdown.no_show} */}
                </div>
              )}
            </div>
          </div>

          {/* Status Legend */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {statusBreakdown.current > 0 && (
              <div className="flex items-center gap-2">
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: STATUS_COLORS.current }}
                />
                <span className="text-sm text-[#6B6B6B]">
                  {statusBreakdown.current} current
                </span>
              </div>
            )}
            {statusBreakdown.checkin_pending > 0 && (
              <div className="flex items-center gap-2">
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: STATUS_COLORS.checkin_pending }}
                />
                <span className="text-sm text-[#6B6B6B]">
                  {statusBreakdown.checkin_pending} check-in pending
                </span>
              </div>
            )}
            {statusBreakdown.checkout_pending > 0 && (
              <div className="flex items-center gap-2">
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: STATUS_COLORS.checkout_pending }}
                />
                <span className="text-sm text-[#6B6B6B]">
                  {statusBreakdown.checkout_pending} checkout pending
                </span>
              </div>
            )}
            {statusBreakdown.checkout_upcoming > 0 && (
              <div className="flex items-center gap-2">
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: STATUS_COLORS.checkout_upcoming }}
                />
                <span className="text-sm text-[#6B6B6B]">
                  {statusBreakdown.checkout_upcoming} checkout upcoming
                </span>
              </div>
            )}
            {statusBreakdown.upcoming > 0 && (
              <div className="flex items-center gap-2">
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: STATUS_COLORS.upcoming }}
                />
                <span className="text-sm text-[#6B6B6B]">
                  {statusBreakdown.upcoming} upcoming
                </span>
              </div>
            )}
            {statusBreakdown.no_show > 0 && (
              <div className="flex items-center gap-2">
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: STATUS_COLORS.no_show }}
                />
                <span className="text-sm text-[#6B6B6B]">
                  {statusBreakdown.no_show} no show
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
