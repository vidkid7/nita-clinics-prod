'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Calendar, Phone, Ruler, Syringe, Droplets, Brain, Smile, Baby, HeartPulse } from 'lucide-react';
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
  { icon: Ruler, title: 'Growth Assessment', desc: 'Height, weight, BMI, and head circumference plotted against WHO growth standards for the child\'s age.' },
  { icon: Syringe, title: 'Vaccination Review', desc: 'Review of current immunization record; catch-up planning and administration of due vaccines per national schedule.' },
  { icon: Droplets, title: 'Blood Tests', desc: 'CBC, blood sugar, iron studies, Vitamin D, B12, and calcium — identifying nutritional gaps early.' },
  { icon: Brain, title: 'Developmental Screening', desc: 'Age-appropriate milestones assessed: motor skills, speech, cognitive development, and behavioural patterns.' },
  { icon: Smile, title: 'Oral Health Check', desc: 'Basic dental hygiene assessment and referral for advanced dental care if required.' },
];

const AGE_GROUPS = [
  { label: 'Newborn (0–1 month)', focus: 'Neonatal assessment, jaundice check, feeding evaluation, weight monitoring' },
  { label: 'Infant (1–12 months)', focus: 'Developmental milestones, vaccination schedule, growth monitoring, nutrition' },
  { label: 'Toddler (1–3 years)', focus: 'Language development, motor skills, iron deficiency screening, vaccine catch-up' },
  { label: 'Pre-school (3–6 years)', focus: 'School readiness, behavioural assessment, vision & hearing, dental hygiene' },
  { label: 'School Age (6–12 years)', focus: 'Academic performance concerns, allergies, weight management, sports health' },
  { label: 'Adolescent (12–18 years)', focus: 'Puberty concerns, mental health, BMI, anaemia, HPV vaccine counselling' },
];

const TESTS_INCLUDED = [
  'Complete Blood Count (CBC)',
  'Fasting Blood Sugar',
  'Iron Studies (Serum Iron, Ferritin, TIBC)',
  'Vitamin D (25-OH)',
  'Vitamin B12',
  'Calcium & Phosphorus',
  'Urine Routine Examination',
  'Stool Routine (if indicated)',
  'Thyroid Function (TSH) — for adolescents',
  'Vaccination Status Review',
];

const FAQS = [
  { q: 'At what age should I bring my child for a check-up?', a: 'We recommend a check-up at every major milestone: 1, 2, 4, 6, 9, 12 months in the first year, then annually from age 2 onwards. Earlier if you have concerns.' },
  { q: 'Does my child need to fast for blood tests?', a: 'For blood sugar tests, 4–6 hours of fasting is sufficient for children. Infants under 6 months do not need to fast. Our team will advise based on the specific panel.' },
  { q: 'What vaccines are given during the check-up?', a: 'We administer any due vaccines from the national immunization program, including catch-up doses. We also offer travel and additional vaccines like HPV, Varicella, and Typhoid.' },
  { q: 'Can I get a health certificate for school admission?', a: 'Yes. A formal health certificate signed by our paediatrician is available as part of the check-up, or as a standalone service.' },
  { q: 'My child is afraid of needles — what do you recommend?', a: 'Our team is trained in child-friendly care. We use topical numbing gel, distraction techniques, and take extra time to reassure children before any procedures.' },
];

export default function PediatricsCheckupPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [packages, setPackages] = useState<PackageSelectionPackage[]>([]);

  useEffect(() => {
    get<Array<Record<string, unknown>>>('packages?category=pediatrics')
      .then((rows) => {
        setPackages(
          (rows || []).map((p) => normalizePackageRecord(p, 'pediatrics')),
        );
      })
      .catch(() => setPackages([]));
  }, []);

  return (
    <main>
      {/* ── Hero ── */}
      <section className="py-20 md:py-28 bg-primary-950 text-white relative overflow-hidden">
        <VideoHeroBackground
          src="/videos/hero/pediatric-stethoscope.mp4"
          poster="/videos/hero/pediatric-stethoscope.jpg"
          overlayClassName="from-primary-950/[0.88] via-primary-900/[0.66] to-sky-900/[0.42]"
        />
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-10 left-10 w-72 h-72 rounded-full bg-primary-300 blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 text-sm text-white/80 font-medium mb-5">
              <span className="text-lg">👶</span> Child Health Clinic
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-5 leading-tight">
              Pediatrics Check-up
            </h1>
            <p className="text-primary-50/90 text-lg max-w-2xl leading-relaxed">
              Structured wellness visits for newborns through adolescents — covering growth, 
              nutrition, vaccination, developmental screening, and school health certification.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                href="/appointments/book?specialty=pediatrics&type=checkup"
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

      {/* ── Image gallery ── */}
      <section className="bg-white border-b border-neutral-100">
        <div className="container-custom py-8">
          <div className="grid grid-cols-3 gap-3 max-h-52 overflow-hidden rounded-2xl">
            {[
              'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&q=80',
              'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&q=80',
              'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80',
            ].map((src, i) => (
              <div key={i} className="overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="Pediatric care" className="w-full h-52 object-cover" />
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
              subtitle="A complete child health journey — growth, immunity, development, and readiness for school."
            />
          </motion.div>
          <IconTileList
            items={WHAT_IS_INCLUDED}
            category="pediatrics check-up included service"
            accent="teal"
            className="mx-auto max-w-5xl"
          />
        </div>
      </section>

      {/* ── Age groups + Tests ── */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Age groups */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600 shadow-sm">
                  <Baby className="h-5 w-5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-teal-600">Age Groups</span>
              </div>
              <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-6">Programs by Age</h2>
              <IconTileList
                items={AGE_GROUPS.map((grp) => ({ title: grp.label, description: grp.focus, category: 'pediatric age group' }))}
                accent="teal"
                layout="list"
              />
            </motion.div>

            {/* Tests */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600 shadow-sm">
                  <Droplets className="h-5 w-5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-teal-600">Laboratory</span>
              </div>
              <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-6">Tests Included</h2>
              <IconTileList items={TESTS_INCLUDED} category="pediatrics laboratory tests" accent="teal" layout="list" />
            </motion.div>
          </div>
        </div>
      </section>

      <PackageSelectionSection
        packages={packages}
        specialty="pediatrics"
        specialtyLabel="child health care"
        bookingHref="/appointments/book?specialty=pediatrics&type=checkup"
        accent="teal"
        emptyMessage="No pediatrics packages are published yet. Add them in the admin panel under Packages."
      />

      {/* ── FAQ ── */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SectionHeader
              eyebrow="FAQ"
              title="Common"
              highlight="Questions"
            />
          </motion.div>
          <div className="space-y-3">
            {FAQS.map((item, i) => (
              <div key={item.q} className="group rounded-2xl border border-neutral-200/70 bg-white overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-200/70 hover:shadow-[0_16px_36px_-18px_rgba(13,148,136,0.45)]">
                <button
                  type="button"
                  onClick={() => setOpenFaq((p) => (p === i ? null : i))}
                  className="w-full flex items-center justify-between text-left px-6 py-4 font-semibold text-neutral-800 hover:text-primary-700 transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={cn('w-5 h-5 flex-shrink-0 ml-3 transition-transform', openFaq === i && 'rotate-180 text-primary-600')} />
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
        title="Give your child the"
        highlight="best start"
        subtitle="Early screening and preventive care set the foundation for lifelong health."
        actions={[
          { label: 'Book Pediatrics Check-up', href: '/appointments/book?specialty=pediatrics&type=checkup', icon: <Calendar className="h-4 w-4" /> },
          { label: 'Call Us', href: 'tel:+977014533361' },
        ]}
      />
    </main>
  );
}
