'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'

export function Header() {
  const router = useRouter()
  const { isAuthenticated, user, logout, isLoading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Products', href: '/products' },
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Documentation', href: '/#docs' },
    { label: 'Contact', href: '/#contact' },
  ]

  return (
    <header className="w-full bg-[#f7f5f3] sticky top-0 z-50">
      <div className="max-w-[1060px] mx-auto px-4">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[#37322f] rounded-lg flex items-center justify-center group-hover:bg-[#37322f]/90 transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-[#37322f] font-semibold text-lg">SignPortal</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-[#37322f]/80 hover:text-[#37322f] hover:bg-[#37322f]/5 rounded-lg text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Auth buttons - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {isLoading ? (
              <div className="w-24 h-9 bg-[#37322f]/10 rounded-lg animate-pulse" />
            ) : isAuthenticated ? (
              <>
                <span className="text-sm text-[#37322f]/60 mr-2">
                  Welcome, {user?.name?.split(' ')[0]}
                </span>
                <button 
                  onClick={() => router.push('/dashboard')} 
                  className="px-4 py-2 bg-[#37322f] text-white hover:bg-[#37322f]/90 rounded-lg font-medium text-sm transition-colors"
                >
                  Dashboard
                </button>
                <button 
                  onClick={logout} 
                  className="px-4 py-2 text-[#37322f] hover:bg-[#37322f]/5 rounded-lg text-sm transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => router.push('/login')} 
                  className="px-4 py-2 text-[#37322f] hover:bg-[#37322f]/5 rounded-lg font-medium text-sm transition-colors"
                >
                  Log in
                </button>
                <button 
                  onClick={() => router.push('/signup')} 
                  className="px-4 py-2 bg-[#37322f] text-white hover:bg-[#37322f]/90 rounded-lg font-medium text-sm transition-colors"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#37322f] hover:bg-[#37322f]/5 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#37322f]/10">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-[#37322f] hover:bg-[#37322f]/5 rounded-lg text-sm font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="border-t border-[#37322f]/10 mt-2 pt-4">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 text-sm text-[#37322f]/60">
                      Signed in as {user?.name}
                    </div>
                    <button 
                      onClick={() => {
                        router.push('/dashboard')
                        setMobileMenuOpen(false)
                      }} 
                      className="w-full px-4 py-3 bg-[#37322f] text-white hover:bg-[#37322f]/90 rounded-lg font-medium text-sm transition-colors text-center"
                    >
                      Go to Dashboard
                    </button>
                    <button 
                      onClick={() => {
                        logout()
                        setMobileMenuOpen(false)
                      }} 
                      className="w-full mt-2 px-4 py-3 text-[#37322f] hover:bg-[#37322f]/5 rounded-lg text-sm transition-colors text-center"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => {
                        router.push('/login')
                        setMobileMenuOpen(false)
                      }} 
                      className="w-full px-4 py-3 text-[#37322f] border border-[#37322f]/20 hover:bg-[#37322f]/5 rounded-lg font-medium text-sm transition-colors text-center"
                    >
                      Log in
                    </button>
                    <button 
                      onClick={() => {
                        router.push('/signup')
                        setMobileMenuOpen(false)
                      }} 
                      className="w-full mt-2 px-4 py-3 bg-[#37322f] text-white hover:bg-[#37322f]/90 rounded-lg font-medium text-sm transition-colors text-center"
                    >
                      Get Started Free
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
