// ============================================================================
// SignPortal Role-Based Access Control (RBAC) Configuration
// ============================================================================

/**
 * Role hierarchy and permissions for the SignPortal platform.
 * 
 * Security Model:
 * - Zero-trust architecture with tenant-isolated encryption
 * - Role-based access control (RBAC) with principle of least privilege
 * - No shared storage across enterprises
 * - Each organization remains fully private, secure, and operationally independent
 */

// ============================================================================
// Types
// ============================================================================

export type RoleLevel = 'platform' | 'enterprise' | 'department' | 'individual'

export type Permission = 
  // Platform-level permissions (Super Admin)
  | 'platform:manage'
  | 'platform:enterprises:create'
  | 'platform:enterprises:manage'
  | 'platform:enterprises:delete'
  | 'platform:security:manage'
  | 'platform:audit:view'
  | 'platform:database:manage'
  | 'platform:settings:manage'
  
  // Enterprise-level permissions (Enterprise Admin)
  | 'enterprise:manage'
  | 'enterprise:users:manage'
  | 'enterprise:roles:manage'
  | 'enterprise:ad:configure'
  | 'enterprise:policies:manage'
  | 'enterprise:integrations:manage'
  | 'enterprise:audit:view'
  | 'enterprise:reports:generate'
  
  // Department-level permissions (Manager)
  | 'department:manage'
  | 'department:users:manage'
  | 'department:workflows:manage'
  | 'department:documents:approve'
  | 'department:activity:view'
  
  // Document permissions
  | 'documents:create'
  | 'documents:read'
  | 'documents:update'
  | 'documents:delete'
  | 'documents:sign'
  | 'documents:share'
  | 'documents:download'
  | 'documents:audit:view'
  
  // Workflow permissions
  | 'workflows:create'
  | 'workflows:manage'
  | 'workflows:assign'
  | 'workflows:view'
  
  // Template permissions
  | 'templates:create'
  | 'templates:manage'
  | 'templates:use'
  | 'templates:view'
  
  // User permissions
  | 'users:invite'
  | 'users:manage'
  | 'users:view'
  | 'profile:manage'

export interface RoleDefinition {
  id: string
  name: string
  level: RoleLevel
  description: string
  permissions: Permission[]
  inherits?: string[]
  restrictions?: string[]
}

// ============================================================================
// Role Definitions
// ============================================================================

export const ROLES: Record<string, RoleDefinition> = {
  // Platform Level
  super_admin: {
    id: 'super_admin',
    name: 'Super Admin',
    level: 'platform',
    description: 'Platform-level administrator with full system access. Provisioned at the application level with complete Enterprise access privileges.',
    permissions: [
      'platform:manage',
      'platform:enterprises:create',
      'platform:enterprises:manage',
      'platform:enterprises:delete',
      'platform:security:manage',
      'platform:audit:view',
      'platform:database:manage',
      'platform:settings:manage',
    ],
    restrictions: [
      'Does not access enterprise data directly unless explicitly authorized',
      'Must authenticate with MFA for all sensitive operations',
      'All actions logged to immutable audit trail',
    ],
  },

  // Enterprise Level
  enterprise_admin: {
    id: 'enterprise_admin',
    name: 'Enterprise Admin',
    level: 'enterprise',
    description: 'Enterprise-level administrator with full control within their organization\'s isolated data silo.',
    permissions: [
      'enterprise:manage',
      'enterprise:users:manage',
      'enterprise:roles:manage',
      'enterprise:ad:configure',
      'enterprise:policies:manage',
      'enterprise:integrations:manage',
      'enterprise:audit:view',
      'enterprise:reports:generate',
      'documents:create',
      'documents:read',
      'documents:update',
      'documents:delete',
      'documents:sign',
      'documents:share',
      'documents:download',
      'documents:audit:view',
      'workflows:create',
      'workflows:manage',
      'workflows:assign',
      'workflows:view',
      'templates:create',
      'templates:manage',
      'templates:use',
      'templates:view',
      'users:invite',
      'users:manage',
      'users:view',
      'profile:manage',
    ],
    restrictions: [
      'Access limited to own enterprise data silo only',
      'Cannot access other enterprise data or platform settings',
      'Subject to enterprise-specific security policies',
    ],
  },

  // Department Level
  manager: {
    id: 'manager',
    name: 'Manager',
    level: 'department',
    description: 'Department-level manager with team management and document approval capabilities.',
    permissions: [
      'department:manage',
      'department:users:manage',
      'department:workflows:manage',
      'department:documents:approve',
      'department:activity:view',
      'documents:create',
      'documents:read',
      'documents:update',
      'documents:sign',
      'documents:share',
      'documents:download',
      'documents:audit:view',
      'workflows:create',
      'workflows:manage',
      'workflows:assign',
      'workflows:view',
      'templates:use',
      'templates:view',
      'users:view',
      'profile:manage',
    ],
    inherits: ['user'],
    restrictions: [
      'Limited to assigned departments',
      'Cannot modify enterprise-wide settings',
      'Document deletion requires approval',
    ],
  },

  // Individual Level
  user: {
    id: 'user',
    name: 'User',
    level: 'individual',
    description: 'Standard user with document creation and signing capabilities.',
    permissions: [
      'documents:create',
      'documents:read',
      'documents:sign',
      'documents:share',
      'documents:download',
      'workflows:view',
      'templates:use',
      'templates:view',
      'profile:manage',
    ],
    restrictions: [
      'Cannot delete documents',
      'Cannot manage other users',
      'Limited to personal documents and assigned workflows',
    ],
  },

  viewer: {
    id: 'viewer',
    name: 'Viewer',
    level: 'individual',
    description: 'Read-only access to assigned documents.',
    permissions: [
      'documents:read',
      'documents:download',
      'documents:audit:view',
      'workflows:view',
      'profile:manage',
    ],
    restrictions: [
      'Read-only access',
      'Cannot create, edit, or sign documents',
      'Limited to explicitly shared documents',
    ],
  },

  // Special Roles
  external_signer: {
    id: 'external_signer',
    name: 'External Signer',
    level: 'individual',
    description: 'External party invited to sign specific documents. Identity verified via email.',
    permissions: [
      'documents:read',
      'documents:sign',
      'documents:download',
    ],
    restrictions: [
      'Access limited to specific document only',
      'Email verification required before signing',
      'Session expires after signing completion',
    ],
  },
}

// ============================================================================
// Permission Checking Utilities
// ============================================================================

/**
 * Check if a role has a specific permission
 */
export function hasPermission(roleId: string, permission: Permission): boolean {
  const role = ROLES[roleId]
  if (!role) return false
  
  if (role.permissions.includes(permission)) return true
  
  // Check inherited roles
  if (role.inherits) {
    for (const inheritedRoleId of role.inherits) {
      if (hasPermission(inheritedRoleId, permission)) return true
    }
  }
  
  return false
}

/**
 * Get all permissions for a role (including inherited)
 */
export function getAllPermissions(roleId: string): Permission[] {
  const role = ROLES[roleId]
  if (!role) return []
  
  const permissions = new Set<Permission>(role.permissions)
  
  if (role.inherits) {
    for (const inheritedRoleId of role.inherits) {
      const inheritedPermissions = getAllPermissions(inheritedRoleId)
      inheritedPermissions.forEach(p => permissions.add(p))
    }
  }
  
  return Array.from(permissions)
}

/**
 * Check if user can access a specific resource based on role and ownership
 */
export function canAccess(
  roleId: string, 
  resource: string, 
  action: string, 
  context?: { 
    ownerId?: string
    userId?: string
    enterpriseId?: string
    userEnterpriseId?: string 
  }
): boolean {
  const permission = `${resource}:${action}` as Permission
  
  // Check basic permission
  if (!hasPermission(roleId, permission)) return false
  
  // Enterprise isolation check
  if (context?.enterpriseId && context?.userEnterpriseId) {
    if (context.enterpriseId !== context.userEnterpriseId) {
      // Only super_admin can access cross-enterprise
      if (roleId !== 'super_admin') return false
    }
  }
  
  return true
}

// ============================================================================
// Role Level Hierarchy
// ============================================================================

export const ROLE_HIERARCHY: RoleLevel[] = [
  'platform',
  'enterprise', 
  'department',
  'individual',
]

/**
 * Check if roleA has higher or equal level than roleB
 */
export function isHigherOrEqualRole(roleIdA: string, roleIdB: string): boolean {
  const roleA = ROLES[roleIdA]
  const roleB = ROLES[roleIdB]
  
  if (!roleA || !roleB) return false
  
  const levelA = ROLE_HIERARCHY.indexOf(roleA.level)
  const levelB = ROLE_HIERARCHY.indexOf(roleB.level)
  
  return levelA <= levelB
}

// ============================================================================
// Default Role Assignment
// ============================================================================

export const DEFAULT_ROLES = {
  /** Default role for new users signing up */
  signup: 'user',
  
  /** Default role for users provisioned via AD sync */
  adSync: 'user',
  
  /** Default role for SSO provisioned users */
  sso: 'user',
  
  /** Role for external signers */
  externalSigner: 'external_signer',
}

// ============================================================================
// AD Sync Role Mapping
// ============================================================================

export interface ADGroupMapping {
  adGroup: string
  roleId: string
  description?: string
}

/**
 * Default AD group to role mappings
 * These can be customized per enterprise
 */
export const DEFAULT_AD_ROLE_MAPPINGS: ADGroupMapping[] = [
  {
    adGroup: 'SignPortal-Admins',
    roleId: 'enterprise_admin',
    description: 'Enterprise administrators',
  },
  {
    adGroup: 'SignPortal-Managers',
    roleId: 'manager',
    description: 'Department managers',
  },
  {
    adGroup: 'SignPortal-Users',
    roleId: 'user',
    description: 'Standard users',
  },
  {
    adGroup: 'SignPortal-Viewers',
    roleId: 'viewer',
    description: 'Read-only viewers',
  },
]
