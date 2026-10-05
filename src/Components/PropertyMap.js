// "use client";

// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import L from "leaflet";

// // Fix marker icon issue
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//   iconUrl:
//     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl:
//     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
// });

// export default function PropertyMap({ properties }) {
//   return (
//     <MapContainer
//       center={[20.5937, 78.9629]}
//       zoom={5}
//       scrollWheelZoom
//       style={{
//         height: "100%",
//         width: "100%",
//       }}
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />

//       {properties?.map((item, index) => {
//         if (!item?.latitude || !item?.longitude) return null;

//         return (
//           <Marker
//             key={index}
//             position={[
//               Number(item?.latitude),
//               Number(item?.longitude),
//             ]}
//           >
//             <Popup>
//               <div style={{ fontSize: "14px", lineHeight: "18px" }}>
//                 <strong>{item?.property_name}</strong>
//                 <br />
//                 {item?.city}, {item?.state}
//               </div>
//             </Popup>
//           </Marker>
//         );
//       })}
//     </MapContainer>
//   );
// }


// "use client";

// import { useEffect, useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

// export default function PropertyMap({ properties }) {
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     // Must import Leaflet CSS on client side
//     require("leaflet/dist/leaflet.css");

//     // Fix marker icons properly for Next.js
//     const L = require("leaflet");
//     delete L.Icon.Default.prototype._getIconUrl;
//     L.Icon.Default.mergeOptions({
//       iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//       iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//       shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
//     });

//     setIsClient(true);
//   }, []);

//   if (!isClient) return null;

//   return (
//     <MapContainer
//       // center={[20.5937, 78.9629]}
//       center={[Number(properties?.[0]?.latitude),Number(properties?.[0]?.longitude)]}
//       zoom={7}
//       scrollWheelZoom
//       style={{ height: "100%", width: "100%" }}
//     >
//       <TileLayer
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />

//       {properties?.map((item, index) => {
//         const lat = Number(item?.latitude);
//         const lng = Number(item?.longitude);
//         if (!lat || !lng || isNaN(lat) || isNaN(lng)) return null;

//         return (
//           <Marker key={index} position={[lat, lng]}>
//             <Popup>
//               <div style={{ fontSize: "14px", lineHeight: "18px" }}>
//                 <strong>{item?.property_name}</strong>
//                 <br />
//                 {item?.city}, {item?.state}
//               </div>
//             </Popup>
//           </Marker>
//         );
//       })}
//     </MapContainer>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

function FitBounds({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length === 0) return;

    if (positions.length === 1) {
      map.setView(positions[0], 12);
    } else {
      const L = require("leaflet");
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [positions]);

  return null;
}

// Group properties by same lat/lng
function groupByCoordinates(properties) {
  const groups = {};

  properties.forEach((item) => {
    const key = `${Number(item.latitude).toFixed(6)}_${Number(item.longitude).toFixed(6)}`;
    if (!groups[key]) {
      groups[key] = {
        latitude: Number(item.latitude),
        longitude: Number(item.longitude),
        items: [],
      };
    }
    groups[key].items.push(item);
  });

  return Object.values(groups);
}

export default function PropertyMap({ properties }) {
  console.log('fetch',properties)
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    require("leaflet/dist/leaflet.css");

    const L = require("leaflet");
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    setIsClient(true);
  }, []);

  const validProperties = (properties || []).filter((item) => {
    const lat = Number(item?.latitude);
    const lng = Number(item?.longitude);
    return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
  });

  const grouped = groupByCoordinates(validProperties);

  const positions = grouped.map((g) => [g.latitude, g.longitude]);

  if (!isClient) return null;

  return (
    <MapContainer
      center={positions.length > 0 ? positions[0] : [20.5937, 78.9629]}
      zoom={5}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBounds positions={positions} />

      {grouped.map((group, index) => (
        <Marker
          key={index}
          position={[group.latitude, group.longitude]}
        >
          <Popup>
            <div style={{ fontSize: "14px", lineHeight: "22px", maxWidth: "200px" }}>
              {/* Multiple properties at same location */}
              {group.items.length > 1 && (
                <div
                  style={{
                    fontWeight: "bold",
                    marginBottom: "6px",
                    color: "#1a6b3c",
                    borderBottom: "1px solid #eee",
                    paddingBottom: "4px",
                  }}
                >
                  {group.items.length} Properties here
                </div>
              )}

              {group.items.map((item, i) => (
                <div
                  key={item?.id || i}
                  style={{
                    marginBottom: i < group.items.length - 1 ? "8px" : "0",
                    paddingBottom: i < group.items.length - 1 ? "8px" : "0",
                    borderBottom: i < group.items.length - 1 ? "1px solid #f0f0f0" : "none",
                  }}
                >
                  <strong>{item?.property_name}</strong>
                  <br />
                  <span style={{ color: "#555" }}>{item?.city}, {item?.state}</span>
                  <br />
                  <small style={{ color: "#aaa" }}>
                    {Number(item.latitude).toFixed(4)}, {Number(item.longitude).toFixed(4)}
                  </small>
                </div>
              ))}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
