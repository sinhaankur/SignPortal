import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import crypto from 'crypto'

// ============================================================================
// Types
// ============================================================================

export interface SignaturePosition {
  pageNumber: number
  x: number
  y: number
  width: number
  height: number
}

export interface SignatureInfo {
  signerName: string
  signerEmail: string
  signedAt: Date
  signatureImage: string // Base64
  position: SignaturePosition
  ipAddress?: string
}

export interface CertificateData {
  documentId: string
  documentName: string
  documentHash: string
  signatures: Array<{
    signerName: string
    signerEmail: string
    signedAt: Date
    ipAddress?: string
    signatureHash: string
  }>
  issuedAt: Date
  certificateId: string
  verificationUrl: string
}

// ============================================================================
// PDF Service
// ============================================================================

class PDFService {
  // Add signature to PDF
  async addSignatureToPDF(
    pdfBytes: ArrayBuffer,
    signatures: SignatureInfo[]
  ): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const pages = pdfDoc.getPages()

    for (const sig of signatures) {
      const page = pages[sig.position.pageNumber - 1]
      if (!page) continue

      // Embed signature image
      const signatureImageBytes = this.base64ToBytes(sig.signatureImage)
      let signatureImage

      try {
        signatureImage = await pdfDoc.embedPng(signatureImageBytes)
      } catch {
        // Try as JPEG if PNG fails
        signatureImage = await pdfDoc.embedJpg(signatureImageBytes)
      }

      // Calculate position (PDF coordinates start from bottom-left)
      const pageHeight = page.getHeight()
      const yPosition = pageHeight - sig.position.y - sig.position.height

      // Draw the signature
      page.drawImage(signatureImage, {
        x: sig.position.x,
        y: yPosition,
        width: sig.position.width,
        height: sig.position.height,
      })

      // Add signature details as text (optional - subtle)
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const fontSize = 6
      page.drawText(`Signed by: ${sig.signerName}`, {
        x: sig.position.x,
        y: yPosition - 10,
        size: fontSize,
        font,
        color: rgb(0.4, 0.4, 0.4),
      })
      page.drawText(`Date: ${sig.signedAt.toISOString().split('T')[0]}`, {
        x: sig.position.x,
        y: yPosition - 18,
        size: fontSize,
        font,
        color: rgb(0.4, 0.4, 0.4),
      })
    }

    return pdfDoc.save()
  }

  // Generate signing certificate
  generateCertificate(data: CertificateData): string {
    const certificateHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Digital Signing Certificate</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Georgia', serif; 
      background: linear-gradient(135deg, #f7f5f3 0%, #e8e4e0 100%);
      min-height: 100vh;
      padding: 40px;
    }
    .certificate { 
      max-width: 800px; 
      margin: 0 auto; 
      background: white; 
      border: 3px solid #37322f;
      border-radius: 8px;
      padding: 60px;
      position: relative;
      box-shadow: 0 10px 40px rgba(55, 50, 47, 0.15);
    }
    .certificate::before {
      content: '';
      position: absolute;
      top: 20px;
      left: 20px;
      right: 20px;
      bottom: 20px;
      border: 1px solid #d4d0cb;
      pointer-events: none;
    }
    .header { text-align: center; margin-bottom: 40px; }
    .logo { font-size: 28px; font-weight: bold; color: #37322f; margin-bottom: 8px; }
    .logo span { color: #6b6560; }
    .title { font-size: 32px; color: #37322f; margin: 20px 0; letter-spacing: 2px; }
    .subtitle { color: #6b6560; font-size: 14px; letter-spacing: 1px; }
    .content { margin: 40px 0; }
    .document-info {
      background: #f7f5f3;
      padding: 24px;
      border-radius: 8px;
      margin: 24px 0;
    }
    .document-name {
      font-size: 20px;
      color: #37322f;
      font-weight: bold;
      margin-bottom: 8px;
    }
    .signatures-section { margin-top: 40px; }
    .section-title {
      font-size: 18px;
      color: #37322f;
      border-bottom: 2px solid #37322f;
      padding-bottom: 8px;
      margin-bottom: 20px;
    }
    .signature-entry {
      display: flex;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid #e8e4e0;
    }
    .signature-entry:last-child { border-bottom: none; }
    .signer-info { flex: 1; }
    .signer-name { font-weight: bold; color: #37322f; }
    .signer-email { color: #6b6560; font-size: 14px; }
    .signature-meta { text-align: right; color: #6b6560; font-size: 13px; }
    .verification {
      margin-top: 40px;
      padding: 20px;
      background: #37322f;
      color: white;
      border-radius: 8px;
      text-align: center;
    }
    .verification-title { font-size: 14px; margin-bottom: 8px; opacity: 0.8; }
    .verification-id { font-family: monospace; font-size: 16px; letter-spacing: 1px; }
    .verification-url { font-size: 12px; margin-top: 12px; opacity: 0.7; word-break: break-all; }
    .hash-section {
      margin-top: 30px;
      padding: 16px;
      background: #f7f5f3;
      border-radius: 8px;
      font-family: monospace;
      font-size: 11px;
      color: #6b6560;
      word-break: break-all;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      color: #6b6560;
      font-size: 12px;
    }
    .seal {
      width: 100px;
      height: 100px;
      border: 3px solid #37322f;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 20px auto;
      font-weight: bold;
      color: #37322f;
      font-size: 12px;
      text-align: center;
      line-height: 1.3;
    }
    @media print {
      body { background: white; padding: 0; }
      .certificate { border: none; box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="header">
      <div class="logo">Sign<span>Portal</span></div>
      <div class="title">CERTIFICATE OF COMPLETION</div>
      <div class="subtitle">DIGITAL SIGNATURE VERIFICATION</div>
    </div>
    
    <div class="content">
      <p style="text-align: center; color: #6b6560; margin-bottom: 20px;">
        This certificate confirms that the following document has been digitally signed
        by all parties and is legally binding.
      </p>
      
      <div class="document-info">
        <div class="document-name">📄 ${data.documentName}</div>
        <div style="color: #6b6560; font-size: 14px; margin-top: 8px;">
          Document ID: ${data.documentId}
        </div>
      </div>
      
      <div class="signatures-section">
        <div class="section-title">Signatories</div>
        ${data.signatures
          .map(
            (sig) => `
          <div class="signature-entry">
            <div class="signer-info">
              <div class="signer-name">✓ ${sig.signerName}</div>
              <div class="signer-email">${sig.signerEmail}</div>
            </div>
            <div class="signature-meta">
              <div>${new Date(sig.signedAt).toLocaleString()}</div>
              ${sig.ipAddress ? `<div>IP: ${sig.ipAddress}</div>` : ''}
            </div>
          </div>
        `
          )
          .join('')}
      </div>
      
      <div class="seal">
        DIGITALLY<br>CERTIFIED
      </div>
      
      <div class="verification">
        <div class="verification-title">Certificate ID</div>
        <div class="verification-id">${data.certificateId}</div>
        <div class="verification-url">
          Verify at: ${data.verificationUrl}
        </div>
      </div>
      
      <div class="hash-section">
        <strong>Document Hash (SHA-256):</strong><br>
        ${data.documentHash}
      </div>
    </div>
    
    <div class="footer">
      <p>Issued on ${data.issuedAt.toLocaleString()}</p>
      <p style="margin-top: 8px;">This certificate is automatically generated and does not require a physical signature.</p>
      <p style="margin-top: 8px;">© ${new Date().getFullYear()} SignPortal. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`
    return certificateHtml
  }

  // Generate PDF certificate
  async generateCertificatePDF(data: CertificateData): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([612, 792]) // Letter size
    const { width, height } = page.getSize()

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    // Header
    page.drawText('SignPortal', {
      x: width / 2 - 40,
      y: height - 60,
      size: 24,
      font: fontBold,
      color: rgb(0.216, 0.196, 0.184),
    })

    page.drawText('CERTIFICATE OF COMPLETION', {
      x: width / 2 - 100,
      y: height - 100,
      size: 16,
      font: fontBold,
      color: rgb(0.216, 0.196, 0.184),
    })

    // Document info
    page.drawText('Document:', {
      x: 50,
      y: height - 160,
      size: 12,
      font: fontBold,
      color: rgb(0.4, 0.4, 0.4),
    })
    page.drawText(data.documentName, {
      x: 120,
      y: height - 160,
      size: 12,
      font,
      color: rgb(0.216, 0.196, 0.184),
    })

    page.drawText('Document ID:', {
      x: 50,
      y: height - 180,
      size: 10,
      font,
      color: rgb(0.4, 0.4, 0.4),
    })
    page.drawText(data.documentId, {
      x: 130,
      y: height - 180,
      size: 10,
      font,
      color: rgb(0.4, 0.4, 0.4),
    })

    // Signatures section
    page.drawText('Signatories:', {
      x: 50,
      y: height - 220,
      size: 14,
      font: fontBold,
      color: rgb(0.216, 0.196, 0.184),
    })

    let yPos = height - 250
    for (const sig of data.signatures) {
      page.drawText(`✓ ${sig.signerName}`, {
        x: 60,
        y: yPos,
        size: 11,
        font: fontBold,
        color: rgb(0.216, 0.196, 0.184),
      })
      page.drawText(sig.signerEmail, {
        x: 70,
        y: yPos - 15,
        size: 9,
        font,
        color: rgb(0.4, 0.4, 0.4),
      })
      page.drawText(`Signed: ${new Date(sig.signedAt).toLocaleString()}`, {
        x: 350,
        y: yPos,
        size: 9,
        font,
        color: rgb(0.4, 0.4, 0.4),
      })
      yPos -= 45
    }

    // Certificate ID
    page.drawRectangle({
      x: 50,
      y: 150,
      width: width - 100,
      height: 60,
      color: rgb(0.216, 0.196, 0.184),
    })
    page.drawText('Certificate ID', {
      x: width / 2 - 35,
      y: 190,
      size: 10,
      font,
      color: rgb(1, 1, 1),
    })
    page.drawText(data.certificateId, {
      x: width / 2 - 80,
      y: 170,
      size: 12,
      font: fontBold,
      color: rgb(1, 1, 1),
    })

    // Hash
    page.drawText('Document Hash (SHA-256):', {
      x: 50,
      y: 120,
      size: 8,
      font,
      color: rgb(0.4, 0.4, 0.4),
    })
    page.drawText(data.documentHash.substring(0, 64), {
      x: 50,
      y: 105,
      size: 7,
      font,
      color: rgb(0.4, 0.4, 0.4),
    })

    // Footer
    page.drawText(`Issued: ${data.issuedAt.toLocaleString()}`, {
      x: 50,
      y: 50,
      size: 9,
      font,
      color: rgb(0.4, 0.4, 0.4),
    })
    page.drawText('© SignPortal', {
      x: width - 100,
      y: 50,
      size: 9,
      font,
      color: rgb(0.4, 0.4, 0.4),
    })

    return pdfDoc.save()
  }

  // Calculate document hash
  calculateHash(pdfBytes: ArrayBuffer | Uint8Array): string {
    const buffer = Buffer.from(pdfBytes)
    return crypto.createHash('sha256').update(buffer).digest('hex')
  }

  // Generate unique certificate ID
  generateCertificateId(): string {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = crypto.randomBytes(4).toString('hex').toUpperCase()
    return `SP-${timestamp}-${random}`
  }

  // Helper: Convert base64 to bytes
  private base64ToBytes(base64: string): Uint8Array {
    // Remove data URL prefix if present
    const cleanBase64 = base64.replace(/^data:image\/\w+;base64,/, '')
    const binaryString = atob(cleanBase64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes
  }
}

// Export singleton
export const pdfService = new PDFService()
export default pdfService
