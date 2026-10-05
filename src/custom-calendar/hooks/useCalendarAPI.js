import { useState, useEffect, useCallback } from 'react';
// import { format, addDays } from 'date-fns';

/**
 * useCalendarAPI Hook
 * 
 * Fetches calendar data from either mock data or real API
 * Supports both daily and monthly views
 * 
 * @param {Object} params
 * @param {string} params.companyId - Company ID (required for API)
 * @param {string} params.location - Location filter
 * @param {Date} params.startDate - Start date for date range
 * @param {Date} params.endDate - End date for date range
 * @param {string} params.viewType - 'daily' or 'monthly'
 * @param {boolean} params.useMockData - Use mock data instead of real API
 * @param {Object} params.filters - Additional filters
 * @returns {Object} { data, isLoading, error, refetch }
 */
// export function useCalendarAPI({
//   companyId,
//   location,
//   startDate,
//   endDate,
//   viewType = 'daily',
//   useMockData = false,
//   filters = {}
// }) {
//   const [data, setData] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchData = useCallback(async () => {
//     if (!startDate || !endDate) {
//       setError(new Error('Start date and end date are required'));
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       if (useMockData) {
//         // Use mock data
//         const mockData = await fetchMockData({
//           startDate,
//           endDate,
//           viewType,
//           filters
//         });
//         setData(mockData);
//       } else {
//         // Use real API
//         const apiData = await fetchRealAPI({
//           companyId,
//           location,
//           startDate,
//           endDate,
//           viewType,
//           filters
//         });
//         setData(apiData);
//       }
//     } catch (err) {
//       setError(err);
//       console.error('Calendar API error:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [companyId, location, startDate, endDate, viewType, useMockData, filters]);

//   // Fetch data when parameters change
//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   return {
//     data,
//     isLoading,
//     error,
//     refetch: fetchData
//   };
// }

/**
 * Fetch data from real API
 * Follows the Optimized_Calendar_API_Documentation.md structure
 */
// async function fetchRealAPI({ companyId, location, startDate, endDate, viewType, filters }) {
//   const baseURL = '/api/v1/calendar/';
  
//   // Build query params
//   const params = new URLSearchParams({
//     company_id: companyId,
//     location: location || '',
//     start_date: format(startDate, 'yyyy-MM-dd'),
//     end_date: format(endDate, 'yyyy-MM-dd'),
//     view_type: viewType
//   });

//   // Add optional filters
//   if (filters.roomTypes?.length > 0) {
//     params.append('room_types', filters.roomTypes.join(','));
//   }
//   if (filters.bookingStatuses?.length > 0) {
//     params.append('booking_statuses', filters.bookingStatuses.join(','));
//   }
//   if (filters.roomStatuses?.length > 0) {
//     params.append('room_statuses', filters.roomStatuses.join(','));
//   }

//   const response = await fetch(`${baseURL}?${params.toString()}`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       // Add authentication headers as needed
//       // 'Authorization': `Bearer ${token}`
//     }
//   });

//   if (!response.ok) {
//     throw new Error(`API error: ${response.status} ${response.statusText}`);
//   }

//   const data = await response.json();
//   return data;
// }

/**
 * Fetch mock data
 * Simulates API response structure
 */
// async function fetchMockData({ startDate, endDate, viewType, filters }) {
//   // Simulate API delay
//   await new Promise(resolve => setTimeout(resolve, 300));

//   // Import mock data
//   const { 
//     mockProperties, 
//     mockRooms, 
//     mockBookings, 
//     mockMaintenanceBlocks 
//   } = await import('../../mocks/data');

//   // Transform mock data to API format
//   const properties = mockProperties.slice(0, 5).map(prop => {
//     const rooms = mockRooms[prop.id] || [];
    
//     // Transform rooms
//     const transformedRooms = rooms.map(room => {
//       // Get bookings for this room
//       const roomBookings = mockBookings
//         .filter(b => b.roomId === room.id)
//         .map(booking => ({
//           booking_uid: booking.id,
//           guest_name: booking.guestName || booking.traveler?.name,
//           guest_photo_url: booking.guestPhoto || booking.traveler?.photo,
//           check_in_date: booking.checkInDate,
//           check_out_date: booking.checkOutDate,
//           check_in_time: booking.checkInTime,
//           check_out_time: booking.checkOutTime,
//           status: booking.status,
//           room_uid: room.id,
//           room_name: room.name,
//           bed_name: room.bedName || booking.bedName,
//           bedId: booking.bedId,
//           is_exclusive: booking.isExclusiveRoomBooking || false,
//           company_name: booking.companyName || 'Company',
//           private_note: booking.notes
//         }));

//       // Get blocks for this room
//       const roomBlocks = mockMaintenanceBlocks
//         .filter(b => b.roomId === room.id)
//         .map(block => ({
//           block_uid: block.id,
//           start_date: block.startDate,
//           end_date: block.endDate,
//           block_type: block.type,
//           reason: block.reason,
//           room_uid: room.id,
//           private_note: block.notes
//         }));

//       return {
//         room_uid: room.id,
//         room_name: room.name,
//         bed_name: room.bedName,
//         room_type: room.type,
//         bookings: roomBookings,
//         blocks: roomBlocks
//       };
//     });

//     // Calculate daily availability
//     const daily_availability = {};
//     let current = new Date(startDate);
//     while (current <= endDate) {
//       const dateStr = format(current, 'yyyy-MM-dd');
//       let totalRooms = rooms.length;
//       let availableRooms = 0;
//       let bookedRooms = 0;
//       let blockedRooms = 0;

//       rooms.forEach(room => {
//         const hasBooking = mockBookings.some(b => {
//           const checkIn = new Date(b.checkInDate);
//           const checkOut = new Date(b.checkOutDate);
//           // Include same-day bookings (where checkIn === checkOut)
//           if (checkIn.getTime() === checkOut.getTime()) {
//             return b.roomId === room.id && current.getTime() === checkIn.getTime();
//           }
//           return b.roomId === room.id && current >= checkIn && current < checkOut;
//         });

//         const hasBlock = mockMaintenanceBlocks.some(b => {
//           const start = new Date(b.startDate);
//           const end = new Date(b.endDate);
//           return b.roomId === room.id && current >= start && current <= end;
//         });

//         if (hasBooking) {
//           bookedRooms++;
//         } else if (hasBlock) {
//           blockedRooms++;
//         } else {
//           availableRooms++;
//         }
//       });

//       daily_availability[dateStr] = {
//         total_rooms: totalRooms,
//         available_rooms: availableRooms,
//         booked_rooms: bookedRooms,
//         blocked_rooms: blockedRooms
//       };

//       current = addDays(current, 1);
//     }

//     return {
//       property_uid: prop.id,
//       property_name: prop.name,
//       property_address: prop.address,
//       total_rooms: rooms.length,
//       total_beds: prop.bedCount,
//       checkin_time: prop.checkInTime,
//       checkout_time: prop.checkOutTime,
//       assigned_company: null,
//       rooms: transformedRooms,
//       daily_availability
//     };
//   });

//   // Calculate at_a_glance for the start date (for daily view)
//   const atAGlance = calculateAtAGlance(properties, startDate);

//   return {
//     properties,
//     at_a_glance: atAGlance,
//     view_type: viewType,
//     start_date: format(startDate, 'yyyy-MM-dd'),
//     end_date: format(endDate, 'yyyy-MM-dd')
//   };
// }

/**
 * Calculate "at a glance" summary for a specific date
 */
// function calculateAtAGlance(properties, date) {
//   let totalBookings = 0;
//   const statusBreakdown = {
//     current: 0,
//     checkin_pending: 0,
//     checkout_pending: 0,
//     checkout_upcoming: 0,
//     upcoming: 0,
//     no_show: 0
//   };

//   properties.forEach(property => {
//     property.rooms?.forEach(room => {
//       room.bookings?.forEach(booking => {
//         const checkIn = new Date(booking.check_in_date);
//         const checkOut = new Date(booking.check_out_date);
        
//         // Check if booking is on this date (including same-day bookings)
//         const isSameDay = checkIn.getTime() === checkOut.getTime();
//         const isOnThisDate = isSameDay 
//           ? date.getTime() === checkIn.getTime()
//           : date >= checkIn && date < checkOut;
        
//         if (isOnThisDate) {
//           totalBookings++;
//           const status = booking.status || 'upcoming';
//           if (statusBreakdown[status] !== undefined) {
//             statusBreakdown[status]++;
//           }
//         }
//       });
//     });
//   });

//   return {
//     total_bookings: totalBookings,
//     status_breakdown: statusBreakdown
//   };
// }

/**
 * Hook for fetching booking overview
 */
// export function useBookingOverview(bookingUid, useMockData = true) {
//   const [data, setData] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!bookingUid) return;

//     const fetchBooking = async () => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         if (useMockData) {
//           // Mock data simulation
//           await new Promise(resolve => setTimeout(resolve, 200));
//           setData({ booking_uid: bookingUid, /* ... mock data ... */ });
//         } else {
//           const response = await fetch(`/api/v1/calendar/bookings/${bookingUid}/overview/`);
//           if (!response.ok) throw new Error('Failed to fetch booking');
//           const data = await response.json();
//           setData(data);
//         }
//       } catch (err) {
//         setError(err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchBooking();
//   }, [bookingUid, useMockData]);

//   return { data, isLoading, error };
// }

/**
 * Hook for checking room availability
 */
export function useCheckRoomAvailability() {
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState(null);

  const checkAvailability = useCallback(async ({ room_uid, start_date, end_date, action, guest_count, private_note }, useMockData = true) => {
    setIsChecking(true);
    setError(null);

    try {
      if (useMockData) {
        // Mock response
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
          is_available: true,
          redirect_url: action === 'book' ? `/bookings/new?room=${room_uid}&start=${start_date}&end=${end_date}` : null
        };
      } else {
        const response = await fetch(`/api/v1/calendar/rooms/${room_uid}/availability/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ start_date, end_date, action, guest_count, private_note })
        });

        if (!response.ok) throw new Error('Failed to check availability');
        return await response.json();
      }
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsChecking(false);
    }
  }, []);

  return { checkAvailability, isChecking, error };
}
