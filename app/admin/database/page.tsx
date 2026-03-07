'use client'

import { useState, useEffect } from 'react'
import ProtectedLayout from '@/components/layouts/protected-layout'
import { useAuth } from '@/lib/auth-context'

type DatabaseType = 'postgresql' | 'mysql' | 'mongodb' | 'sqlite' | 'mssql'

interface DatabaseConfig {
  type: DatabaseType
  host: string
  port: string
  database: string
  username: string
  password: string
  ssl: boolean
  connectionString?: string
}

const DATABASE_TYPES: { id: DatabaseType; name: string; defaultPort: string; icon: string }[] = [
  { id: 'postgresql', name: 'PostgreSQL', defaultPort: '5432', icon: '🐘' },
  { id: 'mysql', name: 'MySQL / MariaDB', defaultPort: '3306', icon: '🐬' },
  { id: 'mongodb', name: 'MongoDB', defaultPort: '27017', icon: '🍃' },
  { id: 'mssql', name: 'SQL Server', defaultPort: '1433', icon: '📊' },
  { id: 'sqlite', name: 'SQLite (Local)', defaultPort: '', icon: '📁' },
]

export default function DatabaseConfigPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'connection' | 'backup' | 'migration'>('connection')
  const [config, setConfig] = useState<DatabaseConfig>({
    type: 'postgresql',
    host: 'localhost',
    port: '5432',
    database: 'signportal',
    username: '',
    password: '',
    ssl: true,
  })
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [useConnectionString, setUseConnectionString] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [testMessage, setTestMessage] = useState('')

  // Only allow admin roles
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
            <p className="text-[#37322f]/60">Database configuration requires Admin privileges.</p>
          </div>
        </div>
      </ProtectedLayout>
    )
  }

  const handleTestConnection = async () => {
    setConnectionStatus('testing')
    setTestMessage('Testing connection...')
    
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In production, this would make an API call to test the connection
    const success = config.host && config.database && (config.username || config.type === 'sqlite')
    
    if (success) {
      setConnectionStatus('success')
      setTestMessage('Connection successful! Database is accessible.')
    } else {
      setConnectionStatus('error')
      setTestMessage('Connection failed. Please check your credentials.')
    }
  }

  const handleSaveConfig = () => {
    // In production, this would save to secure configuration storage
    console.log('Saving database config:', { ...config, password: '***' })
    alert('Database configuration saved successfully!')
  }

  const handleDatabaseTypeChange = (type: DatabaseType) => {
    const dbType = DATABASE_TYPES.find(d => d.id === type)
    setConfig({
      ...config,
      type,
      port: dbType?.defaultPort || '',
    })
    setConnectionStatus('idle')
  }

  return (
    <ProtectedLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#37322f]">Database Configuration</h1>
              <p className="text-sm text-[#37322f]/60">Configure your enterprise database connection</p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 text-sm">Enterprise On-Premises Database</h3>
            <p className="text-sm text-blue-700">
              Connect SignPortal to your own database for complete data sovereignty. 
              All documents and signatures will be stored in your infrastructure.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[#37322f]/10 pb-2">
          {[
            { id: 'connection', label: 'Connection', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
            { id: 'backup', label: 'Backup & Restore', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
            { id: 'migration', label: 'Data Migration', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#37322f] text-white'
                  : 'text-[#37322f]/60 hover:bg-[#37322f]/5'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Connection Tab */}
        {activeTab === 'connection' && (
          <div className="space-y-6">
            {/* Database Type Selection */}
            <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
              <h2 className="font-semibold text-[#37322f] mb-4">Database Type</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {DATABASE_TYPES.map((db) => (
                  <button
                    key={db.id}
                    onClick={() => handleDatabaseTypeChange(db.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      config.type === db.id
                        ? 'border-[#37322f] bg-[#37322f]/5'
                        : 'border-[#37322f]/10 hover:border-[#37322f]/30'
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{db.icon}</span>
                    <span className="text-sm font-medium text-[#37322f]">{db.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Connection Details */}
            <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-[#37322f]">Connection Details</h2>
                <label className="flex items-center gap-2 text-sm text-[#37322f]/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useConnectionString}
                    onChange={(e) => setUseConnectionString(e.target.checked)}
                    className="rounded border-[#37322f]/20 text-[#37322f] focus:ring-[#37322f]"
                  />
                  Use connection string
                </label>
              </div>

              {useConnectionString ? (
                <div>
                  <label className="block text-sm font-medium text-[#37322f] mb-2">
                    Connection String
                  </label>
                  <input
                    type="text"
                    value={config.connectionString || ''}
                    onChange={(e) => setConfig({ ...config, connectionString: e.target.value })}
                    placeholder={`${config.type}://username:password@host:port/database`}
                    className="w-full px-4 py-3 border border-[#37322f]/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20 font-mono text-sm"
                  />
                  <p className="text-xs text-[#37322f]/50 mt-2">
                    Example: postgresql://user:pass@localhost:5432/signportal?sslmode=require
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#37322f] mb-2">Host</label>
                    <input
                      type="text"
                      value={config.host}
                      onChange={(e) => setConfig({ ...config, host: e.target.value })}
                      placeholder="localhost or IP address"
                      className="w-full px-4 py-2.5 border border-[#37322f]/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#37322f] mb-2">Port</label>
                    <input
                      type="text"
                      value={config.port}
                      onChange={(e) => setConfig({ ...config, port: e.target.value })}
                      placeholder={DATABASE_TYPES.find(d => d.id === config.type)?.defaultPort}
                      className="w-full px-4 py-2.5 border border-[#37322f]/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#37322f] mb-2">Database Name</label>
                    <input
                      type="text"
                      value={config.database}
                      onChange={(e) => setConfig({ ...config, database: e.target.value })}
                      placeholder="signportal"
                      className="w-full px-4 py-2.5 border border-[#37322f]/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#37322f] mb-2">Username</label>
                    <input
                      type="text"
                      value={config.username}
                      onChange={(e) => setConfig({ ...config, username: e.target.value })}
                      placeholder="Database username"
                      className="w-full px-4 py-2.5 border border-[#37322f]/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#37322f] mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={config.password}
                        onChange={(e) => setConfig({ ...config, password: e.target.value })}
                        placeholder="Database password"
                        className="w-full px-4 py-2.5 border border-[#37322f]/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322f]/20 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#37322f]/40 hover:text-[#37322f]"
                      >
                        {showPassword ? (
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
              )}

              {/* SSL Option */}
              <div className="mt-4 pt-4 border-t border-[#37322f]/10">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.ssl}
                    onChange={(e) => setConfig({ ...config, ssl: e.target.checked })}
                    className="w-5 h-5 rounded border-[#37322f]/20 text-[#37322f] focus:ring-[#37322f]"
                  />
                  <div>
                    <span className="font-medium text-[#37322f]">Enable SSL/TLS</span>
                    <p className="text-sm text-[#37322f]/50">Encrypt data in transit (recommended)</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Connection Test & Save */}
            <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-[#37322f]">Test Connection</h2>
                  <p className="text-sm text-[#37322f]/60">Verify your database is accessible</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleTestConnection}
                    disabled={connectionStatus === 'testing'}
                    className="px-4 py-2 border border-[#37322f]/20 text-[#37322f] rounded-lg hover:bg-[#37322f]/5 transition-colors disabled:opacity-50"
                  >
                    {connectionStatus === 'testing' ? 'Testing...' : 'Test Connection'}
                  </button>
                  <button
                    onClick={handleSaveConfig}
                    className="px-4 py-2 bg-[#37322f] text-white rounded-lg hover:bg-[#4a433f] transition-colors"
                  >
                    Save Configuration
                  </button>
                </div>
              </div>

              {connectionStatus !== 'idle' && (
                <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
                  connectionStatus === 'testing' ? 'bg-blue-50 text-blue-700' :
                  connectionStatus === 'success' ? 'bg-green-50 text-green-700' :
                  'bg-red-50 text-red-700'
                }`}>
                  {connectionStatus === 'testing' && (
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  )}
                  {connectionStatus === 'success' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {connectionStatus === 'error' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span className="text-sm font-medium">{testMessage}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Backup Tab */}
        {activeTab === 'backup' && (
          <BackupRestoreTab />
        )}
// --- BackupRestoreTab Component ---
function BackupRestoreTab() {
  const [source, setSource] = useState<'local' | 'supabase'>('local')
  const [backups, setBackups] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Fetch backups on source change
  useEffect(() => {
    setLoading(true)
    fetch(`/api/backup/${source}`)
      .then(res => res.json())
      .then(data => {
        setBackups(Array.isArray(data.backups) ? data.backups : [])
        setLoading(false)
      })
  }, [source])

  const createBackup = async () => {
    setLoading(true)
    setMessage('Creating backup...')
    const res = await fetch(`/api/backup/${source}`, { method: 'POST' })
    const data = await res.json()
    if (data.success) {
      setMessage('Backup created!')
      setBackups(b => [data.filename, ...b])
    } else {
      setMessage(data.error || 'Failed to create backup')
    }
    setLoading(false)
  }

  const restoreBackup = async (filename: string) => {
    setLoading(true)
    setMessage('Restoring backup...')
    const res = await fetch('/api/backup/restore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source, filename })
    })
    const data = await res.json()
    if (data.success) {
      setMessage('Restore successful!')
    } else {
      setMessage(data.error || 'Restore failed')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
        <h2 className="font-semibold text-[#37322f] mb-4">Backup Source</h2>
        <div className="flex gap-4 mb-2">
          <button
            className={`px-4 py-2 rounded-lg font-medium border transition-colors ${source === 'local' ? 'bg-[#37322f] text-white border-[#37322f]' : 'bg-white text-[#37322f] border-[#37322f]/20 hover:bg-[#37322f]/5'}`}
            onClick={() => setSource('local')}
            disabled={loading}
          >
            Local File
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium border transition-colors ${source === 'supabase' ? 'bg-[#37322f] text-white border-[#37322f]' : 'bg-white text-[#37322f] border-[#37322f]/20 hover:bg-[#37322f]/5'}`}
            onClick={() => setSource('supabase')}
            disabled={loading}
          >
            Supabase Storage
          </button>
        </div>
        <p className="text-sm text-[#37322f]/60 mb-2">Choose where to store and restore your backups.</p>
      </div>

      <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
        <h2 className="font-semibold text-[#37322f] mb-4">Manual Backup</h2>
        <p className="text-sm text-[#37322f]/60 mb-4">Create an immediate backup of your database to the selected source.</p>
        <button
          className="px-4 py-2 bg-[#37322f] text-white rounded-lg hover:bg-[#4a433f] transition-colors disabled:opacity-50"
          onClick={createBackup}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Create Backup Now'}
        </button>
        {message && <p className="mt-3 text-sm text-[#37322f]/70">{message}</p>}
      </div>

      <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
        <h2 className="font-semibold text-[#37322f] mb-4">Recent Backups</h2>
        {loading ? (
          <div className="text-[#37322f]/60">Loading...</div>
        ) : backups.length === 0 ? (
          <div className="text-[#37322f]/60">No backups found.</div>
        ) : (
          <div className="space-y-3">
            {backups.map((filename, idx) => (
              <div key={filename} className="flex items-center justify-between p-3 border border-[#37322f]/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#37322f]">{filename}</p>
                  </div>
                </div>
                <button
                  className="text-sm text-[#37322f]/60 hover:text-[#37322f]"
                  onClick={() => restoreBackup(filename)}
                  disabled={loading}
                >
                  Restore →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

        {/* Migration Tab */}
        {activeTab === 'migration' && (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-amber-900 text-sm">Migration Warning</h3>
                <p className="text-sm text-amber-700">
                  Data migration should be performed during a maintenance window. 
                  Always create a backup before migrating.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
              <h2 className="font-semibold text-[#37322f] mb-4">Import Data</h2>
              <p className="text-sm text-[#37322f]/60 mb-4">
                Import data from another SignPortal instance or compatible format
              </p>
              <div className="border-2 border-dashed border-[#37322f]/20 rounded-xl p-8 text-center">
                <div className="w-12 h-12 bg-[#37322f]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#37322f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-sm text-[#37322f]/60 mb-2">
                  Drop your backup file here or click to browse
                </p>
                <p className="text-xs text-[#37322f]/40">
                  Supported formats: .sql, .dump, .bak, .json
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
              <h2 className="font-semibold text-[#37322f] mb-4">Export Data</h2>
              <p className="text-sm text-[#37322f]/60 mb-4">
                Export your data for migration or archival purposes
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="p-4 border border-[#37322f]/10 rounded-xl text-left hover:border-[#37322f]/30 transition-colors">
                  <p className="font-medium text-[#37322f]">Full Export</p>
                  <p className="text-sm text-[#37322f]/50">All data including documents and signatures</p>
                </button>
                <button className="p-4 border border-[#37322f]/10 rounded-xl text-left hover:border-[#37322f]/30 transition-colors">
                  <p className="font-medium text-[#37322f]">Schema Only</p>
                  <p className="text-sm text-[#37322f]/50">Database structure without data</p>
                </button>
                <button className="p-4 border border-[#37322f]/10 rounded-xl text-left hover:border-[#37322f]/30 transition-colors">
                  <p className="font-medium text-[#37322f]">Users & Settings</p>
                  <p className="text-sm text-[#37322f]/50">User accounts and configuration only</p>
                </button>
                <button className="p-4 border border-[#37322f]/10 rounded-xl text-left hover:border-[#37322f]/30 transition-colors">
                  <p className="font-medium text-[#37322f]">Audit Logs</p>
                  <p className="text-sm text-[#37322f]/50">Export activity and audit history</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  )
}
