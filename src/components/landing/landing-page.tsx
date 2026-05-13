'use client'

import { AboutSection } from '@/components/landing/about-section'
import { FaqSection } from '@/components/landing/faq-section'
import { FinalCta } from '@/components/landing/final-cta'
import { HeroSection } from '@/components/landing/hero-section'
import { MethodologySection } from '@/components/landing/methodology-section'
import { PracticeAreas } from '@/components/landing/practice-areas'
import { SiteFooter } from '@/components/landing/site-footer'
import { SiteHeader } from '@/components/landing/site-header'
import { StatsStrip } from '@/components/landing/stats-strip'
import { TestimonialsSection } from '@/components/landing/testimonials-section'
import { SiteViewportProgressiveBlur } from '@/components/ui/site-viewport-progressive-blur'

export function LandingPage() {
  return (
    <div className="min-h-dvh bg-ink text-marble">
      <SiteViewportProgressiveBlur />
      <SiteHeader />
      <main className="pt-20 md:pt-[120px]">
        <HeroSection />
        <StatsStrip />
        <PracticeAreas />
        <AboutSection />
        <TestimonialsSection />
        <MethodologySection />
        <FaqSection />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  )
}
