'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Droplets, FlaskConical, ArrowLeft, Calendar, ArrowRight, Star } from 'lucide-react';
import { FiCalendar, FiCreditCard, FiShoppingCart } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import {
  getSavingsPercent,
  mapLabTestFromApi,
  resolveLabTestImage,
  testDetailPath,
  type DiagnosticTest,
} from '@/lib/diagnostic-data';
import { get } from '@/lib/api';
import { addToCart } from '@/lib/cart';
import { VideoHeroBackground } from '@/components/ui/VideoHeroBackground';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CTAFooter } from '@/components/ui/CTAFooter';
import { IconTileList } from '@/components/ui/IconTileList';
import { FALLBACK_LAB_TESTS } from '@/lib/diagnostic-data-fallback';

function getSampleIcon(sampleType: string) {
  if (sampleType.toLowerCase().includes('blood')) return <Droplets className="w-4 h-4" />;
  return <FlaskConical className="w-4 h-4" />;
}

export default function TestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [test, setTest] = useState<DiagnosticTest | null>(null);
  const [relatedTests, setRelatedTests] = useState<DiagnosticTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchTest() {
      setIsLoading(true);
      // Helper: pull from the static fallback by slug or id
      const fromFallback = (): DiagnosticTest | null => {
        const needle = String(id || '').toLowerCase();
        return (
          FALLBACK_LAB_TESTS.find(
            (t) => (t.slug && t.slug.toLowerCase() === needle) || t.id === id,
          ) || null
        );
      };

      try {
        let data: Record<string, unknown> | null = null;
        try {
          data = await get<Record<string, unknown>>(`lab-tests/slug/${id}`);
        } catch {
          try {
            data = await get<Record<string, unknown>>(`lab-tests/${id}`);
          } catch {
            /* backend down — will use fallback below */
          }
        }
        if (!cancelled && data) {
          const mapped = mapLabTestFromApi(data);
          setTest(mapped);
          const catId = mapped.categoryId;
          if (catId) {
            try {
              const rel = await get<{ data?: Record<string, unknown>[] }>(
                `lab-tests?categoryId=${encodeURIComponent(catId)}&limit=12`,
              );
              const rows = rel?.data ?? [];
              if (!cancelled) {
                setRelatedTests(
                  rows
                    .map((r) => mapLabTestFromApi(r))
                    .filter((t) => t.id !== mapped.id)
                    .slice(0, 4),
                );
              }
            } catch {
              if (!cancelled) {
                // Use the static fallback as a source for related tests
                setRelatedTests(
                  FALLBACK_LAB_TESTS.filter(
                    (t) => t.categorySlug === mapped.categorySlug && t.id !== mapped.id,
                  ).slice(0, 4),
                );
              }
            }
          } else {
            setRelatedTests([]);
          }
        } else if (!cancelled) {
          // Backend unreachable — try the static fallback
          const fallback = fromFallback();
          if (fallback) {
            setTest(fallback);
            setRelatedTests(
              FALLBACK_LAB_TESTS.filter(
                (t) => t.categorySlug === fallback.categorySlug && t.id !== fallback.id,
              ).slice(0, 4),
            );
          } else {
            setTest(null);
          }
        }
      } catch {
        if (!cancelled) {
          const fallback = fromFallback();
          setTest(fallback);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    fetchTest();
    return () => { cancelled = true; };
  }, [id]);

  if (isLoading) {
    return (
      <main className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </main>
    );
  }

  if (!test) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-white">
        <div className="container-custom text-center py-20">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-50 text-primary-600">
            <FlaskConical className="h-8 w-8" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-neutral-900 mb-3">Lab test not found</h1>
          <p className="text-neutral-500 max-w-md mx-auto mb-8">
            We couldn’t find that lab test. It may no longer be offered or the link may be incorrect.
          </p>
          <Link
            href="/diagnostic-test"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Browse all tests
          </Link>
        </div>
      </main>
    );
  }

  const savings = getSavingsPercent(test.price, test.originalPrice);
  const bookHref = `/appointments/book?test=${encodeURIComponent(test.name)}&amount=${test.price}`;
  const checkoutHref = `/payment/checkout?productName=${encodeURIComponent(test.name)}&amount=${test.price}&purpose=lab_test&testId=${encodeURIComponent(test.id)}`;

  const handleAddToCart = () => {
    addToCart({ id: test.id, name: test.name, category: test.category, amount: test.price });
    window.dispatchEvent(new Event('cart-updated'));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <main>
      {/* ── Hero ── */}
      <section className="py-16 bg-primary-950 text-white relative overflow-hidden">
        <VideoHeroBackground
          src="/videos/hero/diagnostics-lab.mp4"
          poster="/videos/hero/diagnostics-lab.jpg"
          overlayClassName="from-slate-950/[0.88] via-primary-950/[0.66] to-primary-800/[0.42]"
        />
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <Link
            href="/diagnostic-test"
            className="inline-flex items-center gap-1.5 text-sm text-primary-300 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Lab &amp; Service Tests
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-white/10 border border-white/15 text-white/80 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {test.category}
              </span>
              {test.isPopular && (
                <span className="inline-flex items-center gap-1 bg-amber-400/80 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-amber-900" /> Popular
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 leading-tight">
              {test.name}
            </h1>
            <p className="text-primary-200 text-lg max-w-2xl leading-relaxed">{test.description}</p>
            <div className="flex flex-wrap gap-3 mt-6">
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white text-sm px-3 py-1.5 rounded-full">
                {getSampleIcon(test.sampleType)}
                {test.sampleType}
              </span>
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white text-sm px-3 py-1.5 rounded-full">
                <Clock className="w-4 h-4" />
                Results: {test.turnaround}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="relative overflow-hidden section-padding bg-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 plus-pattern-light opacity-40" />
          <div className="absolute -top-24 left-1/4 h-72 w-96 rounded-full bg-primary-50 blur-3xl" />
          <div className="absolute bottom-0 right-[-4rem] h-64 w-80 rounded-full bg-emerald-50/60 blur-3xl" />
        </div>
        <div className="container-custom relative">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ── Left: details ── */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl overflow-hidden aspect-video"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveLabTestImage(test)}
                  alt={test.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative overflow-hidden p-5 rounded-2xl border border-neutral-200/70 bg-white shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_20px_44px_-16px_rgba(1,173,165,0.4)]"
              >
                <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary-500 via-teal-400 to-primary-500 opacity-50" />
                <span className="absolute right-4 top-3 text-[11px] font-black tracking-wider text-neutral-200">01</span>
                <SectionHeader
                  align="left"
                  eyebrow="Clinical Overview"
                  title="About This"
                  highlight="Test"
                  className="mb-4 md:mb-4"
                />
                <p className="text-neutral-600 leading-relaxed">{test.description}</p>
              </motion.div>

              {/* Tags */}
              {test.tags && test.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <SectionHeader
                    align="left"
                    eyebrow="Screening"
                    title="Related"
                    highlight="Conditions"
                    className="mb-4 md:mb-4"
                  />
                  <IconTileList items={test.tags} category="diagnostic test related condition" accent="teal" layout="list" />
                </motion.div>
              )}

              {/* Includes */}
              {test.includes && test.includes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <SectionHeader
                    align="left"
                    eyebrow="What's Inside"
                    title="Tests Included"
                    highlight={`(${test.includes.length})`}
                    className="mb-5 md:mb-5"
                  />
                  <IconTileList items={test.includes} category={`${test.name} included tests`} accent="teal" />
                </motion.div>
              )}

              {/* Preparation */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative overflow-hidden p-5 rounded-2xl border border-primary-100 bg-primary-50"
              >
                <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary-500 via-teal-400 to-primary-500 opacity-50" />
                <span className="absolute right-4 top-3 text-[11px] font-black tracking-wider text-primary-200">02</span>
                <h3 className="font-heading font-bold text-primary-900 mb-3 flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-primary-600" />
                  Patient Preparation
                </h3>
                <IconTileList
                  items={[
                    ...(test.sampleType.toLowerCase().includes('blood')
                      ? ['Fasting for 8–10 hours recommended for most blood panels (water is fine)']
                      : []),
                    'Bring any prior reports or prescriptions relevant to this test',
                    'Inform the staff about current medications before sample collection',
                    `Results expected in ${test.turnaround} — digital report available via email`,
                  ]}
                  category="diagnostic test patient preparation"
                  accent="teal"
                  layout="list"
                  className="gap-2"
                  itemClassName="min-h-[58px] rounded-2xl bg-white/75 p-2.5"
                />
              </motion.div>
            </div>

            {/* ── Right: booking sidebar ── */}
            <aside className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="group sticky top-20 relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm p-5 space-y-4 transition-all duration-500 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_20px_44px_-16px_rgba(1,173,165,0.4)]"
              >
                <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary-500 via-teal-400 to-primary-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                <span className="absolute right-4 top-3 text-[11px] font-black tracking-wider text-neutral-200">03</span>
                <h3 className="font-heading font-bold text-neutral-900">Book This Test</h3>

                {/* Pricing */}
                <div className="bg-neutral-50 rounded-xl p-4 space-y-1">
                  <p className="text-3xl font-extrabold text-primary-700">NRS {test.price.toLocaleString()}</p>
                  {savings > 0 && (
                    <>
                      <p className="text-sm text-neutral-400 line-through">NRS {test.originalPrice.toLocaleString()}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                          {savings}% OFF
                        </span>
                        <span className="text-xs text-emerald-600 font-semibold">
                          Save NRS {(test.originalPrice - test.price).toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Test meta */}
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-2 text-neutral-600">
                    {getSampleIcon(test.sampleType)}
                    <span>Sample: <strong className="text-neutral-800">{test.sampleType}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Clock className="w-4 h-4 text-teal-500" />
                    <span>Results in: <strong className="text-neutral-800">{test.turnaround}</strong></span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="space-y-2 pt-2">
                  <Link
                    href={bookHref}
                    className="w-full inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-semibold text-sm py-3 rounded-xl hover:bg-primary-700 transition-all shadow-[0_8px_20px_-8px_rgba(1,173,165,0.7)] group"
                  >
                    <FiCalendar className="w-4 h-4" />
                    Book Test
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`w-full inline-flex items-center justify-center gap-2 font-semibold text-sm py-3 rounded-xl border transition-colors ${
                      added ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <FiShoppingCart className="w-4 h-4" />
                    {added ? 'Added to Cart ✓' : 'Add to Cart'}
                  </button>
                </div>
              </motion.div>

              {/* Related tests */}
              {relatedTests.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  className="rounded-3xl border border-neutral-200/70 bg-white p-5 shadow-sm"
                >
                  <h3 className="font-heading font-bold text-neutral-900 mb-4">Related Tests</h3>
                  <div className="space-y-3">
                    {relatedTests.map((t) => (
                      <Link
                        key={t.id}
                        href={testDetailPath(t)}
                        className="flex items-start gap-3 group hover:bg-neutral-50 rounded-xl p-2 -mx-2 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={resolveLabTestImage(t)} alt={t.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors line-clamp-2">{t.name}</p>
                          <p className="text-xs text-primary-700 font-bold mt-0.5">NRS {t.price.toLocaleString()}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/diagnostic-test"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-800 mt-4"
                  >
                    View all tests →
                  </Link>
                </motion.div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CTAFooter
        title="Clear answers, faster"
        highlight="results"
        subtitle={`Book ${test.name} today — home collection and digital reports included.`}
        actions={[
          { label: 'Book This Test', href: bookHref, icon: <FiCalendar className="h-4 w-4" />, variant: 'primary' },
          { label: 'Browse All Tests', href: '/diagnostic-test', variant: 'outline' },
        ]}
      />
    </main>
  );
}
