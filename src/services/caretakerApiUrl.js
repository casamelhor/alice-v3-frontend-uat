export const CaretakerUrl = {
  // Auth
  Login: "alice-caretaker-api/login/",

  // Dashboard
  Dashboard: "alice-caretaker-api/dashboard/",

  // Bookings
  CheckIns: "alice-caretaker-api/checkins/",
  CheckOuts: "alice-caretaker-api/checkouts/",
  BookingDetail: "alice-caretaker-api/bookings/",   // + {uid}/
  Formalities: "alice-caretaker-api/bookings/",     // + {uid}/formalities/
  CheckIn: "alice-caretaker-api/bookings/",         // + {uid}/checkin/
  CheckOut: "alice-caretaker-api/bookings/",        // + {uid}/checkout/

  // Guests
  Guests: "alice-caretaker-api/guests/",

  // Calendar
  Calendar: "alice-caretaker-api/calendar/bookings/",

  // Reviews
  Reviews: "alice-caretaker-api/reviews/",
  SendReminder: "alice-caretaker-api/bookings/",    // + {uid}/send-reminder/

  // Properties
  Properties: "alice-caretaker-api/properties/",
};
