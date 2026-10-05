/**
 * @file Booking card component - displays booking on timeline
 */

import PropTypes from 'prop-types';
import clsx from 'clsx';
import { format, parseISO } from 'date-fns';

/**
 * Get status class name for booking card styling
 * @param {string} status - Booking status
 * @returns {string} CSS class name
 */
function getStatusClassName(status) {
  const normalizedStatus = status?.toUpperCase().replace(/-/g, '_');
  
  switch (normalizedStatus) {
    case 'CHECK_IN_UPCOMING':
      return 'booking-card--checkin-upcoming';
    case 'CHECK_IN_PENDING':
      return 'booking-card--checkin-pending';
    case 'CHECKED_IN':
    case 'CURRENT':
      return 'booking-card--checked-in';
    case 'CHECKOUT_PENDING':
      return 'booking-card--checkout-pending';
    case 'CHECKOUT_UPCOMING':
      return 'booking-card--checkout-upcoming';
    case 'CHECKED_OUT':
      return 'booking-card--checked-out';
    case 'CANCELLED':
      return 'booking-card--cancelled';
    case 'NO_SHOW_MANUAL':
    case 'NO_SHOW_AUTO':
    case 'NO_SHOW':
      return 'booking-card--no-show';
    default:
      return 'booking-card--checkin-upcoming';
  }
}

/**
 * Get initials from name
 * @param {string} name 
 * @returns {string}
 */
function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Booking card component
 * Displays a booking as a card on the timeline
 */
export function BookingCard({ booking, left, width, onClick, hasPartialFill }) {
  // Extract booking data (handle both API format and mock format)
  const guestName = booking.guest_display_name || booking.traveler?.name || 'Guest';
  const guestPhoto = booking.guest_photo_url || booking.traveler?.photo;
  const checkIn = booking.check_in_date || booking.checkInDate;
  const checkOut = booking.check_out_date || booking.checkOutDate;
  const checkInTime = booking.check_in_time || booking.checkInTime;
  const checkOutTime = booking.check_out_time || booking.checkOutTime;
  const status = booking.booking_status || booking.status;
  const isExclusive = booking.is_exclusive || booking.isExclusiveRoomBooking;
  const isNoShow = status?.toUpperCase().includes('NO_SHOW');

  // Format dates for display
  const dateRange = formatDateRange(checkIn, checkOut);
  
  // Show times for partial fills (same-day or partial day bookings)
  const showTimes = hasPartialFill && (checkInTime || checkOutTime);

  return (
    <div
      className={clsx('booking-card', getStatusClassName(status))}
      style={{
        left: `${left}px`,
        width: `${width}px`,
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Guest photo or initials */}
      {guestPhoto ? (
        <img
          src={`${guestPhoto}`}
          alt={guestName}
          className="booking-card__photo"
        />
      ) : (
        <div className="booking-card__initials">
          {getInitials(guestName)}
        </div>
      )}

      {/* Booking content */}
      <div className="booking-card__content">
        <div className={clsx('booking-card__name', isNoShow && 'line-through')}>
          {truncateText(guestName, width < 120 ? 12 : 18)}
          {isExclusive && width >= 100 && (
            <span className="booking-card__badge">Exclusive</span>
          )}
        </div>
        <div className="booking-card__dates">
          {dateRange}
        </div>
        {showTimes && width >= 80 && (
          <div className="booking-card__times">
            {checkInTime && <span className="booking-card__time-in">{checkInTime}</span>}
            {checkInTime && checkOutTime && <span className="mx-0.5">-</span>}
            {checkOutTime && <span className="booking-card__time-out">{checkOutTime}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

BookingCard.propTypes = {
  booking: PropTypes.object.isRequired,
  left: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  hasPartialFill: PropTypes.bool,
};

/**
 * Format date range for display
 * @param {string} checkIn 
 * @param {string} checkOut 
 * @returns {string}
 */
function formatDateRange(checkIn, checkOut) {
  try {
    const start = parseISO(checkIn);
    const end = parseISO(checkOut);
    return `${format(start, 'd MMM')} - ${format(end, 'd MMM')}`;
  } catch {
    return '';
  }
}

/**
 * Truncate text to specified length
 * @param {string} text 
 * @param {number} maxLength 
 * @returns {string}
 */
function truncateText(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
