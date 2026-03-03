'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { 
  Pen, 
  Type, 
  Upload, 
  X, 
  Check, 
  Trash2,
  RotateCcw,
  Shield,
  Loader2
} from 'lucide-react'

// Output type for signature pad (basic signature without position/signer info)
export interface SignaturePadOutput {
  type: 'draw' | 'text' | 'image' | 'certificate'
  data: string // base64 for draw/image, text for text, certificate ID
  timestamp: Date
}

interface PDFSignaturePadProps {
  /** Called when signature is completed */
  onSignatureComplete: (signature: SignaturePadOutput) => void
  /** Called when modal is closed */
  onClose: () => void
  /** Signer name */
  signerName: string
  /** Signer email */
  signerEmail: string
  /** Show certificate signing option */
  showCertificateOption?: boolean
  /** Available certificates (for certificate signing) */
  certificates?: { id: string; name: string; validTo: string }[]
  /** Loading state for certificate signing */
  isSigningWithCertificate?: boolean
}

export function PDFSignaturePad({
  onSignatureComplete,
  onClose,
  signerName,
  signerEmail,
  showCertificateOption = false,
  certificates = [],
  isSigningWithCertificate = false
}: PDFSignaturePadProps) {
  const [activeTab, setActiveTab] = useState<'draw' | 'type' | 'upload' | 'certificate'>('draw')
  const [typedSignature, setTypedSignature] = useState(signerName)
  const [selectedFont, setSelectedFont] = useState('cursive')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = 400
    canvas.height = 150

    // Configure drawing style
    ctx.strokeStyle = '#1a365d'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // Fill with white background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  // Drawing handlers
  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    setIsDrawing(true)
    setHasDrawn(true)

    const rect = canvas.getBoundingClientRect()
    const x = 'touches' in e 
      ? e.touches[0].clientX - rect.left 
      : e.clientX - rect.left
    const y = 'touches' in e 
      ? e.touches[0].clientY - rect.top 
      : e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
  }, [])

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = 'touches' in e 
      ? e.touches[0].clientX - rect.left 
      : e.clientX - rect.left
    const y = 'touches' in e 
      ? e.touches[0].clientY - rect.top 
      : e.clientY - rect.top

    ctx.lineTo(x, y)
    ctx.stroke()
  }, [isDrawing])

  const stopDrawing = useCallback(() => {
    setIsDrawing(false)
  }, [])

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setHasDrawn(false)
  }

  // Get canvas data as base64
  const getCanvasData = (): string | null => {
    const canvas = canvasRef.current
    if (!canvas || !hasDrawn) return null
    return canvas.toDataURL('image/png')
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Generate typed signature as image
  const generateTypedSignature = (): string => {
    const canvas = document.createElement('canvas')
    canvas.width = 400
    canvas.height = 100
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#1a365d'
    ctx.font = selectedFont === 'cursive' 
      ? 'italic 36px "Brush Script MT", cursive'
      : selectedFont === 'serif'
      ? 'italic 32px Georgia, serif'
      : '32px Arial, sans-serif'
    ctx.textBaseline = 'middle'
    ctx.fillText(typedSignature, 20, 50)

    return canvas.toDataURL('image/png')
  }

  // Handle signature completion
  const handleComplete = () => {
    let signatureData: SignaturePadOutput | null = null

    switch (activeTab) {
      case 'draw':
        const drawData = getCanvasData()
        if (!drawData) {
          alert('Please draw your signature')
          return
        }
        signatureData = {
          type: 'draw',
          data: drawData,
          timestamp: new Date()
        }
        break

      case 'type':
        if (!typedSignature.trim()) {
          alert('Please enter your signature')
          return
        }
        signatureData = {
          type: 'text',
          data: generateTypedSignature(),
          timestamp: new Date()
        }
        break

      case 'upload':
        if (!uploadedImage) {
          alert('Please upload a signature image')
          return
        }
        signatureData = {
          type: 'image',
          data: uploadedImage,
          timestamp: new Date()
        }
        break

      case 'certificate':
        if (!selectedCertificate) {
          alert('Please select a certificate')
          return
        }
        signatureData = {
          type: 'certificate',
          data: selectedCertificate,
          timestamp: new Date()
        }
        break
    }

    if (signatureData) {
      onSignatureComplete(signatureData)
    }
  }

  const fonts = [
    { id: 'cursive', name: 'Cursive', preview: 'Brush Script MT' },
    { id: 'serif', name: 'Serif', preview: 'Georgia' },
    { id: 'sans', name: 'Sans-serif', preview: 'Arial' },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Add Your Signature</h2>
            <p className="text-sm text-gray-500">{signerName} ({signerEmail})</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('draw')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === 'draw'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Pen size={16} />
            Draw
          </button>
          <button
            onClick={() => setActiveTab('type')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === 'type'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Type size={16} />
            Type
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === 'upload'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Upload size={16} />
            Upload
          </button>
          {showCertificateOption && (
            <button
              onClick={() => setActiveTab('certificate')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition ${
                activeTab === 'certificate'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Shield size={16} />
              Certificate
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Draw Tab */}
          {activeTab === 'draw' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Draw your signature in the box below</p>
              
              <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-[150px] cursor-crosshair touch-none"
                  style={{ touchAction: 'none' }}
                />
                
                {/* Signature line */}
                <div className="absolute bottom-8 left-4 right-4 border-b border-gray-300" />
                
                {/* Clear button */}
                {hasDrawn && (
                  <button
                    onClick={clearCanvas}
                    className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg transition"
                    title="Clear"
                  >
                    <RotateCcw size={16} />
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-400 text-center">
                Use your mouse or finger to draw your signature
              </p>
            </div>
          )}

          {/* Type Tab */}
          {activeTab === 'type' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Type your signature</p>
              
              <input
                type="text"
                value={typedSignature}
                onChange={(e) => setTypedSignature(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />

              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-medium">Choose a style:</p>
                <div className="grid grid-cols-3 gap-2">
                  {fonts.map((font) => (
                    <button
                      key={font.id}
                      onClick={() => setSelectedFont(font.id)}
                      className={`p-3 border-2 rounded-lg transition ${
                        selectedFont === font.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span
                        className="text-lg text-gray-800"
                        style={{
                          fontFamily: font.id === 'cursive' 
                            ? '"Brush Script MT", cursive'
                            : font.id === 'serif'
                            ? 'Georgia, serif'
                            : 'Arial, sans-serif',
                          fontStyle: font.id !== 'sans' ? 'italic' : 'normal'
                        }}
                      >
                        {typedSignature || 'Preview'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <p className="text-xs text-gray-500 mb-2">Preview:</p>
                <p
                  className="text-3xl text-gray-800"
                  style={{
                    fontFamily: selectedFont === 'cursive' 
                      ? '"Brush Script MT", cursive'
                      : selectedFont === 'serif'
                      ? 'Georgia, serif'
                      : 'Arial, sans-serif',
                    fontStyle: selectedFont !== 'sans' ? 'italic' : 'normal'
                  }}
                >
                  {typedSignature || 'Your signature'}
                </p>
              </div>
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Upload an image of your signature</p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {uploadedImage ? (
                <div className="relative border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <img
                    src={uploadedImage}
                    alt="Uploaded signature"
                    className="max-h-32 mx-auto"
                  />
                  <button
                    onClick={() => {
                      setUploadedImage(null)
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-white hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg border border-gray-200 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 hover:bg-indigo-50/50 transition"
                >
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 font-medium">Click to upload</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                </button>
              )}
            </div>
          )}

          {/* Certificate Tab */}
          {activeTab === 'certificate' && showCertificateOption && (
            <div className="space-y-4">
              <div className="p-3 bg-indigo-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-indigo-900">Digital Certificate Signing</p>
                    <p className="text-xs text-indigo-700 mt-1">
                      Sign with a cryptographic certificate for legally binding signatures
                    </p>
                  </div>
                </div>
              </div>

              {certificates.length > 0 ? (
                <div className="space-y-2">
                  {certificates.map((cert) => (
                    <button
                      key={cert.id}
                      onClick={() => setSelectedCertificate(cert.id)}
                      disabled={isSigningWithCertificate}
                      className={`w-full p-4 border-2 rounded-lg text-left transition ${
                        selectedCertificate === cert.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${isSigningWithCertificate ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-indigo-600" />
                        <div>
                          <p className="font-medium text-gray-900">{cert.name}</p>
                          <p className="text-xs text-gray-500">
                            Valid until: {new Date(cert.validTo).toLocaleDateString()}
                          </p>
                        </div>
                        {selectedCertificate === cert.id && (
                          <Check className="w-5 h-5 text-indigo-600 ml-auto" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Shield className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm">No certificates available</p>
                  <p className="text-xs mt-1">Upload a certificate in your account settings</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500">
            By signing, you agree to the terms of service
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleComplete}
              disabled={isSigningWithCertificate}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {isSigningWithCertificate ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Apply Signature
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PDFSignaturePad
