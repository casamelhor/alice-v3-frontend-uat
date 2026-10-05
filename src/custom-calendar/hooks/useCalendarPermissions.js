/**
 * @file useCalendarPermissions - memoized access to calendar.* permissions
 */

import { useMemo } from 'react';
import { getCalendarPermissions } from '../utils/calendarPermissions';

/**
 * Turns the raw `permissionData` (fetched via PermissionsCalAndDash) into a
 * stable, easy-to-consume map of booleans, e.g. `{ createBooking: true, ... }`.
 *
 * @param {Object} permissionData - raw permission map keyed by 'calendar.xxx'
 * @returns {Record<string, boolean>}
 */
export function useCalendarPermissions(permissionData) {
  return useMemo(() => getCalendarPermissions(permissionData), [permissionData]);
}
