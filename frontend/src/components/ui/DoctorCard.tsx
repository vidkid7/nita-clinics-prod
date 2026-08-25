'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Calendar, Phone, Award, Clock, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { getDoctorAvailability } from '@/lib/doctor-availability';

export interface DoctorCardProps {
  images: string[];
  name: string;
  specialization: string;
  qualification: string;
  experience?: number;
  rating?: number;
  availableDays?: string;
  bio?: string;
  phone?: string;
  isTopRated?: boolean;
  bookingHref?: string;
  profileHref?: string;
  onViewProfile?: () => void;
  isDoctor?: boolean;
  className?: string;
}

const carouselVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

export function DoctorCard({
  images,
  name,
  specialization,
  qualification,
  experience,
  availableDays,
  bio,
  phone,
  isTopRated = false,
  bookingHref = '/appointments/book',
  profileHref,
  onViewProfile,
  isDoctor = true,
  className,
}: DoctorCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const changeImage = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      const next = prev + newDirection;
      if (next < 0) return safeImages.length - 1;
      if (next >= safeImages.length) return 0;
      return next;
    });
  };

  const safeImages = images.filter(Boolean);
  const hasImages = safeImages.length > 0;
  const availability = getDoctorAvailability({ availableDays, bio });

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45 }}
      variants={contentVariants}
      whileHover={{
        y: -3,
        boxShadow: '0 18px 34px -20px rgba(1, 95, 90, 0.35)',
        transition: { type: 'spring', stiffness: 320, damping: 26 },
      }}
      className={cn(
        'group w-full overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-[0_10px_28px_-24px_rgba(15,23,42,0.5)] cursor-pointer transition-all duration-300 hover:border-primary-200',
        className
      )}
    >
      {/* ── Image carousel / blank avatar ── */}
      <div className="relative h-52 overflow-hidden border-b border-neutral-100 bg-primary-50/70">
        {hasImages ? (
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={currentIndex}
              src={safeImages[currentIndex]}
              alt={`${isDoctor ? 'Dr. ' : ''}${name}`}
              custom={direction}
              variants={carouselVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.18 },
              }}
              className="absolute h-full w-full object-cover object-top"
            />
          </AnimatePresence>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" aria-label="Profile image placeholder">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-primary-200 bg-white text-primary-600 shadow-sm">
              <UserRound className="h-11 w-11 stroke-[1.2]" aria-hidden="true" />
            </div>
          </div>
        )}
        {hasImages && <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-950/45 via-transparent to-transparent" />}

        {/* Navigation arrows (show on hover) */}
        {safeImages.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
              onClick={() => changeImage(-1)}
              className="w-8 h-8 rounded-full bg-black/35 hover:bg-black/55 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => changeImage(1)}
              className="w-8 h-8 rounded-full bg-black/35 hover:bg-black/55 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
              aria-label="Next photo"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Specialty label */}
        <div className="absolute bottom-3 left-3 z-10">
          <Badge className="border border-white/70 bg-white/90 text-[10px] font-bold text-primary-700 shadow-sm backdrop-blur-md">
            {specialization}
          </Badge>
        </div>

        {/* Pagination dots */}
        {safeImages.length > 1 && (
          <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {safeImages.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > currentIndex ? 1 : -1); setCurrentIndex(i); }}
                aria-label={`Photo ${i + 1}`}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === currentIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/75'
                )}
              />
            ))}
          </div>
        )}

      </div>

      {/* ── Content ── */}
      <motion.div variants={contentVariants} className="space-y-3 p-5">
        {/* Name + Top Rated */}
        <motion.div variants={itemVariants} className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-heading text-lg font-bold leading-tight text-neutral-900">
              {isDoctor ? 'Dr. ' : ''}{name}
            </h3>
            <p className="mt-1 text-sm font-semibold text-primary-700">{specialization}</p>
          </div>
          {isTopRated && <span className="rounded-full bg-primary-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-700">Featured</span>}
        </motion.div>

        {/* Qualification + Experience */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-2 text-xs text-neutral-600">
          <span className="flex items-center gap-1 bg-neutral-50 border border-neutral-100 rounded-full px-2.5 py-1">
            <Award className="w-3 h-3 text-primary-500" />
            {qualification}
          </span>
          {experience !== undefined && experience > 0 && (
            <span className="flex items-center gap-1 bg-neutral-50 border border-neutral-100 rounded-full px-2.5 py-1">
              <Clock className="w-3 h-3 text-teal-500" />
              {experience} yrs exp.
            </span>
          )}
        </motion.div>

        {/* Availability */}
        <motion.div variants={itemVariants} className="flex items-center gap-2 text-xs text-neutral-600">
          <Calendar className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
          <span>Available: <span className="font-semibold text-neutral-800">{availability}</span></span>
        </motion.div>

        {/* Bio */}
        {bio && (
          <motion.p variants={itemVariants} className="text-xs text-neutral-500 leading-relaxed line-clamp-2">
            {bio}
          </motion.p>
        )}

        {/* ECG divider */}
        <motion.div variants={itemVariants} className="flex items-center gap-2" aria-hidden="true">
          <svg className="h-3 w-20" viewBox="0 0 100 12" fill="none">
            <path
              d="M0 8 H30 L36 3 L42 9 L48 5 L54 8 H100"
              stroke="rgba(1,173,165,0.4)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="30 8"
              className="animate-ecg-flow"
            />
          </svg>
          <span className="h-px flex-1 bg-neutral-100" />
          <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-vital-ping" />
        </motion.div>

        {/* Action buttons */}
        <motion.div variants={itemVariants} className="flex gap-2 pt-1">
          {(profileHref || onViewProfile) && (
            onViewProfile ? (
              <button
                type="button"
                onClick={onViewProfile}
                className="flex-1 inline-flex items-center justify-center gap-1 border border-neutral-200 text-neutral-700 text-sm font-semibold py-2.5 rounded-xl hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              >
                View Profile
              </button>
            ) : (
              <Link
                href={profileHref!}
                className="flex-1 inline-flex items-center justify-center gap-1 border border-neutral-200 text-neutral-700 text-sm font-semibold py-2.5 rounded-xl hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              >
                View Profile
              </Link>
            )
          )}
          <Link
            href={bookingHref}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-primary-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-primary-700 transition-all shadow-[0_10px_24px_-10px_rgba(1,173,165,0.6)] hover:shadow-[0_14px_30px_-10px_rgba(1,173,165,0.85)] group"
          >
            <Calendar className="h-3.5 w-3.5" />
            Book Now
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* Phone quick-dial */}
        {phone && (
          <motion.div variants={itemVariants}>
            <a
              href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center justify-center gap-1.5 text-xs text-neutral-500 hover:text-primary-600 transition-colors"
            >
              <Phone className="w-3 h-3" />
              {phone}
            </a>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
