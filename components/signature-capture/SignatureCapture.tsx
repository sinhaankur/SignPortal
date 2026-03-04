'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Pen, Type, Upload, Check, RotateCcw, Download } from 'lucide-react'

// ============================================================================
// Types
// ============================================================================

export type SignatureMode = 'draw' | 'type' | 'upload'

export interface SignatureData {
  type: SignatureMode
  data: string // Base64 image data
  fontFamily?: string // For typed signatures
  text?: string // Original typed text
}

interface SignatureCaptureProps {
  onSave: (signature: SignatureData) => void
  onCancel: () => void
  signerName?: string
  width?: number
  height?: number
}

// ============================================================================
// Font Options for Typed Signatures
// ============================================================================

const SIGNATURE_FONTS = [
  { name: 'Brush Script', family: "'Brush Script MT', cursive" },
  { name: 'Lucida Handwriting', family: "'Lucida Handwriting', cursive" },
  { name: 'Segoe Script', family: "'Segoe Script', cursive" },
  { name: 'Comic Sans', family: "'Comic Sans MS', cursive" },
  { name: 'Pacifico', family: "'Pacifico', cursive" },
  { name: 'Dancing Script', family: "'Dancing Script', cursive" },
]

// ============================================================================
// Main Component
// ============================================================================

export default function SignatureCapture({
  onSave,
  onCancel,
  signerName = '',
  width = 500,
  height = 200,
}: SignatureCaptureProps) {
  const [mode, setMode] = useState<SignatureMode>('draw')
  const [typedText, setTypedText] = useState(signerName)
  const [selectedFont, setSelectedFont] = useState(SIGNATURE_FONTS[0])
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ============================================================================
  // Canvas Setup
  // ============================================================================

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas size with device pixel ratio for crisp drawing
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const context = canvas.getContext('2d')
    if (!context) return

    context.scale(dpr, dpr)
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.strokeStyle = '#1a1a1a'
    context.lineWidth = 2.5
    contextRef.current = context

    // Fill with white background
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, width, height)
  }, [width, height])

  // ============================================================================
  // Drawing Functions
  // ============================================================================

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (mode !== 'draw') return
    
    const canvas = canvasRef.current
    const context = contextRef.current
    if (!canvas || !context) return

    setIsDrawing(true)
    
    const rect = canvas.getBoundingClientRect()
    let x, y
    
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }

    context.beginPath()
    context.moveTo(x, y)
  }, [mode])

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || mode !== 'draw') return
    
    const canvas = canvasRef.current
    const context = contextRef.current
    if (!canvas || !context) return

    const rect = canvas.getBoundingClientRect()
    let x, y
    
    if ('touches' in e) {
      e.preventDefault()
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }

    context.lineTo(x, y)
    context.stroke()
  }, [isDrawing, mode])

  const stopDrawing = useCallback(() => {
    setIsDrawing(false)
  }, [])

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const context = contextRef.current
    if (!canvas || !context) return

    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, width, height)
  }, [width, height])

  // ============================================================================
  // Type Mode - Render Text to Canvas
  // ============================================================================

  const renderTypedSignature = useCallback(() => {
    const canvas = canvasRef.current
    const context = contextRef.current
    if (!canvas || !context || !typedText) return

    // Clear canvas
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, width, height)

    // Draw text
    context.fillStyle = '#1a1a1a'
    context.font = `48px ${selectedFont.family}`
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    
    // Fit text to canvas
    const maxWidth = width - 40
    let fontSize = 48
    context.font = `${fontSize}px ${selectedFont.family}`
    
    while (context.measureText(typedText).width > maxWidth && fontSize > 20) {
      fontSize -= 2
      context.font = `${fontSize}px ${selectedFont.family}`
    }

    context.fillText(typedText, width / 2, height / 2)
  }, [typedText, selectedFont, width, height])

  useEffect(() => {
    if (mode === 'type') {
      renderTypedSignature()
    }
  }, [mode, typedText, selectedFont, renderTypedSignature])

  // ============================================================================
  // Upload Mode
  // ============================================================================

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        const context = contextRef.current
        if (!canvas || !context) return

        // Clear canvas
        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, width, height)

        // Calculate aspect ratio
        const scale = Math.min(
          (width - 40) / img.width,
          (height - 40) / img.height
        )
        const x = (width - img.width * scale) / 2
        const y = (height - img.height * scale) / 2

        context.drawImage(img, x, y, img.width * scale, img.height * scale)
        setUploadedImage(event.target?.result as string)
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  // ============================================================================
  // Save Signature
  // ============================================================================

  const handleSave = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dataUrl = canvas.toDataURL('image/png')
    
    const signatureData: SignatureData = {
      type: mode,
      data: dataUrl,
    }

    if (mode === 'type') {
      signatureData.fontFamily = selectedFont.family
      signatureData.text = typedText
    }

    onSave(signatureData)
  }

  // ============================================================================
  // Mode Change Handler
  // ============================================================================

  const handleModeChange = (newMode: SignatureMode) => {
    setMode(newMode)
    clearCanvas()
    setUploadedImage(null)
    
    if (newMode === 'type') {
      renderTypedSignature()
    }
  }

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#37322f]">Add Your Signature</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => handleModeChange('draw')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              mode === 'draw'
                ? 'text-[#37322f] border-b-2 border-[#37322f] bg-[#37322f]/5'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Pen className="w-4 h-4" />
            Draw
          </button>
          <button
            onClick={() => handleModeChange('type')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              mode === 'type'
                ? 'text-[#37322f] border-b-2 border-[#37322f] bg-[#37322f]/5'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Type className="w-4 h-4" />
            Type
          </button>
          <button
            onClick={() => handleModeChange('upload')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              mode === 'upload'
                ? 'text-[#37322f] border-b-2 border-[#37322f] bg-[#37322f]/5'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
        </div>

        {/* Canvas Area */}
        <div className="p-6">
          {/* Type Mode Input */}
          {mode === 'type' && (
            <div className="mb-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={typedText}
                  onChange={(e) => setTypedText(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#37322f]/20 focus:border-[#37322f] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SIGNATURE_FONTS.map((font) => (
                    <button
                      key={font.name}
                      onClick={() => setSelectedFont(font)}
                      className={`px-4 py-3 text-lg border rounded-lg transition-all ${
                        selectedFont.name === font.name
                          ? 'border-[#37322f] bg-[#37322f]/5 ring-2 ring-[#37322f]/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ fontFamily: font.family }}
                    >
                      {typedText || 'Your Name'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Upload Mode Input */}
          {mode === 'upload' && (
            <div className="mb-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#37322f] hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Click to upload your signature image
                  </span>
                  <span className="text-xs text-gray-400">
                    PNG, JPG, or GIF (max 5MB)
                  </span>
                </div>
              </button>
            </div>
          )}

          {/* Canvas */}
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
              className={`w-full ${mode === 'draw' ? 'cursor-crosshair' : 'cursor-default'}`}
              style={{ touchAction: 'none' }}
            />
            
            {/* Signature Line */}
            <div className="absolute bottom-8 left-8 right-8 border-b border-gray-300" />
            <span className="absolute bottom-2 left-8 text-xs text-gray-400">
              Sign above this line
            </span>
          </div>

          {/* Draw Mode Instructions */}
          {mode === 'draw' && (
            <p className="text-sm text-gray-500 mt-2 text-center">
              Use your mouse or finger to draw your signature
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={clearCanvas}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Clear
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={mode === 'type' && !typedText}
              className="flex items-center gap-2 px-6 py-2 bg-[#37322f] text-white rounded-lg hover:bg-[#4a433f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
              Apply Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Preview Component
// ============================================================================

interface SignaturePreviewProps {
  signature: SignatureData
  width?: number
  height?: number
  className?: string
}

export function SignaturePreview({
  signature,
  width = 200,
  height = 80,
  className = '',
}: SignaturePreviewProps) {
  return (
    <div
      className={`relative border border-gray-200 rounded bg-white overflow-hidden ${className}`}
      style={{ width, height }}
    >
      <img
        src={signature.data}
        alt="Signature"
        className="w-full h-full object-contain"
      />
    </div>
  )
}
