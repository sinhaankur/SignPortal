'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Users,
  UserPlus,
  Upload,
  Download,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Mail,
  Phone,
  Building2,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
  RefreshCw,
  Settings,
  ChevronDown,
  X,
  Check,
  Loader2,
  Eye,
  EyeOff,
  FolderSync,
  Key
} from 'lucide-react'
import {
  rbacService,
  type User,
  type Designation,
  type CSVUserRow,
  formatDesignationLabel,
  DESIGNATION_HIERARCHY,
  CSV_TEMPLATE
} from '@/lib/rbac'

// Mock current user (would come from auth context in real app)
const mockCurrentUser: User = {
  id: 'current-user',
  email: 'admin@company.com',
  name: 'Admin User',
  designation: 'admin',
  department: 'IT',
  companyId: 'company-1',
  status: 'active',
  createdAt: '2024-01-01T00:00:00Z'
}

// Mock team members
const mockTeamMembers: User[] = [
  {
    id: '1',
    email: 'john.doe@company.com',
    name: 'John Doe',
    designation: 'director',
    department: 'Engineering',
    companyId: 'company-1',
    status: 'active',
    employeeId: 'EMP001',
    createdAt: '2024-01-15T00:00:00Z',
    lastLogin: '2024-03-01T10:30:00Z'
  },
  {
    id: '2',
    email: 'jane.smith@company.com',
    name: 'Jane Smith',
    designation: 'manager',
    department: 'Engineering',
    companyId: 'company-1',
    managerId: '1',
    status: 'active',
    employeeId: 'EMP002',
    createdAt: '2024-01-20T00:00:00Z',
    lastLogin: '2024-03-02T09:15:00Z'
  },
  {
    id: '3',
    email: 'mike.wilson@company.com',
    name: 'Mike Wilson',
    designation: 'senior_analyst',
    department: 'Sales',
    companyId: 'company-1',
    status: 'active',
    employeeId: 'EMP003',
    createdAt: '2024-02-01T00:00:00Z',
    lastLogin: '2024-03-03T14:00:00Z'
  },
  {
    id: '4',
    email: 'sarah.johnson@company.com',
    name: 'Sarah Johnson',
    designation: 'analyst',
    department: 'HR',
    companyId: 'company-1',
    managerId: '2',
    status: 'pending',
    employeeId: 'EMP004',
    createdAt: '2024-03-01T00:00:00Z'
  },
  {
    id: '5',
    email: 'tom.brown@company.com',
    name: 'Tom Brown',
    designation: 'team_lead',
    department: 'Engineering',
    companyId: 'company-1',
    managerId: '2',
    status: 'inactive',
    employeeId: 'EMP005',
    createdAt: '2024-01-10T00:00:00Z',
    lastLogin: '2024-01-15T08:00:00Z'
  }
]

type ViewMode = 'list' | 'csv' | 'ad'
type ModalType = 'invite' | 'edit' | 'delete' | 'csv-preview' | 'ad-config' | null

export default function TeamManagementPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)
  const [currentUser, setCurrentUser] = useState<User>(mockCurrentUser)
  const [teamMembers, setTeamMembers] = useState<User[]>(mockTeamMembers)
  const [filteredMembers, setFilteredMembers] = useState<User[]>(mockTeamMembers)
  
  // UI State
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [modalType, setModalType] = useState<ModalType>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDesignation, setFilterDesignation] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterDepartment, setFilterDepartment] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    designation: 'analyst' as Designation,
    department: '',
    phoneNumber: '',
    employeeId: ''
  })

  // CSV state
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvPreview, setCsvPreview] = useState<CSVUserRow[]>([])
  const [csvErrors, setCsvErrors] = useState<string[]>([])
  const [csvWarnings, setCsvWarnings] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // AD Config state
  const [adConfig, setAdConfig] = useState({
    tenantId: '',
    clientId: '',
    domain: '',
    syncEnabled: false,
    syncSchedule: 'daily' as const
  })

  // Initialize RBAC
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn')
    if (!loggedIn) {
      router.push('/login')
      return
    }
    setIsLoggedIn(true)

    // Initialize RBAC with current user
    rbacService.initialize(currentUser)
    
    // Check if user has access to team management
    const canAccess = rbacService.canAccessTeamManagement()
    setHasAccess(canAccess)

    if (!canAccess) {
      // Redirect if no access
      // In a real app, show access denied page
    }
  }, [router, currentUser])

  // Filter members
  useEffect(() => {
    let filtered = [...teamMembers]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(query) ||
        m.email.toLowerCase().includes(query) ||
        m.department.toLowerCase().includes(query) ||
        m.employeeId?.toLowerCase().includes(query)
      )
    }

    // Designation filter
    if (filterDesignation !== 'all') {
      filtered = filtered.filter(m => m.designation === filterDesignation)
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(m => m.status === filterStatus)
    }

    // Department filter
    if (filterDepartment !== 'all') {
      filtered = filtered.filter(m => m.department === filterDepartment)
    }

    setFilteredMembers(filtered)
  }, [teamMembers, searchQuery, filterDesignation, filterStatus, filterDepartment])

  // Get unique departments
  const departments = [...new Set(teamMembers.map(m => m.department))]

  // Handle invite user
  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000))

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: formData.email,
      name: formData.name,
      designation: formData.designation,
      department: formData.department,
      companyId: currentUser.companyId,
      status: 'pending',
      employeeId: formData.employeeId || undefined,
      phoneNumber: formData.phoneNumber || undefined,
      createdAt: new Date().toISOString()
    }

    setTeamMembers(prev => [...prev, newUser])
    setModalType(null)
    resetForm()
    setIsLoading(false)
  }

  // Handle edit user
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return
    
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1000))

    setTeamMembers(prev => prev.map(m =>
      m.id === selectedUser.id
        ? {
            ...m,
            name: formData.name,
            designation: formData.designation,
            department: formData.department,
            phoneNumber: formData.phoneNumber || undefined,
            employeeId: formData.employeeId || undefined
          }
        : m
    ))

    setModalType(null)
    setSelectedUser(null)
    resetForm()
    setIsLoading(false)
  }

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!selectedUser) return
    
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1000))

    setTeamMembers(prev => prev.filter(m => m.id !== selectedUser.id))
    setModalType(null)
    setSelectedUser(null)
    setIsLoading(false)
  }

  // Handle CSV file upload
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCsvFile(file)
    const reader = new FileReader()
    
    reader.onload = (event) => {
      const content = event.target?.result as string
      const { users, errors } = rbacService.parseCSVContent(content)
      
      setCsvErrors(errors)
      setCsvPreview(users)

      if (users.length > 0) {
        const { warnings } = rbacService.validateCSVImport(users)
        setCsvWarnings(warnings)
      }

      setModalType('csv-preview')
    }

    reader.readAsText(file)
  }

  // Handle CSV import
  const handleCSVImport = async () => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 2000))

    // Convert CSV rows to users
    const newUsers: User[] = csvPreview.map((row, idx) => ({
      id: `imported-${Date.now()}-${idx}`,
      email: row.email,
      name: row.name,
      designation: row.designation as Designation,
      department: row.department,
      companyId: currentUser.companyId,
      status: 'pending' as const,
      employeeId: row.employeeId,
      phoneNumber: row.phoneNumber,
      createdAt: new Date().toISOString()
    }))

    setTeamMembers(prev => [...prev, ...newUsers])
    setModalType(null)
    setCsvFile(null)
    setCsvPreview([])
    setCsvErrors([])
    setCsvWarnings([])
    setIsLoading(false)
  }

  // Download CSV template
  const downloadCSVTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'team_import_template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Export current team as CSV
  const exportTeamCSV = () => {
    const headers = ['email', 'name', 'designation', 'department', 'employee_id', 'status', 'created_at']
    const rows = teamMembers.map(m => 
      [m.email, m.name, m.designation, m.department, m.employeeId || '', m.status, m.createdAt].join(',')
    )
    const csv = [headers.join(','), ...rows].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `team_export_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Handle AD sync
  const handleADSync = async () => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 3000))
    // Simulate sync
    alert('Active Directory sync completed! 5 users synced.')
    setIsLoading(false)
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      email: '',
      name: '',
      designation: 'analyst',
      department: '',
      phoneNumber: '',
      employeeId: ''
    })
  }

  // Open edit modal
  const openEditModal = (user: User) => {
    setSelectedUser(user)
    setFormData({
      email: user.email,
      name: user.name,
      designation: user.designation,
      department: user.department,
      phoneNumber: user.phoneNumber || '',
      employeeId: user.employeeId || ''
    })
    setModalType('edit')
    setActionMenuOpen(null)
  }

  // Open delete modal
  const openDeleteModal = (user: User) => {
    setSelectedUser(user)
    setModalType('delete')
    setActionMenuOpen(null)
  }

  // Get status badge
  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" /> Active
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
            <Clock className="w-3 h-3" /> Pending
          </span>
        )
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
            <XCircle className="w-3 h-3" /> Inactive
          </span>
        )
    }
  }

  // Get designation badge color
  const getDesignationColor = (designation: Designation): string => {
    const level = DESIGNATION_HIERARCHY[designation] || 0
    if (level >= 10) return 'bg-purple-100 text-purple-700'
    if (level >= 8) return 'bg-indigo-100 text-indigo-700'
    if (level >= 6) return 'bg-blue-100 text-blue-700'
    if (level >= 4) return 'bg-cyan-100 text-cyan-700'
    return 'bg-gray-100 text-gray-700'
  }

  if (!isLoggedIn) return null

  // Access denied view
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#f7f5f3] flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#37322f] mb-2">Access Denied</h1>
          <p className="text-[#37322f]/60 mb-6">
            Team management is only available for Manager level and above.
            Please contact your administrator if you believe this is an error.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-[#37322f] text-white rounded-lg font-medium hover:bg-[#37322f]/90 transition"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f5f3]">
      {/* Header */}
      <header className="w-full border-b border-[#37322f]/6 bg-white sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto px-4">
          <nav className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 px-3 py-2 text-[#37322f]/70 hover:bg-[#37322f]/5 rounded-lg transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-sm font-medium">Back</span>
              </button>
              <div className="w-px h-6 bg-[#37322f]/10" />
              <Link href="/" className="text-[#37322f] font-semibold text-lg">SignPortal</Link>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#37322f]/60">
                Logged in as <span className="font-medium text-[#37322f]">{currentUser.name}</span>
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded ${getDesignationColor(currentUser.designation)}`}>
                {formatDesignationLabel(currentUser.designation)}
              </span>
            </div>
          </nav>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#37322f] flex items-center gap-3">
              <Users className="w-8 h-8" />
              Team Management
            </h1>
            <p className="text-[#37322f]/60 mt-1">
              Manage team members, designations, and access control
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* View Mode Tabs */}
            <div className="flex bg-white rounded-lg border border-[#37322f]/10 p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                  viewMode === 'list' 
                    ? 'bg-[#37322f] text-white' 
                    : 'text-[#37322f]/70 hover:text-[#37322f]'
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                Team List
              </button>
              <button
                onClick={() => setViewMode('csv')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                  viewMode === 'csv' 
                    ? 'bg-[#37322f] text-white' 
                    : 'text-[#37322f]/70 hover:text-[#37322f]'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 inline mr-2" />
                CSV Import
              </button>
              <button
                onClick={() => setViewMode('ad')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                  viewMode === 'ad' 
                    ? 'bg-[#37322f] text-white' 
                    : 'text-[#37322f]/70 hover:text-[#37322f]'
                }`}
              >
                <FolderSync className="w-4 h-4 inline mr-2" />
                Active Directory
              </button>
            </div>
          </div>
        </div>

        {/* Team List View */}
        {viewMode === 'list' && (
          <>
            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#37322f]/40" />
                <input
                  type="text"
                  placeholder="Search by name, email, department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#37322f]/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 flex items-center gap-2 bg-white border rounded-lg transition ${
                  showFilters ? 'border-[#37322f] text-[#37322f]' : 'border-[#37322f]/10 text-[#37322f]/70'
                }`}
              >
                <Filter className="w-5 h-5" />
                Filters
                {(filterDesignation !== 'all' || filterStatus !== 'all' || filterDepartment !== 'all') && (
                  <span className="w-5 h-5 bg-[#37322f] text-white text-xs rounded-full flex items-center justify-center">
                    {[filterDesignation, filterStatus, filterDepartment].filter(f => f !== 'all').length}
                  </span>
                )}
              </button>

              {/* Export */}
              <button
                onClick={exportTeamCSV}
                className="px-4 py-3 flex items-center gap-2 bg-white border border-[#37322f]/10 rounded-lg text-[#37322f]/70 hover:text-[#37322f] hover:border-[#37322f]/20 transition"
              >
                <Download className="w-5 h-5" />
                Export
              </button>

              {/* Add Member */}
              <button
                onClick={() => {
                  resetForm()
                  setModalType('invite')
                }}
                className="px-6 py-3 flex items-center gap-2 bg-[#37322f] text-white rounded-lg font-medium hover:bg-[#37322f]/90 transition"
              >
                <UserPlus className="w-5 h-5" />
                Add Member
              </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-white rounded-lg border border-[#37322f]/10 p-4 mb-6 flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-[#37322f] mb-2">Designation</label>
                  <select
                    value={filterDesignation}
                    onChange={(e) => setFilterDesignation(e.target.value)}
                    className="w-full px-3 py-2 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                  >
                    <option value="all">All Designations</option>
                    {Object.keys(DESIGNATION_HIERARCHY).filter(d => d !== 'admin').map(d => (
                      <option key={d} value={d}>{formatDesignationLabel(d as Designation)}</option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-[#37322f] mb-2">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-[#37322f] mb-2">Department</label>
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                  >
                    <option value="all">All Departments</option>
                    {departments.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    setFilterDesignation('all')
                    setFilterStatus('all')
                    setFilterDepartment('all')
                  }}
                  className="self-end px-4 py-2 text-sm text-[#37322f]/70 hover:text-[#37322f] transition"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg border border-[#37322f]/10 p-4">
                <p className="text-sm text-[#37322f]/60">Total Members</p>
                <p className="text-2xl font-bold text-[#37322f]">{teamMembers.length}</p>
              </div>
              <div className="bg-white rounded-lg border border-[#37322f]/10 p-4">
                <p className="text-sm text-[#37322f]/60">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {teamMembers.filter(m => m.status === 'active').length}
                </p>
              </div>
              <div className="bg-white rounded-lg border border-[#37322f]/10 p-4">
                <p className="text-sm text-[#37322f]/60">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {teamMembers.filter(m => m.status === 'pending').length}
                </p>
              </div>
              <div className="bg-white rounded-lg border border-[#37322f]/10 p-4">
                <p className="text-sm text-[#37322f]/60">Managers+</p>
                <p className="text-2xl font-bold text-blue-600">
                  {teamMembers.filter(m => rbacService.isManagerOrAbove({ ...m, companyId: currentUser.companyId })).length}
                </p>
              </div>
            </div>

            {/* Team Table */}
            <div className="bg-white rounded-xl border border-[#37322f]/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#f7f5f3] border-b border-[#37322f]/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#37322f]">Member</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#37322f]">Designation</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#37322f]">Department</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#37322f]">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#37322f]">Last Active</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-[#37322f]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#37322f]/5">
                    {filteredMembers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-[#37322f]/60">
                          <Users className="w-12 h-12 mx-auto text-[#37322f]/20 mb-4" />
                          <p className="font-medium">No team members found</p>
                          <p className="text-sm">Try adjusting your filters or add new members</p>
                        </td>
                      </tr>
                    ) : (
                      filteredMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-[#f7f5f3]/50 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#37322f]/10 flex items-center justify-center text-[#37322f] font-medium">
                                {member.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-[#37322f]">{member.name}</p>
                                <p className="text-sm text-[#37322f]/60">{member.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getDesignationColor(member.designation)}`}>
                              {formatDesignationLabel(member.designation)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-[#37322f]/70">
                              <Building2 className="w-4 h-4" />
                              {member.department}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(member.status)}
                          </td>
                          <td className="px-6 py-4 text-sm text-[#37322f]/60">
                            {member.lastLogin 
                              ? new Date(member.lastLogin).toLocaleDateString()
                              : 'Never'
                            }
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="relative inline-block">
                              <button
                                onClick={() => setActionMenuOpen(actionMenuOpen === member.id ? null : member.id)}
                                className="p-2 hover:bg-[#37322f]/5 rounded-lg transition"
                              >
                                <MoreVertical className="w-5 h-5 text-[#37322f]/60" />
                              </button>

                              {actionMenuOpen === member.id && (
                                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-[#37322f]/10 py-1 z-50">
                                  <button
                                    onClick={() => openEditModal(member)}
                                    className="w-full px-4 py-2 text-left text-sm text-[#37322f] hover:bg-[#f7f5f3] flex items-center gap-2"
                                  >
                                    <Edit className="w-4 h-4" /> Edit Member
                                  </button>
                                  <button
                                    onClick={() => {
                                      // Toggle status
                                      setTeamMembers(prev => prev.map(m =>
                                        m.id === member.id
                                          ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' }
                                          : m
                                      ))
                                      setActionMenuOpen(null)
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-[#37322f] hover:bg-[#f7f5f3] flex items-center gap-2"
                                  >
                                    {member.status === 'active' ? (
                                      <><EyeOff className="w-4 h-4" /> Deactivate</>
                                    ) : (
                                      <><Eye className="w-4 h-4" /> Activate</>
                                    )}
                                  </button>
                                  <hr className="my-1 border-[#37322f]/10" />
                                  <button
                                    onClick={() => openDeleteModal(member)}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                  >
                                    <Trash2 className="w-4 h-4" /> Remove Member
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* CSV Import View */}
        {viewMode === 'csv' && (
          <div className="bg-white rounded-xl border border-[#37322f]/10 p-8">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <FileSpreadsheet className="w-16 h-16 text-[#37322f]/30 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-[#37322f] mb-2">Bulk Import Users</h2>
                <p className="text-[#37322f]/60">
                  Upload a CSV file to add multiple team members at once.
                  Only System Administrators can perform bulk imports.
                </p>
              </div>

              <div className="space-y-6">
                {/* Download Template */}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-900">Download CSV Template</p>
                    <p className="text-sm text-blue-700">Get the correct format for importing users</p>
                  </div>
                  <button
                    onClick={downloadCSVTemplate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>

                {/* Upload Area */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#37322f]/20 rounded-xl p-12 text-center cursor-pointer hover:border-[#37322f]/40 hover:bg-[#f7f5f3]/50 transition"
                >
                  <Upload className="w-12 h-12 text-[#37322f]/30 mx-auto mb-4" />
                  <p className="font-medium text-[#37322f]">Click to upload CSV file</p>
                  <p className="text-sm text-[#37322f]/60 mt-1">or drag and drop</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleCSVUpload}
                    className="hidden"
                  />
                </div>

                {/* Required Columns */}
                <div className="bg-[#f7f5f3] rounded-lg p-6">
                  <h3 className="font-semibold text-[#37322f] mb-3">Required CSV Columns</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm text-[#37322f]/70">
                      <Check className="w-4 h-4 text-green-500" /> email (required)
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#37322f]/70">
                      <Check className="w-4 h-4 text-green-500" /> name (required)
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#37322f]/70">
                      <Check className="w-4 h-4 text-green-500" /> designation (required)
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#37322f]/70">
                      <Check className="w-4 h-4 text-green-500" /> department (required)
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#37322f]/70">
                      <span className="w-4 h-4 text-center text-gray-400">○</span> employee_id (optional)
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#37322f]/70">
                      <span className="w-4 h-4 text-center text-gray-400">○</span> phone_number (optional)
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#37322f]/70">
                      <span className="w-4 h-4 text-center text-gray-400">○</span> manager_email (optional)
                    </div>
                  </div>
                </div>

                {/* Valid Designations */}
                <div className="bg-[#f7f5f3] rounded-lg p-6">
                  <h3 className="font-semibold text-[#37322f] mb-3">Valid Designations</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(DESIGNATION_HIERARCHY).filter(d => d !== 'admin').map(d => (
                      <span key={d} className={`px-2 py-1 text-xs font-medium rounded ${getDesignationColor(d as Designation)}`}>
                        {d.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Directory View */}
        {viewMode === 'ad' && (
          <div className="bg-white rounded-xl border border-[#37322f]/10 p-8">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <FolderSync className="w-16 h-16 text-[#37322f]/30 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-[#37322f] mb-2">Active Directory Integration</h2>
                <p className="text-[#37322f]/60">
                  Sync your organization's users from Microsoft Azure Active Directory
                  or on-premises Active Directory.
                </p>
              </div>

              {/* Connection Status */}
              <div className="mb-8 p-4 bg-yellow-50 rounded-lg flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-900">Not Connected</p>
                  <p className="text-sm text-yellow-700">Configure your AD settings to enable synchronization</p>
                </div>
              </div>

              {/* AD Configuration Form */}
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#37322f] mb-2">
                    Tenant ID (Directory ID)
                  </label>
                  <input
                    type="text"
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    value={adConfig.tenantId}
                    onChange={(e) => setAdConfig(prev => ({ ...prev, tenantId: e.target.value }))}
                    className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#37322f] mb-2">
                    Application (Client) ID
                  </label>
                  <input
                    type="text"
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    value={adConfig.clientId}
                    onChange={(e) => setAdConfig(prev => ({ ...prev, clientId: e.target.value }))}
                    className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#37322f] mb-2">
                    Client Secret
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••••••••••"
                    className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                  />
                  <p className="text-xs text-[#37322f]/50 mt-1">
                    This will be stored securely and never displayed again
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#37322f] mb-2">
                    Domain
                  </label>
                  <input
                    type="text"
                    placeholder="company.onmicrosoft.com"
                    value={adConfig.domain}
                    onChange={(e) => setAdConfig(prev => ({ ...prev, domain: e.target.value }))}
                    className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#37322f] mb-2">
                    Sync Schedule
                  </label>
                  <select
                    value={adConfig.syncSchedule}
                    onChange={(e) => setAdConfig(prev => ({ ...prev, syncSchedule: e.target.value as any }))}
                    className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                  >
                    <option value="hourly">Every Hour</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="manual">Manual Only</option>
                  </select>
                </div>

                {/* Group Mappings Info */}
                <div className="bg-[#f7f5f3] rounded-lg p-6">
                  <h3 className="font-semibold text-[#37322f] mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5" /> 
                    Group to Designation Mapping
                  </h3>
                  <p className="text-sm text-[#37322f]/60 mb-4">
                    After connecting, you can map AD security groups to SignPortal designations.
                    Users will automatically receive the designation based on their group membership.
                  </p>
                  <div className="text-sm text-[#37322f]/70 space-y-2">
                    <div className="flex items-center justify-between py-2 border-b border-[#37322f]/10">
                      <span>SignPortal-Admins</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">Director</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-[#37322f]/10">
                      <span>SignPortal-Managers</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Manager</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span>SignPortal-Users</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">Analyst</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    className="flex-1 px-6 py-3 bg-[#37322f] text-white rounded-lg font-medium hover:bg-[#37322f]/90 transition flex items-center justify-center gap-2"
                  >
                    <Key className="w-5 h-5" />
                    Test Connection
                  </button>
                  <button
                    type="button"
                    onClick={handleADSync}
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <RefreshCw className="w-5 h-5" />
                    )}
                    Sync Now
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {/* Invite/Edit Modal */}
      {(modalType === 'invite' || modalType === 'edit') && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#37322f]/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#37322f]">
                  {modalType === 'invite' ? 'Add Team Member' : 'Edit Team Member'}
                </h2>
                <button
                  onClick={() => {
                    setModalType(null)
                    setSelectedUser(null)
                    resetForm()
                  }}
                  className="p-2 hover:bg-[#37322f]/5 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={modalType === 'invite' ? handleInviteUser : handleEditUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#37322f] mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  disabled={modalType === 'edit'}
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="user@company.com"
                  className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20 disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#37322f] mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#37322f] mb-2">
                  Designation <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.designation}
                  onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value as Designation }))}
                  className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                >
                  {Object.keys(DESIGNATION_HIERARCHY).filter(d => d !== 'admin').map(d => (
                    <option key={d} value={d}>{formatDesignationLabel(d as Designation)}</option>
                  ))}
                </select>
                <p className="text-xs text-[#37322f]/50 mt-1">
                  Designation determines feature access across the platform
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#37322f] mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="Engineering"
                  className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#37322f] mb-2">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                    placeholder="EMP001"
                    className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#37322f] mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="+1234567890"
                    className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setModalType(null)
                    setSelectedUser(null)
                    resetForm()
                  }}
                  className="flex-1 px-6 py-3 border border-[#37322f]/20 rounded-lg font-medium text-[#37322f] hover:bg-[#f7f5f3] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-[#37322f] text-white rounded-lg font-medium hover:bg-[#37322f]/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {modalType === 'invite' ? 'Send Invitation' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modalType === 'delete' && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-[#37322f] text-center mb-2">
                Remove Team Member?
              </h2>
              <p className="text-[#37322f]/60 text-center mb-6">
                Are you sure you want to remove <strong>{selectedUser.name}</strong> from the team?
                This action cannot be undone.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setModalType(null)
                    setSelectedUser(null)
                  }}
                  className="flex-1 px-6 py-3 border border-[#37322f]/20 rounded-lg font-medium text-[#37322f] hover:bg-[#f7f5f3] transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSV Preview Modal */}
      {modalType === 'csv-preview' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-[#37322f]/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#37322f]">CSV Import Preview</h2>
                  <p className="text-sm text-[#37322f]/60">
                    {csvFile?.name} • {csvPreview.length} users found
                  </p>
                </div>
                <button
                  onClick={() => {
                    setModalType(null)
                    setCsvFile(null)
                    setCsvPreview([])
                    setCsvErrors([])
                    setCsvWarnings([])
                  }}
                  className="p-2 hover:bg-[#37322f]/5 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Errors */}
              {csvErrors.length > 0 && (
                <div className="mb-6 p-4 bg-red-50 rounded-lg">
                  <h3 className="font-semibold text-red-800 flex items-center gap-2 mb-2">
                    <XCircle className="w-5 h-5" />
                    Errors ({csvErrors.length})
                  </h3>
                  <ul className="text-sm text-red-700 space-y-1">
                    {csvErrors.map((error, i) => (
                      <li key={i}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Warnings */}
              {csvWarnings.length > 0 && (
                <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5" />
                    Warnings ({csvWarnings.length})
                  </h3>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {csvWarnings.map((warning, i) => (
                      <li key={i}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Preview Table */}
              {csvPreview.length > 0 && (
                <div className="overflow-x-auto border border-[#37322f]/10 rounded-lg">
                  <table className="w-full">
                    <thead className="bg-[#f7f5f3]">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322f]">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322f]">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322f]">Designation</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322f]">Department</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#37322f]/5">
                      {csvPreview.map((row, i) => (
                        <tr key={i} className="hover:bg-[#f7f5f3]/50">
                          <td className="px-4 py-3 text-sm text-[#37322f]">{row.email}</td>
                          <td className="px-4 py-3 text-sm text-[#37322f]">{row.name}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${getDesignationColor(row.designation as Designation)}`}>
                              {formatDesignationLabel(row.designation as Designation)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-[#37322f]">{row.department}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-[#37322f]/10 flex gap-4">
              <button
                onClick={() => {
                  setModalType(null)
                  setCsvFile(null)
                  setCsvPreview([])
                  setCsvErrors([])
                  setCsvWarnings([])
                }}
                className="flex-1 px-6 py-3 border border-[#37322f]/20 rounded-lg font-medium text-[#37322f] hover:bg-[#f7f5f3] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCSVImport}
                disabled={isLoading || csvErrors.length > 0 || csvPreview.length === 0}
                className="flex-1 px-6 py-3 bg-[#37322f] text-white rounded-lg font-medium hover:bg-[#37322f]/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Import {csvPreview.length} Users
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close action menu */}
      {actionMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setActionMenuOpen(null)}
        />
      )}
    </div>
  )
}
