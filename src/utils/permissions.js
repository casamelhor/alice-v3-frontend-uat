/**
 * Get permissions for a user role
 * @param {import('@/types').UserRole} role - The user role
 * @returns {import('@/types').ActionPermissions} The permissions for the role
 */
export function getPermissions(role) {
  /** @type {Object.<import('@/types').UserRole, import('@/types').ActionPermissions>} */
  const permissions = {
    CASAMELHOR_ADMIN: {
      canCreateBooking: true,
      canCheckIn: true,
      canCheckOut: true,
      canMarkNoShow: true,
      canCancelBooking: true,
      canCreateMaintenanceBlock: true,
      canViewAllProperties: true,
    },
    CASAMELHOR_PROPERTY_MANAGER: {
      canCreateBooking: false,
      canCheckIn: true,
      canCheckOut: true,
      canMarkNoShow: true,
      canCancelBooking: true,
      canCreateMaintenanceBlock: true,
      canViewAllProperties: false,
    },
    CASAMELHOR_BOOKING_MANAGER: {
      canCreateBooking: true,
      canCheckIn: false,
      canCheckOut: false,
      canMarkNoShow: false,
      canCancelBooking: true,
      canCreateMaintenanceBlock: false,
      canViewAllProperties: true,
    },
    CARETAKER: {
      canCreateBooking: false,
      canCheckIn: true,
      canCheckOut: true,
      canMarkNoShow: true,
      canCancelBooking: false,
      canCreateMaintenanceBlock: false,
      canViewAllProperties: false,
    },
    COMPANY_ADMIN: {
      canCreateBooking: true,
      canCheckIn: false,
      canCheckOut: false,
      canMarkNoShow: false,
      canCancelBooking: true,
      canCreateMaintenanceBlock: false,
      canViewAllProperties: false,
    },
    COMPANY_BOOKING_MANAGER: {
      canCreateBooking: true,
      canCheckIn: false,
      canCheckOut: false,
      canMarkNoShow: false,
      canCancelBooking: true,
      canCreateMaintenanceBlock: false,
      canViewAllProperties: false,
    },
    COMPANY_EMPLOYEE: {
      canCreateBooking: false, // May be true if can_create_bookings flag is set
      canCheckIn: false,
      canCheckOut: false,
      canMarkNoShow: false,
      canCancelBooking: false, // Only own bookings
      canCreateMaintenanceBlock: false,
      canViewAllProperties: false,
    },
    EXTERNAL_GUEST: {
      canCreateBooking: false,
      canCheckIn: false,
      canCheckOut: false,
      canMarkNoShow: false,
      canCancelBooking: false,
      canCreateMaintenanceBlock: false,
      canViewAllProperties: false,
    },
  };

  return permissions[role];
}

/**
 * Check if a booking can be checked in based on its status
 * @param {import('@/types').Booking} booking - The booking to check
 * @returns {boolean} Whether the booking can be checked in
 */
export function canCheckInBooking(booking) {
  return booking.status === 'CHECK_IN_PENDING' || booking.status === 'CHECK_IN_UPCOMING';
}

/**
 * Check if a booking can be checked out based on its status
 * @param {import('@/types').Booking} booking - The booking to check
 * @returns {boolean} Whether the booking can be checked out
 */
export function canCheckOutBooking(booking) {
  return booking.status === 'CHECKED_IN' || booking.status === 'CHECKOUT_PENDING';
}

/**
 * Check if a booking can be marked as no-show
 * @param {import('@/types').Booking} booking - The booking to check
 * @returns {boolean} Whether the booking can be marked as no-show
 */
export function canMarkNoShow(booking) {
  return booking.status === 'CHECK_IN_PENDING';
}

/**
 * Check if a booking can be cancelled
 * @param {import('@/types').Booking} booking - The booking to check
 * @returns {boolean} Whether the booking can be cancelled
 */
export function canCancelBooking(booking) {
  /** @type {import('@/types').BookingStatus[]} */
  const terminalStates = [
    'CHECKED_OUT',
    'CANCELLED',
    'NO_SHOW_MANUAL',
    'NO_SHOW_AUTO',
  ];
  return !terminalStates.includes(booking.status) && booking.status !== 'CHECKED_IN';
}

/**
 * @typedef {'check_in' | 'check_out' | 'mark_no_show' | 'cancel' | 'view_details'} BookingAction
 */

/**
 * Get available actions for a booking based on user role and booking status
 * @param {import('@/types').Booking} booking - The booking
 * @param {import('@/types').UserRole} role - The user role
 * @returns {BookingAction[]} The available actions
 */
export function getBookingActions(booking, role) {
  const permissions = getPermissions(role);
  /** @type {BookingAction[]} */
  const actions = ['view_details'];

  if (permissions.canCheckIn && canCheckInBooking(booking)) {
    actions.push('check_in');
  }

  if (permissions.canCheckOut && canCheckOutBooking(booking)) {
    actions.push('check_out');
  }

  if (permissions.canMarkNoShow && canMarkNoShow(booking)) {
    actions.push('mark_no_show');
  }

  if (permissions.canCancelBooking && canCancelBooking(booking)) {
    actions.push('cancel');
  }

  return actions;
}

/**
 * Check if user has access to a property
 * @param {import('@/types').UserRole} role - The user role
 * @param {string} propertyId - The property ID
 * @param {string[]} assignedPropertyIds - The assigned property IDs
 * @returns {boolean} Whether the user has access
 */
export function hasPropertyAccess(role, propertyId, assignedPropertyIds) {
  const permissions = getPermissions(role);
  
  if (permissions.canViewAllProperties) {
    return true;
  }
  
  return assignedPropertyIds.includes(propertyId);
}
