'use client'

import { Header } from '@/components/header'
import FooterSection from '@/components/footer-section'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f7f5f3]">
      <Header />
      
      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-white to-[#f7f5f3]">
        <div className="max-w-[800px] mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-[#37322f] mb-4">
            Privacy Policy
          </h1>
          <p className="text-[#37322f]/70">
            Last updated: January 15, 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-[800px] mx-auto px-4">
          <div className="bg-white rounded-2xl border border-[#37322f]/10 p-8 md:p-12 prose prose-stone max-w-none">
            
            <h2>Introduction</h2>
            <p>
              SignPortal Inc. ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you use our electronic 
              signature platform and related services (collectively, the "Service").
            </p>
            <p>
              Please read this Privacy Policy carefully. By accessing or using our Service, you acknowledge that 
              you have read, understood, and agree to be bound by this Privacy Policy.
            </p>

            <h2>Information We Collect</h2>
            
            <h3>Information You Provide Directly</h3>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, phone number, company name, job title, and password when you create an account.</li>
              <li><strong>Payment Information:</strong> Credit card details, billing address, and other payment information processed through our secure payment processor.</li>
              <li><strong>Documents:</strong> Files you upload for electronic signature, including any personal information contained within those documents.</li>
              <li><strong>Communications:</strong> Information you provide when contacting our support team or participating in surveys.</li>
            </ul>

            <h3>Information Collected Automatically</h3>
            <ul>
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent on the Service, and interaction patterns.</li>
              <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers, and screen resolution.</li>
              <li><strong>Log Data:</strong> Server logs including access times, error logs, and referring URLs.</li>
              <li><strong>Cookies:</strong> Information collected through cookies and similar tracking technologies (see our Cookie Policy).</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our Service</li>
              <li>Process transactions and send related notifications</li>
              <li>Create and manage your account</li>
              <li>Verify identity for signing documents</li>
              <li>Send administrative messages, updates, and security alerts</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Detect, prevent, and address technical issues and fraud</li>
              <li>Comply with legal obligations</li>
              <li>Send marketing communications (with your consent)</li>
            </ul>

            <h2>Legal Basis for Processing (GDPR)</h2>
            <p>For users in the European Economic Area (EEA), we process personal data under the following legal bases:</p>
            <ul>
              <li><strong>Contract Performance:</strong> Processing necessary to provide our Service to you</li>
              <li><strong>Legitimate Interests:</strong> For fraud prevention, security, and service improvement</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
              <li><strong>Consent:</strong> For marketing communications and optional features</li>
            </ul>

            <h2>Information Sharing and Disclosure</h2>
            <p>We may share your information with:</p>
            <ul>
              <li><strong>Service Providers:</strong> Third parties that assist in providing our Service (hosting, payment processing, analytics)</li>
              <li><strong>Document Recipients:</strong> When you send documents for signature, recipients will see your name and email</li>
              <li><strong>Business Partners:</strong> Integration partners when you connect third-party services</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or governmental authority</li>
              <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or sale of assets</li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>

            <h2>Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your information, including:
            </p>
            <ul>
              <li>256-bit AES encryption for data at rest</li>
              <li>TLS 1.3 encryption for data in transit</li>
              <li>SOC 2 Type II certified infrastructure</li>
              <li>Regular security audits and penetration testing</li>
              <li>Multi-factor authentication options</li>
              <li>Access controls and employee training</li>
            </ul>

            <h2>Data Retention</h2>
            <p>
              We retain your personal information for as long as your account is active or as needed to provide 
              services. We retain documents per your account settings (default: 7 years for compliance purposes). 
              You can request deletion of your data at any time, subject to legal retention requirements.
            </p>

            <h2>Your Rights</h2>
            <p>Depending on your location, you may have the following rights:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data</li>
              <li><strong>Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Objection:</strong> Object to certain processing activities</li>
              <li><strong>Restriction:</strong> Request limited processing of your data</li>
              <li><strong>Withdraw Consent:</strong> Withdraw previously given consent</li>
            </ul>
            <p>
              To exercise these rights, contact us at privacy@signportal.com or through your account settings.
            </p>

            <h2>International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own. We use 
              Standard Contractual Clauses and other appropriate safeguards to ensure adequate protection 
              of your data during international transfers.
            </p>

            <h2>Children's Privacy</h2>
            <p>
              Our Service is not intended for individuals under 18 years of age. We do not knowingly collect 
              personal information from children. If we become aware that we have collected personal data 
              from a child, we will take steps to delete it promptly.
            </p>

            <h2>California Privacy Rights (CCPA)</h2>
            <p>California residents have additional rights including:</p>
            <ul>
              <li>Right to know what personal information is collected and how it's used</li>
              <li>Right to delete personal information</li>
              <li>Right to opt-out of the sale of personal information (we don't sell your data)</li>
              <li>Right to non-discrimination for exercising privacy rights</li>
            </ul>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. We will notify you of material changes by 
              posting the updated policy on our website and updating the "Last updated" date. Your continued 
              use of the Service after changes indicates your acceptance of the updated policy.
            </p>

            <h2>Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us:</p>
            <ul>
              <li>Email: privacy@signportal.com</li>
              <li>Mail: SignPortal Inc., 100 Market Street, Suite 300, San Francisco, CA 94105</li>
              <li>Data Protection Officer: dpo@signportal.com</li>
            </ul>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  )
}
