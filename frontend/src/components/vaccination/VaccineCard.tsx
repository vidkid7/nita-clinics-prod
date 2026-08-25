'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Shield, ArrowRight, Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Vaccine } from '@/lib/vaccine-data';

const availabilityColor: Record<string, string> = {
  'Available in Clinic': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'On Request': 'bg-amber-50 text-amber-700 border-amber-200',
  'Seasonal': 'bg-primary-50 text-primary-700 border-primary-200',
};

const categoryColors: Record<string, string> = {
  Children: 'bg-primary-100 text-primary-700',
  Adults: 'bg-primary-100 text-primary-700',
  Travel: 'bg-amber-100 text-amber-700',
  Women: 'bg-rose-100 text-rose-700',
  Seniors: 'bg-primary-100 text-primary-700',
};

interface VaccineCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onAnimationStart'> {
  vaccine: Vaccine;
}

export const VaccineCard = React.forwardRef<HTMLDivElement, VaccineCardProps>(
  ({ vaccine, className, ...props }, ref) => {
    const detailHref = `/vaccination/${vaccine.slug}`;

    return (
      <motion.div
        ref={ref}
        className={cn(
          'group flex flex-col sm:flex-row overflow-hidden rounded-3xl border border-neutral-200/70 bg-white shadow-sm transition-all duration-500 hover:shadow-[0_24px_48px_-12px_var(--glow)] sm:h-52',
          className
        )}
        style={{ '--glow': 'rgba(1,173,165,0.3)' } as React.CSSProperties}
        whileHover={{ y: -6, boxShadow: '0 24px 48px -12px var(--glow, rgba(1,173,165,0.3))' }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        {...(props as any)}
      >
        {/* ── Image (2/5 width on desktop) ── */}
        <div className="sm:w-2/5 w-full h-48 sm:h-full overflow-hidden relative flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={vaccine.image}
            alt={vaccine.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950/70 via-primary-900/20 to-transparent sm:bg-gradient-to-t" />

          {/* Availability badge on image */}
          <div className="absolute top-3 left-3">
            <span className={cn('inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-sm', availabilityColor[vaccine.availability])}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {vaccine.availability}
            </span>
          </div>

          {/* ECG trace on image */}
          <svg
            className="absolute inset-x-0 bottom-0 h-8 w-full"
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

        {/* ── Content (3/5 width) ── */}
        <div className="flex flex-col justify-between p-5 sm:w-3/5 gap-2 overflow-hidden">
          <div>
            {/* Category pills */}
            <div className="flex flex-wrap gap-1 mb-1.5">
              {vaccine.category.map((cat) => (
                <span
                  key={cat}
                  className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', categoryColors[cat] ?? 'bg-neutral-100 text-neutral-600')}
                >
                  {cat}
                </span>
              ))}
            </div>

            {/* Name */}
            <h3 className="text-base font-bold text-neutral-900 leading-snug group-hover:text-primary-700 transition-colors line-clamp-1">
              {vaccine.name}
            </h3>

            {/* Tagline */}
            <p className="text-xs text-neutral-500 leading-relaxed line-clamp-1 mt-0.5">
              {vaccine.tagline}
            </p>
          </div>

          {/* Meta info — compact */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <Users className="w-3 h-3 text-primary-400 flex-shrink-0" />
              <span className="line-clamp-1 text-[11px]">{vaccine.whoItIsFor.split('.')[0]}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <Clock className="w-3 h-3 text-teal-400 flex-shrink-0" />
              <span className="text-[11px]">{vaccine.doses}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <Shield className="w-3 h-3 text-emerald-400 flex-shrink-0" />
              <span className="line-clamp-1 text-[11px]">{vaccine.protectsAgainst.slice(0, 2).join(', ')}</span>
            </div>
          </div>

          {/* ECG divider */}
          <div className="flex items-center gap-2 pt-0.5">
            <svg viewBox="0 0 100 12" className="h-3 w-24">
              <path d="M0 8 H30 L36 3 L42 9 L48 5 L54 8 H100" stroke="rgba(1,173,165,0.4)" strokeWidth="1.5" strokeDasharray="30 8" className="animate-ecg-flow" />
            </svg>
            <span className="h-px flex-1 bg-neutral-100" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-vital-ping" />
          </div>

          {/* CTA */}
          <div className="flex gap-2 pt-1">
            <Link
              href={detailHref}
              className="inline-flex items-center gap-1.5 bg-primary-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-700 transition-all shadow-[0_8px_20px_-8px_rgba(1,173,165,0.7)] group/btn"
            >
              View Details
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </Link>
            <Link
              href={`/appointments/book?vaccine=${encodeURIComponent(vaccine.name)}&type=vaccination`}
              className="inline-flex items-center gap-1 border border-neutral-200 text-neutral-600 text-xs font-semibold px-4 py-2.5 rounded-xl hover:border-primary-300 hover:text-primary-700 transition-colors"
            >
              Book Now
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }
);

VaccineCard.displayName = 'VaccineCard';
