'use client'

import Link from 'next/link'
import { Header } from '@/components/header'
import FooterSection from '@/components/footer-section'

const leadership = [
  {
    name: 'Michael Chen',
    role: 'Chief Executive Officer',
    bio: 'Former VP of Engineering at DocuSign. 15+ years building enterprise software.',
    image: null,
  },
  {
    name: 'Sarah Williams',
    role: 'Chief Technology Officer',
    bio: 'Previously led cloud infrastructure at Adobe. Expert in distributed systems.',
    image: null,
  },
  {
    name: 'David Rodriguez',
    role: 'Chief Product Officer',
    bio: 'Product leader with experience at Dropbox and Box. Passionate about UX.',
    image: null,
  },
  {
    name: 'Emily Johnson',
    role: 'Chief Revenue Officer',
    bio: 'Scaled sales teams at multiple SaaS startups from $0 to $100M ARR.',
    image: null,
  },
]

const team = [
  {
    name: 'Alex Turner',
    role: 'VP of Engineering',
    department: 'Engineering',
  },
  {
    name: 'Lisa Park',
    role: 'VP of Marketing',
    department: 'Marketing',
  },
  {
    name: 'James Wilson',
    role: 'VP of Customer Success',
    department: 'Customer Success',
  },
  {
    name: 'Maria Garcia',
    role: 'Head of Security',
    department: 'Security',
  },
  {
    name: 'Robert Kim',
    role: 'Head of Legal',
    department: 'Legal',
  },
  {
    name: 'Amanda Foster',
    role: 'Head of HR',
    department: 'People',
  },
]

const values = [
  {
    icon: '🎯',
    title: 'Customer First',
    description: 'Every decision starts with how it impacts our customers.',
  },
  {
    icon: '🚀',
    title: 'Move Fast',
    description: 'We ship quickly, learn from feedback, and iterate constantly.',
  },
  {
    icon: '🤝',
    title: 'Collaborate',
    description: 'The best ideas come from diverse perspectives working together.',
  },
  {
    icon: '💡',
    title: 'Innovate',
    description: 'We challenge the status quo to find better solutions.',
  },
]

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-[#f7f5f3]">
      <Header />
      
      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-white to-[#f7f5f3]">
        <div className="max-w-[1060px] mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-serif text-[#37322f] mb-6">
            Meet our team
          </h1>
          <p className="text-lg md:text-xl text-[#37322f]/70 max-w-[600px] mx-auto">
            We&apos;re a passionate group of people building the future of digital signatures
            and document workflows.
          </p>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-16">
        <div className="max-w-[1060px] mx-auto px-4">
          <h2 className="text-3xl font-serif text-[#37322f] text-center mb-12">Leadership</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {leadership.map((person, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border border-[#37322f]/10">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 bg-[#37322f]/10 rounded-2xl flex items-center justify-center text-3xl font-serif text-[#37322f]">
                    {person.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#37322f] mb-1">{person.name}</h3>
                    <p className="text-[#37322f]/60 text-sm mb-3">{person.role}</p>
                    <p className="text-[#37322f]/70">{person.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extended Team */}
      <section className="py-16 bg-white">
        <div className="max-w-[1060px] mx-auto px-4">
          <h2 className="text-3xl font-serif text-[#37322f] text-center mb-4">Our Team</h2>
          <p className="text-center text-[#37322f]/60 mb-12 max-w-[500px] mx-auto">
            Our talented team spans engineering, design, marketing, sales, and customer success.
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((person, index) => (
              <div key={index} className="bg-[#f7f5f3] rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-[#37322f]/10 rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-serif text-[#37322f]">
                  {person.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="font-semibold text-[#37322f] mb-1">{person.name}</h3>
                <p className="text-sm text-[#37322f]/60 mb-1">{person.role}</p>
                <span className="inline-block px-3 py-1 bg-[#37322f]/5 rounded-full text-xs text-[#37322f]/60">
                  {person.department}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-[1060px] mx-auto px-4">
          <h2 className="text-3xl font-serif text-[#37322f] text-center mb-4">Our Values</h2>
          <p className="text-center text-[#37322f]/60 mb-12 max-w-[500px] mx-auto">
            These principles guide everything we do at SignPortal.
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-[#37322f]/10 text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="font-semibold text-[#37322f] mb-2">{value.title}</h3>
                <p className="text-sm text-[#37322f]/60">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-16 bg-[#37322f]">
        <div className="max-w-[800px] mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
            Join our team
          </h2>
          <p className="text-white/70 mb-8 max-w-[500px] mx-auto">
            We&apos;re always looking for talented individuals who are passionate about building 
            great products. Check out our open positions.
          </p>
          <Link
            href="/careers"
            className="inline-block px-8 py-4 bg-white text-[#37322f] rounded-xl font-semibold hover:bg-white/90 transition-colors"
          >
            View Open Positions
          </Link>
        </div>
      </section>

      <FooterSection />
    </div>
  )
}
