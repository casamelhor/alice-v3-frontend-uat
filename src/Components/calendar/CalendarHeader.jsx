"use client";
import PropTypes from 'prop-types';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { setMonth, setYear } from 'date-fns';
import { useCalendarStore, useIsCasaMelhorUser } from '@/stores/calendarStore';
import { formatMonthYear } from '@/utils/formatters';
import { FilterDropdown } from './FilterDropdown';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const years = Array.from({ length: 10 }, (_, i) => 2024 + i);

/**
 * Calendar page header: month/year selector + cascading filter dropdowns
 * (Company -> Location -> Property). Company is hidden for non-CasaMelhor
 * users, who are implicitly scoped to their own company by the backend.
 */
export function CalendarHeader({ FilterOption }) {
  const {
    currentMonth,
    setCurrentMonth,
    goToToday,
    filters,
    setCompanyFilter,
    setLocationsFilter,
    setPropertyIdsFilter,
  } = useCalendarStore();
  const isCasaMelhor = useIsCasaMelhorUser();

  const [isMonthSelectorOpen, setIsMonthSelectorOpen] = useState(false);
  const monthSelectorRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (monthSelectorRef.current && !monthSelectorRef.current.contains(event.target)) {
        setIsMonthSelectorOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const companies = FilterOption?.companies || [];
  const locations = FilterOption?.locations || [];
  const properties = FilterOption?.properties || [];

  // Property list is already backend-scoped to the active company+locations
  // via cascading FilterOptionAPI calls in CalendarPage, so no client-side
  // re-filter is needed here.
  const propertyItems = useMemo(() => properties, [properties]);

  const handleMonthSelect = (monthIndex) => {
    setCurrentMonth(setMonth(currentMonth, monthIndex));
  };
  const handleYearSelect = (year) => {
    setCurrentMonth(setYear(currentMonth, year));
  };

  return (
    <div className="py-3 border-b border-[var(--color-alice-sand)]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Left: Month/Year selector + Today */}
        <div className="flex items-center gap-4">
          <div className="relative" ref={monthSelectorRef}>
            <button
              type="button"
              onClick={() => setIsMonthSelectorOpen(!isMonthSelectorOpen)}
              className="flex items-center gap-2 text-3xl font-display text-gray-800 hover:text-[var(--color-alice-brown)] transition-colors"
            >
              <h3 className="page-title mb-0">{formatMonthYear(currentMonth)}</h3>
              <ChevronDown className={`w-5 h-5 transition-transform ${isMonthSelectorOpen ? 'rotate-180' : ''}`} />
            </button>

            {isMonthSelectorOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 min-w-[280px]">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <select
                    value={currentMonth.getFullYear()}
                    onChange={(e) => handleYearSelect(Number(e.target.value))}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-alice-brown)]"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {months.map((month, index) => (
                    <button
                      type="button"
                      key={month}
                      onClick={() => {
                        handleMonthSelect(index);
                        setIsMonthSelectorOpen(false);
                      }}
                      className={`
                        px-3 py-2 text-sm rounded-lg transition-colors
                        ${currentMonth.getMonth() === index
                          ? 'bg-[var(--color-alice-brown)] text-white'
                          : 'hover:bg-gray-100 text-gray-700'}
                      `}
                    >
                      {month.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={goToToday}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Today
          </button>
        </div>

        {/* Right: Company (CasaMelhor only) -> Location -> Property */}
        <div className="flex items-center gap-3 flex-wrap">
          {isCasaMelhor && (
            <FilterDropdown
              label="Company"
              items={companies}
              selectedIds={filters.companyId}
              onChange={setCompanyFilter}
              multiple={false}
              getId={(c) => c.id}
              getLabel={(c) => c.name}
              allLabel="Select Company"
              emptyLabel="No companies"
              minWidth={200}
            />
          )}

          <FilterDropdown
            label="Location"
            items={locations}
            selectedIds={filters.locations}
            onChange={setLocationsFilter}
            multiple
            getId={(l) => l.city}
            getLabel={(l) => l.city}
            allLabel="All Locations"
            emptyLabel="No locations"
            disabled={!filters.companyId}
            disabledReason="Select a company first"
            minWidth={180}
          />

          <FilterDropdown
            label="Property"
            items={propertyItems}
            selectedIds={filters.propertyIds}
            onChange={setPropertyIdsFilter}
            multiple
            getId={(p) => p.uid}
            getLabel={(p) => p.name}
            getImage={(p) => p.property_photo_url || null}
            allLabel="All Properties"
            emptyLabel="No properties"
            disabled={!filters.companyId}
            disabledReason="Select a company first"
            minWidth={200}
          />
        </div>
      </div>
    </div>
  );
}

CalendarHeader.propTypes = {
  FilterOption: PropTypes.object,
};
