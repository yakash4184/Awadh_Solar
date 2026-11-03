'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const ADMIN_TAB_SESSION_KEY = 'awadh-admin-tab-session'

export function AdminTabSessionGuard() {
  const router = useRouter()

  useEffect(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    const isRefresh = navigation?.type === 'reload'
    const hasTabSession = sessionStorage.getItem(ADMIN_TAB_SESSION_KEY) === 'active'

    if (isRefresh || !hasTabSession) {
      sessionStorage.removeItem(ADMIN_TAB_SESSION_KEY)
      void fetch('/api/admin/logout', { method: 'POST', keepalive: true }).finally(() => {
        router.refresh()
      })
    }
  }, [router])

  return null
}
