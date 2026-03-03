// ============================================================================
// SignPortal - Form Builder Types
// Document/Form creation similar to Google Forms
// ============================================================================

export type FieldType = 
  | 'short_text'
  | 'long_text'
  | 'email'
  | 'phone'
  | 'number'
  | 'date'
  | 'time'
  | 'dropdown'
  | 'single_choice'
  | 'multiple_choice'
  | 'checkbox'
  | 'file_upload'
  | 'signature'
  | 'initials'
  | 'section_header'
  | 'paragraph'
  | 'page_break'

export interface FieldOption {
  id: string
  label: string
  value: string
}

export interface FieldValidation {
  required: boolean
  minLength?: number
  maxLength?: number
  minValue?: number
  maxValue?: number
  pattern?: string
  customMessage?: string
}

export interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  helpText?: string
  options?: FieldOption[]
  validation: FieldValidation
  defaultValue?: string | string[] | boolean
  width?: 'full' | 'half' | 'third'
  conditional?: {
    fieldId: string
    operator: 'equals' | 'not_equals' | 'contains' | 'not_contains'
    value: string
  }
}

export interface FormSection {
  id: string
  title?: string
  description?: string
  fields: FormField[]
}

export interface FormTheme {
  primaryColor: string
  backgroundColor: string
  fontFamily: string
  headerImage?: string
  logo?: string
}

export interface SignerConfig {
  id: string
  role: string
  email?: string
  name?: string
  order: number
  requiredFields: string[] // Field IDs that this signer must complete
}

export interface FormDocument {
  id: string
  title: string
  description?: string
  sections: FormSection[]
  theme: FormTheme
  settings: FormSettings
  signers: SignerConfig[]
  status: 'draft' | 'published' | 'closed'
  createdAt: string
  updatedAt: string
  createdBy: string
  publishedUrl?: string
  responses: number
}

export interface FormSettings {
  allowMultipleSubmissions: boolean
  requireSignIn: boolean
  showProgressBar: boolean
  shuffleQuestions: boolean
  confirmationMessage: string
  description?: string
  redirectUrl?: string
  collectEmails: boolean
  notifyOnSubmit: boolean
  notifyEmails: string[]
  expiresAt?: string
  maxResponses?: number
}

export interface FormResponse {
  id: string
  formId: string
  respondent: {
    email?: string
    name?: string
    ip?: string
  }
  answers: Record<string, FormFieldResponse>
  signatures: Record<string, SignatureData>
  submittedAt: string
  status: 'pending' | 'completed' | 'rejected'
}

export interface FormFieldResponse {
  fieldId: string
  value: string | string[] | boolean | null
  timestamp: string
}

export interface SignatureData {
  fieldId: string
  signerId: string
  imageData: string // base64
  timestamp: string
  ip?: string
  userAgent?: string
}

// ============================================================================
// Field Type Definitions for UI
// ============================================================================

export interface FieldTypeDefinition {
  type: FieldType
  label: string
  icon: string
  category: 'basic' | 'contact' | 'choice' | 'signature' | 'layout'
  description: string
  hasOptions: boolean
  defaultValidation: FieldValidation
}

export const FIELD_TYPES: FieldTypeDefinition[] = [
  // Basic Fields
  {
    type: 'short_text',
    label: 'Short Answer',
    icon: 'type',
    category: 'basic',
    description: 'Single line text input',
    hasOptions: false,
    defaultValidation: { required: false }
  },
  {
    type: 'long_text',
    label: 'Paragraph',
    icon: 'align-left',
    category: 'basic',
    description: 'Multi-line text input',
    hasOptions: false,
    defaultValidation: { required: false }
  },
  {
    type: 'number',
    label: 'Number',
    icon: 'hash',
    category: 'basic',
    description: 'Numeric input',
    hasOptions: false,
    defaultValidation: { required: false }
  },
  {
    type: 'date',
    label: 'Date',
    icon: 'calendar',
    category: 'basic',
    description: 'Date picker',
    hasOptions: false,
    defaultValidation: { required: false }
  },
  {
    type: 'time',
    label: 'Time',
    icon: 'clock',
    category: 'basic',
    description: 'Time picker',
    hasOptions: false,
    defaultValidation: { required: false }
  },

  // Contact Fields
  {
    type: 'email',
    label: 'Email',
    icon: 'mail',
    category: 'contact',
    description: 'Email address input',
    hasOptions: false,
    defaultValidation: { required: false }
  },
  {
    type: 'phone',
    label: 'Phone',
    icon: 'phone',
    category: 'contact',
    description: 'Phone number input',
    hasOptions: false,
    defaultValidation: { required: false }
  },

  // Choice Fields
  {
    type: 'dropdown',
    label: 'Dropdown',
    icon: 'chevron-down',
    category: 'choice',
    description: 'Select from a list',
    hasOptions: true,
    defaultValidation: { required: false }
  },
  {
    type: 'single_choice',
    label: 'Multiple Choice',
    icon: 'circle-dot',
    category: 'choice',
    description: 'Select one option',
    hasOptions: true,
    defaultValidation: { required: false }
  },
  {
    type: 'multiple_choice',
    label: 'Checkboxes',
    icon: 'check-square',
    category: 'choice',
    description: 'Select multiple options',
    hasOptions: true,
    defaultValidation: { required: false }
  },
  {
    type: 'checkbox',
    label: 'Single Checkbox',
    icon: 'square-check',
    category: 'choice',
    description: 'Yes/No checkbox',
    hasOptions: false,
    defaultValidation: { required: false }
  },

  // Signature Fields
  {
    type: 'signature',
    label: 'Signature',
    icon: 'pen-tool',
    category: 'signature',
    description: 'Signature capture',
    hasOptions: false,
    defaultValidation: { required: true }
  },
  {
    type: 'initials',
    label: 'Initials',
    icon: 'pencil',
    category: 'signature',
    description: 'Initials capture',
    hasOptions: false,
    defaultValidation: { required: true }
  },
  {
    type: 'file_upload',
    label: 'File Upload',
    icon: 'upload',
    category: 'signature',
    description: 'Upload a file',
    hasOptions: false,
    defaultValidation: { required: false }
  },

  // Layout Fields
  {
    type: 'section_header',
    label: 'Section Header',
    icon: 'heading',
    category: 'layout',
    description: 'Section title',
    hasOptions: false,
    defaultValidation: { required: false }
  },
  {
    type: 'paragraph',
    label: 'Description',
    icon: 'file-text',
    category: 'layout',
    description: 'Descriptive text',
    hasOptions: false,
    defaultValidation: { required: false }
  },
  {
    type: 'page_break',
    label: 'Page Break',
    icon: 'split',
    category: 'layout',
    description: 'Split into pages',
    hasOptions: false,
    defaultValidation: { required: false }
  }
]

// ============================================================================
// Helper Functions
// ============================================================================

export function createField(type: FieldType): FormField {
  const fieldDef = FIELD_TYPES.find(f => f.type === type)
  
  return {
    id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    label: fieldDef?.label || 'Untitled Question',
    placeholder: '',
    helpText: '',
    options: fieldDef?.hasOptions ? [
      { id: 'opt_1', label: 'Option 1', value: 'option_1' },
      { id: 'opt_2', label: 'Option 2', value: 'option_2' },
      { id: 'opt_3', label: 'Option 3', value: 'option_3' }
    ] : undefined,
    validation: { ...fieldDef?.defaultValidation || { required: false } },
    width: 'full'
  }
}

export function createSection(): FormSection {
  return {
    id: `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: '',
    description: '',
    fields: []
  }
}

export function createFormDocument(title: string, createdBy: string): FormDocument {
  return {
    id: `form_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title,
    description: '',
    sections: [createSection()],
    theme: {
      primaryColor: '#37322f',
      backgroundColor: '#f7f5f3',
      fontFamily: 'Inter'
    },
    settings: {
      allowMultipleSubmissions: false,
      requireSignIn: false,
      showProgressBar: true,
      shuffleQuestions: false,
      confirmationMessage: 'Your response has been recorded.',
      collectEmails: false,
      notifyOnSubmit: true,
      notifyEmails: []
    },
    signers: [],
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy,
    responses: 0
  }
}

export function generateShareUrl(formId: string): string {
  return `${typeof window !== 'undefined' ? window.location.origin : ''}/forms/${formId}/respond`
}
