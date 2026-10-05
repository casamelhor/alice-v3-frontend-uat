"use client";
import React from 'react';
import CaretakerLayout from '@/Components/Caretaker/CaretakerLayout';
import BookingDetailsPage from '@/Components/Caretaker/BookingDetailsPage';

export default function CaretakerBookingPage() {
  return (
    <CaretakerLayout>
      <BookingDetailsPage />
    </CaretakerLayout>
  );
}
