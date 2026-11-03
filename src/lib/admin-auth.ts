import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'awadh_admin_session'
const SESSION_SECONDS = 60 * 60 * 8
const secret = () => process.env.ADMIN_SESSION_SECRET ?? ''

export function adminConfigured() {
  const username = process.env.ADMIN_USERNAME ?? ''
  const password = process.env.ADMIN_PASSWORD ?? ''
  return Boolean(username && username !== 'choose-a-private-admin-id' && password.length >= 16 && password !== 'replace-with-a-strong-unique-password' && secret().length >= 32 && !secret().startsWith('replace-with-'))
}

function signature(payload: string) {
  return createHmac('sha256', secret()).update(payload).digest('base64url')
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  return a.length === b.length && timingSafeEqual(a, b)
}

export function checkAdminCredentials(username: string, password: string) {
  const expectedUser = process.env.ADMIN_USERNAME ?? ''
  const expectedPassword = process.env.ADMIN_PASSWORD ?? ''
  return adminConfigured() && safeEqual(username, expectedUser) && safeEqual(password, expectedPassword)
}

export function createAdminSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS
  const payload = Buffer.from(JSON.stringify({ user: process.env.ADMIN_USERNAME, expiresAt })).toString('base64url')
  return { value: `${payload}.${signature(payload)}`, maxAge: SESSION_SECONDS }
}

function validSession(value: string | undefined) {
  if (!value || !secret()) return false
  const [payload, suppliedSignature, extra] = value.split('.')
  if (!payload || !suppliedSignature || extra) return false
  if (!safeEqual(suppliedSignature, signature(payload))) return false
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { user?: string; expiresAt?: number }
    return data.user === process.env.ADMIN_USERNAME && typeof data.expiresAt === 'number' && data.expiresAt > Date.now() / 1000
  } catch { return false }
}

export async function isAdminAuthenticated() {
  const jar = await cookies()
  return validSession(jar.get(COOKIE_NAME)?.value)
}

export const adminSessionCookie = COOKIE_NAME
