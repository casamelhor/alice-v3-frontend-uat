import React, { Suspense } from 'react'
import EditPropertyDetails from '@/Components/Property/EditPropertyDetails'

export default function page() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <EditPropertyDetails />
      </Suspense>
    </>
  )
}
