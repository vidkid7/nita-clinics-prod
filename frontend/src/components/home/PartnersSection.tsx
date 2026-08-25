'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { get } from '@/lib/api';
import { DoodleHeart, DoodleSparkle } from './TestimonialArtworks';

/* Load Logos3 client-side only — prevents Embla hydration mismatch */
const Logos3 = dynamic(
  () => import('@/components/ui/logos3').then((m) => m.Logos3),
  { ssr: false, loading: () => <div className="h-24" /> }
);

const LOGO_IMG_CLASS =
  'max-h-11 w-auto max-w-[140px] object-contain opacity-70 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105';

const FALLBACK_PARTNERS = [
  {
    id: 'eng-nita',
    description: 'Engineering Nita Pvt. Ltd.',
    image: '/images/nita-engineering-and-infra.jpeg',
    website: 'https://engineeringnita.com',
    className: LOGO_IMG_CLASS,
  },
  {
    id: 'him-river',
    description: 'Him River Power Limited',
    image: 'https://himriverpower.com/wp-content/themes/him-river/assets/images/logo.png',
    website: 'https://himriverpower.com',
    className: LOGO_IMG_CLASS,
  },
  {
    id: 'sn-energy',
    description: 'SN Energy Limited',
    image: 'https://www.snenergyltd.com/img/logo.png',
    website: 'https://www.snenergyltd.com',
    className: LOGO_IMG_CLASS,
  },
];

export function PartnersSection() {
  const [logos, setLogos] = useState(FALLBACK_PARTNERS);

  useEffect(() => {
    get<any[]>('partners?section=homepage&limit=20')
      .then((data) => {
        const list = Array.isArray(data) ? data : (data as any)?.data;
        if (Array.isArray(list) && list.length > 0) {
          setLogos(list.filter((p) => p.isActive !== false).map((p) => ({
            id: p.id,
            description: p.name,
            image: p.logoUrl || p.logo_url || '',
            website: p.url || '#',
            className: LOGO_IMG_CLASS,
          })));
        }
      })
      .catch(() => { /* keep fallback */ });
  }, []);

  return (
    <section className="section-padding bg-white border-t border-neutral-100 overflow-hidden relative">
      {/* ambient glows + light texture */}
      <div className="absolute inset-0 plus-pattern opacity-15 pointer-events-none" />
      <div className="absolute top-24 -left-24 h-72 w-72 rounded-full bg-primary-100/60 blur-3xl pointer-events-none" />
      <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-teal-100/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />

      {/* floating doodles */}
      <DoodleHeart className="absolute top-32 left-[10%] hidden h-6 w-6 opacity-30 spark-float lg:block" stroke="#0d9488" soft="rgba(13,148,136,0.2)" />
      <DoodleSparkle className="absolute right-[12%] top-44 hidden h-5 w-5 opacity-30 spark-float anim-delay-2 lg:block" stroke="#0d9488" soft="rgba(13,148,136,0.2)" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            <span className="section-kicker">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Associate Partners
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-primary-600">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-vital-ping" />
              Trusted Network
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-3">
            Our Corporate <span className="text-primary-600">Partners</span>
          </h2>
          <p className="text-neutral-500 max-w-lg mx-auto text-sm leading-relaxed">
            NITA Clinic serves as the preferred healthcare provider for staff and families
            of our partner organizations in Nepal.
          </p>
        </motion.div>
      </div>

      {/* Embla auto-scroll carousel — SSR disabled to prevent hydration error */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative z-10"
      >
        <Logos3
          heading=""
          logos={logos}
          variant="clinical"
        />
      </motion.div>

      {/* bottom trust note */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10 mt-1 flex items-center justify-center gap-2"
      >
        <DoodleHeart className="h-3.5 w-3.5" stroke="#0d9488" soft="rgba(13,148,136,0.2)" />
        <span className="text-xs font-semibold text-neutral-400">
          Partnering for healthier workplaces across Nepal
        </span>
      </motion.div>
    </section>
  );
}
