"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCaretakerLanguage } from '@/context/CaretakerLanguageContext';
import ReservationCard from './ReservationCard';
import { CaretakerCheckOutsAPI, transformBookingForCard } from '@/services/caretakerProvider';

const CheckOutsListPage = ({ selectedProperty }) => {
  const router = useRouter();
  const { language } = useCaretakerLanguage();
  const [checkOuts, setCheckOuts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCheckOuts = async () => {
      setIsLoading(true);
      try {
        const propertyUid = selectedProperty?.uid || selectedProperty?.id;
        const response = await CaretakerCheckOutsAPI(null, propertyUid);
        if (response?.data?.success) {
          const bookings = (response.data.response || []).map(transformBookingForCard);
          setCheckOuts(bookings);
        }
      } catch (error) {
        console.error('Failed to fetch check-outs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCheckOuts();
  }, [selectedProperty]);

  return (
    <div className="checkouts-list-page">
      {/* Page Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => router.back()}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </button>
        <div className="page-title-group">
          <h1 className="page-main-title">Checkouts Today</h1>
          <p className="page-title-hindi">चेकआउट्स आज</p>
        </div>
      </div>

      {/* Checkouts List */}
      <div className="reservation-list">
        {isLoading ? (
          <div className="empty-state">
            <div className="loading-spinner" style={{ width: 40, height: 40 }}></div>
            <p className="empty-text">Loading...</p>
          </div>
        ) : checkOuts.length > 0 ? (
          checkOuts.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
            />
          ))
        ) : (
          <div className="empty-state">
            <svg className="empty-icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 52H12a4 4 0 0 1-4-4V16a4 4 0 0 1 4-4h8" />
              <polyline points="36,44 52,32 36,20" />
              <line x1="52" y1="32" x2="20" y2="32" />
            </svg>
            <p className="empty-text">
              No checkouts scheduled for today.
              <span className="empty-text-hindi">
                आज कोई चेकआउट नहीं है
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckOutsListPage;
