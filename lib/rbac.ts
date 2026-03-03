/**
 * Role-Based Access Control (RBAC) System
 * 
 * Designation hierarchy with granular permissions for SignPortal.
 * Access is controlled based on user designation level.
 */

// Designation hierarchy (higher number = more access)
export const DESIGNATION_HIERARCHY = {
  intern: 1,
  associate: 2,
  analyst: 3,
  senior_analyst: 4,
  team_lead: 5,
  manager: 6,
  senior_manager: 7,
  director: 8,
  vp: 9,
  svp: 10,
  evp: 11,
  cxo: 12,
  admin: 99, // Super admin - full access
} as const

export type Designation = keyof typeof DESIGNATION_HIERARCHY

// Feature permissions
export const FEATURES = {
  // Document features
  documents_view: 'documents_view',
  documents_create: 'documents_create',
  documents_edit: 'documents_edit',
  documents_delete: 'documents_delete',
  documents_sign: 'documents_sign',
  documents_approve: 'documents_approve',
  documents_bulk_operations: 'documents_bulk_operations',
  
  // Workflow features
  workflows_view: 'workflows_view',
  workflows_create: 'workflows_create',
  workflows_edit: 'workflows_edit',
  workflows_delete: 'workflows_delete',
  workflows_templates: 'workflows_templates',
  
  // Team features
  team_view: 'team_view',
  team_invite: 'team_invite',
  team_edit: 'team_edit',
  team_remove: 'team_remove',
  team_manage_roles: 'team_manage_roles',
  
  // Admin features
  admin_settings: 'admin_settings',
  admin_billing: 'admin_billing',
  admin_audit_logs: 'admin_audit_logs',
  admin_integrations: 'admin_integrations',
  admin_csv_upload: 'admin_csv_upload',
  admin_active_directory: 'admin_active_directory',
  admin_api_keys: 'admin_api_keys',
  
  // Reports
  reports_own: 'reports_own',
  reports_team: 'reports_team',
  reports_department: 'reports_department',
  reports_company: 'reports_company',
} as const

export type Feature = keyof typeof FEATURES

// Minimum designation required for each feature
export const FEATURE_REQUIREMENTS: Record<Feature, Designation> = {
  // Documents - most users can do basic operations
  documents_view: 'intern',
  documents_create: 'associate',
  documents_edit: 'associate',
  documents_delete: 'analyst',
  documents_sign: 'associate',
  documents_approve: 'team_lead',
  documents_bulk_operations: 'manager',
  
  // Workflows
  workflows_view: 'analyst',
  workflows_create: 'senior_analyst',
  workflows_edit: 'senior_analyst',
  workflows_delete: 'manager',
  workflows_templates: 'manager',
  
  // Team management - Manager and above
  team_view: 'manager',
  team_invite: 'manager',
  team_edit: 'senior_manager',
  team_remove: 'director',
  team_manage_roles: 'director',
  
  // Admin features - Director and above
  admin_settings: 'director',
  admin_billing: 'vp',
  admin_audit_logs: 'senior_manager',
  admin_integrations: 'director',
  admin_csv_upload: 'admin',
  admin_active_directory: 'admin',
  admin_api_keys: 'vp',
  
  // Reports
  reports_own: 'associate',
  reports_team: 'team_lead',
  reports_department: 'manager',
  reports_company: 'director',
}

// User interface
export interface User {
  id: string
  email: string
  name: string
  designation: Designation
  department: string
  companyId: string
  managerId?: string
  status: 'active' | 'inactive' | 'pending'
  createdAt: string
  lastLogin?: string
  avatar?: string
  phoneNumber?: string
  employeeId?: string
  // For Active Directory synced users
  adObjectId?: string
  adSyncedAt?: string
}

// Company settings for RBAC
export interface CompanyRBACSettings {
  companyId: string
  companyName: string
  useActiveDirectory: boolean
  adConfig?: ActiveDirectoryConfig
  customDesignations?: CustomDesignation[]
  featureOverrides?: Partial<Record<Feature, Designation>>
  defaultDesignation: Designation
  requireManagerApproval: boolean
  auditAllAccess: boolean
}

// Active Directory configuration
export interface ActiveDirectoryConfig {
  tenantId: string
  clientId: string
  clientSecret?: string // Stored securely on backend
  domain: string
  syncEnabled: boolean
  syncSchedule: 'hourly' | 'daily' | 'weekly' | 'manual'
  lastSyncAt?: string
  lastSyncStatus?: 'success' | 'partial' | 'failed'
  groupMappings: ADGroupMapping[]
  attributeMappings: {
    email: string
    name: string
    department: string
    title: string
    manager: string
    employeeId: string
  }
}

// Map AD groups to designations
export interface ADGroupMapping {
  adGroupId: string
  adGroupName: string
  designation: Designation
}

// Custom designation for companies
export interface CustomDesignation {
  name: string
  level: number
  displayName: string
  description?: string
}

// CSV import row structure
export interface CSVUserRow {
  email: string
  name: string
  designation: string
  department: string
  employeeId?: string
  phoneNumber?: string
  managerId?: string
}

// Access check result
export interface AccessCheckResult {
  allowed: boolean
  reason?: string
  requiredDesignation?: Designation
  userDesignation?: Designation
}

/**
 * RBAC Service Class
 */
export class RBACService {
  private currentUser: User | null = null
  private companySettings: CompanyRBACSettings | null = null

  /**
   * Initialize RBAC with current user
   */
  initialize(user: User, companySettings?: CompanyRBACSettings) {
    this.currentUser = user
    this.companySettings = companySettings || null
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUser
  }

  /**
   * Get designation level
   */
  getDesignationLevel(designation: Designation): number {
    // Check custom designations first
    if (this.companySettings?.customDesignations) {
      const custom = this.companySettings.customDesignations.find(
        d => d.name === designation
      )
      if (custom) return custom.level
    }
    return DESIGNATION_HIERARCHY[designation] || 0
  }

  /**
   * Get minimum required designation for a feature
   */
  getRequiredDesignation(feature: Feature): Designation {
    // Check company overrides first
    if (this.companySettings?.featureOverrides?.[feature]) {
      return this.companySettings.featureOverrides[feature]!
    }
    return FEATURE_REQUIREMENTS[feature]
  }

  /**
   * Check if user has access to a feature
   */
  hasAccess(feature: Feature, user?: User): AccessCheckResult {
    const targetUser = user || this.currentUser
    
    if (!targetUser) {
      return {
        allowed: false,
        reason: 'No user context available'
      }
    }

    if (targetUser.status !== 'active') {
      return {
        allowed: false,
        reason: 'User account is not active',
        userDesignation: targetUser.designation
      }
    }

    const requiredDesignation = this.getRequiredDesignation(feature)
    const requiredLevel = this.getDesignationLevel(requiredDesignation)
    const userLevel = this.getDesignationLevel(targetUser.designation)

    const allowed = userLevel >= requiredLevel

    return {
      allowed,
      reason: allowed ? undefined : `Requires ${requiredDesignation} level or higher`,
      requiredDesignation,
      userDesignation: targetUser.designation
    }
  }

  /**
   * Check if user can access team management
   */
  canAccessTeamManagement(user?: User): boolean {
    return this.hasAccess('team_view', user).allowed
  }

  /**
   * Check if user can manage a specific user
   */
  canManageUser(targetUser: User, user?: User): boolean {
    const currentUser = user || this.currentUser
    if (!currentUser) return false

    // Admin can manage anyone
    if (currentUser.designation === 'admin') return true

    // Can't manage yourself
    if (currentUser.id === targetUser.id) return false

    // Must be in same company
    if (currentUser.companyId !== targetUser.companyId) return false

    // Must have higher designation
    const currentLevel = this.getDesignationLevel(currentUser.designation)
    const targetLevel = this.getDesignationLevel(targetUser.designation)

    return currentLevel > targetLevel
  }

  /**
   * Check if user is Manager or above
   */
  isManagerOrAbove(user?: User): boolean {
    const targetUser = user || this.currentUser
    if (!targetUser) return false

    const managerLevel = this.getDesignationLevel('manager')
    const userLevel = this.getDesignationLevel(targetUser.designation)

    return userLevel >= managerLevel
  }

  /**
   * Get all features user has access to
   */
  getAccessibleFeatures(user?: User): Feature[] {
    const targetUser = user || this.currentUser
    if (!targetUser) return []

    return (Object.keys(FEATURES) as Feature[]).filter(
      feature => this.hasAccess(feature, targetUser).allowed
    )
  }

  /**
   * Get all designation options for a company
   */
  getDesignationOptions(): { value: Designation; label: string; level: number }[] {
    const options: { value: Designation; label: string; level: number }[] = []

    // Add standard designations
    for (const [key, level] of Object.entries(DESIGNATION_HIERARCHY)) {
      if (key !== 'admin') { // Don't show admin in regular selection
        options.push({
          value: key as Designation,
          label: formatDesignationLabel(key as Designation),
          level
        })
      }
    }

    // Add custom designations
    if (this.companySettings?.customDesignations) {
      for (const custom of this.companySettings.customDesignations) {
        options.push({
          value: custom.name as Designation,
          label: custom.displayName,
          level: custom.level
        })
      }
    }

    // Sort by level
    return options.sort((a, b) => a.level - b.level)
  }

  /**
   * Parse CSV file for bulk user import
   */
  parseCSVContent(content: string): { users: CSVUserRow[]; errors: string[] } {
    const lines = content.trim().split('\n')
    const errors: string[] = []
    const users: CSVUserRow[] = []

    if (lines.length < 2) {
      errors.push('CSV must have header row and at least one data row')
      return { users, errors }
    }

    // Parse header
    const header = lines[0].split(',').map(h => h.trim().toLowerCase())
    const requiredFields = ['email', 'name', 'designation', 'department']
    
    for (const field of requiredFields) {
      if (!header.includes(field)) {
        errors.push(`Missing required column: ${field}`)
      }
    }

    if (errors.length > 0) {
      return { users, errors }
    }

    // Parse rows
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      
      if (values.length !== header.length) {
        errors.push(`Row ${i + 1}: Column count mismatch`)
        continue
      }

      const row: Record<string, string> = {}
      header.forEach((h, idx) => {
        row[h] = values[idx]?.trim() || ''
      })

      // Validate email
      if (!isValidEmail(row.email)) {
        errors.push(`Row ${i + 1}: Invalid email "${row.email}"`)
        continue
      }

      // Validate designation
      const designation = row.designation.toLowerCase().replace(/\s+/g, '_')
      if (!isValidDesignation(designation)) {
        errors.push(`Row ${i + 1}: Invalid designation "${row.designation}"`)
        continue
      }

      users.push({
        email: row.email,
        name: row.name,
        designation: designation,
        department: row.department,
        employeeId: row.employeeid || row.employee_id,
        phoneNumber: row.phone || row.phonenumber || row.phone_number,
        managerId: row.managerid || row.manager_id || row.manager_email
      })
    }

    return { users, errors }
  }

  /**
   * Validate CSV data before import
   */
  validateCSVImport(users: CSVUserRow[]): { valid: boolean; warnings: string[] } {
    const warnings: string[] = []
    const emails = new Set<string>()

    for (const user of users) {
      // Check for duplicates
      if (emails.has(user.email.toLowerCase())) {
        warnings.push(`Duplicate email found: ${user.email}`)
      }
      emails.add(user.email.toLowerCase())

      // Check designation level
      const level = DESIGNATION_HIERARCHY[user.designation as Designation]
      if (level >= DESIGNATION_HIERARCHY.vp) {
        warnings.push(`High-level designation for ${user.email}: ${user.designation}`)
      }
    }

    return { valid: warnings.length === 0, warnings }
  }
}

// Helper functions
export function formatDesignationLabel(designation: Designation): string {
  const labels: Record<Designation, string> = {
    intern: 'Intern',
    associate: 'Associate',
    analyst: 'Analyst',
    senior_analyst: 'Senior Analyst',
    team_lead: 'Team Lead',
    manager: 'Manager',
    senior_manager: 'Senior Manager',
    director: 'Director',
    vp: 'Vice President',
    svp: 'Senior Vice President',
    evp: 'Executive Vice President',
    cxo: 'C-Level Executive',
    admin: 'System Administrator'
  }
  return labels[designation] || designation
}

export function isValidDesignation(value: string): boolean {
  return value in DESIGNATION_HIERARCHY
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)

  return result
}

// Singleton instance
export const rbacService = new RBACService()

// React hook for RBAC (to be used in components)
export function useRBAC() {
  return rbacService
}

// Export CSV template
export const CSV_TEMPLATE = `email,name,designation,department,employee_id,phone_number,manager_email
john.doe@company.com,John Doe,manager,Engineering,EMP001,+1234567890,jane.smith@company.com
jane.smith@company.com,Jane Smith,director,Engineering,EMP002,+1234567891,
mike.wilson@company.com,Mike Wilson,analyst,Sales,EMP003,+1234567892,john.doe@company.com`

export default rbacService
