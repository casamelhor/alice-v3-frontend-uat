import Occupancyreport from '@/Components/Dashboard/Occupancyreport'
import React, { Suspense } from 'react'

export default function page() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Occupancyreport />
      </Suspense>

    </>
  )
}
