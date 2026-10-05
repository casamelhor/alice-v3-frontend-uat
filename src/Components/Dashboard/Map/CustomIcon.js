import L from "leaflet";

export const customIcon = (count, image) =>
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
             style="width:40px;height:40px;border-radius:8px;margin-top:4px"/>
      </div>
    `,
    iconSize: [56, 72],
    iconAnchor: [28, 72],
  });
