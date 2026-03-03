'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TemplateSelector } from '@/components/TemplateSelector'
import { FileUploadComponent, type UploadedFile } from '@/components/FileUploadComponent'

export default function NewDocumentPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [step, setStep] = useState<'template' | 'details' | 'upload' | 'workflow' | 'success'>('template')
  const [documentName, setDocumentName] = useState('')
  const [documentType, setDocumentType] = useState('CONTRACT')
  const [documentDescription, setDocumentDescription] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [documentId, setDocumentId] = useState('')

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn')
    if (!loggedIn) {
      router.push('/login')
      return
    }
    setIsLoggedIn(true)
  }, [router])

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template.id)
    setDocumentName(template.name)
    setDocumentType('TEMPLATE')
    setDocumentDescription(template.description)
    setStep('upload')
  }

  const handleCreateCustom = () => {
    setSelectedTemplate(null)
    setStep('details')
  }

  const handleCreateForm = () => {
    router.push('/documents/new/form-builder')
  }

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault()
    if (!documentName.trim()) {
      alert('Please enter a document name')
      return
    }
    setStep('upload')
  }

  const handleBackToTemplate = () => {
    setDocumentName('')
    setSelectedTemplate(null)
    setStep('template')
  }

  const handleUploadComplete = (fileData: UploadedFile) => {
    setUploadedFile(fileData)
    
    // Create document entry
    const newDocId = 'doc-' + Date.now()
    setDocumentId(newDocId)

    const documentData = {
      id: newDocId,
      name: documentName,
      type: documentType,
      description: documentDescription,
      template: selectedTemplate,
      file: fileData,
      status: 'uploading',
      uploadProgress: 100,
      createdAt: new Date().toISOString(),
      signers: []
    }

    // Save to localStorage
    const existingDocs = localStorage.getItem('documents')
    const documents = existingDocs ? JSON.parse(existingDocs) : []
    documents.push(documentData)
    localStorage.setItem('documents', JSON.stringify(documents))

    // Show success step briefly then redirect
    setStep('success')
    setTimeout(() => {
      router.push(`/documents/status/${newDocId}`)
    }, 2000)
  }

  if (!isLoggedIn) return null

  return (
    <div className="min-h-screen bg-[#f7f5f3]">
      <header className="w-full border-b border-[#37322f]/6 bg-white">
        <div className="max-w-[1060px] mx-auto px-4">
          <nav className="flex items-center justify-between py-4">
            <Link href="/" className="text-[#37322f] font-semibold text-lg">SignPortal</Link>
            <Link href="/dashboard" className="text-[#37322f] hover:bg-[#37322f]/5 px-4 py-2 rounded">Dashboard</Link>
          </nav>
        </div>
      </header>

      {/* Progress Indicators */}
      {(step === 'template' || step === 'details' || step === 'upload') && (
        <div className="bg-white border-b border-[#37322f]/6">
          <div className="max-w-[1060px] mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-3 ${step === 'template' ? 'opacity-100' : 'opacity-60'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step === 'template' ? 'bg-[#37322f] text-white' : 'bg-[#37322f]/20 text-[#37322f]'}`}>1</div>
                <div>
                  <p className="font-semibold text-[#37322f]">Template</p>
                  <p className="text-xs text-[#37322f]/60">Choose your approach</p>
                </div>
              </div>
              <div className="flex-1 h-1 mx-4 bg-[#37322f]/20"></div>
              <div className={`flex items-center gap-3 ${step === 'details' ? 'opacity-100' : 'opacity-60'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step === 'details' ? 'bg-[#37322f] text-white' : 'bg-[#37322f]/20 text-[#37322f]'}`}>2</div>
                <div>
                  <p className="font-semibold text-[#37322f]">Details</p>
                  <p className="text-xs text-[#37322f]/60">Fill in basics</p>
                </div>
              </div>
              <div className="flex-1 h-1 mx-4 bg-[#37322f]/20"></div>
              <div className={`flex items-center gap-3 ${step === 'upload' ? 'opacity-100' : 'opacity-60'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step === 'upload' ? 'bg-[#37322f] text-white' : 'bg-[#37322f]/20 text-[#37322f]'}`}>3</div>
                <div>
                  <p className="font-semibold text-[#37322f]">Upload</p>
                  <p className="text-xs text-[#37322f]/60">Add your file</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'template' ? (
        <div className="max-w-4xl mx-auto px-4 py-12">
          <TemplateSelector onSelect={handleTemplateSelect} onCreateCustom={handleCreateCustom} onCreateForm={handleCreateForm} />
        </div>
      ) : step === 'details' ? (
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-[#37322f] text-white flex items-center justify-center font-semibold">2</div>
              <div>
                <h1 className="text-3xl font-bold text-[#37322f]">Document Details</h1>
                <p className="text-[#37322f]/60">
                  {selectedTemplate ? `Configure your ${documentName}` : 'Set up your custom document'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-[#37322f]/10 p-8">
            <form onSubmit={handleCreateDocument} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#37322f] mb-2">Document Name *</label>
                <input
                  type="text"
                  required
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="e.g., Service Agreement with Acme Corp"
                  className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#37322f] mb-2">Document Type *</label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  disabled={selectedTemplate !== null}
                  className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f] disabled:opacity-60"
                >
                  <option value="CONTRACT">Contract</option>
                  <option value="AGREEMENT">Agreement</option>
                  <option value="NDA">Non-Disclosure Agreement</option>
                  <option value="POLICY">Policy Document</option>
                  <option value="CONSENT">Consent Form</option>
                  <option value="INVOICE">Invoice</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#37322f] mb-2">Description</label>
                <textarea
                  value={documentDescription}
                  onChange={(e) => setDocumentDescription(e.target.value)}
                  placeholder="Add details about this document (optional)"
                  rows={4}
                  className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]"
                />
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[#37322f] text-white rounded-lg font-semibold hover:bg-[#37322f]/90 transition"
                >
                  Next: Upload Document →
                </button>
                <button
                  type="button"
                  onClick={handleBackToTemplate}
                  className="px-6 py-3 border border-[#37322f]/20 text-[#37322f] rounded-lg font-semibold hover:bg-[#37322f]/5 transition"
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : step === 'upload' ? (
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-[#37322f] text-white flex items-center justify-center font-semibold">3</div>
              <div>
                <h1 className="text-3xl font-bold text-[#37322f]">Upload Your Document</h1>
                <p className="text-[#37322f]/60">Add your PDF or Word document</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-[#37322f]/10 p-8">
            <FileUploadComponent
              onUploadComplete={handleUploadComplete}
              documentName={documentName}
              documentType={documentType}
            />

            <div className="flex gap-4 pt-8 mt-8 border-t border-[#37322f]/10">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="px-6 py-3 border border-[#37322f]/20 text-[#37322f] rounded-lg font-semibold hover:bg-[#37322f]/5 transition"
              >
                ← Back
              </button>
              <div className="flex-1"></div>
            </div>
          </div>
        </div>
      ) : step === 'success' ? (
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-8">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-[#37322f] mb-2">Document Uploaded Successfully!</h1>
            <p className="text-[#37322f]/60 mb-8">
              Your document has been uploaded and is ready for the signing workflow. Redirecting to document status...
            </p>
            <div className="inline-block">
              <div className="animate-spin h-8 w-8 border-4 border-[#37322f] border-t-transparent rounded-full"></div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
