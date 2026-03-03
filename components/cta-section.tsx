"use client"

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function CTASection() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  return (
    <div id="contact" className="w-full relative overflow-hidden">
      <div className="max-w-[1060px] mx-auto px-4 py-20 md:py-28">
        <div className="bg-[#37322f] rounded-2xl p-8 md:p-16 text-center relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }} />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Ready to streamline your
              <br className="hidden md:block" />
              document workflows?
            </h2>
            <p className="text-white/70 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of businesses using SignPortal for secure, 
              efficient document signing and approval workflows.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="px-8 py-4 bg-white text-[#37322f] rounded-xl font-semibold text-base hover:bg-white/90 transition-colors inline-flex items-center gap-2"
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
                    className="px-8 py-4 bg-white text-[#37322f] rounded-xl font-semibold text-base hover:bg-white/90 transition-colors inline-flex items-center gap-2"
                  >
                    Start Free Trial
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => router.push('/login')}
                    className="px-8 py-4 bg-transparent text-white border border-white/30 rounded-xl font-semibold text-base hover:bg-white/10 transition-colors"
                  >
                    Schedule Demo
                  </button>
                </>
              )}
            </div>
            
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                14-day free trial
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
