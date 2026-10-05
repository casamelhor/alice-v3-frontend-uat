import React, { Suspense } from 'react'
//import Allbookings from '@/Components/Bookings/Allbookings'.
import Allbookings from '@/Components/Bookings/Allbookings';

export default function page() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Allbookings />
      </Suspense>
    </>
  )
}
