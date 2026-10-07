// integration: alice_v3_claude — w7 — booking integrations admin: Connections list
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { integrationConnectionsAPI, integrationHealthAPI } from "@/services/integrationProvider";
import IntegrationsShell, { errorMessage, isOk } from "./IntegrationsShell";

export const MODE_LABEL = { off: "Off", shadow: "Shadow", review: "Review", auto: "Automatic" };

export default function IntegrationsConnections() {
  const [rows, setRows] = useState(null);
  const [access, setAccess] = useState("view");
  const [badge, setBadge] = useState(0);

  useEffect(() => {
    (async () => {
      const [res, health] = await Promise.all([integrationConnectionsAPI(), integrationHealthAPI()]);
      if (isOk(res)) setRows(res.data.response);
      else toast.error(errorMessage(res, "Could not load connections."));
      if (isOk(health)) {
        setAccess(health.data.response.access);
        setBadge(health.data.response.inbox_badge);
        const status = Object.fromEntries(health.data.response.connections.map((c) => [c.id, c]));
        setRows((current) => current?.map((r) => ({ ...r, health: status[r.id] })));
      }
    })();
  }, []);

  return (
    <IntegrationsShell
      active="connections"
      badge={badge}
      actions={access === "admin" ? <Link className="intg-btn primary" href="/Integrations/Connect">Connect a company</Link> : null}
    >
      {!rows && <div className="intg-empty"><Spinner animation="border" size="sm" /> Loading…</div>}
      {rows && rows.length === 0 && (
        <div className="intg-card intg-empty">
          No company is connected yet.{access === "admin" ? " Use “Connect a company” to start." : ""}
        </div>
      )}
      {rows && rows.length > 0 && (
        <div className="intg-card">
          {rows.map((c) => (
            <div key={c.id} className="intg-flag" style={{ gridTemplateColumns: "minmax(0,1fr) 150px 110px 110px auto" }}>
              <div>
                <div className="intg-flag-title">{c.company}</div>
                <div className="intg-muted">{c.provider} · {c.route_address}</div>
              </div>
              <div className="intg-muted">{c.name}</div>
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
    </IntegrationsShell>
  );
}
