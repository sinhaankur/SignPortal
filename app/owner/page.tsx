'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ProtectedLayout from '@/components/layouts/protected-layout'
import { useAuth } from '@/lib/auth-context'

// Mock data for platform metrics
const platformMetrics = {
  revenue: { value: '$2.4M', change: '+18%', period: 'This Quarter' },
  mrr: { value: '$847K', change: '+12%', period: 'Monthly Recurring' },
  enterprises: { value: '89', change: '+7', period: 'Active Clients' },
  users: { value: '4,521', change: '+156', period: 'Total Users' },
  documents: { value: '15.8K', change: '+1,234', period: 'Documents/Day' },
  uptime: { value: '99.97%', change: '', period: 'Platform Uptime' },
}

const topEnterprises = [
  { name: 'Acme Corporation', users: 342, documents: 12450, mrr: '$15,000', status: 'active' },
  { name: 'TechFlow Industries', users: 256, documents: 8920, mrr: '$12,500', status: 'active' },
  { name: 'Global Finance Ltd', users: 189, documents: 15680, mrr: '$18,000', status: 'active' },
  { name: 'Innovation Labs', users: 145, documents: 5430, mrr: '$8,500', status: 'active' },
  { name: 'SecureSign Corp', users: 98, documents: 3210, mrr: '$6,000', status: 'trial' },
]

const systemAlerts = [
  { type: 'info', message: 'Scheduled maintenance window: March 5, 2026 2:00-4:00 AM UTC', time: '2 hours ago' },
  { type: 'success', message: 'SSL certificates renewed successfully for all domains', time: '5 hours ago' },
  { type: 'warning', message: 'Storage usage at 78% - consider capacity planning', time: '1 day ago' },
]

const recentActivity = [
  { action: 'New Enterprise', detail: 'SecureSign Corp started trial', time: '3 hours ago' },
  { action: 'Plan Upgrade', detail: 'TechFlow upgraded to Enterprise Plus', time: '1 day ago' },
  { action: 'Support Ticket', detail: 'High priority ticket from Global Finance', time: '1 day ago' },
  { action: 'Contract Renewal', detail: 'Acme Corporation renewed for 2 years', time: '2 days ago' },
]

export default function OwnerDashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'enterprises' | 'revenue' | 'security' | 'support'>('overview')

  // Only platform owners should access this page
  if (user?.role !== 'platform_owner') {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#37322f] mb-2">Access Restricted</h2>
            <p className="text-[#37322f]/60 mb-4">This area is only accessible to Platform Owners.</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-[#37322f] text-white rounded-lg hover:bg-[#4a433f] transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#37322f] to-[#5a524d] rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#37322f]">Platform Owner Dashboard</h1>
              <p className="text-sm text-[#37322f]/60">SignPortal Management Console</p>
            </div>
          </div>
          <p className="text-[#37322f]/60">
            Full platform visibility with client privacy protection. Document contents are never accessible.
          </p>
        </div>

        {/* Privacy Notice Banner */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 text-sm">Privacy-First Access</h3>
            <p className="text-sm text-blue-700">
              As Platform Owner, you can view usage metrics, billing, and system health but <strong>cannot access document contents</strong>. 
              Client document data remains encrypted and private. Only metadata (counts, timestamps, file sizes) is visible.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
            { id: 'enterprises', label: 'Enterprises', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
            { id: 'revenue', label: 'Revenue & Billing', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { id: 'security', label: 'Security & Compliance', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
            { id: 'support', label: 'Support', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#37322f] text-white'
                  : 'bg-white border border-[#37322f]/10 text-[#37322f]/70 hover:bg-[#37322f]/5'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {Object.entries(platformMetrics).map(([key, metric]) => (
                <div key={key} className="bg-white rounded-xl p-4 border border-[#37322f]/10">
                  <p className="text-xs text-[#37322f]/50 mb-1">{metric.period}</p>
                  <p className="text-xl font-bold text-[#37322f]">{metric.value}</p>
                  {metric.change && (
                    <p className={`text-xs mt-1 ${metric.change.startsWith('+') ? 'text-green-600' : 'text-[#37322f]/50'}`}>
                      {metric.change}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Top Enterprises */}
              <div className="bg-white rounded-xl border border-[#37322f]/10 overflow-hidden">
                <div className="px-5 py-4 border-b border-[#37322f]/10 flex items-center justify-between">
                  <h2 className="font-semibold text-[#37322f]">Top Enterprises</h2>
                  <Link href="/owner/enterprises" className="text-sm text-[#37322f]/60 hover:text-[#37322f]">
                    View all →
                  </Link>
                </div>
                <div className="divide-y divide-[#37322f]/5">
                  {topEnterprises.map((enterprise, idx) => (
                    <div key={idx} className="px-5 py-3 flex items-center justify-between hover:bg-[#f7f5f3]/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#37322f]/10 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-medium text-[#37322f]">{enterprise.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#37322f]">{enterprise.name}</p>
                          <p className="text-xs text-[#37322f]/50">{enterprise.users} users • {enterprise.documents.toLocaleString()} docs</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#37322f]">{enterprise.mrr}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          enterprise.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {enterprise.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl border border-[#37322f]/10 overflow-hidden">
                <div className="px-5 py-4 border-b border-[#37322f]/10">
                  <h2 className="font-semibold text-[#37322f]">Recent Activity</h2>
                </div>
                <div className="divide-y divide-[#37322f]/5">
                  {recentActivity.map((activity, idx) => (
                    <div key={idx} className="px-5 py-3 flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#37322f] mt-2" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#37322f]">{activity.action}</p>
                        <p className="text-sm text-[#37322f]/60">{activity.detail}</p>
                      </div>
                      <span className="text-xs text-[#37322f]/40">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* System Alerts */}
            <div className="bg-white rounded-xl border border-[#37322f]/10 overflow-hidden">
              <div className="px-5 py-4 border-b border-[#37322f]/10">
                <h2 className="font-semibold text-[#37322f]">System Alerts</h2>
              </div>
              <div className="divide-y divide-[#37322f]/5">
                {systemAlerts.map((alert, idx) => (
                  <div key={idx} className="px-5 py-3 flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      alert.type === 'success' ? 'bg-green-100' :
                      alert.type === 'warning' ? 'bg-amber-100' : 'bg-blue-100'
                    }`}>
                      <svg className={`w-3.5 h-3.5 ${
                        alert.type === 'success' ? 'text-green-600' :
                        alert.type === 'warning' ? 'text-amber-600' : 'text-blue-600'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {alert.type === 'success' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        ) : alert.type === 'warning' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        )}
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-[#37322f]">{alert.message}</p>
                    </div>
                    <span className="text-xs text-[#37322f]/40">{alert.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Enterprises Tab */}
        {activeTab === 'enterprises' && (
          <div className="space-y-6">
            {/* Enterprise Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-5 border border-[#37322f]/10">
                <p className="text-sm text-[#37322f]/60 mb-1">Total Enterprises</p>
                <p className="text-2xl font-bold text-[#37322f]">89</p>
                <p className="text-xs text-green-600 mt-1">+7 this month</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-[#37322f]/10">
                <p className="text-sm text-[#37322f]/60 mb-1">Active Trials</p>
                <p className="text-2xl font-bold text-[#37322f]">12</p>
                <p className="text-xs text-[#37322f]/40 mt-1">5 converting soon</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-[#37322f]/10">
                <p className="text-sm text-[#37322f]/60 mb-1">Avg. Users/Enterprise</p>
                <p className="text-2xl font-bold text-[#37322f]">51</p>
                <p className="text-xs text-green-600 mt-1">+8% growth</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-[#37322f]/10">
                <p className="text-sm text-[#37322f]/60 mb-1">Churn Rate</p>
                <p className="text-2xl font-bold text-[#37322f]">2.1%</p>
                <p className="text-xs text-green-600 mt-1">-0.3% vs last month</p>
              </div>
            </div>

            {/* Enterprise List */}
            <div className="bg-white rounded-xl border border-[#37322f]/10 overflow-hidden">
              <div className="px-5 py-4 border-b border-[#37322f]/10 flex items-center justify-between">
                <h2 className="font-semibold text-[#37322f]">All Enterprises</h2>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search enterprises..."
                    className="px-3 py-1.5 text-sm border border-[#37322f]/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                  />
                  <button className="px-3 py-1.5 bg-[#37322f] text-white text-sm rounded-lg hover:bg-[#4a433f]">
                    + Add Enterprise
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#f7f5f3]">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-[#37322f]/60 uppercase">Enterprise</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-[#37322f]/60 uppercase">Plan</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-[#37322f]/60 uppercase">Users</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-[#37322f]/60 uppercase">Documents</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-[#37322f]/60 uppercase">MRR</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-[#37322f]/60 uppercase">Status</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-[#37322f]/60 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#37322f]/5">
                    {topEnterprises.map((enterprise, idx) => (
                      <tr key={idx} className="hover:bg-[#f7f5f3]/50">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#37322f]/10 rounded-lg flex items-center justify-center">
                              <span className="text-xs font-medium text-[#37322f]">{enterprise.name.charAt(0)}</span>
                            </div>
                            <span className="text-sm font-medium text-[#37322f]">{enterprise.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-[#37322f]">Enterprise</td>
                        <td className="px-5 py-4 text-sm text-[#37322f]">{enterprise.users}</td>
                        <td className="px-5 py-4 text-sm text-[#37322f]">{enterprise.documents.toLocaleString()}</td>
                        <td className="px-5 py-4 text-sm font-semibold text-[#37322f]">{enterprise.mrr}</td>
                        <td className="px-5 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            enterprise.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {enterprise.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <button className="text-sm text-[#37322f]/60 hover:text-[#37322f]">Manage →</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <div className="space-y-6">
            {/* Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-5 border border-[#37322f]/10">
                <p className="text-sm text-[#37322f]/60 mb-1">Monthly Recurring Revenue</p>
                <p className="text-2xl font-bold text-[#37322f]">$847,000</p>
                <p className="text-xs text-green-600 mt-1">+12% vs last month</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-[#37322f]/10">
                <p className="text-sm text-[#37322f]/60 mb-1">Annual Run Rate</p>
                <p className="text-2xl font-bold text-[#37322f]">$10.2M</p>
                <p className="text-xs text-green-600 mt-1">+18% YoY growth</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-[#37322f]/10">
                <p className="text-sm text-[#37322f]/60 mb-1">Avg. Revenue/Enterprise</p>
                <p className="text-2xl font-bold text-[#37322f]">$9,517</p>
                <p className="text-xs text-green-600 mt-1">+5% vs last month</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-[#37322f]/10">
                <p className="text-sm text-[#37322f]/60 mb-1">Outstanding Invoices</p>
                <p className="text-2xl font-bold text-[#37322f]">$42,500</p>
                <p className="text-xs text-amber-600 mt-1">3 overdue</p>
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
              <h2 className="font-semibold text-[#37322f] mb-4">Revenue by Plan Type</h2>
              <div className="space-y-4">
                {[
                  { plan: 'Enterprise Plus', revenue: '$425,000', percentage: 50, color: 'bg-[#37322f]' },
                  { plan: 'Enterprise', revenue: '$254,000', percentage: 30, color: 'bg-blue-500' },
                  { plan: 'Professional', revenue: '$127,000', percentage: 15, color: 'bg-green-500' },
                  { plan: 'Starter', revenue: '$41,000', percentage: 5, color: 'bg-amber-500' },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-[#37322f]">{item.plan}</span>
                      <span className="text-sm text-[#37322f]/60">{item.revenue} ({item.percentage}%)</span>
                    </div>
                    <div className="h-2 bg-[#37322f]/10 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* Security Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-green-900">Security Status</p>
                    <p className="text-sm text-green-700">All systems secure</p>
                  </div>
                </div>
                <p className="text-xs text-green-600">Last security scan: 2 hours ago</p>
              </div>

              <div className="bg-white border border-[#37322f]/10 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#37322f]/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#37322f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[#37322f]">Encryption</p>
                    <p className="text-sm text-[#37322f]/60">AES-256 + TLS 1.3</p>
                  </div>
                </div>
                <p className="text-xs text-[#37322f]/50">All data encrypted at rest and in transit</p>
              </div>

              <div className="bg-white border border-[#37322f]/10 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#37322f]/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#37322f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[#37322f]">Compliance</p>
                    <p className="text-sm text-[#37322f]/60">SOC 2, ISO 27001</p>
                  </div>
                </div>
                <p className="text-xs text-[#37322f]/50">Last audit: January 2026</p>
              </div>
            </div>

            {/* Privacy Controls */}
            <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
              <h2 className="font-semibold text-[#37322f] mb-4">Client Privacy Controls</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#f7f5f3] rounded-lg">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="font-medium text-[#37322f]">Document Content Isolation</p>
                      <p className="text-sm text-[#37322f]/60">Platform owner cannot access document contents</p>
                    </div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Enforced</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-[#f7f5f3] rounded-lg">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="font-medium text-[#37322f]">Client-Side Encryption Keys</p>
                      <p className="text-sm text-[#37322f]/60">Encryption keys managed by enterprise customers</p>
                    </div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Enforced</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-[#f7f5f3] rounded-lg">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="font-medium text-[#37322f]">Audit Log Transparency</p>
                      <p className="text-sm text-[#37322f]/60">All platform owner actions are logged and auditable</p>
                    </div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Enforced</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Support Tab */}
        {activeTab === 'support' && (
          <div className="space-y-6">
            {/* Support Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-5 border border-[#37322f]/10">
                <p className="text-sm text-[#37322f]/60 mb-1">Open Tickets</p>
                <p className="text-2xl font-bold text-[#37322f]">23</p>
                <p className="text-xs text-amber-600 mt-1">4 high priority</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-[#37322f]/10">
                <p className="text-sm text-[#37322f]/60 mb-1">Avg. Response Time</p>
                <p className="text-2xl font-bold text-[#37322f]">2.4h</p>
                <p className="text-xs text-green-600 mt-1">-18% improvement</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-[#37322f]/10">
                <p className="text-sm text-[#37322f]/60 mb-1">Satisfaction Score</p>
                <p className="text-2xl font-bold text-[#37322f]">4.8/5</p>
                <p className="text-xs text-[#37322f]/50 mt-1">Based on 156 reviews</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-[#37322f]/10">
                <p className="text-sm text-[#37322f]/60 mb-1">Resolved This Week</p>
                <p className="text-2xl font-bold text-[#37322f]">47</p>
                <p className="text-xs text-green-600 mt-1">+12% vs last week</p>
              </div>
            </div>

            {/* Recent Tickets */}
            <div className="bg-white rounded-xl border border-[#37322f]/10 overflow-hidden">
              <div className="px-5 py-4 border-b border-[#37322f]/10 flex items-center justify-between">
                <h2 className="font-semibold text-[#37322f]">Recent Support Tickets</h2>
                <Link href="/owner/support" className="text-sm text-[#37322f]/60 hover:text-[#37322f]">View all →</Link>
              </div>
              <div className="divide-y divide-[#37322f]/5">
                {[
                  { id: 'TKT-1234', enterprise: 'Global Finance Ltd', subject: 'API rate limiting issue', priority: 'high', status: 'open', time: '2 hours ago' },
                  { id: 'TKT-1233', enterprise: 'Acme Corporation', subject: 'SSO configuration help', priority: 'medium', status: 'in-progress', time: '4 hours ago' },
                  { id: 'TKT-1232', enterprise: 'TechFlow Industries', subject: 'Billing inquiry', priority: 'low', status: 'open', time: '1 day ago' },
                  { id: 'TKT-1231', enterprise: 'Innovation Labs', subject: 'Custom integration request', priority: 'medium', status: 'pending', time: '1 day ago' },
                ].map((ticket, idx) => (
                  <div key={idx} className="px-5 py-4 flex items-center justify-between hover:bg-[#f7f5f3]/50">
                    <div className="flex items-center gap-4">
                      <span className={`w-2 h-2 rounded-full ${
                        ticket.priority === 'high' ? 'bg-red-500' :
                        ticket.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-[#37322f]">{ticket.subject}</p>
                        <p className="text-xs text-[#37322f]/50">{ticket.id} • {ticket.enterprise}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        ticket.status === 'open' ? 'bg-blue-100 text-blue-700' :
                        ticket.status === 'in-progress' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {ticket.status}
                      </span>
                      <span className="text-xs text-[#37322f]/40">{ticket.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="mt-8 p-4 bg-[#37322f]/5 rounded-xl">
          <p className="text-xs text-[#37322f]/60 mb-2">Platform Owner Quick Links</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/owner/enterprises" className="text-sm text-[#37322f] hover:underline">Enterprise Management</Link>
            <span className="text-[#37322f]/30">•</span>
            <Link href="/owner/billing" className="text-sm text-[#37322f] hover:underline">Billing & Invoices</Link>
            <span className="text-[#37322f]/30">•</span>
            <Link href="/owner/system" className="text-sm text-[#37322f] hover:underline">System Configuration</Link>
            <span className="text-[#37322f]/30">•</span>
            <Link href="/owner/audit" className="text-sm text-[#37322f] hover:underline">Audit Logs</Link>
            <span className="text-[#37322f]/30">•</span>
            <Link href="/owner/support" className="text-sm text-[#37322f] hover:underline">Support Dashboard</Link>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}
