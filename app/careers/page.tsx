'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import FooterSection from '@/components/footer-section'

const departments = ['All', 'Engineering', 'Product', 'Sales', 'Marketing', 'Operations']

const jobs = [
  {
    id: 1,
    title: 'Senior Backend Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'Build and scale our core e-signature infrastructure using .NET and cloud technologies.',
  },
  {
    id: 2,
    title: 'Frontend Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'Create beautiful, intuitive interfaces using React and TypeScript.',
  },
  {
    id: 3,
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'Manage our Kubernetes infrastructure and CI/CD pipelines.',
  },
  {
    id: 4,
    title: 'Product Manager',
    department: 'Product',
    location: 'Hybrid',
    type: 'Full-time',
    description: 'Drive product strategy and roadmap for our enterprise solutions.',
  },
  {
    id: 5,
    title: 'UX Designer',
    department: 'Product',
    location: 'Remote',
    type: 'Full-time',
    description: 'Design intuitive experiences for document signing workflows.',
  },
  {
    id: 6,
    title: 'Enterprise Account Executive',
    department: 'Sales',
    location: 'New York',
    type: 'Full-time',
    description: 'Close enterprise deals and build relationships with Fortune 500 companies.',
  },
  {
    id: 7,
    title: 'Customer Success Manager',
    department: 'Sales',
    location: 'Remote',
    type: 'Full-time',
    description: 'Ensure customer satisfaction and drive adoption of our platform.',
  },
  {
    id: 8,
    title: 'Content Marketing Manager',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
    description: 'Create compelling content that drives awareness and leads.',
  },
]

const benefits = [
  { icon: '🏠', title: 'Remote First', desc: 'Work from anywhere in the world' },
  { icon: '🏥', title: 'Health Coverage', desc: '100% premium coverage for you and family' },
  { icon: '📚', title: 'Learning Budget', desc: '$2,000 annual learning stipend' },
  { icon: '🌴', title: 'Unlimited PTO', desc: 'Take time off when you need it' },
  { icon: '💻', title: 'Equipment', desc: 'Top-of-the-line laptop and peripherals' },
  { icon: '📈', title: 'Equity', desc: 'Stock options for all employees' },
]

export default function CareersPage() {
  const [selectedDept, setSelectedDept] = useState('All')
  
  const filteredJobs = selectedDept === 'All' 
    ? jobs 
    : jobs.filter(job => job.department === selectedDept)

  return (
    <div className="min-h-screen bg-[#f7f5f3]">
      <Header />
      
      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-white to-[#f7f5f3]">
        <div className="max-w-[1060px] mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-serif text-[#37322f] mb-6">
            Join our team
          </h1>
          <p className="text-lg text-[#37322f]/70 max-w-2xl mx-auto mb-8">
            Help us build the future of document signing. We're looking for passionate 
            people who want to make an impact.
          </p>
          <a href="#openings" className="inline-flex items-center gap-2 px-8 py-4 bg-[#37322f] text-white rounded-xl font-semibold hover:bg-[#2a2520] transition-colors">
            View Open Positions
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="max-w-[1060px] mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif text-[#37322f] mb-12 text-center">Why work with us?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <div key={i} className="bg-white rounded-xl border border-[#37322f]/10 p-6">
                <span className="text-3xl mb-4 block">{benefit.icon}</span>
                <h3 className="font-semibold text-[#37322f] mb-1">{benefit.title}</h3>
                <p className="text-sm text-[#37322f]/60">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture */}
      <section className="py-16 bg-white">
        <div className="max-w-[1060px] mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-[#37322f] mb-6">Our Culture</h2>
              <div className="space-y-4">
                <p className="text-[#37322f]/70 leading-relaxed">
                  At SignPortal, we believe great products come from happy, empowered teams. 
                  We foster an environment of trust, transparency, and continuous learning.
                </p>
                <p className="text-[#37322f]/70 leading-relaxed">
                  We're remote-first but stay connected through regular video calls, virtual 
                  coffee chats, and annual team retreats. Everyone's voice matters, regardless 
                  of role or tenure.
                </p>
                <p className="text-[#37322f]/70 leading-relaxed">
                  We ship fast, celebrate wins, and learn from failures. If you're excited 
                  about building products that millions of people use, you'll fit right in.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-amber-100 rounded-2xl p-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-serif text-[#37322f]">50+</div>
                  <div className="text-sm text-[#37322f]/70">Team members</div>
                </div>
              </div>
              <div className="bg-green-100 rounded-2xl p-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-serif text-[#37322f]">15</div>
                  <div className="text-sm text-[#37322f]/70">Countries</div>
                </div>
              </div>
              <div className="bg-blue-100 rounded-2xl p-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-serif text-[#37322f]">4.8</div>
                  <div className="text-sm text-[#37322f]/70">Glassdoor rating</div>
                </div>
              </div>
              <div className="bg-purple-100 rounded-2xl p-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-serif text-[#37322f]">92%</div>
                  <div className="text-sm text-[#37322f]/70">Recommend to friend</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="openings" className="py-16">
        <div className="max-w-[1060px] mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif text-[#37322f] mb-8 text-center">Open Positions</h2>
          
          {/* Department Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {departments.map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  selectedDept === dept
                    ? 'bg-[#37322f] text-white'
                    : 'bg-white text-[#37322f] border border-[#37322f]/10 hover:bg-[#37322f]/5'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Job Listings */}
          <div className="space-y-4">
            {filteredJobs.map(job => (
              <div key={job.id} className="bg-white rounded-xl border border-[#37322f]/10 p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#37322f] mb-1">{job.title}</h3>
                    <p className="text-sm text-[#37322f]/60 mb-2">{job.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-[#37322f]/5 text-[#37322f] text-xs font-medium rounded">
                        {job.department}
                      </span>
                      <span className="px-2 py-1 bg-[#37322f]/5 text-[#37322f] text-xs font-medium rounded">
                        {job.location}
                      </span>
                      <span className="px-2 py-1 bg-[#37322f]/5 text-[#37322f] text-xs font-medium rounded">
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <Link 
                    href={`/careers/${job.id}`}
                    className="px-6 py-2 bg-[#37322f] text-white rounded-lg font-medium text-sm hover:bg-[#2a2520] transition-colors whitespace-nowrap"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12 text-[#37322f]/60">
              No open positions in this department. Check back soon!
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-[1060px] mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#37322f] mb-4">
            Don't see the right role?
          </h2>
          <p className="text-[#37322f]/70 mb-8 max-w-xl mx-auto">
            We're always looking for talented people. Send us your resume and we'll keep you in mind for future openings.
          </p>
          <Link href="/contact" className="px-8 py-4 bg-[#37322f] text-white rounded-xl font-semibold hover:bg-[#2a2520] transition-colors inline-block">
            Get in Touch
          </Link>
        </div>
      </section>

      <FooterSection />
    </div>
  )
}
