'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { get } from '@/lib/api';
import { DoctorCard } from '@/components/ui/DoctorCard';
import { PremiumLandingHero } from '@/components/ui/PremiumLandingHero';
import { CTAFooter } from '@/components/ui/CTAFooter';
import { DoctorDetailModal, type DoctorDetailData } from '@/components/specialists/DoctorDetailModal';
import { FlowerDrawing, BabyDrawing, LungsDrawing, OrthoDrawing } from '@/components/home/SpecialistArtworks';
import { SPECIALIST_META } from '@/lib/specialist-data';

interface ApiDoctor {
  id: string;
  name: string;
  specialization: string;
  qualification?: string;
  bio?: string;
  photo?: string;
  experience?: number;
  phone?: string;
  availableDays?: string;
}

const SPECIALTY_GROUPS = [
  {
    slug: 'gynecology-obstetrics',
    label: 'Gynecology & Obstetrics',
    keywords: ['gynecol', 'obstet'],
    Artwork: FlowerDrawing,
    stroke: '#e11d48',
    soft: '#ffe4e6',
    tile: 'bg-rose-50',
    bar: 'from-rose-400 to-rose-600',
    trace: 'rgba(244,63,94,0.5)',
    glow: 'rgba(244,63,94,0.3)',
  },
  {
    slug: 'pediatrics',
    label: 'Pediatrics',
    keywords: ['pediatr', 'paediatr'],
    Artwork: BabyDrawing,
    stroke: '#0d9488',
    soft: '#ccfbf1',
    tile: 'bg-teal-50',
    bar: 'from-teal-400 to-teal-600',
    trace: 'rgba(20,184,166,0.5)',
    glow: 'rgba(20,184,166,0.3)',
  },
  {
    slug: 'tuberculosis',
    label: 'Tuberculosis (TB)',
    keywords: ['tubercul', 'pulmonol', 'tb'],
    Artwork: LungsDrawing,
    stroke: '#059669',
    soft: '#d1fae5',
    tile: 'bg-emerald-50',
    bar: 'from-emerald-400 to-emerald-600',
    trace: 'rgba(16,185,129,0.5)',
    glow: 'rgba(16,185,129,0.3)',
  },
  {
    slug: 'orthopedics',
    label: 'Orthopedics',
    keywords: ['orthop', 'bone', 'joint'],
    Artwork: OrthoDrawing,
    stroke: '#4338ca',
    soft: '#e0e7ff',
    tile: 'bg-indigo-50',
    bar: 'from-indigo-400 to-indigo-600',
    trace: 'rgba(99,102,241,0.5)',
    glow: 'rgba(99,102,241,0.3)',
  },
];

export default function SpecialistsPage() {
  const [apiDoctors, setApiDoctors] = useState<ApiDoctor[]>([]);
  const [apiLoaded, setApiLoaded] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorDetailData | null>(null);

  useEffect(() => {
    get<{ data: ApiDoctor[] }>('doctors', {
      params: { page: 1, limit: 100, sortBy: 'name', sortOrder: 'asc' },
    })
      .then((res) => setApiDoctors(res.data || []))
      .catch(() => setApiDoctors([]))
      .finally(() => setApiLoaded(true));
  }, []);

  const grouped = useMemo(() =>
    SPECIALTY_GROUPS.map((grp) => {
      const apiMatches = apiDoctors.filter((d) =>
        grp.keywords.some((kw) => d.specialization.toLowerCase().includes(kw))
      );
      const fallback = SPECIALIST_META[grp.slug]?.fallbackDoctors ?? [];
      return {
        ...grp,
        doctors: apiLoaded && apiMatches.length ? apiMatches : fallback,
        isApi: apiLoaded && apiMatches.length > 0,
      };
    }), [apiDoctors, apiLoaded]);

  function openDoctorModal(doc: Record<string, unknown>, images: string[]) {
    setSelectedDoctor({
      name: doc.name as string,
      specialization: doc.specialization as string,
      qualification: (doc.qualification as string) || 'Specialist',
      experience: doc.experience as number | undefined,
      rating: (doc.rating as number) || 4.8,
      availableDays: doc.availableDays as string | undefined,
      bio: doc.bio as string | undefined,
      phone: (doc.phone as string) || '+977 01-4533361',
      isTopRated: !!(doc.isTopRated as boolean),
      images: [],
      bookingHref: `/appointments/book?doctor=${encodeURIComponent(doc.name as string)}&specialty=${encodeURIComponent(doc.specialization as string)}`,
      highlights: [(doc.specialization as string), (doc.qualification as string) || ''].filter(Boolean),
    });
  }

  return (
    <>
    <DoctorDetailModal doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} />
    <main>
      <PremiumLandingHero
        eyebrow="Expert Care · Specialist Clinics"
        title="Find the right specialist"
        highlight="without the guesswork."
        description="Gynecology, pediatrics, and tuberculosis care organized by specialty, doctor availability, and patient need."
        videoSrc="/videos/hero/doctor-tablet-consult.mp4"
        posterSrc="/videos/hero/doctor-tablet-consult.jpg"
        overlayClassName="from-primary-950/[0.88] via-primary-900/[0.66] to-primary-700/[0.42]"
        actions={[
          { label: 'Book Appointment', href: '/appointments/book' },
          { label: 'View Doctors', href: '#specialists', variant: 'secondary' },
        ]}
        trustPoints={[
          'Specialty-led consultation paths',
          'Same-day appointment options',
          'Doctor profiles with clear details',
          'Lab tests and check-ups nearby',
        ]}
        stats={[
          { value: '3', label: 'Core Specialties' },
          { value: apiLoaded ? String(apiDoctors.length || grouped.reduce((n, g) => n + g.doctors.length, 0)) : '…', label: 'Listed Doctors' },
          { value: '4.8', label: 'Patient Rating' },
        ]}
        panelEyebrow="Specialty Flow"
        panelTitle="Choose the care path before you book."
        panelItems={[
          'Compare specialties by health concern, age group, or clinical pathway.',
          'Open doctor profiles for qualifications, availability, and booking links.',
          'Move from consultation to lab tests, check-ups, or follow-up care in one clinic.',
        ]}
      />

      {/* Specialty groups */}
      <div className="bg-neutral-50">
        {grouped.map((grp, gi) => (
          <section
            key={grp.slug}
            className={`section-padding relative overflow-hidden ${gi % 2 === 0 ? 'bg-neutral-50' : 'bg-white'}`}
          >
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <div className="absolute inset-0 plus-pattern-light opacity-40" />
              <div className="absolute -top-24 left-1/4 h-72 w-96 rounded-full bg-primary-50 blur-3xl" />
              <div className="absolute bottom-0 right-[-5rem] h-64 w-80 rounded-full bg-emerald-50/60 blur-3xl" />
            </div>

            <div className="relative container-custom">
              {/* Section header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-10"
              >
                <div className="flex items-start gap-4">
                  {/* doodle tile */}
                  <div className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${grp.tile} shadow-lg`}>
                    <grp.Artwork className="h-11 w-11" stroke={grp.stroke} soft={grp.soft} />
                    <span className={`absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br ${grp.bar} text-[9px] font-black text-white`}>
                      {String(gi + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-600">
                      Specialist Clinic · {String(gi + 1).padStart(2, '0')}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-neutral-900">
                      {grp.label} Experts
                    </h2>
                    <p className="text-neutral-500 text-sm mt-1 max-w-lg">
                      {SPECIALIST_META[grp.slug]?.intro}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/specialists/${grp.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50/70 px-4 py-2 text-sm font-semibold text-primary-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-100 hover:shadow-[0_10px_24px_-12px_rgba(1,173,165,0.6)] flex-shrink-0"
                >
                  View Specialty Page <FiArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              {/* Doctor cards */}
              {!apiLoaded ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2].map((n) => (
                    <div key={n} className="rounded-3xl border border-neutral-200/70 bg-white shadow-md overflow-hidden animate-pulse">
                      <div className="h-64 bg-gradient-to-br from-neutral-100 to-neutral-200" />
                      <div className="p-5 space-y-3">
                        <div className="h-5 bg-neutral-200 rounded w-2/3" />
                        <div className="h-4 bg-neutral-200 rounded w-1/2" />
                        <div className="h-10 bg-neutral-200 rounded-xl mt-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(grp.doctors as (typeof grp.doctors)[number][]).map((doc, di) => {
                    const images: string[] = [];
                    return (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: di * 0.08 }}
                      >
                        <DoctorCard
                          images={images}
                          name={doc.name}
                          specialization={doc.specialization}
                          qualification={(doc as { qualification?: string }).qualification || 'Specialist'}
                          experience={'experience' in doc ? (doc as { experience?: number }).experience : undefined}
                          rating={'rating' in doc ? (doc as { rating?: number }).rating : 4.8}
                          availableDays={'availableDays' in doc ? (doc as { availableDays?: string }).availableDays : undefined}
                          bio={'bio' in doc ? (doc as { bio?: string }).bio : undefined}
                          phone={'phone' in doc ? (doc as { phone?: string }).phone : undefined}
                          isTopRated={'isTopRated' in doc ? !!(doc as { isTopRated?: boolean }).isTopRated : false}
                          bookingHref={`/appointments/book?specialty=${grp.slug}&doctor=${encodeURIComponent(doc.name)}`}
                          onViewProfile={() => openDoctorModal(doc as unknown as Record<string, unknown>, images)}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      {/* CTA */}
      <CTAFooter
        title="Ready to book your"
        highlight="specialist visit?"
        subtitle="Choose a specialty, meet your doctor, and book online in minutes. Our front desk team is also happy to guide you."
      />
    </main>
    </>
  );
}
