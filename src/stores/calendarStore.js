import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';

/**
 * @typedef {Object} CalendarFilters
 * @property {number|null} companyId      Single-select (mandatory once set)
 * @property {string[]}    locations      Multi-select city names; empty = all
 * @property {string[]}    propertyIds    Multi-select property UIDs; empty = all
 */

/** @type {CalendarFilters} */
const defaultFilters = {
  companyId: null,
  locations: [],
  propertyIds: [],
};

const CASAMELHOR_ROLE_NAMES = [
  'CasaMelhor Admin',
  'CasaMelhor Booking Manager',
  'CasaMelhor Property Manager',
  'Operations Manager'
];

/**
 * Read the current user's role_name from localStorage. Written at login by
 * Login.js as `role`. Returns null on server / when unset.
 */
function getRoleFromStorage() {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem('role');
  } catch {
    return null;
  }
}

function isCasaMelhorRole(roleName) {
  if (!roleName) return false;
  return CASAMELHOR_ROLE_NAMES.includes(roleName);
}

export const useCalendarStore = create(
  persist(
    (set, get) => ({
      // --- Calendar navigation state ---
      selectedDate: new Date(),
      currentMonth: new Date(),
      viewMode: 'daily',

      // --- Filter state ---
      filters: defaultFilters,

      // --- Expansion / UI state ---
      expandedPropertyIds: new Set(),
      expandedRoomIds: new Set(),
      isSnapshotMinimized: false,

      // --- Modal / selection state ---
      selectedBookingId: null,
      selectedResourceDate: null,
      selectedRoomOverviewId: null,
      selectedMaintenanceId: null,
      isBookingModalOpen: false,
      isRoomAvailabilityModalOpen: false,
      isRoomOverviewModalOpen: false,
      isMaintenanceModalOpen: false,

      // --- User role (hydrated from localStorage on first access) ---
      currentUserRole: getRoleFromStorage(),

      // ===== Date actions =====
      setSelectedDate: (date) => set({ selectedDate: date }),
      setCurrentMonth: (date) => set({ currentMonth: date }),
      goToPreviousMonth: () => set((s) => ({ currentMonth: subMonths(s.currentMonth, 1) })),
      goToNextMonth: () => set((s) => ({ currentMonth: addMonths(s.currentMonth, 1) })),
      goToToday: () => {
        const today = new Date();
        set({ selectedDate: today, currentMonth: today });
      },
      setViewMode: (mode) => set({ viewMode: mode }),

      // ===== Filter actions =====
      /**
       * Set the single-select company. Clears dependent selections so the
       * cascade (Company -> Location -> Property) stays consistent.
       */
      setCompanyFilter: (companyId) => set((state) => ({
        filters: {
          ...state.filters,
          companyId: companyId ?? null,
          locations: [],
          propertyIds: [],
        },
      })),

      /**
       * Replace the multi-select locations list. Drops any selected property
       * UIDs that are no longer valid under the new scope — that final
       * intersection is computed in the component where the property list is
       * available; here we just clear propertyIds to stay safe.
       */
      setLocationsFilter: (locations) => set((state) => ({
        filters: {
          ...state.filters,
          locations: Array.isArray(locations) ? locations : [],
          propertyIds: [],
        },
      })),

      setPropertyIdsFilter: (propertyIds) => set((state) => ({
        filters: {
          ...state.filters,
          propertyIds: Array.isArray(propertyIds) ? propertyIds : [],
        },
      })),

      resetFilters: () => set({ filters: defaultFilters }),

      // ===== User role =====
      setCurrentUserRole: (roleName) => set({ currentUserRole: roleName }),
      hydrateUserRoleFromStorage: () => set({ currentUserRole: getRoleFromStorage() }),

      // ===== Expansion actions =====
      togglePropertyExpanded: (propertyId) => set((state) => {
        const next = new Set(state.expandedPropertyIds);
        if (next.has(propertyId)) next.delete(propertyId);
        else next.add(propertyId);
        return { expandedPropertyIds: next };
      }),
      toggleRoomExpanded: (roomId) => set((state) => {
        const next = new Set(state.expandedRoomIds);
        if (next.has(roomId)) next.delete(roomId);
        else next.add(roomId);
        return { expandedRoomIds: next };
      }),
      expandAllProperties: () => set({ expandedPropertyIds: new Set() }),
      collapseAllProperties: () => set({
        expandedPropertyIds: new Set(),
        expandedRoomIds: new Set(),
      }),

      // ===== UI actions =====
      toggleSnapshotMinimized: () => set((s) => ({ isSnapshotMinimized: !s.isSnapshotMinimized })),
      setSelectedBookingId: (id) => set({ selectedBookingId: id }),
      setSelectedResourceDate: (id) => set({ selectedResourceDate: id }),
      setSelectedRoomOverviewId: (id) => set({ selectedRoomOverviewId: id }),

      // ===== Modal actions =====
      openBookingModal: (bookingId) => set({
        isBookingModalOpen: true,
        selectedBookingId: bookingId,
      }),
      closeBookingModal: () => set({
        isBookingModalOpen: false,
        selectedBookingId: null,
      }),
      openRoomAvailabilityModal: (resourceId) => set({
        isRoomAvailabilityModalOpen: true,
        selectedResourceDate: resourceId,
      }),
      closeRoomAvailabilityModal: () => set({
        isRoomAvailabilityModalOpen: false,
        selectedResourceDate: null,
      }),
      openRoomOverviewModal: (resourceId) => set({
        isRoomOverviewModalOpen: true,
        selectedRoomOverviewId: resourceId,
      }),
      closeRoomOverviewModal: () => set({
        isRoomOverviewModalOpen: false,
        selectedRoomOverviewId: null,
      }),
      openMaintenanceModal: (resourceId) => set({
        isMaintenanceModalOpen: true,
        selectedMaintenanceId: resourceId,
      }),
      closeMaintenanceModal: () => set({
        isMaintenanceModalOpen: false,
        selectedMaintenanceId: null,
      }),

      // ===== Computed getters =====
      getDateRange: () => {
        const state = get();
        const monthStart = startOfMonth(state.currentMonth);
        const monthEnd = endOfMonth(state.currentMonth);
        return {
          start: format(monthStart, 'yyyy-MM-dd'),
          end: format(monthEnd, 'yyyy-MM-dd'),
        };
      },
    }),
    {
      name: 'alice-calendar-storage',
      // Bump version because the `filters` shape changed — stale persisted
      // state from v0 could otherwise hold keys the UI no longer understands.
      version: 1,
      migrate: (persistedState, fromVersion) => {
        if (fromVersion < 1) {
          return {
            ...(persistedState || {}),
            filters: defaultFilters,
          };
        }
        return persistedState;
      },
      partialize: (state) => ({
        expandedPropertyIds: Array.from(state.expandedPropertyIds),
        expandedRoomIds: Array.from(state.expandedRoomIds),
        isSnapshotMinimized: state.isSnapshotMinimized,
        viewMode: state.viewMode,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.expandedPropertyIds = new Set(state.expandedPropertyIds);
          state.expandedRoomIds = new Set(state.expandedRoomIds);
        }
      },
    }
  )
);

export const useSelectedDate = () => useCalendarStore((s) => s.selectedDate);
export const useCurrentMonth = () => useCalendarStore((s) => s.currentMonth);
export const useViewMode = () => useCalendarStore((s) => s.viewMode);
export const useFilters = () => useCalendarStore((s) => s.filters);
export const useIsSnapshotMinimized = () => useCalendarStore((s) => s.isSnapshotMinimized);
export const useCurrentUserRole = () => useCalendarStore((s) => s.currentUserRole);
export const useIsCasaMelhorUser = () => useCalendarStore((s) => isCasaMelhorRole(s.currentUserRole));

export { isCasaMelhorRole, CASAMELHOR_ROLE_NAMES };
