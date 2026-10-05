import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { STATUS_COLORS, STATUS_LABELS } from '@/types';
import { getStatusColorClasses, truncateText, formatDateRange, getInitials } from '@/utils/formatters';
import { getBookingActions } from '@/utils/permissions';
import { format } from 'date-fns';

/**
 * Booking card component for displaying booking information
 * @param {Object} props
 * @param {import('@/types').Booking} props.booking - The booking data
 * @param {'standard' | 'compact' | 'mobile'} [props.variant='standard'] - Display variant
 * @param {import('@/types').UserRole} [props.userRole='CASAMELHOR_ADMIN'] - User role for permissions
 * @param {(bookingId: string) => void} [props.onViewDetails] - Callback when viewing details
 * @param {(bookingId: string) => void} [props.onCheckIn] - Callback for check-in action
 * @param {(bookingId: string) => void} [props.onCheckOut] - Callback for check-out action
 * @returns {JSX.Element}
 */
export function BookingCard({
  booking,
  variant = 'standard',
  userRole = 'CASAMELHOR_ADMIN',
  onViewDetails,
  onCheckIn,
  onCheckOut,
}) {
  const statusColors = getStatusColorClasses(booking.status);
  const actions = useMemo(
    () => getBookingActions(booking, userRole),
    [booking, userRole]
  );

  const isNoShow = booking.status === 'NO_SHOW_MANUAL' || booking.status === 'NO_SHOW_AUTO';

  if (variant === 'compact') {
    return (
      <div
        className={`
          flex items-center gap-2 px-2 py-1.5 rounded-md border-2 cursor-pointer
          transition-all duration-200 hover:shadow-md
          ${statusColors.bg} ${statusColors.border}
        `}
        onClick={() => onViewDetails?.(booking.id)}
      >
        {booking.traveler.photo ? (
          <img
            src={booking.traveler.photo}
            alt={booking.traveler.name}
            className="w-6 h-6  object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-6 h-6  bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
            {getInitials(booking.traveler.name)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className={`text-xs font-medium truncate ${isNoShow ? 'line-through' : ''} ${statusColors.text}`}>
            {truncateText(booking.traveler.name, 12)}
          </div>
          <div className="text-[10px] text-gray-500">
            {formatDateRange(booking.checkInDate, booking.checkOutDate)}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'mobile') {
    return (
      <div
        className={`
          p-4 rounded-lg border-2 bg-white
          ${statusColors.border}
        `}
      >
        <div className="flex items-start gap-3 mb-3">
          {booking.traveler.photo ? (
            <img
              src={booking.traveler.photo}
              alt={booking.traveler.name}
              className="w-12 h-12  object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12  bg-gray-200 flex items-center justify-center text-lg font-medium text-gray-600">
              {getInitials(booking.traveler.name)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className={`text-base font-medium text-gray-900 ${isNoShow ? 'line-through' : ''}`}>
              {booking.traveler.name}
            </h4>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              📍 {booking.propertyName} | {booking.roomName}
              {booking.bedName && `, ${booking.bedName}`}
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              📅 {formatDateRange(booking.checkInDate, booking.checkOutDate)} ({booking.nights} nights)
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2  ${statusColors.dot}`} />
              <span className={`text-sm ${statusColors.text}`}>
                {STATUS_LABELS[booking.status]}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails?.(booking.id)}
            className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View Details
          </button>
          {actions.includes('check_in') && (
            <button
              onClick={() => onCheckIn?.(booking.id)}
              className="flex-1 px-3 py-2 text-sm font-medium text-white bg-[var(--color-alice-brown)] rounded-lg hover:bg-[var(--color-alice-brown-dark)] transition-colors"
            >
              Check In
            </button>
          )}
          {actions.includes('check_out') && (
            <button
              onClick={() => onCheckOut?.(booking.id)}
              className="flex-1 px-3 py-2 text-sm font-medium text-white bg-[var(--color-alice-brown)] rounded-lg hover:bg-[var(--color-alice-brown-dark)] transition-colors"
            >
              Check Out
            </button>
          )}
        </div>
      </div>
    );
  }

  // Standard variant (default)
  return (
    <div
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg border-2 cursor-pointer
        transition-all duration-200 hover:shadow-lg
        ${statusColors.bg} ${statusColors.border}
      `}
      onClick={() => onViewDetails?.(booking.id)}
    >
      {booking.traveler.photo ? (
        <img
          src={booking.traveler.photo}
          alt={booking.traveler.name}
          className="w-8 h-8  object-cover flex-shrink-0 border-2 border-white shadow-sm"
        />
      ) : (
        <div className="w-8 h-8  bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 border-2 border-white shadow-sm">
          {getInitials(booking.traveler.name)}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className={`text-sm font-medium truncate ${isNoShow ? 'line-through' : ''} ${statusColors.text}`}>
          {booking.traveler.name}
        </div>
        <div className="text-xs text-gray-500">
          {format(new Date(booking.checkInDate), 'd MMM')} - {format(new Date(booking.checkOutDate), 'd MMM')}
        </div>
      </div>
    </div>
  );
}

BookingCard.propTypes = {
  booking: PropTypes.shape({
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    traveler: PropTypes.shape({
      name: PropTypes.string.isRequired,
      photo: PropTypes.string,
    }).isRequired,
    propertyName: PropTypes.string,
    roomName: PropTypes.string,
    bedName: PropTypes.string,
    checkInDate: PropTypes.string.isRequired,
    checkOutDate: PropTypes.string.isRequired,
    nights: PropTypes.number,
  }).isRequired,
  variant: PropTypes.oneOf(['standard', 'compact', 'mobile']),
  userRole: PropTypes.string,
  onViewDetails: PropTypes.func,
  onCheckIn: PropTypes.func,
  onCheckOut: PropTypes.func,
};

/**
 * FullCalendar Event Content Renderer
 * @param {import('@/types').Booking} booking - The booking data
 * @returns {JSX.Element}
 */
export function renderBookingEvent(booking) {
  const statusColors = STATUS_COLORS[booking.status];
  const isNoShow = booking.status === 'NO_SHOW_MANUAL' || booking.status === 'NO_SHOW_AUTO';

  return (
    <div 
      className="flex items-center gap-2 px-2 py-1 h-full overflow-hidden rounded"
      style={{ 
        backgroundColor: statusColors.bg,
        borderColor: statusColors.border,
      }}
    >
      {booking.traveler.photo ? (
        <img
          src={booking.traveler.photo}
          alt={booking.traveler.name}
          className="w-6 h-6  object-cover flex-shrink-0"
        />
      ) : (
        <div 
          className="w-6 h-6  flex items-center justify-center text-[10px] font-medium"
          style={{ backgroundColor: '#e5e7eb', color: '#374151' }}
        >
          {getInitials(booking.traveler.name)}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div 
          className={`text-xs font-medium truncate ${isNoShow ? 'line-through' : ''}`}
          style={{ color: statusColors.text }}
        >
          {booking.traveler.name}
        </div>
        <div className="text-[10px] opacity-75 truncate" style={{ color: statusColors.text }}>
          {format(new Date(booking.checkInDate), 'd MMM')} - {format(new Date(booking.checkOutDate), 'd MMM')}
        </div>
      </div>
    </div>
  );
}
