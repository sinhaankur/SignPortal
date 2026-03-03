'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ProtectedLayout from '@/components/layouts/protected-layout'
import { useAuth, ROLE_LABELS, ROLE_DESCRIPTIONS, UserRole } from '@/lib/auth-context'

const ALL_ROLES: UserRole[] = ['user', 'manager', 'admin', 'enterprise_admin', 'super_admin', 'platform_owner']

const ROLE_COLORS: Record<UserRole, string> = {
  user: 'bg-gray-500',
  manager: 'bg-blue-500',
  admin: 'bg-purple-500',
  enterprise_admin: 'bg-amber-500',
  super_admin: 'bg-red-500',
  platform_owner: 'bg-gradient-to-r from-[#37322f] to-[#5a524d]',
}

// Role-based stats configuration
const ROLE_STATS: Record<UserRole, Array<{ label: string; value: string; change: string; color: string }>> = {
  user: [
    { label: 'My Documents', value: '5', change: '+1 today', color: 'bg-amber-500' },
    { label: 'Pending Signatures', value: '3', change: '1 urgent', color: 'bg-blue-500' },
    { label: 'Completed', value: '12', change: 'This month', color: 'bg-green-500' },
    { label: 'Templates', value: '2', change: 'Available', color: 'bg-purple-500' },
  ],
  manager: [
    { label: 'Team Documents', value: '28', change: '+5 today', color: 'bg-amber-500' },
    { label: 'Awaiting Approval', value: '12', change: '4 urgent', color: 'bg-blue-500' },
    { label: 'Completed This Week', value: '45', change: '+22%', color: 'bg-green-500' },
    { label: 'Team Members', value: '8', change: '2 pending', color: 'bg-purple-500' },
  ],
  admin: [
    { label: 'Organization Documents', value: '156', change: '+18 today', color: 'bg-amber-500' },
    { label: 'Pending Reviews', value: '34', change: '8 urgent', color: 'bg-blue-500' },
    { label: 'Monthly Completions', value: '289', change: '+31%', color: 'bg-green-500' },
    { label: 'Total Users', value: '47', change: '5 pending', color: 'bg-purple-500' },
  ],
  enterprise_admin: [
    { label: 'Enterprise Documents', value: '1,247', change: '+89 today', color: 'bg-amber-500' },
    { label: 'Active Workflows', value: '156', change: '23 in review', color: 'bg-blue-500' },
    { label: 'Organizations', value: '12', change: '3 pending', color: 'bg-green-500' },
    { label: 'Enterprise Users', value: '342', change: '+15 this week', color: 'bg-purple-500' },
  ],
  super_admin: [
    { label: 'Platform Documents', value: '15,847', change: '+1,234 today', color: 'bg-amber-500' },
    { label: 'Active Enterprises', value: '89', change: '7 pending', color: 'bg-blue-500' },
    { label: 'Platform Users', value: '4,521', change: '+156 this week', color: 'bg-green-500' },
    { label: 'System Health', value: '99.9%', change: 'Uptime', color: 'bg-red-500' },
  ],
  platform_owner: [
    { label: 'Monthly Revenue', value: '$847K', change: '+12% MoM', color: 'bg-green-500' },
    { label: 'Total Enterprises', value: '89', change: '+7 this month', color: 'bg-amber-500' },
    { label: 'Platform Users', value: '4,521', change: '+156 this week', color: 'bg-blue-500' },
    { label: 'Platform Uptime', value: '99.97%', change: 'Last 30 days', color: 'bg-[#37322f]' },
  ],
}

// Role-based quick actions
const ROLE_QUICK_ACTIONS: Record<UserRole, Array<{ title: string; description: string; href: string; color: string; icon: string }>> = {
  user: [
    { title: 'Sign Document', description: 'Review and sign pending documents', href: '/documents', color: 'bg-[#37322f]', icon: 'sign' },
    { title: 'My Documents', description: 'View your document history', href: '/documents', color: 'bg-blue-500', icon: 'docs' },
    { title: 'Templates', description: 'Use document templates', href: '/templates', color: 'bg-green-500', icon: 'template' },
    { title: 'Profile', description: 'Update your profile settings', href: '/settings/profile', color: 'bg-purple-500', icon: 'profile' },
  ],
  manager: [
    { title: 'Create Document', description: 'Upload and send for signing', href: '/documents/new', color: 'bg-[#37322f]', icon: 'create' },
    { title: 'Workflows', description: 'Manage signing workflows', href: '/workflows', color: 'bg-green-500', icon: 'workflow' },
    { title: 'Team Documents', description: 'Review team submissions', href: '/documents', color: 'bg-blue-500', icon: 'docs' },
    { title: 'Team Management', description: 'Manage your team members', href: '/settings/team', color: 'bg-purple-500', icon: 'team' },
  ],
  admin: [
    { title: 'Create Document', description: 'Upload and send for signing', href: '/documents/new', color: 'bg-[#37322f]', icon: 'create' },
    { title: 'User Management', description: 'Manage organization users', href: '/admin', color: 'bg-purple-500', icon: 'users' },
    { title: 'Audit Logs', description: 'View activity and compliance', href: '/admin/security', color: 'bg-blue-500', icon: 'audit' },
    { title: 'Settings', description: 'Organization configuration', href: '/settings', color: 'bg-green-500', icon: 'settings' },
  ],
  enterprise_admin: [
    { title: 'Enterprise Overview', description: 'View enterprise dashboard', href: '/admin/enterprises', color: 'bg-[#37322f]', icon: 'enterprise' },
    { title: 'Organization Management', description: 'Manage sub-organizations', href: '/admin/enterprises', color: 'bg-amber-500', icon: 'org' },
    { title: 'Security & Compliance', description: 'Access control and audit', href: '/admin/security', color: 'bg-blue-500', icon: 'security' },
    { title: 'Enterprise Settings', description: 'Configure enterprise policies', href: '/admin', color: 'bg-purple-500', icon: 'settings' },
  ],
  super_admin: [
    { title: 'Platform Dashboard', description: 'System-wide overview', href: '/admin', color: 'bg-red-500', icon: 'platform' },
    { title: 'Enterprise Management', description: 'Manage all enterprises', href: '/admin/enterprises', color: 'bg-amber-500', icon: 'enterprise' },
    { title: 'Security Center', description: 'Platform security and access', href: '/admin/security', color: 'bg-blue-500', icon: 'security' },
    { title: 'System Configuration', description: 'Global platform settings', href: '/admin', color: 'bg-purple-500', icon: 'config' },
  ],
  platform_owner: [
    { title: 'Owner Console', description: 'Platform owner dashboard', href: '/owner', color: 'bg-[#37322f]', icon: 'platform' },
    { title: 'Revenue & Billing', description: 'Financial overview', href: '/owner', color: 'bg-green-500', icon: 'revenue' },
    { title: 'All Enterprises', description: 'Manage client enterprises', href: '/owner', color: 'bg-amber-500', icon: 'enterprise' },
    { title: 'Security & Privacy', description: 'Platform security controls', href: '/owner', color: 'bg-blue-500', icon: 'security' },
  ],
}

// Role-based welcome messages
const ROLE_WELCOME: Record<UserRole, { title: string; subtitle: string }> = {
  user: { title: 'Your Documents', subtitle: 'Sign and manage your personal documents' },
  manager: { title: 'Team Overview', subtitle: "Here's what's happening with your team today" },
  admin: { title: 'Organization Dashboard', subtitle: 'Manage your organization and users' },
  enterprise_admin: { title: 'Enterprise Dashboard', subtitle: 'Monitor and manage your enterprise' },
  super_admin: { title: 'Platform Administration', subtitle: 'System-wide monitoring and control' },
  platform_owner: { title: 'SignPortal Owner Console', subtitle: 'Full platform visibility with client privacy protection' },
}

export default function DashboardPage() {
  const { user, setRole, canSwitchRoles } = useAuth()
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const currentRole = user?.role || 'user'
  const stats = ROLE_STATS[currentRole]
  const quickActions = ROLE_QUICK_ACTIONS[currentRole]
  const welcome = ROLE_WELCOME[currentRole]

  const navigateTo = (path: string) => {
    router.push(path)
  }

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'sign':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      case 'create':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      case 'docs':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      case 'workflow':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      case 'team':
      case 'users':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      case 'template':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      case 'profile':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      case 'audit':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      case 'settings':
      case 'config':
        return <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>
      case 'enterprise':
      case 'org':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      case 'security':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      case 'platform':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      case 'revenue':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      default:
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    }
  }

  return (
    <ProtectedLayout>
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section with Role Switcher */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#37322f] mb-2">
              Welcome back, {user?.name?.split(' ')[0] || 'User'}!
            </h1>
            <p className="text-[#37322f]/60 text-lg">
              {welcome.subtitle}
            </p>
          </div>

          {/* Role Switcher Dropdown */}
          {canSwitchRoles() && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 px-4 py-2.5 bg-[#37322f] text-white rounded-xl hover:bg-[#4a433f] transition-colors min-w-[200px]"
              >
                <div className={`w-2.5 h-2.5 rounded-full ${ROLE_COLORS[currentRole]}`} />
                <span className="flex-1 text-left text-sm font-medium">{ROLE_LABELS[currentRole]}</span>
                <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#37322f]/10 z-20 overflow-hidden">
                    <div className="px-4 py-3 bg-[#37322f]/5 border-b border-[#37322f]/10">
                      <p className="text-xs font-semibold text-[#37322f]/60 uppercase tracking-wider">Switch Role (Test Mode)</p>
                    </div>
                    <div className="py-2">
                      {ALL_ROLES.map((role) => (
                        <button
                          key={role}
                          onClick={() => {
                            setRole(role)
                            setDropdownOpen(false)
                          }}
                          className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-[#37322f]/5 transition-colors ${
                            currentRole === role ? 'bg-[#37322f]/10' : ''
                          }`}
                        >
                          <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${ROLE_COLORS[role]}`} />
                          <div className="flex-1 text-left">
                            <p className={`text-sm font-medium ${currentRole === role ? 'text-[#37322f]' : 'text-[#37322f]/80'}`}>
                              {ROLE_LABELS[role]}
                            </p>
                            <p className="text-xs text-[#37322f]/50">{ROLE_DESCRIPTIONS[role]}</p>
                          </div>
                          {currentRole === role && (
                            <svg className="w-4 h-4 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Stats Grid - Role-based */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-5 border border-[#37322f]/10">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-2 h-2 ${stat.color} rounded-full`} />
              </div>
              <p className="text-2xl font-bold text-[#37322f] mb-1">{stat.value}</p>
              <p className="text-sm text-[#37322f]/60">{stat.label}</p>
              <p className="text-xs text-[#37322f]/40 mt-1">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions - Role-based */}
        <h2 className="text-xl font-semibold text-[#37322f] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <div 
              key={index}
              onClick={() => navigateTo(action.href)}
              className="bg-white rounded-xl p-6 border border-[#37322f]/10 hover:shadow-lg hover:border-[#37322f]/20 transition-all cursor-pointer group"
            >
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {getIcon(action.icon)}
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#37322f] mb-2">{action.title}</h3>
              <p className="text-[#37322f]/60 text-sm mb-4">{action.description}</p>
              <span className="text-[#37322f] font-medium hover:underline text-sm inline-flex items-center gap-1">
                Open
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-[#37322f]/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#37322f]/10 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#37322f]">Recent Activity</h2>
            <Link href="/documents" className="text-sm text-[#37322f]/60 hover:text-[#37322f]">
              View all
            </Link>
          </div>
          <div className="divide-y divide-[#37322f]/5">
            {[
              { action: 'Document signed', doc: 'Employment Contract - John Smith', time: '2 hours ago', status: 'completed' },
              { action: 'Signature requested', doc: 'NDA Agreement - Acme Corp', time: '4 hours ago', status: 'pending' },
              { action: 'Document created', doc: 'Q1 Budget Report', time: 'Yesterday', status: 'draft' },
              { action: 'Workflow started', doc: 'Board Resolution 2026-03', time: 'Yesterday', status: 'in-progress' },
            ].map((activity, index) => (
              <div key={index} className="px-6 py-4 flex items-center justify-between hover:bg-[#f7f5f3]/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'completed' ? 'bg-green-500' :
                    activity.status === 'pending' ? 'bg-amber-500' :
                    activity.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-400'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-[#37322f]">{activity.action}</p>
                    <p className="text-sm text-[#37322f]/60">{activity.doc}</p>
                  </div>
                </div>
                <span className="text-xs text-[#37322f]/40">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}
