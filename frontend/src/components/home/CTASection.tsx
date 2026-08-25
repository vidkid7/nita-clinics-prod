'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCalendar, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';
import { useHomePageContent } from '@/hooks/useHomePageContent';
import {
  DEFAULT_CONTACT,
  splitPrimaryAccentTitle,
  toTelHref,
  type HomeContactContent,
} from '@/lib/home-page-content';

export function CTASection() {
  const { data } = useHomePageContent();
  const contact: HomeContactContent = data?.contact ?? DEFAULT_CONTACT;
  const { first: titleFirst, second: titleAccent } = splitPrimaryAccentTitle(contact.title);
  const phoneHref = toTelHref(contact.whatsapp || contact.phone);

  const infoCards = [
    {
      id: 'call',
      ward: '01',
      label: 'Call us directly',
      tile: 'bg-primary-600',
      bar: 'via-primary-400/70',
      glow: 'rgba(1,173,165,0.35)',
      trace: 'rgba(1,173,165,0.5)',
      icon: FiPhone,
      value: (
        <a
          href={phoneHref}
          className="text-lg font-bold text-neutral-900 hover:text-primary-600 transition-colors"
        >
          {contact.phone}
        </a>
      ),
    },
    {
      id: 'visit',
      ward: '02',
      label: 'Visit our clinic',
      tile: 'bg-teal-600',
      bar: 'via-teal-400/70',
      glow: 'rgba(20,184,166,0.35)',
      trace: 'rgba(13,148,136,0.5)',
      icon: FiMapPin,
      value: <p className="font-semibold text-neutral-900">{contact.address}</p>,
    },
    {
      id: 'hours',
      ward: '03',
      label: 'Opening hours',
      tile: 'bg-amber-500',
      bar: 'via-amber-400/70',
      glow: 'rgba(245,158,11,0.35)',
      trace: 'rgba(245,158,11,0.5)',
      icon: FiClock,
      value: (
        <div className="text-sm font-medium text-neutral-800 flex flex-wrap gap-x-4">
          {contact.workingHours}
        </div>
      ),
    },
  ];

  return (
    <section className="section-padding bg-neutral-50 border-t border-neutral-100 overflow-hidden relative">
      {/* ambient glows + light texture */}
      <div className="absolute inset-0 plus-pattern opacity-15 pointer-events-none" />
      <div className="absolute top-24 -left-24 h-72 w-72 rounded-full bg-primary-100/60 blur-3xl pointer-events-none" />
      <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-teal-100/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-amber-100/40 blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="section-kicker">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                {contact.badgeLabel}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-vital-ping" />
                Patient Support
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-4">
              {titleAccent ? (
                <>
                  {titleFirst}{' '}
                  <span className="text-primary-600">{titleAccent}</span>
                </>
              ) : (
                titleFirst
              )}
            </h2>
            <p className="text-neutral-600 mb-7 leading-relaxed">{contact.subtitle}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/appointments/book"
                className="group inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white shadow-[0_12px_30px_-10px_rgba(1,173,165,0.7)] transition-all duration-300 hover:bg-primary-700 hover:shadow-[0_16px_34px_-10px_rgba(1,173,165,0.85)]"
              >
                <FiCalendar className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-6" />
                Book Appointment
              </Link>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-6 py-3 font-semibold text-neutral-700 shadow-sm transition-all duration-300 hover:border-primary-300 hover:text-primary-600 hover:shadow-[0_10px_24px_-12px_rgba(1,173,165,0.4)]"
              >
                Contact Clinic
                <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          {/* Info cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-3"
          >
            {infoCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-neutral-200/70 bg-white p-4 pr-14 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-neutral-200 hover:shadow-[0_18px_40px_-16px_var(--glow)]"
                  style={{ '--glow': card.glow } as React.CSSProperties}
                >
                  {/* top signal bar */}
                  <span className={`absolute inset-x-0 top-0 h-[3px] rounded-b-full bg-gradient-to-r from-transparent ${card.bar} to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                  {/* icon tile */}
                  <div className={`relative flex h-12 w-12 items-center justify-center rounded-2xl ${card.tile} flex-shrink-0 shadow-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-neutral-500">{card.label}</p>
                    {card.value}
                  </div>
                  {/* ward number */}
                  <span className="absolute top-3 right-4 text-[10px] font-bold tabular-nums tracking-widest text-neutral-300">
                    {card.ward}
                  </span>
                  {/* ECG trace */}
                  <svg className="absolute inset-x-4 bottom-0 h-2.5 w-[calc(100%-2rem)] opacity-25" viewBox="0 0 200 10" preserveAspectRatio="none" aria-hidden="true">
                    <path
                      d="M0 7 H60 L68 2 L76 9 L82 4 L88 7 H200"
                      fill="none"
                      stroke={card.trace}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="40 10"
                      className="animate-ecg-flow"
                    />
                  </svg>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
