'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Sparkles, Phone, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { BRAND } from '@/lib/brand';

const STORAGE_KEY = 'nita-popup-ad-dismissed-v1';
const SHOW_DELAY_MS = 2500; // show 2.5s after page load
const AUTO_DISMISS_DAYS = 1; // re-show after 1 day

/**
 * High-impact ad-style popup that fires on website load.
 * - Triggers once per user per day (localStorage)
 * - Slides up from bottom-right with strong visual hierarchy
 * - Mirrors ad card design: badge, headline, value prop, CTAs, urgency ribbon
 * - "×" dismiss saves the timestamp; "Remind me later" closes for the session only
 */
export function PopupAd() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const ts = Number(raw);
        if (Number.isFinite(ts) && Date.now() - ts < AUTO_DISMISS_DAYS * 24 * 60 * 60 * 1000) {
          return;
        }
      }
    } catch {
      // localStorage may be unavailable (private mode) — fall through and show
    }
    const t = window.setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  const persistDismiss = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
  };

  const handleDismiss = () => {
    persistDismiss();
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="popup-ad"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-end justify-end sm:items-end sm:justify-end p-3 sm:p-6 pointer-events-none"
        >
          {/* Backdrop (click to close) */}
          <motion.button
            type="button"
            onClick={handleDismiss}
            aria-label="Close advertisement"
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px] pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Ad card */}
          <motion.div
            role="dialog"
            aria-labelledby="popup-ad-title"
            initial={{ x: 60, y: 30, opacity: 0, scale: 0.96 }}
            animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            exit={{ x: 30, y: 20, opacity: 0, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className="relative pointer-events-auto w-full max-w-sm sm:max-w-md"
          >
            <div className="relative overflow-hidden rounded-3xl shadow-[0_30px_80px_-20px_rgba(2,132,199,0.45)] border-2 border-amber-300/40 bg-white">
              {/* Urgency ribbon — top */}
              <div className="relative bg-gradient-to-r from-amber-500 via-red-500 to-rose-500 px-4 py-2 flex items-center justify-between text-white">
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                  Limited Time Offer
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-90">
                  Ends in 7 days
                </span>
              </div>

              {/* Decorative glow */}
              <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary-300/30 blur-3xl" />

              {/* Close button */}
              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Close"
                className="absolute top-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-neutral-600 shadow-sm hover:bg-white hover:text-neutral-900 transition"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Body */}
              <div className="relative p-5 sm:p-6 bg-gradient-to-br from-amber-50/60 via-white to-rose-50/60">
                <div className="mb-4 inline-flex rounded-xl bg-white px-2.5 py-1.5 shadow-sm ring-1 ring-amber-100">
                  <Image src={BRAND.logo} alt="Nita Clinic" width={132} height={64} className="h-8 w-auto object-contain" />
                </div>
                {/* Badge */}
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-100 to-rose-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-800">
                  <span aria-hidden>🎉</span> Health Check-up Festival
                </div>

                {/* Headline */}
                <h2
                  id="popup-ad-title"
                  className="font-heading font-extrabold text-2xl sm:text-3xl leading-tight text-neutral-900"
                >
                  <span className="block text-amber-600">Health packages</span>
                  with clear tests and live offers
                </h2>

                {/* Sub */}
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                  Compare the current package catalogue by age and health goal. See every included
                  test, the live offer price, and book directly with the clinic.
                </p>

                {/* Mini benefits row */}
                <ul className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-semibold text-neutral-700">
                  <li className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    Modern Laboratory
                  </li>
                  <li className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    Same-day Reports
                  </li>
                  <li className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    Walk-in Welcome
                  </li>
                  <li className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    Free Consultation
                  </li>
                </ul>

                {/* CTAs */}
                <div className="mt-5 flex flex-col sm:flex-row gap-2">
                  <Link
                    href="/checkup/packages"
                    onClick={handleDismiss}
                    className="group flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-4 py-3 text-sm font-bold text-white shadow-[0_10px_26px_-10px_rgba(244,63,94,0.7)] transition-all hover:shadow-[0_14px_30px_-10px_rgba(244,63,94,0.85)] hover:-translate-y-0.5"
                  >
                    <Calendar className="h-4 w-4" />
                    View Health Packages
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <a
                    href="tel:+977014533361"
                    onClick={handleDismiss}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-emerald-500 bg-white px-4 py-3 text-sm font-bold text-emerald-700 transition-all hover:bg-emerald-50"
                  >
                    <Phone className="h-4 w-4" />
                    Call Now
                  </a>
                </div>

                {/* Footnote */}
                <p className="mt-3 text-[10px] text-center text-neutral-400">
                  Walk in or call · Bhimselgola-9 · No payment required online
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
