"use client";
import React, { useState } from 'react';
import { Container, Row, Col, Dropdown } from 'react-bootstrap';
import Image from 'next/image';
import { useCaretakerLanguage } from '@/context/CaretakerLanguageContext';

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const CaretakerHeader = ({ properties = [], selectedProperty, onPropertyChange, alertCount = 0 }) => {
  const { language, toggleLanguage, t, bilingual } = useCaretakerLanguage();
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);
  
  // Demo properties if none provided
  const demoProperties = properties.length > 0 ? properties : [
    { id: 'all', name: 'All Properties', nameHi: 'सभी प्रॉपर्टी' },
    { id: '1', name: 'Casa Melhor Yayati Tulip 17th Floor', nameHi: 'कासा मेल्होर यायाति ट्यूलिप 17वीं मंज़िल' },
    { id: '2', name: 'Casa Melhor Lotus View', nameHi: 'कासा मेल्होर लोटस व्यू' },
  ];
  
  const currentProperty = selectedProperty || demoProperties[0];
  
  const handlePropertySelect = (property) => {
    if (onPropertyChange) {
      onPropertyChange(property);
    }
    setShowPropertyDropdown(false);
  };

  return (
    <header className="caretaker-header">
      <Container fluid>
        <Row className="align-items-center py-2">
          {/* Logo */}
          <Col xs={4}>
            <div className="logo">
              <span className="logo-text">Alice</span>
            </div>
          </Col>
          
          {/* Property Selector */}
          <Col xs={5} className="d-flex justify-content-center">
            <Dropdown 
              show={showPropertyDropdown} 
              onToggle={(isOpen) => setShowPropertyDropdown(isOpen)}
            >
              <Dropdown.Toggle 
                as="div" 
                className="property-selector"
                onClick={() => setShowPropertyDropdown(!showPropertyDropdown)}
              >
                <span className="property-name">
                  {language === 'en' ? currentProperty.name : (currentProperty.nameHi || currentProperty.name)}
                </span>
                <Image 
                  src="/images/icons/bottom-arrow.svg" 
                  width={16} 
                  height={16} 
                  alt="Select" 
                  style={{ 
                    transform: showPropertyDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }}
                />
              </Dropdown.Toggle>
              
              <Dropdown.Menu className="property-dropdown-menu">
                {demoProperties.map((property) => (
                  <Dropdown.Item 
                    key={property.id}
                    onClick={() => handlePropertySelect(property)}
                    active={currentProperty.id === property.id}
                  >
                    {language === 'en' ? property.name : (property.nameHi || property.name)}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          
          {/* Notifications & Language Toggle */}
          <Col xs={3} className="text-end d-flex align-items-center justify-content-end gap-2">
            {alertCount > 0 && (
              <button 
                className="notification-btn"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="View notifications"
              >
                <BellIcon />
                <span className="notification-badge">{alertCount}</span>
              </button>
            )}
            <button 
              className="lang-toggle-btn"
              onClick={toggleLanguage}
              aria-label="Toggle language"
            >
              {language === 'en' ? 'हिं' : 'EN'}
            </button>
          </Col>
        </Row>
      </Container>
    </header>
  );
};

export default CaretakerHeader;
