'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCalendar, FiCheck } from 'react-icons/fi';
import { FlowerDrawing, BabyDrawing, LungsDrawing, OrthoDrawing } from './SpecialistArtworks';
import { get } from '@/lib/api';
import type { PaginatedResponse } from '@/lib/api';
import { FALLBACK_DOCTORS } from '@/lib/static-content-fallback';

const specialists = [
  {
    id: 'gynecology',
    specialty: 'Gynecology & Obstetrics',
    href: '/specialists/gynecology-obstetrics',
    desc: "Women's reproductive health, prenatal and postnatal care, fertility support, and comprehensive gynecological treatment.",
    highlights: ['Prenatal & Postnatal Care', 'Gynecological Disorders', 'Fertility Consultation'],
  },
  {
    id: 'pediatrics',
    specialty: 'Pediatrician',
    href: '/specialists/pediatrics',
    desc: "Expert child health care from newborns to adolescents — immunization, growth monitoring, and pediatric illness management.",
    highlights: ['Newborn & Child Health', 'Immunization Planning', 'Growth & Development'],
  },
  {
    id: 'tuberculosis',
    specialty: 'Tuberculosis (TB)',
    href: '/specialists/tuberculosis',
    desc: 'Specialised diagnosis, treatment follow-up, and prevention pathways for pulmonary and extrapulmonary tuberculosis.',
    highlights: ['TB Diagnosis & Testing', 'Treatment & Follow-up', 'Preventive Screening'],
  },
  {
    id: 'orthopedics',
    specialty: 'Orthopedics',
    href: '/specialists/orthopedics',
    desc: 'Expert care for bone, joint, muscle, and spine conditions — from fractures and sports injuries to arthritis and rehabilitation.',
    highlights: ['Fracture & Trauma Care', 'Joint & Spine Care'],
  },
];

type SpecialistArt = {
  stroke: string;
  soft: string;
  ring: string;
  tagBg: string;
  grad: string;
  glow: string;
};

const ART: Record<string, SpecialistArt> = {
  gynecology: {
    stroke: '#e11d48',
    soft: '#ffe4e6',
    ring: 'rgba(225,29,72,0.3)',
    tagBg: 'rgba(225,29,72,0.14)',
    grad: 'from-rose-50 via-pink-50 to-rose-100/70',
    glow: 'rgba(225,29,72,0.3)',
  },
  pediatrics: {
    stroke: '#0d9488',
    soft: '#ccfbf1',
    ring: 'rgba(13,148,136,0.35)',
    tagBg: 'rgba(13,148,136,0.14)',
    grad: 'from-primary-50 via-teal-50 to-primary-100/70',
    glow: 'rgba(1,173,165,0.35)',
  },
  tuberculosis: {
    stroke: '#059669',
    soft: '#d1fae5',
    ring: 'rgba(5,150,105,0.3)',
    tagBg: 'rgba(5,150,105,0.14)',
    grad: 'from-emerald-50 via-teal-50 to-emerald-100/70',
    glow: 'rgba(5,150,105,0.3)',
  },
  orthopedics: {
    stroke: '#4338ca',
    soft: '#e0e7ff',
    ring: 'rgba(67,56,202,0.3)',
    tagBg: 'rgba(67,56,202,0.14)',
    grad: 'from-indigo-50 via-violet-50 to-indigo-100/70',
    glow: 'rgba(79,70,229,0.3)',
  },
};

const ART_MAP: Record<
  string,
  React.ComponentType<{ className?: string; stroke: string; soft: string }>
> = {
  gynecology: FlowerDrawing,
  pediatrics: BabyDrawing,
  tuberculosis: LungsDrawing,
  orthopedics: OrthoDrawing,
};

type PreviewDoctor = {
  id: string;
  name: string;
  specialization: string;
  qualification?: string;
  photo?: string;
};

export function DoctorsSection() {
  const [previewDoctors, setPreviewDoctors] = useState<PreviewDoctor[]>([]);
  const [previewLoaded, setPreviewLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Always seed with the static fallback so the section renders even
    // before the backend is up. The API will override if it responds.
    setPreviewDoctors(
      FALLBACK_DOCTORS.slice(0, 4).map((d) => ({
        id: String(d.id),
        name: String(d.name || ''),
        specialization: String(d.specialization || ''),
        qualification: d.qualification ? String(d.qualification) : undefined,
        photo: d.photo ? String(d.photo) : undefined,
      })),
    );
    (async () => {
      try {
        const res = await get<PaginatedResponse<Record<string, unknown>>>('doctors', {
          params: { page: 1, limit: 100, staffType: 'doctor', sortBy: 'name', sortOrder: 'asc' },
        });
        const rows = (res?.data ?? [])
          .slice(0, 4)
          .map((d) => ({
            id: String(d.id),
            name: String(d.name || ''),
            specialization: String(d.specialization || ''),
            qualification: d.qualification != null ? String(d.qualification) : undefined,
            photo: d.photo != null ? String(d.photo) : undefined,
          }));
        if (!cancelled && rows.length > 0) setPreviewDoctors(rows);
      } catch {
        /* keep fallback */
      } finally {
        if (!cancelled) setPreviewLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="section-padding relative overflow-hidden bg-neutral-50">
      {/* ambient clinical glows + medical texture */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 plus-pattern opacity-15" />
        <div className="absolute -top-24 right-1/4 h-80 w-96 rounded-full bg-primary-50 blur-3xl" />
        <div className="absolute bottom-0 left-[-4rem] h-72 w-96 rounded-full bg-rose-50/70 blur-3xl" />
        <div className="absolute top-1/2 right-[-4rem] h-72 w-80 rounded-full bg-emerald-50/60 blur-3xl" />
      </div>

      <div className="relative container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-14"
        >
          <span className="section-kicker mb-3">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Our Experts
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-3">
            Specialist Clinics
          </h2>
          <p className="text-neutral-500 max-w-xl mx-auto">
            Expert clinical care across our primary specialty departments, with experienced
            consultants and on-site lab support.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {specialists.map((spec, i) => {
            const Art = ART_MAP[spec.id] ?? FlowerDrawing;
            const art = ART[spec.id] ?? ART.gynecology;
            return (
              <motion.div
                key={spec.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="h-full"
              >
                <article
                  className="group relative h-full overflow-hidden rounded-3xl border border-white/80 bg-white/80 backdrop-blur-xl shadow-soft transition-all duration-500 hover:-translate-y-2 hover:border-neutral-200 hover:shadow-[0_28px_60px_-18px_var(--glow)]"
                  style={{ '--glow': art.glow } as React.CSSProperties}
                >
                  {/* illustration board */}
                  <div className={`relative overflow-hidden bg-gradient-to-br ${art.grad}`}>
                    <div className="absolute inset-0 plus-pattern opacity-30" />
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/50 blur-2xl" />
                    <span
                      className="pulse-ring absolute left-1/2 top-1/2 h-24 w-24 rounded-full border-2"
                      style={{ borderColor: art.ring }}
                    />
                    <span
                      className="pulse-ring absolute left-1/2 top-1/2 h-24 w-24 rounded-full border-2 anim-delay-2"
                      style={{ borderColor: art.ring }}
                    />
                    <div className="relative mx-auto flex h-44 w-44 items-center justify-center animate-float">
                      <Art
                        className="h-40 w-40 drop-shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-2"
                        stroke={art.stroke}
                        soft={art.soft}
                      />
                    </div>
                    {/* animated ECG trace */}
                    <svg
                      className="absolute inset-x-0 bottom-1 h-6 w-full"
                      viewBox="0 0 400 24"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M0 18 H112 L128 6 L148 22 L166 12 L182 18 H400"
                        fill="none"
                        stroke={art.stroke}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="60 15"
                        opacity="0.45"
                        className="animate-ecg-flow"
                      />
                    </svg>
                  </div>

                  {/* body */}
                  <div className="relative px-6 py-6">
                    <div className="mb-3 flex items-center justify-between">
                      <span
                        className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
                        style={{ background: art.tagBg, color: art.stroke }}
                      >
                        <span
                          className="inline-flex h-1.5 w-1.5 rounded-full"
                          style={{ background: art.stroke }}
                        />
                        Specialist
                      </span>
                      <span className="text-[11px] font-black tracking-wider text-neutral-300">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-xl text-neutral-900 mb-2 transition-colors duration-300 group-hover:text-primary-700">
                      {spec.specialty}
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed mb-4">{spec.desc}</p>

                    <ul className="space-y-2 mb-6">
                      {spec.highlights.map((h) => (
                        <li key={h} className="flex items-center gap-2.5 text-sm text-neutral-700">
                          <span
                            className="flex h-4 w-4 items-center justify-center rounded-full flex-shrink-0"
                            style={{ background: art.tagBg, color: art.stroke }}
                          >
                            <FiCheck className="w-2.5 h-2.5" />
                          </span>
                          {h}
                        </li>
                      ))}
                    </ul>

                    <div className="flex gap-2">
                      <Link
                        href={spec.href}
                        className="flex-1 inline-flex items-center justify-center gap-1 text-sm font-semibold text-neutral-700 border border-neutral-300/70 py-2 rounded-xl hover:bg-white hover:border-neutral-400 transition-colors"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/appointments/book?specialty=${encodeURIComponent(spec.specialty)}`}
                        className="flex-1 inline-flex items-center justify-center gap-1 text-sm font-semibold text-white py-2 rounded-xl transition-all duration-300 group-hover:brightness-110"
                        style={{ background: art.stroke }}
                      >
                        <FiCalendar className="w-3.5 h-3.5" />
                        Book Now
                      </Link>
                    </div>
                  </div>

                  {/* hover sheen */}
                  <div className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />
                </article>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/team"
            className="group inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-800 transition-colors"
          >
            Meet Our Full Medical Team
            <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
