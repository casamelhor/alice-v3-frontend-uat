// integration: alice_v3_claude — w7 — booking integrations admin: one connection
// Tabs: Overview (readiness, mode) · Mapping (units, seen-but-not-mapped, employers) · Settings · Activity.
// Admins edit; everyone else with access sees the same page read-only. Design: W7_DESIGN.md §14.2.
"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Spinner, Tab, Tabs } from "react-bootstrap";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";
import {
  integrationActivityAPI,
  integrationConnectOptionsAPI,
  integrationConnectionAPI,
  integrationHealthAPI,
  integrationLinkPropertyAPI,
  integrationMapUnitAPI,
  integrationFillEntityAPI,
  integrationSetEntityAPI,
  integrationUnmappedAPI,
  integrationUpdateConnectionAPI,
  integrationUpdateUnitAPI,
} from "@/services/integrationProvider";
import IntegrationsShell, { errorMessage, isOk } from "./IntegrationsShell";
import { MODE_LABEL } from "./IntegrationsConnections";

const MODE_HELP = {
  off: "Mail is captured and read, nothing else.",
  shadow: "Shows what would happen for every booking. Creates nothing, sends nothing.",
  review: "Every booking is checked, then waits for an operator to accept it.",
  auto: "Bookings that pass every check are created straight away; the rest go to the Inbox.",
};
const UNIT_LABEL = { room: "Room", bed: "Bed", exclusive: "Whole room (exclusive)" };
const when = (iso) => (iso ? format(parseISO(iso), "dd MMM yyyy, HH:mm") : "");

function Overview({ c, admin, onMode }) {
  const r = c.readiness;
  return (
    <div className="intg-two" style={{ padding: 0 }}>
      <section className="intg-card intg-card-pad">
        <h2 className="intg-h2">Readiness</h2>
        {r.checks.map((check) => (
          <div key={check.key} className="intg-system-item" style={{ marginBottom: 10 }}>
            <span className={`intg-dot${check.ok ? "" : " warn"}`} aria-hidden="true" />
            <div>
              <div style={{ fontWeight: 600 }}>{check.label}<span className="visually-hidden">{check.ok ? " — done" : " — to do"}</span></div>
              {(check.detail || []).length > 0 && <div className="intg-muted">{check.detail.join(" · ")}</div>}
            </div>
          </div>
        ))}
      </section>
      <section className="intg-card intg-card-pad">
        <h2 className="intg-h2">Mode</h2>
        <div role="radiogroup" aria-label="Mode" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Object.keys(MODE_LABEL).map((m) => (
            <label key={m} className="intg-card intg-card-pad" style={{ display: "flex", gap: 12, cursor: admin ? "pointer" : "default", borderWidth: c.mode === m ? 2 : 1, borderColor: c.mode === m ? "#463527" : undefined }}>
              <input type="radio" name="mode" checked={c.mode === m} disabled={!admin} onChange={() => onMode(m)} />
              <span><strong>{MODE_LABEL[m]}</strong><br /><span className="intg-muted">{MODE_HELP[m]}</span></span>
            </label>
          ))}
        </div>
        {!admin && <div className="intg-muted" style={{ marginTop: 8 }}>Only a CasaMelhor Admin can change the mode.</div>}
      </section>
    </div>
  );
}

function Mapping({ c, admin, reload }) {
  const [unmapped, setUnmapped] = useState(null);
  const [options, setOptions] = useState(null);
  const [choice, setChoice] = useState({});

  const loadUnmapped = useCallback(async () => {
    const res = await integrationUnmappedAPI(c.id);
    if (isOk(res)) setUnmapped(res.data.response);
  }, [c.id]);

  useEffect(() => { loadUnmapped(); }, [loadUnmapped]);
  useEffect(() => {
    if (!admin) return;
    integrationConnectOptionsAPI(c.company_id).then((res) => isOk(res) && setOptions(res.data.response));
  }, [admin, c.company_id]);

  const done = async (res, message) => {
    if (isOk(res)) { toast.success(message); await reload(); await loadUnmapped(); }
    else toast.error(errorMessage(res));
  };

  const updateUnit = async (unit, data) => done(await integrationUpdateUnitAPI(c.id, unit.id, data), "Mapping updated.");
  const linkProperty = async (propertyId, externalName) =>
    done(await integrationLinkPropertyAPI(c.id, { property_id: Number(propertyId), external_name: externalName, auto_map: true }),
         "Guesthouse linked and rooms mapped by number.");
  const mapCode = async (item) => {
    const link = c.properties.find((p) => p.external_name.toLowerCase().trim() === item.guesthouse.toLowerCase().trim());
    const room = link?.rooms.find((r) => String(r.id) === String(choice[`${item.guesthouse}|${item.code}|${item.bed}`]));
    if (!room) return;
    const twin = room.type === "Twin-Sharing" && item.bed;
    await done(await integrationMapUnitAPI(c.id, {
      guesthouse: item.guesthouse, code: item.code, room_id: room.id,
      unit: twin ? "bed" : "room", external_bed: twin ? item.bed : 0, bed_index: twin ? item.bed - 1 : null,
    }), `Mapped. Bookings waiting on room ${item.code} will retry on the next run.`);
  };
  const [newEntity, setNewEntity] = useState({});   // employer -> the name being added
  const setEntity = async (employer, data) => {
    const res = await integrationSetEntityAPI(c.id, { employer, ...data });
    if (!isOk(res)) return toast.error(errorMessage(res));
    const r = res.data.response;
    toast.success(`"${employer}" now counts as ${entityField.label} "${r.value}".`
      + (r.rechecked ? ` ${r.rechecked} Inbox item(s) checked again.` : ""));
    setNewEntity(({ [employer]: _, ...rest }) => rest);
    await reload(); await loadUnmapped();
  };
  const fillEntity = async (e) => {
    if (!window.confirm(`Fill ${entityField.label} "${e.maps_to}" into ${e.fillable} earlier booking(s) from ${e.name}? Only bookings with no ${entityField.label} are changed.`)) return;
    const res = await integrationFillEntityAPI(c.id, e.name);
    if (!isOk(res)) return toast.error(errorMessage(res));
    toast.success(`Filled into ${res.data.response.filled} booking(s).`);
    await loadUnmapped();
  };

  const linkedIds = new Set(c.properties.map((p) => p.property.id));
  const entityField = unmapped?.employer_field && c.company_fields.find((f) => f.key === unmapped.employer_field);
  const likelyField = !entityField && c.company_fields.find((f) => f.custom && /entity/i.test(f.label));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {unmapped && unmapped.unmapped.length > 0 && (
        <section className="intg-card intg-card-pad" style={{ borderColor: "#bf9039" }}>
          <h2 className="intg-h2">Seen but not mapped</h2>
          <div className="intg-muted" style={{ marginBottom: 10 }}>Arrived in mail in the last 60 days with nowhere to land.</div>
          {unmapped.unmapped.map((item) => {
            const key = `${item.guesthouse}|${item.code}|${item.bed}`;
            const link = c.properties.find((p) => p.external_name.toLowerCase().trim() === item.guesthouse.toLowerCase().trim());
            return (
              <div key={key} className="intg-flag" style={{ gridTemplateColumns: "minmax(0,1fr) 80px minmax(220px, 320px) auto", padding: "10px 0" }}>
                <div>
                  <div className="intg-flag-title">
                    {item.linked ? `Room ${item.code}${item.bed ? ` · bed ${item.bed}` : ""} at ${item.guesthouse}` : `Guesthouse "${item.guesthouse}"`}
                  </div>
                  <div className="intg-muted">Last seen {when(item.last_seen)}</div>
                </div>
                <div aria-label={`${item.count} bookings`}>{item.count}×</div>
                {admin ? (
                  item.linked ? (
                    <select className="intg-input" aria-label="Alice room" value={choice[key] || ""} onChange={(e) => setChoice({ ...choice, [key]: e.target.value })}>
                      <option value="">Map to room…</option>
                      {(link?.rooms || []).map((r) => <option key={r.id} value={r.id}>{r.name} ({r.type})</option>)}
                    </select>
                  ) : (
                    <select className="intg-input" aria-label="Alice property" value={choice[key] || ""} onChange={(e) => setChoice({ ...choice, [key]: e.target.value })}>
                      <option value="">Link to property…</option>
                      {(options?.properties || []).filter((p) => !linkedIds.has(p.id)).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  )
                ) : <div className="intg-muted">An admin maps this.</div>}
                <div>
                  {admin && (
                    <button type="button" className="intg-btn primary" disabled={!choice[key]}
                            onClick={() => (item.linked ? mapCode(item) : linkProperty(choice[key], item.guesthouse))}>
                      {item.linked ? "Map" : "Link"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {c.properties.length === 0 && <div className="intg-card intg-empty">No guesthouse is linked yet.</div>}
      {c.properties.map((p) => (
        <section key={p.link_id} className="intg-card intg-card-pad">
          <h2 className="intg-h2">{p.external_name} → {p.property.name}</h2>
          <table className="table table-sm" style={{ fontSize: 14 }}>
            <thead><tr><th scope="col">Provider room</th><th scope="col">Alice room</th><th scope="col">Books as</th><th scope="col">Active</th><th scope="col">Last change</th></tr></thead>
            <tbody>
              {p.units.map((u) => (
                <tr key={u.id} style={u.active ? undefined : { opacity: 0.55 }}>
                  <td>{u.code}{u.bed ? ` · bed ${u.bed}` : ""}</td>
                  <td>
                    {admin ? (
                      <select className="intg-input" aria-label={`Alice room for provider room ${u.code}`} value={u.room_id}
                              onChange={(e) => updateUnit(u, { room_id: Number(e.target.value) })}>
                        {p.rooms.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                      </select>
                    ) : u.room}
                  </td>
                  <td>
                    {admin ? (
                      <select className="intg-input" aria-label={`Unit for provider room ${u.code}`} value={u.unit}
                              onChange={(e) => updateUnit(u, { unit: e.target.value, bed_index: e.target.value === "bed" ? (u.bed ? u.bed - 1 : 0) : null })}>
                        {Object.entries(UNIT_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    ) : `${UNIT_LABEL[u.unit]}${u.unit === "bed" && u.bed_index !== null ? ` ${u.bed_index + 1}` : ""}`}
                  </td>
                  <td>
                    <input type="checkbox" aria-label={`Provider room ${u.code} active`} checked={u.active} disabled={!admin}
                           onChange={(e) => updateUnit(u, { is_active: e.target.checked })} />
                  </td>
                  <td className="intg-muted">{u.updated_by ? `${u.updated_by}, ` : ""}{when(u.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}

      {admin && options && options.properties.some((p) => !linkedIds.has(p.id)) && (
        <section className="intg-card intg-card-pad">
          <h2 className="intg-h2">Link another guesthouse</h2>
          <div className="intg-muted" style={{ marginBottom: 10 }}>Properties assigned to {c.company} that this connection doesn’t use yet. Rooms are mapped by their number.</div>
          {options.properties.filter((p) => !linkedIds.has(p.id)).map((p) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <span style={{ flexGrow: 1 }}>{p.name} <span className="intg-muted">· {p.rooms.length} numbered rooms{p.problems.length ? ` · ${p.problems.join(" ")}` : ""}</span></span>
              <button type="button" className="intg-btn" onClick={() => linkProperty(p.id, p.name)}>Link</button>
            </div>
          ))}
        </section>
      )}

      {unmapped && unmapped.employers.length > 0 && (
        <section className="intg-card intg-card-pad">
          <h2 className="intg-h2">Employers in bookings</h2>
          {!entityField && (
            <div className="intg-muted">
              No company field receives the employer.{" "}
              {likelyField ? `“${likelyField.label}” looks like the one: set it to “Employer (entity)” in Settings → Field mapping.`
                : "Set one in Settings → Field mapping."}
            </div>
          )}
          {entityField && (
            <div className="intg-muted" style={{ marginBottom: 10 }}>
              The employer each booking names, and the {c.company} {entityField.label} it goes under in reports.
            </div>
          )}
          {unmapped.employers.map((e) => (
            <div key={e.name} style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
              <span style={{ flexGrow: 1 }}>{e.name} <span className="intg-muted">· {e.count}×</span></span>
              {e.maps_to ? (
                <>
                  <span className="intg-pill healthy">{entityField?.label}: {e.maps_to}</span>
                  {admin && e.fillable > 0 && (
                    <button type="button" className="intg-btn" onClick={() => fillEntity(e)}>
                      Fill in on {e.fillable} earlier booking{e.fillable === 1 ? "" : "s"}
                    </button>
                  )}
                </>
              ) : entityField && (admin && unmapped.employer_field_is_dropdown ? (
                e.name in newEntity ? (
                  <span style={{ display: "flex", gap: 8 }}>
                    <input className="intg-input" style={{ width: 280 }} aria-label={`New ${entityField.label}`}
                           value={newEntity[e.name]} onChange={(ev) => setNewEntity({ ...newEntity, [e.name]: ev.target.value })} />
                    <button type="button" className="intg-btn primary" disabled={!newEntity[e.name]?.trim()}
                            onClick={() => setEntity(e.name, { value: newEntity[e.name].trim(), create: true })}>Add</button>
                    <button type="button" className="intg-btn" onClick={() => setNewEntity(({ [e.name]: _, ...rest }) => rest)}>Cancel</button>
                  </span>
                ) : (
                  <select className="intg-input" style={{ width: 280 }} aria-label={`${entityField.label} for ${e.name}`} value=""
                          onChange={(ev) => {
                            const v = ev.target.value;
                            if (v === "__new__") setNewEntity({ ...newEntity, [e.name]: e.name });
                            else if (v) setEntity(e.name, { value: v });
                          }}>
                    <option value="">Match to {entityField.label}…</option>
                    {entityField.values.map((v) => <option key={v} value={v}>{v}</option>)}
                    <option value="__new__">＋ Add as a new {entityField.label}</option>
                  </select>
                )
              ) : <span className="intg-pill warning">Not matched</span>)}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

function Settings({ c, admin, save }) {
  const [form, setForm] = useState({});
  useEffect(() => {
    setForm({
      notify_traveller: c.notify_traveller, auto_apply_cancellations: c.auto_apply_cancellations,
      update_traveller_profiles: c.update_traveller_profiles, wait_minutes: c.wait_minutes,
      quiet_hours: c.quiet_hours, field_map: { ...(c.field_map || {}) },
    });
  }, [c]);
  const toggles = [
    ["notify_traveller", "Send Alice’s own confirmation and cancellation emails to the guest", "They already receive the provider’s email."],
    ["auto_apply_cancellations", "Apply cancellations without a click", "Otherwise each cancellation waits in the Inbox."],
    ["update_traveller_profiles", "Update the traveller’s profile from each booking", "Department, designation, cost centre, entity. Past bookings keep their own record."],
  ];
  return (
    <section className="intg-card intg-card-pad">
      {toggles.map(([key, label, help]) => (
        <label key={key} style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
          <input type="checkbox" checked={!!form[key]} disabled={!admin} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} style={{ marginTop: 4 }} />
          <span><strong>{label}</strong><br /><span className="intg-muted">{help}</span></span>
        </label>
      ))}
      <div style={{ display: "flex", gap: 16, marginBottom: 18 }}>
        <label className="intg-label">Wait for a matching cancellation (minutes)
          <input className="intg-input" type="number" min={0} max={240} value={form.wait_minutes ?? ""} disabled={!admin}
                 onChange={(e) => setForm({ ...form, wait_minutes: Number(e.target.value) })} />
        </label>
        <label className="intg-label">Flag the group when quiet for (hours)
          <input className="intg-input" type="number" min={1} max={240} value={form.quiet_hours ?? ""} disabled={!admin}
                 onChange={(e) => setForm({ ...form, quiet_hours: Number(e.target.value) })} />
        </label>
      </div>
      <h2 className="intg-h2">Field mapping</h2>
      <div className="intg-muted" style={{ marginBottom: 10 }}>Which of {c.company}’s own fields receive the provider’s values — on the booking’s cost allocation, and on the traveller’s profile.</div>
      <table className="table table-sm" style={{ fontSize: 14, maxWidth: 720 }}>
        <thead><tr><th scope="col">{c.company} field</th><th scope="col">Setting</th><th scope="col">Takes the provider’s</th></tr></thead>
        <tbody>
          {c.company_fields.map((f) => (
            <tr key={f.key}>
              <td>{f.label}{f.custom ? <span className="intg-muted"> · custom</span> : ""}</td>
              <td className="intg-muted">{f.state}</td>
              <td>
                <select className="intg-input" aria-label={`Provider value for ${f.label}`} disabled={!admin}
                        value={form.field_map?.[f.key] || ""}
                        onChange={(e) => {
                          const next = { ...(form.field_map || {}) };
                          if (e.target.value) next[f.key] = e.target.value; else delete next[f.key];
                          setForm({ ...form, field_map: next });
                        }}>
                  <option value="">— nothing —</option>
                  {c.provider_attributes.map((a) => <option key={a.key} value={a.key}>{a.label}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {admin && <button type="button" className="intg-btn primary" onClick={() => save(form)}>Save settings</button>}
    </section>
  );
}

function Activity({ id }) {
  const [rows, setRows] = useState(null);
  useEffect(() => { integrationActivityAPI(id).then((res) => isOk(res) && setRows(res.data.response)); }, [id]);
  if (!rows) return <div className="intg-empty"><Spinner animation="border" size="sm" /></div>;
  if (!rows.length) return <div className="intg-card intg-empty">No changes recorded yet.</div>;
  return (
    <section className="intg-card intg-card-pad">
      {rows.map((r, i) => (
        <div className="intg-event" key={i}>
          <span className="intg-event-time" style={{ width: 150 }}>{when(r.at)}</span>
          <span>{r.title}{r.count > 1 ? ` (${r.count}×)` : ""}</span>
        </div>
      ))}
    </section>
  );
}

export default function IntegrationsConnection() {
  const id = useSearchParams().get("id");
  const [c, setC] = useState(null);
  const [access, setAccess] = useState("view");
  const [badge, setBadge] = useState(0);
  const [tab, setTab] = useState("overview");

  const load = useCallback(async () => {
    const res = await integrationConnectionAPI(id);
    if (isOk(res)) setC(res.data.response);
    else toast.error(errorMessage(res, "Could not load the connection."));
  }, [id]);

  useEffect(() => {
    load();
    integrationHealthAPI().then((res) => {
      if (isOk(res)) { setAccess(res.data.response.access); setBadge(res.data.response.inbox_badge); }
    });
  }, [load]);

  const admin = access === "admin";
  const save = async (data, message = "Saved.") => {
    const res = await integrationUpdateConnectionAPI(id, data);
    if (isOk(res)) { setC(res.data.response); toast.success(message); }
    else toast.error(errorMessage(res));
  };
  const setMode = (mode) => {
    if (mode === c.mode) return;
    const live = mode === "review" || mode === "auto";
    const warn = live && !c.readiness.ready ? "\n\nThe readiness checklist is not complete." : "";
    if (!window.confirm(`Switch ${c.company} to ${MODE_LABEL[mode]}?\n\n${MODE_HELP[mode]}${warn}`)) return;
    save({ mode }, `Mode is now ${MODE_LABEL[mode]}.`);
  };

  return (
    <IntegrationsShell active="connections" badge={badge}>
      {!c ? (
        <div className="intg-empty"><Spinner animation="border" size="sm" /> Loading…</div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ flexGrow: 1 }}>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{c.company} · {c.provider}</div>
              <div className="intg-muted">{c.route_address} · {c.name}</div>
            </div>
            <span className={`intg-pill ${c.mode}`}>{MODE_LABEL[c.mode]}</span>
          </div>
          <Tabs activeKey={tab} onSelect={(k) => setTab(k)} className="mb-3">
            <Tab eventKey="overview" title="Overview"><Overview c={c} admin={admin} onMode={setMode} /></Tab>
            <Tab eventKey="mapping" title="Mapping">{tab === "mapping" && <Mapping c={c} admin={admin} reload={load} />}</Tab>
            <Tab eventKey="settings" title="Settings"><Settings c={c} admin={admin} save={(form) => save(form)} /></Tab>
            <Tab eventKey="activity" title="Activity">{tab === "activity" && <Activity id={c.id} />}</Tab>
          </Tabs>
        </>
      )}
    </IntegrationsShell>
  );
}
