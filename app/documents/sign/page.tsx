"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  FileText, 
  ChevronLeft, 
  Mail, 
  CheckCircle, 
  Clock, 
  Shield, 
  AlertCircle,
  RefreshCw,
  Lock,
  Fingerprint,
  Eye,
  Download,
  PenTool,
  User,
  Calendar
} from "lucide-react"

type VerificationStep = "pending" | "verifying" | "verified" | "signing" | "complete"

export default function SignDocumentPage() {
  const [step, setStep] = useState<VerificationStep>("pending")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [verificationMethod, setVerificationMethod] = useState<"email" | "offline">("email")
  const [signatureType, setSignatureType] = useState<"draw" | "type" | "upload">("type")
  const [typedSignature, setTypedSignature] = useState("")

  // Mock document data
  const document = {
    id: "DOC-2024-0891",
    name: "Service Agreement - Contoso Corp",
    sender: "Sarah Johnson",
    senderEmail: "sarah.johnson@contoso.com",
    sentDate: "Jan 15, 2025",
    dueDate: "Jan 20, 2025",
    pages: 12,
    signerEmail: "john.doe@acme.com"
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  const handleVerify = () => {
    setStep("verifying")
    // Simulate verification
    setTimeout(() => {
      setStep("verified")
    }, 2000)
  }

  const handleSign = () => {
    setStep("signing")
    // Simulate signing
    setTimeout(() => {
      setStep("complete")
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/documents" 
              className="flex items-center gap-2 text-slate-600 hover:text-amber-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Documents
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm text-slate-600">Secure Signing Session</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Document Info */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-slate-900">{document.name}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  From: {document.sender}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Due: {document.dueDate}
                </span>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[
            { key: "verify", label: "Verify Identity" },
            { key: "sign", label: "Sign Document" },
            { key: "complete", label: "Complete" }
          ].map((s, i) => {
            const isActive = (s.key === "verify" && ["pending", "verifying", "verified"].includes(step)) ||
                            (s.key === "sign" && step === "signing") ||
                            (s.key === "complete" && step === "complete")
            const isComplete = (s.key === "verify" && ["verified", "signing", "complete"].includes(step)) ||
                              (s.key === "sign" && step === "complete")
            return (
              <div key={s.key} className="flex items-center gap-4">
                <div className={`flex items-center gap-2 ${isActive || isComplete ? "text-amber-600" : "text-slate-400"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isComplete ? "bg-green-500 text-white" : 
                    isActive ? "bg-amber-500 text-white" : 
                    "bg-slate-200 text-slate-500"
                  }`}>
                    {isComplete ? <CheckCircle className="w-5 h-5" /> : i + 1}
                  </div>
                  <span className="font-medium">{s.label}</span>
                </div>
                {i < 2 && <div className={`w-12 h-0.5 ${isComplete ? "bg-green-500" : "bg-slate-200"}`} />}
              </div>
            )
          })}
        </div>

        {/* Verification Step */}
        {(step === "pending" || step === "verifying") && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">Verify Your Identity</h2>
              <p className="text-slate-600">
                To ensure the security of your signature, please verify your email address.
              </p>
            </div>

            {/* Verification Method Toggle */}
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={() => setVerificationMethod("email")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  verificationMethod === "email"
                    ? "bg-amber-500 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Email OTP
              </button>
              <button
                onClick={() => setVerificationMethod("offline")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  verificationMethod === "offline"
                    ? "bg-amber-500 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Offline Token
              </button>
            </div>

            {verificationMethod === "email" ? (
              <>
                <div className="bg-slate-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-slate-600">
                    A 6-digit verification code has been sent to:
                  </p>
                  <p className="font-medium text-slate-900">{document.signerEmail}</p>
                </div>

                {/* OTP Input */}
                <div className="flex justify-center gap-3 mb-8">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-12 h-14 text-center text-2xl font-semibold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-6">
                  <Clock className="w-4 h-4" />
                  Code expires in 14:32
                </div>

                <button className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center gap-2 mx-auto">
                  <RefreshCw className="w-4 h-4" />
                  Resend verification code
                </button>
              </>
            ) : (
              <>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800">Offline Mode</p>
                      <p className="text-sm text-amber-700">
                        Use a pre-generated verification token from your administrator.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Verification Token</label>
                  <input
                    type="text"
                    placeholder="Enter your offline verification token"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                  <Lock className="w-4 h-4" />
                  Cryptographic verification ensures authenticity without network
                </div>
              </>
            )}

            <button
              onClick={handleVerify}
              disabled={step === "verifying"}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {step === "verifying" ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Verify Identity
                </>
              )}
            </button>
          </div>
        )}

        {/* Verified - Ready to Sign */}
        {step === "verified" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">Identity Verified</h2>
              <p className="text-slate-600">
                Your identity has been confirmed. You can now sign the document.
              </p>
            </div>

            {/* Signature Method */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">Signature Method</label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: "type", label: "Type", icon: PenTool },
                  { id: "draw", label: "Draw", icon: Fingerprint },
                  { id: "upload", label: "Upload", icon: Download }
                ].map((method) => {
                  const Icon = method.icon
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSignatureType(method.id as "draw" | "type" | "upload")}
                      className={`p-4 rounded-xl border-2 transition-colors ${
                        signatureType === method.id
                          ? "border-amber-500 bg-amber-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${signatureType === method.id ? "text-amber-600" : "text-slate-400"}`} />
                      <span className={`text-sm font-medium ${signatureType === method.id ? "text-amber-600" : "text-slate-600"}`}>
                        {method.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Type Signature */}
            {signatureType === "type" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Type your full name</label>
                <input
                  type="text"
                  value={typedSignature}
                  onChange={(e) => setTypedSignature(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-lg"
                />
                {typedSignature && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-2">Signature Preview</p>
                    <p className="text-3xl text-slate-900" style={{ fontFamily: "cursive" }}>
                      {typedSignature}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Draw Signature */}
            {signatureType === "draw" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Draw your signature</label>
                <div className="h-40 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center bg-slate-50">
                  <p className="text-slate-400">Drawing pad - Use mouse or touch to sign</p>
                </div>
                <button className="mt-2 text-sm text-amber-600 hover:text-amber-700">Clear signature</button>
              </div>
            )}

            {/* Upload Signature */}
            {signatureType === "upload" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Upload signature image</label>
                <div className="h-40 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="text-center">
                    <Download className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-500">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-400">PNG, JPG up to 2MB</p>
                  </div>
                </div>
              </div>
            )}

            {/* Agreement */}
            <label className="flex items-start gap-3 mb-6 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-amber-500 focus:ring-amber-500 mt-0.5" />
              <span className="text-sm text-slate-600">
                I agree that this electronic signature is the legal equivalent of my handwritten signature and I have the authority to sign this document.
              </span>
            </label>

            <button
              onClick={handleSign}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              <PenTool className="w-5 h-5" />
              Sign Document
            </button>
          </div>
        )}

        {/* Signing */}
        {step === "signing" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <RefreshCw className="w-8 h-8 text-amber-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Processing Signature</h2>
            <p className="text-slate-600 mb-4">
              Applying your signature and generating audit trail...
            </p>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-amber-500 h-2 rounded-full animate-pulse" style={{ width: "60%" }} />
            </div>
          </div>
        )}

        {/* Complete */}
        {step === "complete" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Document Signed Successfully</h2>
            <p className="text-slate-600 mb-6">
              Your signature has been applied and the document has been sent to all parties.
            </p>

            {/* Audit Summary */}
            <div className="bg-slate-50 rounded-xl p-6 mb-6 text-left">
              <h3 className="font-semibold text-slate-900 mb-4">Signature Audit Trail</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Document ID</span>
                  <span className="font-mono text-slate-900">{document.id}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Signed At</span>
                  <span className="text-slate-900">{new Date().toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Verified Email</span>
                  <span className="text-slate-900">{document.signerEmail}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">IP Address</span>
                  <span className="font-mono text-slate-900">192.168.1.***</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Certificate</span>
                  <span className="text-green-600 font-medium">SHA-256 Verified</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 px-4 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Download Signed Copy
              </button>
              <Link
                href="/documents"
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center"
              >
                Return to Documents
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
