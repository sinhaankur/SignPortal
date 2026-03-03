'use client'

import { useState, useRef } from 'react'
import ProtectedLayout from '@/components/layouts/protected-layout'

interface Member {
  id: number
  name: string
  email: string
  role: string
  department: string
  status: 'active' | 'pending' | 'suspended'
  joined: string
  lastActive?: string
  permissions: string[]
}

const initialMembers: Member[] = [
  { id: 1, name: 'John Smith', email: 'john@company.com', role: 'Admin', department: 'Engineering', status: 'active', joined: '2025-01-15', lastActive: '2026-03-03', permissions: ['all'] },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@company.com', role: 'Manager', department: 'Sales', status: 'active', joined: '2025-02-20', lastActive: '2026-03-02', permissions: ['documents', 'team', 'workflows'] },
  { id: 3, name: 'Mike Chen', email: 'mike@company.com', role: 'Member', department: 'Engineering', status: 'active', joined: '2025-03-01', lastActive: '2026-03-01', permissions: ['documents'] },
  { id: 4, name: 'Emily Davis', email: 'emily@company.com', role: 'Member', department: 'Marketing', status: 'pending', joined: '2026-02-28', permissions: ['documents'] },
  { id: 5, name: 'Alex Turner', email: 'alex@company.com', role: 'Viewer', department: 'Finance', status: 'active', joined: '2025-06-15', lastActive: '2026-02-28', permissions: ['view'] },
]

const roles = [
  { name: 'Admin', description: 'Full access to all features', permissions: ['all'] },
  { name: 'Manager', description: 'Manage team, documents, and workflows', permissions: ['documents', 'team', 'workflows', 'reports'] },
  { name: 'Member', description: 'Create and sign documents', permissions: ['documents', 'workflows'] },
  { name: 'Viewer', description: 'View-only access', permissions: ['view'] },
]

const departments = ['Engineering', 'Sales', 'Marketing', 'Finance', 'HR', 'Operations', 'Legal']

const permissionsList = [
  { id: 'documents', label: 'Documents', desc: 'Create, edit, and delete documents' },
  { id: 'team', label: 'Team Management', desc: 'Invite and manage team members' },
  { id: 'workflows', label: 'Workflows', desc: 'Create and manage signing workflows' },
  { id: 'reports', label: 'Reports', desc: 'View analytics and reports' },
  { id: 'billing', label: 'Billing', desc: 'Manage billing and subscriptions' },
  { id: 'settings', label: 'Settings', desc: 'Configure organization settings' },
]

type TabType = 'members' | 'roles' | 'import' | 'directory'

export default function TeamManagementPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [activeTab, setActiveTab] = useState<TabType>('members')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Invite form state
  const [inviteEmails, setInviteEmails] = useState('')
  const [inviteRole, setInviteRole] = useState('Member')
  const [inviteDepartment, setInviteDepartment] = useState('')
  
  // CSV import state
  const [csvData, setCsvData] = useState<any[]>([])
  const [csvUploaded, setCsvUploaded] = useState(false)
  
  // AD Sync state
  const [adConfig, setAdConfig] = useState({
    server: '',
    domain: '',
    username: '',
    password: '',
    baseDN: '',
    syncInterval: '24',
    autoProvision: true,
    syncGroups: true,
  })
  const [adConnected, setAdConnected] = useState(false)
  const [adSyncing, setAdSyncing] = useState(false)

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = !filterRole || member.role === filterRole
    const matchesDepartment = !filterDepartment || member.department === filterDepartment
    const matchesStatus = !filterStatus || member.status === filterStatus
    return matchesSearch && matchesRole && matchesDepartment && matchesStatus
  })

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    const emails = inviteEmails.split(/[,\n]/).map(e => e.trim()).filter(e => e)
    const newMembers = emails.map((email, idx) => ({
      id: members.length + idx + 1,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email,
      role: inviteRole,
      department: inviteDepartment || 'Unassigned',
      status: 'pending' as const,
      joined: new Date().toISOString().split('T')[0],
      permissions: roles.find(r => r.name === inviteRole)?.permissions || ['documents'],
    }))
    setMembers([...members, ...newMembers])
    setInviteEmails('')
    setInviteRole('Member')
    setInviteDepartment('')
    setShowInviteModal(false)
  }

  const handleSelectAll = () => {
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([])
    } else {
      setSelectedMembers(filteredMembers.map(m => m.id))
    }
  }

  const handleSelectMember = (id: number) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter(m => m !== id))
    } else {
      setSelectedMembers([...selectedMembers, id])
    }
  }

  const handleBulkAction = (action: 'activate' | 'suspend' | 'delete' | 'changeRole') => {
    if (action === 'delete') {
      setMembers(members.filter(m => !selectedMembers.includes(m.id)))
    } else if (action === 'activate') {
      setMembers(members.map(m => selectedMembers.includes(m.id) ? { ...m, status: 'active' as const } : m))
    } else if (action === 'suspend') {
      setMembers(members.map(m => selectedMembers.includes(m.id) ? { ...m, status: 'suspended' as const } : m))
    }
    setSelectedMembers([])
    setShowBulkModal(false)
  }

  const handleBulkRoleChange = (newRole: string) => {
    const rolePerms = roles.find(r => r.name === newRole)?.permissions || ['documents']
    setMembers(members.map(m => selectedMembers.includes(m.id) ? { ...m, role: newRole, permissions: rolePerms } : m))
    setSelectedMembers([])
    setShowBulkModal(false)
  }

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const lines = text.split('\n').filter(l => l.trim())
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
      
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim())
        const obj: any = {}
        headers.forEach((h, i) => {
          obj[h] = values[i] || ''
        })
        return obj
      })
      
      setCsvData(data)
      setCsvUploaded(true)
    }
    reader.readAsText(file)
  }

  const handleImportCSV = () => {
    const newMembers = csvData.map((row, idx) => ({
      id: members.length + idx + 1,
      name: row.name || row.email?.split('@')[0] || 'Unknown',
      email: row.email || '',
      role: row.role || 'Member',
      department: row.department || 'Unassigned',
      status: 'pending' as const,
      joined: new Date().toISOString().split('T')[0],
      permissions: roles.find(r => r.name === (row.role || 'Member'))?.permissions || ['documents'],
    })).filter(m => m.email)
    
    setMembers([...members, ...newMembers])
    setCsvData([])
    setCsvUploaded(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleADConnect = () => {
    setAdSyncing(true)
    // Simulate AD connection
    setTimeout(() => {
      setAdConnected(true)
      setAdSyncing(false)
    }, 2000)
  }

  const handleADSync = () => {
    setAdSyncing(true)
    // Simulate AD sync - would add users from AD
    setTimeout(() => {
      const adUsers: Member[] = [
        { id: members.length + 1, name: 'AD User 1', email: 'aduser1@company.com', role: 'Member', department: 'Engineering', status: 'active', joined: new Date().toISOString().split('T')[0], permissions: ['documents'] },
        { id: members.length + 2, name: 'AD User 2', email: 'aduser2@company.com', role: 'Member', department: 'Sales', status: 'active', joined: new Date().toISOString().split('T')[0], permissions: ['documents'] },
      ]
      setMembers([...members, ...adUsers])
      setAdSyncing(false)
    }, 3000)
  }

  return (
    <ProtectedLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#37322f] mb-2">Team Management</h1>
            <p className="text-[#37322f]/60">Manage users, roles, permissions, and directory sync</p>
          </div>
          <div className="flex gap-3">
            {selectedMembers.length > 0 && (
              <button
                onClick={() => setShowBulkModal(true)}
                className="px-4 py-2 border border-[#37322f]/20 text-[#37322f] rounded-xl font-medium hover:bg-[#37322f]/5 transition-colors"
              >
                Bulk Actions ({selectedMembers.length})
              </button>
            )}
            <button
              onClick={() => setShowInviteModal(true)}
              className="px-6 py-3 bg-[#37322f] text-white rounded-xl font-semibold hover:bg-[#2a2520] transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Invite Members
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-[#37322f]/10">
            <p className="text-2xl font-bold text-[#37322f]">{members.length}</p>
            <p className="text-sm text-[#37322f]/60">Total Members</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#37322f]/10">
            <p className="text-2xl font-bold text-green-600">{members.filter(m => m.status === 'active').length}</p>
            <p className="text-sm text-[#37322f]/60">Active</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#37322f]/10">
            <p className="text-2xl font-bold text-amber-600">{members.filter(m => m.status === 'pending').length}</p>
            <p className="text-sm text-[#37322f]/60">Pending</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#37322f]/10">
            <p className="text-2xl font-bold text-purple-600">{members.filter(m => m.role === 'Manager' || m.role === 'Admin').length}</p>
            <p className="text-sm text-[#37322f]/60">Admins/Managers</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 border border-[#37322f]/10">
          {[
            { id: 'members' as TabType, label: 'Members', icon: '👥' },
            { id: 'roles' as TabType, label: 'Roles & Permissions', icon: '🔐' },
            { id: 'import' as TabType, label: 'CSV Import', icon: '📄' },
            { id: 'directory' as TabType, label: 'Directory Sync', icon: '🔗' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-colors ${
                activeTab === tab.id 
                  ? 'bg-[#37322f] text-white' 
                  : 'text-[#37322f]/70 hover:bg-[#37322f]/5'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Members Tab */}
        {activeTab === 'members' && (
          <>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#37322f]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-[#37322f]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                  />
                </div>
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-3 bg-white border border-[#37322f]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
              >
                <option value="">All Roles</option>
                {roles.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
              </select>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-4 py-3 bg-white border border-[#37322f]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
              >
                <option value="">All Departments</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-white border border-[#37322f]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            {/* Members Table */}
            <div className="bg-white rounded-xl border border-[#37322f]/10 overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#f7f5f3]">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 accent-[#37322f]"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322f]">Member</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322f]">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322f]">Department</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322f]">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322f]">Last Active</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-[#37322f]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#37322f]/5">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className={`hover:bg-[#f7f5f3]/50 transition-colors ${selectedMembers.includes(member.id) ? 'bg-blue-50' : ''}`}>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(member.id)}
                          onChange={() => handleSelectMember(member.id)}
                          className="w-4 h-4 accent-[#37322f]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#37322f]/10 rounded-full flex items-center justify-center text-[#37322f] font-semibold">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-[#37322f]">{member.name}</p>
                            <p className="text-sm text-[#37322f]/60">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={member.role}
                          onChange={(e) => {
                            const newRole = e.target.value
                            const rolePerms = roles.find(r => r.name === newRole)?.permissions || ['documents']
                            setMembers(members.map(m => m.id === member.id ? { ...m, role: newRole, permissions: rolePerms } : m))
                          }}
                          className="px-3 py-1.5 border border-[#37322f]/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                        >
                          {roles.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={member.department}
                          onChange={(e) => setMembers(members.map(m => m.id === member.id ? { ...m, department: e.target.value } : m))}
                          className="px-3 py-1.5 border border-[#37322f]/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                        >
                          {departments.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          member.status === 'active' ? 'bg-green-100 text-green-700' :
                          member.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#37322f]/60">
                        {member.lastActive ? new Date(member.lastActive).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {member.status === 'suspended' ? (
                            <button
                              onClick={() => setMembers(members.map(m => m.id === member.id ? { ...m, status: 'active' } : m))}
                              className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              Activate
                            </button>
                          ) : member.status === 'active' ? (
                            <button
                              onClick={() => setMembers(members.map(m => m.id === member.id ? { ...m, status: 'suspended' } : m))}
                              className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => setMembers(members.map(m => m.id === member.id ? { ...m, status: 'active' } : m))}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              Resend
                            </button>
                          )}
                          <button
                            onClick={() => setMembers(members.filter(m => m.id !== member.id))}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredMembers.length === 0 && (
                <div className="p-8 text-center text-[#37322f]/60">
                  No members found matching your filters.
                </div>
              )}
            </div>
          </>
        )}

        {/* Roles & Permissions Tab */}
        {activeTab === 'roles' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#37322f]">Role Configuration</h2>
            </div>
            
            <div className="grid gap-4">
              {roles.map((role, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-[#37322f]/10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[#37322f]">{role.name}</h3>
                      <p className="text-sm text-[#37322f]/60">{role.description}</p>
                      <p className="text-xs text-[#37322f]/40 mt-1">
                        {members.filter(m => m.role === role.name).length} members
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      role.name === 'Admin' ? 'bg-purple-100 text-purple-700' :
                      role.name === 'Manager' ? 'bg-blue-100 text-blue-700' :
                      role.name === 'Member' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {role.name}
                    </span>
                  </div>
                  
                  <div className="border-t border-[#37322f]/10 pt-4">
                    <p className="text-sm font-medium text-[#37322f] mb-3">Permissions</p>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.includes('all') ? (
                        <span className="px-3 py-1 bg-[#37322f]/10 rounded-full text-sm text-[#37322f]">
                          Full Access
                        </span>
                      ) : (
                        permissionsList.filter(p => role.permissions.includes(p.id)).map(perm => (
                          <span key={perm.id} className="px-3 py-1 bg-[#37322f]/5 rounded-full text-sm text-[#37322f]">
                            {perm.label}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-800">
                <strong>Manager Access:</strong> Users with Manager role can invite new members, assign roles (except Admin), 
                and manage team workflows. They cannot access billing or organization settings.
              </p>
            </div>
          </div>
        )}

        {/* CSV Import Tab */}
        {activeTab === 'import' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#37322f]/10 p-8">
              <h2 className="text-xl font-semibold text-[#37322f] mb-2">Bulk Import Users</h2>
              <p className="text-[#37322f]/60 mb-6">Upload a CSV file to import multiple users at once</p>
              
              <div className="border-2 border-dashed border-[#37322f]/20 rounded-xl p-8 text-center mb-6">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <label htmlFor="csv-upload" className="cursor-pointer">
                  <div className="w-16 h-16 mx-auto mb-4 bg-[#37322f]/5 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#37322f]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-[#37322f] font-medium mb-1">Click to upload CSV file</p>
                  <p className="text-sm text-[#37322f]/60">or drag and drop</p>
                </label>
              </div>

              {csvUploaded && csvData.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-medium text-[#37322f]">{csvData.length} users ready to import</p>
                    <button
                      onClick={handleImportCSV}
                      className="px-6 py-2 bg-[#37322f] text-white rounded-lg font-medium hover:bg-[#2a2520] transition-colors"
                    >
                      Import All
                    </button>
                  </div>
                  <div className="max-h-64 overflow-auto border border-[#37322f]/10 rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-[#f7f5f3] sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-left">Name</th>
                          <th className="px-4 py-2 text-left">Email</th>
                          <th className="px-4 py-2 text-left">Role</th>
                          <th className="px-4 py-2 text-left">Department</th>
                        </tr>
                      </thead>
                      <tbody>
                        {csvData.slice(0, 10).map((row, idx) => (
                          <tr key={idx} className="border-t border-[#37322f]/5">
                            <td className="px-4 py-2">{row.name || '-'}</td>
                            <td className="px-4 py-2">{row.email || '-'}</td>
                            <td className="px-4 py-2">{row.role || 'Member'}</td>
                            <td className="px-4 py-2">{row.department || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {csvData.length > 10 && (
                      <p className="px-4 py-2 text-[#37322f]/60 bg-[#f7f5f3]">
                        ...and {csvData.length - 10} more
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-[#f7f5f3] rounded-xl p-4">
                <p className="font-medium text-[#37322f] mb-2">CSV Format Requirements:</p>
                <ul className="text-sm text-[#37322f]/70 space-y-1">
                  <li>• Required columns: <code className="bg-white px-1 rounded">email</code></li>
                  <li>• Optional columns: <code className="bg-white px-1 rounded">name</code>, <code className="bg-white px-1 rounded">role</code>, <code className="bg-white px-1 rounded">department</code></li>
                  <li>• First row must be column headers</li>
                </ul>
                <a href="#" className="inline-block mt-3 text-sm text-[#37322f] font-medium underline">
                  Download sample CSV template
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Directory Sync Tab */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#37322f]/10 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-[#37322f] mb-2">Active Directory / LDAP Sync</h2>
                  <p className="text-[#37322f]/60">Sync users automatically from your corporate directory</p>
                </div>
                {adConnected && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium inline-flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Connected
                  </span>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[#37322f] mb-2">LDAP Server</label>
                  <input
                    type="text"
                    value={adConfig.server}
                    onChange={(e) => setAdConfig({...adConfig, server: e.target.value})}
                    placeholder="ldap://your-server.company.com"
                    className="w-full px-4 py-3 border border-[#37322f]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#37322f] mb-2">Domain</label>
                  <input
                    type="text"
                    value={adConfig.domain}
                    onChange={(e) => setAdConfig({...adConfig, domain: e.target.value})}
                    placeholder="company.com"
                    className="w-full px-4 py-3 border border-[#37322f]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#37322f] mb-2">Bind Username</label>
                  <input
                    type="text"
                    value={adConfig.username}
                    onChange={(e) => setAdConfig({...adConfig, username: e.target.value})}
                    placeholder="CN=admin,DC=company,DC=com"
                    className="w-full px-4 py-3 border border-[#37322f]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#37322f] mb-2">Bind Password</label>
                  <input
                    type="password"
                    value={adConfig.password}
                    onChange={(e) => setAdConfig({...adConfig, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-[#37322f]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#37322f] mb-2">Base DN</label>
                  <input
                    type="text"
                    value={adConfig.baseDN}
                    onChange={(e) => setAdConfig({...adConfig, baseDN: e.target.value})}
                    placeholder="OU=Users,DC=company,DC=com"
                    className="w-full px-4 py-3 border border-[#37322f]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                  />
                </div>
              </div>

              <div className="border-t border-[#37322f]/10 pt-6 mb-6">
                <h3 className="font-medium text-[#37322f] mb-4">Sync Options</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={adConfig.autoProvision}
                      onChange={(e) => setAdConfig({...adConfig, autoProvision: e.target.checked})}
                      className="w-5 h-5 accent-[#37322f] rounded"
                    />
                    <div>
                      <p className="font-medium text-[#37322f]">Auto-provision new users</p>
                      <p className="text-sm text-[#37322f]/60">Automatically create accounts for new AD users</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={adConfig.syncGroups}
                      onChange={(e) => setAdConfig({...adConfig, syncGroups: e.target.checked})}
                      className="w-5 h-5 accent-[#37322f] rounded"
                    />
                    <div>
                      <p className="font-medium text-[#37322f]">Sync groups to roles</p>
                      <p className="text-sm text-[#37322f]/60">Map AD groups to SignPortal roles</p>
                    </div>
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-[#37322f]">Sync interval:</label>
                    <select
                      value={adConfig.syncInterval}
                      onChange={(e) => setAdConfig({...adConfig, syncInterval: e.target.value})}
                      className="px-4 py-2 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                    >
                      <option value="1">Every hour</option>
                      <option value="6">Every 6 hours</option>
                      <option value="12">Every 12 hours</option>
                      <option value="24">Every 24 hours</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                {!adConnected ? (
                  <button
                    onClick={handleADConnect}
                    disabled={adSyncing}
                    className="px-6 py-3 bg-[#37322f] text-white rounded-xl font-semibold hover:bg-[#2a2520] transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                  >
                    {adSyncing && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                    Test Connection
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleADSync}
                      disabled={adSyncing}
                      className="px-6 py-3 bg-[#37322f] text-white rounded-xl font-semibold hover:bg-[#2a2520] transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                    >
                      {adSyncing && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                      Sync Now
                    </button>
                    <button
                      onClick={() => setAdConnected(false)}
                      className="px-6 py-3 border border-[#37322f]/20 text-[#37322f] rounded-xl font-medium hover:bg-[#37322f]/5 transition-colors"
                    >
                      Disconnect
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong>Enterprise Feature:</strong> Active Directory sync is available on Enterprise plans. 
                Contact sales if you need to upgrade your plan.
              </p>
            </div>
          </div>
        )}

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-auto">
              <h2 className="text-xl font-semibold text-[#37322f] mb-2">Invite Team Members</h2>
              <p className="text-[#37322f]/60 text-sm mb-6">Add multiple email addresses separated by commas or new lines</p>
              
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#37322f] mb-2">Email Addresses *</label>
                  <textarea
                    required
                    rows={4}
                    value={inviteEmails}
                    onChange={(e) => setInviteEmails(e.target.value)}
                    placeholder="user1@company.com, user2@company.com&#10;user3@company.com"
                    className="w-full px-4 py-3 border border-[#37322f]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#37322f] mb-2">Role</label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="w-full px-4 py-3 border border-[#37322f]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                    >
                      {roles.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#37322f] mb-2">Department</label>
                    <select
                      value={inviteDepartment}
                      onChange={(e) => setInviteDepartment(e.target.value)}
                      className="w-full px-4 py-3 border border-[#37322f]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                    >
                      <option value="">Select department</option>
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 py-3 border border-[#37322f]/20 rounded-xl font-medium text-[#37322f] hover:bg-[#37322f]/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#37322f] text-white rounded-xl font-semibold hover:bg-[#2a2520] transition-colors"
                  >
                    Send Invites
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Bulk Actions Modal */}
        {showBulkModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <h2 className="text-xl font-semibold text-[#37322f] mb-2">Bulk Actions</h2>
              <p className="text-[#37322f]/60 text-sm mb-6">{selectedMembers.length} members selected</p>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="w-full p-4 text-left rounded-xl border border-[#37322f]/10 hover:bg-green-50 hover:border-green-200 transition-colors"
                >
                  <p className="font-medium text-[#37322f]">Activate Users</p>
                  <p className="text-sm text-[#37322f]/60">Enable access for selected users</p>
                </button>
                <button
                  onClick={() => handleBulkAction('suspend')}
                  className="w-full p-4 text-left rounded-xl border border-[#37322f]/10 hover:bg-amber-50 hover:border-amber-200 transition-colors"
                >
                  <p className="font-medium text-[#37322f]">Suspend Users</p>
                  <p className="text-sm text-[#37322f]/60">Temporarily disable access</p>
                </button>
                <div className="p-4 rounded-xl border border-[#37322f]/10">
                  <p className="font-medium text-[#37322f] mb-2">Change Role</p>
                  <select
                    onChange={(e) => e.target.value && handleBulkRoleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-[#37322f]/20 rounded-lg"
                    defaultValue=""
                  >
                    <option value="">Select new role...</option>
                    {roles.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                  </select>
                </div>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="w-full p-4 text-left rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <p className="font-medium text-red-700">Remove Users</p>
                  <p className="text-sm text-red-600">Permanently remove from team</p>
                </button>
              </div>

              <button
                onClick={() => setShowBulkModal(false)}
                className="w-full mt-4 py-3 border border-[#37322f]/20 rounded-xl font-medium text-[#37322f] hover:bg-[#37322f]/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  )
}
