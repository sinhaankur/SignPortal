"use client"

import { useState } from "react"
import Link from "next/link"
import ProtectedLayout from "@/components/layouts/protected-layout"
import { useAuth } from "@/lib/auth-context"

export default function AdminDashboard() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for dashboard
  const stats = {
    totalEnterprises: 47,
    activeUsers: 12543,
    documentsProcessed: 89234,
    storageUsed: "2.4 TB"
  }

  const systemHealth = {
    api: { status: "healthy", latency: "23ms" },
    database: { status: "healthy", connections: 142 },
    cache: { status: "healthy", hitRate: "98.2%" },
    storage: { status: "healthy", used: "68%" }
  }

  const recentAlerts = [
    { id: 1, type: "warning", message: "High API latency detected on EU cluster", time: "5 min ago" },
    { id: 2, type: "info", message: "Enterprise 'Acme Corp' completed AD sync", time: "12 min ago" },
    { id: 3, type: "success", message: "System backup completed successfully", time: "1 hour ago" },
    { id: 4, type: "warning", message: "Storage threshold 70% reached on Silo-23", time: "2 hours ago" }
  ]

  const recentEnterprises = [
    { id: 1, name: "Global Financial Services", users: 2340, status: "active", tier: "Enterprise" },
    { id: 2, name: "Healthcare United", users: 890, status: "active", tier: "Enterprise" },
    { id: 3, name: "Legal Partners LLP", users: 156, status: "pending", tier: "Enterprise" },
    { id: 4, name: "TechStart Inc", users: 45, status: "active", tier: "Business" }
  ]

  // Check role access
  const allowedRoles = ['admin', 'enterprise_admin', 'super_admin', 'platform_owner']
  if (!user?.role || !allowedRoles.includes(user.role)) {
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
            <p className="text-[#37322f]/60">Admin Dashboard requires Admin privileges.</p>
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
            <div className="w-10 h-10 bg-[#37322f] rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#37322f]">Admin Dashboard</h1>
              <p className="text-sm text-[#37322f]/60">Platform administration and management</p>
            </div>
          </div>
        </div>

        {/* Role Badge */}
        <div className="mb-6 bg-[#37322f]/5 border border-[#37322f]/10 rounded-xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#37322f] rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-[#37322f]">Admin Access</p>
              <p className="text-sm text-[#37322f]/60">Full platform control • Enterprise-level privileges</p>
            </div>
          </div>
          <span className="text-xs text-[#37322f]/50">Last login: Today, 09:42 AM</span>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-medium">+3 this month</span>
            </div>
            <p className="text-3xl font-bold text-[#37322f] mb-1">{stats.totalEnterprises}</p>
            <p className="text-sm text-[#37322f]/60">Total Enterprises</p>
          </div>

          <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-medium">+234 this week</span>
            </div>
            <p className="text-3xl font-bold text-[#37322f] mb-1">{stats.activeUsers.toLocaleString()}</p>
            <p className="text-sm text-[#37322f]/60">Active Users</p>
          </div>

          <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-medium">+1.2K today</span>
            </div>
            <p className="text-3xl font-bold text-[#37322f] mb-1">{stats.documentsProcessed.toLocaleString()}</p>
            <p className="text-sm text-[#37322f]/60">Documents Processed</p>
          </div>

          <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full font-medium">68% used</span>
            </div>
            <p className="text-3xl font-bold text-[#37322f] mb-1">{stats.storageUsed}</p>
            <p className="text-sm text-[#37322f]/60">Storage Used</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* System Health */}
          <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#37322f] flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                System Health
              </h2>
              <span className="text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full font-medium">All Systems Operational</span>
            </div>
            <div className="space-y-3">
              {Object.entries(systemHealth).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-[#f7f5f3] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${value.status === 'healthy' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                    <span className="text-[#37322f] capitalize font-medium">{key}</span>
                  </div>
                  <span className="text-sm text-[#37322f]/60">
                    {Object.values(value)[1]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
            <h2 className="text-lg font-semibold text-[#37322f] mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#37322f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <Link 
                href="/admin/enterprises"
                className="p-4 bg-[#f7f5f3] rounded-xl hover:bg-[#37322f]/10 transition-colors group"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-[#37322f]">Manage Enterprises</p>
                <p className="text-xs text-[#37322f]/50">View & configure</p>
              </Link>
              <Link 
                href="/admin/users"
                className="p-4 bg-[#f7f5f3] rounded-xl hover:bg-[#37322f]/10 transition-colors group"
              >
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-[#37322f]">User Management</p>
                <p className="text-xs text-[#37322f]/50">Roles & access</p>
              </Link>
              <Link 
                href="/admin/security"
                className="p-4 bg-[#f7f5f3] rounded-xl hover:bg-[#37322f]/10 transition-colors group"
              >
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-[#37322f]">Security Policies</p>
                <p className="text-xs text-[#37322f]/50">MFA, SSO config</p>
              </Link>
              <Link 
                href="/admin/database"
                className="p-4 bg-[#f7f5f3] rounded-xl hover:bg-[#37322f]/10 transition-colors group"
              >
                <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-[#37322f]">Database Config</p>
                <p className="text-xs text-[#37322f]/50">Provisioning</p>
              </Link>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#37322f] flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Recent Alerts
              </h2>
              <Link href="/admin/alerts" className="text-xs text-[#37322f] hover:text-[#37322f]/70 font-medium">View all</Link>
            </div>
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="p-3 bg-[#f7f5f3] rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      alert.type === 'warning' ? 'bg-amber-500' :
                      alert.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-[#37322f]">{alert.message}</p>
                      <p className="text-xs text-[#37322f]/50 mt-1">{alert.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enterprise List */}
        <div className="bg-white rounded-xl border border-[#37322f]/10 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#37322f] flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Recent Enterprises
            </h2>
            <Link 
              href="/admin/enterprises" 
              className="flex items-center gap-1 text-sm text-[#37322f] hover:text-[#37322f]/70 font-medium"
            >
              View all enterprises
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#37322f]/10">
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#37322f]/60">Enterprise</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#37322f]/60">Users</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#37322f]/60">Tier</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#37322f]/60">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#37322f]/60">Data Silo</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-[#37322f]/60">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentEnterprises.map((enterprise) => (
                  <tr key={enterprise.id} className="border-b border-[#37322f]/5 hover:bg-[#f7f5f3]">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#37322f]/10 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-[#37322f]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <span className="font-medium text-[#37322f]">{enterprise.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[#37322f]/70">{enterprise.users.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        enterprise.tier === 'Enterprise' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {enterprise.tier}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`flex items-center gap-2 ${
                        enterprise.status === 'active' ? 'text-green-600' : 'text-amber-600'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          enterprise.status === 'active' ? 'bg-green-500' : 'bg-amber-500'
                        }`}></span>
                        {enterprise.status === 'active' ? 'Active' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="flex items-center gap-2 text-[#37322f]/60">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Silo-{enterprise.id.toString().padStart(2, '0')}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link 
                        href={`/admin/enterprises/${enterprise.id}`}
                        className="text-sm text-[#37322f] hover:text-[#37322f]/70 font-medium"
                      >
                        Manage →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Architecture Overview */}
        <div className="bg-white rounded-xl border border-[#37322f]/10 p-8">
          <h2 className="text-xl font-semibold text-[#37322f] mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-[#37322f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            Platform Architecture Overview
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-[#f7f5f3] rounded-xl">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#37322f] mb-2">Zero-Trust</h3>
              <p className="text-sm text-[#37322f]/60">Complete isolation between tenant environments</p>
            </div>
            <div className="text-center p-6 bg-[#f7f5f3] rounded-xl">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#37322f] mb-2">Data Silos</h3>
              <p className="text-sm text-[#37322f]/60">Isolated database schemas per enterprise</p>
            </div>
            <div className="text-center p-6 bg-[#f7f5f3] rounded-xl">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#37322f] mb-2">Encryption</h3>
              <p className="text-sm text-[#37322f]/60">Segregated encryption keys per tenant</p>
            </div>
            <div className="text-center p-6 bg-[#f7f5f3] rounded-xl">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012-2v-1a2 2 0 012-2h1.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h.095M12 3.855v0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#37322f] mb-2">Compliance</h3>
              <p className="text-sm text-[#37322f]/60">HIPAA, GDPR, SOC2 ready architecture</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}
