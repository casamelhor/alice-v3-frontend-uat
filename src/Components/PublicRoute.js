// src/components/PublicRoute.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PublicRoute({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token"); // or cookie
    if (token) {
      // If user is already logged in, redirect to dashboard
      router.replace("/Home");
    }
  }, [router]);

  return <>{children}</>;
}
