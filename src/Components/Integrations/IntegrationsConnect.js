// integration: alice_v3_claude — w7 — booking integrations admin: Connect a company (wizard)
// 1 company & provider · 2 group address · 3 guesthouses & rooms · 4 field mapping · 5 done (Shadow).
// A new connection always starts in Shadow: nothing is created until an admin switches it on.
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  integrationConnectOptionsAPI,
  integrationCreateConnectionAPI,
  integrationLinkPropertyAPI,
  integrationUpdateConnectionAPI,
} from "@/services/integrationProvider";
import IntegrationsShell, { errorMessage, isOk } from "./IntegrationsShell";

const STEPS = ["Company", "Where bookings arrive", "Guesthouses", "Guest fields", "Done"];

const suggestGroup = (name) =>
  `${(name || "").toLowerCase().replace(/\b(limited|ltd|pvt|private|llp)\b/g, "").replace(/[^a-z0-9]+/g, "")}.residences@casamelhor.in`;

export default function IntegrationsConnect() {
  const preset = useSearchParams().get("company") || "";
  const [step, setStep] = useState(0);
  const [base, setBase] = useState(null);
  const [company, setCompany] = useState(preset);
  const [provider, setProvider] = useState("q2t");
  const [options, setOptions] = useState(null);
  const [group, setGroup] = useState("");
  const [instance, setInstance] = useState("");
  const [connection, setConnection] = useState(null);
  const [picked, setPicked] = useState({});
  const [linked, setLinked] = useState([]);
  const [fieldMap, setFieldMap] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    integrationConnectOptionsAPI().then((res) => {
      if (isOk(res)) setBase(res.data.response);
      else toast.error(errorMessage(res, "Only a CasaMelhor Admin can connect a company."));
    });
  }, []);

  const loadCompany = async () => {
    const res = await integrationConnectOptionsAPI(company);
    if (!isOk(res)) return toast.error(errorMessage(res));
    const data = res.data.response;
    setOptions(data);
    setGroup((g) => g || suggestGroup(data.company.name));
    setPicked(Object.fromEntries(data.properties.map((p) => [p.id, { on: true, name: p.name }])));
    setFieldMap(data.default_field_map);
    setStep(1);
  };

  const create = async () => {
    setBusy(true);
    const res = await integrationCreateConnectionAPI({ company_id: Number(company), provider, route_address: group, provider_instance: instance });
    setBusy(false);
    if (!isOk(res)) return toast.error(errorMessage(res));
    setConnection(res.data.response);
    toast.success("Connection created in Shadow mode.");
    setStep(2);
  };

  const linkAll = async () => {
    setBusy(true);
    const results = [];
    for (const p of options.properties) {
      const pick = picked[p.id];
      if (!pick?.on) continue;
      const res = await integrationLinkPropertyAPI(connection.id, { property_id: p.id, external_name: pick.name, auto_map: true });
      results.push({ name: p.name, ok: isOk(res), ...(isOk(res) ? res.data.response : { problems: [errorMessage(res)] }) });
    }
    setLinked(results);
    setBusy(false);
    if (results.every((r) => r.ok)) toast.success("Guesthouses linked.");
  };

  const saveFields = async () => {
    setBusy(true);
    const res = await integrationUpdateConnectionAPI(connection.id, { field_map: fieldMap });
    setBusy(false);
    if (!isOk(res)) return toast.error(errorMessage(res));
    setStep(4);
  };

  return (
    <IntegrationsShell active="connections">
      <ol style={{ display: "flex", gap: 8, listStyle: "none", padding: 0, marginBottom: 16, flexWrap: "wrap" }} aria-label="Steps">
        {STEPS.map((label, i) => (
          <li key={label} className={`intg-pill ${i === step ? "review" : i < step ? "healthy" : "neutral"}`} aria-current={i === step ? "step" : undefined}>
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      <section className="intg-card intg-card-pad" style={{ maxWidth: 900 }}>
        {step === 0 && (
          <>
            <h2 className="intg-h2">Which company, and which provider?</h2>
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              <label className="intg-label" style={{ flexGrow: 1 }}>Company
                <select className="intg-input" value={company} onChange={(e) => setCompany(e.target.value)}>
                  <option value="">Choose a company…</option>
                  {(base?.companies || []).map((c) => (
                    <option key={c.id} value={c.id}>{c.name}{c.connected ? " (already has a connection)" : ""}</option>
                  ))}
                </select>
              </label>
              <label className="intg-label" style={{ width: 220 }}>Provider
                <select className="intg-input" value={provider} onChange={(e) => setProvider(e.target.value)}>
                  {(base?.providers || []).map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
                </select>
              </label>
            </div>
            <button type="button" className="intg-btn primary" disabled={!company} onClick={loadCompany}>Next</button>
          </>
        )}

        {step === 1 && options && (
          <>
            <h2 className="intg-h2">Where do {options.company.name}’s bookings arrive?</h2>
            <p className="intg-muted">
              The group address the provider sends to — one group per company, e.g. tatamotors.residences@casamelhor.in.
              Make sure the integration’s mailbox is a member of that group, receiving every email.
            </p>
            {options.unrouted_groups_seen.length > 0 && (
              <div className="intg-banner waiting" style={{ margin: "0 0 12px" }}>
                Mail has already arrived through groups no connection uses: {options.unrouted_groups_seen.join(" · ")}. It will be picked up once connected.
              </div>
            )}
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              <label className="intg-label" style={{ flexGrow: 1 }}>Group address
                <input className="intg-input" type="email" value={group} onChange={(e) => setGroup(e.target.value)} />
              </label>
              <label className="intg-label" style={{ width: 260 }}>Provider’s name for the client (optional)
                <input className="intg-input" type="text" value={instance} placeholder="e.g. tatamotors" onChange={(e) => setInstance(e.target.value)} />
              </label>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" className="intg-btn" onClick={() => setStep(0)}>Back</button>
              <button type="button" className="intg-btn primary" disabled={!group.includes("@") || busy} onClick={create}>Create connection</button>
            </div>
          </>
        )}

        {step === 2 && options && (
          <>
            <h2 className="intg-h2">Which guesthouses take these bookings?</h2>
            <p className="intg-muted">Properties assigned to {options.company.name}. Give each the name the provider uses — capitals don’t matter. Rooms are mapped by the number in their name; anything else is mapped later.</p>
            {options.properties.length === 0 && <div>No property is assigned to this company yet.</div>}
            {options.properties.map((p) => (
              <div key={p.id} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
                <input type="checkbox" aria-label={`Use ${p.name}`} checked={!!picked[p.id]?.on}
                       onChange={(e) => setPicked({ ...picked, [p.id]: { ...picked[p.id], on: e.target.checked } })} />
                <span style={{ width: 260 }}><strong>{p.name}</strong><br /><span className="intg-muted">{p.rooms.length} numbered rooms{p.problems.length ? ` · ${p.problems.join(" ")}` : ""}</span></span>
                <label className="intg-label" style={{ flexGrow: 1 }}>Provider’s name
                  <input className="intg-input" type="text" value={picked[p.id]?.name || ""}
                         onChange={(e) => setPicked({ ...picked, [p.id]: { ...picked[p.id], name: e.target.value } })} />
                </label>
              </div>
            ))}
            {linked.length > 0 && (
              <div style={{ margin: "12px 0" }}>
                {linked.map((r) => (
                  <div key={r.name} className={r.ok ? "" : "intg-item-reason"}>
                    {r.name}: {r.ok ? `${r.created.length} room/bed mapping(s) created` : "not linked"}{r.problems?.length ? ` — ${r.problems.join(" ")}` : ""}
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              {linked.length === 0
                ? <button type="button" className="intg-btn primary" disabled={busy} onClick={linkAll}>Link and map rooms</button>
                : <button type="button" className="intg-btn primary" onClick={() => setStep(3)}>Next</button>}
            </div>
          </>
        )}

        {step === 3 && options && (
          <>
            <h2 className="intg-h2">Where do the provider’s guest details go?</h2>
            <p className="intg-muted">Each booking records these on its cost allocation, and they fill in the traveller’s profile. Pre-filled from {options.company.name}’s own field names.</p>
            <table className="table table-sm" style={{ fontSize: 14 }}>
              <thead><tr><th scope="col">{options.company.name} field</th><th scope="col">Setting</th><th scope="col">Takes the provider’s</th></tr></thead>
              <tbody>
                {options.fields.map((f) => (
                  <tr key={f.key}>
                    <td>{f.label}{f.custom ? <span className="intg-muted"> · custom</span> : ""}</td>
                    <td className="intg-muted">{f.state}</td>
                    <td>
                      <select className="intg-input" aria-label={`Provider value for ${f.label}`} value={fieldMap[f.key] || ""}
                              onChange={(e) => {
                                const next = { ...fieldMap };
                                if (e.target.value) next[f.key] = e.target.value; else delete next[f.key];
                                setFieldMap(next);
                              }}>
                        <option value="">— nothing —</option>
                        {options.provider_attributes.map((a) => <option key={a.key} value={a.key}>{a.label}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" className="intg-btn primary" disabled={busy} onClick={saveFields}>Save and finish</button>
          </>
        )}

        {step === 4 && connection && (
          <>
            <h2 className="intg-h2">Connected — running in Shadow</h2>
            <p>Every booking from {connection.company} is now read and checked, and the Inbox shows what would happen. Nothing is created and no email is sent.</p>
            <p className="intg-muted">Next: check the readiness list on the connection page, compare a few days of shadow results with what staff key in, then switch to Review.</p>
            <div style={{ display: "flex", gap: 8 }}>
              <Link className="intg-btn primary" href={`/Integrations/Connection?id=${connection.id}`}>Open the connection</Link>
              <Link className="intg-btn" href={`/Integrations/Inbox?account=${connection.id}&tab=shadow`}>Open the inbox</Link>
            </div>
          </>
        )}
      </section>
    </IntegrationsShell>
  );
}
