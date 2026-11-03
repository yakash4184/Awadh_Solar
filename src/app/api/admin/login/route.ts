import { NextResponse } from 'next/server'
import { adminConfigured, adminSessionCookie, checkAdminCredentials, createAdminSession } from '@/lib/admin-auth'

export const runtime = 'nodejs'
const attempts = new Map<string, { count: number; startedAt: number }>()
const WINDOW_MS = 15 * 60 * 1000

function sameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  return !origin || new URL(origin).host === new URL(request.url).host
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local'
  const now = Date.now()
  const record = attempts.get(ip)
  if (record && now - record.startedAt < WINDOW_MS && record.count >= 8) {
    return NextResponse.json({ error: 'Too many login attempts. Try again in 15 minutes.' }, { status: 429 })
  }
  if (!adminConfigured()) {
    return NextResponse.json({ error: 'Admin login is not configured. Set ADMIN_USERNAME, a 16+ character ADMIN_PASSWORD, and a random 32+ character ADMIN_SESSION_SECRET in .env.local, then restart the app.' }, { status: 503 })
  }
  let body: { username?: unknown; password?: unknown }
  try { body = await request.json() as typeof body } catch { return NextResponse.json({ error: 'Invalid sign-in request.' }, { status: 400 }) }
  const username = typeof body.username === 'string' ? body.username.slice(0, 100) : ''
  const password = typeof body.password === 'string' ? body.password.slice(0, 256) : ''
  if (!checkAdminCredentials(username, password)) {
    attempts.set(ip, record && now - record.startedAt < WINDOW_MS ? { ...record, count: record.count + 1 } : { count: 1, startedAt: now })
    return NextResponse.json({ error: 'Login ID or password is incorrect.' }, { status: 401 })
  }
  attempts.delete(ip)
  const session = createAdminSession()
  const response = NextResponse.json({ ok: true })
  response.cookies.set(adminSessionCookie, session.value, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: session.maxAge })
  return response
}
