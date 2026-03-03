"use client"

import Link from "next/link"
import { ChevronLeft, Code, Lock, FileText, Users, Key, Send, CheckCircle, XCircle, Copy, ArrowRight, ExternalLink } from "lucide-react"
import { useState } from "react"

function CodeBlock({ code, language = "json" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative bg-slate-900 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <span className="text-xs font-medium text-slate-400 uppercase">{language}</span>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
        >
          {copied ? <CheckCircle className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm text-slate-300">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function EndpointCard({ method, endpoint, description, children }: { 
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  endpoint: string
  description: string
  children: React.ReactNode
}) {
  const methodColors = {
    GET: "bg-green-100 text-green-700 border-green-200",
    POST: "bg-blue-100 text-blue-700 border-blue-200",
    PUT: "bg-yellow-100 text-yellow-700 border-yellow-200",
    DELETE: "bg-red-100 text-red-700 border-red-200",
    PATCH: "bg-purple-100 text-purple-700 border-purple-200"
  }

  return (
    <div className="bg-white rounded-xl border border-[#37322f]/10 overflow-hidden">
      <div className="p-6 border-b border-[#37322f]/10">
        <div className="flex items-center gap-3 mb-3">
          <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${methodColors[method]}`}>
            {method}
          </span>
          <code className="text-sm font-mono text-[#37322f]/80 bg-slate-100 px-3 py-1 rounded-lg">{endpoint}</code>
        </div>
        <p className="text-[#37322f]/70">{description}</p>
      </div>
      <div className="p-6 bg-slate-50">
        {children}
      </div>
    </div>
  )
}

export default function APIReferencePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFCFB] to-white">
      {/* Header */}
      <header className="border-b border-[#37322f]/10 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#37322f] hover:text-[#37322f]/70 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/docs/architecture" className="text-sm text-[#37322f]/70 hover:text-[#37322f]">Architecture Guide</Link>
            <Link href="/docs/deployment" className="text-sm text-[#37322f]/70 hover:text-[#37322f]">Deployment Guide</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Code className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">Documentation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#37322f] mb-6">API Reference</h1>
          <p className="text-xl text-[#37322f]/70 max-w-[700px] mb-8">
            Complete REST API documentation for integrating SignPortal into your applications and workflows.
          </p>
          
          {/* Base URL */}
          <div className="inline-flex items-center gap-3 bg-slate-100 rounded-xl px-6 py-4">
            <span className="text-sm font-semibold text-slate-600">Base URL:</span>
            <code className="text-sm font-mono text-purple-600">https://your-signportal-instance.com/api/v1</code>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8 border-y border-[#37322f]/10 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="text-sm font-semibold text-[#37322f]/60 uppercase tracking-wider mb-4">API Endpoints</h2>
          <div className="grid md:grid-cols-5 gap-4">
            <a href="#authentication" className="p-4 rounded-lg border border-[#37322f]/10 hover:border-purple-300 hover:bg-purple-50/50 transition-all group">
              <Lock className="w-5 h-5 text-[#37322f]/40 group-hover:text-purple-600 mb-2" />
              <span className="text-sm font-medium text-[#37322f] group-hover:text-purple-600">Authentication</span>
            </a>
            <a href="#documents" className="p-4 rounded-lg border border-[#37322f]/10 hover:border-purple-300 hover:bg-purple-50/50 transition-all group">
              <FileText className="w-5 h-5 text-[#37322f]/40 group-hover:text-purple-600 mb-2" />
              <span className="text-sm font-medium text-[#37322f] group-hover:text-purple-600">Documents</span>
            </a>
            <a href="#signatures" className="p-4 rounded-lg border border-[#37322f]/10 hover:border-purple-300 hover:bg-purple-50/50 transition-all group">
              <Key className="w-5 h-5 text-[#37322f]/40 group-hover:text-purple-600 mb-2" />
              <span className="text-sm font-medium text-[#37322f] group-hover:text-purple-600">Signatures</span>
            </a>
            <a href="#workflows" className="p-4 rounded-lg border border-[#37322f]/10 hover:border-purple-300 hover:bg-purple-50/50 transition-all group">
              <Send className="w-5 h-5 text-[#37322f]/40 group-hover:text-purple-600 mb-2" />
              <span className="text-sm font-medium text-[#37322f] group-hover:text-purple-600">Workflows</span>
            </a>
            <a href="#users" className="p-4 rounded-lg border border-[#37322f]/10 hover:border-purple-300 hover:bg-purple-50/50 transition-all group">
              <Users className="w-5 h-5 text-[#37322f]/40 group-hover:text-purple-600 mb-2" />
              <span className="text-sm font-medium text-[#37322f] group-hover:text-purple-600">Users</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid lg:grid-cols-[1fr,300px] gap-12">
            {/* Content */}
            <div className="space-y-16">
              {/* Authentication */}
              <div id="authentication" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-[#37322f] mb-6 flex items-center gap-3">
                  <Lock className="w-6 h-6 text-purple-600" />
                  Authentication
                </h2>
                <p className="text-[#37322f]/70 mb-8">
                  SignPortal uses JWT (JSON Web Tokens) for API authentication. Include your token in the Authorization header for all authenticated requests.
                </p>

                <div className="space-y-6">
                  <EndpointCard method="POST" endpoint="/auth/login" description="Authenticate a user and receive a JWT token.">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-[#37322f] mb-2">Request Body</h4>
                        <CodeBlock 
                          language="json"
                          code={`{
  "username": "user@company.com",
  "password": "********",
  "domain": "COMPANY"  // Optional: for LDAP authentication
}`} 
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#37322f] mb-2">Response</h4>
                        <CodeBlock 
                          language="json"
                          code={`{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJSUzI1NiIs...",
    "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2...",
    "expiresIn": 3600,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@company.com",
      "name": "John Doe",
      "role": "user"
    }
  }
}`} 
                        />
                      </div>
                    </div>
                  </EndpointCard>

                  <EndpointCard method="POST" endpoint="/auth/refresh" description="Refresh an expired access token.">
                    <CodeBlock 
                      language="json"
                      code={`{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2..."
}`} 
                    />
                  </EndpointCard>

                  <EndpointCard method="POST" endpoint="/auth/logout" description="Invalidate the current session.">
                    <div className="text-sm text-[#37322f]/70">
                      <p>Requires <code className="bg-slate-200 px-2 py-0.5 rounded">Authorization: Bearer &lt;token&gt;</code> header.</p>
                    </div>
                  </EndpointCard>
                </div>
              </div>

              {/* Documents */}
              <div id="documents" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-[#37322f] mb-6 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-purple-600" />
                  Documents
                </h2>
                <p className="text-[#37322f]/70 mb-8">
                  Manage documents, upload files, and track document status through the documents API.
                </p>

                <div className="space-y-6">
                  <EndpointCard method="POST" endpoint="/documents/upload" description="Upload a new document for signature processing.">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-[#37322f] mb-2">Request (multipart/form-data)</h4>
                        <CodeBlock 
                          language="http"
                          code={`POST /api/v1/documents/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <binary>
name: "Contract-2026-001.pdf"
classification: "CONFIDENTIAL"
type: "CONTRACT"
description: "Service agreement with Acme Corp"
tags: ["legal", "vendor", "2026"]`} 
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#37322f] mb-2">Response</h4>
                        <CodeBlock 
                          language="json"
                          code={`{
  "success": true,
  "data": {
    "documentId": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Contract-2026-001.pdf",
    "classification": "CONFIDENTIAL",
    "status": "UPLOADED",
    "createdAt": "2026-03-03T10:30:00Z"
  }
}`} 
                        />
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <h5 className="text-sm font-semibold text-amber-800 mb-1">Classification Levels</h5>
                        <p className="text-sm text-amber-700">PUBLIC, INTERNAL, CONFIDENTIAL, RESTRICTED</p>
                      </div>
                    </div>
                  </EndpointCard>

                  <EndpointCard method="GET" endpoint="/documents" description="List all documents with pagination and filtering.">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-[#37322f] mb-2">Query Parameters</h4>
                        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-slate-100">
                              <tr>
                                <th className="text-left py-2 px-4 font-semibold">Parameter</th>
                                <th className="text-left py-2 px-4 font-semibold">Type</th>
                                <th className="text-left py-2 px-4 font-semibold">Description</th>
                              </tr>
                            </thead>
                            <tbody className="text-[#37322f]/70">
                              <tr className="border-t border-slate-100">
                                <td className="py-2 px-4 font-mono text-purple-600">page</td>
                                <td className="py-2 px-4">integer</td>
                                <td className="py-2 px-4">Page number (default: 1)</td>
                              </tr>
                              <tr className="border-t border-slate-100">
                                <td className="py-2 px-4 font-mono text-purple-600">limit</td>
                                <td className="py-2 px-4">integer</td>
                                <td className="py-2 px-4">Items per page (default: 20)</td>
                              </tr>
                              <tr className="border-t border-slate-100">
                                <td className="py-2 px-4 font-mono text-purple-600">status</td>
                                <td className="py-2 px-4">string</td>
                                <td className="py-2 px-4">Filter by status</td>
                              </tr>
                              <tr className="border-t border-slate-100">
                                <td className="py-2 px-4 font-mono text-purple-600">classification</td>
                                <td className="py-2 px-4">string</td>
                                <td className="py-2 px-4">Filter by classification</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </EndpointCard>

                  <EndpointCard method="GET" endpoint="/documents/{id}" description="Get details of a specific document.">
                    <CodeBlock 
                      language="json"
                      code={`{
  "success": true,
  "data": {
    "documentId": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Contract-2026-001.pdf",
    "classification": "CONFIDENTIAL",
    "status": "PENDING_SIGNATURE",
    "signers": [
      {
        "email": "signer@example.com",
        "status": "PENDING",
        "order": 1
      }
    ],
    "createdAt": "2026-03-03T10:30:00Z"
  }
}`} 
                    />
                  </EndpointCard>

                  <EndpointCard method="DELETE" endpoint="/documents/{id}" description="Delete a document (if not signed).">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h5 className="text-sm font-semibold text-red-800 mb-1">Warning</h5>
                      <p className="text-sm text-red-700">Documents that have been signed cannot be deleted for compliance reasons.</p>
                    </div>
                  </EndpointCard>
                </div>
              </div>

              {/* Signatures */}
              <div id="signatures" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-[#37322f] mb-6 flex items-center gap-3">
                  <Key className="w-6 h-6 text-purple-600" />
                  Signatures
                </h2>
                <p className="text-[#37322f]/70 mb-8">
                  Request signatures, track signing progress, and manage signature workflows.
                </p>

                <div className="space-y-6">
                  <EndpointCard method="POST" endpoint="/signatures/request" description="Create a signature request for a document.">
                    <div className="space-y-4">
                      <CodeBlock 
                        language="json"
                        code={`{
  "documentId": "550e8400-e29b-41d4-a716-446655440001",
  "signers": [
    {
      "email": "signer1@company.com",
      "name": "John Doe",
      "order": 1,
      "role": "APPROVER"
    },
    {
      "email": "signer2@company.com",
      "name": "Jane Smith",
      "order": 2,
      "role": "WITNESS"
    }
  ],
  "message": "Please review and sign this contract",
  "dueDate": "2026-03-10T23:59:59Z",
  "reminderDays": [3, 1]
}`} 
                      />
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h5 className="text-sm font-semibold text-blue-800 mb-1">Signer Roles</h5>
                        <p className="text-sm text-blue-700">SIGNER, APPROVER, REVIEWER, WITNESS, CARBON_COPY</p>
                      </div>
                    </div>
                  </EndpointCard>

                  <EndpointCard method="GET" endpoint="/signatures/{requestId}/status" description="Get the current status of a signature request.">
                    <CodeBlock 
                      language="json"
                      code={`{
  "success": true,
  "data": {
    "requestId": "sig-123456",
    "documentId": "550e8400-e29b-41d4-a716-446655440001",
    "status": "IN_PROGRESS",
    "progress": {
      "total": 2,
      "completed": 1,
      "pending": 1
    },
    "signers": [
      {
        "email": "signer1@company.com",
        "status": "SIGNED",
        "signedAt": "2026-03-03T14:30:00Z"
      },
      {
        "email": "signer2@company.com",
        "status": "PENDING"
      }
    ]
  }
}`} 
                    />
                  </EndpointCard>
                </div>
              </div>

              {/* Workflows */}
              <div id="workflows" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-[#37322f] mb-6 flex items-center gap-3">
                  <Send className="w-6 h-6 text-purple-600" />
                  Workflows
                </h2>
                <p className="text-[#37322f]/70 mb-8">
                  Create and manage document approval workflows with routing rules.
                </p>

                <div className="space-y-6">
                  <EndpointCard method="POST" endpoint="/workflows" description="Create a new workflow template.">
                    <CodeBlock 
                      language="json"
                      code={`{
  "name": "Contract Approval Workflow",
  "description": "Standard contract approval process",
  "steps": [
    {
      "name": "Manager Review",
      "type": "APPROVAL",
      "assignees": ["manager@company.com"],
      "timeout": 72
    },
    {
      "name": "Legal Review",
      "type": "APPROVAL",
      "assignees": ["legal@company.com"],
      "condition": {
        "field": "contractValue",
        "operator": ">=",
        "value": 10000
      }
    },
    {
      "name": "Final Signature",
      "type": "SIGNATURE",
      "assignees": ["director@company.com"]
    }
  ]
}`} 
                    />
                  </EndpointCard>

                  <EndpointCard method="POST" endpoint="/workflows/{id}/trigger" description="Trigger a workflow for a document.">
                    <CodeBlock 
                      language="json"
                      code={`{
  "documentId": "550e8400-e29b-41d4-a716-446655440001",
  "initiator": "user@company.com",
  "variables": {
    "contractValue": 25000,
    "department": "Sales"
  }
}`} 
                    />
                  </EndpointCard>
                </div>
              </div>

              {/* Users */}
              <div id="users" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-[#37322f] mb-6 flex items-center gap-3">
                  <Users className="w-6 h-6 text-purple-600" />
                  Users
                </h2>
                <p className="text-[#37322f]/70 mb-8">
                  Manage users, roles, and permissions (requires admin privileges).
                </p>

                <div className="space-y-6">
                  <EndpointCard method="GET" endpoint="/users" description="List all users in the organization.">
                    <CodeBlock 
                      language="json"
                      code={`{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user-123",
        "email": "john@company.com",
        "name": "John Doe",
        "role": "admin",
        "department": "IT",
        "status": "active"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150
    }
  }
}`} 
                    />
                  </EndpointCard>

                  <EndpointCard method="POST" endpoint="/users" description="Create a new user account.">
                    <CodeBlock 
                      language="json"
                      code={`{
  "email": "newuser@company.com",
  "name": "New User",
  "role": "user",
  "department": "Sales",
  "sendInvite": true
}`} 
                    />
                  </EndpointCard>
                </div>
              </div>

              {/* Error Responses */}
              <div className="bg-red-50 rounded-2xl p-8 border border-red-200">
                <h3 className="text-xl font-semibold text-red-800 mb-4 flex items-center gap-2">
                  <XCircle className="w-6 h-6" />
                  Error Responses
                </h3>
                <p className="text-red-700 mb-6">All API errors follow a consistent format:</p>
                <CodeBlock 
                  language="json"
                  code={`{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "The access token has expired",
    "details": {
      "expiredAt": "2026-03-03T12:00:00Z"
    }
  }
}`} 
                />
                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-red-100">
                    <h4 className="font-medium text-red-800 mb-2">Common Error Codes</h4>
                    <ul className="space-y-1 text-sm text-red-700">
                      <li><code className="bg-red-100 px-1 rounded">401</code> - Unauthorized</li>
                      <li><code className="bg-red-100 px-1 rounded">403</code> - Forbidden</li>
                      <li><code className="bg-red-100 px-1 rounded">404</code> - Not Found</li>
                      <li><code className="bg-red-100 px-1 rounded">422</code> - Validation Error</li>
                      <li><code className="bg-red-100 px-1 rounded">429</code> - Rate Limited</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-red-100">
                    <h4 className="font-medium text-red-800 mb-2">Rate Limits</h4>
                    <ul className="space-y-1 text-sm text-red-700">
                      <li>• 1000 requests per minute (standard)</li>
                      <li>• 100 requests per minute (uploads)</li>
                      <li>• Rate limit headers included in responses</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                <h3 className="text-xl font-semibold text-[#37322f] mb-4">Next Steps</h3>
                <p className="text-[#37322f]/70 mb-6">Continue exploring the SignPortal documentation:</p>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    href="/docs/architecture" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Architecture Guide
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <Link 
                    href="/docs/deployment" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Deployment Guide
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
                  <h3 className="font-semibold text-[#37322f] mb-4">API Endpoints</h3>
                  <nav className="space-y-2">
                    <a href="#authentication" className="block text-sm text-[#37322f]/60 hover:text-purple-600 transition-colors">Authentication</a>
                    <a href="#documents" className="block text-sm text-[#37322f]/60 hover:text-purple-600 transition-colors">Documents</a>
                    <a href="#signatures" className="block text-sm text-[#37322f]/60 hover:text-purple-600 transition-colors">Signatures</a>
                    <a href="#workflows" className="block text-sm text-[#37322f]/60 hover:text-purple-600 transition-colors">Workflows</a>
                    <a href="#users" className="block text-sm text-[#37322f]/60 hover:text-purple-600 transition-colors">Users</a>
                  </nav>
                </div>

                <div className="bg-purple-50 rounded-xl border border-purple-200 p-6">
                  <h3 className="font-semibold text-purple-800 mb-2">API Support</h3>
                  <p className="text-sm text-purple-700 mb-4">Need help integrating? Our team is here to assist.</p>
                  <Link href="/support" className="text-sm font-medium text-purple-600 hover:text-purple-700">
                    Contact Support →
                  </Link>
                </div>

                <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
                  <h3 className="font-semibold text-[#37322f] mb-3">Quick Reference</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[#37322f]/60">Auth Type</span>
                      <span className="font-mono text-[#37322f]">Bearer JWT</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#37322f]/60">Content Type</span>
                      <span className="font-mono text-[#37322f]">JSON</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#37322f]/60">API Version</span>
                      <span className="font-mono text-[#37322f]">v1</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#37322f]/10 py-8">
        <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#37322f]/60">© 2026 SignPortal. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/docs/architecture" className="text-sm text-[#37322f]/60 hover:text-[#37322f]">Architecture Guide</Link>
            <Link href="/docs/deployment" className="text-sm text-[#37322f]/60 hover:text-[#37322f]">Deployment Guide</Link>
            <Link href="/support" className="text-sm text-[#37322f]/60 hover:text-[#37322f]">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
