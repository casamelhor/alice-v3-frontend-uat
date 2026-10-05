"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCaretakerLanguage } from '@/context/CaretakerLanguageContext';
import toast, { Toaster } from 'react-hot-toast';
import { CaretakerReviewsAPI, CaretakerSendReminderAPI } from '@/services/caretakerProvider';

const StarRating = ({ rating }) => {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span 
          key={star} 
          className="star"
          style={{ color: star <= rating ? '#C4A35A' : '#ddd' }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const ReviewCard = ({ review, onSendReminder }) => {
  const { language } = useCaretakerLanguage();
  
  const formatDate = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const startDay = start.getDate();
    const endDay = end.getDate();
    const month = start.toLocaleString('en-US', { month: 'short' });
    const year = start.getFullYear();
    return `${startDay} ${month} - ${endDay} ${month}, ${year}`;
  };
  
  return (
    <div className="review-card">
      <div className="review-header">
        <div>
          <span className="review-status">
            {review.status === 'pending' ? (
              <>PENDING REVIEW पेंडिंग रिव्य</>
            ) : (
              <>COMPLETED पूरा हो गया</>
            )}
          </span>
        </div>
        <Image 
          src={review.guestImage || '/placeholder.svg?height=48&width=48'} 
          width={48} 
          height={48} 
          alt={review.guestName}
          className="review-avatar"
        />
      </div>
      
      <h4 className="review-guest-name">{review.guestName}</h4>
      <p className="review-meta">
        {formatDate(review.checkIn, review.checkOut)} | Booking id: {review.bookingId}
      </p>
      
      {review.status === 'completed' && (
        <>
          <div className="review-rating">
            <span className="rating-label">
              Overall rating <span className="rating-label-hindi">कुल रेटिंग</span>
            </span>
            <StarRating rating={review.rating} />
          </div>
          
          {review.reviewText && (
            <p className="review-text">{review.reviewText}</p>
          )}
          
          <div className="review-action">
            <button>Read Review</button>
          </div>
        </>
      )}
      
      {review.status === 'pending' && (
        <div className="review-action" style={{ borderTop: '1px solid rgba(70, 53, 39, 0.24)', paddingTop: '16px', marginTop: '16px' }}>
          <button 
            className="caretaker-btn-outline w-100"
            onClick={() => onSendReminder(review.id)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
            Send Reminder
          </button>
        </div>
      )}
    </div>
  );
};

const ReviewsPage = ({ selectedProperty }) => {
  const router = useRouter();
  const { language } = useCaretakerLanguage();
  const [activeTab, setActiveTab] = useState('pending');
  const [isLoading, setIsLoading] = useState(true);

  const [reviewsSummary, setReviewsSummary] = useState({
    overallRating: 0,
    totalReviews: 0
  });

  const [reviews, setReviews] = useState({
    pending: [],
    all: []
  });

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const propertyUid = selectedProperty?.uid || selectedProperty?.id;
        const response = await CaretakerReviewsAPI(null, propertyUid);
        if (response?.data?.success) {
          const data = response.data.response;
          setReviews({
            pending: data.pending || [],
            all: data.completed || []
          });
          if (data.summary) {
            setReviewsSummary({
              overallRating: data.summary.overall_rating || 0,
              totalReviews: data.summary.total_reviews || 0
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        toast.error('Failed to load reviews');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [selectedProperty]);
  
  const toHindiNumeral = (num) => {
    const hindiNumerals = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return String(num).split('').map(d => {
      if (d === '.') return '.';
      return hindiNumerals[parseInt(d)] || d;
    }).join('');
  };
  
  const handleSendReminder = async (bookingUid) => {
    try {
      const response = await CaretakerSendReminderAPI(bookingUid);
      if (response?.data?.success) {
        toast.success('Reminder sent successfully');
      } else {
        toast.error('Failed to send reminder');
      }
    } catch (error) {
      console.error('Failed to send reminder:', error);
      toast.error('Failed to send reminder');
    }
  };
  
  const currentReviews = activeTab === 'pending' ? reviews.pending : reviews.all;

  return (
    <div className="reviews-page">
      <Toaster position="top-right" />
      
      {/* Page Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => router.back()}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </button>
        <div className="page-title-group">
          <h1 className="page-main-title">Reviews</h1>
          <p className="page-title-hindi">रिव्युस</p>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="reviews-summary">
        <div className="summary-item">
          <div className="summary-value">
            {reviewsSummary.overallRating}
            <span className="summary-value-hindi">({toHindiNumeral(reviewsSummary.overallRating)})</span>
            <span className="star-icon">★</span>
          </div>
          <div className="summary-label">
            Overall rating
            <span className="summary-label-hindi">कुल रेटिंग</span>
          </div>
        </div>
        
        <div className="summary-item">
          <div className="summary-value">
            {reviewsSummary.totalReviews}
            <span className="summary-value-hindi">({toHindiNumeral(reviewsSummary.totalReviews)})</span>
          </div>
          <div className="summary-label">
            Total reviews
            <span className="summary-label-hindi">टोटल रिव्युस</span>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="reservation-tabs" style={{ marginBottom: '20px' }}>
        <button 
          className={`reservation-tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending reviews ({reviews.pending.length})
          <span className="tab-label-hindi">पेंडिंग रिव्युस ({toHindiNumeral(reviews.pending.length)})</span>
        </button>
        <button 
          className={`reservation-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All reviews ({reviews.all.length})
          <span className="tab-label-hindi">सभी रिव्युस ({toHindiNumeral(reviews.all.length)})</span>
        </button>
      </div>
      
      {/* Reviews List */}
      <div className="reviews-list">
        {isLoading ? (
          <div className="empty-state">
            <div className="loading-spinner" style={{ width: 40, height: 40 }}></div>
            <p className="empty-text">Loading...</p>
          </div>
        ) : currentReviews.length > 0 ? (
          currentReviews.map((review) => (
            <ReviewCard 
              key={review.id} 
              review={review}
              onSendReminder={handleSendReminder}
            />
          ))
        ) : (
          <div className="empty-state">
            <p className="empty-text">
              No reviews found.
              <span className="empty-text-hindi">कोई रिव्यू नहीं मिला</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
