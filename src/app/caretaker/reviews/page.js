"use client";
import React from 'react';
import CaretakerLayout from '@/Components/Caretaker/CaretakerLayout';
import ReviewsPage from '@/Components/Caretaker/ReviewsPage';

export default function CaretakerReviewsPage() {
  return (
    <CaretakerLayout>
      <ReviewsPage />
    </CaretakerLayout>
  );
}
