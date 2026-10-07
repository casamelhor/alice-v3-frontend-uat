// integration: alice_v3_claude — w7 — booking integrations admin: Inbox (uses useSearchParams, so Suspense is required)
"use client";
import { Suspense } from "react";
import IntegrationsInbox from "@/Components/Integrations/IntegrationsInbox";

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <IntegrationsInbox />
    </Suspense>
  );
}
