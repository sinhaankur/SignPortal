"use client"

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Header } from "@/components/header"
import PricingSection from "@/components/pricing-section"
import FAQSection from "@/components/faq-section"
import CTASection from "@/components/cta-section"
import FooterSection from "@/components/footer-section"

export default function LandingPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  return (
    <div className="w-full min-h-screen bg-[#F7F5F3]">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/30 via-transparent to-transparent pointer-events-none" />
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2337322f' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        <div className="max-w-[1060px] mx-auto px-4 relative">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#37322f]/10 shadow-sm mb-8">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-[#37322f]">Trusted by 10,000+ businesses</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#37322f] leading-[1.1] tracking-tight mb-6">
              Sign documents
              <br />
              <span className="text-[#37322f]/50">in minutes,</span> not days
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-[#37322f]/70 max-w-[600px] leading-relaxed mb-10 font-sans">
              Enterprise-grade electronic signatures with powerful workflows, 
              custom forms, and bank-level security. Get documents signed faster.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              {isAuthenticated ? (
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="h-14 px-8 bg-[#37322f] hover:bg-[#2a2520] text-white rounded-xl font-semibold text-base transition-all shadow-lg shadow-[#37322f]/20 inline-flex items-center justify-center gap-2"
                >
                  Go to Dashboard
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => router.push('/signup')}
                    className="h-14 px-8 bg-[#37322f] hover:bg-[#2a2520] text-white rounded-xl font-semibold text-base transition-all shadow-lg shadow-[#37322f]/20 inline-flex items-center justify-center gap-2"
                  >
                    Start Free Trial
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => router.push('/login')}
                    className="h-14 px-8 bg-white hover:bg-gray-50 text-[#37322f] border border-[#37322f]/20 rounded-xl font-semibold text-base transition-all inline-flex items-center justify-center gap-2"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-[#37322f]/60 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>SOC 2 Type II</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>256-bit Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                <span>Legally Binding</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <span>eIDAS Compliant</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[#F7F5F3] via-transparent to-transparent z-10 pointer-events-none h-32 bottom-0 top-auto" />
            <div className="bg-white rounded-2xl shadow-2xl shadow-[#37322f]/10 border border-[#37322f]/10 overflow-hidden">
              <div className="bg-[#37322f]/5 px-4 py-3 border-b border-[#37322f]/10 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 bg-white/60 rounded-md text-xs text-[#37322f]/60">signportal.app/dashboard</div>
                </div>
              </div>
              <div className="p-6 md:p-8 bg-gradient-to-br from-white to-[#f7f5f3]/50">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Document Card */}
                  <div className="bg-white rounded-xl border border-[#37322f]/10 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">Pending</span>
                    </div>
                    <h3 className="font-semibold text-[#37322f] mb-1">Service Agreement</h3>
                    <p className="text-sm text-[#37322f]/60 mb-3">2 of 3 signatures</p>
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-purple-200 border-2 border-white flex items-center justify-center text-xs font-medium text-purple-700">JD</div>
                      <div className="w-8 h-8 rounded-full bg-green-200 border-2 border-white flex items-center justify-center text-xs font-medium text-green-700">✓</div>
                      <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-500">SK</div>
                    </div>
                  </div>
                  
                  {/* Stats Card */}
                  <div className="bg-white rounded-xl border border-[#37322f]/10 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <span className="text-xs text-green-600 font-medium">↑ 12%</span>
                    </div>
                    <h3 className="font-semibold text-[#37322f] mb-1">Documents Signed</h3>
                    <p className="text-3xl font-bold text-[#37322f]">1,234</p>
                    <p className="text-sm text-[#37322f]/60">This month</p>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="bg-white rounded-xl border border-[#37322f]/10 p-5 shadow-sm">
                    <h3 className="font-semibold text-[#37322f] mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                      <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#37322f]/5 transition-colors text-left">
                        <div className="w-8 h-8 bg-[#37322f]/10 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-[#37322f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-[#37322f]">New Document</span>
                      </button>
                      <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#37322f]/5 transition-colors text-left">
                        <div className="w-8 h-8 bg-[#37322f]/10 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-[#37322f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-[#37322f]">Upload PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-[1060px] mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[#37322f]/10 mb-6">
              <span className="text-sm font-medium text-[#37322f]">Powerful Features</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-[#37322f] mb-4">
              Everything you need to
              <br />
              <span className="text-[#37322f]/50">get documents signed</span>
            </h2>
            <p className="text-lg text-[#37322f]/70 max-w-[600px] mx-auto">
              From simple signatures to complex approval workflows, SignPortal has you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group bg-white rounded-2xl border border-[#37322f]/10 p-8 hover:shadow-xl hover:shadow-[#37322f]/5 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#37322f] mb-3">E-Signatures</h3>
              <p className="text-[#37322f]/70 leading-relaxed">
                Draw, type, or upload your signature. Support for Simple (SES), Advanced (AES), and Qualified (QES) electronic signatures.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white rounded-2xl border border-[#37322f]/10 p-8 hover:shadow-xl hover:shadow-[#37322f]/5 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#37322f] mb-3">Form Builder</h3>
              <p className="text-[#37322f]/70 leading-relaxed">
                Create dynamic forms with 17+ field types, conditional logic, calculations, and seamless signature integration.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white rounded-2xl border border-[#37322f]/10 p-8 hover:shadow-xl hover:shadow-[#37322f]/5 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#37322f] mb-3">Workflow Automation</h3>
              <p className="text-[#37322f]/70 leading-relaxed">
                Design approval workflows with sequential, parallel, and conditional routing. Set deadlines and automatic reminders.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-white rounded-2xl border border-[#37322f]/10 p-8 hover:shadow-xl hover:shadow-[#37322f]/5 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#37322f] mb-3">Secure Vault</h3>
              <p className="text-[#37322f]/70 leading-relaxed">
                Store signed documents with AES-256 encryption. Version control, retention policies, and full-text search.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-white rounded-2xl border border-[#37322f]/10 p-8 hover:shadow-xl hover:shadow-[#37322f]/5 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#37322f] mb-3">Multi-Factor Auth</h3>
              <p className="text-[#37322f]/70 leading-relaxed">
                Enterprise security with LDAP/AD integration, SMS OTP, biometrics (TouchID/FaceID), and hardware keys.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-white rounded-2xl border border-[#37322f]/10 p-8 hover:shadow-xl hover:shadow-[#37322f]/5 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#37322f] mb-3">REST API</h3>
              <p className="text-[#37322f]/70 leading-relaxed">
                Comprehensive APIs with SDKs for Node.js, Python, .NET, and Java. Webhooks for real-time event notifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-[1060px] mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#37322f]/5 rounded-full mb-6">
              <span className="text-sm font-medium text-[#37322f]">Simple Process</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-[#37322f] mb-4">
              How SignPortal works
            </h2>
            <p className="text-lg text-[#37322f]/70 max-w-[600px] mx-auto">
              Get documents signed in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="relative">
              <div className="hidden md:block absolute top-12 left-full w-full h-[2px] bg-gradient-to-r from-[#37322f]/20 to-transparent -translate-x-1/2" />
              <div className="text-center">
                <div className="w-24 h-24 mx-auto bg-[#37322f] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#37322f]/20">
                  <span className="text-3xl font-serif text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold text-[#37322f] mb-3">Upload Document</h3>
                <p className="text-[#37322f]/70">
                  Upload your PDF or create a new document using our form builder with drag-and-drop fields.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="hidden md:block absolute top-12 left-full w-full h-[2px] bg-gradient-to-r from-[#37322f]/20 to-transparent -translate-x-1/2" />
              <div className="text-center">
                <div className="w-24 h-24 mx-auto bg-[#37322f] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#37322f]/20">
                  <span className="text-3xl font-serif text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold text-[#37322f] mb-3">Add Signers</h3>
                <p className="text-[#37322f]/70">
                  Invite recipients, place signature fields, set signing order, and configure authentication requirements.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-24 h-24 mx-auto bg-[#37322f] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#37322f]/20">
                <span className="text-3xl font-serif text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-[#37322f] mb-3">Get Signed</h3>
              <p className="text-[#37322f]/70">
                Recipients sign from any device. Track progress in real-time and receive the completed document instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 md:py-28">
        <div className="max-w-[1060px] mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[#37322f]/10 mb-6">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm font-medium text-[#37322f]">Enterprise Security</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-serif text-[#37322f] mb-6">
                Bank-level security
                <br />
                <span className="text-[#37322f]/50">you can trust</span>
              </h2>
              <p className="text-lg text-[#37322f]/70 mb-8 leading-relaxed">
                SignPortal is built with security at its core. Deploy on-premises or in your private cloud 
                for complete control over your sensitive documents.
              </p>
              
              <div className="space-y-4">
                {[
                  { title: 'SOC 2 Type II Certified', desc: 'Audited security controls and processes' },
                  { title: 'AES-256 Encryption', desc: 'Data encrypted at rest and in transit' },
                  { title: 'HSM Key Protection', desc: 'Hardware security modules for certificate keys' },
                  { title: 'Complete Audit Trail', desc: 'Tamper-proof logging with blockchain verification' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#37322f]">{item.title}</h4>
                      <p className="text-[#37322f]/60 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl border border-[#37322f]/10 p-8 shadow-xl shadow-[#37322f]/5">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: '🔐', label: 'GDPR' },
                    { icon: '🏥', label: 'HIPAA' },
                    { icon: '📋', label: 'eIDAS' },
                    { icon: '⚖️', label: 'ESIGN Act' },
                    { icon: '🛡️', label: 'ISO 27001' },
                    { icon: '✅', label: 'SOC 2' },
                  ].map((cert, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-[#37322f]/5 rounded-xl">
                      <span className="text-2xl">{cert.icon}</span>
                      <span className="font-semibold text-[#37322f]">{cert.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-100 rounded-2xl -z-10" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-green-100 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-28 bg-[#37322f]">
        <div className="max-w-[1060px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Private E-Signature Application
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Online and Offline Signing • Secured • On-Premises Deployment
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10K+', label: 'Active Users' },
              { value: '5M+', label: 'Documents Signed' },
              { value: '99.9%', label: 'Uptime SLA' },
              { value: '<2s', label: 'Avg. Sign Time' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-serif text-white mb-2">{stat.value}</div>
                <div className="text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section id="docs" className="py-20 md:py-28">
        <div className="max-w-[1060px] mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[#37322f]/10 mb-6">
              <span className="text-sm font-medium text-[#37322f]">Documentation</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-[#37322f] mb-4">
              Resources to get started
            </h2>
            <p className="text-lg text-[#37322f]/70 max-w-[600px] mx-auto">
              Everything you need to integrate SignPortal into your workflow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <a href="/docs/architecture" className="group bg-white rounded-2xl border border-[#37322f]/10 p-6 hover:shadow-lg transition-all cursor-pointer">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#37322f] mb-2">Architecture Guide</h3>
              <p className="text-sm text-[#37322f]/60">Understand the system architecture and deployment options</p>
            </a>

            <a href="/docs/api-reference" className="group bg-white rounded-2xl border border-[#37322f]/10 p-6 hover:shadow-lg transition-all cursor-pointer">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#37322f] mb-2">API Reference</h3>
              <p className="text-sm text-[#37322f]/60">Complete REST API documentation with code examples</p>
            </a>

            <a href="/docs/deployment" className="group bg-white rounded-2xl border border-[#37322f]/10 p-6 hover:shadow-lg transition-all cursor-pointer">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#37322f] mb-2">Deployment Guide</h3>
              <p className="text-sm text-[#37322f]/60">Docker, Kubernetes, and on-premises installation</p>
            </a>
          </div>
        </div>
      </section>

      {/* Enterprise-Grade Security Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-[1060px] mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200 mb-6">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm font-medium text-green-700">Security</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-[#37322f] mb-4">
              Enterprise-Grade Security
            </h2>
            <p className="text-lg text-[#37322f]/70 max-w-[600px] mx-auto">
              Built from the ground up with security as the foundation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Authentication */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-[#37322f]">Authentication</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[#37322f]">LDAP/Active Directory Integration</p>
                    <p className="text-sm text-[#37322f]/60">Seamless enterprise identity management</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[#37322f]">SAML 2.0 Single Sign-On</p>
                    <p className="text-sm text-[#37322f]/60">One-click access with existing credentials</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[#37322f]">Multi-Factor Authentication</p>
                    <p className="text-sm text-[#37322f]/60">TOTP, SMS, Email, and hardware keys</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[#37322f]">JWT Token-based Sessions</p>
                    <p className="text-sm text-[#37322f]/60">Secure, stateless authentication</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Data Protection */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-[#37322f]">Data Protection</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[#37322f]">AES-256 Encryption at Rest</p>
                    <p className="text-sm text-[#37322f]/60">Military-grade data protection</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[#37322f]">TLS 1.3 Encryption in Transit</p>
                    <p className="text-sm text-[#37322f]/60">Latest protocol for secure communication</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[#37322f]">HSM Key Management</p>
                    <p className="text-sm text-[#37322f]/60">Hardware security module support</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[#37322f]">Cryptographic Signature Sealing</p>
                    <p className="text-sm text-[#37322f]/60">Tamper-evident document integrity</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Security Assurance */}
          <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-[#37322f] mb-1">Your Data Stays Within Your Infrastructure</h4>
                <p className="text-[#37322f]/70">
                  With on-premises deployment, all documents and signatures remain secured within your own ecosystem. 
                  No external data transfer, no third-party access — complete control over your sensitive information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <div id="pricing">
        <PricingSection />
      </div>

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <FooterSection />
    </div>
  )
}
