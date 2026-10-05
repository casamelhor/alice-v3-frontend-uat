"use client";
import React from 'react';
import CaretakerLayout from '@/Components/Caretaker/CaretakerLayout';
import GuestsPage from '@/Components/Caretaker/GuestsPage';

export default function CaretakerGuestsPage() {
  return (
    <CaretakerLayout>
      <GuestsPage />
    </CaretakerLayout>
  );
}
