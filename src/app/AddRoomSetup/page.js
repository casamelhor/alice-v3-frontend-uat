import React, { Suspense } from 'react'
import AddRoomSetup from '@/Components/Property/AddRoomSetup'

export default function page() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <AddRoomSetup />
      </Suspense>
    </>
  )
}
