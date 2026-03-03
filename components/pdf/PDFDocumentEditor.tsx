'use client'

import { useState, useCallback } from 'react'
import { 
  Save, 
  Send, 
  Plus, 
  Users, 
  FileText, 
  Shield,
  AlertCircle,
  Check,
  Loader2,
  Eye,
  Edit3,
  Calendar,
  Mail,
  Clock
} from 'lucide-react'
import { PDFViewer } from './PDFViewer'
import { PDFSignaturePad, type SignaturePadOutput } from './PDFSignaturePad'
import { pdfService, type PDFFieldConfig, type SignatureData, type SignaturePosition } from '@/lib/pdf-service'

// Types
interface SignerInfo {
  id: string
  name: string
  email: string
  role: 'signer' | 'approver' | 'viewer'
  order: number
  status: 'pending' | 'signed' | 'declined'
  signedAt?: string
}

interface SignatureField {
  id: string
  type: 'signature' | 'initials' | 'date' | 'text'
  page: number
  x: number
  y: number
  width: number
  height: number
  assignedTo: string // signer id
  value?: string // filled value
  required: boolean
}

interface PDFDocumentEditorProps {
  /** PDF source */
  src: string | File
  /** Document name */
  documentName: string
  /** Signers list */
  signers?: SignerInfo[]
  /** Existing signature fields */
  fields?: SignatureField[]
  /** Current user (for signing) */
  currentUser?: { id: string; name: string; email: string }
  /** Mode: edit (add fields) or sign (fill fields) */
  mode?: 'edit' | 'sign' | 'view'
  /** Called when document is saved */
  onSave?: (pdfBytes: Uint8Array, fields: SignatureField[]) => void
  /** Called when document is sent for signing */
  onSend?: (signers: SignerInfo[], fields: SignatureField[]) => void
  /** Called when signature is applied */
  onSign?: (field: SignatureField, signatureData: SignatureData) => void
}

export function PDFDocumentEditor({
  src,
  documentName,
  signers = [],
  fields: initialFields = [],
  currentUser,
  mode = 'edit',
  onSave,
  onSend,
  onSign
}: PDFDocumentEditorProps) {
  const [fields, setFields] = useState<SignatureField[]>(initialFields)
  const [selectedField, setSelectedField] = useState<SignatureField | null>(null)
  const [showSignatureModal, setShowSignatureModal] = useState(false)
  const [activeSignerId, setActiveSignerId] = useState<string>(signers[0]?.id || '')
  const [isPlacingField, setIsPlacingField] = useState(false)
  const [fieldTypeToPlace, setFieldTypeToPlace] = useState<'signature' | 'initials' | 'date' | 'text'>('signature')
  const [isSaving, setIsSaving] = useState(false)
  const [pdfLoaded, setPdfLoaded] = useState(false)
  const [pageCount, setPageCount] = useState(0)
  const [signatureData, setSignatureData] = useState<SignatureData | null>(null)

  // Handle PDF load
  const handlePdfLoad = useCallback((pages: number) => {
    setPageCount(pages)
    setPdfLoaded(true)
  }, [])

  // Handle field placement from viewer
  const handleSignatureAreaSelect = useCallback((area: { page: number; x: number; y: number; width: number; height: number }) => {
    if (!isPlacingField || !activeSignerId) return

    const newField: SignatureField = {
      id: `field-${Date.now()}`,
      type: fieldTypeToPlace,
      page: area.page,
      x: area.x,
      y: area.y,
      width: area.width,
      height: area.height,
      assignedTo: activeSignerId,
      required: true
    }

    setFields(prev => [...prev, newField])
    setIsPlacingField(false)
  }, [isPlacingField, fieldTypeToPlace, activeSignerId])

  // Start placing a field
  const startPlacingField = (type: 'signature' | 'initials' | 'date' | 'text') => {
    if (!activeSignerId) {
      alert('Please select a signer first')
      return
    }
    setFieldTypeToPlace(type)
    setIsPlacingField(true)
  }

  // Remove a field
  const removeField = (fieldId: string) => {
    setFields(prev => prev.filter(f => f.id !== fieldId))
    setSelectedField(null)
  }

  // Handle clicking a signature field (for signing mode)
  const handleFieldClick = (field: SignatureField) => {
    if (mode !== 'sign') {
      setSelectedField(field)
      return
    }

    // Check if this field belongs to current user
    if (currentUser && field.assignedTo === currentUser.id && !field.value) {
      setSelectedField(field)
      setShowSignatureModal(true)
    }
  }

  // Handle signature completion
  const handleSignatureComplete = async (signature: SignaturePadOutput) => {
    if (!selectedField) return

    setSignatureData(signature as SignatureData)

    // Update field with signature
    setFields(prev => prev.map(f => 
      f.id === selectedField.id 
        ? { ...f, value: signature.data }
        : f
    ))

    // Call onSign callback
    if (onSign && currentUser) {
      const signaturePosition: SignaturePosition = {
        x: selectedField.x,
        y: selectedField.y,
        width: selectedField.width,
        height: selectedField.height,
        page: selectedField.page
      }

      const fullSignatureData: SignatureData = {
        ...signature,
        signerName: currentUser.name,
        signerEmail: currentUser.email,
        position: signaturePosition
      }

      onSign(selectedField, fullSignatureData)
    }

    setShowSignatureModal(false)
    setSelectedField(null)
  }

  // Save document with fields
  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Load PDF and add signature fields
      if (typeof src === 'string') {
        await pdfService.loadPDF(src)
      } else {
        await pdfService.loadPDFFromFile(src)
      }

      // Add fields to PDF
      const fieldConfigs: PDFFieldConfig[] = fields.map(f => ({
        type: f.type,
        name: f.id,
        page: f.page - 1, // 0-indexed
        x: f.x,
        y: f.y,
        width: f.width,
        height: f.height,
        required: f.required,
        assignedTo: f.assignedTo
      }))

      const pdfBytes = await pdfService.addSignatureFields(fieldConfigs)
      onSave?.(pdfBytes, fields)
    } catch (error) {
      console.error('Failed to save:', error)
      alert('Failed to save document')
    }
    setIsSaving(false)
  }

  // Send for signing
  const handleSend = () => {
    if (signers.length === 0) {
      alert('Please add at least one signer')
      return
    }

    if (fields.length === 0) {
      alert('Please add at least one signature field')
      return
    }

    // Check all signers have at least one field
    const assignedSigners = new Set(fields.map(f => f.assignedTo))
    const unassignedSigners = signers.filter(s => !assignedSigners.has(s.id))
    
    if (unassignedSigners.length > 0) {
      alert(`The following signers don't have any fields assigned: ${unassignedSigners.map(s => s.name).join(', ')}`)
      return
    }

    onSend?.(signers, fields)
  }

  // Get field color based on signer
  const getFieldColor = (signerId: string) => {
    const signerIndex = signers.findIndex(s => s.id === signerId)
    const colors = [
      'border-blue-500 bg-blue-100/50',
      'border-green-500 bg-green-100/50',
      'border-purple-500 bg-purple-100/50',
      'border-orange-500 bg-orange-100/50',
      'border-pink-500 bg-pink-100/50',
    ]
    return colors[signerIndex % colors.length] || colors[0]
  }

  // Render field overlay
  const renderFieldOverlay = (field: SignatureField) => {
    const signer = signers.find(s => s.id === field.assignedTo)
    const isCurrentUserField = currentUser && field.assignedTo === currentUser.id
    const canSign = mode === 'sign' && isCurrentUserField && !field.value

    return (
      <div
        key={field.id}
        onClick={() => handleFieldClick(field)}
        className={`absolute border-2 rounded cursor-pointer transition-all ${
          field.value 
            ? 'border-green-500 bg-green-50/50' 
            : getFieldColor(field.assignedTo)
        } ${
          canSign ? 'hover:shadow-lg hover:scale-[1.02] animate-pulse' : ''
        } ${
          selectedField?.id === field.id ? 'ring-2 ring-indigo-500' : ''
        }`}
        style={{
          left: field.x,
          top: field.y,
          width: field.width,
          height: field.height,
        }}
      >
        {field.value ? (
          // Show signature
          <img 
            src={field.value} 
            alt="Signature" 
            className="w-full h-full object-contain p-1"
          />
        ) : (
          // Show placeholder
          <div className="flex flex-col items-center justify-center h-full p-2">
            <span className="text-xs font-medium text-gray-600 truncate w-full text-center">
              {field.type === 'signature' ? '✍️ Signature' : 
               field.type === 'initials' ? '📝 Initials' :
               field.type === 'date' ? '📅 Date' : '📄 Text'}
            </span>
            <span className="text-[10px] text-gray-400 truncate w-full text-center">
              {signer?.name || 'Unassigned'}
            </span>
          </div>
        )}

        {/* Remove button in edit mode */}
        {mode === 'edit' && !field.value && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              removeField(field.id)
            }}
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition"
          >
            ×
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-full bg-gray-50">
      {/* Main Content - PDF Viewer */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-500" />
            <div>
              <h1 className="font-semibold text-gray-900">{documentName}</h1>
              <p className="text-xs text-gray-500">{pageCount} pages</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {mode === 'edit' && (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save
                </button>
                <button
                  onClick={handleSend}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  <Send className="w-4 h-4" />
                  Send for Signing
                </button>
              </>
            )}
          </div>
        </div>

        {/* Placement mode indicator */}
        {isPlacingField && (
          <div className="px-4 py-2 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              <span className="text-sm text-indigo-700 font-medium">
                Click and drag to place a {fieldTypeToPlace} field
              </span>
            </div>
            <button
              onClick={() => setIsPlacingField(false)}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Cancel
            </button>
          </div>
        )}

        {/* PDF Viewer with overlays */}
        <div className="flex-1 overflow-hidden">
          <PDFViewer
            src={src}
            onLoad={handlePdfLoad}
            signatureMode={isPlacingField}
            onSignatureAreaSelect={handleSignatureAreaSelect}
            height="100%"
            overlays={fields.map(field => ({
              page: field.page,
              x: field.x,
              y: field.y,
              width: field.width,
              height: field.height,
              component: renderFieldOverlay(field)
            }))}
          />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
        {mode === 'edit' ? (
          <>
            {/* Signers Section */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Signers ({signers.length})
              </h3>
              
              <div className="mt-3 space-y-2">
                {signers.map((signer, index) => (
                  <button
                    key={signer.id}
                    onClick={() => setActiveSignerId(signer.id)}
                    className={`w-full p-3 rounded-lg text-left transition ${
                      activeSignerId === signer.id
                        ? 'bg-indigo-50 border-2 border-indigo-500'
                        : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                        ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'][index % 5]
                      }`}>
                        {signer.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{signer.name}</p>
                        <p className="text-xs text-gray-500 truncate">{signer.email}</p>
                      </div>
                      <span className="text-xs text-gray-400">#{signer.order}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Field Types */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Add Fields</h3>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => startPlacingField('signature')}
                  disabled={!activeSignerId}
                  className="flex flex-col items-center gap-2 p-3 bg-gray-50 hover:bg-indigo-50 rounded-lg border-2 border-transparent hover:border-indigo-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Edit3 className="w-5 h-5 text-gray-600" />
                  <span className="text-xs font-medium text-gray-700">Signature</span>
                </button>
                
                <button
                  onClick={() => startPlacingField('initials')}
                  disabled={!activeSignerId}
                  className="flex flex-col items-center gap-2 p-3 bg-gray-50 hover:bg-indigo-50 rounded-lg border-2 border-transparent hover:border-indigo-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="w-5 h-5 text-lg text-gray-600 font-serif">AB</span>
                  <span className="text-xs font-medium text-gray-700">Initials</span>
                </button>
                
                <button
                  onClick={() => startPlacingField('date')}
                  disabled={!activeSignerId}
                  className="flex flex-col items-center gap-2 p-3 bg-gray-50 hover:bg-indigo-50 rounded-lg border-2 border-transparent hover:border-indigo-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span className="text-xs font-medium text-gray-700">Date</span>
                </button>
                
                <button
                  onClick={() => startPlacingField('text')}
                  disabled={!activeSignerId}
                  className="flex flex-col items-center gap-2 p-3 bg-gray-50 hover:bg-indigo-50 rounded-lg border-2 border-transparent hover:border-indigo-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText className="w-5 h-5 text-gray-600" />
                  <span className="text-xs font-medium text-gray-700">Text</span>
                </button>
              </div>
            </div>

            {/* Fields List */}
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Fields ({fields.length})
              </h3>
              
              {fields.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Edit3 className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm">No fields added yet</p>
                  <p className="text-xs text-gray-400 mt-1">Select a signer and add signature fields</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {fields.map((field) => {
                    const signer = signers.find(s => s.id === field.assignedTo)
                    return (
                      <div
                        key={field.id}
                        onClick={() => setSelectedField(field)}
                        className={`p-3 rounded-lg border cursor-pointer transition ${
                          selectedField?.id === field.id
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900 capitalize">{field.type}</p>
                            <p className="text-xs text-gray-500">
                              Page {field.page} • {signer?.name || 'Unassigned'}
                            </p>
                          </div>
                          {field.value ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Clock className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Sign/View Mode Sidebar */
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Signature Progress</h3>
            
            <div className="space-y-3">
              {signers.map((signer) => {
                const signerFields = fields.filter(f => f.assignedTo === signer.id)
                const signedFields = signerFields.filter(f => f.value)
                const progress = signerFields.length > 0 
                  ? Math.round((signedFields.length / signerFields.length) * 100) 
                  : 0

                return (
                  <div key={signer.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium">
                        {signer.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{signer.name}</p>
                        <p className="text-xs text-gray-500 truncate">{signer.email}</p>
                      </div>
                      {signer.status === 'signed' ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : signer.status === 'declined' ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : null}
                    </div>
                    
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {signedFields.length} of {signerFields.length} fields signed
                    </p>
                  </div>
                )
              })}
            </div>

            {currentUser && mode === 'sign' && (
              <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                <h4 className="font-medium text-indigo-900 mb-2">Your Turn to Sign</h4>
                <p className="text-sm text-indigo-700">
                  Click on the highlighted fields to add your signature.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Signature Modal */}
      {showSignatureModal && currentUser && (
        <PDFSignaturePad
          signerName={currentUser.name}
          signerEmail={currentUser.email}
          onSignatureComplete={handleSignatureComplete}
          onClose={() => {
            setShowSignatureModal(false)
            setSelectedField(null)
          }}
          showCertificateOption={true}
          certificates={[]}
        />
      )}
    </div>
  )
}

export default PDFDocumentEditor
