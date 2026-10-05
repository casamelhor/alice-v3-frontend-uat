import React, { Suspense } from 'react'
import PropertYListing from '@/Components/Property/PropertyListing'

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <PropertYListing/>
    </Suspense>
  )
}
