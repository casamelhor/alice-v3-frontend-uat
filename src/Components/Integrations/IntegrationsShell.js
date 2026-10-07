// integration: alice_v3_claude — w7 — booking integrations admin: page shell (header, title, section tabs)
"use client";
import React from "react";
import Link from "next/link";
import { Container } from "react-bootstrap";
import Header from "../Header/Header";
import ProtectedRoute from "../ProtectedRoute";
import "./Integrations.css";

const SECTIONS = [
  { key: "health", label: "Health", href: "/Integrations" },
  { key: "inbox", label: "Inbox", href: "/Integrations/Inbox" },
  { key: "connections", label: "Connections", href: "/Integrations/Connections" },
];

export default function IntegrationsShell({ active, badge = 0, actions = null, children }) {
  return (
    <ProtectedRoute>
      <Header />
      <Container fluid className="intg-page">
        <div className="intg-breadcrumb">
          Admin <span aria-hidden="true">›</span> Integrations
          {active !== "health" && (
            <>
              {" "}<span aria-hidden="true">›</span> {SECTIONS.find((x) => x.key === active)?.label}
            </>
          )}
        </div>
        <div className="intg-title-row">
          <h1 className="intg-title">Integrations</h1>
          {actions}
        </div>
        <nav className="intg-sections" aria-label="Integrations sections">
          {SECTIONS.map((s) => (
            <Link
              key={s.key}
              href={s.href}
              className={`intg-section${active === s.key ? " active" : ""}`}
              aria-current={active === s.key ? "page" : undefined}
            >
              {s.label}
              {s.key === "inbox" && badge > 0 && <span className="intg-count danger">{badge}</span>}
            </Link>
          ))}
        </nav>
        {children}
      </Container>
    </ProtectedRoute>
  );
}

export const isOk = (res) => res?.status >= 200 && res?.status < 300;

export const errorMessage = (res, fallback = "Something went wrong.") =>
  res?.data?.message || res?.data?.detail || fallback;
