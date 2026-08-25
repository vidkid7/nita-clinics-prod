'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, FlaskConical, Home, Smartphone, Zap } from 'lucide-react';
import { get } from '@/lib/api';
import type { PaginatedResponse } from '@/lib/api';
import {
  getSavingsPercent,
  mapLabTestFromApi,
  testDetailPath,
  testImageOrPlaceholder,
  type DiagnosticTest,
} from '@/lib/diagnostic-data';
import { FALLBACK_LAB_TESTS } from '@/lib/diagnostic-data-fallback';

const TAG_COLORS = [
  'bg-rose-100 text-rose-700',
  'bg-primary-100 text-primary-700',
  'bg-amber-100 text-amber-700',
  'bg-emerald-100 text-emerald-700',
] as const;

function formatNpr(n: number): string {
  return `NPR ${n.toLocaleString('en-IN')}`;
}

export function DiagnosticsStrip() {
  const [tests, setTests] = useState<DiagnosticTest[]>([]);
  const [catalogTotal, setCatalogTotal] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Seed with static fallback so the strip always shows something.
    // Prefer popular, then any tests; cap at 4.
    const seed = FALLBACK_LAB_TESTS.filter((t) => t.isPopular).slice(0, 4);
    const seedRows = (seed.length >= 4 ? seed : FALLBACK_LAB_TESTS.slice(0, 4)).map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      longDescription: t.longDescription,
      price: t.price,
      originalPrice: t.originalPrice,
      image: t.image,
      turnaround: t.turnaround,
      sampleType: t.sampleType,
      isPopular: t.isPopular,
      tags: t.tags,
      includes: t.includes,
      category: t.category,
      categorySlug: t.categorySlug,
      categoryId: t.categoryId,
      slug: t.slug,
    }));
    setTests(seedRows.map((t) => mapLabTestFromApi(t)));
    setCatalogTotal(FALLBACK_LAB_TESTS.length);

    (async () => {
      try {
        const [countResult, popularResult] = await Promise.allSettled([
          get<PaginatedResponse<Record<string, unknown>>>(
            'lab-tests',
            { params: { page: 1, limit: 1, sortBy: 'order', sortOrder: 'asc' } },
          ),
          get<PaginatedResponse<Record<string, unknown>>>(
            'lab-tests',
            {
              params: {
                popular: 'true',
                limit: 4,
                page: 1,
                sortBy: 'order',
                sortOrder: 'asc',
              },
            },
          ),
        ]);

        if (!cancelled && countResult.status === 'fulfilled' && typeof countResult.value?.total === 'number') {
          setCatalogTotal(countResult.value.total);
        }

        let rows: Record<string, unknown>[] = [];
        if (popularResult.status === 'fulfilled') {
          rows = popularResult.value?.data ?? [];
        }
        if (rows.length === 0) {
          try {
            const fallback = await get<PaginatedResponse<Record<string, unknown>>>(
              'lab-tests',
              { params: { limit: 4, page: 1, sortBy: 'order', sortOrder: 'asc' } },
            );
            rows = fallback?.data ?? [];
          } catch {
            rows = [];
          }
        }
        if (!cancelled && rows.length > 0) {
          setTests(rows.map((t) => mapLabTestFromApi(t)));
        }
      } catch {
        /* keep fallback */
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="section-padding bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 relative overflow-hidden">
      <div className="absolute inset-0 plus-pattern opacity-40 pointer-events-none" />
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
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-20 w-64 h-64 rounded-full bg-primary-500/10 blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="section-kicker-light">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Our Services
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-vital-ping" />
                Live Lab
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">
              Lab Tests at Best Prices
            </h2>
            <p className="text-white/50 text-sm max-w-md">
              Fast, accurate results from our in-house path lab. Same-day reports for most tests.
            </p>
            <svg
              className="mt-3 h-5 w-52 text-primary-400/80"
              viewBox="0 0 220 20"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M0 12 H56 L66 6 L76 16 L86 8 L96 12 H220"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="50 10"
                className="animate-ecg-flow"
              />
            </svg>
          </div>
          <Link
            href="/services"
            className="group inline-flex flex-shrink-0 items-center gap-2 rounded-xl bg-primary-500 px-5 py-2.5 font-bold text-white transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(1,173,165,0.6)] hover:bg-primary-400 hover:shadow-[0_14px_36px_-12px_rgba(1,173,165,0.8)]"
          >
            View All Tests
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {!loaded
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-white/5 h-[220px] animate-pulse"
                />
              ))
            : tests.length === 0
              ? (
                  <div className="col-span-full flex flex-col items-center justify-center gap-2 py-10 text-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                      <FlaskConical className="h-5 w-5 text-primary-400/60" />
                    </span>
                    <p className="text-white/50 text-sm">
                      Lab tests will appear here once they are added in the admin catalog.
                    </p>
                  </div>
                )
              : tests.map((test, i) => {
                  const tag =
                    (test.tags && test.tags[0]) ||
                    (test.isPopular ? 'Popular' : test.category || 'Lab test');
                  const tagColor = TAG_COLORS[i % TAG_COLORS.length];
                  const savings = getSavingsPercent(test.price, test.originalPrice);
                  return (
                    <motion.div
                      key={test.id}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.09 }}
                      className="h-full"
                    >
                      <Link href={testDetailPath(test)} className="group block h-full">
                        <article className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-md transition-all duration-500 group-hover:-translate-y-1.5 group-hover:border-primary-400/40 group-hover:bg-white/10 group-hover:shadow-[0_24px_50px_-22px_rgba(1,173,165,0.55)]">
                          {/* monitor status bar */}
                          <div className="flex items-center justify-between gap-2 px-4 pt-3">
                            <span className="inline-flex min-w-0 items-center gap-1.5 truncate text-[10px] font-bold uppercase tracking-widest text-primary-300">
                              <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400 animate-vital-ping" />
                              {test.category || 'Services'}
                            </span>
                            <span className="flex-shrink-0 text-[10px] font-black tracking-wider text-white/30">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                          </div>

                          {/* scan image */}
                          <div className="relative mx-3 mt-3 h-32 overflow-hidden rounded-xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={testImageOrPlaceholder(test)}
                              alt={test.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-primary-950/20 to-transparent" />
                            <span className="svg-scan absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-transparent via-primary-300/20 to-transparent" />
                            <span
                              className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${tagColor}`}
                            >
                              {tag}
                            </span>
                            <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 text-[10px] font-semibold text-white/80 bg-black/40 rounded-full px-2 py-0.5">
                              <Clock className="w-3 h-3" />
                              {test.turnaround}
                            </span>
                          </div>

                          {/* body */}
                          <div className="p-4">
                            <h3 className="font-bold text-white text-sm leading-snug mb-3 line-clamp-2 min-h-[2.5rem] group-hover:text-primary-200 transition-colors">
                              {test.name}
                            </h3>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-white font-black text-base">{formatNpr(test.price)}</p>
                                {savings > 0 ? (
                                  <p className="text-white/40 text-xs line-through">
                                    {formatNpr(test.originalPrice)}
                                  </p>
                                ) : (
                                  <p className="text-white/30 text-xs">&nbsp;</p>
                                )}
                              </div>
                              <span className="text-xs font-bold text-primary-300 group-hover:text-primary-200 flex items-center gap-1 transition-colors">
                                Book <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                              </span>
                            </div>
                          </div>

                          {/* animated ECG trace */}
                          <svg
                            className="w-full h-5 px-2 pb-1 opacity-40"
                            viewBox="0 0 300 18"
                            preserveAspectRatio="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M0 9 H84 L100 3 L116 14 L132 7 L148 9 H300"
                              fill="none"
                              stroke="#5de1d8"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeDasharray="60 15"
                              className="animate-ecg-flow"
                            />
                          </svg>
                        </article>
                      </Link>
                    </motion.div>
                  );
                })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {[
            {
              icon: FlaskConical,
              text:
                catalogTotal != null && catalogTotal > 0
                  ? `${catalogTotal}+ Tests Available`
                  : 'Lab tests catalog',
              tint: 'text-primary-300 bg-primary-400/10',
            },
            { icon: Zap, text: 'Same-Day Reports', tint: 'text-amber-300 bg-amber-400/10' },
            { icon: Home, text: 'Home Collection', tint: 'text-rose-300 bg-rose-400/10' },
            { icon: Smartphone, text: 'Digital Reports', tint: 'text-sky-300 bg-sky-400/10' },
          ].map((b) => (
            <div
              key={b.text}
              className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-4 py-3 transition-all duration-300 hover:border-primary-400/30 hover:bg-white/10"
            >
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${b.tint}`}>
                <b.icon className="w-4 h-4" />
              </span>
              <p className="text-white/70 text-sm font-medium">{b.text}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
