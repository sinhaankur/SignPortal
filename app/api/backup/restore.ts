import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { supabase } from '@/lib/supabaseClient'

const BACKUP_DIR = path.resolve(process.cwd(), 'backups')

export async function POST(req: NextRequest) {
  const { source, filename } = await req.json()
  if (source === 'local') {
    // Restore from local file
    const filePath = path.join(BACKUP_DIR, filename)
    if (!fs.existsSync(filePath)) return NextResponse.json({ error: 'Backup not found' }, { status: 404 })
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    // TODO: restore data to DB
    return NextResponse.json({ success: true, restored: filename, data })
  } else if (source === 'supabase') {
    // Restore from Supabase Storage
    const { data, error } = await supabase.storage.from('backups').download(filename)
    if (error || !data) return NextResponse.json({ error: error?.message || 'Download failed' }, { status: 404 })
    const text = await data.text()
    // TODO: restore data to DB
    return NextResponse.json({ success: true, restored: filename, data: JSON.parse(text) })
  }
  return NextResponse.json({ error: 'Invalid source' }, { status: 400 })
}
