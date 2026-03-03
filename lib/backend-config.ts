/**
 * Backend Configuration
 * 
 * Configuration for connecting to a .NET backend API that handles:
 * - Digital signatures with X.509 certificates (PAdES standard)
 * - Certificate management and validation
 * - Timestamp Authority (TSA) integration
 * - Long-term signature validation (LTV)
 * 
 * The .NET backend should use:
 * - IronPDF (recommended) or iText 8 for PDF processing
 * - System.Security.Cryptography for certificate operations
 * - Azure Key Vault or similar for secure key storage
 */

export interface BackendConfig {
  // Base URL of the .NET backend API
  baseUrl: string
  
  // API version
  apiVersion: string
  
  // Timeout in milliseconds
  timeout: number
  
  // API key for authentication (if using API key auth)
  apiKey?: string
  
  // Enable/disable features
  features: {
    digitalSignatures: boolean
    timestampAuthority: boolean
    certificateValidation: boolean
    longTermValidation: boolean
    documentEncryption: boolean
    auditLogging: boolean
  }
}

// Development configuration
const developmentConfig: BackendConfig = {
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000',
  apiVersion: 'v1',
  timeout: 30000,
  apiKey: process.env.BACKEND_API_KEY,
  features: {
    digitalSignatures: true,
    timestampAuthority: true,
    certificateValidation: true,
    longTermValidation: true,
    documentEncryption: true,
    auditLogging: true
  }
}

// Production configuration
const productionConfig: BackendConfig = {
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.signportal.com',
  apiVersion: 'v1',
  timeout: 60000,
  apiKey: process.env.BACKEND_API_KEY,
  features: {
    digitalSignatures: true,
    timestampAuthority: true,
    certificateValidation: true,
    longTermValidation: true,
    documentEncryption: true,
    auditLogging: true
  }
}

// Export current config based on environment
export const backendConfig: BackendConfig = 
  process.env.NODE_ENV === 'production' ? productionConfig : developmentConfig

/**
 * API Endpoints for .NET Backend
 * 
 * These endpoints should be implemented in your .NET Core/8 backend using:
 * 
 * Controllers:
 * - SignatureController - Digital signature operations
 * - CertificateController - Certificate management
 * - DocumentController - PDF processing
 * - AuditController - Audit logging
 */
export const API_ENDPOINTS = {
  // Digital Signature endpoints
  signatures: {
    sign: '/api/signatures/sign',                    // POST - Sign document with certificate
    verify: '/api/signatures/verify',                // POST - Verify signature
    addField: '/api/signatures/field',               // POST - Add signature field to PDF
    getSignatures: '/api/signatures/document/:id',   // GET - Get all signatures on document
  },
  
  // Certificate endpoints
  certificates: {
    list: '/api/certificates',                       // GET - List user certificates
    upload: '/api/certificates/upload',              // POST - Upload certificate
    validate: '/api/certificates/validate',          // POST - Validate certificate
    revoke: '/api/certificates/:id/revoke',          // POST - Revoke certificate
  },
  
  // Document processing endpoints
  documents: {
    upload: '/api/documents/upload',                 // POST - Upload document
    download: '/api/documents/:id/download',         // GET - Download document
    flatten: '/api/documents/:id/flatten',           // POST - Flatten PDF
    encrypt: '/api/documents/:id/encrypt',           // POST - Encrypt PDF
    addWatermark: '/api/documents/:id/watermark',    // POST - Add watermark
    convert: '/api/documents/convert',               // POST - Convert to PDF
  },
  
  // Timestamp Authority endpoints
  timestamp: {
    request: '/api/timestamp/request',               // POST - Request timestamp
    verify: '/api/timestamp/verify',                 // POST - Verify timestamp
  },
  
  // Audit endpoints
  audit: {
    log: '/api/audit/log',                           // POST - Log audit event
    getEvents: '/api/audit/document/:id',            // GET - Get audit events
    exportReport: '/api/audit/report/:id',           // GET - Export audit report
  }
}

/**
 * Sample .NET Backend Implementation Guide
 * 
 * Your .NET 8 backend should implement these key classes:
 * 
 * 1. PdfSignatureService.cs - Using IronPDF or iText:
 *    - SignDocument(byte[] pdf, X509Certificate2 cert, SignatureOptions options)
 *    - AddSignatureField(byte[] pdf, SignatureFieldOptions options)
 *    - VerifySignature(byte[] pdf)
 * 
 * 2. CertificateService.cs:
 *    - ValidateCertificate(X509Certificate2 cert)
 *    - CheckRevocationStatus(X509Certificate2 cert)
 *    - GetCertificateChain(X509Certificate2 cert)
 * 
 * 3. TimestampService.cs:
 *    - RequestTimestamp(byte[] hash, string tsaUrl)
 *    - VerifyTimestamp(byte[] timestampToken)
 * 
 * Example NuGet packages for .NET:
 *   - IronPdf (recommended for ease of use)
 *   - iText.Kernel, iText.Forms, iText.Sign (for advanced control)
 *   - BouncyCastle.Cryptography (for certificate operations)
 */
export const DOTNET_SAMPLE_CONFIG = {
  nugetPackages: [
    { name: 'IronPdf', version: '2024.x', purpose: 'PDF generation and signing' },
    { name: 'iText.Kernel', version: '8.x', purpose: 'Alternative PDF engine' },
    { name: 'iText.Sign', version: '8.x', purpose: 'PAdES digital signatures' },
    { name: 'BouncyCastle.Cryptography', version: '2.x', purpose: 'Certificate handling' },
  ],
  
  appsettings: {
    PdfEngine: 'IronPdf', // or 'iText'
    TimestampAuthorityUrl: 'http://timestamp.digicert.com',
    SignatureHashAlgorithm: 'SHA256',
    EnableLTV: true,
  }
}
