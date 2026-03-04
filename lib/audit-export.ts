// ============================================================================
// Audit Log Export Service
// ============================================================================

export interface AuditLogEntry {
  id: string
  userId: string | null
  userName: string | null
  userEmail: string | null
  action: string
  resource: string
  resourceId: string | null
  documentId: string | null
  documentName: string | null
  details: Record<string, unknown> | null
  ipAddress: string | null
  userAgent: string | null
  createdAt: Date
}

export interface AuditExportOptions {
  format: 'csv' | 'json' | 'pdf'
  dateRange?: {
    start: Date
    end: Date
  }
  filters?: {
    actions?: string[]
    userIds?: string[]
    resourceTypes?: string[]
  }
  includeDetails?: boolean
}

// ============================================================================
// Export Functions
// ============================================================================

export function exportToCSV(logs: AuditLogEntry[], includeDetails = false): string {
  const headers = [
    'ID',
    'Timestamp',
    'User Name',
    'User Email',
    'Action',
    'Resource Type',
    'Resource ID',
    'Document Name',
    'IP Address',
    'User Agent',
  ]

  if (includeDetails) {
    headers.push('Details')
  }

  const rows = logs.map(log => {
    const row = [
      log.id,
      log.createdAt.toISOString(),
      log.userName || 'System',
      log.userEmail || '-',
      formatAction(log.action),
      log.resource,
      log.resourceId || '-',
      log.documentName || '-',
      log.ipAddress || '-',
      sanitizeForCSV(log.userAgent || '-'),
    ]

    if (includeDetails) {
      row.push(log.details ? JSON.stringify(log.details) : '-')
    }

    return row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  })

  return [headers.join(','), ...rows].join('\n')
}

export function exportToJSON(logs: AuditLogEntry[], pretty = true): string {
  const formatted = logs.map(log => ({
    id: log.id,
    timestamp: log.createdAt.toISOString(),
    user: {
      id: log.userId,
      name: log.userName,
      email: log.userEmail,
    },
    action: log.action,
    actionLabel: formatAction(log.action),
    resource: {
      type: log.resource,
      id: log.resourceId,
    },
    document: log.documentId ? {
      id: log.documentId,
      name: log.documentName,
    } : null,
    details: log.details,
    metadata: {
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
    },
  }))

  return pretty ? JSON.stringify(formatted, null, 2) : JSON.stringify(formatted)
}

export function generateAuditReportHTML(
  logs: AuditLogEntry[],
  enterpriseName: string,
  dateRange?: { start: Date; end: Date }
): string {
  const actionCounts = logs.reduce((acc, log) => {
    acc[log.action] = (acc[log.action] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const uniqueUsers = new Set(logs.map(l => l.userEmail).filter(Boolean)).size

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Audit Log Report - ${enterpriseName}</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      line-height: 1.6; 
      color: #37322f; 
      max-width: 1200px; 
      margin: 0 auto; 
      padding: 40px;
      background: #f7f5f3;
    }
    .header { 
      background: white; 
      padding: 32px; 
      border-radius: 12px; 
      margin-bottom: 24px;
      box-shadow: 0 2px 8px rgba(55, 50, 47, 0.1);
    }
    .logo { font-size: 24px; font-weight: bold; margin-bottom: 8px; }
    .logo span { color: #6b6560; }
    h1 { font-size: 28px; margin: 16px 0 8px 0; }
    .subtitle { color: #6b6560; }
    .stats { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
      gap: 16px; 
      margin: 24px 0;
    }
    .stat-card { 
      background: white; 
      padding: 20px; 
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(55, 50, 47, 0.1);
    }
    .stat-value { font-size: 32px; font-weight: bold; color: #37322f; }
    .stat-label { color: #6b6560; font-size: 14px; }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(55, 50, 47, 0.1);
    }
    th, td { 
      padding: 12px 16px; 
      text-align: left; 
      border-bottom: 1px solid #f0eeeb; 
    }
    th { 
      background: #37322f; 
      color: white; 
      font-weight: 600;
    }
    tr:hover td { background: #f7f5f3; }
    .action-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }
    .action-create { background: #d1fae5; color: #065f46; }
    .action-read { background: #dbeafe; color: #1e40af; }
    .action-update { background: #fef3c7; color: #92400e; }
    .action-delete { background: #fee2e2; color: #991b1b; }
    .action-sign { background: #ede9fe; color: #5b21b6; }
    .action-login { background: #d1fae5; color: #065f46; }
    .action-logout { background: #f3f4f6; color: #4b5563; }
    .footer { 
      text-align: center; 
      margin-top: 40px; 
      color: #6b6560; 
      font-size: 14px;
    }
    @media print {
      body { background: white; padding: 20px; }
      .stat-card, .header, table { box-shadow: none; border: 1px solid #e5e5e5; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">Sign<span>Portal</span></div>
    <h1>Audit Log Report</h1>
    <p class="subtitle">${enterpriseName}</p>
    ${dateRange ? `<p class="subtitle">Period: ${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}</p>` : ''}
  </div>

  <div class="stats">
    <div class="stat-card">
      <div class="stat-value">${logs.length}</div>
      <div class="stat-label">Total Events</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${uniqueUsers}</div>
      <div class="stat-label">Unique Users</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${actionCounts['sign'] || 0}</div>
      <div class="stat-label">Signatures</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${actionCounts['create'] || 0}</div>
      <div class="stat-label">Documents Created</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Timestamp</th>
        <th>User</th>
        <th>Action</th>
        <th>Resource</th>
        <th>IP Address</th>
      </tr>
    </thead>
    <tbody>
      ${logs.map(log => `
        <tr>
          <td>${log.createdAt.toLocaleString()}</td>
          <td>
            <div>${log.userName || 'System'}</div>
            <div style="font-size: 12px; color: #6b6560;">${log.userEmail || ''}</div>
          </td>
          <td><span class="action-badge action-${log.action}">${formatAction(log.action)}</span></td>
          <td>
            <div>${log.resource}</div>
            ${log.documentName ? `<div style="font-size: 12px; color: #6b6560;">${log.documentName}</div>` : ''}
          </td>
          <td style="font-size: 12px; color: #6b6560;">${log.ipAddress || '-'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="footer">
    <p>Generated on ${new Date().toLocaleString()}</p>
    <p>© ${new Date().getFullYear()} SignPortal. All rights reserved.</p>
  </div>
</body>
</html>
`
}

// ============================================================================
// Helper Functions
// ============================================================================

function formatAction(action: string): string {
  const actionLabels: Record<string, string> = {
    create: 'Created',
    read: 'Viewed',
    update: 'Updated',
    delete: 'Deleted',
    sign: 'Signed',
    approve: 'Approved',
    reject: 'Rejected',
    login: 'Logged In',
    logout: 'Logged Out',
    export: 'Exported',
    share: 'Shared',
  }
  return actionLabels[action] || action
}

function sanitizeForCSV(value: string): string {
  // Remove line breaks and limit length
  return value.replace(/[\r\n]/g, ' ').substring(0, 200)
}

// ============================================================================
// API Response Helpers
// ============================================================================

export function createCSVResponse(csv: string, filename: string): Response {
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}

export function createJSONResponse(json: string, filename: string): Response {
  return new Response(json, {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}

export function createHTMLResponse(html: string): Response {
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}
