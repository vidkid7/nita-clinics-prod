'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { IconTileList } from '@/components/ui/IconTileList';

const features = [
  'Modern lab tests with fast report turnaround',
  'Experienced and certified specialist doctors',
  'Hygienic, well-equipped clinical environment',
  'Affordable preventive health check-up packages',
  'Pediatric, gynecology, and TB specialist care',
  'Personalised patient care and follow-up',
];

export function AboutSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Visual grid */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200 shadow-md flex items-center justify-center">
                  <div className="text-center px-4">
                    <p className="text-4xl mb-2">🏥</p>
                    <p className="text-sm font-semibold text-primary-700">Modern Facilities</p>
                  </div>
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-teal-100 to-emerald-200 shadow-md flex items-center justify-center">
                  <div className="text-center px-4">
                    <p className="text-4xl mb-2">🔬</p>
                    <p className="text-sm font-semibold text-emerald-700">Advanced Lab</p>
                  </div>
                </div>
              </div>
              <div className="pt-8 space-y-4">
                <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-rose-100 to-pink-200 shadow-md flex items-center justify-center">
                  <div className="text-center px-4">
                    <p className="text-4xl mb-2">👨‍⚕️</p>
                    <p className="text-sm font-semibold text-rose-700">Expert Doctors</p>
                  </div>
                </div>
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-amber-100 to-orange-200 shadow-md flex items-center justify-center">
                  <div className="text-center px-4">
                    <p className="text-4xl mb-2">💊</p>
                    <p className="text-sm font-semibold text-amber-700">Preventive Care</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-6 py-3 rounded-2xl shadow-lg text-center"
            >
              <p className="text-2xl font-extrabold">10+</p>
              <p className="text-xs text-primary-200">Years of Service</p>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="pt-4 lg:pt-0"
          >
            <span className="inline-block bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
              About Nita Clinic
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-4">
              Your Trusted{' '}
              <span className="text-primary-600">Healthcare Partner</span>
            </h2>
            <p className="text-neutral-600 mb-3 leading-relaxed">
              Nita Clinic is Kathmandu&apos;s trusted multi-specialty clinic, serving patients since
              2014. We combine modern lab and screening technology with specialist clinical care
              under one roof.
            </p>
            <p className="text-neutral-600 mb-6 leading-relaxed">
              Our team of experienced consultants in gynecology, pediatrics, family medicine, and TB
              care delivers personalised, preventive, and evidence-based healthcare to every
              individual and family.
            </p>

            <IconTileList
              items={features}
              category="Nita Clinic care features"
              accent="teal"
              layout="list"
              className="mb-8 gap-2"
              itemClassName="min-h-[58px] rounded-2xl p-2.5"
            />

            <div className="flex flex-wrap gap-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-700 transition-colors text-sm"
              >
                Learn More About Us <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/services/laboratory"
                className="inline-flex items-center gap-2 border border-neutral-200 text-neutral-700 font-semibold px-5 py-2.5 rounded-xl hover:border-primary-300 hover:text-primary-600 transition-colors text-sm"
              >
                Lab tests
              </Link>
              <Link
                href="/checkup"
                className="inline-flex items-center gap-2 border border-neutral-200 text-neutral-700 font-semibold px-5 py-2.5 rounded-xl hover:border-primary-300 hover:text-primary-600 transition-colors text-sm"
              >
                Health check-ups
              </Link>
              <Link
                href="/vaccination"
                className="inline-flex items-center gap-2 border border-neutral-200 text-neutral-700 font-semibold px-5 py-2.5 rounded-xl hover:border-primary-300 hover:text-primary-600 transition-colors text-sm"
              >
                Vaccination
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
