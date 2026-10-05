"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Spinner } from 'react-bootstrap';
import { useCaretakerLanguage } from '@/context/CaretakerLanguageContext';
import { CaretakerBookingDetailAPI, CaretakerCheckOutAPI } from '@/services/caretakerProvider';
import toast, { Toaster } from 'react-hot-toast';

const CheckOutFormPage = () => {
  const router = useRouter();
  const params = useParams();
  const bookingId = params?.id;
  const { language, bilingual } = useCaretakerLanguage();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBooking, setIsLoadingBooking] = useState(true);
  const [bookingData, setBookingData] = useState(null);
  const [checkOutSuccess, setCheckOutSuccess] = useState(false);
  const [remarks, setRemarks] = useState('');

  // Fetch booking details
  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) return;
      setIsLoadingBooking(true);
      try {
        const response = await CaretakerBookingDetailAPI(bookingId);
        if (response?.data?.success) {
          const b = response.data.response;
          const bookingInfo = {
            id: b.uid,
            guestName: b.traveler?.full_name || 'Unknown',
            roomName: b.room?.room_name || '',
            bedIndex: b.bed,
            propertyName: b.property?.property_name || '',
            checkIn: b.check_in_date,
            checkOut: b.check_out_date,
            bookingNumber: b.booking_number,
            status: b.booking_status,
            totalNights: b.total_nights,
            checkInTime: b.property?.checkin_time || '2:00 PM',
            checkOutTime: b.property?.checkout_time || '11:00 AM',
          };
          setBookingData(bookingInfo);

          // If already checked out, show success screen directly
          if (b.booking_status === 'Checked-Out') {
            setCheckOutSuccess(true);
          }
        } else {
          toast.error('Failed to load booking details');
        }
      } catch (error) {
        console.error('Failed to fetch booking:', error);
        toast.error('Failed to load booking details');
      } finally {
        setIsLoadingBooking(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatDateRange = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return { dateText: '', nights: 0 };
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const startDay = start.getDate();
    const endDay = end.getDate();
    const month = start.toLocaleString('en-US', { month: 'short' });
    const year = start.getFullYear();
    return {
      dateText: `${startDay} - ${endDay} ${month}, ${year}`,
      nights
    };
  };

  const isEarlyCheckout = () => {
    if (!bookingData?.checkOut) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkOutDate = new Date(bookingData.checkOut);
    checkOutDate.setHours(0, 0, 0, 0);
    return today < checkOutDate;
  };

  const handleCheckOut = async () => {
    setIsLoading(true);
    try {
      const payload = {
        remarks: remarks.trim() || undefined,
        early_checkout: isEarlyCheckout(),
      };

      const response = await CaretakerCheckOutAPI(bookingId, payload);

      if (response?.data?.success) {
        setCheckOutSuccess(true);
        toast.success('Check-out completed successfully!');
      } else {
        const errorMsg = response?.data?.response || 'Check-out failed';
        const errorStr = typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg);
        // Detect already checked out
        if (errorStr.toLowerCase().includes('already') || errorStr.toLowerCase().includes('checked-out') || errorStr.toLowerCase().includes('checked out')) {
          setCheckOutSuccess(true);
          toast.success('This guest has already been checked out.');
        } else {
          toast.error(errorStr);
        }
      }
    } catch (error) {
      console.error('Check-out error:', error);
      const errorMsg = error?.response?.data?.response || 'Failed to complete check-out';
      const errorStr = typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg);
      if (errorStr.toLowerCase().includes('already') || errorStr.toLowerCase().includes('checked-out') || errorStr.toLowerCase().includes('checked out')) {
        setCheckOutSuccess(true);
        toast.success('This guest has already been checked out.');
      } else {
        toast.error(errorStr);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Success screen
  if (checkOutSuccess) {
    return (
      <div className="checkin-form-page">
        <Toaster position="top-right" />
        <div className="checkin-success-screen">
          <div className="success-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22,4 12,14.01 9,11.01" />
            </svg>
          </div>
          <h2 className="success-title">
            Check-out Successful!
            <span className="success-title-hindi">{'\u091A\u0947\u0915-\u0906\u0909\u091F \u0938\u092B\u0932!'}</span>
          </h2>
          <p className="success-guest-name">{bookingData?.guestName}</p>
          <p className="success-room-info">
            {bookingData?.roomName} | {bookingData?.propertyName}
          </p>
          <div className="success-actions">
            <Button
              className="caretaker-btn-primary w-100"
              onClick={() => router.push('/caretaker/dashboard')}
            >
              Back to Dashboard
              <span className="btn-hindi">{'\u0921\u0948\u0936\u092C\u094B\u0930\u094D\u0921 \u092A\u0930 \u0935\u093E\u092A\u0938 \u091C\u093E\u090F\u0902'}</span>
            </Button>
            <Button
              className="caretaker-btn-secondary w-100 mt-2"
              onClick={() => router.push(`/caretaker/booking/${bookingId}`)}
            >
              View Booking Details
              <span className="btn-hindi">{'\u092C\u0941\u0915\u093F\u0902\u0917 \u0935\u093F\u0935\u0930\u0923 \u0926\u0947\u0916\u0947\u0902'}</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoadingBooking) {
    return (
      <div className="checkin-form-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  // Booking not found
  if (!bookingData) {
    return (
      <div className="checkin-form-page">
        <div className="error-state">
          <p>Booking not found</p>
          <p className="error-hindi">{'\u092C\u0941\u0915\u093F\u0902\u0917 \u0928\u0939\u0940\u0902 \u092E\u093F\u0932\u0940'}</p>
          <button className="btn-back" onClick={() => router.back()}>
            Go Back - {'\u0935\u093E\u092A\u0938 \u091C\u093E\u090F\u0902'}
          </button>
        </div>
      </div>
    );
  }

  const { dateText, nights } = formatDateRange(bookingData.checkIn, bookingData.checkOut);
  const early = isEarlyCheckout();

  return (
    <div className="checkin-form-page">
      <Toaster position="top-right" />

      {/* Page Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => router.back()}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </button>
        <div className="page-title-group">
          <h1 className="page-main-title">Check-out Guest</h1>
          <p className="page-title-hindi">{'\u0917\u0947\u0938\u094D\u091F \u091A\u0947\u0915-\u0906\u0909\u091F'}</p>
        </div>
      </div>

      {/* Booking Summary Card */}
      <div className="booking-summary-card">
        <div className="booking-card-header">
          <p className="booking-guest-title">
            {bookingData.guestName}
          </p>
          <span className={`checkout-status-badge ${bookingData.status === 'Check-out-Pending' ? 'status-checkout-pending' : ''}`}>
            {bookingData.status}
          </span>
        </div>

        <div className="booking-room-info">
          <span>{bookingData.roomName}</span>
          {bookingData.bedIndex !== null && bookingData.bedIndex !== undefined && (
            <>
              <span className="separator">|</span>
              <span>Bed {bookingData.bedIndex === 0 ? 'A' : 'B'}</span>
            </>
          )}
          <span className="separator">|</span>
          <span>{bookingData.propertyName}</span>
        </div>

        <hr />

        <div className="booking-meta">
          <div className="meta-item">
            <span className="meta-label">Stay</span>
            <span className="meta-value">{dateText}</span>
            <span className="meta-sub">{nights} night{nights !== 1 ? 's' : ''}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Booking ID</span>
            <span className="meta-value">{bookingData.bookingNumber}</span>
          </div>
        </div>

        <div className="booking-meta" style={{ marginTop: '12px' }}>
          <div className="meta-item">
            <span className="meta-label">Check-in</span>
            <span className="meta-value">{formatDate(bookingData.checkIn)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Check-out</span>
            <span className="meta-value">{formatDate(bookingData.checkOut)}</span>
            <span className="meta-sub">{bookingData.checkOutTime}</span>
          </div>
        </div>
      </div>

      {/* Early Checkout Warning */}
      {early && (
        <div className="checkout-warning-card">
          <div className="warning-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="warning-text">
            <strong>Early Check-out</strong>
            <span className="warning-hindi">{'\u091C\u0932\u094D\u0926\u0940 \u091A\u0947\u0915-\u0906\u0909\u091F'}</span>
            <p>Scheduled check-out is {formatDate(bookingData.checkOut)}. Guest is checking out early.</p>
          </div>
        </div>
      )}

      {/* Remarks Section */}
      <div className="checkin-form-section">
        <div className="form-section">
          <h3 className="form-section-title">
            Remarks (Optional)
            <span className="title-hindi">{'\u091F\u093F\u092A\u094D\u092A\u0923\u0940 (\u0935\u0948\u0915\u0932\u094D\u092A\u093F\u0915)'}</span>
          </h3>
          <textarea
            className="checkout-remarks-input"
            placeholder="Any remarks about the checkout... / चेक-आउट के बारे में कोई टिप्पणी..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={3}
            maxLength={1000}
          />
        </div>
      </div>

      {/* Sticky Bottom Actions - always visible above nav bar */}
      <div className="checkout-sticky-actions">
        <p className="confirm-inline">
          Confirm check-out for <strong>{bookingData.guestName}</strong> from <strong>{bookingData.roomName}</strong>?
        </p>
        <Button
          className="caretaker-btn-primary w-100"
          onClick={handleCheckOut}
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner size="sm" animation="border" />
          ) : (
            <>Confirm Check-out - {'\u091A\u0947\u0915-\u0906\u0909\u091F \u0915\u0940 \u092A\u0941\u0937\u094D\u091F\u093F \u0915\u0930\u0947\u0902'}</>
          )}
        </Button>
        <Button
          className="caretaker-btn-secondary w-100"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel - {'\u0930\u0926\u094D\u0926 \u0915\u0930\u0947\u0902'}
        </Button>
      </div>
    </div>
  );
};

export default CheckOutFormPage;
