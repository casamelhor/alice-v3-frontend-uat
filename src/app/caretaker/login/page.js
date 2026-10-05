"use client";
import React from 'react';
import { CaretakerLanguageProvider } from '@/context/CaretakerLanguageContext';
import CaretakerLogin from '@/Components/Caretaker/CaretakerLogin';
import '@/styles/caretaker.scss';

export default function CaretakerLoginPage() {
  return (
    <CaretakerLanguageProvider>
      <CaretakerLogin />
    </CaretakerLanguageProvider>
  );
}
