'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  Award,
  Users,
  HeartPulse,
  Heart,
} from 'lucide-react';
import { useHomePageContent } from '@/hooks/useHomePageContent';
import {
  DEFAULT_ABOUT,
  splitHeadingTwoLines,
  type HomeAboutContent,
} from '@/lib/home-page-content';

const USP = [
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: 'Government Registered',
    desc: 'Government-registered clinic with a modern in-house path lab and up-to-date lab equipment.',
    color: 'bg-primary-50 text-primary-600',
    bar: 'from-primary-400 to-primary-600',
    dot: 'bg-primary-500',
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: 'Specialist Doctors',
    desc: 'Experienced consultants in Gynecology, Pediatrics, General Medicine, TB, and more.',
    color: 'bg-primary-50 text-primary-600',
    bar: 'from-primary-400 to-primary-600',
    dot: 'bg-primary-500',
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: 'Minimal Wait Times',
    desc: 'Online and walk-in appointments. Health cardholders enjoy priority queue access.',
    color: 'bg-amber-50 text-amber-600',
    bar: 'from-amber-400 to-amber-600',
    dot: 'bg-amber-500',
  },
  {
    icon: <Award className="w-5 h-5" />,
    title: 'Affordable Packages',
    desc: 'Comprehensive health check-up packages designed for men, women, and children at competitive prices.',
    color: 'bg-rose-50 text-rose-600',
    bar: 'from-rose-400 to-rose-600',
    dot: 'bg-rose-500',
  },
  {
    icon: <HeartPulse className="w-5 h-5" />,
    title: 'Preventive Focus',
    desc: 'We prioritize catching health problems early — through screenings, vaccination, and regular monitoring.',
    color: 'bg-primary-50 text-primary-600',
    bar: 'from-primary-400 to-primary-600',
    dot: 'bg-primary-500',
  },
];

/* Mini activity bars for the live-vitals readout card */
const MONITOR_BARS = [40, 62, 48, 78, 55, 88, 66, 100, 60, 82];

export function WhyNitaSection() {
  const { data } = useHomePageContent();
  const about: HomeAboutContent = data?.about ?? DEFAULT_ABOUT;
  const { first: headingFirst, second: headingSecond } = splitHeadingTwoLines(about.title);

  return (
    <section className="section-padding relative overflow-hidden bg-white">
      {/* ambient clinical glows + medical texture */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 plus-pattern opacity-20" />
        <div className="absolute -top-24 left-1/4 h-80 w-96 rounded-full bg-primary-50 blur-3xl" />
        <div className="absolute bottom-0 right-[-5rem] h-72 w-96 rounded-full bg-emerald-50/70 blur-3xl" />
        <div className="absolute top-1/3 left-[-5rem] h-72 w-80 rounded-full bg-rose-50/60 blur-3xl" />
      </div>

      <div className="relative container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: clinical monitor panel */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="relative w-full max-w-[480px]"
          >
            {/* main photo framed as a monitor screen */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] max-h-[600px] border border-white/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={about.imagePaths[0]}
                alt="NITA Clinic Kathmandu"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 plus-pattern opacity-25 mix-blend-soft-light" />
              {/* top ECG trace — live monitor readout */}
              <svg
                className="absolute inset-x-0 top-0 h-12 w-full"
                viewBox="0 0 600 48"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M0 34 H150 L170 14 L190 38 L210 20 L228 34 H600"
                  fill="none"
                  stroke="#5de1d8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="100 20"
                  className="animate-ecg-flow"
                  opacity="0.9"
                />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950/70 via-primary-950/10 to-primary-950/30" />

              {/* live indicator */}
              <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-primary-950/55 backdrop-blur-md border border-white/15 px-3 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/90">Live Center</span>
              </div>
            </div>

            {/* vitals monitor card — full width, just below the image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="w-full mt-4"
            >
              <div className="rounded-2xl bg-white/90 backdrop-blur-xl shadow-2xl p-5 border border-white/70 w-full">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-rose-500 fill-rose-100" />
                    </div>
                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-rose-500 animate-vital-ping" />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-primary-700 leading-none">{about.experienceYears}</p>
                    <p className="text-xs text-neutral-500 font-medium mt-1 leading-snug">Years Serving Kathmandu</p>
                  </div>
                </div>
                {/* live vitals sparkline */}
                <svg className="h-6 w-full" viewBox="0 0 180 24" preserveAspectRatio="none" aria-hidden="true">
                  <path
                    d="M0 17 H44 L56 7 L70 20 L84 10 L96 17 H180"
                    fill="none"
                    stroke="#01ada5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="25 5"
                    className="animate-ecg-flow"
                  />
                </svg>
                {/* activity bars */}
                <div className="mt-2 flex h-6 items-end gap-1">
                  {MONITOR_BARS.map((h, idx) => (
                    <span
                      key={idx}
                      className="flex-1 rounded-sm bg-gradient-to-t from-primary-600/70 to-primary-300/70"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: content */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <span className="section-kicker mb-5">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {about.badgeLabel}
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-4 leading-tight">
              {headingSecond ? (
                <>
                  {headingFirst}
                  <br />
                  <span className="text-primary-600">{headingSecond}</span>
                </>
              ) : (
                headingFirst
              )}
            </h2>
            <p
              className={`text-neutral-500 text-base leading-relaxed max-w-md ${
                about.paragraph2 ? 'mb-4' : 'mb-8'
              }`}
            >
              {about.paragraph1}
            </p>
            {about.paragraph2 ? (
              <p className="text-neutral-500 text-base leading-relaxed mb-8 max-w-md">{about.paragraph2}</p>
            ) : null}

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {USP.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.38 }}
                  className="group relative flex gap-3.5 p-4 rounded-2xl border border-neutral-100/80 bg-white/70 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:border-neutral-200 hover:shadow-[0_18px_44px_-18px_rgba(0,0,0,0.22)]"
                >
                  {/* top accent signal bar */}
                  <span
                    className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${item.bar} opacity-50 transition-opacity duration-300 group-hover:opacity-100`}
                  />
                  {/* ward number */}
                  <span className="absolute right-3.5 top-2.5 text-[11px] font-black tracking-wider text-neutral-200 transition-colors group-hover:text-neutral-300">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-neutral-900 text-sm mb-0.5 group-hover:text-primary-700 transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs text-neutral-500 leading-relaxed">{item.desc}</p>
                  </div>
                  {/* pulse dot */}
                  <span
                    className={`absolute bottom-3 right-3.5 h-1.5 w-1.5 rounded-full ${item.dot} opacity-40 transition-all duration-300 group-hover:opacity-100 group-hover:scale-[2.2]`}
                  />
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center">
              <Link
                href="/checkup"
                className="group inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-md shadow-primary-200"
              >
                <HeartPulse className="w-4 h-4" />
                Explore Health Packages
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
