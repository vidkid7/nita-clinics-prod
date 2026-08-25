'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VideoHeroBackground } from '@/components/ui/VideoHeroBackground';

type HeroAction = {
  label: string;
  href: string;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary';
};

type HeroStat = {
  value: string;
  label: string;
};

type PremiumLandingHeroProps = {
  eyebrow: string;
  title: string;
  highlight?: string;
  description: string;
  videoSrc: string;
  posterSrc: string;
  overlayClassName?: string;
  actions?: HeroAction[];
  stats?: HeroStat[];
  trustPoints?: string[];
  panelEyebrow?: string;
  panelTitle?: string;
  panelItems?: string[];
  className?: string;
};

export function PremiumLandingHero(props: PremiumLandingHeroProps) {
  const {
    eyebrow,
    title,
    highlight,
    description,
    videoSrc,
    posterSrc,
    overlayClassName,
    actions = [],
    stats = [],
    trustPoints = [],
    className,
  } = props;

  return (
    <section
      className={cn(
        'relative flex min-h-[calc(100vh-6.5625rem)] flex-col justify-center overflow-hidden bg-primary-950 text-white',
        className,
      )}
    >
      <VideoHeroBackground
        src={videoSrc}
        poster={posterSrc}
        overlayClassName={overlayClassName}
      />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 -left-16 h-72 w-72 rounded-full bg-white/[0.05] blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-teal-300/[0.08] blur-3xl" />
      </div>

      <div className="container-custom relative z-10 w-full py-14 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="hero-kicker mb-6">
            <span className="h-2 w-2 rounded-full bg-teal-200 shadow-[0_0_16px_rgba(153,246,228,0.9)]" />
            {eyebrow}
          </div>

          <h1 className="hero-title mb-5">
            {title}
            {highlight && (
              <>
                <br />
                <span className="bg-gradient-to-r from-white via-primary-100 to-teal-200 bg-clip-text text-transparent">
                  {highlight}
                </span>
              </>
            )}
          </h1>

          <p className="hero-copy mx-auto max-w-2xl">{description}</p>

          {trustPoints.length > 0 && (
            <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2.5">
              {trustPoints.map((point) => (
                <span
                  key={point}
                  className="flex items-center gap-2 text-sm font-medium text-white/[0.84]"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-200" />
                  {point}
                </span>
              ))}
            </div>
          )}

          {actions.length > 0 && (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {actions.map((action) => {
                const isSecondary = action.variant === 'secondary';
                return (
                  <Link
                    key={`${action.href}-${action.label}`}
                    href={action.href}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold transition-all hover:-translate-y-0.5',
                      isSecondary
                        ? 'border border-white/[0.22] bg-white/10 text-white backdrop-blur-xl hover:bg-white/[0.18]'
                        : 'bg-white text-primary-800 shadow-[0_20px_42px_-26px_rgba(0,0,0,0.75)] hover:bg-teal-50',
                    )}
                  >
                    {action.icon}
                    {action.label}
                    {isSecondary && !action.icon && <ArrowRight className="h-4 w-4" />}
                  </Link>
                );
              })}
            </div>
          )}

          {stats.length > 0 && (
            <div className="mt-9 flex flex-wrap justify-center gap-4 border-t border-white/[0.14] pt-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/[0.12] bg-white/[0.08] px-5 py-3.5 backdrop-blur-xl"
                >
                  <p className="text-xl font-black leading-none text-white">{stat.value}</p>
                  <p className="mt-1 text-xs font-medium text-white/65">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
