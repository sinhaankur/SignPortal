'use client'

import Link from 'next/link'
import { Header } from '@/components/header'
import FooterSection from '@/components/footer-section'

const apiEndpoints = [
  { method: 'POST', endpoint: '/api/v1/documents', description: 'Create a new document' },
  { method: 'GET', endpoint: '/api/v1/documents/{id}', description: 'Retrieve document details' },
  { method: 'POST', endpoint: '/api/v1/documents/{id}/send', description: 'Send document for signing' },
  { method: 'GET', endpoint: '/api/v1/documents/{id}/status', description: 'Check signing status' },
  { method: 'POST', endpoint: '/api/v1/signatures', description: 'Apply signature to document' },
  { method: 'GET', endpoint: '/api/v1/audit/{document_id}', description: 'Get audit trail' },
]

const sdks = [
  { name: 'Node.js', icon: '🟢', install: 'npm install @signportal/sdk' },
  { name: 'Python', icon: '🐍', install: 'pip install signportal' },
  { name: '.NET', icon: '🔷', install: 'dotnet add package SignPortal.SDK' },
  { name: 'Java', icon: '☕', install: 'Maven: com.signportal:sdk:2.0.0' },
]

const webhookEvents = [
  { event: 'document.created', description: 'Fired when a new document is created' },
  { event: 'document.sent', description: 'Fired when a document is sent for signing' },
  { event: 'signature.requested', description: 'Fired when a signature is requested' },
  { event: 'signature.completed', description: 'Fired when a signature is completed' },
  { event: 'document.completed', description: 'Fired when all signatures are collected' },
  { event: 'document.expired', description: 'Fired when a document signing deadline expires' },
]

export default function ApiIntegrationPage() {
  return (
    <div className="min-h-screen bg-[#f7f5f3]">
      <Header />
      
      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-white to-[#f7f5f3]">
        <div className="max-w-[1060px] mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 rounded-full mb-6">
            <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span className="text-sm font-medium text-[#37322f]">Developer Platform</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#37322f] mb-6">
            API Integration
          </h1>
          <p className="text-lg md:text-xl text-[#37322f]/70 max-w-2xl mx-auto mb-8">
            Embed e-signature capabilities directly into your applications with our comprehensive REST API and SDKs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/api-reference" className="px-8 py-4 bg-[#37322f] text-white rounded-xl font-semibold hover:bg-[#2a2520] transition-colors">
              View API Reference
            </Link>
            <Link href="/signup" className="px-8 py-4 border border-[#37322f]/20 text-[#37322f] rounded-xl font-semibold hover:bg-[#37322f]/5 transition-colors">
              Get API Keys
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-16">
        <div className="max-w-[1060px] mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#37322f] text-center mb-12">
            Quick Start
          </h2>
          
          <div className="bg-[#37322f] rounded-2xl p-6 md:p-8 overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-4 text-white/60 text-sm">Example: Create and send a document</span>
            </div>
            <pre className="text-sm md:text-base text-green-400 overflow-x-auto">
              <code>{`// Initialize the SignPortal SDK
const SignPortal = require('@signportal/sdk');
const client = new SignPortal({ apiKey: 'your-api-key' });

// Create a document from a PDF
const document = await client.documents.create({
  name: 'Service Agreement',
  file: fs.readFileSync('contract.pdf'),
  signers: [
    { email: 'john@example.com', name: 'John Doe', order: 1 },
    { email: 'jane@example.com', name: 'Jane Smith', order: 2 }
  ]
});

// Send for signing
await client.documents.send(document.id, {
  subject: 'Please sign the Service Agreement',
  message: 'Your signature is required on this document.'
});

console.log('Document sent:', document.id);`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* SDKs */}
      <section className="py-16 bg-white">
        <div className="max-w-[1060px] mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#37322f] text-center mb-12">
            Official SDKs
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sdks.map((sdk, idx) => (
              <div key={idx} className="bg-[#f7f5f3] rounded-xl p-6 text-center">
                <span className="text-4xl mb-4 block">{sdk.icon}</span>
                <h3 className="font-semibold text-[#37322f] mb-2">{sdk.name}</h3>
                <code className="text-xs bg-[#37322f]/10 px-3 py-1.5 rounded-lg text-[#37322f]/70 block">
                  {sdk.install}
                </code>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section className="py-16">
        <div className="max-w-[1060px] mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#37322f] text-center mb-12">
            Popular Endpoints
          </h2>
          <div className="bg-white rounded-2xl border border-[#37322f]/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#37322f]/10 bg-[#37322f]/5">
                    <th className="text-left py-4 px-6 font-semibold text-[#37322f]">Method</th>
                    <th className="text-left py-4 px-6 font-semibold text-[#37322f]">Endpoint</th>
                    <th className="text-left py-4 px-6 font-semibold text-[#37322f]">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {apiEndpoints.map((endpoint, idx) => (
                    <tr key={idx} className="border-b border-[#37322f]/5 last:border-0">
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded text-xs font-mono font-semibold ${
                          endpoint.method === 'GET' ? 'bg-green-100 text-green-700' :
                          endpoint.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {endpoint.method}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-sm text-[#37322f]">{endpoint.endpoint}</td>
                      <td className="py-4 px-6 text-[#37322f]/60">{endpoint.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Webhooks */}
      <section className="py-16 bg-white">
        <div className="max-w-[1060px] mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#37322f] text-center mb-4">
            Webhook Events
          </h2>
          <p className="text-center text-[#37322f]/60 mb-12 max-w-2xl mx-auto">
            Receive real-time notifications when events occur in your SignPortal account.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {webhookEvents.map((webhook, idx) => (
              <div key={idx} className="bg-[#f7f5f3] rounded-xl p-5">
                <code className="text-sm font-mono text-purple-600 mb-2 block">{webhook.event}</code>
                <p className="text-sm text-[#37322f]/60">{webhook.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-[1060px] mx-auto px-4">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Ready to integrate?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
              Create a free account to get your API keys and start building.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="px-8 py-4 bg-white text-cyan-600 rounded-xl font-semibold hover:bg-white/90 transition-colors">
                Get API Keys
              </Link>
              <Link href="/api-reference" className="px-8 py-4 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors">
                Read the Docs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  )
}
