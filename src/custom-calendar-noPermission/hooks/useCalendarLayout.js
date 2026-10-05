/**
 * @file Hook for calendar layout calculations
 */

import { useMemo } from 'react';
import { generateDateColumns, getDailyViewRange, getMonthlyViewRange } from '../utils/dateUtils';
import { getDayWidth, getTimelineWidth } from '../utils/gridPositioning';

/**
 * @typedef {Object} CalendarLayoutConfig
 * @property {Date} selectedDate - Currently selected date
 * @property {Date} currentMonth - Current month being viewed
 * @property {'daily' | 'monthly'} viewMode - Calendar view mode
 */

/**
 * @typedef {Object} CalendarLayout
 * @property {Date} startDate - Start date of visible range
 * @property {Date} endDate - End date of visible range
 * @property {Array} dateColumns - Array of date column data
 * @property {number} dayWidth - Width of each day column in pixels
 * @property {number} totalWidth - Total timeline width in pixels
 * @property {number} numDays - Number of days in the view
 */

/**
 * Hook to calculate calendar layout based on view mode and dates
 * @param {CalendarLayoutConfig} config - Layout configuration
 * @returns {CalendarLayout}
 */
export function useCalendarLayout({ selectedDate, currentMonth, viewMode }) {
  const dateRange = useMemo(() => {
    if (viewMode === 'daily') {
      return getDailyViewRange(selectedDate, 7);
    }
    return getMonthlyViewRange(currentMonth);
  }, [selectedDate, currentMonth, viewMode]);

  const dateColumns = useMemo(() => {
    return generateDateColumns(dateRange.startDate, dateRange.endDate);
  }, [dateRange.startDate, dateRange.endDate]);

  const dayWidth = useMemo(() => {
    return getDayWidth(viewMode);
  }, [viewMode]);

  const numDays = dateColumns.length;
  const totalWidth = getTimelineWidth(numDays, dayWidth);

  return {
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    dateColumns,
    dayWidth,
    totalWidth,
    numDays,
  };
}
