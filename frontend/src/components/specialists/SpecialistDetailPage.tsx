'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiChevronDown, FiCalendar } from 'react-icons/fi';
import { get, PaginatedResponse } from '@/lib/api';
import { DoctorCard } from '@/components/ui/DoctorCard';
import { VideoHeroBackground } from '@/components/ui/VideoHeroBackground';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CTAFooter } from '@/components/ui/CTAFooter';
import { DoctorDetailModal, type DoctorDetailData } from '@/components/specialists/DoctorDetailModal';
import { FlowerDrawing, BabyDrawing, LungsDrawing } from '@/components/home/SpecialistArtworks';
import { JsonLd } from '@/components/seo/JsonLd';
import { IconTileList } from '@/components/ui/IconTileList';
import type { SpecialistPageData, FallbackDoctor } from '@/lib/specialist-data';
import { BRAND } from '@/lib/brand';

/* Slug → specialty doodle mapping (homepage clinical motif) */
const SPECIALTY_ART: Record<
  string,
  { Artwork: (p: { className?: string; stroke: string; soft: string }) => JSX.Element; stroke: string; soft: string }
> = {
  'gynecology-obstetrics': { Artwork: FlowerDrawing, stroke: '#e11d48', soft: '#ffe4e6' },
  pediatrics: { Artwork: BabyDrawing, stroke: '#0d9488', soft: '#ccfbf1' },
  tuberculosis: { Artwork: LungsDrawing, stroke: '#059669', soft: '#d1fae5' },
};

type ApiDoctor = {
  id: string;
  name: string;
  specialization: string;
  qualification?: string;
  bio?: string;
  photo?: string;
  experience?: number;
  phone?: string;
  availableDays?: string;
};

function toDoctorCardProps(d: ApiDoctor | FallbackDoctor, slug: string) {
  return {
    id: d.id,
    name: d.name,
    specialization: d.specialization,
    qualification: d.qualification || 'Specialist',
    experience: 'experience' in d ? d.experience : undefined,
    rating: 'rating' in d ? d.rating : 4.8,
    availableDays: 'availableDays' in d ? d.availableDays : undefined,
    bio: 'bio' in d ? d.bio : undefined,
    phone: 'phone' in d ? d.phone : undefined,
    isTopRated: 'isTopRated' in d ? d.isTopRated : false,
    images: [],
    bookingHref: `/appointments/book?specialty=${slug}&doctor=${encodeURIComponent(d.name)}`,
  };
}

export function SpecialistDetailPage({
  slug,
  data,
}: {
  slug: string;
  data: SpecialistPageData;
}) {
  const [apiDoctors, setApiDoctors] = useState<ApiDoctor[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [apiLoaded, setApiLoaded] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorDetailData | null>(null);

  function openDoctorModal(d: ApiDoctor | FallbackDoctor, images: string[]) {
    setSelectedDoctor({
      name: d.name,
      specialization: d.specialization,
      qualification: d.qualification || 'Specialist',
      experience: 'experience' in d ? d.experience : undefined,
      rating: 'rating' in d ? (d as FallbackDoctor).rating : 4.8,
      availableDays: 'availableDays' in d ? (d as FallbackDoctor).availableDays : undefined,
      bio: d.bio,
      phone: 'phone' in d ? (d as FallbackDoctor).phone : '+977 01-4533361',
      isTopRated: 'isTopRated' in d ? !!(d as FallbackDoctor).isTopRated : false,
      images,
      bookingHref: `/appointments/book?doctor=${encodeURIComponent(d.name)}&specialty=${encodeURIComponent(slug)}`,
      highlights: [d.specialization, d.qualification || ''].filter(Boolean),
    });
  }

  useEffect(() => {
    get<PaginatedResponse<ApiDoctor>>('doctors', {
      params: { page: 1, limit: 50, sortBy: 'name', sortOrder: 'asc' },
    })
      .then((res) => { setApiDoctors(res.data || []); })
      .catch(() => setApiDoctors([]))
      .finally(() => setApiLoaded(true));
  }, []);

  const slugKeywords = useMemo(() => slug.split('-'), [slug]);

  const filteredApiDoctors = useMemo(
    () =>
      apiDoctors.filter((d) =>
        slugKeywords.some((kw) => d.specialization.toLowerCase().includes(kw))
      ),
    [apiDoctors, slugKeywords]
  );

  // Use real API doctors if found, otherwise use rich fallback data
  const displayDoctors = apiLoaded && filteredApiDoctors.length
    ? filteredApiDoctors.map((d) => toDoctorCardProps(d, slug))
    : data.fallbackDoctors.map((d) => toDoctorCardProps(d, slug));

  const art = SPECIALTY_ART[slug] ?? SPECIALTY_ART['gynecology-obstetrics'];

  const physicianSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalSpecialty',
    name: data.heading,
    description: data.description,
    areaServed: 'Kathmandu, Nepal',
    provider: {
      '@type': 'MedicalOrganization',
      name: BRAND.name,
      url: BRAND.siteUrl,
    },
  };

  return (
    <>
      <DoctorDetailModal doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} />
      <JsonLd data={physicianSchema} />

      {/* ── Hero banner ── */}
      <section className="relative flex min-h-[440px] items-center overflow-hidden bg-primary-950 py-16 text-white md:min-h-[500px] md:py-20">
        <VideoHeroBackground
          src={data.heroVideo.src}
          poster={data.heroVideo.poster}
          overlayClassName="from-primary-950/[0.88] via-primary-900/[0.66] to-primary-700/[0.42]"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.12),transparent_32%),radial-gradient(circle_at_10%_90%,rgba(45,212,191,0.12),transparent_30%)]" />
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-3xl"
          >
            <div className="mb-5 inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 text-sm font-medium text-white/90 border border-white/15">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
                <art.Artwork className="h-5 w-5" stroke="#ffffff" soft="#ffffff" />
              </span>
              Specialist Clinic
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 leading-tight">
              {data.heading}
            </h1>
            <p className="text-white/85 text-base md:text-lg max-w-2xl leading-relaxed">{data.intro}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/appointments/book?specialty=${slug}`}
                className="inline-flex items-center gap-2 bg-white text-neutral-900 font-bold px-6 py-3 rounded-xl hover:bg-neutral-100 transition-colors shadow-lg"
              >
                <FiCalendar className="w-4 h-4" />
                Book Appointment
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/25 transition-colors"
              >
                Call Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Conditions treated ── */}
      <section className="section-padding border-b border-neutral-100 bg-white">
        <div className="container-custom">
          <SectionHeader
            eyebrow="What We Treat"
            title="Conditions"
            highlight="we care for"
            subtitle="A focused list of the concerns our specialists regularly support."
            className="mb-8"
          />
          <IconTileList
            items={data.conditions}
            category={`${data.heading} conditions`}
            accent="teal"
            className="mx-auto max-w-5xl"
          />
        </div>
      </section>

      {/* ── Doctors grid ── */}
      <section className="section-padding border-b border-neutral-100 bg-neutral-50/80">
        <div className="container-custom">
          <SectionHeader
            eyebrow="Our Team"
            title={`${data.heading}`}
            highlight="specialists"
            subtitle="Our experienced consultants are available for in-person and online appointments. Click Book Now to reserve your slot."
            className="mb-8"
          />

          {!apiLoaded ? (
            /* Skeleton loader */
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2].map((n) => (
                <div key={n} className="overflow-hidden rounded-2xl border border-neutral-200/70 bg-white animate-pulse">
                  <div className="h-52 bg-neutral-100" />
                  <div className="space-y-3 p-5">
                    <div className="h-5 bg-neutral-200 rounded w-2/3" />
                    <div className="h-4 bg-neutral-200 rounded w-1/2" />
                    <div className="h-4 bg-neutral-200 rounded w-3/4" />
                    <div className="h-10 bg-neutral-200 rounded-xl mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            displayDoctors.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {displayDoctors.map((doc) => {
                const rawDoc = apiLoaded && filteredApiDoctors.length
                  ? filteredApiDoctors.find((d) => d.id === doc.id) as ApiDoctor | undefined
                  : data.fallbackDoctors.find((d) => d.id === doc.id) as FallbackDoctor | undefined;
                return (
                  <DoctorCard
                    key={doc.id}
                    images={[]}
                    name={doc.name}
                    specialization={doc.specialization}
                    qualification={doc.qualification}
                    experience={doc.experience}
                    rating={doc.rating}
                    availableDays={doc.availableDays}
                    bio={doc.bio}
                    phone={doc.phone}
                    isTopRated={doc.isTopRated}
                    bookingHref={doc.bookingHref}
                    onViewProfile={rawDoc ? () => openDoctorModal(rawDoc, []) : undefined}
                  />
                );
              })}
            </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-10 text-center">
                <p className="font-heading text-lg font-semibold text-neutral-800">Specialist profiles are being updated.</p>
                <p className="mt-2 text-sm text-neutral-500">Please call the clinic to book this service.</p>
                <a href="tel:+977014533361" className="mt-5 inline-flex rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700">
                  Call the clinic
                </a>
              </div>
            )
          )}
        </div>
      </section>

      {/* ── Procedures ── */}
      <section className="section-padding border-b border-neutral-100 bg-white">
        <div className="container-custom">
          <SectionHeader
            eyebrow="What We Offer"
            title="Procedures"
            highlight="& Tests"
            subtitle="Everything we provide within this specialty — all under one roof."
            className="mb-8"
          />
          <IconTileList
            items={data.procedures}
            category={`${data.heading} procedures and tests`}
            accent="teal"
            className="mx-auto max-w-5xl"
          />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section-padding bg-neutral-50/80">
        <div className="container-custom max-w-3xl">
          <SectionHeader
            eyebrow="FAQ"
            title="Frequently Asked"
            highlight="Questions"
            subtitle="Answers to the questions patients ask us most often."
            className="mb-8"
          />

          <div className="space-y-3">
            {data.faq.map((item, index) => (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.07 }}
                className="group overflow-hidden rounded-2xl border border-neutral-200/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-200/70 hover:shadow-[0_16px_36px_-18px_rgba(1,173,165,0.45)]"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq((prev) => (prev === index ? null : index))}
                  className="w-full flex items-center justify-between text-left px-6 py-4 font-semibold text-neutral-800 hover:text-primary-700 transition-colors"
                >
                  <span>{item.q}</span>
                  <FiChevronDown
                    className={`w-5 h-5 flex-shrink-0 ml-3 transition-transform duration-200 ${
                      openFaq === index ? 'rotate-180 text-primary-600' : 'text-neutral-400'
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-neutral-600 leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CTAFooter
        tone="dark"
        title="Need Expert"
        highlight="Consultation?"
        subtitle={`Book an appointment with our ${data.heading.toLowerCase()} team today. Same-day slots are often available.`}
        actions={[
          { label: 'Book Appointment', href: `/appointments/book?specialty=${slug}`, icon: <FiCalendar className="h-4 w-4" /> },
          { label: 'Contact Us', href: '/contact' },
        ]}
      />
    </>
  );
}
