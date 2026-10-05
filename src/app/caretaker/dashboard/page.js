"use client";
import React from 'react';
import CaretakerLayout from '@/Components/Caretaker/CaretakerLayout';
import CaretakerDashboard from '@/Components/Caretaker/CaretakerDashboard';

export default function CaretakerDashboardPage() {
  return (
    <CaretakerLayout>
      <CaretakerDashboard />
    </CaretakerLayout>
  );
}
