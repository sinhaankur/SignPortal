'use client'

import { useState } from 'react'
import Link from 'next/link'
import ProtectedLayout from '@/components/layouts/protected-layout'

interface Document {
  id: number
  name: string
  status: 'draft' | 'pending' | 'in_progress' | 'completed' | 'declined' | 'expired'
  type: string
  signers: { name: string; email: string; signed: boolean }[]
  createdAt: string
  updatedAt: string
  expiresAt?: string
  folder: string
  size: string
}

const initialDocuments: Document[] = [
  {
    id: 1,
    name: 'Employment Agreement - John Smith',
    status: 'completed',
    type: 'Contract',
    signers: [
      { name: 'John Smith', email: 'john@company.com', signed: true },
      { name: 'HR Manager', email: 'hr@company.com', signed: true },
    ],
    createdAt: '2026-02-15',
    updatedAt: '2026-02-20',
    folder: 'HR Documents',
    size: '245 KB',
  },
  {
    id: 2,
    name: 'NDA - Acme Corporation',
    status: 'pending',
    type: 'NDA',
    signers: [
      { name: 'Sarah Johnson', email: 'sarah@acme.com', signed: false },
      { name: 'Legal Team', email: 'legal@company.com', signed: true },
    ],
    createdAt: '2026-02-28',
    updatedAt: '2026-02-28',
    expiresAt: '2026-03-10',
    folder: 'Legal',
    size: '156 KB',
  },
  {
    id: 3,
    name: 'Service Agreement - Project Alpha',
    status: 'in_progress',
    type: 'Agreement',
    signers: [
      { name: 'Mike Chen', email: 'mike@client.com', signed: true },
      { name: 'Emily Davis', email: 'emily@company.com', signed: false },
      { name: 'Finance Team', email: 'finance@company.com', signed: false },
    ],
    createdAt: '2026-03-01',
    updatedAt: '2026-03-02',
    expiresAt: '2026-03-15',
    folder: 'Projects',
    size: '512 KB',
  },
  {
    id: 4,
    name: 'Vendor Contract - Supplies Co',
    status: 'draft',
    type: 'Contract',
    signers: [],
    createdAt: '2026-03-03',
    updatedAt: '2026-03-03',
    folder: 'Procurement',
    size: '89 KB',
  },
  {
    id: 5,
    name: 'Partnership Agreement - TechStart',
    status: 'declined',
    type: 'Agreement',
    signers: [
      { name: 'Alex Turner', email: 'alex@techstart.com', signed: false },
    ],
    createdAt: '2026-02-10',
    updatedAt: '2026-02-25',
    folder: 'Partnerships',
    size: '320 KB',
  },
  {
    id: 6,
    name: 'Lease Agreement - Office Space',
    status: 'expired',
    type: 'Lease',
    signers: [
      { name: 'Property Manager', email: 'manager@realty.com', signed: false },
    ],
    createdAt: '2026-01-15',
    updatedAt: '2026-02-15',
    expiresAt: '2026-02-28',
    folder: 'Real Estate',
    size: '1.2 MB',
  },
]

const folders = ['All Documents', 'HR Documents', 'Legal', 'Projects', 'Procurement', 'Partnerships', 'Real Estate']
const documentTypes = ['All Types', 'Contract', 'NDA', 'Agreement', 'Lease', 'Other']
const statusFilters = ['All Status', 'Draft', 'Pending', 'In Progress', 'Completed', 'Declined', 'Expired']

type ViewMode = 'list' | 'grid'

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFolder, setSelectedFolder] = useState('All Documents')
  const [selectedType, setSelectedType] = useState('All Types')
  const [selectedStatus, setSelectedStatus] = useState('All Status')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedDocs, setSelectedDocs] = useState<number[]>([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'status'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-amber-100 text-amber-700'
      case 'in_progress': return 'bg-blue-100 text-blue-700'
      case 'draft': return 'bg-gray-100 text-gray-700'
      case 'declined': return 'bg-red-100 text-red-700'
      case 'expired': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: Document['status']) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const filteredDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFolder = selectedFolder === 'All Documents' || doc.folder === selectedFolder
      const matchesType = selectedType === 'All Types' || doc.type === selectedType
      const matchesStatus = selectedStatus === 'All Status' || getStatusLabel(doc.status) === selectedStatus
      return matchesSearch && matchesFolder && matchesType && matchesStatus
    })
    .sort((a, b) => {
      let comparison = 0
      if (sortBy === 'name') comparison = a.name.localeCompare(b.name)
      else if (sortBy === 'date') comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      else if (sortBy === 'status') comparison = a.status.localeCompare(b.status)
      return sortOrder === 'asc' ? comparison : -comparison
    })

  const handleSelectAll = () => {
    if (selectedDocs.length === filteredDocuments.length) {
      setSelectedDocs([])
    } else {
      setSelectedDocs(filteredDocuments.map(d => d.id))
    }
  }

  const handleSelectDoc = (id: number) => {
    if (selectedDocs.includes(id)) {
      setSelectedDocs(selectedDocs.filter(d => d !== id))
    } else {
      setSelectedDocs([...selectedDocs, id])
    }
  }

  const handleBulkDelete = () => {
    setDocuments(documents.filter(d => !selectedDocs.includes(d.id)))
    setSelectedDocs([])
    setShowDeleteModal(false)
  }

  const handleDeleteDoc = (id: number) => {
    setDocuments(documents.filter(d => d.id !== id))
  }

  const stats = {
    total: documents.length,
    pending: documents.filter(d => d.status === 'pending').length,
    inProgress: documents.filter(d => d.status === 'in_progress').length,
    completed: documents.filter(d => d.status === 'completed').length,
  }

  // Zero state: no documents at all
  if (documents.length === 0) {
    return (
      <ProtectedLayout>
        <div className="max-w-2xl mx-auto py-24 text-center">
          <div className="w-24 h-24 mx-auto mb-8 bg-[#37322f]/5 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-[#37322f]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#37322f] mb-2">No Documents Yet</h1>
          <p className="text-[#37322f]/60 mb-6">You haven’t created or uploaded any documents. Start by creating your first document to begin your e-signature workflow.</p>
          <Link
            href="/documents/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#37322f] text-white rounded-xl font-semibold hover:bg-[#2a2520] transition-colors text-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Document
          </Link>
        </div>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#37322f]">Documents</h1>
            <p className="text-[#37322f]/60">Manage and track all your documents</p>
          </div>
          <div className="flex gap-3">
            {selectedDocs.length > 0 && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2.5 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors"
              >
                Delete ({selectedDocs.length})
              </button>
            )}
            <Link
              href="/documents/new"
              className="px-6 py-2.5 bg-[#37322f] text-white rounded-xl font-semibold hover:bg-[#2a2520] transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Document
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-[#37322f]/10">
            <p className="text-2xl font-bold text-[#37322f]">{stats.total}</p>
            <p className="text-sm text-[#37322f]/60">Total Documents</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#37322f]/10">
            <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
            <p className="text-sm text-[#37322f]/60">Awaiting Signatures</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#37322f]/10">
            <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            <p className="text-sm text-[#37322f]/60">In Progress</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#37322f]/10">
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-sm text-[#37322f]/60">Completed</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[#37322f]/10 p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#37322f]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 border border-[#37322f]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                />
              </div>
            </div>

            {/* Folder Filter */}
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="px-4 py-2.5 border border-[#37322f]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
            >
              {folders.map(f => <option key={f} value={f}>{f}</option>)}
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2.5 border border-[#37322f]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
            >
              {documentTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2.5 border border-[#37322f]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
            >
              {statusFilters.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'status')}
                className="px-3 py-2.5 border border-[#37322f]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322f]/20 text-sm"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="status">Sort by Status</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2.5 border border-[#37322f]/10 rounded-xl hover:bg-[#37322f]/5"
              >
                <svg className={`w-5 h-5 text-[#37322f]/60 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex border border-[#37322f]/10 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 ${viewMode === 'list' ? 'bg-[#37322f] text-white' : 'text-[#37322f]/60 hover:bg-[#37322f]/5'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 ${viewMode === 'grid' ? 'bg-[#37322f] text-white' : 'text-[#37322f]/60 hover:bg-[#37322f]/5'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* List View */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-xl border border-[#37322f]/10 overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#f7f5f3]">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedDocs.length === filteredDocuments.length && filteredDocuments.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 accent-[#37322f]"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322f]">Document</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322f]">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322f]">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322f]">Signers</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322f]">Updated</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-[#37322f]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#37322f]/5">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className={`hover:bg-[#f7f5f3]/50 transition-colors ${selectedDocs.includes(doc.id) ? 'bg-blue-50' : ''}`}>
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedDocs.includes(doc.id)}
                        onChange={() => handleSelectDoc(doc.id)}
                        className="w-4 h-4 accent-[#37322f]"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#37322f]/5 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-[#37322f]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-[#37322f]">{doc.name}</p>
                          <p className="text-xs text-[#37322f]/50">{doc.folder} • {doc.size}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-[#37322f]/70">{doc.type}</td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                        {getStatusLabel(doc.status)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        {doc.signers.slice(0, 3).map((signer, idx) => (
                          <div
                            key={idx}
                            title={`${signer.name} - ${signer.signed ? 'Signed' : 'Pending'}`}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 ${
                              signer.signed ? 'bg-green-100 border-green-300 text-green-700' : 'bg-amber-100 border-amber-300 text-amber-700'
                            } ${idx > 0 ? '-ml-2' : ''}`}
                          >
                            {signer.name.charAt(0)}
                          </div>
                        ))}
                        {doc.signers.length > 3 && (
                          <span className="text-xs text-[#37322f]/60 ml-1">+{doc.signers.length - 3}</span>
                        )}
                        {doc.signers.length === 0 && (
                          <span className="text-xs text-[#37322f]/40">No signers</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-[#37322f]/60">
                      {new Date(doc.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/documents/status/${doc.id}`}
                          className="p-2 hover:bg-[#37322f]/5 rounded-lg transition-colors"
                          title="View"
                        >
                          <svg className="w-5 h-5 text-[#37322f]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <Link
                          href={`/workflows/new?documentId=${doc.id}&documentName=${encodeURIComponent(doc.name)}`}
                          className="p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Start Workflow"
                        >
                          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </Link>
                        <button
                          className="p-2 hover:bg-[#37322f]/5 rounded-lg transition-colors"
                          title="Download"
                        >
                          <svg className="w-5 h-5 text-[#37322f]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteDoc(doc.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredDocuments.length === 0 && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#37322f]/5 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#37322f]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-[#37322f]/60 mb-4">No documents found</p>
                <Link
                  href="/documents/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#37322f] text-white rounded-lg font-medium hover:bg-[#37322f]/90"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Document
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className={`bg-white rounded-xl border border-[#37322f]/10 p-5 hover:shadow-md transition-shadow ${selectedDocs.includes(doc.id) ? 'ring-2 ring-[#37322f]' : ''}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <input
                    type="checkbox"
                    checked={selectedDocs.includes(doc.id)}
                    onChange={() => handleSelectDoc(doc.id)}
                    className="w-4 h-4 accent-[#37322f] mt-1"
                  />
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                    {getStatusLabel(doc.status)}
                  </span>
                </div>
                
                <div className="w-12 h-12 bg-[#37322f]/5 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#37322f]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>

                <h3 className="font-semibold text-[#37322f] mb-1 line-clamp-2">{doc.name}</h3>
                <p className="text-sm text-[#37322f]/60 mb-4">{doc.type} • {doc.folder}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {doc.signers.slice(0, 3).map((signer, idx) => (
                      <div
                        key={idx}
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border-2 ${
                          signer.signed ? 'bg-green-100 border-green-300 text-green-700' : 'bg-amber-100 border-amber-300 text-amber-700'
                        } ${idx > 0 ? '-ml-2' : ''}`}
                      >
                        {signer.name.charAt(0)}
                      </div>
                    ))}
                    {doc.signers.length > 3 && (
                      <span className="text-xs text-[#37322f]/60 ml-1">+{doc.signers.length - 3}</span>
                    )}
                  </div>
                  <span className="text-xs text-[#37322f]/50">{new Date(doc.updatedAt).toLocaleDateString()}</span>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/documents/status/${doc.id}`}
                    className="flex-1 py-2 text-center text-sm font-medium text-[#37322f] border border-[#37322f]/20 rounded-lg hover:bg-[#37322f]/5 transition-colors"
                  >
                    View
                  </Link>
                  <Link
                    href={`/workflows/new?documentId=${doc.id}&documentName=${encodeURIComponent(doc.name)}`}
                    className="px-3 py-2 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
                    title="Start Workflow"
                  >
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </Link>
                  <button className="px-3 py-2 border border-[#37322f]/20 rounded-lg hover:bg-[#37322f]/5 transition-colors">
                    <svg className="w-4 h-4 text-[#37322f]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteDoc(doc.id)}
                    className="px-3 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {filteredDocuments.length === 0 && (
              <div className="col-span-full bg-white rounded-xl border border-[#37322f]/10 p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#37322f]/5 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#37322f]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-[#37322f]/60 mb-4">No documents found</p>
                <Link
                  href="/documents/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#37322f] text-white rounded-lg font-medium hover:bg-[#37322f]/90"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Document
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-[#37322f] text-center mb-2">Delete Documents</h2>
              <p className="text-[#37322f]/60 text-center mb-6">
                Are you sure you want to delete {selectedDocs.length} document{selectedDocs.length > 1 ? 's' : ''}? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 border border-[#37322f]/20 rounded-xl font-medium text-[#37322f] hover:bg-[#37322f]/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  )
}
