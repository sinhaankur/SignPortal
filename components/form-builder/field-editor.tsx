'use client'

import { useState } from 'react'
import { 
  FormField, 
  FieldOption,
  FieldType,
  FIELD_TYPES 
} from '@/lib/form-builder-types'

// ============================================================================
// Field Editor - Edit field properties in form builder
// ============================================================================

interface FieldEditorProps {
  field: FormField
  onUpdate: (field: FormField) => void
  onDelete: () => void
  onDuplicate: () => void
  onClose: () => void
}

export function FieldEditor({ 
  field, 
  onUpdate, 
  onDelete, 
  onDuplicate,
  onClose 
}: FieldEditorProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'validation' | 'logic'>('general')
  
  const fieldDef = FIELD_TYPES.find(f => f.type === field.type)
  const hasOptions = ['dropdown', 'single_choice', 'multiple_choice'].includes(field.type)
  const isLayoutField = ['section_header', 'paragraph', 'page_break'].includes(field.type)

  const handleChange = <K extends keyof FormField>(key: K, value: FormField[K]) => {
    onUpdate({ ...field, [key]: value })
  }

  const handleValidationChange = <K extends keyof FormField['validation']>(
    key: K, 
    value: FormField['validation'][K]
  ) => {
    onUpdate({ 
      ...field, 
      validation: { ...field.validation, [key]: value } 
    })
  }

  return (
    <div className="bg-white border-l border-[#37322f]/10 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#37322f]/10">
        <div className="flex items-center gap-2">
          <span className="text-lg">{fieldDef?.icon}</span>
          <span className="font-medium text-[#37322f]">{fieldDef?.label}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-[#37322f]/5 rounded transition-colors"
        >
          <svg className="w-5 h-5 text-[#37322f]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#37322f]/10">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'general'
              ? 'text-[#37322f] border-b-2 border-[#37322f]'
              : 'text-[#37322f]/60 hover:text-[#37322f]'
          }`}
        >
          General
        </button>
        {!isLayoutField && (
          <>
            <button
              onClick={() => setActiveTab('validation')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'validation'
                  ? 'text-[#37322f] border-b-2 border-[#37322f]'
                  : 'text-[#37322f]/60 hover:text-[#37322f]'
              }`}
            >
              Validation
            </button>
            <button
              onClick={() => setActiveTab('logic')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'logic'
                  ? 'text-[#37322f] border-b-2 border-[#37322f]'
                  : 'text-[#37322f]/60 hover:text-[#37322f]'
              }`}
            >
              Logic
            </button>
          </>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'general' && (
          <GeneralTab 
            field={field} 
            onChange={handleChange}
            hasOptions={hasOptions}
          />
        )}
        {activeTab === 'validation' && (
          <ValidationTab 
            field={field} 
            onValidationChange={handleValidationChange}
          />
        )}
        {activeTab === 'logic' && (
          <LogicTab 
            field={field} 
            onChange={handleChange}
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 p-4 border-t border-[#37322f]/10">
        <button
          onClick={onDuplicate}
          className="flex-1 px-3 py-2 text-sm text-[#37322f] border border-[#37322f]/20 rounded-lg hover:bg-[#37322f]/5 transition-colors"
        >
          Duplicate
        </button>
        <button
          onClick={onDelete}
          className="flex-1 px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// General Tab
// ============================================================================

interface GeneralTabProps {
  field: FormField
  onChange: <K extends keyof FormField>(key: K, value: FormField[K]) => void
  hasOptions: boolean
}

function GeneralTab({ field, onChange, hasOptions }: GeneralTabProps) {
  return (
    <div className="space-y-4">
      {/* Label */}
      <div>
        <label className="block text-sm font-medium text-[#37322f] mb-1">
          Label / Question
        </label>
        <input
          type="text"
          value={field.label}
          onChange={(e) => onChange('label', e.target.value)}
          className="w-full px-3 py-2 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
          placeholder="Enter label..."
        />
      </div>

      {/* Placeholder */}
      {!['section_header', 'paragraph', 'page_break', 'signature', 'initials', 'file_upload'].includes(field.type) && (
        <div>
          <label className="block text-sm font-medium text-[#37322f] mb-1">
            Placeholder
          </label>
          <input
            type="text"
            value={field.placeholder || ''}
            onChange={(e) => onChange('placeholder', e.target.value)}
            className="w-full px-3 py-2 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
            placeholder="Enter placeholder..."
          />
        </div>
      )}

      {/* Help Text */}
      <div>
        <label className="block text-sm font-medium text-[#37322f] mb-1">
          Help Text
        </label>
        <textarea
          value={field.helpText || ''}
          onChange={(e) => onChange('helpText', e.target.value)}
          className="w-full px-3 py-2 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20 resize-none"
          rows={2}
          placeholder="Additional instructions..."
        />
      </div>

      {/* Width */}
      <div>
        <label className="block text-sm font-medium text-[#37322f] mb-1">
          Field Width
        </label>
        <div className="flex gap-2">
          {(['full', 'half', 'third'] as const).map((width) => (
            <button
              key={width}
              onClick={() => onChange('width', width)}
              className={`flex-1 px-3 py-2 text-sm border rounded-lg transition-colors ${
                field.width === width
                  ? 'border-[#37322f] bg-[#37322f] text-white'
                  : 'border-[#37322f]/20 text-[#37322f] hover:bg-[#37322f]/5'
              }`}
            >
              {width === 'full' ? 'Full' : width === 'half' ? '1/2' : '1/3'}
            </button>
          ))}
        </div>
      </div>

      {/* Options (for choice fields) */}
      {hasOptions && (
        <OptionsEditor 
          options={field.options || []}
          onChange={(options) => onChange('options', options)}
        />
      )}
    </div>
  )
}

// ============================================================================
// Options Editor
// ============================================================================

interface OptionsEditorProps {
  options: FieldOption[]
  onChange: (options: FieldOption[]) => void
}

function OptionsEditor({ options, onChange }: OptionsEditorProps) {
  const addOption = () => {
    const newOption: FieldOption = {
      id: `opt_${Date.now()}`,
      label: `Option ${options.length + 1}`,
      value: `option_${options.length + 1}`
    }
    onChange([...options, newOption])
  }

  const updateOption = (index: number, updates: Partial<FieldOption>) => {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], ...updates }
    onChange(newOptions)
  }

  const removeOption = (index: number) => {
    onChange(options.filter((_, i) => i !== index))
  }

  const moveOption = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= options.length) return
    const newOptions = [...options]
    ;[newOptions[index], newOptions[newIndex]] = [newOptions[newIndex], newOptions[index]]
    onChange(newOptions)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-[#37322f] mb-2">
        Options
      </label>
      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={option.id} className="flex items-center gap-2">
            <div className="flex flex-col">
              <button
                onClick={() => moveOption(index, 'up')}
                disabled={index === 0}
                className="p-0.5 hover:bg-[#37322f]/5 rounded disabled:opacity-30"
              >
                <svg className="w-3 h-3 text-[#37322f]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                onClick={() => moveOption(index, 'down')}
                disabled={index === options.length - 1}
                className="p-0.5 hover:bg-[#37322f]/5 rounded disabled:opacity-30"
              >
                <svg className="w-3 h-3 text-[#37322f]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <input
              type="text"
              value={option.label}
              onChange={(e) => updateOption(index, { 
                label: e.target.value,
                value: e.target.value.toLowerCase().replace(/\s+/g, '_')
              })}
              className="flex-1 px-3 py-1.5 text-sm border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
              placeholder="Option label"
            />
            <button
              onClick={() => removeOption(index)}
              className="p-1.5 hover:bg-red-50 rounded text-red-500"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addOption}
        className="mt-2 w-full px-3 py-2 text-sm text-[#37322f]/70 border border-dashed border-[#37322f]/30 rounded-lg hover:border-[#37322f]/50 hover:text-[#37322f] transition-colors"
      >
        + Add Option
      </button>
    </div>
  )
}

// ============================================================================
// Validation Tab
// ============================================================================

interface ValidationTabProps {
  field: FormField
  onValidationChange: <K extends keyof FormField['validation']>(
    key: K, 
    value: FormField['validation'][K]
  ) => void
}

function ValidationTab({ field, onValidationChange }: ValidationTabProps) {
  const showMinMax = ['short_text', 'long_text', 'number'].includes(field.type)
  const showPattern = ['short_text', 'email', 'phone'].includes(field.type)
  const isNumber = field.type === 'number'

  return (
    <div className="space-y-4">
      {/* Required */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-[#37322f]">Required</p>
          <p className="text-sm text-[#37322f]/60">User must fill this field</p>
        </div>
        <button
          onClick={() => onValidationChange('required', !field.validation.required)}
          className={`w-12 h-6 rounded-full transition-colors ${
            field.validation.required ? 'bg-[#37322f]' : 'bg-[#37322f]/20'
          }`}
        >
          <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
            field.validation.required ? 'translate-x-6' : 'translate-x-0.5'
          }`} />
        </button>
      </div>

      {/* Min/Max Length (for text) or Value (for number) */}
      {showMinMax && (
        <>
          <div>
            <label className="block text-sm font-medium text-[#37322f] mb-1">
              {isNumber ? 'Minimum Value' : 'Minimum Length'}
            </label>
            <input
              type="number"
              value={isNumber ? field.validation.minValue || '' : field.validation.minLength || ''}
              onChange={(e) => onValidationChange(
                isNumber ? 'minValue' : 'minLength', 
                e.target.value ? parseInt(e.target.value) : undefined
              )}
              className="w-full px-3 py-2 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
              placeholder={isNumber ? 'No minimum' : '0'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#37322f] mb-1">
              {isNumber ? 'Maximum Value' : 'Maximum Length'}
            </label>
            <input
              type="number"
              value={isNumber ? field.validation.maxValue || '' : field.validation.maxLength || ''}
              onChange={(e) => onValidationChange(
                isNumber ? 'maxValue' : 'maxLength', 
                e.target.value ? parseInt(e.target.value) : undefined
              )}
              className="w-full px-3 py-2 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
              placeholder={isNumber ? 'No maximum' : 'Unlimited'}
            />
          </div>
        </>
      )}

      {/* Custom Pattern */}
      {showPattern && (
        <div>
          <label className="block text-sm font-medium text-[#37322f] mb-1">
            Pattern (Regex)
          </label>
          <input
            type="text"
            value={field.validation.pattern || ''}
            onChange={(e) => onValidationChange('pattern', e.target.value)}
            className="w-full px-3 py-2 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20 font-mono text-sm"
            placeholder="e.g., ^[A-Z]{2}[0-9]{4}$"
          />
          <p className="mt-1 text-xs text-[#37322f]/50">
            Leave empty to use default validation
          </p>
        </div>
      )}

      {/* Custom Error Message */}
      <div>
        <label className="block text-sm font-medium text-[#37322f] mb-1">
          Custom Error Message
        </label>
        <input
          type="text"
          value={field.validation.customMessage || ''}
          onChange={(e) => onValidationChange('customMessage', e.target.value)}
          className="w-full px-3 py-2 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
          placeholder="Invalid input"
        />
      </div>
    </div>
  )
}

// ============================================================================
// Logic Tab (Conditional Logic)
// ============================================================================

interface LogicTabProps {
  field: FormField
  onChange: <K extends keyof FormField>(key: K, value: FormField[K]) => void
}

function LogicTab({ field, onChange }: LogicTabProps) {
  const conditional = field.conditional
  const hasLogic = conditional?.fieldId && conditional?.operator

  const updateLogic = (updates: Partial<NonNullable<FormField['conditional']>>) => {
    onChange('conditional', { ...conditional, ...updates } as FormField['conditional'])
  }

  const clearLogic = () => {
    onChange('conditional', undefined)
  }

  return (
    <div className="space-y-4">
      <div className="bg-[#fdf6e3] border border-[#f0e6c0] rounded-lg p-3">
        <p className="text-sm text-[#37322f]/80">
          Show or hide this field based on another field's value.
        </p>
      </div>

      {/* Enable Logic */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-[#37322f]">Enable Logic</p>
          <p className="text-sm text-[#37322f]/60">Conditionally show this field</p>
        </div>
        <button
          onClick={() => {
            if (hasLogic) {
              clearLogic()
            } else {
              updateLogic({ 
                fieldId: '', 
                operator: 'equals', 
                value: '' 
              })
            }
          }}
          className={`w-12 h-6 rounded-full transition-colors ${
            hasLogic ? 'bg-[#37322f]' : 'bg-[#37322f]/20'
          }`}
        >
          <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
            hasLogic ? 'translate-x-6' : 'translate-x-0.5'
          }`} />
        </button>
      </div>

      {hasLogic && (
        <>
          {/* Field Selector */}
          <div>
            <label className="block text-sm font-medium text-[#37322f] mb-1">
              When field
            </label>
            <input
              type="text"
              value={conditional?.fieldId || ''}
              onChange={(e) => updateLogic({ fieldId: e.target.value })}
              className="w-full px-3 py-2 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
              placeholder="Field ID"
            />
          </div>

          {/* Operator */}
          <div>
            <label className="block text-sm font-medium text-[#37322f] mb-1">
              Operator
            </label>
            <select
              value={conditional?.operator || 'equals'}
              onChange={(e) => updateLogic({ 
                operator: e.target.value as NonNullable<FormField['conditional']>['operator']
              })}
              className="w-full px-3 py-2 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20 bg-white"
            >
              <option value="equals">Equals</option>
              <option value="not_equals">Not Equals</option>
              <option value="contains">Contains</option>
              <option value="not_contains">Not Contains</option>
            </select>
          </div>

          {/* Value */}
          <div>
            <label className="block text-sm font-medium text-[#37322f] mb-1">
              Value
            </label>
            <input
              type="text"
              value={conditional?.value || ''}
              onChange={(e) => updateLogic({ value: e.target.value })}
              className="w-full px-3 py-2 border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
              placeholder="Match value"
            />
          </div>
        </>
      )}
    </div>
  )
}

export default FieldEditor
