'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  CheckCircle2,
  Play,
  Pause,
  Trash2,
  Copy,
  Edit2,
  Users,
  Zap
} from 'lucide-react'
import ProtectedLayout from '@/components/layouts/protected-layout'

interface Workflow {
  id: string
  name: string
  description: string
  status: 'active' | 'draft' | 'paused'
  signerCount: number
  stepsCount: number
  lastRun: string | null
  runsTotal: number
  successRate: number
  createdAt: string
  updatedAt: string
}

// Sample workflows
const sampleWorkflows: Workflow[] = [
  {
    id: 'wf-001',
    name: 'Standard Contract Approval',
    description: 'Sequential approval workflow for standard business contracts',
    status: 'active',
    signerCount: 3,
    stepsCount: 5,
    lastRun: '2024-01-15T10:30:00',
    runsTotal: 156,
    successRate: 94,
    createdAt: '2024-01-01T00:00:00',
    updatedAt: '2024-01-15T10:30:00'
  },
  {
    id: 'wf-002',
    name: 'NDA Internal Review',
    description: 'Internal review process for non-disclosure agreements',
    status: 'active',
    signerCount: 2,
    stepsCount: 4,
    lastRun: '2024-01-14T14:20:00',
    runsTotal: 89,
    successRate: 98,
    createdAt: '2024-01-05T00:00:00',
    updatedAt: '2024-01-14T14:20:00'
  },
  {
    id: 'wf-003',
    name: 'Multi-Party Agreement',
    description: 'Parallel signature collection from multiple parties',
    status: 'draft',
    signerCount: 5,
    stepsCount: 7,
    lastRun: null,
    runsTotal: 0,
    successRate: 0,
    createdAt: '2024-01-10T00:00:00',
    updatedAt: '2024-01-10T00:00:00'
  },
  {
    id: 'wf-004',
    name: 'Executive Approval Chain',
    description: 'High-value contract approval requiring executive sign-off',
    status: 'paused',
    signerCount: 4,
    stepsCount: 6,
    lastRun: '2024-01-12T09:15:00',
    runsTotal: 23,
    successRate: 87,
    createdAt: '2024-01-03T00:00:00',
    updatedAt: '2024-01-12T09:15:00'
  }
]

export default function WorkflowsPage() {
  const [workflows] = useState<Workflow[]>(sampleWorkflows)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft' | 'paused'>('all')

  // Filter workflows
  const filteredWorkflows = workflows.filter(wf => {
    const matchesSearch = wf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         wf.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || wf.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Stats
  const activeWorkflows = workflows.filter(w => w.status === 'active').length
  const totalRuns = workflows.reduce((sum, w) => sum + w.runsTotal, 0)
  const avgSuccessRate = workflows.filter(w => w.runsTotal > 0).length > 0
    ? Math.round(workflows.filter(w => w.runsTotal > 0).reduce((sum, w) => sum + w.successRate, 0) / workflows.filter(w => w.runsTotal > 0).length)
    : 0

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <ProtectedLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#37322f]">Signature Workflows</h1>
            <p className="text-gray-600 text-sm mt-1">
              Create and manage automated signature workflows for your documents
            </p>
          </div>
          <Link 
            href="/workflows/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#37322f] text-white rounded-lg hover:bg-[#4a443f] transition"
          >
            <Plus size={18} />
            <span className="font-medium">New Workflow</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Play size={18} className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#37322f]">{activeWorkflows}</p>
                <p className="text-sm text-gray-500">Active Workflows</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Zap size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#37322f]">{totalRuns}</p>
                <p className="text-sm text-gray-500">Total Runs</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 size={18} className="text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#37322f]">{avgSuccessRate}%</p>
                <p className="text-sm text-gray-500">Avg Success Rate</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users size={18} className="text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#37322f]">
                  {workflows.reduce((sum, w) => sum + w.signerCount, 0)}
                </p>
                <p className="text-sm text-gray-500">Total Signers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="p-4 flex items-center gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search workflows..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'draft' | 'paused')}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>
        </div>

        {/* Workflows List */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Workflow</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Signers</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Runs</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Success Rate</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Run</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredWorkflows.map(workflow => (
                <tr key={workflow.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <Link href={`/workflows/${workflow.id}`} className="block group">
                      <p className="font-semibold text-[#37322f] group-hover:text-blue-600 transition">
                        {workflow.name}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">{workflow.description}</p>
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      workflow.status === 'active' ? 'bg-green-100 text-green-700' :
                      workflow.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {workflow.status === 'active' && <Play size={12} />}
                      {workflow.status === 'paused' && <Pause size={12} />}
                      {workflow.status === 'draft' && <FileText size={12} />}
                      {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Users size={14} className="text-gray-400" />
                      <span className="font-medium text-[#37322f]">{workflow.signerCount}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="font-medium text-[#37322f]">{workflow.runsTotal}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {workflow.runsTotal > 0 ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div 
                            className={`h-2 rounded-full ${
                              workflow.successRate >= 90 ? 'bg-green-500' :
                              workflow.successRate >= 70 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${workflow.successRate}%` }}
                          />
                        </div>
                        <span className="font-medium text-[#37322f] text-sm">{workflow.successRate}%</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">--</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {workflow.lastRun ? (
                      <span className="text-sm text-gray-600">{formatDate(workflow.lastRun)}</span>
                    ) : (
                      <span className="text-gray-400 text-sm">Never</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Link
                        href={`/workflows/${workflow.id}`}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit2 size={16} className="text-gray-500" />
                      </Link>
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title="Duplicate"
                      >
                        <Copy size={16} className="text-gray-500" />
                      </button>
                      <button
                        className="p-2 hover:bg-red-100 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredWorkflows.length === 0 && (
            <div className="px-6 py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500">No workflows found</p>
              <Link
                href="/workflows/new"
                className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:underline"
              >
                <Plus size={16} />
                Create your first workflow
              </Link>
            </div>
          )}
        </div>
      </div>
    </ProtectedLayout>
  )
}
