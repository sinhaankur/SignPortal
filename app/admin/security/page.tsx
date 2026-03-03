"use client"

import { useState } from "react"
import Link from "next/link"
import ProtectedLayout from "@/components/layouts/protected-layout"
import { useAuth } from "@/lib/auth-context"

type TabType = "oauth" | "roles" | "mfa" | "verification"

export default function AdminSecurityPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>("oauth")
  const [showSecret, setShowSecret] = useState(false)

  // OAuth Configuration
  const [oauthConfig, setOauthConfig] = useState({
    provider: "azure",
    clientId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    clientSecret: "••••••••••••••••••••••••",
    tenantId: "contoso.onmicrosoft.com",
    enabled: true,
    autoProvision: true,
    defaultRole: "user"
  })

  // MFA Settings
  const [mfaSettings, setMfaSettings] = useState({
    required: true,
    methods: ["totp", "email", "sms"],
    graceperiod: 7,
    rememberedDevices: true
  })

  // Verification Settings
  const [verificationSettings, setVerificationSettings] = useState({
    emailVerification: true,
    otpExpiry: 15,
    maxAttempts: 3,
    offlineMode: false,
    cryptographicVerification: true
  })

  const tabs = [
    { id: "oauth", label: "OAuth / SSO" },
    { id: "roles", label: "Roles & Access" },
    { id: "mfa", label: "Multi-Factor Auth" },
    { id: "verification", label: "Signature Verification" }
  ]

  const roleHierarchy = [
    {
      role: "Super Admin",
      level: "Platform",
      color: "amber",
      permissions: [
        "Complete system configuration control",
        "Enterprise onboarding & management",
        "Active Directory integration setup",
        "Security policy enforcement",
        "Database silo provisioning",
        "Audit log access and compliance monitoring"
      ],
      note: "Does not access enterprise data directly unless explicitly authorized"
    },
    {
      role: "Enterprise Admin",
      level: "Enterprise",
      color: "purple",
      permissions: [
        "Manage enterprise users and roles",
        "Configure AD/LDAP synchronization",
        "Set document policies",
        "View audit logs within enterprise",
        "Manage integrations",
        "Generate compliance reports"
      ],
      note: "Full control within their enterprise silo only"
    },
    {
      role: "Manager",
      level: "Department",
      color: "blue",
      permissions: [
        "Manage team members",
        "Create and manage workflows",
        "Approve documents",
        "View team activity",
        "Assign document permissions"
      ],
      note: "Limited to assigned departments"
    },
    {
      role: "User",
      level: "Individual",
      color: "green",
      permissions: [
        "Create and sign documents",
        "Manage personal documents",
        "Request signatures",
        "View assigned workflows"
      ],
      note: "Standard user access"
    }
  ]

  // Check role access
  const allowedRoles = ['admin', 'enterprise_admin', 'super_admin', 'platform_owner']
  if (!user?.role || !allowedRoles.includes(user.role)) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#37322f] mb-2">Access Restricted</h2>
            <p className="text-[#37322f]/60">Security settings require Admin privileges.</p>
          </div>
        </div>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#37322f]">Security & Access Control</h1>
              <p className="text-sm text-[#37322f]/60">Configure authentication, roles, and security policies</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#37322f] text-white rounded-lg hover:bg-[#4a433f] transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save Changes
          </button>
        </div>

        {/* Zero Trust Banner */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">Zero-Trust Architecture</h3>
              <p className="text-green-700 text-sm">
                SignPortal implements a zero-trust security model with tenant-isolated encryption, role-based access control (RBAC), 
                principle of least privilege, and no shared storage across enterprises. Each organization remains fully private, 
                secure, and operationally independent.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 border-b border-[#37322f]/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-4 py-2.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-[#37322f] text-white"
                  : "text-[#37322f]/60 hover:bg-[#37322f]/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* OAuth / SSO Tab */}
        {activeTab === "oauth" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
              <h3 className="text-lg font-semibold text-[#37322f] mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                OAuth 2.0 / OpenID Connect Configuration
              </h3>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="text-sm text-blue-900 font-medium">Native OAuth Support</p>
                    <p className="text-sm text-blue-700">
                      SignPortal includes built-in OAuth 2.0 / OIDC authentication supporting enterprise SSO, 
                      Azure AD, Google Workspace, and token-based secure session management.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#37322f] mb-2">Identity Provider</label>
                  <select
                    value={oauthConfig.provider}
                    onChange={(e) => setOauthConfig({...oauthConfig, provider: e.target.value})}
                    className="w-full px-4 py-3 border border-[#37322f]/10 rounded-lg text-[#37322f] focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                  >
                    <option value="azure">Azure Active Directory</option>
                    <option value="google">Google Workspace</option>
                    <option value="okta">Okta</option>
                    <option value="onelogin">OneLogin</option>
                    <option value="custom">Custom OIDC Provider</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#37322f] mb-2">Tenant ID / Domain</label>
                  <input
                    type="text"
                    value={oauthConfig.tenantId}
                    onChange={(e) => setOauthConfig({...oauthConfig, tenantId: e.target.value})}
                    className="w-full px-4 py-3 border border-[#37322f]/10 rounded-lg text-[#37322f] focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#37322f] mb-2">Client ID</label>
                  <input
                    type="text"
                    value={oauthConfig.clientId}
                    onChange={(e) => setOauthConfig({...oauthConfig, clientId: e.target.value})}
                    className="w-full px-4 py-3 border border-[#37322f]/10 rounded-lg text-[#37322f] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#37322f] mb-2">Client Secret</label>
                  <div className="relative">
                    <input
                      type={showSecret ? "text" : "password"}
                      value={oauthConfig.clientSecret}
                      onChange={(e) => setOauthConfig({...oauthConfig, clientSecret: e.target.value})}
                      className="w-full px-4 py-3 border border-[#37322f]/10 rounded-lg text-[#37322f] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#37322f]/20 pr-12"
                    />
                    <button
                      onClick={() => setShowSecret(!showSecret)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#37322f]/40 hover:text-[#37322f]"
                    >
                      {showSecret ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[#37322f]/10">
                <h4 className="font-medium text-[#37322f] mb-4">Provisioning Settings</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={oauthConfig.autoProvision}
                      onChange={(e) => setOauthConfig({...oauthConfig, autoProvision: e.target.checked})}
                      className="w-5 h-5 rounded border-[#37322f]/20 text-[#37322f] focus:ring-[#37322f]"
                    />
                    <span className="text-[#37322f]">Auto-provision users on first login</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={oauthConfig.enabled}
                      onChange={(e) => setOauthConfig({...oauthConfig, enabled: e.target.checked})}
                      className="w-5 h-5 rounded border-[#37322f]/20 text-[#37322f] focus:ring-[#37322f]"
                    />
                    <span className="text-[#37322f]">Enable SSO authentication</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Supported Providers */}
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { name: "Azure AD", status: "Connected", icon: "🔷" },
                { name: "Google Workspace", status: "Available", icon: "🟢" },
                { name: "Okta", status: "Available", icon: "🟣" },
                { name: "SAML 2.0", status: "Supported", icon: "🔐" }
              ].map((provider) => (
                <div key={provider.name} className="bg-white rounded-xl border border-[#37322f]/10 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{provider.icon}</span>
                    <span className="font-medium text-[#37322f]">{provider.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    provider.status === "Connected" ? "bg-green-100 text-green-700" : "bg-[#f7f5f3] text-[#37322f]/60"
                  }`}>
                    {provider.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Roles & Access Tab */}
        {activeTab === "roles" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
              <h3 className="text-lg font-semibold text-[#37322f] mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Role-Based Access Control (RBAC) Hierarchy
              </h3>

              <div className="space-y-4">
                {roleHierarchy.map((role, index) => (
                  <div key={role.role} className={`border rounded-xl p-6 ${
                    role.color === "amber" ? "border-amber-200 bg-amber-50" :
                    role.color === "purple" ? "border-purple-200 bg-purple-50" :
                    role.color === "blue" ? "border-blue-200 bg-blue-50" :
                    "border-green-200 bg-green-50"
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          role.color === "amber" ? "bg-amber-200" :
                          role.color === "purple" ? "bg-purple-200" :
                          role.color === "blue" ? "bg-blue-200" :
                          "bg-green-200"
                        }`}>
                          <svg className={`w-5 h-5 ${
                            role.color === "amber" ? "text-amber-700" :
                            role.color === "purple" ? "text-purple-700" :
                            role.color === "blue" ? "text-blue-700" :
                            "text-green-700"
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className={`font-semibold ${
                            role.color === "amber" ? "text-amber-900" :
                            role.color === "purple" ? "text-purple-900" :
                            role.color === "blue" ? "text-blue-900" :
                            "text-green-900"
                          }`}>{role.role}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            role.color === "amber" ? "bg-amber-200 text-amber-800" :
                            role.color === "purple" ? "bg-purple-200 text-purple-800" :
                            role.color === "blue" ? "bg-blue-200 text-blue-800" :
                            "bg-green-200 text-green-800"
                          }`}>
                            {role.level} Level
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-[#37322f]/40">Level {index + 1}</span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-[#37322f]/50 uppercase tracking-wider mb-2">Permissions</p>
                        <ul className="space-y-1">
                          {role.permissions.map((perm, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-[#37322f]/70">
                              <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {perm}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-end">
                        <p className="text-sm text-[#37322f]/50 italic">{role.note}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Access Control Philosophy */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <h4 className="font-semibold text-purple-900 mb-4">Access Control Philosophy</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <p className="font-medium text-purple-900 text-sm">Principle of Least Privilege</p>
                    <p className="text-xs text-purple-700">Users receive only necessary permissions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                  <div>
                    <p className="font-medium text-purple-900 text-sm">Tenant Isolation</p>
                    <p className="text-xs text-purple-700">No cross-enterprise data access</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <div>
                    <p className="font-medium text-purple-900 text-sm">Encrypted Access</p>
                    <p className="text-xs text-purple-700">All data encrypted at rest & transit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MFA Tab */}
        {activeTab === "mfa" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
              <h3 className="text-lg font-semibold text-[#37322f] mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Multi-Factor Authentication Settings
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center justify-between p-4 bg-[#f7f5f3] rounded-lg mb-4">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span className="text-[#37322f] font-medium">Require MFA for all users</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={mfaSettings.required}
                      onChange={(e) => setMfaSettings({...mfaSettings, required: e.target.checked})}
                      className="w-5 h-5 rounded border-[#37322f]/20 text-[#37322f] focus:ring-[#37322f]"
                    />
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-[#37322f] mb-2">Grace Period (Days)</label>
                    <input
                      type="number"
                      value={mfaSettings.graceperiod}
                      onChange={(e) => setMfaSettings({...mfaSettings, graceperiod: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 border border-[#37322f]/10 rounded-lg text-[#37322f] focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                    />
                    <p className="text-xs text-[#37322f]/50 mt-1">Days before MFA enforcement for new users</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-[#37322f] mb-3">Allowed MFA Methods</p>
                  <div className="space-y-3">
                    {[
                      { id: "totp", label: "Authenticator App (TOTP)", icon: "📱" },
                      { id: "email", label: "Email OTP", icon: "📧" },
                      { id: "sms", label: "SMS OTP", icon: "💬" },
                      { id: "fido2", label: "Hardware Security Key (FIDO2)", icon: "🔑" }
                    ].map((method) => (
                      <label key={method.id} className="flex items-center gap-3 p-3 bg-[#f7f5f3] rounded-lg cursor-pointer hover:bg-[#37322f]/5">
                        <input
                          type="checkbox"
                          checked={mfaSettings.methods.includes(method.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setMfaSettings({...mfaSettings, methods: [...mfaSettings.methods, method.id]})
                            } else {
                              setMfaSettings({...mfaSettings, methods: mfaSettings.methods.filter(m => m !== method.id)})
                            }
                          }}
                          className="w-4 h-4 rounded border-[#37322f]/20 text-[#37322f] focus:ring-[#37322f]"
                        />
                        <span className="text-lg">{method.icon}</span>
                        <span className="text-[#37322f]">{method.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Signature Verification Tab */}
        {activeTab === "verification" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
              <h3 className="text-lg font-semibold text-[#37322f] mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Email Verification for Digital Signatures
              </h3>

              {/* Online Mode */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#37322f]">Online Mode</h4>
                    <p className="text-sm text-[#37322f]/60">Standard verification with network connectivity</p>
                  </div>
                </div>

                <div className="bg-[#f7f5f3] rounded-lg p-6 space-y-3">
                  {[
                    "Email verification mandatory prior to signature execution",
                    "Secure verification link or OTP sent to signer's email",
                    "Validated identity confirmation required",
                    "Full audit trail with timestamp and IP logging"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[#37322f]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Offline Mode */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#37322f]">Offline Mode</h4>
                    <p className="text-sm text-[#37322f]/60">For on-premises or air-gapped deployments</p>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-lg p-6 space-y-3">
                  {[
                    "Pre-generated verification tokens or locally validated credentials",
                    "Cryptographic verification ensures signature authenticity",
                    "Secure sync when connectivity restored",
                    "Local audit logs maintained within enterprise silo"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[#37322f]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#37322f] mb-2">OTP Expiry (minutes)</label>
                  <input
                    type="number"
                    value={verificationSettings.otpExpiry}
                    onChange={(e) => setVerificationSettings({...verificationSettings, otpExpiry: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-[#37322f]/10 rounded-lg text-[#37322f] focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#37322f] mb-2">Max Verification Attempts</label>
                  <input
                    type="number"
                    value={verificationSettings.maxAttempts}
                    onChange={(e) => setVerificationSettings({...verificationSettings, maxAttempts: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-[#37322f]/10 rounded-lg text-[#37322f] focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  )
}
