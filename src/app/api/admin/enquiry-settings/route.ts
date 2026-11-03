import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { defaultEnquirySettings, getEnquirySettings, saveEnquirySettings, validEndpoint, type EnquiryPopupCopy } from '@/lib/enquiry-settings'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  try {
    const { enabled, endpoint, token, popup, formUrl, sheetUrl } = await getEnquirySettings()
    return NextResponse.json({ enabled, endpoint, hasToken: Boolean(token), popup, formUrl, sheetUrl }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json({ error: 'Settings unavailable' }, { status: 503 })
  }
}

function validPopup(value: unknown): value is EnquiryPopupCopy {
  if (!value || typeof value !== 'object') return false
  const popup = value as Record<string, unknown>
  const limits: Record<keyof EnquiryPopupCopy, number> = {
    badgeEn: 100, badgeHi: 100, headingEn: 140, headingHi: 140,
    introEn: 400, introHi: 400, submitEn: 80, submitHi: 80,
  }
  return Object.entries(limits).every(([key, max]) => typeof popup[key] === 'string' && (popup[key] as string).trim().length > 0 && (popup[key] as string).length <= max)
}

export async function PUT(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  try {
    const input = await request.json() as { formUrl?: unknown; sheetUrl?: unknown; enabled?: unknown; endpoint?: unknown; token?: unknown; popup?: unknown }
    if (typeof input.enabled !== 'boolean' || typeof input.endpoint !== 'string' || input.endpoint.length > 1000 || typeof input.token !== 'string' || input.token.length > 256) {
      return NextResponse.json({ error: 'Check the destination settings.' }, { status: 400 })
    }
    const old = await getEnquirySettings()
    const endpoint = input.endpoint.trim()
    const token = input.token || old.token
    const popup = input.popup === undefined ? old.popup : input.popup
    if ((endpoint && !validEndpoint(endpoint)) || (input.enabled && (!validEndpoint(endpoint) || token.length < 24))) {
      return NextResponse.json({ error: 'Add a valid Apps Script URL and a secret of at least 24 characters.' }, { status: 400 })
    }
    if (!validPopup(popup)) return NextResponse.json({ error: 'Check the popup wording fields.' }, { status: 400 })
    const formUrl = typeof input.formUrl === 'string' ? input.formUrl.trim() : old.formUrl || ''
    const sheetUrl = typeof input.sheetUrl === 'string' ? input.sheetUrl.trim() : old.sheetUrl || ''
    if ((formUrl && !/^https:\/\/(?:docs\.google\.com\/forms\/|forms\.gle\/)[A-Za-z0-9_/?=&.-]+$/.test(formUrl)) || (sheetUrl && !/^https:\/\/docs\.google\.com\/spreadsheets\/[A-Za-z0-9_/?=&#.-]+$/.test(sheetUrl))) {
      return NextResponse.json({ error: 'Use a valid Google Form or Google Sheet link.' }, { status: 400 })
    }
    await saveEnquirySettings({ enabled: input.enabled, endpoint, token, popup, formUrl, sheetUrl })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Could not save enquiry settings.' }, { status: 500 })
  }
}
