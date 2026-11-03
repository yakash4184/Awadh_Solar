'use client'

import { useEffect, useState } from 'react'
import { T, useLanguage } from '@/components/language/LanguageProvider'

const taglines = [
  { en: 'POWER YOUR FUTURE. SAVE MORE EVERY DAY.', hi: 'सौर ऊर्जा अपनाएं। हर दिन बचत पाएं।' },
  { en: "MIRZAPUR'S TRUSTED SOLAR BRAND.", hi: 'मिर्ज़ापुर का भरोसेमंद सोलर ब्रांड।' },
  { en: 'SMART SOLAR. REAL SAVINGS. LOCAL SUPPORT.', hi: 'स्मार्ट सोलर। बेहतर बचत। स्थानीय सहायता।' },
]

export function RotatingHeroTagline() {
  const [active, setActive] = useState(0)
  const { language } = useLanguage()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % taglines.length)
    }, 4600)
    return () => window.clearInterval(interval)
  }, [])

  const tagline = taglines[active]
  const text = language === 'hi' ? tagline.hi : tagline.en

  return (
    <span
      key={`${language}-${active}`}
      className="hero-color-shifting-letters hero-tagline-rotating"
      data-text={text}
      aria-live="off"
    >
      <T hi={tagline.hi}>{tagline.en}</T>
    </span>
  )
}
