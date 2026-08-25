'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Pencil, ChevronDown, Calendar, Phone, Stethoscope, Scan, ClipboardList, Droplets, TestTube, HeartPulse } from 'lucide-react';
import { FiCalendar, FiPhone } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { get } from '@/lib/api';
import { VideoHeroBackground } from '@/components/ui/VideoHeroBackground';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CTAFooter } from '@/components/ui/CTAFooter';
import { IconTileList } from '@/components/ui/IconTileList';
import { PackageSelectionSection, normalizePackageRecord, type PackageSelectionPackage } from '@/components/packages/PackageSelectionSection';

const WHAT_IS_INCLUDED = [
  { icon: Stethoscope, title: 'Clinical Consultation', desc: 'Detailed medical history review, lifestyle assessment, and physical examination by a senior gynaecologist.' },
  { icon: Scan, title: 'Pelvic Examination', desc: 'Bimanual pelvic exam and speculum examination to assess uterine and ovarian health.' },
  { icon: ClipboardList, title: 'PAP Smear / LBC', desc: 'Cervical cytology screening for early detection of abnormal cells or HPV-related changes.' },
  { icon: Droplets, title: 'Hormonal Blood Panel', desc: 'FSH, LH, Estradiol, Progesterone, TSH, Prolactin — comprehensive reproductive hormone assessment.' },
  { icon: TestTube, title: 'General Lab Tests', desc: 'CBC, Blood Sugar, Lipid Profile, LFT, RFT, Urine Routine — full wellness baseline.' },
  { icon: FileText, title: 'Report & Counseling', desc: 'Physician review of all results with personalized health recommendations and follow-up plan.' },
];

const RECOMMENDED_FOR = [
  'Annual wellness check for women aged 20+',
  'Irregular or painful menstrual cycles',
  'PCOS / PCOD symptoms (weight gain, acne, hair loss)',
  'Pre-conception and fertility evaluation',
  'Post-delivery (postnatal) follow-up',
  'Menopausal symptom assessment',
  'Abnormal vaginal discharge or pelvic pain',
  'Pre-marital health screening',
];

const TESTS_INCLUDED = [
  'PAP Smear / Liquid-Based Cytology (LBC)',
  'FSH, LH, Estradiol (E2)',
  'Progesterone, Prolactin',
  'Anti-Müllerian Hormone (AMH)',
  'TSH, Free T3, Free T4',
  'Complete Blood Count (CBC)',
  'Fasting Blood Sugar',
  'Lipid Profile',
  'Liver Function Test (LFT)',
  'Kidney Function Test (RFT)',
  'Urine Routine Examination',
];

const FAQS = [
  { q: 'Do I need to fast before the check-up?', a: 'Yes, we recommend 8–10 hours of fasting for accurate blood sugar and lipid test results. You may drink water.' },
  { q: 'When is the best time in my cycle to visit?', a: 'For hormonal tests (FSH, LH, Estradiol), Day 2–5 of your cycle is ideal. PAP smear is best mid-cycle. Call us and we can advise based on your specific tests.' },
  { q: 'Is the pelvic exam uncomfortable?', a: 'Our gynaecologists ensure a comfortable, dignified experience. Let our team know of any concerns beforehand and we will adjust accordingly.' },
  { q: 'How long does the check-up take?', a: 'Approximately 45–90 minutes including consultation, sample collection, and any imaging.' },
  { q: 'When will I receive my report?', a: 'Most results are available same day or within 24–48 hours. Your doctor will schedule a report review session.' },
];

export default function GynecologyCheckupPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [packages, setPackages] = useState<PackageSelectionPackage[]>([]);

  useEffect(() => {
    get<Array<Record<string, unknown>>>('packages?category=gynecology')
      .then((rows) => {
        setPackages(
          (rows || []).map((p) => normalizePackageRecord(p, 'gynecology')),
        );
      })
      .catch(() => setPackages([]));
  }, []);

  return (
    <main>
      {/* ── Hero ── */}
      <section className="py-20 md:py-28 bg-primary-950 text-white relative overflow-hidden">
        <VideoHeroBackground
          src="/videos/hero/gynecology-ultrasound.mp4"
          poster="/videos/hero/gynecology-ultrasound.jpg"
          overlayClassName="from-rose-950/[0.88] via-primary-950/[0.66] to-pink-900/[0.42]"
        />
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-10 left-10 w-72 h-72 rounded-full bg-pink-300 blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 text-sm text-white/80 font-medium mb-5">
              <span className="text-lg">♀</span> Women&apos;s Health Clinic
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-5 leading-tight">
              Gynecology Check-up
            </h1>
            <p className="text-rose-50/90 text-lg max-w-2xl leading-relaxed">
              Comprehensive women&apos;s reproductive health screening combining clinical consultation, 
              hormonal profiling, cervical screening, and imaging — all in one visit.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                href="/appointments/book?specialty=gynecology-obstetrics&type=checkup"
                className="inline-flex items-center gap-2 bg-white text-neutral-900 font-bold px-6 py-3 rounded-xl hover:bg-neutral-100 transition-colors shadow-lg"
              >
                <FiCalendar className="w-4 h-4" />
                Book Check-up
              </Link>
              <a
                href="tel:+977014533361"
                className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/25 transition-colors"
              >
                <FiPhone className="w-4 h-4" />
                Call +977 01-4533361
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Image gallery strip ── */}
      <section className="bg-white border-b border-neutral-100">
        <div className="container-custom py-8">
          <div className="grid grid-cols-3 gap-3 max-h-52 overflow-hidden rounded-2xl">
            {[
              'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&q=80',
              'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&q=80',
              'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=80',
            ].map((src, i) => (
              <div key={i} className="relative overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="Gynecology care" className="w-full h-52 object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's included ── */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SectionHeader
              eyebrow="Full Program"
              title="What's"
              highlight="Included"
              subtitle="Every visit is structured to give you a complete picture of your reproductive and overall health."
            />
          </motion.div>

          <IconTileList
            items={WHAT_IS_INCLUDED}
            category="gynecology check-up included service"
            accent="rose"
            className="mx-auto max-w-5xl"
          />
        </div>
      </section>

      {/* ── Tests + Recommended For ── */}
      <section className="section-padding relative overflow-hidden bg-neutral-50">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 plus-pattern-light opacity-40" />
          <div className="absolute -top-24 left-1/4 h-72 w-96 rounded-full bg-rose-50 blur-3xl" />
          <div className="absolute bottom-0 right-[-4rem] h-64 w-80 rounded-full bg-teal-50/60 blur-3xl" />
        </div>
        <div className="relative container-custom">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Tests */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 shadow-sm">
                  <TestTube className="h-5 w-5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-rose-600">Laboratory</span>
              </div>
              <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-6">Tests Included</h2>
              <IconTileList items={TESTS_INCLUDED} category="gynecology laboratory tests" accent="rose" layout="list" />
            </motion.div>

            {/* Recommended for */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-pink-600 shadow-sm">
                  <HeartPulse className="h-5 w-5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-pink-600">Who Should Get This</span>
              </div>
              <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-6">Recommended For</h2>
              <IconTileList items={RECOMMENDED_FOR} category="gynecology recommendations" accent="rose" layout="list" />
            </motion.div>
          </div>
        </div>
      </section>

      <PackageSelectionSection
        packages={packages}
        specialty="gynecology"
        specialtyLabel="women's health care"
        bookingHref="/appointments/book?specialty=gynecology-obstetrics&type=checkup"
        accent="rose"
        emptyMessage="No gynecology packages are published yet. Add them in the admin panel under Packages."
      />

      {/* ── FAQ ── */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="inline-block bg-rose-50 text-rose-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
              FAQ
            </span>
            <h2 className="text-3xl font-heading font-bold text-neutral-900">Common Questions</h2>
          </motion.div>
          <div className="space-y-3">
            {FAQS.map((item, i) => (
              <div key={item.q} className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setOpenFaq((p) => (p === i ? null : i))}
                  className="w-full flex items-center justify-between text-left px-6 py-4 font-semibold text-neutral-800 hover:text-rose-700 transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={cn('w-5 h-5 flex-shrink-0 ml-3 transition-transform', openFaq === i && 'rotate-180 text-rose-600')} />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-neutral-600 text-sm leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CTAFooter
        tone="dark"
        title="Ready for your"
        highlight="check-up?"
        subtitle="Prioritize your health today. Same-day and next-day appointments are available."
        actions={[
          { label: 'Book Gynecology Check-up', href: '/appointments/book?specialty=gynecology-obstetrics&type=checkup', icon: <Calendar className="h-4 w-4" /> },
          { label: 'Call Us', href: 'tel:+977014533361' },
        ]}
      />
    </main>
  );
}
