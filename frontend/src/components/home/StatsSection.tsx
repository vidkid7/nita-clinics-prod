'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { get, type PaginatedResponse } from '@/lib/api';
import { EcgDivider } from '@/components/ui/EcgDivider';

const DEFAULT_STATS = [
  { value: 50000, suffix: '+', label: 'Patients Served', sub: 'Trusted across Nepal' },
  { value: 15, suffix: '+', label: 'Specialist Doctors', sub: 'Expert consultants' },
  { value: 10, suffix: '+', label: 'Years of Service', sub: 'Est. 2014, Kathmandu' },
  { value: 200, suffix: '+', label: 'Lab & Service Tests', sub: 'Lab, vaccination, home visit, online consult' },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const steps = 60;
    const inc = value / steps;
    const timer = setInterval(() => {
      start += inc;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 2000 / steps);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {count >= 1000 ? (count / 1000).toFixed(0) + 'K' : count}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  const [stats, setStats] = useState(DEFAULT_STATS);

  useEffect(() => {
    Promise.all([
      get<Record<string, string>>('settings/object').catch(() => ({} as Record<string, string>)),
      get<PaginatedResponse<unknown>>('doctors', {
        params: { page: 1, limit: 1, staffType: 'doctor' },
      }).catch(() => ({ data: [], total: 0, page: 1, limit: 1, totalPages: 0 })),
      get<PaginatedResponse<unknown>>('lab-tests', { params: { page: 1, limit: 1 } }).catch(() => ({
        data: [],
        total: 0,
        page: 1,
        limit: 1,
        totalPages: 0,
      })),
    ]).then(([obj, doctorsPage, testsPage]) => {
      const doctorCount = Math.max(0, doctorsPage.total ?? 0);
      const testCount = Math.max(0, testsPage.total ?? 0);
      setStats([
        {
          value: parseInt(obj.totalPatients || '50000', 10),
          suffix: '+',
          label: 'Patients Served',
          sub: 'Trusted across Nepal',
        },
        {
          value: obj.totalDoctors ? parseInt(obj.totalDoctors, 10) : doctorCount > 0 ? doctorCount : 15,
          suffix: '+',
          label: 'Specialist Doctors',
          sub: 'Expert consultants',
        },
        {
          value: parseInt(obj.yearsOfService || '10', 10),
          suffix: '+',
          label: 'Years of Service',
          sub: obj.establishedYear ? `Est. ${obj.establishedYear}, Kathmandu` : 'Est. 2014, Kathmandu',
        },
        {
          value: obj.totalTests ? parseInt(obj.totalTests, 10) : testCount > 0 ? testCount : 200,
          suffix: '+',
          label: 'Lab & Service Tests',
          sub: 'Lab, vaccination, home visit, online consult',
        },
      ]);
    }).catch(() => { /* keep defaults */ });
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-700">
      {/* Clinical plus-dot texture + ambient glows */}
      <div className="absolute inset-0 plus-pattern opacity-60 pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/[0.06] blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-16 w-80 h-80 rounded-full bg-teal-300/10 blur-3xl pointer-events-none" />

      <EcgDivider tone="dark" className="py-3 relative z-10" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative"
            >
              <p className="text-4xl md:text-5xl font-extrabold text-white mb-1">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="font-semibold text-white text-sm md:text-base">{s.label}</p>
              <p className="text-primary-200 text-xs mt-0.5">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
