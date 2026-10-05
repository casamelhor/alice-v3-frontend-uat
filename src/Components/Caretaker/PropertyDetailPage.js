"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCaretakerLanguage } from '@/context/CaretakerLanguageContext';
import { CaretakerPropertyDetailAPI } from '@/services/caretakerProvider';
import Image from 'next/image';
import { ChevronLeft, Building2, Users, Calendar, MapPin, BedDouble, Home } from 'lucide-react';

const PropertyDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { t, language } = useCaretakerLanguage();
  const propertyId = params?.id;

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) return;
      setLoading(true);
      try {
        const response = await CaretakerPropertyDetailAPI(propertyId);
        if (response?.data?.success) {
          setProperty(response.data.response);
        }
      } catch (error) {
        console.error('Failed to fetch property details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [propertyId]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Checked In': return 'room-status-occupied';
      case 'Check-out-Pending': return 'room-status-checkout';
      default: return 'room-status-occupied';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'Checked In': return { en: 'Occupied', hi: 'भरा हुआ' };
      case 'Check-out-Pending': return { en: 'Checkout Pending', hi: 'चेक-आउट बाकी' };
      default: return { en: status, hi: '' };
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="property-detail-page">
        <div className="loading-state"><div className="loading-spinner"></div></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="property-detail-page">
        <div className="error-state">
          <p>Property not found</p>
          <p className="error-hindi">प्रॉपर्टी नहीं मिली</p>
          <button className="btn-back" onClick={() => router.back()}>Go Back - वापस जाएं</button>
        </div>
      </div>
    );
  }

  return (
    <div className="property-detail-page">
      {/* Back Header */}
      <div className="page-back-header">
        <button className="back-btn" onClick={() => router.back()}>
          <ChevronLeft size={24} />
        </button>
        <div className="page-header-title">
          <h1>{property.property_name}</h1>
          <span className="page-header-subtitle">
            <MapPin size={14} />
            {property.city}, {property.state}
          </span>
        </div>
      </div>

      {/* Property Cover Image */}
      {property.cover_photo_url && (
        <div className="property-cover-image">
          <Image
            src={property.cover_photo_url}
            width={500}
            height={200}
            alt={property.property_name}
            className="cover-img"
          />
        </div>
      )}

      {/* Stats Cards */}
      <div className="property-stats-row">
        <div className="property-stat-card">
          <Home size={20} className="stat-icon" />
          <div className="stat-content">
            <span className="stat-number">{property.occupied_rooms}/{property.total_rooms}</span>
            <span className="stat-label">Rooms <span className="label-hindi">कमरे</span></span>
          </div>
        </div>
        <div className="property-stat-card">
          <Users size={20} className="stat-icon" />
          <div className="stat-content">
            <span className="stat-number">{property.current_guests}</span>
            <span className="stat-label">Guests <span className="label-hindi">मेहमान</span></span>
          </div>
        </div>
        <div className="property-stat-card">
          <Calendar size={20} className="stat-icon" />
          <div className="stat-content">
            <span className="stat-number">{property.upcoming_checkins}</span>
            <span className="stat-label">Upcoming <span className="label-hindi">आने वाले</span></span>
          </div>
        </div>
      </div>

      {/* Rooms List */}
      <div className="property-rooms-section">
        <h2 className="section-heading">
          Rooms
          <span className="section-heading-hindi">कमरे</span>
        </h2>

        <div className="rooms-list">
          {property.rooms.map((room) => (
            <div key={room.uid} className={`room-card ${room.is_occupied ? 'occupied' : 'vacant'}`}>
              {room.photo_url && (
                <div className="room-card-image">
                  <Image
                    src={room.photo_url}
                    width={400}
                    height={140}
                    alt={room.room_name}
                    className="room-img"
                  />
                </div>
              )}
              <div className="room-card-header">
                <div className="room-name-row">
                  <BedDouble size={18} className="room-icon" />
                  <h3 className="room-name">{room.room_name}</h3>
                </div>
                <span className={`room-type-badge ${room.room_type === 'Twin-Sharing' ? 'shared' : 'private'}`}>
                  {room.room_type === 'Twin-Sharing' ? 'Shared' : 'Private'}
                </span>
              </div>

              {room.room_type === 'Twin-Sharing' && room.beds && room.beds.length > 0 && (
                <div className="room-beds-info">
                  <span className="beds-count">{room.beds.length} beds</span>
                  <span className="beds-count-hindi">बेड</span>
                  {room.gender_lock && (
                    <span className={`gender-lock-badge ${room.gender_lock.toLowerCase()}`}>
                      {room.gender_lock === 'Female' ? '♀' : room.gender_lock === 'Male' ? '♂' : '⚥'}
                      {' '}{room.gender_lock === 'Female' ? 'Female Only' : room.gender_lock === 'Male' ? 'Male Only' : 'Mixed'}
                      <span className="badge-hindi">
                        {room.gender_lock === 'Female' ? 'केवल महिला' : room.gender_lock === 'Male' ? 'केवल पुरुष' : 'मिश्रित'}
                      </span>
                    </span>
                  )}
                </div>
              )}

              {room.is_occupied && room.current_guests?.length > 0 ? (
                <div className="room-guests-list">
                  {room.current_guests.map((guest, idx) => (
                    <div key={guest.booking_uid} className="room-guest-info">
                      <div className="guest-header-row">
                        <div className={`room-occupancy-badge ${getStatusClass(guest.status)}`}>
                          {getStatusLabel(guest.status).en}
                          <span className="badge-hindi">{getStatusLabel(guest.status).hi}</span>
                        </div>
                        {guest.bed_index !== null && guest.bed_index !== undefined && room.beds?.[guest.bed_index] && (
                          <span className="bed-label">
                            {room.beds[guest.bed_index].name}
                          </span>
                        )}
                      </div>
                      <div className="guest-details">
                        <span className="guest-name">{guest.guest_name}</span>
                        <span className="guest-dates">
                          {formatDate(guest.check_in_date)} - {formatDate(guest.check_out_date)}
                        </span>
                      </div>
                      <button
                        className="room-view-booking-btn"
                        onClick={() => router.push(`/caretaker/booking/${guest.booking_uid}`)}
                      >
                        View Booking <span className="btn-hindi">बुकिंग देखें</span>
                      </button>
                      {idx < room.current_guests.length - 1 && <hr className="guest-divider" />}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="room-vacant-info">
                  <span className="vacant-badge">
                    Available <span className="badge-hindi">उपलब्ध</span>
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
