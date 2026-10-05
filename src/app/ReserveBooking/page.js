import React, { Suspense } from 'react'
import ReserveBooking from '@/Components/Searchresult/ReserveBooking'
export default function page() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ReserveBooking />
      </Suspense>
    </>
  )
}
