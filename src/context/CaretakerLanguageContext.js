"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Login
    welcomeTo: "Welcome to",
    alice: "Alice",
    emailOrPhone: "Email or phone number",
    enter: "Enter",
    continue: "Continue",
    casaMelhorSerial: "Casa Melhor Serial number",
    chefPin: "Chef PIN",
    housekeeperPin: "Housekeeper PIN",
    code: "Code",
    enterCodeSms: "Enter the code we've sent via SMS to",
    
    // Dashboard
    today: "Today",
    checkIns: "Check-ins",
    checkouts: "Checkouts",
    roomOccupancy: "Room Occupancy",
    pendingReviews: "Pending reviews",
    yourReservations: "Your reservations",
    currentStays: "Current stays",
    upcoming: "Upcoming",
    checkingOut: "Checking out",
    
    // Reservation Cards
    checkInPending: "CHECK-IN PENDING",
    checkingOutToday: "CHECKING OUT TODAY",
    arrivingIn: "ARRIVING IN",
    arrivingTomorrow: "ARRIVING TOMORROW",
    arrivingInDays: "ARRIVING IN {days} DAYS",
    checkIn: "Check-in",
    checkout: "Checkout",
    manage: "Manage",
    
    // Reviews
    reviews: "Reviews",
    overallRating: "Overall rating",
    totalReviews: "Total reviews",
    pendingReviewsTab: "Pending reviews",
    allReviews: "All reviews",
    pendingReview: "PENDING REVIEW",
    completed: "COMPLETED",
    sendReminder: "Send Reminder",
    readReview: "Read Review",
    
    // Check-ins/Checkouts Pages
    checkInsToday: "Check-ins Today",
    checkoutsToday: "Checkouts Today",
    
    // Bottom Navigation
    guests: "Guests",
    calendar: "Calendar",
    br: "BR",
    menu: "Menu",
    
    // Empty States
    noGuestsStaying: "You don't have any guests staying with you right now.",
    
    // All Reservations
    allReservations: "All Reservations",
    
    // Property Selector
    selectProperty: "Select Property",
    allProperties: "All Properties",
    
    // Menu
    settings: "Settings",
    logout: "Log out",
    language: "Language",
    profile: "Profile",
  },
  hi: {
    // Login
    welcomeTo: "वेलकम टू",
    alice: "Alice",
    emailOrPhone: "ई-मेल या फ़ोन नंबर",
    enter: "लिखें",
    continue: "जारी रहना",
    casaMelhorSerial: "सीरियल नंबर",
    chefPin: "शेफ पिन",
    housekeeperPin: "हाउसकीपर पिन",
    code: "कोड",
    enterCodeSms: "वह कोड डालें जिसे हमने SMS के ज़रिए भेजा है",
    
    // Dashboard
    today: "आज",
    checkIns: "चेक-इन्स",
    checkouts: "चेकआउट्स",
    roomOccupancy: "रूम ऑक्यूपेंसी",
    pendingReviews: "पेंडिंग रिव्युस",
    yourReservations: "आपके रिजर्वेशन",
    currentStays: "करंट स्टेज़",
    upcoming: "अपकमिंग",
    checkingOut: "चेकिंग आउट",
    
    // Reservation Cards
    checkInPending: "चेक-इन बाकी",
    checkingOutToday: "चेक आउट आज",
    arrivingIn: "पहुंचने",
    arrivingTomorrow: "कल आ रहा है",
    arrivingInDays: "पाँच दिनों में पहुँचना",
    checkIn: "चेक-इन",
    checkout: "चेकआउट",
    manage: "मैनेज",
    
    // Reviews
    reviews: "रिव्युस",
    overallRating: "कुल रेटिंग",
    totalReviews: "टोटल रिव्युस",
    pendingReviewsTab: "पेंडिंग रिव्युस",
    allReviews: "सभी रिव्युस",
    pendingReview: "पेंडिंग रिव्य",
    completed: "पूरा हो गया",
    sendReminder: "रिमाइंडर भेजें",
    readReview: "रिव्यू पढ़ें",
    
    // Check-ins/Checkouts Pages
    checkInsToday: "चेक-इन्स आज",
    checkoutsToday: "चेकआउट्स आज",
    
    // Bottom Navigation
    guests: "मेहमान",
    calendar: "कैलेंडर",
    br: "बी.आर",
    menu: "मेन्यू",
    
    // Empty States
    noGuestsStaying: "इस समय आपके साथ कोई मेहमान नहीं रह रहा है",
    
    // All Reservations
    allReservations: "सभी बुकिंग",
    
    // Property Selector
    selectProperty: "प्रॉपर्टी चुनें",
    allProperties: "सभी प्रॉपर्टी",
    
    // Menu
    settings: "सेटिंग्स",
    logout: "लॉग आउट",
    language: "भाषा",
    profile: "प्रोफ़ाइल",
  }
};

const CaretakerLanguageContext = createContext();

export function CaretakerLanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  
  useEffect(() => {
    const savedLang = localStorage.getItem('caretaker_language');
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);
  
  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'hi' : 'en';
    setLanguage(newLang);
    localStorage.setItem('caretaker_language', newLang);
  };
  
  const setLang = (lang) => {
    setLanguage(lang);
    localStorage.setItem('caretaker_language', lang);
  };
  
  const t = (key) => {
    return translations[language][key] || translations['en'][key] || key;
  };
  
  // Bilingual helper - returns "English - हिंदी" format
  const bilingual = (key) => {
    const en = translations['en'][key] || key;
    const hi = translations['hi'][key] || key;
    return `${en} - ${hi}`;
  };
  
  return (
    <CaretakerLanguageContext.Provider value={{ language, toggleLanguage, setLang, t, bilingual }}>
      {children}
    </CaretakerLanguageContext.Provider>
  );
}

export function useCaretakerLanguage() {
  const context = useContext(CaretakerLanguageContext);
  if (!context) {
    throw new Error('useCaretakerLanguage must be used within CaretakerLanguageProvider');
  }
  return context;
}

export default CaretakerLanguageContext;
