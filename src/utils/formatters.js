import { format, parseISO, isToday, isTomorrow, isYesterday } from 'date-fns';

/**
 * Format a date for display
 * @param {string | Date} date - The date to format
 * @param {string} [formatStr='dd MMM yyyy'] - The format string
 * @returns {string} The formatted date
 */
export function formatDate(date, formatStr = 'dd MMM yyyy') {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

/**
 * Format a date range for display
 * @param {string} startDate - The start date
 * @param {string} endDate - The end date
 * @returns {string} The formatted date range
 */
export function formatDateRange(startDate, endDate) {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  
  if (format(start, 'MMM yyyy') === format(end, 'MMM yyyy')) {
    // Same month
    return `${format(start, 'd')} - ${format(end, 'd MMM')}`;
  }
  
  return `${format(start, 'd MMM')} - ${format(end, 'd MMM')}`;
}

/**
 * Format nights count
 * @param {number} nights - The number of nights
 * @returns {string} The formatted nights string
 */
export function formatNights(nights) {
  return nights === 1 ? '1 night' : `${nights} nights`;
}

/**
 * Get relative date label (Today, Tomorrow, Yesterday, or date)
 * @param {string | Date} date - The date to format
 * @returns {string} The relative date label
 */
export function getRelativeDateLabel(date) {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) return 'Today';
  if (isTomorrow(dateObj)) return 'Tomorrow';
  if (isYesterday(dateObj)) return 'Yesterday';
  
  return format(dateObj, 'd MMMM yyyy');
}

/**
 * Format month and year for header
 * @param {Date} date - The date to format
 * @returns {string} The formatted month and year
 */
export function formatMonthYear(date) {
  return format(date, 'MMMM yyyy');
}

/**
 * Format time for display
 * @param {string} time - The time string in HH:mm format
 * @returns {string} The formatted time string
 */
export function formatTime(time) {
  // Assumes time is in HH:mm format
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Get status display label
 * @param {import('@/types').BookingStatus} status - The booking status
 * @returns {string} The status label
 */
export function getStatusLabel(status) {
  /** @type {Object.<import('@/types').BookingStatus, string>} */
  const labels = {
    CHECK_IN_UPCOMING: 'Check-in Upcoming',
    CHECK_IN_PENDING: 'Check-in Pending',
    CHECKED_IN: 'Current',
    CHECKOUT_PENDING: 'Checkout Pending',
    CHECKOUT_UPCOMING: 'Checkout Upcoming',
    CHECKED_OUT: 'Completed',
    CANCELLED: 'Cancelled',
    NO_SHOW_MANUAL: 'No Show',
    NO_SHOW_AUTO: 'No Show',
  };
  return labels[status];
}

/**
 * @typedef {Object} StatusColors
 * @property {string} bg - Background class
 * @property {string} border - Border class
 * @property {string} text - Text class
 * @property {string} dot - Dot class
 */

/**
 * Get status color classes for styling
 * @param {import('@/types').BookingStatus} status - The booking status
 * @returns {StatusColors} The status color classes
 */
export function getStatusColorClasses(status) {
  /** @type {Object.<import('@/types').BookingStatus, StatusColors>} */
  const colors = {
    CHECK_IN_UPCOMING: {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      text: 'text-blue-700',
      dot: 'bg-blue-500',
    },
    CHECK_IN_PENDING: {
      bg: 'bg-orange-50',
      border: 'border-orange-500',
      text: 'text-orange-700',
      dot: 'bg-orange-500',
    },
    CHECKED_IN: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-500',
      text: 'text-emerald-700',
      dot: 'bg-emerald-500',
    },
    CHECKOUT_PENDING: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-500',
      text: 'text-yellow-700',
      dot: 'bg-yellow-500',
    },
    CHECKOUT_UPCOMING: {
      bg: 'bg-purple-50',
      border: 'border-purple-500',
      text: 'text-purple-700',
      dot: 'bg-purple-500',
    },
    CHECKED_OUT: {
      bg: 'bg-gray-50',
      border: 'border-gray-400',
      text: 'text-gray-600',
      dot: 'bg-gray-400',
    },
    CANCELLED: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      text: 'text-red-700',
      dot: 'bg-red-500',
    },
    NO_SHOW_MANUAL: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      text: 'text-red-700 line-through',
      dot: 'bg-red-500',
    },
    NO_SHOW_AUTO: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      text: 'text-red-700 line-through',
      dot: 'bg-red-500',
    },
  };
  return colors[status];
}

/**
 * Truncate text with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - The maximum length
 * @returns {string} The truncated text
 */
export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Generate initials from a name
 * @param {string} name - The name to get initials from
 * @returns {string} The initials
 */
export function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format availability count (R-X, B-X)
 * @param {number} availableRooms - The number of available rooms
 * @param {number} availableBeds - The number of available beds
 * @returns {string} The formatted availability
 */
export function formatAvailability(availableRooms, availableBeds) {
  return `R-${availableRooms}, B-${availableBeds}`;
}

/**
 * Format room/bed count summary
 * @param {number} roomCount - The number of rooms
 * @param {number} bedCount - The number of beds
 * @returns {string} The formatted room/bed count
 */
export function formatRoomBedCount(roomCount, bedCount) {
  const rooms = roomCount === 1 ? '1 Room' : `${roomCount} Rooms`;
  const beds = bedCount === 0 ? '' : bedCount === 1 ? ', 1 Bed' : `, ${bedCount} Beds`;
  return `${rooms}${beds}`;
}
