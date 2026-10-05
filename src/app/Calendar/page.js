import { CustomCalendarPage } from '@/custom-calendar'
import React, { Suspense } from 'react'

export default function page() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <CustomCalendarPage />
      </Suspense>
    </>
  )
}
