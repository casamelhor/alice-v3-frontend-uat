"use client";
import React from 'react';
import CaretakerLayout from '@/Components/Caretaker/CaretakerLayout';
import CheckInsListPage from '@/Components/Caretaker/CheckInsListPage';

export default function CaretakerCheckInsPage() {
  return (
    <CaretakerLayout>
      <CheckInsListPage />
    </CaretakerLayout>
  );
}
