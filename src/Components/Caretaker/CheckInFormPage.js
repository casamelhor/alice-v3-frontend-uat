"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Spinner } from 'react-bootstrap';
import Image from 'next/image';
import { useCaretakerLanguage } from '@/context/CaretakerLanguageContext';
import { CaretakerBookingDetailAPI, CaretakerCheckInAPI } from '@/services/caretakerProvider';
import toast, { Toaster } from 'react-hot-toast';

const CheckInFormPage = () => {
  const router = useRouter();
  const params = useParams();
  const bookingId = params?.id;
  const { language, bilingual } = useCaretakerLanguage();
  const fileInputRef = useRef(null);
  const fileInputBackRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBooking, setIsLoadingBooking] = useState(true);
  const [bookingData, setBookingData] = useState(null);
  const [checkInSuccess, setCheckInSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nationalityType: 'Indian',
    idDocumentType: 'Aadhaar',
  });

  const [idDocFront, setIdDocFront] = useState(null);
  const [idDocBack, setIdDocBack] = useState(null);

  // Fetch booking details
  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) return;
      setIsLoadingBooking(true);
      try {
        const response = await CaretakerBookingDetailAPI(bookingId);
        if (response?.data?.success) {
          const b = response.data.response;
          setBookingData({
            id: b.uid,
            guestName: b.traveler?.full_name || 'Unknown',
            roomName: b.room?.room_name || '',
            bedIndex: b.bed,
            propertyName: b.property?.property_name || '',
            checkIn: b.check_in_date,
            checkOut: b.check_out_date,
            bookingNumber: b.booking_number,
            status: b.booking_status,
            totalNights: b.total_nights,
          });
        } else {
          toast.error('Failed to load booking details');
        }
      } catch (error) {
        console.error('Failed to fetch booking:', error);
        toast.error('Failed to load booking details');
      } finally {
        setIsLoadingBooking(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const formatDateRange = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return { dateText: '', nights: 0 };
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const startDay = start.getDate();
    const endDay = end.getDate();
    const month = start.toLocaleString('en-US', { month: 'short' });
    const year = start.getFullYear();

    return {
      dateText: `${startDay} - ${endDay} ${month}, ${year}`,
      nights
    };
  };

  const handleNationalityChange = (type) => {
    setFormData(prev => ({
      ...prev,
      nationalityType: type,
      idDocumentType: type === 'Indian' ? 'Aadhaar' : 'Passport'
    }));
    setIdDocFront(null);
    setIdDocBack(null);
  };

  const handleIdTypeChange = (type) => {
    setFormData(prev => ({ ...prev, idDocumentType: type }));
    setIdDocFront(null);
    setIdDocBack(null);
  };

  const handleFileUpload = (e, side) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPG, PNG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    const preview = URL.createObjectURL(file);

    if (side === 'front') {
      setIdDocFront({ file, preview });
    } else {
      setIdDocBack({ file, preview });
    }
  };

  const removeImage = (side) => {
    if (side === 'front') {
      setIdDocFront(null);
    } else {
      setIdDocBack(null);
    }
  };

  const handleSubmit = async () => {
    if (!idDocFront) {
      toast.error('Please upload ID document front image');
      return;
    }

    setIsLoading(true);

    try {
      const payload = new FormData();

      // Build formalities JSON
      const formalitiesData = {
        nationality_type: formData.nationalityType === 'Indian' ? 'Indian' : 'Foreign-National',
        id_document_type: formData.idDocumentType,
      };

      payload.append('formalities', JSON.stringify(formalitiesData));

      // Attach files
      if (formData.nationalityType === 'Indian') {
        payload.append('id_document_front_url', idDocFront.file);
        if (idDocBack) {
          payload.append('id_document_back_url', idDocBack.file);
        }
      } else {
        payload.append('passport_front_image_url', idDocFront.file);
        if (idDocBack) {
          payload.append('visa_image_url', idDocBack.file);
        }
      }

      const response = await CaretakerCheckInAPI(bookingId, payload);

      if (response?.data?.success) {
        setCheckInSuccess(true);
        toast.success('Check-in completed successfully! / \u091A\u0947\u0915-\u0907\u0928 \u0938\u092B\u0932!');
      } else {
        const errorMsg = response?.data?.response || 'Check-in failed';
        toast.error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
      }
    } catch (error) {
      console.error('Check-in error:', error);
      const errorMsg = error?.response?.data?.response || 'Failed to complete check-in';
      toast.error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
    } finally {
      setIsLoading(false);
    }
  };

  const idDocTypes = {
    Indian: [
      { value: 'Aadhaar', labelEn: 'Aadhaar', labelHi: '\u0906\u0927\u093E\u0930' },
      { value: 'Driving-Licence', labelEn: 'Driving Licence', labelHi: '\u0921\u094D\u0930\u093E\u0907\u0935\u093F\u0902\u0917 \u0932\u093E\u0907\u0938\u0947\u0902\u0938' },
      { value: 'Passport', labelEn: 'Passport', labelHi: '\u092A\u093E\u0938\u092A\u094B\u0930\u094D\u091F' }
    ],
    Foreign: [
      { value: 'Passport', labelEn: 'Passport', labelHi: '\u092A\u093E\u0938\u092A\u094B\u0930\u094D\u091F' }
    ]
  };

  // Success screen
  if (checkInSuccess) {
    return (
      <div className="checkin-form-page">
        <div className="checkin-success-screen">
          <div className="success-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22,4 12,14.01 9,11.01" />
            </svg>
          </div>
          <h2 className="success-title">
            Check-in Successful!
            <span className="success-title-hindi">{'\u091A\u0947\u0915-\u0907\u0928 \u0938\u092B\u0932!'}</span>
          </h2>
          <p className="success-guest-name">{bookingData?.guestName}</p>
          <p className="success-room-info">
            {bookingData?.roomName} | {bookingData?.propertyName}
          </p>
          <div className="success-actions">
            <Button
              className="caretaker-btn-primary w-100"
              onClick={() => router.push('/caretaker/dashboard')}
            >
              Back to Dashboard
              <span className="btn-hindi">{'\u0921\u0948\u0936\u092C\u094B\u0930\u094D\u0921 \u092A\u0930 \u0935\u093E\u092A\u0938 \u091C\u093E\u090F\u0902'}</span>
            </Button>
            <Button
              className="caretaker-btn-secondary w-100 mt-2"
              onClick={() => router.push(`/caretaker/booking/${bookingId}`)}
            >
              View Booking Details
              <span className="btn-hindi">{'\u092C\u0941\u0915\u093F\u0902\u0917 \u0935\u093F\u0935\u0930\u0923 \u0926\u0947\u0916\u0947\u0902'}</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoadingBooking) {
    return (
      <div className="checkin-form-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  // Booking not found
  if (!bookingData) {
    return (
      <div className="checkin-form-page">
        <div className="error-state">
          <p>Booking not found</p>
          <p className="error-hindi">{'\u092C\u0941\u0915\u093F\u0902\u0917 \u0928\u0939\u0940\u0902 \u092E\u093F\u0932\u0940'}</p>
          <button className="btn-back" onClick={() => router.back()}>
            Go Back - {'\u0935\u093E\u092A\u0938 \u091C\u093E\u090F\u0902'}
          </button>
        </div>
      </div>
    );
  }

  const { dateText, nights } = formatDateRange(bookingData.checkIn, bookingData.checkOut);

  return (
    <div className="checkin-form-page">
      <Toaster position="top-right" />

      {/* Page Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => router.back()}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </button>
        <div className="page-title-group">
          <h1 className="page-main-title">Check-in Formalities</h1>
          <p className="page-title-hindi">{'\u091A\u0947\u0915-\u0907\u0928 \u0914\u092A\u091A\u093E\u0930\u093F\u0915\u0924\u093E\u090F\u0902'}</p>
        </div>
      </div>

      {/* Booking Summary Card */}
      <div className="booking-summary-card">
        <p className="booking-guest-title">
          Booking for {bookingData.guestName}
          <span className="guest-title-hindi"> {'\u0915\u0947 \u0932\u093F\u090F \u092C\u0941\u0915\u093F\u0902\u0917'}</span>
        </p>

        <div className="booking-room-info">
          <span>{bookingData.roomName}</span>
          {bookingData.bedIndex !== null && bookingData.bedIndex !== undefined && (
            <>
              <span className="separator">|</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 9v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9" />
                <path d="M2 9V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4" />
              </svg>
              <span>Bed {bookingData.bedIndex === 0 ? 'A' : 'B'}</span>
            </>
          )}
          <span className="separator">|</span>
          <span className="status-badge">{bookingData.status}</span>
        </div>

        <hr />

        <div className="booking-meta">
          <div className="meta-item">
            <span className="meta-value">{dateText}</span>
            <span className="meta-sub">{nights} night{nights !== 1 ? 's' : ''}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Booking Id</span>
            <span className="meta-value">{bookingData.bookingNumber}</span>
            <button className="copy-btn" onClick={() => {
              navigator.clipboard.writeText(bookingData.bookingNumber);
              toast.success('Booking ID copied');
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="checkin-form-section">
        {/* Nationality Selection */}
        <div className="form-section">
          <h3 className="form-section-title">
            Guest Nationality
            <span className="title-hindi">{'\u092E\u0947\u0939\u092E\u093E\u0928 \u0930\u093E\u0937\u094D\u091F\u094D\u0930\u0940\u092F\u0924\u093E'}</span>
          </h3>

          <div className="radio-group">
            <label className={`radio-option ${formData.nationalityType === 'Indian' ? 'active' : ''}`}>
              <input
                type="radio"
                name="nationality"
                checked={formData.nationalityType === 'Indian'}
                onChange={() => handleNationalityChange('Indian')}
              />
              <span className="radio-checkmark"></span>
              Indian - {'\u092D\u093E\u0930\u0924\u0940\u092F'}
            </label>

            <label className={`radio-option ${formData.nationalityType === 'Foreign' ? 'active' : ''}`}>
              <input
                type="radio"
                name="nationality"
                checked={formData.nationalityType === 'Foreign'}
                onChange={() => handleNationalityChange('Foreign')}
              />
              <span className="radio-checkmark"></span>
              Foreign - {'\u0935\u093F\u0926\u0947\u0936\u0940'}
            </label>
          </div>
        </div>

        {/* ID Document Type */}
        <div className="form-section">
          <h3 className="form-section-title">
            ID Document Type
            <span className="title-hindi">{'\u0906\u0908\u0921\u0940 \u0926\u0938\u094D\u0924\u093E\u0935\u0947\u091C\u093C \u0915\u093E \u092A\u094D\u0930\u0915\u093E\u0930'}</span>
          </h3>

          <div className="id-type-grid">
            {idDocTypes[formData.nationalityType].map((type) => (
              <label
                key={type.value}
                className={`id-type-option ${formData.idDocumentType === type.value ? 'active' : ''}`}
              >
                <input
                  type="radio"
                  name="idType"
                  checked={formData.idDocumentType === type.value}
                  onChange={() => handleIdTypeChange(type.value)}
                />
                <span className="radio-checkmark"></span>
                {type.labelEn} - {type.labelHi}
              </label>
            ))}
          </div>
        </div>

        {/* Document Upload */}
        <div className="form-section">
          <h3 className="form-section-title">
            Upload {formData.idDocumentType}
            <span className="title-hindi">{formData.idDocumentType} {'\u0905\u092A\u0932\u094B\u0921 \u0915\u0930\u0947\u0902'}</span>
          </h3>

          <div className="upload-grid">
            {/* Front Image */}
            <div className="upload-box">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'front')}
                style={{ display: 'none' }}
              />

              {idDocFront ? (
                <div className="uploaded-preview">
                  <Image
                    src={idDocFront.preview}
                    alt="ID Front"
                    width={150}
                    height={100}
                    className="preview-image"
                  />
                  <button
                    className="remove-btn"
                    onClick={() => removeImage('front')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  className="upload-trigger"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17,8 12,3 7,8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span className="upload-label">
                    {formData.nationalityType === 'Foreign' ? 'Passport Front' : 'Front Image'}
                    <span className="upload-label-hindi">
                      {formData.nationalityType === 'Foreign' ? '\u092A\u093E\u0938\u092A\u094B\u0930\u094D\u091F \u0938\u093E\u092E\u0928\u0947' : '\u0938\u093E\u092E\u0928\u0947 \u0915\u0940 \u091B\u0935\u093F'}
                    </span>
                  </span>
                </button>
              )}
            </div>

            {/* Back Image */}
            <div className="upload-box">
              <input
                ref={fileInputBackRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'back')}
                style={{ display: 'none' }}
              />

              {idDocBack ? (
                <div className="uploaded-preview">
                  <Image
                    src={idDocBack.preview}
                    alt="ID Back"
                    width={150}
                    height={100}
                    className="preview-image"
                  />
                  <button
                    className="remove-btn"
                    onClick={() => removeImage('back')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  className="upload-trigger"
                  onClick={() => fileInputBackRef.current?.click()}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17,8 12,3 7,8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span className="upload-label">
                    {formData.nationalityType === 'Foreign' ? 'Visa Image' : 'Back Image'}
                    <span className="upload-label-hindi">
                      {formData.nationalityType === 'Foreign' ? '\u0935\u0940\u091C\u093C\u093E \u091B\u0935\u093F' : '\u092A\u0940\u091B\u0947 \u0915\u0940 \u091B\u0935\u093F'}
                    </span>
                  </span>
                  <span className="optional-text">(Optional - {'\u0935\u0948\u0915\u0932\u094D\u092A\u093F\u0915'})</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <Button
            className="caretaker-btn-primary w-100"
            onClick={handleSubmit}
            disabled={isLoading || !idDocFront}
          >
            {isLoading ? (
              <Spinner size="sm" animation="border" />
            ) : (
              <>Complete Check-in - {'\u091A\u0947\u0915-\u0907\u0928 \u092A\u0942\u0930\u093E \u0915\u0930\u0947\u0902'}</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckInFormPage;
