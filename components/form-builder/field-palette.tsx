'use client'

import { useState } from 'react'
import { 
  FieldType, 
  FieldTypeDefinition,
  FIELD_TYPES 
} from '@/lib/form-builder-types'

// ============================================================================
// Field Palette - Available fields to add to form
// ============================================================================

interface FieldPaletteProps {
  onAddField: (type: FieldType) => void
}

export function FieldPalette({ onAddField }: FieldPaletteProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['basic', 'contact', 'choice', 'signature', 'layout'])
  )

  // Group fields by category
  const categories = [
    { id: 'basic', label: 'Basic Fields', icon: '📝' },
    { id: 'contact', label: 'Contact Info', icon: '📧' },
    { id: 'choice', label: 'Choice Fields', icon: '☑️' },
    { id: 'signature', label: 'Signature', icon: '✍️' },
    { id: 'layout', label: 'Layout', icon: '📐' },
  ]

  const fieldsByCategory = categories.map(category => ({
    ...category,
    fields: FIELD_TYPES.filter(f => 
      f.category === category.id &&
      (searchTerm === '' || 
        f.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }))

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  return (
    <div className="h-full flex flex-col bg-white border-r border-[#37322f]/10">
      {/* Header */}
      <div className="p-4 border-b border-[#37322f]/10">
        <h3 className="font-semibold text-[#37322f] mb-3">Add Fields</h3>
        <div className="relative">
          <svg 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#37322f]/40" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search fields..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-[#37322f]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
          />
        </div>
      </div>

      {/* Field Categories */}
      <div className="flex-1 overflow-y-auto p-2">
        {fieldsByCategory.map(category => (
          category.fields.length > 0 && (
            <div key={category.id} className="mb-2">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between px-2 py-2 text-sm font-medium text-[#37322f]/70 hover:text-[#37322f] hover:bg-[#37322f]/5 rounded-lg transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span>{category.icon}</span>
                  <span>{category.label}</span>
                </span>
                <svg 
                  className={`w-4 h-4 transition-transform ${
                    expandedCategories.has(category.id) ? 'rotate-180' : ''
                  }`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Category Fields */}
              {expandedCategories.has(category.id) && (
                <div className="mt-1 space-y-1 ml-2">
                  {category.fields.map(field => (
                    <FieldTypeButton 
                      key={field.type}
                      field={field}
                      onClick={() => onAddField(field.type)}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        ))}

        {/* No results */}
        {searchTerm && fieldsByCategory.every(c => c.fields.length === 0) && (
          <div className="px-4 py-8 text-center text-[#37322f]/50">
            <p className="text-sm">No fields match "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Field Type Button
// ============================================================================

interface FieldTypeButtonProps {
  field: FieldTypeDefinition
  onClick: () => void
}

function FieldTypeButton({ field, onClick }: FieldTypeButtonProps) {
  return (
    <button
      onClick={onClick}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('fieldType', field.type)
        e.dataTransfer.effectAllowed = 'copy'
      }}
      className="w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg border border-transparent hover:border-[#37322f]/20 hover:bg-[#37322f]/5 transition-all group cursor-grab active:cursor-grabbing"
    >
      <span className="text-lg group-hover:scale-110 transition-transform">
        {field.icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#37322f] truncate">
          {field.label}
        </p>
        <p className="text-xs text-[#37322f]/50 truncate">
          {field.description}
        </p>
      </div>
      <svg 
        className="w-4 h-4 text-[#37322f]/30 opacity-0 group-hover:opacity-100 transition-opacity" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    </button>
  )
}

// ============================================================================
// Quick Add Bar (alternative compact view)
// ============================================================================

interface QuickAddBarProps {
  onAddField: (type: FieldType) => void
}

export function QuickAddBar({ onAddField }: QuickAddBarProps) {
  const quickFields: FieldType[] = [
    'short_text',
    'long_text',
    'email',
    'dropdown',
    'single_choice',
    'signature',
    'section_header'
  ]

  return (
    <div className="flex items-center gap-1 p-2 bg-[#37322f]/5 rounded-lg overflow-x-auto">
      <span className="text-xs text-[#37322f]/50 px-2 whitespace-nowrap">Quick add:</span>
      {quickFields.map(type => {
        const field = FIELD_TYPES.find(f => f.type === type)!
        return (
          <button
            key={type}
            onClick={() => onAddField(type)}
            className="flex items-center gap-1.5 px-2 py-1.5 text-xs bg-white border border-[#37322f]/20 rounded-lg hover:bg-[#37322f]/5 transition-colors whitespace-nowrap"
            title={field.label}
          >
            <span>{field.icon}</span>
            <span className="hidden sm:inline">{field.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default FieldPalette
