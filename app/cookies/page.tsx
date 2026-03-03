'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import FooterSection from '@/components/footer-section'

const cookieTypes = [
  {
    name: 'Essential Cookies',
    description: 'Required for the website to function properly. Cannot be disabled.',
    required: true,
    examples: ['Session management', 'Security tokens', 'Load balancing'],
  },
  {
    name: 'Functional Cookies',
    description: 'Enable enhanced functionality and personalization.',
    required: false,
    examples: ['Language preferences', 'Theme settings', 'Saved form data'],
  },
  {
    name: 'Analytics Cookies',
    description: 'Help us understand how visitors interact with our website.',
    required: false,
    examples: ['Page views', 'Traffic sources', 'User journeys'],
  },
  {
    name: 'Marketing Cookies',
    description: 'Used to deliver relevant advertisements and track campaign effectiveness.',
    required: false,
    examples: ['Ad targeting', 'Conversion tracking', 'Retargeting'],
  },
]

export default function CookiesPage() {
  const [preferences, setPreferences] = useState({
    functional: true,
    analytics: true,
    marketing: false,
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-[#f7f5f3]">
      <Header />
      
      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-white to-[#f7f5f3]">
        <div className="max-w-[800px] mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-[#37322f] mb-4">
            Cookie Policy
          </h1>
          <p className="text-[#37322f]/70">
            Last updated: January 15, 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-[800px] mx-auto px-4">
          <div className="bg-white rounded-2xl border border-[#37322f]/10 p-8 md:p-12">
            
            <div className="prose prose-stone max-w-none">
              <h2>What Are Cookies?</h2>
              <p>
                Cookies are small text files that are placed on your device when you visit a website. 
                They are widely used to make websites work more efficiently, provide information to 
                website owners, and enable certain features.
              </p>
              <p>
                SignPortal uses cookies and similar tracking technologies (like web beacons and pixels) 
                to provide, improve, and protect our Service.
              </p>

              <h2>How We Use Cookies</h2>
              <p>We use cookies for the following purposes:</p>
              <ul>
                <li><strong>Authentication:</strong> To keep you logged in and secure your session</li>
                <li><strong>Preferences:</strong> To remember your settings and preferences</li>
                <li><strong>Security:</strong> To detect and prevent security threats</li>
                <li><strong>Analytics:</strong> To understand how our Service is used</li>
                <li><strong>Performance:</strong> To optimize and improve our Service</li>
                <li><strong>Advertising:</strong> To deliver relevant marketing content</li>
              </ul>
            </div>

            {/* Cookie Types */}
            <div className="mt-12">
              <h2 className="text-xl font-semibold text-[#37322f] mb-6">Types of Cookies We Use</h2>
              <div className="space-y-4">
                {cookieTypes.map((type, idx) => (
                  <div key={idx} className="border border-[#37322f]/10 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-[#37322f]">{type.name}</h3>
                        <p className="text-sm text-[#37322f]/60 mt-1">{type.description}</p>
                      </div>
                      {type.required ? (
                        <span className="px-3 py-1 bg-[#37322f]/10 text-[#37322f] text-xs font-medium rounded-full">
                          Always Active
                        </span>
                      ) : (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences[type.name.toLowerCase().split(' ')[0] as keyof typeof preferences] ?? true}
                            onChange={(e) => setPreferences({
                              ...preferences,
                              [type.name.toLowerCase().split(' ')[0]]: e.target.checked
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-[#37322f]/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#37322f]/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#37322f]"></div>
                        </label>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {type.examples.map((example, i) => (
                        <span key={i} className="px-2 py-1 bg-[#f7f5f3] text-[#37322f]/70 text-xs rounded">
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={handleSave}
                className="mt-6 w-full py-3 bg-[#37322f] text-white rounded-xl font-semibold hover:bg-[#2a2520] transition-colors"
              >
                {saved ? '✓ Preferences Saved' : 'Save Preferences'}
              </button>
            </div>

            <div className="prose prose-stone max-w-none mt-12">
              <h2>Third-Party Cookies</h2>
              <p>
                We work with third-party service providers who may set cookies on our website. 
                These include:
              </p>
              <table>
                <thead>
                  <tr>
                    <th>Provider</th>
                    <th>Purpose</th>
                    <th>Privacy Policy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Google Analytics</td>
                    <td>Website analytics</td>
                    <td><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Link</a></td>
                  </tr>
                  <tr>
                    <td>Stripe</td>
                    <td>Payment processing</td>
                    <td><a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Link</a></td>
                  </tr>
                  <tr>
                    <td>Intercom</td>
                    <td>Customer support</td>
                    <td><a href="https://www.intercom.com/legal/privacy" target="_blank" rel="noopener noreferrer">Link</a></td>
                  </tr>
                  <tr>
                    <td>HubSpot</td>
                    <td>Marketing automation</td>
                    <td><a href="https://www.hubspot.com/privacy-policy" target="_blank" rel="noopener noreferrer">Link</a></td>
                  </tr>
                </tbody>
              </table>

              <h2>Managing Cookies</h2>
              <p>
                You can control and manage cookies in several ways:
              </p>
              <ul>
                <li><strong>Cookie Preferences:</strong> Use the toggles above to manage your preferences on our site</li>
                <li><strong>Browser Settings:</strong> Most browsers allow you to refuse or delete cookies through settings</li>
                <li><strong>Opt-Out Tools:</strong> Use tools like the Network Advertising Initiative's opt-out page</li>
              </ul>
              <p>
                Note that disabling certain cookies may affect the functionality of our Service.
              </p>

              <h3>Browser-Specific Instructions</h3>
              <ul>
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
              </ul>

              <h2>Cookie Retention</h2>
              <p>
                Cookies have different retention periods depending on their purpose:
              </p>
              <ul>
                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain for a specified period (typically 1-12 months)</li>
                <li><strong>Authentication Cookies:</strong> 30 days (or until logout)</li>
                <li><strong>Analytics Cookies:</strong> Up to 26 months</li>
              </ul>

              <h2>Do Not Track</h2>
              <p>
                Some browsers have a "Do Not Track" feature that signals to websites that you prefer 
                not to be tracked. We currently respond to Do Not Track signals by disabling analytics 
                and marketing cookies when detected.
              </p>

              <h2>Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time. We will notify you of changes by 
                posting the updated policy and changing the "Last updated" date. We encourage you to 
                review this page periodically.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have questions about our use of cookies, please contact us:
              </p>
              <ul>
                <li>Email: privacy@signportal.com</li>
                <li>Mail: SignPortal Inc., 100 Market Street, Suite 300, San Francisco, CA 94105</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  )
}
