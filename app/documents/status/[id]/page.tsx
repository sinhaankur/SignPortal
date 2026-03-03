'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Share2,
  Edit3,
  Trash2,
  Eye,
  FileText,
  ArrowLeft
} from 'lucide-react'

interface DocumentStatusData {
  id: string
  name: string
  type: string
  status: 'uploading' | 'pending' | 'in-progress' | 'completed' | 'error'
  uploadProgress: number
  fileName?: string
  fileSize?: number
  uploadedAt?: string
  createdAt: string
  signers?: Signer[]
  expiresAt?: string
}

interface Signer {
  id: string
  name: string
  email: string
  status: 'pending' | 'sent' | 'viewed' | 'signed' | 'declined'
  signedAt?: string
}

export default function DocumentStatusPage() {
  const router = useRouter()
  const params = useParams()
  const documentId = params.id as string

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [document, setDocument] = useState<DocumentStatusData | null>(null)

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn')
    if (!loggedIn) {
      router.push('/login')
      return
    }
    setIsLoggedIn(true)

    // Load document from localStorage for demo
    const docs = localStorage.getItem('documents')
    if (docs) {
      const parsedDocs = JSON.parse(docs)
      const foundDoc = parsedDocs.find((d: DocumentStatusData) => d.id === documentId)
      if (foundDoc) {
        setDocument(foundDoc)
      }
    }

    setLoading(false)
  }, [documentId, router])

  if (!isLoggedIn || loading) return null

  if (!document) {
    return (
      <div className="min-h-screen bg-[#f7f5f3]">
        <header className="w-full border-b border-[#37322f]/6 bg-white">
          <div className="max-w-[1060px] mx-auto px-4">
            <nav className="flex items-center justify-between py-4">
              <Link href="/" className="text-[#37322f] font-semibold text-lg">
                SignPortal
              </Link>
            </nav>
          </div>
        </header>
        <div className="max-w-[1060px] mx-auto px-4 py-12 text-center">
          <p className="text-[#37322f]/60">Document not found</p>
          <Link
            href="/documents"
            className="mt-4 inline-block px-6 py-3 bg-[#37322f] text-white rounded font-medium hover:bg-[#37322f]/90"
          >
            Back to Documents
          </Link>
        </div>
      </div>
    )
  }

  const statusColors = {
    uploading: 'bg-blue-50 border-blue-200',
    pending: 'bg-yellow-50 border-yellow-200',
    'in-progress': 'bg-orange-50 border-orange-200',
    completed: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200'
  }

  const statusIcons = {
    uploading: <Clock className="w-5 h-5 text-blue-600" />,
    pending: <Clock className="w-5 h-5 text-yellow-600" />,
    'in-progress': <Edit3 className="w-5 h-5 text-orange-600" />,
    completed: <CheckCircle2 className="w-5 h-5 text-green-600" />,
    error: <AlertCircle className="w-5 h-5 text-red-600" />
  }

  const statusLabels = {
    uploading: 'Uploading',
    pending: 'Pending Signatures',
    'in-progress': 'In Progress',
    completed: 'Signed & Completed',
    error: 'Error'
  }

  const getStatusColor = (signerStatus: string) => {
    switch (signerStatus) {
      case 'pending':
        return 'bg-gray-100 text-gray-700'
      case 'sent':
        return 'bg-blue-100 text-blue-700'
      case 'viewed':
        return 'bg-purple-100 text-purple-700'
      case 'signed':
        return 'bg-green-100 text-green-700'
      case 'declined':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f5f3]">
      <header className="w-full border-b border-[#37322f]/6 bg-white">
        <div className="max-w-[1060px] mx-auto px-4">
          <nav className="flex items-center justify-between py-4">
            <Link href="/" className="text-[#37322f] font-semibold text-lg">
              SignPortal
            </Link>
            <Link href="/dashboard" className="text-[#37322f] hover:bg-[#37322f]/5 px-4 py-2 rounded">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-[1060px] mx-auto px-4 py-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#37322f]/60 hover:text-[#37322f] mb-8 transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Main Status Card */}
        <div className={`rounded-lg border p-8 mb-8 ${statusColors[document.status]}`}>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">{statusIcons[document.status]}</div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-[#37322f] mb-1">{document.name}</h1>
                  <p className="text-[#37322f]/60 text-sm">
                    {statusLabels[document.status]}
                    {document.uploadProgress > 0 && document.uploadProgress < 100 && ` • ${document.uploadProgress}%`}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              {document.uploadProgress > 0 && document.uploadProgress < 100 && (
                <div className="mt-4 w-full bg-white/40 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${document.uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Document Details */}
            <div className="bg-white rounded-lg shadow-sm border border-[#37322f]/10 p-8">
              <h2 className="text-xl font-bold text-[#37322f] mb-6">Document Details</h2>

              <div className="space-y-4">
                <div className="flex justify-between items-start pb-4 border-b border-[#37322f]/10">
                  <span className="text-[#37322f]/60">Type</span>
                  <span className="font-semibold text-[#37322f]">{document.type}</span>
                </div>

                <div className="flex justify-between items-start pb-4 border-b border-[#37322f]/10">
                  <span className="text-[#37322f]/60">Created</span>
                  <span className="font-semibold text-[#37322f]">
                    {new Date(document.createdAt).toLocaleDateString()} at{' '}
                    {new Date(document.createdAt).toLocaleTimeString()}
                  </span>
                </div>

                {document.uploadedAt && (
                  <div className="flex justify-between items-start pb-4 border-b border-[#37322f]/10">
                    <span className="text-[#37322f]/60">Uploaded</span>
                    <span className="font-semibold text-[#37322f]">
                      {new Date(document.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {document.expiresAt && (
                  <div className="flex justify-between items-start pb-4 border-b border-[#37322f]/10">
                    <span className="text-[#37322f]/60">Expires</span>
                    <span className="font-semibold text-[#37322f]">
                      {new Date(document.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {document.fileSize && (
                  <div className="flex justify-between items-start">
                    <span className="text-[#37322f]/60">File Size</span>
                    <span className="font-semibold text-[#37322f]">
                      {(document.fileSize / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* File Preview */}
            {document.fileName && (
              <div className="bg-white rounded-lg shadow-sm border border-[#37322f]/10 p-8">
                <h2 className="text-xl font-bold text-[#37322f] mb-6">Uploaded File</h2>

                <div className="flex items-center gap-4 p-6 bg-[#f7f5f3] rounded-lg border border-[#37322f]/10">
                  <div className="p-3 bg-white rounded border border-[#37322f]/20">
                    <FileText className="w-6 h-6 text-[#37322f]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#37322f]">{document.fileName}</p>
                    {document.fileSize && (
                      <p className="text-sm text-[#37322f]/60">
                        {(document.fileSize / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    )}
                  </div>
                  <button className="p-3 hover:bg-[#37322f]/10 rounded transition">
                    <Download className="w-5 h-5 text-[#37322f]" />
                  </button>
                </div>
              </div>
            )}

            {/* Signers Status */}
            {document.signers && document.signers.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-[#37322f]/10 p-8">
                <h2 className="text-xl font-bold text-[#37322f] mb-6">Signer Status</h2>

                <div className="space-y-3">
                  {document.signers.map((signer) => (
                    <div
                      key={signer.id}
                      className="flex items-center justify-between p-4 bg-[#f7f5f3] rounded-lg border border-[#37322f]/10"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-[#37322f]">{signer.name}</p>
                        <p className="text-sm text-[#37322f]/60">{signer.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(signer.status)}`}>
                          {signer.status.charAt(0).toUpperCase() + signer.status.slice(1)}
                        </span>
                        {signer.signedAt && (
                          <span className="text-xs text-[#37322f]/60">
                            {new Date(signer.signedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Actions */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-[#37322f]/10 p-6 space-y-3">
              <h3 className="font-bold text-[#37322f] mb-4">Actions</h3>

              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#37322f] text-white rounded-lg font-semibold hover:bg-[#37322f]/90 transition">
                <Eye size={18} />
                Preview Document
              </button>

              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-[#37322f]/20 text-[#37322f] rounded-lg font-semibold hover:bg-[#37322f]/5 transition">
                <Share2 size={18} />
                Share Document
              </button>

              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-[#37322f]/20 text-[#37322f] rounded-lg font-semibold hover:bg-[#37322f]/5 transition">
                <Download size={18} />
                Download
              </button>

              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-[#37322f]/20 text-[#37322f] rounded-lg font-semibold hover:bg-[#37322f]/5 transition">
                <Edit3 size={18} />
                Edit
              </button>

              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-red-200 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition">
                <Trash2 size={18} />
                Delete
              </button>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-bold text-blue-900 mb-3">💡 Tip</h4>
              <p className="text-sm text-blue-800">
                You can download a signed copy once all signers have completed their signatures.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
