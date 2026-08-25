'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Calendar,
  Phone,
  Stethoscope,
  Activity,
  Bone,
  ScanLine,
  HeartPulse,
  Sparkles,
  Wrench,
  Footprints,
} from 'lucide-react';
import { FiCalendar, FiPhone } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { get } from '@/lib/api';
import { VideoHeroBackground } from '@/components/ui/VideoHeroBackground';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CTAFooter } from '@/components/ui/CTAFooter';
import { IconTileList } from '@/components/ui/IconTileList';

const WHAT_IS_INCLUDED = [
  {
    icon: Stethoscope,
    title: 'Orthopedic Consultation',
    desc: 'Detailed history, posture and gait analysis, and joint-by-joint physical examination by an experienced orthopedic specialist.',
  },
  {
    icon: Bone,
    title: 'Digital X-Ray of Joints',
    desc: 'High-resolution digital X-ray of the affected joint or spine with radiologist interpretation included.',
  },
  {
    icon: ScanLine,
    title: 'Ultrasound (MSK)',
    desc: 'Musculoskeletal ultrasound to evaluate soft tissue, tendon and ligament injuries in real time.',
  },
  {
    icon: Activity,
    title: 'Bone Density (DEXA)',
    desc: 'DEXA scan for osteoporosis screening and fracture-risk assessment where clinically indicated.',
  },
  {
    icon: Footprints,
    title: 'Foot & Gait Analysis',
    desc: 'Plantar fasciitis and biomechanical assessment for heel, arch, and forefoot pain.',
  },
  {
    icon: HeartPulse,
    title: 'Lab Panel (Inflammatory)',
    desc: 'CRP, ESR, Uric Acid, RA factor, Calcium, Vitamin D — to detect underlying inflammatory or metabolic causes.',
  },
  {
    icon: Wrench,
    title: 'Treatment & Follow-up Plan',
    desc: 'Medication, physiotherapy plan, joint injections, or surgical opinion with structured follow-up monitoring.',
  },
];

const SYMPTOMS = [
  'Knee, hip or shoulder pain lasting 2+ weeks',
  'Difficulty walking, climbing stairs, or standing',
  'Stiffness and swelling around joints',
  'Frozen shoulder or restricted shoulder movement',
  'Heel pain (plantar fasciitis) worst in the morning',
  'Lower back pain with or without leg tingling',
  'Neck pain radiating to arms',
  'Sports-related sprain, strain, or tendon pain',
  'Arthritis flare-ups and chronic joint pain',
];

const TESTS_INCLUDED = [
  'Orthopedic Specialist Consultation',
  'Digital X-Ray (Affected Joint / Spine)',
  'Musculoskeletal Ultrasound (if needed)',
  'DEXA Bone Density Scan (osteoporosis screen)',
  'Complete Blood Count (CBC)',
  'CRP & ESR (inflammation markers)',
  'Uric Acid (gout screen)',
  'Rheumatoid Factor (RA screen)',
  'Vitamin D & Calcium',
  'Gait & Posture Assessment',
  'Personalized Treatment & Follow-up Plan',
];

const FAQS = [
  {
    q: 'When should I see an orthopedic doctor?',
    a: 'If you have joint, bone, or muscle pain that lasts more than 2 weeks, restricts daily activity, or follows an injury — it is worth a specialist review before it becomes chronic.',
  },
  {
    q: 'Do I need an X-ray on the first visit?',
    a: 'Most joint and spine evaluations benefit from a baseline digital X-ray. Your doctor will order the right imaging based on the affected area, not everything by default.',
  },
  {
    q: 'Is surgery always required?',
    a: 'No. Most orthopedic conditions are managed conservatively with medication, targeted physiotherapy, joint injections, and lifestyle changes. Surgery is considered only when conservative care fails.',
  },
  {
    q: 'Can I get a knee/hip injection here?',
    a: 'Yes — intra-articular injections (corticosteroid, viscosupplementation / hyaluronic acid) are performed in-clinic by our orthopedic team when indicated.',
  },
  {
    q: 'What is plantar fasciitis?',
    a: 'Plantar fasciitis is inflammation of the thick band of tissue (plantar fascia) that runs across the bottom of your foot. It causes stabbing heel pain, often worst with the first steps in the morning. Treatment is usually conservative with stretching, footwear advice, orthotics, and physiotherapy.',
  },
  {
    q: 'Do you treat frozen shoulder?',
    a: 'Yes. Frozen shoulder (adhesive capsulitis) is managed with a staged program of pain relief, gentle mobilization exercises, physiotherapy, and intra-articular injections when needed. Most patients recover with conservative care over weeks to months.',
  },
];

export default function OrthopedicsCheckupClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [packages, setPackages] = useState<
    { id: string; name: string; discountedPrice: number; tests: string[] }[]
  >([]);

  useEffect(() => {
    get<Array<Record<string, unknown>>>('packages?category=orthopedics')
      .then((rows) => {
        setPackages(
          (rows || []).map((p) => ({
            id: String(p.id),
            name: String(p.name || ''),
            discountedPrice: Number(p.discountedPrice ?? 0),
            tests: Array.isArray(p.tests) ? (p.tests as string[]) : [],
          })),
        );
      })
      .catch(() => setPackages([]));
  }, []);

  return (
    <main>
      {/* ── Hero ── */}
      <section className="py-20 md:py-28 bg-primary-950 text-white relative overflow-hidden">
        <VideoHeroBackground
          src="/videos/hero/orthopedics.mp4"
          poster="/videos/hero/orthopedics.jpg"
          overlayClassName="from-indigo-950/[0.88] via-primary-950/[0.66] to-blue-900/[0.42]"
        />
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-10 left-10 w-72 h-72 rounded-full bg-blue-300 blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 text-sm text-white/80 font-medium mb-5">
              <span className="text-lg">🦴</span> Orthopedics & Joint Care
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-5 leading-tight">
              Orthopedics <span className="text-teal-300">Check-up</span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed mb-7">
              Comprehensive orthopedic screening for joint pain, arthritis, sports injuries,
              plantar fasciitis, frozen shoulder, and spine complaints — with imaging, lab work,
              and a clear treatment plan.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/appointments/book?specialty=orthopedics&type=checkup"
                className="group inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_26px_-10px_rgba(0,42,40,0.8)] transition-all duration-300 hover:bg-primary-400"
              >
                <FiCalendar className="h-4 w-4" />
                Book Orthopedic Check-up
              </Link>
              <a
                href="tel:+977014533361"
                className="group inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/10"
              >
                <FiPhone className="h-4 w-4" />
                Call Orthopedic Desk
              </a>
            </div>
          </motion.div>

          {/* Quick stat strip */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl"
          >
            {[
              { label: 'Same-week slots', value: '7 days' },
              { label: 'Digital X-Ray', value: 'On-site' },
              { label: 'MSK Ultrasound', value: 'Available' },
              { label: 'Joint Injections', value: 'In-clinic' },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm px-4 py-3"
              >
                <p className="font-bold text-white text-lg leading-tight">{s.value}</p>
                <p className="text-[10px] text-white/60 uppercase tracking-wider mt-0.5">
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── What is included ── */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeader
            eyebrow="What's Inside"
            title="A complete orthopedic"
            highlight="evaluation"
            subtitle="From consultation to imaging, lab work and a clear follow-up plan — everything needed to understand your joint, bone or muscle pain."
            className="mb-12"
          />
          <IconTileList
            items={WHAT_IS_INCLUDED}
            category="orthopedic check-up included service"
            accent="indigo"
            className="mx-auto max-w-5xl"
          />
        </div>
      </section>

      {/* ── Conditions / symptoms we treat ── */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          <SectionHeader
            eyebrow="When To Book"
            title="Common signs you should"
            highlight="see an orthopedist"
            subtitle="If any of these sound familiar, an early orthopedic check-up can prevent chronic damage and speed up recovery."
            className="mb-12"
          />
          <IconTileList items={SYMPTOMS} category="orthopedic symptoms" accent="indigo" className="mx-auto max-w-5xl" />
        </div>
      </section>

      {/* ── Tests included ── */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeader
            eyebrow="Test Panel"
            title="What we"
            highlight="test & measure"
            subtitle="Standard panel included in the orthopedic check-up. Your doctor may add or remove tests based on your specific complaint."
            className="mb-10"
          />
          <IconTileList items={TESTS_INCLUDED} category="orthopedic tests included" accent="indigo" className="mx-auto max-w-5xl" />
        </div>
      </section>

      {/* ── Specialties & packages ── */}
      {packages.length > 0 && (
        <section className="section-padding bg-neutral-50">
          <div className="container-custom">
            <SectionHeader
              eyebrow="Available Packages"
              title="Pick the package that"
              highlight="fits your need"
              subtitle="All packages include 30% off and free doctor consultation."
              className="mb-10"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {packages.map((p) => (
                <Link
                  key={p.id}
                  href={`/appointments/book?package=${encodeURIComponent(p.name)}&amount=${p.discountedPrice}&type=package`}
                  className="group rounded-2xl border border-neutral-100 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(67,56,202,0.4)]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading font-bold text-neutral-900 group-hover:text-indigo-700">
                      {p.name}
                    </h3>
                    <Sparkles className="h-4 w-4 flex-shrink-0 text-indigo-500" />
                  </div>
                  <p className="mt-3 text-2xl font-extrabold text-indigo-700">
                    NPR {p.discountedPrice.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">{p.tests.length} tests included</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600">
                    Book Now →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQs ── */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <SectionHeader
            eyebrow="FAQs"
            title="Orthopedic"
            highlight="questions, answered"
            subtitle="Quick answers to the most common questions patients ask before booking."
            className="mb-10"
          />
          <div className="space-y-3">
            {FAQS.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={f.q}
                  className={cn(
                    'rounded-2xl border transition-all duration-300',
                    isOpen
                      ? 'border-indigo-200 bg-indigo-50/40 shadow-sm'
                      : 'border-neutral-200 bg-white',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-neutral-900">{f.q}</span>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 flex-shrink-0 text-neutral-500 transition-transform',
                        isOpen && 'rotate-180 text-indigo-600',
                      )}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 text-sm text-neutral-600 leading-relaxed">
                          {f.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CTAFooter
        title="Joint or bone pain"
        highlight="not going away?"
        subtitle="Book an orthopedic check-up — same-week slots available with our specialist team. Walk into our Bhimselgola-9 clinic or call to schedule."
        actions={[
          {
            label: 'Book Check-up',
            href: '/appointments/book?specialty=orthopedics&type=checkup',
            icon: <FiCalendar className="h-4 w-4" />,
          },
          { label: 'Call Now', href: 'tel:+977014533361' },
        ]}
      />
    </main>
  );
}
