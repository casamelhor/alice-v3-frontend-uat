"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCaretakerLanguage } from '@/context/CaretakerLanguageContext';
import { CaretakerCalendarAPI, mapBookingStatus } from '@/services/caretakerProvider';

// Icons
const ChevronLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15,18 9,12 15,6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9,6 15,12 9,18" />
  </svg>
);

const KeyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="8" cy="15" r="4" />
    <path d="M10.5 12.5L17 6" />
  </svg>
);

const ExitIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16,17 21,12 16,7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const CalendarPage = ({ selectedProperty }) => {
  const router = useRouter();
  const { t, language } = useCaretakerLanguage();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [propertyStats, setPropertyStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCalendarBookings = async () => {
      setIsLoading(true);
      try {
        const propertyUid = selectedProperty?.uid || selectedProperty?.id;
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const monthParam = `${year}-${month}`;
        const response = await CaretakerCalendarAPI(monthParam, propertyUid);
        if (response?.data?.success) {
          const data = response.data.response;
          const rawBookings = data?.bookings || data || [];
          const mapped = (Array.isArray(rawBookings) ? rawBookings : []).map(booking => ({
            id: booking.uid,
            guestName: booking.guest_name,
            roomName: booking.room_name,
            roomUid: booking.room_uid,
            roomType: booking.room_type,
            bedIndex: booking.bed,
            totalBedsInRoom: booking.total_beds_in_room || 1,
            propertyId: booking.property_uid,
            propertyName: booking.property_name,
            checkIn: booking.check_in_date,
            checkOut: booking.check_out_date,
            status: mapBookingStatus(booking.booking_status),
            bookingNumber: booking.booking_number,
            guestImage: '/placeholder.svg?height=40&width=40'
          }));
          setBookings(mapped);
          setPropertyStats(data?.properties || []);
        }
      } catch (error) {
        console.error('Failed to fetch calendar bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalendarBookings();
  }, [currentDate, selectedProperty]);
  
  // Month names in English and Hindi
  const monthNames = {
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    hi: ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर']
  };
  
  const weekDays = {
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    hi: ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि']
  };
  
  // Convert number to Hindi numerals
  const toHindiNumeral = (num) => {
    const hindiNumerals = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return String(num).split('').map(d => hindiNumerals[parseInt(d)] || d).join('');
  };
  
  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Get calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const startDay = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    
    const days = [];
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }
    
    return days;
  }, [currentDate]);
  
  // Get booking info for a specific date
  const getDateBookingInfo = (date) => {
    const dateStr = formatDate(date);
    
    let checkIns = [];
    let checkOuts = [];
    let occupied = [];
    
    bookings.forEach(booking => {
      if (booking.checkIn === dateStr) {
        checkIns.push(booking);
      }
      if (booking.checkOut === dateStr) {
        checkOuts.push(booking);
      }
      
      const checkInDate = new Date(booking.checkIn);
      const checkOutDate = new Date(booking.checkOut);
      
      if (date >= checkInDate && date < checkOutDate) {
        occupied.push(booking);
      }
    });
    
    return { checkIns, checkOuts, occupied };
  };
  
  // Build property totals from backend stats
  const properties = useMemo(() => {
    return propertyStats.map(p => ({
      id: p.property_uid,
      name: p.property_name,
      totalRooms: p.total_rooms,
      totalSharedBeds: p.total_shared_beds || 0,
    }));
  }, [propertyStats]);

  // Get availability status for a date (property-wise)
  // - Available Rooms = rooms with zero bookings on this date
  // - Available Beds = beds in shared rooms that are not booked (private rooms don't count as "beds")
  const getAvailabilityStatus = (date) => {
    // Init per-property tracking
    const propData = {};
    properties.forEach(prop => {
      propData[prop.id] = {
        propertyName: prop.name,
        totalRooms: prop.totalRooms,
        totalSharedBeds: prop.totalSharedBeds,
        occupiedRoomKeys: new Set(),     // rooms with at least 1 booking
        sharedBedBookings: 0,            // booked beds in shared rooms only
      };
    });

    // Scan bookings active on this date
    bookings.forEach(booking => {
      const checkInDate = new Date(booking.checkIn);
      const checkOutDate = new Date(booking.checkOut);
      if (!(date >= checkInDate && date < checkOutDate)) return;

      const pd = propData[booking.propertyId];
      if (!pd) return;

      const roomKey = booking.roomUid || booking.roomName;
      pd.occupiedRoomKeys.add(roomKey);

      // Only count bed-level for shared rooms
      if (booking.roomType === 'Twin-Sharing') {
        pd.sharedBedBookings++;
      }
    });

    // Calculate per-property availability
    let grandTotalRooms = 0;
    let grandTotalSharedBeds = 0;
    let grandAvailRooms = 0;
    let grandAvailSharedBeds = 0;

    const propsResult = {};
    Object.entries(propData).forEach(([id, pd]) => {
      const occupiedRooms = pd.occupiedRoomKeys.size;
      const availableRooms = Math.max(0, pd.totalRooms - occupiedRooms);
      const availableSharedBeds = Math.max(0, pd.totalSharedBeds - pd.sharedBedBookings);

      propsResult[id] = {
        propertyName: pd.propertyName,
        totalRooms: pd.totalRooms,
        totalSharedBeds: pd.totalSharedBeds,
        availableRooms,
        availableSharedBeds,
      };

      grandTotalRooms += pd.totalRooms;
      grandTotalSharedBeds += pd.totalSharedBeds;
      grandAvailRooms += availableRooms;
      grandAvailSharedBeds += availableSharedBeds;
    });

    const allFull = grandAvailRooms === 0 && grandAvailSharedBeds === 0;
    const allAvailable = grandAvailRooms === grandTotalRooms && grandAvailSharedBeds === grandTotalSharedBeds;

    return {
      properties: propsResult,
      totalRooms: grandTotalRooms,
      totalSharedBeds: grandTotalSharedBeds,
      availableRooms: grandAvailRooms,
      availableSharedBeds: grandAvailSharedBeds,
      status: grandTotalRooms === 0 ? 'available' : (allFull ? 'full' : (allAvailable ? 'available' : 'partial'))
    };
  };
  
  // Navigate months
  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };
  
  // Get selected date details
  const selectedDateInfo = selectedDate ? getDateBookingInfo(selectedDate) : null;
  
  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  // Format display date
  const formatDisplayDate = (date) => {
    const day = date.getDate();
    const month = monthNames[language][date.getMonth()];
    const year = date.getFullYear();
    
    if (language === 'hi') {
      return `${toHindiNumeral(day)} ${month}, ${toHindiNumeral(year)}`;
    }
    return `${day} ${month}, ${year}`;
  };

  return (
    <div className="calendar-page">
      {/* Page Title */}
      <div className="page-title-section">
        <h1 className="page-title">
          Calendar
          <span className="page-title-hindi">कैलेंडर</span>
        </h1>
      </div>
      
      {/* Month Navigation */}
      <div className="calendar-nav">
        <button className="nav-btn" onClick={goToPrevMonth} aria-label="Previous month">
          <ChevronLeftIcon />
        </button>
        <div className="current-month">
          <span className="month-name">
            {monthNames.en[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <span className="month-name-hindi">
            {monthNames.hi[currentDate.getMonth()]} {toHindiNumeral(currentDate.getFullYear())}
          </span>
        </div>
        <button className="nav-btn" onClick={goToNextMonth} aria-label="Next month">
          <ChevronRightIcon />
        </button>
      </div>
      
      {/* Today Button */}
      <div className="today-btn-wrapper">
        <button className="today-btn" onClick={goToToday}>
          Today <span className="btn-hindi">आज</span>
        </button>
      </div>
      
      {/* Calendar Legend */}
      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-dot checkin"></span>
          <span className="legend-label">Check-in <span className="legend-hindi">चेक-इन</span></span>
        </div>
        <div className="legend-item">
          <span className="legend-dot checkout"></span>
          <span className="legend-label">Check-out <span className="legend-hindi">चेक-आउट</span></span>
        </div>
        <div className="legend-item">
          <span className="legend-dot full"></span>
          <span className="legend-label">Fully Booked <span className="legend-hindi">पूर्ण बुक</span></span>
        </div>
        <div className="legend-item">
          <span className="legend-dot partial"></span>
          <span className="legend-label">Partial <span className="legend-hindi">आंशिक</span></span>
        </div>
        <div className="legend-item">
          <span className="legend-dot available"></span>
          <span className="legend-label">Available <span className="legend-hindi">उपलब्ध</span></span>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="calendar-container" style={{ position: 'relative' }}>
        {isLoading && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.7)', zIndex: 10 }}>
            <div className="loading-spinner" style={{ width: 40, height: 40 }}></div>
          </div>
        )}
        {/* Week Day Headers */}
        <div className="calendar-weekdays">
          {weekDays.en.map((day, index) => (
            <div key={day} className="weekday-header">
              <span className="weekday-en">{day}</span>
              <span className="weekday-hi">{weekDays.hi[index]}</span>
            </div>
          ))}
        </div>
        
        {/* Calendar Days */}
        <div className="calendar-grid">
          {calendarDays.map((dayObj, index) => {
            const bookingInfo = getDateBookingInfo(dayObj.date);
            const availability = getAvailabilityStatus(dayObj.date);
            const hasCheckIn = bookingInfo.checkIns.length > 0;
            const hasCheckOut = bookingInfo.checkOuts.length > 0;
            const isSelected = selectedDate && formatDate(dayObj.date) === formatDate(selectedDate);
            
            return (
              <button
                key={index}
                className={`calendar-day ${!dayObj.isCurrentMonth ? 'other-month' : ''} ${isToday(dayObj.date) ? 'today' : ''} ${isSelected ? 'selected' : ''} status-${availability.status}`}
                onClick={() => setSelectedDate(dayObj.date)}
              >
                <span className="day-number">{dayObj.date.getDate()}</span>
                {dayObj.isCurrentMonth && (
                  <div className="day-indicators">
                    {hasCheckIn && <span className="indicator checkin"></span>}
                    {hasCheckOut && <span className="indicator checkout"></span>}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Selected Date Details */}
      {selectedDate && (
        <div className="selected-date-details">
          <h3 className="details-title">
            {formatDisplayDate(selectedDate)}
            {isToday(selectedDate) && <span className="today-badge">Today आज</span>}
          </h3>
          
          {/* Availability Summary */}
          {(() => {
            const availability = getAvailabilityStatus(selectedDate);
            return (
              <div className="availability-summary">
                <div className={`availability-badge ${availability.status}`}>
                  {availability.status === 'full' && (
                    <>Fully Booked <span className="badge-hindi">पूर्ण बुक</span></>
                  )}
                  {availability.status === 'partial' && (
                    <>
                      {availability.availableRooms} room{availability.availableRooms !== 1 ? 's' : ''}
                      {availability.totalSharedBeds > 0 && <>, {availability.availableSharedBeds} bed{availability.availableSharedBeds !== 1 ? 's' : ''}</>}
                      {' '}free
                      <span className="badge-hindi">
                        {availability.availableRooms} कमरे{availability.totalSharedBeds > 0 ? `, ${availability.availableSharedBeds} बेड` : ''} उपलब्ध
                      </span>
                    </>
                  )}
                  {availability.status === 'available' && (
                    <>All rooms available <span className="badge-hindi">सभी उपलब्ध</span></>
                  )}
                </div>

                <div className="property-availability-list">
                  {Object.values(availability.properties).map((prop, idx) => (
                    <div key={idx} className="property-availability-item">
                      <span className="prop-name">{prop.propertyName}</span>
                      <span className={`prop-status ${prop.availableRooms === 0 && prop.availableSharedBeds === 0 ? 'full' : prop.availableRooms < prop.totalRooms ? 'partial' : 'available'}`}>
                        {prop.availableRooms}/{prop.totalRooms} rooms
                        {prop.totalSharedBeds > 0 && <>, {prop.availableSharedBeds}/{prop.totalSharedBeds} beds</>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
          
          {/* Check-ins */}
          {selectedDateInfo.checkIns.length > 0 && (
            <div className="details-section">
              <h4 className="details-section-title checkin">
                <KeyIcon /> Check-ins ({selectedDateInfo.checkIns.length})
                <span className="section-title-hindi">चेक-इन ({toHindiNumeral(selectedDateInfo.checkIns.length)})</span>
              </h4>
              {selectedDateInfo.checkIns.map(booking => (
                <div key={booking.id} className="booking-mini-card">
                  <img 
                    src={booking.guestImage} 
                    alt={booking.guestName}
                    className="guest-mini-avatar"
                  />
                  <div className="booking-mini-info">
                    <span className="guest-mini-name">{booking.guestName}</span>
                    <span className="room-mini-info">{booking.roomName} | {booking.propertyName}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Check-outs */}
          {selectedDateInfo.checkOuts.length > 0 && (
            <div className="details-section">
              <h4 className="details-section-title checkout">
                <ExitIcon /> Check-outs ({selectedDateInfo.checkOuts.length})
                <span className="section-title-hindi">चेक-आउट ({toHindiNumeral(selectedDateInfo.checkOuts.length)})</span>
              </h4>
              {selectedDateInfo.checkOuts.map(booking => (
                <div key={booking.id} className="booking-mini-card">
                  <img 
                    src={booking.guestImage} 
                    alt={booking.guestName}
                    className="guest-mini-avatar"
                  />
                  <div className="booking-mini-info">
                    <span className="guest-mini-name">{booking.guestName}</span>
                    <span className="room-mini-info">{booking.roomName} | {booking.propertyName}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Currently Occupied */}
          {selectedDateInfo.occupied.length > 0 && (
            <div className="details-section">
              <h4 className="details-section-title occupied">
                Occupied Rooms ({selectedDateInfo.occupied.length})
                <span className="section-title-hindi">ऑक्यूपाइड रूम ({toHindiNumeral(selectedDateInfo.occupied.length)})</span>
              </h4>
              {selectedDateInfo.occupied.map(booking => (
                <div key={booking.id} className="booking-mini-card">
                  <img 
                    src={booking.guestImage} 
                    alt={booking.guestName}
                    className="guest-mini-avatar"
                  />
                  <div className="booking-mini-info">
                    <span className="guest-mini-name">{booking.guestName}</span>
                    <span className="room-mini-info">{booking.roomName} | Until {new Date(booking.checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Empty State */}
          {selectedDateInfo.checkIns.length === 0 && 
           selectedDateInfo.checkOuts.length === 0 && 
           selectedDateInfo.occupied.length === 0 && (
            <div className="no-bookings-message">
              <p>No bookings for this date</p>
              <p className="message-hindi">इस तारीख के लिए कोई बुकिंग नहीं</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
