'use client';

import Link from 'next/link';
import { ArrowRight, Baby, FileText, Plane, ShieldCheck, Syringe, Users } from 'lucide-react';
import { FiCalendar, FiPhone } from 'react-icons/fi';
import { PremiumLandingHero } from '@/components/ui/PremiumLandingHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CTAFooter } from '@/components/ui/CTAFooter';

const VACCINATION_PATHS = [
  {
    icon: Baby,
    title: 'Children and families',
    copy: 'Review routine childhood immunization and catch-up questions with a clinical team that can explain timing and next steps.',
  },
  {
    icon: Users,
    title: 'Adults and seniors',
    copy: 'Ask about adult boosters, seasonal protection, and vaccination planning that fits your age, health history, and routine.',
  },
  {
    icon: Plane,
    title: 'Travel health planning',
    copy: 'Prepare for travel with destination-aware guidance about vaccines, documentation, and the time needed before departure.',
  },
];

export default function VaccinationServicePage() {
  return (
    <main>
      <PremiumLandingHero
        eyebrow="Nita Vaccination Clinic · Kathmandu"
        title="Protection planned"
        highlight="around you."
        description="Plan vaccination visits for children, adults, seniors, pregnancy, seasonal protection, and travel with clear clinical guidance from Nita Clinic in Kathmandu."
        videoSrc="/videos/hero/vaccination-care.mp4"
        posterSrc="/videos/hero/vaccination-care.jpg"
        overlayClassName="from-primary-950/[0.9] via-primary-900/[0.7] to-emerald-950/[0.45]"
        actions={[
          { label: 'Browse Vaccine Catalogue', href: '/vaccination', icon: <Syringe className="h-4 w-4" /> },
          { label: 'Book Vaccination', href: '/appointments/book?type=vaccination', icon: <FiCalendar className="h-4 w-4" />, variant: 'secondary' },
        ]}
        trustPoints={[
          'Child, adult, senior, and travel categories',
          'Eligibility and timing guidance',
          'Post-vaccination care information',
          'Documentation for your records',
        ]}
        stats={[
          { value: '4', label: 'Care groups' },
          { value: '1', label: 'Vaccine catalogue' },
          { value: 'Online', label: 'Booking available' },
        ]}
        panelEyebrow="Vaccination Services"
        panelTitle="The right questions before the shot."
        panelItems={[
          'Search the catalogue by age group, travel need, or the protection you are considering.',
          'Confirm eligibility, timing, booster schedule, and after-care guidance with the clinic team.',
          'Keep your vaccination documentation organised for family and travel planning.',
        ]}
      />

      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeader
            eyebrow="Vaccination pathways"
            title="Guidance for every"
            highlight="stage of life"
            subtitle="Start with the reason for your visit, then use the vaccine catalogue or a booking request to plan the next step."
            className="mb-12"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {VACCINATION_PATHS.map(({ icon: Icon, title, copy }) => (
              <article key={title} className="rounded-3xl border border-neutral-100 bg-white p-7 shadow-soft">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h2 className="mt-5 font-heading text-lg font-bold text-neutral-900">{title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-neutral-50">
        <div className="container-custom grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-700">Before your visit</p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">Find the vaccine, then confirm the plan</h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600">
              The catalogue is a useful starting point, but vaccine choice and timing can depend on age, health history, previous doses, pregnancy, and travel plans. Our team can help you confirm the details.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/vaccination" className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-5 py-3 text-sm font-bold text-white shadow hover:bg-primary-700">
                Explore Vaccines <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/appointments/book?type=vaccination" className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-bold text-neutral-700 hover:border-primary-300 hover:text-primary-700">
                <FiCalendar className="h-4 w-4" /> Request a Visit
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-primary-100 bg-white p-7 shadow-soft">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-heading text-xl font-bold text-neutral-900">Bring your questions</h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">If you have a previous vaccination record, travel itinerary, or a question about a booster, keep it available for the clinical discussion.</p>
            <div className="mt-6 space-y-3 text-sm font-semibold text-neutral-700">
              <a href="tel:+977014533361" className="flex items-center gap-3 hover:text-primary-700"><FiPhone className="h-4 w-4 text-primary-600" /> 01-4533361</a>
              <Link href="/contact" className="flex items-center gap-3 hover:text-primary-700"><FileText className="h-4 w-4 text-primary-600" /> Contact the clinic team</Link>
            </div>
          </div>
        </div>
      </section>

      <CTAFooter
        title="Make prevention part of"
        highlight="your plan"
        subtitle="Explore the vaccine catalogue or book a vaccination visit at Nita Clinic in Kathmandu."
        actions={[
          { label: 'Browse Vaccines', href: '/vaccination', icon: <Syringe className="h-4 w-4" /> },
          { label: 'Contact Nita Clinic', href: '/contact', variant: 'outline' },
        ]}
      />
    </main>
  );
}
