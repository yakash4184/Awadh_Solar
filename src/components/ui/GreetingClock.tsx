'use client'

import { useEffect, useState } from 'react'
import { Sun, SunDim, Sunset, Moon, Clock } from 'lucide-react'
import { useLanguage } from '@/components/language/LanguageProvider'

export function GreetingClock({ variant = 'compact' }: { variant?: 'compact' | 'hero' | 'topbar' }) {
  const { language } = useLanguage()
  const hi = language === 'hi'
  const [timeStr, setTimeStr] = useState<string>('')
  const [greeting, setGreeting] = useState<{
    text: string
    subtext: string
    icon: typeof Sun
    color: string
    badgeClass: string
  }>({
    text: hi ? 'नमस्ते' : 'Welcome',
    subtext: hi ? 'स्वच्छ ऊर्जा' : 'Clean Solar Energy',
    icon: Sun,
    color: '#0284c7',
    badgeClass: 'greeting-day',
  })

  useEffect(() => {
    function updateClock() {
      const now = new Date()
      // Format time in Indian Standard Time style (HH:MM:SS AM/PM)
      const hours = now.getHours()
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      const ampm = hours >= 12 ? 'PM' : 'AM'
      const formattedHours = hours % 12 || 12
      setTimeStr(`${formattedHours}:${minutes}:${seconds} ${ampm}`)

      if (hours >= 5 && hours < 12) {
        setGreeting({
          text: hi ? 'शुभ प्रभात' : 'Good Morning',
          subtext: hi ? 'सूर्य उदय • सौर ऊर्जा उत्पादन शुरू' : 'Sunrise • Solar Generation Active',
          icon: Sun,
          color: '#f59e0b',
          badgeClass: 'greeting-morning',
        })
      } else if (hours >= 12 && hours < 17) {
        setGreeting({
          text: hi ? 'शुभ दोपहर' : 'Good Afternoon',
          subtext: hi ? 'शिखर सौर समय • अधिकतम बिजली बचत' : 'Peak Solar Hours • Max Generation',
          icon: SunDim,
          color: '#0284c7',
          badgeClass: 'greeting-afternoon',
        })
      } else if (hours >= 17 && hours < 21) {
        setGreeting({
          text: hi ? 'शुभ संध्या' : 'Good Evening',
          subtext: hi ? 'नेट मीटरिंग एवं बैटरी बैकअप सक्रिय' : 'Net Metering & Battery Backup Active',
          icon: Sunset,
          color: '#d97706',
          badgeClass: 'greeting-evening',
        })
      } else {
        setGreeting({
          text: hi ? 'शुभ रात्रि' : 'Late Night',
          subtext: hi ? '24×7 सहायता • कल की धूप, आज की बचत' : '24×7 Solar Care • Stored Energy Backup',
          icon: Moon,
          color: '#38bdf8',
          badgeClass: 'greeting-night',
        })
      }
    }

    updateClock()
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [hi])

  const Icon = greeting.icon

  if (variant === 'topbar') {
    return (
      <div className="live-clock-topbar" title={greeting.subtext}>
        <span className="live-pulse" />
        <Icon size={14} style={{ color: greeting.color }} />
        <span className="greeting-text"><strong>{greeting.text}</strong></span>
        <span className="divider-dot">•</span>
        <span className="clock-time"><Clock size={12} className="inline mr-1" />{timeStr || '--:--:--'}</span>
        <span className="clock-subtext hidden xl:inline">({greeting.subtext})</span>
      </div>
    )
  }

  if (variant === 'hero') {
    return (
      <div className={`hero-greeting-pill ${greeting.badgeClass}`}>
        <span className="pill-dot" />
        <Icon size={16} style={{ color: greeting.color }} />
        <span className="pill-title">{greeting.text}!</span>
        <span className="pill-divider">|</span>
        <span className="pill-sub">{greeting.subtext}</span>
        <span className="pill-clock">
          <Clock size={13} />
          {timeStr || '--:--'}
        </span>
      </div>
    )
  }

  return (
    <div className="live-clock-badge">
      <Icon size={15} style={{ color: greeting.color }} />
      <span>{greeting.text}</span>
      <span className="font-mono text-xs opacity-90">{timeStr}</span>
    </div>
  )
}

