'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('userName', formData.name)
    localStorage.setItem('userEmail', formData.email)

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#f7f5f3] flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-[#37322f] mb-2">Create account</h1>
        <p className="text-[#37322f]/60 mb-6">Get started with SignPortal today</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#37322f] font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-2 border border-[#37322f]/20 rounded-lg focus:outline-none focus:border-[#37322f]"
            />
          </div>

          <div>
            <label className="block text-[#37322f] font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-[#37322f]/20 rounded-lg focus:outline-none focus:border-[#37322f]"
            />
          </div>

          <div>
            <label className="block text-[#37322f] font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-[#37322f]/20 rounded-lg focus:outline-none focus:border-[#37322f]"
            />
          </div>

          <div>
            <label className="block text-[#37322f] font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-[#37322f]/20 rounded-lg focus:outline-none focus:border-[#37322f]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#37322f] text-white py-2 rounded-lg font-medium hover:bg-[#37322f]/90 transition"
          >
            Create account
          </button>
        </form>

        <p className="text-center text-[#37322f]/60 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#37322f] font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
