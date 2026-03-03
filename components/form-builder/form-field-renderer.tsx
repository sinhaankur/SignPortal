'use client'

import { useState, useRef } from 'react'
import { 
  FormField, 
  FieldType,
  FieldOption 
} from '@/lib/form-builder-types'

// ============================================================================
// Form Field Renderer - Renders fields for form filling
// ============================================================================

interface FormFieldRendererProps {
  field: FormField
  value: string | string[] | boolean | null
  onChange: (value: string | string[] | boolean | null) => void
  error?: string
  disabled?: boolean
}

export function FormFieldRenderer({ 
  field, 
  value, 
  onChange, 
  error,
  disabled = false 
}: FormFieldRendererProps) {
  switch (field.type) {
    case 'short_text':
      return (
        <ShortTextInput 
          field={field} 
          value={value as string} 
          onChange={onChange}
          error={error}
          disabled={disabled}
        />
      )
    case 'long_text':
      return (
        <LongTextInput 
          field={field} 
          value={value as string} 
          onChange={onChange}
          error={error}
          disabled={disabled}
        />
      )
    case 'email':
      return (
        <EmailInput 
          field={field} 
          value={value as string} 
          onChange={onChange}
          error={error}
          disabled={disabled}
        />
      )
    case 'phone':
      return (
        <PhoneInput 
          field={field} 
          value={value as string} 
          onChange={onChange}
          error={error}
          disabled={disabled}
        />
      )
    case 'number':
      return (
        <NumberInput 
          field={field} 
          value={value as string} 
          onChange={onChange}
          error={error}
          disabled={disabled}
        />
      )
    case 'date':
      return (
        <DateInput 
          field={field} 
          value={value as string} 
          onChange={onChange}
          error={error}
          disabled={disabled}
        />
      )
    case 'time':
      return (
        <TimeInput 
          field={field} 
          value={value as string} 
          onChange={onChange}
          error={error}
          disabled={disabled}
        />
      )
    case 'dropdown':
      return (
        <DropdownInput 
          field={field} 
          value={value as string} 
          onChange={onChange}
          error={error}
          disabled={disabled}
        />
      )
    case 'single_choice':
      return (
        <SingleChoiceInput 
          field={field} 
          value={value as string} 
          onChange={onChange}
          error={error}
          disabled={disabled}
        />
      )
    case 'multiple_choice':
      return (
        <MultipleChoiceInput 
          field={field} 
          value={value as string[]} 
          onChange={onChange}
          error={error}
          disabled={disabled}
        />
      )
    case 'checkbox':
      return (
        <CheckboxInput 
          field={field} 
          value={value as boolean} 
          onChange={onChange}
          error={error}
          disabled={disabled}
        />
      )
    case 'signature':
      return (
        <SignatureInput 
          field={field} 
          value={value as string} 
          onChange={onChange}
          error={error}
          disabled={disabled}
        />
      )
    case 'initials':
      return (
        <InitialsInput 
          field={field} 
          value={value as string} 
          onChange={onChange}
          error={error}
          disabled={disabled}
        />
      )
    case 'file_upload':
      return (
        <FileUploadInput 
          field={field} 
          value={value as string} 
          onChange={onChange}
          error={error}
          disabled={disabled}
        />
      )
    case 'section_header':
      return <SectionHeader field={field} />
    case 'paragraph':
      return <ParagraphText field={field} />
    case 'page_break':
      return <PageBreak />
    default:
      return <div className="text-red-500">Unknown field type: {field.type}</div>
  }
}

// ============================================================================
// Field Wrapper Component
// ============================================================================

interface FieldWrapperProps {
  field: FormField
  error?: string
  children: React.ReactNode
}

function FieldWrapper({ field, error, children }: FieldWrapperProps) {
  return (
    <div className={`mb-6 ${field.width === 'half' ? 'w-1/2' : field.width === 'third' ? 'w-1/3' : 'w-full'}`}>
      <label className="block mb-2">
        <span className="text-[#37322f] font-medium">
          {field.label}
          {field.validation.required && <span className="text-red-500 ml-1">*</span>}
        </span>
        {field.helpText && (
          <span className="block text-sm text-[#37322f]/60 mt-1">{field.helpText}</span>
        )}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}

// ============================================================================
// Individual Field Components
// ============================================================================

// Short Text Input
function ShortTextInput({ field, value, onChange, error, disabled }: {
  field: FormField
  value: string
  onChange: (v: string) => void
  error?: string
  disabled?: boolean
}) {
  return (
    <FieldWrapper field={field} error={error}>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder || 'Your answer'}
        disabled={disabled}
        className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20 focus:border-[#37322f] disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </FieldWrapper>
  )
}

// Long Text Input
function LongTextInput({ field, value, onChange, error, disabled }: {
  field: FormField
  value: string
  onChange: (v: string) => void
  error?: string
  disabled?: boolean
}) {
  return (
    <FieldWrapper field={field} error={error}>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder || 'Your answer'}
        disabled={disabled}
        rows={4}
        className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20 focus:border-[#37322f] disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
      />
    </FieldWrapper>
  )
}

// Email Input
function EmailInput({ field, value, onChange, error, disabled }: {
  field: FormField
  value: string
  onChange: (v: string) => void
  error?: string
  disabled?: boolean
}) {
  return (
    <FieldWrapper field={field} error={error}>
      <input
        type="email"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder || 'email@example.com'}
        disabled={disabled}
        className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20 focus:border-[#37322f] disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </FieldWrapper>
  )
}

// Phone Input
function PhoneInput({ field, value, onChange, error, disabled }: {
  field: FormField
  value: string
  onChange: (v: string) => void
  error?: string
  disabled?: boolean
}) {
  return (
    <FieldWrapper field={field} error={error}>
      <input
        type="tel"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder || '+1 (555) 000-0000'}
        disabled={disabled}
        className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20 focus:border-[#37322f] disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </FieldWrapper>
  )
}

// Number Input
function NumberInput({ field, value, onChange, error, disabled }: {
  field: FormField
  value: string
  onChange: (v: string) => void
  error?: string
  disabled?: boolean
}) {
  return (
    <FieldWrapper field={field} error={error}>
      <input
        type="number"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder || '0'}
        disabled={disabled}
        min={field.validation.minValue}
        max={field.validation.maxValue}
        className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20 focus:border-[#37322f] disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </FieldWrapper>
  )
}

// Date Input
function DateInput({ field, value, onChange, error, disabled }: {
  field: FormField
  value: string
  onChange: (v: string) => void
  error?: string
  disabled?: boolean
}) {
  return (
    <FieldWrapper field={field} error={error}>
      <input
        type="date"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20 focus:border-[#37322f] disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </FieldWrapper>
  )
}

// Time Input
function TimeInput({ field, value, onChange, error, disabled }: {
  field: FormField
  value: string
  onChange: (v: string) => void
  error?: string
  disabled?: boolean
}) {
  return (
    <FieldWrapper field={field} error={error}>
      <input
        type="time"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20 focus:border-[#37322f] disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </FieldWrapper>
  )
}

// Dropdown Input
function DropdownInput({ field, value, onChange, error, disabled }: {
  field: FormField
  value: string
  onChange: (v: string) => void
  error?: string
  disabled?: boolean
}) {
  return (
    <FieldWrapper field={field} error={error}>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-4 py-3 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20 focus:border-[#37322f] disabled:bg-gray-100 disabled:cursor-not-allowed bg-white"
      >
        <option value="">Select an option</option>
        {field.options?.map((option) => (
          <option key={option.id} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  )
}

// Single Choice (Radio)
function SingleChoiceInput({ field, value, onChange, error, disabled }: {
  field: FormField
  value: string
  onChange: (v: string) => void
  error?: string
  disabled?: boolean
}) {
  return (
    <FieldWrapper field={field} error={error}>
      <div className="space-y-3">
        {field.options?.map((option) => (
          <label 
            key={option.id}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
              value === option.value 
                ? 'border-[#37322f] bg-[#37322f]' 
                : 'border-[#37322f]/30 group-hover:border-[#37322f]/50'
            }`}>
              {value === option.value && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
            <input
              type="radio"
              name={field.id}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className="sr-only"
            />
            <span className="text-[#37322f]">{option.label}</span>
          </label>
        ))}
      </div>
    </FieldWrapper>
  )
}

// Multiple Choice (Checkboxes)
function MultipleChoiceInput({ field, value, onChange, error, disabled }: {
  field: FormField
  value: string[]
  onChange: (v: string[]) => void
  error?: string
  disabled?: boolean
}) {
  const currentValues = value || []

  const handleToggle = (optionValue: string) => {
    if (currentValues.includes(optionValue)) {
      onChange(currentValues.filter(v => v !== optionValue))
    } else {
      onChange([...currentValues, optionValue])
    }
  }

  return (
    <FieldWrapper field={field} error={error}>
      <div className="space-y-3">
        {field.options?.map((option) => (
          <label 
            key={option.id}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              currentValues.includes(option.value)
                ? 'border-[#37322f] bg-[#37322f]' 
                : 'border-[#37322f]/30 group-hover:border-[#37322f]/50'
            }`}>
              {currentValues.includes(option.value) && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <input
              type="checkbox"
              value={option.value}
              checked={currentValues.includes(option.value)}
              onChange={() => handleToggle(option.value)}
              disabled={disabled}
              className="sr-only"
            />
            <span className="text-[#37322f]">{option.label}</span>
          </label>
        ))}
      </div>
    </FieldWrapper>
  )
}

// Single Checkbox
function CheckboxInput({ field, value, onChange, error, disabled }: {
  field: FormField
  value: boolean
  onChange: (v: boolean) => void
  error?: string
  disabled?: boolean
}) {
  return (
    <FieldWrapper field={field} error={error}>
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          value
            ? 'border-[#37322f] bg-[#37322f]' 
            : 'border-[#37322f]/30 group-hover:border-[#37322f]/50'
        }`}>
          {value && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <input
          type="checkbox"
          checked={value || false}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <span className="text-[#37322f]">{field.placeholder || 'I agree'}</span>
      </label>
    </FieldWrapper>
  )
}

// Signature Input
function SignatureInput({ field, value, onChange, error, disabled }: {
  field: FormField
  value: string
  onChange: (v: string) => void
  error?: string
  disabled?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled) return
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const rect = canvas.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top
    
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const rect = canvas.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top
    
    ctx.lineTo(x, y)
    ctx.strokeStyle = '#37322f'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.stroke()
  }

  const stopDrawing = () => {
    if (!isDrawing) return
    setIsDrawing(false)
    const canvas = canvasRef.current
    if (canvas) {
      onChange(canvas.toDataURL())
    }
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    onChange('')
  }

  return (
    <FieldWrapper field={field} error={error}>
      <div className="border border-[#37322f]/20 rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          width={400}
          height={150}
          className="w-full cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-t border-[#37322f]/10">
          <span className="text-xs text-[#37322f]/60">Draw your signature above</span>
          <button
            type="button"
            onClick={clearSignature}
            disabled={disabled}
            className="text-sm text-[#37322f]/70 hover:text-[#37322f] disabled:opacity-50"
          >
            Clear
          </button>
        </div>
      </div>
    </FieldWrapper>
  )
}

// Initials Input
function InitialsInput({ field, value, onChange, error, disabled }: {
  field: FormField
  value: string
  onChange: (v: string) => void
  error?: string
  disabled?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled) return
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const rect = canvas.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top
    
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const rect = canvas.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top
    
    ctx.lineTo(x, y)
    ctx.strokeStyle = '#37322f'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.stroke()
  }

  const stopDrawing = () => {
    if (!isDrawing) return
    setIsDrawing(false)
    const canvas = canvasRef.current
    if (canvas) {
      onChange(canvas.toDataURL())
    }
  }

  const clearInitials = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    onChange('')
  }

  return (
    <FieldWrapper field={field} error={error}>
      <div className="border border-[#37322f]/20 rounded-lg overflow-hidden bg-white inline-block">
        <canvas
          ref={canvasRef}
          width={150}
          height={80}
          className="cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <div className="flex justify-between items-center px-3 py-1.5 bg-gray-50 border-t border-[#37322f]/10">
          <span className="text-xs text-[#37322f]/60">Initials</span>
          <button
            type="button"
            onClick={clearInitials}
            disabled={disabled}
            className="text-xs text-[#37322f]/70 hover:text-[#37322f] disabled:opacity-50"
          >
            Clear
          </button>
        </div>
      </div>
    </FieldWrapper>
  )
}

// File Upload Input
function FileUploadInput({ field, value, onChange, error, disabled }: {
  field: FormField
  value: string
  onChange: (v: string) => void
  error?: string
  disabled?: boolean
}) {
  const [fileName, setFileName] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = () => {
        onChange(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <FieldWrapper field={field} error={error}>
      <div className="border-2 border-dashed border-[#37322f]/20 rounded-lg p-6 text-center hover:border-[#37322f]/40 transition-colors">
        <input
          type="file"
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
          id={`file-${field.id}`}
        />
        <label htmlFor={`file-${field.id}`} className="cursor-pointer">
          <svg className="w-10 h-10 mx-auto mb-3 text-[#37322f]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          {fileName ? (
            <p className="text-sm text-[#37322f] font-medium">{fileName}</p>
          ) : (
            <>
              <p className="text-sm text-[#37322f] font-medium">Click to upload</p>
              <p className="text-xs text-[#37322f]/60 mt-1">or drag and drop</p>
            </>
          )}
        </label>
      </div>
    </FieldWrapper>
  )
}

// Section Header
function SectionHeader({ field }: { field: FormField }) {
  return (
    <div className="mb-6 pt-4 border-t border-[#37322f]/10">
      <h3 className="text-xl font-semibold text-[#37322f]">{field.label}</h3>
      {field.helpText && (
        <p className="text-sm text-[#37322f]/60 mt-1">{field.helpText}</p>
      )}
    </div>
  )
}

// Paragraph Text
function ParagraphText({ field }: { field: FormField }) {
  return (
    <div className="mb-6">
      <p className="text-[#37322f]/80 whitespace-pre-wrap">{field.label}</p>
    </div>
  )
}

// Page Break
function PageBreak() {
  return (
    <div className="my-8 flex items-center gap-4">
      <div className="flex-1 h-px bg-[#37322f]/20" />
      <span className="text-xs text-[#37322f]/40 uppercase tracking-wider">Page Break</span>
      <div className="flex-1 h-px bg-[#37322f]/20" />
    </div>
  )
}

export default FormFieldRenderer
