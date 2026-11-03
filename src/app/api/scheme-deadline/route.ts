import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
const origin = 'https://pmsuryaghar.gov.in/'
type Snapshot = { endsAt: string; checkedAt: string }
let snapshot: Snapshot | null = null
let lastAttempt = 0
let syncing: Promise<void> | null = null

async function readOfficial(url: string) {
  const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(25000) })
  if (!response.ok) throw new Error('Official portal unavailable')
  const body = await response.text()
  if (body.length > 16000000) throw new Error('Unexpected portal response')
  return body
}

async function sync() {
  const html = await readOfficial(origin)
  const mainPath = html.match(/src="(main\.[a-f0-9]+\.js)"/)?.[1]
  if (!mainPath) throw new Error('Portal structure changed')
  const main = await readOfficial(new URL(mainPath, origin).href)
  // Discover the portal bootstrap chunk rather than pinning its changing build hash.
  const bootstrapId = main.match(/loadManifest\)\([^)]*\)[\s\S]{0,150}?\.e\((\d+)\)/)?.[1]
    || main.match(/then\(\w+=>\w+\.e\((\d+)\)\.then/)?.[1]
  if (!bootstrapId) throw new Error('Bootstrap not found')
  const hash = main.match(new RegExp(`${bootstrapId}:"([a-f0-9]+)"`))?.[1]
  if (!hash) throw new Error('Bootstrap hash not found')
  const script = await readOfficial(new URL(`${bootstrapId}.${hash}.js`, origin).href)
  const value = script.match(/startSchemeCountdown\(\)\s*\{[\s\S]{0,180}?new Date\("(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})"\)/)?.[1]
  if (!value) throw new Error('Official countdown not found')
  const endsAt = `${value}+05:30`
  if (!Number.isFinite(Date.parse(endsAt))) throw new Error('Invalid deadline')
  snapshot = { endsAt, checkedAt: new Date().toISOString() }
}

export async function GET() {
  if (Date.now() - lastAttempt > 15 * 60 * 1000 && !syncing) {
    lastAttempt = Date.now()
    syncing = sync().catch(() => {}).finally(() => { syncing = null })
  }
  if (syncing) await syncing
  return NextResponse.json({
    ...(snapshot || { endsAt: '2027-03-31T23:59:59+05:30', checkedAt: null }),
    synced: Boolean(snapshot && Date.now() - Date.parse(snapshot.checkedAt) < 30 * 60 * 1000),
    source: origin,
  }, { headers: { 'Cache-Control': 'no-store' } })
}
