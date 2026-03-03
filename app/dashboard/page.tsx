'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ProtectedLayout from '@/components/layouts/protected-layout'
import { useAuth } from '@/lib/auth-context'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  const navigateTo = (path: string) => {
    router.push(path)
  }

  return (
    <ProtectedLayout>
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#37322f] mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-[#37322f]/60 text-lg">
            Here&apos;s what&apos;s happening with your documents today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Documents Pending', value: '12', change: '+3 today', color: 'bg-amber-500' },
            { label: 'Awaiting Signature', value: '8', change: '2 urgent', color: 'bg-blue-500' },
            { label: 'Completed This Week', value: '24', change: '+18%', color: 'bg-green-500' },
            { label: 'Team Members', value: '6', change: '1 pending invite', color: 'bg-purple-500' },
          ].map((stat, index) => (
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

        {/* Quick Actions */}
        <h2 className="text-xl font-semibold text-[#37322f] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Create Document Card */}
          <div 
            onClick={() => navigateTo('/documents/new')}
            className="bg-white rounded-xl p-6 border border-[#37322f]/10 hover:shadow-lg hover:border-[#37322f]/20 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 bg-[#37322f] rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#37322f] mb-2">Create Document</h3>
            <p className="text-[#37322f]/60 text-sm mb-4">Upload and send a document for signing</p>
            <span className="text-[#37322f] font-medium hover:underline text-sm inline-flex items-center gap-1">
              Get started 
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>

          {/* Workflows Card */}
          <div 
            onClick={() => navigateTo('/workflows')}
            className="bg-white rounded-xl p-6 border border-[#37322f]/10 hover:shadow-lg hover:border-[#37322f]/20 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#37322f] mb-2">Workflows</h3>
            <p className="text-[#37322f]/60 text-sm mb-4">Create multi-signer signing workflows</p>
            <span className="text-[#37322f] font-medium hover:underline text-sm inline-flex items-center gap-1">
              Build workflow
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>

          {/* Track Signatures Card */}
          <div 
            onClick={() => navigateTo('/documents')}
            className="bg-white rounded-xl p-6 border border-[#37322f]/10 hover:shadow-lg hover:border-[#37322f]/20 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#37322f] mb-2">Track Signatures</h3>
            <p className="text-[#37322f]/60 text-sm mb-4">Monitor document signing progress</p>
            <span className="text-[#37322f] font-medium hover:underline text-sm inline-flex items-center gap-1">
              View status
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>

          {/* Team Management Card */}
          <div 
            onClick={() => navigateTo('/settings/team')}
            className="bg-white rounded-xl p-6 border border-[#37322f]/10 hover:shadow-lg hover:border-[#37322f]/20 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#37322f] mb-2">Team Management</h3>
            <p className="text-[#37322f]/60 text-sm mb-4">Manage team members & permissions</p>
            <span className="text-[#37322f] font-medium hover:underline text-sm inline-flex items-center gap-1">
              Manage team
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
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
