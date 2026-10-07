// integration: alice_v3_claude — w7 — booking integrations admin: Health (the landing page)
// Design: docs/integrations/W7_DESIGN.md §14.2. API: alice_channels/api/views.py HealthView.
"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { formatDistanceToNow, parseISO } from "date-fns";
import { integrationAcknowledgeFlagAPI, integrationHealthAPI } from "@/services/integrationProvider";
import IntegrationsShell, { errorMessage, isOk } from "./IntegrationsShell";

const REFRESH_MS = 60 * 1000;
const MODE_LABEL = { off: "Off", shadow: "Shadow", review: "Review", auto: "Automatic" };
const STATUS_LABEL = { healthy: "Healthy", attention: "Attention", critical: "Critical" };

const ago = (iso) => (iso ? formatDistanceToNow(parseISO(iso), { addSuffix: true }) : "never");

function SystemStrip({ system }) {
  const items = [
    {
      ok: system.scheduler.ok,
      title: "Scheduler",
      detail: system.scheduler.last_run_at ? `Last run ${ago(system.scheduler.last_run_at)}` : "Has not run yet",
    },
    ...system.sources.map((s) => ({
      ok: s.ok || !s.enabled,
      warn: !s.enabled,
      title: `Mailbox ${s.mailbox || s.name}`,
      detail: !s.enabled
        ? "Switched off"
        : s.last_error
          ? s.last_error
          : `Read-only access valid · fetched ${ago(s.last_success_at)}`,
    })),
    {
      ok: system.encryption_key,
      title: "Encryption key",
      detail: system.encryption_key ? "Configured" : "Missing — credentials and mail cannot be stored",
    },
  ];
  return (
    <section className="intg-card intg-card-pad intg-system" aria-label="System">
      {items.map((item) => (
        <div className="intg-system-item" key={item.title}>
          <span className={`intg-dot${item.ok ? (item.warn ? " warn" : "") : " bad"}`} aria-hidden="true" />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>
              {item.title} <span className="visually-hidden">{item.ok ? "OK" : "problem"}</span>
            </div>
            <div className="intg-muted">{item.detail}</div>
          </div>
        </div>
      ))}
    </section>
  );
}

function ConnectionCard({ c }) {
  const shadow = c.mode === "shadow";
  const stats = [
    { label: "Received today", value: c.today.received },
    shadow
      ? { label: "Would land", value: c.today.would_land, tone: "#2c734a" }
      : { label: "Landed today", value: c.today.landed, tone: "#2c734a" },
    { label: "Need attention", value: c.today.needs_attention, tone: c.today.needs_attention ? "#b3261e" : undefined },
    c.mode === "review" ? { label: "To review", value: c.today.to_review } : { label: "Waiting", value: c.today.waiting },
  ];
  return (
    <article className={`intg-card intg-conn ${c.status}`}>
      <div className="intg-conn-head">
        <div style={{ flexGrow: 1 }}>
          <div className="intg-conn-name">{c.company}</div>
          <div className="intg-muted">
            {c.provider} · {c.route_address}
          </div>
        </div>
        <span className={`intg-pill ${c.status}`}>{STATUS_LABEL[c.status]}</span>
        <span className={`intg-pill ${c.mode}`}>{MODE_LABEL[c.mode]}</span>
      </div>
      <div className="intg-stats">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="intg-stat-value" style={s.tone ? { color: s.tone } : undefined}>{s.value}</div>
            <div className="intg-stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="intg-conn-foot">
        <div className="intg-muted" style={{ flexGrow: 1 }}>
          Last email {ago(c.last_email_at)} · {c.properties_linked} properties, {c.units_mapped} rooms/beds mapped
        </div>
        <Link href={`/Integrations/Inbox?account=${c.id}${c.mode === "shadow" ? "&tab=shadow" : ""}`} style={{ fontSize: 13, fontWeight: 700 }}>
          Open inbox
        </Link>
      </div>
    </article>
  );
}

// A flag about one email opens that item; the Inbox then shows the tab it is in.
const inboxFor = (flag) => `/Integrations/Inbox?account=${flag.account_id}${flag.message_id ? `&item=${flag.message_id}` : ""}`;

function FlagRow({ flag, canAct, onAcknowledge }) {
  return (
    <div className="intg-flag">
      <div><span className={`intg-pill ${flag.severity}`}>{flag.severity[0].toUpperCase() + flag.severity.slice(1)}</span></div>
      <div>
        <div className="intg-flag-title">{flag.title}</div>
        {flag.kind === "reported" && flag.detail && <div>“{flag.detail}”</div>}
        {flag.acknowledged_at && (
          <div className="intg-muted">
            {flag.kind === "reported" ? "Answered" : "Acknowledged"} by {flag.acknowledged_by || "someone"}
            {flag.acknowledgement_note ? ` — ${flag.acknowledgement_note}` : ""}
          </div>
        )}
      </div>
      <div>{flag.account || "System"}</div>
      <div className="intg-muted">{ago(flag.last_seen)}</div>
      <div style={{ fontWeight: 700 }} aria-label={`${flag.count} times`}>{flag.count}×</div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        {flag.kind === "reported" && flag.account_id && (
          <Link className="intg-btn" href={inboxFor(flag)}>Open the item</Link>
        )}
        {flag.kind === "unmapped_room" && flag.account_id && (
          <Link className="intg-btn primary" href={inboxFor(flag)}>Map room</Link>
        )}
        {canAct && !flag.acknowledged_at && (
          <button type="button" className="intg-btn" onClick={() => onAcknowledge(flag)}>
            {flag.kind === "reported" ? "Answer" : "Acknowledge"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function IntegrationsHealth() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAcknowledged, setShowAcknowledged] = useState(false);

  const load = useCallback(async () => {
    const res = await integrationHealthAPI();
    if (isOk(res)) {
      setData(res.data.response);
      setError("");
    } else {
      setError(errorMessage(res, "Could not load integration health."));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, REFRESH_MS);
    return () => clearInterval(timer);
  }, [load]);

  const acknowledge = async (flag) => {
    const reported = flag.kind === "reported";
    const note = window.prompt(reported ? "Your answer (the property manager sees it on the item):"
                                        : "Why can this be ignored for now? (optional)", "") ?? null;
    if (note === null) return;
    const res = await integrationAcknowledgeFlagAPI(flag.id, note);
    if (isOk(res)) {
      toast.success(reported ? "Answered." : "Acknowledged. It will show again if it recurs.");
      load();
    } else {
      toast.error(errorMessage(res, "Could not acknowledge the flag."));
    }
  };

  const canAct = data && !data.scoped && (data.access === "operate" || data.access === "admin");
  const flags = data ? (showAcknowledged ? data.acknowledged_flags : data.flags) : [];

  return (
    <IntegrationsShell active="health" badge={data?.inbox_badge || 0}>
      {loading && (
        <div className="intg-empty"><Spinner animation="border" size="sm" /> Loading…</div>
      )}
      {!loading && error && <div className="intg-card intg-card-pad" role="alert">{error}</div>}
      {data && (
        <>
          {data.system ? <SystemStrip system={data.system} />
            : <div className="intg-muted" style={{ marginBottom: 12 }}>Showing the properties you manage.</div>}

          <section aria-labelledby="intg-conn-h">
            <h2 className="intg-h2" id="intg-conn-h">Connections</h2>
            {data.connections.length === 0 ? (
              <div className="intg-card intg-empty">No company is connected to a booking provider yet.</div>
            ) : (
              <div className="intg-conn-grid">
                {data.connections.map((c) => <ConnectionCard key={c.id} c={c} />)}
              </div>
            )}
          </section>

          <section className="intg-card" aria-labelledby="intg-flags-h">
            <div className="intg-flags-head">
              <h2 className="intg-h2" id="intg-flags-h" style={{ margin: 0, flexGrow: 1 }}>Flags</h2>
              <div role="group" aria-label="Show" style={{ display: "flex", gap: 6 }}>
                <button type="button" className={`intg-chip${!showAcknowledged ? " active" : ""}`}
                        aria-pressed={!showAcknowledged} onClick={() => setShowAcknowledged(false)}>
                  Open <span className="intg-count">{data.flags.length}</span>
                </button>
                <button type="button" className={`intg-chip${showAcknowledged ? " active" : ""}`}
                        aria-pressed={showAcknowledged} onClick={() => setShowAcknowledged(true)}>
                  Acknowledged <span className="intg-count">{data.acknowledged_flags.length}</span>
                </button>
              </div>
            </div>
            {flags.length === 0 ? (
              <div className="intg-empty">{showAcknowledged ? "Nothing acknowledged." : "Nothing needs noticing."}</div>
            ) : (
              flags.map((f) => <FlagRow key={f.id} flag={f} canAct={canAct} onAcknowledge={acknowledge} />)
            )}
            <div className="intg-legend">
              <strong style={{ color: "#3c2f26" }}>A card turns red when</strong> the scheduler hasn’t run for 15 minutes ·
              a mailbox can’t be read · an item has needed attention for over an hour · a booking was created but its
              email failed · a provider sends an email template we don’t recognise.
            </div>
          </section>
        </>
      )}
    </IntegrationsShell>
  );
}
