import PropTypes from 'prop-types';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useCalendarStore } from '@/stores/calendarStore';
import { mockProperties, mockRooms, getAvailabilityCounts } from '@/mocks/data';
import { format } from 'date-fns';
import { truncateText, formatRoomBedCount } from '@/utils/formatters';

/**
 * Property tree sidebar component showing property hierarchy
 * @returns {JSX.Element}
 */
export function PropertyTreeSidebar() {
  const {
    selectedDate,
    expandedPropertyIds,
    expandedRoomIds,
    togglePropertyExpanded,
    toggleRoomExpanded,
  } = useCalendarStore();

  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  return (
    <div className="h-full overflow-y-auto bg-white border-r border-[var(--color-alice-sand)]">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-[var(--color-alice-sand)] px-4 py-3 z-10">
        <h3 className="text-sm font-medium text-gray-700">
          {mockProperties.length} Properties
        </h3>
      </div>

      {/* Stats Row */}
      <div className="px-4 py-3 border-b border-[var(--color-alice-sand)] bg-[var(--color-alice-cream)]">
        <div className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">Stats (Total Rooms)</span>
        </div>
      </div>

      {/* Property List */}
      <div className="py-2">
        {mockProperties.map((property) => (
          <PropertyItem
            key={property.id}
            property={property}
            dateStr={dateStr}
            isExpanded={expandedPropertyIds.has(property.id)}
            onToggle={() => togglePropertyExpanded(property.id)}
            expandedRoomIds={expandedRoomIds}
            onToggleRoom={toggleRoomExpanded}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Property item component
 * @param {Object} props
 * @param {import('@/types').Property} props.property - Property data
 * @param {string} props.dateStr - Date string for availability
 * @param {boolean} props.isExpanded - Whether property is expanded
 * @param {() => void} props.onToggle - Toggle callback
 * @param {Set<string>} props.expandedRoomIds - Set of expanded room IDs
 * @param {(roomId: string) => void} props.onToggleRoom - Room toggle callback
 * @returns {JSX.Element}
 */
function PropertyItem({
  property,
  dateStr,
  isExpanded,
  onToggle,
  expandedRoomIds,
  onToggleRoom,
}) {
  const rooms = mockRooms[property.id] || [];
  const availability = getAvailabilityCounts(property.id, dateStr);
  
  return (
    <div className="border-b border-[var(--color-alice-sand)] last:border-b-0">
      {/* Property Row */}
      <button
        onClick={onToggle}
        className={`
          w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left
          ${isExpanded ? 'bg-[var(--color-alice-cream)]' : ''}
        `}
      >
        {/* Expand/Collapse Icon */}
        {rooms.length > 0 ? (
          isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
          )
        ) : (
          <div className="w-4" />
        )}

        {/* Property Photo */}
        <img
          src={property.photo}
          alt={property.name}
          className="w-10 h-10  object-cover flex-shrink-0"
        />

        {/* Property Info */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">
            {truncateText(property.name, 22)} asdasd
          </div>
          <div className="text-xs text-gray-500">
            {formatRoomBedCount(property.roomCount, property.bedCount)}
          </div>
        </div>
      </button>

      {/* Rooms (when expanded) */}
      {isExpanded && rooms.length > 0 && (
        <div className="bg-gray-50">
          {rooms.map((room) => (
            <RoomItem
              key={room.id}
              room={room}
              isExpanded={expandedRoomIds.has(room.id)}
              onToggle={() => onToggleRoom(room.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

PropertyItem.propTypes = {
  property: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
    roomCount: PropTypes.number.isRequired,
    bedCount: PropTypes.number.isRequired,
  }).isRequired,
  dateStr: PropTypes.string.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  expandedRoomIds: PropTypes.instanceOf(Set).isRequired,
  onToggleRoom: PropTypes.func.isRequired,
};

/**
 * Room item component
 * @param {Object} props
 * @param {import('@/types').Room} props.room - Room data
 * @param {boolean} props.isExpanded - Whether room is expanded
 * @param {() => void} props.onToggle - Toggle callback
 * @returns {JSX.Element}
 */
function RoomItem({ room, isExpanded, onToggle }) {
  const hasBeds = room.isTwinSharing && room.beds.length > 0;

  return (
    <div>
      {/* Room Row */}
      <button
        onClick={hasBeds ? onToggle : undefined}
        className={`
          w-full flex items-center gap-2 pl-8 pr-4 py-2 hover:bg-gray-100 transition-colors text-left
          ${!hasBeds ? 'cursor-default' : ''}
        `}
      >
        {/* Expand/Collapse Icon */}
        {hasBeds ? (
          isExpanded ? (
            <ChevronDown className="w-3 h-3 text-gray-400 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
          )
        ) : (
          <div className="w-3" />
        )}

        {/* Room Info */}
        <div className="flex-1 min-w-0">
          <div className="text-sm text-gray-800">{room.name}</div>
          <div className="text-xs text-gray-500">{room.roomType}</div>
        </div>
      </button>

      {/* Beds (when expanded) */}
      {isExpanded && hasBeds && (
        <div>
          {room.beds.map((bed) => (
            <div
              key={bed.id}
              className="flex items-center gap-2 pl-14 pr-4 py-2 hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm">🛏️</span>
              <div className="flex-1 min-w-0">
                <span className="text-sm text-gray-700">{bed.name}</span>
                <span className="text-xs text-gray-400 ml-2">| {room.roomType}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

RoomItem.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    roomType: PropTypes.string.isRequired,
    isTwinSharing: PropTypes.bool,
    beds: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })),
  }).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};
