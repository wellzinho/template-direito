'use client'

import { useEffect, useRef, type ReactNode } from 'react'

type TestimonialsMobileScrollProps = {
  children: ReactNode
  className?: string
  'aria-label'?: string
}

const FRICTION = 0.92
const MIN_VELOCITY = 0.4
const MAX_VELOCITY = 42
const VELOCITY_SCALE = 14

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}

function getSnapTarget(el: HTMLElement) {
  const cards = Array.from(el.children).filter(
    (node): node is HTMLElement => node instanceof HTMLElement,
  )
  if (!cards.length) return el.scrollLeft

  const viewportCenter = el.scrollLeft + el.clientWidth / 2
  let closest = cards[0]
  let minDistance = Infinity

  for (const card of cards) {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2
    const distance = Math.abs(cardCenter - viewportCenter)
    if (distance < minDistance) {
      minDistance = distance
      closest = card
    }
  }

  return Math.max(
    0,
    Math.min(
      el.scrollWidth - el.clientWidth,
      closest.offsetLeft - (el.clientWidth - closest.offsetWidth) / 2,
    ),
  )
}

function animateScrollTo(el: HTMLElement, target: number, duration = 480) {
  const from = el.scrollLeft
  const distance = target - from
  if (Math.abs(distance) < 1) {
    el.scrollLeft = target
    return
  }

  const start = performance.now()

  const tick = (now: number) => {
    const progress = Math.min(1, (now - start) / duration)
    el.scrollLeft = from + distance * easeOutCubic(progress)
    if (progress < 1) {
      requestAnimationFrame(tick)
    }
  }

  requestAnimationFrame(tick)
}

/**
 * Horizontal scroll strip for mobile testimonials.
 * Drag with inertia + smooth snap; opts out of Lenis touch capture.
 */
export function TestimonialsMobileScroll({
  children,
  className = '',
  'aria-label': ariaLabel,
}: TestimonialsMobileScrollProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    let dragging = false
    let startX = 0
    let scrollStart = 0
    let lastX = 0
    let lastTime = 0
    let velocity = 0

    const cancelMomentum = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = 0
      }
    }

    const runMomentum = (initialVelocity: number) => {
      cancelMomentum()
      let v = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, initialVelocity))

      const step = () => {
        if (Math.abs(v) < MIN_VELOCITY) {
          rafRef.current = 0
          el.style.scrollSnapType = 'x mandatory'
          animateScrollTo(el, getSnapTarget(el))
          return
        }

        el.scrollLeft -= v
        v *= FRICTION

        const maxScroll = el.scrollWidth - el.clientWidth
        if (el.scrollLeft <= 0 || el.scrollLeft >= maxScroll) {
          el.scrollLeft = Math.max(0, Math.min(maxScroll, el.scrollLeft))
          rafRef.current = 0
          el.style.scrollSnapType = 'x mandatory'
          animateScrollTo(el, getSnapTarget(el), 520)
          return
        }

        rafRef.current = requestAnimationFrame(step)
      }

      rafRef.current = requestAnimationFrame(step)
    }

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return

      cancelMomentum()
      dragging = true
      startX = e.clientX
      lastX = e.clientX
      scrollStart = el.scrollLeft
      lastTime = performance.now()
      velocity = 0
      el.setPointerCapture(e.pointerId)
      el.style.scrollSnapType = 'none'
      el.style.scrollBehavior = 'auto'
      e.stopPropagation()
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return

      const now = performance.now()
      const dt = now - lastTime
      if (dt > 0) {
        const instant = (e.clientX - lastX) / dt
        velocity = velocity * 0.65 + instant * 0.35
      }

      lastX = e.clientX
      lastTime = now
      el.scrollLeft = scrollStart - (e.clientX - startX)

      e.preventDefault()
      e.stopPropagation()
    }

    const endDrag = (e: PointerEvent) => {
      if (!dragging) return
      dragging = false
      el.style.scrollBehavior = ''

      if (el.hasPointerCapture(e.pointerId)) {
        el.releasePointerCapture(e.pointerId)
      }

      const releaseVelocity = velocity * VELOCITY_SCALE
      if (Math.abs(releaseVelocity) > MIN_VELOCITY) {
        runMomentum(releaseVelocity)
      } else {
        el.style.scrollSnapType = 'x mandatory'
        animateScrollTo(el, getSnapTarget(el))
      }
    }

    const stopTouchBubble = (e: TouchEvent) => {
      e.stopPropagation()
    }

    el.addEventListener('pointerdown', onPointerDown, { passive: false })
    el.addEventListener('pointermove', onPointerMove, { passive: false })
    el.addEventListener('pointerup', endDrag)
    el.addEventListener('pointercancel', endDrag)
    el.addEventListener('touchstart', stopTouchBubble, { passive: true })
    el.addEventListener('touchmove', stopTouchBubble, { passive: true })

    return () => {
      cancelMomentum()
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', endDrag)
      el.removeEventListener('pointercancel', endDrag)
      el.removeEventListener('touchstart', stopTouchBubble)
      el.removeEventListener('touchmove', stopTouchBubble)
    }
  }, [])

  return (
    <div
      ref={scrollerRef}
      data-lenis-prevent
      tabIndex={0}
      aria-label={ariaLabel}
      className={`flex cursor-grab snap-x snap-mandatory gap-6 overflow-x-auto overflow-y-hidden overscroll-x-contain px-4 pb-2 touch-pan-x active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {children}
    </div>
  )
}
