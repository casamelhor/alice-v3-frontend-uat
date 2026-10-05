import React, { Suspense } from 'react'
import Editassignmentdetail from '@/Components/Property/Editassignmentdetail'

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Editassignmentdetail />
    </Suspense>
  )
}
