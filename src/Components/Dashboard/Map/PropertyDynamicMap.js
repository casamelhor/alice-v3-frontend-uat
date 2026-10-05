// "use client";
// // components/MapView.jsx
// import { MapContainer, TileLayer, Marker, Popup,useMap } from "react-leaflet";
// import MarkerClusterGroup from "react-leaflet-cluster";
// import { useState, useMemo, useEffect } from "react";
// import {
//   createPropertyMarker,
//   createClusterIcon,
//   PropertiesPopup,
// } from "./MarkerUtils";

// import "leaflet/dist/leaflet.css";

// const MapView = ({ locations, selectedProperty }) => {
//   // const location = [
//   //   {
//   //     property_id: 118,
//   //     property_uid: "b3356738-52ae-4d26-9629-97cf0e1d6224",
//   //     property_name: "Casamelhor KBG Sanand 707",
//   //     cover_photo: "/media/1B7A0719.JPG",
//   //     latitude: 23.0223383,
//   //     longitude: 72.3525202,
//   //     city: "Ahmedabad",
//   //     guest_count: 1
//   //   },
//   //   {
//   //     property_id: 107,
//   //     property_uid: "30048e2a-f046-40ef-9872-61e2e3b83636",
//   //     property_name: "Plot No. 33, South City-2",
//   //     cover_photo: "/media/Screenshot_2026-05-18_125558.png",
//   //     latitude: 28.417045,
//   //     longitude: 77.0551119,
//   //     city: "Gurugram",
//   //     guest_count: 4
//   //   },
//   //   {
//   //     property_id: 126,
//   //     property_uid: "83af3af3-90bb-45e4-9843-1b4746078fe2",
//   //     property_name: "Casamelhor KBG Sanand 801",
//   //     cover_photo: "/media/1B7A0719_VZeKxHG.JPG",
//   //     latitude: 23.0092807,
//   //     longitude: 72.3694071,
//   //     city: "Ahmedabad",
//   //     guest_count: 1
//   //   },
//   //   {
//   //     property_id: 109,
//   //     property_uid: "20ba8ac4-3d8d-4c2d-bc6d-383941325a28",
//   //     property_name: "Muyeeda Serenity Delhivery",
//   //     cover_photo: "/media/Screenshot_2026-05-18_134422_ZZVKpZB.png",
//   //     latitude: 12.9611493,
//   //     longitude: 77.604016,
//   //     city: "Bengaluru",
//   //     guest_count: 1
//   //   },
//   //   {
//   //     property_id: 108,
//   //     property_uid: "eb554ea6-2809-4f01-823a-ca2f2e8c6846",
//   //     property_name: "Casa Delhivery",
//   //     cover_photo: "/media/Screenshot_2026-05-18_134130.png",
//   //     latitude: 15.5093082,
//   //     longitude: 73.827662,
//   //     city: "Porvorim",
//   //     guest_count: 2
//   //   },
//   //   {
//   //     property_id: 110,
//   //     property_uid: "75b6fb13-43a4-48eb-8715-1ce4f8eadf16",
//   //     property_name: "301 Muyeeda Serenity Delhivery",
//   //     cover_photo: "/media/Screenshot_2026-05-18_134130_9SHI04T.png",
//   //     latitude: 12.9611507,
//   //     longitude: 77.6038572,
//   //     city: "Bengaluru",
//   //     guest_count: 1
//   //   },
//   //   {
//   //     property_id: 201,
//   //     property_uid: "a1c9d2e4-1111-4b2a-a8d8-0a1b2c3d4e5f",
//   //     property_name: "Seaside Retreat Villa",
//   //     cover_photo: "/media/seaside_villa.jpg",
//   //     latitude: 19.0759837,
//   //     longitude: 72.8776559,
//   //     city: "Mumbai",
//   //     guest_count: 6
//   //   },
//   //   {
//   //     property_id: 202,
//   //     property_uid: "b2d9f3a5-2222-4c3b-b9e9-1b2c3d4e5f6a",
//   //     property_name: "Hilltop Cottage",
//   //     cover_photo: "/media/hilltop_cottage.png",
//   //     latitude: 34.083656,
//   //     longitude: 74.797371,
//   //     city: "Srinagar",
//   //     guest_count: 3
//   //   },
//   //   {
//   //     property_id: 203,
//   //     property_uid: "c3e9a4b6-3333-4d4c-c0f0-2c3d4e5f6a7b",
//   //     property_name: "Desert Dune House",
//   //     cover_photo: "/media/desert_dune.jpg",
//   //     latitude: 26.9124336,
//   //     longitude: 75.7872709,
//   //     city: "Jaipur",
//   //     guest_count: 5
//   //   },
//   //   {
//   //     property_id: 204,
//   //     property_uid: "d4f9b5c7-4444-4e5d-d1g1-3d4e5f6a7b8c",
//   //     property_name: "Backwaters Bungalow",
//   //     cover_photo: "/media/backwaters_bungalow.jpg",
//   //     latitude: 9.9312328,
//   //     longitude: 76.2673041,
//   //     city: "Kochi",
//   //     guest_count: 4
//   //   },
//   //   {
//   //     property_id: 205,
//   //     property_uid: "e5g0c6d8-5555-4f6e-e2h2-4e5f6a7b8c9d",
//   //     property_name: "Forest Edge Cabin",
//   //     cover_photo: "/media/forest_cabin.png",
//   //     latitude: 21.1458009,
//   //     longitude: 79.0881546,
//   //     city: "Nagpur",
//   //     guest_count: 2
//   //   },
//   //   {
//   //     property_id: 206,
//   //     property_uid: "f6h1d7e9-6666-4g7f-f3i3-5f6a7b8c9d0e",
//   //     property_name: "Lakeside Studio",
//   //     cover_photo: "/media/lakeside_studio.jpg",
//   //     latitude: 22.7195687,
//   //     longitude: 75.8577258,
//   //     city: "Indore",
//   //     guest_count: 2
//   //   }
//   // ];

//   const FlyToSelected = ({ selectedProperty }) => {
//     const map = useMap();
//     useEffect(() => {
//       if (selectedProperty?.latitude && selectedProperty?.longitude) {
//         map.flyTo([selectedProperty.latitude, selectedProperty.longitude], 15, {
//           duration: 1.2,
//         });
//       }
//     }, [selectedProperty, map]);
//     return null;
//   };
//   // Group properties by location (within 500m radius)
//   const locationGroups = useMemo(() => {
//     const groups = [];
//     const processed = new Set();

//     locations?.forEach((prop, index) => {
//       if (processed.has(index)) return;

//       const group = [prop];
//       processed.add(index);

//       // Find properties within 500m (0.5km) of this property
//       locations?.forEach((otherProp, otherIndex) => {
//         if (processed.has(otherIndex) || index === otherIndex) return;

//         const distance = getDistanceKm(
//           prop.latitude,
//           prop.longitude,
//           otherProp.latitude,
//           otherProp.longitude
//         );

//         if (distance <= 0.5) {
//           group.push(otherProp);
//           processed.add(otherIndex);
//         }
//       });

//       groups.push(group);
//     });

//     return groups;
//   }, [locations]);

//   // Helper function to calculate distance between two coordinates (Haversine formula)
//   function getDistanceKm(lat1, lon1, lat2, lon2) {
//     const R = 6371; // Earth radius in km
//     const dLat = ((lat2 - lat1) * Math.PI) / 180;
//     const dLon = ((lon2 - lon1) * Math.PI) / 180;
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos((lat1 * Math.PI) / 180) *
//       Math.cos((lat2 * Math.PI) / 180) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
//   }
//   return (
//     <MapContainer
//       center={[20.5937, 78.9629]}
//       zoom={5}
//       style={{ height: "600px", width: "100%" }}
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       <FlyToSelected selectedProperty={selectedProperty} />

//       {locationGroups.map((group, groupIndex) => {
//         const [lat, lon] = [group[0].latitude, group[0].longitude];
//         const isCluster = group.length > 1;

//         if (isCluster) {
//           // Render cluster marker with thumbnails
//           return (
//             <Marker
//               key={`cluster-${groupIndex}`}
//               position={[lat, lon]}
//               icon={createClusterIcon(group, group.length)}
//             >
//               <Popup>
//                 <PropertiesPopup properties={group} />
//               </Popup>
//             </Marker>
//           );
//         } else {
//           // Render single property marker
//           const prop = group[0];
//           return (
//             <Marker
//               key={prop.property_id}
//               position={[lat, lon]}
//               icon={createPropertyMarker(
//                 prop.guest_count,
//                 `${prop.cover_photo?prop.cover_photo:'/images/icons/No-Image.svg'}`
//               )}
//             >
//               <Popup>
//                 <PropertiesPopup properties={group} />
//               </Popup>
//             </Marker>
//           );
//         }
//       })}
//     </MapContainer>
//   );
// };

// export default MapView;


"use client";
// components/MapView.jsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useMemo, useEffect } from "react";
import {
  createPropertyMarker,
  createClusterIcon,
  PropertiesPopup,
} from "./MarkerUtils";

import "leaflet/dist/leaflet.css";

// Helper: coerce to a finite number, otherwise null
const toNum = (v) => {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return typeof n === "number" && Number.isFinite(n) ? n : null;
};

const FlyToSelected = ({ selectedProperty }) => {
  const map = useMap();
  useEffect(() => {
    const lat = toNum(selectedProperty?.latitude);
    const lon = toNum(selectedProperty?.longitude);
    if (lat !== null && lon !== null && map) {
      map.flyTo([lat, lon], 15, { duration: 1.2 });
    }
  }, [selectedProperty, map]);
  return null;
};

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
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
}

const MapView = ({ locations, selectedProperty }) => {
  // Step 1: normalize + drop anything without valid coordinates
  const validLocations = useMemo(() => {
    return (locations || [])
      .map((loc) => {
        const latitude = toNum(loc.latitude);
        const longitude = toNum(loc.longitude);
        if (latitude === null || longitude === null) return null;
        return { ...loc, latitude, longitude };
      })
      .filter(Boolean);
  }, [locations]);

  // Step 2: group properties within 500m of each other
  const locationGroups = useMemo(() => {
    const groups = [];
    const processed = new Set();

    validLocations.forEach((prop, index) => {
      if (processed.has(index)) return;

      const group = [prop];
      processed.add(index);

      validLocations.forEach((otherProp, otherIndex) => {
        if (processed.has(otherIndex) || index === otherIndex) return;

        const distance = getDistanceKm(
          prop.latitude,
          prop.longitude,
          otherProp.latitude,
          otherProp.longitude
        );

        if (distance <= 0.5) {
          group.push(otherProp);
          processed.add(otherIndex);
        }
      });

      groups.push(group);
    });

    return groups;
  }, [validLocations]);

  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      style={{ height: "600px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FlyToSelected selectedProperty={selectedProperty} />

      {locationGroups.map((group, groupIndex) => {
        const lat = group[0].latitude;
        const lon = group[0].longitude;

        // Extra guard: never render a Marker without a valid position
        if (lat === null || lon === null) return null;

        const isCluster = group.length > 1;

        if (isCluster) {
          return (
            <Marker
              key={`cluster-${groupIndex}`}
              position={[lat, lon]}
              icon={createClusterIcon(group, group.length)}
            >
              <Popup>
                <PropertiesPopup properties={group} />
              </Popup>
            </Marker>
          );
        }

        const prop = group[0];
        return (
          <Marker
            key={prop.property_id}
            position={[lat, lon]}
            icon={createPropertyMarker(
              prop.guest_count,
              prop.cover_photo ? prop.cover_photo : "/images/icons/No-Image.svg"
            )}
          >
            <Popup>
              <PropertiesPopup properties={group} />
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapView;
