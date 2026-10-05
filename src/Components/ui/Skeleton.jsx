import PropTypes from 'prop-types';
import { clsx } from 'clsx';

/**
 * Skeleton loading component
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS classes
 * @param {'text' | 'circular' | 'rectangular'} [props.variant='text'] - Shape variant
 * @param {string | number} [props.width] - Width
 * @param {string | number} [props.height] - Height
 * @param {'pulse' | 'wave' | 'none'} [props.animation='pulse'] - Animation type
 * @returns {JSX.Element}
 */
export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}) {
  return (
    <div
      className={clsx(
        'bg-gray-200',
        {
          'rounded-full': variant === 'circular',
          'rounded': variant === 'rectangular',
          'rounded h-4': variant === 'text',
          'animate-pulse': animation === 'pulse',
        },
        className
      )}
      style={{ width, height }}
    />
  );
}

Skeleton.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['text', 'circular', 'rectangular']),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  animation: PropTypes.oneOf(['pulse', 'wave', 'none']),
};

/**
 * Calendar loading skeleton component
 * @returns {JSX.Element}
 */
export function CalendarSkeleton() {
  return (
    <div className="flex flex-col h-full animate-pulse">
      {/* Header skeleton */}
      <div className="bg-white px-6 py-4 border-b border-[var(--color-alice-sand)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-48 h-10 bg-gray-200 rounded" />
            <div className="w-24 h-10 bg-gray-200 rounded" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-40 h-10 bg-gray-200 rounded" />
            <div className="w-40 h-10 bg-gray-200 rounded" />
            <div className="w-10 h-10 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      {/* Dashboard skeleton */}
      <div className="bg-white px-6 py-4 border-b border-[var(--color-alice-sand)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-24 h-4 bg-gray-200 rounded" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full" />
              <div className="w-32 h-4 bg-gray-200 rounded" />
              <div className="w-6 h-6 bg-gray-200 rounded-full" />
            </div>
          </div>
        </div>
        <div className="w-20 h-10 bg-gray-200 rounded mb-3" />
        <div className="w-full h-2 bg-gray-200 rounded mb-3" />
        <div className="flex gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-200 rounded-full" />
              <div className="w-24 h-3 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="flex-1 bg-white p-4">
        <div className="flex gap-4">
          {/* Left sidebar */}
          <div className="w-72 border-r border-gray-200 pr-4">
            <div className="w-32 h-4 bg-gray-200 rounded mb-4" />
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-3">
                <div className="w-10 h-10 bg-gray-200 rounded" />
                <div className="flex-1">
                  <div className="w-full h-4 bg-gray-200 rounded mb-1" />
                  <div className="w-20 h-3 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex-1">
            <div className="flex gap-2 mb-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex-1 h-12 bg-gray-200 rounded" />
              ))}
            </div>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex gap-2 mb-2">
                {[...Array(10)].map((_, j) => (
                  <div key={j} className="flex-1 h-12 bg-gray-100 rounded" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
