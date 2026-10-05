"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCaretakerLanguage } from '@/context/CaretakerLanguageContext';

const MenuPage = () => {
  const router = useRouter();
  const { language, toggleLanguage, t } = useCaretakerLanguage();
  
  // Get caretaker info from localStorage
  const caretakerType = typeof window !== 'undefined' ? localStorage.getItem('caretaker_type') : 'housekeeper';
  const caretakerName = typeof window !== 'undefined' ? localStorage.getItem('caretaker_name') : '';
  const caretakerEmail = typeof window !== 'undefined' ? localStorage.getItem('caretaker_email') : '';
  const caretakerPhone = typeof window !== 'undefined' ? localStorage.getItem('caretaker_phone') : '';
  const caretakerGender = typeof window !== 'undefined' ? localStorage.getItem('caretaker_gender') : '';
  const caretakerImage = typeof window !== 'undefined' ? localStorage.getItem('caretaker_profile_image') : '';
  const propertiesJson = typeof window !== 'undefined' ? localStorage.getItem('caretaker_properties') : null;
  const assignedProperties = propertiesJson ? JSON.parse(propertiesJson) : [];
  
  const handleLogout = () => {
    localStorage.removeItem('caretaker_token');
    localStorage.removeItem('caretaker_refresh');
    localStorage.removeItem('caretaker_type');
    localStorage.removeItem('caretaker_name');
    localStorage.removeItem('caretaker_uid');
    localStorage.removeItem('caretaker_email');
    localStorage.removeItem('caretaker_phone');
    localStorage.removeItem('caretaker_gender');
    localStorage.removeItem('caretaker_profile_image');
    localStorage.removeItem('caretaker_role');
    localStorage.removeItem('caretaker_properties');
    localStorage.removeItem('caretaker_selected_property');
    router.push('/caretaker/login');
  };
  
  const menuItems = [
    {
      id: 'language',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
      labelEn: 'Language',
      labelHi: 'भाषा',
      rightContent: (
        <div className="language-toggle-inline">
          <span className={language === 'en' ? 'active' : ''}>EN</span>
          <button onClick={toggleLanguage} className="toggle-switch">
            <span className={`toggle-knob ${language === 'hi' ? 'right' : ''}`}></span>
          </button>
          <span className={language === 'hi' ? 'active' : ''}>हिं</span>
        </div>
      )
    }
  ];

  return (
    <div className="menu-page">
      {/* User Info Card */}
      <div className="user-info-card">
        <div className="user-avatar">
          {caretakerImage ? (
            <Image src={caretakerImage} width={56} height={56} alt={caretakerName} className="avatar-img" />
          ) : (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
            </svg>
          )}
        </div>
        <div className="user-details">
          <h3 className="user-name">{caretakerName || 'Caretaker'}</h3>
          <p className="user-role">
            {caretakerType?.includes('Chef') ? 'Chef - शेफ' : 'Housekeeper - हाउसकीपर'}
          </p>
        </div>
      </div>

      {/* Contact Details */}
      <div className="user-contact-card">
        {caretakerEmail && (
          <div className="contact-row">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 7l-10 7L2 7" />
            </svg>
            <span className="contact-value">{caretakerEmail}</span>
          </div>
        )}
        {caretakerPhone && (
          <div className="contact-row">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span className="contact-value">{caretakerPhone}</span>
          </div>
        )}
        {caretakerGender && (
          <div className="contact-row">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
            </svg>
            <span className="contact-value">{caretakerGender}</span>
          </div>
        )}
        {assignedProperties.length > 0 && (
          <div className="contact-row">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9,22 9,12 15,12 15,22" />
            </svg>
            <span className="contact-value">{assignedProperties.map(p => p.property_name).join(', ')}</span>
          </div>
        )}
      </div>
      
      {/* Menu Items */}
      <div className="menu-items-list">
        {menuItems.map((item) => (
          <div 
            key={item.id}
            className="menu-item"
            onClick={item.onClick}
            role={item.onClick ? 'button' : undefined}
            tabIndex={item.onClick ? 0 : undefined}
          >
            <div className="menu-item-left">
              <span className="menu-item-icon">{item.icon}</span>
              <span className="menu-item-label">
                {item.labelEn}
                <span className="menu-item-label-hindi">{item.labelHi}</span>
              </span>
            </div>
            {item.rightContent ? (
              <div className="menu-item-right" onClick={(e) => e.stopPropagation()}>
                {item.rightContent}
              </div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9,6 15,12 9,18" />
              </svg>
            )}
          </div>
        ))}
      </div>
      
      {/* Logout Button */}
      <div className="menu-logout-section">
        <button className="logout-btn" onClick={handleLogout}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16,17 21,12 16,7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Log out - लॉग आउट
        </button>
      </div>
    </div>
  );
};

export default MenuPage;
