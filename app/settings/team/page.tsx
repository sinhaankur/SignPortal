'use client'

import { useState } from 'react'
import ProtectedLayout from '@/components/layouts/protected-layout'

const initialMembers = [
  { id: 1, name: 'John Smith', email: 'john@company.com', role: 'Admin', status: 'active', joined: '2025-01-15' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@company.com', role: 'Manager', status: 'active', joined: '2025-02-20' },
  { id: 3, name: 'Mike Chen', email: 'mike@company.com', role: 'Member', status: 'active', joined: '2025-03-01' },
  { id: 4, name: 'Emily Davis', email: 'emily@company.com', role: 'Member', status: 'pending', joined: '2026-02-28' },
]

const roles = ['Admin', 'Manager', 'Member', 'Viewer']

export default function TeamManagementPage() {
  const [members, setMembers] = useState(initialMembers)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('Member')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    const newMember = {
      id: members.length + 1,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'pending',
      joined: new Date().toISOString().split('T')[0],
    }
    setMembers([...members, newMember])
    setInviteEmail('')
    setInviteRole('Member')
    setShowInviteModal(false)
  }

  const handleRemoveMember = (id: number) => {
    setMembers(members.filter(m => m.id !== id))
  }

  const handleRoleChange = (id: number, newRole: string) => {
    setMembers(members.map(m => m.id === id ? { ...m, role: newRole } : m))
  }

  return (
    <ProtectedLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#37322f] mb-2">Team Management</h1>
            <p className="text-[#37322f]/60">Manage your team members and their permissions</p>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-6 py-3 bg-[#37322f] text-white rounded-xl font-semibold hover:bg-[#2a2520] transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Invite Member
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-[#37322f]/10">
            <p className="text-2xl font-bold text-[#37322f]">{members.length}</p>
            <p className="text-sm text-[#37322f]/60">Total Members</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-[#37322f]/10">
            <p className="text-2xl font-bold text-green-600">{members.filter(m => m.status === 'active').length}</p>
            <p className="text-sm text-[#37322f]/60">Active Members</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-[#37322f]/10">
            <p className="text-2xl font-bold text-amber-600">{members.filter(m => m.status === 'pending').length}</p>
            <p className="text-sm text-[#37322f]/60">Pending Invites</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
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

        {/* Members Table */}
        <div className="bg-white rounded-xl border border-[#37322f]/10 overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#f7f5f3]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#37322f]">Member</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#37322f]">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#37322f]">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#37322f]">Joined</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[#37322f]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#37322f]/5">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-[#f7f5f3]/50 transition-colors">
                  <td className="px-6 py-4">
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
                  <td className="px-6 py-4">
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value)}
                      className="px-3 py-1.5 border border-[#37322f]/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                    >
                      {roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      member.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {member.status === 'active' ? 'Active' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#37322f]/60">
                    {new Date(member.joined).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <h2 className="text-xl font-semibold text-[#37322f] mb-2">Invite Team Member</h2>
              <p className="text-[#37322f]/60 text-sm mb-6">Send an invitation to join your team</p>
              
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#37322f] mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="w-full px-4 py-3 border border-[#37322f]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#37322f] mb-2">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-4 py-3 border border-[#37322f]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
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
                    Send Invite
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  )
}
