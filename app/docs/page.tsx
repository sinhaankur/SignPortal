'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import FooterSection from '@/components/footer-section'
import SearchWithSuggestions, { SearchSuggestion } from '@/components/search-with-suggestions'

const docCategories = [
  {
    title: 'Getting Started',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: 'blue',
    docs: [
      { title: 'Quick Start Guide', desc: 'Get up and running in 5 minutes', href: '/docs/quickstart' },
      { title: 'Creating Your First Document', desc: 'Learn the basics of document creation', href: '/docs/first-document' },
      { title: 'Inviting Signers', desc: 'Add recipients to your documents', href: '/docs/inviting-signers' },
      { title: 'Signing Documents', desc: 'How to sign documents as a recipient', href: '/docs/signing' },
    ]
  },
  {
    title: 'Features',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    color: 'purple',
    docs: [
      { title: 'E-Signature Types', desc: 'SES, AES, and QES explained', href: '/docs/signature-types' },
      { title: 'Form Builder', desc: 'Create dynamic forms', href: '/docs/form-builder' },
      { title: 'Workflow Automation', desc: 'Set up approval workflows', href: '/docs/workflows' },
      { title: 'Templates', desc: 'Save and reuse document templates', href: '/docs/templates' },
    ]
  },
  {
    title: 'Security & Compliance',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: 'green',
    docs: [
      { title: 'Security Overview', desc: 'How we protect your data', href: '/docs/security' },
      { title: 'Compliance Certifications', desc: 'SOC 2, HIPAA, GDPR, eIDAS', href: '/docs/compliance' },
      { title: 'Authentication Options', desc: 'MFA, SSO, and LDAP setup', href: '/docs/authentication' },
      { title: 'Audit Logs', desc: 'Track all document activity', href: '/docs/audit-logs' },
    ]
  },
  {
    title: 'Integrations',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
      </svg>
    ),
    color: 'amber',
    docs: [
      { title: 'REST API Overview', desc: 'Introduction to our API', href: '/api-reference' },
      { title: 'Webhooks', desc: 'Real-time event notifications', href: '/docs/webhooks' },
      { title: 'SDK Libraries', desc: 'Node.js, Python, .NET, Java', href: '/docs/sdks' },
      { title: 'Zapier Integration', desc: 'Connect with 5000+ apps', href: '/docs/zapier' },
    ]
  },
  {
    title: 'Administration',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: 'red',
    docs: [
      { title: 'User Management', desc: 'Add and manage team members', href: '/docs/users' },
      { title: 'Roles & Permissions', desc: 'Configure access controls', href: '/docs/roles' },
      { title: 'Branding', desc: 'Customize with your logo', href: '/docs/branding' },
      { title: 'Billing & Plans', desc: 'Manage your subscription', href: '/docs/billing' },
    ]
  },
  {
    title: 'Deployment',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    ),
    color: 'cyan',
    docs: [
      { title: 'On-Premises Installation', desc: 'Deploy in your own infrastructure', href: '/docs/on-premises' },
      { title: 'Docker Setup', desc: 'Container-based deployment', href: '/docs/docker' },
      { title: 'Kubernetes', desc: 'Scale with K8s', href: '/docs/kubernetes' },
      { title: 'System Requirements', desc: 'Hardware and software specs', href: '/docs/requirements' },
    ]
  },
]

const colorClasses: Record<string, { bg: string; light: string }> = {
  blue: { bg: 'bg-blue-500', light: 'bg-blue-100 text-blue-600' },
  purple: { bg: 'bg-purple-500', light: 'bg-purple-100 text-purple-600' },
  green: { bg: 'bg-green-500', light: 'bg-green-100 text-green-600' },
  amber: { bg: 'bg-amber-500', light: 'bg-amber-100 text-amber-600' },
  red: { bg: 'bg-red-500', light: 'bg-red-100 text-red-600' },
  cyan: { bg: 'bg-cyan-500', light: 'bg-cyan-100 text-cyan-600' },
}

export default function DocsPage() {
  // Generate search suggestions from doc categories
  const searchSuggestions: SearchSuggestion[] = useMemo(() => {
    return docCategories.flatMap(category => 
      category.docs.map(doc => ({
        id: doc.href,
        title: doc.title,
        description: doc.desc,
        href: doc.href,
        category: category.title,
        icon: category.icon
      }))
    )
  }, [])

  return (
    <div className="min-h-screen bg-[#f7f5f3]">
      <Header />
      
      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-white to-[#f7f5f3]">
        <div className="max-w-[1060px] mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-serif text-[#37322f] mb-6">
            Documentation
          </h1>
          <p className="text-lg text-[#37322f]/70 max-w-2xl mx-auto mb-8">
            Everything you need to get started with SignPortal. From quick start guides 
            to advanced API documentation.
          </p>
          
          {/* Search */}
          <div className="max-w-xl mx-auto">
            <SearchWithSuggestions
              placeholder="Search documentation..."
              suggestions={searchSuggestions}
              inputClassName="py-4 text-base border-[#37322f]/20"
              emptyMessage="No documentation found. Try a different search term."
              showCategoryLabels={true}
            />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 border-b border-[#37322f]/10">
        <div className="max-w-[1060px] mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/api-reference" className="px-4 py-2 bg-white rounded-lg border border-[#37322f]/10 text-sm font-medium text-[#37322f] hover:bg-[#37322f]/5 transition-colors">
              API Reference
            </Link>
            <Link href="/docs/quickstart" className="px-4 py-2 bg-white rounded-lg border border-[#37322f]/10 text-sm font-medium text-[#37322f] hover:bg-[#37322f]/5 transition-colors">
              Quick Start
            </Link>
            <Link href="/docs/sdks" className="px-4 py-2 bg-white rounded-lg border border-[#37322f]/10 text-sm font-medium text-[#37322f] hover:bg-[#37322f]/5 transition-colors">
              SDKs
            </Link>
            <Link href="/support" className="px-4 py-2 bg-white rounded-lg border border-[#37322f]/10 text-sm font-medium text-[#37322f] hover:bg-[#37322f]/5 transition-colors">
              Get Help
            </Link>
          </div>
        </div>
      </section>

      {/* Documentation Grid */}
      <section className="py-16">
        <div className="max-w-[1060px] mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {docCategories.map((category, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-[#37322f]/10 overflow-hidden">
                <div className="p-6 border-b border-[#37322f]/10">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[category.color].light}`}>
                      {category.icon}
                    </div>
                    <h2 className="text-lg font-semibold text-[#37322f]">{category.title}</h2>
                  </div>
                </div>
                <div className="p-4">
                  <ul className="space-y-1">
                    {category.docs.map((doc, i) => (
                      <li key={i}>
                        <Link 
                          href={doc.href}
                          className="block p-3 rounded-lg hover:bg-[#37322f]/5 transition-colors group"
                        >
                          <div className="font-medium text-[#37322f] group-hover:text-[#37322f] mb-0.5">{doc.title}</div>
                          <div className="text-sm text-[#37322f]/60">{doc.desc}</div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help */}
      <section className="py-16 bg-white">
        <div className="max-w-[1060px] mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#37322f] mb-4">
            Need more help?
          </h2>
          <p className="text-[#37322f]/70 mb-8 max-w-xl mx-auto">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/support" className="px-8 py-4 bg-[#37322f] text-white rounded-xl font-semibold hover:bg-[#2a2520] transition-colors">
              Contact Support
            </Link>
            <Link href="/contact" className="px-8 py-4 bg-white text-[#37322f] border border-[#37322f]/20 rounded-xl font-semibold hover:bg-[#37322f]/5 transition-colors">
              Schedule a Call
            </Link>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  )
}
