'use client'

import { useEffect } from 'react'
import { useLanguage } from '@/components/language/LanguageProvider'

export function SunJourney() {
  const { language } = useLanguage()

  useEffect(() => {
    let cleanup = () => {}
    let cancelled = false
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('lenis'),
    ]).then(([{ gsap }, { ScrollTrigger }, { default: Lenis }]) => {
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const lenis = new Lenis({ duration: 0.85, smoothWheel: true, anchors: true })
        lenis.on('scroll', ScrollTrigger.update)
        const tick = (time: number) => lenis.raf(time * 1000)
        gsap.ticker.add(tick)

        const ctx = gsap.context(() => {
          // Clean Sky Blue & Pure White Journey (No Tan, No Muddy Brown!)
          gsap
            .timeline({
              scrollTrigger: {
                trigger: 'main',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1,
              },
            })
            .to(document.documentElement, {
              '--journey-bg': '#f8fafc',
              '--journey-glow': '#bae6fd',
              '--journey-accent': '#0284c7',
            })
            .to(document.documentElement, {
              '--journey-bg': '#f0f7ff',
              '--journey-glow': '#93c5fd',
              '--journey-accent': '#2563eb',
            })
            .to(document.documentElement, {
              '--journey-bg': '#ffffff',
              '--journey-glow': '#bfdbfe',
              '--journey-accent': '#1d4ed8',
            })

          document
            .querySelectorAll(
              'main h1, main h2, main h3, .shop-copy>p, .hero-description'
            )
            .forEach((node) => {
              gsap.fromTo(
                node,
                { y: 16, opacity: 0.8 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.5,
                  ease: 'power2.out',
                  scrollTrigger: { trigger: node, start: 'top 95%', once: true },
                  clearProps: 'opacity,transform',
                }
              )
            })
        })

        return () => {
          ctx.revert()
          lenis.destroy()
          gsap.ticker.remove(tick)
        }
      })

      mm.add('(min-width: 1000px) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        gsap.set('.energy-track', { width: '250%', overflow: 'visible', paddingBottom: 0 })
        gsap.to('.energy-track', {
          xPercent: -60,
          ease: 'none',
          scrollTrigger: {
            trigger: '.energy-story',
            start: 'top top+=100',
            end: '+=1500',
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          },
        })
      })

      cleanup = () => mm.revert()
    })

    return () => {
      cancelled = true
      cleanup()
    }
  }, [language])

  return null
}
