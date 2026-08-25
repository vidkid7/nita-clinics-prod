'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiAward, FiUsers, FiTarget, FiHeart, FiMapPin, FiCheck, FiArrowRight } from 'react-icons/fi';
import { PremiumLandingHero } from '@/components/ui/PremiumLandingHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CTAFooter } from '@/components/ui/CTAFooter';
import { motion } from 'framer-motion';

const values = [
  {
    icon: FiAward,
    title: 'Quality Care',
    description: 'We maintain high standards in clinical treatment and patient care.',
    tile: 'bg-primary-50 text-primary-600',
    bar: 'from-primary-400 to-primary-600',
    trace: 'rgba(1,173,165,0.5)',
    glow: 'rgba(1,173,165,0.3)',
    dot: 'bg-primary-500',
  },
  {
    icon: FiUsers,
    title: 'Expert Team',
    description: 'Our experienced specialists and staff work together for your health.',
    tile: 'bg-emerald-50 text-emerald-600',
    bar: 'from-emerald-400 to-emerald-600',
    trace: 'rgba(16,185,129,0.5)',
    glow: 'rgba(16,185,129,0.3)',
    dot: 'bg-emerald-500',
  },
  {
    icon: FiTarget,
    title: 'Modern Technology',
    description: 'We use modern lab and treatment equipment.',
    tile: 'bg-amber-50 text-amber-600',
    bar: 'from-amber-400 to-amber-600',
    trace: 'rgba(245,158,11,0.5)',
    glow: 'rgba(245,158,11,0.3)',
    dot: 'bg-amber-500',
  },
  {
    icon: FiHeart,
    title: 'Patient First',
    description: 'Your comfort and satisfaction is our top priority.',
    tile: 'bg-rose-50 text-rose-600',
    bar: 'from-rose-400 to-rose-600',
    trace: 'rgba(244,63,94,0.5)',
    glow: 'rgba(244,63,94,0.3)',
    dot: 'bg-rose-500',
  },
];

const services = [
  'Specialist Consultations',
  'Lab & Service Testing',
  'Check-up Packages',
  'Vaccination Services',
  'Preventive Care',
  'Health Card Benefits',
  'Follow-up and Monitoring',
  'General Outpatient Care',
];

export default function AboutPage() {
  const [mainImage, setMainImage] = useState('/images/team.jpg');
  const [clinicImages, setClinicImages] = useState([
    '/images/clinic-1.jpg',
    '/images/clinic-2.jpg',
    '/images/clinic-3.jpg',
    '/images/clinic-4.jpg',
  ]);

  useEffect(() => {
    // Load images from API
    const loadImages = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const fullUrl = `${apiUrl}/api/v1`;
        
        const mainResponse = await fetch(`${fullUrl}/content/page/about/main`);
        
        if (mainResponse.ok) {
          const data = await mainResponse.json();
          
          if (data?.content?.imagePath) {
            setMainImage(data.content.imagePath);
          }
        }

        const servicesResponse = await fetch(`${fullUrl}/content/page/about/services-overview`);
        
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          
          if (servicesData?.content?.imagePaths && Array.isArray(servicesData.content.imagePaths)) {
            setClinicImages(servicesData.content.imagePaths);
          }
        }
      } catch (error) {
        console.error('Failed to load images', error);
        // Continue with default images
      }
    };

    loadImages();
  }, []);
  return (
    <>
      <PremiumLandingHero
        eyebrow="About NITA Clinic · Kathmandu"
        title="Specialist care with a"
        highlight="human, organized touch."
        description="NITA Clinic brings consultations, lab tests, preventive check-ups, vaccination, and follow-up support together in one trusted healthcare destination."
        videoSrc="/videos/hero/clinic-consultation.mp4"
        posterSrc="/videos/hero/clinic-consultation.jpg"
        overlayClassName="from-primary-950/[0.88] via-primary-900/[0.66] to-teal-900/[0.42]"
        actions={[
          { label: 'Book Appointment', href: '/appointments/book' },
          { label: 'Contact Clinic', href: '/contact', variant: 'secondary' },
        ]}
        trustPoints={[
          'Experienced specialist team',
          'Modern lab workflow',
          'Patient-first clinical support',
          'Convenient Kathmandu location',
        ]}
        stats={[
          { value: '10+ yrs', label: 'Care Experience' },
          { value: '15k+', label: 'Patients Served' },
          { value: 'One roof', label: 'Consults, Labs & Care' },
        ]}
        panelEyebrow="Our Approach"
        panelTitle="Healthcare that feels clear from the first step."
        panelItems={[
          'Listen carefully, explain clearly, and guide patients through the right next step.',
          'Coordinate specialist visits, lab tests, vaccination, and preventive care together.',
          'Keep the clinic experience calm, respectful, and easy for families to navigate.',
        ]}
      />

      {/* Main Content */}
      <section className="section-padding relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 plus-pattern-light opacity-40" />
          <div className="absolute -top-24 left-1/4 h-80 w-96 rounded-full bg-primary-50 blur-3xl" />
          <div className="absolute bottom-0 right-[-5rem] h-72 w-96 rounded-full bg-emerald-50/70 blur-3xl" />
        </div>

        <div className="relative container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* clinical image frame */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/60 aspect-[4/3]">
                <Image
                  src={mainImage}
                  alt="Nita Clinic team"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/50 via-transparent to-transparent" />
                <div className="absolute inset-0 plus-pattern opacity-20 mix-blend-soft-light" />
                {/* ECG trace */}
                <svg
                  className="absolute inset-x-0 top-0 h-12 w-full"
                  viewBox="0 0 600 48"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M0 34 H150 L170 14 L190 38 L210 20 L228 34 H600"
                    fill="none"
                    stroke="#5de1d8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="100 20"
                    className="animate-ecg-flow"
                    opacity="0.9"
                  />
                </svg>
                {/* live badge */}
                <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-primary-950/55 backdrop-blur-md border border-white/15 px-3 py-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/90">Est. Kathmandu</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <SectionHeader
                align="left"
                eyebrow="Our Story"
                title="Healthcare that feels"
                highlight="human, organized."
                className="mb-8"
              />
              <p className="text-neutral-600 mb-4">
                Nita Clinic was established with a vision to provide accessible,
                affordable, and quality healthcare services to the people of Kathmandu.
              </p>
              <p className="text-neutral-600 mb-4">
                Our clinic is equipped with modern lab equipment and follows international
                standards of sterilization and hygiene. We believe in providing personalized 
                care to each patient, understanding their unique needs and concerns.
              </p>
              <p className="text-neutral-600 mb-6">
                From routine check-ups to specialized consultations and preventive care,
                our experienced team is here to support your long-term health.
              </p>

              {/* Visit Us — clinical ward card */}
              <div className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-neutral-200/70 bg-white p-4 pr-14 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_18px_40px_-16px_rgba(1,173,165,0.4)]">
                <span className="absolute inset-x-0 top-0 h-[3px] rounded-b-full bg-gradient-to-r from-transparent via-primary-400/70 to-transparent opacity-0 group-hover:opacity-100" />
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 shadow-lg">
                  <FiMapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-neutral-900">Visit Us</p>
                  <p className="text-neutral-500 text-sm">Kathmandu, Nepal</p>
                </div>
                <span className="absolute right-4 top-3 text-[10px] font-bold tabular-nums tracking-widest text-neutral-300">01</span>
                <svg className="absolute inset-x-4 bottom-0 h-2.5 w-[calc(100%-2rem)] opacity-25" viewBox="0 0 200 10" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0 7 H60 L68 2 L76 9 L82 4 L88 7 H200" fill="none" stroke="rgba(1,173,165,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="40 10" className="animate-ecg-flow" />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding relative overflow-hidden bg-neutral-50">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 plus-pattern-light opacity-40" />
          <div className="absolute -top-24 right-1/4 h-80 w-96 rounded-full bg-primary-50 blur-3xl" />
          <div className="absolute bottom-0 left-[-5rem] h-72 w-80 rounded-full bg-rose-50/70 blur-3xl" />
          <div className="absolute top-1/2 right-[-4rem] h-72 w-80 rounded-full bg-emerald-50/60 blur-3xl" />
        </div>

        <div className="relative container-custom">
          <SectionHeader
            eyebrow="Why Choose Us"
            title="Committed to the best"
            highlight="healthcare experience"
            subtitle="We are committed to providing the best healthcare experience."
            className="mb-12 md:mb-14"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="group relative flex flex-col items-center overflow-hidden rounded-3xl border border-neutral-200/70 bg-white p-6 text-center shadow-soft transition-all duration-500 hover:-translate-y-2 hover:border-primary-200 hover:shadow-[0_24px_50px_-18px_var(--glow)]"
                style={{ '--glow': value.glow } as React.CSSProperties}
              >
                {/* top signal bar */}
                <span className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${value.bar} opacity-50 transition-opacity duration-300 group-hover:opacity-100`} />
                {/* ward number */}
                <span className="absolute right-4 top-3 text-[11px] font-black tracking-wider text-neutral-200 transition-colors group-hover:text-neutral-300">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {/* pulse dot */}
                <span className={`absolute bottom-3 right-4 h-1.5 w-1.5 rounded-full ${value.dot} opacity-40 transition-all duration-300 group-hover:opacity-100 group-hover:scale-[2.2]`} />

                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${value.tile} shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <value.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-neutral-900 mb-2 mt-4 transition-colors group-hover:text-primary-700">
                  {value.title}
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">{value.description}</p>

                {/* ECG trace */}
                <svg className="absolute inset-x-4 bottom-1 h-2.5 w-[calc(100%-2rem)] opacity-25" viewBox="0 0 200 10" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0 7 H60 L68 2 L76 9 L82 4 L88 7 H200" fill="none" stroke={value.trace} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="40 10" className="animate-ecg-flow" />
                </svg>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 plus-pattern-light opacity-40" />
          <div className="absolute -top-24 left-1/4 h-80 w-96 rounded-full bg-emerald-50/80 blur-3xl" />
          <div className="absolute bottom-0 right-[-5rem] h-72 w-96 rounded-full bg-primary-50/70 blur-3xl" />
        </div>

        <div className="relative container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow="Our Services"
                title="A complete range of"
                highlight="family healthcare"
                className="mb-6"
              />
              <p className="text-neutral-600 mb-6">
                We offer a comprehensive range of healthcare services to meet your
                family health needs. Our team is trained in the latest techniques and uses 
                modern equipment for optimal results.
              </p>
              
              <div className="grid grid-cols-2 gap-3 mb-8">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-3 rounded-2xl border border-neutral-100 bg-neutral-50/60 px-3.5 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-200/70 hover:bg-primary-50/50 hover:shadow-[0_10px_24px_-14px_rgba(1,173,165,0.5)]"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-teal-500 text-white shadow-md transition-transform duration-300 group-hover:scale-110">
                      <FiCheck className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    <span className="text-sm font-medium text-neutral-700">{service}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Link href="/services/laboratory" className="btn-primary inline-flex items-center gap-2">
                  Lab tests
                  <FiArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/checkup" className="btn-secondary">
                  Health check-ups
                </Link>
                <Link href="/vaccination" className="btn-secondary">
                  Vaccination
                </Link>
              </div>
            </div>
            
            {/* clinical image collage */}
            <div className="grid grid-cols-2 gap-4 lg:gap-5">
              {clinicImages.map((img, index) => (
                <div
                  key={index}
                  className={`relative aspect-square overflow-hidden rounded-2xl border border-neutral-200/60 shadow-lg transition-all duration-500 hover:scale-[1.03] hover:border-primary-200 hover:shadow-[0_22px_45px_-18px_rgba(1,173,165,0.45)] ${
                    index % 2 === 1 ? 'mt-8' : ''
                  }`}
                >
                  <Image
                    src={img}
                    alt={index === 0 ? 'Clinic' : index === 1 ? 'Medical equipment' : index === 2 ? 'Treatment Room' : 'Clinical procedure'}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-950/40 via-transparent to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/70 backdrop-blur-md border border-white/50 px-2.5 py-1 text-[10px] font-bold tabular-nums tracking-widest text-primary-700">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary-500/80 to-teal-400/80" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="section-padding relative overflow-hidden bg-neutral-50">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 plus-pattern-light opacity-40" />
          <div className="absolute -top-24 left-1/3 h-72 w-96 rounded-full bg-primary-50 blur-3xl" />
          <div className="absolute bottom-0 right-[-4rem] h-72 w-80 rounded-full bg-teal-50/70 blur-3xl" />
        </div>

        <div className="relative container-custom">
          <SectionHeader
            eyebrow="Virtual Tour"
            title="Take a look"
            highlight="inside Nita Clinic"
            subtitle="Experience our clinic facilities from the comfort of your home."
            className="mb-12 md:mb-14"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="max-w-4xl mx-auto"
          >
            <div className="group relative overflow-hidden rounded-3xl border border-white/60 bg-neutral-900 shadow-[0_30px_70px_-30px_rgba(0,42,40,0.6)]">
              {/* ECG trace on frame */}
              <svg className="absolute inset-x-0 top-0 z-10 h-10 w-full" viewBox="0 0 800 40" preserveAspectRatio="none" aria-hidden="true">
                <path
                  d="M0 28 H200 L220 10 L240 32 L260 16 L278 28 H800"
                  fill="none"
                  stroke="#5de1d8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="120 24"
                  className="animate-ecg-flow"
                  opacity="0.85"
                />
              </svg>
              {/* corner accents */}
              <span className="absolute left-3 top-3 z-10 h-6 w-6 rounded-tl-xl border-l-2 border-t-2 border-white/40" aria-hidden="true" />
              <span className="absolute right-3 top-3 z-10 h-6 w-6 rounded-tr-xl border-r-2 border-t-2 border-white/40" aria-hidden="true" />
              <span className="absolute left-3 bottom-3 z-10 h-6 w-6 rounded-bl-xl border-l-2 border-b-2 border-white/40" aria-hidden="true" />
              <span className="absolute right-3 bottom-3 z-10 h-6 w-6 rounded-br-xl border-r-2 border-b-2 border-white/40" aria-hidden="true" />

              <div className="aspect-video">
                <video
                  className="w-full h-full object-cover"
                  controls
                  poster="/images/clinic-1.jpg"
                >
                  <source src="/videos/tour-1.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <CTAFooter
        title="Ready to Visit Us?"
        highlight="book your appointment today"
        subtitle="Experience quality care at Nita Clinic. Our team is ready to support your long-term health."
        actions={[
          { label: 'Book Appointment', href: '/appointments/book' },
          { label: 'Call Now', href: 'tel:+977014533361' },
        ]}
      />
    </>
  );
}
