/**
 * @file Hook for managing resource tree (property/room/bed) expansion state
 */

import { useMemo, useCallback } from 'react';
import { buildResourceList } from '../utils/gridPositioning';

/**
 * @typedef {Object} ResourceTreeConfig
 * @property {Array} properties - Array of properties with rooms and beds
 * @property {Set<string>} expandedPropertyIds - Set of expanded property IDs
 * @property {Set<string>} expandedRoomIds - Set of expanded room IDs
 * @property {(id: string) => void} onToggleProperty - Callback when property expansion is toggled
 * @property {(id: string) => void} onToggleRoom - Callback when room expansion is toggled
 */

/**
 * @typedef {Object} Resource
 * @property {string} id - Resource ID
 * @property {'property' | 'room' | 'bed'} type - Resource type
 * @property {string} name - Display name
 * @property {Object} data - Original data object
 * @property {number} depth - Nesting depth (0 for property, 1 for room, 2 for bed)
 * @property {boolean} [isExpanded] - Whether this resource is expanded
 * @property {boolean} [hasChildren] - Whether this resource has expandable children
 */

/**
 * @typedef {Object} ResourceTree
 * @property {Resource[]} resources - Flat list of visible resources (rows)
 * @property {(id: string) => void} toggleProperty - Toggle property expansion
 * @property {(id: string) => void} toggleRoom - Toggle room expansion
 * @property {(id: string) => Resource | undefined} getResource - Get resource by ID
 */

/**
 * Hook to manage resource tree state and build flat resource list
 * @param {ResourceTreeConfig} config - Configuration
 * @returns {ResourceTree}
 */
export function useResourceTree({
  properties,
  expandedPropertyIds,
  expandedRoomIds,
  onToggleProperty,
  onToggleRoom,
}) {
  // Build flat resource list from hierarchical data
  const resources = useMemo(() => {
    if (!properties || properties.length === 0) {
      return [];
    }

    const flatList = buildResourceList(properties, expandedPropertyIds, expandedRoomIds);

    // Enhance with expansion state and hasChildren flag
    return flatList.map(resource => {
      let isExpanded = false;
      let hasChildren = false;

      if (resource.type === 'property') {
        const propId = resource.id;
        isExpanded = expandedPropertyIds.has(propId);
        // Check if property has rooms
        const property = properties.find(p => (p.property_uid || p.id) === propId);
        hasChildren = property?.rooms?.length > 0;
      } else if (resource.type === 'room') {
        const roomId = resource.id;
        isExpanded = expandedRoomIds.has(roomId);
        // Check if room is twin-sharing with beds
        const isTwinSharing = resource.data.room_type === 'Twin-Sharing' || resource.data.isTwinSharing;
        hasChildren = isTwinSharing && resource.data.beds?.length > 0;
      }

      return {
        ...resource,
        isExpanded,
        hasChildren,
      };
    });
  }, [properties, expandedPropertyIds, expandedRoomIds]);

  // Toggle property expansion
  const toggleProperty = useCallback((propertyId) => {
    onToggleProperty(propertyId);
  }, [onToggleProperty]);

  // Toggle room expansion
  const toggleRoom = useCallback((roomId) => {
    onToggleRoom(roomId);
  }, [onToggleRoom]);

  // Get resource by ID
  const getResource = useCallback((id) => {
    return resources.find(r => r.id === id);
  }, [resources]);

  return {
    resources,
    toggleProperty,
    toggleRoom,
    getResource,
  };
}
