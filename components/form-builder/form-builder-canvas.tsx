'use client'

import { useState, useCallback } from 'react'
import { 
  FormDocument, 
  FormSection, 
  FormField,
  FieldType,
  createField,
  createSection,
  createFormDocument,
  FIELD_TYPES
} from '@/lib/form-builder-types'
import { FieldPalette, QuickAddBar } from './field-palette'
import { FieldEditor } from './field-editor'
import { FormFieldRenderer } from './form-field-renderer'

// ============================================================================
// Form Builder Canvas - Main form building interface
// ============================================================================

interface FormBuilderCanvasProps {
  initialForm?: FormDocument
  onSave: (form: FormDocument) => void
  onPreview: () => void
  onPublish: () => void
}

export function FormBuilderCanvas({ 
  initialForm, 
  onSave, 
  onPreview,
  onPublish 
}: FormBuilderCanvasProps) {
  const [form, setForm] = useState<FormDocument>(
    initialForm || createFormDocument('Untitled Form', 'current-user')
  )
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
  const [dragOverFieldId, setDragOverFieldId] = useState<string | null>(null)
  const [showPalette, setShowPalette] = useState(true)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Find selected field
  const selectedField = selectedFieldId 
    ? form.sections.flatMap(s => s.fields).find(f => f.id === selectedFieldId)
    : null

  // =========================================================================
  // Form Operations
  // =========================================================================

  const updateForm = useCallback((updates: Partial<FormDocument>) => {
    setForm(prev => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }))
    setHasUnsavedChanges(true)
  }, [])

  const handleSave = useCallback(() => {
    onSave(form)
    setHasUnsavedChanges(false)
  }, [form, onSave])

  // =========================================================================
  // Section Operations
  // =========================================================================

  const addSection = useCallback(() => {
    const newSection = createSection()
    newSection.title = `Section ${form.sections.length + 1}`
    updateForm({ sections: [...form.sections, newSection] })
  }, [form.sections, updateForm])

  const updateSection = useCallback((sectionId: string, updates: Partial<FormSection>) => {
    updateForm({
      sections: form.sections.map(s => 
        s.id === sectionId ? { ...s, ...updates } : s
      )
    })
  }, [form.sections, updateForm])

  const deleteSection = useCallback((sectionId: string) => {
    if (form.sections.length <= 1) return
    updateForm({
      sections: form.sections.filter(s => s.id !== sectionId)
    })
    setSelectedSectionId(null)
    setSelectedFieldId(null)
  }, [form.sections, updateForm])

  // =========================================================================
  // Field Operations
  // =========================================================================

  const addField = useCallback((type: FieldType, sectionId?: string) => {
    const targetSectionId = sectionId || form.sections[0]?.id
    if (!targetSectionId) return

    const newField = createField(type)
    updateForm({
      sections: form.sections.map(s => 
        s.id === targetSectionId 
          ? { ...s, fields: [...s.fields, newField] }
          : s
      )
    })
    setSelectedFieldId(newField.id)
    setSelectedSectionId(targetSectionId)
  }, [form.sections, updateForm])

  const updateField = useCallback((field: FormField) => {
    updateForm({
      sections: form.sections.map(s => ({
        ...s,
        fields: s.fields.map(f => f.id === field.id ? field : f)
      }))
    })
  }, [form.sections, updateForm])

  const deleteField = useCallback((fieldId: string) => {
    updateForm({
      sections: form.sections.map(s => ({
        ...s,
        fields: s.fields.filter(f => f.id !== fieldId)
      }))
    })
    setSelectedFieldId(null)
  }, [form.sections, updateForm])

  const duplicateField = useCallback((fieldId: string) => {
    const section = form.sections.find(s => s.fields.some(f => f.id === fieldId))
    if (!section) return

    const field = section.fields.find(f => f.id === fieldId)
    if (!field) return

    const newField: FormField = {
      ...field,
      id: `field_${Date.now()}`,
      label: `${field.label} (copy)`
    }

    const fieldIndex = section.fields.findIndex(f => f.id === fieldId)
    const newFields = [...section.fields]
    newFields.splice(fieldIndex + 1, 0, newField)

    updateForm({
      sections: form.sections.map(s => 
        s.id === section.id ? { ...s, fields: newFields } : s
      )
    })
    setSelectedFieldId(newField.id)
  }, [form.sections, updateForm])

  const moveField = useCallback((
    fieldId: string, 
    newSectionId: string, 
    newIndex: number
  ) => {
    // Find and remove field from current section
    let movedField: FormField | null = null
    const sectionsWithoutField = form.sections.map(s => ({
      ...s,
      fields: s.fields.filter(f => {
        if (f.id === fieldId) {
          movedField = f
          return false
        }
        return true
      })
    }))

    if (!movedField) return

    // Add field to new position
    updateForm({
      sections: sectionsWithoutField.map(s => {
        if (s.id === newSectionId) {
          const newFields = [...s.fields]
          newFields.splice(newIndex, 0, movedField!)
          return { ...s, fields: newFields }
        }
        return s
      })
    })
  }, [form.sections, updateForm])

  // =========================================================================
  // Drag and Drop Handlers
  // =========================================================================

  const handleDragOver = useCallback((e: React.DragEvent, fieldId?: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (fieldId) {
      setDragOverFieldId(fieldId)
    }
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOverFieldId(null)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, sectionId: string, index?: number) => {
    e.preventDefault()
    setDragOverFieldId(null)

    const fieldType = e.dataTransfer.getData('fieldType') as FieldType
    const draggedFieldId = e.dataTransfer.getData('fieldId')

    if (fieldType) {
      // Adding new field from palette
      const newField = createField(fieldType)
      updateForm({
        sections: form.sections.map(s => {
          if (s.id === sectionId) {
            const newFields = [...s.fields]
            newFields.splice(index ?? newFields.length, 0, newField)
            return { ...s, fields: newFields }
          }
          return s
        })
      })
      setSelectedFieldId(newField.id)
    } else if (draggedFieldId) {
      // Moving existing field
      moveField(draggedFieldId, sectionId, index ?? 0)
    }
  }, [form.sections, updateForm, moveField])

  // =========================================================================
  // Render
  // =========================================================================

  return (
    <div className="h-full flex">
      {/* Left Sidebar - Field Palette */}
      {showPalette && (
        <div className="w-64 flex-shrink-0">
          <FieldPalette onAddField={(type) => addField(type)} />
        </div>
      )}

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-[#37322f]/10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPalette(!showPalette)}
              className={`p-2 rounded-lg transition-colors ${
                showPalette ? 'bg-[#37322f]/10' : 'hover:bg-[#37322f]/5'
              }`}
              title={showPalette ? 'Hide Fields' : 'Show Fields'}
            >
              <svg className="w-5 h-5 text-[#37322f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateForm({ title: e.target.value })}
              className="text-lg font-semibold text-[#37322f] bg-transparent border-none focus:outline-none focus:ring-0"
              placeholder="Form title..."
            />
            {hasUnsavedChanges && (
              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                Unsaved
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm text-[#37322f] border border-[#37322f]/20 rounded-lg hover:bg-[#37322f]/5 transition-colors"
            >
              Save
            </button>
            <button
              onClick={onPreview}
              className="px-4 py-2 text-sm text-[#37322f] border border-[#37322f]/20 rounded-lg hover:bg-[#37322f]/5 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </button>
            <button
              onClick={onPublish}
              className="px-4 py-2 text-sm bg-[#37322f] text-white rounded-lg hover:bg-[#37322f]/90 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Publish
            </button>
          </div>
        </div>

        {/* Form Canvas */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            {/* Form Header */}
            <div 
              className={`mb-6 p-6 bg-white rounded-xl border-2 ${
                form.theme.primaryColor === '#37322f' 
                  ? 'border-t-[#37322f]' 
                  : ''
              }`}
              style={{ borderTopColor: form.theme.primaryColor, borderTopWidth: 4 }}
            >
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateForm({ title: e.target.value })}
                className="w-full text-2xl font-bold text-[#37322f] bg-transparent border-none focus:outline-none"
                placeholder="Form title"
              />
              <textarea
                value={form.settings.description || ''}
                onChange={(e) => updateForm({ 
                  settings: { ...form.settings, description: e.target.value } 
                })}
                className="w-full mt-2 text-[#37322f]/70 bg-transparent border-none focus:outline-none resize-none"
                placeholder="Form description (optional)"
                rows={2}
              />
            </div>

            {/* Sections */}
            {form.sections.map((section, sectionIndex) => (
              <FormSectionCard
                key={section.id}
                section={section}
                sectionIndex={sectionIndex}
                isSelected={selectedSectionId === section.id}
                selectedFieldId={selectedFieldId}
                dragOverFieldId={dragOverFieldId}
                canDelete={form.sections.length > 1}
                onSelectSection={() => setSelectedSectionId(section.id)}
                onSelectField={setSelectedFieldId}
                onUpdateSection={(updates) => updateSection(section.id, updates)}
                onDeleteSection={() => deleteSection(section.id)}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e, index) => handleDrop(e, section.id, index)}
                onFieldDragStart={(fieldId) => {
                  return (e: React.DragEvent) => {
                    e.dataTransfer.setData('fieldId', fieldId)
                    e.dataTransfer.effectAllowed = 'move'
                  }
                }}
              />
            ))}

            {/* Add Section Button */}
            <button
              onClick={addSection}
              className="w-full py-4 border-2 border-dashed border-[#37322f]/20 rounded-xl text-[#37322f]/60 hover:border-[#37322f]/40 hover:text-[#37322f] transition-colors"
            >
              + Add Section
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Field Editor */}
      {selectedField && (
        <div className="w-80 flex-shrink-0">
          <FieldEditor
            field={selectedField}
            onUpdate={updateField}
            onDelete={() => deleteField(selectedField.id)}
            onDuplicate={() => duplicateField(selectedField.id)}
            onClose={() => setSelectedFieldId(null)}
          />
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Form Section Card
// ============================================================================

interface FormSectionCardProps {
  section: FormSection
  sectionIndex: number
  isSelected: boolean
  selectedFieldId: string | null
  dragOverFieldId: string | null
  canDelete: boolean
  onSelectSection: () => void
  onSelectField: (id: string | null) => void
  onUpdateSection: (updates: Partial<FormSection>) => void
  onDeleteSection: () => void
  onDragOver: (e: React.DragEvent, fieldId?: string) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent, index?: number) => void
  onFieldDragStart: (fieldId: string) => (e: React.DragEvent) => void
}

function FormSectionCard({
  section,
  sectionIndex,
  isSelected,
  selectedFieldId,
  dragOverFieldId,
  canDelete,
  onSelectSection,
  onSelectField,
  onUpdateSection,
  onDeleteSection,
  onDragOver,
  onDragLeave,
  onDrop,
  onFieldDragStart
}: FormSectionCardProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)

  return (
    <div 
      className={`mb-4 bg-white rounded-xl border-2 transition-colors ${
        isSelected ? 'border-[#37322f]/30' : 'border-transparent hover:border-[#37322f]/10'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onSelectSection()
      }}
    >
      {/* Section Header */}
      {sectionIndex > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#37322f]/10">
          {isEditingTitle ? (
            <input
              type="text"
              value={section.title || ''}
              onChange={(e) => onUpdateSection({ title: e.target.value })}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
              autoFocus
              className="flex-1 font-medium text-[#37322f] bg-transparent border-none focus:outline-none"
              placeholder="Section title"
            />
          ) : (
            <h4 
              className="font-medium text-[#37322f] cursor-text hover:bg-[#37322f]/5 px-2 py-1 -ml-2 rounded"
              onClick={() => setIsEditingTitle(true)}
            >
              {section.title || `Section ${sectionIndex + 1}`}
            </h4>
          )}
          {canDelete && (
            <button
              onClick={onDeleteSection}
              className="p-1 text-[#37322f]/40 hover:text-red-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Fields */}
      <div 
        className="p-4 min-h-[100px]"
        onDragOver={(e) => onDragOver(e)}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e)}
      >
        {section.fields.length === 0 ? (
          <div className="py-8 text-center text-[#37322f]/40 border-2 border-dashed border-[#37322f]/10 rounded-lg">
            <p className="text-sm">Drag fields here or click to add</p>
          </div>
        ) : (
          <div className="space-y-3">
            {section.fields.map((field, fieldIndex) => (
              <FieldCard
                key={field.id}
                field={field}
                isSelected={selectedFieldId === field.id}
                isDragOver={dragOverFieldId === field.id}
                onClick={() => onSelectField(field.id)}
                onDragStart={onFieldDragStart(field.id)}
                onDragOver={(e) => onDragOver(e, field.id)}
                onDrop={(e) => onDrop(e, fieldIndex)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Field Card (in builder view)
// ============================================================================

interface FieldCardProps {
  field: FormField
  isSelected: boolean
  isDragOver: boolean
  onClick: () => void
  onDragStart: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
}

function FieldCard({ 
  field, 
  isSelected, 
  isDragOver,
  onClick, 
  onDragStart,
  onDragOver,
  onDrop
}: FieldCardProps) {
  const fieldDef = FIELD_TYPES.find(f => f.type === field.type)

  // Layout fields render differently
  if (field.type === 'section_header') {
    return (
      <div
        draggable
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={onClick}
        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
          isSelected 
            ? 'border-[#37322f] bg-[#37322f]/5' 
            : isDragOver
              ? 'border-blue-400 bg-blue-50'
              : 'border-transparent hover:border-[#37322f]/20 hover:bg-[#37322f]/5'
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{fieldDef?.icon}</span>
          <span className="text-xs text-[#37322f]/50 uppercase tracking-wider">
            Section Header
          </span>
        </div>
        <h3 className="text-lg font-semibold text-[#37322f]">{field.label}</h3>
        {field.helpText && (
          <p className="text-sm text-[#37322f]/60 mt-1">{field.helpText}</p>
        )}
      </div>
    )
  }

  if (field.type === 'paragraph') {
    return (
      <div
        draggable
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={onClick}
        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
          isSelected 
            ? 'border-[#37322f] bg-[#37322f]/5' 
            : isDragOver
              ? 'border-blue-400 bg-blue-50'
              : 'border-transparent hover:border-[#37322f]/20 hover:bg-[#37322f]/5'
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{fieldDef?.icon}</span>
          <span className="text-xs text-[#37322f]/50 uppercase tracking-wider">
            Paragraph
          </span>
        </div>
        <p className="text-[#37322f]/70">{field.label}</p>
      </div>
    )
  }

  if (field.type === 'page_break') {
    return (
      <div
        draggable
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={onClick}
        className={`py-2 cursor-pointer transition-all ${
          isSelected ? 'ring-2 ring-[#37322f]' : ''
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-[#37322f]/20" />
          <span className="text-xs text-[#37322f]/40 uppercase tracking-wider px-2 bg-white">
            Page Break
          </span>
          <div className="flex-1 h-px bg-[#37322f]/20" />
        </div>
      </div>
    )
  }

  // Regular field card
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onClick}
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
        isSelected 
          ? 'border-[#37322f] bg-[#37322f]/5' 
          : isDragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-transparent hover:border-[#37322f]/20 hover:bg-[#37322f]/5'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span>{fieldDef?.icon}</span>
            <span className="text-xs text-[#37322f]/50">{fieldDef?.label}</span>
            {field.validation.required && (
              <span className="text-xs text-red-500">Required</span>
            )}
          </div>
          <p className="font-medium text-[#37322f]">{field.label}</p>
          {field.helpText && (
            <p className="text-sm text-[#37322f]/60 mt-0.5">{field.helpText}</p>
          )}
          
          {/* Preview of options for choice fields */}
          {field.options && field.options.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {field.options.slice(0, 3).map((opt) => (
                <span 
                  key={opt.id}
                  className="text-xs px-2 py-0.5 bg-[#37322f]/10 text-[#37322f]/70 rounded"
                >
                  {opt.label}
                </span>
              ))}
              {field.options.length > 3 && (
                <span className="text-xs px-2 py-0.5 text-[#37322f]/50">
                  +{field.options.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Drag Handle */}
        <div className="p-1 text-[#37322f]/30 hover:text-[#37322f]/60 cursor-grab">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default FormBuilderCanvas
