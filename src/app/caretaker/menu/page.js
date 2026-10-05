"use client";
import React from 'react';
import CaretakerLayout from '@/Components/Caretaker/CaretakerLayout';
import MenuPage from '@/Components/Caretaker/MenuPage';

export default function CaretakerMenuPage() {
  return (
    <CaretakerLayout>
      <MenuPage />
    </CaretakerLayout>
  );
}
