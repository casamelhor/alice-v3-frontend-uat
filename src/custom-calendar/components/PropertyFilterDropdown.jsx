import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';

/**
 * PropertyFilterDropdown Component
 * 
 * Multi-select dropdown for filtering properties with:
 * - Search functionality
 * - Property list with checkboxes and photos
 * - "Select All" / "Clear All" buttons
 */
export function PropertyFilterDropdown({ 
  selectedProperties = [], 
  availableProperties = [],
  onPropertiesChange 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Filter properties based on search
  const filteredProperties = availableProperties.filter(property =>
    property.property_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle individual property
  const toggleProperty = (propertyId) => {
    const newSelected = selectedProperties.includes(propertyId)
      ? selectedProperties.filter(id => id !== propertyId)
      : [...selectedProperties, propertyId];
    onPropertiesChange(newSelected);
  };

  // Select all properties
  const selectAll = () => {
    onPropertiesChange(availableProperties.map(p => p.uid || p.id));
  };

  // Clear all selections
  const clearAll = () => {
    onPropertiesChange([]);
  };

  // Get display text for button
  const getDisplayText = () => {
    if (selectedProperties.length === 0 || selectedProperties.length === availableProperties.length) {
      return 'All Properties';
    }
    return `${selectedProperties.length} ${selectedProperties.length === 1 ? 'Property' : 'Properties'}`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-[15px] py-[14px] text-sm font-normal  text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-w-[160px] justify-between"
      >
        <span>{getDisplayText()}</span>
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200  shadow-lg z-50 max-h-96 overflow-hidden flex flex-col">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-gray-50">
            <button
              onClick={selectAll}
              className="text-xs font-normal text-[#8B7355] hover:text-[#7A6548] transition-colors"
            >
              Select All
            </button>
            <button
              onClick={clearAll}
              className="text-xs font-normal text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear All
            </button>
          </div>

          {/* Property List */}
          <div className="overflow-y-auto flex-1">
            {filteredProperties.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No properties found
              </div>
            ) : (
              <div className="py-1">
                {filteredProperties.map((property) => {
                  const propertyId = property.uid || property.id;
                  const propertyName = property.name || property.name;
                  const propertyPhoto = property.property_photo_url;
                  const isSelected = selectedProperties.includes(propertyId);                  

                  return (
                    <button
                      key={propertyId}
                      onClick={() => toggleProperty(propertyId)}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors"
                    >
                      {/* Checkbox */}
                      <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                        isSelected 
                          ? 'bg-[#8B7355] border-[#8B7355]' 
                          : 'border-gray-300 bg-white'
                      }`}>
                        {isSelected && (
                          <CheckIcon className="h-3 w-3 text-white" />
                        )}
                      </div>

                      {/* Property Photo */}
                      {/* {propertyPhoto && ( */}
                        <img 
                          src={propertyPhoto?`${propertyPhoto}`:"/images/icons/No-Image.svg"} 
                          alt={propertyName}
                          className="w-8 h-8 rounded object-cover flex-shrink-0"
                        />
                      {/* )} */}

                      {/* Property Name */}
                      <span className="text-sm text-gray-700 text-left flex-1 truncate">
                        {propertyName}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
