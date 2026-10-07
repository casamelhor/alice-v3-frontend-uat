// integration: alice_v3_claude — w7 — where a booking came from (Bookings list, booking details)
"use client";
import React from "react";

export const SOURCE_LABELS = { alice: "Alice", q2t: "Quest2Travel", mmt: "MakeMyTrip", api: "API" };

const STYLE = {
  q2t: { background: "#e3efee", color: "#165953" },
  mmt: { background: "#f7ecd6", color: "#6f5212" },
  api: { background: "#f2eeeb", color: "#463527" },
  alice: { background: "#f2eeeb", color: "#463527" },
};

// Channel bookings get a badge; Alice's own bookings show nothing unless `showAlice` (keeps lists quiet).
// `compact` keeps the provider's reference in the tooltip only (narrow table columns).
export default function SourceBadge({ source, reference, showAlice = false, compact = false }) {
  if (!source || (source === "alice" && !showAlice)) return null;
  const label = SOURCE_LABELS[source] || source;
  return (
    <span
      title={reference ? `${label} reference ${reference}` : label}
      style={{ ...(STYLE[source] || STYLE.api), fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "2px 7px", marginLeft: 6, whiteSpace: "nowrap" }}
    >
      {label}{reference && !compact ? ` · ${reference}` : ""}
    </span>
  );
}
