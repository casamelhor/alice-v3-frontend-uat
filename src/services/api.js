import axios from 'axios';

// Base API configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication
api.interceptors.request.use((config) => {
  // Add auth token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      console.error('Unauthorized - redirecting to login');
    } else if (error.response?.status === 403) {
      // Handle forbidden
      console.error('Access forbidden');
    }
    return Promise.reject(error);
  }
);

/**
 * Calendar API endpoints
 */
export const calendarApi = {
  /**
   * Get calendar data
   * @param {Object} params
   * @param {string} params.startDate
   * @param {string} params.endDate
   * @param {string[]} [params.propertyIds]
   * @param {import('@/types').BookingStatus[]} [params.statusFilters]
   * @returns {Promise<import('@/types').CalendarDataResponse>}
   */
  getCalendarData: async (params) => {
    const response = await api.get('/calendar/', { params });
    return response.data;
  },

  /**
   * Get occupancy stats
   * @param {Object} params
   * @param {string} params.date
   * @param {string} [params.propertyId]
   * @param {'daily' | 'monthly'} [params.viewMode]
   * @returns {Promise<import('@/types').OccupancyStats>}
   */
  getOccupancyStats: async (params) => {
    const response = await api.get('/calendar/occupancy-stats/', { params });
    return response.data;
  },

  /**
   * Get property tree
   * @param {Object} [params]
   * @param {string[]} [params.expandedNodes]
   * @returns {Promise<Object>}
   */
  getPropertyTree: async (params) => {
    const response = await api.get('/calendar/property-tree/', { params });
    return response.data;
  },

  /**
   * Search bookings
   * @param {string} query
   * @returns {Promise<import('@/types').Booking[]>}
   */
  searchBookings: async (query) => {
    const response = await api.get('/calendar/search/', { params: { q: query } });
    return response.data;
  },
};

/**
 * Booking API endpoints
 */
export const bookingApi = {
  /**
   * Create booking
   * @param {Object} data
   * @param {string} data.propertyId
   * @param {string} data.roomId
   * @param {string} [data.bedId]
   * @param {string} data.travelerId
   * @param {string} [data.companyId]
   * @param {string} data.checkInDate
   * @param {string} data.checkOutDate
   * @param {string} [data.arrivalTime]
   * @param {Array<{ name: string; relation: string; age?: number }>} [data.additionalGuests]
   * @returns {Promise<{ bookingId: string; bookingNumber: string; status: import('@/types').BookingStatus }>}
   */
  createBooking: async (data) => {
    const response = await api.post('/bookings/', data);
    return response.data;
  },

  /**
   * Check in
   * @param {string} bookingId
   * @param {Object} data
   * @param {string} data.checkInTime
   * @param {string} [data.staffNotes]
   * @param {string} [data.guestSignatureUrl]
   * @returns {Promise<Object>}
   */
  checkIn: async (bookingId, data) => {
    const response = await api.post(`/bookings/${bookingId}/check-in/`, data);
    return response.data;
  },

  /**
   * Check out
   * @param {string} bookingId
   * @param {Object} data
   * @param {string} data.checkOutTime
   * @param {string} data.roomCondition
   * @param {number} [data.additionalCharges]
   * @param {string} [data.staffNotes]
   * @returns {Promise<Object>}
   */
  checkOut: async (bookingId, data) => {
    const response = await api.post(`/bookings/${bookingId}/check-out/`, data);
    return response.data;
  },

  /**
   * Mark no-show
   * @param {string} bookingId
   * @param {Object} data
   * @param {string} [data.reason]
   * @returns {Promise<Object>}
   */
  markNoShow: async (bookingId, data) => {
    const response = await api.post(`/bookings/${bookingId}/mark-no-show/`, data);
    return response.data;
  },

  /**
   * Cancel booking
   * @param {string} bookingId
   * @param {Object} data
   * @param {string} data.reason
   * @param {string} [data.messageToGuest]
   * @returns {Promise<Object>}
   */
  cancelBooking: async (bookingId, data) => {
    const response = await api.post(`/bookings/${bookingId}/cancel/`, data);
    return response.data;
  },

  /**
   * Get booking details
   * @param {string} bookingId
   * @returns {Promise<import('@/types').Booking>}
   */
  getBooking: async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}/`);
    return response.data;
  },

  /**
   * Update booking note
   * @param {string} bookingId
   * @param {string} note
   * @returns {Promise<Object>}
   */
  updateNote: async (bookingId, note) => {
    const response = await api.patch(`/bookings/${bookingId}/`, { privateNote: note });
    return response.data;
  },
};

/**
 * Maintenance API endpoints
 */
export const maintenanceApi = {
  /**
   * Get maintenance blocks
   * @param {Object} [params]
   * @param {string} [params.propertyId]
   * @param {string} [params.startDate]
   * @param {string} [params.endDate]
   * @returns {Promise<import('@/types').MaintenanceBlock[]>}
   */
  getBlocks: async (params) => {
    const response = await api.get('/maintenance-blocks/', { params });
    return response.data;
  },

  /**
   * Create maintenance block
   * @param {Object} data
   * @param {string} [data.propertyId]
   * @param {string} [data.roomId]
   * @param {string} [data.bedId]
   * @param {'Maintenance' | 'Renovation' | 'Blocked'} data.blockType
   * @param {string} data.startDate
   * @param {string} data.endDate
   * @param {string} data.reason
   * @returns {Promise<{ blockId: string }>}
   */
  createBlock: async (data) => {
    const response = await api.post('/maintenance-blocks/', data);
    return response.data;
  },

  /**
   * Delete maintenance block
   * @param {string} blockId
   * @returns {Promise<Object>}
   */
  deleteBlock: async (blockId) => {
    const response = await api.delete(`/maintenance-blocks/${blockId}/`);
    return response.data;
  },
};

export default api;
