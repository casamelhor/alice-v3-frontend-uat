// integration: alice_v3_claude — notification recipients admin API calls
// Backed by alice_notifications/alice_notifications_api/. Spec:
// docs/change-proposals/20260730_154351_notification-recipients-admin/
import { NotificationConfigUrl } from "./apiUrl";
import client from "./axiosInstance";

// Company notification configuration: every notification type, the group
// addresses, existing property overrides and the company's assigned properties.
export const notificationConfigGetAPI = (companyUid) => {
  return client.get(`${NotificationConfigUrl.GetConfig}${companyUid}/`);
};

// Set the company-level group address across notification types.
// data: { emails: [], field: "cc" | "bcc" | "reply_to",
//         notification_types?: [], propagate_to_properties?: bool }
export const notificationGroupEmailUpdateAPI = (companyUid, data) => {
  return client.patch(`${NotificationConfigUrl.UpdateGroupEmail}${companyUid}/`, data);
};

// Create or update one property-level override.
// data: { notification_type, msg91_template_id, cc_emails: [],
//         keep_company_addresses: bool, is_enabled: bool }
export const notificationPropertyOverrideUpdateAPI = (companyUid, propertyUid, data) => {
  return client.patch(
    `${NotificationConfigUrl.PropertyOverride}${companyUid}/${propertyUid}/`,
    data
  );
};

// Remove a property override so the company default applies again.
// Pass notificationType to remove a single type, omit to remove all.
export const notificationPropertyOverrideDeleteAPI = (companyUid, propertyUid, notificationType) => {
  const query = notificationType
    ? `?notification_type=${encodeURIComponent(notificationType)}`
    : "";
  return client.deleteReq(
    `${NotificationConfigUrl.PropertyOverride}${companyUid}/${propertyUid}/${query}`
  );
};