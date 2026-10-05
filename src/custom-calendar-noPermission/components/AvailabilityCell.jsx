/**
 * @file Availability cell component - displays R-X, B-Y for property rows
 */

import { useMemo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

/**
 * Availability cell component
 * Shows available rooms (R-X) and beds (B-Y) for a property on a specific date
 */
export function AvailabilityCell({ availability, dateStr }) {
  // Find availability data for this date
  const dayAvailability = useMemo(() => {
    if (!availability || !Array.isArray(availability)) {
      return null;
    }
    
    return availability.find(a => a.date === dateStr);
  }, [availability, dateStr]);

  // If no availability data, show nothing
  if (!dayAvailability) {
    return <div className="availability-cell">-</div>;
  }

  const { 
    available_rooms, 
    available_beds, 
    display_text,
    availableRooms,
    availableBeds,
  } = dayAvailability;

  // Handle both API format and mock format
  const rooms = available_rooms ?? availableRooms ?? 0;
  const beds = available_beds ?? availableBeds ?? 0;
  const isZero = rooms === 0 && beds === 0;

  // Use display_text if provided, otherwise format manually
  const displayText = display_text || `R-${rooms}, B-${beds}`;

  return (
    <div className={clsx('availability-cell', isZero && 'availability-cell--zero')}>
   <span style={{background:'#fff', padding:'4px 8px'}} >   {displayText} </span>
    </div>
  );
}

AvailabilityCell.propTypes = {
  availability: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string,
    available_rooms: PropTypes.number,
    available_beds: PropTypes.number,
    display_text: PropTypes.string,
    availableRooms: PropTypes.number,
    availableBeds: PropTypes.number,
  })),
  dateStr: PropTypes.string.isRequired,
};

AvailabilityCell.defaultProps = {
  availability: null,
};
