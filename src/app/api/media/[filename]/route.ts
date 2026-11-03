import { readFile } from 'node:fs/promises'
import path from 'node:path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(_request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params
  if (!/^[a-f0-9-]{20,50}\.webp$/.test(filename)) return new Response('Not found', { status: 404 })
  try {
    const file = await readFile(path.join(process.cwd(), 'data', 'uploads', filename))
    return new Response(new Uint8Array(file), { headers: { 'Content-Type': 'image/webp', 'Content-Length': String(file.byteLength), 'Cache-Control': 'public, max-age=604800, immutable', 'X-Content-Type-Options': 'nosniff' } })
  } catch { return new Response('Not found', { status: 404 }) }
}
