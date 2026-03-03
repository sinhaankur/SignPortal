'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FormDocument, FormField } from '@/lib/form-builder-types'
import { FormFieldRenderer } from '@/components/form-builder'

// ============================================================================
// Public Form Response Page
// ============================================================================

export default function FormResponsePage() {
  const params = useParams()
  const router = useRouter()
  const formId = params.id as string

  const [form, setForm] = useState<FormDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Load form from localStorage
  useEffect(() => {
    const loadForm = () => {
      try {
        const formsListRaw = localStorage.getItem('signportal-forms')
        if (formsListRaw) {
          const formsList: FormDocument[] = JSON.parse(formsListRaw)
          const foundForm = formsList.find(f => f.id === formId)
          if (foundForm) {
            setForm(foundForm)
          }
        }
      } catch (error) {
        console.error('Failed to load form:', error)
      } finally {
        setLoading(false)
      }
    }

    loadForm()
  }, [formId])

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    form?.sections.forEach(section => {
      section.fields.forEach(field => {
        // Skip layout fields
        if (['section_header', 'paragraph', 'page_break'].includes(field.type)) return

        const value = formData[field.id]

        // Required validation
        if (field.validation.required) {
          if (field.type === 'checkbox') {
            if (!value) {
              newErrors[field.id] = 'This field is required'
            }
          } else if (field.type === 'multiple_choice') {
            if (!value || (Array.isArray(value) && value.length === 0)) {
              newErrors[field.id] = 'Please select at least one option'
            }
          } else {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
              newErrors[field.id] = 'This field is required'
            }
          }
        }

        // String validations
        if (typeof value === 'string' && value) {
          // Min length
          if (field.validation.minLength && value.length < field.validation.minLength) {
            newErrors[field.id] = `Minimum ${field.validation.minLength} characters required`
          }
          // Max length
          if (field.validation.maxLength && value.length > field.validation.maxLength) {
            newErrors[field.id] = `Maximum ${field.validation.maxLength} characters allowed`
          }
          // Email validation
          if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            newErrors[field.id] = 'Please enter a valid email address'
          }
          // Pattern validation
          if (field.validation.pattern) {
            try {
              const regex = new RegExp(field.validation.pattern)
              if (!regex.test(value)) {
                newErrors[field.id] = field.validation.customMessage || 'Invalid format'
              }
            } catch {
              // Invalid regex, skip
            }
          }
        }

        // Number validations
        if (field.type === 'number' && value) {
          const numValue = parseFloat(value)
          if (field.validation.minValue !== undefined && numValue < field.validation.minValue) {
            newErrors[field.id] = `Minimum value is ${field.validation.minValue}`
          }
          if (field.validation.maxValue !== undefined && numValue > field.validation.maxValue) {
            newErrors[field.id] = `Maximum value is ${field.validation.maxValue}`
          }
        }
      })
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0]
      const element = document.getElementById(`field-${firstErrorField}`)
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setSubmitting(true)

    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Save response
    const response = {
      id: `response_${Date.now()}`,
      formId: formId,
      data: formData,
      submittedAt: new Date().toISOString()
    }

    try {
      const responsesRaw = localStorage.getItem(`form-responses-${formId}`)
      const responses = responsesRaw ? JSON.parse(responsesRaw) : []
      responses.push(response)
      localStorage.setItem(`form-responses-${formId}`, JSON.stringify(responses))
    } catch (error) {
      console.error('Failed to save response:', error)
    }

    setSubmitting(false)
    setSubmitted(true)
  }

  // Clear form
  const handleClear = () => {
    setFormData({})
    setErrors({})
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#37322f] border-t-transparent"></div>
      </div>
    )
  }

  // Form not found
  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-[#37322f] mb-2">Form Not Found</h1>
          <p className="text-[#37322f]/60 mb-6">This form may have been deleted or the link is incorrect.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#37322f] text-white rounded-lg hover:bg-[#37322f]/90 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    )
  }

  // Form not published
  if (form.status !== 'published') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-[#37322f] mb-2">Form Not Available</h1>
          <p className="text-[#37322f]/60 mb-6">This form is not currently accepting responses.</p>
        </div>
      </div>
    )
  }

  // Submitted state
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4 max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-[#37322f] mb-2">Response Submitted</h1>
          <p className="text-[#37322f]/70 mb-6">
            {form.settings.confirmationMessage || 'Thank you for your submission!'}
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setSubmitted(false)
                setFormData({})
              }}
              className="px-4 py-2 text-[#37322f] border border-[#37322f]/20 rounded-lg hover:bg-[#37322f]/5 transition-colors"
            >
              Submit Another Response
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Main form
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4">
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
              Sign-in required
            </p>
          )}
        </div>

        {/* Form Sections */}
        {form.sections.map((section, sectionIndex) => (
          <div key={section.id} className="mb-6 p-6 bg-white rounded-xl border border-gray-200">
            {section.title && sectionIndex > 0 && (
              <h2 className="text-lg font-semibold text-[#37322f] mb-4">{section.title}</h2>
            )}
            {section.description && (
              <p className="text-[#37322f]/70 mb-4">{section.description}</p>
            )}
            
            {section.fields.map(field => {
              // Skip page breaks
              if (field.type === 'page_break') return null
              
              return (
                <div key={field.id} id={`field-${field.id}`}>
                  <FormFieldRenderer
                    field={field}
                    value={formData[field.id]}
                    onChange={(value) => {
                      setFormData({ ...formData, [field.id]: value })
                      // Clear error when user starts typing
                      if (errors[field.id]) {
                        setErrors({ ...errors, [field.id]: '' })
                      }
                    }}
                    error={errors[field.id]}
                  />
                </div>
              )
            })}
          </div>
        ))}

        {/* Submit Buttons */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 text-[#37322f]/70 hover:text-[#37322f] transition-colors"
          >
            Clear Form
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-[#37322f] text-white rounded-lg hover:bg-[#37322f]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[#37322f]/50">
            Powered by <span className="font-semibold">SignPortal</span>
          </p>
        </div>
      </form>
    </div>
  )
}
