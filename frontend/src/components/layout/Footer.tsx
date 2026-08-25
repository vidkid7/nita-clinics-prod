'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  FiArrowRight,
  FiFacebook,
  FiInstagram,
  FiYoutube,
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiExternalLink,
} from 'react-icons/fi';
import { Plus } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { DoodleHeart } from '@/components/home/TestimonialArtworks';
import { BRAND } from '@/lib/brand';

const links = {
  services: [
    { name: 'Our Services', href: '/services' },
    { name: 'Laboratory', href: '/services/laboratory' },
    { name: 'Vaccination', href: '/services/vaccination' },
    { name: 'Home Visit', href: '/services/home-visit' },
    { name: 'Online Consultation', href: '/services/online-consultation' },
    { name: 'Check-up Packages', href: '/checkup/packages' },
    { name: 'Health Card', href: '/health-card' },
  ],
  explore: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Team', href: '/team' },
    { name: 'Health Blog', href: '/blog' },
    { name: 'Book Appointment', href: '/appointments/book' },
    { name: 'Contact Us', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

const socials = [
  { name: 'Facebook', icon: FiFacebook, href: 'https://www.facebook.com/profile.php?id=61592513670112' },
  { name: 'Instagram', icon: FiInstagram, href: 'https://instagram.com/nitaclinics' },
  { name: 'YouTube', icon: FiYoutube, href: 'https://youtube.com/@nitaclinics' },
];

const NITA_GOOGLE_MAPS_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d883.137644394083!2d85.34516725321134!3d27.700282090639625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb190028f89cf5%3A0x228774d591623e19!2sNita%20Pharmacy%20Private%20Limited!5e0!3m2!1sen!2snp!4v1785872724223!5m2!1sen!2snp';

export function Footer() {
  const { settings } = useSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-primary-950 text-primary-100">
      {/* Subtle clinical plus texture across the footer */}
      <div className="pointer-events-none absolute inset-0 plus-pattern opacity-[0.07]" />

      {/* Newsletter / CTA band */}
      <div className="bg-primary-500 relative overflow-hidden">
        {/* top ECG trace (dark section pattern) */}
        <svg
          className="absolute inset-x-0 top-0 h-8 w-full text-white/10"
          viewBox="0 0 1440 32"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 24 H420 L450 6 L480 28 L510 10 L540 24 H1440"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="100 20"
            className="animate-ecg-flow"
          />
        </svg>

        {/* plus-pattern + ambient glows */}
        <div className="absolute inset-0 plus-pattern opacity-20 pointer-events-none" />
        <div className="absolute -left-16 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-teal-300/10 blur-3xl pointer-events-none" />
        <div className="absolute -right-16 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-primary-300/10 blur-3xl pointer-events-none" />

        <div className="container-custom py-9 relative flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-vital-ping" />
              Open for Care
            </span>
            <p className="font-heading font-bold text-white text-xl sm:text-2xl mt-1.5 flex items-center gap-2.5">
              Need expert medical guidance?
              <DoodleHeart
                className="hidden h-5 w-5 heart-beat sm:inline-block"
                stroke="#5eead4"
                soft="rgba(94,234,212,0.25)"
              />
            </p>
            <p className="text-white/80 text-sm mt-1">
              Our experts are available Monday to Saturday.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/appointments/book"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary-900 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_26px_-10px_rgba(0,42,40,0.8)] transition-all duration-300 hover:bg-primary-800 hover:shadow-[0_14px_30px_-10px_rgba(0,42,40,0.9)]"
            >
              Book Appointment
              <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href="tel:+977014533361"
              className="group inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/10"
            >
              <FiPhone className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-12" />
              Call Now
            </a>
          </div>
        </div>
      </div>

      {/* Main columns */}
      <div className="container-custom py-14 relative">
        {/* ── Row 1: Brand identity + Contact cluster ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Brand block */}
          <div className="lg:col-span-5">
            <Link
              href="/"
              className="group mb-5 inline-flex items-center transition-opacity duration-300 hover:opacity-90"
            >
              <span className="flex w-48 items-center justify-start rounded-xl bg-white/95 px-2 py-2 shadow-sm ring-1 ring-white/20 sm:w-56">
                <Image
                  src={BRAND.logo}
                  alt="Nita Clinic"
                  width={224}
                  height={170}
                  className="h-auto w-full object-contain transition-transform duration-300 group-hover:scale-[1.01]"
                />
              </span>
            </Link>

            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-teal-400/25 bg-teal-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-teal-200">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-vital-ping" />
              Trusted Care
            </div>

            <p className="text-primary-200 text-sm leading-relaxed mb-4 max-w-md">
              Nita Clinic is a trusted multi-specialty clinic in Kathmandu offering pathology
              labs, specialist consultations, vaccination, and preventive health care at affordable
              prices.
            </p>

            {/* Our Services CTA */}
            <Link
              href="/services"
              className="group mb-5 inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-teal-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-300/60 hover:bg-teal-400/20 hover:text-white hover:shadow-[0_10px_24px_-12px_rgba(1,173,165,0.7)]"
            >
              <FiArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              Explore Our Services
            </Link>

            {/* Social row */}
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary-300">
                Follow
              </span>
              <div className="flex items-center gap-2">
                {socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="group flex h-9 w-9 items-center justify-center rounded-full bg-primary-800/70 text-primary-300 ring-1 ring-primary-700/50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-500 hover:text-white hover:ring-teal-300/40 hover:shadow-[0_10px_24px_-12px_rgba(1,173,165,0.7)]"
                  >
                    <s.icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact cluster — 2 glass cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 01 — Reach Us */}
            <div className="relative rounded-2xl border border-primary-700/60 bg-gradient-to-br from-primary-800/60 to-primary-900/40 p-5 backdrop-blur-sm">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-white text-xs uppercase tracking-[0.18em]">
                  Reach Us
                </h3>
                <span className="text-[11px] font-black tracking-wider text-teal-300/70">01</span>
              </div>
              <div className="mb-3 h-px w-full bg-gradient-to-r from-teal-400/30 via-primary-600/30 to-transparent" />
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a
                    href={`tel:${(settings.phone || '+977014533361').replace(/[^0-9+]/g, '')}`}
                    className="group flex items-center gap-2.5 text-primary-200 transition-all duration-300 hover:translate-x-0.5 hover:text-white"
                  >
                    <FiPhone className="w-4 h-4 flex-shrink-0 text-primary-300 transition-colors group-hover:text-teal-300" />
                    <span>{settings.phone || '+977 01-4533361'}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${settings.email || 'info@nitaclinics.com'}`}
                    className="group flex items-center gap-2.5 text-primary-200 transition-all duration-300 hover:translate-x-0.5 hover:text-white"
                  >
                    <FiMail className="w-4 h-4 flex-shrink-0 text-primary-300 transition-colors group-hover:text-teal-300" />
                    <span>{settings.email || 'info@nitaclinics.com'}</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Card 02 — Visit & Hours */}
            <div className="relative rounded-2xl border border-primary-700/60 bg-gradient-to-br from-primary-800/60 to-primary-900/40 p-5 backdrop-blur-sm">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-white text-xs uppercase tracking-[0.18em]">
                  Visit & Hours
                </h3>
                <span className="text-[11px] font-black tracking-wider text-teal-300/70">02</span>
              </div>
              <div className="mb-3 h-px w-full bg-gradient-to-r from-teal-400/30 via-primary-600/30 to-transparent" />
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a
                    href="https://maps.google.com/?q=Nita+Pharmacy+Private+Limited+Bhimselgola"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-2.5 text-primary-200 transition-all duration-300 hover:translate-x-0.5 hover:text-white"
                  >
                    <FiMapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary-300 transition-colors group-hover:text-teal-300" />
                    <span>
                      Nita Pharmacy Pvt. Ltd., <strong className="text-teal-200">Bhimselgola-9</strong>
                      , Kathmandu
                    </span>
                  </a>
                </li>
                <li>
                  <div className="group flex items-start gap-2.5 text-primary-200">
                    <FiClock className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary-300 transition-colors group-hover:text-teal-300" />
                    <div>
                      <p className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-vital-ping" />
                        Mon – Fri: 7:00 AM – 7:00 PM
                      </p>
                      <p>Saturday: 8:00 AM – 4:00 PM</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── Map embed ── */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white text-sm uppercase tracking-[0.18em] flex items-center gap-2">
              <FiMapPin className="h-4 w-4 text-teal-300" />
              Find Us · Bhimselgola-9
            </h3>
            <a
              href="https://maps.google.com/?q=Nita+Pharmacy+Private+Limited+Bhimselgola"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-teal-200 hover:text-white"
            >
              Open in Google Maps <FiExternalLink className="h-3 w-3" />
            </a>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-teal-400/30 via-primary-600/30 to-transparent mb-3" />
          <div className="relative overflow-hidden rounded-2xl border border-primary-700/60 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.6)]">
            <iframe
              title="Nita Clinic location map"
              src={NITA_GOOGLE_MAPS_SRC}
              width="100%"
              height="280"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              className="block w-full"
            />
          </div>
        </div>

        {/* ── ECG divider between rows ── */}
        <div className="my-10 flex items-center gap-3" aria-hidden="true">
          <svg
            className="h-6 w-32 text-teal-400/60"
            viewBox="0 0 128 24"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0 16 H40 L48 4 L56 22 L64 8 L72 16 H128"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="60 16"
              className="animate-ecg-flow"
            />
          </svg>
          <Plus className="h-3.5 w-3.5 text-primary-600/60" strokeWidth={3} />
          <span className="h-px flex-1 bg-gradient-to-r from-primary-700/40 via-primary-800/40 to-transparent" />
          <Plus className="h-3.5 w-3.5 text-primary-600/60" strokeWidth={3} />
        </div>

        {/* ── Row 2: Navigation ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Services */}
          <div className="lg:col-span-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="flex items-center gap-2 font-semibold text-white text-sm uppercase tracking-[0.18em]">
                Services
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-vital-ping" />
              </h3>
              <span className="text-[11px] font-black tracking-wider text-teal-300/70">03</span>
            </div>
            <div className="mb-4 h-px w-12 bg-gradient-to-r from-teal-400/70 to-transparent" />
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {links.services.map((l) => (
                <li key={l.name}>
                  <Link
                    href={l.href}
                    className="group inline-flex items-center gap-2 text-sm text-primary-200 transition-all duration-300 hover:translate-x-0.5 hover:text-white"
                  >
                    <span className="h-[3px] w-0 rounded-full bg-teal-400 transition-all duration-300 group-hover:w-2" />
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="flex items-center gap-2 font-semibold text-white text-sm uppercase tracking-[0.18em]">
                Explore
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-vital-ping" />
              </h3>
              <span className="text-[11px] font-black tracking-wider text-teal-300/70">04</span>
            </div>
            <div className="mb-4 h-px w-12 bg-gradient-to-r from-teal-400/70 to-transparent" />
            <ul className="space-y-2.5">
              {links.explore.map((l) => (
                <li key={l.name}>
                  <Link
                    href={l.href}
                    className="group inline-flex items-center gap-2 text-sm text-primary-200 transition-all duration-300 hover:translate-x-0.5 hover:text-white"
                  >
                    <span className="h-[3px] w-0 rounded-full bg-teal-400 transition-all duration-300 group-hover:w-2" />
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick access + Health Card CTA */}
          <div className="lg:col-span-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="flex items-center gap-2 font-semibold text-white text-sm uppercase tracking-[0.18em]">
                Quick Access
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-vital-ping" />
              </h3>
              <span className="text-[11px] font-black tracking-wider text-teal-300/70">05</span>
            </div>
            <div className="mb-4 h-px w-12 bg-gradient-to-r from-teal-400/70 to-transparent" />

            {/* Health card CTA + lab report */}
            <div className="mb-4 flex flex-wrap items-center gap-2.5">
              <Link
                href="/health-card"
                className="group inline-flex items-center gap-1.5 rounded-full border border-teal-400/25 bg-gradient-to-r from-primary-600/30 to-teal-500/20 px-3.5 py-1.5 text-sm font-medium text-teal-100 shadow-[0_8px_20px_-14px_rgba(1,173,165,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-300/40 hover:text-white hover:shadow-[0_12px_24px_-14px_rgba(1,173,165,0.8)]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-teal-300 animate-vital-ping" />
                Get Health Card ✦
              </Link>
              <Link
                href="/lab-reports"
                className="group inline-flex items-center gap-1.5 rounded-full border border-primary-700/60 bg-primary-800/40 px-3.5 py-1.5 text-sm font-medium text-primary-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-400/40 hover:text-white"
              >
                Lab Reports
                <FiExternalLink className="w-3 h-3 text-primary-300 transition-colors group-hover:text-teal-300" />
              </Link>
            </div>

            {/* Get in touch strip */}
            <div className="rounded-xl border border-primary-700/50 bg-primary-900/30 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-300 mb-1.5">
                Book Your Visit
              </p>
              <p className="text-sm text-primary-200 leading-relaxed">
                Call us at{' '}
                <a
                  href="tel:+977014533361"
                  className="font-semibold text-teal-200 hover:text-white"
                >
                  +977-01-4533361
                </a>{' '}
                or walk in to our Bhimselgola-9 clinic — no online payment required.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/5">
        <div className="container-custom py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
          <div className="flex flex-wrap items-center gap-4 text-primary-300">
            <span>&copy; {year} Nita Clinic. All rights reserved.</span>
            {links.legal.map((l) => (
              <Link
                key={l.name}
                href={l.href}
                className="transition-colors hover:text-white hover:underline decoration-teal-400/50 underline-offset-4"
              >
                {l.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className="group flex h-9 w-9 items-center justify-center rounded-full bg-primary-800/70 text-primary-300 ring-1 ring-primary-700/50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-500 hover:text-white hover:ring-teal-300/40 hover:shadow-[0_10px_24px_-12px_rgba(1,173,165,0.7)]"
              >
                <s.icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom ECG trace — clinical signature */}
        <svg
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2.5 w-full text-white/10"
          viewBox="0 0 1440 14"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 9 H430 L460 3 L490 12 L518 5 L546 9 H1440"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="60 16"
            className="animate-ecg-flow"
          />
        </svg>
      </div>
    </footer>
  );
}
