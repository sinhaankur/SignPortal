import { NextResponse } from 'next/server'

export async function GET() {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      server: 'ok',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        unit: 'MB'
      }
    }
  }

  // Add database check if configured
  // In production, you would check actual database connectivity
  if (process.env.DATABASE_URL) {
    healthCheck.checks.database = 'configured'
  }

  // Add Redis check if configured
  if (process.env.REDIS_URL) {
    healthCheck.checks.cache = 'configured'
  }

  return NextResponse.json(healthCheck, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    }
  })
}
