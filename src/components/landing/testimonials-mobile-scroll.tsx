'use client'

import { useEffect, useRef, type ReactNode } from 'react'

type TestimonialsMobileScrollProps = {
  children: ReactNode
  className?: string
  'aria-label'?: string
}

/**
 * Horizontal scroll strip for mobile testimonials.
 * Uses native overflow + pointer drag; opts out of Lenis touch capture.
 */
export function TestimonialsMobileScroll({
  children,
  className = '',
  'aria-label': ariaLabel,
}: TestimonialsMobileScrollProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    let dragging = false
    let startX = 0
    let scrollStart = 0

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      dragging = true
      startX = e.clientX
      scrollStart = el.scrollLeft
      el.setPointerCapture(e.pointerId)
      el.style.scrollSnapType = 'none'
      e.stopPropagation()
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return
      el.scrollLeft = scrollStart - (e.clientX - startX)
      e.preventDefault()
      e.stopPropagation()
    }

    const endDrag = (e: PointerEvent) => {
      if (!dragging) return
      dragging = false
      el.style.scrollSnapType = ''
      if (el.hasPointerCapture(e.pointerId)) {
        el.releasePointerCapture(e.pointerId)
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
      className={`flex cursor-grab snap-x snap-mandatory gap-6 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth px-4 pb-2 touch-pan-x active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {children}
    </div>
  )
}
