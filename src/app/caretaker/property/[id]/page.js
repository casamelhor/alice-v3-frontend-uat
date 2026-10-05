"use client";
import React from 'react';
import CaretakerLayout from '@/Components/Caretaker/CaretakerLayout';
import PropertyDetailPage from '@/Components/Caretaker/PropertyDetailPage';

export default function CaretakerPropertyPage() {
  return (
    <CaretakerLayout>
      <PropertyDetailPage />
    </CaretakerLayout>
  );
}
