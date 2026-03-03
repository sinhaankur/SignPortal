# SignPortal Architecture Documentation

## System Overview

SignPortal is an on-premises e-signature and document lifecycle platform built with a modern, layered architecture. This document provides detailed technical information about each component and how they interact.

---

## 1. Process Layer (User Experience)

The Process Layer is the presentation tier that users interact with directly.

### 1.1 Web Application (Next.js Frontend)

**Technology Stack:**
- Next.js 14 with App Router
- React 18 with TypeScript
- Tailwind CSS for styling
- shadcn/ui component library

**Key Features:**

#### Drag & Drop Form Builder
The form builder allows users to create custom document templates without coding:

```
┌─────────────────────────────────────────────────────────────┐
│  FORM BUILDER CANVAS                                         │
│  ┌─────────────────────┐    ┌─────────────────────────────┐ │
│  │  FIELD PALETTE      │    │  FORM PREVIEW               │ │
│  │  ├─ Text Fields     │    │  ┌─────────────────────────┐│ │
│  │  │  ├─ Short Text   │    │  │                         ││ │
│  │  │  ├─ Long Text    │    │  │    [Form Fields Here]   ││ │
│  │  │  └─ Email        │    │  │                         ││ │
│  │  ├─ Choice Fields   │    │  └─────────────────────────┘│ │
│  │  │  ├─ Dropdown     │    └─────────────────────────────┘ │
│  │  │  ├─ Checkbox     │    ┌─────────────────────────────┐ │
│  │  │  └─ Radio        │    │  FIELD PROPERTIES           │ │
│  │  ├─ Date/Time       │    │  ├─ Label: ___________      │ │
│  │  ├─ File Upload     │    │  ├─ Required: [✓]          │ │
│  │  ├─ Signature       │    │  ├─ Validation: ___        │ │
│  │  └─ Layout          │    │  └─ Help Text: ___         │ │
│  └─────────────────────┘    └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Supported Field Types (17+ types):**

| Category | Field Types |
|----------|-------------|
| **Text Inputs** | Short Text, Long Text, Email, Phone, URL, Number |
| **Selection** | Dropdown, Multiple Choice, Checkboxes, Yes/No |
| **Date & Time** | Date Picker, Time Picker, DateTime |
| **Media** | File Upload, Image Upload, Signature |
| **Layout** | Section Header, Paragraph, Page Break |
| **Advanced** | Rating Scale, Matrix/Grid, Calculations |

#### Sequential & Parallel Workflow Designer

The workflow designer supports complex approval routing:

```
SEQUENTIAL FLOW:
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Initiator│───▶│ Manager  │───▶│ Director │───▶│  Legal   │
│  Submit  │    │ Approve  │    │ Approve  │    │ Approve  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘

PARALLEL FLOW:
                     ┌──────────┐
                ┌───▶│ Finance  │───┐
┌──────────┐   │    │ Approve  │   │    ┌──────────┐
│ Initiator│───┤    └──────────┘   ├───▶│ Complete │
│  Submit  │   │    ┌──────────┐   │    └──────────┘
└──────────┘   └───▶│   Legal  │───┘
                    │ Approve  │
                    └──────────┘

CONDITIONAL FLOW:
┌──────────┐    ┌──────────┐         ┌──────────┐
│ Initiator│───▶│   Check  │──Yes──▶│ Director │
│  Submit  │    │ Amount>$│         │ Approve  │
└──────────┘    │  10,000? │         └──────────┘
                └──────────┘
                     │ No
                     ▼
                ┌──────────┐
                │ Manager  │
                │ Approve  │
                └──────────┘
```

### 1.2 REST API Integration

SignPortal exposes a comprehensive REST API for integration with external systems:

**API Capabilities:**
- Document upload and management
- Signature request creation
- Workflow triggering
- Status polling and webhooks
- Audit log retrieval

**Integration Patterns:**

```
┌─────────────────┐         ┌─────────────────┐
│   ERP System    │         │    SignPortal   │
│   (SAP, Oracle) │◀───────▶│    REST API     │
└─────────────────┘         └─────────────────┘
        │                           │
        │   1. POST /documents      │
        │   2. POST /workflows      │
        │   3. Webhook callbacks    │
        ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│   HR System     │         │   CRM System    │
│   (Workday)     │         │   (Salesforce)  │
└─────────────────┘         └─────────────────┘
```

---

## 2. Authentication Layer

### 2.1 Active Directory / LDAP Integration

SignPortal authenticates users against enterprise directory services:

```
┌────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                          │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│   User          SignPortal       LDAP/AD         Identity      │
│    │                │               │             Store        │
│    │  1. Login      │               │               │          │
│    │───────────────▶│               │               │          │
│    │                │  2. LDAP Bind │               │          │
│    │                │──────────────▶│               │          │
│    │                │               │  3. Verify    │          │
│    │                │               │──────────────▶│          │
│    │                │               │◀──────────────│          │
│    │                │◀──────────────│  4. Result    │          │
│    │  5. JWT Token  │               │               │          │
│    │◀───────────────│               │               │          │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

**LDAP Configuration:**
```yaml
ldap:
  url: ldap://dc.company.com:389
  base_dn: DC=company,DC=com
  bind_dn: CN=SignPortal,OU=Services,DC=company,DC=com
  user_search_filter: (sAMAccountName={0})
  group_search_filter: (member={0})
  tls_enabled: true
  connection_timeout: 5000
  read_timeout: 10000
```

### 2.2 Multi-Factor Authentication (MFA)

For confidential documents, SignPortal enforces layered MFA:

```
┌─────────────────────────────────────────────────────────────────┐
│                    MFA VERIFICATION LAYERS                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────┐   ┌────────────────┐   ┌────────────────┐  │
│  │    LAYER 1     │   │    LAYER 2     │   │    LAYER 3     │  │
│  │                │   │                │   │                │  │
│  │   LDAP/AD      │──▶│   SMS OTP      │──▶│   WebAuthn     │  │
│  │ Authentication │   │  Verification  │   │   Biometric    │  │
│  │                │   │                │   │                │  │
│  │  ┌──────────┐  │   │  ┌──────────┐  │   │  ┌──────────┐  │  │
│  │  │ Username │  │   │  │ 6-digit  │  │   │  │ Touch ID │  │  │
│  │  │ Password │  │   │  │   OTP    │  │   │  │ Face ID  │  │  │
│  │  └──────────┘  │   │  └──────────┘  │   │  │ FIDO2    │  │  │
│  │                │   │                │   │  └──────────┘  │  │
│  └────────────────┘   └────────────────┘   └────────────────┘  │
│                                                                  │
│  Security Level:  ████████████████████████████████████████████  │
│                   Low ─────────────────────────────────▶ High   │
└─────────────────────────────────────────────────────────────────┘
```

**MFA Session Management:**
```typescript
interface MFASession {
  sessionId: string;
  userId: string;
  documentId: string;
  
  // Layer completion status
  ldapVerified: boolean;
  ldapVerifiedAt?: Date;
  
  smsOtpSent: boolean;
  smsOtpVerified: boolean;
  smsVerifiedAt?: Date;
  
  webauthnChallenged: boolean;
  webauthnVerified: boolean;
  webauthnVerifiedAt?: Date;
  
  // Session metadata
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
}
```

---

## 3. Core Backend Layer

### 3.1 ASP.NET Core API Server

**Technology:** .NET 8 with Native AOT compilation for optimal performance

```
┌─────────────────────────────────────────────────────────────────┐
│                    API SERVER ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    API GATEWAY                           │   │
│  │  (Rate Limiting, Authentication, Request Validation)     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│              ┌───────────────┼───────────────┐                  │
│              ▼               ▼               ▼                  │
│  ┌─────────────────┐ ┌─────────────┐ ┌─────────────────┐       │
│  │   Document      │ │  Signature  │ │   Workflow      │       │
│  │   Controller    │ │  Controller │ │   Controller    │       │
│  └─────────────────┘ └─────────────┘ └─────────────────┘       │
│              │               │               │                  │
│              ▼               ▼               ▼                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    SERVICE LAYER                         │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │   │
│  │  │ DocumentSvc  │ │ SignatureSvc │ │ WorkflowSvc  │     │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  REPOSITORY LAYER                        │   │
│  │          (Entity Framework Core + Dapper)                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 PDF & Signature Engine

**Libraries:** IronPDF / iText 8 for PDF manipulation

**Capabilities:**
- PDF generation from templates
- PDF/A archival format conversion
- Form field detection and population
- Visual signature placement
- Digital signature embedding (PKCS#7)
- Document flattening and protection

```
┌─────────────────────────────────────────────────────────────────┐
│                    PDF PROCESSING PIPELINE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  INPUT                    PROCESSING                   OUTPUT   │
│  ┌────────┐              ┌──────────┐              ┌────────┐  │
│  │ Upload │──────────────▶│  Parse   │              │ Signed │  │
│  │  PDF   │              │   PDF    │              │  PDF   │  │
│  └────────┘              └──────────┘              └────────┘  │
│                               │                         ▲       │
│                               ▼                         │       │
│                          ┌──────────┐                   │       │
│                          │ Extract  │                   │       │
│                          │  Fields  │                   │       │
│                          └──────────┘                   │       │
│                               │                         │       │
│                               ▼                         │       │
│                          ┌──────────┐                   │       │
│                          │  Fill    │                   │       │
│                          │  Values  │                   │       │
│                          └──────────┘                   │       │
│                               │                         │       │
│                               ▼                         │       │
│                          ┌──────────┐                   │       │
│                          │  Add     │                   │       │
│                          │Signature │───────────────────┘       │
│                          └──────────┘                           │
│                               │                                  │
│                               ▼                                  │
│                          ┌──────────┐                           │
│                          │  Embed   │                           │
│                          │ Digital  │                           │
│                          │   Cert   │                           │
│                          └──────────┘                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Workflow Engine (Elsa Workflows)

The workflow engine orchestrates document routing and approval processes:

**Workflow Definition Example:**
```json
{
  "workflowId": "contract-approval",
  "name": "Contract Approval Workflow",
  "version": 1,
  "activities": [
    {
      "id": "start",
      "type": "Start",
      "next": "check-amount"
    },
    {
      "id": "check-amount",
      "type": "Condition",
      "expression": "document.amount > 10000",
      "trueBranch": "director-approval",
      "falseBranch": "manager-approval"
    },
    {
      "id": "manager-approval",
      "type": "ApprovalTask",
      "assignee": "document.initiator.manager",
      "timeout": "P3D",
      "next": "complete"
    },
    {
      "id": "director-approval", 
      "type": "ApprovalTask",
      "assignee": "role:Director",
      "timeout": "P5D",
      "next": "legal-review"
    },
    {
      "id": "legal-review",
      "type": "ApprovalTask",
      "assignee": "role:Legal",
      "timeout": "P7D",
      "next": "complete"
    },
    {
      "id": "complete",
      "type": "End"
    }
  ]
}
```

### 3.4 Admin Dashboard

The admin dashboard provides system management capabilities:

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │   License   │ │   Audit     │ │   Health    │ │  System   │ │
│  │ Management  │ │   Logs      │ │  Monitor    │ │  Config   │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────┘ │
│                                                                  │
│  LICENSE MANAGEMENT          HEALTH MONITORING                   │
│  ├─ Active licenses          ├─ API response times              │
│  ├─ Usage statistics         ├─ Database connections            │
│  ├─ Expiration alerts        ├─ Storage capacity                │
│  └─ License allocation       ├─ Queue depths                    │
│                              └─ Error rates                      │
│  AUDIT LOGS                                                      │
│  ├─ All signature events     SYSTEM CONFIGURATION               │
│  ├─ Authentication logs      ├─ LDAP settings                   │
│  ├─ Document access          ├─ Email templates                 │
│  ├─ Workflow transitions     ├─ Branding/themes                 │
│  └─ Export to SIEM           └─ Integration keys                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. PKI & Security Layer

### 4.1 Certificate Management

SignPortal supports multiple certificate storage options:

```
┌─────────────────────────────────────────────────────────────────┐
│                    PKI INFRASTRUCTURE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    CERTIFICATE SOURCES                    │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────────┐  │  │
│  │  │   HSM      │  │  Software  │  │  Cloud KMS         │  │  │
│  │  │ (PKCS#11) │  │   Store    │  │  (Azure/AWS)       │  │  │
│  │  └────────────┘  └────────────┘  └────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                 SIGNATURE OPERATIONS                      │  │
│  │                                                           │  │
│  │  1. Hash Document (SHA-512)                              │  │
│  │  2. Retrieve Signing Key (RSA-4096 or ECDSA P-384)       │  │
│  │  3. Sign Hash with Private Key                           │  │
│  │  4. Create PKCS#7 Signature Container                    │  │
│  │  5. Embed Timestamp Token (RFC 3161)                     │  │
│  │  6. Attach Certificate Chain                             │  │
│  │                                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Signature Types and Security Levels

| Signature Type | Hash Algorithm | Key Algorithm | Certificate | Timestamp |
|---------------|----------------|---------------|-------------|-----------|
| SES (Simple) | SHA-256 | N/A | Optional | Optional |
| AES (Advanced) | SHA-512 | RSA-4096 | Required | Required |
| QES (Qualified) | SHA-512 | ECDSA P-384 | Qualified CA | TSA |

### 4.3 Document Encryption

All documents are encrypted at rest:

```
┌─────────────────────────────────────────────────────────────────┐
│                    ENCRYPTION WORKFLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  UPLOAD                                                          │
│  ┌────────┐    ┌────────────┐    ┌────────────┐    ┌────────┐  │
│  │Original│───▶│ Generate   │───▶│  Encrypt   │───▶│Encrypted│  │
│  │  PDF   │    │ AES-256 Key│    │  Document  │    │   PDF   │  │
│  └────────┘    └────────────┘    └────────────┘    └────────┘  │
│                      │                                  │        │
│                      ▼                                  ▼        │
│               ┌────────────┐                    ┌────────────┐  │
│               │ Encrypt Key│                    │   Store    │  │
│               │ with Master│                    │  on Disk   │  │
│               │  (RSA-4096)│                    │            │  │
│               └────────────┘                    └────────────┘  │
│                      │                                           │
│                      ▼                                           │
│               ┌────────────┐                                    │
│               │   Store    │                                    │
│               │  in HSM    │                                    │
│               └────────────┘                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Repository & Storage Layer

### 5.1 Database Schema Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    MySQL DATABASE SCHEMA                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐     ┌──────────────────┐     ┌────────────┐  │
│  │   Users      │     │    Documents     │     │ Workflows  │  │
│  ├──────────────┤     ├──────────────────┤     ├────────────┤  │
│  │ user_id (PK) │     │ document_id (PK) │     │workflow_id │  │
│  │ email        │◀───▶│ created_by (FK)  │◀───▶│document_id │  │
│  │ name         │     │ name             │     │ status     │  │
│  │ department   │     │ classification   │     │ current_   │  │
│  │ role         │     │ status           │     │   step     │  │
│  └──────────────┘     │ storage_path     │     └────────────┘  │
│         │             └──────────────────┘            │         │
│         │                     │                       │         │
│         ▼                     ▼                       ▼         │
│  ┌──────────────┐     ┌──────────────────┐     ┌────────────┐  │
│  │   Sessions   │     │   Signatures     │     │ Audit_Log  │  │
│  ├──────────────┤     ├──────────────────┤     ├────────────┤  │
│  │ session_id   │     │ signature_id     │     │ audit_id   │  │
│  │ user_id (FK) │     │ document_id (FK) │     │ event_type │  │
│  │ mfa_status   │     │ signer_id (FK)   │     │ user_id    │  │
│  │ expires_at   │     │ signature_data   │     │ document_  │  │
│  └──────────────┘     │ certificate_id   │     │   id       │  │
│                       └──────────────────┘     │ timestamp  │  │
│                                                │ ip_address │  │
│                                                └────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Storage Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    STORAGE TIERS                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  HOT STORAGE (Active Documents)                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Local S3 (MinIO)                                        │   │
│  │  ├─ documents/active/                                    │   │
│  │  ├─ documents/pending-signature/                         │   │
│  │  └─ documents/in-workflow/                               │   │
│  │  Retention: 30 days                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  WARM STORAGE (Recently Completed)                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  File Server / NAS                                       │   │
│  │  ├─ /signed/2026/03/                                     │   │
│  │  ├─ /completed/2026/03/                                  │   │
│  │  └─ /templates/                                          │   │
│  │  Retention: 1 year                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  COLD STORAGE (Archive)                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Encrypted Archive                                       │   │
│  │  ├─ AES-256 encrypted                                    │   │
│  │  ├─ Compressed (ZSTD)                                    │   │
│  │  └─ Immutable storage                                    │   │
│  │  Retention: 7+ years (compliance requirement)            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Auditable Logs

### 6.1 Audit Trail Structure

Every action in SignPortal is logged with comprehensive metadata:

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUDIT EVENT STRUCTURE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  {                                                               │
│    "audit_id": "uuid",                                          │
│    "timestamp": "2026-03-03T14:30:00Z",                         │
│    "event_type": "DOCUMENT_SIGNED",                             │
│                                                                  │
│    "actor": {                                                    │
│      "user_id": "uuid",                                         │
│      "email": "john.doe@company.com",                           │
│      "name": "John Doe",                                        │
│      "department": "Legal",                                     │
│      "role": "Director"                                         │
│    },                                                            │
│                                                                  │
│    "context": {                                                  │
│      "ip_address": "192.168.1.100",                             │
│      "user_agent": "Mozilla/5.0...",                            │
│      "session_id": "uuid",                                      │
│      "geolocation": "37.7749,-122.4194"                         │
│    },                                                            │
│                                                                  │
│    "document": {                                                 │
│      "document_id": "uuid",                                     │
│      "name": "Contract-2026-001.pdf",                           │
│      "classification": "CONFIDENTIAL",                          │
│      "hash_sha512": "abc123..."                                 │
│    },                                                            │
│                                                                  │
│    "mfa_verification": {                                         │
│      "ldap_verified": true,                                     │
│      "sms_verified": true,                                      │
│      "webauthn_verified": true                                  │
│    },                                                            │
│                                                                  │
│    "signature": {                                                │
│      "algorithm": "RSA-4096-SHA512",                            │
│      "certificate_thumbprint": "def456...",                     │
│      "timestamp_token": "..."                                   │
│    },                                                            │
│                                                                  │
│    "chain": {                                                    │
│      "previous_audit_hash": "xyz789...",                        │
│      "current_audit_hash": "computed..."                        │
│    }                                                             │
│  }                                                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Audit Event Types

| Category | Event Types |
|----------|-------------|
| **Authentication** | LOGIN, LOGOUT, MFA_INITIATED, MFA_COMPLETED, MFA_FAILED |
| **Documents** | UPLOADED, VIEWED, DOWNLOADED, DELETED, SHARED, CLASSIFICATION_CHANGED |
| **Signatures** | SIGNATURE_REQUESTED, SIGNATURE_APPLIED, SIGNATURE_REJECTED, SIGNATURE_VERIFIED |
| **Workflows** | WORKFLOW_STARTED, TASK_ASSIGNED, TASK_COMPLETED, WORKFLOW_COMPLETED |
| **Admin** | CONFIG_CHANGED, USER_CREATED, PERMISSION_GRANTED, LICENSE_UPDATED |

### 6.3 Blockchain-Style Chaining

Audit records are cryptographically chained to prevent tampering:

```
┌────────────┐     ┌────────────┐     ┌────────────┐
│  Audit #1  │     │  Audit #2  │     │  Audit #3  │
├────────────┤     ├────────────┤     ├────────────┤
│ Event Data │     │ Event Data │     │ Event Data │
│ prev: null │────▶│ prev: H(#1)│────▶│ prev: H(#2)│
│ hash: H(#1)│     │ hash: H(#2)│     │ hash: H(#3)│
└────────────┘     └────────────┘     └────────────┘

H(x) = SHA-512(event_data + previous_hash)
```

---

## 7. Integration Points

### 7.1 Inbound Integrations

```
┌─────────────────────────────────────────────────────────────────┐
│                    INBOUND INTEGRATIONS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────┐                                             │
│  │  ERP Systems   │──┐                                          │
│  │ (SAP, Oracle)  │  │                                          │
│  └────────────────┘  │                                          │
│                      │                                          │
│  ┌────────────────┐  │      ┌─────────────────────────┐        │
│  │   HR Systems   │──┼─────▶│    SignPortal API       │        │
│  │   (Workday)    │  │      │  POST /api/documents    │        │
│  └────────────────┘  │      │  POST /api/workflows    │        │
│                      │      └─────────────────────────┘        │
│  ┌────────────────┐  │                                          │
│  │ CRM Systems    │──┘                                          │
│  │ (Salesforce)   │                                             │
│  └────────────────┘                                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Outbound Integrations (Webhooks)

```
┌─────────────────────────────────────────────────────────────────┐
│                    OUTBOUND WEBHOOKS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SignPortal                        External Systems              │
│  ┌─────────────┐                                                │
│  │  Webhook    │    document.signed    ┌────────────────┐       │
│  │  Dispatcher │───────────────────────▶│  ERP System    │       │
│  │             │                        └────────────────┘       │
│  │             │    workflow.completed  ┌────────────────┐       │
│  │             │───────────────────────▶│  HR System     │       │
│  │             │                        └────────────────┘       │
│  │             │    document.rejected   ┌────────────────┐       │
│  │             │───────────────────────▶│  SIEM/Logging  │       │
│  └─────────────┘                        └────────────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Deployment Models

### 8.1 Single-Server Deployment

For small teams (< 50 users):

```
┌─────────────────────────────────────────┐
│           SINGLE SERVER                  │
│  ┌─────────────────────────────────┐    │
│  │  SignPortal Application         │    │
│  │  ├─ Frontend (Next.js)          │    │
│  │  ├─ API (ASP.NET Core)          │    │
│  │  ├─ MySQL                       │    │
│  │  └─ MinIO (S3 Storage)          │    │
│  └─────────────────────────────────┘    │
│                                          │
│  Requirements:                           │
│  ├─ CPU: 8+ cores                       │
│  ├─ RAM: 32GB                           │
│  ├─ Storage: 1TB SSD                    │
│  └─ OS: Ubuntu 22.04 / RHEL 9          │
└─────────────────────────────────────────┘
```

### 8.2 High-Availability Deployment

For enterprises (100+ users):

```
┌─────────────────────────────────────────────────────────────────┐
│                 HIGH-AVAILABILITY CLUSTER                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐                                            │
│  │  Load Balancer  │                                            │
│  │   (HAProxy)     │                                            │
│  └─────────────────┘                                            │
│           │                                                      │
│     ┌─────┴─────┐                                               │
│     ▼           ▼                                               │
│  ┌──────┐   ┌──────┐                                            │
│  │ App  │   │ App  │                                            │
│  │ Node │   │ Node │                                            │
│  │  #1  │   │  #2  │                                            │
│  └──────┘   └──────┘                                            │
│     │           │                                               │
│     └─────┬─────┘                                               │
│           ▼                                                      │
│  ┌─────────────────┐     ┌─────────────────┐                    │
│  │  MySQL Cluster  │     │  MinIO Cluster  │                    │
│  │  (Primary/      │     │  (Distributed)  │                    │
│  │   Replica)      │     │                 │                    │
│  └─────────────────┘     └─────────────────┘                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Performance Specifications

| Metric | Target |
|--------|--------|
| API Response Time (p95) | < 200ms |
| Document Upload (10MB) | < 5 seconds |
| Signature Application | < 2 seconds |
| Concurrent Users | 500+ |
| Documents per Day | 10,000+ |
| Storage Throughput | 100 MB/s |
| Database Queries | 10,000 QPS |

---

## 10. Security Certifications

| Standard | Status | Scope |
|----------|--------|-------|
| SOC 2 Type II | ✅ Compliant | Full platform |
| ISO 27001 | ✅ Certified | Information security |
| HIPAA | ✅ Compliant | Healthcare documents |
| GDPR | ✅ Compliant | EU data protection |
| eIDAS | ✅ Compliant | Electronic signatures |
| 21 CFR Part 11 | ✅ Compliant | FDA electronic records |

---

*Document Version: 2.0*  
*Last Updated: March 2026*
