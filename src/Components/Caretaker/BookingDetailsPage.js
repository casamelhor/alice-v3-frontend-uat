"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { useCaretakerLanguage } from '@/context/CaretakerLanguageContext';
import { CaretakerBookingDetailAPI, mapBookingStatus } from '@/services/caretakerProvider';

const BookingDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const { t, language } = useCaretakerLanguage();
  const bookingId = params?.id;

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) return;
      setLoading(true);
      try {
        const response = await CaretakerBookingDetailAPI(bookingId);
        if (response?.data?.success) {
          const b = response.data.response;
          setBooking({
            id: b.uid,
            guestName: b.traveler ? `${b.traveler.full_name || ''}`.trim() : 'Unknown',
            phone: b.traveler?.phone_number || '',
            email: b.traveler?.email || '',
            guestCount: b.adults_count || 1,
            checkIn: b.check_in_date,
            checkOut: b.check_out_date,
            checkInTime: b.property?.checkin_time || '2:00 PM',
            checkOutTime: b.property?.checkout_time || '11:00 AM',
            roomName: b.room?.room_name || '',
            propertyName: b.property?.property_name || '',
            status: mapBookingStatus(b.booking_status),
            guestImage: b.traveler?.profile_image || '/placeholder.svg?height=80&width=80',
            specialRequests: b.additional_comments || '',
            totalAmount: b.total_price || 0,
            amountPaid: b.total_price || 0,
            paymentStatus: 'paid',
            bookingSource: 'Direct',
            createdAt: b.created_at || '',
            bookingNumber: b.booking_number,
            formalities_status: b.formalities_status,
            arrival_details: b.arrival_details,
          });
        }
      } catch (error) {
        console.error('Failed to fetch booking details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);
  
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  const getStatusInfo = (status) => {
    switch (status) {
      case 'confirmed':
        return { labelEn: 'Confirmed', labelHi: 'कन्फर्म', className: 'status-confirmed' };
      case 'checkin-pending':
        return { labelEn: 'Check-in Pending', labelHi: 'चेक-इन बाकी', className: 'status-checkin-pending' };
      case 'checked-in':
        return { labelEn: 'Checked In', labelHi: 'चेक इन', className: 'status-checked-in' };
      case 'checkout-pending':
        return { labelEn: 'Check-out Pending', labelHi: 'चेक-आउट बाकी', className: 'status-checkout-pending' };
      case 'checked-out':
        return { labelEn: 'Checked Out', labelHi: 'चेक आउट', className: 'status-checked-out' };
      case 'cancelled':
        return { labelEn: 'Cancelled', labelHi: 'रद्द', className: 'status-cancelled' };
      case 'no-show':
        return { labelEn: 'No Show', labelHi: 'नो-शो', className: 'status-no-show' };
      default:
        return { labelEn: 'Pending', labelHi: 'लंबित', className: 'status-pending' };
    }
  };
  
  const [paymentOpen, setPaymentOpen] = useState(false);

  const handleCheckIn = () => {
    router.push(`/caretaker/checkin/${bookingId}`);
  };
  
  const handleCheckOut = () => {
    router.push(`/caretaker/checkout/${bookingId}`);
  };
  
  if (loading) {
    return (
      <div className="booking-details-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }
  
  if (!booking) {
    return (
      <div className="booking-details-page">
        <div className="error-state">
          <p>Booking not found</p>
          <p className="error-hindi">बुकिंग नहीं मिली</p>
          <button className="btn-back" onClick={() => router.back()}>
            Go Back - वापस जाएं
          </button>
        </div>
      </div>
    );
  }
  
  const statusInfo = getStatusInfo(booking.status);

  return (
    <div className="booking-details-page">
      {/* Back Header */}
      <div className="page-back-header">
        <button className="back-btn" onClick={() => router.back()}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="page-header-title">
          <h1>Booking Details</h1>
          <span className="page-header-hindi">बुकिंग विवरण</span>
        </div>
      </div>
      
      {/* Booking ID & Status */}
      <div className="booking-header-card">
        <div className="booking-id-row">
          <span className="booking-id-label">Booking ID: <span className="booking-id-hindi">बुकिंग आईडी:</span></span>
          <span className="booking-id-value">#{booking.bookingNumber || booking.id}</span>
        </div>
        <span className={`booking-status-badge ${statusInfo.className}`}>
          {statusInfo.labelEn} <span className="status-hindi">{statusInfo.labelHi}</span>
        </span>
      </div>
      
      {/* Guest Info Card */}
      <div className="booking-section-card">
        <h3 className="section-title">
          Guest Information
          <span className="section-title-hindi">मेहमान जानकारी</span>
        </h3>
        
        <div className="guest-profile-row">
          <Image 
            src={booking.guestImage} 
            width={64} 
            height={64} 
            alt={booking.guestName}
            className="guest-profile-image"
          />
          <div className="guest-profile-info">
            <h4 className="guest-profile-name">{booking.guestName}</h4>
            <p className="guest-profile-meta">{booking.guestCount} guests - {booking.guestCount} मेहमान</p>
          </div>
        </div>
        
      </div>
      
      {/* Stay Details Card */}
      <div className="booking-section-card">
        <h3 className="section-title">
          Stay Details
          <span className="section-title-hindi">ठहरने का विवरण</span>
        </h3>
        
        <div className="stay-dates-row">
          <div className="stay-date-item">
            <span className="date-label">Check-in <span className="label-hindi">चेक-इन</span></span>
            <span className="date-value">{formatDate(booking.checkIn)}</span>
            <span className="time-value">{booking.checkInTime}</span>
          </div>
          <div className="stay-date-divider">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
          <div className="stay-date-item">
            <span className="date-label">Check-out <span className="label-hindi">चेक-आउट</span></span>
            <span className="date-value">{formatDate(booking.checkOut)}</span>
            <span className="time-value">{booking.checkOutTime}</span>
          </div>
        </div>
        
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Room <span className="label-hindi">कमरा</span></span>
            <span className="info-value">{booking.roomName}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Property <span className="label-hindi">प्रॉपर्टी</span></span>
            <span className="info-value">{booking.propertyName}</span>
          </div>
        </div>
      </div>
      
      {/* Special Requests Card */}
      {booking.specialRequests && (
        <div className="booking-section-card">
          <h3 className="section-title">
            Special Requests
            <span className="section-title-hindi">विशेष अनुरोध</span>
          </h3>
          <p className="special-requests-text">{booking.specialRequests}</p>
        </div>
      )}
      
      {/* Payment Summary Card - Collapsible */}
      <div className="booking-section-card">
        <h3 className="section-title collapsible-title" onClick={() => setPaymentOpen(!paymentOpen)}>
          <span>
            Payment Summary
            <span className="section-title-hindi">भुगतान सारांश</span>
          </span>
          <svg
            width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className={`collapse-icon ${paymentOpen ? 'open' : ''}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </h3>

        {paymentOpen && (
          <>
            <div className="payment-info-grid">
              <div className="payment-row">
                <span className="payment-label">Total Amount <span className="label-hindi">कुल राशि</span></span>
                <span className="payment-value">Rs. {booking.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="payment-row">
                <span className="payment-label">Amount Paid <span className="label-hindi">भुगतान की गई राशि</span></span>
                <span className="payment-value">Rs. {booking.amountPaid.toLocaleString('en-IN')}</span>
              </div>
              <div className="payment-row total-row">
                <span className="payment-label">Balance Due <span className="label-hindi">शेष बकाया</span></span>
                <span className={`payment-value ${booking.totalAmount - booking.amountPaid > 0 ? 'due' : 'paid'}`}>
                  Rs. {(booking.totalAmount - booking.amountPaid).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className={`payment-status-badge ${booking.paymentStatus}`}>
              {booking.paymentStatus === 'paid' ? 'Fully Paid - पूर्ण भुगतान' : 'Payment Pending - भुगतान बाकी'}
            </div>
          </>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="booking-action-buttons">
        {/* Only allow check-in from pending check-in status */}
        {booking.status === 'checkin-pending' && (
          <button className="action-btn primary-btn" onClick={handleCheckIn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="8" cy="15" r="4" />
              <path d="M10.5 12.5L17 6" />
              <path d="M15 8l2-2" />
            </svg>
            Check-in Guest
            <span className="btn-hindi">मेहमान चेक-इन करें</span>
          </button>
        )}
        
        {/* Only allow check-out from pending check-out status (not early checkout) */}
        {booking.status === 'checkout-pending' && (
          <button className="action-btn primary-btn checkout-btn" onClick={handleCheckOut}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16,17 21,12 16,7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Check-out Guest
            <span className="btn-hindi">मेहमान चेक-आउट करें</span>
          </button>
        )}
        
        {/* Show info message for checked-in guests (not at checkout time yet) */}
        {booking.status === 'checked-in' && (
          <div className="action-info-message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>Check-out will be available on checkout date</span>
            <span className="info-hindi">चेक-आउट की तारीख पर चेक-आउट उपलब्ध होगा</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetailsPage;
