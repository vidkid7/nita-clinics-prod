'use client';

import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ArrowRight,
  Clock,
  Droplets,
  FlaskConical,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { DiagnosticTest } from '@/lib/diagnostic-data';
import { getSavingsPercent, resolveLabTestImage, testDetailPath } from '@/lib/diagnostic-data';
import { getCatalogVisual } from '@/lib/catalog-visuals';
import { IconTileList } from '@/components/ui/IconTileList';

interface TestCardProps {
  test: DiagnosticTest;
  className?: string;
}

const carouselVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (dir: number) => ({ zIndex: 0, x: dir < 0 ? '100%' : '-100%', opacity: 0 }),
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

function getSampleIcon(sampleType: string) {
  if (sampleType.toLowerCase().includes('blood')) return <Droplets className="w-3 h-3" />;
  if (sampleType.toLowerCase().includes('urine')) return <FlaskConical className="w-3 h-3" />;
  if (sampleType.toLowerCase().includes('imaging')) return <FlaskConical className="w-3 h-3" />;
  return <FlaskConical className="w-3 h-3" />;
}

export function TestCard({ test, className }: TestCardProps) {
  const allImages = [resolveLabTestImage(test)];
  const { Icon: TestIcon, iconClassName, badgeClassName } = getCatalogVisual(test.name, test.category);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showIncludes, setShowIncludes] = useState(false);

  const changeImage = (newDir: number) => {
    setDirection(newDir);
    setCurrentIndex((prev) => {
      const next = prev + newDir;
      if (next < 0) return allImages.length - 1;
      if (next >= allImages.length) return 0;
      return next;
    });
  };

  const savings = getSavingsPercent(test.price, test.originalPrice);
  const detailHref = testDetailPath(test);
  const bookHref = `/appointments/book?test=${encodeURIComponent(test.name)}&amount=${test.price}`;
  const checkoutHref = `/payment/checkout?productName=${encodeURIComponent(test.name)}&amount=${test.price}&purpose=lab_test&testId=${encodeURIComponent(test.id)}`;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45 }}
      variants={contentVariants}
      whileHover={{
        y: -6,
        boxShadow: '0 24px 48px -12px var(--glow, rgba(1,173,165,0.3))',
        transition: { type: 'spring', stiffness: 300, damping: 22 },
      }}
      style={{ '--glow': 'rgba(1,173,165,0.3)' } as React.CSSProperties}
      className={cn(
        'w-full overflow-hidden rounded-3xl border border-neutral-200/70 bg-white shadow-md cursor-pointer flex flex-col transition-colors duration-300 hover:border-primary-200/70',
        className
      )}
    >
      {/* ── Image Carousel ── */}
      <div className="relative group h-52 overflow-hidden bg-gradient-to-br from-primary-100 via-primary-50 to-teal-50 flex-shrink-0">
        <div className="pointer-events-none absolute inset-0 z-[1] plus-pattern opacity-25" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-primary-950/50 via-transparent to-transparent" />
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={currentIndex}
            src={allImages[currentIndex]}
            alt={test.name}
            custom={direction}
            variants={carouselVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.18 },
            }}
            className="absolute h-full w-full object-cover"
          />
        </AnimatePresence>

        {/* Navigation arrows */}
        {allImages.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
              onClick={() => changeImage(-1)}
              className="w-7 h-7 rounded-full bg-black/35 hover:bg-black/55 text-white flex items-center justify-center transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => changeImage(1)}
              className="w-7 h-7 rounded-full bg-black/35 hover:bg-black/55 text-white flex items-center justify-center transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Top-left badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <Badge className="bg-white/85 backdrop-blur-sm text-primary-700 border-0 text-[10px] font-bold shadow-sm">
            {test.category}
          </Badge>
          {test.isPopular && (
            <Badge className="flex items-center gap-1 bg-amber-400/90 text-amber-900 border-0 text-[10px] font-bold">
              <Star className="w-3 h-3 fill-current" /> Popular
            </Badge>
          )}
        </div>

        <div className={cn('absolute bottom-4 right-4 z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/60 shadow-lg backdrop-blur-sm', badgeClassName)}>
          <TestIcon className={cn('h-8 w-8', iconClassName)} aria-hidden="true" />
        </div>

        {/* Savings badge top-right */}
        {savings > 0 && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className="flex items-center gap-0.5 bg-emerald-500 text-white border-0 text-[10px] font-bold shadow">
              {savings}% OFF
            </Badge>
          </div>
        )}

        {/* Pagination dots */}
        {allImages.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {allImages.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > currentIndex ? 1 : -1); setCurrentIndex(i); }}
                aria-label={`Image ${i + 1}`}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === currentIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/75'
                )}
              />
            ))}
          </div>
        )}

        {/* Dark gradient */}
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/40 to-transparent z-[5]" />
        {/* ECG trace */}
        <svg className="absolute inset-x-0 bottom-0 z-[6] h-8 w-full" viewBox="0 0 400 32" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0 22 H120 L138 8 L158 28 L176 14 L194 22 H400"
            fill="none"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="80 20"
            className="animate-ecg-flow"
          />
        </svg>
      </div>

      {/* ── Content ── */}
      <motion.div variants={contentVariants} className="p-5 flex flex-col flex-1 gap-3">
        {/* Title */}
        <motion.h3
          variants={itemVariants}
          className="font-heading font-bold text-base text-neutral-900 leading-snug line-clamp-2"
        >
          <span className="inline-flex items-start gap-2">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-50">
              <TestIcon className={cn('h-4 w-4', iconClassName)} aria-hidden="true" />
            </span>
            <span>{test.name}</span>
          </span>
        </motion.h3>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-xs text-neutral-500 leading-relaxed line-clamp-2 flex-1"
        >
          {test.description}
        </motion.p>

        {/* Pills: sample type + turnaround */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 text-[10px] font-semibold px-2.5 py-1 rounded-full">
            {getSampleIcon(test.sampleType)}
            {test.sampleType}
          </span>
          <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 text-[10px] font-semibold px-2.5 py-1 rounded-full">
            <Clock className="w-3 h-3" />
            {test.turnaround}
          </span>
        </motion.div>

        {/* Includes accordion */}
        {test.includes && test.includes.length > 0 && (
          <motion.div variants={itemVariants}>
            <button
              type="button"
              onClick={() => setShowIncludes((v) => !v)}
              className="flex items-center gap-1 text-xs text-primary-600 font-semibold hover:text-primary-800 transition-colors"
            >
              <ChevronDown
                className={cn('w-3.5 h-3.5 transition-transform', showIncludes && 'rotate-180')}
              />
              {showIncludes ? 'Hide' : 'View'} Includes ({test.includes.length} tests)
            </button>
            <AnimatePresence initial={false}>
              {showIncludes && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden mt-1.5"
                >
                  <IconTileList
                    items={test.includes}
                    category={`${test.name} included tests`}
                    accent="teal"
                    layout="list"
                    className="gap-1.5"
                    itemClassName="min-h-[46px] rounded-xl p-2"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ECG divider */}
        <motion.div variants={itemVariants} className="flex items-center gap-2" aria-hidden="true">
          <svg className="h-3 w-16 flex-shrink-0" viewBox="0 0 80 12" fill="none">
            <path d="M0 8 H24 L29 3 L34 9 L38 5 L42 8 H80" stroke="rgba(1,173,165,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="24 6" className="animate-ecg-flow" />
          </svg>
          <span className="h-px flex-1 bg-neutral-100" />
          <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-vital-ping" />
        </motion.div>

        {/* Pricing */}
        <motion.div variants={itemVariants} className="flex items-end justify-between mt-auto pt-1">
          <div>
            <p className="text-2xl font-bold text-primary-700">
              NRS {test.price.toLocaleString()}
            </p>
            {savings > 0 && (
              <p className="text-xs text-neutral-400 line-through leading-tight">
                NRS {test.originalPrice.toLocaleString()}
              </p>
            )}
          </div>
          {savings > 0 && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              Save NRS {(test.originalPrice - test.price).toLocaleString()}
            </span>
          )}
        </motion.div>

        {/* CTAs */}
        <motion.div variants={itemVariants} className="space-y-1.5">
          <Link
            href={detailHref}
            className="w-full inline-flex items-center justify-center gap-1.5 bg-primary-600 text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-primary-700 transition-colors group"
          >
            View Details
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <div className="flex gap-1.5">
            <Link
              href={bookHref}
              className="flex-1 inline-flex items-center justify-center gap-1 bg-primary-600 text-white text-xs font-semibold py-2 rounded-xl hover:bg-primary-700 transition-colors"
            >
              Book Test
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
