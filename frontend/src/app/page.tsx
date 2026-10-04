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
import { HomeFaqSection, HOME_FAQS } from '@/components/home/HomeFaqSection';
import { JsonLd } from '@/components/seo/JsonLd';
import { faqSchema } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Nita Clinics | Nita Clinic in Bhimsengola, Kathmandu',
  description:
    'Official Nita Clinics website for Nita Clinic at Bhimsengola-9, Kathmandu. Find our doctors, laboratory, services, address, map, phone, and appointments.',
  path: '/',
  keywords: [
    'nita clinics kathmandu',
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
      <JsonLd data={faqSchema([...HOME_FAQS], '/')} />

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

      {/* 11. Answer-engine friendly clinic FAQs */}
      <HomeFaqSection />

      {/* 12. Final CTA + contact info */}
      <CTASection />
    </>
  );
}
