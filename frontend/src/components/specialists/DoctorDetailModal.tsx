'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Phone, Award, Clock, Star, MapPin, UserRound } from 'lucide-react';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { IconTileList } from '@/components/ui/IconTileList';
import { getDoctorAvailability } from '@/lib/doctor-availability';

export interface DoctorDetailData {
  name: string;
  specialization: string;
  qualification: string;
  experience?: number;
  rating?: number;
  availableDays?: string;
  bio?: string;
  phone?: string;
  isTopRated?: boolean;
  isDoctor?: boolean;
  images: string[];
  bookingHref?: string;
  highlights?: string[];
}

interface DoctorDetailModalProps {
  doctor: DoctorDetailData | null;
  onClose: () => void;
}

export function DoctorDetailModal({ doctor, onClose }: DoctorDetailModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (doctor) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [doctor]);

  const bookHref = doctor?.bookingHref || `/appointments/book?doctor=${encodeURIComponent(doctor?.name || '')}&specialty=${encodeURIComponent(doctor?.specialization || '')}`;
  const availability = doctor ? getDoctorAvailability(doctor) : '';

  return (
    <AnimatePresence>
      {doctor && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-neutral-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-neutral-600" />
              </button>

              {/* Header image */}
              <div className="relative h-56 overflow-hidden rounded-t-3xl">
                {doctor.images[0] ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={doctor.images[0]}
                    alt={`${doctor.isDoctor === false ? '' : 'Dr. '}${doctor.name}`}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 via-primary-50 to-teal-50 text-primary-700" aria-label="Profile image placeholder">
                    <UserRound className="h-20 w-20 stroke-[1.2]" aria-hidden="true" />
                  </div>
                )}
                {doctor.images[0] && <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />}

                {/* Name overlay */}
                <div className="absolute bottom-5 left-6 right-12">
                  {doctor.isTopRated && (
                    <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full mb-2">
                      <Star className="w-2.5 h-2.5 fill-amber-900" /> Top Rated
                    </span>
                  )}
                  <h2 className="text-2xl font-heading font-bold text-white leading-tight">
                    {doctor.isDoctor === false ? doctor.name : `Dr. ${doctor.name}`}
                  </h2>
                  <p className="text-primary-200 text-sm font-semibold mt-0.5">{doctor.specialization}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Award, label: 'Qualification', value: doctor.qualification },
                    { icon: Clock, label: 'Experience', value: doctor.experience ? `${doctor.experience} years` : 'Experienced' },
                    { icon: Star, label: 'Rating', value: doctor.rating ? `${doctor.rating}/5` : '4.8/5' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="bg-neutral-50 rounded-2xl p-3 text-center">
                      <Icon className="w-4 h-4 text-primary-500 mx-auto mb-1" />
                      <p className="text-[10px] text-neutral-400 uppercase tracking-wide font-semibold">{label}</p>
                      <p className="text-xs font-bold text-neutral-800 mt-0.5 line-clamp-2">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Bio */}
                {doctor.bio && (
                  <div>
                    <h3 className="font-heading font-bold text-neutral-900 mb-2">About</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">{doctor.bio}</p>
                  </div>
                )}

                {/* Availability */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Calendar className="w-4 h-4 text-primary-500" />
                    <span>Available: <strong className="text-neutral-800">{availability}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <MapPin className="w-4 h-4 text-teal-500" />
                    <span>NITA Clinic, Maharajgunj, Kathmandu</span>
                  </div>
                </div>

                {/* Highlights */}
                {doctor.highlights && doctor.highlights.length > 0 && (
                  <div>
                    <h3 className="font-heading font-bold text-neutral-900 mb-3">Specialties & Highlights</h3>
                    <IconTileList
                      items={doctor.highlights}
                      category={`${doctor.specialization} profile highlights`}
                      accent="teal"
                      layout="list"
                      className="gap-2"
                      itemClassName="min-h-[58px] rounded-2xl p-2.5"
                    />
                  </div>
                )}

                {/* Photo gallery */}
                {doctor.images.length > 1 && (
                  <div>
                    <h3 className="font-heading font-bold text-neutral-900 mb-3">Photos</h3>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {doctor.images.map((img, i) => (
                        <div key={i} className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img} alt={`Dr. ${doctor.name} photo ${i + 1}`} className="w-full h-full object-cover object-top" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTAs */}
                <div className="flex gap-3 pt-2">
                  <Link
                    href={bookHref}
                    onClick={onClose}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-bold py-3.5 rounded-2xl hover:bg-primary-700 transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    Book Appointment
                  </Link>
                  {doctor.phone && (
                    <a
                      href={`tel:${doctor.phone.replace(/[^0-9+]/g, '')}`}
                      className="inline-flex items-center justify-center gap-2 border border-neutral-200 text-neutral-700 font-semibold py-3.5 px-5 rounded-2xl hover:border-primary-300 hover:text-primary-700 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
