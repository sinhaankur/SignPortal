'use client'

import Link from 'next/link'
import { Header } from '@/components/header'
import FooterSection from '@/components/footer-section'

const certifications = [
  { name: 'SOC 2 Type II', icon: '🛡️', description: 'Annual audit of security controls, availability, and confidentiality' },
  { name: 'ISO 27001', icon: '📋', description: 'International standard for information security management' },
  { name: 'GDPR', icon: '🇪🇺', description: 'Full compliance with EU General Data Protection Regulation' },
  { name: 'HIPAA', icon: '🏥', description: 'Healthcare data protection for covered entities' },
  { name: 'eIDAS', icon: '✍️', description: 'EU regulation for electronic signatures and trust services' },
  { name: 'ESIGN Act', icon: '⚖️', description: 'US federal law recognizing electronic signatures' },
]

const securityFeatures = [
  {
    title: 'Encryption',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    items: [
      'AES-256 encryption at rest',
      'TLS 1.3 for data in transit',
      'End-to-end encryption option',
      'HSM-backed key management',
      'Encrypted backup storage',
    ]
  },
  {
    title: 'Authentication',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    items: [
      'Multi-factor authentication (MFA)',
      'LDAP/Active Directory SSO',
      'SAML 2.0 federation',
      'WebAuthn/FIDO2 biometrics',
      'Hardware security keys',
    ]
  },
  {
    title: 'Access Control',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    items: [
      'Role-based access control (RBAC)',
      'Document-level permissions',
      'IP address whitelisting',
      'Session timeout controls',
      'Audit logging for all access',
    ]
  },
  {
    title: 'Infrastructure',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
      </svg>
    ),
    items: [
      'On-premises deployment option',
      'Private cloud VPC hosting',
      'Geographic data residency',
      'Redundant infrastructure',
      'Disaster recovery planning',
    ]
  },
]

const auditFeatures = [
  { title: 'Immutable Audit Logs', description: 'Every action is logged with cryptographic verification to prevent tampering' },
  { title: 'Timestamp Authority', description: 'RFC 3161 compliant timestamps from certified TSA providers' },
  { title: 'Chain of Custody', description: 'Complete document history from creation to final signature' },
  { title: 'Compliance Reports', description: 'Generate audit reports for SOC 2, HIPAA, and GDPR compliance' },
  { title: 'SIEM Integration', description: 'Stream security events to your existing SIEM platform' },
  { title: 'Retention Policies', description: 'Configurable data retention to meet regulatory requirements' },
]

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[#f7f5f3]">
      <Header />
      
      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-white to-[#f7f5f3]">
        <div className="max-w-[1060px] mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-6">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm font-medium text-[#37322f]">Enterprise Security</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#37322f] mb-6">
            Security & Compliance
            <br />
            <span className="text-[#37322f]/50">you can trust</span>
          </h1>
          <p className="text-lg md:text-xl text-[#37322f]/70 max-w-2xl mx-auto">
            Bank-level security with comprehensive compliance certifications. 
            Your documents are protected by the highest industry standards.
          </p>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16">
        <div className="max-w-[1060px] mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#37322f] text-center mb-12">
            Compliance Certifications
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-[#37322f]/10 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">{cert.icon}</span>
                  <h3 className="text-xl font-semibold text-[#37322f]">{cert.name}</h3>
                </div>
                <p className="text-[#37322f]/60">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16 bg-white">
        <div className="max-w-[1060px] mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#37322f] text-center mb-12">
            Security Features
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {securityFeatures.map((feature, idx) => (
              <div key={idx} className="bg-[#f7f5f3] rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#37322f] rounded-xl flex items-center justify-center text-white">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-[#37322f]">{feature.title}</h3>
                </div>
                <ul className="space-y-3">
                  {feature.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[#37322f]/70">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audit Trail */}
      <section className="py-16">
        <div className="max-w-[1060px] mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#37322f] text-center mb-4">
            Complete Audit Trail
          </h2>
          <p className="text-center text-[#37322f]/60 mb-12 max-w-2xl mx-auto">
            Every document action is recorded with tamper-proof logging for complete accountability.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auditFeatures.map((feature, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-[#37322f]/10 p-6">
                <h3 className="font-semibold text-[#37322f] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#37322f]/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#37322f]">
        <div className="max-w-[1060px] mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
            Need more information?
          </h2>
          <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto">
            Download our security whitepaper or schedule a call with our security team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="px-8 py-4 bg-white text-[#37322f] rounded-xl font-semibold hover:bg-white/90 transition-colors">
              Contact Security Team
            </Link>
            <Link href="/docs/security-architecture" className="px-8 py-4 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors">
              View Documentation
            </Link>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  )
}
