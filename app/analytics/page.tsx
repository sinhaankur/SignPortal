'use client'

import { useState } from 'react'
import ProtectedLayout from '@/components/layouts/protected-layout'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  FileText,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  PieChart,
  Activity,
  Zap,
} from 'lucide-react'

// ============================================================================
// Types
// ============================================================================

type TimeRange = '7d' | '30d' | '90d' | '12m'

interface StatCard {
  label: string
  value: string
  change: number
  changeLabel: string
  icon: React.ElementType
  color: string
}

interface ChartData {
  name: string
  documents: number
  signatures: number
  users: number
}

// ============================================================================
// Sample Data
// ============================================================================

const STATS: StatCard[] = [
  {
    label: 'Total Documents',
    value: '2,847',
    change: 12.5,
    changeLabel: 'vs last period',
    icon: FileText,
    color: 'bg-blue-500',
  },
  {
    label: 'Completed Signatures',
    value: '8,421',
    change: 23.1,
    changeLabel: 'vs last period',
    icon: CheckCircle,
    color: 'bg-green-500',
  },
  {
    label: 'Active Users',
    value: '156',
    change: 8.3,
    changeLabel: 'vs last period',
    icon: Users,
    color: 'bg-purple-500',
  },
  {
    label: 'Avg. Completion Time',
    value: '2.4 hrs',
    change: -15.2,
    changeLabel: 'faster than before',
    icon: Clock,
    color: 'bg-amber-500',
  },
]

const CHART_DATA: ChartData[] = [
  { name: 'Jan', documents: 120, signatures: 340, users: 45 },
  { name: 'Feb', documents: 145, signatures: 420, users: 52 },
  { name: 'Mar', documents: 165, signatures: 510, users: 58 },
  { name: 'Apr', documents: 180, signatures: 580, users: 62 },
  { name: 'May', documents: 210, signatures: 650, users: 71 },
  { name: 'Jun', documents: 245, signatures: 720, users: 78 },
  { name: 'Jul', documents: 280, signatures: 810, users: 89 },
  { name: 'Aug', documents: 310, signatures: 890, users: 98 },
  { name: 'Sep', documents: 340, signatures: 960, users: 112 },
  { name: 'Oct', documents: 380, signatures: 1050, users: 125 },
  { name: 'Nov', documents: 420, signatures: 1140, users: 138 },
  { name: 'Dec', documents: 460, signatures: 1250, users: 156 },
]

const DOCUMENT_STATUS = [
  { status: 'Completed', count: 1842, percentage: 65, color: 'bg-green-500' },
  { status: 'Pending', count: 456, percentage: 16, color: 'bg-amber-500' },
  { status: 'In Progress', count: 389, percentage: 14, color: 'bg-blue-500' },
  { status: 'Expired', count: 160, percentage: 5, color: 'bg-red-500' },
]

const TOP_USERS = [
  { name: 'Sarah Johnson', email: 'sarah@acme.com', documents: 234, signatures: 567 },
  { name: 'Michael Chen', email: 'michael@acme.com', documents: 198, signatures: 445 },
  { name: 'Emily Davis', email: 'emily@acme.com', documents: 176, signatures: 398 },
  { name: 'James Wilson', email: 'james@acme.com', documents: 154, signatures: 321 },
  { name: 'Lisa Anderson', email: 'lisa@acme.com', documents: 132, signatures: 287 },
]

const RECENT_ACTIVITY = [
  { action: 'Document signed', user: 'John Smith', document: 'NDA Agreement', time: '5 min ago', type: 'sign' },
  { action: 'Document created', user: 'Sarah Johnson', document: 'Contract Q1', time: '15 min ago', type: 'create' },
  { action: 'Signature requested', user: 'Mike Chen', document: 'Invoice #1234', time: '32 min ago', type: 'request' },
  { action: 'Document completed', user: 'Emily Davis', document: 'Employment Agreement', time: '1 hr ago', type: 'complete' },
  { action: 'Document expired', user: 'System', document: 'Old Proposal', time: '2 hrs ago', type: 'expire' },
]

// ============================================================================
// Component
// ============================================================================

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d')
  const [isLoading, setIsLoading] = useState(false)

  const refreshData = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  const maxValue = Math.max(...CHART_DATA.map(d => d.signatures))

  return (
    <ProtectedLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#37322f]">Analytics Dashboard</h1>
            <p className="text-[#37322f]/60 mt-1">Monitor your document signing performance</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Time Range Selector */}
            <div className="flex items-center bg-white rounded-lg border border-[#37322f]/10 p-1">
              {(['7d', '30d', '90d', '12m'] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    timeRange === range
                      ? 'bg-[#37322f] text-white'
                      : 'text-[#37322f]/60 hover:text-[#37322f]'
                  }`}
                >
                  {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '12 Months'}
                </button>
              ))}
            </div>
            <button
              onClick={refreshData}
              className="p-2 bg-white rounded-lg border border-[#37322f]/10 hover:bg-[#37322f]/5 transition-colors"
            >
              <RefreshCw className={`w-5 h-5 text-[#37322f] ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#37322f] text-white rounded-lg hover:bg-[#4a433f] transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-[#37322f]/10"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  stat.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {Math.abs(stat.change)}%
                </div>
              </div>
              <p className="text-3xl font-bold text-[#37322f] mb-1">{stat.value}</p>
              <p className="text-sm text-[#37322f]/60">{stat.label}</p>
              <p className="text-xs text-[#37322f]/40 mt-1">{stat.changeLabel}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-[#37322f]/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-[#37322f]">Signing Activity</h2>
                <p className="text-sm text-[#37322f]/60">Documents and signatures over time</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#37322f] rounded-full" />
                  <span className="text-sm text-[#37322f]/60">Documents</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="text-sm text-[#37322f]/60">Signatures</span>
                </div>
              </div>
            </div>
            
            {/* Simple Bar Chart */}
            <div className="h-64 flex items-end gap-2">
              {CHART_DATA.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex gap-1 items-end" style={{ height: '200px' }}>
                    <div
                      className="flex-1 bg-[#37322f] rounded-t"
                      style={{ height: `${(data.documents / maxValue) * 100}%` }}
                    />
                    <div
                      className="flex-1 bg-blue-500 rounded-t"
                      style={{ height: `${(data.signatures / maxValue) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-[#37322f]/40">{data.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Document Status Pie */}
          <div className="bg-white rounded-xl p-6 border border-[#37322f]/10">
            <h2 className="text-lg font-semibold text-[#37322f] mb-6">Document Status</h2>
            
            {/* Simple Donut Visualization */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {DOCUMENT_STATUS.reduce((acc, item, index) => {
                  const prevTotal = DOCUMENT_STATUS.slice(0, index).reduce((sum, i) => sum + i.percentage, 0)
                  const circumference = 2 * Math.PI * 40
                  const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`
                  const strokeDashoffset = -(prevTotal / 100) * circumference
                  
                  acc.push(
                    <circle
                      key={index}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      strokeWidth="12"
                      className={item.color.replace('bg-', 'stroke-')}
                      style={{
                        strokeDasharray,
                        strokeDashoffset,
                      }}
                    />
                  )
                  return acc
                }, [] as JSX.Element[])}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#37322f]">2,847</p>
                  <p className="text-xs text-[#37322f]/60">Total</p>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3">
              {DOCUMENT_STATUS.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm text-[#37322f]">{item.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#37322f]">{item.count}</span>
                    <span className="text-xs text-[#37322f]/40">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Users */}
          <div className="bg-white rounded-xl border border-[#37322f]/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#37322f]/10 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#37322f]">Top Users</h2>
              <button className="text-sm text-[#37322f]/60 hover:text-[#37322f]">View all</button>
            </div>
            <div className="divide-y divide-[#37322f]/5">
              {TOP_USERS.map((user, index) => (
                <div key={index} className="px-6 py-4 flex items-center justify-between hover:bg-[#f7f5f3]/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#37322f]/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-[#37322f]">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#37322f]">{user.name}</p>
                      <p className="text-xs text-[#37322f]/60">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#37322f]">{user.documents} docs</p>
                    <p className="text-xs text-[#37322f]/60">{user.signatures} signatures</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-[#37322f]/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#37322f]/10 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#37322f]">Recent Activity</h2>
              <button className="text-sm text-[#37322f]/60 hover:text-[#37322f]">View all</button>
            </div>
            <div className="divide-y divide-[#37322f]/5">
              {RECENT_ACTIVITY.map((activity, index) => (
                <div key={index} className="px-6 py-4 flex items-start gap-4 hover:bg-[#f7f5f3]/50 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'sign' ? 'bg-green-100' :
                    activity.type === 'create' ? 'bg-blue-100' :
                    activity.type === 'request' ? 'bg-amber-100' :
                    activity.type === 'complete' ? 'bg-purple-100' :
                    'bg-red-100'
                  }`}>
                    {activity.type === 'sign' && <CheckCircle className="w-4 h-4 text-green-600" />}
                    {activity.type === 'create' && <FileText className="w-4 h-4 text-blue-600" />}
                    {activity.type === 'request' && <Zap className="w-4 h-4 text-amber-600" />}
                    {activity.type === 'complete' && <Activity className="w-4 h-4 text-purple-600" />}
                    {activity.type === 'expire' && <AlertCircle className="w-4 h-4 text-red-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#37322f]">
                      <span className="font-medium">{activity.user}</span>
                      <span className="text-[#37322f]/60"> {activity.action.toLowerCase()}</span>
                    </p>
                    <p className="text-sm text-[#37322f]/60 truncate">{activity.document}</p>
                  </div>
                  <span className="text-xs text-[#37322f]/40 whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-6 bg-white rounded-xl p-6 border border-[#37322f]/10">
          <h2 className="text-lg font-semibold text-[#37322f] mb-6">Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-[#f7f5f3] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#37322f]/60">Signature Rate</span>
                <span className="text-sm font-medium text-green-600">+5.2%</span>
              </div>
              <p className="text-2xl font-bold text-[#37322f]">94.7%</p>
              <div className="mt-2 h-2 bg-[#37322f]/10 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '94.7%' }} />
              </div>
            </div>
            <div className="p-4 bg-[#f7f5f3] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#37322f]/60">Avg. Response Time</span>
                <span className="text-sm font-medium text-blue-600">-12.3%</span>
              </div>
              <p className="text-2xl font-bold text-[#37322f]">4.2 hrs</p>
              <div className="mt-2 h-2 bg-[#37322f]/10 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }} />
              </div>
            </div>
            <div className="p-4 bg-[#f7f5f3] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#37322f]/60">User Engagement</span>
                <span className="text-sm font-medium text-purple-600">+8.7%</span>
              </div>
              <p className="text-2xl font-bold text-[#37322f]">78.3%</p>
              <div className="mt-2 h-2 bg-[#37322f]/10 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '78.3%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}
