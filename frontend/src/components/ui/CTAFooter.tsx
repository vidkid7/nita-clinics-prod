'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { FiPhone, FiArrowRight, FiClock, FiMapPin } from 'react-icons/fi';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CTAFooterAction {
  label: string;
  href: string;
  icon?: ReactNode;
  variant?: 'primary' | 'outline';
  external?: boolean;
}

interface CTAFooterProps {
  title: string;
  highlight?: string;
  subtitle?: string;
  actions?: CTAFooterAction[];
  phone?: string;
  tone?: 'primary' | 'dark';
  className?: string;
}

/**
 * Shared page-closing CTA band — deep teal gradient with plus-pattern,
 * blurred orbs, ECG heartbeat accent, ward-number badge and a two-column
 * clinical layout (heading + actions | vitals sub-card).
 */
export function CTAFooter({
  title,
  highlight,
  subtitle,
  actions,
  phone = '+977014533361',
  tone = 'primary',
  className,
}: CTAFooterProps) {
  const defaultActions: CTAFooterAction[] = actions?.length
    ? actions
    : [
        { label: 'Book Appointment', href: '/appointments/book', variant: 'primary', icon: <FiArrowRight className="h-4 w-4" /> },
        { label: 'Call Now', href: `tel:${phone}`, icon: <FiPhone className="h-4 w-4" />, variant: 'outline' },
      ];

  const displayPhone = (() => {
    if (!phone.startsWith('+')) return phone;
    const digits = phone.replace(/[^\d+]/g, '');
    // Kathmandu landline: +977 01-XXXXXXX (2-digit area + 7-digit local)
    const landline = digits.match(/^(\+\d{3})(\d{2})(\d{7})$/);
    if (landline) return `${landline[1]} ${landline[2]}-${landline[3]}`;
    // Mobile: +977 XXXX-XXXXXX (4 + 6 split)
    const mobile = digits.match(/^(\+\d{3})(\d{4})(\d{6})$/);
    if (mobile) return `${mobile[1]} ${mobile[2]}-${mobile[3]}`;
    // Fallback: just space after country code
    return digits.replace(/^(\+\d{3})(\d)/, '$1 $2');
  })();

  return (
    <section
      className={cn(
        'relative overflow-hidden py-16 md:py-20',
        tone === 'dark'
          ? 'bg-primary-950'
          : 'bg-gradient-to-br from-primary-800 via-primary-700 to-teal-800',
        className
      )}
    >
      {/* Medical motif layer */}
      <div className="plus-pattern absolute inset-0 opacity-60 pointer-events-none" />
      <div className="clinical-streak absolute inset-0 pointer-events-none" />
      <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-white/[0.06] blur-3xl pointer-events-none" />
      <div className="absolute -bottom-28 -right-16 h-96 w-96 rounded-full bg-teal-300/[0.12] blur-3xl pointer-events-none" />

      {/* ECG heartbeat line */}
      <svg
        className="absolute left-0 top-1/2 w-full -translate-y-1/2 opacity-[0.14] pointer-events-none"
        height="80"
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className="ecg-line-loop"
          d="M0,40 L180,40 L210,40 L225,16 L240,64 L255,12 L268,40 L520,40 L545,40 L558,22 L572,58 L588,34 L600,40 L820,40 L845,40 L858,18 L872,62 L888,30 L900,40 L1200,40"
          fill="none"
          stroke="white"
          strokeWidth="2"
        />
      </svg>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-dark mx-auto max-w-5xl rounded-3xl p-6 sm:p-8 md:p-10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            {/* ── Left: heading + subtitle + actions ── */}
            <div className="lg:col-span-7 text-center lg:text-left">
              {/* Kicker + ward badge */}
              <div className="mb-4 flex items-center justify-center lg:justify-start gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-300/30 bg-teal-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-teal-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-300 animate-vital-ping" />
                  Next Steps
                </span>
                <span className="text-[11px] font-black tracking-wider text-teal-300/70">06</span>
              </div>

              <h2 className="text-3xl font-heading font-bold text-white text-balance md:text-4xl lg:text-[2.6rem] lg:leading-tight">
                {title}
                {highlight && (
                  <>
                    {' '}
                    <span className="bg-gradient-to-r from-primary-100 to-teal-200 bg-clip-text text-transparent">
                      {highlight}
                    </span>
                  </>
                )}
              </h2>

              {subtitle && (
                <p className="mt-4 max-w-2xl mx-auto lg:mx-0 text-primary-100/90 leading-relaxed">
                  {subtitle}
                </p>
              )}

              {/* Action buttons */}
              <div className="mt-7 flex flex-wrap justify-center lg:justify-start gap-3">
                {defaultActions.map((action) => {
                  const isOutline = action.variant === 'outline';
                  return (
                    <Link
                      key={`${action.href}-${action.label}`}
                      href={action.href}
                      {...(action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className={cn(
                        'group inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold transition-all hover:-translate-y-0.5',
                        isOutline
                          ? 'border border-white/[0.28] bg-white/10 text-white backdrop-blur-xl hover:bg-white/[0.18] hover:border-white/45'
                          : 'bg-white text-primary-800 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.7)] hover:bg-teal-50'
                      )}
                    >
                      {action.icon}
                      {action.label}
                      {!action.icon && <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* ── Right: clinical info sub-card ── */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border border-white/[0.12] bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-5 sm:p-6 backdrop-blur-md">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white text-xs uppercase tracking-[0.18em]">
                    Visit Us
                  </h3>
                  <span className="text-[11px] font-black tracking-wider text-teal-300/70">06.A</span>
                </div>
                <div className="mb-4 h-px w-full bg-gradient-to-r from-teal-300/40 via-white/15 to-transparent" />

                <ul className="space-y-3.5 text-sm">
                  {/* Same-day availability */}
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-teal-400/15 text-teal-200 ring-1 ring-teal-300/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-300 animate-vital-ping" />
                    </span>
                    <div>
                      <p className="font-semibold text-white">Same-day slots available</p>
                      <p className="text-primary-200/70 text-xs">For most specialities on weekdays.</p>
                    </div>
                  </li>

                  {/* Hours */}
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-primary-100 ring-1 ring-white/15">
                      <FiClock className="h-3 w-3" />
                    </span>
                    <div>
                      <p className="font-semibold text-white">Mon – Fri · 7:00 AM – 7:00 PM</p>
                      <p className="text-primary-200/70 text-xs">Saturday · 8:00 AM – 4:00 PM</p>
                    </div>
                  </li>

                  {/* Phone */}
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-primary-100 ring-1 ring-white/15">
                      <FiPhone className="h-3 w-3" />
                    </span>
                    <div>
                      <p className="font-semibold text-white">Reception</p>
                      <a
                        href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                        className="text-primary-200/80 hover:text-teal-200 transition-colors text-xs"
                      >
                        {displayPhone}
                      </a>
                    </div>
                  </li>
                </ul>

                {/* Mini ECG footer */}
                <div className="mt-5 flex items-center gap-2" aria-hidden="true">
                  <svg className="h-4 w-16 text-teal-300/60" viewBox="0 0 64 16" fill="none" preserveAspectRatio="none">
                    <path
                      d="M0 8 H18 L22 2 L26 14 L30 5 L34 8 H64"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="40 12"
                      className="animate-ecg-flow"
                    />
                  </svg>
                  <Plus className="h-3 w-3 text-white/30" strokeWidth={3} />
                  <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
