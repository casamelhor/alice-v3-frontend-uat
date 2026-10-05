"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCaretakerLanguage } from '@/context/CaretakerLanguageContext';
import ReservationCard from './ReservationCard';
import { CaretakerCheckInsAPI, transformBookingForCard } from '@/services/caretakerProvider';

const CheckInsListPage = ({ selectedProperty }) => {
  const router = useRouter();
  const { language } = useCaretakerLanguage();
  const [checkIns, setCheckIns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCheckIns = async () => {
      setIsLoading(true);
      try {
        const propertyUid = selectedProperty?.uid || selectedProperty?.id;
        const response = await CaretakerCheckInsAPI(null, propertyUid);
        if (response?.data?.success) {
          const bookings = (response.data.response || []).map(transformBookingForCard);
          setCheckIns(bookings);
        }
      } catch (error) {
        console.error('Failed to fetch check-ins:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCheckIns();
  }, [selectedProperty]);

  return (
    <div className="checkins-list-page">
      {/* Page Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => router.back()}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </button>
        <div className="page-title-group">
          <h1 className="page-main-title">Check-ins Today</h1>
          <p className="page-title-hindi">चेक-इन्स आज</p>
        </div>
      </div>

      {/* Check-ins List */}
      <div className="reservation-list">
        {isLoading ? (
          <div className="empty-state">
            <div className="loading-spinner" style={{ width: 40, height: 40 }}></div>
            <p className="empty-text">Loading...</p>
          </div>
        ) : checkIns.length > 0 ? (
          checkIns.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
            />
          ))
        ) : (
          <div className="empty-state">
            <svg className="empty-icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="32" cy="20" r="10" />
              <path d="M16 52c0-8 8-12 16-12s16 4 16 12" />
            </svg>
            <p className="empty-text">
              No check-ins scheduled for today.
              <span className="empty-text-hindi">
                आज कोई चेक-इन नहीं है
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckInsListPage;
