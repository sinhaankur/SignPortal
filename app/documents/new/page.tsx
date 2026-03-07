'use client'

import { useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { FileUploadComponent, type UploadedFile } from '@/components/FileUploadComponent'
import ProtectedLayout from '@/components/layouts/protected-layout'

  const router = useRouter()
  const [mode, setMode] = useState<'upload' | 'form' | null>(null)
  const [template, setTemplate] = useState<string>('')
  const [documentName, setDocumentName] = useState('')
  const [documentType, setDocumentType] = useState('CONTRACT')
  const [documentDescription, setDocumentDescription] = useState('')
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)


  // Example templates (can be fetched from backend or static)
  const templates = [
    { value: '', label: 'No Template' },
    { value: 'nda', label: 'Non-Disclosure Agreement' },
    { value: 'employment', label: 'Employment Agreement' },
    { value: 'invoice', label: 'Invoice Document' },
    { value: 'consent', label: 'Consent Form' },
    { value: 'purchase', label: 'Purchase Agreement' },
    { value: 'service', label: 'Service Agreement' },
  ]

  const handleUploadComplete = async (fileData: UploadedFile) => {
    setUploadedFile(fileData)

    // Insert document record into Supabase
    const { data, error } = await supabase
      .from('documents')
      .insert([
        {
          name: documentName,
          type: documentType,
          description: documentDescription,
          template: selectedTemplate,
          file_url: fileData.url,
          status: 'uploaded',
          created_at: new Date().toISOString(),
        }
      ])
      .select()

    if (error) {
      alert('Failed to create document record: ' + error.message)
      return
    }

    const newDocId = data && data[0] && data[0].id ? data[0].id : null
    setDocumentId(newDocId)

    setStep('success')
    setTimeout(() => {
      if (newDocId) {
        router.push(`/documents/status/${newDocId}`)
      } else {
        router.push('/documents')
      }
    }, 2000)
  }

  return (
    <ProtectedLayout>
      <div className="max-w-3xl mx-auto py-16">
        <h1 className="text-3xl font-bold text-[#37322f] mb-2 text-center">Start a New Document</h1>
        <p className="text-[#37322f]/60 mb-10 text-center">Choose how you want to begin your e-signature workflow.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upload Document Option */}
          <div className="bg-white border border-[#37322f]/10 rounded-xl p-8 flex flex-col items-center">
            <svg className="w-10 h-10 text-[#37322f]/40 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <h2 className="text-xl font-semibold text-[#37322f] mb-2">Upload Document</h2>
            <p className="text-[#37322f]/60 mb-4 text-center">Upload a PDF or document for e-signature. Optionally, select a template to pre-fill details.</p>
            <select
              className="mb-4 px-4 py-2 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
              value={template}
              onChange={e => setTemplate(e.target.value)}
            >
              {templates.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <button
              className="px-6 py-3 bg-[#37322f] text-white rounded-lg font-semibold hover:bg-[#2a2520] transition mb-2"
              onClick={() => setMode('upload')}
            >
              Upload Document
            </button>
          </div>

          {/* Build a Form Option */}
          <div className="bg-white border border-[#37322f]/10 rounded-xl p-8 flex flex-col items-center">
            <svg className="w-10 h-10 text-[#37322f]/40 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 2h8v4H8z" />
            </svg>
            <h2 className="text-xl font-semibold text-[#37322f] mb-2">Build a Form</h2>
            <p className="text-[#37322f]/60 mb-4 text-center">Create custom forms for approval & signatures. Optionally, select a template to start from.</p>
            <select
              className="mb-4 px-4 py-2 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
              value={template}
              onChange={e => setTemplate(e.target.value)}
            >
              {templates.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <button
              className="px-6 py-3 bg-[#37322f] text-white rounded-lg font-semibold hover:bg-[#2a2520] transition mb-2"
              onClick={() => router.push('/documents/new/form-builder')}
            >
              Build a Form
            </button>
          </div>
        </div>

        {/* Upload flow */}
        {mode === 'upload' && (
          <div className="mt-12 max-w-xl mx-auto">
            <FileUploadComponent
              onUploadComplete={async (fileData) => {
                setUploadedFile(fileData)
                // Insert document record into Supabase
                const { data, error } = await supabase
                  .from('documents')
                  .insert([
                    {
                      name: documentName || fileData.name,
                      type: documentType,
                      description: documentDescription,
                      template: template,
                      file_url: fileData.url,
                      status: 'uploaded',
                      created_at: new Date().toISOString(),
                    }
                  ])
                  .select()
                if (error) {
                  alert('Failed to create document record: ' + error.message)
                  return
                }
                const newDocId = data && data[0] && data[0].id ? data[0].id : null
                setMode(null)
                setUploadedFile(null)
                setDocumentName('')
                setDocumentType('CONTRACT')
                setDocumentDescription('')
                setTemplate('')
                setTimeout(() => {
                  if (newDocId) {
                    router.push(`/documents/status/${newDocId}`)
                  } else {
                    router.push('/documents')
                  }
                }, 1000)
              }}
              documentName={documentName}
              documentType={documentType}
            />
          </div>
        )}
      </div>
    </ProtectedLayout>
  )
}
