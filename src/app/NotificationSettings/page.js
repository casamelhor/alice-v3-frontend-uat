// integration: alice_v3_claude — notification recipients admin route
"use client";
import { Suspense } from "react";
import NotificationSettings from "@/Components/NotificationSettings/NotificationSettings";

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotificationSettings />
    </Suspense>
  );
}
