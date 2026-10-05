/**
 * API Data Transformation Utilities
 * 
 * Functions to transform between API response format and calendar internal format
 */

/**
 * Transform API response to calendar format
 * Ensures consistent data structure for the calendar components
 */
export function transformAPIToCalendar(apiResponse) {
  if (!apiResponse) return null;

  return {
    properties: apiResponse.properties || [],
    atAGlance: apiResponse.at_a_glance || null,
    viewType: apiResponse.view_type || 'daily',
    startDate: apiResponse.start_date,
    endDate: apiResponse.end_date,
    dailyAvailability: extractDailyAvailability(apiResponse.properties)
  };
}

/**
 * Extract daily availability summary from all properties
 */
function extractDailyAvailability(properties) {
  if (!properties || properties.length === 0) return {};

  const dailyAvailability = {};

  properties.forEach(property => {
    if (property.daily_availability) {
      Object.entries(property.daily_availability).forEach(([date, stats]) => {
        if (!dailyAvailability[date]) {
          dailyAvailability[date] = {
            total_rooms: 0,
            available_rooms: 0,
            booked_rooms: 0,
            blocked_rooms: 0
          };
        }

        dailyAvailability[date].total_rooms += stats.total_rooms || 0;
        dailyAvailability[date].available_rooms += stats.available_rooms || 0;
        dailyAvailability[date].booked_rooms += stats.booked_rooms || 0;
        dailyAvailability[date].blocked_rooms += stats.blocked_rooms || 0;
      });
    }
  });

  return dailyAvailability;
}

/**
 * Transform booking data from API to calendar format
 */
export function transformBooking(apiBooking) {
  return {
    booking_uid: apiBooking.booking_uid || apiBooking.id,
    guest_name: apiBooking.guest_name,
    guest_photo_url: apiBooking.guest_photo_url,
    check_in_date: apiBooking.check_in_date,
    check_out_date: apiBooking.check_out_date,
    check_in_time: apiBooking.check_in_time,
    check_out_time: apiBooking.check_out_time,
    status: normalizeBookingStatus(apiBooking.status),
    room_uid: apiBooking.room_uid,
    room_name: apiBooking.room_name,
    bed_name: apiBooking.bed_name,
    property_name: apiBooking.property_name,
    property_address: apiBooking.property_address,
    company_name: apiBooking.company_name,
    private_note: apiBooking.private_note
  };
}

/**
 * Normalize booking status to consistent format
 */
function normalizeBookingStatus(status) {
  const statusMap = {
    'checked_in': 'current',
    'current': 'current',
    'checkin_upcoming': 'checkin_upcoming',
    'checkin_pending': 'checkin_pending',
    'checkout_pending': 'checkout_pending',
    'checkout_upcoming': 'checkout_upcoming',
    'upcoming': 'upcoming',
    'no_show': 'no_show',
    'checked_out': 'checked_out',
    'cancelled': 'cancelled'
  };

  return statusMap[status] || status;
}

/**
 * Transform maintenance block from API to calendar format
 */
export function transformBlock(apiBlock) {
  return {
    block_uid: apiBlock.block_uid || apiBlock.id,
    start_date: apiBlock.start_date,
    end_date: apiBlock.end_date,
    block_type: apiBlock.block_type || 'maintenance',
    reason: apiBlock.reason,
    room_uid: apiBlock.room_uid,
    room_name: apiBlock.room_name,
    bed_name: apiBlock.bed_name,
    property_name: apiBlock.property_name,
    property_address: apiBlock.property_address,
    private_note: apiBlock.private_note
  };
}

/**
 * Transform property data from API to calendar format
 */
export function transformProperty(apiProperty) {
  return {
    property_uid: apiProperty.property_uid || apiProperty.id,
    property_name: apiProperty.property_name,
    property_address: apiProperty.property_address,
    total_rooms: apiProperty.total_rooms,
    total_beds: apiProperty.total_beds,
    checkin_time: apiProperty.checkin_time,
    checkout_time: apiProperty.checkout_time,
    assigned_company: apiProperty.assigned_company,
    rooms: apiProperty.rooms?.map(transformRoom) || [],
    daily_availability: apiProperty.daily_availability || {}
  };
}

/**
 * Transform room data from API to calendar format
 */
export function transformRoom(apiRoom) {
  return {
    room_uid: apiRoom.room_uid || apiRoom.id,
    room_name: apiRoom.room_name,
    bed_name: apiRoom.bed_name,
    room_type: apiRoom.room_type,
    bookings: apiRoom.bookings?.map(transformBooking) || [],
    blocks: apiRoom.blocks?.map(transformBlock) || []
  };
}

/**
 * Transform calendar filters to API query parameters
 */
export function transformFiltersToAPIParams(filters) {
  const params = {};

  if (filters.companies && filters.companies.length > 0) {
    params.company_ids = filters.companies.join(',');
  }

  if (filters.location) {
    params.location = filters.location;
  }

  if (filters.roomTypes && filters.roomTypes.length > 0) {
    params.room_types = filters.roomTypes.join(',');
  }

  if (filters.roomStatuses && filters.roomStatuses.length > 0) {
    params.room_statuses = filters.roomStatuses.join(',');
  }

  if (filters.bookingStatuses && filters.bookingStatuses.length > 0) {
    params.booking_statuses = filters.bookingStatuses.join(',');
  }

  return params;
}

/**
 * Transform "at a glance" data from API
 */
export function transformAtAGlance(apiAtAGlance) {
  if (!apiAtAGlance) return null;

  return {
    total_bookings: apiAtAGlance.total_bookings || 0,
    status_breakdown: {
      current: apiAtAGlance.status_breakdown?.current || 0,
      checkin_pending: apiAtAGlance.status_breakdown?.checkin_pending || 0,
      checkout_pending: apiAtAGlance.status_breakdown?.checkout_pending || 0,
      checkout_upcoming: apiAtAGlance.status_breakdown?.checkout_upcoming || 0,
      upcoming: apiAtAGlance.status_breakdown?.upcoming || 0,
      no_show: apiAtAGlance.status_breakdown?.no_show || 0
    }
  };
}

/**
 * Extract all bookings from properties structure
 */
export function extractAllBookings(properties) {
  const bookings = [];

  properties?.forEach(property => {
    property.rooms?.forEach(room => {
      room.bookings?.forEach(booking => {
        bookings.push({
          ...booking,
          propertyId: property.property_uid,
          propertyName: property.property_name,
          roomId: room.room_uid,
          roomName: room.room_name,
          defaultCheckInTime: property.checkin_time,
          defaultCheckOutTime: property.checkout_time
        });
      });
    });
  });

  return bookings;
}

/**
 * Extract all blocks from properties structure
 */
export function extractAllBlocks(properties) {
  const blocks = [];

  properties?.forEach(property => {
    property.rooms?.forEach(room => {
      room.blocks?.forEach(block => {
        blocks.push({
          ...block,
          propertyId: property.property_uid,
          propertyName: property.property_name,
          roomId: room.room_uid,
          roomName: room.room_name
        });
      });
    });
  });

  return blocks;
}

/**
 * Build calendar data structure with extracted bookings and blocks
 */
export function buildCalendarData(apiResponse) {
  const transformed = transformAPIToCalendar(apiResponse);
  
  if (!transformed) return null;

  return {
    ...transformed,
    properties: transformed.properties,
    bookings: extractAllBookings(transformed.properties),
    blocks: extractAllBlocks(transformed.properties),
    daily_availability: transformed.dailyAvailability
  };
}

/**
 * Validate API response structure
 */
export function validateAPIResponse(response) {
  const errors = [];

  if (!response) {
    errors.push('Response is null or undefined');
    return { isValid: false, errors };
  }

  if (!Array.isArray(response.properties)) {
    errors.push('properties must be an array');
  }

  if (response.start_date && !isValidDate(response.start_date)) {
    errors.push('start_date is not a valid date');
  }

  if (response.end_date && !isValidDate(response.end_date)) {
    errors.push('end_date is not a valid date');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Check if a string is a valid date in YYYY-MM-DD format
 */
function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

/**
 * Transform availability check response
 */
export function transformAvailabilityCheckResponse(apiResponse) {
  return {
    is_available: apiResponse.is_available || false,
    redirect_url: apiResponse.redirect_url || null,
    error_message: apiResponse.error_message || null,
    conflicts: apiResponse.conflicts || []
  };
}
