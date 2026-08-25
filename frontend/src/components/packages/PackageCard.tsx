'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiCheckCircle, FiTag } from 'react-icons/fi';
import {
  Activity,
  ArrowRight,
  Baby,
  BadgeCheck,
  Calendar,
  FlaskConical,
  HeartPulse,
  Sparkles,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react';
import { addToCart } from '@/lib/cart';
import { IconTileList } from '@/components/ui/IconTileList';
import { cn } from '@/lib/utils';

export type PackageAccent = 'teal' | 'rose' | 'emerald';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  general_below_40: BadgeCheck,
  premium_below_40: Sparkles,
  female_general: HeartPulse,
  female_premium: HeartPulse,
  male_general: HeartPulse,
  male_premium: HeartPulse,
  tuberculosis: FlaskConical,
  pediatrics: Baby,
  gynecology: Stethoscope,
  orthopedics: Activity,
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  general_below_40: 'from-primary-600 to-blue-800',
  premium_below_40: 'from-indigo-700 to-violet-800',
  female_general: 'from-rose-600 to-pink-700',
  female_premium: 'from-rose-700 to-primary-800',
  male_general: 'from-primary-600 to-primary-700',
  male_premium: 'from-primary-700 to-primary-900',
  tuberculosis: 'from-emerald-600 to-teal-700',
  pediatrics: 'from-primary-500 to-primary-600',
  gynecology: 'from-pink-600 to-rose-700',
  orthopedics: 'from-indigo-600 to-blue-700',
  default: 'from-primary-600 to-primary-800',
};

const CTA_STYLES: Record<PackageAccent, { primary: string; secondary: string }> = {
  emerald: {
    primary: 'bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500',
    secondary: 'border-emerald-200 text-emerald-700 hover:bg-emerald-50 focus-visible:ring-emerald-500',
  },
  teal: {
    primary: 'bg-primary-600 hover:bg-primary-700 focus-visible:ring-primary-500',
    secondary: 'border-primary-200 text-primary-700 hover:bg-primary-50 focus-visible:ring-primary-500',
  },
  rose: {
    primary: 'bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-500',
    secondary: 'border-rose-200 text-rose-700 hover:bg-rose-50 focus-visible:ring-rose-500',
  },
};

export interface PackageCardProps {
  id?: string;
  name: string;
  category?: string;
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
  accent?: PackageAccent;
  featured?: boolean;
}

export function PackageCard({
  id,
  name,
  category,
  targetGroup,
  ageLabel,
  originalPrice,
  discountedPrice,
  currency = 'NPR',
  description,
  tests = [],
  ctaLabel = 'Book Check-up',
  ctaLink,
  freeDoctorConsultation = true,
  accent,
  featured = false,
}: PackageCardProps) {
  const [added, setAdded] = useState(false);

  const discountPct =
    originalPrice > 0
      ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
      : 0;
  const isPremium = category?.includes('premium');
  const isFeatured = featured || isPremium;
  const savings = originalPrice - discountedPrice;

  const catKey = category || 'default';
  const CategoryIcon = CATEGORY_ICONS[catKey] ?? Stethoscope;
  const gradient = CATEGORY_GRADIENTS[catKey] ?? CATEGORY_GRADIENTS.default;
  const listAccent: PackageAccent = accent ?? (catKey === 'gynecology' ? 'rose' : catKey === 'tuberculosis' ? 'emerald' : 'teal');
  const ctaStyles = CTA_STYLES[listAccent];

  const bookingLink =
    ctaLink ||
    `/appointments/book?package=${encodeURIComponent(name)}&amount=${discountedPrice}&type=package`;

  const handleAddToCart = () => {
    addToCart({
      id: id || name.toLowerCase().replace(/\s+/g, '-'),
      name,
      category,
      amount: discountedPrice,
    });
    window.dispatchEvent(new Event('cart-updated'));
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <motion.article
      whileHover={{ y: -5, boxShadow: '0 20px 40px -10px rgba(2,132,199,0.15)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="relative flex flex-col h-full overflow-hidden rounded-[1.75rem] border border-neutral-200/80 bg-white shadow-[0_22px_55px_-32px_rgba(15,23,42,0.45)]"
    >
      {/* ── Data-first card header: no poster image, just hierarchy ── */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} px-4 py-4 text-white sm:px-5 sm:py-5`}>
        <div
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '14px 14px' }}
          aria-hidden="true"
        />
        <div className="relative flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm">
              <CategoryIcon className="h-6 w-6" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
                {targetGroup || ageLabel || 'Preventive care'}
              </p>
              <h3 className="mt-1 font-heading text-lg font-extrabold leading-tight sm:text-xl">
                {name}
              </h3>
            </div>
          </div>
          {discountPct > 0 && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ring-1 ring-white/20">
              <FiTag className="h-3 w-3" /> {discountPct}% off
            </span>
          )}
        </div>
        <div className="relative mt-4 flex items-end justify-between gap-3 sm:mt-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/65">Included panel</p>
            <p className="mt-1 text-sm font-semibold text-white/95">{tests.length} tests · one coordinated visit</p>
          </div>
          {isFeatured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-300 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-amber-950 shadow-sm">
              <Sparkles className="h-3 w-3" /> {featured ? 'Recommended' : 'Premium'}
            </span>
          )}
        </div>
      </div>

      {/* ── Free Doctor Consultation highlight (BELOW image, no overlap) ── */}
      {freeDoctorConsultation && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[11px] sm:text-xs font-bold uppercase tracking-wide px-4 py-2 flex items-center justify-center gap-1.5 flex-shrink-0">
          <span aria-hidden>👨‍⚕️</span> Free Doctor Consultation Included
        </div>
      )}

      {/* ── Title + meta block (clean, on white) ── */}
      <div className="flex-shrink-0 px-4 pb-2 pt-3 sm:px-5 sm:pt-4">
        {targetGroup && ageLabel && (
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-1">
            {[targetGroup, ageLabel].filter(Boolean).join(' · ')}
          </p>
        )}
        <p className="text-xs leading-relaxed text-neutral-500">Transparent pricing, visible tests, and a direct booking path.</p>
      </div>

      {/* ── Pricing strip ── */}
      <div
        className={`px-5 py-3 bg-gradient-to-r ${gradient} flex items-center justify-between flex-shrink-0`}
      >
        <div>
          <p className="text-xs text-white/70 line-through leading-tight">
            {currency} {originalPrice.toLocaleString()}
          </p>
          <p className="text-xl font-extrabold text-white leading-tight">
            {currency} {discountedPrice.toLocaleString()}
          </p>
        </div>
        {savings > 0 && (
          <div className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
            Save {currency} {savings.toLocaleString()}
          </div>
        )}
      </div>

      {/* ── Description ── */}
      {description ? (
        <div className="px-5 pt-4 pb-1 flex-shrink-0">
          <p className="text-xs leading-relaxed text-neutral-500 line-clamp-2">{description}</p>
        </div>
      ) : null}

      {/* ── Trust strip ── */}
      <div className="px-5 pt-3 flex flex-wrap items-center gap-3 text-[10px] font-semibold uppercase tracking-wide text-neutral-500 flex-shrink-0">
        <span className="inline-flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Same-day Reports
        </span>
        <span className="h-3 w-px bg-neutral-200" />
        <span className="inline-flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-500" /> Coordinated care
        </span>
      </div>

      {/* ── Tests list ── */}
      <div className="flex-1 px-4 py-3 sm:px-5 sm:py-4">
        <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-2.5">
          Tests Included ({tests.length})
        </p>
        {tests.length > 0 ? (
          <IconTileList
            items={tests}
            category={category}
            accent={listAccent}
            layout="compact"
            className="gap-2"
            itemClassName="rounded-xl bg-neutral-50/70 p-2"
          />
        ) : (
          <p className="text-xs text-neutral-400">Tests included will be updated shortly.</p>
        )}
      </div>

      {/* ── CTA block ── */}
      <div className="flex-shrink-0 space-y-2 border-t border-neutral-50 px-5 pb-[5.5rem] pt-4 sm:pb-5">
        <Link
          href={bookingLink}
          className={cn('inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2', ctaStyles.primary)}
        >
          <Calendar className="h-4 w-4" aria-hidden="true" />
          {ctaLabel}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
        <div className="grid grid-cols-1 gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className={cn('inline-flex items-center justify-center gap-1.5 rounded-xl border bg-white py-2.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              added
                ? 'border-emerald-600 bg-emerald-600 text-white focus-visible:ring-emerald-500'
                : ctaStyles.secondary,
            )}
          >
            {added ? (
              <>
                <FiCheckCircle className="w-3.5 h-3.5" /> Added
              </>
            ) : (
              <>
                <FiShoppingCart className="w-3.5 h-3.5" /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
