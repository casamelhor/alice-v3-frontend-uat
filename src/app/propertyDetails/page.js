import React, { Suspense } from 'react'
import PropertyDetails from '@/Components/Property/PropertyDetails'

export default function page() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <PropertyDetails />
      </Suspense>
    </>
  )
}
