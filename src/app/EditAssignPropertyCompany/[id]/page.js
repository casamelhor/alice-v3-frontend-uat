import React, { Suspense } from 'react'
import EditAssignPropertyToCompany from '@/Components/CompanyFlow/EditAssignPropertyCompany'

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditAssignPropertyToCompany />
    </Suspense>
  )
}
