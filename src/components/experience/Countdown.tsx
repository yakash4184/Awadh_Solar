'use client'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/components/language/LanguageProvider'
import type { SiteContent } from '@/lib/site-content'
export function Countdown({ settings }: { settings: SiteContent['countdown'] }) {
 const { language } = useLanguage(); const hi = language === 'hi'
 const [now, setNow] = useState<number | null>(null); const [dismissed, setDismissed] = useState(false); const ref = useRef<HTMLDivElement>(null)
 const end = Date.parse(settings.endsAt); const remaining = now === null ? 0 : Math.max(0, Math.floor((end - now) / 1000))
 useEffect(() => { try { setDismissed(sessionStorage.getItem('awadh-timer') === settings.endsAt) } catch {} setNow(Date.now()); const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id) }, [settings.endsAt])
 const visible = settings.enabled && Number.isFinite(end) && remaining > 0 && !dismissed
 useEffect(() => { if (!visible || !ref.current) { document.documentElement.style.setProperty('--timer-height', '0px'); return } const observer = new ResizeObserver(([entry]) => document.documentElement.style.setProperty('--timer-height', `${entry.contentRect.height}px`)); observer.observe(ref.current); return () => { observer.disconnect(); document.documentElement.style.setProperty('--timer-height', '0px') } }, [visible])
 if (!visible) return null
 const values = [Math.floor(remaining / 86400), Math.floor(remaining / 3600) % 24, Math.floor(remaining / 60) % 60, remaining % 60]
 return <div className="countdown" ref={ref}><span className="countdown-message">{hi ? settings.messageHi : settings.messageEn}</span><div className="countdown-digits" role="timer" aria-label={hi ? 'शेष समय' : 'Time remaining'}>{values.map((value, index) => <span key={index}><b key={value}>{String(value).padStart(2, '0')}</b><small>{(hi ? ['दिन','घं','मि','से'] : ['DAYS','HRS','MIN','SEC'])[index]}</small></span>)}</div><button className="timer-cta" onClick={() => window.dispatchEvent(new Event('awadh-enquire'))}>{hi ? settings.ctaHi : settings.ctaEn} ↗</button><button className="timer-close" aria-label={hi ? 'सूचना बंद करें' : 'Dismiss announcement'} onClick={() => { setDismissed(true); try { sessionStorage.setItem('awadh-timer', settings.endsAt) } catch {} }}>×</button></div>
}
