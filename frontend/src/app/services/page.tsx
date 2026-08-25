'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FlaskConical,
  Syringe,
  Home as HomeIcon,
  Stethoscope,
  ArrowRight,
  Clock,
  ShieldCheck,
  Award,
  Sparkles,
  Pill,
} from 'lucide-react';
import { PremiumLandingHero } from '@/components/ui/PremiumLandingHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CTAFooter } from '@/components/ui/CTAFooter';
import { IconTileList } from '@/components/ui/IconTileList';
import { FiCalendar } from 'react-icons/fi';

interface ServiceCard {
  slug: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  title: string;
  tagline: string;
  description: string;
  highlights: string[];
  startingPrice?: string;
  gradient: string;
  ring: string;
  iconBg: string;
}

const SERVICES: ServiceCard[] = [
  {
    slug: 'laboratory',
    href: '/services/laboratory',
    icon: <FlaskConical className="h-7 w-7" />,
    badge: 'MOST BOOKED',
    title: 'Laboratory Services',
    tagline: 'Fast laboratory testing, same-day reports',
    description:
      'Walk into our in-house lab for 36+ tests across 5 departments — Haematology, Biochemistry, Serology, Microbiology and Parasitology. Same-day reports for every test, transparent NRP pricing, no hidden fees.',
    highlights: [
      '5 specialised departments under one roof',
      'All tests — same-day reports',
      'Transparent NRP pricing on every test',
      'Home sample collection available',
    ],
    startingPrice: 'From NPR 100',
    gradient: 'from-rose-500 via-rose-600 to-pink-700',
    ring: 'ring-rose-200',
    iconBg: 'bg-rose-50 text-rose-600',
  },
  {
    slug: 'vaccination',
    href: '/services/vaccination',
    icon: <Syringe className="h-7 w-7" />,
    badge: 'IN CLINIC',
    title: 'Vaccination Service',
    tagline: 'Adult & antenatal immunisation',
    description:
      'Three essential vaccines — Tetanus Toxoid, Influenza and Pneumococcal — administered by trained nurses with cold-chain integrity, post-vaccination observation and full digital records.',
    highlights: [
      'T.T, Influenza, Pneumococcal in stock',
      'Walk-in or appointment booking',
      'Cold-chain maintained from import to arm',
      'Digital vaccination record provided',
    ],
    startingPrice: 'From NPR 500',
    gradient: 'from-violet-500 via-violet-600 to-indigo-700',
    ring: 'ring-violet-200',
    iconBg: 'bg-violet-50 text-violet-600',
  },
  {
    slug: 'home-visit',
    href: '/services/home-visit',
    icon: <HomeIcon className="h-7 w-7" />,
    badge: 'NEW',
    title: 'Home Visit Service',
    tagline: 'Doctor & lab at your doorstep',
    description:
      'Skip the waiting room. Book a doctor consultation, sample collection or vaccination at your home. Trained staff, sterile kits, same clinical standards as in-clinic visits.',
    highlights: [
      'Doctor consultation at home',
      'Sample collection for lab tests',
      'Vaccination at home',
      'Within Kathmandu Valley',
    ],
    startingPrice: 'From NPR 1,500',
    gradient: 'from-emerald-500 via-emerald-600 to-teal-700',
    ring: 'ring-emerald-200',
    iconBg: 'bg-emerald-50 text-emerald-600',
  },
  {
    slug: 'online-consultation',
    href: '/services/online-consultation',
    icon: <Stethoscope className="h-7 w-7" />,
    badge: 'TELEHEALTH',
    title: 'Online Consultation',
    tagline: 'Video call with a doctor, anywhere',
    description:
      'Speak to a licensed Nita Clinic doctor from home or office via secure video call. Get a digital prescription, e-referral for lab tests, and follow-up support — no travel, no waiting room.',
    highlights: [
      'Video call with licensed doctors',
      'Digital prescription & e-referrals',
      '15–30 minute private sessions',
      'Available 7 days a week',
    ],
    startingPrice: 'From NPR 800',
    gradient: 'from-sky-500 via-sky-600 to-blue-700',
    ring: 'ring-sky-200',
    iconBg: 'bg-sky-50 text-sky-600',
  },
  {
    slug: 'pharmacy',
    href: '/services/pharmacy',
    icon: <Pill className="h-7 w-7" />,
    badge: 'NEW',
    title: 'Pharmacy',
    tagline: 'Counter pickup & home delivery',
    description:
      'Pick up your prescription at the Nita Clinic counter or get same-day home delivery within Kathmandu Valley. Pharmacist-reviewed, cold-chain safe, and priced transparently.',
    highlights: [
      'Walk-in counter in Bhimselgola-9',
      'Same-day home delivery in valley',
      'Cold-chain handling for insulin & vaccines',
      'Free pharmacist call-back',
    ],
    startingPrice: 'From NPR 100',
    gradient: 'from-amber-500 via-orange-500 to-rose-600',
    ring: 'ring-amber-200',
    iconBg: 'bg-amber-50 text-amber-600',
  },
];

const PROMISE = [
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: 'Reliable clinical care',
    copy: 'Modern laboratory services, trained nurses, and doctors across all departments.',
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: 'Same-day reports',
    copy: 'Most lab tests, vaccinations and consultations completed the same day.',
  },
  {
    icon: <Award className="h-5 w-5" />,
    title: 'Transparent pricing',
    copy: 'Every service shows the price up front — no hidden fees, no surprise bills.',
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: 'One trusted clinic',
    copy: 'All five services under one roof with shared digital health records.',
  },
];

export default function ServicesPage() {
  return (
    <main>
      <PremiumLandingHero
        eyebrow="Our Services · Nita Clinic"
        title="Five ways to care"
        highlight="for you and your family."
        description="Pick the service that fits your day — walk into our lab, pick up medicines, book a home visit, get a vaccine, or talk to a doctor online. Same standard of care, same team, same record."
        videoSrc="/videos/hero/lab-microscope.mp4"
        posterSrc="/videos/hero/lab-microscope.jpg"
        overlayClassName="from-primary-950/[0.88] via-primary-900/[0.66] to-teal-900/[0.42]"
        actions={[
          { label: 'Explore Laboratory', href: '/services/laboratory', icon: <FlaskConical className="h-4 w-4" /> },
          { label: 'Book Home Visit', href: '/services/home-visit', variant: 'secondary' },
        ]}
        trustPoints={[
          '5 integrated services under one clinic',
          'Same-day lab reports and same-day consultations',
          'Transparent NRP pricing on every service',
          'Digital records shared across all touchpoints',
        ]}
        stats={[
          { value: '5', label: 'Services' },
          { value: '36+', label: 'Lab Tests' },
          { value: 'Same', label: 'Day Reports' },
        ]}
        panelEyebrow="Our Services"
        panelTitle="Care that comes to you."
        panelItems={[
          'Walk in for a lab test, vaccination, or a check-up — no appointment needed for most services.',
          'Prefer to stay home? Book a home visit for doctor consultation, sample collection, or vaccination.',
          'Short on time? Book a video consultation with a Nita Clinic doctor and get a digital prescription.',
        ]}
      />

      {/* Service cards grid */}
      <section className="section-padding relative overflow-hidden bg-neutral-50">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 plus-pattern-light opacity-40" />
          <div className="absolute -top-24 left-1/4 h-72 w-96 rounded-full bg-rose-50 blur-3xl" />
          <div className="absolute bottom-0 right-[-5rem] h-64 w-80 rounded-full bg-teal-50/60 blur-3xl" />
        </div>
        <div className="relative container-custom">
          <SectionHeader
            eyebrow="Pick a service"
            title="What would you like"
            highlight="to do today?"
            subtitle="Each service is run by the same Nita Clinic team and shares one health record — so wherever you start, the next step is easy."
            className="mb-12"
          />

          <div className="grid md:grid-cols-2 gap-6">
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  href={s.href}
                  className={`group relative block h-full overflow-hidden rounded-3xl border border-neutral-100 bg-white p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_rgba(15,23,42,0.25)] ${s.ring} ring-1`}
                >
                  {/* gradient accent strip */}
                  <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${s.gradient}`} />
                  {s.badge && (
                    <span className="absolute top-5 right-5 inline-flex items-center gap-1 rounded-full bg-neutral-900/85 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-white">
                      {s.badge}
                    </span>
                  )}

                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${s.iconBg}`}>
                    {s.icon}
                  </div>
                  <h3 className="mt-5 font-heading text-xl font-bold text-neutral-900">{s.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-primary-700">{s.tagline}</p>
                  <p className="mt-3 text-sm text-neutral-600 leading-relaxed">{s.description}</p>

                  <IconTileList
                    items={s.highlights}
                    category={`${s.title} service highlights`}
                    accent="teal"
                    layout="list"
                    className="mt-5 gap-2"
                    itemClassName="rounded-2xl p-3"
                  />

                  <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4">
                    {s.startingPrice && (
                      <span className="text-xs font-semibold text-neutral-500">{s.startingPrice}</span>
                    )}
                    <span className="ml-auto inline-flex items-center gap-1.5 text-sm font-bold text-primary-700 transition-all group-hover:gap-3">
                      View details
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Promise strip */}
      <section className="py-14 bg-white border-y border-neutral-100">
        <div className="container-custom">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROMISE.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex gap-3"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  {p.icon}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">{p.title}</h3>
                  <p className="mt-1 text-xs text-neutral-500 leading-relaxed">{p.copy}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTAFooter
        title="Not sure which"
        highlight="service you need?"
        subtitle="Talk to our health advisor — we'll point you to the right service based on your symptoms, age and health history."
        actions={[
          { label: 'Book Appointment', href: '/appointments/book', icon: <FiCalendar className="h-4 w-4" /> },
          { label: 'Contact Us', href: '/contact' },
        ]}
      />
    </main>
  );
}
