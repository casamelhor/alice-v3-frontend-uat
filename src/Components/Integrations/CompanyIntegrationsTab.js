// integration: alice_v3_claude — w7 — "Integrations" tab on Company details
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Spinner } from "react-bootstrap";
import { integrationConnectionsAPI, integrationHealthAPI } from "@/services/integrationProvider";
import { isOk } from "./IntegrationsShell";
import { MODE_LABEL } from "./IntegrationsConnections";
import "./Integrations.css";

export default function CompanyIntegrationsTab({ companyId }) {
  const [rows, setRows] = useState(null);
  const [access, setAccess] = useState("view");

  useEffect(() => {
    if (!companyId) return;
    Promise.all([integrationConnectionsAPI({ company: companyId }), integrationHealthAPI()]).then(([res, health]) => {
      const status = isOk(health) ? Object.fromEntries(health.data.response.connections.map((c) => [c.id, c])) : {};
      if (isOk(health)) setAccess(health.data.response.access);
      setRows(isOk(res) ? res.data.response.map((r) => ({ ...r, health: status[r.id] })) : []);
    });
  }, [companyId]);

  if (!rows) return <div className="intg-empty"><Spinner animation="border" size="sm" /></div>;
  return (
    <div style={{ padding: "8px 0" }}>
      {rows.length === 0 ? (
        <div className="intg-card intg-empty">
          This company does not receive bookings from a travel provider.
          {access === "admin" && (
            <div style={{ marginTop: 12 }}>
              <Link className="intg-btn primary" href={`/Integrations/Connect?company=${companyId}`}>Connect this company</Link>
            </div>
          )}
        </div>
      ) : (
        <div className="intg-card">
          {rows.map((c) => (
            <div key={c.id} className="intg-flag" style={{ gridTemplateColumns: "minmax(0,1fr) 110px 110px auto" }}>
              <div>
                <div className="intg-flag-title">{c.provider}</div>
                <div className="intg-muted">Bookings arrive through {c.route_address}</div>
              </div>
              <div>{c.health && <span className={`intg-pill ${c.health.status}`}>{c.health.status}</span>}</div>
              <div><span className={`intg-pill ${c.mode}`}>{MODE_LABEL[c.mode]}</span></div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <Link className="intg-btn" href={`/Integrations/Inbox?account=${c.id}${c.mode === "shadow" ? "&tab=shadow" : ""}`}>Inbox</Link>
                <Link className="intg-btn primary" href={`/Integrations/Connection?id=${c.id}`}>Open</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
