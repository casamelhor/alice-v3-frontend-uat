// integration: alice_v3_claude — w7 — booking integrations admin: Connections list
"use client";
import { Suspense } from "react";
import IntegrationsConnections from "@/Components/Integrations/IntegrationsConnections";

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <IntegrationsConnections />
    </Suspense>
  );
}
