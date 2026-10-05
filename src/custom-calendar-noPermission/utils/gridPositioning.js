// /**
//  * @file Grid positioning utilities for custom calendar
//  */

// import { differenceInDays, parseISO, startOfDay } from 'date-fns';
// import { calculateCheckInOffset, calculateCheckOutOffset } from './dateUtils';

// /**
//  * Calculate CSS positioning for a booking card within the timeline grid
//  * @param {Object} params
//  * @param {string} params.checkInDate - Check-in date (yyyy-MM-dd)
//  * @param {string} params.checkOutDate - Check-out date (yyyy-MM-dd)
//  * @param {string} [params.checkInTime] - Check-in time (HH:mm)
//  * @param {string} [params.checkOutTime] - Check-out time (HH:mm)
//  * @param {Date} params.viewStart - Calendar view start date
//  * @param {number} params.dayWidth - Width of each day column in pixels
//  * @param {string} [params.defaultCheckInTime='12:00'] - Property's default check-in time
//  * @param {string} [params.defaultCheckOutTime='11:00'] - Property's default check-out time
//  * @returns {{ left: number, width: number, checkInOffset: number, checkOutOffset: number } | null}
//  */
// export function calculateBookingPosition({
//   checkInDate,
//   checkOutDate,
//   checkInTime,
//   checkOutTime,
//   viewStart,
//   dayWidth,
//   defaultCheckInTime = '12:00',
//   defaultCheckOutTime = '11:00',
// }) {
//   const checkIn = parseISO(checkInDate);
//   const checkOut = parseISO(checkOutDate);
//   const viewStartDay = startOfDay(viewStart);
  
//   // Calculate column positions
//   const startCol = differenceInDays(startOfDay(checkIn), viewStartDay);
//   const endCol = differenceInDays(startOfDay(checkOut), viewStartDay);
  
//   // Calculate partial day offsets
//   const checkInOffset = calculateCheckInOffset(checkInTime, defaultCheckInTime);
//   const checkOutOffset = calculateCheckOutOffset(checkOutTime, defaultCheckOutTime);
  
//   // Calculate pixel positions
//   const leftOffset = checkInOffset * dayWidth;
//   const rightOffset = checkOutOffset * dayWidth;
  
//   // Handle same-day bookings (check-in and check-out on the same date)
//   const isSameDay = checkInDate === checkOutDate;
  
//   let left, width;
  
//   if (isSameDay) {
//     // For same-day bookings, position within a single day
//     left = (startCol * dayWidth) + leftOffset;
//     // Width is the difference between check-in and check-out times
//     width = (1 - checkInOffset - checkOutOffset) * dayWidth;
//   } else {
//     // For multi-day bookings, use the standard calculation
//     left = (startCol * dayWidth) + leftOffset;
//     const totalWidth = (endCol - startCol + 1) * dayWidth; // Include checkout day
//     width = totalWidth - leftOffset - rightOffset;
//   }
  
//   return {
//     left: Math.max(0, left),
//     width: Math.max(20, width), // Minimum width for visibility
//     checkInOffset,
//     checkOutOffset,
//   };
// }

// /**
//  * Calculate CSS positioning for a maintenance block
//  * @param {Object} params
//  * @param {string} params.startDate - Block start date (yyyy-MM-dd)
//  * @param {string} params.endDate - Block end date (yyyy-MM-dd)
//  * @param {Date} params.viewStart - Calendar view start date
//  * @param {number} params.dayWidth - Width of each day column in pixels
//  * @returns {{ left: number, width: number } | null}
//  */
// export function calculateBlockPosition({
//   startDate,
//   endDate,
//   viewStart,
//   dayWidth,
// }) {
//   const start = parseISO(startDate);
//   const end = parseISO(endDate);
//   const viewStartDay = startOfDay(viewStart);
  
//   // Calculate column positions
//   const startCol = differenceInDays(startOfDay(start), viewStartDay);
//   const endCol = differenceInDays(startOfDay(end), viewStartDay);
  
//   const left = startCol * dayWidth;
//   const width = (endCol - startCol + 1) * dayWidth; // Include end day
  
//   return {
//     left: Math.max(0, left),
//     width: Math.max(20, width),
//   };
// }

// /**
//  * Build flat list of resources (rows) from hierarchical property data
//  * @param {Array} properties - Array of properties with rooms and beds
//  * @param {Set<string>} expandedPropertyIds - Set of expanded property IDs
//  * @param {Set<string>} expandedRoomIds - Set of expanded room IDs
//  * @returns {Array<{id: string, type: 'property'|'room'|'bed', name: string, data: Object, depth: number}>}
//  */
// export function buildResourceList(properties, expandedPropertyIds, expandedRoomIds) {
//   const resources = [];
  
//   properties.forEach(property => {
//     // Add property row
//     resources.push({
//       id: property.property_uid || property.id,
//       type: 'property',
//       name: property.property_name || property.name,
//       data: property,
//       depth: 0,
//     });
    
//     // If property is expanded, add rooms
//     const propId = property.property_uid || property.id;
//     if (expandedPropertyIds.has(propId)) {
//       const rooms = property.rooms || [];
      
//       rooms.forEach(room => {
//         const roomId = room.room_uid || room.id;
//         const isTwinSharing = room.room_type === 'Twin-Sharing' || room.isTwinSharing;
//         const hasBeds = room.beds && room.beds.length > 0;
        
//         // Add room row
//         resources.push({
//           id: roomId,
//           type: 'room',
//           name: room.room_name || room.name,
//           data: { ...room, propertyId: propId,propertyItem:property },
//           depth: 1,
//         });
        
//         // If room is twin-sharing, expanded, and has beds, add bed rows
//         if (isTwinSharing && hasBeds && expandedRoomIds.has(roomId)) {
//           room.beds.forEach((bed, index) => {
//             resources.push({
//               id: bed.id || `${roomId}-bed-${index}`,
//               type: 'bed',
//               name: bed.bed_name || bed.name || `Bed ${String.fromCharCode(65 + index)}`,
//               data: { ...bed, roomId,roomName:room.room_name,available_beds:room.available_beds, propertyId: propId,propertyItem:property, bedIndex: index,beds: room.beds.map(val => ({ name: val.bed_name, bed_type: val.bed_type })) },
//               depth: 2,
//             });
//           });
//         }
//       });
//     }
//   });
  
//   return resources;
// }

// /**
//  * Find bookings for a specific resource (room or bed)
//  * @param {Array} allBookings - All bookings
//  * @param {string} resourceId - Resource ID (room or bed)
//  * @param {'room' | 'bed'} resourceType - Type of resource
//  * @returns {Array} Bookings for this resource
//  */
// export function getBookingsForResource(allBookings, resourceId, resourceType) {
//   return allBookings.filter(booking => {
//     if (resourceType === 'bed') {
//       return booking.bedId === resourceId || 
//              (booking.bed_index !== undefined && `bed-${booking.bed_index}` === resourceId);
//     }
//     return booking.roomId === resourceId || booking.room_uid === resourceId;
//   });
// }

// /**
//  * Find maintenance blocks for a specific resource
//  * @param {Array} allBlocks - All maintenance blocks
//  * @param {string} resourceId - Resource ID (room or bed)
//  * @param {'room' | 'bed'} resourceType - Type of resource
//  * @returns {Array} Blocks for this resource
//  */
// export function getBlocksForResource(allBlocks, resourceId, resourceType) {
//   return allBlocks.filter(block => {
//     if (resourceType === 'bed') {
//       return block.bedId === resourceId || 
//              (block.bed_index !== undefined && `bed-${block.bed_index}` === resourceId);
//     }
//     return block.roomId === resourceId || block.room_uid === resourceId;
//   });
// }

// /**
//  * Calculate the day width based on view mode
//  * @param {'daily' | 'monthly'} viewMode - Calendar view mode
//  * @returns {number} Day width in pixels
//  */
// export function getDayWidth(viewMode) {
//   return viewMode === 'daily' ? 145 : 60;
// }

// /**
//  * Calculate total timeline width
//  * @param {number} numDays - Number of days in the view
//  * @param {number} dayWidth - Width of each day column
//  * @returns {number} Total width in pixels
//  */
// export function getTimelineWidth(numDays, dayWidth) {
//   return numDays * dayWidth;
// }


/**
 * @file Grid positioning utilities for custom calendar
 */

import { differenceInDays, parseISO, startOfDay } from 'date-fns';
import { calculateCheckInOffset, calculateCheckOutOffset } from './dateUtils';
import { isSameDay } from "date-fns";


/**
 * Calculate CSS positioning for a booking card within the timeline grid
 * @param {Object} params
 * @param {string} params.checkInDate - Check-in date (yyyy-MM-dd)
 * @param {string} params.checkOutDate - Check-out date (yyyy-MM-dd)
 * @param {string} [params.checkInTime] - Check-in time (HH:mm)
 * @param {string} [params.checkOutTime] - Check-out time (HH:mm)
 * @param {Date} params.viewStart - Calendar view start date
 * @param {number} params.dayWidth - Width of each day column in pixels
 * @param {string} [params.defaultCheckInTime='12:00'] - Property's default check-in time
 * @param {string} [params.defaultCheckOutTime='11:00'] - Property's default check-out time
 * @returns {{ left: number, width: number, checkInOffset: number, checkOutOffset: number } | null}
 */
export function calculateBookingPosition({
  checkInDate,
  checkOutDate,
  checkInTime,
  checkOutTime,
  viewStart,
  dayWidth,
  numDays,
  defaultCheckInTime = '12:00',
  defaultCheckOutTime = '11:00',
}) {
  const checkIn = parseISO(checkInDate);
  const checkOut = parseISO(checkOutDate);
  const viewStartDay = startOfDay(viewStart);

  // Calculate column positions
  const startCol = differenceInDays(startOfDay(checkIn), viewStartDay);
  const endCol = differenceInDays(startOfDay(checkOut), viewStartDay);

  // Calculate partial day offsets
  const checkInOffset = calculateCheckInOffset(
    checkInTime,
    defaultCheckInTime
  );
  const checkOutOffset = calculateCheckOutOffset(
    checkOutTime,
    defaultCheckOutTime
  );

  // Calculate pixel offsets
  const leftOffset = checkInOffset * dayWidth;
  const rightOffset = checkOutOffset * dayWidth;

  // Same-day booking
  const sameDay = isSameDay(checkIn, checkOut);

  // Raw (unclipped) booking edges
  let rawLeft;
  let rawRight;

  if (sameDay) {
    rawLeft = (startCol * dayWidth) + leftOffset;
    rawRight =
      rawLeft + (1 - checkInOffset - checkOutOffset) * dayWidth;
  } else {
    rawLeft = (startCol * dayWidth) + leftOffset;
    rawRight = ((endCol + 1) * dayWidth) - rightOffset;
  }

  // Clip booking to visible timeline
  const viewWidth =
    typeof numDays === 'number'
      ? numDays * dayWidth
      : rawRight;

  const clippedLeft = Math.max(0, rawLeft);
  const clippedRight = Math.min(viewWidth, rawRight);

  // Booking completely outside view
  if (clippedRight <= clippedLeft) {
    return null;
  }

  return {
    left: clippedLeft,
    width: Math.max(20, clippedRight - clippedLeft),
    checkInOffset,
    checkOutOffset,
  };
}

/**
 * Calculate CSS positioning for a maintenance block
 * @param {Object} params
 * @param {string} params.startDate - Block start date (yyyy-MM-dd)
 * @param {string} params.endDate - Block end date (yyyy-MM-dd)
 * @param {Date} params.viewStart - Calendar view start date
 * @param {number} params.dayWidth - Width of each day column in pixels
 * @returns {{ left: number, width: number } | null}
 */
export function calculateBlockPosition({
  startDate,
  endDate,
  viewStart,
  dayWidth,
  numDays,
}) {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const viewStartDay = startOfDay(viewStart);

  // Calculate column positions
  const startCol = differenceInDays(startOfDay(start), viewStartDay);
  const endCol = differenceInDays(startOfDay(end), viewStartDay);

  const rawLeft = startCol * dayWidth;
  const rawRight = (endCol + 1) * dayWidth;

  // Clip block to visible timeline
  const viewWidth =
    typeof numDays === 'number'
      ? numDays * dayWidth
      : rawRight;

  const clippedLeft = Math.max(0, rawLeft);
  const clippedRight = Math.min(viewWidth, rawRight);

  // Block completely outside view
  if (clippedRight <= clippedLeft) {
    return null;
  }

  return {
    left: clippedLeft,
    width: Math.max(20, clippedRight - clippedLeft),
  };
}

/**
 * Build flat list of resources (rows) from hierarchical property data
 * @param {Array} properties - Array of properties with rooms and beds
 * @param {Set<string>} expandedPropertyIds - Set of expanded property IDs
 * @param {Set<string>} expandedRoomIds - Set of expanded room IDs
 * @returns {Array<{id: string, type: 'property'|'room'|'bed', name: string, data: Object, depth: number}>}
 */
export function buildResourceList(properties, expandedPropertyIds, expandedRoomIds) {
  const resources = [];
  
  properties.forEach(property => {
    // Add property row
    resources.push({
      id: property.property_uid || property.id,
      type: 'property',
      name: property.property_name || property.name,
      data: property,
      depth: 0,
    });
    
    // If property is expanded, add rooms
    const propId = property.property_uid || property.id;
    if (expandedPropertyIds.has(propId)) {
      const rooms = property.rooms || [];
      
      rooms.forEach(room => {
        const roomId = room.room_uid || room.id;
        const isTwinSharing = room.room_type === 'Twin-Sharing' || room.isTwinSharing;
        const hasBeds = room.beds && room.beds.length > 0;
        
        // Add room row
        resources.push({
          id: roomId,
          type: 'room',
          name: room.room_name || room.name,
          data: { ...room, propertyId: propId,propertyItem:property },
          depth: 1,
        });
        
        // If room is twin-sharing, expanded, and has beds, add bed rows
        if (isTwinSharing && hasBeds && expandedRoomIds.has(roomId)) {
          room.beds.forEach((bed, index) => {
            resources.push({
              id: bed.id || `${roomId}-bed-${index}`,
              type: 'bed',
              name: bed.bed_name || bed.name || `Bed ${String.fromCharCode(65 + index)}`,
              data: { ...bed, roomId,roomName:room.room_name,available_beds:room.available_beds, propertyId: propId,propertyItem:property, bedIndex: index,beds: room.beds.map(val => ({ name: val.bed_name, bed_type: val.bed_type })) },
              depth: 2,
            });
          });
        }
      });
    }
  });
  
  return resources;
}

/**
 * Find bookings for a specific resource (room or bed)
 * @param {Array} allBookings - All bookings
 * @param {string} resourceId - Resource ID (room or bed)
 * @param {'room' | 'bed'} resourceType - Type of resource
 * @returns {Array} Bookings for this resource
 */
export function getBookingsForResource(allBookings, resourceId, resourceType) {
  return allBookings.filter(booking => {
    if (resourceType === 'bed') {
      return booking.bedId === resourceId || 
             (booking.bed_index !== undefined && `bed-${booking.bed_index}` === resourceId);
    }
    return booking.roomId === resourceId || booking.room_uid === resourceId;
  });
}

/**
 * Find maintenance blocks for a specific resource
 * @param {Array} allBlocks - All maintenance blocks
 * @param {string} resourceId - Resource ID (room or bed)
 * @param {'room' | 'bed'} resourceType - Type of resource
 * @returns {Array} Blocks for this resource
 */
export function getBlocksForResource(allBlocks, resourceId, resourceType) {
  return allBlocks.filter(block => {
    if (resourceType === 'bed') {
      return block.bedId === resourceId || 
             (block.bed_index !== undefined && `bed-${block.bed_index}` === resourceId);
    }
    return block.roomId === resourceId || block.room_uid === resourceId;
  });
}

/**
 * Calculate the day width based on view mode
 * @param {'daily' | 'monthly'} viewMode - Calendar view mode
 * @returns {number} Day width in pixels
 */
export function getDayWidth(viewMode) {
  return viewMode === 'daily' ? 145 : 60;
}

/**
 * Calculate total timeline width
 * @param {number} numDays - Number of days in the view
 * @param {number} dayWidth - Width of each day column
 * @returns {number} Total width in pixels
 */
export function getTimelineWidth(numDays, dayWidth) {
  return numDays * dayWidth;
}