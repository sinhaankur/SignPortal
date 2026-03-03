'use client'

import { useParams, useRouter } from 'next/navigation'
import { SignatureWorkflowBuilder } from '@/components/signature-workflow/SignatureWorkflowBuilder'
import { useEffect, useState } from 'react'

export default function EditWorkflowPage() {
  const params = useParams()
  const router = useRouter()
  const workflowId = params.id as string
  const [loading, setLoading] = useState(true)
  const [workflow, setWorkflow] = useState<any>(null)

  useEffect(() => {
    // Simulating loading a workflow from storage/API
    const storedWorkflow = localStorage.getItem(`workflow-${workflowId}`)
    if (storedWorkflow) {
      setWorkflow(JSON.parse(storedWorkflow))
    }
    setLoading(false)
  }, [workflowId])

  const handleSave = (workflow: any) => {
    console.log('Workflow saved:', workflow)
  }

  const handlePublish = (workflow: any) => {
    console.log('Workflow published:', workflow)
  }

  const handleClose = () => {
    router.push('/workflows')
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f7f5f3]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#37322f] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading workflow...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen">
      <SignatureWorkflowBuilder 
        onSave={handleSave}
        onPublish={handlePublish}
        onClose={handleClose}
        initialWorkflow={workflow}
      />
    </div>
  )
}
