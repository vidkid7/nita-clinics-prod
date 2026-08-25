'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Calendar, Phone, ArrowRight, CheckCircle,
  Star, Users, Clock,
} from 'lucide-react';
import { useHomePageContent } from '@/hooks/useHomePageContent';
import { VideoHeroBackground } from '@/components/ui/VideoHeroBackground';
import {
  DEFAULT_HERO,
  DEFAULT_CONTACT,
  toTelHref,
  type HomeHeroContent,
} from '@/lib/home-page-content';

const HERO_STAT_DEFS = [
  { key: 'yearsExperience' as const, label: 'Patients Served', icon: Users },
  { key: 'expertDentists' as const, label: 'Patient Rating', icon: Star },
  { key: 'happyPatients' as const, label: 'Experience', icon: Clock },
];

const QUICK_LINKS = [
  { href: '/services', label: 'Our Services', icon: '🧪' },
  { href: '/checkup', label: 'Health Check-up', icon: '🩺' },
  { href: '/services/vaccination', label: 'Vaccination', icon: '💉' },
  { href: '/specialists', label: 'Our Doctors', icon: '👨‍⚕️' },
];

const TRUST_POINTS = [
  'Board-Certified Experts',
  'Walk-in & Online Booking',
  'Embassy & Seafarers Medical',
  'Modern Lab & Diagnostics',
];

export function HeroSection() {
  const { data } = useHomePageContent();
  const hero: HomeHeroContent = data?.hero ?? DEFAULT_HERO;
  const contact = data?.contact ?? DEFAULT_CONTACT;
  const dialHref = toTelHref(contact.whatsapp || contact.phone);

  return (
    <section className="relative overflow-hidden bg-primary-950 min-h-[calc(100svh-73px)] md:min-h-[calc(100svh-105px)] flex flex-col">
      <VideoHeroBackground
        src="/videos/hero/clinic-consultation.mp4"
        poster="/videos/hero/clinic-consultation.jpg"
        overlayClassName="from-black/60 via-black/35 to-black/10"
      />

      {/* ── Decorative blobs ── */}
      <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-white/[0.04] blur-[90px] pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-[380px] h-[380px] rounded-full bg-teal-300/[0.08] blur-[90px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-white/[0.04] blur-[80px] pointer-events-none" />

      {/* ── Subtle grid pattern ── */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* ── Clinical plus-dot texture ── */}
      <div className="absolute inset-0 plus-pattern opacity-70 pointer-events-none" />

      {/* ── Main content ── */}
      <div className="flex-1 container-custom flex flex-col items-center justify-center pt-5 pb-2 relative z-10">

        {/* ── TOP — Text content, full-width centered ── */}
        <div className="w-full max-w-3xl text-center">

          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="hero-kicker mb-4"
          >
            <span className="w-2 h-2 rounded-full bg-primary-300 shadow-[0_0_16px_rgba(94,234,212,0.8)]" />
            {hero.badgeText}
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.07 }}
            className="hero-title mb-3"
          >
            {hero.title}
            <br />
            <span className="bg-gradient-to-r from-white via-primary-100 to-teal-200 bg-clip-text text-transparent">
              {hero.highlightText}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, delay: 0.15 }}
            className="hero-copy mb-4"
          >
            {hero.subtitle}
          </motion.p>

          {/* Trust checkmarks */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.46, delay: 0.22 }}
            className="flex flex-wrap justify-center gap-x-6 gap-y-1.5 mb-5"
          >
            {TRUST_POINTS.map((t) => (
              <span key={t} className="flex items-center gap-2 text-sm text-white/[0.82]">
                <CheckCircle className="w-4 h-4 text-primary-200 flex-shrink-0" />
                {t}
              </span>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.46, delay: 0.28 }}
            className="flex flex-wrap justify-center gap-3 mb-0"
          >
            <Link
              href="/appointments/book"
              className="inline-flex items-center gap-2 bg-white text-primary-800 font-bold px-7 py-3 rounded-2xl shadow-[0_18px_44px_-24px_rgba(0,0,0,0.8)] transition-all hover:-translate-y-0.5 hover:bg-teal-50 text-sm"
            >
              <Calendar className="w-4 h-4" />
              {hero.primaryCtaText}
            </Link>
            <a
              href={dialHref}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/[0.18] backdrop-blur-xl text-white font-semibold px-7 py-3 rounded-2xl border border-white/[0.22] transition-all hover:-translate-y-0.5 text-sm"
            >
              <Phone className="w-4 h-4" />
              {hero.secondaryCtaText}
            </a>
          </motion.div>
        </div>

        {/* ── BOTTOM — Stats row, full-width horizontal ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.46, delay: 0.34 }}
          className="w-full mt-4 pt-2"
        >
          {/* Animated ECG heartbeat accent */}
          <svg
            className="ecg-line mb-3 w-full max-w-md mx-auto"
            height="26"
            viewBox="0 0 400 26"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M0,13 L120,13 L145,13 L158,4 L172,22 L186,4 L198,13 L280,13 L300,13 L312,8 L324,18 L336,10 L346,13 L400,13"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {HERO_STAT_DEFS.map(({ key, label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2.5 md:gap-3 rounded-2xl border border-white/[0.12] bg-white/[0.08] px-2.5 py-1.5 md:px-3 md:py-2 backdrop-blur-xl">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-white/[0.12] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary-100" />
                </div>
                <div>
                  <p className="font-black text-white text-[15px] md:text-[17px] leading-none">{hero.stats[key]}</p>
                  <p className="text-white/60 text-xs mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* ── Quick-action strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="bg-primary-950/[0.22] backdrop-blur-2xl border-t border-white/[0.12] z-20"
      >
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {QUICK_LINKS.map((q, i) => (
              <Link
                key={q.href}
                href={q.href}
                className={`flex items-center gap-3 px-3 py-2.5 md:px-4 md:py-3 hover:bg-white/10 transition-colors group ${
                  i < 3 ? 'border-r border-white/10' : ''
                }`}
              >
                <span className="text-xl">{q.icon}</span>
                <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">
                  {q.label}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white/70 group-hover:translate-x-1 transition-all ml-auto" />
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
