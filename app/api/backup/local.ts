import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const BACKUP_DIR = path.resolve(process.cwd(), 'backups')

export async function GET() {
  // List all backup files
  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR)
  const files = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json'))
  return NextResponse.json({ backups: files })
}

export async function POST(req: NextRequest) {
  // Create a new backup (simulate by dumping a JSON snapshot)
  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR)
  const data = { timestamp: new Date().toISOString(), data: { /* TODO: dump real data */ } }
  const filename = `backup-${Date.now()}.json`
  fs.writeFileSync(path.join(BACKUP_DIR, filename), JSON.stringify(data, null, 2))
  return NextResponse.json({ success: true, filename })
}
