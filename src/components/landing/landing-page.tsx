import dynamic from 'next/dynamic'
import { AboutSection } from '@/components/landing/about-section'
import { HeroSection } from '@/components/landing/hero-section'
import { PracticeAreas } from '@/components/landing/practice-areas'
import { SiteFooter } from '@/components/landing/site-footer'
import { SiteHeader } from '@/components/landing/site-header'
import { StatsStrip } from '@/components/landing/stats-strip'
import { SiteViewportProgressiveBlur } from '@/components/ui/site-viewport-progressive-blur'

const TestimonialsSection = dynamic(
  () =>
    import('@/components/landing/testimonials-section').then((m) => ({
      default: m.TestimonialsSection,
    })),
  { loading: () => <section className="min-h-[480px] bg-ink" aria-hidden /> },
)

const MethodologySection = dynamic(
  () =>
    import('@/components/landing/methodology-section').then((m) => ({
      default: m.MethodologySection,
    })),
  { loading: () => <section className="min-h-[520px] bg-ink-panel" aria-hidden /> },
)

const FaqSection = dynamic(
  () =>
    import('@/components/landing/faq-section').then((m) => ({
      default: m.FaqSection,
    })),
  { loading: () => <section className="min-h-[400px] bg-ink" aria-hidden /> },
)

const FinalCta = dynamic(
  () =>
    import('@/components/landing/final-cta').then((m) => ({
      default: m.FinalCta,
    })),
  { loading: () => <section className="min-h-[280px] bg-ink" aria-hidden /> },
)

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
