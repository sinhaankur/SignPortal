import { PrismaClient } from '@prisma/client'
import { neon, neonConfig } from '@neondatabase/serverless'

// Configure Neon for serverless environments
neonConfig.fetchConnectionCache = true

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Helper for raw SQL queries with Neon (for edge functions)
export const sql = neon(process.env.DATABASE_URL!)

export default prisma
