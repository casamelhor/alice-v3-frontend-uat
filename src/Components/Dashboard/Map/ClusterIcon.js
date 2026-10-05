import L from "leaflet";

/**
 * Creates a custom cluster icon that displays property thumbnails
 * @param {Array} properties - Array of property objects in the cluster
 * @param {Number} clusterSize - Number of properties in cluster
 */
export const createClusterIcon = (properties, clusterSize) => {
  // Limit to first 4 thumbnails to keep icon size reasonable
  const visibleProps = properties.slice(0, 4);
  const remaining = clusterSize > 4 ? clusterSize - 4 : 0;

  // Create grid layout for thumbnails
  const thumbnailsHtml = visibleProps
    .map(
      (prop) =>
        `<img src="${prop?.cover_photo}" 
              alt="${prop?.property_name}" 
              style="width:32px;height:32px;border-radius:4px;border:1px solid #fff;margin:2px"
              title="${prop?.property_name}"
         />`
    )
    .join("");

  const remainingBadge =
    remaining > 0
      ? `<div style="position:absolute;top:-8px;right:-8px;background:#ff6b6b;color:white;
         border-radius:50%;width:28px;height:28px;display:flex;align-items:center;
         justify-content:center;font-weight:bold;font-size:12px">+${remaining}</div>`
      : "";

  return L.divIcon({
    className: "cluster-icon",
    html: `
      <div style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
        padding: 6px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        border: 2px solid white;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 4px;
        width: auto;
        position: relative;
      ">
        ${thumbnailsHtml}
        <div style="
          font-weight: bold;
          color: white;
          font-size: 11px;
          background: rgba(0,0,0,0.3);
          padding: 2px 6px;
          border-radius: 4px;
          margin-top: 4px;
          width: 100%;
          text-align: center;
        ">
          ${clusterSize} properties
        </div>
        ${remainingBadge}
      </div>
    `,
    iconSize: [80, 80],
    iconAnchor: [40, 40],
    popupAnchor: [0, -40],
  });
};

/**
 * Groups properties by their location (within a small radius)
 * Properties at same coordinates are grouped together
 */
export const groupPropertiesByLocation = (properties, radiusKm = 0.5) => {
  const groups = [];
  const processed = new Set();

  properties.forEach((prop, index) => {
    if (processed.has(index)) return;

    const group = [prop];
    processed.add(index);

    // Find all properties within radiusKm of this property
    properties.forEach((otherProp, otherIndex) => {
      if (processed.has(otherIndex) || index === otherIndex) return;

      const distance = getDistance(
        prop.latitude,
        prop.longitude,
        otherProp.latitude,
        otherProp.longitude
      );

      if (distance <= radiusKm) {
        group.push(otherProp);
        processed.add(otherIndex);
      }
    });

    groups.push(group);
  });

  return groups;
};

/**
 * Calculate distance between two coordinates using Haversine formula (in km)
 */
export const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
