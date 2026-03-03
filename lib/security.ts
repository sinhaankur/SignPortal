/**
 * SignPortal Security Configuration
 * 
 * This module provides security utilities for protecting against:
 * - DOS/DDOS attacks (Rate limiting)
 * - XSS attacks (Input sanitization)
 * - CSRF attacks (Token validation)
 * - SQL Injection (Parameterized queries)
 * - Brute force attacks (Account lockout)
 */

// ============================================================================
// Rate Limiting Configuration
// ============================================================================

export interface RateLimitConfig {
  windowMs: number      // Time window in milliseconds
  maxRequests: number   // Max requests per window
  message: string       // Error message when limit exceeded
  statusCode: number    // HTTP status code when limited
}

export const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  // General API rate limit
  api: {
    windowMs: 15 * 60 * 1000,  // 15 minutes
    maxRequests: 100,           // 100 requests per 15 minutes
    message: 'Too many requests, please try again later.',
    statusCode: 429,
  },
  
  // Authentication rate limit (stricter for login/signup)
  auth: {
    windowMs: 15 * 60 * 1000,  // 15 minutes
    maxRequests: 5,             // 5 attempts per 15 minutes
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
    statusCode: 429,
  },
  
  // Document upload rate limit
  upload: {
    windowMs: 60 * 60 * 1000,  // 1 hour
    maxRequests: 50,            // 50 uploads per hour
    message: 'Upload limit exceeded. Please try again later.',
    statusCode: 429,
  },
  
  // API key rate limit (for integrations)
  apiKey: {
    windowMs: 60 * 1000,       // 1 minute
    maxRequests: 60,            // 60 requests per minute
    message: 'API rate limit exceeded.',
    statusCode: 429,
  },
}

// ============================================================================
// Security Headers Configuration
// ============================================================================

export const SECURITY_HEADERS = {
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Enable XSS filter
  'X-XSS-Protection': '1; mode=block',
  
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions policy
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
  ].join('; '),
  
  // Strict Transport Security (HTTPS only)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
}

// ============================================================================
// Input Validation & Sanitization
// ============================================================================

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return ''
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return { valid: errors.length === 0, errors }
}

// ============================================================================
// Brute Force Protection
// ============================================================================

interface LoginAttempt {
  count: number
  firstAttempt: number
  lockedUntil: number | null
}

const loginAttempts = new Map<string, LoginAttempt>()

export const BRUTE_FORCE_CONFIG = {
  maxAttempts: 5,
  lockoutDuration: 15 * 60 * 1000,  // 15 minutes
  windowMs: 15 * 60 * 1000,          // 15 minutes
}

/**
 * Check if an IP/user is locked out
 */
export function isLockedOut(identifier: string): { locked: boolean; remainingTime: number } {
  const attempt = loginAttempts.get(identifier)
  
  if (!attempt) {
    return { locked: false, remainingTime: 0 }
  }
  
  if (attempt.lockedUntil && Date.now() < attempt.lockedUntil) {
    return { 
      locked: true, 
      remainingTime: Math.ceil((attempt.lockedUntil - Date.now()) / 1000 / 60) 
    }
  }
  
  // Reset if window has passed
  if (Date.now() - attempt.firstAttempt > BRUTE_FORCE_CONFIG.windowMs) {
    loginAttempts.delete(identifier)
    return { locked: false, remainingTime: 0 }
  }
  
  return { locked: false, remainingTime: 0 }
}

/**
 * Record a failed login attempt
 */
export function recordFailedAttempt(identifier: string): void {
  const attempt = loginAttempts.get(identifier)
  
  if (!attempt) {
    loginAttempts.set(identifier, {
      count: 1,
      firstAttempt: Date.now(),
      lockedUntil: null,
    })
    return
  }
  
  attempt.count++
  
  if (attempt.count >= BRUTE_FORCE_CONFIG.maxAttempts) {
    attempt.lockedUntil = Date.now() + BRUTE_FORCE_CONFIG.lockoutDuration
  }
}

/**
 * Clear login attempts after successful login
 */
export function clearAttempts(identifier: string): void {
  loginAttempts.delete(identifier)
}

// ============================================================================
// CSRF Token Generation
// ============================================================================

/**
 * Generate a CSRF token
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array)
  } else {
    // Fallback for server-side
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256)
    }
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

// ============================================================================
// IP Address Utilities
// ============================================================================

/**
 * Extract client IP from request headers
 */
export function getClientIP(headers: Headers): string {
  // Check various headers for proxy/load balancer scenarios
  const forwardedFor = headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  
  const realIP = headers.get('x-real-ip')
  if (realIP) {
    return realIP.trim()
  }
  
  return '0.0.0.0'
}

// ============================================================================
// Audit Logging
// ============================================================================

export type SecurityEventType = 
  | 'login_success'
  | 'login_failed'
  | 'logout'
  | 'password_change'
  | 'permission_change'
  | 'document_access'
  | 'document_sign'
  | 'rate_limit_exceeded'
  | 'suspicious_activity'
  | 'account_locked'
  | 'api_key_created'
  | 'api_key_revoked'

export interface SecurityEvent {
  type: SecurityEventType
  userId?: string
  ip: string
  userAgent: string
  timestamp: Date
  details: Record<string, unknown>
  severity: 'low' | 'medium' | 'high' | 'critical'
}

/**
 * Log a security event
 */
export function logSecurityEvent(event: SecurityEvent): void {
  // In production, this would send to a security logging service
  console.log('[SECURITY EVENT]', JSON.stringify({
    ...event,
    timestamp: event.timestamp.toISOString(),
  }))
  
  // TODO: Integrate with:
  // - SIEM systems (Splunk, ELK, etc.)
  // - Database audit table
  // - Alert systems for critical events
}

// ============================================================================
// Database Security (Prepared Statements Helper)
// ============================================================================

/**
 * Escape special characters for SQL (use parameterized queries instead when possible)
 */
export function escapeSQLString(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\x00/g, '\\0')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\x1a/g, '\\Z')
}

// ============================================================================
// File Upload Security
// ============================================================================

export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
  'image/jpg',
]

export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

/**
 * Validate file upload
 */
export function validateFileUpload(file: { type: string; size: number; name: string }): { valid: boolean; error?: string } {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { valid: false, error: 'File type not allowed. Supported: PDF, DOC, DOCX, PNG, JPG' }
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 50MB limit' }
  }
  
  // Check for double extensions (e.g., file.pdf.exe)
  const nameParts = file.name.split('.')
  if (nameParts.length > 2) {
    const suspiciousExtensions = ['exe', 'bat', 'cmd', 'sh', 'ps1', 'vbs', 'js']
    if (suspiciousExtensions.some(ext => nameParts.includes(ext))) {
      return { valid: false, error: 'Suspicious file name detected' }
    }
  }
  
  return { valid: true }
}
