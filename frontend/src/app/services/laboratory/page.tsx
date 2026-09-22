'use client';

import Link from 'next/link';
import { ArrowRight, FileText, FlaskConical, Home, ShieldCheck } from 'lucide-react';
import { FiCalendar, FiPhone } from 'react-icons/fi';
import { PremiumLandingHero } from '@/components/ui/PremiumLandingHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CTAFooter } from '@/components/ui/CTAFooter';

const LABORATORY_AREAS = [
  {
    icon: FlaskConical,
    title: 'Blood and hematology testing',
    copy: 'Explore routine blood counts and hematology panels through Nita Laboratory for everyday diagnosis and preventive care.',
  },
  {
    icon: ShieldCheck,
    title: 'Biochemistry and screening',
    copy: 'Use clinical testing and preventive screening to support informed conversations with your doctor about your health.',
  },
  {
    icon: FileText,
    title: 'Specialist laboratory categories',
    copy: 'Browse microbiology, serology, parasitology, and other diagnostic categories in the laboratory test catalogue.',
  },
];

export default function LaboratoryServicePage() {
  return (
    <main>
      <PremiumLandingHero
        eyebrow="Nita Laboratory · Kathmandu"
        title="Clear answers from"
        highlight="careful testing."
        description="Access laboratory and pathology services in Kathmandu across blood testing, hematology, biochemistry, microbiology, serology, parasitology, and preventive screening."
        videoSrc="/videos/hero/diagnostics-lab.mp4"
        posterSrc="/videos/hero/diagnostics-lab.jpg"
        overlayClassName="from-primary-950/[0.9] via-primary-900/[0.7] to-cyan-950/[0.45]"
        actions={[
          { label: 'Browse Laboratory Tests', href: '/diagnostic-test', icon: <ArrowRight className="h-4 w-4" /> },
          { label: 'Book an Appointment', href: '/appointments/book', icon: <FiCalendar className="h-4 w-4" />, variant: 'secondary' },
        ]}
        trustPoints={[
          'Blood and pathology testing',
          'Preventive screening options',
          'Clinical guidance when you need it',
          'Laboratory reports available online',
        ]}
        stats={[
          { value: '5', label: 'Core categories' },
          { value: '1', label: 'Test catalogue' },
          { value: 'Online', label: 'Report access' },
        ]}
        panelEyebrow="Laboratory Services"
        panelTitle="Testing made easier to understand."
        panelItems={[
          'Start with the test catalogue to review available laboratory categories and panels.',
          'Book your visit or ask about home sample collection when travelling to the clinic is difficult.',
          'Use the laboratory reports portal to access results when they are ready.',
        ]}
      />

      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeader
            eyebrow="What we cover"
            title="A practical laboratory"
            highlight="starting point"
            subtitle="Find the right testing pathway for a doctor’s recommendation, preventive check-up, or ongoing health monitoring."
            className="mb-12"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {LABORATORY_AREAS.map(({ icon: Icon, title, copy }) => (
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
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-700">Choose your next step</p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">From test selection to results</h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600">
              The catalogue helps you discover tests. Your clinician can help you choose what is appropriate for your symptoms, screening goals, or follow-up plan.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/diagnostic-test" className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-5 py-3 text-sm font-bold text-white shadow hover:bg-primary-700">
                View Test Catalogue <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/services/home-visit" className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-bold text-neutral-700 hover:border-primary-300 hover:text-primary-700">
                <Home className="h-4 w-4" /> Home Collection
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-primary-100 bg-white p-7 shadow-soft">
            <h3 className="font-heading text-xl font-bold text-neutral-900">Need help before you book?</h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">Call the clinic team or schedule an appointment so we can direct you to the appropriate service.</p>
            <div className="mt-6 space-y-3 text-sm font-semibold text-neutral-700">
              <a href="tel:+977014533361" className="flex items-center gap-3 hover:text-primary-700"><FiPhone className="h-4 w-4 text-primary-600" /> 01-4533361</a>
              <Link href="/lab-reports" className="flex items-center gap-3 hover:text-primary-700"><FileText className="h-4 w-4 text-primary-600" /> Open laboratory reports</Link>
            </div>
          </div>
        </div>
      </section>

      <CTAFooter
        title="Make your next health decision"
        highlight="better informed"
        subtitle="Browse the Nita Laboratory catalogue or book a consultation in Kathmandu."
        actions={[
          { label: 'Browse Tests', href: '/diagnostic-test', icon: <ArrowRight className="h-4 w-4" /> },
          { label: 'Contact Nita Clinic', href: '/contact', variant: 'outline' },
        ]}
      />
    </main>
  );
}
