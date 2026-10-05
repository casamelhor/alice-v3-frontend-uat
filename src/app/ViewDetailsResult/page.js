import ViewDetailsResult from '@/Components/Searchresult/ViewDetailsResult'
import React, { Suspense } from 'react'

export default function page() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ViewDetailsResult />
      </Suspense>
    </>
  )
}
