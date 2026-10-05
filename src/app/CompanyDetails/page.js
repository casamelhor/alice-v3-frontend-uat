import React, { Suspense } from 'react'
import CompanyDetails from '@/Components/CompanyFlow/CompanyDetails'

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompanyDetails/>
    </Suspense>
  )
}
