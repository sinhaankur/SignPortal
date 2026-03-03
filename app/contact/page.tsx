'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import FooterSection from '@/components/footer-section'

const contactReasons = [
  'Sales Inquiry',
  'Technical Support',
  'Partnership',
  'Press/Media',
  'General Question',
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    reason: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send to an API
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[#f7f5f3]">
      <Header />
      
      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-white to-[#f7f5f3]">
        <div className="max-w-[1060px] mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-serif text-[#37322f] mb-6">
            Get in touch
          </h1>
          <p className="text-lg text-[#37322f]/70 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll 
            respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16">
        <div className="max-w-[1060px] mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="font-semibold text-[#37322f] mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#37322f]/60 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm text-[#37322f]/60">Email</p>
                      <p className="text-[#37322f]">hello@signportal.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#37322f]/60 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="text-sm text-[#37322f]/60">Phone</p>
                      <p className="text-[#37322f]">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#37322f]/60 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-[#37322f]/60">Address</p>
                      <p className="text-[#37322f]">123 Business Ave, Suite 100<br />San Francisco, CA 94107</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#37322f] mb-4">Office Hours</h3>
                <p className="text-[#37322f]/70">Monday - Friday: 9am - 6pm PST</p>
                <p className="text-[#37322f]/70">Saturday - Sunday: Closed</p>
              </div>

              <div>
                <h3 className="font-semibold text-[#37322f] mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  <a href="#" className="w-10 h-10 bg-[#37322f]/5 hover:bg-[#37322f]/10 rounded-lg flex items-center justify-center transition-colors">
                    <svg className="w-5 h-5 text-[#37322f]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-[#37322f]/5 hover:bg-[#37322f]/10 rounded-lg flex items-center justify-center transition-colors">
                    <svg className="w-5 h-5 text-[#37322f]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-[#37322f] mb-2">Message Sent!</h3>
                  <p className="text-[#37322f]/70">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#37322f]/10 p-8">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-[#37322f] mb-2">Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-[#37322f]/20 focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#37322f] mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-[#37322f]/20 focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                        placeholder="you@company.com"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-[#37322f] mb-2">Company</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-[#37322f]/20 focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                        placeholder="Your company"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#37322f] mb-2">Reason for Contact *</label>
                      <select
                        required
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-[#37322f]/20 focus:outline-none focus:ring-2 focus:ring-[#37322f]/20 bg-white"
                      >
                        <option value="">Select a reason</option>
                        {contactReasons.map(reason => (
                          <option key={reason} value={reason}>{reason}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-[#37322f] mb-2">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-[#37322f]/20 focus:outline-none focus:ring-2 focus:ring-[#37322f]/20 resize-none"
                      placeholder="How can we help?"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-[#37322f] text-white rounded-xl font-semibold hover:bg-[#2a2520] transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-[1060px] mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#37322f] mb-4">Looking for quick answers?</h2>
          <p className="text-[#37322f]/70 mb-8">
            Check our FAQ or documentation for immediate help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/#faq" className="px-6 py-3 bg-[#37322f]/5 text-[#37322f] rounded-lg font-medium hover:bg-[#37322f]/10 transition-colors">
              View FAQ
            </a>
            <a href="/docs" className="px-6 py-3 bg-[#37322f]/5 text-[#37322f] rounded-lg font-medium hover:bg-[#37322f]/10 transition-colors">
              Documentation
            </a>
            <a href="/support" className="px-6 py-3 bg-[#37322f]/5 text-[#37322f] rounded-lg font-medium hover:bg-[#37322f]/10 transition-colors">
              Support Center
            </a>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  )
}
