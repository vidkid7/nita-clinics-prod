'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import {
  MicroscopeDrawing,
  LotusDrawing,
  HeartEcgDrawing,
  HealthCardDrawing,
  PillDrawing,
} from './ServiceArtworks';
import { useSettings } from '@/hooks/useSettings';
import { useHomePageContent } from '@/hooks/useHomePageContent';
import {
  parseHomeServicesJson,
  type HomeServiceIconKey,
  type HomeServiceColorKey,
} from '@/lib/home-services-data';
import { DEFAULT_SERVICES_HEADER } from '@/lib/home-page-content';

const ART_MAP: Record<
  HomeServiceIconKey,
  React.ComponentType<{ className?: string; stroke: string; soft: string }>
> = {
  microscope: MicroscopeDrawing,
  female: LotusDrawing,
  heartbeat: HeartEcgDrawing,
  creditCard: HealthCardDrawing,
  pill: PillDrawing,
  xray: MicroscopeDrawing,
  syringe: PillDrawing,
};

type ArtStyle = {
  stroke: string;
  soft: string;
  ring: string;
  tagBg: string;
  grad: string;
  glow: string;
};

const ART: Record<HomeServiceColorKey, ArtStyle> = {
  primary: {
    stroke: '#0d9488',
    soft: '#ccfbf1',
    ring: 'rgba(13,148,136,0.35)',
    tagBg: 'rgba(13,148,136,0.14)',
    grad: 'from-primary-50 via-teal-50 to-primary-100/70',
    glow: 'rgba(1,173,165,0.35)',
  },
  rose: {
    stroke: '#e11d48',
    soft: '#ffe4e6',
    ring: 'rgba(225,29,72,0.3)',
    tagBg: 'rgba(225,29,72,0.14)',
    grad: 'from-rose-50 via-pink-50 to-rose-100/70',
    glow: 'rgba(225,29,72,0.3)',
  },
  emerald: {
    stroke: '#059669',
    soft: '#d1fae5',
    ring: 'rgba(5,150,105,0.3)',
    tagBg: 'rgba(5,150,105,0.14)',
    grad: 'from-emerald-50 via-teal-50 to-emerald-100/70',
    glow: 'rgba(5,150,105,0.3)',
  },
  sky: {
    stroke: '#0284c7',
    soft: '#e0f2fe',
    ring: 'rgba(2,132,199,0.3)',
    tagBg: 'rgba(2,132,199,0.14)',
    grad: 'from-sky-50 via-cyan-50 to-sky-100/70',
    glow: 'rgba(2,132,199,0.3)',
  },
  amber: {
    stroke: '#d97706',
    soft: '#fef3c7',
    ring: 'rgba(217,119,6,0.3)',
    tagBg: 'rgba(217,119,6,0.14)',
    grad: 'from-amber-50 via-orange-50 to-amber-100/70',
    glow: 'rgba(217,119,6,0.3)',
  },
  indigo: {
    stroke: '#4f46e5',
    soft: '#e0e7ff',
    ring: 'rgba(79,70,229,0.3)',
    tagBg: 'rgba(79,70,229,0.14)',
    grad: 'from-indigo-50 via-violet-50 to-indigo-100/70',
    glow: 'rgba(79,70,229,0.3)',
  },
};

export function ServicesSection() {
  const { settings } = useSettings();
  const { data } = useHomePageContent();
  const block = parseHomeServicesJson(settings?.home_services);
  const header = data?.servicesHeader ?? DEFAULT_SERVICES_HEADER;

  return (
    <section className="section-padding relative overflow-hidden bg-white">
      {/* ambient health glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 left-1/2 h-72 w-[44rem] -translate-x-1/2 rounded-full bg-primary-50 blur-3xl" />
        <div className="absolute bottom-0 right-[-6rem] h-72 w-96 rounded-full bg-rose-50/80 blur-3xl" />
        <div className="absolute left-[-6rem] top-1/3 h-72 w-96 rounded-full bg-sky-50/70 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 h-56 w-72 rounded-full bg-emerald-50/60 blur-3xl" />
      </div>
      <div className="relative container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-14"
        >
          <span className="section-kicker mb-3">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {header.badgeLabel || block.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-3">
            {header.title || block.heading}
          </h2>
          <p className="text-neutral-500 max-w-xl mx-auto">
            {header.subtitle || block.subheading}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {block.items.map((service, i) => {
            const Art = ART_MAP[service.iconKey] ?? MicroscopeDrawing;
            const art = ART[service.colorKey] ?? ART.primary;
            return (
              <motion.div
                key={`${service.title}-${i}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="h-full"
              >
                <Link href={service.href} className="group block h-full">
                  <article
                    className="relative h-full overflow-hidden rounded-3xl border border-white/80 bg-white/80 backdrop-blur-xl shadow-soft transition-all duration-500 group-hover:-translate-y-2 group-hover:border-primary-200 group-hover:shadow-[0_28px_60px_-18px_var(--glow)]"
                    style={{ '--glow': art.glow } as React.CSSProperties}
                  >
                    {/* illustration board */}
                    <div className={`relative overflow-hidden bg-gradient-to-br ${art.grad}`}>
                      <div className="absolute inset-0 plus-pattern opacity-30" />
                      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/50 blur-2xl" />
                      {/* pulsing sonar rings */}
                      <span
                        className="pulse-ring absolute left-1/2 top-1/2 h-24 w-24 rounded-full border-2"
                        style={{ borderColor: art.ring }}
                      />
                      <span
                        className="pulse-ring absolute left-1/2 top-1/2 h-24 w-24 rounded-full border-2 anim-delay-2"
                        style={{ borderColor: art.ring }}
                      />
                      {/* the hand-drawn illustration */}
                      <div className="relative mx-auto flex h-44 w-44 items-center justify-center animate-float">
                        <Art
                          className="h-40 w-40 drop-shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-2"
                          stroke={art.stroke}
                          soft={art.soft}
                        />
                      </div>
                      {/* animated ECG trace along the bottom */}
                      <svg
                        className="absolute inset-x-0 bottom-1 h-6 w-full"
                        viewBox="0 0 400 24"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M0 18 H112 L128 6 L148 22 L166 12 L182 18 H400"
                          fill="none"
                          stroke={art.stroke}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeDasharray="60 15"
                          opacity="0.45"
                          className="animate-ecg-flow"
                        />
                      </svg>
                    </div>

                    {/* body */}
                    <div className="relative px-6 py-6">
                      <div className="mb-3 flex items-center gap-2">
                        <span
                          className="inline-flex h-2 w-2 rounded-full"
                          style={{ background: art.stroke, boxShadow: `0 0 0 4px ${art.tagBg}` }}
                        />
                        <span
                          className="text-[10px] font-bold uppercase tracking-widest"
                          style={{ color: art.stroke }}
                        >
                          {service.tag}
                        </span>
                      </div>
                      <h3 className="font-heading font-semibold text-lg text-neutral-900 mb-2 transition-colors duration-300 group-hover:text-primary-700">
                        {service.title}
                      </h3>
                      <p className="text-sm text-neutral-600 leading-relaxed mb-4">{service.desc}</p>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 transition-all duration-300 group-hover:gap-3">
                        Learn more
                        <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </div>

                    {/* hover sheen sweep */}
                    <div className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />
                  </article>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
