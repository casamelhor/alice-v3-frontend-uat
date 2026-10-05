"use client";
import React from 'react';
import CaretakerLayout from '@/Components/Caretaker/CaretakerLayout';
import CheckOutsListPage from '@/Components/Caretaker/CheckOutsListPage';

export default function CaretakerCheckOutsPage() {
  return (
    <CaretakerLayout>
      <CheckOutsListPage />
    </CaretakerLayout>
  );
}
