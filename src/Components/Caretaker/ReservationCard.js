"use client";
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCaretakerLanguage } from '@/context/CaretakerLanguageContext';

const ReservationCard = ({ reservation, onCheckIn, onCheckOut, onManage }) => {
  const router = useRouter();
  const { language } = useCaretakerLanguage();
  
  const formatDateRange = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    
    const startDay = start.getDate();
    const endDay = end.getDate();
    const startMonth = start.toLocaleString('en-US', { month: 'short' });
    const endMonth = end.toLocaleString('en-US', { month: 'short' });
    
    if (startMonth === endMonth) {
      return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
    }
    return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
  };
  
  const getStatusBadge = () => {
    switch (reservation.status) {
      case 'checkin-pending':
        return {
          className: 'status-checkin-pending',
          textEn: 'CHECK-IN PENDING',
          textHi: 'चेक-इन बाकी'
        };
      case 'checkout-pending':
        return {
          className: 'status-checkout-pending',
          textEn: 'CHECK-OUT PENDING',
          textHi: 'चेक-आउट बाकी'
        };
      case 'checking-out-today':
        return {
          className: 'status-checkout-today',
          textEn: 'CHECKING OUT TODAY',
          textHi: 'चेक आउट आज'
        };
      case 'checked-in':
        return {
          className: 'status-checked-in',
          textEn: 'CHECKED IN',
          textHi: 'चेक इन हो गया'
        };
      case 'arriving-soon':
        return {
          className: 'status-arriving',
          textEn: `ARRIVING IN`,
          textHi: 'पहुंचने',
          time: reservation.arrivingIn
        };
      case 'arriving-tomorrow':
        return {
          className: 'status-arriving',
          textEn: 'ARRIVING TOMORROW',
          textHi: 'कल आ रहा है'
        };
      case 'arriving-in-days':
        return {
          className: 'status-arriving',
          textEn: `ARRIVING IN ${reservation.arrivingInDays} DAYS`,
          textHi: `${reservation.arrivingInDays} दिनों में पहुँचना`
        };
      default:
        return null;
    }
  };
  
  const statusBadge = getStatusBadge();
  
  const handleCheckIn = () => {
    router.push(`/caretaker/checkin/${reservation.id}`);
  };
  
  const handleCheckOut = () => {
    router.push(`/caretaker/checkout/${reservation.id}`);
  };
  
  const handleManage = () => {
    router.push(`/caretaker/booking/${reservation.id}`);
  };
  
  // Only allow check-in from pending check-in status
  const showCheckInButton = reservation.status === 'checkin-pending';
  // Only allow check-out from pending check-out status (not early checkout)
  const showCheckOutButton = reservation.status === 'checkout-pending';

  return (
    <div className="reservation-card">
      {/* Status Badge */}
      {statusBadge && (
        <span className={`reservation-status-badge ${statusBadge.className}`}>
          {statusBadge.textEn} {statusBadge.time && <span className="arriving-time">{statusBadge.time}</span>}
          {' '}{statusBadge.textHi}
        </span>
      )}
      
      {/* Room Info */}
      <div className="reservation-room-info">
        <span>{reservation.roomName}</span>
        {reservation.bedType && (
          <>
            <span>|</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 9v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9" />
              <path d="M2 9V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4" />
              <path d="M2 13h20" />
            </svg>
            <span>{reservation.bedType}</span>
            <span>|</span>
          </>
        )}
        <span>{reservation.propertyName}</span>
      </div>
      
      {/* Guest Info */}
      <div className="reservation-guest-row">
        <div className="guest-info">
          <div className="guest-name">{reservation.guestName}</div>
          <div className="guest-dates">{formatDateRange(reservation.checkIn, reservation.checkOut)}</div>
        </div>
        <Image 
          src={reservation.guestImage || '/placeholder.svg?height=48&width=48'} 
          width={48} 
          height={48} 
          alt={reservation.guestName}
          className="guest-avatar"
        />
      </div>
      
      {/* Action Buttons */}
      <div className="reservation-actions">
        {showCheckInButton && (
          <button className="action-btn btn-checkin" onClick={handleCheckIn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="8" cy="15" r="4" />
              <path d="M10.5 12.5L17 6" />
              <path d="M15 8l2-2" />
            </svg>
            Check-in
          </button>
        )}
        
        {showCheckOutButton && (
          <button className="action-btn btn-checkout" onClick={handleCheckOut}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16,17 21,12 16,7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Checkout
          </button>
        )}
        
        <button className="action-btn btn-manage" onClick={handleManage}>
          Manage
        </button>
      </div>
    </div>
  );
};

export default ReservationCard;
