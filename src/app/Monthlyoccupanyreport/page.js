import MonthyOccupancyReport from '@/Components/Dashboard/MonthyOccupancyReport'
import React, { Suspense } from 'react'

export default function page() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <MonthyOccupancyReport />
      </Suspense>
    </>
  )
}
