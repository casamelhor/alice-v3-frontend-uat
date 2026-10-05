import React, { Suspense } from 'react'
import UpdatePassword from '@/Components/Login/UpdatePassword'

export default function page() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <UpdatePassword />
      </Suspense>
    </>
  )
}
