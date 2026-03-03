"use client"

import { useState } from "react"

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "What is SignPortal App and who is it for?",
    answer:
      "SignPortal App is an enterprise-grade e-signature platform designed for organizations that require maximum security and control over their document signing processes. It's ideal for government, healthcare, financial services, and enterprises needing on-premises deployment.",
  },
  {
    question: "Is this solution legally binding?",
    answer:
      "Yes, signatures collected through SignPortal comply with major e-signature laws including the ESIGN Act, UETA, and eIDAS. We produce a comprehensive, tamper-evident audit trail for every transaction.",
  },
  {
    question: "Can we host SignPortal on our own servers?",
    answer:
      "Unlike cloud-only solutions, SignPortal is built specifically for on-premises deployment. You can host it entirely on your own infrastructure, within your private cloud, or in secure, air-gapped environments.",
  },
  {
    question: "Does it integrate with our existing Identity Provider (IdP)?",
    answer:
      "Yes, we support deep integration with Active Directory, LDAP, SAML 2.0, and OAuth, allowing you to use your existing user authentication and management systems.",
  },
  {
    question: "Are audit trails customizable?",
    answer:
      "Our system captures deep telemetry data (IP, device info, timestamps, biometric signature speed). You can customize what information is visible in the final PDF audit trail to meet your specific compliance requirements.",
  },
  {
    question: "How do we get started?",
    answer:
      "Contact our technical sales team to request an evaluation image. We provide Docker containers, Kubernetes helm charts, or traditional VM images tailored to your infrastructure requirements.",
  },
]

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <div className="w-full flex justify-center items-start">
      <div className="flex-1 px-4 md:px-12 py-16 md:py-20 flex flex-col lg:flex-row justify-start items-start gap-6 lg:gap-12">
        {/* Left Column - Header */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-start gap-4 lg:py-5">
          <div className="w-full flex flex-col justify-center text-[#49423D] font-semibold leading-tight md:leading-[44px] font-sans text-4xl tracking-tight">
            Frequently Asked Questions
          </div>
          <div className="w-full text-[#605A57] text-base font-normal leading-7 font-sans">
            Get answers about deployment, compliance,
            <br className="hidden md:block" />
            and enterprise security.
          </div>
        </div>

        {/* Right Column - FAQ Items */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-center">
          <div className="w-full flex flex-col">
            {faqData.map((item, index) => {
              const isOpen = openItems.includes(index)

              return (
                <div key={index} className="w-full border-b border-[rgba(73,66,61,0.16)] overflow-hidden">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-5 py-[18px] flex justify-between items-center gap-5 text-left hover:bg-[rgba(73,66,61,0.02)] transition-colors duration-200"
                    aria-expanded={isOpen}
                  >
                    <div className="flex-1 text-[#49423D] text-base font-medium leading-6 font-sans">
                      {item.question}
                    </div>
                    <div className="flex justify-center items-center">
                      <ChevronDownIcon
                        className={`w-6 h-6 text-[rgba(73,66,61,0.60)] transition-transform duration-300 ease-in-out ${isOpen ? "rotate-180" : "rotate-0"
                          }`}
                      />
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                  >
                    <div className="px-5 pb-[18px] text-[#605A57] text-sm font-normal leading-6 font-sans">
                      {item.answer}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
