import { CaretakerUrl } from "./caretakerApiUrl";
import caretakerClient from "./caretakerAxiosInstance";

// ============================================================================
// AUTH
// ============================================================================

export const CaretakerLoginAPI = (data) => {
  return caretakerClient.postNoAuth(CaretakerUrl.Login, data);
};

// ============================================================================
// DASHBOARD
// ============================================================================

export const CaretakerDashboardAPI = (propertyUid) => {
  const params = propertyUid && propertyUid !== 'all' ? `?property_uid=${propertyUid}` : '';
  return caretakerClient.get(`${CaretakerUrl.Dashboard}${params}`);
};

// ============================================================================
// BOOKINGS — CHECK-INS / CHECK-OUTS
// ============================================================================

export const CaretakerCheckInsAPI = (date, propertyUid) => {
  const params = new URLSearchParams();
  if (date) params.append('date', date);
  if (propertyUid && propertyUid !== 'all') params.append('property_uid', propertyUid);
  const qs = params.toString();
  return caretakerClient.get(`${CaretakerUrl.CheckIns}${qs ? '?' + qs : ''}`);
};

export const CaretakerCheckOutsAPI = (date, propertyUid) => {
  const params = new URLSearchParams();
  if (date) params.append('date', date);
  if (propertyUid && propertyUid !== 'all') params.append('property_uid', propertyUid);
  const qs = params.toString();
  return caretakerClient.get(`${CaretakerUrl.CheckOuts}${qs ? '?' + qs : ''}`);
};

// ============================================================================
// BOOKING DETAIL
// ============================================================================

export const CaretakerBookingDetailAPI = (bookingUid) => {
  return caretakerClient.get(`${CaretakerUrl.BookingDetail}${bookingUid}/`);
};

// ============================================================================
// FORMALITIES (GET + POST)
// ============================================================================

export const CaretakerGetFormalitiesAPI = (bookingUid) => {
  return caretakerClient.get(`${CaretakerUrl.Formalities}${bookingUid}/formalities/`);
};

export const CaretakerPostFormalitiesAPI = (bookingUid, data) => {
  return caretakerClient.postUpload(`${CaretakerUrl.Formalities}${bookingUid}/formalities/`, data);
};

// ============================================================================
// CHECK-IN / CHECK-OUT ACTIONS
// ============================================================================

export const CaretakerCheckInAPI = (bookingUid, data) => {
  return caretakerClient.postUpload(`${CaretakerUrl.CheckIn}${bookingUid}/checkin/`, data);
};

export const CaretakerCheckOutAPI = (bookingUid, data) => {
  return caretakerClient.post(`${CaretakerUrl.CheckOut}${bookingUid}/checkout/`, data);
};

// ============================================================================
// GUESTS
// ============================================================================

export const CaretakerGuestsAPI = (propertyUid, search) => {
  const params = new URLSearchParams();
  if (propertyUid && propertyUid !== 'all') params.append('property_uid', propertyUid);
  if (search) params.append('search', search);
  const qs = params.toString();
  return caretakerClient.get(`${CaretakerUrl.Guests}${qs ? '?' + qs : ''}`);
};

// ============================================================================
// CALENDAR
// ============================================================================

export const CaretakerCalendarAPI = (month, propertyUid) => {
  const params = new URLSearchParams();
  if (month) params.append('month', month);
  if (propertyUid && propertyUid !== 'all') params.append('property_uid', propertyUid);
  const qs = params.toString();
  return caretakerClient.get(`${CaretakerUrl.Calendar}${qs ? '?' + qs : ''}`);
};

// ============================================================================
// REVIEWS
// ============================================================================

export const CaretakerReviewsAPI = (status, propertyUid) => {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (propertyUid && propertyUid !== 'all') params.append('property_uid', propertyUid);
  const qs = params.toString();
  return caretakerClient.get(`${CaretakerUrl.Reviews}${qs ? '?' + qs : ''}`);
};

export const CaretakerSendReminderAPI = (bookingUid) => {
  return caretakerClient.post(`${CaretakerUrl.SendReminder}${bookingUid}/send-reminder/`);
};

// ============================================================================
// PROPERTIES
// ============================================================================

export const CaretakerPropertiesAPI = () => {
  return caretakerClient.get(CaretakerUrl.Properties);
};

export const CaretakerPropertyDetailAPI = (propertyUid) => {
  return caretakerClient.get(`${CaretakerUrl.Properties}${propertyUid}/`);
};

// ============================================================================
// HELPER: Map backend booking status to frontend status
// ============================================================================

export const mapBookingStatus = (backendStatus) => {
  const statusMap = {
    'Check-in-Upcoming': 'arriving-soon',
    'Check-in-Pending': 'checkin-pending',
    'Checked In': 'checked-in',
    'Check-out-Pending': 'checkout-pending',
    'Checked-Out': 'checked-out',
    'Cancelled': 'cancelled',
    'No-Show-Manual': 'no-show',
    'No-Show-Auto': 'no-show',
  };
  return statusMap[backendStatus] || backendStatus;
};

// Helper: Transform backend booking to frontend ReservationCard format
export const transformBookingForCard = (booking) => {
  return {
    id: booking.uid,
    status: mapBookingStatus(booking.booking_status),
    roomName: booking.room_name,
    propertyName: booking.property_name,
    guestName: booking.guest_name,
    checkIn: booking.check_in_date,
    checkOut: booking.check_out_date,
    guestImage: booking.guest_image || '/placeholder.svg?height=48&width=48',
    bedType: null,
    roomType: booking.room_type,
    bedName: booking.bed_name,
    bookingNumber: booking.booking_number,
    formalities_status: booking.formalities_status,
    adults_count: booking.adults_count,
    total_nights: booking.total_nights,
  };
};
