'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Volume2,
  VolumeX,
  MapPin,
  Clock,
  Phone,
  Navigation as NavIcon,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'
import { T, useLanguage } from '@/components/language/LanguageProvider'
import type { SiteContent } from '@/lib/site-content'
import { EnquiryTriggerButton } from '@/components/ui/EnquiryTriggerButton'

export function ShopVideo({
  content,
  localVideoExists,
}: {
  content: SiteContent
  localVideoExists: boolean
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState(false)
  const [inView, setInView] = useState(false)
  const { language } = useLanguage()
  const hi = language === 'hi'

  const available = content.shopVideo !== '/videos/shop.mp4' || localVideoExists

  useEffect(() => {
    const video = ref.current
    if (!video) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(true)
          setInView(true)
        } else {
          setInView(false)
          video.pause()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(video)
    return () => {
      observer.disconnect()
    }
  }, [available])

  useEffect(() => {
    const video = ref.current
    if (!video || !available) return

    const syncPlayback = () => {
      if (document.hidden || !inView || !ready) {
        video.pause()
        return
      }
      video.muted = muted
      video.play().catch(() => {})
    }

    syncPlayback()
    document.addEventListener('visibilitychange', syncPlayback)
    return () => document.removeEventListener('visibilitychange', syncPlayback)
  }, [available, inView, muted, ready])

  const toggleMute = () => {
    if (!ref.current) return
    ref.current.muted = !muted
    setMuted(!muted)
  }

  return (
    <section className="shop-experience" id="store" aria-labelledby="store-heading">
      <div className="shop-orb orb-one" aria-hidden="true" />
      <div className="shop-orb orb-two" aria-hidden="true" />

      {/* Left Column: Intro */}
      <div className="shop-copy">
        <span className="eyebrow">
          <Sparkles size={14} className="text-amber-500 inline mr-1" />
          <T hi="शोरूम व अनुभव केंद्र">OUR MIRZAPUR EXPERIENCE CENTER</T>
        </span>
        <h2 id="store-heading">
          <T hi="स्क्रीन से परे।">Beyond the Screen.</T>
          <br />
          <em><T hi="हमारे शोरूम में आएं।">Experience Solar in Person.</T></em>
        </h2>
        <p>
          <T hi="अपने सोलर सफ़र की शुरुआत सीधी बातचीत से करें। हमारे बाड़ी बसही स्थित शोरूम में आएं, मोनोक्रिस्टलाइन पैनल्स, ग्रिवाट इन्वर्टर्स को स्वयं देखें और तुरंत अपनी छत का सब्सिडी आकलन कराएं।">
            Visit our Bari Basahi experience hub to see real Tier-1 monocrystalline panels, test smart hybrid inverters, and verify your PM Surya Ghar subsidy in person with our engineering team.
          </T>
        </p>

        <div className="shop-feature-pills">
          <span><ShieldCheck size={14} className="text-blue-600 inline mr-1" /> Live Demo Inverters</span>
          <span><Sparkles size={14} className="text-amber-500 inline mr-1" /> Instant Subsidy Calculation</span>
        </div>

        <div className="shop-cta-row">
          <EnquiryTriggerButton className="primary-cta">
            <T hi="विज़िट का समय तय करें">Schedule Store Visit</T>
          </EnquiryTriggerButton>
          <a className="secondary-cta" href={`tel:${content.phone.replace(/\D/g, '')}`}>
            <Phone size={15} />
            <T hi="कॉल करें">Call Specialist</T>
          </a>
        </div>
      </div>

      {/* Center Column: Portrait Video Frame */}
      <div className="video-halo">
        <div className="portrait-frame">
          {available && !failed ? (
            <video
              ref={ref}
              src={ready ? content.shopVideo : undefined}
              poster="/videos/shop-poster.jpg"
              muted={muted}
              autoPlay
              loop
              playsInline
              preload="auto"
              aria-label={hi ? 'अवध एंटरप्राइजेज़ स्टोर वीडियो' : 'Awadh Enterprises Store Tour'}
              onError={() => setFailed(true)}
            />
          ) : (
            <img
              src="/videos/shop-poster.jpg"
              alt={hi ? 'अवध एंटरप्राइजेज़ स्टोर' : 'Awadh Enterprises Store Tour'}
              className="portrait-fallback-img"
            />
          )}

          <div className="frame-reflection" aria-hidden="true" />

          {/* Interactive Video Controls */}
          {available && !failed && (
            <div className="video-controls">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? 'Unmute video' : 'Mute video'}
                aria-pressed={!muted}
                title={muted ? 'Turn sound on' : 'Mute sound'}
              >
                {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: High-End Location & Visit Details Card */}
      <div className="shop-location-card">
        <div className="location-card-header">
          <span className="location-icon-badge">
            <MapPin size={20} className="text-blue-600" />
          </span>
          <div>
            <span className="location-eyebrow">HEAD OFFICE & SHOWROOM</span>
            <h3>Mirzapur, Uttar Pradesh</h3>
          </div>
        </div>

        <p className="location-address-text">{content.address}</p>

        <div className="location-hours">
          <Clock size={16} className="text-amber-500 flex-none" />
          <div>
            <strong>Monday – Saturday</strong>
            <small>9:30 AM – 7:00 PM (Sunday by Appointment)</small>
          </div>
        </div>

        <div className="location-action-btns">
          <a
            className="directions-link"
            target="_blank"
            rel="noreferrer"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              content.brand + ' ' + content.address
            )}`}
          >
            <NavIcon size={15} />
            <T hi="गूगल मैप्स पर रास्ता देखें">Get Google Maps Directions</T>
          </a>

          <a
            className="quick-call-link"
            href={`tel:${content.phone.replace(/\D/g, '')}`}
          >
            <Phone size={14} />
            <span>{content.phone}</span>
          </a>
        </div>
      </div>
    </section>
  )
}
