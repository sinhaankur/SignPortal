'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

interface FileUploadProps {
  onUploadComplete: (fileData: UploadedFile) => void
  documentName: string
  documentType: string
}

export interface UploadedFile {
  name: string
  type: string
  size: number
  uploadedAt: string
  uploadProgress: number
  status: 'uploading' | 'completed' | 'error'
  url?: string
}

export function FileUploadComponent({ onUploadComplete, documentName, documentType }: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const acceptedFormats = ['.pdf', '.doc', '.docx', '.xlsx', '.xls', '.ppt', '.pptx']
  const maxFileSize = 50 * 1024 * 1024 // 50MB

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)

    // Validate file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!acceptedFormats.includes(fileExtension)) {
      setError(`Invalid file type. Accepted formats: ${acceptedFormats.join(', ')}`)
      return
    }

    // Validate file size
    if (file.size > maxFileSize) {
      setError(`File size exceeds 50MB limit. Your file: ${(file.size / (1024 * 1024)).toFixed(2)}MB`)
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Upload to Supabase Storage
      const filePath = `${Date.now()}-${file.name}`
      const { data, error: uploadError } = await supabase.storage.from('documents').upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })
      if (uploadError) throw uploadError

      // Get public URL
      const { data: publicUrlData } = supabase.storage.from('documents').getPublicUrl(filePath)
      const publicUrl = publicUrlData?.publicUrl

      const uploadedFileData: UploadedFile = {
        name: file.name,
        type: fileExtension,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        uploadProgress: 100,
        status: 'completed',
        url: publicUrl
      }

      setUploadedFile(uploadedFileData)
      setIsUploading(false)
      onUploadComplete(uploadedFileData)
    } catch (err) {
      setError('Upload failed. Please try again.')
      setIsUploading(false)
      setUploadProgress(0)
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // simulateFileUpload removed (no longer needed)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      {!uploadedFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#37322f]/40 rounded-lg p-12 text-center cursor-pointer hover:border-[#37322f] hover:bg-[#37322f]/5 transition"
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept={acceptedFormats.join(',')}
            className="hidden"
            disabled={isUploading}
          />

          {isUploading ? (
            <div className="space-y-4">
              <div className="inline-block p-4 bg-[#37322f]/10 rounded-full">
                <Upload className="w-8 h-8 text-[#37322f] animate-pulse" />
              </div>
              <div>
                <h4 className="font-semibold text-[#37322f] mb-2">Uploading your document...</h4>
                <p className="text-[#37322f]/60 text-sm mb-4">{uploadProgress}% complete</p>
                <div className="w-full bg-[#37322f]/20 rounded-full h-2">
                  <div
                    className="bg-[#37322f] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="inline-block p-4 bg-[#37322f]/10 rounded-full">
                <Upload className="w-8 h-8 text-[#37322f]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#37322f] mb-1">Click to upload your document</h4>
                <p className="text-[#37322f]/60 text-sm">or drag and drop it here</p>
              </div>
              <p className="text-[#37322f]/50 text-xs mt-4">
                Supported formats: {acceptedFormats.join(', ')} • Max size: 50MB
              </p>
            </div>
          )}
        </div>
      ) : (
        // Uploaded File Preview
        <div className="bg-[#37322f]/5 border border-[#37322f]/20 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded border border-[#37322f]/20">
              <FileText className="w-6 h-6 text-[#37322f]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-[#37322f] truncate">{uploadedFile.name}</h4>
                  <p className="text-sm text-[#37322f]/60">
                    {formatFileSize(uploadedFile.size)} • Uploaded {new Date(uploadedFile.uploadedAt).toLocaleTimeString()}
                  </p>
                </div>
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setUploadedFile(null)
              setUploadProgress(0)
              setError(null)
            }}
            className="mt-4 text-sm text-[#37322f]/60 hover:text-[#37322f] font-semibold transition"
          >
            ✕ Replace with different file
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Additional Options */}
      {uploadedFile && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900 mb-3">
            <strong>Document uploaded successfully!</strong> Next, you can:
          </p>
          <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
            <li>Set up the signing workflow</li>
            <li>Specify signers and signing order</li>
            <li>Configure expiration and reminders</li>
          </ul>
        </div>
      )}
    </div>
  )
}
