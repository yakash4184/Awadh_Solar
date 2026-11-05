'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'

const slides = [
  { src: '/images/solar-home-business.webp', alt: 'Power your home and business with rooftop solar panels and an inverter' },
  { src: '/images/solar-farm-solutions.png', alt: 'Large-scale solar solutions for homes, businesses, schools, industries and farms' },
  { src: '/images/solar-rural-installation.webp', alt: 'Solar panels and an inverter installed beside fields in rural India' },
  { src: '/images/solar-commercial-rooftop.webp', alt: 'Rooftop solar panel array and inverter on a commercial building' },
  { src: '/images/solar-carport.webp', alt: 'Solar panel carport providing covered parking for vehicles' },
]
export function HeroImageSlider() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update(); media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    if (paused || reduced) return
    const timer = setInterval(() => { if (!document.hidden) setIndex(value => (value + 1) % slides.length) }, 5000)
    return () => clearInterval(timer)
  }, [paused, reduced, index])
  return <div className="hero-scene hero-photo-replacement">
    <section className="hero-image-slider" aria-label="Solar solutions gallery" aria-roledescription="carousel">
      <div className="hero-slider-window"><div className="hero-slider-track" style={{ transform: `translateX(-${index * 100}%)` }}>{slides.map((slide, i) => <div className="hero-image-slide" key={slide.src} aria-hidden={index !== i}><img src={slide.src} alt={slide.alt} width={1672} height={941} fetchPriority={i === 0 ? 'high' : 'auto'} draggable={false} /></div>)}</div></div>
      <div className="hero-slider-controls">
        <button type="button" aria-label="Previous image" onClick={() => setIndex(value => (value - 1 + slides.length) % slides.length)}><ChevronLeft size={17}/></button>
        <div className="hero-slider-dots">{slides.map((slide, i) => <button type="button" key={slide.src} aria-label={`Show image ${i + 1}`} aria-current={index === i ? 'true' : undefined} onClick={() => setIndex(i)} />)}</div>
        <span className="hero-slider-count">0{index + 1} / 0{slides.length}</span>
        {!reduced && <button type="button" aria-label={paused ? 'Play slideshow' : 'Pause slideshow'} onClick={() => setPaused(value => !value)}>{paused ? <Play size={15}/> : <Pause size={15}/>}</button>}
        <button type="button" aria-label="Next image" onClick={() => setIndex(value => (value + 1) % slides.length)}><ChevronRight size={17}/></button>
      </div>
    </section>
  </div>
}
