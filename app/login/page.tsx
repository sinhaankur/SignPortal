'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth, PublicOnlyRoute } from '@/lib/auth-context'

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const success = await login(formData.email, formData.password)
      if (!success) {
        setError('Invalid email or password')
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PublicOnlyRoute>
      <div className="min-h-screen bg-[#f7f5f3] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Back to home */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-[#37322f]/60 hover:text-[#37322f] mb-8 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>

          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-[#37322f] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">SP</span>
              </div>
              <span className="text-[#37322f] font-semibold text-xl">SignPortal</span>
            </div>

            <h1 className="text-2xl font-bold text-[#37322f] mb-2">Welcome back</h1>
            <p className="text-[#37322f]/60 mb-6">Sign in to access your dashboard</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[#37322f] font-medium mb-2 text-sm">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20 focus:border-[#37322f] transition-all"
                  disabled={isLoading}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[#37322f] font-medium text-sm">Password</label>
                  <Link href="/forgot-password" className="text-sm text-[#37322f]/60 hover:text-[#37322f]">
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20 focus:border-[#37322f] transition-all"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#37322f] text-white py-3 rounded-lg font-medium hover:bg-[#37322f]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-[#37322f]/10">
              <p className="text-center text-[#37322f]/60 text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-[#37322f] font-medium hover:underline">
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicOnlyRoute>
  )
}
