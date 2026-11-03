import type { Metadata } from 'next'
import { AdminLoginForm } from '@/components/admin/AdminLoginForm'
import { adminConfigured } from '@/lib/admin-auth'

export const metadata: Metadata = { title: 'Admin sign in | Awadh Enterprises', robots: { index: false, follow: false } }
export const dynamic = 'force-dynamic'

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ returnTo?: string | string[] }> }) {
  const params = await searchParams
  const candidate = Array.isArray(params.returnTo) ? params.returnTo[0] : params.returnTo
  const returnTo = candidate === '/admin' ? candidate : '/?edit=projects'
  return <AdminLoginForm configured={adminConfigured()} redirectTo={returnTo} />
}
