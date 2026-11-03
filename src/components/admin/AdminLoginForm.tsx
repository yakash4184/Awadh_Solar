'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { ArrowRight, LockKeyhole, Sun } from 'lucide-react'
import { ADMIN_TAB_SESSION_KEY } from '@/components/admin/AdminTabSessionGuard'

export function AdminLoginForm({ configured, redirectTo = '/admin' }: { configured: boolean; redirectTo?: string }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [ready, setReady] = useState(false)
  const logoutStarted = useRef(false)

  useEffect(() => {
    if (logoutStarted.current) return
    logoutStarted.current = true
    sessionStorage.removeItem(ADMIN_TAB_SESSION_KEY)
    void fetch('/api/admin/logout', { method: 'POST', keepalive: true }).finally(() => setReady(true))
  }, [])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setBusy(true)
    try {
      const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) })
      const data = await response.json() as { error?: string }
      if (!response.ok) { setError(data.error ?? 'Sign in failed.'); return }
      sessionStorage.setItem(ADMIN_TAB_SESSION_KEY, 'active')
      window.location.assign(redirectTo)
    } catch { setError('Could not reach the sign-in service. Please try again.') }
    finally { setBusy(false) }
  }

  return <main className="admin-login-page"><div className="login-decoration login-decoration-one"/><div className="login-decoration login-decoration-two"/><section className="login-card">
    <div className="login-brand"><span className="login-sun"><Sun size={26}/></span><span><b>AWADH</b><small>ENTERPRISES · SOLAR</small></span></div>
    <span className="login-eyebrow">PRIVATE ADMIN AREA</span><h1>Welcome back.</h1><p className="login-lede">Sign in to update your website photos, product information and solar estimates.</p>
    {configured ? <form onSubmit={submit} className="login-form"><label>Login ID<input autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} required placeholder="Enter your admin ID"/></label><label>Password<input autoComplete="current-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter your password"/></label>{error && <p className="login-error" role="alert">{error}</p>}<button className="login-submit" disabled={busy || !ready}>{busy ? 'Signing in…' : ready ? 'Sign in to dashboard' : 'Checking session…'} <ArrowRight size={17}/></button></form> : <div className="setup-hint"><b><LockKeyhole size={17}/> One-time setup needed</b><p>Admin login isn’t configured yet. Add the three admin values from <code>.env.example</code> to <code>.env.local</code>, then restart the site.</p><p>The initial admin ID and password are intentionally not preset.</p></div>}
    <a className="login-back" href="/">← Back to public website</a>
  </section><aside className="login-aside"><div className="login-aside-photo"/><div className="login-aside-copy"><span>YOUR STORE · YOUR STORY</span><h2>Keep your solar website as current as your business.</h2><p>Update the images and details customers see, all from one private workspace.</p></div></aside></main>
}
