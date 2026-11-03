import { redirect } from 'next/navigation'
import Link from 'next/link'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { EnquiryManager } from '@/components/admin/EnquiryManager'
export const dynamic = 'force-dynamic'
export default async function EnquirySettingsPage() {
  if (!await isAdminAuthenticated()) redirect('/admin/login')
  return <main className="enquiry-settings-page"><Link href="/admin">← Back to dashboard</Link><EnquiryManager /></main>
}
