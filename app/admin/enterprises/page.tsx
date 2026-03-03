"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Building2, 
  Search, 
  Plus, 
  Filter, 
  ChevronLeft,
  Shield,
  Database,
  Users,
  Key,
  Lock,
  Server,
  Activity,
  Settings,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertTriangle,
  Globe,
  HardDrive,
  Network,
  Trash2,
  Edit,
  Eye,
  RefreshCw,
  Download,
  Upload
} from "lucide-react"

interface Enterprise {
  id: string
  name: string
  domain: string
  industry: string
  users: number
  documents: number
  storage: string
  status: "active" | "pending" | "suspended"
  tier: "Enterprise" | "Business" | "Trial"
  adSync: boolean
  silo: string
  createdAt: string
  lastActivity: string
}

export default function EnterpriseManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterTier, setFilterTier] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedEnterprises, setSelectedEnterprises] = useState<string[]>([])
  const [showNewEnterpriseModal, setShowNewEnterpriseModal] = useState(false)

  const enterprises: Enterprise[] = [
    {
      id: "ent-001",
      name: "Global Financial Services",
      domain: "globalfinancial.com",
      industry: "Finance & Banking",
      users: 2340,
      documents: 45230,
      storage: "128 GB",
      status: "active",
      tier: "Enterprise",
      adSync: true,
      silo: "SILO-01",
      createdAt: "2024-01-15",
      lastActivity: "2 minutes ago"
    },
    {
      id: "ent-002",
      name: "Healthcare United",
      domain: "healthcareunited.org",
      industry: "Healthcare",
      users: 890,
      documents: 23450,
      storage: "67 GB",
      status: "active",
      tier: "Enterprise",
      adSync: true,
      silo: "SILO-02",
      createdAt: "2024-02-20",
      lastActivity: "15 minutes ago"
    },
    {
      id: "ent-003",
      name: "Legal Partners LLP",
      domain: "legalpartners.law",
      industry: "Legal",
      users: 156,
      documents: 8920,
      storage: "23 GB",
      status: "pending",
      tier: "Enterprise",
      adSync: false,
      silo: "SILO-03",
      createdAt: "2026-03-01",
      lastActivity: "1 hour ago"
    },
    {
      id: "ent-004",
      name: "TechStart Inc",
      domain: "techstart.io",
      industry: "Technology",
      users: 45,
      documents: 1230,
      storage: "5 GB",
      status: "active",
      tier: "Business",
      adSync: false,
      silo: "SILO-04",
      createdAt: "2026-02-10",
      lastActivity: "3 hours ago"
    },
    {
      id: "ent-005",
      name: "Manufacturing Corp",
      domain: "mfgcorp.com",
      industry: "Manufacturing",
      users: 567,
      documents: 12340,
      storage: "34 GB",
      status: "active",
      tier: "Enterprise",
      adSync: true,
      silo: "SILO-05",
      createdAt: "2024-06-15",
      lastActivity: "30 minutes ago"
    },
    {
      id: "ent-006",
      name: "Government Agency",
      domain: "gov.agency.gov",
      industry: "Government",
      users: 1234,
      documents: 34560,
      storage: "89 GB",
      status: "active",
      tier: "Enterprise",
      adSync: true,
      silo: "SILO-06",
      createdAt: "2023-11-01",
      lastActivity: "5 minutes ago"
    }
  ]

  const filteredEnterprises = enterprises.filter(ent => {
    const matchesSearch = ent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ent.domain.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTier = filterTier === "all" || ent.tier === filterTier
    const matchesStatus = filterStatus === "all" || ent.status === filterStatus
    return matchesSearch && matchesTier && matchesStatus
  })

  const toggleSelect = (id: string) => {
    setSelectedEnterprises(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    if (selectedEnterprises.length === filteredEnterprises.length) {
      setSelectedEnterprises([])
    } else {
      setSelectedEnterprises(filteredEnterprises.map(e => e.id))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin" 
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button 
                onClick={() => setShowNewEnterpriseModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Enterprise
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Enterprise Management</h1>
              <p className="text-slate-400">Manage all enterprises and their isolated data environments</p>
            </div>
          </div>
        </div>

        {/* Data Isolation Info Banner */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">Airtight Data Isolation Architecture</h3>
              <p className="text-slate-300 text-sm mb-4">
                Each enterprise operates within a completely isolated environment with dedicated database schemas, 
                segregated encryption keys, and independent storage partitions. Cross-tenant access is technically 
                restricted at the application layer.
              </p>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Database className="w-4 h-4 text-purple-400" />
                  <span>Isolated Database Schema</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Key className="w-4 h-4 text-green-400" />
                  <span>Segregated Encryption Keys</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <HardDrive className="w-4 h-4 text-blue-400" />
                  <span>Independent Storage</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Tenant-Level Access Control</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Enterprises</p>
                <p className="text-2xl font-bold text-white">{enterprises.length}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-400/50" />
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Enterprise Tier</p>
                <p className="text-2xl font-bold text-white">{enterprises.filter(e => e.tier === "Enterprise").length}</p>
              </div>
              <Shield className="w-8 h-8 text-purple-400/50" />
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">AD Sync Enabled</p>
                <p className="text-2xl font-bold text-white">{enterprises.filter(e => e.adSync).length}</p>
              </div>
              <RefreshCw className="w-8 h-8 text-green-400/50" />
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Users</p>
                <p className="text-2xl font-bold text-white">{enterprises.reduce((sum, e) => sum + e.users, 0).toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-amber-400/50" />
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search enterprises by name or domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            >
              <option value="all">All Tiers</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Business">Business</option>
              <option value="Trial">Trial</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedEnterprises.length > 0 && (
          <div className="bg-amber-900/30 border border-amber-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-amber-400">
                {selectedEnterprises.length} enterprise(s) selected
              </span>
              <div className="flex items-center gap-3">
                <button className="px-3 py-1.5 text-sm bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600">
                  Export Selected
                </button>
                <button className="px-3 py-1.5 text-sm bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30">
                  Suspend Selected
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enterprise Table */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="py-4 px-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedEnterprises.length === filteredEnterprises.length && filteredEnterprises.length > 0}
                    onChange={selectAll}
                    className="w-4 h-4 rounded border-slate-500 text-amber-500 focus:ring-amber-500/50"
                  />
                </th>
                <th className="py-4 px-4 text-left text-sm font-medium text-slate-400">Enterprise</th>
                <th className="py-4 px-4 text-left text-sm font-medium text-slate-400">Industry</th>
                <th className="py-4 px-4 text-left text-sm font-medium text-slate-400">Users</th>
                <th className="py-4 px-4 text-left text-sm font-medium text-slate-400">Tier</th>
                <th className="py-4 px-4 text-left text-sm font-medium text-slate-400">Data Silo</th>
                <th className="py-4 px-4 text-left text-sm font-medium text-slate-400">AD Sync</th>
                <th className="py-4 px-4 text-left text-sm font-medium text-slate-400">Status</th>
                <th className="py-4 px-4 text-right text-sm font-medium text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnterprises.map((enterprise) => (
                <tr key={enterprise.id} className="border-t border-slate-700/50 hover:bg-slate-700/20">
                  <td className="py-4 px-4">
                    <input
                      type="checkbox"
                      checked={selectedEnterprises.includes(enterprise.id)}
                      onChange={() => toggleSelect(enterprise.id)}
                      className="w-4 h-4 rounded border-slate-500 text-amber-500 focus:ring-amber-500/50"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{enterprise.name}</p>
                        <p className="text-xs text-slate-400">{enterprise.domain}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-300">{enterprise.industry}</td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-white">{enterprise.users.toLocaleString()}</p>
                      <p className="text-xs text-slate-400">{enterprise.documents.toLocaleString()} docs</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      enterprise.tier === 'Enterprise' 
                        ? 'bg-purple-500/20 text-purple-400' 
                        : enterprise.tier === 'Business'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      {enterprise.tier}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-green-400" />
                      <span className="text-slate-300 font-mono text-sm">{enterprise.silo}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {enterprise.adSync ? (
                      <span className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Enabled</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Disabled</span>
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`flex items-center gap-2 ${
                      enterprise.status === 'active' ? 'text-green-400' :
                      enterprise.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        enterprise.status === 'active' ? 'bg-green-400' :
                        enterprise.status === 'pending' ? 'bg-yellow-400' : 'bg-red-400'
                      }`}></span>
                      <span className="capitalize text-sm">{enterprise.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Compliance & Architecture Info */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              Compliance Ready Architecture
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <span className="text-slate-300">HIPAA Compliant</span>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <span className="text-slate-300">GDPR Ready</span>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <span className="text-slate-300">SOC2 Architecture</span>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <span className="text-slate-300">Zero Cross-Tenant Visibility</span>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-400" />
              Data Silo Provisioning
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Each new enterprise is automatically provisioned with:
            </p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                Dedicated MySQL schema with isolated tables
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                Unique AES-256 encryption key per tenant
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                Separate storage partition for documents
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                Independent audit log stream
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                Dedicated Redis cache namespace
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
