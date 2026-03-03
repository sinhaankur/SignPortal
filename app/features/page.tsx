'use client'

import Link from 'next/link'
import { Header } from '@/components/header'
import FooterSection from '@/components/footer-section'

const features = [
  {
    category: 'E-Signatures',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    color: 'blue',
    items: [
      { name: 'Draw Signature', description: 'Natural signature capture with mouse, touch, or stylus' },
      { name: 'Type Signature', description: 'Choose from multiple handwriting-style fonts' },
      { name: 'Upload Signature', description: 'Import existing signature images in PNG/JPG' },
      { name: 'Simple E-Signature (SES)', description: 'Basic electronic signatures for low-risk documents' },
      { name: 'Advanced E-Signature (AES)', description: 'Certificate-based signatures with identity verification' },
      { name: 'Qualified E-Signature (QES)', description: 'Highest level of legal validity with TSP certificates' },
    ]
  },
  {
    category: 'Form Builder',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: 'purple',
    items: [
      { name: '17+ Field Types', description: 'Text, number, date, dropdown, checkbox, radio, and more' },
      { name: 'Drag & Drop Builder', description: 'Intuitive visual form design without coding' },
      { name: 'Conditional Logic', description: 'Show/hide fields based on user responses' },
      { name: 'Calculations', description: 'Auto-calculate totals, taxes, and custom formulas' },
      { name: 'File Uploads', description: 'Accept document attachments with validation' },
      { name: 'Form Templates', description: 'Pre-built templates for common use cases' },
    ]
  },
  {
    category: 'Workflow Automation',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
    color: 'green',
    items: [
      { name: 'Visual Workflow Designer', description: 'Drag-and-drop workflow creation interface' },
      { name: 'Sequential Routing', description: 'Documents signed in a specific order' },
      { name: 'Parallel Routing', description: 'Multiple signers can sign simultaneously' },
      { name: 'Conditional Branches', description: 'Route based on field values or signer responses' },
      { name: 'Deadlines & Reminders', description: 'Automatic email reminders for pending signatures' },
      { name: 'Escalation Rules', description: 'Auto-escalate when deadlines are missed' },
    ]
  },
  {
    category: 'Document Management',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
    color: 'amber',
    items: [
      { name: 'Secure Vault', description: 'Encrypted document storage with access controls' },
      { name: 'Version History', description: 'Track all document revisions and changes' },
      { name: 'Full-Text Search', description: 'Find documents by content, not just metadata' },
      { name: 'Retention Policies', description: 'Automated archival based on compliance rules' },
      { name: 'Folder Organization', description: 'Hierarchical folders with custom permissions' },
      { name: 'Bulk Operations', description: 'Download, delete, or move multiple documents' },
    ]
  },
  {
    category: 'Security & Authentication',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: 'red',
    items: [
      { name: 'LDAP/Active Directory', description: 'Enterprise SSO with existing credentials' },
      { name: 'SMS OTP', description: 'One-time passwords via private SMS gateway' },
      { name: 'WebAuthn/FIDO2', description: 'Biometric authentication support' },
      { name: 'Hardware Keys', description: 'YubiKey and other security key support' },
      { name: 'IP Whitelisting', description: 'Restrict access by IP address ranges' },
      { name: 'Session Management', description: 'Configurable timeout and concurrent sessions' },
    ]
  },
  {
    category: 'Integration & API',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    color: 'cyan',
    items: [
      { name: 'REST API', description: 'Comprehensive API for all platform features' },
      { name: 'Webhooks', description: 'Real-time notifications for document events' },
      { name: 'SDKs', description: 'Official libraries for Node.js, Python, .NET, Java' },
      { name: 'OAuth 2.0', description: 'Secure API authentication with token refresh' },
      { name: 'Rate Limiting', description: 'Fair usage policies with quota management' },
      { name: 'Sandbox Environment', description: 'Test integrations without affecting production' },
    ]
  },
]

const colorClasses: Record<string, { bg: string; text: string; light: string }> = {
  blue: { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-100' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-100' },
  green: { bg: 'bg-green-500', text: 'text-green-600', light: 'bg-green-100' },
  amber: { bg: 'bg-amber-500', text: 'text-amber-600', light: 'bg-amber-100' },
  red: { bg: 'bg-red-500', text: 'text-red-600', light: 'bg-red-100' },
  cyan: { bg: 'bg-cyan-500', text: 'text-cyan-600', light: 'bg-cyan-100' },
}

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#f7f5f3]">
      <Header />
      
      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-white to-[#f7f5f3]">
        <div className="max-w-[1060px] mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100/80 rounded-full mb-6">
            <span className="text-sm font-medium text-[#37322f]">Platform Features</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#37322f] mb-6">
            Powerful features for
            <br />
            <span className="text-[#37322f]/50">modern document workflows</span>
          </h1>
          <p className="text-lg md:text-xl text-[#37322f]/70 max-w-2xl mx-auto">
            Everything you need to create, sign, and manage documents—all in one secure platform.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="max-w-[1060px] mx-auto px-4">
          {features.map((category, idx) => (
            <div key={idx} className="mb-16 last:mb-0">
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-14 h-14 ${colorClasses[category.color].light} rounded-xl flex items-center justify-center ${colorClasses[category.color].text}`}>
                  {category.icon}
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold text-[#37322f]">{category.category}</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="bg-white rounded-xl border border-[#37322f]/10 p-6 hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold text-[#37322f] mb-2">{item.name}</h3>
                    <p className="text-sm text-[#37322f]/60">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-[1060px] mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-[#37322f] mb-6">
            Ready to get started?
          </h2>
          <p className="text-lg text-[#37322f]/70 mb-8 max-w-xl mx-auto">
            Start your free trial today and experience the full power of SignPortal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="px-8 py-4 bg-[#37322f] text-white rounded-xl font-semibold hover:bg-[#2a2520] transition-colors">
              Start Free Trial
            </Link>
            <Link href="/contact" className="px-8 py-4 border border-[#37322f]/20 text-[#37322f] rounded-xl font-semibold hover:bg-[#37322f]/5 transition-colors">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  )
}
