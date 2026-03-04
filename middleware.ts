import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ============================================================================
// Rate Limiting Store (In-memory for demo - use Redis in production)
// ============================================================================

const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Rate limit configurations (more lenient for demo)
const RATE_LIMITS = {
  default: { windowMs: 60000, max: 200 },      // 200 requests per minute
  auth: { windowMs: 300000, max: 20 },         // 20 auth attempts per 5 minutes
  api: { windowMs: 60000, max: 120 },          // 120 API calls per minute
  upload: { windowMs: 3600000, max: 100 },     // 100 uploads per hour
}

function getRateLimitKey(ip: string, path: string): string {
  // Only rate limit actual auth API calls, not page views
  if (path.startsWith('/api/auth')) {
    return `auth:${ip}`
  }
  if (path.startsWith('/api/upload') || path.includes('/documents/new')) {
    return `upload:${ip}`
  }
  if (path.startsWith('/api/')) {
    return `api:${ip}`
  }
  return `default:${ip}`
}

function getRateLimitConfig(key: string) {
  const type = key.split(':')[0] as keyof typeof RATE_LIMITS
  return RATE_LIMITS[type] || RATE_LIMITS.default
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number; resetIn: number } {
  const config = getRateLimitConfig(key)
  const now = Date.now()
  const record = rateLimitStore.get(key)
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs })
    return { allowed: true, remaining: config.max - 1, resetIn: config.windowMs }
  }
  
  if (record.count >= config.max) {
    return { allowed: false, remaining: 0, resetIn: record.resetTime - now }
  }
  
  record.count++
  return { allowed: true, remaining: config.max - record.count, resetIn: record.resetTime - now }
}

// ============================================================================
// Security Headers
// ============================================================================

const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}

// ============================================================================
// Blocked Patterns (DOS/Injection Protection)
// ============================================================================

const BLOCKED_PATTERNS = [
  // SQL Injection patterns
  /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
  /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
  /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
  
  // XSS patterns
  /((\%3C)|<)((\%2F)|\/)*[a-z0-9\%]+((\%3E)|>)/i,
  /((\%3C)|<)((\%69)|i|(\%49))((\%6D)|m|(\%4D))((\%67)|g|(\%47))[^\n]+((\%3E)|>)/i,
  
  // Path traversal
  /\.\.\//,
  /\.\.%2f/i,
  
  // Command injection
  /[;&|`$]/,
]

function containsMaliciousPattern(value: string): boolean {
  return BLOCKED_PATTERNS.some(pattern => pattern.test(value))
}

// ============================================================================
// Middleware Function
// ============================================================================

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  
  // Get client IP
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const ip = forwardedFor?.split(',')[0].trim() || realIP || '127.0.0.1'
  
  // Skip rate limiting for static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // Files with extensions
  ) {
    return NextResponse.next()
  }
  
  // Check for malicious patterns in URL
  const fullPath = pathname + searchParams.toString()
  if (containsMaliciousPattern(decodeURIComponent(fullPath))) {
    console.log(`[SECURITY] Blocked malicious request from ${ip}: ${fullPath}`)
    return new NextResponse('Forbidden', { status: 403 })
  }
  
  // Rate limiting
  const rateLimitKey = getRateLimitKey(ip, pathname)
  const { allowed, remaining, resetIn } = checkRateLimit(rateLimitKey)
  
  if (!allowed) {
    console.log(`[SECURITY] Rate limit exceeded for ${ip} on ${pathname}`)
    return new NextResponse(
      JSON.stringify({
        error: 'Too many requests',
        message: 'Please try again later',
        retryAfter: Math.ceil(resetIn / 1000),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(Math.ceil(resetIn / 1000)),
          'X-RateLimit-Limit': String(getRateLimitConfig(rateLimitKey).max),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(resetIn / 1000)),
        },
      }
    )
  }
  
  // Create response with security headers
  const response = NextResponse.next()
  
  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', String(getRateLimitConfig(rateLimitKey).max))
  response.headers.set('X-RateLimit-Remaining', String(remaining))
  response.headers.set('X-RateLimit-Reset', String(Math.ceil(resetIn / 1000)))
  
  return response
}

// ============================================================================
// Middleware Configuration
// ============================================================================

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
