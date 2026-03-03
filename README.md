# SignPortal - On-Premises E-Signature & Document Lifecycle Platform

<p align="center">
  <img src="docs/images/architecture-overview.png" alt="SignPortal Architecture" width="800"/>
</p>

## Overview

SignPortal is a **secure, on-premises e-signature and document lifecycle management platform** designed for organizations requiring complete data sovereignty, regulatory compliance, and enterprise-grade security. Unlike cloud-based solutions, SignPortal runs entirely within your infrastructure, ensuring sensitive documents never leave your network.

### Key Features

- 🔐 **Complete On-Premises Deployment** - Full control over your data
- ✍️ **Advanced Electronic Signatures (AES)** - Legally binding with multi-factor authentication
- 📝 **Drag & Drop Form Builder** - Create custom forms without coding
- 🔄 **Workflow Engine** - Sequential and parallel approval flows
- 🔒 **PKI Integration** - Certificate-based digital signatures with HSM support
- 📊 **Comprehensive Audit Trail** - Full compliance logging for SOC 2, HIPAA, GDPR
- 🔌 **REST API Integration** - Connect with existing enterprise systems
- 👥 **Active Directory / LDAP** - Seamless enterprise authentication

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Getting Started](#getting-started)
- [Core Components](#core-components)
- [Security Features](#security-features)
- [API Documentation](#api-documentation)
- [Deployment Guide](#deployment-guide)
- [Configuration](#configuration)
- [Contributing](#contributing)

---

## Architecture Overview

SignPortal follows a layered architecture designed for security, scalability, and maintainability:

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROCESS LAYER (User Experience)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Drag & Drop  │  │  REST API    │  │ Sequential & Parallel│  │
│  │    Forms     │  │ Integration  │  │       Flows          │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│              USER AUTHENTICATION (Active Directory / LDAP)       │
├─────────────────────────────────────────────────────────────────┤
│                      CORE BACKEND LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  ┌────────┐│
│  │  ASP.NET     │  │ PDF & Sign   │  │ Workflow   │  │ Admin  ││
│  │  Core (.NET 8)│  │ Engine       │  │ Engine     │  │Dashboard││
│  └──────────────┘  └──────────────┘  └────────────┘  └────────┘│
├─────────────────────────────────────────────────────────────────┤
│  PKI & SECURITY                                                  │
│  (OpenSSL / PKCS#11)                                            │
├─────────────────────────────────────────────────────────────────┤
│                    REPOSITORY & STORAGE                          │
│  ┌────────┐  ┌───────────┐  ┌──────────┐  ┌─────────────────┐  │
│  │ MySQL  │  │File Server│  │ Local S3 │  │Encrypted Archive│  │
│  │Database│  │   / NAS   │  │ Storage  │  │                 │  │
│  └────────┘  └───────────┘  └──────────┘  └─────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                       AUDITABLE LOGS                             │
│              (Internal Audit Trail & Document History)           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- Node.js 18+ (for frontend)
- .NET 8 SDK (for backend API)
- MySQL 8.0+
- Redis (optional, for caching)
- OpenSSL 3.0+

### Quick Start (Development)

```bash
# Clone the repository
git clone https://github.com/your-org/signportal.git
cd signportal

# Install frontend dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Deployment

See [Deployment Guide](docs/DEPLOYMENT.md) for detailed production setup instructions.

---

## Core Components

### 1. Process Layer (User Experience)

The process layer provides the user interface for all document operations:

| Component | Description |
|-----------|-------------|
| **Drag & Drop Forms** | Visual form builder with 17+ field types for creating custom documents |
| **REST API Integration** | RESTful endpoints for system integration and automation |
| **Workflow Designer** | Visual builder for sequential and parallel approval flows |

### 2. Authentication Layer

SignPortal integrates with enterprise identity providers:

- **Active Directory / LDAP** - Primary authentication
- **Multi-Factor Authentication (MFA)** - SMS OTP, WebAuthn/FIDO2, Biometrics
- **Single Sign-On (SSO)** - SAML 2.0 and OAuth 2.0 support

### 3. Core Backend Layer

| Service | Technology | Purpose |
|---------|------------|---------|
| **API Server** | ASP.NET Core (.NET 8 + Native AOT) | High-performance REST API |
| **PDF Engine** | IronPDF / iText 8 | PDF generation, manipulation, and rendering |
| **Signature Engine** | Custom + HSM integration | Digital signature creation and verification |
| **Workflow Engine** | Elsa Workflows | Document routing and approval automation |
| **Admin Dashboard** | Next.js | License, audit, and health management |

### 4. Repository & Storage

- **MySQL Database** - Document metadata, user data, audit trails
- **File Server / NAS** - Document storage with redundancy
- **Local S3 Storage** - MinIO-compatible object storage
- **Encrypted Archive** - Long-term encrypted document retention

### 5. Security & PKI

- **OpenSSL / PKCS#11** - Certificate management and HSM integration
- **RSA-4096 / ECDSA** - Asymmetric encryption for signatures
- **AES-256-GCM** - Document encryption at rest
- **TLS 1.3** - All communications encrypted in transit

---

## Security Features

### Electronic Signature Types

SignPortal supports multiple signature levels per eIDAS regulation:

| Type | Security Level | Use Case |
|------|---------------|----------|
| **SES** (Simple Electronic Signature) | Basic | Internal documents, low-risk approvals |
| **AES** (Advanced Electronic Signature) | High | Contracts, legal documents, compliance |
| **QES** (Qualified Electronic Signature) | Highest | Documents requiring legal equivalence to handwritten |

### Multi-Factor Authentication Flow

For confidential documents, SignPortal enforces a 3-layer MFA:

1. **Layer 1: LDAP Authentication** - Domain credentials verification
2. **Layer 2: SMS OTP** - One-time password via private SMS gateway
3. **Layer 3: WebAuthn/Biometric** - Touch ID, Face ID, or security key

### AI-Powered PII Detection

Before signing, documents are scanned for sensitive information:

- Social Security Numbers (SSN)
- Dates of Birth
- Financial account numbers
- Personal addresses
- Medical information (PHI)

---

## API Documentation

### Authentication

```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "user@domain.com",
  "password": "********"
}
```

### Document Operations

```bash
# Upload document
POST /api/documents/upload
Content-Type: multipart/form-data

# Get document status
GET /api/documents/{documentId}/status

# Request signature
POST /api/documents/{documentId}/request-signature
```

### Webhook Events

SignPortal sends webhook notifications for key events:

| Event | Description |
|-------|-------------|
| `document.uploaded` | New document uploaded |
| `document.signed` | Signature applied |
| `document.completed` | All signatures collected |
| `document.rejected` | Signature rejected |
| `workflow.started` | Approval workflow initiated |
| `workflow.completed` | Workflow finished |

See [API Reference](docs/API_REFERENCE.md) for complete documentation.

---

## Configuration

### Environment Variables

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/signportal
DATABASE_POOL_SIZE=20

# Storage
STORAGE_TYPE=s3
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=documents
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin

# Authentication
LDAP_URL=ldap://dc.company.com:389
LDAP_BASE_DN=DC=company,DC=com
LDAP_BIND_DN=CN=ServiceAccount,OU=Services,DC=company,DC=com

# Security
JWT_SECRET=your-256-bit-secret
ENCRYPTION_KEY=your-aes-256-key
HSM_ENABLED=true
HSM_SLOT_ID=0

# Email
SMTP_HOST=smtp.company.com
SMTP_PORT=587
SMTP_USER=signportal@company.com
```

---

## Compliance

SignPortal is designed for regulatory compliance:

- ✅ **SOC 2 Type II** - Security, availability, confidentiality
- ✅ **HIPAA** - Healthcare data protection
- ✅ **GDPR** - EU data privacy
- ✅ **eIDAS** - EU electronic signatures regulation
- ✅ **21 CFR Part 11** - FDA electronic records
- ✅ **ISO 27001** - Information security management

---

## Support

- 📧 Email: support@signportal.com
- 📖 Documentation: [docs.signportal.com](https://docs.signportal.com)
- 🐛 Issue Tracker: [GitHub Issues](https://github.com/your-org/signportal/issues)

---

## License

SignPortal is proprietary software. See [LICENSE](LICENSE) for details.

© 2024-2026 SignPortal. All rights reserved.
