"use client"

import Link from "next/link"
import { ChevronLeft, Server, Database, Shield, Users, FileText, Workflow, Layers, GitBranch, ArrowRight, ExternalLink } from "lucide-react"

export default function ArchitecturePage() {
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
            <Link href="/docs/api-reference" className="text-sm text-[#37322f]/70 hover:text-[#37322f]">API Reference</Link>
            <Link href="/docs/deployment" className="text-sm text-[#37322f]/70 hover:text-[#37322f]">Deployment Guide</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Layers className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Documentation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#37322f] mb-6">Architecture Guide</h1>
          <p className="text-xl text-[#37322f]/70 max-w-[700px]">
            Understand the system architecture, components, and deployment options for SignPortal on-premises installation.
          </p>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8 border-y border-[#37322f]/10 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="text-sm font-semibold text-[#37322f]/60 uppercase tracking-wider mb-4">Contents</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <a href="#overview" className="p-4 rounded-lg border border-[#37322f]/10 hover:border-blue-300 hover:bg-blue-50/50 transition-all group">
              <span className="text-sm font-medium text-[#37322f] group-hover:text-blue-600">1. System Overview</span>
            </a>
            <a href="#process-layer" className="p-4 rounded-lg border border-[#37322f]/10 hover:border-blue-300 hover:bg-blue-50/50 transition-all group">
              <span className="text-sm font-medium text-[#37322f] group-hover:text-blue-600">2. Process Layer</span>
            </a>
            <a href="#data-layer" className="p-4 rounded-lg border border-[#37322f]/10 hover:border-blue-300 hover:bg-blue-50/50 transition-all group">
              <span className="text-sm font-medium text-[#37322f] group-hover:text-blue-600">3. Data Layer</span>
            </a>
            <a href="#security" className="p-4 rounded-lg border border-[#37322f]/10 hover:border-blue-300 hover:bg-blue-50/50 transition-all group">
              <span className="text-sm font-medium text-[#37322f] group-hover:text-blue-600">4. Security Architecture</span>
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
              {/* System Overview */}
              <div id="overview" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-[#37322f] mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">1</span>
                  System Overview
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-[#37322f]/70 leading-relaxed mb-6">
                    SignPortal is an on-premises e-signature and document lifecycle platform built with a modern, layered architecture. 
                    The system is designed for enterprise deployments with high security, scalability, and integration requirements.
                  </p>
                  
                  {/* Architecture Diagram */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 my-8 border border-slate-200">
                    <h4 className="text-sm font-semibold text-slate-600 mb-6 uppercase tracking-wider">High-Level Architecture</h4>
                    <div className="space-y-4">
                      {/* Presentation Layer */}
                      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h5 className="font-semibold text-slate-800">Presentation Layer</h5>
                            <p className="text-sm text-slate-500">User Interface & Experience</p>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-3">
                          <div className="bg-blue-50 rounded-lg p-3 text-center">
                            <span className="text-sm font-medium text-blue-700">Web Application</span>
                            <p className="text-xs text-blue-600 mt-1">Next.js + React</p>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-3 text-center">
                            <span className="text-sm font-medium text-blue-700">REST API</span>
                            <p className="text-xs text-blue-600 mt-1">Integration Endpoints</p>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-3 text-center">
                            <span className="text-sm font-medium text-blue-700">Mobile Support</span>
                            <p className="text-xs text-blue-600 mt-1">Responsive Design</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <ArrowRight className="w-5 h-5 text-slate-400 rotate-90" />
                      </div>

                      {/* Application Layer */}
                      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Server className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h5 className="font-semibold text-slate-800">Application Layer</h5>
                            <p className="text-sm text-slate-500">Business Logic & Processing</p>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-4 gap-3">
                          <div className="bg-purple-50 rounded-lg p-3 text-center">
                            <span className="text-sm font-medium text-purple-700">Document Engine</span>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-3 text-center">
                            <span className="text-sm font-medium text-purple-700">Signature Service</span>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-3 text-center">
                            <span className="text-sm font-medium text-purple-700">Workflow Engine</span>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-3 text-center">
                            <span className="text-sm font-medium text-purple-700">Notification Service</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <ArrowRight className="w-5 h-5 text-slate-400 rotate-90" />
                      </div>

                      {/* Data Layer */}
                      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Database className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h5 className="font-semibold text-slate-800">Data Layer</h5>
                            <p className="text-sm text-slate-500">Storage & Persistence</p>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-3">
                          <div className="bg-green-50 rounded-lg p-3 text-center">
                            <span className="text-sm font-medium text-green-700">MySQL Database</span>
                            <p className="text-xs text-green-600 mt-1">Primary Storage</p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-3 text-center">
                            <span className="text-sm font-medium text-green-700">Redis Cache</span>
                            <p className="text-xs text-green-600 mt-1">Session & Queue</p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-3 text-center">
                            <span className="text-sm font-medium text-green-700">File Storage</span>
                            <p className="text-xs text-green-600 mt-1">Document Repository</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Process Layer */}
              <div id="process-layer" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-[#37322f] mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">2</span>
                  Process Layer
                </h2>
                <div className="space-y-8">
                  <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
                    <h3 className="text-lg font-semibold text-[#37322f] mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Web Application (Next.js Frontend)
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-[#37322f] mb-3">Technology Stack</h4>
                        <ul className="space-y-2 text-[#37322f]/70">
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            Next.js 14 with App Router
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            React 18 with TypeScript
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            Tailwind CSS for styling
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            shadcn/ui component library
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-[#37322f] mb-3">Key Features</h4>
                        <ul className="space-y-2 text-[#37322f]/70">
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Drag & Drop Form Builder
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Visual Workflow Designer
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Real-time Document Preview
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Role-based Access Control
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
                    <h3 className="text-lg font-semibold text-[#37322f] mb-4 flex items-center gap-2">
                      <Workflow className="w-5 h-5 text-purple-600" />
                      Workflow Engine
                    </h3>
                    <p className="text-[#37322f]/70 mb-4">
                      SignPortal supports complex approval workflows with sequential, parallel, and conditional routing:
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-slate-50 rounded-lg p-4">
                        <h5 className="font-medium text-[#37322f] mb-2">Sequential Flow</h5>
                        <p className="text-sm text-[#37322f]/60">Documents move through approvers one after another in order.</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4">
                        <h5 className="font-medium text-[#37322f] mb-2">Parallel Flow</h5>
                        <p className="text-sm text-[#37322f]/60">Multiple approvers can review simultaneously, reducing cycle time.</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4">
                        <h5 className="font-medium text-[#37322f] mb-2">Conditional Flow</h5>
                        <p className="text-sm text-[#37322f]/60">Route based on document value, type, or department rules.</p>
                      </div>
                    </div>
                  </div>

                  {/* Supported Field Types */}
                  <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
                    <h3 className="text-lg font-semibold text-[#37322f] mb-4">Supported Field Types (17+ types)</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[#37322f]/10">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-[#37322f]">Category</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-[#37322f]">Field Types</th>
                          </tr>
                        </thead>
                        <tbody className="text-[#37322f]/70">
                          <tr className="border-b border-[#37322f]/5">
                            <td className="py-3 px-4 font-medium">Text Inputs</td>
                            <td className="py-3 px-4">Short Text, Long Text, Email, Phone, URL, Number</td>
                          </tr>
                          <tr className="border-b border-[#37322f]/5">
                            <td className="py-3 px-4 font-medium">Selection</td>
                            <td className="py-3 px-4">Dropdown, Multiple Choice, Checkboxes, Yes/No</td>
                          </tr>
                          <tr className="border-b border-[#37322f]/5">
                            <td className="py-3 px-4 font-medium">Date & Time</td>
                            <td className="py-3 px-4">Date Picker, Time Picker, DateTime</td>
                          </tr>
                          <tr className="border-b border-[#37322f]/5">
                            <td className="py-3 px-4 font-medium">Media</td>
                            <td className="py-3 px-4">File Upload, Image Upload, Signature</td>
                          </tr>
                          <tr className="border-b border-[#37322f]/5">
                            <td className="py-3 px-4 font-medium">Layout</td>
                            <td className="py-3 px-4">Section Header, Paragraph, Page Break</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-medium">Advanced</td>
                            <td className="py-3 px-4">Rating Scale, Matrix/Grid, Calculations</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Layer */}
              <div id="data-layer" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-[#37322f] mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">3</span>
                  Data Layer
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                      <Database className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#37322f] mb-2">MySQL Database</h3>
                    <p className="text-[#37322f]/70 mb-4">Primary relational database for all structured data.</p>
                    <ul className="space-y-2 text-sm text-[#37322f]/60">
                      <li>• User accounts and permissions</li>
                      <li>• Document metadata and relationships</li>
                      <li>• Workflow definitions and states</li>
                      <li>• Audit logs and compliance records</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                      <Server className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#37322f] mb-2">Redis Cache</h3>
                    <p className="text-[#37322f]/70 mb-4">In-memory data store for performance optimization.</p>
                    <ul className="space-y-2 text-sm text-[#37322f]/60">
                      <li>• Session management</li>
                      <li>• API rate limiting</li>
                      <li>• Background job queues</li>
                      <li>• Real-time notifications</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Security Architecture */}
              <div id="security" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-[#37322f] mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">4</span>
                  Security Architecture
                </h2>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-8 h-8 text-amber-600" />
                    <h3 className="text-xl font-semibold text-[#37322f]">Enterprise-Grade Security</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-[#37322f] mb-3">Authentication</h4>
                      <ul className="space-y-2 text-[#37322f]/70">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                          LDAP/Active Directory Integration
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                          SAML 2.0 Single Sign-On
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                          Multi-Factor Authentication
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                          JWT Token-based Sessions
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#37322f] mb-3">Data Protection</h4>
                      <ul className="space-y-2 text-[#37322f]/70">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                          AES-256 Encryption at Rest
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                          TLS 1.3 Encryption in Transit
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                          HSM Key Management
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                          Cryptographic Signature Sealing
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                <h3 className="text-xl font-semibold text-[#37322f] mb-4">Next Steps</h3>
                <p className="text-[#37322f]/70 mb-6">Continue exploring the SignPortal documentation:</p>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    href="/docs/api-reference" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    API Reference
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
                  <h3 className="font-semibold text-[#37322f] mb-4">On This Page</h3>
                  <nav className="space-y-2">
                    <a href="#overview" className="block text-sm text-[#37322f]/60 hover:text-blue-600 transition-colors">System Overview</a>
                    <a href="#process-layer" className="block text-sm text-[#37322f]/60 hover:text-blue-600 transition-colors">Process Layer</a>
                    <a href="#data-layer" className="block text-sm text-[#37322f]/60 hover:text-blue-600 transition-colors">Data Layer</a>
                    <a href="#security" className="block text-sm text-[#37322f]/60 hover:text-blue-600 transition-colors">Security Architecture</a>
                  </nav>
                </div>

                <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                  <h3 className="font-semibold text-blue-800 mb-2">Need Help?</h3>
                  <p className="text-sm text-blue-700 mb-4">Contact our support team for assistance with architecture planning.</p>
                  <Link href="/support" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    Contact Support →
                  </Link>
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
            <Link href="/docs/api-reference" className="text-sm text-[#37322f]/60 hover:text-[#37322f]">API Reference</Link>
            <Link href="/docs/deployment" className="text-sm text-[#37322f]/60 hover:text-[#37322f]">Deployment Guide</Link>
            <Link href="/support" className="text-sm text-[#37322f]/60 hover:text-[#37322f]">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
