"use client";

import { Suspense } from "react";
import CompanyReporting from "@/Components/CompanyFlow/CompanyReporting";

export default function CompanyReportingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompanyReporting />
    </Suspense>
  );
}
