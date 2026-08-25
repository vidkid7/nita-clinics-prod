'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  FiX,
  FiArrowRight,
  FiZap,
  FiShield,
  FiHeart,
  FiBriefcase,
  FiCheckCircle,
  FiActivity,
  FiDroplet,
  FiPackage,
  FiTag,
} from 'react-icons/fi';
import { BRAND } from '@/lib/brand';

type Card = {
  id: string;
  name: string;
  type: string;
  image?: string;
  opdDiscount?: string;
  labDiscount?: string;
  medicineDiscount?: string;
  queueBenefit?: string;
  summary?: string;
  totalCards?: number;
  issuedCards?: number;
};

type Pkg = {
  id: string;
  name: string;
  image?: string;
  originalPrice: string;
  discountedPrice: string;
  currency?: string;
  tests?: string[];
  ageLabel?: string;
  targetGroup?: string;
};

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
  (typeof window !== 'undefined' && window.location.hostname
    ? `${window.location.protocol}//${window.location.hostname}:3001`
    : 'http://localhost:3001')
) + '/api/v1';

/* ═════════════════════════════════════════════
   TYPE → STYLE mapping (mirrors /health-card AdCard)
═════════════════════════════════════════════ */
const TYPE_STYLES: Record<
  string,
  {
    title: string;
    holderLabel: string;
    cardNumber: string;
    validThru: string;
    bigDeal: string;
    smallDeal: string;
    badge: string;
    badgeColor: string;
    gradient: string;
    icon: React.ReactNode;
    sub: string;
    isPopular?: boolean;
  }
> = {
  licensed_doctors: {
    title: "For Doctors (Any Specialty)",
    holderLabel: 'For Doctors',
    cardNumber: '•••• •••• •••• 1001',
    validThru: '12/26',
    bigDeal: '100% OPD',
    smallDeal: 'Doctor consultations are FREE for life',
    badge: '★ Premium Tier',
    badgeColor: 'bg-amber-300 text-amber-900',
    gradient: 'bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500',
    icon: <FiShield className="h-3.5 w-3.5" />,
    sub: 'Any medical specialty — verified NMC registration',
    isPopular: true,
  },
  family: {
    title: "For Doctors' Family Members",
    holderLabel: "Doctor's Family",
    cardNumber: '•••• •••• •••• 2002',
    validThru: '12/26',
    bigDeal: '50% OPD',
    smallDeal: 'Doctor consultations for your whole family',
    badge: '♥ Family Plan',
    badgeColor: 'bg-rose-300 text-rose-900',
    gradient: 'bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-500',
    icon: <FiHeart className="h-3.5 w-3.5" />,
    sub: "Spouse · Parents · Children of a verified doctor",
  },
  partner_staff: {
    title: 'For Partner Organisation Staff',
    holderLabel: 'Partner Staff',
    cardNumber: '•••• •••• •••• 3003',
    validThru: '12/26',
    bigDeal: '50% OPD',
    smallDeal: 'Half price on all doctor consultations',
    badge: '🏢 Corporate',
    badgeColor: 'bg-emerald-300 text-emerald-900',
    gradient: 'bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500',
    icon: <FiBriefcase className="h-3.5 w-3.5" />,
    sub: 'Staff of partner organizations (Nita Group companies)',
  },
  general_public: {
    title: 'For General Public',
    holderLabel: 'For Everyone',
    cardNumber: '•••• •••• •••• 4004',
    validThru: '12/26',
    bigDeal: '20% OFF',
    smallDeal: 'On OPD, Labs and Pharmacy — every visit',
    badge: '🌟 Public',
    badgeColor: 'bg-primary-300 text-primary-900',
    gradient: 'bg-gradient-to-br from-primary-700 via-primary-600 to-teal-500',
    icon: <FiCheckCircle className="h-3.5 w-3.5" />,
    sub: 'Open to all — walk in to our Bhimselgola-9 clinic',
  },
};

const FALLBACK_TIER_ORDER: (keyof typeof TYPE_STYLES)[] = [
  'licensed_doctors',
  'family',
  'partner_staff',
  'general_public',
];

/**
 * Centered ad card — shown on every page load / refresh.
 * Designed to feel like a real ad: takes ~half the viewport, centered,
 * with clear Limited-time branding and a single primary CTA.
 *  - Step 0: Health Card ad (4 tiers in a 2x2 grid, mirrors /health-card AdCard)
 *  - Step 1: Health Pack ad (3-4 packages in a 2x2 grid)
 */
export function WelcomeAdModal({ visible, onDismiss }: { visible: boolean; onDismiss?: () => void }) {
  const [step, setStep] = useState<0 | 1 | 2>(0); // 0 = first ad, 1 = second ad, 2 = hidden
  const [cards, setCards] = useState<Card[]>([]);
  const [packages, setPackages] = useState<Pkg[]>([]);

  // Always start on the first ad whenever the ads are shown (every refresh).
  useEffect(() => {
    if (!visible) return;
    setStep(0);
  }, [visible]);

  // Fetch Health Card categories + Checkup Packages
  useEffect(() => {
    if (!visible) return;
    if (typeof window === 'undefined') return;
    let cancelled = false;

    fetch(`${API_BASE}/health-card/categories`)
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => {
        if (!cancelled) setCards(Array.isArray(d) ? d : []);
      })
      .catch(() => {});

    fetch(`${API_BASE}/packages?limit=4`)
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => {
        if (!cancelled) setPackages(Array.isArray(d) ? d.slice(0, 4) : []);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [visible]);

  function dismiss() {
    setStep(2);
    onDismiss?.();
  }

  function next() {
    setStep((s) => (s === 0 ? 1 : 2));
  }

  if (!visible) return null;

  // Build the 4 tier views. Prefer DB-driven content, fall back to the hardcoded style map.
  // Each tier uses a fixed slot in the 2x2 grid (Doctor, Family, Partner, Public).
  const renderedTiers = FALLBACK_TIER_ORDER.map((key, i) => {
    const style = TYPE_STYLES[key];
    const dbCard = cards.find((c) => c.type === key) ?? cards[i];
    return {
      ...style,
      title: dbCard?.name || style.title,
      opdDiscount: dbCard?.opdDiscount,
      labDiscount: dbCard?.labDiscount,
      medicineDiscount: dbCard?.medicineDiscount,
      queueBenefit: dbCard?.queueBenefit,
    };
  });

  return (
    <AnimatePresence>
      {step < 2 && (
        <motion.div
          key={`ad-step-${step}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed inset-0 z-[95] flex items-center justify-center bg-black/20 p-4"
          aria-modal="true"
          role="dialog"
          aria-labelledby={step === 0 ? 'welcome-ad-title' : 'welcome-pack-title'}
        >
          {/* Ad card — ~half the viewport, centered */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="relative w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm shadow-2xl ring-1 ring-black/5 flex flex-col"
          >
            {/* close */}
            <button
              type="button"
              onClick={dismiss}
              aria-label="Close advertisement"
              className="absolute top-3 right-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-700 hover:bg-white shadow-md transition-colors ring-1 ring-neutral-200"
            >
              <FiX className="h-4 w-4" />
            </button>

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto">
              {step === 0 && (
                <div className="px-5 pt-10 pb-6 md:px-7">
                  {/* Limited-time badge */}
                  <div className="mb-3 flex justify-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-amber-700 border border-amber-200">
                      <FiZap className="w-3 h-3" />
                      Limited Time Launch
                    </span>
                  </div>

                  {/* heading */}
                  <div className="mb-4 text-center">
                    <div className="mx-auto mb-3 inline-flex rounded-2xl bg-white px-3 py-2 shadow-sm ring-1 ring-primary-100">
                      <Image src={BRAND.logo} alt="Nita Clinic" width={150} height={76} className="h-10 w-auto object-contain" />
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-primary-700 border border-primary-100">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-vital-ping" />
                      Now Distributing
                    </span>
                    <h2
                      id="welcome-ad-title"
                      className="mt-2 text-xl md:text-3xl font-heading font-bold text-neutral-900 leading-tight"
                    >
                      Introducing the{' '}
                      <span className="text-primary-600">NITA Health Card</span>
                    </h2>
                    <p className="mt-1.5 text-xs md:text-sm text-neutral-500 max-w-xl mx-auto">
                      Four exclusive membership tiers — designed for doctors, families, partner
                      organizations, and the general public.
                    </p>
                  </div>

                  {/* 4 health cards in a 2x2 grid — mirrors /health-card AdCard */}
                  <div className="grid grid-cols-2 gap-2.5 md:gap-3">
                    {renderedTiers.slice(0, 4).map((c, i) => (
                      <motion.div
                        key={`${c.title}-${i}`}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.06, duration: 0.35 }}
                        whileHover={{ y: -4 }}
                        className={`group relative flex flex-col overflow-hidden rounded-2xl ${c.gradient} p-3.5 shadow-[0_18px_50px_-22px_rgba(0,0,0,0.45)] ring-1 ring-white/15 transition-all`}
                      >
                        {/* decorative orbs */}
                        <div className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                        <div className="pointer-events-none absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
                        {/* diagonal stripes */}
                        <div
                          className="pointer-events-none absolute inset-0 opacity-[0.07]"
                          style={{
                            backgroundImage:
                              'repeating-linear-gradient(135deg, transparent, transparent 8px, white 8px, white 9px)',
                          }}
                        />

                        {/* top ribbon — badge + popular */}
                        <div className="relative z-10 flex items-center justify-between gap-1.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest shadow-sm ${c.badgeColor}`}
                          >
                            {c.badge}
                          </span>
                          {c.isPopular && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-300/90 text-amber-900 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest shadow-sm">
                              ★ Most Popular
                            </span>
                          )}
                        </div>

                        {/* tier icon + title */}
                        <div className="relative z-10 mt-2.5 flex items-start gap-2.5">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm ring-1 ring-white/20 text-white">
                            {c.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[8px] font-bold uppercase tracking-widest text-white/70">
                              {c.holderLabel}
                            </p>
                            <h3 className="font-heading font-extrabold text-[13px] leading-tight text-white mt-0.5 line-clamp-1">
                              {c.title}
                            </h3>
                          </div>
                        </div>

                        {/* big deal box */}
                        <div className="relative z-10 mt-2.5 rounded-xl bg-white/12 backdrop-blur-sm px-2.5 py-2 border border-white/15">
                          <p className="text-[8px] font-bold uppercase tracking-widest text-white/70">
                            Headline Benefit
                          </p>
                          <p className="font-black text-2xl leading-none mt-0.5 drop-shadow text-white">
                            {c.bigDeal}
                          </p>
                          <p className="text-[9px] text-white/85 mt-0.5 font-semibold leading-snug line-clamp-2">
                            {c.smallDeal}
                          </p>
                        </div>

                        {/* mini benefit pills */}
                        <div className="relative z-10 mt-2 flex flex-wrap gap-1">
                          {c.opdDiscount && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-white/15 backdrop-blur-sm px-1.5 py-0.5 text-[8px] font-bold border border-white/15">
                              <FiActivity className="h-2.5 w-2.5" /> {c.opdDiscount} OPD
                            </span>
                          )}
                          {c.labDiscount && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-white/15 backdrop-blur-sm px-1.5 py-0.5 text-[8px] font-bold border border-white/15">
                              <FiDroplet className="h-2.5 w-2.5" /> {c.labDiscount} Labs
                            </span>
                          )}
                          {c.medicineDiscount && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-white/15 backdrop-blur-sm px-1.5 py-0.5 text-[8px] font-bold border border-white/15">
                              <FiPackage className="h-2.5 w-2.5" /> {c.medicineDiscount} Pharmacy
                            </span>
                          )}
                        </div>

                        {/* card meta */}
                        <div className="relative z-10 mt-auto pt-2 border-t border-white/15 flex items-end justify-between gap-1.5">
                          <div className="min-w-0">
                            <p className="font-mono text-[8px] tracking-[0.18em] text-white/55 truncate">
                              {c.cardNumber}
                            </p>
                            <p className="text-[8px] text-white/55 mt-0.5">Valid thru {c.validThru}</p>
                          </div>
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-black uppercase tracking-wider text-white/90">
                            Select <FiArrowRight className="h-2.5 w-2.5" />
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* actions */}
                  <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                    <button
                      type="button"
                      onClick={next}
                      className="inline-flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-colors text-sm"
                    >
                      See Health Packs
                      <FiArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <Link
                      href="/health-card"
                      onClick={dismiss}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-primary-600 px-3 py-2.5 rounded-xl transition-colors"
                    >
                      Learn more about Health Card
                    </Link>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="px-6 pt-14 pb-6 md:px-8">
                  {/* Limited-time badge */}
                  <div className="mb-3 flex justify-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-emerald-700 border border-emerald-200">
                      <FiZap className="w-3 h-3" />
                      30% Off · Limited Period
                    </span>
                  </div>

                  {/* heading */}
                  <div className="mb-5 text-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-emerald-700 border border-emerald-100">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-vital-ping" />
                      Special Offers
                    </span>
                    <h2
                      id="welcome-pack-title"
                      className="mt-2 text-xl md:text-3xl font-heading font-bold text-neutral-900 leading-tight"
                    >
                      Health{' '}
                      <span className="text-emerald-600">Packs</span> — Curated Check-ups
                    </h2>
                    <p className="mt-1.5 text-xs md:text-sm text-neutral-500 max-w-xl mx-auto">
                      Full-body check-up packages at discounted rates. Save more on every
                      family member.
                    </p>
                  </div>

                  {/* packages grid */}
                  <div className="grid grid-cols-2 gap-2.5 md:gap-3">
                    {packages.length === 0
                      ? Array.from({ length: 4 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-32 rounded-2xl border border-neutral-200 bg-white overflow-hidden"
                          >
                            <div className="h-20 bg-neutral-100 animate-pulse" />
                            <div className="p-2 space-y-1.5">
                              <div className="h-3 w-3/4 bg-neutral-100 animate-pulse rounded-full" />
                              <div className="h-4 w-1/2 bg-neutral-100 animate-pulse rounded-full" />
                            </div>
                          </div>
                        ))
                      : packages.slice(0, 4).map((p, i) => {
                          const orig = Number(p.originalPrice);
                          const disc = Number(p.discountedPrice);
                          const pct =
                            orig > 0 && disc < orig
                              ? Math.round(((orig - disc) / orig) * 100)
                              : 0;
                          return (
                            <motion.div
                              key={p.id ?? i}
                              initial={{ opacity: 0, y: 14 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 + i * 0.06, duration: 0.35 }}
                              whileHover={{ y: -4 }}
                              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200/70 hover:shadow-md hover:ring-emerald-200 transition-all"
                            >
                              {/* Data-first package header — no poster image */}
                              <div className="relative flex h-20 items-center gap-2 overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 px-3 text-white">
                                <div className="pointer-events-none absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '12px 12px' }} />
                                <FiPackage className="relative h-6 w-6 shrink-0" />
                                <span className="relative line-clamp-2 text-[10px] font-bold uppercase tracking-wide">Included tests &amp; live offer</span>
                                {pct > 0 && (
                                  <span className="absolute right-1.5 top-1.5 inline-flex items-center gap-0.5 rounded-full bg-white/95 px-1.5 py-0.5 text-[9px] font-black text-emerald-700 shadow-sm">
                                    <FiTag className="w-2.5 h-2.5" />
                                    {pct}% OFF
                                  </span>
                                )}
                              </div>

                              {/* body */}
                              <div className="flex flex-1 flex-col p-2.5">
                                <h3 className="font-heading font-bold text-[12px] text-neutral-900 leading-snug line-clamp-1">
                                  {p.name}
                                </h3>
                                {p.ageLabel && (
                                  <p className="mt-0.5 text-[9px] text-neutral-500 line-clamp-1">
                                    {p.ageLabel}
                                  </p>
                                )}
                                <div className="mt-auto pt-2 flex items-end justify-between gap-1.5">
                                  <div className="min-w-0">
                                    <div className="flex items-baseline gap-1">
                                      <span className="text-sm font-black text-emerald-600">
                                        NPR {disc.toLocaleString('en-IN')}
                                      </span>
                                    </div>
                                    {orig > disc && (
                                      <span className="text-[9px] text-neutral-400 line-through">
                                        NPR {orig.toLocaleString('en-IN')}
                                      </span>
                                    )}
                                  </div>
                                  <span className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 transition-colors duration-300 group-hover:bg-emerald-600 group-hover:text-white">
                                    <FiArrowRight className="w-3 h-3" />
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                  </div>

                  {/* actions */}
                  <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                    <Link
                      href="/checkup"
                      onClick={dismiss}
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-colors text-sm"
                    >
                      Explore all Health Packs
                      <FiArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={dismiss}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-emerald-600 px-3 py-2.5 rounded-xl transition-colors"
                    >
                      Maybe later
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
