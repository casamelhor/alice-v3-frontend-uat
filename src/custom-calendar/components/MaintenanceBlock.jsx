/**
 * @file Maintenance block component - displays maintenance/blocked periods
 */

import PropTypes from 'prop-types';

/**
 * Get icon for block type
 * @param {string} blockType 
 * @returns {string}
 */
function getBlockIcon(blockType) {
  switch (blockType?.toLowerCase()) {
    case 'maintenance':
      return '🔧';
    case 'renovation':
      return '🏗️';
    case 'blocked':
      return '🚫';
    default:
      return '🔧';
  }
}

/**
 * Maintenance block component
 * Displays a maintenance/blocked period on the timeline
 */
export function MaintenanceBlock({ block, left, width, onClick }) {
  // Extract block data (handle both API format and mock format)
  const blockType = block.block_type || block.blockType || 'Maintenance';
  const reason = block.reason || '';

  return (
    <div
      className="maintenance-block"
      style={{
        left: `${left}px`,
        width: `${width}px`,
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      title={reason || blockType}
    >
      <span className="maintenance-block__icon">
        {getBlockIcon(blockType)}
      </span>
      <span className="maintenance-block__label">
        {truncateText(blockType, 12)}
      </span>
    </div>
  );
}

MaintenanceBlock.propTypes = {
  block: PropTypes.object.isRequired,
  left: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  onClick: PropTypes.func,
};

/**
 * Truncate text to specified length
 * @param {string} text 
 * @param {number} maxLength 
 * @returns {string}
 */
function truncateText(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
