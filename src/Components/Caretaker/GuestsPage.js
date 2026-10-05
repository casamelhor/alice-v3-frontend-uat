"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCaretakerLanguage } from '@/context/CaretakerLanguageContext';
import { CaretakerGuestsAPI, transformBookingForCard } from '@/services/caretakerProvider';

const GuestsPage = ({ selectedProperty }) => {
  const router = useRouter();
  const { t, language } = useCaretakerLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [guests, setGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGuests = async () => {
      setIsLoading(true);
      try {
        const propertyUid = selectedProperty?.uid || selectedProperty?.id;
        const response = await CaretakerGuestsAPI(propertyUid);
        if (response?.data?.success) {
          const bookings = (response.data.response || []).map(transformBookingForCard);
          setGuests(bookings);
        }
      } catch (error) {
        console.error('Failed to fetch guests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuests();
  }, [selectedProperty]);
  
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };
  
  const formatDateRange = (checkIn, checkOut) => {
    return `${formatDate(checkIn)} - ${formatDate(checkOut)}`;
  };
  
  const handleViewBooking = (bookingId) => {
    router.push(`/caretaker/booking/${bookingId}`);
  };

  const handleCheckOut = (bookingId) => {
    router.push(`/caretaker/checkout/${bookingId}`);
  };

  const getActionLabel = (guest) => {
    if (guest.status !== 'checkout-pending') return null;
    const now = new Date();
    const coDate = new Date(guest.checkOut);
    const diffMs = now - coDate;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays >= 2) return `Overdue by ${diffDays} days`;
    if (diffDays === 1) return `Overdue by 1 day`;
    if (diffHours >= 1) return `Overdue by ${diffHours} hr${diffHours > 1 ? 's' : ''}`;
    return 'Due today';
  };
  
  const filteredGuests = guests.filter(guest =>
    (guest.guestName || guest.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (guest.bookingNumber || guest.bookingId || '').includes(searchQuery)
  );

  return (
    <div className="guests-page">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">
            {t('guests')}
            <span className="page-title-hindi">
              {language === 'en' ? 'मेहमान' : ''}
            </span>
          </h1>
        </div>
        
        {/* Search Bar */}
        <div className="guests-search-bar">
          <div className="search-input-wrapper">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="search-icon">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder={language === 'en' ? 'Search by name or booking ID - नाम या बुकिंग आईडी से खोजें' : 'नाम या बुकिंग आईडी से खोजें'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Guest Count */}
        <div className="guests-count-bar">
          <span className="guests-count">
            {filteredGuests.length} {filteredGuests.length === 1 ? 'guest' : 'guests'} staying
            <span className="guests-count-hindi"> - {filteredGuests.length} मेहमान रह रहे हैं</span>
          </span>
        </div>
        
        {/* Guest List */}
        <div className="guests-list">
          {isLoading ? (
            <div className="empty-state">
              <div className="loading-spinner" style={{ width: 40, height: 40 }}></div>
              <p className="empty-text">Loading...</p>
            </div>
          ) : filteredGuests.length > 0 ? (
            filteredGuests.map(guest => (
              <div key={guest.id} className="guest-card">
                {/* Guest Header */}
                <div className="guest-card-header">
                  <Image
                    src={guest.guestImage || '/placeholder.svg?height=56&width=56'}
                    width={56}
                    height={56}
                    alt={guest.guestName || guest.name}
                    className="guest-card-avatar"
                  />
                  <div className="guest-card-info">
                    <h3 className="guest-card-name">{guest.guestName || guest.name}</h3>
                    <p className="guest-card-dates">{formatDateRange(guest.checkIn, guest.checkOut)}</p>
                    <div className="guest-card-meta">
                      {guest.adults_count && (
                        <>
                          <span className="meta-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            {guest.adults_count} {guest.adults_count === 1 ? 'guest' : 'guests'}
                          </span>
                          <span className="meta-separator">|</span>
                        </>
                      )}
                      <span className="meta-item">#{guest.bookingNumber || guest.bookingId}</span>
                    </div>
                  </div>
                  <span className={`guest-status-badge ${guest.status}`}>
                    {guest.status === 'checked-in' ? (
                      <>
                        <span>Checked In</span>
                        <span className="status-hindi">चेक इन</span>
                      </>
                    ) : guest.status === 'checkout-pending' ? (
                      <>
                        <span>Check-out Pending</span>
                        <span className="status-hindi">चेक-आउट बाकी</span>
                      </>
                    ) : (
                      <>
                        <span>Checked In</span>
                        <span className="status-hindi">चेक इन</span>
                      </>
                    )}
                  </span>
                </div>
                
                {/* Room Info */}
                <div className="guest-card-room">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9,22 9,12 15,12 15,22" />
                  </svg>
                  <span>{guest.roomName}</span>
                  {guest.bedName && (
                    <>
                      <span className="separator">|</span>
                      <span>{guest.bedName}</span>
                    </>
                  )}
                  <span className="separator">|</span>
                  <span className="property-name">{guest.propertyName}</span>
                </div>
                
                {/* Action Required Banner */}
                {guest.status === 'checkout-pending' && (
                  <div className="guest-action-required">
                    <div className="action-required-info">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <span className="action-label">
                        {getActionLabel(guest)}
                        <span className="action-label-hindi"> - चेक-आउट बाकी</span>
                      </span>
                    </div>
                    <button
                      className="action-checkout-btn"
                      onClick={() => handleCheckOut(guest.id)}
                    >
                      Check Out <span className="btn-hindi">चेक-आउट</span>
                    </button>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="guest-card-actions">
                  <button
                    className="guest-action-btn view-btn"
                    onClick={() => handleViewBooking(guest.id)}
                  >
                    <span>View Booking</span>
                    <span className="btn-hindi">बुकिंग देखें</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <p className="empty-text">
                {searchQuery ? (
                  <>
                    No guests found matching your search
                    <span className="empty-text-hindi">आपकी खोज से मेल खाने वाला कोई मेहमान नहीं मिला</span>
                  </>
                ) : (
                  <>
                    {t('noGuestsStaying')}
                    <span className="empty-text-hindi">इस समय आपके साथ कोई मेहमान नहीं रह रहा है</span>
                  </>
                )}
              </p>
            </div>
          )}
        </div>
    </div>
  );
};

export default GuestsPage;
