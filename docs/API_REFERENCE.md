# SignPortal API Reference

## Overview

The SignPortal REST API enables programmatic access to all platform features. This document provides comprehensive API documentation for integrating with SignPortal.

**Base URL:** `https://your-signportal-instance.com/api/v1`

**Authentication:** Bearer token (JWT)

---

## Authentication

### Login

Authenticate a user and receive a JWT token.

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "user@company.com",
  "password": "********",
  "domain": "COMPANY"  // Optional: for LDAP authentication
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJSUzI1NiIs...",
    "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2...",
    "expiresIn": 3600,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@company.com",
      "name": "John Doe",
      "role": "user",
      "department": "Legal"
    }
  }
}
```

### Refresh Token

Refresh an expired access token.

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2..."
}
```

### Logout

Invalidate the current session.

```http
POST /api/v1/auth/logout
Authorization: Bearer <token>
```

---

## Documents

### Upload Document

Upload a new document for signature processing.

```http
POST /api/v1/documents/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <binary>
name: "Contract-2026-001.pdf"
classification: "CONFIDENTIAL"  // PUBLIC, INTERNAL, CONFIDENTIAL, RESTRICTED
type: "CONTRACT"  // CONTRACT, NDA, SOP, POLICY, OTHER
description: "Service agreement with Acme Corp"
tags: ["legal", "vendor", "2026"]
```

**Response:**
```json
{
  "success": true,
  "data": {
    "documentId": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Contract-2026-001.pdf",
    "classification": "CONFIDENTIAL",
    "status": "UPLOADED",
    "uploadedAt": "2026-03-03T14:30:00Z",
    "uploadedBy": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe"
    },
    "fileSize": 1048576,
    "mimeType": "application/pdf",
    "pageCount": 12,
    "hash": {
      "sha256": "a948904f2f0f479b8f8...",
      "sha512": "cf83e1357eefb8bdf15..."
    }
  }
}
```

### Get Document

Retrieve document metadata.

```http
GET /api/v1/documents/{documentId}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "documentId": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Contract-2026-001.pdf",
    "classification": "CONFIDENTIAL",
    "status": "PENDING_SIGNATURE",
    "type": "CONTRACT",
    "description": "Service agreement with Acme Corp",
    "version": 1,
    "createdAt": "2026-03-03T14:30:00Z",
    "createdBy": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe"
    },
    "workflow": {
      "workflowId": "550e8400-e29b-41d4-a716-446655440002",
      "status": "IN_PROGRESS",
      "currentStep": 2,
      "totalSteps": 3
    },
    "signatures": [
      {
        "signerId": "550e8400-e29b-41d4-a716-446655440003",
        "signerName": "Jane Smith",
        "status": "SIGNED",
        "signedAt": "2026-03-03T15:00:00Z"
      },
      {
        "signerId": "550e8400-e29b-41d4-a716-446655440004",
        "signerName": "Bob Johnson",
        "status": "PENDING"
      }
    ]
  }
}
```

### Download Document

Download the document file.

```http
GET /api/v1/documents/{documentId}/download
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `version` | integer | Specific version to download |
| `format` | string | `original`, `flattened`, `certified` |

**Response:** Binary file stream with appropriate `Content-Type` header

### List Documents

Get a paginated list of documents.

```http
GET /api/v1/documents
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number (default: 1) |
| `limit` | integer | Items per page (default: 20, max: 100) |
| `status` | string | Filter by status |
| `classification` | string | Filter by classification |
| `type` | string | Filter by document type |
| `search` | string | Full-text search |
| `startDate` | ISO8601 | Filter by creation date |
| `endDate` | ISO8601 | Filter by creation date |
| `sort` | string | Sort field (e.g., `createdAt`, `name`) |
| `order` | string | `asc` or `desc` |

**Response:**
```json
{
  "success": true,
  "data": {
    "documents": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 150,
      "totalPages": 8
    }
  }
}
```

### Delete Document

Delete a document (soft delete).

```http
DELETE /api/v1/documents/{documentId}
Authorization: Bearer <token>
```

**Note:** Documents with active signatures or in-progress workflows cannot be deleted.

---

## Signatures

### Request Signature

Create a signature request for a document.

```http
POST /api/v1/signatures/request
Authorization: Bearer <token>
Content-Type: application/json

{
  "documentId": "550e8400-e29b-41d4-a716-446655440001",
  "signers": [
    {
      "email": "jane.smith@company.com",
      "name": "Jane Smith",
      "role": "signer",
      "order": 1,
      "fields": [
        {
          "type": "signature",
          "page": 5,
          "x": 100,
          "y": 500,
          "width": 200,
          "height": 50,
          "required": true
        }
      ]
    },
    {
      "email": "bob.johnson@company.com",
      "name": "Bob Johnson",
      "role": "approver",
      "order": 2,
      "fields": [
        {
          "type": "signature",
          "page": 5,
          "x": 100,
          "y": 400,
          "width": 200,
          "height": 50,
          "required": true
        }
      ]
    }
  ],
  "workflow": {
    "type": "sequential",  // sequential, parallel
    "reminderDays": [3, 7],
    "expirationDays": 14
  },
  "message": {
    "subject": "Please sign: Service Agreement",
    "body": "Please review and sign the attached service agreement."
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "requestId": "550e8400-e29b-41d4-a716-446655440005",
    "documentId": "550e8400-e29b-41d4-a716-446655440001",
    "status": "PENDING",
    "createdAt": "2026-03-03T14:30:00Z",
    "expiresAt": "2026-03-17T14:30:00Z",
    "signers": [
      {
        "signerId": "550e8400-e29b-41d4-a716-446655440006",
        "email": "jane.smith@company.com",
        "status": "PENDING",
        "signingUrl": "https://signportal.company.com/sign/abc123"
      },
      {
        "signerId": "550e8400-e29b-41d4-a716-446655440007",
        "email": "bob.johnson@company.com",
        "status": "WAITING",
        "signingUrl": null  // Will be available after previous signer completes
      }
    ]
  }
}
```

### Apply Signature

Apply a signature to a document field (for programmatic signing).

```http
POST /api/v1/signatures/apply
Authorization: Bearer <token>
Content-Type: application/json

{
  "documentId": "550e8400-e29b-41d4-a716-446655440001",
  "fieldId": "550e8400-e29b-41d4-a716-446655440008",
  "signature": {
    "type": "draw",  // draw, text, image, certificate
    "data": "data:image/png;base64,iVBORw0KGgo...",
    "timestamp": "2026-03-03T14:30:00Z"
  },
  "mfaToken": "abc123"  // Required for AES signatures
}
```

### Verify Signature

Verify the authenticity of a signature.

```http
POST /api/v1/signatures/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "documentId": "550e8400-e29b-41d4-a716-446655440001"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "documentIntegrity": true,
    "signatures": [
      {
        "signerId": "550e8400-e29b-41d4-a716-446655440006",
        "signerName": "Jane Smith",
        "valid": true,
        "signedAt": "2026-03-03T15:00:00Z",
        "certificate": {
          "issuer": "SignPortal CA",
          "validFrom": "2025-01-01T00:00:00Z",
          "validTo": "2027-01-01T00:00:00Z",
          "thumbprint": "A1B2C3D4E5F6..."
        },
        "timestamp": {
          "authority": "SignPortal TSA",
          "time": "2026-03-03T15:00:01Z",
          "valid": true
        }
      }
    ]
  }
}
```

### Cancel Signature Request

Cancel a pending signature request.

```http
POST /api/v1/signatures/cancel
Authorization: Bearer <token>
Content-Type: application/json

{
  "requestId": "550e8400-e29b-41d4-a716-446655440005",
  "reason": "Document needs revision"
}
```

---

## Workflows

### Create Workflow

Create a custom workflow definition.

```http
POST /api/v1/workflows
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Contract Approval",
  "description": "Standard contract approval workflow",
  "steps": [
    {
      "order": 1,
      "type": "approval",
      "assignee": {
        "type": "role",
        "value": "Manager"
      },
      "action": "approve",
      "timeout": "P3D"
    },
    {
      "order": 2,
      "type": "parallel",
      "branches": [
        {
          "assignee": {
            "type": "role",
            "value": "Legal"
          },
          "action": "review"
        },
        {
          "assignee": {
            "type": "role",
            "value": "Finance"
          },
          "action": "review"
        }
      ],
      "timeout": "P5D"
    },
    {
      "order": 3,
      "type": "signature",
      "assignee": {
        "type": "role",
        "value": "Director"
      },
      "signatureType": "AES"
    }
  ],
  "onTimeout": "escalate",
  "escalateTo": "VP"
}
```

### Start Workflow

Start a workflow for a document.

```http
POST /api/v1/workflows/start
Authorization: Bearer <token>
Content-Type: application/json

{
  "workflowId": "550e8400-e29b-41d4-a716-446655440009",
  "documentId": "550e8400-e29b-41d4-a716-446655440001",
  "metadata": {
    "contractValue": 50000,
    "vendor": "Acme Corp"
  }
}
```

### Get Workflow Status

Get the current status of a workflow instance.

```http
GET /api/v1/workflows/{instanceId}/status
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "instanceId": "550e8400-e29b-41d4-a716-446655440010",
    "workflowId": "550e8400-e29b-41d4-a716-446655440009",
    "workflowName": "Contract Approval",
    "status": "IN_PROGRESS",
    "currentStep": 2,
    "totalSteps": 3,
    "startedAt": "2026-03-03T14:30:00Z",
    "steps": [
      {
        "order": 1,
        "type": "approval",
        "status": "COMPLETED",
        "completedBy": "Jane Smith",
        "completedAt": "2026-03-03T16:00:00Z",
        "action": "approved"
      },
      {
        "order": 2,
        "type": "parallel",
        "status": "IN_PROGRESS",
        "branches": [
          {
            "assignee": "Legal",
            "status": "COMPLETED",
            "completedAt": "2026-03-03T17:00:00Z"
          },
          {
            "assignee": "Finance",
            "status": "PENDING"
          }
        ]
      },
      {
        "order": 3,
        "type": "signature",
        "status": "PENDING"
      }
    ]
  }
}
```

### Complete Task

Complete a workflow task.

```http
POST /api/v1/workflows/tasks/{taskId}/complete
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "approve",  // approve, reject, review
  "comment": "Approved as per policy",
  "attachments": []
}
```

---

## Forms

### Create Form

Create a new form template.

```http
POST /api/v1/forms
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Employee Onboarding Form",
  "description": "Collect new employee information",
  "fields": [
    {
      "id": "full_name",
      "type": "text",
      "label": "Full Name",
      "required": true,
      "validation": {
        "minLength": 2,
        "maxLength": 100
      }
    },
    {
      "id": "email",
      "type": "email",
      "label": "Email Address",
      "required": true
    },
    {
      "id": "department",
      "type": "dropdown",
      "label": "Department",
      "required": true,
      "options": [
        {"value": "engineering", "label": "Engineering"},
        {"value": "sales", "label": "Sales"},
        {"value": "hr", "label": "Human Resources"}
      ]
    },
    {
      "id": "start_date",
      "type": "date",
      "label": "Start Date",
      "required": true
    },
    {
      "id": "signature",
      "type": "signature",
      "label": "Employee Signature",
      "required": true
    }
  ],
  "settings": {
    "submitButtonText": "Submit Form",
    "confirmationMessage": "Thank you for submitting the form.",
    "notifyOnSubmission": ["hr@company.com"]
  }
}
```

### Submit Form Response

Submit a response to a form.

```http
POST /api/v1/forms/{formId}/responses
Content-Type: application/json

{
  "responses": {
    "full_name": "John Doe",
    "email": "john.doe@company.com",
    "department": "engineering",
    "start_date": "2026-04-01",
    "signature": "data:image/png;base64,iVBORw0KGgo..."
  },
  "metadata": {
    "submittedFrom": "192.168.1.100",
    "userAgent": "Mozilla/5.0..."
  }
}
```

### Get Form Responses

Get responses for a form.

```http
GET /api/v1/forms/{formId}/responses
Authorization: Bearer <token>
```

---

## Multi-Factor Authentication

### Initiate MFA

Initiate MFA verification for sensitive operations.

```http
POST /api/v1/mfa/initiate
Authorization: Bearer <token>
Content-Type: application/json

{
  "operation": "sign_document",
  "documentId": "550e8400-e29b-41d4-a716-446655440001",
  "methods": ["ldap", "sms", "webauthn"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "550e8400-e29b-41d4-a716-446655440011",
    "requiredMethods": ["ldap", "sms", "webauthn"],
    "completedMethods": [],
    "expiresAt": "2026-03-03T14:40:00Z"
  }
}
```

### Verify LDAP

Verify LDAP credentials.

```http
POST /api/v1/mfa/verify/ldap
Authorization: Bearer <token>
Content-Type: application/json

{
  "sessionId": "550e8400-e29b-41d4-a716-446655440011",
  "username": "user@company.com",
  "password": "********"
}
```

### Send SMS OTP

Request SMS OTP delivery.

```http
POST /api/v1/mfa/sms/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "sessionId": "550e8400-e29b-41d4-a716-446655440011"
}
```

### Verify SMS OTP

Verify SMS OTP code.

```http
POST /api/v1/mfa/verify/sms
Authorization: Bearer <token>
Content-Type: application/json

{
  "sessionId": "550e8400-e29b-41d4-a716-446655440011",
  "code": "123456"
}
```

### WebAuthn Challenge

Get WebAuthn challenge for biometric verification.

```http
POST /api/v1/mfa/webauthn/challenge
Authorization: Bearer <token>
Content-Type: application/json

{
  "sessionId": "550e8400-e29b-41d4-a716-446655440011"
}
```

### Verify WebAuthn

Verify WebAuthn response.

```http
POST /api/v1/mfa/verify/webauthn
Authorization: Bearer <token>
Content-Type: application/json

{
  "sessionId": "550e8400-e29b-41d4-a716-446655440011",
  "credential": {
    "id": "base64url-encoded-credential-id",
    "response": {
      "authenticatorData": "base64url-encoded",
      "clientDataJSON": "base64url-encoded",
      "signature": "base64url-encoded"
    }
  }
}
```

---

## Audit Logs

### Get Audit Logs

Retrieve audit trail entries.

```http
GET /api/v1/audit/logs
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `documentId` | string | Filter by document |
| `userId` | string | Filter by user |
| `eventType` | string | Filter by event type |
| `startDate` | ISO8601 | Start date range |
| `endDate` | ISO8601 | End date range |
| `page` | integer | Page number |
| `limit` | integer | Items per page |

**Response:**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "auditId": "550e8400-e29b-41d4-a716-446655440012",
        "timestamp": "2026-03-03T14:30:00Z",
        "eventType": "DOCUMENT_SIGNED",
        "actor": {
          "userId": "550e8400-e29b-41d4-a716-446655440000",
          "email": "jane.smith@company.com",
          "name": "Jane Smith"
        },
        "document": {
          "documentId": "550e8400-e29b-41d4-a716-446655440001",
          "name": "Contract-2026-001.pdf"
        },
        "context": {
          "ipAddress": "192.168.1.100",
          "userAgent": "Mozilla/5.0..."
        },
        "details": {
          "signatureAlgorithm": "RSA-4096-SHA512",
          "mfaVerified": true
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 500,
      "totalPages": 25
    }
  }
}
```

### Export Audit Logs

Export audit logs in various formats.

```http
POST /api/v1/audit/export
Authorization: Bearer <token>
Content-Type: application/json

{
  "format": "csv",  // csv, json, xlsx
  "filters": {
    "documentId": "550e8400-e29b-41d4-a716-446655440001",
    "startDate": "2026-01-01T00:00:00Z",
    "endDate": "2026-03-31T23:59:59Z"
  },
  "deliveryMethod": "download"  // download, email
}
```

---

## Webhooks

### Register Webhook

Register a webhook endpoint for event notifications.

```http
POST /api/v1/webhooks
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://your-app.com/webhooks/signportal",
  "events": [
    "document.uploaded",
    "document.signed",
    "document.completed",
    "workflow.completed"
  ],
  "secret": "your-webhook-secret",
  "active": true
}
```

### Webhook Payload

Example webhook payload:

```json
{
  "event": "document.signed",
  "timestamp": "2026-03-03T14:30:00Z",
  "data": {
    "documentId": "550e8400-e29b-41d4-a716-446655440001",
    "documentName": "Contract-2026-001.pdf",
    "signerId": "550e8400-e29b-41d4-a716-446655440006",
    "signerName": "Jane Smith",
    "signerEmail": "jane.smith@company.com",
    "signedAt": "2026-03-03T14:30:00Z",
    "remainingSigners": 1
  },
  "signature": "sha256=abc123..."  // HMAC signature for verification
}
```

### Webhook Event Types

| Event | Description |
|-------|-------------|
| `document.uploaded` | New document uploaded |
| `document.viewed` | Document viewed by user |
| `document.signed` | Signature applied to document |
| `document.rejected` | Signature rejected |
| `document.completed` | All signatures collected |
| `document.expired` | Signature request expired |
| `workflow.started` | Workflow instance started |
| `workflow.step_completed` | Workflow step completed |
| `workflow.completed` | Workflow finished |
| `workflow.cancelled` | Workflow cancelled |

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "DOCUMENT_NOT_FOUND",
    "message": "The requested document does not exist",
    "details": {
      "documentId": "550e8400-e29b-41d4-a716-446655440001"
    }
  },
  "requestId": "req-abc123"
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request parameters |
| `DOCUMENT_NOT_FOUND` | 404 | Document does not exist |
| `SIGNATURE_EXPIRED` | 410 | Signature request has expired |
| `MFA_REQUIRED` | 403 | MFA verification required |
| `MFA_FAILED` | 401 | MFA verification failed |
| `WORKFLOW_ERROR` | 409 | Workflow state conflict |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Rate Limiting

API requests are rate limited:

| Endpoint Category | Limit |
|-------------------|-------|
| Authentication | 10 requests/minute |
| Document Upload | 50 requests/hour |
| Document Read | 1000 requests/hour |
| Signature Operations | 100 requests/hour |
| Webhook Events | 10000 events/hour |

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1614556800
```

---

## SDK Examples

### Node.js

```javascript
const SignPortal = require('@signportal/sdk');

const client = new SignPortal({
  baseUrl: 'https://signportal.company.com',
  apiKey: 'your-api-key'
});

// Upload document
const doc = await client.documents.upload({
  file: fs.readFileSync('contract.pdf'),
  name: 'Contract-2026-001.pdf',
  classification: 'CONFIDENTIAL'
});

// Request signatures
await client.signatures.request({
  documentId: doc.documentId,
  signers: [
    { email: 'jane@company.com', name: 'Jane Smith' }
  ]
});
```

### Python

```python
from signportal import SignPortalClient

client = SignPortalClient(
    base_url='https://signportal.company.com',
    api_key='your-api-key'
)

# Upload document
doc = client.documents.upload(
    file=open('contract.pdf', 'rb'),
    name='Contract-2026-001.pdf',
    classification='CONFIDENTIAL'
)

# Request signatures
client.signatures.request(
    document_id=doc['documentId'],
    signers=[
        {'email': 'jane@company.com', 'name': 'Jane Smith'}
    ]
)
```

### C# / .NET

```csharp
using SignPortal.SDK;

var client = new SignPortalClient(
    "https://signportal.company.com",
    "your-api-key"
);

// Upload document
var doc = await client.Documents.UploadAsync(
    File.OpenRead("contract.pdf"),
    "Contract-2026-001.pdf",
    Classification.Confidential
);

// Request signatures
await client.Signatures.RequestAsync(new SignatureRequest
{
    DocumentId = doc.DocumentId,
    Signers = new[] {
        new Signer { Email = "jane@company.com", Name = "Jane Smith" }
    }
});
```

---

*API Version: 1.0*  
*Last Updated: March 2026*
