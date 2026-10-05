
import MultiSwitchReserve from '@/Components/Searchresult/MultiSwitchReserve'
import React, { Suspense } from 'react'

export default function page() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <MultiSwitchReserve />
      </Suspense>
    </>
  )
}
