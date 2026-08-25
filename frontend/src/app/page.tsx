import type { Metadata } from 'next';
import { HeroSection } from '@/components/home/HeroSection';
import { ServicesSection } from '@/components/home/ServicesSection';
import { WhyNitaSection } from '@/components/home/WhyNitaSection';
import { DoctorsSection } from '@/components/home/DoctorsSection';
import { DiagnosticsStrip } from '@/components/home/DiagnosticsStrip';
import { StatsSection } from '@/components/home/StatsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { HealthCardBanner } from '@/components/home/HealthCardBanner';
import { BlogSection } from '@/components/home/BlogSection';
import { PartnersSection } from '@/components/home/PartnersSection';
import { CTASection } from '@/components/home/CTASection';

export const metadata: Metadata = {
  title: 'Nita Clinic | Multi-Specialty Clinic — Kathmandu',
  description:
    'Nita Clinic provides specialist consultations, lab tests, check-up packages, vaccination, and preventive healthcare in Kathmandu, Nepal.',
  openGraph: {
    title: 'Nita Clinic | Trusted Clinic in Kathmandu',
    description: 'Specialist consultations, lab tests, check-ups and vaccination in Kathmandu.',
    images: ['/og-image.jpg'],
  },
};

export default function HomePage() {
  return (
    <>
      {/* 1. Hero — split design with stock photo */}
      <HeroSection />

      {/* 2. Core service categories */}
      <ServicesSection />

      {/* 3. Why NITA — image + USP points */}
      <WhyNitaSection />

      {/* 4. Specialist doctors */}
      <DoctorsSection />

      {/* 5. Our Services strip */}
      <DiagnosticsStrip />

      {/* 6. Stats band */}
      <StatsSection />

      {/* 7. Testimonials */}
      <TestimonialsSection />

      {/* 8. Health card CTA */}
      <HealthCardBanner />

      {/* 9. Blog preview */}
      <BlogSection />

      {/* 10. Partners & clients auto-scroll */}
      <PartnersSection />

      {/* 11. Final CTA + contact info */}
      <CTASection />
    </>
  );
}
