'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import FooterSection from '@/components/footer-section'
import SearchWithSuggestions, { SearchSuggestion } from '@/components/search-with-suggestions'

const supportOptions = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: 'Live Chat',
    desc: 'Chat with our support team in real-time',
    action: 'Start Chat',
    available: true,
    hours: '24/7 for Business & Enterprise',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Email Support',
    desc: 'Get help via email within 24 hours',
    action: 'Send Email',
    available: true,
    hours: 'Response within 24 hours',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    title: 'Phone Support',
    desc: 'Speak directly with our experts',
    action: 'Call Now',
    available: true,
    hours: 'Mon-Fri, 9am-6pm EST',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Screen Share',
    desc: 'Get hands-on assistance',
    action: 'Schedule',
    available: true,
    hours: 'Enterprise plans only',
  },
]

const faqs = [
  {
    q: 'How do I reset my password?',
    a: 'Click "Forgot Password" on the login page. You\'ll receive an email with a reset link valid for 24 hours.'
  },
  {
    q: 'Can I cancel a document after sending?',
    a: 'Yes, go to the document in your dashboard and click "Void". All signers will be notified that the document has been cancelled.'
  },
  {
    q: 'What file formats are supported?',
    a: 'We support PDF, Word (.doc, .docx), Excel (.xls, .xlsx), and common image formats (PNG, JPG). Files are converted to PDF for signing.'
  },
  {
    q: 'How do I add more users to my account?',
    a: 'Navigate to Settings > Team Members > Invite User. Enter their email and select their role permissions.'
  },
  {
    q: 'Is SignPortal legally binding?',
    a: 'Yes, SignPortal signatures are legally binding under ESIGN Act, UETA, and eIDAS regulations. Each signature includes a complete audit trail.'
  },
  {
    q: 'How do I integrate with my CRM?',
    a: 'Use our native integrations or REST API. Check our documentation for step-by-step guides for Salesforce, HubSpot, and more.'
  },
]

const ticketCategories = ['Technical Issue', 'Billing Question', 'Feature Request', 'Account Help', 'Other']

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    description: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  // Generate search suggestions from FAQs and common help topics
  const searchSuggestions: SearchSuggestion[] = useMemo(() => {
    const faqSuggestions = faqs.map((faq, idx) => ({
      id: `faq-${idx}`,
      title: faq.q,
      description: faq.a.substring(0, 100) + '...',
      href: `#faq-${idx}`,
      category: 'FAQs'
    }))

    const helpTopics: SearchSuggestion[] = [
      { id: 'docs', title: 'Documentation', description: 'Browse our comprehensive guides', href: '/docs', category: 'Resources' },
      { id: 'api', title: 'API Reference', description: 'Technical API documentation', href: '/api-reference', category: 'Resources' },
      { id: 'quickstart', title: 'Quick Start Guide', description: 'Get started in 5 minutes', href: '/docs/quickstart', category: 'Resources' },
      { id: 'security', title: 'Security & Compliance', description: 'Learn about our security measures', href: '/docs/security', category: 'Resources' },
      { id: 'ticket', title: 'Submit a Ticket', description: 'Create a new support ticket', href: '#submit-ticket', category: 'Support' },
      { id: 'live-chat', title: 'Live Chat', description: 'Chat with our support team', href: '#live-chat', category: 'Support' },
    ]

    return [...helpTopics, ...faqSuggestions]
  }, [])

  const filteredFaqs = searchQuery 
    ? faqs.filter(faq => 
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs

  return (
    <div className="min-h-screen bg-[#f7f5f3]">
      <Header />
      
      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-white to-[#f7f5f3]">
        <div className="max-w-[1060px] mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-[#37322f] mb-6">
            How can we help?
          </h1>
          <p className="text-lg text-[#37322f]/70 max-w-2xl mx-auto mb-8">
            Find answers in our documentation or get in touch with our support team.
          </p>
          
          {/* Search with suggestions */}
          <div className="max-w-xl mx-auto">
            <SearchWithSuggestions
              placeholder="Search for help..."
              suggestions={searchSuggestions}
              onSearch={(q) => setSearchQuery(q)}
              inputClassName="py-4 text-base border-[#37322f]/20"
              emptyMessage="No results found. Try submitting a support ticket below."
              showCategoryLabels={true}
              maxSuggestions={10}
            />
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-12">
        <div className="max-w-[1060px] mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportOptions.map((option, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-[#37322f]/10 p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#37322f]/5 rounded-xl flex items-center justify-center text-[#37322f]">
                  {option.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#37322f] mb-2">{option.title}</h3>
                <p className="text-sm text-[#37322f]/60 mb-4">{option.desc}</p>
                <button className="w-full py-2 bg-[#37322f] text-white rounded-lg font-medium hover:bg-[#2a2520] transition-colors">
                  {option.action}
                </button>
                <p className="text-xs text-[#37322f]/50 mt-3">{option.hours}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8">
        <div className="max-w-[1060px] mx-auto px-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <Link href="/docs" className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#37322f]/10 hover:bg-[#37322f]/5 transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-[#37322f]">Documentation</div>
                <div className="text-sm text-[#37322f]/60">Guides and tutorials</div>
              </div>
            </Link>
            <Link href="/api-reference" className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#37322f]/10 hover:bg-[#37322f]/5 transition-colors">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-[#37322f]">API Reference</div>
                <div className="text-sm text-[#37322f]/60">Developer resources</div>
              </div>
            </Link>
            <Link href="/status" className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#37322f]/10 hover:bg-[#37322f]/5 transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-[#37322f]">System Status</div>
                <div className="text-sm text-[#37322f]/60">Service availability</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-white">
        <div className="max-w-[800px] mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#37322f] text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => (
              <details key={idx} className="group bg-[#f7f5f3] rounded-xl overflow-hidden">
                <summary className="p-4 cursor-pointer list-none flex items-center justify-between font-medium text-[#37322f]">
                  {faq.q}
                  <svg className="w-5 h-5 text-[#37322f]/60 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 text-[#37322f]/70">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
          {filteredFaqs.length === 0 && (
            <p className="text-center text-[#37322f]/60">No results found. Try a different search or submit a ticket below.</p>
          )}
        </div>
      </section>

      {/* Submit Ticket */}
      <section className="py-16">
        <div className="max-w-[800px] mx-auto px-4">
          <div className="bg-white rounded-2xl border border-[#37322f]/10 overflow-hidden">
            <div className="p-6 border-b border-[#37322f]/10">
              <h2 className="text-xl font-semibold text-[#37322f]">Submit a Support Ticket</h2>
              <p className="text-sm text-[#37322f]/60 mt-1">Can't find what you're looking for? We'll get back to you within 24 hours.</p>
            </div>
            
            {submitted ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#37322f] mb-2">Ticket Submitted!</h3>
                <p className="text-[#37322f]/60 mb-4">We've received your request and will respond within 24 hours.</p>
                <p className="text-sm text-[#37322f]/50">Ticket ID: #SP-{Math.random().toString(36).substr(2, 8).toUpperCase()}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#37322f] mb-2">Subject</label>
                    <input
                      type="text"
                      required
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                      className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                      placeholder="Brief description of your issue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#37322f] mb-2">Category</label>
                    <select
                      required
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                      className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                    >
                      <option value="">Select a category</option>
                      {ticketCategories.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#37322f] mb-2">Priority</label>
                  <div className="flex gap-4">
                    {['Low', 'Medium', 'High'].map((p) => (
                      <label key={p} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="priority"
                          value={p.toLowerCase()}
                          checked={ticketForm.priority === p.toLowerCase()}
                          onChange={(e) => setTicketForm({...ticketForm, priority: e.target.value})}
                          className="accent-[#37322f]"
                        />
                        <span className="text-sm text-[#37322f]">{p}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#37322f] mb-2">Description</label>
                  <textarea
                    required
                    rows={5}
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                    className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                    placeholder="Please provide as much detail as possible..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-[#37322f] text-white rounded-xl font-semibold hover:bg-[#2a2520] transition-colors"
                >
                  Submit Ticket
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  )
}
