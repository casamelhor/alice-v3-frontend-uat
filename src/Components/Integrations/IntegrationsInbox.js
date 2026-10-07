// integration: alice_v3_claude — w7 — booking integrations admin: Inbox (the daily working screen)
// Design: docs/integrations/W7_DESIGN.md §14.2. API: alice_channels/api/views.py Inbox*.
"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { format, isToday, parseISO } from "date-fns";
import {
  integrationInboxAPI,
  integrationInboxActionAPI,
  integrationInboxDetailAPI,
  integrationInboxOriginalAPI,
  integrationMapUnitAPI,
} from "@/services/integrationProvider";
import IntegrationsShell, { errorMessage, isOk } from "./IntegrationsShell";
import { SOURCE_LABELS } from "./SourceBadge";

const TABS = [
  { key: "attention", label: "Needs attention" },
  { key: "review", label: "To review" },
  { key: "waiting", label: "Waiting" },
  { key: "shadow", label: "Shadow results" },
  { key: "done", label: "Done (7 days)" },
];
const TAB_KEYS = TABS.map((t) => t.key);

// What the pipeline would do, in words (outcome.would).
const WOULD = {
  land: "Create the booking",
  attention: "Ask a person",
  shorten: "Shorten the booking",
  nothing: "Nothing to change",
  cancel: "Cancel the booking",
  "cancel after review": "Cancel the booking once accepted",
};

// Timeline entries (MessageEvent.action, or the status it moved to).
const EVENT = {
  captured: "Email received",
  needs_attention: "Needs attention",
  waiting: "Waiting to retry",
  shadowed: "Shadow result recorded",
  pending_review: "Ready for review",
  landed: "Booking created",
  applied: "Cancellation applied",
  ignored: "Ignored",
  dismissed: "Dismissed",
  accepted: "Accepted",
  retried: "Retried",
  room_chosen: "Room chosen",
  linked: "Linked to a booking",
  reported: "Reported to the admins",
  warning: "Warning",
  profile_updated: "Guest profile updated",
  email_sent: "Email sent to the guest",
  email_failed: "Email to the guest failed",
};

const when = (iso) => {
  if (!iso) return "";
  const d = parseISO(iso);
  return isToday(d) ? format(d, "HH:mm") : format(d, "dd MMM HH:mm");
};

const day = (ymd) => format(parseISO(ymd), "EEE dd MMM");

// "existing user #1234 (matched by email)" → "existing Alice user (matched by email)"
const traveller = (text) => (text ? String(text).replace(/existing user #\d+/, "existing Alice user") : text);

function BookingLink({ number, uid }) {
  if (!number) return null;
  return uid ? <Link href={`/BookingDetails/${uid}`}>{number}</Link> : <>{number}</>;
}

function ItemCard({ item, selected, onSelect }) {
  return (
    <button type="button" className={`intg-item${selected ? " selected" : ""}`} aria-pressed={selected}
            onClick={() => onSelect(item.id)}>
      <span className="intg-item-top">
        <span className={`intg-kind ${item.kind}`}>{item.kind}</span>
        <span className="intg-item-guest">{item.guest || "Unknown guest"}</span>
        {item.reported && <span className="intg-pill warning">Reported</span>}
        <span className="intg-muted">{when(item.received_at)}</span>
      </span>
      <span style={{ fontSize: 13 }}>{[item.place, item.dates].filter(Boolean).join(" · ")}</span>
      <span className="intg-item-reason" style={item.status === "needs_attention" ? undefined : { color: "#463527" }}>
        {item.reason}
      </span>
    </button>
  );
}

function Outcome({ outcome, status, bookingUid }) {
  if (!outcome || !Object.keys(outcome).length) return null;
  const planning = status === "shadowed" || status === "pending_review";
  const lines = [
    ["What it will do", planning && outcome.would ? WOULD[outcome.would] || outcome.would : null],
    ["Booking", outcome.booking && <BookingLink number={outcome.booking} uid={bookingUid} />],
    ["Shorten to", outcome.shorten_to?.length === 2 ? `${day(outcome.shorten_to[0])} – ${day(outcome.shorten_to[1])}` : null],
    ["Room", outcome.room && `${outcome.room}${outcome.unit ? ` · ${outcome.unit}` : ""}`],
    ["Nights", outcome.nights],
    ["Price / night", outcome.price_per_night && `₹${Number(outcome.price_per_night).toLocaleString("en-IN")}`],
    ["Traveller", traveller(outcome.traveller)],
    ["Profile update", outcome.would_update_profile?.length ? outcome.would_update_profile.join(", ") : null],
    ["Email to guest", outcome.email],
  ].filter(([, v]) => v !== undefined && v !== null && v !== "");
  return (
    <div>
      {lines.map(([k, v]) => (
        <div className="intg-kv" key={k}><span className="intg-kv-label">{k}</span><span className="intg-kv-value">{typeof v === "object" ? v : String(v)}</span></div>
      ))}
      {(outcome.reasons || []).map((r) => <div key={r} className="intg-item-reason">{r}</div>)}
      {(outcome.warnings || []).map((w) => <div key={w} className="intg-muted">⚠ {w}</div>)}
    </div>
  );
}

function RoomPicker({ rooms, choice, setChoice }) {
  return (
    <div className="intg-rooms" role="radiogroup" aria-label="Rooms for these dates">
      {rooms.map((r) => {
        const twin = r.type === "Twin-Sharing";
        const options = !r.available
          ? []
          : twin
            ? [
                ...(r.available_beds || []).map((b) => ({ bed: b, exclusive: false, label: `Bed ${b + 1}` })),
                ...((r.available_beds || []).length === 2 ? [{ bed: null, exclusive: true, label: "Whole room" }] : []),
              ]
            : [{ bed: null, exclusive: false, label: "Room" }];
        if (!options.length) {
          return (
            <div key={r.id} className="intg-room busy" aria-disabled="true">
              <span className="intg-room-name">{r.name}</span>
              <span>
                Booked
                {r.conflicts.map((c, i) => (
                  <React.Fragment key={c.number || c}>{i ? ", " : " · "}<BookingLink number={c.number || c} uid={c.uid} /></React.Fragment>
                ))}
              </span>
            </div>
          );
        }
        return options.map((o) => {
          const on = choice && choice.room_id === r.id && choice.bed_index === o.bed && choice.exclusive === o.exclusive;
          return (
            <button key={`${r.id}-${o.label}`} type="button" role="radio" aria-checked={!!on}
                    className={`intg-room${on ? " selected" : ""}`}
                    onClick={() => setChoice({ room_id: r.id, bed_index: o.bed, exclusive: o.exclusive, name: r.name, label: o.label })}>
              <span className="intg-room-name">{r.name}</span>
              <span>{on ? "Selected" : twin ? `Free · ${o.label}` : "Free"}</span>
            </button>
          );
        });
      })}
    </div>
  );
}

function Detail({ id, onChanged, onLoaded, onNext }) {
  const [d, setD] = useState(null);
  const [failed, setFailed] = useState("");
  const [busy, setBusy] = useState(false);
  const [choice, setChoice] = useState(null);
  const [note, setNote] = useState("");
  const [candidate, setCandidate] = useState(null);
  const [mapRoom, setMapRoom] = useState("");
  const [dismissing, setDismissing] = useState(false);
  const [reason, setReason] = useState("");
  const [reporting, setReporting] = useState(false);
  const [reportNote, setReportNote] = useState("");
  const [original, setOriginal] = useState(null);
  const [confirming, setConfirming] = useState(null);   // {question, yes, action, data, success}
  const heading = useRef(null);
  // The parent's callbacks change with the address; a ref keeps them from reloading (and resetting) this item.
  const loaded = useRef(onLoaded);
  loaded.current = onLoaded;

  const load = useCallback(async () => {
    const res = await integrationInboxDetailAPI(id);
    if (isOk(res)) {
      const data = res.data.response;
      setD(data); setFailed("");
      setChoice(null); setNote(""); setMapRoom(""); setDismissing(false); setReason(""); setOriginal(null);
      setReporting(false); setReportNote(""); setConfirming(null);
      setCandidate((data.suggestion?.candidates || []).find((c) => c.matched)?.id ?? null);
      loaded.current?.(data);
      return data;
    }
    setFailed(errorMessage(res, "Could not load this item."));
    return null;
  }, [id]);

  useEffect(() => { load(); }, [load]);

  // After an action the button pressed is often gone; put focus on the item's name rather than lose it.
  useEffect(() => {
    if (d && (!document.activeElement || document.activeElement === document.body)) heading.current?.focus({ preventScroll: true });
  }, [d]);

  const act = async (action, data, success) => {
    setBusy(true);
    const res = await integrationInboxActionAPI(id, action, data);
    setBusy(false);
    if (isOk(res)) {
      toast.success(success || res.data.response.reason || "Done.");
      const fresh = await load();
      if (fresh) onChanged(fresh);
    } else {
      setConfirming(null);
      toast.error(errorMessage(res));
    }
  };

  const mapUnit = async () => {
    const s = d.suggestion;
    const room = (s.rooms || []).find((r) => String(r.id) === String(mapRoom));
    if (!room) return;
    const twin = room.type === "Twin-Sharing" && s.bed_number;
    setBusy(true);
    const res = await integrationMapUnitAPI(d.account_id, {
      guesthouse: s.guesthouse, code: s.room_code, room_id: room.id,
      unit: twin ? "bed" : "room", external_bed: twin ? s.bed_number : 0, bed_index: twin ? s.bed_number - 1 : null,
    });
    setBusy(false);
    if (isOk(res)) {
      await act("retry", {}, `Mapped. Bookings waiting on room ${s.room_code} will retry.`);
    } else {
      toast.error(errorMessage(res));
    }
  };

  const showOriginal = async () => {
    const res = await integrationInboxOriginalAPI(id);
    if (isOk(res)) setOriginal(res.data.response);
    else toast.error(errorMessage(res));
  };

  if (failed) {
    return (
      <div className="intg-card intg-detail intg-empty" role="alert">
        {failed} <button type="button" className="intg-btn" onClick={load}>Try again</button>
      </div>
    );
  }
  if (!d) return <div className="intg-card intg-detail intg-empty"><Spinner animation="border" size="sm" /> Loading…</div>;

  const s = d.suggestion || {};
  const can = (a) => d.actions.includes(a);
  const guestName = d.guest || "Unknown guest";
  const shortening = d.kind === "cancellation" && d.outcome?.shorten_to?.length === 2;
  const linkedCandidate = (s.candidates || []).find((c) => c.id === candidate);

  const askAccept = () => {
    if (d.kind !== "cancellation") { act("accept", {}, "Accepted."); return; }
    const number = d.outcome?.booking || "the booking";
    setConfirming(shortening
      ? { question: `Shorten ${number} to ${day(d.outcome.shorten_to[0])} – ${day(d.outcome.shorten_to[1])}? The other nights are released.`,
          yes: `Yes, shorten ${number}`, action: "accept", data: {}, success: `Shortened ${number}.` }
      : { question: `Cancel ${number}${d.place ? ` (${d.place})` : ""}? The guest's stay is removed from Alice.`,
          yes: `Yes, cancel ${number}`, action: "accept", data: {}, success: `Cancelled ${number}.` });
  };

  const askLinkCancel = () => {
    const c = linkedCandidate;
    if (!c) return;
    setConfirming({
      question: `Link this cancellation to ${c.number} (${c.room}${c.bed !== null && c.bed !== undefined ? ` · bed ${c.bed + 1}` : ""} · ${c.dates}) and apply it? The nights Quest2Travel cancelled are removed; if none are kept, the booking is cancelled.`,
      yes: `Yes, apply it to ${c.number}`, action: "link-cancel", data: { booking_id: c.id }, success: "Linked and applied.",
    });
  };

  return (
    <section className="intg-card intg-detail" aria-label="Details">
      <div className="intg-detail-head">
        <span className={`intg-kind ${d.kind}`}>{d.kind}</span>
        <div style={{ flexGrow: 1 }}>
          <h2 ref={heading} tabIndex={-1} style={{ fontSize: 18, fontWeight: 800, margin: 0, outline: "none" }}>{guestName}</h2>
          <div className="intg-muted">
            Ref {d.provider_ref || "—"}{d.request_number ? ` · Request ${d.request_number}` : ""} · received {when(d.received_at)} · {d.account || "no connection"}
          </div>
        </div>
        {d.access === "admin" && (
          <button type="button" className="intg-btn" onClick={showOriginal}>View original email</button>
        )}
        {onNext && <button type="button" className="intg-btn" onClick={onNext}>Next item →</button>}
      </div>
      <div className={`intg-banner ${d.status}`} role="status">{d.status_label} — {d.reason}</div>

      {original && (
        <pre style={{ margin: "16px 24px 0", padding: 12, background: "#faf8f6", border: "1px solid #e7e1dc", borderRadius: 8, maxHeight: 260, overflow: "auto", fontSize: 12, whiteSpace: "pre-wrap" }}>
          {original.subject}{"\n\n"}{original.text}
        </pre>
      )}

      <div className="intg-two">
        <div>
          <h3 className="intg-h3">What arrived</h3>
          {d.fields.map((f) => (
            <div className="intg-kv" key={f.label}><span className="intg-kv-label">{f.label}</span><span className="intg-kv-value">{f.value}</span></div>
          ))}
        </div>
        <div>
          <h3 className="intg-h3">What happened</h3>
          {d.timeline.map((e, i) => (
            <div className="intg-event" key={i}>
              <span className="intg-event-time">{when(e.at)}</span>
              <span><strong>{EVENT[e.action] || e.action.replace(/_/g, " ")}</strong>{e.detail ? ` — ${e.detail}` : ""}{e.actor !== "System" ? ` (${e.actor})` : ""}</span>
            </div>
          ))}
        </div>
      </div>

      {(d.status === "pending_review" || d.status === "shadowed" || d.status === "landed" || d.status === "applied") && (
        <div className="intg-fix">
          <h3 className="intg-fix-title">
            {d.status === "pending_review" ? "Ready — check and accept" : d.status === "shadowed" ? "Shadow result (nothing was created)" : "Result"}
          </h3>
          <Outcome outcome={d.outcome} status={d.status} bookingUid={d.booking_uid} />
        </div>
      )}

      {s.type === "unmapped" && d.status === "needs_attention" && (
        <div className="intg-fix">
          <h3 className="intg-fix-title">Map room {s.room_code}{s.bed_number ? ` (bed ${s.bed_number})` : ""} at {s.guesthouse}</h3>
          {!s.linked_property ? (
            <div>This guesthouse isn’t linked to an Alice property yet. An admin links it under Connections.</div>
          ) : s.can_map ? (
            <>
              <label className="intg-label">Alice room in {s.linked_property.name}
                <select className="intg-input" value={mapRoom} onChange={(e) => setMapRoom(e.target.value)}>
                  <option value="">Choose a room…</option>
                  {(s.rooms || []).map((r) => <option key={r.id} value={r.id}>{r.name} ({r.type})</option>)}
                </select>
              </label>
              <div className="intg-muted">Other bookings waiting on this code will retry once it’s mapped.</div>
              <div className="intg-actions">
                <button type="button" className="intg-btn primary" disabled={!mapRoom || busy} onClick={mapUnit}>Map and retry</button>
              </div>
            </>
          ) : (
            <div>Only a CasaMelhor Admin can map rooms. Ask an admin to map Quest2Travel room {s.room_code} at {s.guesthouse}.</div>
          )}
        </div>
      )}

      {s.type === "rooms" && can("book_in_room") && (
        <div className="intg-fix">
          <h3 className="intg-fix-title">{d.status === "pending_review" ? "Or put it in another room" : "Suggested fix: book a free room"}</h3>
          <RoomPicker rooms={s.rooms || []} choice={choice} setChoice={setChoice} />
          <label className="intg-label">Note for the caretaker
            <input className="intg-input" type="text" value={note} onChange={(e) => setNote(e.target.value)}
                   placeholder={`${d.account ? "The provider" : "They"} booked room ${s.room_code}; explain the move if needed`} />
          </label>
          <div className="intg-actions">
            <button type="button" className="intg-btn primary" disabled={!choice || busy}
                    onClick={() => act("book-in-room", { room_id: choice.room_id, bed_index: choice.bed_index, exclusive: choice.exclusive, note },
                                       `Booked in ${choice?.name}.`)}>
              {choice ? `Book in ${choice.name}${choice.label !== "Room" ? ` · ${choice.label}` : ""}` : "Choose a free room"}
            </button>
          </div>
        </div>
      )}

      {s.type === "candidates" && can("link_cancel") && (
        <div className="intg-fix">
          <h3 className="intg-fix-title">Which booking does this cancel?</h3>
          {(s.candidates || []).length === 0 && <div>No active booking matches this traveller, guesthouse and dates.</div>}
          <div role="radiogroup" aria-label="Candidate bookings" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(s.candidates || []).map((c) => (
              <label key={c.id} className="intg-card intg-card-pad" style={{ display: "flex", gap: 12, alignItems: "center", cursor: "pointer", borderWidth: candidate === c.id ? 2 : 1, borderColor: candidate === c.id ? "#463527" : undefined }}>
                <input type="radio" name="candidate" checked={candidate === c.id} onChange={() => setCandidate(c.id)} />
                <span style={{ flexGrow: 1 }}>
                  <strong><BookingLink number={c.number} uid={c.uid} /></strong> · {c.room}{c.bed !== null && c.bed !== undefined ? ` · bed ${c.bed + 1}` : ""} · {c.dates}
                  <br /><span className="intg-muted">{c.traveller} · {c.status} · from {SOURCE_LABELS[c.source] || c.source}</span>
                </span>
              </label>
            ))}
          </div>
          <div className="intg-actions">
            <button type="button" className="intg-btn primary" disabled={!candidate || busy || !!confirming} onClick={askLinkCancel}>
              Link and cancel…
            </button>
          </div>
        </div>
      )}

      {(d.reports || []).length > 0 && (
        <div className="intg-fix">
          <h3 className="intg-fix-title">Reported to the admins</h3>
          {d.reports.map((r) => (
            <div key={r.id} style={{ marginBottom: 8 }}>
              <div><strong>{r.title}</strong> <span className="intg-muted">· {when(r.at)}</span></div>
              <div>“{r.note}”</div>
              {r.open
                ? <div className="intg-muted">Waiting for an admin.</div>
                : <div>Answer from {r.answered_by || "an admin"}{r.answered_at ? ` · ${when(r.answered_at)}` : ""}: {r.answer || "seen, no comment."}</div>}
            </div>
          ))}
        </div>
      )}

      {confirming && (
        <div className="intg-fix intg-confirm" role="alertdialog" aria-label="Confirm">
          <div style={{ fontWeight: 700 }}>{confirming.question}</div>
          <div className="intg-actions" style={{ borderTop: "none", paddingTop: 10 }}>
            <button type="button" className="intg-btn danger" disabled={busy} autoFocus
                    onClick={() => act(confirming.action, confirming.data, confirming.success)}>{confirming.yes}</button>
            <button type="button" className="intg-btn" disabled={busy} onClick={() => setConfirming(null)}>Keep it</button>
          </div>
        </div>
      )}

      {d.actions.length > 0 && !confirming && (
        <div className="intg-fix" style={{ background: "#fff" }}>
          <div className="intg-actions" style={{ borderTop: "none", paddingTop: 0 }}>
            {can("accept") && (
              <button type="button" className="intg-btn primary" disabled={busy} onClick={askAccept}>
                {d.kind === "cancellation" ? (shortening ? "Shorten the booking…" : "Cancel the booking…") : "Accept booking"}
              </button>
            )}
            {can("retry") && <button type="button" className="intg-btn" disabled={busy} onClick={() => act("retry", {}, "Retried.")}>Retry</button>}
            <span style={{ flexGrow: 1 }} />
            {can("report") && !reporting && (
              <button type="button" className="intg-btn" onClick={() => setReporting(true)}>Report to admin…</button>
            )}
            {can("dismiss") && !dismissing && (
              <button type="button" className="intg-btn link" onClick={() => setDismissing(true)}>Dismiss with a reason…</button>
            )}
          </div>
          {reporting && (
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end", marginBottom: 8 }}>
              <label className="intg-label" style={{ flexGrow: 1 }}>What should the admins look at?
                <input className="intg-input" type="text" value={reportNote} onChange={(e) => setReportNote(e.target.value)}
                       placeholder="e.g. guest says the dates changed; please check with the travel desk" autoFocus />
              </label>
              <button type="button" className="intg-btn primary" disabled={!reportNote.trim() || busy}
                      onClick={() => act("report", { note: reportNote }, "Reported to the admins.")}>Report</button>
              <button type="button" className="intg-btn" onClick={() => setReporting(false)}>Cancel</button>
            </div>
          )}
          {dismissing && (
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <label className="intg-label" style={{ flexGrow: 1 }}>Why is it being dismissed?
                <input className="intg-input" type="text" value={reason} onChange={(e) => setReason(e.target.value)}
                       placeholder="e.g. handled by phone with the travel desk" autoFocus />
              </label>
              <button type="button" className="intg-btn primary" disabled={!reason.trim() || busy}
                      onClick={() => act("dismiss", { reason }, "Dismissed.")}>Dismiss</button>
              <button type="button" className="intg-btn" onClick={() => setDismissing(false)}>Cancel</button>
            </div>
          )}
        </div>
      )}
      <div className="intg-muted" style={{ padding: "0 24px 16px" }}>Every action is recorded with who did it and why.</div>
    </section>
  );
}

export default function IntegrationsInbox() {
  // The tab, search, property and chosen item live in the address, so a refresh, the Back button or a
  // shared link land on the same place (CEO 2026-10-07).
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const account = params.get("account") || "";
  const tabParam = params.get("tab");
  const tab = TAB_KEYS.includes(tabParam) ? tabParam : "attention";
  const q = params.get("q") || "";
  const property = params.get("property") || "";
  const itemParam = Number(params.get("item")) || null;

  const [qInput, setQInput] = useState(q);
  const [data, setData] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [failed, setFailed] = useState("");
  const seq = useRef(0);

  const setParams = useCallback((changes) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(changes).forEach(([k, v]) => (v === null || v === undefined || v === "" ? next.delete(k) : next.set(k, String(v))));
    const s = next.toString();
    router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
  }, [params, router, pathname]);

  // Search 300 ms after the last keystroke, not on every one.
  useEffect(() => {
    if (qInput.trim() === q) return undefined;
    const t = setTimeout(() => setParams({ q: qInput.trim(), item: null }), 300);
    return () => clearTimeout(t);
  }, [qInput, q, setParams]);
  useEffect(() => { setQInput((cur) => (cur.trim() === q ? cur : q)); }, [q]);

  const fetchPage = useCallback((offset) => integrationInboxAPI({ tab, account, q, property, offset: offset || undefined }),
    [tab, account, q, property]);

  const load = useCallback(async () => {
    const mine = ++seq.current;
    setSearching(true);
    const res = await fetchPage(0);
    if (mine !== seq.current) return;   // a newer search has started; this reply is stale
    setSearching(false); setLoading(false);
    if (isOk(res)) {
      setData(res.data.response); setItems(res.data.response.items); setFailed("");
    } else {
      setFailed(errorMessage(res, "Could not load the inbox."));
    }
  }, [fetchPage]);

  useEffect(() => { load(); }, [load]);

  const loadMore = async () => {
    const mine = seq.current;
    setLoadingMore(true);
    const res = await fetchPage(items.length);
    setLoadingMore(false);
    if (mine !== seq.current) return;
    if (isOk(res)) {
      const known = new Set(items.map((i) => i.id));
      setItems((cur) => [...cur, ...res.data.response.items.filter((i) => !known.has(i.id))]);
    } else {
      toast.error(errorMessage(res, "Could not load more."));
    }
  };

  // After an action the item stays where it is, showing its new state; only the counts are refreshed.
  const onChanged = useCallback(async (fresh) => {
    setItems((cur) => cur.map((i) => (i.id === fresh.id
      ? { ...i, status: fresh.status, reason: fresh.reason, reported: fresh.reported } : i)));
    const res = await fetchPage(0);
    if (isOk(res)) setData((cur) => ({ ...cur, counts: res.data.response.counts, badge: res.data.response.badge }));
  }, [fetchPage]);

  // Opened on an item without a tab (a link from Health): show the tab the item is in.
  const onLoaded = useCallback((detail) => {
    if (!tabParam && detail.tab && detail.tab !== tab && detail.id === itemParam) setParams({ tab: detail.tab });
  }, [tabParam, tab, itemParam, setParams]);

  const selected = itemParam || items[0]?.id || null;
  const index = items.findIndex((i) => i.id === selected);
  const next = index >= 0 ? items[index + 1] : null;
  const total = data?.total ?? 0;

  return (
    <IntegrationsShell active="inbox" badge={data?.badge || 0}>
      <div className="intg-inbox">
        <section className="intg-list" aria-label="Messages">
          {data?.scoped && <div className="intg-muted">Showing items for the properties you manage.</div>}
          {data?.account && (
            <div className="intg-filter-chip">
              <span>Only <strong>{data.account.company || data.account.name}</strong> · {data.account.name}</span>
              <button type="button" aria-label="Show every connection" title="Show every connection"
                      onClick={() => setParams({ account: null, item: null })}>✕</button>
            </div>
          )}
          <div role="tablist" aria-label="Queue" style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {TABS.map((t) => (
              <button key={t.key} type="button" role="tab" aria-selected={tab === t.key}
                      className={`intg-chip${tab === t.key ? " active" : ""}`}
                      onClick={() => { if (t.key !== tab) { setLoading(true); setItems([]); setParams({ tab: t.key, item: null }); } }}>
                {t.label}
                <span className={`intg-count${t.key === "attention" && data?.counts?.attention ? " danger" : ""}`}>{data ? data.counts[t.key] : "…"}</span>
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <label className="intg-label" style={{ flexGrow: 1 }}>Search
              <input className="intg-input" type="search" value={qInput} onChange={(e) => setQInput(e.target.value)}
                     placeholder="Guest, reference, request or booking number" />
            </label>
            {(data?.properties || []).length > 1 && (
              <label className="intg-label" style={{ width: 170 }}>Property
                <select className="intg-input" value={property} onChange={(e) => setParams({ property: e.target.value, item: null })}>
                  <option value="">All</option>
                  {data.properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </label>
            )}
            <button type="button" className="intg-btn" onClick={load} disabled={searching} title="Check for new emails">Refresh</button>
          </div>
          <div className="intg-muted" aria-live="polite" style={{ minHeight: 18 }}>
            {searching ? "Searching…" : data && !loading ? `${total} item${total === 1 ? "" : "s"}${q || property ? " found" : ""}${items.length < total ? ` · showing ${items.length}` : ""}` : ""}
            {!searching && data?.search_limited ? " · names searched in the newest 2,000 only" : ""}
          </div>
          {loading && <div className="intg-empty"><Spinner animation="border" size="sm" /> Loading…</div>}
          {!loading && failed && (
            <div className="intg-card intg-empty" role="alert">{failed} <button type="button" className="intg-btn" onClick={load}>Try again</button></div>
          )}
          {!loading && !failed && items.length === 0 && <div className="intg-card intg-empty">Nothing here.</div>}
          {!loading && items.map((item) => (
            <ItemCard key={item.id} item={item} selected={item.id === selected} onSelect={(itemId) => setParams({ item: itemId })} />
          ))}
          {!loading && items.length < total && (
            <button type="button" className="intg-btn" onClick={loadMore} disabled={loadingMore}>
              {loadingMore ? "Loading…" : `Load ${Math.min(data.page, total - items.length)} more`}
            </button>
          )}
        </section>
        {selected ? (
          <Detail key={selected} id={selected} onChanged={onChanged} onLoaded={onLoaded}
                  onNext={next ? () => setParams({ item: next.id }) : null} />
        ) : (
          !loading && <div className="intg-card intg-detail intg-empty">Select an item to see what arrived and what to do.</div>
        )}
      </div>
    </IntegrationsShell>
  );
}
