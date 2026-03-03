"use client"

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export function HeroSection() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  return (
    <section className="relative pt-32 md:pt-40 pb-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 to-transparent pointer-events-none" />
      
      <div className="max-w-[1060px] mx-auto px-4 relative">
        <div className="flex flex-col items-center gap-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100/80 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-[#37322f]">Enterprise-grade e-signatures</span>
          </div>

          {/* Hero Content */}
          <div className="max-w-[900px] flex flex-col items-center gap-6">
            <h1 className="text-center text-[#37322f] text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight tracking-tight">
              Sign documents{' '}
              <span className="text-[#37322f]/60">faster,</span>
              <br />
              <span className="text-[#37322f]/60">smarter,</span>{' '}
              and more secure
            </h1>
            <p className="max-w-[560px] text-center text-[#37322f]/70 text-lg md:text-xl leading-relaxed">
              Streamline your document workflows with powerful e-signatures, 
              custom forms, and automated approval processes.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {isAuthenticated ? (
              <button 
                onClick={() => router.push('/dashboard')}
                className="h-12 px-8 bg-[#37322f] hover:bg-[#2a2520] text-white rounded-xl font-semibold text-base transition-colors inline-flex items-center gap-2"
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
                  className="h-12 px-8 bg-[#37322f] hover:bg-[#2a2520] text-white rounded-xl font-semibold text-base transition-colors inline-flex items-center gap-2"
                >
                  Get Started Free
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                <button 
                  onClick={() => router.push('/login')}
                  className="h-12 px-8 bg-white hover:bg-gray-50 text-[#37322f] border border-[#37322f]/20 rounded-xl font-semibold text-base transition-colors"
                >
                  Sign In
                </button>
              </>
            )}
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-8 pt-8 text-[#37322f]/50 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              SOC 2 Compliant
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              256-bit Encryption
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              Legally Binding
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
