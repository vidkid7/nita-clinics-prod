import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  eyebrow?: string;
  eyebrowIcon?: ReactNode;
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: 'center' | 'left';
  tone?: 'light' | 'dark';
  className?: string;
  titleClassName?: string;
}

/**
 * Reusable clinical section header — cross-icon kicker chip,
 * headline with gradient keyword, and subtitle.
 */
export function SectionHeader({
  eyebrow,
  eyebrowIcon,
  title,
  highlight,
  subtitle,
  align = 'center',
  tone = 'light',
  className,
  titleClassName,
}: SectionHeaderProps) {
  const isCenter = align === 'center';
  const isDark = tone === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        'mb-10 md:mb-14',
        isCenter && 'text-center',
        className
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            'mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest',
            isDark
              ? 'section-kicker-light'
              : 'section-kicker'
          )}
        >
          {eyebrowIcon ?? (
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden="true">
              <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5z" />
            </svg>
          )}
          {eyebrow}
        </span>
      )}

      <h2
        className={cn(
          'text-3xl font-heading font-bold tracking-tight text-balance md:text-4xl lg:text-5xl',
          isDark ? 'text-white' : 'text-neutral-900',
          titleClassName
        )}
      >
        {title}
        {highlight && (
          <>
            {' '}
            <span
              className={cn(
                isDark
                  ? 'bg-gradient-to-r from-primary-200 to-teal-300 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-primary-600 to-teal-500 bg-clip-text text-transparent'
              )}
            >
              {highlight}
            </span>
          </>
        )}
      </h2>

      {subtitle && (
        <p
          className={cn(
            'mt-4 text-base leading-relaxed md:text-lg',
            isDark ? 'text-white/70' : 'text-neutral-500',
            isCenter ? 'mx-auto max-w-2xl' : 'max-w-2xl'
          )}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
