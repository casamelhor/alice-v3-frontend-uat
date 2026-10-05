import React, { Suspense } from 'react'
import People from '@/Components/People/People'

export default function page() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <People />
      </Suspense>
    </>
  )
}
