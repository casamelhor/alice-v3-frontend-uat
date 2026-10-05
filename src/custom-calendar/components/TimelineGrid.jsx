// /**
//  * @file Timeline grid component - renders date columns and booking/block events
//  */

// import { useMemo } from 'react';
// import PropTypes from 'prop-types';
// import clsx from 'clsx';
// import { BookingCard } from './BookingCard';
// import { MaintenanceBlock } from './MaintenanceBlock';
// import { AvailabilityCell } from './AvailabilityCell';
// import { calculateBookingPosition, calculateBlockPosition } from '../utils/gridPositioning';
// import { doDateRangesOverlap } from '../utils/dateUtils';
// import { format } from 'date-fns';

// /**
//  * Timeline grid component
//  * Renders rows for each resource with date columns and positioned events
//  */
// export function TimelineGrid({
//   resources,
//   dateColumns,
//   dayWidth,
//   totalWidth,
//   viewStart,
//   allBookings,
//   allBlocks,
//   onBookingClick,
//   onBlockClick,
//   onCellClick,
// }) {
//   // Calculate view date range for filtering
//   const viewRange = useMemo(() => {
//     if (dateColumns.length === 0) return { start: '', end: '' };
//     return {
//       start: dateColumns[0].dateStr,
//       end: dateColumns[dateColumns.length - 1].dateStr,
//     };
//   }, [dateColumns]);

//   return (
//     <div 
//       className="timeline-grid"
//       style={{ width: totalWidth }}
//     >
//       {resources.map((resource) => (
//         <TimelineRow
//           key={resource.id}
//           resource={resource}
//           dateColumns={dateColumns}
//           dayWidth={dayWidth}
//           viewStart={viewStart}
//           viewRange={viewRange}
//           allBookings={allBookings}
//           allBlocks={allBlocks}
//           onBookingClick={onBookingClick}
//           onBlockClick={onBlockClick}
//           onCellClick={onCellClick}
//         />
//       ))}
//     </div>
//   );
// }

// TimelineGrid.propTypes = {
//   resources: PropTypes.array.isRequired,
//   dateColumns: PropTypes.array.isRequired,
//   dayWidth: PropTypes.number.isRequired,
//   totalWidth: PropTypes.number.isRequired,
//   viewStart: PropTypes.instanceOf(Date).isRequired,
//   allBookings: PropTypes.array.isRequired,
//   allBlocks: PropTypes.array.isRequired,
//   onBookingClick: PropTypes.func,
//   onBlockClick: PropTypes.func,
// };

// /**
//  * Single timeline row (for a property, room, or bed)
//  */
// function TimelineRow({
//   resource,
//   dateColumns,
//   dayWidth,
//   viewStart,
//   viewRange,
//   allBookings,
//   allBlocks,
//   onBookingClick,
//   onBlockClick,
//   onCellClick,
// }) {
//   const { id, type, data } = resource;

//   // Get bookings for this resource
//   const rowBookings = useMemo(() => {
//     return allBookings.filter(booking => {
//       // Match by room or bed
//       if (type === 'bed') {
//         const bedIndex = data.bedIndex;
//         // Check if this is an exclusive booking for this room (no specific bed)
//         const isExclusiveForThisRoom = booking.roomId === data.roomId && 
//                                         !booking.bedId && 
//                                         (booking.is_exclusive || booking.isExclusiveRoomBooking);
//         // Check if this is a specific bed booking
//         const isSpecificBedBooking = booking.roomId === data.roomId && 
//                                       (booking.bed_index === bedIndex || booking.bedId === id);
        
//         return isExclusiveForThisRoom || isSpecificBedBooking;
//       }
//       if (type === 'room') {
//         // Only show bookings directly on room if no bed specified
//         return booking.roomId === id && 
//                (booking.bed_index === null || booking.bed_index === undefined) &&
//                !booking.bedId;
//       }
//       return false;
//     }).filter(booking => {
//       // Filter to visible date range
//       const checkIn = booking.check_in_date || booking.checkInDate;
//       const checkOut = booking.check_out_date || booking.checkOutDate;
//       return doDateRangesOverlap(checkIn, checkOut, viewRange.start, viewRange.end + 'Z');
//     });
//   }, [allBookings, id, type, data, viewRange]);

//   // Get maintenance blocks for this resource
//   const rowBlocks = useMemo(() => {
//     return allBlocks.filter(block => {
//       if (type === 'bed') {
//         const bedIndex = data.bedIndex;
//         return block.roomId === data.roomId && 
//                (block.bed_index === bedIndex || block.bedId === id);
//       }
//       if (type === 'room') {
//         return block.roomId === id && 
//                (block.bed_index === null || block.bed_index === undefined) &&
//                !block.bedId;
//       }
//       return false;
//     }).filter(block => {
//       const start = block.start_date || block.startDate;
//       const end = block.end_date || block.endDate;
//       return doDateRangesOverlap(start, end, viewRange.start, viewRange.end + 'Z');
//     });
//   }, [allBlocks, id, type, data, viewRange]);

//   // For property rows, get availability data
//   const availability = useMemo(() => {
//     if (type !== 'property') return null;
//     return data.daily_availability || null;
//   }, [type, data]);

//   return (
//     <div 
//       className={clsx(
//         'timeline-grid__row',
//         type === 'property' && 'timeline-grid__row--property',
//         type === 'room' && 'timeline-grid__row--room',
//         type === 'bed' && 'timeline-grid__row--bed'
//       )}
//     >
//       {/* Date cells (background grid) */}
//       {dateColumns.map((col) => (
//         <div
//           key={col.dateStr}
//           className={clsx(
//             'timeline-grid__cell',
//             col.isToday && 'timeline-grid__cell--today',
//             col.isWeekend && 'timeline-grid__cell--weekend'
//           )}
//           style={{ width: dayWidth }}
//           onClick={() => {
//             // Only trigger for property/room/bed rows, not on bookings/blocks
//             if (onCellClick && type !== 'property' && type !== 'room' && type !== 'bed') return;
//             if (onCellClick) onCellClick(resource, col.dateStr);
//           }}
//         >
//           {/* Availability display for property rows */}
//           {type === 'property' && (
//             <AvailabilityCell
//               availability={availability}
//               dateStr={col.dateStr}
//             />
//           )}
//         </div>
//       ))}

//       {/* Booking cards (positioned absolutely) */}
//       {rowBookings.map((booking) => {
//         const checkIn = booking.check_in_date || booking.checkInDate;
//         const checkOut = booking.check_out_date || booking.checkOutDate;
//         const checkInTime = booking.check_in_time || booking.checkInTime;
//         const checkOutTime = booking.check_out_time || booking.checkOutTime;
        
//         // Check if this is a same-day booking (partial day fill)
//         const isSameDay = checkIn === checkOut;
//         const hasPartialFill = isSameDay && (checkInTime || checkOutTime);
        
//         const position = calculateBookingPosition({
//           checkInDate: checkIn,
//           checkOutDate: checkOut,
//           checkInTime: checkInTime || booking.arrivalTime,
//           checkOutTime: checkOutTime,
//           viewStart,
//           dayWidth,
//           defaultCheckInTime: booking.defaultCheckInTime || '12:00',
//           defaultCheckOutTime: booking.defaultCheckOutTime || '11:00',
//         });

//         if (!position) return null;

//         return (
//           <BookingCard
//             key={booking.booking_uid || booking.id}
//             booking={booking}
//             left={position.left}
//             width={position.width}
//             onClick={() => onBookingClick?.(booking)}
//             hasPartialFill={hasPartialFill}
//           />
//         );
//       })}

//       {/* Maintenance blocks (positioned absolutely) */}
//       {rowBlocks.map((block) => {
//         const start = block.start_date || block.startDate;
//         const end = block.end_date || block.endDate;
        
//         const position = calculateBlockPosition({
//           startDate: start,
//           endDate: end,
//           viewStart,
//           dayWidth,
//         });

//         if (!position) return null;

//         return (
//           <MaintenanceBlock
//             key={block.block_uid || block.id}
//             block={block}
//             left={position.left}
//             width={position.width}
//             onClick={() => onBlockClick?.(block)}
//           />
//         );
//       })}
//     </div>
//   );
// }

// TimelineRow.propTypes = {
//   resource: PropTypes.object.isRequired,
//   dateColumns: PropTypes.array.isRequired,
//   dayWidth: PropTypes.number.isRequired,
//   viewStart: PropTypes.instanceOf(Date).isRequired,
//   viewRange: PropTypes.object.isRequired,
//   allBookings: PropTypes.array.isRequired,
//   allBlocks: PropTypes.array.isRequired,
//   onBookingClick: PropTypes.func,
//   onBlockClick: PropTypes.func,
// };



/**
 * @file Timeline grid component - renders date columns and booking/block events
 */

import { useMemo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { BookingCard } from './BookingCard';
import { MaintenanceBlock } from './MaintenanceBlock';
import { AvailabilityCell } from './AvailabilityCell';
import { calculateBookingPosition, calculateBlockPosition } from '../utils/gridPositioning';
import { doDateRangesOverlap } from '../utils/dateUtils';
import { format } from 'date-fns';

/**
 * Timeline grid component
 * Renders rows for each resource with date columns and positioned events
 */
export function TimelineGrid({
  resources,
  dateColumns,
  dayWidth,
  totalWidth,
  viewStart,
  allBookings,
  allBlocks,
  onBookingClick,
  onBlockClick,
  onCellClick,
  permissions = {},
}) {
  // Calculate view date range for filtering
  const viewRange = useMemo(() => {
    if (dateColumns.length === 0) return { start: '', end: '' };
    return {
      start: dateColumns[0].dateStr,
      end: dateColumns[dateColumns.length - 1].dateStr,
    };
  }, [dateColumns]);

  return (
    <div 
      className="timeline-grid"
      style={{ width: totalWidth }}
    >
      {resources.map((resource) => (
        <TimelineRow
          key={resource.id}
          resource={resource}
          dateColumns={dateColumns}
          dayWidth={dayWidth}
          viewStart={viewStart}
          viewRange={viewRange}
          allBookings={allBookings}
          allBlocks={allBlocks}
          onBookingClick={onBookingClick}
          onBlockClick={onBlockClick}
          onCellClick={onCellClick}
          permissions={permissions}
        />
      ))}
    </div>
  );
}

TimelineGrid.propTypes = {
  resources: PropTypes.array.isRequired,
  dateColumns: PropTypes.array.isRequired,
  dayWidth: PropTypes.number.isRequired,
  permissions: PropTypes.object,
  totalWidth: PropTypes.number.isRequired,
  viewStart: PropTypes.instanceOf(Date).isRequired,
  allBookings: PropTypes.array.isRequired,
  allBlocks: PropTypes.array.isRequired,
  onBookingClick: PropTypes.func,
  onBlockClick: PropTypes.func,
};

/**
 * Single timeline row (for a property, room, or bed)
 */
function TimelineRow({
  resource,
  dateColumns,
  dayWidth,
  viewStart,
  viewRange,
  allBookings,
  allBlocks,
  onBookingClick,
  onBlockClick,
  onCellClick,
  permissions = {},
}) {
  const { id, type, data } = resource;

  // Get bookings for this resource
  const rowBookings = useMemo(() => {
    return allBookings.filter(booking => {
      // Match by room or bed
      if (type === 'bed') {
        const bedIndex = data.bedIndex;
        // Check if this is an exclusive booking for this room (no specific bed)
        const isExclusiveForThisRoom = booking.roomId === data.roomId && 
                                        !booking.bedId && 
                                        (booking.is_exclusive || booking.isExclusiveRoomBooking);
        // Check if this is a specific bed booking
        const isSpecificBedBooking = booking.roomId === data.roomId && 
                                      (booking.bed_index === bedIndex || booking.bedId === id);
        
        return isExclusiveForThisRoom || isSpecificBedBooking;
      }
      if (type === 'room') {
        // Only show bookings directly on room if no bed specified
        return booking.roomId === id && 
               (booking.bed_index === null || booking.bed_index === undefined) &&
               !booking.bedId;
      }
      return false;
    }).filter(booking => {
      // Filter to visible date range
      const checkIn = booking.check_in_date || booking.checkInDate;
      const checkOut = booking.check_out_date || booking.checkOutDate;
      return doDateRangesOverlap(checkIn, checkOut, viewRange.start, viewRange.end + 'Z');
    });
  }, [allBookings, id, type, data, viewRange]);

  // Get maintenance blocks for this resource
  const rowBlocks = useMemo(() => {
    return allBlocks.filter(block => {
      if (type === 'bed') {
        const bedIndex = data.bedIndex;
        return block.roomId === data.roomId && 
               (block.bed_index === bedIndex || block.bedId === id);
      }
      if (type === 'room') {
        return block.roomId === id && 
               (block.bed_index === null || block.bed_index === undefined) &&
               !block.bedId;
      }
      return false;
    }).filter(block => {
      const start = block.start_date || block.startDate;
      const end = block.end_date || block.endDate;
      return doDateRangesOverlap(start, end, viewRange.start, viewRange.end + 'Z');
    });
  }, [allBlocks, id, type, data, viewRange]);

  // For property rows, get availability data
  const availability = useMemo(() => {
    if (type !== 'property') return null;
    return data.daily_availability || null;
  }, [type, data]);

  return (
    <div 
      className={clsx(
        'timeline-grid__row',
        type === 'property' && 'timeline-grid__row--property',
        type === 'room' && 'timeline-grid__row--room',
        type === 'bed' && 'timeline-grid__row--bed'
      )}
    >
      {/* Date cells (background grid) */}
      {dateColumns.map((col) => (
        <div
          key={col.dateStr}
          className={clsx(
            'timeline-grid__cell',
            col.isToday && 'timeline-grid__cell--today',
            col.isWeekend && 'timeline-grid__cell--weekend'
          )}
          style={{ width: dayWidth }}
          onClick={() => {
            if (!permissions.createBooking) return;
            // Only trigger for property/room/bed rows, not on bookings/blocks
            if (onCellClick && type !== 'property' && type !== 'room' && type !== 'bed') return;
            if (onCellClick) onCellClick(resource, col.dateStr);
          }}
        >
          {/* Availability display for property rows */}
          {type === 'property' && (
            <AvailabilityCell
              availability={availability}
              dateStr={col.dateStr}
            />
          )}
        </div>
      ))}

      {/* Booking cards (positioned absolutely) */}
      {rowBookings.map((booking) => {
        const checkIn = booking.check_in_date || booking.checkInDate;
        const checkOut = booking.check_out_date || booking.checkOutDate;
        const checkInTime = booking.check_in_time || booking.checkInTime;
        const checkOutTime = booking.check_out_time || booking.checkOutTime;
        
        // Check if this is a same-day booking (partial day fill)
        const isSameDay = checkIn === checkOut;
        const hasPartialFill = isSameDay && (checkInTime || checkOutTime);
        
        // const position = calculateBookingPosition({
        //   checkInDate: checkIn,
        //   checkOutDate: checkOut,
        //   checkInTime: checkInTime || booking.arrivalTime,
        //   checkOutTime: checkOutTime,
        //   viewStart,
        //   dayWidth,
        //   defaultCheckInTime: booking.defaultCheckInTime || '12:00',
        //   defaultCheckOutTime: booking.defaultCheckOutTime || '11:00',
        // });

        const position = calculateBookingPosition({
          checkInDate: checkIn,
          checkOutDate: checkOut,
          checkInTime: checkInTime || booking.arrivalTime,
          checkOutTime: checkOutTime,
          viewStart,
          dayWidth,
          numDays: dateColumns.length,
          defaultCheckInTime: booking.defaultCheckInTime || '12:00',
          defaultCheckOutTime: booking.defaultCheckOutTime || '11:00',
        });

        if (!position) return null;

        return (
          <BookingCard
            key={booking.booking_uid || booking.id}
            booking={booking}
            left={position.left}
            width={position.width}
            onClick={() => permissions.viewTileDetails && onBookingClick?.(booking)}
            hasPartialFill={hasPartialFill}
            showGuestDetails={permissions.viewGuestDetails}
          />
        );
      })}

      {/* Maintenance blocks (positioned absolutely) - hidden entirely without view_maintenance */}
      {permissions.viewMaintenance && rowBlocks.map((block) => {
        const start = block.start_date || block.startDate;
        const end = block.end_date || block.endDate;
        
        // const position = calculateBlockPosition({
        //   startDate: start,
        //   endDate: end,
        //   viewStart,
        //   dayWidth,
        // });

        const position = calculateBlockPosition({
        startDate: start,
        endDate: end,
        viewStart,
        dayWidth,
        numDays: dateColumns.length,
      });

        if (!position) return null;

        return (
          <MaintenanceBlock
            key={block.block_uid || block.id}
            block={block}
            left={position.left}
            width={position.width}
            onClick={() => onBlockClick?.(block)}
          />
        );
      })}
    </div>
  );
}

TimelineRow.propTypes = {
  resource: PropTypes.object.isRequired,
  dateColumns: PropTypes.array.isRequired,
  dayWidth: PropTypes.number.isRequired,
  viewStart: PropTypes.instanceOf(Date).isRequired,
  viewRange: PropTypes.object.isRequired,
  allBookings: PropTypes.array.isRequired,
  allBlocks: PropTypes.array.isRequired,
  onBookingClick: PropTypes.func,
  onBlockClick: PropTypes.func,
  permissions: PropTypes.object,
};
