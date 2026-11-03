import 'server-only'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'

export type Product = { id: string; name: string; category: string; description: string; image: string; detail: string; quote: string; href: string }
export type Solution = { id: string; title: string; description: string; image: string; href: string }
export type ProjectCategory = 'Residential' | 'Commercial' | 'Industrial'
export type Project = { id: string; title: string; description: string; category: ProjectCategory; location: string; capacity: string; image: string }
export type SiteContent = {
  countdown: { enabled: boolean; endsAt: string; messageEn: string; messageHi: string; ctaEn: string; ctaHi: string }
  shopVideo: string
  brand: string
  phone: string
  address: string
  heroEyebrow: string
  heroHeading: string
  heroHighlight: string
  heroDescription: string
  showroomPhoto: string
  showroomTitle: string
  showroomDescription: string
  showroomHref: string
  heroPhoto: string
  projectsHeading: string
  projectsSubheading: string
  projects: Project[]
  solutions: Solution[]
  products: Product[]
  calculator: { rupeesPerUnit: number; monthlyUnitsPerKw: number; panelWatts: number; costPerKwMin: number; costPerKwMax: number }
}

const image = '/images/projects/residential-rooftop-growatt.jpg'
const emptyProjectFallback = (index: number): Project => ({ id: `project-${index + 1}`, title: 'Solar Project', description: '', category: 'Residential', location: '', capacity: '', image })
export const defaultSiteContent: SiteContent = {
  countdown: { enabled: false, endsAt: '', messageEn: 'Site visits & solar consultation', messageHi: 'साइट विज़िट और सोलर परामर्श', ctaEn: 'Enquire', ctaHi: 'पूछताछ करें' },
  shopVideo: '/videos/shop.mp4',
  brand: 'Awadh Enterprises', phone: '89530 69011', address: 'Bari Basahi, Mirzapur, Mirzapur-cum-Vindhyachal, Uttar Pradesh 231001',
  heroEyebrow: "Mirzapur's Trusted Solar Energy Partner", heroHeading: "MIRZAPUR'S TRUSTED SOLAR ENERGY PARTNER", heroHighlight: 'POWER YOUR FUTURE. SAVE MORE EVERY DAY.',
  heroDescription: 'Reliable solar solutions for homes, businesses and industries. From premium solar panels to professional installation, we make clean energy simple and affordable.',
  showroomPhoto: '/images/projects/residential-rooftop-growatt.jpg', showroomTitle: 'Meet our local team in Mirzapur.', showroomDescription: 'Visit our office at Bari Basahi, Mirzapur to discuss your solar project, check live inverters, and verify PM Surya Ghar subsidy eligibility.', showroomHref: '/contact', heroPhoto: image,
  projectsHeading: '2,000+ Successful Installations',
  projectsSubheading: 'Solar projects across Mirzapur and nearby districts, for homes, businesses and industries.',
  projects: [],
  solutions: [
    { id: 'homes', title: 'Residential Rooftop Solar', description: 'Complete solar rooftop with Growatt/grid inverters and PM Surya Ghar subsidy assistance.', image: '/images/projects/residential-rooftop-growatt.jpg', href: '/solar-solutions/residential' },
    { id: 'business', title: 'Commercial & Industrial Solar', description: 'High-capacity solar setups for carpet industries, factories, schools, and commercial premises.', image: '/images/projects/commercial-carpet-bhadohi.jpg', href: '/solar-solutions/commercial' },
    { id: 'institutions', title: 'Institutional Solar Systems', description: 'Solar solutions for colleges, hospitals, and government facilities with maximum uptime.', image: '/images/projects/commercial-carpet-bhadohi.jpg', href: '/solar-solutions/institutional' },
    { id: 'products', title: 'Solar Inverters & Batteries', description: 'Tier-1 Mono PERC panels, smart grid-tied inverters, and advanced battery backup systems.', image: '/images/projects/residential-rooftop-growatt.jpg', href: '/products' },
  ],
  products: [
    { id: 'panels', name: 'Monocrystalline Solar Panels', category: 'Panels', description: 'High-efficiency Tier-1 bifacial and mono PERC solar modules with 25-year performance warranty.', image, detail: 'High power density and superior low-light generation.', quote: '', href: '/products/solar-panels' },
    { id: 'inverters', name: 'Growatt & Smart Solar Inverters', category: 'Inverters', description: 'Smart grid-tied, hybrid, and off-grid solar inverters with live mobile app generation monitoring.', image: '/images/projects/residential-rooftop-growatt.jpg', detail: 'Advanced MPPT tracking and robust surge protection.', quote: '', href: '/products/inverters' },
    { id: 'batteries', name: 'Lithium & Solar Batteries', category: 'Storage', description: 'Heavy-duty tubular and LiFePO4 solar batteries for 24×7 backup during power outages.', image: '/images/products/solar-battery.svg', detail: 'Long cycle life and fast solar charging compatibility.', quote: '', href: '/products/batteries' },
  ],
  calculator: { rupeesPerUnit: 8, monthlyUnitsPerKw: 120, panelWatts: 540, costPerKwMin: 50000, costPerKwMax: 78000 },
}

const dataDir = path.join(process.cwd(), 'data')
const contentPath = path.join(dataDir, 'site-content.json')
function supabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '')
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (!url && !key) return null
  if (!url || !key) throw new Error('Set both SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, or leave both empty to use local storage.')
  const parsedUrl = new URL(url)
  if (!['https:', 'http:'].includes(parsedUrl.protocol) || (process.env.NODE_ENV === 'production' && parsedUrl.protocol !== 'https:')) throw new Error('SUPABASE_URL must use HTTPS in production.')
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'awadh-media'
  if (!/^[a-zA-Z0-9_-]{3,63}$/.test(bucket)) throw new Error('Invalid SUPABASE_STORAGE_BUCKET value.')
  return { url: parsedUrl.origin, key, bucket }
}

export function usesSupabaseStorage() { return Boolean(supabaseConfig()) }

// Upgrade only the original starter photos; preserve all custom admin uploads.
const starterPhotos: Record<string, string> = {
  '/photo-1509391366360-2e959784a276': image,
  '/photo-1600585154340-be6161a56a0c': '/images/india/indian-solar-rooftops.webp',
  '/photo-1486406146926-c627a92ad1ab': '/storefront-showcase.webp',
  '/photo-1562774053-701939374585': '/images/india/etawah-school.webp',
  '/photo-1592833159155-c62df1b65634': '/images/products/solar-inverter.svg',
  '/photo-1621905251918-48416bd8575a': '/images/products/solar-battery.svg',
}
function currentPhoto(src: string) {
  try {
    const url = new URL(src)
    return url.hostname === 'images.unsplash.com' ? starterPhotos[url.pathname] ?? src : src
  } catch { return src }
}

function normalizeContent(stored: Partial<SiteContent>): SiteContent {
  const solutions = (Array.isArray(stored.solutions) ? stored.solutions : defaultSiteContent.solutions).map((item, index) => {
    const merged = { ...defaultSiteContent.solutions[index % defaultSiteContent.solutions.length], ...item }
    return { ...merged, image: currentPhoto(merged.image) }
  })
  const products = (Array.isArray(stored.products) ? stored.products : defaultSiteContent.products).map((item, index) => {
    const merged = { ...defaultSiteContent.products[index % defaultSiteContent.products.length], ...item, quote: item.quote ?? '', href: item.href ?? `/products/${item.id}` }
    return { ...merged, image: currentPhoto(merged.image) }
  })
  const storedProjects = Array.isArray(stored.projects) ? stored.projects : null
  const projects = storedProjects
    ? storedProjects.map((saved, index) => {
      const fallback = emptyProjectFallback(index)
      const merged = saved && typeof saved === 'object' ? { ...fallback, ...saved } : fallback
      return { ...merged, image: currentPhoto(merged.image ?? '') }
    })
    : defaultSiteContent.projects
  return { ...defaultSiteContent, ...stored, countdown: { ...defaultSiteContent.countdown, ...stored.countdown }, heroPhoto: currentPhoto(stored.heroPhoto ?? defaultSiteContent.heroPhoto), projects, solutions, products, calculator: { ...defaultSiteContent.calculator, ...stored.calculator } }
}

export async function getSiteContent(): Promise<SiteContent> {
  const supabase = supabaseConfig()
  if (supabase) {
    const response = await fetch(`${supabase.url}/rest/v1/site_content?site_key=eq.awadh&select=content`, {
      headers: { apikey: supabase.key, Authorization: `Bearer ${supabase.key}` },
      cache: 'force-cache', next: { revalidate: 3600, tags: ['awadh-site-content'] },
    })
    if (!response.ok) throw new Error(`Could not read site content from Supabase (${response.status}).`)
    const rows = await response.json() as { content?: Partial<SiteContent> }[]
    const stored = rows[0]?.content ?? {}
    return normalizeContent(stored)
  }
  try {
    const stored = JSON.parse(await readFile(contentPath, 'utf8')) as Partial<SiteContent>
    return normalizeContent(stored)
  } catch { return defaultSiteContent }
}

export async function saveSiteContent(content: SiteContent) {
  const supabase = supabaseConfig()
  if (supabase) {
    const response = await fetch(`${supabase.url}/rest/v1/site_content?on_conflict=site_key`, {
      method: 'POST', headers: { apikey: supabase.key, Authorization: `Bearer ${supabase.key}`, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ site_key: 'awadh', content }), cache: 'no-store',
    })
    if (!response.ok) throw new Error(`Could not save site content to Supabase (${response.status}).`)
    return
  }
  await mkdir(dataDir, { recursive: true })
  const tempPath = `${contentPath}.${process.pid}.tmp`
  await writeFile(tempPath, JSON.stringify(content, null, 2), { mode: 0o600 })
  await rename(tempPath, contentPath)
}

export async function saveUploadedImage(filename: string, content: Buffer) {
  const supabase = supabaseConfig()
  if (supabase) {
    const response = await fetch(`${supabase.url}/storage/v1/object/${encodeURIComponent(supabase.bucket)}/${filename}`, {
      method: 'POST', headers: { apikey: supabase.key, Authorization: `Bearer ${supabase.key}`, 'Content-Type': 'image/webp', 'x-upsert': 'false' },
      body: new Uint8Array(content), cache: 'no-store',
    })
    if (!response.ok) throw new Error(`Could not upload image to Supabase Storage (${response.status}).`)
    return `${supabase.url}/storage/v1/object/public/${encodeURIComponent(supabase.bucket)}/${filename}`
  }
  const directory = path.join(dataDir, 'uploads')
  await mkdir(directory, { recursive: true })
  await writeFile(path.join(directory, filename), content, { flag: 'wx', mode: 0o600 })
  return `/api/media/${filename}`
}
