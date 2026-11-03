'use client'

import { useEffect, useRef } from 'react'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!cursor || !finePointer.matches || reducedMotion.matches) return

    const position = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const target = { ...position }
    let frame = 0

    const animate = () => {
      position.x += (target.x - position.x) * 0.22
      position.y += (target.y - position.y) * 0.22
      cursor.style.transform = `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`

      if (Math.abs(target.x - position.x) + Math.abs(target.y - position.y) > 0.15) {
        frame = window.requestAnimationFrame(animate)
      } else {
        frame = 0
      }
    }

    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
      target.x = event.clientX
      target.y = event.clientY
      cursor.dataset.visible = 'true'
      cursor.dataset.interactive = String(Boolean((event.target as Element | null)?.closest('a, button, [role="button"], input, select, textarea, summary')))
      if (!frame) frame = window.requestAnimationFrame(animate)
    }

    const leave = () => { cursor.dataset.visible = 'false' }
    const down = () => { cursor.dataset.pressed = 'true' }
    const up = () => { cursor.dataset.pressed = 'false' }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerleave', leave)
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerleave', leave)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
    }
  }, [])

  return (
    <div className="custom-cursor" ref={cursorRef} aria-hidden="true">
      <span className="custom-cursor-dot" />
    </div>
  )
}
