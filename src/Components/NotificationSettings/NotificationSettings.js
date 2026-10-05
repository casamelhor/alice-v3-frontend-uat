// integration: alice_v3_claude — notification recipients admin (company group email + property overrides)
// Spec: docs/change-proposals/20260730_154351_notification-recipients-admin/
"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Container, Row, Col, Card, Badge, Button, Table, Tabs, Tab, Spinner, Form, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  notificationConfigGetAPI,
  notificationGroupEmailUpdateAPI,
  notificationPropertyOverrideUpdateAPI,
  notificationPropertyOverrideDeleteAPI,
} from "@/services/notificationProvider";
import { companyListAPIS } from "@/services/provider";
import { useSearchParams } from "next/navigation";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isOk = (res) => res?.status >= 200 && res?.status < 300;

export default function NotificationSettings() {
  const [companies, setCompanies] = useState([]);
  const [companyId, setCompanyId] = useState("");
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Company-level group address
  const [groupField, setGroupField] = useState("cc");
  const [groupEmails, setGroupEmails] = useState([]);
  const [groupInput, setGroupInput] = useState("");

  // Property override editor
  const [selectedProperty, setSelectedProperty] = useState("");
  const [overrideType, setOverrideType] = useState("Booking_Confirmed");
  const [overrideTemplate, setOverrideTemplate] = useState("");
  const [overrideEnabled, setOverrideEnabled] = useState(true);
  const [keepCompany, setKeepCompany] = useState(true);
  const [overrideExtras, setOverrideExtras] = useState([]);
  const [overrideInput, setOverrideInput] = useState("");

  const searchParams = useSearchParams();
  const id = searchParams.get("comId");

  useEffect(() => {
    if (id) setCompanyId(id);
  }, [id])

  const loadCompanies = useCallback(async () => {
    try {
      const res = await companyListAPIS("all", 1, 100, "");
      if (res?.data?.response && Array.isArray(res.data.response)) {
        setCompanies(res.data.response);
      }
    } catch (err) {
      console.error("Company load error:", err);
    }
  }, []);

  const loadConfig = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await notificationConfigGetAPI(id);
      if (isOk(res) && res?.response) {
        const payload = res.response;
        setConfig(payload);
        setGroupEmails(payload.group_emails?.[groupField] ? [].concat(payload.group_emails[groupField]) : []);
      } else {
        setConfig(null);
        toast.error(res?.data?.message || "Could not load notification configuration");
      }
    } catch (err) {
      console.error("Notification config load error:", err);
      setConfig(null);
      toast.error("Could not load notification configuration");
    } finally {
      setLoading(false);
    }
  }, [groupField]);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  useEffect(() => {
    if (companyId) loadConfig(companyId);
  }, [companyId, loadConfig]);

  // Switching the target field re-reads the stored values for that field.
  useEffect(() => {
    if (!config) return;
    const stored = config.group_emails?.[groupField];
    setGroupEmails(stored ? [].concat(stored) : []);
  }, [groupField, config]);

  const notificationTypes = useMemo(() => config?.types || [], [config]);
  const overrides = useMemo(() => config?.property_overrides || [], [config]);
  const availableProperties = useMemo(() => config?.available_properties || [], [config]);

  const overriddenPropertyCount = overrides.length;

  const addEmail = (value, list, setList, resetInput) => {
    const candidate = (value || "").trim();
    if (!candidate) return;
    if (!EMAIL_PATTERN.test(candidate)) {
      toast.error("Enter a valid email address");
      return;
    }
    if (list.some((item) => item.toLowerCase() === candidate.toLowerCase())) {
      toast.info("That address is already in the list");
      return;
    }
    setList([...list, candidate]);
    resetInput("");
  };

  const saveGroupEmail = async () => {
    if (!companyId) return;
    if (groupField === "reply_to" && groupEmails.length > 1) {
      toast.error("Reply-to accepts a single address");
      return;
    }
    setSaving(true);
    try {
      const res = await notificationGroupEmailUpdateAPI(companyId, {
        emails: groupEmails,
        field: groupField,
        notification_types: [],
        propagate_to_properties: true,
      });
      if (isOk(res) && res?.data?.success) {
        const synced = res.data.response?.propagated_overrides?.length || 0;
        toast.success(
          synced
            ? `Saved. ${synced} property override(s) kept in sync.`
            : "Saved"
        );
        loadConfig(companyId);
      } else {
        toast.error(res?.data?.message || "Could not save");
      }
    } catch (err) {
      console.error("Group email save error:", err);
      toast.error("Could not save");
    } finally {
      setSaving(false);
    }
  };

  const loadOverrideIntoEditor = (propertyUid, row) => {
    setSelectedProperty(propertyUid);
    setOverrideType(row.notification_type);
    setOverrideTemplate(row.msg91_template_id || "");
    setOverrideEnabled(row.is_enabled);
    setKeepCompany(row.keep_company_addresses);
    const companyCc = (row.company_cc_emails || []).map((item) => item.toLowerCase());
    setOverrideExtras(
      (row.cc_emails || []).filter((item) => !companyCc.includes(item.toLowerCase()))
    );
  };

  const saveOverride = async () => {
    if (!companyId || !selectedProperty) {
      toast.error("Select a property first");
      return;
    }
    setSaving(true);
    try {
      const res = await notificationPropertyOverrideUpdateAPI(companyId, selectedProperty, {
        notification_type: overrideType,
        msg91_template_id: overrideTemplate,
        cc_emails: overrideExtras,
        keep_company_addresses: keepCompany,
        is_enabled: overrideEnabled,
      });
      if (isOk(res) && res?.data?.success) {
        toast.success("Override saved");
        loadConfig(companyId);
      } else {
        toast.error(res?.data?.message || "Could not save override");
      }
    } catch (err) {
      console.error("Override save error:", err);
      toast.error("Could not save override");
    } finally {
      setSaving(false);
    }
  };

  const removeOverride = async (propertyUid, notificationType) => {
    if (!companyId) return;
    setSaving(true);
    try {
      const res = await notificationPropertyOverrideDeleteAPI(companyId, propertyUid, notificationType);
      if (isOk(res) && res?.data?.success) {
        toast.success("Override removed — company default now applies");
        loadConfig(companyId);
      } else {
        toast.error(res?.data?.message || "Could not remove override");
      }
    } catch (err) {
      console.error("Override remove error:", err);
      toast.error("Could not remove override");
    } finally {
      setSaving(false);
    }
  };

  // What the resolver will actually deliver for the property being edited.
  const effectiveCc = useMemo(() => {
    const companyCc = keepCompany ? groupEmails : [];
    const merged = [];
    const seen = new Set();
    [...companyCc, ...overrideExtras].forEach((item) => {
      if (item && !seen.has(item.toLowerCase())) {
        seen.add(item.toLowerCase());
        merged.push(item);
      }
    });
    return merged;
  }, [keepCompany, groupEmails, overrideExtras]);

  const companyTemplateForType = useMemo(() => {
    const row = notificationTypes.find((item) => item.notification_type === overrideType);
    return row?.msg91_template_id || null;
  }, [notificationTypes, overrideType]);

  return (
    <Container fluid className="py-4">
      <Row className="align-items-start mb-3">
        <Col>
          <h4 className="mb-1">Notification recipients</h4>
          <p className="text-muted mb-0">
            Extra addresses copied on booking emails, per company.
          </p>
        </Col>
        <Col xs="auto">
          <Badge bg="warning" text="dark">Admin only</Badge>
        </Col>
      </Row>

      <Row className="align-items-center mb-3">
        <Col xs={12} md={5}>
          <Form.Group>
            <Form.Label className="small text-muted mb-1">Company</Form.Label>
            <Form.Select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              disabled={id ? true : false}
            >
              <option value="">Select a company</option>
              {companies.map((item) => (
                <option key={item.id} value={item.uid}>{item.company_name}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        {config && (
          <Col xs="auto" className="mt-3">
            <Badge bg="light" text="dark">
              {notificationTypes.filter((item) => item.is_enabled).length} types active
            </Badge>
          </Col>
        )}
      </Row>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" size="sm" /> <span className="ms-2">Loading…</span>
        </div>
      )}

      {!loading && !config && (
        <Alert variant="light">Select a company to view its notification recipients.</Alert>
      )}

      {!loading && config && (
        <Tabs defaultActiveKey="company" className="mb-3">
          {/* ---------------- Screen 1: company defaults ---------------- */}
          <Tab eventKey="company" title="Company defaults">
            <Card className="mb-3">
              <Card.Body>
                <Card.Title as="h6">Company group email</Card.Title>
                <p className="text-muted small">
                  Added to {groupField.toUpperCase()} on every booking email for this company.
                </p>

                <Row className="g-2 mb-2">
                  <Col xs={12} md={6}>
                    <Form.Control
                      type="email"
                      placeholder="name@casamelhor.in"
                      value={groupInput}
                      onChange={(e) => setGroupInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addEmail(groupInput, groupEmails, setGroupEmails, setGroupInput);
                        }
                      }}
                    />
                  </Col>
                  <Col xs="auto">
                    <Button
                      variant="outline-secondary"
                      onClick={() => addEmail(groupInput, groupEmails, setGroupEmails, setGroupInput)}
                    >
                      Add
                    </Button>
                  </Col>
                </Row>

                <div className="mb-3">
                  {groupEmails.length === 0 && (
                    <span className="text-muted small">No addresses configured.</span>
                  )}
                  {groupEmails.map((item) => (
                    <Badge
                      bg="light"
                      text="dark"
                      className="me-2 mb-2 p-2"
                      key={item}
                    >
                      {item}{" "}
                      <span
                        role="button"
                        aria-label={`Remove ${item}`}
                        className="ms-1 text-danger"
                        onClick={() =>
                          setGroupEmails(groupEmails.filter((entry) => entry !== item))
                        }
                      >
                        ×
                      </span>
                    </Badge>
                  ))}
                </div>

                <div className="d-flex align-items-center gap-3 border-top pt-3">
                  <span className="small text-muted">Field</span>
                  {["cc", "bcc", "reply_to"].map((option) => (
                    <Form.Check
                      key={option}
                      type="radio"
                      inline
                      name="groupField"
                      id={`groupField-${option}`}
                      label={option === "reply_to" ? "Reply-to" : option.toUpperCase()}
                      checked={groupField === option}
                      onChange={() => setGroupField(option)}
                    />
                  ))}
                </div>
              </Card.Body>
            </Card>

            <Alert variant="light" className="small">
              Booking emails contain guest details. Anyone added here receives them for all
              future bookings.
            </Alert>

            {overriddenPropertyCount > 0 && (
              <Alert variant="warning" className="small">
                Overridden by {overriddenPropertyCount} propert
                {overriddenPropertyCount === 1 ? "y" : "ies"}. A property override replaces
                the company row entirely — check the Property overrides tab.
              </Alert>
            )}

            <h6 className="mb-1">Per notification type</h6>
            <p className="text-muted small">Stored configuration for each booking email.</p>
            <Table responsive bordered size="sm" className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Type</th>
                  <th>On</th>
                  <th>Extra CC</th>
                  <th>Template</th>
                </tr>
              </thead>
              <tbody>
                {notificationTypes.map((row) => (
                  <tr key={row.notification_type}>
                    <td>{row.notification_type_display}</td>
                    <td>
                      <Badge bg={row.is_enabled ? "success" : "secondary"}>
                        {row.is_enabled ? "On" : "Off"}
                      </Badge>
                    </td>
                    <td className="small">
                      {row.cc_emails.length ? row.cc_emails.join(", ") : "—"}
                    </td>
                    <td className="small text-muted">
                      {row.msg91_template_id || "system default"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div className="d-flex justify-content-end gap-2 border-top pt-3">
              <Button variant="outline-secondary" onClick={() => loadConfig(companyId)} disabled={saving}>
                Cancel
              </Button>
              <Button variant="primary" onClick={saveGroupEmail} disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </Tab>

          {/* ---------------- Screen 2: property overrides ---------------- */}
          <Tab eventKey="properties" title={`Property overrides${overriddenPropertyCount ? ` (${overriddenPropertyCount})` : ""}`}>
            <Card className="mb-3 bg-light border-0">
              <Card.Body className="py-2">
                <div className="small text-muted">
                  Company default — applies unless a property overrides
                </div>
                <div className="small">
                  {groupField.toUpperCase()}{" "}
                  {groupEmails.length ? groupEmails.join(", ") : "not set"}
                </div>
              </Card.Body>
            </Card>

            <h6 className="mb-1">Properties with overrides</h6>
            <p className="text-muted small">These replace the company default for the listed types.</p>

            {overrides.length === 0 && (
              <Alert variant="light" className="small">
                No property overrides. This company uses the company default everywhere.
              </Alert>
            )}

            {overrides.map((group) => (
              <Card className="mb-2" key={group.property_uid}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-semibold">{group.property_name}</div>
                      <div className="small text-muted">
                        {group.overrides.length} override(s)
                      </div>
                    </div>
                  </div>
                  <Table responsive borderless size="sm" className="mt-2 mb-0 align-middle">
                    <tbody>
                      {group.overrides.map((row) => (
                        <tr key={row.notification_type}>
                          <td className="small">{row.notification_type_display}</td>
                          <td className="small text-muted">
                            {row.effective.msg91_template_id || "system default"}
                          </td>
                          <td className="small">
                            {row.effective.cc_emails.length
                              ? row.effective.cc_emails.join(", ")
                              : "—"}
                          </td>
                          <td className="text-end">
                            <Button
                              size="sm"
                              variant="outline-secondary"
                              className="me-2"
                              onClick={() => loadOverrideIntoEditor(group.property_uid, row)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              disabled={saving}
                              onClick={() => removeOverride(group.property_uid, row.notification_type)}
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            ))}

            <Card className="mt-3">
              <Card.Body>
                <Card.Title as="h6">
                  {selectedProperty ? "Edit override" : "Add override"}
                </Card.Title>

                <Row className="g-2 mb-3">
                  <Col xs={12} md={6}>
                    <Form.Label className="small text-muted mb-1">Property</Form.Label>
                    <Form.Select
                      value={selectedProperty}
                      onChange={(e) => setSelectedProperty(e.target.value)}
                    >
                      <option value="">Select a property</option>
                      {availableProperties.map((item) => (
                        <option key={item.property_uid} value={item.property_uid}>
                          {item.property_name}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col xs={12} md={4}>
                    <Form.Label className="small text-muted mb-1">Notification type</Form.Label>
                    <Form.Select
                      value={overrideType}
                      onChange={(e) => setOverrideType(e.target.value)}
                    >
                      {notificationTypes.map((item) => (
                        <option key={item.notification_type} value={item.notification_type}>
                          {item.notification_type_display}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col xs={12} md={2} className="d-flex align-items-end">
                    <Form.Check
                      type="checkbox"
                      id="overrideEnabled"
                      label="Enabled"
                      checked={overrideEnabled}
                      onChange={(e) => setOverrideEnabled(e.target.checked)}
                    />
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label className="small text-muted mb-1">Email template</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="leave blank to use the company default"
                    value={overrideTemplate}
                    onChange={(e) => setOverrideTemplate(e.target.value)}
                  />
                  <Form.Text muted>
                    Company default: {companyTemplateForType || "system default"}
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label className="small text-muted mb-1">CC recipients</Form.Label>
                  <Form.Check
                    type="checkbox"
                    id="keepCompany"
                    label="Keep company addresses"
                    checked={keepCompany}
                    onChange={(e) => setKeepCompany(e.target.checked)}
                  />
                </Form.Group>

                <div className="mb-2">
                  {keepCompany &&
                    groupEmails.map((item) => (
                      <Badge bg="light" text="muted" className="me-2 mb-2 p-2 border" key={`inherited-${item}`}>
                        ↳ {item}
                      </Badge>
                    ))}
                  {overrideExtras.map((item) => (
                    <Badge bg="primary" className="me-2 mb-2 p-2" key={item}>
                      {item}{" "}
                      <span
                        role="button"
                        aria-label={`Remove ${item}`}
                        className="ms-1"
                        onClick={() =>
                          setOverrideExtras(overrideExtras.filter((entry) => entry !== item))
                        }
                      >
                        ×
                      </span>
                    </Badge>
                  ))}
                </div>

                <Row className="g-2 mb-3">
                  <Col xs={12} md={6}>
                    <Form.Control
                      type="email"
                      placeholder="name@casamelhor.in"
                      value={overrideInput}
                      onChange={(e) => setOverrideInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addEmail(overrideInput, overrideExtras, setOverrideExtras, setOverrideInput);
                        }
                      }}
                    />
                  </Col>
                  <Col xs="auto">
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        addEmail(overrideInput, overrideExtras, setOverrideExtras, setOverrideInput)
                      }
                    >
                      Add
                    </Button>
                  </Col>
                </Row>

                <Card className="bg-light border-0 mb-3">
                  <Card.Body className="py-2">
                    <div className="small text-muted mb-1">
                      Effective recipients for bookings at this property
                    </div>
                    <div className="small">
                      <div><span className="text-muted">To</span> — Guest</div>
                      <div>
                        <span className="text-muted">Cc</span>{" "}
                        {effectiveCc.length ? effectiveCc.join(", ") : "—"}
                      </div>
                      <div>
                        <span className="text-muted">Template</span>{" "}
                        {overrideTemplate || companyTemplateForType || "system default"}
                      </div>
                    </div>
                  </Card.Body>
                </Card>

                <Alert variant="warning" className="small">
                  A property override replaces the company row entirely. Unchecking
                  &ldquo;Keep company addresses&rdquo; drops the company addresses for this
                  property.
                </Alert>

                <div className="d-flex justify-content-end gap-2">
                  <Button
                    variant="outline-secondary"
                    disabled={saving}
                    onClick={() => {
                      setSelectedProperty("");
                      setOverrideExtras([]);
                      setOverrideTemplate("");
                      setKeepCompany(true);
                      setOverrideEnabled(true);
                    }}
                  >
                    Clear
                  </Button>
                  <Button variant="primary" onClick={saveOverride} disabled={saving}>
                    {saving ? "Saving…" : "Save override"}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      )}
    </Container>
  );
}