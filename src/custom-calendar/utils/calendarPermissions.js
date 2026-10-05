/**
 * @file Central helper for `calendar.*` permission checks.
 *
 * Consumes the `permissionData` object returned by the
 * `PermissionsCalAndDash` API (see CustomCalendarPage.jsx), which has the shape:
 *   { "calendar.create_booking": { allowed: true, scope: "ALL" }, ... }
 *
 * Components should not read `permissionData['calendar.xxx']?.allowed`
 * directly — go through these helpers so that:
 *   - missing/unknown keys fail safe (treated as NOT allowed)
 *   - the full list of calendar permission keys lives in one place
 */

/**
 * Whether a single permission key is allowed.
 * Fails safe (returns false) if permissionData or the key is missing.
 * @param {Object} permissionData
 * @param {string} key - e.g. 'calendar.create_booking'
 * @returns {boolean}
 */
export function hasCalendarPermission(permissionData, key) {
  return Boolean(permissionData?.[key]?.allowed);
}

/**
 * Scope for a given permission key ('ALL' | 'NONE' | ...).
 * @param {Object} permissionData
 * @param {string} key
 * @returns {string}
 */
export function getCalendarPermissionScope(permissionData, key) {
  return permissionData?.[key]?.scope || 'NONE';
}

/**
 * Every `calendar.*` permission key, mapped to a short camelCase name.
 * Keep this in sync with the permission keys returned by the API.
 */
export const CALENDAR_PERMISSION_KEYS = {
  access: 'calendar.access',
  viewDaily: 'calendar.view_daily',
  viewMonthly: 'calendar.view_monthly',
  navigateDates: 'calendar.navigate_dates',
  filterProperty: 'calendar.filter_property',
  filterStatus: 'calendar.filter_status',
  snapshotPanel: 'calendar.snapshot_panel',
  snapshotToggle: 'calendar.snapshot_toggle',
  viewAllBookings: 'calendar.view_all_bookings',
  viewOwnBookings: 'calendar.view_own_bookings',
  viewTileDetails: 'calendar.view_tile_details',
  viewGuestDetails: 'calendar.view_guest_details',
  createBooking: 'calendar.create_booking',
  checkIn: 'calendar.check_in',
  checkOut: 'calendar.check_out',
  cancel: 'calendar.cancel',
  modifyDates: 'calendar.modify_dates',
  markNoShow: 'calendar.mark_no_show',
  checkinFormalities: 'calendar.checkin_formalities',
  viewMaintenance: 'calendar.view_maintenance',
  viewInactivePeriods: 'calendar.view_inactive_periods',
  markPropertyInactive: 'calendar.mark_property_inactive',
  markRoomInactive: 'calendar.mark_room_inactive',
  reactivate: 'calendar.reactivate',
  opAssignedOnly: 'calendar.op_assigned_only',
  opTodayCheckins: 'calendar.op_today_checkins',
  opTodayCheckouts: 'calendar.op_today_checkouts',
  opOccupants: 'calendar.op_occupants',
  opCheckIn: 'calendar.op_check_in',
  opCheckOut: 'calendar.op_check_out',
  opGuestDetails: 'calendar.op_guest_details',
  personalView: 'calendar.personal_view',
  personalOwnTiles: 'calendar.personal_own_tiles',
  personalTileDetails: 'calendar.personal_tile_details',
  personalCancelOwn: 'calendar.personal_cancel_own',
  viewCompanyBookings: 'calendar.view_company_bookings',
};

/**
 * Flattens `permissionData` into a plain `{ [camelCaseName]: boolean }` map
 * for every key in CALENDAR_PERMISSION_KEYS, so components can destructure
 * exactly what they need, e.g.:
 *
 *   const { createBooking, viewGuestDetails } = getCalendarPermissions(permissionData);
 *
 * @param {Object} permissionData
 * @returns {Record<keyof typeof CALENDAR_PERMISSION_KEYS, boolean>}
 */
export function getCalendarPermissions(permissionData) {
  return Object.fromEntries(
    Object.entries(CALENDAR_PERMISSION_KEYS).map(([name, key]) => [
      name,
      hasCalendarPermission(permissionData, key),
    ])
  );
}
