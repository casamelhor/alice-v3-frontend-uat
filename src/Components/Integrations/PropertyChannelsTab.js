// integration: alice_v3_claude — w7 — "Channels" tab on Property details: where this property is listed
// with a travel provider, and which of its rooms each provider can book.
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Spinner } from "react-bootstrap";
import { integrationConnectionAPI, integrationConnectionsAPI } from "@/services/integrationProvider";
import { isOk } from "./IntegrationsShell";
import { MODE_LABEL } from "./IntegrationsConnections";
import "./Integrations.css";

const UNIT_LABEL = { room: "Room", bed: "Bed", exclusive: "Whole room" };

export default function PropertyChannelsTab({ propertyId }) {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    if (!propertyId) return;
    (async () => {
      const res = await integrationConnectionsAPI({ property: propertyId });
      if (!isOk(res)) return setRows([]);
      const details = await Promise.all(res.data.response.map((c) => integrationConnectionAPI(c.id)));
      setRows(details.filter(isOk).map((d) => {
        const c = d.data.response;
        const link = c.properties.find((p) => p.property.id === Number(propertyId));
        const mapped = new Set((link?.units || []).filter((u) => u.active).map((u) => u.room_id));
        return { c, link, unmappedRooms: (link?.rooms || []).filter((r) => !mapped.has(r.id)) };
      }));
    })();
  }, [propertyId]);

  if (!rows) return <div className="intg-empty"><Spinner animation="border" size="sm" /></div>;
  if (rows.length === 0) {
    return <div className="intg-card intg-empty">This property is not listed with any travel provider.</div>;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "8px 0" }}>
      {rows.map(({ c, link, unmappedRooms }) => (
        <section key={c.id} className="intg-card intg-card-pad">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ flexGrow: 1 }}>
              <div className="intg-flag-title">{c.provider} · {c.company}</div>
              <div className="intg-muted">Listed as “{link?.external_name}”</div>
            </div>
            <span className={`intg-pill ${c.mode}`}>{MODE_LABEL[c.mode]}</span>
            <Link className="intg-btn" href={`/Integrations/Connection?id=${c.id}`}>Edit mapping</Link>
          </div>
          {unmappedRooms.length > 0 && (
            <div className="intg-banner waiting" style={{ margin: "0 0 10px" }}>
              Not bookable through {c.provider}: {unmappedRooms.map((r) => r.name).join(", ")}. Map them so their bookings land.
            </div>
          )}
          <table className="table table-sm" style={{ fontSize: 14, marginBottom: 0 }}>
            <thead><tr><th scope="col">{c.provider} room</th><th scope="col">Alice room</th><th scope="col">Books as</th></tr></thead>
            <tbody>
              {(link?.units || []).filter((u) => u.active).map((u) => (
                <tr key={u.id}>
                  <td>{u.code}{u.bed ? ` · bed ${u.bed}` : ""}</td>
                  <td>{u.room}</td>
                  <td>{UNIT_LABEL[u.unit]}{u.unit === "bed" && u.bed_index !== null ? ` ${u.bed_index + 1}` : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}
