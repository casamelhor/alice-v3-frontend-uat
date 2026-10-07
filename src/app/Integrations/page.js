// integration: alice_v3_claude — w7 — booking integrations admin: Health
"use client";
import { Suspense } from "react";
import IntegrationsHealth from "@/Components/Integrations/IntegrationsHealth";

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <IntegrationsHealth />
    </Suspense>
  );
}
