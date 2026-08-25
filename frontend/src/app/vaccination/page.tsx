'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Syringe, ArrowRight, Shield, Globe, Users, FileText, Plane, Baby, UserRound, Venus, PersonStanding, type LucideIcon } from 'lucide-react';
import { FiCalendar, FiPhone } from 'react-icons/fi';
import { VaccineCard } from '@/components/vaccination/VaccineCard';
import { PremiumLandingHero } from '@/components/ui/PremiumLandingHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CTAFooter } from '@/components/ui/CTAFooter';
import { FALLBACK_VACCINES, VACCINE_CATEGORIES, mapVaccineFromApi } from '@/lib/vaccine-data';
import type { Vaccine, VaccineCategory } from '@/lib/vaccine-data';
import { get } from '@/lib/api';
import { cn } from '@/lib/utils';

const categoryIcons: Record<VaccineCategory, LucideIcon> = {
  All: Syringe,
  Children: Baby,
  Adults: UserRound,
  Travel: Plane,
  Women: Venus,
  Seniors: PersonStanding,
};

const WHY_BULLETS = [
  { icon: Shield, text: 'Prevent serious illness' },
  { icon: Globe, text: 'Required for travel' },
  { icon: Users, text: 'Protect your family' },
  { icon: FileText, text: 'Official certificates issued' },
] as const;

export default function VaccinationPage() {
  const [activeCategory, setActiveCategory] = useState<VaccineCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadError(null);
      let list: Vaccine[] = [];
      try {
        const res = await get<{ data?: Record<string, unknown>[] }>('vaccinations?limit=100');
        if (res?.data?.length) {
          list = res.data.map((row) => mapVaccineFromApi(row));
        }
      } catch {
        if (!cancelled) setLoadError('Unable to load live vaccines — showing the standard catalogue.');
      }
      // Fall back to the offline catalogue when the API returns nothing.
      if (list.length === 0) {
        list = FALLBACK_VACCINES;
        if (!cancelled) setLoadError(null);
      }
      if (!cancelled) setVaccines(list);
      if (!cancelled) setIsLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const filteredVaccines = useMemo(() => {
    let list = activeCategory === 'All'
      ? vaccines
      : vaccines.filter((v) => v.category.includes(activeCategory));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          (v.tagline && v.tagline.toLowerCase().includes(q)) ||
          v.protectsAgainst.some((p) => p.toLowerCase().includes(q)) ||
          v.category.some((c) => c.toLowerCase().includes(q))
      );
    }
    return list;
  }, [activeCategory, searchQuery, vaccines]);

  return (
    <main>
      <PremiumLandingHero
        eyebrow="NITA Vaccination Clinic · Kathmandu"
        title="Vaccines for every"
        highlight="age, trip, and season."
        description="Plan routine childhood immunization, adult boosters, women’s health vaccines, senior protection, and travel vaccines with clinical guidance."
        videoSrc="/videos/hero/vaccination-care.mp4"
        posterSrc="/videos/hero/vaccination-care.jpg"
        overlayClassName="from-primary-950/[0.88] via-primary-900/[0.66] to-emerald-900/[0.42]"
        actions={[
          { label: 'Book Vaccination', href: '/appointments/book?type=vaccination', icon: <FiCalendar className="h-4 w-4" /> },
          { label: '+977 01-4533361', href: 'tel:+977014533361', icon: <FiPhone className="h-4 w-4" />, variant: 'secondary' },
        ]}
        trustPoints={[
          'Child, adult, senior, travel categories',
          'Clinical eligibility guidance',
          'Official vaccine documentation',
          'Safe storage and administration',
        ]}
        stats={[
          { value: `${vaccines.length}+`, label: 'Vaccines Available' },
          { value: '6', label: 'Patient Categories' },
          { value: 'WHO', label: 'Aligned Guidance' },
        ]}
        panelEyebrow="Vaccine Visit"
        panelTitle="Protection planned around the patient."
        panelItems={[
          'Choose by category or search by vaccine, disease, or travel need.',
          'Confirm eligibility, timing, and booster schedule before administration.',
          'Leave with clear after-care guidance and documentation where needed.',
        ]}
      />

      {/* ── Why vaccinate strip ── */}
      <section className="bg-white border-b border-neutral-100">
        <div className="container-custom py-6">
          <div className="grid sm:grid-cols-4 gap-4">
            {WHY_BULLETS.map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 shadow-lg flex-shrink-0">
                  <item.icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-neutral-700">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category tabs + Search ── */}
      <section className="sticky top-0 z-30 bg-white border-b border-neutral-100 shadow-sm">
        <div className="container-custom py-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Category pills */}
            <div className="flex gap-1.5 flex-wrap">
              {VACCINE_CATEGORIES.map((cat) => {
                const Icon = categoryIcons[cat];
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => { setActiveCategory(cat); setSearchQuery(''); }}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full transition-all ${
                      activeCategory === cat
                        ? 'bg-primary-600 text-white shadow-[0_8px_20px_-8px_rgba(1,173,165,0.7)]'
                        : 'bg-white border border-neutral-200 text-neutral-600 hover:border-primary-300 hover:text-primary-600'
                    }`}
                  >
                    {activeCategory === cat && (
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                      </span>
                    )}
                    <Icon className="h-3.5 w-3.5" /> {cat}
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search vaccines…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <span className="text-xs text-neutral-400 font-medium hidden sm:block ml-auto">
              {filteredVaccines.length} vaccine{filteredVaccines.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </section>

      {/* ── Vaccines grid ── */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-3xl bg-white border border-neutral-200/70 p-5 flex gap-4">
                  <div className="w-24 h-24 rounded-xl bg-neutral-200 flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-neutral-200 rounded w-1/3" />
                    <div className="h-4 bg-neutral-100 rounded w-2/3" />
                    <div className="h-3 bg-neutral-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
          <AnimatePresence mode="wait">
            {loadError && vaccines.length === 0 ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20 rounded-3xl border border-red-100 bg-red-50/80 px-6"
              >
                <p className="font-semibold text-neutral-800 mb-2">Could not load vaccines</p>
                <p className="text-sm text-neutral-600">{loadError}</p>
              </motion.div>
            ) : filteredVaccines.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-50 text-primary-600 ring-1 ring-primary-100 shadow-lg">
                  <Syringe className="h-8 w-8" />
                </span>
                <h3 className="text-xl font-bold text-neutral-700 mb-2">No vaccines found</h3>
                <p className="text-neutral-500 text-sm mb-6">Try a different category or clear your search.</p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                  className="inline-flex items-center gap-2 bg-primary-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-700 transition-colors"
                >
                  View All Vaccines <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={`${activeCategory}-${searchQuery}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {filteredVaccines.map((vaccine, i) => (
                  <motion.div
                    key={vaccine.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.35) }}
                  >
                    <VaccineCard vaccine={vaccine} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          )}
        </div>
      </section>

      {/* ── Info cards ── */}
      <section className="relative overflow-hidden section-padding bg-white border-t border-neutral-100">
        {/* Ambient motif */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 plus-pattern-light opacity-40" />
          <div className="absolute -top-24 left-1/4 h-72 w-96 rounded-full bg-primary-50 blur-3xl" />
          <div className="absolute bottom-0 right-[-4rem] h-64 w-80 rounded-full bg-emerald-50/60 blur-3xl" />
        </div>
        <div className="container-custom relative">
          <SectionHeader
            eyebrow="Vaccination Services"
            title="Beyond the shot, clinical"
            highlight="guidance at every step"
            subtitle="From travel advice to childhood catch-up schedules — our team supports you before, during, and after each vaccine."
          />
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                icon: FileText,
                title: 'Immunization Check Profile',
                desc: 'Not sure which vaccines you need? Our Immunization Check profile tests your current immunity levels and tells you exactly which vaccines are due.',
                href: '/services/laboratory',
                cta: 'View Profile',
              },
              {
                icon: Plane,
                title: 'Travel Vaccination Advice',
                desc: 'Travelling to Africa, South America, or Southeast Asia? Our travel health advisors will build a personalized vaccination schedule for your destination.',
                href: '/appointments/book?type=travel-health',
                cta: 'Book Consult',
              },
              {
                icon: Users,
                title: "Children's Immunization",
                desc: 'Catch up on missed childhood vaccines or confirm your child is fully protected. We follow the national immunization schedule and international travel guidelines.',
                href: '/checkup/pediatrics',
                cta: 'Learn More',
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <Link
                  href={card.href}
                  className="group relative overflow-hidden flex flex-col h-full p-5 rounded-2xl border border-neutral-200/70 bg-white shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-primary-200 hover:shadow-[0_20px_44px_-16px_rgba(1,173,165,0.4)]"
                >
                  {/* Top accent bar */}
                  <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary-500 via-teal-400 to-primary-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                  {/* Ward number */}
                  <span className="absolute right-4 top-3 text-[11px] font-black tracking-wider text-neutral-200 group-hover:text-primary-200 transition-colors">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {/* Icon tile */}
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 shadow-lg mb-4 transition-transform duration-500 group-hover:scale-110">
                    <card.icon className="h-6 w-6" />
                  </span>
                  <h3 className="font-heading font-bold text-neutral-900 mb-1.5 group-hover:text-primary-700 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-neutral-500 flex-1">{card.desc}</p>
                  <span className="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-primary-600 group-hover:gap-2 transition-all">
                    {card.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  {/* Bottom ECG trace */}
                  <svg
                    viewBox="0 0 200 10"
                    className="absolute inset-x-4 bottom-1 animate-ecg-flow opacity-25"
                    height="10"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M0 7 H60 L68 2 L76 9 L82 4 L88 7 H200"
                      stroke="rgba(1,173,165,0.5)"
                      strokeWidth="1.5"
                    />
                  </svg>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CTAFooter
        title="Prevention is always better than"
        highlight="cure"
        subtitle="Book your vaccination appointment today. Walk-ins welcome for most vaccines."
        actions={[
          {
            label: 'Book Vaccination',
            href: '/appointments/book?type=vaccination',
            icon: <FiCalendar className="h-4 w-4" />,
            variant: 'primary',
          },
          { label: 'Contact Clinic', href: '/contact', variant: 'outline' },
        ]}
      />
    </main>
  );
}
