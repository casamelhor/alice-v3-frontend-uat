"use client";
import React from 'react';
import CaretakerLayout from '@/Components/Caretaker/CaretakerLayout';
import CalendarPage from '@/Components/Caretaker/CalendarPage';

export default function CaretakerCalendarPage() {
  return (
    <CaretakerLayout activeTab="calendar">
      <CalendarPage />
    </CaretakerLayout>
  );
}
