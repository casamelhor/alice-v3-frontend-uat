"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useCaretakerLanguage } from '@/context/CaretakerLanguageContext';

const CaretakerBottomNav = () => {
  const pathname = usePathname();
  const { t, language } = useCaretakerLanguage();
  
  const navItems = [
    {
      href: '/caretaker/dashboard',
      icon: '/images/icons/caretaker/today.svg',
      labelEn: 'Today',
      labelHi: 'आज',
      matchPaths: ['/caretaker/dashboard', '/caretaker']
    },
    {
      href: '/caretaker/guests',
      icon: '/images/icons/caretaker/guests.svg',
      labelEn: 'Guests',
      labelHi: 'मेहमान',
      matchPaths: ['/caretaker/guests']
    },
    {
      href: '/caretaker/calendar',
      icon: '/images/icons/caretaker/calendar.svg',
      labelEn: 'Calendar',
      labelHi: 'कैलेंडर',
      matchPaths: ['/caretaker/calendar']
    },
    {
      href: '/caretaker/business-residences',
      icon: '/images/icons/caretaker/br.svg',
      labelEn: 'BR',
      labelHi: 'बी.आर',
      matchPaths: ['/caretaker/business-residences']
    },
    {
      href: '/caretaker/menu',
      icon: '/images/icons/caretaker/menu.svg',
      labelEn: 'Menu',
      labelHi: 'मेन्यू',
      matchPaths: ['/caretaker/menu']
    }
  ];
  
  const isActive = (item) => {
    return item.matchPaths.some(path => pathname === path || pathname?.startsWith(path + '/'));
  };

  return (
    <nav className="caretaker-bottom-nav">
      {navItems.map((item) => (
        <Link 
          key={item.href}
          href={item.href}
          className={`bottom-nav-item ${isActive(item) ? 'active' : ''}`}
        >
          <svg 
            className="nav-icon" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            {item.labelEn === 'Today' && (
              <>
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M3 10h18" />
                <path d="M8 2v4" />
                <path d="M16 2v4" />
              </>
            )}
            {item.labelEn === 'Guests' && (
              <>
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </>
            )}
            {item.labelEn === 'Calendar' && (
              <>
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M3 10h18" />
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <path d="M7 14h2" />
                <path d="M11 14h2" />
                <path d="M15 14h2" />
              </>
            )}
            {item.labelEn === 'BR' && (
              <>
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <path d="M8 6h8" />
                <path d="M8 10h8" />
                <path d="M8 14h4" />
              </>
            )}
            {item.labelEn === 'Menu' && (
              <>
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </>
            )}
          </svg>
          <span className="nav-label">
            {item.labelEn}
            <span className="nav-label-hindi">{item.labelHi}</span>
          </span>
        </Link>
      ))}
    </nav>
  );
};

export default CaretakerBottomNav;
