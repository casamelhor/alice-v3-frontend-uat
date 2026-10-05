import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Simulate API call with delay
 * @template T
 * @param {T} data - Data to return
 * @param {number} [delay=500] - Delay in ms
 * @returns {Promise<T>}
 */
const simulateApiCall = async (data, delay = 500) => {
  await new Promise(resolve => setTimeout(resolve, delay));
  return data;
};

/**
 * Hook for booking actions (check-in, check-out, no-show, cancel)
 * @returns {Object} Booking action methods and state
 */
export function useBookingActions() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check-in mutation
  const checkInMutation = useMutation({
    /**
     * @param {{ bookingId: string; checkInTime: string; staffNotes?: string }} data
     */
    mutationFn: async (data) => {
      return simulateApiCall({
        success: true,
        bookingId: data.bookingId,
        newStatus: 'CHECKED_IN',
        checkedInAt: data.checkInTime,
        message: 'Guest checked in successfully',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['occupancy-stats'] });
    },
  });

  // Check-out mutation
  const checkOutMutation = useMutation({
    /**
     * @param {{ bookingId: string; checkOutTime: string; roomCondition: 'Good' | 'Fair' | 'Poor'; additionalCharges?: number; staffNotes?: string }} data
     */
    mutationFn: async (data) => {
      return simulateApiCall({
        success: true,
        bookingId: data.bookingId,
        newStatus: 'CHECKED_OUT',
        checkedOutAt: data.checkOutTime,
        message: 'Guest checked out successfully',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['occupancy-stats'] });
    },
  });

  // Mark no-show mutation
  const markNoShowMutation = useMutation({
    /**
     * @param {{ bookingId: string; reason?: string }} data
     */
    mutationFn: async (data) => {
      return simulateApiCall({
        success: true,
        bookingId: data.bookingId,
        newStatus: 'NO_SHOW_MANUAL',
        message: 'Booking marked as no-show',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['occupancy-stats'] });
    },
  });

  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    /**
     * @param {{ bookingId: string; reason: string; messageToGuest?: string }} data
     */
    mutationFn: async (data) => {
      return simulateApiCall({
        success: true,
        bookingId: data.bookingId,
        newStatus: 'CANCELLED',
        message: 'Booking cancelled successfully',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['occupancy-stats'] });
    },
  });

  /**
   * Check in a guest
   * @param {string} bookingId - The booking ID
   * @param {string} [staffNotes] - Optional staff notes
   * @returns {Promise<Object>}
   */
  const checkIn = useCallback(async (bookingId, staffNotes) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await checkInMutation.mutateAsync({
        bookingId,
        checkInTime: new Date().toISOString(),
        staffNotes,
      });
      return result;
    } catch (err) {
      setError('Failed to check in guest');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [checkInMutation]);

  /**
   * Check out a guest
   * @param {string} bookingId - The booking ID
   * @param {'Good' | 'Fair' | 'Poor'} [roomCondition='Good'] - Room condition
   * @param {string} [staffNotes] - Optional staff notes
   * @returns {Promise<Object>}
   */
  const checkOut = useCallback(async (bookingId, roomCondition = 'Good', staffNotes) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await checkOutMutation.mutateAsync({
        bookingId,
        checkOutTime: new Date().toISOString(),
        roomCondition,
        staffNotes,
      });
      return result;
    } catch (err) {
      setError('Failed to check out guest');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [checkOutMutation]);

  /**
   * Mark booking as no-show
   * @param {string} bookingId - The booking ID
   * @param {string} [reason] - Optional reason
   * @returns {Promise<Object>}
   */
  const markNoShow = useCallback(async (bookingId, reason) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await markNoShowMutation.mutateAsync({
        bookingId,
        reason,
      });
      return result;
    } catch (err) {
      setError('Failed to mark booking as no-show');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [markNoShowMutation]);

  /**
   * Cancel a booking
   * @param {string} bookingId - The booking ID
   * @param {string} reason - Cancellation reason
   * @param {string} [messageToGuest] - Optional message to guest
   * @returns {Promise<Object>}
   */
  const cancelBooking = useCallback(async (bookingId, reason, messageToGuest) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cancelBookingMutation.mutateAsync({
        bookingId,
        reason,
        messageToGuest,
      });
      return result;
    } catch (err) {
      setError('Failed to cancel booking');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [cancelBookingMutation]);

  return {
    checkIn,
    checkOut,
    markNoShow,
    cancelBooking,
    isLoading,
    error,
    isCheckingIn: checkInMutation.isPending,
    isCheckingOut: checkOutMutation.isPending,
    isMarkingNoShow: markNoShowMutation.isPending,
    isCancelling: cancelBookingMutation.isPending,
  };
}

/**
 * Hook for creating maintenance blocks
 * @returns {Object} Maintenance action methods and state
 */
export function useMaintenanceActions() {
  const queryClient = useQueryClient();

  const createBlockMutation = useMutation({
    /**
     * @param {{ propertyId?: string; roomId?: string; bedId?: string; blockType: 'Maintenance' | 'Renovation' | 'Blocked'; startDate: string; endDate: string; reason: string }} data
     */
    mutationFn: async (data) => {
      return simulateApiCall({
        success: true,
        blockId: `mb-${Date.now()}`,
        message: 'Maintenance block created successfully',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-blocks'] });
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
  });

  const deleteBlockMutation = useMutation({
    /**
     * @param {string} blockId
     */
    mutationFn: async (blockId) => {
      return simulateApiCall({
        success: true,
        blockId,
        message: 'Maintenance block removed successfully',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-blocks'] });
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
  });

  return {
    createBlock: createBlockMutation.mutateAsync,
    deleteBlock: deleteBlockMutation.mutateAsync,
    isCreating: createBlockMutation.isPending,
    isDeleting: deleteBlockMutation.isPending,
  };
}
