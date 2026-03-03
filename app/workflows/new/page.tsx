'use client'

import { useRouter } from 'next/navigation'
import { SignatureWorkflowBuilder } from '@/components/signature-workflow/SignatureWorkflowBuilder'

export default function NewWorkflowPage() {
  const router = useRouter()

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
        onSave={handleSave}
        onPublish={handlePublish}
        onClose={handleClose}
      />
    </div>
  )
}
