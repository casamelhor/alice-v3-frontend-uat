// integration: alice_v3_claude — w7 — booking integrations admin: Connect a company wizard (uses useSearchParams, so Suspense is required)
"use client";
import { Suspense } from "react";
import IntegrationsConnect from "@/Components/Integrations/IntegrationsConnect";

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <IntegrationsConnect />
    </Suspense>
  );
}
