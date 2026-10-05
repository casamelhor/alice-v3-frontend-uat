"use client";
import PropTypes from 'prop-types';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';

/**
 * Reusable filter dropdown used by the Calendar header for Company, Location,
 * and Property selection. Supports single-select and multi-select modes.
 *
 * Follows the PropertyFilterDropdown pattern (search, Select All / Clear All,
 * checkboxes, alice-brown accent) but is agnostic to the item shape.
 */
export function FilterDropdown({
  label,
  items,
  selectedIds,
  onChange,
  multiple = true,
  getId,
  getLabel,
  getImage,
  allLabel = 'All',
  emptyLabel = 'None available',
  disabled = false,
  disabledReason = '',
  minWidth = 180,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const selectedSet = useMemo(
    () => new Set(Array.isArray(selectedIds) ? selectedIds : []),
    [selectedIds]
  );

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => getLabel(item).toLowerCase().includes(q));
  }, [items, search, getLabel]);

  const displayText = useMemo(() => {
    if (!items.length) return emptyLabel;
    if (multiple) {
      if (selectedSet.size === 0) return allLabel;
      if (selectedSet.size === 1) {
        const only = items.find((i) => getId(i) === [...selectedSet][0]);
        return only ? getLabel(only) : `${selectedSet.size} selected`;
      }
      return `${selectedSet.size} selected`;
    }
    // Single-select: show the chosen item's label
    const selectedItem = items.find((i) => getId(i) === selectedIds);
    return selectedItem ? getLabel(selectedItem) : allLabel;
  }, [items, multiple, selectedSet, selectedIds, allLabel, emptyLabel, getId, getLabel]);

  const handleItemClick = (id) => {
    if (multiple) {
      const next = new Set(selectedSet);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      onChange(Array.from(next));
    } else {
      onChange(id);
      setIsOpen(false);
    }
  };

  const handleSelectAll = () => {
    if (!multiple) return;
    onChange(items.map(getId));
  };

  const handleClearAll = () => {
    if (multiple) onChange([]);
    else onChange(null);
  };

  return (
    <div className="relative" ref={containerRef} title={disabled ? disabledReason : undefined}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((v) => !v)}
        style={{ padding: '15px 18px', minWidth }}
        className={`
          flex items-center gap-2 text-sm rounded-lg border justify-between transition-colors
          ${disabled
            ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed'
            : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'}
        `}
      >
        <span className="truncate text-left">
          {label ? <span className="text-gray-500 mr-1">{label}:</span> : null}
          {displayText}
        </span>
        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full right-0 mt-2 bg-white shadow-lg border border-gray-200 w-[320px] z-50">
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-alice-brown)]"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {multiple && items.length > 0 && (
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 text-xs">
              <button type="button" onClick={handleSelectAll} className="text-[var(--color-alice-brown)] hover:underline">
                Select All
              </button>
              <button type="button" onClick={handleClearAll} className="text-gray-500 hover:text-gray-700">
                Clear All
              </button>
            </div>
          )}

          <div className="max-h-[300px] overflow-y-auto p-2">
            {!multiple && (
              <button
                type="button"
                onClick={() => { onChange(null); setIsOpen(false); }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors
                  ${!selectedIds ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-50 text-gray-700'}
                `}
              >
                <span className="flex-1 text-left">{allLabel}</span>
              </button>
            )}

            {filteredItems.length === 0 ? (
              <div className="px-3 py-4 text-sm text-gray-400 text-center">No matches</div>
            ) : (
              filteredItems.map((item) => {
                const id = getId(item);
                const isSelected = multiple ? selectedSet.has(id) : selectedIds === id;
                const img = getImage ? getImage(item) : null;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleItemClick(id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors
                      ${isSelected ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-50 text-gray-700'}
                    `}
                  >
                    {multiple && (
                      <span
                        className={`
                          w-4 h-4 border rounded flex items-center justify-center shrink-0
                          ${isSelected ? 'bg-[#8B7355] ' : 'border-gray-300  bg-white'} '}
                        `}
                      >
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                    )}
                    {img && <img src={img} alt="" className="w-8 h-8 object-cover shrink-0" />}
                    <span className="flex-1 text-left truncate">{getLabel(item)}</span>
                    {!multiple && isSelected && (
                      <svg className="w-4 h-4 text-[var(--color-alice-brown)]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

FilterDropdown.propTypes = {
  label: PropTypes.string,
  items: PropTypes.array.isRequired,
  selectedIds: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
  getId: PropTypes.func.isRequired,
  getLabel: PropTypes.func.isRequired,
  getImage: PropTypes.func,
  allLabel: PropTypes.string,
  emptyLabel: PropTypes.string,
  disabled: PropTypes.bool,
  disabledReason: PropTypes.string,
  minWidth: PropTypes.number,
};