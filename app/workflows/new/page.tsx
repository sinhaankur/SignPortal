'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { SignatureWorkflowBuilder } from '@/components/signature-workflow/SignatureWorkflowBuilder'
import { Suspense } from 'react'

function NewWorkflowContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Read document info from query params
  const documentId = searchParams.get('documentId')
  const documentName = searchParams.get('documentName')

  const handleSave = (workflow: any) => {
    console.log('Workflow saved:', workflow)
    // Here you would typically save to your backend
  }

  const handlePublish = (workflow: any) => {
    console.log('Workflow published:', workflow)
    // Here you would typically publish and activate the workflow
  }

  const handleClose = () => {
    router.push('/workflows')
  }

  return (
    <div className="h-screen">
      <SignatureWorkflowBuilder 
        documentId={documentId || undefined}
        documentName={documentName || undefined}
        onSave={handleSave}
        onPublish={handlePublish}
        onClose={handleClose}
      />
    </div>
  )
}

export default function NewWorkflowPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
      <NewWorkflowContent />
    </Suspense>
  )
}
