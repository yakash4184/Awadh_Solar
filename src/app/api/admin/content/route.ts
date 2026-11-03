import { NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { defaultSiteContent, saveSiteContent, type Product, type Project, type ProjectCategory, type SiteContent, type Solution } from '@/lib/site-content'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function sameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  return Boolean(origin) && new URL(origin as string).host === new URL(request.url).host
}
function text(value: unknown, max: number, fallback = ''): string | null {
  if (typeof value !== 'string' || value.length > max) return fallback ? fallback : null
  return value.trim()
}
function photo(value: unknown): string | null {
  if (typeof value !== 'string' || value.length > 1500) return null
  if (/^\/api\/media\/[a-f0-9-]{20,50}\.webp$/.test(value)) return value
  if (/^\/images\/[a-z0-9/_-]+\.(webp|svg|png|jpg)$/.test(value)) return value
  if (/^\/storefront-showcase\.webp$/.test(value)) return value
  if (/^https:\/\/[a-z0-9.-]+(?::\d+)?(?:\/[^\s]*)?$/i.test(value)) return value
  return null
}
function link(value: unknown): string | null {
  const raw = text(value, 1500)
  if (!raw) return null
  if (raw.startsWith('/') && !raw.startsWith('//')) return raw
  try { return new URL(raw).protocol === 'https:' ? raw : null } catch { return null }
}
function list<T>(input: unknown, fallback: T[], mapItem: (item: Record<string, unknown>) => T | null, maxItems = 30): T[] | null {
  if (!Array.isArray(input) || input.length > maxItems) return null
  const result = input.map(item => item && typeof item === 'object' ? mapItem(item as Record<string, unknown>) : null)
  return result.some(item => item === null) ? null : result as T[]
}

export async function GET() {
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })
  const { getSiteContent } = await import('@/lib/site-content')
  return NextResponse.json(await getSiteContent(), { headers: { 'Cache-Control': 'no-store' } })
}

export async function PUT(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })
  const size = Number(request.headers.get('content-length') ?? '0')
  if (size > 10_000_000) return NextResponse.json({ error: 'Content is too large.' }, { status: 413 })
  let input: Record<string, unknown>
  try { input = await request.json() as Record<string, unknown> } catch { return NextResponse.json({ error: 'Invalid content data.' }, { status: 400 }) }

  const solutions = list<Solution>(input.solutions, defaultSiteContent.solutions, (item) => {
    const id = text(item.id, 50); const title = text(item.title, 120); const description = text(item.description, 500); const image = photo(item.image); const href = link(item.href)
    if (!id || !title || description === null || !image || !href) return null
    return { id, title, description, image, href }
  })
  const products = list<Product>(input.products, defaultSiteContent.products, (item) => {
    const id = text(item.id, 50); const name = text(item.name, 120); const category = text(item.category, 80); const description = text(item.description, 500); const image = photo(item.image); const detail = text(item.detail, 1000); const quote = text(item.quote, 300); const href = link(item.href)
    if (!id || !name || !category || description === null || !image || detail === null || quote === null || !href) return null
    return { id, name, category, description, image, detail, quote, href }
  })
  const projects = list<Project>(input.projects, defaultSiteContent.projects, (item) => {
    const id = text(item.id, 80); const title = text(item.title, 140); const description = text(item.description, 500); const category = text(item.category, 30)
    const location = text(item.location, 120); const capacity = text(item.capacity, 80); const image = item.image === '' ? '' : photo(item.image)
    if (!id || !title || description === null || !['Residential', 'Commercial', 'Industrial'].includes(category ?? '') || location === null || capacity === null || image === null) return null
    return { id, title, description, category: category as ProjectCategory, location, capacity, image }
  }, Number.POSITIVE_INFINITY)
  const projectIds = projects?.map(project => project.id) ?? []
  const sourceCalc = input.calculator as Record<string, unknown> | undefined
  const numeric = (key: keyof SiteContent['calculator'], min: number, max: number) => {
    const value = sourceCalc?.[key]
    return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max ? Math.round(value) : null
  }
  const calculator = {
    rupeesPerUnit: numeric('rupeesPerUnit', 1, 100), monthlyUnitsPerKw: numeric('monthlyUnitsPerKw', 1, 1000), panelWatts: numeric('panelWatts', 100, 1000),
    costPerKwMin: numeric('costPerKwMin', 10000, 10000000), costPerKwMax: numeric('costPerKwMax', 10000, 10000000),
  }
  const brand = text(input.brand, 120); const phone = text(input.phone, 50); const address = text(input.address, 300)
  const heroEyebrow = text(input.heroEyebrow, 140); const heroHeading = text(input.heroHeading, 100); const heroHighlight = text(input.heroHighlight, 100); const heroDescription = text(input.heroDescription, 500)
  const showroomPhoto = photo(input.showroomPhoto); const showroomTitle = text(input.showroomTitle, 140); const showroomDescription = text(input.showroomDescription, 500); const showroomHref = link(input.showroomHref); const heroPhoto = photo(input.heroPhoto)
  const projectsHeading = text(input.projectsHeading, 140); const projectsSubheading = text(input.projectsSubheading, 500)
  if (!brand || !phone || !address || !heroEyebrow || !heroHeading || !heroHighlight || !heroDescription || !showroomPhoto || !showroomTitle || !showroomDescription || !showroomHref || !heroPhoto || !projectsHeading || !projectsSubheading || !solutions || !products || !projects || new Set(projectIds).size !== projectIds.length || Object.values(calculator).some(value => value === null) || (calculator.costPerKwMax ?? -1) < (calculator.costPerKwMin ?? 0)) {
    return NextResponse.json({ error: 'Please check the required fields, photo URLs and calculator assumptions.' }, { status: 400 })
  }
  if (projects.some(project => !project.image)) return NextResponse.json({ error: 'Upload a photo for every project, or delete any unfinished project before publishing.' }, { status: 400 })
  const timer = input.countdown as SiteContent['countdown'] | undefined
  const shopVideo = link(input.shopVideo)
  if (!timer || typeof timer.enabled !== 'boolean' || typeof timer.endsAt !== 'string' || (timer.enabled && !Number.isFinite(Date.parse(timer.endsAt))) || !text(timer.messageEn, 180) || !text(timer.messageHi, 180) || !text(timer.ctaEn, 40) || !text(timer.ctaHi, 40) || !shopVideo) {
    return NextResponse.json({ error: 'Check the timer date, both translations and video URL.' }, { status: 400 })
  }
  const countdown = { enabled: timer.enabled, endsAt: timer.endsAt, messageEn: timer.messageEn.trim(), messageHi: timer.messageHi.trim(), ctaEn: timer.ctaEn.trim(), ctaHi: timer.ctaHi.trim() }
  const content: SiteContent = { countdown, shopVideo, brand, phone, address, heroEyebrow, heroHeading, heroHighlight, heroDescription, showroomPhoto, showroomTitle, showroomDescription, showroomHref, heroPhoto, projectsHeading, projectsSubheading, projects, solutions, products, calculator: calculator as SiteContent['calculator'] }
  try {
    await saveSiteContent(content)
    revalidateTag('awadh-site-content', { expire: 0 })
    revalidatePath('/', 'page')
    revalidatePath('/[...slug]', 'page')
    return NextResponse.json({ ok: true, savedAt: new Date().toISOString() })
  } catch {
    return NextResponse.json({ error: 'Could not save changes. Check the configured database or persistent server storage.' }, { status: 500 })
  }
}
