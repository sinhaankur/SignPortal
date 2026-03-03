/**
 * Backend API Client
 * 
 * Client for connecting to the .NET backend API for advanced PDF operations.
 * Handles digital signatures, certificate management, and document processing.
 */

import { backendConfig, API_ENDPOINTS } from './backend-config'

// Types
export interface SignatureRequest {
  documentId: string
  documentBytes: string // base64
  certificateId: string
  signaturePosition: {
    page: number
    x: number
    y: number
    width: number
    height: number
  }
  reason?: string
  location?: string
  addTimestamp?: boolean
}

export interface SignatureResponse {
  success: boolean
  signedDocumentBytes?: string // base64
  signatureId?: string
  timestamp?: string
  error?: string
}

export interface CertificateInfo {
  id: string
  subject: string
  issuer: string
  validFrom: string
  validTo: string
  serialNumber: string
  thumbprint: string
  keyUsage: string[]
  isValid: boolean
  revocationStatus: 'good' | 'revoked' | 'unknown'
}

export interface VerificationResult {
  isValid: boolean
  signatures: {
    signerName: string
    signedAt: string
    isIntact: boolean
    isTrusted: boolean
    certificateInfo: CertificateInfo
    timestampInfo?: {
      time: string
      isValid: boolean
      tsaName: string
    }
  }[]
  errors: string[]
}

export interface AuditEvent {
  id: string
  documentId: string
  action: string
  userId: string
  userName: string
  timestamp: string
  ipAddress: string
  userAgent: string
  details: Record<string, any>
}

// API Client Class
class BackendAPIClient {
  private baseUrl: string
  private apiVersion: string
  private timeout: number
  private apiKey?: string

  constructor() {
    this.baseUrl = backendConfig.baseUrl
    this.apiVersion = backendConfig.apiVersion
    this.timeout = backendConfig.timeout
    this.apiKey = backendConfig.apiKey
  }

  /**
   * Make authenticated API request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/api/${this.apiVersion}${endpoint}`
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.apiKey && { 'X-API-Key': this.apiKey }),
      ...(options.headers || {}),
    }

    // Get auth token from localStorage if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken')
      if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
      }
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }))
        throw new Error(error.message || `API Error: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      if ((error as Error).name === 'AbortError') {
        throw new Error('Request timeout')
      }
      throw error
    }
  }

  // ==================== SIGNATURE OPERATIONS ====================

  /**
   * Sign a document with a digital certificate
   */
  async signDocument(request: SignatureRequest): Promise<SignatureResponse> {
    return this.request<SignatureResponse>('/signatures/sign', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  /**
   * Verify all signatures on a document
   */
  async verifyDocument(documentBytes: string): Promise<VerificationResult> {
    return this.request<VerificationResult>('/signatures/verify', {
      method: 'POST',
      body: JSON.stringify({ documentBytes }),
    })
  }

  /**
   * Add a signature field to the PDF
   */
  async addSignatureField(
    documentBytes: string,
    fieldConfig: {
      name: string
      page: number
      x: number
      y: number
      width: number
      height: number
      assignedTo?: string
    }
  ): Promise<{ documentBytes: string; fieldId: string }> {
    return this.request('/signatures/field', {
      method: 'POST',
      body: JSON.stringify({ documentBytes, ...fieldConfig }),
    })
  }

  // ==================== CERTIFICATE OPERATIONS ====================

  /**
   * List user's certificates
   */
  async listCertificates(): Promise<CertificateInfo[]> {
    return this.request<CertificateInfo[]>('/certificates', {
      method: 'GET',
    })
  }

  /**
   * Upload a new certificate
   */
  async uploadCertificate(
    certificateFile: string, // base64 PFX/P12
    password: string
  ): Promise<CertificateInfo> {
    return this.request<CertificateInfo>('/certificates/upload', {
      method: 'POST',
      body: JSON.stringify({ certificateFile, password }),
    })
  }

  /**
   * Validate a certificate
   */
  async validateCertificate(certificateId: string): Promise<{
    isValid: boolean
    errors: string[]
    warnings: string[]
  }> {
    return this.request(`/certificates/${certificateId}/validate`, {
      method: 'POST',
    })
  }

  // ==================== DOCUMENT OPERATIONS ====================

  /**
   * Upload a document for processing
   */
  async uploadDocument(
    file: File,
    metadata: { name: string; description?: string }
  ): Promise<{ documentId: string; pageCount: number }> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('metadata', JSON.stringify(metadata))

    const url = `${this.baseUrl}/api/${this.apiVersion}/documents/upload`
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        ...(this.apiKey && { 'X-API-Key': this.apiKey }),
      },
    })

    if (!response.ok) {
      throw new Error('Failed to upload document')
    }

    return response.json()
  }

  /**
   * Download a document
   */
  async downloadDocument(documentId: string): Promise<Blob> {
    const url = `${this.baseUrl}/api/${this.apiVersion}/documents/${documentId}/download`
    const response = await fetch(url, {
      headers: {
        ...(this.apiKey && { 'X-API-Key': this.apiKey }),
      },
    })

    if (!response.ok) {
      throw new Error('Failed to download document')
    }

    return response.blob()
  }

  /**
   * Flatten PDF (make all form fields permanent)
   */
  async flattenDocument(documentId: string): Promise<{ documentBytes: string }> {
    return this.request(`/documents/${documentId}/flatten`, {
      method: 'POST',
    })
  }

  /**
   * Encrypt PDF with password
   */
  async encryptDocument(
    documentId: string,
    options: {
      userPassword?: string
      ownerPassword: string
      permissions: ('print' | 'copy' | 'modify' | 'annotate')[]
    }
  ): Promise<{ documentBytes: string }> {
    return this.request(`/documents/${documentId}/encrypt`, {
      method: 'POST',
      body: JSON.stringify(options),
    })
  }

  /**
   * Convert document to PDF
   */
  async convertToPdf(file: File): Promise<{ pdfBytes: string }> {
    const formData = new FormData()
    formData.append('file', file)

    const url = `${this.baseUrl}/api/${this.apiVersion}/documents/convert`
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        ...(this.apiKey && { 'X-API-Key': this.apiKey }),
      },
    })

    if (!response.ok) {
      throw new Error('Failed to convert document')
    }

    return response.json()
  }

  // ==================== TIMESTAMP OPERATIONS ====================

  /**
   * Request a timestamp from TSA
   */
  async requestTimestamp(documentHash: string): Promise<{
    timestampToken: string
    time: string
    tsaName: string
  }> {
    return this.request('/timestamp/request', {
      method: 'POST',
      body: JSON.stringify({ documentHash }),
    })
  }

  // ==================== AUDIT OPERATIONS ====================

  /**
   * Log an audit event
   */
  async logAuditEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<{ eventId: string }> {
    return this.request('/audit/log', {
      method: 'POST',
      body: JSON.stringify(event),
    })
  }

  /**
   * Get audit events for a document
   */
  async getAuditEvents(documentId: string): Promise<AuditEvent[]> {
    return this.request<AuditEvent[]>(`/audit/document/${documentId}`, {
      method: 'GET',
    })
  }

  /**
   * Export audit report as PDF
   */
  async exportAuditReport(documentId: string): Promise<Blob> {
    const url = `${this.baseUrl}/api/${this.apiVersion}/audit/report/${documentId}`
    const response = await fetch(url, {
      headers: {
        ...(this.apiKey && { 'X-API-Key': this.apiKey }),
      },
    })

    if (!response.ok) {
      throw new Error('Failed to export audit report')
    }

    return response.blob()
  }

  // ==================== HEALTH CHECK ====================

  /**
   * Check if backend is available
   */
  async healthCheck(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy'; services: Record<string, boolean> }> {
    try {
      return await this.request('/health', { method: 'GET' })
    } catch {
      return { status: 'unhealthy', services: {} }
    }
  }
}

// Export singleton instance
export const backendAPI = new BackendAPIClient()

// Export class for creating new instances
export { BackendAPIClient }
