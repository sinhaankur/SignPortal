import { NextRequest, NextResponse } from 'next/server'
import speakeasy from 'speakeasy'
import qrcode from 'qrcode'

// In-memory store for demo (replace with DB in production)
const userTotp: Record<string, { secret: string }> = {}

// POST /api/mfa/totp/enroll { userId }
export async function POST(req: NextRequest) {
  const { userId } = await req.json()
  const secret = speakeasy.generateSecret({ name: `SignPortal (${userId})` })
  userTotp[userId] = { secret: secret.base32 }
  const qr = await qrcode.toDataURL(secret.otpauth_url!)
  return NextResponse.json({ secret: secret.base32, qr })
}

// POST /api/mfa/totp/verify { userId, token }
export async function PUT(req: NextRequest) {
  const { userId, token } = await req.json()
  const user = userTotp[userId]
  if (!user) return NextResponse.json({ error: 'Not enrolled' }, { status: 400 })
  const verified = speakeasy.totp.verify({
    secret: user.secret,
    encoding: 'base32',
    token
  })
  return NextResponse.json({ verified })
}
