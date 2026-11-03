import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { getSiteContent } from '@/lib/site-content'

export const metadata: Metadata = { title: 'Website dashboard | Awadh Enterprises', robots: { index: false, follow: false } }
export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  if (!await isAdminAuthenticated()) redirect('/admin/login')
  const [content] = await Promise.all([getSiteContent()])
  return <AdminDashboard initialContent={content} adminId={process.env.ADMIN_USERNAME ?? 'Admin'} />
}
