'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FormBuilderCanvas } from '@/components/form-builder'
import { FormDocument, createFormDocument } from '@/lib/form-builder-types'
import { ProtectedRoute } from '@/lib/auth-context'

// ============================================================================
// Form Builder Page
// ============================================================================

export default function FormBuilderPage() {
  return (
    <ProtectedRoute>
      <FormBuilderContent />
    </ProtectedRoute>
  )
}

function FormBuilderContent() {
  const router = useRouter()
  const [form, setForm] = useState<FormDocument | null>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)

  // Initialize or load form
  useEffect(() => {
    const savedForm = localStorage.getItem('current-form-builder')
    if (savedForm) {
      try {
        setForm(JSON.parse(savedForm))
      } catch {
        setForm(createFormDocument('New Form', 'current-user'))
      }
    } else {
      setForm(createFormDocument('New Form', 'current-user'))
    }
  }, [])

  // Save form to localStorage
  const handleSave = (updatedForm: FormDocument) => {
    setForm(updatedForm)
    localStorage.setItem('current-form-builder', JSON.stringify(updatedForm))
    
    // Also save to forms list
    const formsListRaw = localStorage.getItem('signportal-forms')
    const formsList: FormDocument[] = formsListRaw ? JSON.parse(formsListRaw) : []
    const existingIndex = formsList.findIndex(f => f.id === updatedForm.id)
    if (existingIndex >= 0) {
      formsList[existingIndex] = updatedForm
    } else {
      formsList.push(updatedForm)
    }
    localStorage.setItem('signportal-forms', JSON.stringify(formsList))
  }

  // Toggle preview mode
  const handlePreview = () => {
    setIsPreviewMode(!isPreviewMode)
  }

  // Publish form
  const handlePublish = () => {
    setShowPublishModal(true)
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#37322f] border-t-transparent"></div>
      </div>
    )
  }

  if (isPreviewMode) {
    return (
      <FormPreview 
        form={form} 
        onExitPreview={() => setIsPreviewMode(false)} 
      />
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-[#37322f]/10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link
              href="/documents"
              className="p-2 hover:bg-[#37322f]/5 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-[#37322f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="font-semibold text-[#37322f]">Form Builder</h1>
              <p className="text-xs text-[#37322f]/60">Create custom forms for approval & e-signature</p>
            </div>
          </div>
        </div>
      </header>

      {/* Form Builder Canvas */}
      <div className="flex-1">
        <FormBuilderCanvas
          initialForm={form}
          onSave={handleSave}
          onPreview={handlePreview}
          onPublish={handlePublish}
        />
      </div>

      {/* Publish Modal */}
      {showPublishModal && (
        <PublishModal
          form={form}
          onClose={() => setShowPublishModal(false)}
          onPublish={(publishedForm) => {
            handleSave(publishedForm)
            setShowPublishModal(false)
          }}
        />
      )}
    </div>
  )
}

// ============================================================================
// Form Preview Component
// ============================================================================

interface FormPreviewProps {
  form: FormDocument
  onExitPreview: () => void
}

function FormPreview({ form, onExitPreview }: FormPreviewProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [currentPage, setCurrentPage] = useState(0)

  // Split form into pages based on page_break fields
  const pages = form.sections.reduce<FormDocument['sections'][]>((acc, section) => {
    if (acc.length === 0) {
      acc.push([])
    }
    
    const currentPageSections = acc[acc.length - 1]
    const fieldsBeforeBreak: typeof section.fields = []
    let hasPageBreak = false
    
    section.fields.forEach(field => {
      if (field.type === 'page_break') {
        hasPageBreak = true
        acc.push([])
      } else if (!hasPageBreak) {
        fieldsBeforeBreak.push(field)
      } else {
        acc[acc.length - 1].push({
          ...section,
          fields: [field]
        })
      }
    })
    
    if (fieldsBeforeBreak.length > 0) {
      currentPageSections.push({
        ...section,
        fields: fieldsBeforeBreak
      })
    }
    
    return acc
  }, [[]])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Preview Header */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-amber-800 font-medium">Preview Mode</span>
          </div>
          <button
            onClick={onExitPreview}
            className="px-4 py-1.5 text-sm bg-white border border-amber-300 rounded-lg text-amber-800 hover:bg-amber-50 transition-colors"
          >
            Exit Preview
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="py-8">
        <div className="max-w-2xl mx-auto px-4">
          {/* Form Header */}
          <div 
            className="mb-6 p-6 bg-white rounded-xl border-2 border-gray-200"
            style={{ borderTopColor: form.theme.primaryColor, borderTopWidth: 4 }}
          >
            <h1 className="text-2xl font-bold text-[#37322f]">{form.title}</h1>
            {form.settings.description && (
              <p className="mt-2 text-[#37322f]/70">{form.settings.description}</p>
            )}
            {form.settings.requireSignIn && (
              <p className="mt-3 text-sm text-amber-600 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Sign-in required to submit
              </p>
            )}
          </div>

          {/* Form Fields */}
          {form.sections.map((section, sectionIndex) => (
            <div key={section.id} className="mb-6 p-6 bg-white rounded-xl border border-gray-200">
              {section.title && sectionIndex > 0 && (
                <h2 className="text-lg font-semibold text-[#37322f] mb-4">{section.title}</h2>
              )}
              {section.description && (
                <p className="text-[#37322f]/70 mb-4">{section.description}</p>
              )}
              
              {section.fields.map(field => {
                // Skip page breaks in preview for now
                if (field.type === 'page_break') return null
                
                return (
                  <div key={field.id} className="mb-4">
                    <PreviewField 
                      field={field}
                      value={formData[field.id]}
                      onChange={(value) => setFormData({
                        ...formData,
                        [field.id]: value
                      })}
                    />
                  </div>
                )
              })}
            </div>
          ))}

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-6 py-3 text-[#37322f] border border-[#37322f]/20 rounded-lg hover:bg-[#37322f]/5 transition-colors"
            >
              Clear Form
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#37322f] text-white rounded-lg hover:bg-[#37322f]/90 transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Preview Field (simplified field renderer)
// ============================================================================

import { FormField } from '@/lib/form-builder-types'
import { FormFieldRenderer } from '@/components/form-builder'

interface PreviewFieldProps {
  field: FormField
  value: any
  onChange: (value: any) => void
}

function PreviewField({ field, value, onChange }: PreviewFieldProps) {
  return (
    <FormFieldRenderer
      field={field}
      value={value}
      onChange={onChange}
    />
  )
}

// ============================================================================
// Publish Modal
// ============================================================================

interface PublishModalProps {
  form: FormDocument
  onClose: () => void
  onPublish: (form: FormDocument) => void
}

function PublishModal({ form, onClose, onPublish }: PublishModalProps) {
  const [settings, setSettings] = useState({
    requireSignIn: form.settings.requireSignIn,
    collectEmails: form.settings.collectEmails,
    confirmationMessage: form.settings.confirmationMessage,
    notifyOnSubmit: form.settings.notifyOnSubmit,
  })

  const handlePublish = () => {
    const publishedForm: FormDocument = {
      ...form,
      status: 'published',
      settings: { ...form.settings, ...settings },
      publishedUrl: `/forms/${form.id}/respond`
    }
    onPublish(publishedForm)
  }

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/forms/${form.id}/respond`
    : ''

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#37322f]/10">
          <h2 className="text-lg font-semibold text-[#37322f]">Publish Form</h2>
          <p className="text-sm text-[#37322f]/60">Share your form with others</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Share URL */}
          <div>
            <label className="block text-sm font-medium text-[#37322f] mb-2">
              Share Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-[#37322f]/20 rounded-lg"
              />
              <button
                onClick={() => navigator.clipboard.writeText(shareUrl)}
                className="px-3 py-2 text-sm border border-[#37322f]/20 rounded-lg hover:bg-[#37322f]/5 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireSignIn}
                onChange={(e) => setSettings({ ...settings, requireSignIn: e.target.checked })}
                className="w-4 h-4 rounded border-[#37322f]/30 text-[#37322f] focus:ring-[#37322f]"
              />
              <span className="text-sm text-[#37322f]">Require sign-in to submit</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.collectEmails}
                onChange={(e) => setSettings({ ...settings, collectEmails: e.target.checked })}
                className="w-4 h-4 rounded border-[#37322f]/30 text-[#37322f] focus:ring-[#37322f]"
              />
              <span className="text-sm text-[#37322f]">Collect respondent email addresses</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifyOnSubmit}
                onChange={(e) => setSettings({ ...settings, notifyOnSubmit: e.target.checked })}
                className="w-4 h-4 rounded border-[#37322f]/30 text-[#37322f] focus:ring-[#37322f]"
              />
              <span className="text-sm text-[#37322f]">Email me on new submissions</span>
            </label>
          </div>

          {/* Confirmation Message */}
          <div>
            <label className="block text-sm font-medium text-[#37322f] mb-2">
              Confirmation Message
            </label>
            <textarea
              value={settings.confirmationMessage}
              onChange={(e) => setSettings({ ...settings, confirmationMessage: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#37322f]/20 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
              rows={3}
              placeholder="Thank you for your submission!"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#37322f]/10 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[#37322f] border border-[#37322f]/20 rounded-lg hover:bg-[#37322f]/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            className="px-4 py-2 text-sm bg-[#37322f] text-white rounded-lg hover:bg-[#37322f]/90 transition-colors"
          >
            Publish Form
          </button>
        </div>
      </div>
    </div>
  )
}
