
import React, { Suspense } from 'react'
import Assignmentedit from '@/Components/Property/Assignmentedit'


export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Assignmentedit />
    </Suspense>
  )
}
