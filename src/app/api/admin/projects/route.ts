import { NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { getSiteContent, saveSiteContent, type Project, type ProjectCategory } from '@/lib/site-content'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function safeText(value: unknown, max: number) {
  return typeof value === 'string' && value.length <= max ? value.trim() : null
}
function safePhoto(value: unknown) {
  if (typeof value !== 'string' || value.length > 1500) return false
  return /^\/api\/media\/[a-f0-9-]{20,50}\.webp$/.test(value)
    || /^\/images\/[a-z0-9/_-]+\.(webp|svg|png|jpg)$/.test(value)
    || value === '/storefront-showcase.webp'
    || /^https:\/\/[a-z0-9.-]+(?::\d+)?(?:\/[^\s]*)?$/i.test(value)
}
export async function PUT(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin || new URL(origin).host !== new URL(request.url).host) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })
  const length = Number(request.headers.get('content-length') ?? '0')
  if (length > 10_000_000) return NextResponse.json({ error: 'Content is too large.' }, { status: 413 })
  let input: Record<string, unknown>
  try { input = await request.json() as Record<string, unknown> } catch { return NextResponse.json({ error: 'Invalid project data.' }, { status: 400 }) }
  const heading = safeText(input.heading, 140)
  const subheading = safeText(input.subheading, 500)
  if (!heading || !subheading || !Array.isArray(input.projects)) return NextResponse.json({ error: 'Add a heading and description before saving.' }, { status: 400 })
  const projects: Project[] = []
  for (const row of input.projects) {
    if (!row || typeof row !== 'object') return NextResponse.json({ error: 'Check each project entry.' }, { status: 400 })
    const item = row as Record<string, unknown>
    const id = safeText(item.id, 80)
    const title = safeText(item.title, 140)
    const description = safeText(item.description, 500)
    const category = safeText(item.category, 30)
    const location = safeText(item.location, 120)
    const capacity = safeText(item.capacity, 80)
    if (!id || !title || description === null || !['Residential', 'Commercial', 'Industrial'].includes(category ?? '') || location === null || capacity === null || !safePhoto(item.image)) {
      return NextResponse.json({ error: 'Each project needs a title, category and valid uploaded photo. Delete unfinished projects before publishing.' }, { status: 400 })
    }
    projects.push({ id, title, description, category: category as ProjectCategory, location, capacity, image: item.image as string })
  }
  if (new Set(projects.map(project => project.id)).size !== projects.length) return NextResponse.json({ error: 'Project IDs must be unique.' }, { status: 400 })
  try {
    const current = await getSiteContent()
    await saveSiteContent({ ...current, projectsHeading: heading, projectsSubheading: subheading, projects })
    revalidateTag('awadh-site-content', { expire: 0 })
    revalidatePath('/', 'page')
    return NextResponse.json({ ok: true, projects, heading, subheading })
  } catch {
    return NextResponse.json({ error: 'Could not save projects. Check your configured storage.' }, { status: 500 })
  }
}
