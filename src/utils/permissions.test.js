import { describe, it, expect } from 'vitest';
import {
  getPermissions,
  canCheckInBooking,
  canCheckOutBooking,
  canMarkNoShow,
  canCancelBooking,
  getBookingActions,
  hasPropertyAccess,
} from './permissions';

/**
 * Helper to create a booking with specific status
 * @param {import('@/types').BookingStatus} status
 * @returns {import('@/types').Booking}
 */
function createBooking(status) {
  return {
    id: 'bk-1',
    bookingNumber: 'BK123',
    propertyId: 'prop-1',
    propertyName: 'Test Property',
    roomId: 'room-1',
    roomName: 'Room 1',
    bedId: null,
    bedName: null,
    traveler: {
      id: 'trav-1',
      name: 'John Doe',
      photo: '',
      type: 'Company Employee',
    },
    checkInDate: '2025-12-01',
    checkOutDate: '2025-12-04',
    nights: 3,
    status,
    createdAt: '2025-11-25',
  };
}

describe('permissions', () => {
  describe('getPermissions', () => {
    it('should return full permissions for CASAMELHOR_ADMIN', () => {
      const permissions = getPermissions('CASAMELHOR_ADMIN');
      expect(permissions.canCreateBooking).toBe(true);
      expect(permissions.canCheckIn).toBe(true);
      expect(permissions.canCheckOut).toBe(true);
      expect(permissions.canMarkNoShow).toBe(true);
      expect(permissions.canCancelBooking).toBe(true);
      expect(permissions.canCreateMaintenanceBlock).toBe(true);
      expect(permissions.canViewAllProperties).toBe(true);
    });

    it('should return limited permissions for CARETAKER', () => {
      const permissions = getPermissions('CARETAKER');
      expect(permissions.canCreateBooking).toBe(false);
      expect(permissions.canCheckIn).toBe(true);
      expect(permissions.canCheckOut).toBe(true);
      expect(permissions.canMarkNoShow).toBe(true);
      expect(permissions.canCancelBooking).toBe(false);
      expect(permissions.canCreateMaintenanceBlock).toBe(false);
      expect(permissions.canViewAllProperties).toBe(false);
    });

    it('should return booking-only permissions for COMPANY_BOOKING_MANAGER', () => {
      const permissions = getPermissions('COMPANY_BOOKING_MANAGER');
      expect(permissions.canCreateBooking).toBe(true);
      expect(permissions.canCheckIn).toBe(false);
      expect(permissions.canCheckOut).toBe(false);
      expect(permissions.canCancelBooking).toBe(true);
    });
  });

  describe('canCheckInBooking', () => {
    it('should allow check-in for CHECK_IN_PENDING status', () => {
      const booking = createBooking('CHECK_IN_PENDING');
      expect(canCheckInBooking(booking)).toBe(true);
    });

    it('should allow check-in for CHECK_IN_UPCOMING status', () => {
      const booking = createBooking('CHECK_IN_UPCOMING');
      expect(canCheckInBooking(booking)).toBe(true);
    });

    it('should not allow check-in for CHECKED_IN status', () => {
      const booking = createBooking('CHECKED_IN');
      expect(canCheckInBooking(booking)).toBe(false);
    });
  });

  describe('canCheckOutBooking', () => {
    it('should allow check-out for CHECKED_IN status', () => {
      const booking = createBooking('CHECKED_IN');
      expect(canCheckOutBooking(booking)).toBe(true);
    });

    it('should allow check-out for CHECKOUT_PENDING status', () => {
      const booking = createBooking('CHECKOUT_PENDING');
      expect(canCheckOutBooking(booking)).toBe(true);
    });

    it('should not allow check-out for CHECK_IN_UPCOMING status', () => {
      const booking = createBooking('CHECK_IN_UPCOMING');
      expect(canCheckOutBooking(booking)).toBe(false);
    });
  });

  describe('canMarkNoShow', () => {
    it('should allow marking no-show for CHECK_IN_PENDING', () => {
      const booking = createBooking('CHECK_IN_PENDING');
      expect(canMarkNoShow(booking)).toBe(true);
    });

    it('should not allow marking no-show for CHECKED_IN', () => {
      const booking = createBooking('CHECKED_IN');
      expect(canMarkNoShow(booking)).toBe(false);
    });
  });

  describe('canCancelBooking', () => {
    it('should allow cancellation for CHECK_IN_UPCOMING', () => {
      const booking = createBooking('CHECK_IN_UPCOMING');
      expect(canCancelBooking(booking)).toBe(true);
    });

    it('should not allow cancellation for CHECKED_IN', () => {
      const booking = createBooking('CHECKED_IN');
      expect(canCancelBooking(booking)).toBe(false);
    });

    it('should not allow cancellation for terminal states', () => {
      expect(canCancelBooking(createBooking('CHECKED_OUT'))).toBe(false);
      expect(canCancelBooking(createBooking('CANCELLED'))).toBe(false);
      expect(canCancelBooking(createBooking('NO_SHOW_MANUAL'))).toBe(false);
    });
  });

  describe('getBookingActions', () => {
    it('should return check_in action for admin with pending booking', () => {
      const booking = createBooking('CHECK_IN_PENDING');
      const actions = getBookingActions(booking, 'CASAMELHOR_ADMIN');
      expect(actions).toContain('view_details');
      expect(actions).toContain('check_in');
      expect(actions).toContain('mark_no_show');
    });

    it('should return check_out action for admin with checked-in booking', () => {
      const booking = createBooking('CHECKED_IN');
      const actions = getBookingActions(booking, 'CASAMELHOR_ADMIN');
      expect(actions).toContain('view_details');
      expect(actions).toContain('check_out');
    });

    it('should not return check_in/out for COMPANY_BOOKING_MANAGER', () => {
      const booking = createBooking('CHECK_IN_PENDING');
      const actions = getBookingActions(booking, 'COMPANY_BOOKING_MANAGER');
      expect(actions).toContain('view_details');
      expect(actions).not.toContain('check_in');
      expect(actions).not.toContain('check_out');
    });
  });

  describe('hasPropertyAccess', () => {
    it('should allow access to all properties for CASAMELHOR_ADMIN', () => {
      expect(hasPropertyAccess('CASAMELHOR_ADMIN', 'prop-1', [])).toBe(true);
    });

    it('should restrict access for CARETAKER to assigned properties', () => {
      expect(hasPropertyAccess('CARETAKER', 'prop-1', ['prop-1', 'prop-2'])).toBe(true);
      expect(hasPropertyAccess('CARETAKER', 'prop-3', ['prop-1', 'prop-2'])).toBe(false);
    });
  });
});
