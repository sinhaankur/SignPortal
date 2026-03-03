'use client'

import Link from 'next/link'
import { Header } from '@/components/header'
import FooterSection from '@/components/footer-section'

const values = [
  {
    title: 'Security First',
    description: 'We believe trust is earned through unwavering commitment to protecting our customers\' data.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Customer Obsessed',
    description: 'Every decision we make starts with understanding how it impacts our customers.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    title: 'Innovation Driven',
    description: 'We continuously push boundaries to deliver cutting-edge solutions for document workflows.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: 'Integrity Always',
    description: 'We do what\'s right, even when no one is watching. Transparency guides everything we do.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
  },
]

const milestones = [
  { year: '2020', title: 'Founded', desc: 'SignPortal launched with a vision to transform document signing' },
  { year: '2021', title: 'SOC 2 Certified', desc: 'Achieved SOC 2 Type II certification for enterprise security' },
  { year: '2022', title: '1M Documents', desc: 'Milestone of 1 million documents signed on the platform' },
  { year: '2023', title: 'eIDAS Compliant', desc: 'Achieved EU eIDAS compliance for qualified signatures' },
  { year: '2024', title: '10K Customers', desc: 'Reached 10,000 business customers worldwide' },
  { year: '2025', title: 'AI Integration', desc: 'Launched AI-powered PII detection and compliance tools' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f7f5f3]">
      <Header />
      
      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-white to-[#f7f5f3]">
        <div className="max-w-[1060px] mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-serif text-[#37322f] mb-6">
              We're building the future of
              <span className="text-[#37322f]/50"> document signing</span>
            </h1>
            <p className="text-lg text-[#37322f]/70 leading-relaxed">
              SignPortal was founded with a simple mission: make document signing secure, 
              simple, and accessible for businesses of all sizes. Today, we serve thousands 
              of organizations worldwide, helping them streamline their document workflows.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="max-w-[1060px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10K+', label: 'Customers' },
              { value: '5M+', label: 'Documents Signed' },
              { value: '50+', label: 'Countries' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-serif text-[#37322f] mb-2">{stat.value}</div>
                <div className="text-[#37322f]/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-[1060px] mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-[#37322f] mb-6">Our Mission</h2>
              <p className="text-lg text-[#37322f]/70 leading-relaxed mb-6">
                To empower businesses with secure, efficient, and legally compliant document 
                signing solutions that save time, reduce costs, and eliminate paper waste.
              </p>
              <p className="text-lg text-[#37322f]/70 leading-relaxed">
                We believe that signing documents shouldn't be a bottleneck. Whether you're 
                closing a deal, onboarding an employee, or getting approval for a project, 
                SignPortal makes it fast and secure.
              </p>
            </div>
            <div className="bg-[#37322f] rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
              <p className="text-white/80 leading-relaxed">
                A world where every document is signed digitally, securely, and sustainably. 
                We're committed to eliminating paper-based processes and creating a more 
                efficient global business ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-[1060px] mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif text-[#37322f] mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#37322f]/10 p-8">
                <div className="w-14 h-14 bg-[#37322f]/5 rounded-xl flex items-center justify-center text-[#37322f] mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#37322f] mb-2">{value.title}</h3>
                <p className="text-[#37322f]/70">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-[1060px] mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif text-[#37322f] mb-12 text-center">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#37322f]/10 hidden md:block" />
            <div className="space-y-8">
              {milestones.map((milestone, i) => (
                <div key={i} className={`flex flex-col md:flex-row gap-4 md:gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-[#f7f5f3] rounded-xl p-6 inline-block">
                      <div className="text-2xl font-serif text-[#37322f] mb-1">{milestone.year}</div>
                      <h3 className="font-semibold text-[#37322f] mb-1">{milestone.title}</h3>
                      <p className="text-sm text-[#37322f]/60">{milestone.desc}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center justify-center">
                    <div className="w-4 h-4 bg-[#37322f] rounded-full" />
                  </div>
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-[1060px] mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-[#37322f] mb-4">Join our journey</h2>
          <p className="text-lg text-[#37322f]/70 mb-8 max-w-xl mx-auto">
            We're always looking for talented people to join our team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/careers" className="px-8 py-4 bg-[#37322f] text-white rounded-xl font-semibold hover:bg-[#2a2520] transition-colors">
              View Open Positions
            </Link>
            <Link href="/team" className="px-8 py-4 bg-white text-[#37322f] border border-[#37322f]/20 rounded-xl font-semibold hover:bg-[#37322f]/5 transition-colors">
              Meet the Team
            </Link>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  )
}
