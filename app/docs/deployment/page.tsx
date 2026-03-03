"use client"

import Link from "next/link"
import { ChevronLeft, Server, Database, Shield, HardDrive, Container, Cloud, Terminal, Settings, AlertTriangle, CheckCircle, Copy, ExternalLink, Monitor, Network, Lock } from "lucide-react"
import { useState } from "react"

function CodeBlock({ code, language = "bash", title }: { code: string; language?: string; title?: string }) {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative bg-slate-900 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-400">{title || language}</span>
        </div>
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

function RequirementCard({ icon: Icon, title, items, color }: { 
  icon: React.ElementType
  title: string
  items: { name: string; value: string; note?: string }[]
  color: string
}) {
  const colorClasses: Record<string, { bg: string; icon: string; border: string }> = {
    blue: { bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-200" },
    green: { bg: "bg-green-50", icon: "text-green-600", border: "border-green-200" },
    purple: { bg: "bg-purple-50", icon: "text-purple-600", border: "border-purple-200" },
    amber: { bg: "bg-amber-50", icon: "text-amber-600", border: "border-amber-200" }
  }

  const colors = colorClasses[color] || colorClasses.blue

  return (
    <div className={`${colors.bg} rounded-xl border ${colors.border} p-6`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 bg-white rounded-lg flex items-center justify-center ${colors.icon}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-start text-sm">
            <span className="text-slate-600">{item.name}</span>
            <div className="text-right">
              <span className="font-medium text-slate-800">{item.value}</span>
              {item.note && <p className="text-xs text-slate-500">{item.note}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DeploymentGuidePage() {
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
            <Link href="/docs/api-reference" className="text-sm text-[#37322f]/70 hover:text-[#37322f]">API Reference</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Server className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">Documentation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#37322f] mb-6">Deployment Guide</h1>
          <p className="text-xl text-[#37322f]/70 max-w-[700px]">
            Step-by-step instructions for deploying SignPortal in your on-premises environment using Docker, Kubernetes, or manual installation.
          </p>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8 border-y border-[#37322f]/10 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="text-sm font-semibold text-[#37322f]/60 uppercase tracking-wider mb-4">Contents</h2>
          <div className="grid md:grid-cols-6 gap-4">
            <a href="#prerequisites" className="p-4 rounded-lg border border-[#37322f]/10 hover:border-green-300 hover:bg-green-50/50 transition-all group">
              <span className="text-sm font-medium text-[#37322f] group-hover:text-green-600">Prerequisites</span>
            </a>
            <a href="#requirements" className="p-4 rounded-lg border border-[#37322f]/10 hover:border-green-300 hover:bg-green-50/50 transition-all group">
              <span className="text-sm font-medium text-[#37322f] group-hover:text-green-600">Requirements</span>
            </a>
            <a href="#docker" className="p-4 rounded-lg border border-[#37322f]/10 hover:border-green-300 hover:bg-green-50/50 transition-all group">
              <span className="text-sm font-medium text-[#37322f] group-hover:text-green-600">Docker</span>
            </a>
            <a href="#kubernetes" className="p-4 rounded-lg border border-[#37322f]/10 hover:border-green-300 hover:bg-green-50/50 transition-all group">
              <span className="text-sm font-medium text-[#37322f] group-hover:text-green-600">Kubernetes</span>
            </a>
            <a href="#configuration" className="p-4 rounded-lg border border-[#37322f]/10 hover:border-green-300 hover:bg-green-50/50 transition-all group">
              <span className="text-sm font-medium text-[#37322f] group-hover:text-green-600">Configuration</span>
            </a>
            <a href="#security" className="p-4 rounded-lg border border-[#37322f]/10 hover:border-green-300 hover:bg-green-50/50 transition-all group">
              <span className="text-sm font-medium text-[#37322f] group-hover:text-green-600">Security</span>
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
              {/* Prerequisites */}
              <div id="prerequisites" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-[#37322f] mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-sm font-bold">1</span>
                  Prerequisites
                </h2>
                <p className="text-[#37322f]/70 mb-8">
                  Before installing SignPortal, ensure you have the following services and software available in your environment.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <RequirementCard 
                    icon={Database}
                    title="Required Services"
                    color="blue"
                    items={[
                      { name: "MySQL", value: "8.0+", note: "Primary database" },
                      { name: "Redis", value: "7.0+", note: "Session cache & queues" },
                      { name: "LDAP/AD", value: "Windows Server 2016+", note: "User authentication" },
                      { name: "SMTP Server", value: "Any", note: "Email notifications" }
                    ]}
                  />
                  <RequirementCard 
                    icon={Terminal}
                    title="Required Software"
                    color="green"
                    items={[
                      { name: "Docker", value: "24.0+" },
                      { name: "Docker Compose", value: "2.20+" },
                      { name: "Node.js", value: "18.0+" },
                      { name: ".NET SDK", value: "8.0+" },
                      { name: "OpenSSL", value: "3.0+" }
                    ]}
                  />
                </div>

                <div className="mt-6 bg-white rounded-xl border border-[#37322f]/10 p-6">
                  <h3 className="font-semibold text-[#37322f] mb-4 flex items-center gap-2">
                    <Network className="w-5 h-5 text-purple-600" />
                    Network Requirements
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#37322f]/10">
                          <th className="text-left py-3 px-4 font-semibold text-[#37322f]">Port</th>
                          <th className="text-left py-3 px-4 font-semibold text-[#37322f]">Protocol</th>
                          <th className="text-left py-3 px-4 font-semibold text-[#37322f]">Purpose</th>
                        </tr>
                      </thead>
                      <tbody className="text-[#37322f]/70">
                        <tr className="border-b border-[#37322f]/5">
                          <td className="py-3 px-4 font-mono">443</td>
                          <td className="py-3 px-4">HTTPS</td>
                          <td className="py-3 px-4">Web application</td>
                        </tr>
                        <tr className="border-b border-[#37322f]/5">
                          <td className="py-3 px-4 font-mono">3306</td>
                          <td className="py-3 px-4">TCP</td>
                          <td className="py-3 px-4">MySQL database</td>
                        </tr>
                        <tr className="border-b border-[#37322f]/5">
                          <td className="py-3 px-4 font-mono">6379</td>
                          <td className="py-3 px-4">TCP</td>
                          <td className="py-3 px-4">Redis cache</td>
                        </tr>
                        <tr className="border-b border-[#37322f]/5">
                          <td className="py-3 px-4 font-mono">389/636</td>
                          <td className="py-3 px-4">LDAP/LDAPS</td>
                          <td className="py-3 px-4">Directory service</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-mono">25/587</td>
                          <td className="py-3 px-4">SMTP</td>
                          <td className="py-3 px-4">Email delivery</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* System Requirements */}
              <div id="requirements" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-[#37322f] mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-sm font-bold">2</span>
                  System Requirements
                </h2>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Monitor className="w-5 h-5 text-slate-600" />
                      <h3 className="font-semibold text-slate-800">Development</h3>
                    </div>
                    <p className="text-xs text-slate-500 mb-4">Testing & Development</p>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">CPU</span>
                        <span className="font-medium text-slate-800">4 cores</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">RAM</span>
                        <span className="font-medium text-slate-800">8 GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Storage</span>
                        <span className="font-medium text-slate-800">100 GB SSD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Network</span>
                        <span className="font-medium text-slate-800">100 Mbps</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl border border-green-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Server className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-green-800">Production</h3>
                      <span className="text-xs bg-green-200 text-green-700 px-2 py-0.5 rounded-full">Recommended</span>
                    </div>
                    <p className="text-xs text-green-600 mb-4">Small to Medium Business</p>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-700">CPU</span>
                        <span className="font-medium text-green-800">8 cores</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">RAM</span>
                        <span className="font-medium text-green-800">32 GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Storage</span>
                        <span className="font-medium text-green-800">500 GB NVMe</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Network</span>
                        <span className="font-medium text-green-800">1 Gbps</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-xl border border-purple-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Cloud className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-purple-800">Enterprise</h3>
                    </div>
                    <p className="text-xs text-purple-600 mb-4">Large Scale Deployment</p>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-purple-700">CPU</span>
                        <span className="font-medium text-purple-800">16+ cores</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">RAM</span>
                        <span className="font-medium text-purple-800">64+ GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">Storage</span>
                        <span className="font-medium text-purple-800">2+ TB RAID</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">Network</span>
                        <span className="font-medium text-purple-800">10 Gbps</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Docker Deployment */}
              <div id="docker" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-[#37322f] mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-sm font-bold">3</span>
                  Docker Deployment
                </h2>
                <p className="text-[#37322f]/70 mb-8">
                  The recommended deployment method using Docker Compose for quick setup and easy management.
                </p>

                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Container className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-semibold text-[#37322f]">Step 1: Clone the Repository</h3>
                    </div>
                    <CodeBlock 
                      language="bash"
                      code={`# Clone SignPortal repository
git clone https://github.com/sinhaankur/SignPortal.git
cd SignPortal

# Copy environment template
cp .env.example .env`} 
                    />
                  </div>

                  <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Settings className="w-6 h-6 text-purple-600" />
                      <h3 className="text-lg font-semibold text-[#37322f]">Step 2: Configure Environment</h3>
                    </div>
                    <p className="text-[#37322f]/70 mb-4">Edit the .env file with your configuration:</p>
                    <CodeBlock 
                      language="env"
                      title=".env"
                      code={`# Database Configuration
DATABASE_HOST=mysql
DATABASE_PORT=3306
DATABASE_NAME=signportal
DATABASE_USER=signportal
DATABASE_PASSWORD=your_secure_password

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# LDAP/Active Directory
LDAP_SERVER=ldap://your-domain-controller.local
LDAP_BASE_DN=DC=company,DC=local
LDAP_BIND_DN=CN=ServiceAccount,OU=Service,DC=company,DC=local
LDAP_BIND_PASSWORD=your_ldap_password

# Application Settings
APP_URL=https://signportal.company.local
APP_SECRET=generate_a_secure_random_string_here
JWT_SECRET=another_secure_random_string

# Email Configuration
SMTP_HOST=smtp.company.local
SMTP_PORT=587
SMTP_USER=signportal@company.local
SMTP_PASSWORD=your_smtp_password`} 
                    />
                  </div>

                  <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Terminal className="w-6 h-6 text-green-600" />
                      <h3 className="text-lg font-semibold text-[#37322f]">Step 3: Start Services</h3>
                    </div>
                    <CodeBlock 
                      language="bash"
                      code={`# Build and start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f signportal

# Initialize database
docker-compose exec signportal npm run db:migrate
docker-compose exec signportal npm run db:seed`} 
                    />
                  </div>

                  <div className="bg-green-50 rounded-xl border border-green-200 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-green-800">Verify Installation</h4>
                    </div>
                    <p className="text-green-700 mb-4">After all services are running, verify the installation:</p>
                    <CodeBlock 
                      language="bash"
                      code={`# Check application health
curl -k https://localhost/api/health

# Expected response:
# {"status":"healthy","version":"1.0.0","services":{"database":"connected","redis":"connected","ldap":"connected"}}`} 
                    />
                  </div>
                </div>
              </div>

              {/* Kubernetes Deployment */}
              <div id="kubernetes" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-[#37322f] mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-sm font-bold">4</span>
                  Kubernetes Deployment
                </h2>
                <p className="text-[#37322f]/70 mb-8">
                  For enterprise deployments with high availability and auto-scaling requirements.
                </p>

                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
                    <h3 className="text-lg font-semibold text-[#37322f] mb-4">Create Namespace and Secrets</h3>
                    <CodeBlock 
                      language="bash"
                      code={`# Create namespace
kubectl create namespace signportal

# Create secrets
kubectl create secret generic signportal-secrets \\
  --from-literal=database-password=your_db_password \\
  --from-literal=redis-password=your_redis_password \\
  --from-literal=jwt-secret=your_jwt_secret \\
  -n signportal`} 
                    />
                  </div>

                  <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
                    <h3 className="text-lg font-semibold text-[#37322f] mb-4">Deploy with Helm</h3>
                    <CodeBlock 
                      language="bash"
                      code={`# Add SignPortal Helm repository
helm repo add signportal https://charts.signportal.io
helm repo update

# Install SignPortal
helm install signportal signportal/signportal \\
  --namespace signportal \\
  --values values.yaml

# Check deployment status
kubectl get pods -n signportal -w`} 
                    />
                  </div>

                  <div className="bg-purple-50 rounded-xl border border-purple-200 p-6">
                    <h4 className="font-semibold text-purple-800 mb-3">High Availability Configuration</h4>
                    <CodeBlock 
                      language="yaml"
                      title="values.yaml"
                      code={`# High Availability settings
replicaCount: 3

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70

ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: signportal.company.local
      paths:
        - path: /
          pathType: Prefix

resources:
  requests:
    cpu: 500m
    memory: 512Mi
  limits:
    cpu: 2000m
    memory: 2048Mi`} 
                    />
                  </div>
                </div>
              </div>

              {/* Configuration */}
              <div id="configuration" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-[#37322f] mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-sm font-bold">5</span>
                  Configuration
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
                    <h3 className="text-lg font-semibold text-[#37322f] mb-4">LDAP/Active Directory Setup</h3>
                    <p className="text-[#37322f]/70 mb-4">Configure Active Directory integration for user authentication:</p>
                    <CodeBlock 
                      language="json"
                      title="ldap-config.json"
                      code={`{
  "ldap": {
    "enabled": true,
    "server": "ldaps://dc01.company.local:636",
    "baseDN": "DC=company,DC=local",
    "bindDN": "CN=SignPortal Service,OU=Service Accounts,DC=company,DC=local",
    "bindPassword": "\${LDAP_BIND_PASSWORD}",
    "userSearchBase": "OU=Users,DC=company,DC=local",
    "userSearchFilter": "(sAMAccountName={{username}})",
    "groupSearchBase": "OU=Groups,DC=company,DC=local",
    "groupSearchFilter": "(member={{dn}})",
    "tlsOptions": {
      "rejectUnauthorized": true,
      "ca": "/certs/company-ca.crt"
    }
  }
}`} 
                    />
                  </div>

                  <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
                    <h3 className="text-lg font-semibold text-[#37322f] mb-4">SSL/TLS Certificate Setup</h3>
                    <CodeBlock 
                      language="bash"
                      code={`# Generate self-signed certificate (for testing)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \\
  -keyout /etc/ssl/signportal/server.key \\
  -out /etc/ssl/signportal/server.crt \\
  -subj "/CN=signportal.company.local"

# Or use your organization's CA-signed certificate
cp /path/to/your/certificate.crt /etc/ssl/signportal/server.crt
cp /path/to/your/private.key /etc/ssl/signportal/server.key

# Set proper permissions
chmod 600 /etc/ssl/signportal/server.key
chmod 644 /etc/ssl/signportal/server.crt`} 
                    />
                  </div>
                </div>
              </div>

              {/* Security Hardening */}
              <div id="security" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-[#37322f] mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-sm font-bold">6</span>
                  Security Hardening
                </h2>
                
                <div className="bg-amber-50 rounded-2xl border border-amber-200 p-8 mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                    <h3 className="text-lg font-semibold text-amber-800">Security Checklist</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-amber-800 mb-3">Network Security</h4>
                      <ul className="space-y-2">
                        {[
                          "Enable TLS 1.3 for all connections",
                          "Configure firewall rules",
                          "Use private network for internal services",
                          "Enable rate limiting",
                          "Set up DDoS protection"
                        ].map((item, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-amber-700">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-amber-800 mb-3">Application Security</h4>
                      <ul className="space-y-2">
                        {[
                          "Enable CSRF protection",
                          "Configure secure session cookies",
                          "Set up audit logging",
                          "Enable MFA for admin accounts",
                          "Regular security updates"
                        ].map((item, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-amber-700">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="w-6 h-6 text-red-600" />
                    <h3 className="text-lg font-semibold text-[#37322f]">Encryption Configuration</h3>
                  </div>
                  <CodeBlock 
                    language="json"
                    title="security-config.json"
                    code={`{
  "encryption": {
    "algorithm": "AES-256-GCM",
    "keyRotationDays": 90,
    "documentEncryption": true,
    "signatureSealing": true
  },
  "session": {
    "secure": true,
    "httpOnly": true,
    "sameSite": "strict",
    "maxAge": 3600000
  },
  "headers": {
    "strictTransportSecurity": "max-age=31536000; includeSubDomains",
    "contentSecurityPolicy": "default-src 'self'",
    "xFrameOptions": "DENY",
    "xContentTypeOptions": "nosniff"
  }
}`} 
                  />
                </div>
              </div>

              {/* Troubleshooting */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                <h3 className="text-xl font-semibold text-[#37322f] mb-6">Common Issues</h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg border border-slate-200 p-4">
                    <h4 className="font-medium text-[#37322f] mb-2">Database Connection Failed</h4>
                    <p className="text-sm text-[#37322f]/70 mb-2">Check MySQL is running and credentials are correct:</p>
                    <code className="text-sm bg-slate-100 px-2 py-1 rounded text-slate-700">docker-compose logs mysql</code>
                  </div>
                  <div className="bg-white rounded-lg border border-slate-200 p-4">
                    <h4 className="font-medium text-[#37322f] mb-2">LDAP Authentication Issues</h4>
                    <p className="text-sm text-[#37322f]/70 mb-2">Verify LDAP connectivity and bind credentials:</p>
                    <code className="text-sm bg-slate-100 px-2 py-1 rounded text-slate-700">ldapsearch -x -H ldaps://dc01.company.local -b &quot;DC=company,DC=local&quot;</code>
                  </div>
                  <div className="bg-white rounded-lg border border-slate-200 p-4">
                    <h4 className="font-medium text-[#37322f] mb-2">Certificate Errors</h4>
                    <p className="text-sm text-[#37322f]/70 mb-2">Ensure certificates are valid and properly configured:</p>
                    <code className="text-sm bg-slate-100 px-2 py-1 rounded text-slate-700">openssl x509 -in /etc/ssl/signportal/server.crt -text -noout</code>
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
                    href="/docs/api-reference" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    API Reference
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
                    <a href="#prerequisites" className="block text-sm text-[#37322f]/60 hover:text-green-600 transition-colors">Prerequisites</a>
                    <a href="#requirements" className="block text-sm text-[#37322f]/60 hover:text-green-600 transition-colors">System Requirements</a>
                    <a href="#docker" className="block text-sm text-[#37322f]/60 hover:text-green-600 transition-colors">Docker Deployment</a>
                    <a href="#kubernetes" className="block text-sm text-[#37322f]/60 hover:text-green-600 transition-colors">Kubernetes Deployment</a>
                    <a href="#configuration" className="block text-sm text-[#37322f]/60 hover:text-green-600 transition-colors">Configuration</a>
                    <a href="#security" className="block text-sm text-[#37322f]/60 hover:text-green-600 transition-colors">Security Hardening</a>
                  </nav>
                </div>

                <div className="bg-green-50 rounded-xl border border-green-200 p-6">
                  <h3 className="font-semibold text-green-800 mb-2">Deployment Support</h3>
                  <p className="text-sm text-green-700 mb-4">Need help with on-premises deployment? Our team can assist.</p>
                  <Link href="/support" className="text-sm font-medium text-green-600 hover:text-green-700">
                    Contact Support →
                  </Link>
                </div>

                <div className="bg-white rounded-xl border border-[#37322f]/10 p-6">
                  <h3 className="font-semibold text-[#37322f] mb-3">Deployment Options</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Container className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-[#37322f]">Docker</p>
                        <p className="text-xs text-[#37322f]/60">Quick setup</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Cloud className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-[#37322f]">Kubernetes</p>
                        <p className="text-xs text-[#37322f]/60">Enterprise scale</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <HardDrive className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-[#37322f]">Bare Metal</p>
                        <p className="text-xs text-[#37322f]/60">Manual install</p>
                      </div>
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
            <Link href="/docs/api-reference" className="text-sm text-[#37322f]/60 hover:text-[#37322f]">API Reference</Link>
            <Link href="/support" className="text-sm text-[#37322f]/60 hover:text-[#37322f]">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
