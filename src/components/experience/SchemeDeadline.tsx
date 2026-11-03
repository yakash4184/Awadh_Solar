'use client'

import { useEffect, useState } from 'react'
import { Hourglass, ArrowUpRight } from 'lucide-react'

// Published scheme implementation period, ending at midnight IST after 31 March.

export function SchemeDeadline() {
  const [deadline, setDeadline] = useState(Date.parse('2027-03-31T23:59:59+05:30'))
  const [syncStatus, setSyncStatus] = useState('Checking official portal…')
  useEffect(() => {
    let active = true
    const refresh = async () => {
      try {
        const res = await fetch('/api/scheme-deadline', { cache: 'no-store' })
        if (!res.ok) throw new Error('Unavailable')
        const data = await res.json()
        const parsed = Date.parse(data.endsAt)
        if (!Number.isFinite(parsed)) throw new Error('Invalid date')
        if (active) {
          setDeadline(parsed)
          setSyncStatus(data.synced ? 'Synced with official portal · checks every 15 minutes' : 'Official sync unavailable · showing last known deadline')
        }
      } catch { if (active) setSyncStatus('Official sync unavailable · showing last known deadline') }
    }
    void refresh()
    const interval = setInterval(refresh, 15 * 60 * 1000)
    return () => { active = false; clearInterval(interval) }
  }, [])
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    const update = () => setNow(Date.now())
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])
  const seconds = now === null ? null : Math.max(0, Math.floor((deadline - now) / 1000))
  const values = seconds === null ? null : [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60]
  return <section className="scheme-deadline" aria-labelledby="scheme-deadline-title">
    <div className="scheme-deadline-copy">
      <span className="scheme-deadline-kicker"><Hourglass size={20} /> PM SURYA GHAR · MUFT BIJLI YOJANA</span>
      <h2 id="scheme-deadline-title">Time left to get benefit of scheme</h2>
      <p>Scheme implementation period ends on <strong>{new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'long', year: 'numeric' }).format(deadline)}</strong></p>
      <a href="https://pmsuryaghar.gov.in/#/" target="_blank" rel="noopener noreferrer">Check latest deadline on official portal <ArrowUpRight size={16} /></a>
    </div>
    <div className="scheme-deadline-clock">
      <p role="status">{syncStatus}</p>
      <div className="scheme-deadline-digits" role="timer" aria-label="Time remaining until scheme implementation period ends">{['DAYS', 'HOURS', 'MINS', 'SECS'].map((label, i) => <div key={label}><b>{values ? String(values[i]).padStart(2, '0') : '—'}</b><span>{label}</span></div>)}</div>
      <p>{now === null ? 'Loading India time…' : new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).format(now)} · IST</p>
      {seconds === 0 && <p>Published scheme period has ended. Check the official portal for updates.</p>}
    </div>
  </section>
}
