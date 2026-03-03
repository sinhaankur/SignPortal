'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  icon: string
  category: string
}

interface TemplateSelectorProps {
  onSelect: (template: Template) => void
  onCreateCustom: () => void
  onCreateForm?: () => void
}

export function TemplateSelector({ onSelect, onCreateCustom, onCreateForm }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const templates: Template[] = [
    {
      id: 'nda',
      name: 'Non-Disclosure Agreement',
      description: 'Protect confidential information with a standard NDA',
      icon: '🔒',
      category: 'Legal'
    },
    {
      id: 'employment',
      name: 'Employment Agreement',
      description: 'Employment contract with standard terms and conditions',
      icon: '📋',
      category: 'HR'
    },
    {
      id: 'invoice',
      name: 'Invoice Document',
      description: 'Create and send invoices for payment approval',
      icon: '💰',
      category: 'Finance'
    },
    {
      id: 'consent',
      name: 'Consent Form',
      description: 'Gather consent and signature for various purposes',
      icon: '✍️',
      category: 'Healthcare'
    },
    {
      id: 'purchase',
      name: 'Purchase Agreement',
      description: 'Standard terms for buying or selling goods/services',
      icon: '🛒',
      category: 'Commerce'
    },
    {
      id: 'service',
      name: 'Service Agreement',
      description: 'Define service terms, scope, and pricing',
      icon: '🔧',
      category: 'Business'
    }
  ]

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template.id)
    onSelect(template)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[#37322f] mb-2">Choose How to Get Started</h2>
        <p className="text-[#37322f]/60">Select from pre-made templates or create your own document from scratch</p>
      </div>

      {/* Templates Grid */}
      <div className="space-y-8">
        {/* Template Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleSelectTemplate(template)}
              className={`p-6 rounded-lg border-2 transition-all text-left ${
                selectedTemplate === template.id
                  ? 'border-[#37322f] bg-[#37322f]/5'
                  : 'border-[#37322f]/20 hover:border-[#37322f]/40 bg-white'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-4xl">{template.icon}</div>
                {selectedTemplate === template.id && (
                  <div className="w-6 h-6 rounded-full bg-[#37322f] text-white flex items-center justify-center">
                    <Check size={16} />
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-[#37322f] text-lg mb-1">{template.name}</h3>
              <p className="text-[#37322f]/60 text-sm mb-3">{template.description}</p>
              <span className="inline-block px-3 py-1 bg-[#37322f]/10 text-[#37322f] text-xs font-semibold rounded">
                {template.category}
              </span>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-12">
          <div className="flex-1 h-px bg-[#37322f]/20"></div>
          <span className="text-[#37322f]/60 text-sm font-semibold">OR START FROM SCRATCH</span>
          <div className="flex-1 h-px bg-[#37322f]/20"></div>
        </div>

        {/* Custom Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Custom Document Option */}
          <button
            onClick={onCreateCustom}
            className="p-8 rounded-lg border-2 border-dashed border-[#37322f]/40 hover:border-[#37322f] hover:bg-[#37322f]/5 transition text-center"
          >
            <div className="text-5xl mb-3">📄</div>
            <h3 className="font-semibold text-[#37322f] text-lg mb-1">Upload Document</h3>
            <p className="text-[#37322f]/60 text-sm">Upload a PDF or document for e-signature</p>
          </button>

          {/* Create Form Option */}
          {onCreateForm && (
            <button
              onClick={onCreateForm}
              className="p-8 rounded-lg border-2 border-dashed border-[#37322f]/40 hover:border-[#37322f] hover:bg-[#37322f]/5 transition text-center group"
            >
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">📝</div>
              <h3 className="font-semibold text-[#37322f] text-lg mb-1">Build a Form</h3>
              <p className="text-[#37322f]/60 text-sm">Create custom forms for approval & signatures</p>
              <span className="inline-block mt-3 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                NEW
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
