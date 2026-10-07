// integration: alice_v3_claude — w7 — a booking's cost allocation as it was when the booking was made
"use client";
import React from "react";

const ORIGIN = {
  traveller: "from the traveller's profile",
  provider: "from the travel provider's booking",
  edited: "edited",
  backfill: "reconstructed from the profile when this was introduced",
};

export default function AllocationSummary({ allocation }) {
  const fields = Object.values(allocation?.fields || {}).filter((f) => f?.value);
  if (!fields.length) return null;
  return (
    <div className="small text-muted" style={{ marginTop: 6 }}>
      <span className="fw-semibold">Cost allocation at booking time</span>
      {allocation.origin ? ` (${ORIGIN[allocation.origin] || allocation.origin})` : ""}:{" "}
      {fields.map((f) => `${f.label}: ${f.value}`).join(" · ")}
    </div>
  );
}
