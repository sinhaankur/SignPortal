import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET() {
  // List backups in Supabase Storage (bucket: 'backups')
  const { data, error } = await supabase.storage.from('backups').list()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ backups: data })
}

export async function POST(req: NextRequest) {
  // Create a new backup in Supabase Storage (simulate JSON dump)
  const backupData = { timestamp: new Date().toISOString(), data: { /* TODO: dump real data */ } }
  const filename = `backup-${Date.now()}.json`
  const { error } = await supabase.storage.from('backups').upload(filename, JSON.stringify(backupData), { contentType: 'application/json' })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, filename })
}
