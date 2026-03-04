"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Search, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ChevronRight,
  Filter,
  Building2,
  User,
  Send,
  X,
  ArrowLeft,
  BarChart3,
  TrendingUp,
  RefreshCw
} from "lucide-react"

interface Ticket {
  id: string
  subject: string
  description: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high"
  category: string
  enterprise: string
  user: string
  userEmail: string
  createdAt: string
  updatedAt: string
  messages: number
}

const demoTickets: Ticket[] = [
  {
    id: "TKT-1001",
    subject: "Unable to upload documents larger than 10MB",
    description: "I'm getting an error when trying to upload PDF files larger than 10MB. The upload starts but fails at about 80%.",
    status: "in-progress",
    priority: "high",
    category: "Technical Issue",
    enterprise: "Acme Corp",
    user: "John Smith",
    userEmail: "john@acmecorp.com",
    createdAt: "2026-03-03",
    updatedAt: "2026-03-03",
    messages: 3
  },
  {
    id: "TKT-1002",
    subject: "How to set up SSO with Azure AD?",
    description: "Need help configuring Single Sign-On with our Azure Active Directory. We have about 500 users.",
    status: "open",
    priority: "medium",
    category: "Configuration Help",
    enterprise: "TechFlow Inc",
    user: "Sarah Chen",
    userEmail: "sarah.chen@techflow.io",
    createdAt: "2026-03-02",
    updatedAt: "2026-03-02",
    messages: 1
  },
  {
    id: "TKT-1003",
    subject: "Billing question about enterprise plan",
    description: "Need clarification on the enterprise plan pricing for additional users. Are there volume discounts?",
    status: "resolved",
    priority: "low",
    category: "Billing",
    enterprise: "Global Solutions",
    user: "Mike Davis",
    userEmail: "mike@globalsolutions.com",
    createdAt: "2026-02-28",
    updatedAt: "2026-03-01",
    messages: 5
  },
  {
    id: "TKT-1004",
    subject: "Request for custom workflow feature",
    description: "We'd like to request a feature for conditional approval workflows based on document value thresholds.",
    status: "open",
    priority: "medium",
    category: "Feature Request",
    enterprise: "Innovate LLC",
    user: "Emma Wilson",
    userEmail: "emma@innovate.co",
    createdAt: "2026-03-01",
    updatedAt: "2026-03-01",
    messages: 2
  },
  {
    id: "TKT-1005",
    subject: "API rate limiting issues",
    description: "We're hitting rate limits during batch processing. Is there a way to increase our limits?",
    status: "in-progress",
    priority: "high",
    category: "Technical Issue",
    enterprise: "DataSync Pro",
    user: "Alex Turner",
    userEmail: "alex@datasync.pro",
    createdAt: "2026-02-27",
    updatedAt: "2026-03-02",
    messages: 4
  },
  {
    id: "TKT-1006",
    subject: "Security audit compliance question",
    description: "Need documentation for SOC2 compliance. Where can we find your security certifications?",
    status: "resolved",
    priority: "medium",
    category: "Security Concern",
    enterprise: "SecureBank",
    user: "Lisa Park",
    userEmail: "lpark@securebank.com",
    createdAt: "2026-02-25",
    updatedAt: "2026-02-27",
    messages: 3
  }
]

const enterprises = ["All Enterprises", "Acme Corp", "TechFlow Inc", "Global Solutions", "Innovate LLC", "DataSync Pro", "SecureBank"]
const categories = ["All Categories", "Technical Issue", "Configuration Help", "Billing", "Feature Request", "Security Concern", "General Question"]

export default function OwnerSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>(demoTickets)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [filterEnterprise, setFilterEnterprise] = useState<string>("All Enterprises")
  const [filterCategory, setFilterCategory] = useState<string>("All Categories")
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [replyText, setReplyText] = useState("")

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.enterprise.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.user.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus
    const matchesPriority = filterPriority === "all" || ticket.priority === filterPriority
    const matchesEnterprise = filterEnterprise === "All Enterprises" || ticket.enterprise === filterEnterprise
    const matchesCategory = filterCategory === "All Categories" || ticket.category === filterCategory
    return matchesSearch && matchesStatus && matchesPriority && matchesEnterprise && matchesCategory
  })

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    setTickets(tickets.map(t => 
      t.id === ticketId ? { ...t, status: newStatus as any, updatedAt: new Date().toISOString().split('T')[0] } : t
    ))
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: newStatus as any, updatedAt: new Date().toISOString().split('T')[0] })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return <AlertCircle className="w-4 h-4 text-blue-500" />
      case "in-progress": return <Clock className="w-4 h-4 text-amber-500" />
      case "resolved": return <CheckCircle className="w-4 h-4 text-green-500" />
      case "closed": return <CheckCircle className="w-4 h-4 text-gray-400" />
      default: return null
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      open: "bg-blue-100 text-blue-700",
      "in-progress": "bg-amber-100 text-amber-700",
      resolved: "bg-green-100 text-green-700",
      closed: "bg-gray-100 text-gray-600"
    }
    return styles[status] || styles.open
  }

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      low: "bg-green-100 text-green-700",
      medium: "bg-amber-100 text-amber-700",
      high: "bg-red-100 text-red-700"
    }
    return styles[priority] || styles.medium
  }

  // Stats
  const openTickets = tickets.filter(t => t.status === "open").length
  const inProgressTickets = tickets.filter(t => t.status === "in-progress").length
  const resolvedToday = tickets.filter(t => t.status === "resolved" && t.updatedAt === new Date().toISOString().split('T')[0]).length
  const highPriorityOpen = tickets.filter(t => (t.status === "open" || t.status === "in-progress") && t.priority === "high").length

  return (
    <div className="min-h-screen bg-[#F7F5F3]">
      {/* Header */}
      <header className="bg-white border-b border-[#37322f]/10 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/owner" className="p-2 hover:bg-[#37322f]/5 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-[#37322f]" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-[#37322f]">Support Ticket Management</h1>
                <p className="text-sm text-[#37322f]/60">Manage and respond to all support tickets</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-[#37322f]/70 hover:text-[#37322f] hover:bg-[#37322f]/5 rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-[#37322f]/10 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#37322f]/60 mb-1">Open Tickets</p>
                <p className="text-3xl font-bold text-[#37322f]">{openTickets}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Needs attention
            </p>
          </div>
          
          <div className="bg-white rounded-xl border border-[#37322f]/10 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#37322f]/60 mb-1">In Progress</p>
                <p className="text-3xl font-bold text-[#37322f]">{inProgressTickets}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <p className="text-xs text-amber-600 mt-2">Being handled</p>
          </div>
          
          <div className="bg-white rounded-xl border border-[#37322f]/10 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#37322f]/60 mb-1">High Priority</p>
                <p className="text-3xl font-bold text-[#37322f]">{highPriorityOpen}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <p className="text-xs text-red-600 mt-2">Urgent tickets</p>
          </div>
          
          <div className="bg-white rounded-xl border border-[#37322f]/10 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#37322f]/60 mb-1">Total Tickets</p>
                <p className="text-3xl font-bold text-[#37322f]">{tickets.length}</p>
              </div>
              <div className="w-12 h-12 bg-[#37322f]/10 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-[#37322f]" />
              </div>
            </div>
            <p className="text-xs text-[#37322f]/60 mt-2">All time</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[#37322f]/10 p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#37322f]/40" />
              <input
                type="text"
                placeholder="Search tickets, users, enterprises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#F7F5F3] border border-[#37322f]/10 rounded-lg text-[#37322f] placeholder:text-[#37322f]/40 focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-[#F7F5F3] border border-[#37322f]/10 rounded-lg text-sm text-[#37322f] focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 bg-[#F7F5F3] border border-[#37322f]/10 rounded-lg text-sm text-[#37322f] focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={filterEnterprise}
              onChange={(e) => setFilterEnterprise(e.target.value)}
              className="px-3 py-2 bg-[#F7F5F3] border border-[#37322f]/10 rounded-lg text-sm text-[#37322f] focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
            >
              {enterprises.map(ent => (
                <option key={ent} value={ent}>{ent}</option>
              ))}
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 bg-[#F7F5F3] border border-[#37322f]/10 rounded-lg text-sm text-[#37322f] focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-xl border border-[#37322f]/10 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F7F5F3] border-b border-[#37322f]/10">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#37322f]/70 uppercase tracking-wider">Ticket</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#37322f]/70 uppercase tracking-wider">Enterprise</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#37322f]/70 uppercase tracking-wider">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#37322f]/70 uppercase tracking-wider">Priority</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#37322f]/70 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#37322f]/70 uppercase tracking-wider">Updated</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#37322f]/70 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#37322f]/10">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <MessageSquare className="w-12 h-12 text-[#37322f]/20 mx-auto mb-4" />
                      <p className="text-[#37322f]/60">No tickets found matching your filters</p>
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-[#F7F5F3]/50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(ticket.status)}
                          <div>
                            <p className="text-xs text-[#37322f]/50 font-mono mb-1">{ticket.id}</p>
                            <p className="font-medium text-[#37322f] line-clamp-1">{ticket.subject}</p>
                            <p className="text-xs text-[#37322f]/50 mt-1">
                              {ticket.user} • {ticket.userEmail}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#37322f]/40" />
                          <span className="text-sm text-[#37322f]">{ticket.enterprise}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-[#37322f]">{ticket.category}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityBadge(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={ticket.status}
                          onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer ${getStatusBadge(ticket.status)}`}
                        >
                          <option value="open">open</option>
                          <option value="in-progress">in progress</option>
                          <option value="resolved">resolved</option>
                          <option value="closed">closed</option>
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-[#37322f]/60">{ticket.updatedAt}</span>
                      </td>
                      <td className="px-4 py-4">
                        <button 
                          onClick={() => setSelectedTicket(ticket)}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm text-[#37322f] hover:bg-[#37322f]/10 rounded-lg transition-colors"
                        >
                          View
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary by Category */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-[#37322f]/10 p-5 shadow-sm">
            <h3 className="font-semibold text-[#37322f] mb-4">By Category</h3>
            <div className="space-y-3">
              {["Technical Issue", "Configuration Help", "Billing", "Feature Request", "Security Concern"].map(cat => {
                const count = tickets.filter(t => t.category === cat).length
                return (
                  <div key={cat} className="flex items-center justify-between">
                    <span className="text-sm text-[#37322f]/70">{cat}</span>
                    <span className="text-sm font-medium text-[#37322f]">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-[#37322f]/10 p-5 shadow-sm">
            <h3 className="font-semibold text-[#37322f] mb-4">By Enterprise</h3>
            <div className="space-y-3">
              {enterprises.slice(1, 6).map(ent => {
                const count = tickets.filter(t => t.enterprise === ent).length
                return (
                  <div key={ent} className="flex items-center justify-between">
                    <span className="text-sm text-[#37322f]/70">{ent}</span>
                    <span className="text-sm font-medium text-[#37322f]">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-[#37322f]/10 p-5 shadow-sm">
            <h3 className="font-semibold text-[#37322f] mb-4">Response Time</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#37322f]/70">Avg First Response</span>
                <span className="text-sm font-medium text-green-600">2.4 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#37322f]/70">Avg Resolution</span>
                <span className="text-sm font-medium text-[#37322f]">1.2 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#37322f]/70">SLA Compliance</span>
                <span className="text-sm font-medium text-green-600">98.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#37322f]/70">Customer Satisfaction</span>
                <span className="text-sm font-medium text-green-600">4.8/5</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#37322f]/10 sticky top-0 bg-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-[#37322f]/50 font-mono">{selectedTicket.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(selectedTicket.status)}`}>
                      {selectedTicket.status.replace("-", " ")}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityBadge(selectedTicket.priority)}`}>
                      {selectedTicket.priority}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-[#37322f]">{selectedTicket.subject}</h2>
                </div>
                <button 
                  onClick={() => setSelectedTicket(null)}
                  className="p-2 hover:bg-[#37322f]/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#37322f]/60" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Ticket Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-[#F7F5F3] rounded-lg">
                <div>
                  <p className="text-xs text-[#37322f]/50 mb-1">Enterprise</p>
                  <p className="text-sm font-medium text-[#37322f]">{selectedTicket.enterprise}</p>
                </div>
                <div>
                  <p className="text-xs text-[#37322f]/50 mb-1">User</p>
                  <p className="text-sm font-medium text-[#37322f]">{selectedTicket.user}</p>
                </div>
                <div>
                  <p className="text-xs text-[#37322f]/50 mb-1">Category</p>
                  <p className="text-sm font-medium text-[#37322f]">{selectedTicket.category}</p>
                </div>
                <div>
                  <p className="text-xs text-[#37322f]/50 mb-1">Created</p>
                  <p className="text-sm font-medium text-[#37322f]">{selectedTicket.createdAt}</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 mb-6">
                <select
                  value={selectedTicket.status}
                  onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value)}
                  className="px-3 py-2 bg-[#F7F5F3] border border-[#37322f]/10 rounded-lg text-sm text-[#37322f] focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                >
                  <option value="open">Set as Open</option>
                  <option value="in-progress">Set as In Progress</option>
                  <option value="resolved">Set as Resolved</option>
                  <option value="closed">Set as Closed</option>
                </select>
                <button className="px-3 py-2 text-sm text-[#37322f] bg-[#F7F5F3] hover:bg-[#37322f]/10 rounded-lg transition-colors">
                  Assign to Team
                </button>
                <button className="px-3 py-2 text-sm text-[#37322f] bg-[#F7F5F3] hover:bg-[#37322f]/10 rounded-lg transition-colors">
                  Add Tag
                </button>
              </div>

              {/* Messages Thread */}
              <div className="border-t border-[#37322f]/10 pt-6">
                <h3 className="font-medium text-[#37322f] mb-4">Conversation ({selectedTicket.messages} messages)</h3>
                <div className="space-y-4">
                  {/* Customer Message */}
                  <div className="bg-[#F7F5F3] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#37322f]">{selectedTicket.user}</p>
                        <p className="text-xs text-[#37322f]/50">{selectedTicket.createdAt} • {selectedTicket.userEmail}</p>
                      </div>
                    </div>
                    <p className="text-sm text-[#37322f]/80">{selectedTicket.description}</p>
                  </div>
                  
                  {/* Support Reply (if in progress or resolved) */}
                  {(selectedTicket.status === "in-progress" || selectedTicket.status === "resolved") && (
                    <div className="bg-green-50 rounded-lg p-4 ml-8">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-[#37322f] rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">SP</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#37322f]">SignPortal Support</p>
                          <p className="text-xs text-[#37322f]/50">{selectedTicket.updatedAt}</p>
                        </div>
                      </div>
                      <p className="text-sm text-[#37322f]/80">
                        Hi {selectedTicket.user.split(' ')[0]}, thank you for reaching out! We've received your ticket and are looking into it. 
                        {selectedTicket.status === "resolved" && " This issue has been resolved. Please let us know if you have any further questions."}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Reply Input */}
                {selectedTicket.status !== "closed" && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-[#37322f] mb-2">Send Reply</label>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply to the customer..."
                      rows={4}
                      className="w-full px-4 py-2 bg-[#F7F5F3] border border-[#37322f]/10 rounded-lg text-[#37322f] placeholder:text-[#37322f]/40 focus:outline-none focus:ring-2 focus:ring-[#37322f]/20 resize-none"
                    />
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-sm text-[#37322f]/70 hover:text-[#37322f] hover:bg-[#37322f]/5 rounded-lg transition-colors">
                          Use Template
                        </button>
                        <button className="px-3 py-1.5 text-sm text-[#37322f]/70 hover:text-[#37322f] hover:bg-[#37322f]/5 rounded-lg transition-colors">
                          Add Attachment
                        </button>
                      </div>
                      <button 
                        className="flex items-center gap-2 px-4 py-2 bg-[#37322f] text-white rounded-lg hover:bg-[#37322f]/90 transition-colors disabled:opacity-50"
                        disabled={!replyText.trim()}
                      >
                        <Send className="w-4 h-4" />
                        Send Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
