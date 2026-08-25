'use client';

import { motion } from 'framer-motion';
import { BadgeCheck, ClipboardCheck, ShieldCheck, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PackageCard, type PackageAccent, type PackageCardProps } from '@/components/packages/PackageCard';

export type PackageSelectionPackage = PackageCardProps;

type PackageSelectionSectionProps = {
  packages: PackageSelectionPackage[];
  specialty: string;
  specialtyLabel: string;
  bookingHref: string;
  accent: PackageAccent;
  emptyMessage: string;
};

const VARIANTS: Record<PackageAccent, {
  section: string;
  eyebrow: string;
  heading: string;
  copy: string;
  icon: string;
  iconRing: string;
  stat: string;
  line: string;
}> = {
  emerald: {
    section: 'from-emerald-50/80 via-white to-teal-50/50',
    eyebrow: 'text-emerald-700',
    heading: 'text-emerald-950',
    copy: 'text-emerald-950/65',
    icon: 'bg-emerald-100 text-emerald-700',
    iconRing: 'ring-emerald-200/80',
    stat: 'text-emerald-800',
    line: 'from-emerald-400 via-teal-400 to-cyan-400',
  },
  teal: {
    section: 'from-primary-50/75 via-white to-cyan-50/55',
    eyebrow: 'text-primary-700',
    heading: 'text-primary-950',
    copy: 'text-primary-950/65',
    icon: 'bg-primary-100 text-primary-700',
    iconRing: 'ring-primary-200/80',
    stat: 'text-primary-800',
    line: 'from-primary-400 via-teal-400 to-cyan-400',
  },
  rose: {
    section: 'from-rose-50/75 via-white to-pink-50/55',
    eyebrow: 'text-rose-700',
    heading: 'text-rose-950',
    copy: 'text-rose-950/65',
    icon: 'bg-rose-100 text-rose-700',
    iconRing: 'ring-rose-200/80',
    stat: 'text-rose-800',
    line: 'from-rose-400 via-pink-400 to-orange-300',
  },
};

function normalizeTests(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((test): test is string => typeof test === 'string')
    : [];
}

export function normalizePackageRecord(
  raw: Record<string, unknown>,
  fallbackCategory: string,
): PackageSelectionPackage {
  const discountedPrice = Number(raw.discountedPrice ?? 0);

  return {
    id: raw.id == null ? undefined : String(raw.id),
    name: String(raw.name ?? ''),
    category: String(raw.category ?? fallbackCategory),
    targetGroup: raw.targetGroup == null ? undefined : String(raw.targetGroup),
    ageLabel: raw.ageLabel == null ? undefined : String(raw.ageLabel),
    originalPrice: Number(raw.originalPrice ?? discountedPrice),
    discountedPrice,
    currency: raw.currency == null ? undefined : String(raw.currency),
    description: raw.description == null ? undefined : String(raw.description),
    tests: normalizeTests(raw.tests),
    ctaLabel: raw.ctaLabel == null ? undefined : String(raw.ctaLabel),
    ctaLink: raw.ctaLink == null ? undefined : String(raw.ctaLink),
    freeDoctorConsultation: raw.freeDoctorConsultation !== false,
    featured: raw.featured === true || raw.isFeatured === true || raw.isPremium === true,
  };
}

export function PackageSelectionSection({
  packages,
  specialty,
  specialtyLabel,
  bookingHref,
  accent,
  emptyMessage,
}: PackageSelectionSectionProps) {
  const variant = VARIANTS[accent];

  return (
    <section
      className={cn('relative overflow-hidden border-y border-neutral-100 bg-gradient-to-br', variant.section)}
      aria-labelledby={`${specialty}-package-selection-heading`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden="true">
        <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-white/80 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-white/70 blur-3xl" />
        <div className={cn('absolute inset-x-0 top-0 h-px bg-gradient-to-r', variant.line)} />
      </div>

      <div className="container-custom relative py-16 pb-24 sm:py-20 sm:pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45 }}
              className="max-w-2xl"
            >
              <div className="mb-4 inline-flex items-center gap-2">
                <span className={cn('flex h-9 w-9 items-center justify-center rounded-xl ring-4', variant.icon, variant.iconRing)}>
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className={cn('text-xs font-bold uppercase tracking-[0.2em]', variant.eyebrow)}>
                  Pricing · {specialtyLabel}
                </span>
              </div>
              <h2 id={`${specialty}-package-selection-heading`} className={cn('font-heading text-3xl font-extrabold tracking-tight sm:text-4xl', variant.heading)}>
                Choose your package
              </h2>
              <p className={cn('mt-3 max-w-xl text-sm leading-relaxed sm:text-base', variant.copy)}>
                Compare the included tests, savings, and next step at a glance. Every option is structured for a clear, coordinated visit.
              </p>
            </motion.div>

            {packages.length > 0 && (
              <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/80 bg-white/75 px-4 py-3 shadow-[0_16px_35px_-26px_rgba(15,23,42,0.5)] backdrop-blur-sm">
                <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', variant.icon)}>
                  <BadgeCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className={cn('text-lg font-extrabold leading-none', variant.stat)}>{packages.length} options</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">for your visit</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 grid gap-2 rounded-2xl border border-white/80 bg-white/65 p-2 shadow-[0_16px_40px_-30px_rgba(15,23,42,0.45)] sm:grid-cols-3">
            {[
              { icon: ShieldCheck, label: 'Transparent pricing' },
              { icon: ClipboardCheck, label: 'Tests listed clearly' },
              { icon: BadgeCheck, label: 'Book in one visit' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-neutral-700 sm:justify-center">
                <Icon className={cn('h-4 w-4', variant.eyebrow)} aria-hidden="true" />
                <span>{label}</span>
              </div>
            ))}
          </div>

          {packages.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-neutral-300 bg-white/70 px-5 py-12 text-center text-sm text-neutral-500">
              {emptyMessage}
            </p>
          ) : (
            <div className="mt-8 grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
              {packages.map((pkg, index) => {
                const bookingLink = pkg.ctaLink || `${bookingHref}&package=${encodeURIComponent(pkg.name)}`;

                return (
                  <motion.div
                    key={pkg.id || `${pkg.name}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.12 }}
                    transition={{ duration: 0.4, delay: Math.min(index * 0.07, 0.2) }}
                    className="min-w-0"
                  >
                    <PackageCard
                      {...pkg}
                      category={pkg.category || specialty}
                      accent={accent}
                      ctaLabel={pkg.ctaLabel || 'Book package'}
                      ctaLink={bookingLink}
                      featured={pkg.featured}
                    />
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
