/**
 * @file Property tree sidebar component
 */

import PropTypes from 'prop-types';
import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';

/**
 * Property tree sidebar component
 * Renders the hierarchical property > room > bed tree structure
 */
export function PropertyTreeSidebar({ resources, onToggleProperty, onToggleRoom }) {
  return (
    <div className="property-tree">
      {resources.map((resource) => (
        <PropertyTreeItem
          key={resource.id}
          resource={resource}
          onToggleProperty={onToggleProperty}
          onToggleRoom={onToggleRoom}
        />
      ))}
    </div>
  );
}

PropertyTreeSidebar.propTypes = {
  resources: PropTypes.array.isRequired,
  onToggleProperty: PropTypes.func.isRequired,
  onToggleRoom: PropTypes.func.isRequired,
};

/**
 * Individual tree item (property, room, or bed)
 */
function PropertyTreeItem({ resource, onToggleProperty, onToggleRoom }) {
  const { id, type, name, data, isExpanded, hasChildren } = resource;

  const handleClick = () => {
    if (type === 'property' && hasChildren) {
      onToggleProperty(id);
    } else if (type === 'room' && hasChildren) {
      onToggleRoom(id);
    }
  };

  // Property row
  if (type === 'property') {
    const photo = data.property_image_url || data.photo;
    const roomCount = data.total_rooms || data.roomCount || 0;
    const bedCount = data.total_beds || data.bedCount || 0;

    return (
      <div
        className={clsx(
          'property-tree__item',
          'property-tree__item--property',
          hasChildren && 'cursor-pointer'
        )}
        onClick={handleClick}
      >
        {hasChildren ? (
          <ChevronRight 
            className={clsx(
              'property-tree__chevron',
              isExpanded && 'property-tree__chevron--expanded'
            )}
          />
        ) : (
          <div className="w-4" />
        )}
        
        {photo && (
          <img 
            src={photo} 
            alt={name}
            className="property-tree__photo"
          />
        )}
        
        <div className="property-tree__info">
          <div className="property-tree__name" title={name}>
            {truncateText(name, 22)}
          </div>
          <div className="property-tree__meta">
            {roomCount} Room{roomCount !== 1 ? 's' : ''}
            {bedCount > 0 && `, ${bedCount} Bed${bedCount !== 1 ? 's' : ''}`}
          </div>
        </div>
      </div>
    );
  }

  // Room row
  if (type === 'room') {
    const roomType = data.room_type || data.roomType || '';
    const isTwinSharing = roomType === 'Twin-Sharing' || data.isTwinSharing;

    return (
      <div
        className={clsx(
          'property-tree__item',
          'property-tree__item--room',
          hasChildren && 'cursor-pointer'
        )}
        onClick={handleClick}
      >
        {hasChildren ? (
          <ChevronRight 
            className={clsx(
              'property-tree__chevron',
              'w-3 h-3',
              isExpanded && 'property-tree__chevron--expanded'
            )}
          />
        ) : (
          <div className="w-3" />
        )}
        
        <div className="property-tree__info">
          <div className="property-tree__name" title={name}>
            {name}
          </div>
          <div className="property-tree__meta">
            {roomType}
            {isTwinSharing && (
              <span className="ml-1 text-purple-600">(Twin)</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Bed row
  if (type === 'bed') {
    const genderLock = data.current_gender_lock || data.genderLock;

    return (
      <div className="property-tree__item property-tree__item--bed">
        <span className="text-sm">🛏️</span>
        <div className="property-tree__info">
          <div className="property-tree__name flex items-center gap-1">
            {name}
            {genderLock && (
              <span className="text-[10px] px-1 bg-purple-100 text-purple-700 rounded">
                {genderLock}
              </span>
            )}
          </div>
          <div className="property-tree__meta">
            {data.bed_type || data.bedType || 'Single'}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

PropertyTreeItem.propTypes = {
  resource: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['property', 'room', 'bed']).isRequired,
    name: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    isExpanded: PropTypes.bool,
    hasChildren: PropTypes.bool,
  }).isRequired,
  onToggleProperty: PropTypes.func.isRequired,
  onToggleRoom: PropTypes.func.isRequired,
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
