import Link from 'next/link';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import {
  DoodleCross,
  DoodleHeart,
  DoodleSparkle,
  DoodleStar,
} from './TestimonialArtworks';
import { HealthCardVisual } from '@/components/health-card/HealthCardVisual';

const benefits = [
  'Free OPD for Registered Doctors',
  '50% Off Lab Tests',
  'Priority Queue Access',
  'Discounts on Packages',
];

export function HealthCardBanner() {
  return (
    <section className="py-16 bg-gradient-to-r from-primary-800 via-primary-700 to-primary-700 text-white overflow-hidden relative">
      {/* clinical plus-dot texture */}
      <div className="absolute inset-0 plus-pattern opacity-50 pointer-events-none" />

      {/* top ECG trace */}
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
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
      <div className="absolute -bottom-20 -left-10 w-80 h-80 rounded-full bg-white/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-teal-300/[0.06] blur-3xl pointer-events-none" />

      {/* floating doodles */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <DoodleHeart className="spark-float absolute left-[6%] top-[20%] h-6 w-6" stroke="rgba(153,246,228,0.3)" soft="rgba(153,246,228,0.1)" />
        <DoodleSparkle className="spark-float anim-delay-2 absolute right-[5%] top-[28%] h-5 w-5" stroke="rgba(94,234,212,0.4)" soft="rgba(94,234,212,0.12)" />
        <DoodleSparkle className="spark-float anim-delay-3 absolute left-[9%] bottom-[16%] h-6 w-6" stroke="rgba(153,246,228,0.4)" soft="rgba(153,246,228,0.12)" />
        <DoodleHeart className="heart-beat absolute right-[7%] bottom-[20%] h-6 w-6" stroke="rgba(94,234,212,0.35)" soft="rgba(94,234,212,0.1)" />
      </div>

      <div className="container-custom relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="w-full max-w-xl">
            {/* kicker + chip */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-teal-200 backdrop-blur-sm">
                <DoodleCross className="h-3.5 w-3.5" stroke="#5eead4" soft="rgba(94,234,212,0.2)" />
                Smart Health Card
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-amber-300">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-vital-ping" />
                Smart Benefits
              </span>
            </div>

            <h2 className="mb-4 font-heading text-3xl font-bold leading-tight md:text-4xl">
              Get Your <span className="text-teal-300">Nita</span> Health Card
            </h2>
            <p className="mb-6 max-w-lg text-base text-primary-200">
              Exclusive benefits for doctors, staff, and partner organization members. Apply online
              and enjoy healthcare privileges starting immediately.
            </p>

            {/* benefits */}
            <div className="mb-7 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {benefits.map((b) => (
                <span
                  key={b}
                  className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2.5 text-sm text-primary-100 backdrop-blur-sm transition-colors duration-300 hover:border-white/25 hover:bg-white/10"
                >
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-teal-400/20 ring-1 ring-teal-300/30">
                    <FiCheck className="h-3 w-3 text-teal-200" />
                  </span>
                  {b}
                </span>
              ))}
            </div>

            <Link
              href="/health-card"
              className="group inline-flex items-center gap-2.5 rounded-xl bg-white px-7 py-3.5 font-bold text-primary-700 shadow-[0_12px_30px_-10px_rgba(1,173,165,0.7)] transition-all duration-300 hover:bg-primary-50 hover:shadow-[0_16px_40px_-10px_rgba(1,173,165,0.9)]"
            >
              Apply for Health Card
              <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Smart card visual */}
          <div className="relative flex-shrink-0 pt-8 lg:pt-0">
            {/* floating doodles around card */}
            <DoodleHeart className="spark-float absolute -right-3 -top-5 z-10 h-6 w-6" stroke="rgba(153,246,228,0.5)" soft="rgba(153,246,228,0.15)" />
            <DoodleSparkle className="spark-float anim-delay-2 absolute -left-4 bottom-16 z-10 h-5 w-5" stroke="rgba(94,234,212,0.5)" soft="rgba(94,234,212,0.15)" />
            <DoodleStar className="heart-beat absolute -right-5 top-20 z-10 h-5 w-5" stroke="rgba(251,191,36,0.6)" soft="rgba(251,191,36,0.15)" />

            {/* card + pulse rings */}
            <div className="relative">
              <span className="pulse-ring absolute left-1/2 top-1/2 h-64 w-64 rounded-full border-2 border-teal-300/30" aria-hidden="true" />
              <span className="pulse-ring absolute left-1/2 top-1/2 h-64 w-64 rounded-full border-2 border-teal-300/20 anim-delay-2" aria-hidden="true" />

              <HealthCardVisual
                displayName="Member Name"
                cardNumber="NITA·HC·2026·0001"
                validUntil="12/26"
                className="w-80 sm:w-96"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
