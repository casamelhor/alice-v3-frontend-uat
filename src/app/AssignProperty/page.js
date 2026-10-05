import React, { Suspense } from 'react'
import AssignPropertyComponent from '@/Components/CompanyFlow/AssignProperty'

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AssignPropertyComponent/>
    </Suspense>
  )
}
