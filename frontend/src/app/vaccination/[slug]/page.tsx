'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Clock, Users, ChevronDown, Calendar, Phone, XCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { FiCalendar, FiPhone } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { getVaccineBySlug, mapVaccineFromApi, type Vaccine } from '@/lib/vaccine-data';
import { get } from '@/lib/api';
import { VideoHeroBackground } from '@/components/ui/VideoHeroBackground';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CTAFooter } from '@/components/ui/CTAFooter';
import { IconTileList } from '@/components/ui/IconTileList';

export default function VaccineDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [vaccine, setVaccine] = useState<Vaccine | null>(null);
  const [allVaccines, setAllVaccines] = useState<Vaccine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openSection, setOpenSection] = useState<string | null>('sideEffects');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      let resolved: Vaccine | null = null;
      try {
        const res = await get<Record<string, unknown>>('vaccinations/slug/' + slug);
        if (!cancelled && res) {
          resolved = mapVaccineFromApi(res);
        }
      } catch {
        /* fall through to offline catalog */
      }

      if (!cancelled && !resolved) {
        resolved = getVaccineBySlug(slug) ?? null;
      }
      if (!cancelled) setVaccine(resolved);

      try {
        const all = await get<{ data?: Record<string, unknown>[] }>('vaccinations?limit=100');
        if (!cancelled && all?.data?.length) {
          setAllVaccines(all.data.map((row) => mapVaccineFromApi(row)));
        }
      } catch {
        if (!cancelled) setAllVaccines([]);
      }

      if (!cancelled) setIsLoading(false);
    })();
    return () => { cancelled = true; };
  }, [slug]);

  if (isLoading && vaccine === null) {
    return (
      <main className="py-20">
        <div className="container-custom">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-neutral-200 rounded w-1/3" />
            <div className="h-64 bg-neutral-200 rounded-2xl" />
            <div className="h-4 bg-neutral-100 rounded w-2/3" />
            <div className="h-4 bg-neutral-100 rounded w-1/2" />
          </div>
        </div>
      </main>
    );
  }

  if (!vaccine) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-white">
        <div className="container-custom text-center py-20">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-50 text-primary-600">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-neutral-900 mb-3">Vaccine not found</h1>
          <p className="text-neutral-500 max-w-md mx-auto mb-8">
            We couldn’t find that vaccination programme. It may no longer be offered or the link may be incorrect.
          </p>
          <Link
            href="/vaccination"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Browse all vaccines
          </Link>
        </div>
      </main>
    );
  }

  const relatedVaccines = allVaccines.filter(
    (v) => v.id !== vaccine.id && v.category.some((c) => vaccine.category.includes(c))
  ).slice(0, 3);

  const bookHref = `/appointments/book?vaccine=${encodeURIComponent(vaccine.name)}&type=vaccination`;

  return (
    <main>
      {/* ── Hero ── */}
      <section className="py-20 bg-primary-950 text-white relative overflow-hidden">
        <VideoHeroBackground
          src="/videos/hero/vaccination-care.mp4"
          poster="/videos/hero/vaccination-care.jpg"
          overlayClassName="from-primary-950/[0.88] via-primary-900/[0.66] to-emerald-900/[0.42]"
        />
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <Link
            href="/vaccination"
            className="inline-flex items-center gap-1.5 text-sm text-primary-300 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Vaccination
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="flex flex-wrap gap-1.5 mb-4">
              {vaccine.category.map((cat) => (
                <span key={cat} className="bg-white/10 border border-white/15 text-white/80 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {cat}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 leading-tight">{vaccine.name}</h1>
            <p className="text-primary-100/90 text-lg leading-relaxed max-w-2xl">{vaccine.tagline}</p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                href={bookHref}
                className="inline-flex items-center gap-2 bg-white text-neutral-900 font-bold px-6 py-3 rounded-xl hover:bg-neutral-100 transition-colors shadow-lg"
              >
                <FiCalendar className="w-4 h-4" />
                Book Vaccination
              </Link>
              <a
                href="tel:+977014533361"
                className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/25 transition-colors"
              >
                <FiPhone className="w-4 h-4" />
                Call +977 01-4533361
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Main content ── */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ── Left: main info ── */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image + description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="relative rounded-3xl overflow-hidden mb-6 aspect-video border border-neutral-200/70 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={vaccine.image}
                    alt={vaccine.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-950/50 via-transparent to-transparent" />
                  <svg
                    className="absolute inset-x-0 bottom-0 h-10 w-full"
                    viewBox="0 0 400 32"
                    preserveAspectRatio="none"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M0 22 H120 L138 8 L158 28 L176 14 L194 22 H400"
                      stroke="rgba(255,255,255,0.85)"
                      strokeWidth="2"
                      strokeDasharray="80 20"
                      className="animate-ecg-flow"
                    />
                  </svg>
                </div>
                <SectionHeader
                  align="left"
                  eyebrow="Clinical Overview"
                  title="About This"
                  highlight="Vaccine"
                  className="mb-4 md:mb-4"
                />
                <p className="text-neutral-600 leading-relaxed">{vaccine.longDescription}</p>
              </motion.div>

              {/* Protects against */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <SectionHeader
                  align="left"
                  eyebrow="Coverage"
                  title="Protects"
                  highlight="Against"
                  className="mb-4 md:mb-4"
                />
                <IconTileList items={vaccine.protectsAgainst} category="vaccination coverage" accent="teal" layout="list" />
              </motion.div>

              {/* Accordion sections */}
              <div className="space-y-3">
                {[
                  {
                    id: 'sideEffects',
                    title: 'Side Effects',
                    icon: AlertTriangle,
                    iconColor: 'text-amber-500',
                    content: (
                      <IconTileList items={vaccine.sideEffects} category="vaccination side effects" accent="amber" layout="list" />
                    ),
                  },
                  {
                    id: 'contraindications',
                    title: 'Contraindications',
                    icon: XCircle,
                    iconColor: 'text-red-500',
                    content: (
                      <IconTileList items={vaccine.contraindications} category="vaccination contraindications" accent="rose" layout="list" />
                    ),
                  },
                ].map((section) => (
                  <div key={section.id} className="rounded-3xl border border-neutral-200/70 bg-white overflow-hidden shadow-sm transition-all duration-300 hover:border-primary-200">
                    <button
                      type="button"
                      onClick={() => setOpenSection((p) => (p === section.id ? null : section.id))}
                      className="w-full flex items-center justify-between text-left px-5 py-4 font-semibold text-neutral-800 hover:text-primary-700 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <section.icon className={cn('w-4 h-4', section.iconColor)} />
                        {section.title}
                      </span>
                      <ChevronDown className={cn('w-5 h-5 text-neutral-400 transition-transform', openSection === section.id && 'rotate-180')} />
                    </button>
                    <AnimatePresence initial={false}>
                      {openSection === section.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5">{section.content}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {vaccine.notes && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 font-medium">{vaccine.notes}</p>
                </div>
              )}
            </div>

            {/* ── Right: sidebar ── */}
            <aside className="space-y-5">
              {/* Quick info card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="group relative overflow-hidden rounded-3xl border border-neutral-200/70 bg-white p-5 space-y-4 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_20px_44px_-16px_rgba(1,173,165,0.4)]"
              >
                <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary-500 via-teal-400 to-primary-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                <span className="absolute right-4 top-3 text-[11px] font-black tracking-wider text-neutral-200">01</span>
                <h3 className="font-heading font-bold text-neutral-900">Quick Facts</h3>
                <div className="space-y-3 text-sm">
                  {[
                    { icon: Clock, label: 'Doses', value: vaccine.doses },
                    { icon: Calendar, label: 'Schedule', value: vaccine.schedule },
                    { icon: Users, label: 'Who it\'s for', value: vaccine.whoItIsFor },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600 shadow-sm flex-shrink-0">
                        <Icon className="w-4 h-4" />
                      </span>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-neutral-400 font-semibold">{label}</p>
                        <p className="text-neutral-700 text-xs leading-relaxed mt-0.5">{value}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shadow-sm flex-shrink-0">
                      <Shield className="w-4 h-4" />
                    </span>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-neutral-400 font-semibold">Availability</p>
                      <p className="text-neutral-700 text-xs mt-0.5">{vaccine.availability}</p>
                    </div>
                  </div>
                </div>

                {/* ECG divider */}
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 100 12" className="h-3 w-24">
                    <path d="M0 8 H30 L36 3 L42 9 L48 5 L54 8 H100" stroke="rgba(1,173,165,0.4)" strokeWidth="1.5" strokeDasharray="30 8" className="animate-ecg-flow" />
                  </svg>
                  <span className="h-px flex-1 bg-neutral-100" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-vital-ping" />
                </div>

                <div className="pt-2 space-y-2">
                  <p className="text-[10px] uppercase tracking-wide text-neutral-400 font-semibold">Pricing</p>
                  <p className="text-xs text-neutral-600">{vaccine.priceNote}</p>
                  <Link
                    href={bookHref}
                    className="w-full inline-flex items-center justify-center gap-2 bg-primary-600 text-white text-sm font-semibold py-3 rounded-xl hover:bg-primary-700 transition-all shadow-[0_8px_20px_-8px_rgba(1,173,165,0.7)] mt-2"
                  >
                    <FiCalendar className="w-4 h-4" />
                    Book This Vaccine
                  </Link>
                  <a
                    href="tel:+977014533361"
                    className="w-full inline-flex items-center justify-center gap-2 border border-neutral-200 text-neutral-700 text-sm font-semibold py-3 rounded-xl hover:border-primary-300 hover:text-primary-700 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call for Pricing
                  </a>
                </div>
              </motion.div>

              {/* Related vaccines */}
              {relatedVaccines.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="rounded-3xl border border-neutral-200/70 bg-white p-5 shadow-sm"
                >
                  <h3 className="font-heading font-bold text-neutral-900 mb-4">Related Vaccines</h3>
                  <div className="space-y-3">
                    {relatedVaccines.map((v) => (
                      <Link
                        key={v.id}
                        href={`/vaccination/${v.slug}`}
                        className="flex items-start gap-3 group hover:bg-neutral-50 rounded-xl p-2 -mx-2 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors line-clamp-1">{v.name}</p>
                          <p className="text-xs text-neutral-500 mt-0.5">{v.doses}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/vaccination"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-800 mt-4"
                  >
                    View all vaccines →
                  </Link>
                </motion.div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CTAFooter
        title="Stay protected, stay"
        highlight="ahead"
        subtitle={`Plan ${vaccine.name} or catch up on any other vaccine today — clinical guidance included.`}
        actions={[
          { label: 'Book Vaccination', href: bookHref, icon: <FiCalendar className="h-4 w-4" />, variant: 'primary' },
          { label: 'Browse All Vaccines', href: '/vaccination', variant: 'outline' },
        ]}
      />
    </main>
  );
}
