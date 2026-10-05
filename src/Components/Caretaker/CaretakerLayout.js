"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CaretakerHeader from './CaretakerHeader';
import CaretakerBottomNav from './CaretakerBottomNav';
import { CaretakerLanguageProvider } from '@/context/CaretakerLanguageContext';
import { CaretakerPropertiesAPI } from '@/services/caretakerProvider';
import '@/styles/caretaker.scss';

const CaretakerLayout = ({ children }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('caretaker_token');
    if (!token) {
      router.replace('/caretaker/login');
      return;
    }

    // Load properties from API
    const loadProperties = async () => {
      try {
        const response = await CaretakerPropertiesAPI();
        if (response?.data?.success) {
          const apiProperties = response.data.response || [];
          const propertyList = [
            { id: 'all', uid: 'all', name: 'All Properties', nameHi: 'सभी प्रॉपर्टी', property_name: 'All Properties' },
            ...apiProperties.map(p => ({
              id: p.uid,
              uid: p.uid,
              name: p.property_name,
              nameHi: p.property_name,
              property_name: p.property_name,
              city: p.city,
              total_rooms: p.total_rooms,
              cover_photo_url: p.cover_photo_url,
            }))
          ];
          setProperties(propertyList);

          // Restore saved selection or default to 'All'
          const savedPropertyId = localStorage.getItem('caretaker_selected_property');
          if (savedPropertyId) {
            const saved = propertyList.find(p => p.id === savedPropertyId);
            if (saved) {
              setSelectedProperty(saved);
            } else {
              setSelectedProperty(propertyList[0]);
            }
          } else {
            setSelectedProperty(propertyList[0]);
          }
        } else {
          // Fallback: try cached properties from login
          const cachedProps = localStorage.getItem('caretaker_properties');
          if (cachedProps) {
            const parsed = JSON.parse(cachedProps);
            const propertyList = [
              { id: 'all', uid: 'all', name: 'All Properties', nameHi: 'सभी प्रॉपर्टी', property_name: 'All Properties' },
              ...parsed.map(p => ({
                id: p.uid,
                uid: p.uid,
                name: p.property_name,
                nameHi: p.property_name,
                property_name: p.property_name,
              }))
            ];
            setProperties(propertyList);
            setSelectedProperty(propertyList[0]);
          }
        }
      } catch (error) {
        console.error('Failed to load properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProperties();
  }, [router]);

  const handlePropertyChange = (property) => {
    setSelectedProperty(property);
    localStorage.setItem('caretaker_selected_property', property.id);
  };

  return (
    <CaretakerLanguageProvider>
      {isLoading ? (
        <div className="caretaker-app">
          <div className="caretaker-loading">
            <div className="loading-spinner"></div>
          </div>
        </div>
      ) : (
      <div className="caretaker-app">
        <CaretakerHeader
          properties={properties}
          selectedProperty={selectedProperty}
          onPropertyChange={handlePropertyChange}
        />

        <main className="caretaker-main">
          {React.cloneElement(children, {
            selectedProperty,
            properties
          })}
        </main>

        <CaretakerBottomNav />
      </div>
      )}
    </CaretakerLanguageProvider>
  );
};

export default CaretakerLayout;
