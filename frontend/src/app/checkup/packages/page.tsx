'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { FiCalendar, FiChevronDown, FiClock, FiHeart, FiShield, FiTrendingDown } from 'react-icons/fi';
import { get } from '@/lib/api';
import { PackageCard } from '@/components/packages/PackageCard';
import { VideoHeroBackground } from '@/components/ui/VideoHeroBackground';
import { CTAFooter } from '@/components/ui/CTAFooter';
import { SectionHeader } from '@/components/ui/SectionHeader';

type CheckupPackage = {
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
  freeDoctorConsultation?: boolean;
};

const PACKAGE_PERKS = [
  {
    icon: <FiTrendingDown className="w-5 h-5" />,
    title: 'Best-value bundles',
    copy: 'Combine consultation with lab tests to save compared to booking tests separately.',
  },
  {
    icon: <FiShield className="w-5 h-5" />,
    title: 'Quality-controlled lab',
    copy: 'Every panel runs in our in-house lab with quality-controlled results and same-day reports.',
  },
  {
    icon: <FiClock className="w-5 h-5" />,
    title: 'Structured flow',
    copy: 'From sample collection to report review, one coordinated pathway with no back-and-forth.',
  },
  {
    icon: <FiHeart className="w-5 h-5" />,
    title: 'Prevention first',
    copy: 'Packages are built around age and risk so you screen for what actually matters to you.',
  },
];

const PACKAGE_STEPS = [
  { step: '01', title: 'Choose your package', copy: 'Pick the general or premium panel that fits your age, gender, and health goals.' },
  { step: '02', title: 'Book your slot', copy: 'Reserve a time online or via phone. Add it to your cart and confirm in minutes.' },
  { step: '03', title: 'Visit the lab', copy: 'Walk in at your scheduled time. Fasting instructions are shared before your visit.' },
  { step: '04', title: 'Get your report', copy: 'Receive results quickly and review them with a clinician for clear next steps.' },
];

const FAQS = [
  {
    q: 'What is the difference between General and Premium packages?',
    a: 'General packages cover essential screening panels for common health markers. Premium packages add deeper panels — advanced profiles, extra biomarkers, and more comprehensive reporting — for a fuller picture of your health.',
  },
  {
    q: 'Do I need to fast before the tests?',
    a: 'Most blood panels require 8–12 hours of fasting. You will receive clear fasting instructions when you book, and our front desk team confirms them before your appointment.',
  },
  {
    q: 'How soon will I receive my reports?',
    a: 'Most results are available the same day or within 24 hours, depending on the panel. Reports are shared securely and can be reviewed with a clinician during a follow-up.',
  },
  {
    q: 'Can I pay online and use health insurance?',
    a: 'Yes. You can pay online through our secure checkout, and we assist with insurance documentation where applicable. Contact the front desk for insurance-specific guidance.',
  },
];

function normalizePackage(raw: Record<string, unknown>): CheckupPackage {
  const name = String(raw.name ?? '');
  const lowerName = name.toLowerCase();
  const apiCategory = String(raw.category ?? '').toLowerCase();
  let category = apiCategory;

  // The API contains duplicate below-40 rows for gender targeting. Normalize
  // the display category without changing the API's prices or package facts.
  if (lowerName.includes('premium') && lowerName.includes('below 40')) category = 'premium_below_40';
  else if (lowerName.includes('general') && lowerName.includes('below 40')) category = 'general_below_40';
  else if (lowerName.includes('female') && lowerName.includes('over 40')) category = 'female_general';
  else if (lowerName.includes('male') && lowerName.includes('over 40')) category = 'male_general';

  return {
    id: String(raw.id),
    name,
    category,
    targetGroup: raw.targetGroup != null ? String(raw.targetGroup) : undefined,
    ageLabel: raw.ageLabel != null ? String(raw.ageLabel) : undefined,
    originalPrice: Number(raw.originalPrice ?? 0),
    discountedPrice: Number(raw.discountedPrice ?? 0),
    currency: raw.currency != null ? String(raw.currency) : undefined,
    description: raw.description != null ? String(raw.description) : undefined,
    tests: Array.isArray(raw.tests) ? (raw.tests as string[]) : undefined,
    ctaLabel: raw.ctaLabel != null ? String(raw.ctaLabel) : undefined,
    ctaLink: raw.ctaLink != null ? String(raw.ctaLink) : undefined,
    freeDoctorConsultation: raw.freeDoctorConsultation !== false,
  };
}

export default function CheckupPackagesPage() {
  type PackageFilter = 'all' | 'below40' | 'female40' | 'male40' | 'tuberculosis' | 'pediatrics' | 'gynecology';
  const [packageFilter, setPackageFilter] = useState<PackageFilter>('all');
  const [packages, setPackages] = useState<CheckupPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await get<unknown>('packages');
        const rows = Array.isArray(response) ? response : [];
        const normalized = rows.map((row) => normalizePackage(row as Record<string, unknown>));
        const seen = new Set<string>();
        setPackages(normalized.filter((pkg) => {
          const key = `${pkg.name}|${pkg.ageLabel}|${pkg.originalPrice}|${pkg.discountedPrice}|${(pkg.tests ?? []).join('|')}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        }));
      } catch {
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /** Keep every package reachable, including TB, paediatric, and gynaecology packages. */
  const filteredPackages = useMemo(
    () => packages.filter((pkg) => {
      const category = pkg.category.toLowerCase();
      if (packageFilter === 'all') return true;
      if (packageFilter === 'below40') return category === 'general_below_40' || category === 'premium_below_40';
      if (packageFilter === 'female40') return category === 'female_general' || category === 'female_premium';
      if (packageFilter === 'male40') return category === 'male_general' || category === 'male_premium';
      if (packageFilter === 'tuberculosis') return category.includes('tb') || category.includes('tuberc');
      if (packageFilter === 'pediatrics') return category.includes('pediatric');
      return category.includes('gyne') || category.includes('women');
    }),
    [packages, packageFilter],
  );
  const visiblePackages = filteredPackages;

  const totalSavings = visiblePackages.reduce(
    (sum, pkg) => sum + Math.max(0, pkg.originalPrice - pkg.discountedPrice),
    0,
  );

  return (
    <main>
      <section className="py-20 md:py-28 bg-primary-950 text-white relative overflow-hidden">
        <VideoHeroBackground
          src="/videos/hero/lab-microscope.mp4"
          poster="/videos/hero/lab-microscope.jpg"
        />
        <div className="container-custom relative z-10">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/85">
            Preventive Care Programs
          </span>
          <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight">
            Health Check-up Packages
          </h1>
          <p className="text-white/85 mt-5 max-w-3xl text-lg leading-relaxed">
            Compare general and premium preventive packages and book instantly.
          </p>
          <Link href="/cart" className="inline-flex mt-7 rounded-xl bg-white text-neutral-900 px-5 py-3 text-sm font-bold shadow-lg hover:bg-neutral-100 transition-colors">
            View Cart
          </Link>
        </div>
      </section>

      {/* Perks strip */}
      <section className="py-12 bg-white border-b border-neutral-100">
        <div className="container-custom">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PACKAGE_PERKS.map((perk, i) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex gap-4"
              >
                <span className="shrink-0 w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                  {perk.icon}
                </span>
                <div>
                  <h3 className="font-heading font-semibold text-neutral-900 text-sm">{perk.title}</h3>
                  <p className="text-neutral-500 text-sm mt-1 leading-relaxed">{perk.copy}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-2 mx-auto mb-10 max-w-5xl">
            {([
              ['all', 'All packages'],
              ['below40', 'Below 40'],
              ['female40', 'Female · Over 40'],
              ['male40', 'Male · Over 40'],
              ['tuberculosis', 'TB & pulmonary'],
              ['pediatrics', 'Pediatrics'],
              ['gynecology', 'Gynecology'],
            ] as const).map(([filter, label]) => (
              <button
                key={filter}
                onClick={() => setPackageFilter(filter)}
                className={`rounded-full border px-5 py-2.5 font-semibold transition-all text-sm ${
                  packageFilter === filter
                    ? 'border-primary-600 bg-primary-600 text-white shadow-md'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-primary-300 hover:text-primary-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {!loading && visiblePackages.length > 0 && (
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 bg-primary-50 rounded-full px-4 py-1.5">
                <FiTrendingDown className="w-4 h-4" />
                You save up to Rs. {totalSavings.toLocaleString('en-IN')} across {visiblePackages.length} selected package{visiblePackages.length > 1 ? 's' : ''}
              </span>
            </div>
          )}

          {loading ? (
            <div className="text-center text-neutral-500 py-10">Loading packages...</div>
          ) : visiblePackages.length === 0 ? (
            <p className="text-center text-neutral-500 py-10">
              No packages are available for this filter yet. Please check back or contact the clinic.
            </p>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={packageFilter}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid md:grid-cols-2 gap-6"
              >
                {visiblePackages.map((pkg) => (
                  <PackageCard key={pkg.id} {...pkg} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeader
              eyebrow="How It Works"
              title="A simple path to"
              highlight="preventive care"
              subtitle="Four clear steps between choosing a package and walking out with answers."
              className="mb-0"
            />
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PACKAGE_STEPS.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="relative rounded-2xl border border-neutral-100 bg-white p-6 shadow-soft"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-heading font-bold text-primary-200">{s.step}</span>
                  {i < PACKAGE_STEPS.length - 1 && (
                    <FiChevronDown className="w-5 h-5 text-neutral-300 rotate-[-90deg] hidden lg:block" />
                  )}
                </div>
                <h3 className="font-heading font-semibold text-neutral-900 mb-2">{s.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{s.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeader
              eyebrow="FAQ"
              title="Before you"
              highlight="book"
              subtitle="Quick answers to the questions we hear most about our check-up packages."
              className="mb-0"
            />
          </motion.div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="rounded-2xl border border-neutral-100 bg-white overflow-hidden shadow-soft"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={openFaq === i}
                >
                  <span className="font-semibold text-neutral-900 text-sm">{faq.q}</span>
                  <FiChevronDown
                    className={`w-5 h-5 text-primary-600 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="px-5 pb-5 text-neutral-500 text-sm leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTAFooter
        title="Not sure which package"
        highlight="fits you best?"
        subtitle="Talk to our health advisors. We will recommend the right screening panel based on your age, gender, and health history."
        actions={[
          { label: 'Book Appointment', href: '/appointments/book', icon: <FiCalendar className="w-4 h-4" /> },
          { label: 'Talk to an Advisor', href: '/contact' },
        ]}
      />
    </main>
  );
}

