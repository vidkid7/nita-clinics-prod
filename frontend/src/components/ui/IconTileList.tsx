'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getCatalogVisual } from '@/lib/catalog-visuals';

export type IconTileItem = {
  label?: string;
  title?: string;
  description?: string;
  desc?: string;
  copy?: string;
  category?: string;
};

type IconTileListProps = {
  items: Array<string | IconTileItem>;
  category?: string;
  accent?: 'teal' | 'rose' | 'emerald' | 'amber' | 'violet' | 'indigo' | 'blue';
  layout?: 'grid' | 'list' | 'compact';
  className?: string;
  itemClassName?: string;
};

const accents = {
  teal: {
    line: 'from-primary-400 via-teal-400 to-cyan-400',
    hover: 'hover:border-primary-200 hover:shadow-[0_18px_42px_-22px_rgba(1,173,165,0.55)]',
    wash: 'from-primary-50/90 via-white to-cyan-50/60',
  },
  rose: {
    line: 'from-rose-400 via-pink-400 to-orange-300',
    hover: 'hover:border-rose-200 hover:shadow-[0_18px_42px_-22px_rgba(244,63,94,0.45)]',
    wash: 'from-rose-50/90 via-white to-pink-50/60',
  },
  emerald: {
    line: 'from-emerald-400 via-teal-400 to-cyan-400',
    hover: 'hover:border-emerald-200 hover:shadow-[0_18px_42px_-22px_rgba(5,150,105,0.45)]',
    wash: 'from-emerald-50/90 via-white to-teal-50/60',
  },
  amber: {
    line: 'from-amber-400 via-orange-400 to-rose-300',
    hover: 'hover:border-amber-200 hover:shadow-[0_18px_42px_-22px_rgba(245,158,11,0.42)]',
    wash: 'from-amber-50/90 via-white to-orange-50/60',
  },
  violet: {
    line: 'from-violet-400 via-indigo-400 to-blue-400',
    hover: 'hover:border-violet-200 hover:shadow-[0_18px_42px_-22px_rgba(124,58,237,0.42)]',
    wash: 'from-violet-50/90 via-white to-indigo-50/60',
  },
  indigo: {
    line: 'from-indigo-400 via-blue-400 to-violet-400',
    hover: 'hover:border-indigo-200 hover:shadow-[0_18px_42px_-22px_rgba(79,70,229,0.42)]',
    wash: 'from-indigo-50/90 via-white to-blue-50/60',
  },
  blue: {
    line: 'from-blue-400 via-cyan-400 to-primary-400',
    hover: 'hover:border-blue-200 hover:shadow-[0_18px_42px_-22px_rgba(37,99,235,0.42)]',
    wash: 'from-blue-50/90 via-white to-cyan-50/60',
  },
} as const;

function normalizeItem(item: string | IconTileItem) {
  if (typeof item === 'string') return { label: item, description: '' };
  return {
    label: item.label || item.title || '',
    description: item.description || item.desc || item.copy || '',
    category: item.category || '',
  };
}

export function IconTileList({
  items,
  category = '',
  accent = 'teal',
  layout = 'grid',
  className,
  itemClassName,
}: IconTileListProps) {
  const palette = accents[accent];
  const isList = layout === 'list';
  const isCompact = layout === 'compact';

  return (
    <div
      className={cn(
        isCompact
          ? 'grid grid-cols-2 gap-2'
          : isList
            ? 'grid gap-3 sm:grid-cols-2'
            : 'grid gap-3 sm:grid-cols-2 lg:grid-cols-3',
        className,
      )}
    >
      {items.map((item, index) => {
        const normalized = normalizeItem(item);
        const visual = getCatalogVisual(normalized.label, `${category} ${normalized.category}`);
        const Icon = visual.Icon;

        return (
          <motion.div
            key={`${normalized.label}-${index}`}
            initial={{ opacity: 1, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.2, delay: Math.min(index * 0.012, 0.06) }}
            className={cn(
              'group relative isolate flex items-center overflow-hidden rounded-2xl border border-neutral-200/80 bg-white outline-none transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-[0_14px_30px_-22px_rgba(15,23,42,0.45)] focus-visible:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
              palette.hover,
              isCompact
                ? 'min-h-0 gap-2 rounded-xl p-2'
                : isList
                  ? 'min-h-[72px] gap-3 p-3'
                  : 'min-h-[88px] gap-3 p-3.5 sm:p-4',
              itemClassName,
            )}
          >
            <span
              className={cn(
                'relative flex shrink-0 items-center justify-center rounded-xl border border-neutral-100 transition-transform duration-200 group-hover:scale-105',
                isCompact ? 'h-9 w-9 rounded-xl' : isList ? 'h-11 w-11' : 'h-14 w-14',
                visual.badgeClassName,
              )}
            >
              <Icon className={cn(isCompact ? 'h-4 w-4' : isList ? 'h-5 w-5' : 'h-7 w-7', visual.iconClassName)} aria-hidden="true" />
            </span>

            <span className="min-w-0">
              <span className={cn('block font-heading font-semibold leading-snug text-neutral-800 transition-colors group-hover:text-primary-800', isCompact ? 'text-[11px]' : isList ? 'text-sm' : 'text-sm sm:text-[15px]')}>
                {normalized.label}
              </span>
              {normalized.description && (
                <span className="mt-1 block line-clamp-2 text-xs leading-relaxed text-neutral-500">
                  {normalized.description}
                </span>
              )}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
