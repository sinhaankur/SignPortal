import nodemailer from 'nodemailer'

// ============================================================================
// Types
// ============================================================================

export interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

export interface SignatureRequestEmail {
  to: string
  signerName: string
  documentName: string
  senderName: string
  senderEmail: string
  message?: string
  accessLink: string
  expiresAt?: Date
}

export interface SignatureCompletedEmail {
  to: string
  signerName: string
  documentName: string
  signedAt: Date
  downloadLink: string
}

export interface ReminderEmail {
  to: string
  signerName: string
  documentName: string
  senderName: string
  accessLink: string
  daysRemaining: number
}

export interface DocumentCompletedEmail {
  to: string
  recipients: string[]
  documentName: string
  completedAt: Date
  downloadLink: string
  certificateLink?: string
}

// ============================================================================
// Email Transporter
// ============================================================================

const createTransporter = () => {
  // Use environment variables for configuration
  const config: EmailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  }

  return nodemailer.createTransport(config)
}

// ============================================================================
// Email Templates
// ============================================================================

const getBaseTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SignPortal</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #37322f; margin: 0; padding: 0; background-color: #f7f5f3; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .card { background: white; border-radius: 16px; padding: 32px; margin: 20px 0; box-shadow: 0 4px 6px rgba(55, 50, 47, 0.1); }
    .header { text-align: center; padding-bottom: 24px; border-bottom: 1px solid #f0eeeb; margin-bottom: 24px; }
    .logo { font-size: 24px; font-weight: bold; color: #37322f; }
    .logo span { color: #6b6560; }
    .button { display: inline-block; background: #37322f; color: white !important; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0; }
    .button:hover { background: #4a433f; }
    .footer { text-align: center; padding-top: 24px; color: #6b6560; font-size: 14px; }
    .highlight { background: #f7f5f3; padding: 16px; border-radius: 8px; margin: 16px 0; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0eeeb; }
    .label { color: #6b6560; }
    .value { font-weight: 500; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="logo">Sign<span>Portal</span></div>
      </div>
      ${content}
      <div class="footer">
        <p>This email was sent by SignPortal</p>
        <p>&copy; ${new Date().getFullYear()} SignPortal. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
`

// ============================================================================
// Email Service Class
// ============================================================================

class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = createTransporter()
  }

  // Send signature request email
  async sendSignatureRequest(data: SignatureRequestEmail): Promise<boolean> {
    const expiryText = data.expiresAt
      ? `<p class="info-row"><span class="label">Expires:</span> <span class="value">${data.expiresAt.toLocaleDateString()}</span></p>`
      : ''

    const messageText = data.message
      ? `<div class="highlight"><p><strong>Message from ${data.senderName}:</strong></p><p>${data.message}</p></div>`
      : ''

    const content = `
      <h1 style="margin: 0 0 16px 0; font-size: 24px;">Signature Requested</h1>
      <p>Hello ${data.signerName || 'there'},</p>
      <p><strong>${data.senderName}</strong> has requested your signature on the following document:</p>
      
      <div class="highlight">
        <p style="margin: 0; font-size: 18px; font-weight: 600;">📄 ${data.documentName}</p>
        ${expiryText}
      </div>

      ${messageText}

      <div style="text-align: center; margin: 32px 0;">
        <a href="${data.accessLink}" class="button">Review & Sign Document</a>
      </div>

      <p style="color: #6b6560; font-size: 14px;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <a href="${data.accessLink}" style="color: #37322f; word-break: break-all;">${data.accessLink}</a>
      </p>
    `

    try {
      await this.transporter.sendMail({
        from: `"SignPortal" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: data.to,
        subject: `${data.senderName} requested your signature on "${data.documentName}"`,
        html: getBaseTemplate(content),
      })
      return true
    } catch (error) {
      console.error('Failed to send signature request email:', error)
      return false
    }
  }

  // Send signature completed notification
  async sendSignatureCompleted(data: SignatureCompletedEmail): Promise<boolean> {
    const content = `
      <h1 style="margin: 0 0 16px 0; font-size: 24px;">✅ Signature Completed</h1>
      <p>Great news! ${data.signerName} has signed the document.</p>
      
      <div class="highlight">
        <p style="margin: 0; font-size: 18px; font-weight: 600;">📄 ${data.documentName}</p>
        <p style="margin: 8px 0 0 0; color: #6b6560;">Signed on ${data.signedAt.toLocaleString()}</p>
      </div>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${data.downloadLink}" class="button">View Document</a>
      </div>
    `

    try {
      await this.transporter.sendMail({
        from: `"SignPortal" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: data.to,
        subject: `${data.signerName} signed "${data.documentName}"`,
        html: getBaseTemplate(content),
      })
      return true
    } catch (error) {
      console.error('Failed to send signature completed email:', error)
      return false
    }
  }

  // Send reminder email
  async sendReminder(data: ReminderEmail): Promise<boolean> {
    const urgencyText = data.daysRemaining <= 1
      ? '⚠️ This is urgent - the document expires soon!'
      : `You have ${data.daysRemaining} days remaining to sign.`

    const content = `
      <h1 style="margin: 0 0 16px 0; font-size: 24px;">📝 Reminder: Signature Needed</h1>
      <p>Hello ${data.signerName || 'there'},</p>
      <p>This is a friendly reminder that <strong>${data.senderName}</strong> is still waiting for your signature.</p>
      
      <div class="highlight">
        <p style="margin: 0; font-size: 18px; font-weight: 600;">📄 ${data.documentName}</p>
        <p style="margin: 8px 0 0 0; color: ${data.daysRemaining <= 1 ? '#dc2626' : '#6b6560'};">${urgencyText}</p>
      </div>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${data.accessLink}" class="button">Sign Now</a>
      </div>
    `

    try {
      await this.transporter.sendMail({
        from: `"SignPortal" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: data.to,
        subject: `Reminder: Please sign "${data.documentName}"`,
        html: getBaseTemplate(content),
      })
      return true
    } catch (error) {
      console.error('Failed to send reminder email:', error)
      return false
    }
  }

  // Send document completed email (all signatures collected)
  async sendDocumentCompleted(data: DocumentCompletedEmail): Promise<boolean> {
    const recipientList = data.recipients.map(r => `<li>${r}</li>`).join('')

    const content = `
      <h1 style="margin: 0 0 16px 0; font-size: 24px;">🎉 Document Fully Signed!</h1>
      <p>All signatures have been collected for your document.</p>
      
      <div class="highlight">
        <p style="margin: 0; font-size: 18px; font-weight: 600;">📄 ${data.documentName}</p>
        <p style="margin: 8px 0 0 0; color: #6b6560;">Completed on ${data.completedAt.toLocaleString()}</p>
      </div>

      <div style="margin: 24px 0;">
        <p><strong>Signed by:</strong></p>
        <ul style="color: #6b6560;">${recipientList}</ul>
      </div>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${data.downloadLink}" class="button">Download Signed PDF</a>
        ${data.certificateLink ? `<br><br><a href="${data.certificateLink}" style="color: #37322f;">Download Signing Certificate</a>` : ''}
      </div>

      <p style="color: #6b6560; font-size: 14px;">
        The signed document has been secured with a digital certificate for authenticity verification.
      </p>
    `

    try {
      await this.transporter.sendMail({
        from: `"SignPortal" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: data.to,
        subject: `✅ "${data.documentName}" - All Signatures Complete`,
        html: getBaseTemplate(content),
      })
      return true
    } catch (error) {
      console.error('Failed to send document completed email:', error)
      return false
    }
  }

  // Verify SMTP connection
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify()
      return true
    } catch (error) {
      console.error('SMTP connection verification failed:', error)
      return false
    }
  }
}

// Export singleton instance
export const emailService = new EmailService()
export default emailService
