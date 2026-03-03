'use client'

import { Header } from '@/components/header'
import FooterSection from '@/components/footer-section'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f7f5f3]">
      <Header />
      
      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-white to-[#f7f5f3]">
        <div className="max-w-[800px] mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-[#37322f] mb-4">
            Terms of Service
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
            
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using SignPortal's electronic signature platform and related services 
              (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). 
              If you do not agree to these Terms, do not use the Service.
            </p>
            <p>
              If you are using the Service on behalf of an organization, you represent that you have the 
              authority to bind that organization to these Terms, and "you" refers to both you individually 
              and the organization.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              SignPortal provides an electronic signature platform that allows users to:
            </p>
            <ul>
              <li>Upload and prepare documents for electronic signature</li>
              <li>Send documents to recipients for signature</li>
              <li>Sign documents electronically</li>
              <li>Store and manage signed documents</li>
              <li>Integrate with third-party applications via API</li>
              <li>Use templates and workflow automation features</li>
            </ul>

            <h2>3. Account Registration</h2>
            <p>
              To use certain features of the Service, you must create an account. You agree to:
            </p>
            <ul>
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of unauthorized use</li>
            </ul>
            <p>
              You must be at least 18 years old to create an account and use the Service.
            </p>

            <h2>4. Subscription and Payment</h2>
            <p>
              <strong>4.1 Subscription Plans:</strong> Access to the Service requires a paid subscription 
              unless you are using a free trial. Subscription details, including pricing and features, 
              are available on our pricing page.
            </p>
            <p>
              <strong>4.2 Billing:</strong> You authorize us to charge your payment method for the 
              subscription fees. Subscriptions automatically renew unless cancelled before the renewal date.
            </p>
            <p>
              <strong>4.3 Price Changes:</strong> We may modify subscription prices with 30 days' notice. 
              Price changes take effect at the next billing cycle.
            </p>
            <p>
              <strong>4.4 Refunds:</strong> Subscription fees are non-refundable except as required by law 
              or as specified in our refund policy. Annual plans may be eligible for pro-rated refunds 
              within the first 30 days.
            </p>

            <h2>5. Acceptable Use</h2>
            <p>You agree not to use the Service to:</p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon intellectual property rights</li>
              <li>Transmit malware, viruses, or harmful code</li>
              <li>Send unsolicited or unauthorized communications</li>
              <li>Impersonate another person or entity</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Attempt unauthorized access to our systems</li>
              <li>Collect user information without consent</li>
              <li>Use automated means to access the Service beyond API limits</li>
              <li>Engage in fraudulent or illegal document practices</li>
            </ul>

            <h2>6. Electronic Signature Legal Validity</h2>
            <p>
              <strong>6.1 Legal Framework:</strong> Electronic signatures created through SignPortal are 
              intended to comply with applicable electronic signature laws including the U.S. Electronic 
              Signatures in Global and National Commerce Act (ESIGN), Uniform Electronic Transactions Act 
              (UETA), and the European Union's eIDAS Regulation.
            </p>
            <p>
              <strong>6.2 User Responsibility:</strong> You are responsible for ensuring that electronic 
              signatures are appropriate for your specific use case and jurisdiction. Some documents may 
              require notarization or wet signatures by law.
            </p>
            <p>
              <strong>6.3 No Legal Advice:</strong> SignPortal does not provide legal advice. Consult with 
              a qualified attorney regarding legal requirements for your documents.
            </p>

            <h2>7. Content and Data</h2>
            <p>
              <strong>7.1 Your Content:</strong> You retain ownership of documents and data you upload 
              ("Your Content"). You grant us a limited license to process, store, and transmit Your Content 
              as necessary to provide the Service.
            </p>
            <p>
              <strong>7.2 Responsibility:</strong> You are solely responsible for Your Content and represent 
              that you have the right to upload and share it through the Service.
            </p>
            <p>
              <strong>7.3 Data Security:</strong> We implement reasonable security measures but cannot 
              guarantee absolute security. You acknowledge the inherent risks of transmitting data online.
            </p>

            <h2>8. Intellectual Property</h2>
            <p>
              The Service, including all software, designs, text, graphics, and other materials, is owned 
              by SignPortal and protected by intellectual property laws. You may not copy, modify, distribute, 
              or create derivative works without our written permission.
            </p>
            <p>
              You may use our logo and branding only as permitted in our Brand Guidelines or with express 
              written consent.
            </p>

            <h2>9. API Usage</h2>
            <p>
              If you access the Service through our API, you agree to:
            </p>
            <ul>
              <li>Comply with API documentation and rate limits</li>
              <li>Keep API keys confidential and secure</li>
              <li>Not reverse engineer or attempt to extract source code</li>
              <li>Not use the API to build competitive products</li>
              <li>Include proper attribution where required</li>
            </ul>

            <h2>10. Third-Party Integrations</h2>
            <p>
              The Service may integrate with third-party applications. We are not responsible for 
              third-party services, and their use is subject to their own terms and privacy policies.
            </p>

            <h2>11. Termination</h2>
            <p>
              <strong>11.1 By You:</strong> You may cancel your subscription at any time through your 
              account settings. Cancellation takes effect at the end of the current billing period.
            </p>
            <p>
              <strong>11.2 By Us:</strong> We may suspend or terminate your account if you violate these 
              Terms, fail to pay fees, or for any other reason with reasonable notice.
            </p>
            <p>
              <strong>11.3 Effect:</strong> Upon termination, your access to the Service will end. You may 
              export your data within 30 days of termination. We may delete your data after this period.
            </p>

            <h2>12. Disclaimers</h2>
            <p>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS 
              OR IMPLIED. WE DISCLAIM ALL WARRANTIES INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR 
              PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p>
              We do not warrant that the Service will be uninterrupted, error-free, or free of viruses 
              or other harmful components.
            </p>

            <h2>13. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SIGNPORTAL SHALL NOT BE LIABLE FOR ANY INDIRECT, 
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, 
              OR BUSINESS OPPORTUNITIES.
            </p>
            <p>
              OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING FROM THESE TERMS OR THE SERVICE SHALL NOT EXCEED 
              THE FEES YOU PAID TO US IN THE TWELVE MONTHS PRECEDING THE CLAIM.
            </p>

            <h2>14. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless SignPortal and its officers, directors, 
              employees, and agents from any claims, damages, losses, and expenses arising from your use 
              of the Service, violation of these Terms, or infringement of any rights of third parties.
            </p>

            <h2>15. Governing Law and Disputes</h2>
            <p>
              These Terms are governed by the laws of the State of California, without regard to conflict 
              of law principles. Any disputes shall be resolved through binding arbitration administered 
              by the American Arbitration Association in San Francisco, California.
            </p>
            <p>
              You agree to waive any right to participate in class action lawsuits or class-wide arbitration.
            </p>

            <h2>16. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. We will provide notice of material changes via email 
              or through the Service. Continued use after changes indicates acceptance of the updated Terms.
            </p>

            <h2>17. General Provisions</h2>
            <p>
              <strong>17.1 Entire Agreement:</strong> These Terms constitute the entire agreement between 
              you and SignPortal regarding the Service.
            </p>
            <p>
              <strong>17.2 Severability:</strong> If any provision is found unenforceable, the remaining 
              provisions will remain in effect.
            </p>
            <p>
              <strong>17.3 Waiver:</strong> Failure to enforce any right does not constitute a waiver of 
              that right.
            </p>
            <p>
              <strong>17.4 Assignment:</strong> You may not assign these Terms. We may assign our rights 
              and obligations without restriction.
            </p>

            <h2>18. Contact Information</h2>
            <p>For questions about these Terms, contact us:</p>
            <ul>
              <li>Email: legal@signportal.com</li>
              <li>Mail: SignPortal Inc., 100 Market Street, Suite 300, San Francisco, CA 94105</li>
            </ul>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  )
}
