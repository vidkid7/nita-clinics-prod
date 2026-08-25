'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

/* Load Logos3 client-side only — prevents Embla hydration mismatch */
const Logos3 = dynamic(
  () => import('@/components/ui/logos3').then((m) => m.Logos3),
  { ssr: false, loading: () => <div className="h-24" /> },
);
import {
  CheckCircle2,
  ArrowRight,
  Zap,
  Check,
  Star,
  Users,
  Clock,
  Phone,
  Stethoscope,
  FlaskConical,
  Pill,
  Info,
  Sparkles,
  Tag,
  BadgeCheck,
  X as XIcon,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ApplicationForm } from '@/components/health-card/ApplicationForm';
import { VideoHeroBackground } from '@/components/ui/VideoHeroBackground';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CTAFooter } from '@/components/ui/CTAFooter';
import { HealthCard } from '@/components/health-card/HealthCard';

/* ═════════════════════════════════════════════
   MEMBERSHIP CARD COMPONENT
═════════════════════════════════════════════ */

interface AdCardData {
  id: string;
  type: string;
  title: string;
  /** Short headline shown in giant text on the card */
  headline: string;
  sub: string;
  /** The big "deal" — e.g. "100% OPD", "50% Labs" */
  bigDeal: string;
  smallDeal: string;
  holderLabel: string;
  cardNumber: string;
  validThru: string;
  mainDiscount: string;
  discountSub: string;
  tagline: string;
  gradient: string;
  badge: string;
  badgeColor: string;
  /** Optional hero image from CMS */
  imageUrl?: string;
  // benefits for detail panel
  opdDiscount: string;
  labDiscount: string;
  medicineDiscount: string;
  queueBenefit: string;
  notes: string;
  /** "Most popular" pill or other ranking */
  isPopular?: boolean;
  /** Tier icon */
  tierIcon: 'crown' | 'heart' | 'building' | 'badge';
}

function AdCard({ data, isSelected, onSelect }: { data: AdCardData; isSelected: boolean; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      aria-pressed={isSelected}
      className="w-full text-left focus:outline-none group h-full"
    >
      <motion.div
        animate={{
          y: isSelected ? -6 : hovered ? -4 : 0,
          scale: isSelected ? 1.02 : 1,
        }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        className={cn(
          'relative w-full overflow-hidden rounded-2xl border bg-white p-4 text-neutral-900 transition-all duration-300 sm:p-5',
          isSelected
            ? 'border-amber-400 shadow-[0_24px_55px_-24px_rgba(245,158,11,0.55)] ring-2 ring-amber-200'
            : 'border-neutral-200 shadow-[0_18px_50px_-22px_rgba(0,0,0,0.3)] hover:border-primary-200 hover:shadow-[0_24px_60px_-20px_rgba(1,173,165,0.25)]',
        )}
      >
        <div className="relative flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-teal-500 text-white shadow-sm">
            <span className="text-sm font-black" aria-hidden="true">N</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">{data.holderLabel}</p>
            <h3 className="mt-1 font-heading text-base font-extrabold leading-tight text-neutral-900 sm:text-lg">{data.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-neutral-600">{data.sub}</p>
          </div>
          <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide', isSelected ? 'bg-amber-100 text-amber-900' : 'bg-primary-50 text-primary-800')}>
            {isSelected ? 'Selected' : 'Choose'}
          </span>
        </div>
        <div className="relative mt-4 grid grid-cols-2 gap-2 border-t border-neutral-100 pt-3 text-left">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">Member type</p>
            <p className="mt-0.5 text-xs font-semibold text-neutral-900">{data.holderLabel}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">Preview saving</p>
            <p className="mt-0.5 text-xs font-semibold text-primary-800">{data.bigDeal}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">Status</p>
            <p className="mt-0.5 text-xs font-semibold text-emerald-700">Ready to apply</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">Validity</p>
            <p className="mt-0.5 text-xs font-semibold text-neutral-900">1 year after activation</p>
          </div>
        </div>

        {/* Selected: checkmark badge top-right */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: -45 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 24 }}
              className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-amber-300 shadow-xl"
            >
              <Check className="w-5 h-5 text-amber-900" strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
}

const BENEFIT_ICONS = [
  { key: 'opdDiscount', icon: Stethoscope, label: 'OPD Consultation' },
  { key: 'labDiscount', icon: FlaskConical, label: 'Lab Tests' },
  { key: 'medicineDiscount', icon: Pill, label: 'Pharmacy' },
  { key: 'queueBenefit', icon: Zap, label: 'Queue Benefit' },
] as const;

const APPLY_STEPS = [
  { step: '01', title: 'Select Your Card', desc: 'Choose the membership tier that matches your eligibility.' },
  { step: '02', title: 'Fill Application', desc: 'Complete the form with your personal and professional details.' },
  { step: '03', title: 'Submit for Review', desc: 'Our team verifies your eligibility within 24–48 hours.' },
  { step: '04', title: 'Get Confirmation', desc: 'Receive approval via SMS or call from our team.' },
  { step: '05', title: 'Activate & Use', desc: 'Benefits start immediately from your first verified visit.' },
];

const FAQS = [
  { q: 'How long is the Health Card valid?', a: 'The card is valid for one year from the activation date, subject to clinic policy updates.' },
  { q: 'When does the card activate?', a: 'Activation starts from your first valid use after approval by our operations team.' },
  { q: 'Can the card be renewed?', a: 'Yes, renewal is available based on usage and current membership category policy.' },
  { q: 'Can family members use my card?', a: "Family benefits are under the Doctor's Family category. Apply separately for each family member." },
  { q: 'Which departments accept the card?', a: 'All OPD departments, Path Labs, Pharmacy, Imaging (Ultrasound, X-Ray), and most lab services.' },
  { q: 'Is there a joining fee?', a: 'Registration is free. Certain premium tiers may have a nominal annual fee — our team will confirm during application.' },
];

const PARTNER_LOGOS = [
  {
    id: 'eng-nita',
    description: 'Engineering Nita Pvt. Ltd.',
    image: '/images/nita-engineering-and-infra.jpeg',
    website: 'https://engineeringnita.com',
    className: 'max-h-12 w-auto max-w-[160px] object-contain opacity-75 hover:opacity-100 transition-opacity',
  },
  {
    id: 'him-river',
    description: 'Him River Power Limited',
    image: 'https://himriverpower.com/wp-content/themes/him-river/assets/images/logo.png',
    website: 'https://himriverpower.com',
    className: 'max-h-12 w-auto max-w-[160px] object-contain opacity-75 hover:opacity-100 transition-opacity',
  },
  {
    id: 'sn-energy',
    description: 'SN Energy Limited',
    image: 'https://www.snenergyltd.com/img/logo.png',
    website: 'https://www.snenergyltd.com',
    className: 'max-h-12 w-auto max-w-[160px] object-contain opacity-75 hover:opacity-100 transition-opacity',
  },
];

/* ═════════════════════════════════════════════
   TYPE → STYLE mapping
═════════════════════════════════════════════ */
const TYPE_STYLES: Record<string, Partial<AdCardData>> = {
  licensed_doctors: {
    holderLabel: 'For Doctors',
    cardNumber: '•••• •••• •••• 1001',
    validThru: '12/26',
    sub: 'Any medical specialty — verified NMC registration',
    bigDeal: '100% OPD',
    smallDeal: 'Doctor consultations are FREE for life',
    discountSub: 'Free OPD + 50% Labs',
    tagline: 'Verified NMC Doctors',
    gradient: 'bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500',
    badge: '★ Premium Tier',
    badgeColor: 'bg-amber-300 text-amber-900',
    isPopular: true,
    tierIcon: 'crown',
    headline: 'Top Tier',
  },
  family: {
    holderLabel: "Doctor's Family",
    cardNumber: '•••• •••• •••• 2002',
    validThru: '12/26',
    sub: 'Spouse · Parents · Children of a verified doctor',
    bigDeal: '50% OPD',
    smallDeal: 'Doctor consultations for your whole family',
    discountSub: '50% OPD + 35% Labs',
    tagline: "Doctor's Family",
    gradient: 'bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-500',
    badge: '♥ Family Plan',
    badgeColor: 'bg-rose-300 text-rose-900',
    tierIcon: 'heart',
    headline: 'Family Tier',
  },
  partner_staff: {
    holderLabel: 'Partner Staff',
    cardNumber: '•••• •••• •••• 3003',
    validThru: '12/26',
    sub: 'Staff of partner organizations (Nita Group companies)',
    bigDeal: '50% OPD',
    smallDeal: 'Half price on all doctor consultations',
    discountSub: '50% OPD + 50% Labs',
    tagline: 'Corporate Partners',
    gradient: 'bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500',
    badge: '🏢 Corporate',
    badgeColor: 'bg-emerald-300 text-emerald-900',
    tierIcon: 'building',
    headline: 'Partner Tier',
  },
  general_public: {
    holderLabel: 'For Everyone',
    cardNumber: '•••• •••• •••• 4004',
    validThru: '12/26',
    sub: 'Open to all — walk in to our Bhimselgola-9 clinic',
    bigDeal: '20% OFF',
    smallDeal: 'On OPD, Labs and Pharmacy — every visit',
    discountSub: '20% OPD + 20% Labs',
    tagline: 'Open to Everyone',
    gradient: 'bg-gradient-to-br from-primary-700 via-primary-600 to-teal-500',
    badge: '🌟 Public',
    badgeColor: 'bg-primary-300 text-primary-900',
    tierIcon: 'badge',
    headline: 'Public Tier',
  },
};

function mapCategoryToCard(cat: Record<string, unknown>): AdCardData {
  const typeKey = String(cat.type || 'general_public');
  const s = TYPE_STYLES[typeKey] ?? TYPE_STYLES.general_public;
  return {
    id: String(cat.id),
    type: typeKey,
    title: String(cat.name || 'Card'),
    headline: s.headline ?? 'Health Card',
    sub: s.sub ?? '',
    bigDeal: s.bigDeal ?? 'Special Offer',
    smallDeal: s.smallDeal ?? '',
    holderLabel: s.holderLabel ?? String(cat.name || ''),
    cardNumber: s.cardNumber ?? '•••• •••• •••• 0000',
    validThru: s.validThru ?? '12/26',
    mainDiscount: String(cat.labDiscount || cat.opdDiscount || '10% OFF'),
    discountSub: s.discountSub ?? '',
    tagline: s.tagline ?? (cat.summary != null ? String(cat.summary) : ''),
    gradient: s.gradient ?? 'bg-gradient-to-br from-neutral-800 via-neutral-700 to-neutral-600',
    badge: s.badge ?? 'Health Card',
    badgeColor: s.badgeColor ?? 'bg-white text-neutral-900',
    isPopular: s.isPopular,
    tierIcon: s.tierIcon ?? 'badge',
    opdDiscount: cat.opdDiscount != null ? String(cat.opdDiscount) : '',
    labDiscount: cat.labDiscount != null ? String(cat.labDiscount) : '',
    medicineDiscount: cat.medicineDiscount != null ? String(cat.medicineDiscount) : '',
    queueBenefit: cat.queueBenefit != null ? String(cat.queueBenefit) : '',
    notes: cat.notes != null ? String(cat.notes) : '',
  };
}

export default function HealthCardPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [cards, setCards] = useState<AdCardData[]>([]);
  const [cardsLoading, setCardsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setCardsLoading(true);
    import('@/lib/api').then(({ get }) => {
      get<Record<string, unknown>[]>('health-card/categories')
        .then((cats) => {
          if (cancelled) return;
          if (!Array.isArray(cats)) {
            setCards([]);
            return;
          }
          setCards(
            cats.filter((c) => c.isActive !== false).map((c) => mapCategoryToCard(c)),
          );
        })
        .catch(() => {
          if (!cancelled) setCards([]);
        })
        .finally(() => {
          if (!cancelled) setCardsLoading(false);
        });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedCard = cards.find((c) => c.id === selectedId) ?? null;

  const previewCardData = {
    fullName: 'Your Name',
    holderType: selectedCard?.type || 'general_public',
    documentNumber: 'NITA-PREVIEW-0001',
    cardNumber: selectedCard ? `NITA-${selectedCard.type.replace(/_/g, '-').toUpperCase()}-PREVIEW` : 'NITA-PUBLIC-PREVIEW',
    status: 'approved',
    qrValue: `nita-preview-${selectedCard?.type || 'general_public'}`,
  };

  const toggle = (id: string) => setSelectedId((prev) => (prev === id ? null : id));

  return (
    <>
      {/* ═══════════════════════
          HERO
      ═══════════════════════ */}
      <section className="relative overflow-hidden bg-primary-950 py-16 text-white md:py-20">
        <VideoHeroBackground
          src="/videos/hero/doctor-writing-appointment.mp4"
          poster="/videos/hero/doctor-writing-appointment.jpg"
          overlayClassName="from-primary-950/[0.92] via-primary-950/[0.78] to-primary-800/[0.5]"
        />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-amber-400/[0.10] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 rounded-full bg-rose-500/[0.10] blur-[90px] pointer-events-none" />

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/15 border border-amber-300/30 px-4 py-1.5 text-sm font-bold text-amber-200 mb-5">
              <Sparkles className="h-4 w-4" />
              Limited Memberships · Apply Today
            </div>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-5">
              Save Big on Every
              <br />
              <span className="bg-gradient-to-r from-amber-200 via-orange-200 to-rose-200 bg-clip-text text-transparent">
                Doctor Visit.
              </span>
            </h1>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Pick the membership tier that fits you — free registration, instant benefits on
              OPD consultations, lab tests, pharmacy and priority queue access.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-7">
              <a
                href="#select-card"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-rose-500 px-6 py-3 text-sm font-extrabold text-white shadow-[0_20px_42px_-22px_rgba(244,63,94,0.7)] transition-all hover:-translate-y-0.5"
              >
                <Tag className="w-4 h-4" /> Choose Your Card — Free
              </a>
              <a
                href="tel:+977014533361"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.22] bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-white/[0.18]"
              >
                <Phone className="w-4 h-4" /> Call to Enquire
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════
          QUICK STATS BAR
      ═══════════════════════ */}
      <div className="bg-white border-b border-neutral-100 shadow-sm">
        <div className="container-custom py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x divide-neutral-100">
            {[
              { icon: <Users className="w-5 h-5 text-primary-500" />, num: '2,400+', label: 'Active Cardholders' },
              { icon: <Star className="w-5 h-5 text-amber-400" />, num: 'Up to 50%', label: 'Maximum Discount' },
              {
                icon: <BadgeCheck className="w-5 h-5 text-emerald-500" />,
                num: cardsLoading ? '—' : String(cards.length),
                label: 'Membership Tiers',
              },
              { icon: <Clock className="w-5 h-5 text-primary-500" />, num: '1 Year', label: 'Card Validity' },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-3 md:px-8 first:pl-0 last:pr-0"
              >
                <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center flex-shrink-0 shadow-sm border border-neutral-100">
                  {s.icon}
                </div>
                <div>
                  <p className="font-black text-neutral-900 text-base leading-tight">{s.num}</p>
                  <p className="text-xs text-neutral-500">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          PHYSICAL MEMBER CARD FOCAL
      ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-white py-14 sm:py-18">
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-sky-100/70 blur-3xl" />
        <div className="container-custom relative grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="flex justify-center lg:justify-start">
            <div className="w-full max-w-md rounded-[2rem] bg-gradient-to-br from-primary-50 via-white to-sky-50 p-3 shadow-[0_30px_70px_-35px_rgba(1,173,165,0.55)] ring-1 ring-primary-100 sm:p-5">
              <HealthCard data={previewCardData} />
            </div>
          </div>
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary-800">
              <BadgeCheck className="h-3.5 w-3.5" /> Your member card preview
            </span>
            <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight text-neutral-950 sm:text-4xl">
              A real card for every visit.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
              The physical card preview shows the details you will carry after approval: member name,
              ID, membership type, active status, validity dates, and a verification mark. Choose a tier
              below to update the card preview.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ['Member identity', 'Your name and membership ID are printed after approval.'],
                ['Active status', 'Use the card at reception to claim approved benefits.'],
                ['One-year validity', 'Validity begins from your activation date.'],
                ['Verification mark', 'A membership mark supports quick reception checks.'],
              ].map(([title, copy]) => (
                <div key={title} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wide text-neutral-900">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-neutral-600">{copy}</p>
                </div>
              ))}
            </div>
            <a href="#select-card" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary-600/20 transition-colors hover:bg-primary-700">
              Choose your membership tier <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          AD-CARD SELECTOR
      ═══════════════════════════════════════════ */}
      <section
        id="select-card"
        className="section-padding relative scroll-mt-28 overflow-hidden bg-gradient-to-b from-amber-50/40 via-white to-neutral-50"
      >
        {/* Soft glow accents */}
        <div className="pointer-events-none absolute top-1/4 -left-32 w-72 h-72 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -right-32 w-80 h-80 rounded-full bg-rose-200/30 blur-3xl" />

        <div className="container-custom relative">
          <SectionHeader
            eyebrow="Step 1 — Choose Your Membership"
            title="Pick Your Health"
            highlight="Card"
            subtitle="Tap any card to see its exclusive benefits and apply. Doctor tier is the most popular."
          />

          {cardsLoading ? (
            <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 sm:gap-6">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-44 w-full rounded-2xl bg-neutral-200 animate-pulse sm:h-52"
                />
              ))}
            </div>
          ) : cards.length === 0 ? (
            <p className="text-center text-neutral-500 py-12 max-w-md mx-auto">
              Health card membership tiers are not published yet. Please call the clinic or try
              again later.
            </p>
          ) : (
            <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 sm:gap-6">
              {cards.map((card, i) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.09, duration: 0.45 }}
                  className="h-full"
                >
                  <AdCard
                    data={card}
                    isSelected={selectedId === card.id}
                    onSelect={() => toggle(card.id)}
                  />
                </motion.div>
              ))}
            </div>
          )}

          <AnimatePresence>
            {!selectedId && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-neutral-400 text-sm mt-8 flex items-center justify-center gap-1"
              >
                <Tag className="w-4 h-4" />
                Tap any card above to explore its benefits
              </motion.p>
            )}
          </AnimatePresence>

          {/* ═══════════════════════════════════════════
              SELECTED CARD BENEFITS PANEL
          ═══════════════════════════════════════════ */}
          <AnimatePresence mode="wait">
            {selectedCard && (
              <motion.div
                key={selectedCard.id}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.32, ease: 'easeOut' }}
                className="mt-10 max-w-4xl mx-auto"
              >
                <div className="rounded-3xl overflow-hidden border border-neutral-200 shadow-2xl shadow-neutral-900/10 bg-white">
                  <div
                    className={cn('px-7 py-5 flex items-center justify-between', selectedCard.gradient)}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shadow">
                        <Check className="w-5 h-5 text-white" strokeWidth={3} />
                      </div>
                      <div>
                        <p className="text-white font-extrabold text-lg leading-tight">
                          {selectedCard.title}
                        </p>
                        <p className="text-white/85 text-xs mt-0.5">
                          {selectedCard.tagline} · {selectedCard.mainDiscount}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedId(null)}
                      className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center text-white font-bold text-base transition-colors"
                      aria-label="Deselect card"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                      {BENEFIT_ICONS.map(({ key, icon: Icon, label }) => (
                        <div
                          key={label}
                          className="group relative overflow-hidden rounded-2xl bg-white border border-neutral-100 p-4 text-center transition-all duration-500 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_18px_40px_-16px_rgba(1,173,165,0.4)]"
                        >
                          <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary-500 via-teal-400 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 shadow-lg">
                            <Icon className="h-5 w-5" />
                          </span>
                          <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold">
                            {label}
                          </p>
                          <p className="text-xs font-extrabold text-neutral-800 mt-1.5 leading-snug">
                            {selectedCard[key]}
                          </p>
                        </div>
                      ))}
                    </div>

                    {selectedCard.notes && (
                      <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl p-3.5 mb-5">
                        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800 leading-relaxed">{selectedCard.notes}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      <Link
                        href="#apply"
                        className={cn(
                          'inline-flex items-center gap-2 font-bold px-7 py-3 rounded-xl text-white shadow-lg hover:opacity-90 transition-opacity',
                          selectedCard.gradient,
                        )}
                      >
                        Apply for {selectedCard.title}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setSelectedId(null)}
                        className="inline-flex items-center gap-2 border border-neutral-200 text-neutral-600 font-semibold px-5 py-3 rounded-xl hover:bg-neutral-50 hover:border-neutral-300 transition-colors text-sm"
                      >
                        Change Selection
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════════════════════
          HOW TO APPLY
      ═══════════════════════ */}
      <section className="section-padding bg-white border-t border-neutral-100">
        <div className="container-custom">
          <SectionHeader eyebrow="Simple 5-Step Process" title="How to Get Your" highlight="Card" />

          <div className="relative max-w-5xl mx-auto">
            <div className="hidden lg:block absolute top-7 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary-100 via-primary-300 to-primary-100" />

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {APPLY_STEPS.map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center relative"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 text-white font-black text-lg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-200/60 relative z-10">
                    {s.step}
                  </div>
                  <h3 className="font-bold text-neutral-900 text-sm mb-1.5">{s.title}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════
          APPLICATION FORM
      ═══════════════════════ */}
      <div id="apply" className="scroll-mt-20">
        <ApplicationForm />
      </div>

      {/* ═══════════════════════
          PARTNERS
      ═══════════════════════ */}
      <section className="section-padding bg-neutral-50 border-t border-neutral-100 overflow-hidden">
        <div className="container-custom">
          <SectionHeader
            eyebrow="Corporate Partners"
            title="Partner"
            highlight="Organizations"
            subtitle="Staff of these organizations are eligible for partner-rate health card benefits."
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Logos3 heading="" logos={PARTNER_LOGOS} />
        </motion.div>
      </section>

      {/* ═══════════════════════
          FAQ
      ═══════════════════════ */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl">
          <SectionHeader eyebrow="Common Questions" title="Frequently Asked" highlight="Questions" />

          <div className="space-y-3">
            {FAQS.map((item, i) => (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-3xl border border-neutral-200/70 bg-white overflow-hidden shadow-sm transition-all duration-300 hover:border-primary-200 hover:shadow-[0_18px_44px_-18px_rgba(1,173,165,0.35)]"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq((p) => (p === i ? null : i))}
                  className="w-full flex items-center justify-between text-left px-6 py-4 font-semibold text-neutral-800 hover:text-primary-700 transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={cn(
                      'w-5 h-5 flex-shrink-0 ml-3 transition-transform duration-200 text-neutral-400',
                      openFaq === i && 'rotate-180 text-primary-600',
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-neutral-600 text-sm leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-neutral-400 mt-6 text-center">
            Terms, renewal rules, and benefit coverage may be updated periodically by Nita
            Clinics.
          </p>
        </div>
      </section>

      {/* ═══════════════════════
          CTA FOOTER BAND
      ═══════════════════════ */}
      <CTAFooter
        title="Your health,"
        highlight="rewarded."
        subtitle="Apply for your Smart Health Card today — free registration, instant benefits on approval."
        actions={[
          {
            label: 'Choose Your Card — Free',
            href: '#select-card',
            icon: <Zap className="h-4 w-4" />,
          },
          { label: '+977 01-4533361', href: 'tel:+977014533361' },
        ]}
      />
    </>
  );
}
