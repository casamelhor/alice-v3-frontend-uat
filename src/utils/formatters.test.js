import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatDateRange,
  formatNights,
  getRelativeDateLabel,
  formatTime,
  getStatusLabel,
  truncateText,
  getInitials,
  formatAvailability,
  formatRoomBedCount,
} from './formatters';
import { addDays, subDays } from 'date-fns';

describe('formatters', () => {
  describe('formatDate', () => {
    it('should format date with default format', () => {
      const date = '2025-12-25';
      expect(formatDate(date)).toBe('25 Dec 2025');
    });

    it('should format date with custom format', () => {
      const date = '2025-12-25';
      expect(formatDate(date, 'd MMM')).toBe('25 Dec');
    });
  });

  describe('formatDateRange', () => {
    it('should format date range in same month', () => {
      const start = '2025-12-01';
      const end = '2025-12-05';
      expect(formatDateRange(start, end)).toBe('1 - 5 Dec');
    });

    it('should format date range across months', () => {
      const start = '2025-11-28';
      const end = '2025-12-02';
      expect(formatDateRange(start, end)).toBe('28 Nov - 2 Dec');
    });
  });

  describe('formatNights', () => {
    it('should return singular for 1 night', () => {
      expect(formatNights(1)).toBe('1 night');
    });

    it('should return plural for multiple nights', () => {
      expect(formatNights(3)).toBe('3 nights');
    });
  });

  describe('getRelativeDateLabel', () => {
    it('should return "Today" for today', () => {
      const today = new Date();
      expect(getRelativeDateLabel(today)).toBe('Today');
    });

    it('should return "Tomorrow" for tomorrow', () => {
      const tomorrow = addDays(new Date(), 1);
      expect(getRelativeDateLabel(tomorrow)).toBe('Tomorrow');
    });

    it('should return "Yesterday" for yesterday', () => {
      const yesterday = subDays(new Date(), 1);
      expect(getRelativeDateLabel(yesterday)).toBe('Yesterday');
    });
  });

  describe('formatTime', () => {
    it('should format morning time correctly', () => {
      expect(formatTime('09:30')).toBe('9:30 AM');
    });

    it('should format afternoon time correctly', () => {
      expect(formatTime('14:00')).toBe('2:00 PM');
    });

    it('should format noon correctly', () => {
      expect(formatTime('12:00')).toBe('12:00 PM');
    });
  });

  describe('getStatusLabel', () => {
    it('should return correct label for CHECK_IN_UPCOMING', () => {
      expect(getStatusLabel('CHECK_IN_UPCOMING')).toBe('Check-in Upcoming');
    });

    it('should return correct label for CHECKED_IN', () => {
      expect(getStatusLabel('CHECKED_IN')).toBe('Current');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const text = 'This is a very long property name';
      expect(truncateText(text, 10)).toBe('This is a ...');
    });

    it('should not truncate short text', () => {
      const text = 'Short';
      expect(truncateText(text, 10)).toBe('Short');
    });
  });

  describe('getInitials', () => {
    it('should return initials from full name', () => {
      expect(getInitials('John Doe')).toBe('JD');
    });

    it('should handle single name', () => {
      expect(getInitials('John')).toBe('J');
    });

    it('should limit to two characters', () => {
      expect(getInitials('John Michael Doe')).toBe('JM');
    });
  });

  describe('formatAvailability', () => {
    it('should format availability counts', () => {
      expect(formatAvailability(3, 5)).toBe('R-3, B-5');
    });
  });

  describe('formatRoomBedCount', () => {
    it('should format room count only', () => {
      expect(formatRoomBedCount(3, 0)).toBe('3 Rooms');
    });

    it('should format room and bed counts', () => {
      expect(formatRoomBedCount(3, 4)).toBe('3 Rooms, 4 Beds');
    });

    it('should use singular for 1 room', () => {
      expect(formatRoomBedCount(1, 2)).toBe('1 Room, 2 Beds');
    });

    it('should use singular for 1 bed', () => {
      expect(formatRoomBedCount(2, 1)).toBe('2 Rooms, 1 Bed');
    });
  });
});
