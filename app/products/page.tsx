'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import FooterSection from '@/components/footer-section'

interface Product {
  id: string
  name: string
  tagline: string
  description: string
  icon: React.ReactNode
  features: string[]
  useCases: string[]
  category: 'core' | 'addon' | 'enterprise'
  badge?: string
}

const products: Product[] = [
  {
    id: 'esignature',
    name: 'SignPortal E-Signature',
    tagline: 'Secure, legally binding electronic signatures',
    description: 'Our flagship e-signature solution enables organizations to sign documents digitally with full legal validity. Supports Simple Electronic Signatures (SES), Advanced Electronic Signatures (AES), and Qualified Electronic Signatures (QES) compliant with eIDAS and global regulations.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    features: [
      'Draw, type, or upload signatures',
      'Multi-party signing workflows',
      'Certificate-based digital signatures',
      'HSM integration for key protection',
      'Timestamp authority support (RFC 3161)',
      'Audit trail with tamper-proof logging'
    ],
    useCases: [
      'Contracts and agreements',
      'HR onboarding documents',
      'Sales proposals and quotes',
      'Legal documents and NDAs'
    ],
    category: 'core',
    badge: 'Most Popular'
  },
  {
    id: 'form-builder',
    name: 'SignPortal Forms',
    tagline: 'Drag-and-drop form creation made simple',
    description: 'Create sophisticated forms and documents without any coding. Our intuitive form builder supports 17+ field types, conditional logic, calculations, and seamless integration with e-signature workflows.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    features: [
      '17+ field types (text, date, signature, etc.)',
      'Conditional logic and branching',
      'Auto-calculations and formulas',
      'File upload support',
      'Form templates library',
      'Response analytics and exports'
    ],
    useCases: [
      'Employee onboarding forms',
      'Client intake questionnaires',
      'Compliance checklists',
      'Feedback and surveys'
    ],
    category: 'core'
  },
  {
    id: 'workflow-engine',
    name: 'SignPortal Workflow',
    tagline: 'Automate document routing and approvals',
    description: 'Design and automate complex approval workflows with our visual workflow builder. Support for sequential, parallel, and conditional routing ensures documents reach the right people at the right time.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
    features: [
      'Visual workflow designer',
      'Sequential & parallel routing',
      'Conditional logic branches',
      'Deadline and reminder automation',
      'Escalation rules',
      'Real-time status tracking'
    ],
    useCases: [
      'Contract approval chains',
      'Purchase order approvals',
      'Policy acknowledgments',
      'Multi-department sign-offs'
    ],
    category: 'core'
  },
  {
    id: 'document-management',
    name: 'SignPortal Vault',
    tagline: 'Secure document storage and lifecycle management',
    description: 'Centralized repository for all your documents with enterprise-grade security. Manage document versions, set retention policies, and maintain complete control over your organizational records.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
    features: [
      'AES-256 encryption at rest',
      'Version control and history',
      'Access control and permissions',
      'Retention policy management',
      'Full-text search',
      'Automated archival'
    ],
    useCases: [
      'Contract repositories',
      'Compliance document storage',
      'HR file management',
      'Legal document archives'
    ],
    category: 'addon'
  },
  {
    id: 'api-integration',
    name: 'SignPortal API',
    tagline: 'Integrate signatures into your applications',
    description: 'Comprehensive REST API and SDKs enable seamless integration with your existing business systems. Embed e-signature capabilities directly into your applications, portals, and workflows.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    features: [
      'RESTful API endpoints',
      'SDKs for Node.js, Python, .NET, Java',
      'Webhook event notifications',
      'OAuth 2.0 authentication',
      'Rate limiting and quotas',
      'Sandbox environment'
    ],
    useCases: [
      'CRM integration (Salesforce)',
      'ERP system connections',
      'Custom portal embedding',
      'Mobile app integration'
    ],
    category: 'addon'
  },
  {
    id: 'mfa-security',
    name: 'SignPortal MFA',
    tagline: 'Multi-factor authentication for high-security signing',
    description: 'Enhanced security module for confidential and regulated documents. Enforce multi-layered verification including LDAP, SMS OTP, and biometric authentication before signature application.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    features: [
      'LDAP/Active Directory verification',
      'SMS OTP via private gateway',
      'WebAuthn/FIDO2 biometrics',
      'Touch ID and Face ID support',
      'Hardware security key support',
      'Configurable per document classification'
    ],
    useCases: [
      'Confidential contracts',
      'Healthcare documents (HIPAA)',
      'Financial agreements',
      'Government submissions'
    ],
    category: 'enterprise',
    badge: 'Enterprise'
  },
  {
    id: 'ai-compliance',
    name: 'SignPortal AI Guard',
    tagline: 'AI-powered PII detection and compliance',
    description: 'Automated scanning of documents for sensitive information before signing. Detect and flag personally identifiable information (PII) to ensure compliance with privacy regulations.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    features: [
      'SSN and ID number detection',
      'Date of birth identification',
      'Financial account recognition',
      'Address and contact detection',
      'Redaction recommendations',
      'Compliance reporting'
    ],
    useCases: [
      'GDPR compliance',
      'HIPAA document handling',
      'Financial services (SOX)',
      'Privacy protection'
    ],
    category: 'enterprise',
    badge: 'New'
  },
  {
    id: 'audit-compliance',
    name: 'SignPortal Audit+',
    tagline: 'Enterprise audit trail and compliance reporting',
    description: 'Comprehensive audit logging with blockchain-style tamper protection. Generate compliance reports for SOC 2, HIPAA, GDPR, and other regulatory frameworks.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    features: [
      'Immutable audit records',
      'Cryptographic chain verification',
      'Compliance report generation',
      'SIEM integration',
      'Custom retention policies',
      'Export to multiple formats'
    ],
    useCases: [
      'Regulatory audits',
      'Legal e-discovery',
      'Compliance certifications',
      'Internal investigations'
    ],
    category: 'enterprise'
  }
]

const categories = [
  { id: 'all', label: 'All Products' },
  { id: 'core', label: 'Core Products' },
  { id: 'addon', label: 'Add-ons' },
  { id: 'enterprise', label: 'Enterprise' }
]

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null)

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory)

  return (
    <div className="min-h-screen bg-[#f7f5f3]">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-[#f7f5f3] pt-24 pb-16">
        <div className="max-w-[1060px] mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100/80 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-[#37322f]">Complete E-Signature Platform</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#37322f] mb-6 tracking-tight">
            Our Products
          </h1>
          <p className="text-lg md:text-xl text-[#37322f]/70 max-w-2xl mx-auto mb-8">
            A comprehensive suite of document signing, workflow automation, and compliance tools 
            designed for enterprise security and on-premises deployment.
          </p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  selectedCategory === category.id
                    ? 'bg-[#37322f] text-white'
                    : 'bg-white text-[#37322f] hover:bg-[#37322f]/5 border border-[#37322f]/10'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-[1060px] mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className={`bg-white rounded-2xl border border-[#37322f]/10 overflow-hidden transition-all hover:shadow-lg ${
                  expandedProduct === product.id ? 'md:col-span-2' : ''
                }`}
              >
                <div className="p-6 md:p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-[#37322f]/5 rounded-xl flex items-center justify-center text-[#37322f]">
                        {product.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-semibold text-[#37322f]">{product.name}</h3>
                          {product.badge && (
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              product.badge === 'Most Popular' 
                                ? 'bg-amber-100 text-amber-700'
                                : product.badge === 'New'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}>
                              {product.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[#37322f]/60 text-sm">{product.tagline}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      product.category === 'core' 
                        ? 'bg-blue-100 text-blue-700'
                        : product.category === 'addon'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {product.category === 'core' ? 'Core' : product.category === 'addon' ? 'Add-on' : 'Enterprise'}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-[#37322f]/70 mb-6 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Expandable Content */}
                  {expandedProduct === product.id && (
                    <div className="grid md:grid-cols-2 gap-6 mb-6 pt-6 border-t border-[#37322f]/10">
                      {/* Features */}
                      <div>
                        <h4 className="font-semibold text-[#37322f] mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Key Features
                        </h4>
                        <ul className="space-y-2">
                          {product.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-[#37322f]/70">
                              <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Use Cases */}
                      <div>
                        <h4 className="font-semibold text-[#37322f] mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Use Cases
                        </h4>
                        <ul className="space-y-2">
                          {product.useCases.map((useCase, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-[#37322f]/70">
                              <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              {useCase}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                      className="text-[#37322f] hover:bg-[#37322f]/5 px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-1"
                    >
                      {expandedProduct === product.id ? 'Show Less' : 'Learn More'}
                      <svg 
                        className={`w-4 h-4 transition-transform ${expandedProduct === product.id ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <Link
                      href="/#contact"
                      className="bg-[#37322f] hover:bg-[#2a2520] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                    >
                      Request Demo
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1060px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#37322f] mb-4">
              Compare Our Offerings
            </h2>
            <p className="text-[#37322f]/70 max-w-2xl mx-auto">
              Choose the right combination of products for your organization
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[#37322f]/10">
                  <th className="text-left py-4 px-4 font-semibold text-[#37322f]">Feature</th>
                  <th className="text-center py-4 px-4">
                    <div className="font-semibold text-[#37322f]">Starter</div>
                    <div className="text-sm text-[#37322f]/60">Core products</div>
                  </th>
                  <th className="text-center py-4 px-4 bg-amber-50 rounded-t-xl">
                    <div className="font-semibold text-[#37322f]">Business</div>
                    <div className="text-sm text-[#37322f]/60">Core + Add-ons</div>
                  </th>
                  <th className="text-center py-4 px-4">
                    <div className="font-semibold text-[#37322f]">Enterprise</div>
                    <div className="text-sm text-[#37322f]/60">Full suite</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'E-Signatures (SES)', starter: true, business: true, enterprise: true },
                  { feature: 'Form Builder', starter: true, business: true, enterprise: true },
                  { feature: 'Workflow Engine', starter: true, business: true, enterprise: true },
                  { feature: 'Document Vault', starter: false, business: true, enterprise: true },
                  { feature: 'REST API Access', starter: false, business: true, enterprise: true },
                  { feature: 'Advanced Signatures (AES)', starter: false, business: true, enterprise: true },
                  { feature: 'Multi-Factor Authentication', starter: false, business: false, enterprise: true },
                  { feature: 'AI PII Detection', starter: false, business: false, enterprise: true },
                  { feature: 'Advanced Audit Trail', starter: false, business: false, enterprise: true },
                  { feature: 'HSM Integration', starter: false, business: false, enterprise: true },
                  { feature: 'Qualified Signatures (QES)', starter: false, business: false, enterprise: true },
                  { feature: 'Priority Support', starter: false, business: true, enterprise: true },
                  { feature: 'Dedicated Success Manager', starter: false, business: false, enterprise: true },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-[#37322f]/5">
                    <td className="py-4 px-4 text-[#37322f]">{row.feature}</td>
                    <td className="py-4 px-4 text-center">
                      {row.starter ? (
                        <svg className="w-5 h-5 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center bg-amber-50">
                      {row.business ? (
                        <svg className="w-5 h-5 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.enterprise ? (
                        <svg className="w-5 h-5 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/#pricing"
              className="inline-flex items-center gap-2 bg-[#37322f] hover:bg-[#2a2520] text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              View Pricing
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-[1060px] mx-auto px-4">
          <div className="bg-[#37322f] rounded-2xl p-8 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '32px 32px'
              }} />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
                Ready to transform your document workflows?
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                Get started with a personalized demo and see how SignPortal can streamline 
                your organization's document signing and approval processes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/#contact"
                  className="px-8 py-4 bg-white text-[#37322f] rounded-xl font-semibold hover:bg-white/90 transition-colors inline-flex items-center justify-center gap-2"
                >
                  Schedule Demo
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </Link>
                <Link
                  href="/docs/API_REFERENCE.md"
                  className="px-8 py-4 bg-transparent text-white border border-white/30 rounded-xl font-semibold hover:bg-white/10 transition-colors"
                >
                  View API Docs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  )
}
