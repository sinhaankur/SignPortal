import { NextRequest, NextResponse } from 'next/server'

// In-memory config for demo (replace with DB in production)
let providerConfig = {
  azure: { connected: false, config: {} },
  google: { connected: false, config: {} },
  okta: { connected: false, config: {} },
  saml: { connected: false, config: {} }
}

export async function GET() {
  return NextResponse.json(providerConfig)
}

export async function POST(req: NextRequest) {
  const { provider, config } = await req.json()
  if (!providerConfig[provider]) return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
  providerConfig[provider] = { connected: true, config }
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const { provider } = await req.json()
  if (!providerConfig[provider]) return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
  providerConfig[provider] = { connected: false, config: {} }
  return NextResponse.json({ success: true })
}
