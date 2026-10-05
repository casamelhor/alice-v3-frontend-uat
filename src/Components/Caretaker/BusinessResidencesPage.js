"use client";
import React, { useState, useEffect } from 'react';
import { useCaretakerLanguage } from '@/context/CaretakerLanguageContext';
import { ChevronLeft, Building2, Users, Calendar, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CaretakerPropertiesAPI } from '@/services/caretakerProvider';

const BusinessResidencesPage = () => {
  const { t, language } = useCaretakerLanguage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [businessResidences, setBusinessResidences] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const response = await CaretakerPropertiesAPI();
        if (response?.data?.success) {
          const props = (response.data.response || []).map(p => ({
            id: p.uid,
            name: p.property_name,
            location: `${p.city || ''}, ${p.state || ''}`.replace(/, $/, ''),
            totalRooms: p.total_rooms || 0,
            occupiedRooms: p.occupied_rooms || 0,
            currentGuests: p.current_guests || 0,
            upcomingCheckIns: p.upcoming_checkins || 0,
          }));
          setBusinessResidences(props);
        }
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, []);

  return (
    <div className="page-container business-residences-page">
      {/* Page Header */}
      <div className="page-header-with-back">
        <button 
          className="back-btn"
          onClick={() => router.back()}
          aria-label="Go back"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="page-title-section">
          <h1 className="page-title">
            Business Residences
            <span className="page-title-hindi">बिजनेस रेजिडेंस</span>
          </h1>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="br-summary-stats">
        <div className="br-stat-item">
          <div className="br-stat-value">
            {businessResidences.length}
            <span className="br-stat-value-hindi">({businessResidences.length})</span>
          </div>
          <div className="br-stat-label">
            Properties
            <span className="br-stat-label-hindi">प्रॉपर्टीज</span>
          </div>
        </div>
        <div className="br-stat-item">
          <div className="br-stat-value">
            {businessResidences.reduce((acc, br) => acc + br.totalRooms, 0)}
            <span className="br-stat-value-hindi">
              ({businessResidences.reduce((acc, br) => acc + br.totalRooms, 0)})
            </span>
          </div>
          <div className="br-stat-label">
            Total Rooms
            <span className="br-stat-label-hindi">कुल कमरे</span>
          </div>
        </div>
        <div className="br-stat-item">
          <div className="br-stat-value">
            {businessResidences.reduce((acc, br) => acc + br.currentGuests, 0)}
            <span className="br-stat-value-hindi">
              ({businessResidences.reduce((acc, br) => acc + br.currentGuests, 0)})
            </span>
          </div>
          <div className="br-stat-label">
            Guests
            <span className="br-stat-label-hindi">मेहमान</span>
          </div>
        </div>
      </div>

      {/* Business Residences List */}
      <div className="br-list">
        {businessResidences.map((br) => (
          <div key={br.id} className="br-card">
            <div className="br-card-header">
              <div className="br-icon">
                <Building2 size={24} />
              </div>
              <div className="br-info">
                <h3 className="br-name">{br.name}</h3>
                <p className="br-location">
                  <MapPin size={14} />
                  {br.location}
                </p>
              </div>
            </div>
            
            <div className="br-card-stats">
              <div className="br-card-stat">
                <span className="stat-icon">
                  <Building2 size={16} />
                </span>
                <span className="stat-text">
                  {br.occupiedRooms}/{br.totalRooms} Rooms
                  <span className="stat-text-hindi">कमरे</span>
                </span>
              </div>
              <div className="br-card-stat">
                <span className="stat-icon">
                  <Users size={16} />
                </span>
                <span className="stat-text">
                  {br.currentGuests} Guests
                  <span className="stat-text-hindi">मेहमान</span>
                </span>
              </div>
              <div className="br-card-stat">
                <span className="stat-icon">
                  <Calendar size={16} />
                </span>
                <span className="stat-text">
                  {br.upcomingCheckIns} Upcoming
                  <span className="stat-text-hindi">आने वाले</span>
                </span>
              </div>
            </div>

            <button className="br-view-btn" onClick={() => router.push(`/caretaker/property/${br.id}`)}>
              View Details
              <span className="btn-hindi">विवरण देखें</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessResidencesPage;
