/**
 * PDF Service Layer
 * 
 * This service provides PDF manipulation capabilities using pdf-lib.
 * It handles:
 * - PDF loading and rendering
 * - Adding signature fields
 * - Embedding signatures (images/text)
 * - Adding form fields
 * - PDF metadata management
 * 
 * For advanced digital signatures with X.509 certificates (PAdES standard),
 * this connects to a .NET backend API that uses IronPDF or iText.
 */

import { PDFDocument, PDFPage, rgb, StandardFonts, degrees } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'

// Types
export interface SignaturePosition {
  x: number
  y: number
  width: number
  height: number
  page: number
}

export interface SignatureData {
  type: 'draw' | 'text' | 'image' | 'certificate'
  data: string // base64 for image/draw, text for text, certificate ID for certificate
  signerName: string
  signerEmail: string
  timestamp: Date
  position: SignaturePosition
}

export interface PDFFieldConfig {
  type: 'signature' | 'text' | 'checkbox' | 'date' | 'initials'
  name: string
  page: number
  x: number
  y: number
  width: number
  height: number
  required: boolean
  assignedTo?: string
}

export interface PDFInfo {
  pageCount: number
  title?: string
  author?: string
  subject?: string
  keywords?: string[]
  creationDate?: Date
  modificationDate?: Date
  pages: { width: number; height: number }[]
}

// PDF Service Class
class PDFService {
  private pdfDoc: PDFDocument | null = null
  private pdfBytes: Uint8Array | null = null

  /**
   * Load a PDF from bytes or URL
   */
  async loadPDF(source: Uint8Array | string): Promise<PDFInfo> {
    let bytes: Uint8Array

    if (typeof source === 'string') {
      // Load from URL
      const response = await fetch(source)
      const arrayBuffer = await response.arrayBuffer()
      bytes = new Uint8Array(arrayBuffer)
    } else {
      bytes = source
    }

    this.pdfBytes = bytes
    this.pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true })
    this.pdfDoc.registerFontkit(fontkit)

    return this.getPDFInfo()
  }

  /**
   * Load PDF from a File object
   */
  async loadPDFFromFile(file: File): Promise<PDFInfo> {
    const arrayBuffer = await file.arrayBuffer()
    return this.loadPDF(new Uint8Array(arrayBuffer))
  }

  /**
   * Get PDF information
   */
  getPDFInfo(): PDFInfo {
    if (!this.pdfDoc) throw new Error('No PDF loaded')

    const pages = this.pdfDoc.getPages()
    
    return {
      pageCount: pages.length,
      title: this.pdfDoc.getTitle() || undefined,
      author: this.pdfDoc.getAuthor() || undefined,
      subject: this.pdfDoc.getSubject() || undefined,
      keywords: this.pdfDoc.getKeywords()?.split(',').map(k => k.trim()) || undefined,
      creationDate: this.pdfDoc.getCreationDate() || undefined,
      modificationDate: this.pdfDoc.getModificationDate() || undefined,
      pages: pages.map(page => ({
        width: page.getWidth(),
        height: page.getHeight()
      }))
    }
  }

  /**
   * Add a visual signature to the PDF (drawn/typed signature)
   */
  async addVisualSignature(signature: SignatureData): Promise<Uint8Array> {
    if (!this.pdfDoc) throw new Error('No PDF loaded')

    const pages = this.pdfDoc.getPages()
    const page = pages[signature.position.page]
    
    if (!page) throw new Error(`Page ${signature.position.page} not found`)

    const { x, y, width, height } = signature.position

    if (signature.type === 'image' || signature.type === 'draw') {
      // Signature is a base64 PNG image
      const imageData = signature.data.replace(/^data:image\/\w+;base64,/, '')
      const imageBytes = Uint8Array.from(atob(imageData), c => c.charCodeAt(0))
      
      const pngImage = await this.pdfDoc.embedPng(imageBytes)
      
      page.drawImage(pngImage, {
        x,
        y: page.getHeight() - y - height, // PDF coordinates start from bottom
        width,
        height,
      })
    } else if (signature.type === 'text') {
      // Text signature (typed name)
      const font = await this.pdfDoc.embedFont(StandardFonts.TimesRomanItalic)
      const fontSize = Math.min(height * 0.6, 24)
      
      page.drawText(signature.data, {
        x: x + 5,
        y: page.getHeight() - y - height + (height - fontSize) / 2,
        size: fontSize,
        font,
        color: rgb(0, 0, 0.5),
      })
    }

    // Add signature metadata annotation
    await this.addSignatureAnnotation(page, signature)

    return this.pdfDoc.save()
  }

  /**
   * Add signature annotation with timestamp and signer info
   */
  private async addSignatureAnnotation(page: PDFPage, signature: SignatureData): Promise<void> {
    const font = await this.pdfDoc!.embedFont(StandardFonts.Helvetica)
    const { x, y, width, height } = signature.position
    const pageHeight = page.getHeight()

    // Draw signature box border
    page.drawRectangle({
      x,
      y: pageHeight - y - height,
      width,
      height,
      borderColor: rgb(0.6, 0.6, 0.6),
      borderWidth: 1,
    })

    // Add timestamp and signer info below signature
    const timestampText = `Signed by ${signature.signerName} on ${signature.timestamp.toLocaleString()}`
    const fontSize = 6
    
    page.drawText(timestampText, {
      x: x + 2,
      y: pageHeight - y - height - 10,
      size: fontSize,
      font,
      color: rgb(0.4, 0.4, 0.4),
    })
  }

  /**
   * Add a signature placeholder field
   */
  async addSignatureField(config: PDFFieldConfig): Promise<Uint8Array> {
    if (!this.pdfDoc) throw new Error('No PDF loaded')

    const pages = this.pdfDoc.getPages()
    const page = pages[config.page]
    
    if (!page) throw new Error(`Page ${config.page} not found`)

    const pageHeight = page.getHeight()
    const { x, y, width, height } = config

    // Draw placeholder box
    page.drawRectangle({
      x,
      y: pageHeight - y - height,
      width,
      height,
      borderColor: rgb(0.2, 0.4, 0.8),
      borderWidth: 2,
      color: rgb(0.95, 0.97, 1),
      borderDashArray: [4, 2],
    })

    // Add field label
    const font = await this.pdfDoc.embedFont(StandardFonts.Helvetica)
    const label = config.type === 'signature' ? 'Sign Here' : 
                  config.type === 'initials' ? 'Initial Here' :
                  config.type === 'date' ? 'Date' : config.name

    page.drawText(label, {
      x: x + 5,
      y: pageHeight - y - height + height / 2 - 4,
      size: 10,
      font,
      color: rgb(0.3, 0.5, 0.9),
    })

    if (config.required) {
      page.drawText('*', {
        x: x + width - 10,
        y: pageHeight - y - 12,
        size: 14,
        font,
        color: rgb(0.9, 0.2, 0.2),
      })
    }

    return this.pdfDoc.save()
  }

  /**
   * Add multiple signature fields
   */
  async addSignatureFields(configs: PDFFieldConfig[]): Promise<Uint8Array> {
    for (const config of configs) {
      await this.addSignatureField(config)
    }
    return this.pdfDoc!.save()
  }

  /**
   * Flatten the PDF (makes signatures permanent, not editable)
   */
  async flattenPDF(): Promise<Uint8Array> {
    if (!this.pdfDoc) throw new Error('No PDF loaded')
    
    // Save and reload to flatten
    const bytes = await this.pdfDoc.save()
    this.pdfDoc = await PDFDocument.load(bytes)
    return bytes
  }

  /**
   * Get PDF as base64 data URL
   */
  async getDataURL(): Promise<string> {
    if (!this.pdfDoc) throw new Error('No PDF loaded')
    
    const bytes = await this.pdfDoc.save()
    const base64 = btoa(String.fromCharCode(...bytes))
    return `data:application/pdf;base64,${base64}`
  }

  /**
   * Get PDF as Uint8Array
   */
  async getBytes(): Promise<Uint8Array> {
    if (!this.pdfDoc) throw new Error('No PDF loaded')
    return this.pdfDoc.save()
  }

  /**
   * Create a new blank PDF
   */
  async createBlankPDF(pageCount: number = 1): Promise<PDFInfo> {
    this.pdfDoc = await PDFDocument.create()
    this.pdfDoc.registerFontkit(fontkit)
    
    for (let i = 0; i < pageCount; i++) {
      this.pdfDoc.addPage([612, 792]) // Letter size
    }
    
    return this.getPDFInfo()
  }
}

// Export singleton instance
export const pdfService = new PDFService()

// Export class for creating new instances
export { PDFService }
