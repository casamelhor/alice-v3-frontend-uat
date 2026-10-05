import L from "leaflet";
import { Popup } from "react-leaflet";
import React, { useState } from "react";

/**
 * Popup component that displays all properties at a location
 */
export const PropertiesPopup = ({ properties }) => {
  return (
    <div style={{ minWidth: "250px", maxHeight: "400px", overflowY: "auto" }}>
      <div style={{ marginBottom: "12px", fontWeight: "bold", fontSize: "14px" }}>
        {properties.length} {properties.length === 1 ? "Property" : "Properties"}
      </div>
      {properties.map((prop) => (
        <div
          key={prop.property_id}
          style={{
            marginBottom: "12px",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          {prop.cover_photo && (
            <img
              src={`${prop.cover_photo}`}
              alt={prop.property_name}
              style={{
                width: "100%",
                height: "120px",
                objectFit: "cover",
                borderRadius: "6px",
                marginBottom: "8px",
              }}
            />
          )}
          <div style={{ fontWeight: "600", fontSize: "13px", marginBottom: "4px" }}>
            {prop.property_name}
          </div>
          <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>
            📍 {prop.city}
          </div>
          <div style={{ fontSize: "12px", color: "#0f3d3e", fontWeight: "600" }}>
            👥 {prop.guest_count} active {prop.guest_count === 1 ? "guest" : "guests"}
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Creates a marker for a single property
 */
export const createPropertyMarker = (count, image) =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        background:#0f3d3e;
        width:56px;
        height:72px;
        border-radius:30px;
        padding:4px;
        color:#fff;
        text-align:center;
        box-shadow:0 4px 10px rgba(0,0,0,.3)
      ">
        <div style="font-size:14px;font-weight:bold">${count}</div>
        <img src="${image}" 
             style="width:40px;height:40px;border-radius:8px;margin-top:4px;object-fit:cover"/>
      </div>
    `,
    iconSize: [56, 72],
    iconAnchor: [28, 72],
  });

/**
 * Creates a cluster icon showing thumbnail grid
 */
export const createClusterIcon = (properties, clusterSize) => {
  const visibleProps = properties.slice(0, 4);
  const remaining = clusterSize > 4 ? clusterSize - 4 : 0;

  const thumbnailsHtml = visibleProps
    .map(
      (prop) =>
        `<img src="${prop?.cover_photo}" 
              alt="${prop?.property_name}" 
              style="width:28px;height:28px;border-radius:4px;border:1px solid #fff;margin:2px;object-fit:cover"
              title="${prop?.property_name}"
         />`
    )
    .join("");

  const remainingBadge =
    remaining > 0
      ? `<div style="position:absolute;top:-8px;right:-8px;background:#ff6b6b;color:white;
         border-radius:50%;width:24px;height:24px;display:flex;align-items:center;
         justify-content:center;font-weight:bold;font-size:11px">+${remaining}</div>`
      : "";

  return L.divIcon({
    className: "cluster-icon",
    html: `
      <div style="
        background: #0F3D3E;
        border-radius: 8px;
        padding: 4px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        
        display: grid;
        grid-template-columns: repeat(2, 32px);
        gap: 4px;
        align-items: center;
        justify-content: center;
        position: relative;
      ">
        ${thumbnailsHtml}
        ${remainingBadge}
      </div>
    `,
    iconSize: [80, 80],
    iconAnchor: [40, 40],
    popupAnchor: [0, -40],
  });
};
