'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import {
  DoodleCross,
  DoodleHeart,
  DoodleQuote,
  DoodleSparkle,
  DoodleStar,
  SketchyRing,
} from './TestimonialArtworks';
import { get } from '@/lib/api';
import { useEffect } from 'react';
import { EcgDivider } from '@/components/ui/EcgDivider';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  isActive: boolean;
  order: number;
}

const fallbackTestimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Sujan K.',
    role: 'Patient · Family Medicine',
    content:
      'The consultation was smooth and well-organised. Lab reports were delivered quickly and the doctors explained everything clearly. I highly recommend this clinic for any routine or specialist consultation.',
    rating: 5,
    isActive: true,
    order: 1,
  },
  {
    id: 't2',
    name: 'Mina R.',
    role: 'Health Package Client',
    content:
      'I booked a complete health check-up package and finished all tests in one visit. The staff were polite, the facility was clean, and the pricing was very transparent. Excellent service.',
    rating: 5,
    isActive: true,
    order: 2,
  },
  {
    id: 't3',
    name: 'Ritesh P.',
    role: 'Parent · Pediatrics',
    content:
      'Our child\'s vaccination follow-up was handled efficiently. The pediatric team was reassuring and very helpful. We feel confident in the care quality here.',
    rating: 5,
    isActive: true,
    order: 3,
  },
];

function DesktopClock() {
  const [time, setTime] = useState('--:--');
  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="text-[11px] font-semibold tabular-nums">{time}</span>;
}

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    get<Testimonial[]>('testimonials')
      .then((res) => {
        const active = (res || []).filter((t) => t.isActive);
        if (active.length) setTestimonials(active);
      })
      .catch(() => {/* keep fallback */});
  }, []);

  // gentle autoplay carousel
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const id = setInterval(() => setCurrentIndex((p) => (p + 1) % testimonials.length), 6500);
    return () => clearInterval(id);
  }, [testimonials.length]);

  const next = () => setCurrentIndex((p) => (p + 1) % testimonials.length);
  const prev = () => setCurrentIndex((p) => (p - 1 + testimonials.length) % testimonials.length);
  const t = testimonials[currentIndex];

  return (
    <section className="section-padding bg-gradient-to-br from-primary-900 to-primary-950 text-white overflow-hidden relative">
      {/* Clinical plus-dot texture */}
      <div className="absolute inset-0 plus-pattern opacity-60 pointer-events-none" />
      {/* animated monitor trace across the top */}
      <svg
        className="pointer-events-none absolute inset-x-0 top-0 h-8 w-full text-white/10"
        viewBox="0 0 1440 32"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 18 H380 L420 4 L460 26 L500 10 L540 18 H1440"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="160 40"
          className="animate-ecg-flow"
        />
      </svg>
      {/* ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full bg-teal-400/[0.07] blur-3xl pointer-events-none" />
      <div className="absolute -top-10 -right-10 h-72 w-72 rounded-full bg-primary-500/10 blur-3xl pointer-events-none" />
      {/* floating doodles */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <DoodleHeart className="spark-float absolute left-[7%] top-[20%] h-6 w-6" stroke="rgba(94,234,212,0.35)" soft="rgba(94,234,212,0.1)" />
        <DoodleHeart className="heart-beat absolute right-[8%] top-[28%] h-7 w-7" stroke="rgba(153,246,228,0.4)" soft="rgba(153,246,228,0.12)" />
        <DoodleSparkle className="spark-float anim-delay-2 absolute left-[13%] bottom-[24%] h-5 w-5" stroke="rgba(94,234,212,0.45)" soft="rgba(94,234,212,0.16)" />
        <DoodleSparkle className="spark-float anim-delay-3 absolute right-[12%] bottom-[16%] h-6 w-6" stroke="rgba(153,246,228,0.45)" soft="rgba(153,246,228,0.16)" />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12 px-1"
        >
          <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
            <span className="section-kicker-light">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Patient Stories
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-amber-300">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-vital-ping" />
              Trusted Care
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white mb-3">
            What Our Patients Say
          </h2>
          <EcgDivider tone="dark" className="mx-auto" />
        </motion.div>

        <div className="max-w-3xl mx-auto relative px-0 sm:px-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              className="relative"
            >
              {/* Desktop app window */}
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/[0.06] backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
                {/* window sheen */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.08] to-transparent" />

                {/* title bar */}
                <div className="relative flex items-center gap-3 border-b border-white/10 bg-white/[0.05] px-4 py-3 sm:px-6">
                  <div className="flex gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-400 shadow-[0_0_10px_-2px_rgba(251,113,133,0.8)]" />
                    <span className="h-3 w-3 rounded-full bg-amber-400 shadow-[0_0_10px_-2px_rgba(251,191,36,0.8)]" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_10px_-2px_rgba(52,211,153,0.8)]" />
                  </div>
                  <div className="mx-auto flex items-center gap-2 text-xs font-semibold tracking-wide text-white/75 sm:text-sm">
                    <DoodleCross className="h-3.5 w-3.5" stroke="#5eead4" soft="rgba(94,234,212,0.2)" />
                    <span>NITA · Patient Stories</span>
                  </div>
                  <div className="hidden w-[52px] items-center justify-end gap-2 text-[11px] font-bold text-white/40 sm:flex">
                    <span aria-hidden="true">─</span>
                    <span aria-hidden="true">□</span>
                    <span aria-hidden="true" className="text-white/50">✕</span>
                  </div>
                </div>

                {/* content */}
                <div className="relative px-6 py-7 sm:px-10 sm:py-9 md:px-12">
                  {/* header row: doodle quote + hand-drawn stars */}
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <DoodleQuote className="h-11 w-14" stroke="#5eead4" soft="rgba(94,234,212,0.3)" />
                    <div className="flex flex-shrink-0 gap-1 pt-1">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <DoodleStar key={i} className="h-5 w-5" stroke="#fbbf24" soft="rgba(251,191,36,0.25)" />
                      ))}
                    </div>
                  </div>

                  <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed mb-6 sm:mb-8 italic break-words">
                    &ldquo;{t.content}&rdquo;
                  </p>

                  {/* animated ECG divider */}
                  <svg className="mb-6 h-6 w-full opacity-50 sm:mb-8" viewBox="0 0 600 24" preserveAspectRatio="none" aria-hidden="true">
                    <path
                      d="M0 14 H180 L200 6 L220 20 L240 10 L260 14 H600"
                      fill="none"
                      stroke="rgba(94,234,212,0.7)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="80 20"
                      className="animate-ecg-flow"
                    />
                  </svg>

                  {/* author */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="relative flex-shrink-0">
                        <div className="relative z-10 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 font-bold text-white text-base sm:text-lg">
                          {t.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <SketchyRing className="absolute -inset-2 z-0" stroke="rgba(94,234,212,0.5)" soft="rgba(94,234,212,0.2)" />
                        <span className="absolute -right-0.5 -bottom-0.5 z-20 h-3 w-3 rounded-full border-2 border-primary-950 bg-emerald-400 animate-vital-ping" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate sm:whitespace-normal">{t.name}</p>
                        <p className="text-primary-300 text-xs sm:text-sm break-words">{t.role}</p>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-2 sm:ml-auto">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Verified</span>
                      <DoodleHeart className="heart-beat h-5 w-5" stroke="#fda4af" soft="rgba(253,164,175,0.25)" />
                    </div>
                  </div>
                </div>

                {/* taskbar */}
                <div className="relative flex items-center justify-between gap-3 border-t border-white/10 bg-white/[0.05] px-4 py-2.5 sm:px-6">
                  <div className="flex items-center gap-1.5 rounded-lg bg-primary-500/25 px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary-100">
                    <DoodleCross className="h-3.5 w-3.5" stroke="#5eead4" soft="rgba(94,234,212,0.25)" />
                    <span>Start</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10 ring-1 ring-white/10">
                      <DoodleHeart className="h-3.5 w-3.5" stroke="rgba(253,164,175,0.85)" soft="rgba(253,164,175,0.2)" />
                    </span>
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10 ring-1 ring-white/10">
                      <DoodleSparkle className="h-3.5 w-3.5" stroke="rgba(94,234,212,0.85)" soft="rgba(94,234,212,0.2)" />
                    </span>
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10 ring-1 ring-white/10">
                      <DoodleStar className="h-3.5 w-3.5" stroke="rgba(251,191,36,0.9)" soft="rgba(251,191,36,0.2)" />
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <span className="hidden h-1.5 w-1.5 rounded-full bg-emerald-400 animate-vital-ping sm:block" />
                    <DesktopClock />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-center gap-5 mt-8">
              <button
                onClick={prev}
                aria-label="Previous"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-all duration-300 hover:border-primary-300/50 hover:bg-white/20 hover:shadow-[0_0_24px_-8px_rgba(94,234,212,0.7)]"
              >
                <FiChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === currentIndex
                        ? 'w-7 bg-gradient-to-r from-primary-300 to-primary-100 shadow-[0_0_12px_-2px_rgba(94,234,212,0.8)]'
                        : 'w-2 bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                aria-label="Next"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-all duration-300 hover:border-primary-300/50 hover:bg-white/20 hover:shadow-[0_0_24px_-8px_rgba(94,234,212,0.7)]"
              >
                <FiChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
