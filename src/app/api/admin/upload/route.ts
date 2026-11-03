import { randomUUID } from 'node:crypto'
import sharp from 'sharp'
import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { saveUploadedImage } from '@/lib/site-content'

export const runtime = 'nodejs'
const maxBytes = 8 * 1024 * 1024

export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin || new URL(origin).host !== new URL(request.url).host) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })
  let form: FormData
  try { form = await request.formData() } catch { return NextResponse.json({ error: 'Choose an image to upload.' }, { status: 400 }) }
  const file = form.get('file')
  if (!(file instanceof File) || file.size === 0) return NextResponse.json({ error: 'Choose an image file.' }, { status: 400 })
  if (file.size > maxBytes) return NextResponse.json({ error: 'Images must be 8 MB or smaller.' }, { status: 413 })
  let output: Buffer
  try {
    const source = Buffer.from(await file.arrayBuffer())
    const processor = sharp(source, { limitInputPixels: 40_000_000, failOn: 'error' })
    const metadata = await processor.metadata()
    if (!metadata.width || !metadata.height || !['jpeg', 'png', 'webp', 'avif'].includes(metadata.format ?? '')) {
      return NextResponse.json({ error: 'Upload a valid JPEG, PNG, WebP or AVIF image.' }, { status: 415 })
    }
    output = await processor.rotate().resize({ width: 1800, height: 1800, fit: 'inside', withoutEnlargement: true }).webp({ quality: 84 }).toBuffer()
  } catch {
    return NextResponse.json({ error: 'This image could not be processed.' }, { status: 400 })
  }
  const filename = `${randomUUID()}.webp`
  try {
    const url = await saveUploadedImage(filename, output)
    return NextResponse.json({ ok: true, url, bytes: output.byteLength })
  } catch {
    return NextResponse.json({ error: 'The image was processed but could not be saved. Check the configured media storage.' }, { status: 503 })
  }
}
