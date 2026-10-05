/**
 * @file Type definitions for Alice Calendar Module
 * Using JSDoc for type documentation
 */

// ============================================
// User Roles as defined in PRD Section 3
// ============================================

/**
 * @typedef {'CASAMELHOR_ADMIN' | 'CASAMELHOR_PROPERTY_MANAGER' | 'CASAMELHOR_BOOKING_MANAGER' | 'CARETAKER' | 'COMPANY_ADMIN' | 'COMPANY_BOOKING_MANAGER' | 'COMPANY_EMPLOYEE' | 'EXTERNAL_GUEST'} UserRole
 */

/** @type {readonly UserRole[]} */
export const USER_ROLES = [
  'CASAMELHOR_ADMIN',
  'CASAMELHOR_PROPERTY_MANAGER',
  'CASAMELHOR_BOOKING_MANAGER',
  'CARETAKER',
  'COMPANY_ADMIN',
  'COMPANY_BOOKING_MANAGER',
  'COMPANY_EMPLOYEE',
  'EXTERNAL_GUEST',
];

// ============================================
// Booking Status as defined in PRD Section 3.2
// ============================================

/**
 * @typedef {'CHECK_IN_UPCOMING' | 'CHECK_IN_PENDING' | 'CHECKED_IN' | 'CHECKOUT_PENDING' | 'CHECKOUT_UPCOMING' | 'CHECKED_OUT' | 'CANCELLED' | 'NO_SHOW_MANUAL' | 'NO_SHOW_AUTO'} BookingStatus
 */

/** @type {readonly BookingStatus[]} */
export const BOOKING_STATUSES = [
  'CHECK_IN_UPCOMING',
  'CHECK_IN_PENDING',
  'CHECKED_IN',
  'CHECKOUT_PENDING',
  'CHECKOUT_UPCOMING',
  'CHECKED_OUT',
  'CANCELLED',
  'NO_SHOW_MANUAL',
  'NO_SHOW_AUTO',
];

// ============================================
// Room Status
// ============================================

/**
 * @typedef {'AVAILABLE' | 'OCCUPIED' | 'BLOCKED' | 'MAINTENANCE'} RoomStatus
 */

/** @type {readonly RoomStatus[]} */
export const ROOM_STATUSES = ['AVAILABLE', 'OCCUPIED', 'BLOCKED', 'MAINTENANCE'];

// ============================================
// Maintenance Block Types
// ============================================

/**
 * @typedef {'Maintenance' | 'Renovation' | 'Blocked'} MaintenanceBlockType
 */

/** @type {readonly MaintenanceBlockType[]} */
export const MAINTENANCE_BLOCK_TYPES = ['Maintenance', 'Renovation', 'Blocked'];

// ============================================
// Calendar View Mode
// ============================================

/**
 * @typedef {'daily' | 'monthly'} ViewMode
 */

/** @type {readonly ViewMode[]} */
export const VIEW_MODES = ['daily', 'monthly'];

// ============================================
// Traveler Type
// ============================================

/**
 * @typedef {'Company Employee' | 'External Guest'} TravelerType
 */

/** @type {readonly TravelerType[]} */
export const TRAVELER_TYPES = ['Company Employee', 'External Guest'];

// ============================================
// Property Model
// ============================================

/**
 * @typedef {Object} Property
 * @property {string} id
 * @property {string} name
 * @property {string} fullAddress
 * @property {string} city
 * @property {string} photo
 * @property {'Active' | 'Inactive'} status
 * @property {string} checkInTime
 * @property {string} checkOutTime
 * @property {number} roomCount
 * @property {number} bedCount
 */

// ============================================
// Room Model
// ============================================

/**
 * @typedef {Object} Room
 * @property {string} id
 * @property {string} propertyId
 * @property {string} name
 * @property {string} roomType
 * @property {boolean} isTwinSharing
 * @property {RoomStatus} status
 * @property {Bed[]} beds
 */

// ============================================
// Bed Model
// ============================================

/**
 * @typedef {Object} Bed
 * @property {string} id
 * @property {string} roomId
 * @property {string} name
 * @property {string} bedType
 * @property {RoomStatus} status
 * @property {'Male' | 'Female' | null} [genderLock]
 * @property {string | null} [genderLockUntil]
 */

// ============================================
// Traveler Model
// ============================================

/**
 * @typedef {Object} Traveler
 * @property {string} id
 * @property {string} name
 * @property {string} photo
 * @property {TravelerType} type
 * @property {string} [companyName]
 * @property {string} [email]
 * @property {string} [phone]
 */

// ============================================
// Company Model
// ============================================

/**
 * @typedef {Object} Company
 * @property {string} id
 * @property {string} name
 * @property {string} [logo]
 */

// ============================================
// Additional Guest
// ============================================

/**
 * @typedef {Object} AdditionalGuest
 * @property {string} name
 * @property {string} relation
 * @property {number} [age]
 */

// ============================================
// Booking Model
// ============================================

/**
 * @typedef {Object} Booking
 * @property {string} id
 * @property {string} bookingNumber
 * @property {string} propertyId
 * @property {string} propertyName
 * @property {string} roomId
 * @property {string} roomName
 * @property {string | null} [bedId]
 * @property {string | null} [bedName]
 * @property {Traveler} traveler
 * @property {string} [companyId]
 * @property {string} [companyName]
 * @property {string} checkInDate
 * @property {string} checkOutDate
 * @property {string} [arrivalTime]
 * @property {number} nights
 * @property {BookingStatus} status
 * @property {AdditionalGuest[]} [additionalGuests]
 * @property {string} [privateNote]
 * @property {string} createdAt
 * @property {string} [checkedInAt]
 * @property {string} [checkedInBy]
 * @property {string} [checkedOutAt]
 * @property {string} [checkedOutBy]
 * @property {string} [cancelledAt]
 * @property {string} [cancelledBy]
 * @property {string} [cancellationReason]
 * @property {boolean} [isExclusiveRoomBooking] - True if entire twin-sharing room is booked for this guest
 */

// ============================================
// Maintenance Block Model
// ============================================

/**
 * @typedef {Object} MaintenanceBlock
 * @property {string} id
 * @property {string} [propertyId]
 * @property {string} [roomId]
 * @property {string} [bedId]
 * @property {MaintenanceBlockType} blockType
 * @property {string} startDate
 * @property {string} endDate
 * @property {string} reason
 * @property {string} createdBy
 * @property {string} createdAt
 */

// ============================================
// Occupancy Stats
// ============================================

/**
 * @typedef {Object} OccupancyStats
 * @property {string} date
 * @property {number} totalBookings
 * @property {number} current
 * @property {number} checkInPending
 * @property {number} checkoutPending
 * @property {number} checkoutUpcoming
 * @property {number} upcoming
 * @property {number} noShow
 * @property {number} [occupancyRate]
 */

// ============================================
// Calendar Resource (for FullCalendar)
// ============================================

/**
 * @typedef {Object} CalendarResourceExtendedProps
 * @property {string} [propertyId]
 * @property {string} [roomId]
 * @property {boolean} [isTwinSharing]
 * @property {RoomStatus} [status]
 */

/**
 * @typedef {Object} CalendarResource
 * @property {string} id
 * @property {string} title
 * @property {'property' | 'room' | 'bed'} type
 * @property {string} [parentId]
 * @property {string} [photo]
 * @property {number} [roomCount]
 * @property {number} [bedCount]
 * @property {string} [roomType]
 * @property {CalendarResourceExtendedProps} [extendedProps]
 */

// ============================================
// Calendar Event (for FullCalendar)
// ============================================

/**
 * @typedef {Object} CalendarEventExtendedProps
 * @property {Booking} [booking]
 * @property {MaintenanceBlock} [maintenanceBlock]
 * @property {'booking' | 'maintenance'} type
 */

/**
 * @typedef {Object} CalendarEvent
 * @property {string} id
 * @property {string} resourceId
 * @property {string} title
 * @property {string} start
 * @property {string} end
 * @property {CalendarEventExtendedProps} extendedProps
 * @property {string} [backgroundColor]
 * @property {string} [borderColor]
 * @property {string} [textColor]
 */

// ============================================
// Availability by Date
// ============================================

/**
 * @typedef {Object} AvailabilityInfo
 * @property {number} availableRooms
 * @property {number} availableBeds
 */

/**
 * @typedef {Object.<string, AvailabilityInfo>} AvailabilityByDate
 */

// ============================================
// Property Tree Node for Sidebar
// ============================================

/**
 * @typedef {Object} PropertyTreeNode
 * @property {string} id
 * @property {'property' | 'room' | 'bed'} type
 * @property {string} name
 * @property {string} [photo]
 * @property {string} [roomType]
 * @property {number} [roomCount]
 * @property {number} [bedCount]
 * @property {PropertyTreeNode[]} [children]
 * @property {boolean} isExpanded
 * @property {boolean} [isTwinSharing]
 * @property {AvailabilityByDate} [availability]
 */

// ============================================
// Calendar Filters
// ============================================

/**
 * @typedef {Object} CalendarFilters
 * @property {string[]} propertyIds
 * @property {BookingStatus[]} statuses
 * @property {string[]} companies
 * @property {('private' | 'twin_sharing')[]} roomTypes
 * @property {RoomStatus[]} roomStatuses
 * @property {string} searchQuery
 */

// ============================================
// Quick Action Types
// ============================================

/**
 * @typedef {'create_booking' | 'block_maintenance' | 'view_bookings' | 'check_in' | 'check_out' | 'mark_no_show'} QuickAction
 */

/** @type {readonly QuickAction[]} */
export const QUICK_ACTIONS = [
  'create_booking',
  'block_maintenance',
  'view_bookings',
  'check_in',
  'check_out',
  'mark_no_show',
];

// ============================================
// Room with Beds (extended)
// ============================================

/**
 * @typedef {Object} RoomWithBeds
 * @property {string} id
 * @property {string} propertyId
 * @property {string} name
 * @property {string} roomType
 * @property {boolean} isTwinSharing
 * @property {RoomStatus} status
 * @property {Bed[]} beds
 * @property {AvailabilityByDate} [availabilityByDate]
 * @property {boolean} [isExpanded]
 */

// ============================================
// Property with Rooms (extended)
// ============================================

/**
 * @typedef {Object} PropertyWithRooms
 * @property {string} id
 * @property {string} name
 * @property {string} fullAddress
 * @property {string} city
 * @property {string} photo
 * @property {'Active' | 'Inactive'} status
 * @property {string} checkInTime
 * @property {string} checkOutTime
 * @property {number} roomCount
 * @property {number} bedCount
 * @property {RoomWithBeds[]} rooms
 * @property {boolean} [isExpanded]
 */

// ============================================
// API Response Types
// ============================================

/**
 * @typedef {Object} CalendarDataResponseMeta
 * @property {{ start: string, end: string }} dateRange
 * @property {string[]} propertyFilters
 * @property {BookingStatus[]} statusFilters
 * @property {number} totalProperties
 * @property {number} totalBookings
 */

/**
 * @typedef {Object} CalendarDataResponse
 * @property {CalendarDataResponseMeta} meta
 * @property {OccupancyStats} occupancyStats
 * @property {PropertyWithRooms[]} properties
 * @property {Booking[]} bookings
 * @property {MaintenanceBlock[]} maintenanceBlocks
 */

// ============================================
// Action Permission Check
// ============================================

/**
 * @typedef {Object} ActionPermissions
 * @property {boolean} canCreateBooking
 * @property {boolean} canCheckIn
 * @property {boolean} canCheckOut
 * @property {boolean} canMarkNoShow
 * @property {boolean} canCancelBooking
 * @property {boolean} canCreateMaintenanceBlock
 * @property {boolean} canViewAllProperties
 */

// ============================================
// Status Color Mapping
// ============================================

/**
 * @typedef {Object} StatusColor
 * @property {string} bg
 * @property {string} border
 * @property {string} text
 */

/** @type {Object.<BookingStatus, StatusColor>} */
export const STATUS_COLORS = {
  CHECK_IN_UPCOMING: { bg: '#EFF6FF', border: '#3B82F6', text: '#1D4ED8' },
  CHECK_IN_PENDING: { bg: '#FFF7ED', border: '#F59E0B', text: '#B45309' },
  CHECKED_IN: { bg: '#ECFDF5', border: '#10B981', text: '#047857' },
  CHECKOUT_PENDING: { bg: '#FEFCE8', border: '#FBBF24', text: '#A16207' },
  CHECKOUT_UPCOMING: { bg: '#F5F3FF', border: '#8B5CF6', text: '#6D28D9' },
  CHECKED_OUT: { bg: '#F9FAFB', border: '#6B7280', text: '#374151' },
  CANCELLED: { bg: '#FEF2F2', border: '#EF4444', text: '#B91C1C' },
  NO_SHOW_MANUAL: { bg: '#FEF2F2', border: '#EF4444', text: '#B91C1C' },
  NO_SHOW_AUTO: { bg: '#FEF2F2', border: '#EF4444', text: '#B91C1C' },
};

// ============================================
// Status Labels
// ============================================

/** @type {Object.<BookingStatus, string>} */
export const STATUS_LABELS = {
  CHECK_IN_UPCOMING: 'Check-in Upcoming',
  CHECK_IN_PENDING: 'Check-in Pending',
  CHECKED_IN: 'Current',
  CHECKOUT_PENDING: 'Checkout Pending',
  CHECKOUT_UPCOMING: 'Checkout Upcoming',
  CHECKED_OUT: 'Checked Out',
  CANCELLED: 'Cancelled',
  NO_SHOW_MANUAL: 'No Show',
  NO_SHOW_AUTO: 'No Show',
};
