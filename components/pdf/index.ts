// PDF Components - Export all PDF-related components and utilities

// Components
export { PDFViewer } from './PDFViewer'
export { PDFSignaturePad } from './PDFSignaturePad'
export { PDFDocumentEditor } from './PDFDocumentEditor'

// Re-export types from service
export type {
  SignaturePosition,
  SignatureData,
  PDFFieldConfig,
  PDFInfo
} from '@/lib/pdf-service'

// Re-export service
export { pdfService, PDFService } from '@/lib/pdf-service'

// Re-export backend API
export { backendAPI, BackendAPIClient } from '@/lib/backend-api'
export { backendConfig, API_ENDPOINTS } from '@/lib/backend-config'
