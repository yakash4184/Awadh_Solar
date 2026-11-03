import { NextResponse } from 'next/server'
import { getEnquirySettings } from '@/lib/enquiry-settings'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const attempts = new Map<string, number[]>()
const leadsFile = path.join(process.cwd(), 'data', 'leads.json')

export async function GET() {
  try {
    const settings = await getEnquirySettings()
    const envSheetUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL
    const isConfigured = Boolean(envSheetUrl || (settings.enabled && settings.endpoint))
    return NextResponse.json(
      { enabled: true, sheetsConnected: isConfigured },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch {
    return NextResponse.json({ enabled: true, sheetsConnected: false })
  }
}

export async function POST(request: Request) {
  // Origin check
  const origin = request.headers.get('origin')
  if (origin && new URL(request.url).origin !== origin) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
  }

  // Rate limiting per IP (max 6 submissions in 10 minutes)
  const now = Date.now()
  for (const [key, times] of attempts) {
    if (times.every((t) => now - t > 600000)) attempts.delete(key)
  }
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'local'
  const recent = (attempts.get(ip) || []).filter((t) => now - t < 600000)
  if (recent.length >= 6) {
    return NextResponse.json(
      { error: 'Too many submissions. Please contact us directly on WhatsApp or phone.' },
      { status: 429 }
    )
  }
  attempts.set(ip, [...recent, now])

  try {
    const body = await request.json()

    // Honeypot check for bots
    if (body.website) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const name = String(body.name || '').trim()
    const phone = String(body.phone || '').trim().replace(/\D/g, '')
    const requirement = String(body.requirement || 'Residential Solar').trim()
    const billRange = String(body.billRange || 'Not Specified').trim()
    const locality = String(body.locality || 'Mirzapur').trim()
    const consent = body.consent === true

    // Validation
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json({ error: 'Please enter a valid full name.' }, { status: 400 })
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit Indian mobile number.' },
        { status: 400 }
      )
    }

    // Generate unique Lead ID
    const leadCode = Math.random().toString(36).substring(2, 6).toUpperCase()
    const leadId = `OTT-${new Date().getFullYear()}-${leadCode}`
    const createdAt = new Date().toISOString()

    const leadRecord = {
      leadId,
      createdAt,
      name,
      phone,
      requirement,
      billRange,
      locality,
      consent,
      source: 'Website Enquiry Popup',
      ip,
      sheetSynced: false,
    }

    // 1. Always record in server-side persistent JSON file so no lead is lost!
    try {
      await mkdir(path.dirname(leadsFile), { recursive: true })
      let existingLeads: typeof leadRecord[] = []
      try {
        existingLeads = JSON.parse(await readFile(leadsFile, 'utf8'))
      } catch {
        existingLeads = []
      }
      existingLeads.unshift(leadRecord)
      await writeFile(leadsFile, JSON.stringify(existingLeads.slice(0, 500), null, 2), 'utf8')
    } catch (fsErr) {
      console.error('Failed to log lead locally:', fsErr)
    }

    // 2. Google Sheets Integration
    const settings = await getEnquirySettings()
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || (settings.enabled ? settings.endpoint : '')
    const webhookToken = process.env.GOOGLE_SHEETS_WEBHOOK_TOKEN || settings.token

    let sheetStatus = 'pending_webhook'
    if (webhookUrl) {
      try {
        const payload = {
          token: webhookToken,
          leadId,
          timestamp: createdAt,
          name,
          phone,
          requirement,
          billRange,
          locality,
          consent,
          source: 'Website Popup',
        }

        const sheetRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(10000),
        })

        const sheetResult = await sheetRes.json().catch(() => null) as { ok?: boolean } | null
        if (sheetRes.ok && sheetResult?.ok === true) {
          sheetStatus = 'synced_to_sheet'
          leadRecord.sheetSynced = true
        } else {
          sheetStatus = 'sheet_post_returned_non200'
        }
      } catch (sheetErr) {
        console.error('Google Sheets POST failed:', sheetErr)
        sheetStatus = 'sheet_connection_error'
      }
    }

    // Format WhatsApp follow-up link for instant 1-click booking
    const waText = encodeURIComponent(
      `Hello Awadh Solar Team! I submitted an enquiry on your website.\n` +
      `Lead ID: ${leadId}\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Requirement: ${requirement}\n` +
      `Monthly Bill: ${billRange}\n` +
      `City: ${locality}\n` +
      `Please schedule my free rooftop survey.`
    )
    const whatsappUrl = `https://wa.me/918953069011?text=${waText}`

    return NextResponse.json({
      ok: true,
      leadId,
      sheetStatus,
      whatsappUrl,
      message: 'Enquiry received successfully! Our solar engineer will contact you shortly.',
    })
  } catch (err) {
    console.error('Enquiry handler error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please contact us via WhatsApp or Phone.' },
      { status: 500 }
    )
  }
}
