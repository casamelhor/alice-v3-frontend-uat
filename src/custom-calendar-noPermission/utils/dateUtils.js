/**
 * @file Date utility functions for custom calendar
 */

import { 
  format, 
  parseISO, 
  differenceInDays, 
  addDays, 
  startOfDay,
  isToday,
  isWeekend,
  isSameDay,
  getHours,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from 'date-fns';

/**
 * Generate an array of dates for a given range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Date[]} Array of dates
 */
export function generateDateRange(startDate, endDate) {
  return eachDayOfInterval({ start: startDate, end: endDate });
}

/**
 * Generate date columns for the calendar header
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Array<{date: Date, dateStr: string, dayName: string, dayNumber: number, isToday: boolean, isWeekend: boolean}>}
 */
export function generateDateColumns(startDate, endDate) {
  const dates = generateDateRange(startDate, endDate);
  
  return dates.map(date => ({
    date,
    dateStr: format(date, 'yyyy-MM-dd'),
    dayName: format(date, 'EEE'),
    dayNumber: parseInt(format(date, 'd'), 10),
    isToday: isToday(date),
    isWeekend: isWeekend(date),
  }));
}

/**
 * Get the date range for daily view (centered around selected date)
 * @param {Date} selectedDate - The selected/focused date
 * @param {number} [daysToShow=11] - Number of days to show
 * @returns {{ startDate: Date, endDate: Date }}
 */
export function getDailyViewRange(selectedDate, daysToShow = 11) {
  const daysBefore = Math.floor(daysToShow / 2);
  const daysAfter = daysToShow - daysBefore - 1;
  
  return {
    startDate: addDays(selectedDate, -daysBefore),
    endDate: addDays(selectedDate, daysAfter),
  };
}

/**
 * Get the date range for monthly view
 * @param {Date} month - Any date in the target month
 * @returns {{ startDate: Date, endDate: Date }}
 */
export function getMonthlyViewRange(month) {
  return {
    startDate: startOfMonth(month),
    endDate: endOfMonth(month),
  };
}

/**
 * Calculate the column index for a given date within a date range
 * @param {string | Date} date - The date to find
 * @param {Date} rangeStart - Start of the date range
 * @returns {number} 0-based column index
 */
export function getDateColumnIndex(date, rangeStart) {
  const targetDate = typeof date === 'string' ? parseISO(date) : date;
  return differenceInDays(startOfDay(targetDate), startOfDay(rangeStart));
}

/**
 * Calculate partial day offset for check-in time
 * Check-in at 2PM = 14/24 = 0.583 (58.3% from start of day)
 * @param {string} dateTimeStr - ISO date string with time or time string (HH:mm)
 * @param {string} [defaultTime='12:00'] - Default check-in time if no time provided
 * @returns {number} Offset as decimal (0-1)
 */
export function calculateCheckInOffset(dateTimeStr, defaultTime = '12:00') {
  let hours = 12; // Default to noon
  
  if (dateTimeStr) {
    if (dateTimeStr.includes('T')) {
      // Full ISO datetime string
      hours = getHours(parseISO(dateTimeStr));
    } else if (dateTimeStr.includes(':')) {
      // Time string like "14:00"
      hours = parseInt(dateTimeStr.split(':')[0], 10);
    }
  } else if (defaultTime) {
    hours = parseInt(defaultTime.split(':')[0], 10);
  }
  
  return hours / 24;
}

/**
 * Calculate partial day offset for check-out time (from end of day)
 * Check-out at 11AM = (24-11)/24 = 0.542 (54.2% from end of day)
 * @param {string} dateTimeStr - ISO date string with time or time string (HH:mm)
 * @param {string} [defaultTime='11:00'] - Default check-out time if no time provided
 * @returns {number} Offset as decimal (0-1)
 */
export function calculateCheckOutOffset(dateTimeStr, defaultTime = '11:00') {
  let hours = 11; // Default to 11AM
  
  if (dateTimeStr) {
    if (dateTimeStr.includes('T')) {
      hours = getHours(parseISO(dateTimeStr));
    } else if (dateTimeStr.includes(':')) {
      hours = parseInt(dateTimeStr.split(':')[0], 10);
    }
  } else if (defaultTime) {
    hours = parseInt(defaultTime.split(':')[0], 10);
  }
  
  return (24 - hours) / 24;
}

/**
 * Check if a date falls within a booking's date range
 * @param {string} dateStr - Date to check (yyyy-MM-dd)
 * @param {string} checkIn - Check-in date (yyyy-MM-dd)
 * @param {string} checkOut - Check-out date (yyyy-MM-dd)
 * @returns {boolean}
 */
export function isDateInBookingRange(dateStr, checkIn, checkOut) {
  return dateStr >= checkIn && dateStr < checkOut;
}

/**
 * Format a date for display
 * @param {string | Date} date - Date to format
 * @param {string} [formatStr='d MMM'] - Format string
 * @returns {string}
 */
export function formatDisplayDate(date, formatStr = 'd MMM') {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

/**
 * Get the number of days a booking spans
 * @param {string} checkIn - Check-in date (yyyy-MM-dd)
 * @param {string} checkOut - Check-out date (yyyy-MM-dd)
 * @returns {number}
 */
export function getBookingDuration(checkIn, checkOut) {
  return differenceInDays(parseISO(checkOut), parseISO(checkIn));
}

/**
 * Check if two date ranges overlap
 * @param {string} start1 - First range start
 * @param {string} end1 - First range end
 * @param {string} start2 - Second range start
 * @param {string} end2 - Second range end
 * @returns {boolean}
 */
export function doDateRangesOverlap(start1, end1, start2, end2) {
  return start1 < end2 && end1 > start2;
}

/**
 * Get visible portion of a booking within the calendar view
 * @param {string} bookingStart - Booking start date
 * @param {string} bookingEnd - Booking end date
 * @param {Date} viewStart - View start date
 * @param {Date} viewEnd - View end date
 * @returns {{ visibleStart: Date, visibleEnd: Date, isClippedStart: boolean, isClippedEnd: boolean } | null}
 */
export function getVisibleBookingRange(bookingStart, bookingEnd, viewStart, viewEnd) {
  const start = parseISO(bookingStart);
  const end = parseISO(bookingEnd);
  const viewStartDay = startOfDay(viewStart);
  const viewEndDay = addDays(startOfDay(viewEnd), 1); // Include the end day
  
  // Check if booking is visible at all
  if (end <= viewStartDay || start >= viewEndDay) {
    return null;
  }
  
  return {
    visibleStart: start < viewStartDay ? viewStartDay : start,
    visibleEnd: end > viewEndDay ? viewEndDay : end,
    isClippedStart: start < viewStartDay,
    isClippedEnd: end > viewEndDay,
  };
}
