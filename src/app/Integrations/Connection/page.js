// integration: alice_v3_claude — w7 — booking integrations admin: one connection (uses useSearchParams, so Suspense is required)
"use client";
import { Suspense } from "react";
import IntegrationsConnection from "@/Components/Integrations/IntegrationsConnection";

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <IntegrationsConnection />
    </Suspense>
  );
}
