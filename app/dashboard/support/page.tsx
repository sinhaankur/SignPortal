"use client"

import { useState } from "react"
import Link from "next/link"
import ProtectedLayout from "@/components/layouts/protected-layout"
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ChevronRight,
  Paperclip,
  Send,
  X,
  FileText
} from "lucide-react"

interface Ticket {
  id: string
  subject: string
  description: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high"
  category: string
  createdAt: string
  updatedAt: string
  messages: number
}

const demoTickets: Ticket[] = [
  {
    id: "TKT-1001",
    subject: "Unable to upload documents larger than 10MB",
    description: "I'm getting an error when trying to upload PDF files larger than 10MB.",
    status: "in-progress",
    priority: "high",
    category: "Technical Issue",
    createdAt: "2026-03-03",
    updatedAt: "2026-03-03",
    messages: 3
  },
  {
    id: "TKT-1002",
    subject: "How to set up SSO with Azure AD?",
    description: "Need help configuring Single Sign-On with our Azure Active Directory.",
    status: "open",
    priority: "medium",
    category: "Configuration Help",
    createdAt: "2026-03-02",
    updatedAt: "2026-03-02",
    messages: 1
  },
  {
    id: "TKT-1003",
    subject: "Billing question about enterprise plan",
    description: "Need clarification on the enterprise plan pricing for additional users.",
    status: "resolved",
    priority: "low",
    category: "Billing",
    createdAt: "2026-02-28",
    updatedAt: "2026-03-01",
    messages: 5
  },
  {
    id: "TKT-1004",
    subject: "Request for custom workflow feature",
    description: "We'd like to request a feature for conditional approval workflows.",
    status: "closed",
    priority: "medium",
    category: "Feature Request",
    createdAt: "2026-02-25",
    updatedAt: "2026-02-27",
    messages: 4
  }
]

const categories = [
  "Technical Issue",
  "Configuration Help",
  "Billing",
  "Feature Request",
  "Security Concern",
  "General Question"
]

export default function DashboardSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>(demoTickets)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [showNewTicketModal, setShowNewTicketModal] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  
  // New ticket form state
  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "Technical Issue",
    priority: "medium" as "low" | "medium" | "high",
    description: ""
  })

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleCreateTicket = () => {
    if (!newTicket.subject || !newTicket.description) return
    
    const ticket: Ticket = {
      id: `TKT-${1005 + tickets.length}`,
      subject: newTicket.subject,
      description: newTicket.description,
      status: "open",
      priority: newTicket.priority,
      category: newTicket.category,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      messages: 1
    }
    
    setTickets([ticket, ...tickets])
    setShowNewTicketModal(false)
    setNewTicket({ subject: "", category: "Technical Issue", priority: "medium", description: "" })
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

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#37322f]">My Support Tickets</h1>
            <p className="text-[#37322f]/60 text-sm">View and manage your support requests</p>
          </div>
          <button 
            onClick={() => setShowNewTicketModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#37322f] text-white rounded-lg hover:bg-[#37322f]/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Ticket
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-[#37322f]/10 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#37322f]">{tickets.filter(t => t.status === "open").length}</p>
                <p className="text-sm text-[#37322f]/60">Open</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[#37322f]/10 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#37322f]">{tickets.filter(t => t.status === "in-progress").length}</p>
                <p className="text-sm text-[#37322f]/60">In Progress</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[#37322f]/10 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#37322f]">{tickets.filter(t => t.status === "resolved").length}</p>
                <p className="text-sm text-[#37322f]/60">Resolved</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[#37322f]/10 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#37322f]">{tickets.length}</p>
                <p className="text-sm text-[#37322f]/60">Total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[#37322f]/10 p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#37322f]/40" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#F7F5F3] border border-[#37322f]/10 rounded-lg text-[#37322f] placeholder:text-[#37322f]/40 focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-[#F7F5F3] border border-[#37322f]/10 rounded-lg text-[#37322f] focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-white rounded-xl border border-[#37322f]/10 overflow-hidden shadow-sm">
          {filteredTickets.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="w-12 h-12 text-[#37322f]/20 mx-auto mb-4" />
              <p className="text-[#37322f]/60">No tickets found</p>
              <button 
                onClick={() => setShowNewTicketModal(true)}
                className="mt-4 text-[#37322f] hover:underline"
              >
                Create your first ticket
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#37322f]/10">
              {filteredTickets.map((ticket) => (
                <div 
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className="p-4 hover:bg-[#F7F5F3]/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(ticket.status)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-[#37322f]/50 font-mono">{ticket.id}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityBadge(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </div>
                        <h3 className="font-medium text-[#37322f] truncate">{ticket.subject}</h3>
                        <p className="text-sm text-[#37322f]/60 line-clamp-1 mt-1">{ticket.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-[#37322f]/50">
                          <span>{ticket.category}</span>
                          <span>•</span>
                          <span>{ticket.messages} messages</span>
                          <span>•</span>
                          <span>Updated {ticket.updatedAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(ticket.status)}`}>
                        {ticket.status.replace("-", " ")}
                      </span>
                      <ChevronRight className="w-4 h-4 text-[#37322f]/30" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/docs" className="bg-white rounded-xl border border-[#37322f]/10 p-5 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-[#37322f] mb-2">Documentation</h3>
            <p className="text-sm text-[#37322f]/60">Browse our comprehensive guides and tutorials</p>
          </Link>
          <Link href="/docs/api-reference" className="bg-white rounded-xl border border-[#37322f]/10 p-5 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-[#37322f] mb-2">API Reference</h3>
            <p className="text-sm text-[#37322f]/60">Technical documentation for developers</p>
          </Link>
          <Link href="/support" className="bg-white rounded-xl border border-[#37322f]/10 p-5 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-[#37322f] mb-2">Support Center</h3>
            <p className="text-sm text-[#37322f]/60">FAQs, live chat, and more support options</p>
          </Link>
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#37322f]/10 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#37322f]">Create Support Ticket</h2>
              <button 
                onClick={() => setShowNewTicketModal(false)}
                className="p-2 hover:bg-[#37322f]/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#37322f]/60" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#37322f] mb-2">Subject</label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  placeholder="Brief description of your issue"
                  className="w-full px-4 py-2 bg-[#F7F5F3] border border-[#37322f]/10 rounded-lg text-[#37322f] placeholder:text-[#37322f]/40 focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#37322f] mb-2">Category</label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                    className="w-full px-4 py-2 bg-[#F7F5F3] border border-[#37322f]/10 rounded-lg text-[#37322f] focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#37322f] mb-2">Priority</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as "low" | "medium" | "high" })}
                    className="w-full px-4 py-2 bg-[#F7F5F3] border border-[#37322f]/10 rounded-lg text-[#37322f] focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#37322f] mb-2">Description</label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder="Provide details about your issue or question..."
                  rows={5}
                  className="w-full px-4 py-2 bg-[#F7F5F3] border border-[#37322f]/10 rounded-lg text-[#37322f] placeholder:text-[#37322f]/40 focus:outline-none focus:ring-2 focus:ring-[#37322f]/20 resize-none"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-[#37322f]/60">
                <Paperclip className="w-4 h-4" />
                <span>You can attach files after creating the ticket</span>
              </div>
            </div>
            <div className="p-6 border-t border-[#37322f]/10 flex justify-end gap-3">
              <button
                onClick={() => setShowNewTicketModal(false)}
                className="px-4 py-2 text-[#37322f] hover:bg-[#37322f]/5 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTicket}
                disabled={!newTicket.subject || !newTicket.description}
                className="flex items-center gap-2 px-4 py-2 bg-[#37322f] text-white rounded-lg hover:bg-[#37322f]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                Submit Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#37322f]/10">
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
              <div className="mb-6">
                <p className="text-sm text-[#37322f]/50 mb-2">Category: {selectedTicket.category}</p>
                <p className="text-[#37322f]">{selectedTicket.description}</p>
              </div>
              
              {/* Messages Thread */}
              <div className="border-t border-[#37322f]/10 pt-6">
                <h3 className="font-medium text-[#37322f] mb-4">Messages ({selectedTicket.messages})</h3>
                <div className="space-y-4">
                  <div className="bg-[#F7F5F3] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-[#37322f] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">You</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#37322f]">You</p>
                        <p className="text-xs text-[#37322f]/50">{selectedTicket.createdAt}</p>
                      </div>
                    </div>
                    <p className="text-sm text-[#37322f]/80">{selectedTicket.description}</p>
                  </div>
                  
                  {selectedTicket.status !== "open" && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">SP</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#37322f]">SignPortal Support</p>
                          <p className="text-xs text-[#37322f]/50">{selectedTicket.updatedAt}</p>
                        </div>
                      </div>
                      <p className="text-sm text-[#37322f]/80">
                        Thank you for reaching out! We're looking into your issue and will get back to you shortly.
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Reply Input */}
                {selectedTicket.status !== "closed" && (
                  <div className="mt-4">
                    <textarea
                      placeholder="Type your reply..."
                      rows={3}
                      className="w-full px-4 py-2 bg-[#F7F5F3] border border-[#37322f]/10 rounded-lg text-[#37322f] placeholder:text-[#37322f]/40 focus:outline-none focus:ring-2 focus:ring-[#37322f]/20 resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <button className="flex items-center gap-2 px-4 py-2 bg-[#37322f] text-white rounded-lg hover:bg-[#37322f]/90 transition-colors">
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
    </ProtectedLayout>
  )
}
