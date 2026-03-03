'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import FooterSection from '@/components/footer-section'

const services = [
  { name: 'Web Application', status: 'operational', uptime: 99.99 },
  { name: 'API', status: 'operational', uptime: 99.98 },
  { name: 'Document Processing', status: 'operational', uptime: 99.95 },
  { name: 'Email Delivery', status: 'operational', uptime: 99.97 },
  { name: 'Webhooks', status: 'operational', uptime: 99.94 },
  { name: 'Authentication Services', status: 'operational', uptime: 99.99 },
  { name: 'Storage', status: 'operational', uptime: 99.99 },
  { name: 'Search & Indexing', status: 'operational', uptime: 99.92 },
]

const incidents = [
  {
    date: '2025-01-15',
    title: 'Scheduled Maintenance Completed',
    status: 'resolved',
    updates: [
      { time: '06:00 UTC', message: 'Maintenance completed successfully. All systems operating normally.' },
      { time: '04:00 UTC', message: 'Maintenance in progress. Minor delays in document processing.' },
      { time: '03:00 UTC', message: 'Beginning scheduled maintenance window.' },
    ]
  },
  {
    date: '2025-01-10',
    title: 'Email Delivery Delays',
    status: 'resolved',
    updates: [
      { time: '15:30 UTC', message: 'Issue resolved. Email delivery times back to normal.' },
      { time: '14:00 UTC', message: 'Identified issue with email provider. Working on resolution.' },
      { time: '13:45 UTC', message: 'Investigating reports of delayed email notifications.' },
    ]
  },
  {
    date: '2025-01-05',
    title: 'API Latency Increase',
    status: 'resolved',
    updates: [
      { time: '11:00 UTC', message: 'Performance restored to normal levels.' },
      { time: '10:30 UTC', message: 'Deployed fix. Monitoring performance.' },
      { time: '10:00 UTC', message: 'Investigating elevated API response times.' },
    ]
  },
]

const uptimeHistory = [
  { date: 'Jan 1', uptime: 100 },
  { date: 'Jan 2', uptime: 100 },
  { date: 'Jan 3', uptime: 100 },
  { date: 'Jan 4', uptime: 100 },
  { date: 'Jan 5', uptime: 99.5 },
  { date: 'Jan 6', uptime: 100 },
  { date: 'Jan 7', uptime: 100 },
  { date: 'Jan 8', uptime: 100 },
  { date: 'Jan 9', uptime: 100 },
  { date: 'Jan 10', uptime: 99.8 },
  { date: 'Jan 11', uptime: 100 },
  { date: 'Jan 12', uptime: 100 },
  { date: 'Jan 13', uptime: 100 },
  { date: 'Jan 14', uptime: 100 },
  { date: 'Jan 15', uptime: 99.9 },
]

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  operational: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  degraded: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  outage: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
  maintenance: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  resolved: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
}

export default function StatusPage() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const allOperational = services.every(s => s.status === 'operational')
  const averageUptime = (services.reduce((sum, s) => sum + s.uptime, 0) / services.length).toFixed(2)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    setSubscribed(true)
  }

  return (
    <div className="min-h-screen bg-[#f7f5f3]">
      <Header />
      
      {/* Hero Status */}
      <section className="pt-24 pb-8 bg-gradient-to-b from-white to-[#f7f5f3]">
        <div className="max-w-[800px] mx-auto px-4 text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${allOperational ? 'bg-green-100' : 'bg-amber-100'}`}>
            <span className={`w-3 h-3 rounded-full animate-pulse ${allOperational ? 'bg-green-500' : 'bg-amber-500'}`}></span>
            <span className={`text-sm font-medium ${allOperational ? 'text-green-700' : 'text-amber-700'}`}>
              {allOperational ? 'All Systems Operational' : 'Partial System Outage'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#37322f] mb-4">
            System Status
          </h1>
          <p className="text-[#37322f]/70">
            Current status and uptime of SignPortal services
          </p>
        </div>
      </section>

      {/* Uptime Overview */}
      <section className="py-8">
        <div className="max-w-[800px] mx-auto px-4">
          <div className="bg-white rounded-2xl border border-[#37322f]/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#37322f]">Uptime - Last 15 Days</h2>
              <span className="text-2xl font-bold text-green-600">{averageUptime}%</span>
            </div>
            <div className="flex gap-1 h-12">
              {uptimeHistory.map((day, idx) => (
                <div 
                  key={idx} 
                  className="flex-1 relative group cursor-pointer"
                  title={`${day.date}: ${day.uptime}%`}
                >
                  <div 
                    className={`w-full h-full rounded ${day.uptime === 100 ? 'bg-green-400' : day.uptime > 99 ? 'bg-green-300' : 'bg-amber-400'}`}
                  />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#37322f] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {day.date}: {day.uptime}%
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-[#37322f]/50 mt-2">
              <span>15 days ago</span>
              <span>Today</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Status */}
      <section className="py-8">
        <div className="max-w-[800px] mx-auto px-4">
          <div className="bg-white rounded-2xl border border-[#37322f]/10 overflow-hidden">
            <div className="p-6 border-b border-[#37322f]/10">
              <h2 className="text-lg font-semibold text-[#37322f]">Services</h2>
            </div>
            <div className="divide-y divide-[#37322f]/10">
              {services.map((service, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${statusColors[service.status].dot}`}></span>
                    <span className="text-[#37322f] font-medium">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-[#37322f]/60">{service.uptime}% uptime</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${statusColors[service.status].bg} ${statusColors[service.status].text}`}>
                      {service.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Response Time */}
      <section className="py-8">
        <div className="max-w-[800px] mx-auto px-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-[#37322f]/10 p-4 text-center">
              <div className="text-2xl font-bold text-[#37322f]">45ms</div>
              <div className="text-sm text-[#37322f]/60">Avg Response Time</div>
            </div>
            <div className="bg-white rounded-xl border border-[#37322f]/10 p-4 text-center">
              <div className="text-2xl font-bold text-[#37322f]">2.5M</div>
              <div className="text-sm text-[#37322f]/60">Requests Today</div>
            </div>
            <div className="bg-white rounded-xl border border-[#37322f]/10 p-4 text-center">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-[#37322f]/60">Active Incidents</div>
            </div>
          </div>
        </div>
      </section>

      {/* Incident History */}
      <section className="py-8">
        <div className="max-w-[800px] mx-auto px-4">
          <div className="bg-white rounded-2xl border border-[#37322f]/10 overflow-hidden">
            <div className="p-6 border-b border-[#37322f]/10">
              <h2 className="text-lg font-semibold text-[#37322f]">Recent Incidents</h2>
            </div>
            <div className="divide-y divide-[#37322f]/10">
              {incidents.map((incident, idx) => (
                <details key={idx} className="group">
                  <summary className="p-4 cursor-pointer list-none flex items-center justify-between hover:bg-[#37322f]/5">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-[#37322f]/50">{incident.date}</span>
                      <span className="font-medium text-[#37322f]">{incident.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${statusColors[incident.status].bg} ${statusColors[incident.status].text}`}>
                        {incident.status}
                      </span>
                      <svg className="w-5 h-5 text-[#37322f]/40 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </summary>
                  <div className="px-4 pb-4">
                    <div className="border-l-2 border-[#37322f]/20 pl-4 ml-10 space-y-4">
                      {incident.updates.map((update, i) => (
                        <div key={i}>
                          <div className="text-xs text-[#37322f]/50 mb-1">{update.time}</div>
                          <div className="text-sm text-[#37322f]/70">{update.message}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="py-12">
        <div className="max-w-[600px] mx-auto px-4">
          <div className="bg-[#37322f] rounded-2xl p-8 text-center text-white">
            <h2 className="text-xl font-semibold mb-2">Stay Updated</h2>
            <p className="text-white/70 mb-6">
              Subscribe to get notified about scheduled maintenance and incidents.
            </p>
            {subscribed ? (
              <div className="flex items-center justify-center gap-2 text-green-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>You're subscribed to status updates</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-[#37322f] rounded-lg font-semibold hover:bg-white/90 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="py-8 text-center">
        <div className="max-w-[800px] mx-auto px-4">
          <p className="text-sm text-[#37322f]/50">
            Status page last updated: {new Date().toLocaleString()} · 
            <a href="https://twitter.com/signportal" className="underline hover:text-[#37322f] ml-1">@signportal</a>
          </p>
        </div>
      </section>

      <FooterSection />
    </div>
  )
}
