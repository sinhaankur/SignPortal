'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Building2, Check, ArrowLeft, Shield, Users, Zap, Globe } from 'lucide-react'

type SignupType = 'selection' | 'personal' | 'enterprise'

export default function SignupPage() {
  const [signupType, setSignupType] = useState<SignupType>('selection')
  const [error, setError] = useState('')
  const router = useRouter()

  // Personal signup form data
  const [personalForm, setPersonalForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // Enterprise signup form data
  const [enterpriseForm, setEnterpriseForm] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    name: '',
    jobTitle: '',
    workEmail: '',
    phone: '',
    password: '',
    confirmPassword: '',
    requirements: [] as string[]
  })

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPersonalForm(prev => ({ ...prev, [name]: value }))
  }

  const handleEnterpriseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEnterpriseForm(prev => ({ ...prev, [name]: value }))
  }

  const handleRequirementToggle = (requirement: string) => {
    setEnterpriseForm(prev => ({
      ...prev,
      requirements: prev.requirements.includes(requirement)
        ? prev.requirements.filter(r => r !== requirement)
        : [...prev.requirements, requirement]
    }))
  }

  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!personalForm.name || !personalForm.email || !personalForm.password || !personalForm.confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (!personalForm.email.includes('@')) {
      setError('Please enter a valid email')
      return
    }

    if (personalForm.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (personalForm.password !== personalForm.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('userName', personalForm.name)
    localStorage.setItem('userEmail', personalForm.email)
    localStorage.setItem('accountType', 'personal')

    router.push('/dashboard')
  }

  const handleEnterpriseSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!enterpriseForm.companyName || !enterpriseForm.name || !enterpriseForm.workEmail || !enterpriseForm.password || !enterpriseForm.confirmPassword) {
      setError('Please fill in all required fields')
      return
    }

    if (!enterpriseForm.workEmail.includes('@')) {
      setError('Please enter a valid work email')
      return
    }

    if (enterpriseForm.password.length < 8) {
      setError('Password must be at least 8 characters for enterprise accounts')
      return
    }

    if (enterpriseForm.password !== enterpriseForm.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('userName', enterpriseForm.name)
    localStorage.setItem('userEmail', enterpriseForm.workEmail)
    localStorage.setItem('companyName', enterpriseForm.companyName)
    localStorage.setItem('accountType', 'enterprise')

    router.push('/dashboard')
  }

  // Selection Screen
  if (signupType === 'selection') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FDFCFB] to-[#f7f5f3] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-2 text-[#37322f]/60 hover:text-[#37322f] mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
            <h1 className="text-4xl font-serif font-bold text-[#37322f] mb-3">Get started with SignPortal</h1>
            <p className="text-lg text-[#37322f]/60">Choose the account type that best fits your needs</p>
          </div>

          {/* Account Type Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Account */}
            <button
              onClick={() => setSignupType('personal')}
              className="group bg-white rounded-2xl border-2 border-[#37322f]/10 p-8 text-left hover:border-[#37322f]/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 bg-[#37322f]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <User className="w-7 h-7 text-[#37322f]" />
              </div>
              <h2 className="text-2xl font-semibold text-[#37322f] mb-2">Personal</h2>
              <p className="text-[#37322f]/60 mb-6">For individuals and freelancers who need a simple e-signature solution</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-[#37322f]/70">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Up to 5 documents per month</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#37322f]/70">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Basic templates</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#37322f]/70">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Email notifications</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#37322f]/70">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Mobile-friendly signing</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#37322f]/10">
                <span className="text-sm font-medium text-[#37322f]">Free to start</span>
                <span className="text-sm text-[#37322f] font-medium group-hover:translate-x-1 transition-transform">
                  Get started →
                </span>
              </div>
            </button>

            {/* Enterprise Account */}
            <button
              onClick={() => setSignupType('enterprise')}
              className="group bg-white rounded-2xl border-2 border-[#37322f]/10 p-8 text-left hover:border-[#37322f] hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 bg-[#37322f] text-white text-xs font-medium px-3 py-1 rounded-full">
                Most Popular
              </div>
              <div className="w-14 h-14 bg-[#37322f]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building2 className="w-7 h-7 text-[#37322f]" />
              </div>
              <h2 className="text-2xl font-semibold text-[#37322f] mb-2">Enterprise</h2>
              <p className="text-[#37322f]/60 mb-6">For teams and organizations requiring advanced security and compliance</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-[#37322f]/70">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Unlimited documents</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#37322f]/70">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Active Directory / LDAP integration</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#37322f]/70">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Advanced workflows & approvals</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#37322f]/70">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>On-premises deployment option</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#37322f]/70">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Dedicated support & SLA</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#37322f]/10">
                <span className="text-sm font-medium text-[#37322f]">Custom pricing</span>
                <span className="text-sm text-[#37322f] font-medium group-hover:translate-x-1 transition-transform">
                  Request demo →
                </span>
              </div>
            </button>
          </div>

          {/* Already have account */}
          <p className="text-center text-[#37322f]/60 mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-[#37322f] font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    )
  }

  // Personal Signup Form
  if (signupType === 'personal') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FDFCFB] to-[#f7f5f3] flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-[#37322f]/10">
          <button 
            onClick={() => setSignupType('selection')}
            className="flex items-center gap-2 text-[#37322f]/60 hover:text-[#37322f] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#37322f]/10 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-[#37322f]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#37322f]">Personal Account</h1>
              <p className="text-sm text-[#37322f]/60">Free for individuals</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handlePersonalSubmit} className="space-y-4">
            <div>
              <label className="block text-[#37322f] font-medium mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={personalForm.name}
                onChange={handlePersonalChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f] focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-[#37322f] font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={personalForm.email}
                onChange={handlePersonalChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f] focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-[#37322f] font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={personalForm.password}
                onChange={handlePersonalChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f] focus:border-transparent transition"
              />
              <p className="text-xs text-[#37322f]/50 mt-1">Minimum 6 characters</p>
            </div>

            <div>
              <label className="block text-[#37322f] font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={personalForm.confirmPassword}
                onChange={handlePersonalChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f] focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#37322f] text-white py-3 rounded-lg font-medium hover:bg-[#37322f]/90 transition mt-6"
            >
              Create Personal Account
            </button>
          </form>

          <p className="text-center text-[#37322f]/60 mt-6 text-sm">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="text-[#37322f] hover:underline">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-[#37322f] hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    )
  }

  // Enterprise Signup Form
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFCFB] to-[#f7f5f3] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#37322f]/10 order-2 lg:order-1">
            <button 
              onClick={() => setSignupType('selection')}
              className="flex items-center gap-2 text-[#37322f]/60 hover:text-[#37322f] mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#37322f]/10 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-[#37322f]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#37322f]">Enterprise Account</h1>
              <p className="text-sm text-[#37322f]/60">For teams and organizations</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleEnterpriseSubmit} className="space-y-6">
              {/* Company Information */}
              <div>
                <h3 className="text-lg font-semibold text-[#37322f] mb-4 pb-2 border-b border-[#37322f]/10">
                  Company Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[#37322f] font-medium mb-2">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={enterpriseForm.companyName}
                      onChange={handleEnterpriseChange}
                      placeholder="Acme Corporation"
                      className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f] focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[#37322f] font-medium mb-2">Industry</label>
                    <select
                      name="industry"
                      value={enterpriseForm.industry}
                      onChange={handleEnterpriseChange}
                      className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f] focus:border-transparent transition bg-white"
                    >
                      <option value="">Select industry</option>
                      <option value="technology">Technology</option>
                      <option value="finance">Finance & Banking</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="legal">Legal</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="retail">Retail</option>
                      <option value="government">Government</option>
                      <option value="education">Education</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#37322f] font-medium mb-2">Company Size</label>
                    <select
                      name="companySize"
                      value={enterpriseForm.companySize}
                      onChange={handleEnterpriseChange}
                      className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f] focus:border-transparent transition bg-white"
                    >
                      <option value="">Select size</option>
                      <option value="1-50">1-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-[#37322f] mb-4 pb-2 border-b border-[#37322f]/10">
                  Contact Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#37322f] font-medium mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={enterpriseForm.name}
                      onChange={handleEnterpriseChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f] focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[#37322f] font-medium mb-2">Job Title</label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={enterpriseForm.jobTitle}
                      onChange={handleEnterpriseChange}
                      placeholder="IT Director"
                      className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f] focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[#37322f] font-medium mb-2">
                      Work Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="workEmail"
                      value={enterpriseForm.workEmail}
                      onChange={handleEnterpriseChange}
                      placeholder="john@company.com"
                      className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f] focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[#37322f] font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={enterpriseForm.phone}
                      onChange={handleEnterpriseChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f] focus:border-transparent transition"
                    />
                  </div>
                </div>
              </div>

              {/* Account Security */}
              <div>
                <h3 className="text-lg font-semibold text-[#37322f] mb-4 pb-2 border-b border-[#37322f]/10">
                  Account Security
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#37322f] font-medium mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={enterpriseForm.password}
                      onChange={handleEnterpriseChange}
                      placeholder="••••••••••"
                      className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f] focus:border-transparent transition"
                    />
                    <p className="text-xs text-[#37322f]/50 mt-1">Minimum 8 characters</p>
                  </div>

                  <div>
                    <label className="block text-[#37322f] font-medium mb-2">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={enterpriseForm.confirmPassword}
                      onChange={handleEnterpriseChange}
                      placeholder="••••••••••"
                      className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f] focus:border-transparent transition"
                    />
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-lg font-semibold text-[#37322f] mb-4 pb-2 border-b border-[#37322f]/10">
                  What are you looking for? <span className="text-sm font-normal text-[#37322f]/50">(Optional)</span>
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'On-premises deployment',
                    'Active Directory integration',
                    'Custom workflows',
                    'API integration',
                    'Compliance (SOC 2, HIPAA)',
                    'Priority support'
                  ].map((req) => (
                    <label key={req} className="flex items-center gap-3 p-3 rounded-lg border border-[#37322f]/10 hover:border-[#37322f]/30 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={enterpriseForm.requirements.includes(req)}
                        onChange={() => handleRequirementToggle(req)}
                        className="w-4 h-4 rounded border-[#37322f]/20 text-[#37322f] focus:ring-[#37322f]"
                      />
                      <span className="text-sm text-[#37322f]">{req}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#37322f] text-white py-4 rounded-lg font-medium hover:bg-[#37322f]/90 transition shadow-lg"
              >
                Create Enterprise Account
              </button>
            </form>

            <p className="text-center text-[#37322f]/60 mt-6 text-sm">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="text-[#37322f] hover:underline">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-[#37322f] hover:underline">Privacy Policy</Link>
            </p>
          </div>

          {/* Benefits Sidebar */}
          <div className="space-y-6 order-1 lg:order-2">
            <div className="bg-[#37322f] rounded-2xl p-6 text-white">
              <h3 className="text-xl font-semibold mb-4">Enterprise Benefits</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Enterprise Security</h4>
                    <p className="text-sm text-white/80">SOC 2, HIPAA, and GDPR compliant with advanced encryption</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Team Management</h4>
                    <p className="text-sm text-white/80">Role-based access, AD/LDAP sync, and audit logs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Custom Workflows</h4>
                    <p className="text-sm text-white/80">Build approval chains and automate document routing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">On-Premises Option</h4>
                    <p className="text-sm text-white/80">Deploy on your own infrastructure for complete control</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#37322f]/10">
              <h3 className="font-semibold text-[#37322f] mb-4">Trusted by leading companies</h3>
              <div className="grid grid-cols-2 gap-4">
                {['Finance', 'Healthcare', 'Legal', 'Government'].map((industry) => (
                  <div key={industry} className="text-center p-3 bg-[#f7f5f3] rounded-lg">
                    <span className="text-sm text-[#37322f]/70">{industry}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <h3 className="font-semibold text-amber-800 mb-2">Need a demo?</h3>
              <p className="text-sm text-amber-700 mb-4">
                Our team can walk you through the platform and answer any questions.
              </p>
              <Link 
                href="/contact" 
                className="inline-flex items-center text-sm font-medium text-amber-800 hover:text-amber-900"
              >
                Schedule a call →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
