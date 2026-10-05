/**
 * @file Date header component - sticky column headers for the calendar
 */

import PropTypes from 'prop-types';
import clsx from 'clsx';

/**
 * Date header component
 * Renders the sticky date column headers (Fri 1, Sat 2, etc.)
 */
export function DateHeader({ dateColumns, dayWidth }) {
  return (
    <>
      {dateColumns.map((col) => (
        <div
          key={col.dateStr}
          className={clsx(
            'date-header__cell',
            col.isToday && 'date-header__cell--today',
            col.isWeekend && 'date-header__cell--weekend'
          )}
          style={{ width: dayWidth }}
        >
          <span className="date-header__day">{col.dayName}</span>
          <span className="date-header__date">{col.dayNumber}</span>
        </div>
      ))}
    </>
  );
}

DateHeader.propTypes = {
  dateColumns: PropTypes.arrayOf(PropTypes.shape({
    dateStr: PropTypes.string.isRequired,
    dayName: PropTypes.string.isRequired,
    dayNumber: PropTypes.number.isRequired,
    isToday: PropTypes.bool.isRequired,
    isWeekend: PropTypes.bool.isRequired,
  })).isRequired,
  dayWidth: PropTypes.number.isRequired,
};
