'use client'

import { useEffect, useRef, useState } from 'react'
import { Leaf, ShieldCheck, SolarPanel, Wallet, type LucideIcon } from 'lucide-react'
import { useLanguage } from '@/components/language/LanguageProvider'

type ImpactStatData = {
  icon: LucideIcon
  value: number
  prefix?: string
  prefixHi?: string
  suffix: string
  label: string
  labelHi: string
  description: string
  descriptionHi: string
}

const stats: ImpactStatData[] = [
  {
    icon: SolarPanel,
    value: 2000,
    suffix: '+',
    label: 'Installations',
    labelHi: 'सोलर इंस्टॉलेशन',
    description: 'Homes and businesses served',
    descriptionHi: 'घरों और व्यवसायों को सेवा',
  },
  {
    icon: Wallet,
    value: 90,
    suffix: '%',
    prefix: 'Up to ',
    prefixHi: 'तक ',
    label: 'Bill savings',
    labelHi: 'बिजली बिल में बचत',
    description: 'Savings depend on your system and usage',
    descriptionHi: 'बचत सिस्टम और उपयोग पर निर्भर है',
  },
  {
    icon: Leaf,
    value: 78000,
    prefix: '₹',
    suffix: '',
    label: 'PM Surya Ghar subsidy',
    labelHi: 'पीएम सूर्य घर सब्सिडी',
    description: 'Up to, subject to eligibility',
    descriptionHi: 'पात्रता के अनुसार अधिकतम',
  },
  {
    icon: ShieldCheck,
    value: 25,
    suffix: ' yrs',
    label: 'Panel output warranty',
    labelHi: 'पैनल आउटपुट वारंटी',
    description: 'Long-term performance assurance',
    descriptionHi: 'लंबे समय के प्रदर्शन का भरोसा',
  },
]

function ImpactStat({ stat, hi, started }: { stat: ImpactStatData; hi: boolean; started: boolean }) {
  const { icon: Icon, value, prefix = '', prefixHi, suffix, label, labelHi, description, descriptionHi } = stat
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!started) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(value)
      return
    }

    const startTime = performance.now()
    const duration = 1500
    let frame = 0
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setCount(Math.round(value * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [started, value])

  return (
    <article
      className="impact-stat"
      aria-label={`${prefixHi && hi ? prefixHi : prefix}${value.toLocaleString('en-IN')}${suffix} ${hi ? labelHi : label}`}
    >
      <Icon className="impact-stat-icon" size={30} strokeWidth={2.2} aria-hidden="true" />
      <strong aria-live="off">
        <span aria-hidden="true">{hi ? prefixHi ?? prefix : prefix}{count.toLocaleString('en-IN')}{suffix}</span>
      </strong>
      <span className="impact-stat-label">{hi ? labelHi : label}</span>
      <small>{hi ? descriptionHi : description}</small>
    </article>
  )
}

export function ImpactStats() {
  const { language } = useLanguage()
  const hi = language === 'hi'
  const sectionRef = useRef<HTMLElement>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || started) return

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setStarted(true)
      observer.disconnect()
    }, { threshold: 0.2 })

    observer.observe(section)
    return () => observer.disconnect()
  }, [started])

  return (
    <section ref={sectionRef} className="impact-stats" aria-label={hi ? 'हमारा प्रभाव' : 'Our impact'}>
      <div className="impact-stats-inner">
        {stats.map((stat) => <ImpactStat stat={stat} hi={hi} started={started} key={stat.label} />)}
      </div>
    </section>
  )
}
