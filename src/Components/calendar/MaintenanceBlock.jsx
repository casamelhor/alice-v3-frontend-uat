import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Wrench, Construction, Ban } from 'lucide-react';

const blockTypeIcons = {
  Maintenance: Wrench,
  Renovation: Construction,
  Blocked: Ban,
};

const blockTypeColors = {
  Maintenance: {
    bg: 'bg-gray-100',
    border: 'border-gray-400',
    text: 'text-gray-700',
    stripe: 'rgba(107, 114, 128, 0.2)',
  },
  Renovation: {
    bg: 'bg-orange-50',
    border: 'border-orange-400',
    text: 'text-orange-700',
    stripe: 'rgba(251, 146, 60, 0.2)',
  },
  Blocked: {
    bg: 'bg-red-50',
    border: 'border-red-400',
    text: 'text-red-700',
    stripe: 'rgba(248, 113, 113, 0.2)',
  },
};

/**
 * Maintenance block component for displaying blocked periods
 * @param {Object} props
 * @param {import('@/types').MaintenanceBlock} props.block - The maintenance block data
 * @param {'timeline' | 'card'} [props.variant='timeline'] - Display variant
 * @param {(blockId: string) => void} [props.onViewDetails] - Callback when viewing details
 * @param {(blockId: string) => void} [props.onMakeAvailable] - Callback to make available
 * @returns {JSX.Element}
 */
export function MaintenanceBlock({
  block,
  variant = 'timeline',
  onViewDetails,
  onMakeAvailable,
}) {
  const Icon = blockTypeIcons[block.blockType];
  const colors = blockTypeColors[block.blockType];

  if (variant === 'card') {
    return (
      <div className={`p-4 rounded-lg border-2 border-dashed ${colors.border} ${colors.bg}`}>
        <div className="flex items-start gap-3 mb-3">
          <div className={`p-2 rounded-lg ${colors.bg}`}>
            <Icon className={`w-5 h-5 ${colors.text}`} />
          </div>
          <div className="flex-1">
            <h4 className={`text-base font-medium ${colors.text}`}>
              {block.blockType}
            </h4>
            <p className="text-sm text-gray-500">
              {format(new Date(block.startDate), 'd MMM yyyy')} - {format(new Date(block.endDate), 'd MMM yyyy')}
            </p>
          </div>
        </div>
        
        {block.reason && (
          <p className="text-sm text-gray-600 mb-3">{block.reason}</p>
        )}
        
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails?.(block.id)}
            className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View Details
          </button>
          <button
            onClick={() => onMakeAvailable?.(block.id)}
            className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Make Available
          </button>
        </div>
      </div>
    );
  }

  // Timeline variant (for FullCalendar events)
  return (
    <div
      className={`
        flex items-center gap-1.5 px-2 py-1 h-full rounded
        border-2 border-dashed ${colors.border}
      `}
      style={{
        background: `repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 4px,
          ${colors.stripe} 4px,
          ${colors.stripe} 8px
        ), ${colors.bg.replace('bg-', 'var(--tw-')}`,
        backgroundColor: colors.bg === 'bg-gray-100' ? '#f3f4f6' : 
                        colors.bg === 'bg-orange-50' ? '#fff7ed' : 
                        '#fef2f2',
      }}
      onClick={() => onViewDetails?.(block.id)}
    >
      <Icon className={`w-3 h-3 ${colors.text} flex-shrink-0`} />
      <span className={`text-xs font-medium truncate ${colors.text}`}>
        {block.blockType}
      </span>
    </div>
  );
}

MaintenanceBlock.propTypes = {
  block: PropTypes.shape({
    id: PropTypes.string.isRequired,
    blockType: PropTypes.oneOf(['Maintenance', 'Renovation', 'Blocked']).isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    reason: PropTypes.string,
  }).isRequired,
  variant: PropTypes.oneOf(['timeline', 'card']),
  onViewDetails: PropTypes.func,
  onMakeAvailable: PropTypes.func,
};

/**
 * FullCalendar Event Content Renderer for Maintenance Blocks
 * @param {import('@/types').MaintenanceBlock} block - The maintenance block data
 * @returns {JSX.Element}
 */
export function renderMaintenanceEvent(block) {
  const Icon = blockTypeIcons[block.blockType];
  const colors = blockTypeColors[block.blockType];

  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1 h-full rounded border-2 border-dashed"
      style={{
        borderColor: colors.border === 'border-gray-400' ? '#9ca3af' :
                     colors.border === 'border-orange-400' ? '#fb923c' : '#f87171',
        background: `repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 4px,
          ${colors.stripe} 4px,
          ${colors.stripe} 8px
        )`,
        backgroundColor: colors.bg === 'bg-gray-100' ? '#f3f4f6' : 
                        colors.bg === 'bg-orange-50' ? '#fff7ed' : 
                        '#fef2f2',
      }}
    >
      <Icon 
        className="w-3 h-3 flex-shrink-0" 
        style={{ 
          color: colors.text === 'text-gray-700' ? '#374151' :
                 colors.text === 'text-orange-700' ? '#c2410c' : '#b91c1c'
        }} 
      />
      <span 
        className="text-xs font-medium truncate"
        style={{ 
          color: colors.text === 'text-gray-700' ? '#374151' :
                 colors.text === 'text-orange-700' ? '#c2410c' : '#b91c1c'
        }}
      >
        {block.blockType}
      </span>
    </div>
  );
}
