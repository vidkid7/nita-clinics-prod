'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  FileText,
  Pencil,
  AlertCircle,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

type StepStatus = 'completed' | 'active' | 'pending' | 'error';

export interface CheckupStep {
  title: string;
  description: string;
  detail?: string;
  status: StepStatus;
}

export interface CheckupTrackerCardProps {
  imageUrl: string;
  statusLabel: string;
  statusColor?: 'orange' | 'green' | 'blue' | 'rose' | 'emerald' | 'indigo';
  title: string;
  subtitle: string;
  /** When omitted, shows a generic “see packages” line (use when prices come from API). */
  priceFrom?: number | null;
  priceTo?: number | null;
  steps: CheckupStep[];
  detailHref: string;
  bookHref: string;
  accentGradient?: string;
  /** Optional icon rendered as a frosted tile on the card image. */
  icon?: React.ReactNode;
}

const statusColorMap: Record<string, string> = {
  orange: 'border-orange-300 bg-orange-50 text-orange-700',
  green: 'border-green-300 bg-green-50 text-green-700',
  blue: 'border-primary-300 bg-primary-50 text-primary-700',
  rose: 'border-rose-300 bg-rose-50 text-rose-700',
  emerald: 'border-emerald-300 bg-emerald-50 text-emerald-700',
  indigo: 'border-indigo-300 bg-indigo-50 text-indigo-700',
};

function getStepAttributes(status: StepStatus) {
  switch (status) {
    case 'completed':
      return {
        Icon: CheckCircle2,
        iconClass: 'text-emerald-500',
        lineClass: 'bg-emerald-200',
        ringClass: 'bg-emerald-50 ring-1 ring-emerald-200',
      };
    case 'active':
      return {
        Icon: Pencil,
        iconClass: 'text-primary-600',
        lineClass: 'bg-neutral-200',
        ringClass: 'bg-primary-50 ring-1 ring-primary-200',
      };
    case 'error':
      return {
        Icon: AlertCircle,
        iconClass: 'text-red-500',
        lineClass: 'bg-neutral-200',
        ringClass: 'bg-red-50 ring-1 ring-red-200',
      };
    default:
      return {
        Icon: FileText,
        iconClass: 'text-neutral-400',
        lineClass: 'bg-neutral-100',
        ringClass: 'bg-neutral-50 ring-1 ring-neutral-100',
      };
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 110, damping: 12 } },
};

export function CheckupTrackerCard({
  imageUrl,
  statusLabel,
  statusColor = 'blue',
  title,
  subtitle,
  priceFrom,
  priceTo,
  steps,
  detailHref,
  bookHref,
  accentGradient = 'from-primary-600 to-primary-600',
  icon,
}: CheckupTrackerCardProps) {
  const badgeClass = statusColorMap[statusColor];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        y: -6,
        boxShadow: '0 24px 48px -12px rgba(2, 132, 199, 0.18)',
        transition: { type: 'spring', stiffness: 300, damping: 22 },
      }}
    >
      <Card className="w-full overflow-hidden rounded-2xl border border-neutral-100 shadow-md bg-white">
        {/* ── Header image + info ── */}
        <CardHeader className="p-0">
          {/* Full-width image */}
          <div className="relative h-48 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover object-center"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${accentGradient} opacity-60`} />
            {/* Icon + title overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-5">
              {icon && (
                <span className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 text-white ring-1 ring-white/30 backdrop-blur-sm shadow-lg">
                  {icon}
                </span>
              )}
              <h2 className="text-xl font-bold text-white leading-tight drop-shadow-sm">{title}</h2>
              <p className="text-xs text-white/80 mt-0.5 leading-snug">{subtitle}</p>
            </div>
            {/* Status badge */}
            <div className="absolute top-3 right-3">
              <Badge className={cn('border text-xs font-bold', badgeClass)}>{statusLabel}</Badge>
            </div>
          </div>

          {/* Price strip */}
          <div className={`px-5 py-3 bg-gradient-to-r ${accentGradient} flex items-center justify-between`}>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/70 font-semibold">
                Starting from
              </p>
              <p className="text-xl font-bold text-white">
                {priceFrom != null && priceFrom > 0 ? (
                  <>
                    NRS {priceFrom.toLocaleString()}
                    {priceTo != null && priceTo > 0 && priceTo !== priceFrom && (
                      <span className="text-sm font-normal text-white/70 ml-1">
                        – {priceTo.toLocaleString()}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-base font-semibold">View current packages</span>
                )}
              </p>
            </div>
            <Calendar className="w-6 h-6 text-white/60" />
          </div>
        </CardHeader>

        {/* ── Steps tracker ── */}
        <CardContent className="px-5 pb-5 pt-4">
          <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold mb-4">
            Checkup Journey
          </p>

          <motion.ul
            className="relative space-y-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {steps.map((step, index) => {
              const { Icon, iconClass, lineClass, ringClass } = getStepAttributes(step.status);
              const isLast = index === steps.length - 1;

              return (
                <motion.li
                  key={index}
                  className="flex items-start gap-3"
                  variants={itemVariants}
                >
                  {/* Icon column */}
                  <div className="relative flex flex-col items-center flex-shrink-0">
                    <div className={cn('z-10 flex h-7 w-7 items-center justify-center rounded-full', ringClass)}>
                      <Icon className={cn('h-3.5 w-3.5', iconClass)} />
                    </div>
                    {!isLast && (
                      <div className={cn('absolute top-7 w-0.5 h-[calc(100%+4px)]', lineClass)} />
                    )}
                  </div>

                  {/* Content */}
                  <div className={cn('flex-1 pb-4', isLast && 'pb-0')}>
                    <p className={cn(
                      'text-sm font-semibold leading-snug',
                      step.status === 'completed' ? 'text-neutral-900' :
                      step.status === 'active' ? 'text-primary-700' :
                      'text-neutral-500'
                    )}>
                      {step.title}
                    </p>
                    {step.detail && (
                      <p className="text-xs text-neutral-400 mt-0.5 leading-snug">{step.detail}</p>
                    )}
                    <Link
                      href={detailHref}
                      className={cn(
                        'text-xs font-medium hover:underline mt-0.5 inline-block',
                        step.status === 'completed' ? 'text-emerald-600' :
                        step.status === 'active' ? 'text-primary-600' :
                        'text-neutral-400'
                      )}
                    >
                      {step.description}
                    </Link>
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>

          {/* CTA buttons */}
          <div className="flex gap-2 mt-5">
            <Link
              href={detailHref}
              className="flex-1 inline-flex items-center justify-center gap-1.5 border border-neutral-200 text-neutral-700 text-sm font-semibold py-2.5 rounded-xl hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 transition-colors"
            >
              View Details
            </Link>
            <Link
              href={bookHref}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 bg-gradient-to-r ${accentGradient} text-white text-sm font-semibold py-2.5 rounded-xl hover:opacity-90 transition-opacity group`}
            >
              Book Now
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
