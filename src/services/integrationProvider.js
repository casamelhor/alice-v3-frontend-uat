// integration: alice_v3_claude — w7 — booking integrations admin API calls
// Backed by AliceBackend_dev-devbranch/alice_channels/api/. Design: docs/integrations/W7_DESIGN.md §14.
import { IntegrationUrl } from "./apiUrl";
import client from "./axiosInstance";

// getWithToken / postWithToken return the whole axios response (status + data), so callers can check
// res.status; plain get() returns only the body, even for an error.

// Health page: system strip, one card per connection, open and acknowledged flags, inbox badge.
export const integrationHealthAPI = () => client.getWithToken(IntegrationUrl.Health);

// Hide a flag until it recurs. note: why it can be ignored for now.
export const integrationAcknowledgeFlagAPI = (flagId, note) =>
  client.postWithToken(`${IntegrationUrl.Flags}${flagId}/acknowledge/`, { note });

// Inbox list. params: { tab: attention|review|waiting|shadow|done, account, property, q }
export const integrationInboxAPI = (params = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  ).toString();
  return client.getWithToken(`${IntegrationUrl.Inbox}${query ? `?${query}` : ""}`);
};

// One item: what arrived, what we tried, the suggested fix, and the actions this user may take.
export const integrationInboxDetailAPI = (id) => client.getWithToken(`${IntegrationUrl.Inbox}${id}/`);

// The original email as text (admins only).
export const integrationInboxOriginalAPI = (id) => client.getWithToken(`${IntegrationUrl.Inbox}${id}/original/`);

// action: accept | retry | dismiss | book-in-room | link-cancel
// data: dismiss {reason} · book-in-room {room_id, bed_index, exclusive, note} · link-cancel {booking_id}
export const integrationInboxActionAPI = (id, action, data = {}) =>
  client.postWithToken(`${IntegrationUrl.Inbox}${id}/${action}/`, data);

const query = (params = {}) => {
  const q = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  ).toString();
  return q ? `?${q}` : "";
};

// params: { company, property, property_uid } to find the connections touching one company or property.
export const integrationConnectionsAPI = (params = {}) =>
  client.getWithToken(`${IntegrationUrl.Connections}${query(params)}`);

// Admins only. data: { company_id, provider, route_address, name, provider_instance }
export const integrationCreateConnectionAPI = (data) => client.postWithToken(IntegrationUrl.Connections, data);

// Admins only. data: any of mode, notify_traveller, auto_apply_cancellations, update_traveller_profiles,
// wait_minutes, quiet_hours, field_map, employer_aliases
export const integrationUpdateConnectionAPI = (id, data) =>
  client.patch(`${IntegrationUrl.Connections}${id}/`, data);

export const integrationConnectOptionsAPI = (companyId) =>
  client.getWithToken(`${IntegrationUrl.ConnectOptions}${query({ company: companyId })}`);

// data: { property_id, external_name, auto_map }
export const integrationLinkPropertyAPI = (id, data) =>
  client.postWithToken(`${IntegrationUrl.Connections}${id}/link-property/`, data);

export const integrationAutoMapAPI = (id, linkId) =>
  client.postWithToken(`${IntegrationUrl.Connections}${id}/auto-map/`, { link_id: linkId });

// data: any of room_id, unit, bed_index, is_active
export const integrationUpdateUnitAPI = (id, unitId, data) =>
  client.patch(`${IntegrationUrl.Connections}${id}/units/${unitId}/`, data);

export const integrationUnmappedAPI = (id) => client.getWithToken(`${IntegrationUrl.Connections}${id}/unmapped/`);

// Admins only. data: { employer, value?, create? } — alias an employer name to an existing entity, or
// (create) add it to the company's entity dropdown.
export const integrationSetEntityAPI = (id, data) =>
  client.postWithToken(`${IntegrationUrl.Connections}${id}/entities/`, data);

// Admins only. Fills the entity into this employer's earlier bookings that have none.
export const integrationFillEntityAPI = (id, employer) =>
  client.postWithToken(`${IntegrationUrl.Connections}${id}/entities/fill/`, { employer });

export const integrationActivityAPI = (id) => client.getWithToken(`${IntegrationUrl.Connections}${id}/activity/`);

export const integrationConnectionAPI = (id) => client.getWithToken(`${IntegrationUrl.Connections}${id}/`);

// Admins only. data: { guesthouse, code, room_id, unit, external_bed, bed_index, property_id }
export const integrationMapUnitAPI = (connectionId, data) =>
  client.postWithToken(`${IntegrationUrl.Connections}${connectionId}/map-unit/`, data);

// The header badge: items needing attention.
export const integrationBadgeAPI = () => client.getWithToken(IntegrationUrl.Badge);
