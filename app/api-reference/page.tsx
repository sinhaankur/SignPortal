'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import FooterSection from '@/components/footer-section'

const apiEndpoints = [
  {
    category: 'Documents',
    endpoints: [
      { method: 'GET', path: '/documents', desc: 'List all documents' },
      { method: 'POST', path: '/documents', desc: 'Create a new document' },
      { method: 'GET', path: '/documents/{id}', desc: 'Get a specific document' },
      { method: 'PUT', path: '/documents/{id}', desc: 'Update a document' },
      { method: 'DELETE', path: '/documents/{id}', desc: 'Delete a document' },
      { method: 'POST', path: '/documents/{id}/send', desc: 'Send document for signing' },
      { method: 'GET', path: '/documents/{id}/audit', desc: 'Get audit trail' },
    ]
  },
  {
    category: 'Signatures',
    endpoints: [
      { method: 'POST', path: '/signatures', desc: 'Create a signature request' },
      { method: 'GET', path: '/signatures/{id}', desc: 'Get signature status' },
      { method: 'POST', path: '/signatures/{id}/sign', desc: 'Sign a document' },
      { method: 'POST', path: '/signatures/{id}/decline', desc: 'Decline to sign' },
      { method: 'POST', path: '/signatures/{id}/remind', desc: 'Send reminder' },
    ]
  },
  {
    category: 'Templates',
    endpoints: [
      { method: 'GET', path: '/templates', desc: 'List all templates' },
      { method: 'POST', path: '/templates', desc: 'Create a template' },
      { method: 'GET', path: '/templates/{id}', desc: 'Get a template' },
      { method: 'PUT', path: '/templates/{id}', desc: 'Update a template' },
      { method: 'DELETE', path: '/templates/{id}', desc: 'Delete a template' },
      { method: 'POST', path: '/templates/{id}/use', desc: 'Create document from template' },
    ]
  },
  {
    category: 'Users',
    endpoints: [
      { method: 'GET', path: '/users', desc: 'List users in organization' },
      { method: 'POST', path: '/users', desc: 'Invite a new user' },
      { method: 'GET', path: '/users/{id}', desc: 'Get user details' },
      { method: 'PUT', path: '/users/{id}', desc: 'Update user' },
      { method: 'DELETE', path: '/users/{id}', desc: 'Remove user' },
    ]
  },
  {
    category: 'Webhooks',
    endpoints: [
      { method: 'GET', path: '/webhooks', desc: 'List webhooks' },
      { method: 'POST', path: '/webhooks', desc: 'Create a webhook' },
      { method: 'PUT', path: '/webhooks/{id}', desc: 'Update a webhook' },
      { method: 'DELETE', path: '/webhooks/{id}', desc: 'Delete a webhook' },
      { method: 'POST', path: '/webhooks/{id}/test', desc: 'Test webhook' },
    ]
  },
]

const methodColors: Record<string, string> = {
  GET: 'bg-green-100 text-green-700',
  POST: 'bg-blue-100 text-blue-700',
  PUT: 'bg-amber-100 text-amber-700',
  DELETE: 'bg-red-100 text-red-700',
}

export default function APIReferencePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  
  const filteredEndpoints = selectedCategory 
    ? apiEndpoints.filter(cat => cat.category === selectedCategory)
    : apiEndpoints
  
  return (
    <div className="min-h-screen bg-[#f7f5f3]">
      <Header />
      
      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-white to-[#f7f5f3]">
        <div className="max-w-[1060px] mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#37322f]/10 rounded-full mb-6">
            <span className="text-sm font-medium text-[#37322f]">REST API v2.0</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#37322f] mb-6">
            API Reference
          </h1>
          <p className="text-lg text-[#37322f]/70 max-w-2xl mx-auto mb-8">
            Integrate SignPortal into your applications with our comprehensive REST API. 
            Build powerful document workflows programmatically.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/docs/quickstart" className="px-6 py-3 bg-[#37322f] text-white rounded-xl font-semibold hover:bg-[#2a2520] transition-colors">
              Get Started
            </Link>
            <a href="https://api.signportal.com/openapi.json" className="px-6 py-3 bg-white text-[#37322f] border border-[#37322f]/20 rounded-xl font-semibold hover:bg-[#37322f]/5 transition-colors">
              Download OpenAPI Spec
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#37322f]/10 p-6 sticky top-24">
              <h3 className="text-sm font-semibold text-[#37322f]/50 uppercase tracking-wider mb-4">Categories</h3>
              <nav className="space-y-1">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === null ? 'bg-[#37322f] text-white' : 'text-[#37322f] hover:bg-[#37322f]/5'
                  }`}
                >
                  All Endpoints
                </button>
                {apiEndpoints.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCategory(cat.category)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === cat.category ? 'bg-[#37322f] text-white' : 'text-[#37322f] hover:bg-[#37322f]/5'
                    }`}
                  >
                    {cat.category}
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-[#37322f]/10">
                <h3 className="text-sm font-semibold text-[#37322f]/50 uppercase tracking-wider mb-4">Base URL</h3>
                <code className="block p-3 bg-[#37322f]/5 rounded-lg text-sm text-[#37322f] break-all">
                  https://api.signportal.com/v2
                </code>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-8">
            {/* Authentication */}
            <div className="bg-white rounded-2xl border border-[#37322f]/10 overflow-hidden">
              <div className="p-6 border-b border-[#37322f]/10">
                <h2 className="text-xl font-semibold text-[#37322f]">Authentication</h2>
              </div>
              <div className="p-6">
                <p className="text-[#37322f]/70 mb-4">
                  All API requests require an API key. Include it in the Authorization header:
                </p>
                <pre className="p-4 bg-[#37322f] text-green-400 rounded-xl text-sm overflow-x-auto">
{`curl -X GET "https://api.signportal.com/v2/documents" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                </pre>
                <p className="mt-4 text-sm text-[#37322f]/60">
                  You can generate API keys in your <Link href="/dashboard/settings" className="text-[#37322f] underline">dashboard settings</Link>.
                </p>
              </div>
            </div>

            {/* Endpoints */}
            {filteredEndpoints.map((category, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-[#37322f]/10 overflow-hidden">
                <div className="p-6 border-b border-[#37322f]/10">
                  <h2 className="text-xl font-semibold text-[#37322f]">{category.category}</h2>
                </div>
                <div className="divide-y divide-[#37322f]/10">
                  {category.endpoints.map((endpoint, i) => (
                    <div key={i} className="p-4 hover:bg-[#37322f]/5 transition-colors cursor-pointer">
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-md text-xs font-bold ${methodColors[endpoint.method]}`}>
                          {endpoint.method}
                        </span>
                        <code className="text-sm font-mono text-[#37322f]">{endpoint.path}</code>
                        <span className="text-sm text-[#37322f]/60 ml-auto hidden sm:block">{endpoint.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Rate Limits */}
            <div className="bg-white rounded-2xl border border-[#37322f]/10 overflow-hidden">
              <div className="p-6 border-b border-[#37322f]/10">
                <h2 className="text-xl font-semibold text-[#37322f]">Rate Limits</h2>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-[#37322f]/5 rounded-xl">
                    <div className="text-2xl font-bold text-[#37322f] mb-1">1,000</div>
                    <div className="text-sm text-[#37322f]/60">Requests per minute (Starter)</div>
                  </div>
                  <div className="text-center p-4 bg-[#37322f]/5 rounded-xl">
                    <div className="text-2xl font-bold text-[#37322f] mb-1">10,000</div>
                    <div className="text-sm text-[#37322f]/60">Requests per minute (Business)</div>
                  </div>
                  <div className="text-center p-4 bg-[#37322f]/5 rounded-xl">
                    <div className="text-2xl font-bold text-[#37322f] mb-1">Unlimited</div>
                    <div className="text-sm text-[#37322f]/60">Enterprise plans</div>
                  </div>
                </div>
              </div>
            </div>

            {/* SDKs */}
            <div className="bg-gradient-to-br from-[#37322f] to-[#524a44] rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-semibold mb-4">Official SDKs</h2>
              <p className="text-white/70 mb-6">
                Use our official client libraries for faster integration:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Node.js', 'Python', '.NET', 'Java'].map((sdk, idx) => (
                  <Link key={idx} href={`/docs/sdk-${sdk.toLowerCase().replace('.', '')}`} className="p-4 bg-white/10 rounded-xl text-center hover:bg-white/20 transition-colors">
                    <div className="font-semibold">{sdk}</div>
                  </Link>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>

      <FooterSection />
    </div>
  )
}
