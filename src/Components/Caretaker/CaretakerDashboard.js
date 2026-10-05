"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCaretakerLanguage } from '@/context/CaretakerLanguageContext';
import ReservationCard from './ReservationCard';
import { CaretakerDashboardAPI, CaretakerCheckInsAPI, CaretakerCheckOutsAPI, CaretakerGuestsAPI, transformBookingForCard, mapBookingStatus } from '@/services/caretakerProvider';

// Stats Card Component
const StatCard = ({ icon, value, valueHi, label, labelHi, onClick }) => {
  return (
    <div className="stat-card" onClick={onClick} role="button" tabIndex={0}>
      <div className="stat-icon-value">
        <span className="stat-icon">{icon}</span>
        <span className="stat-value">
          {value}
          <span className="stat-value-hindi">({valueHi})</span>
        </span>
      </div>
      <div className="stat-label">
        {label}
        <span className="stat-label-hindi">{labelHi}</span>
      </div>
    </div>
  );
};

// Icons as SVG components
const KeyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="8" cy="15" r="4" />
    <path d="M10.5 12.5L17 6" />
    <path d="M15 8l2-2" />
    <path d="M17 6l2 2" />
  </svg>
);

const ExitIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16,17 21,12 16,7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const ChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="10" width="4" height="11" />
    <rect x="10" y="5" width="4" height="16" />
    <rect x="17" y="8" width="4" height="13" />
  </svg>
);

const StarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
);

// Alert Card Component
const NoShowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const AlertCard = ({ type, title, titleHi, items, onAction, actionLabel, actionLabelHi }) => {
  const alertClass = type === 'overdue-checkout' ? 'alert-critical' : 'alert-warning';

  return (
    <div className={`alert-card ${alertClass}`}>
      <div className="alert-header">
        <div className="alert-icon">
          <AlertIcon />
        </div>
        <div className="alert-title">
          <span className="title-en">{title}</span>
          <span className="title-hi">{titleHi}</span>
        </div>
        <span className="alert-count">{items.length}</span>
      </div>
      <div className="alert-items">
        {items.map((item, index) => (
          <div key={index} className={`alert-item ${item.priority === 'high' ? 'alert-item-high' : ''}`}>
            <div className="alert-item-info">
              <span className="guest-name">
                {item.guestName}
                {item.priority === 'high' && (
                  <span className="noshow-badge">
                    <NoShowIcon /> No-show risk
                  </span>
                )}
              </span>
              <span className="room-info">{item.roomName} | {item.propertyName}</span>
              {item.overdueTime && (
                <span className="overdue-time">
                  <ClockIcon /> {item.overdueTime}
                </span>
              )}
              {item.scheduledTime && (
                <span className={`scheduled-time ${item.priority === 'high' ? 'time-urgent' : ''}`}>
                  <ClockIcon /> {item.scheduledTime}
                </span>
              )}
            </div>
            <button
              className="alert-action-btn"
              onClick={() => onAction(item.id, type)}
            >
              {actionLabel}
              <span className="btn-hindi">{actionLabelHi}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const CaretakerDashboard = ({ selectedProperty }) => {
  const { t, bilingual, language } = useCaretakerLanguage();
  const [activeTab, setActiveTab] = useState('current');
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [stats, setStats] = useState({
    checkIns: 0,
    checkOuts: 0,
    occupancy: { current: 0, total: 0 },
    pendingReviews: 0
  });

  const [pendingCheckouts, setPendingCheckouts] = useState([]);
  const [pendingCheckins, setPendingCheckins] = useState([]);
  const [reservations, setReservations] = useState({
    current: [],
    upcoming: [],
    checkingOut: []
  });

  // Compute human-readable overdue duration
  const getOverdueLabel = (checkOutDate) => {
    if (!checkOutDate) return 'Due today - आज बकाया';
    const now = new Date();
    const coDate = new Date(checkOutDate);
    const diffMs = now - coDate;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays >= 2) return `Overdue by ${diffDays} days - ${diffDays} दिन से बकाया`;
    if (diffDays === 1) return `Overdue by 1 day - 1 दिन से बकाया`;
    if (diffHours >= 1) return `Overdue by ${diffHours} hr${diffHours > 1 ? 's' : ''} - ${diffHours} घंटे से बकाया`;
    return 'Due today - आज बकाया';
  };

  // Compute pending check-in label
  const getPendingCheckinLabel = (checkInDate, priority) => {
    if (!checkInDate) return 'Expected today - अपेक्षित आज';
    const now = new Date();
    const ciDate = new Date(checkInDate);
    const diffMs = now - ciDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffDays >= 2) return `No-show risk · ${diffDays} days overdue - नो-शो जोखिम · ${diffDays} दिन बकाया`;
    if (diffDays === 1) return `No-show risk · 1 day overdue - नो-शो जोखिम · 1 दिन बकाया`;
    if (diffHours >= 1) return `Expected ${diffHours} hr${diffHours > 1 ? 's' : ''} ago - ${diffHours} घंटे पहले अपेक्षित`;
    return 'Expected today - अपेक्षित आज';
  };

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoadingData(true);
      try {
        const propertyUid = selectedProperty?.uid || selectedProperty?.id;

        // Fetch dashboard stats + check-ins + check-outs + current guests in parallel
        const [dashRes, checkInsRes, checkOutsRes, guestsRes] = await Promise.all([
          CaretakerDashboardAPI(propertyUid),
          CaretakerCheckInsAPI(null, propertyUid),
          CaretakerCheckOutsAPI(null, propertyUid),
          CaretakerGuestsAPI(propertyUid),
        ]);

        // Dashboard stats
        if (dashRes?.data?.success) {
          const data = dashRes.data.response;
          setStats({
            checkIns: data.stats?.check_ins_today || 0,
            checkOuts: data.stats?.check_outs_today || 0,
            occupancy: {
              current: data.stats?.occupancy?.current || 0,
              total: data.stats?.occupancy?.total || 0,
            },
            pendingReviews: data.stats?.pending_reviews || 0,
          });

          // Alerts — backend returns traveler__first_name, traveler__last_name, property__property_name, room__room_name
          const overdueCheckouts = (data.alerts?.overdue_checkouts || []).map(item => ({
            id: item.uid,
            guestName: `${item.traveler__first_name || ''} ${item.traveler__last_name || ''}`.trim() || item.guest_name || 'Unknown',
            roomName: item.room__room_name || item.room_name || '',
            propertyName: item.property__property_name || item.property_name || '',
            checkOutDate: item.check_out_date,
            overdueTime: getOverdueLabel(item.check_out_date),
            bookingId: item.booking_number,
          }));
          setPendingCheckouts(overdueCheckouts);

          const pendingCheckinAlerts = (data.alerts?.pending_checkins || []).map(item => ({
            id: item.uid,
            guestName: `${item.traveler__first_name || ''} ${item.traveler__last_name || ''}`.trim() || item.guest_name || 'Unknown',
            roomName: item.room__room_name || item.room_name || '',
            propertyName: item.property__property_name || item.property_name || '',
            checkInDate: item.check_in_date,
            priority: item.priority || 'normal',
            scheduledTime: getPendingCheckinLabel(item.check_in_date, item.priority),
            bookingId: item.booking_number,
          }));
          setPendingCheckins(pendingCheckinAlerts);
        }

        // Check-ins → upcoming reservations
        if (checkInsRes?.data?.success) {
          const upcoming = (checkInsRes.data.response || []).map(transformBookingForCard);
          setReservations(prev => ({ ...prev, upcoming }));
        }

        // Guests API → all active guests (Checked In + Check-out-Pending)
        // Both statuses count as "current stays" — guest is physically present until checked out
        if (guestsRes?.data?.success) {
          const allGuests = (guestsRes.data.response || []).map(g => ({
            id: g.uid,
            guestName: g.guest_name || 'Unknown',
            roomName: g.room_name || '',
            propertyName: g.property_name || '',
            checkIn: g.check_in_date?.split('T')[0],
            checkOut: g.check_out_date?.split('T')[0],
            status: mapBookingStatus(g.booking_status),
            bookingNumber: g.booking_number,
            guestImage: g.guest_image || '/placeholder.svg?height=60&width=60',
          }));
          setReservations(prev => ({
            ...prev,
            current: allGuests,
            checkingOut: checkOutsRes?.data?.success
              ? (checkOutsRes.data.response || []).map(transformBookingForCard)
              : [],
          }));
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchDashboard();
  }, [selectedProperty]);

  // Handle alert actions
  const handleAlertAction = (id, type) => {
    if (type === 'overdue-checkout') {
      window.location.href = `/caretaker/booking/${id}?action=checkout`;
    } else if (type === 'pending-checkin') {
      window.location.href = `/caretaker/booking/${id}?action=checkin`;
    }
  };

  // Calculate total alerts for notification badge
  const totalAlerts = pendingCheckouts.length + pendingCheckins.length;
  
  const tabs = [
    { id: 'current', labelEn: 'Current stays', labelHi: 'करंट स्टेज़', count: reservations.current.length },
    { id: 'upcoming', labelEn: 'Upcoming', labelHi: 'अपकमिंग', count: reservations.upcoming.length },
    { id: 'checkingOut', labelEn: 'Checking out', labelHi: 'चेकिंग आउट', count: reservations.checkingOut.length }
  ];
  
  const currentReservations = reservations[activeTab] || [];
  
  // Convert number to Hindi numerals
  const toHindiNumeral = (num) => {
    const hindiNumerals = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return String(num).split('').map(d => hindiNumerals[parseInt(d)] || d).join('');
  };

  return (
    <div className="caretaker-dashboard">
      {/* Page Title */}
      <div className="dashboard-title-section">
        <h1 className="section-title">
          Today <span className="today-date">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          <span className="section-title-hindi">आज</span>
        </h1>
      </div>
      
      {/* Critical Alerts Section */}
      {(pendingCheckouts.length > 0 || pendingCheckins.length > 0) && (
        <div className="alerts-section">
          <div className="alerts-header">
            <h2 className="alerts-title">
              <AlertIcon />
              Action Required
              <span className="alerts-title-hindi">कार्रवाई आवश्यक</span>
            </h2>
            <span className="alerts-badge">{totalAlerts}</span>
          </div>
          
          {/* Overdue Checkouts - Critical */}
          {pendingCheckouts.length > 0 && (
            <AlertCard
              type="overdue-checkout"
              title="Pending Checkouts"
              titleHi="बकाया चेकआउट"
              items={pendingCheckouts}
              onAction={handleAlertAction}
              actionLabel="Checkout"
              actionLabelHi="चेकआउट"
            />
          )}
          
          {/* Pending Check-ins - Warning */}
          {pendingCheckins.length > 0 && (
            <AlertCard
              type="pending-checkin"
              title="Pending Check-ins (No-show risk)"
              titleHi="बकाया चेक-इन (नो-शो जोखिम)"
              items={pendingCheckins}
              onAction={handleAlertAction}
              actionLabel="Check-in"
              actionLabelHi="चेक-इन"
            />
          )}
          
          <p className="alerts-info-text">
            Rooms cannot be assigned to new guests until previous guests are checked out.
            <span className="info-hindi">पिछले मेहमानों के चेकआउट होने तक कमरे नए मेहमानों को नहीं दिए जा सकते।</span>
          </p>
        </div>
      )}
      
      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          icon={<KeyIcon />}
          value={stats.checkIns}
          valueHi={toHindiNumeral(stats.checkIns)}
          label="Check-ins"
          labelHi="चेक-इन्स"
          onClick={() => window.location.href = '/caretaker/checkins'}
        />
        <StatCard
          icon={<ExitIcon />}
          value={stats.checkOuts}
          valueHi={toHindiNumeral(stats.checkOuts)}
          label="Checkouts"
          labelHi="चेकआउट्स"
          onClick={() => window.location.href = '/caretaker/checkouts'}
        />
        <StatCard
          icon={<ChartIcon />}
          value={`${stats.occupancy.current}/${stats.occupancy.total}`}
          valueHi={`${toHindiNumeral(stats.occupancy.current)}/${toHindiNumeral(stats.occupancy.total)}`}
          label="Room Occupancy"
          labelHi="रूम ऑक्यूपेंसी"
        />
        <StatCard
          icon={<StarIcon />}
          value={stats.pendingReviews}
          valueHi={toHindiNumeral(stats.pendingReviews)}
          label="Pending reviews"
          labelHi="पेंडिंग रिव्युस"
          onClick={() => window.location.href = '/caretaker/reviews'}
        />
      </div>
      
      {/* Reservations Section */}
      <div className="reservations-section">
        <h2 className="section-title">
          Your reservations
          <span className="section-title-hindi">आपके रिजर्वेशन</span>
        </h2>
        
        {/* Tabs */}
        <div className="reservation-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`reservation-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.labelEn} ({tab.count})
              <span className="tab-label-hindi">
                {tab.labelHi} ({toHindiNumeral(tab.count)})
              </span>
            </button>
          ))}
        </div>
        
        {/* Reservation List */}
        <div className="reservation-list">
          {currentReservations.length > 0 ? (
            currentReservations.map((reservation) => (
              <ReservationCard 
                key={reservation.id} 
                reservation={reservation}
                onCheckIn={(id) => console.log('Check-in:', id)}
                onCheckOut={(id) => console.log('Check-out:', id)}
                onManage={(id) => console.log('Manage:', id)}
              />
            ))
          ) : (
            <div className="empty-state">
              <svg className="empty-icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="8" y="12" width="48" height="40" rx="4" />
                <path d="M8 24h48" />
                <path d="M24 12v-4" />
                <path d="M40 12v-4" />
              </svg>
              <p className="empty-text">
                {`You don't have any guests staying with you right now.`}
                <span className="empty-text-hindi">
                  इस समय आपके साथ कोई मेहमान नहीं रह रहा है
                </span>
              </p>
            </div>
          )}
        </div>
        
        {/* All Reservations Link */}
        {(reservations.current.length + reservations.upcoming.length + reservations.checkingOut.length) > 0 && (
          <Link href="/caretaker/reservations" className="all-reservations-link">
            All Reservations ({reservations.current.length + reservations.upcoming.length + reservations.checkingOut.length})
            {' '}
            <span className="link-hindi">
              सभी बुकिंग ({toHindiNumeral(reservations.current.length + reservations.upcoming.length + reservations.checkingOut.length)})
            </span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default CaretakerDashboard;
