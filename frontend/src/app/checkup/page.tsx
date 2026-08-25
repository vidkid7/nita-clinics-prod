'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Package, Venus, Mars, Baby, Wind, Bone } from 'lucide-react';
import { FiCalendar } from 'react-icons/fi';
import { get } from '@/lib/api';
import { PackageCard } from '@/components/packages/PackageCard';
import { CheckupTrackerCard } from '@/components/checkup/CheckupTrackerCard';
import { PremiumLandingHero } from '@/components/ui/PremiumLandingHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CTAFooter } from '@/components/ui/CTAFooter';
import type { CheckupStep } from '@/components/checkup/CheckupTrackerCard';

interface CheckupPackage {
  id: string;
  name: string;
  category: string;
  targetGroup?: string;
  ageLabel?: string;
  originalPrice: number;
  discountedPrice: number;
  currency?: string;
  description?: string;
  tests?: string[];
  ctaLabel?: string;
  ctaLink?: string;
  image?: string;
  freeDoctorConsultation?: boolean;
}

function priceRangeForCategory(packages: CheckupPackage[], category: string) {
  const rows = packages.filter((p) => p.category === category);
  if (!rows.length) return { from: null as number | null, to: null as number | null };
  const prices = rows.map((p) => Number(p.discountedPrice));
  return { from: Math.min(...prices), to: Math.max(...prices) };
}

// ── Specialty checkup data (journey UI); prices come from API packages ────────
const gynecologySteps: CheckupStep[] = [
  {
    title: 'Book Appointment',
    description: 'Schedule online or call',
    detail: 'Choose your preferred date and time',
    status: 'completed',
  },
  {
    title: 'Clinical Consultation',
    description: 'View consultation details',
    detail: 'Medical history review & physical exam',
    status: 'completed',
  },
  {
    title: 'Pelvic Exam & PAP Smear',
    description: 'View included tests',
    detail: 'Cervical screening & bimanual pelvic exam',
    status: 'active',
  },
  {
    title: 'Lab Investigations',
    description: 'See lab panel',
    detail: 'Hormonal profile, CBC, urine analysis',
    status: 'pending',
  },
  {
    title: 'Ultrasound (if indicated)',
    description: 'View imaging options',
    detail: 'Pelvic / transvaginal scan if required',
    status: 'pending',
  },
  {
    title: 'Report & Follow-up',
    description: 'View report guide',
    detail: 'Physician review & personalized advice',
    status: 'pending',
  },
];

const pediatricsSteps: CheckupStep[] = [
  {
    title: 'Book Appointment',
    description: 'Schedule online or call',
    detail: 'Select your child\'s age group',
    status: 'completed',
  },
  {
    title: 'Growth Assessment',
    description: 'View growth milestones',
    detail: 'Height, weight, BMI & head circumference',
    status: 'completed',
  },
  {
    title: 'Vaccination Review',
    description: 'View immunization schedule',
    detail: 'Catch-up planning aligned with national schedule',
    status: 'active',
  },
  {
    title: 'Lab Tests',
    description: 'View lab panel',
    detail: 'CBC, nutritional markers, blood sugar',
    status: 'pending',
  },
  {
    title: 'Developmental Screening',
    description: 'View assessment tools',
    detail: 'Speech, cognitive & behavioural milestones',
    status: 'pending',
  },
  {
    title: 'Health Certificate & Report',
    description: 'View report details',
    detail: 'School/travel certificate available on request',
    status: 'pending',
  },
];

const tbSteps: CheckupStep[] = [
  {
    title: 'Book Appointment',
    description: 'Schedule online or call',
    detail: 'Priority slots available for TB screening',
    status: 'completed',
  },
  {
    title: 'Clinical Assessment',
    description: 'View consultation details',
    detail: 'Symptom review, exposure history, risk evaluation',
    status: 'completed',
  },
  {
    title: 'Sputum AFB Smear',
    description: 'View sputum test details',
    detail: 'First-line microscopy for pulmonary TB',
    status: 'active',
  },
  {
    title: 'GeneXpert MTB/RIF',
    description: 'View molecular test details',
    detail: 'Rapid detection + drug resistance screening',
    status: 'pending',
  },
  {
    title: 'Chest X-Ray (Digital)',
    description: 'View imaging details',
    detail: 'Digital PA chest X-ray with radiologist report',
    status: 'pending',
  },
  {
    title: 'Treatment Planning',
    description: 'View DOTS protocol',
    detail: 'DOTS therapy & follow-up monitoring schedule',
    status: 'pending',
  },
];

const orthopedicsSteps: CheckupStep[] = [
  {
    title: 'Book Appointment',
    description: 'Schedule online or call',
    detail: 'Same-week slots available for joint & bone care',
    status: 'completed',
  },
  {
    title: 'Orthopedic Consultation',
    description: 'View consultation details',
    detail: 'Posture, gait & joint-by-joint exam',
    status: 'completed',
  },
  {
    title: 'Digital X-Ray / MSK US',
    description: 'View imaging',
    detail: 'On-site digital X-ray + musculoskeletal ultrasound',
    status: 'active',
  },
  {
    title: 'Lab Panel',
    description: 'View lab panel',
    detail: 'CRP, ESR, Uric Acid, RA, Vitamin D, Calcium',
    status: 'pending',
  },
  {
    title: 'Bone Density (DEXA)',
    description: 'View bone density',
    detail: 'Osteoporosis screen if clinically indicated',
    status: 'pending',
  },
  {
    title: 'Treatment & Follow-up',
    description: 'View treatment plan',
    detail: 'Medication, physio, joint injection or surgical opinion',
    status: 'pending',
  },
];

export default function CheckupPage() {
  const [packages, setPackages] = useState<CheckupPackage[]>([]);
  const [pkgLoading, setPkgLoading] = useState(true);

  useEffect(() => {
    get<CheckupPackage[]>('packages')
      .then((res) => setPackages(Array.isArray(res) ? res : []))
      .catch(() => setPackages([]))
      .finally(() => setPkgLoading(false));
  }, []);

  const specialtyCheckups = useMemo(() => {
    const g = priceRangeForCategory(packages, 'gynecology');
    const pe = priceRangeForCategory(packages, 'pediatrics');
    const tb = priceRangeForCategory(packages, 'tuberculosis');
    const ort = priceRangeForCategory(packages, 'orthopedics');
    const gImg = packages.find((p) => p.category === 'gynecology' && p.image)?.image;
    const pImg = packages.find((p) => p.category === 'pediatrics' && p.image)?.image;
    const tImg = packages.find((p) => p.category === 'tuberculosis' && p.image)?.image;
    const oImg =
      packages.find((p) => p.category === 'orthopedics' && p.image)?.image ||
      'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80';
    return [
      {
        id: 'gynecology',
        imageUrl: gImg || 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&q=80',
        statusLabel: 'Available Now',
        statusColor: 'rose' as const,
        title: 'Gynecology Check-up',
        subtitle: "Comprehensive women's reproductive health screening & preventive care",
        priceFrom: g.from,
        priceTo: g.to !== g.from ? g.to : undefined,
        steps: gynecologySteps,
        detailHref: '/checkup/gynecology',
        bookHref: '/appointments/book?specialty=gynecology-obstetrics&type=checkup',
        accentGradient: 'from-rose-600 to-pink-700',
        icon: <Venus className="h-5 w-5" />,
      },
      {
        id: 'pediatrics',
        imageUrl: pImg || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&q=80',
        statusLabel: 'Available Now',
        statusColor: 'blue' as const,
        title: 'Pediatrics Check-up',
        subtitle: 'Growth monitoring, vaccination review & child developmental assessment',
        priceFrom: pe.from,
        priceTo: pe.to !== pe.from ? pe.to : undefined,
        steps: pediatricsSteps,
        detailHref: '/checkup/pediatrics',
        bookHref: '/appointments/book?specialty=pediatrics&type=checkup',
        accentGradient: 'from-primary-600 to-primary-700',
        icon: <Baby className="h-5 w-5" />,
      },
      {
        id: 'tuberculosis',
        imageUrl: tImg || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
        statusLabel: 'Priority Slots',
        statusColor: 'emerald' as const,
        title: 'Tuberculosis Check-up',
        subtitle: 'Complete TB screening pathway — AFB, GeneXpert, X-ray & treatment planning',
        priceFrom: tb.from,
        priceTo: tb.to !== tb.from ? tb.to : undefined,
        steps: tbSteps,
        detailHref: '/checkup/tuberculosis',
        bookHref: '/appointments/book?specialty=tuberculosis&type=checkup',
        accentGradient: 'from-emerald-600 to-teal-700',
        icon: <Wind className="h-5 w-5" />,
      },
      {
        id: 'orthopedics',
        imageUrl: oImg,
        statusLabel: 'Same-week Slots',
        statusColor: 'indigo' as const,
        title: 'Orthopedics Check-up',
        subtitle: 'Joint, bone & spine evaluation with on-site X-ray, MSK ultrasound & lab panel',
        priceFrom: ort.from,
        priceTo: ort.to !== ort.from ? ort.to : undefined,
        steps: orthopedicsSteps,
        detailHref: '/checkup/orthopedics',
        bookHref: '/appointments/book?specialty=orthopedics&type=checkup',
        accentGradient: 'from-indigo-600 to-blue-700',
        icon: <Bone className="h-5 w-5" />,
      },
    ];
  }, [packages]);

  const femalePackages = packages.filter((p) => p.category.startsWith('female'));
  const malePackages = packages.filter((p) => p.category.startsWith('male'));

  return (
    <main>
      <PremiumLandingHero
        eyebrow="Preventive Healthcare · Kathmandu"
        title="Health check-ups that"
        highlight="turn prevention into a plan."
        description="Structured screenings for women, children, TB care, and routine wellness packages, designed to catch risk early and guide your next step."
        videoSrc="/videos/hero/doctor-writing-appointment.mp4"
        posterSrc="/videos/hero/doctor-writing-appointment.jpg"
        overlayClassName="from-primary-950/[0.88] via-primary-900/[0.66] to-teal-900/[0.42]"
        actions={[
          { label: 'Book a Check-up', href: '/appointments/book', icon: <FiCalendar className="h-4 w-4" /> },
          { label: 'View Packages', href: '/checkup/packages', variant: 'secondary' },
        ]}
        trustPoints={[
          'Specialty journeys for women, children, and TB',
          'Packages organized by age and risk',
          'Lab tests connected to consultation',
          'Follow-up guidance after reports',
        ]}
        stats={[
          { value: `${packages.length}+`, label: 'Packages' },
          { value: '3', label: 'Specialty Programs' },
          { value: 'Early', label: 'Risk Detection' },
        ]}
        panelEyebrow="Check-up Flow"
        panelTitle="A clearer route from screening to action."
        panelItems={[
          'Choose the check-up path that fits your age, symptoms, or health goal.',
          'Complete consultations and lab tests in a coordinated clinic workflow.',
          'Review reports with next steps instead of leaving with unanswered questions.',
        ]}
      />

      {/* ── Specialty Checkups (Tracker Cards) ── */}
      <section className="section-padding relative overflow-hidden bg-neutral-50">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 plus-pattern-light opacity-40" />
          <div className="absolute -top-24 left-1/4 h-72 w-96 rounded-full bg-rose-50 blur-3xl" />
          <div className="absolute bottom-0 right-[-5rem] h-64 w-80 rounded-full bg-teal-50/60 blur-3xl" />
        </div>
        <div className="relative container-custom">
          <SectionHeader
            eyebrow="Specialty Programs"
            title="Specialty Check-up"
            highlight="Programs"
            subtitle="Each specialty checkup follows a structured clinical journey — from booking through to report review. Click View Details to learn more about each program."
            className="mb-12"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {specialtyCheckups.map((checkup, i) => (
              <motion.div
                key={checkup.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
              >
                <CheckupTrackerCard {...checkup} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Health Packages ── */}
      <section className="section-padding relative overflow-hidden bg-white border-t border-neutral-100">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 plus-pattern-light opacity-40" />
          <div className="absolute -top-24 right-1/4 h-72 w-96 rounded-full bg-amber-50 blur-3xl" />
          <div className="absolute bottom-0 left-[-4rem] h-64 w-80 rounded-full bg-primary-50/70 blur-3xl" />
        </div>
        <div className="relative container-custom">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <SectionHeader
              align="left"
              eyebrow="Wellness Packages"
              title="Health Check-up"
              highlight="Packages"
              subtitle="Comprehensive panels for men and women — general and premium options tailored for different health goals and age groups."
              className="mb-0"
            />
            <Link
              href="/checkup/packages"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50/70 px-4 py-2 text-sm font-semibold text-primary-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-100 hover:shadow-[0_10px_24px_-12px_rgba(1,173,165,0.6)]"
            >
              View All Packages <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {pkgLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="rounded-2xl border border-neutral-100 bg-neutral-50 h-72 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-10">
              {/* Female packages */}
              {femalePackages.length > 0 && (
                <div>
                  <h3 className="mb-5 flex items-center gap-3 text-lg font-bold text-neutral-800">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 shadow-sm">
                      <Venus className="h-5 w-5" />
                    </span>
                    Female Health Packages
                    <span className="h-px flex-1 bg-neutral-100" />
                  </h3>
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {femalePackages.map((pkg) => (
                      <PackageCard key={pkg.id} {...pkg} />
                    ))}
                  </div>
                </div>
              )}

              {/* Male packages */}
              {malePackages.length > 0 && (
                <div>
                  <h3 className="mb-5 flex items-center gap-3 text-lg font-bold text-neutral-800">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600 shadow-sm">
                      <Mars className="h-5 w-5" />
                    </span>
                    Male Health Packages
                    <span className="h-px flex-1 bg-neutral-100" />
                  </h3>
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {malePackages.map((pkg) => (
                      <PackageCard key={pkg.id} {...pkg} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <CTAFooter
        title="Not sure which check-up"
        highlight="to choose?"
        subtitle="Our health advisors can recommend the right program based on your age, gender, and health history. Book a free consultation."
        actions={[
          { label: 'Book Appointment', href: '/appointments/book', icon: <FiCalendar className="h-4 w-4" /> },
          { label: 'Contact Us', href: '/contact' },
        ]}
      />
    </main>
  );
}
