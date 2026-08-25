'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import {
  FiShield,
  FiActivity,
  FiUsers,
  FiAward,
  FiClock,
  FiHeart,
} from 'react-icons/fi';

const proofPoints = [
  {
    icon: FiShield,
    value: '10+',
    label: 'Years of Excellence',
    desc: 'Serving Kathmandu since 2014',
    color: 'text-primary-600',
    bg: 'bg-primary-50',
  },
  {
    icon: FiUsers,
    value: '50,000+',
    label: 'Patients Served',
    desc: 'Trusted by families across Nepal',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: FiActivity,
    value: '200+',
    label: 'Lab & Service Tests',
    desc: 'Pathology, imaging, vaccination, consultations',
    color: 'text-primary-600',
    bg: 'bg-primary-50',
  },
  {
    icon: FiAward,
    value: '15+',
    label: 'Specialist Doctors',
    desc: 'Experienced clinical consultants',
    color: 'text-primary-600',
    bg: 'bg-primary-50',
  },
  {
    icon: FiClock,
    value: '7 Days',
    label: 'Open Every Week',
    desc: 'Mon–Fri 7am–7pm, Sat 8am–4pm',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    icon: FiHeart,
    value: '98%',
    label: 'Patient Satisfaction',
    desc: 'Based on collected feedback',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
];

const trustBadges = [
  'Government Registered',
  'Approved Seafarers Health Screening',
  'Embassy-Approved Medical Exams',
  'Trained Clinical Staff',
  'Privacy-Compliant Records',
];

function CounterItem({ item }: { item: (typeof proofPoints)[0] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-neutral-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-3`}>
        <item.icon className={`w-5 h-5 ${item.color}`} />
      </div>
      <p className={`text-3xl font-extrabold ${item.color} mb-1`}>{item.value}</p>
      <p className="font-semibold text-neutral-800 text-sm">{item.label}</p>
      <p className="text-neutral-500 text-xs mt-1">{item.desc}</p>
    </motion.div>
  );
}

export function TrustSection() {
  return (
    <section className="section-padding bg-neutral-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-3">
            Healthcare You Can Trust
          </h2>
          <p className="text-neutral-500 max-w-lg mx-auto">
            With more than a decade of clinical and lab excellence, we bring
            trusted, accessible, and modern healthcare to every patient.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {proofPoints.map((item) => (
            <CounterItem key={item.label} item={item} />
          ))}
        </div>

        {/* Trust badges strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {trustBadges.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 bg-white border border-neutral-200 px-3 py-1.5 rounded-full"
            >
              <FiShield className="w-3 h-3 text-primary-500" />
              {badge}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
