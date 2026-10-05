import React, { Suspense } from 'react'
import AddNewListing from '@/Components/Property/AddNewListing'
export default function page() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <AddNewListing />
      </Suspense>
    </>
  )
}
