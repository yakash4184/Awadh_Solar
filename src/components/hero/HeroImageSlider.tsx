'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'

const slides = [
  { src: '/images/solar-brands-golden-hour.png', alt: 'Trusted rooftop solar panel brands at golden hour' },
  { src: '/images/solar-farm-solutions.png', alt: 'Large-scale solar solutions for homes, businesses, schools, industries and farms' },
]
export function HeroImageSlider() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update(); media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    if (paused || hovered || focused || reduced) return
    const timer = setInterval(() => { if (!document.hidden) setIndex(value => (value + 1) % slides.length) }, 6000)
    return () => clearInterval(timer)
  }, [paused, hovered, focused, reduced, index])
  return <div className="hero-scene hero-photo-replacement">
    <section className="hero-image-slider" aria-label="Solar solutions gallery" aria-roledescription="carousel" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocus={() => setFocused(true)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false) }}>
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
