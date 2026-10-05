import { convertDatewith, getTimeinDatestring } from "@/utils/formatTime";
import React, { useMemo } from "react";

const BookingTimeline = ({ history = [] }) => {

  /* ==============================
     1️⃣ Sort Events By Date
  ============================== */
  const sortedHistory = useMemo(() => {
    return [...history].sort(
      (a, b) => new Date(a.performed_at) - new Date(b.performed_at)
    );
  }, [history]);


  /* ==============================
     2️⃣ Stop After Cancellation
  ============================== */
  const finalHistory = useMemo(() => {
    const cancelIndex = sortedHistory.findIndex(
      (item) => item.event_type === "Cancellation"
    );

    return cancelIndex !== -1
      ? sortedHistory.slice(0, cancelIndex + 1)
      : sortedHistory;
  }, [sortedHistory]);


  /* ==============================
     3️⃣ Icon Mapping (All 11 + Dynamic)
  ============================== */
  const iconMap = {
    Creation: "/images/icons/hail_24dp.svg",
    "Status-Change": "/images/icons/sync.svg",
    Modification: "/images/icons/edit.svg",
    Cancellation: "/images/icons/cancel.svg",
    Notification: "/images/icons/notification.svg",
    "Check-in": "/images/icons/key_vertical24.svg",
    "Check-out": "/images/icons/emoji_people24.svg",
    "No-Show": "/images/icons/error.svg",
    Payment: "/images/icons/payment.svg",
    Refund: "/images/icons/refund.svg",
    "Document-Upload": "/images/icons/info-i.svg",
  };

  /* ==============================
     4️⃣ Safe Fallback for Unknown
     (Supports: event_type: "Something-New")
  ============================== */
  const getIcon = (type) =>
    iconMap[type] || "/images/icons/info-i.svg";


  /* ==============================
     5️⃣ Render Timeline
  ============================== */
  return (
    <div className="d-flex justify-content-between align-items-start position-relative z-1 progress-dot-line">

      {finalHistory.map((event, index) => {

        const isLast = index === finalHistory.length - 1;
        const eventType = event.event_type || "Unknown";

        return (
          <div
            key={`${eventType}-${index}`}
            className={`text-start position-relative ${
              !isLast ? "completed-point" : ""
            }`}
            style={{
              width: `${100 / finalHistory.length}%`,
              minWidth: "120px"
            }}
          >

            {/* ===== ICON ===== */}
            <div className="d-inline-flex align-items-center justify-content-center mb-2">
              <img
                src={getIcon(eventType)}
                className={`img-fluid ${!isLast ? "opacity-50" : ""}`}
                alt={eventType}
                width="24"
                height="24"
              />
            </div>

            {/* ===== DOT ===== */}
            <span className={`point pnt-${index + 1}`}></span>

            {/* ===== DATE ===== */}
            <p className="mb-0 fw-semibold small text-dark">
              {convertDatewith(event.performed_at)}
            </p>

            {/* ===== TIME ===== */}
            <p className="mb-0 text-muted small">
              at {getTimeinDatestring(event.performed_at)}
            </p>

            {/* ===== EVENT NAME ===== */}
            <p className="text-muted small">
              {eventType}
            </p>

            {/* ===== INFO ICON ===== */}
            <img
              src="/images/icons/info-i.svg"
              className="img-fluid mb-2"
              alt="info"
              width="20"
              height="20"
            />

            {/* ===== TOOLTIP ===== */}
            <div className="booking-detail-tooltip p-2 bg-white shadow-sm rounded">

              <p className="fw-medium">Event Type:</p>
              <p>{eventType}</p>

              {event.event_description && (
                <>
                  <p className="fw-medium mt-2">Description:</p>
                  <p>{event.event_description}</p>
                </>
              )}

              {event.performed_by && (
                <>
                  <p className="fw-medium mt-2">Performed By:</p>
                  <p className="mb-0">{event.performed_by}</p>
                </>
              )}

            </div>

          </div>
        );
      })}

    </div>
  );
};

export default BookingTimeline;