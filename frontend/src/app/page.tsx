import type { Metadata } from 'next';
import { publicPageMetadata } from '@/lib/seo';
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

export const metadata: Metadata = publicPageMetadata({
  title: 'Nita Clinic | Multi-Specialty Clinic in Kathmandu',
  description:
    'Nita Clinic provides specialist consultations, laboratory tests, health check-up packages, vaccinations, and preventive healthcare in Kathmandu, Nepal.',
  path: '/',
  keywords: [
    'multi-specialty clinic Kathmandu',
    'doctor consultation Kathmandu',
    'laboratory tests Kathmandu',
    'health check-up packages Nepal',
    'vaccination clinic Kathmandu',
  ],
});

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
