'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiCalendar,
  FiSearch,
  FiDownload,
  FiHome,
  FiCreditCard,
} from 'react-icons/fi';

const actions = [
  {
    label: 'Book Appointment',
    href: '/appointments/book',
    icon: FiCalendar,
    desc: 'Schedule online, anytime',
    accent: 'bg-primary-600',
    textColor: 'text-primary-600',
    border: 'hover:border-primary-300',
  },
  {
    label: 'Find a Lab Test',
    href: '/services/laboratory',
    icon: FiSearch,
    desc: 'Search 200+ tests & panels',
    accent: 'bg-teal-600',
    textColor: 'text-teal-600',
    border: 'hover:border-teal-300',
  },
  {
    label: 'Download Report',
    href: '/contact',
    icon: FiDownload,
    desc: 'Get your lab results online',
    accent: 'bg-primary-600',
    textColor: 'text-primary-600',
    border: 'hover:border-primary-300',
  },
  {
    label: 'Home Collection',
    href: '/appointments/book?type=home-collection',
    icon: FiHome,
    desc: 'Sample pickup at your door',
    accent: 'bg-primary-600',
    textColor: 'text-primary-600',
    border: 'hover:border-primary-300',
  },
  {
    label: 'Health Card',
    href: '/health-card',
    icon: FiCreditCard,
    desc: 'Exclusive discounts & benefits',
    accent: 'bg-amber-500',
    textColor: 'text-amber-600',
    border: 'hover:border-amber-300',
    badge: 'NEW',
  },
];

export function QuickAccessTabs() {
  return (
    <section className="relative -mt-10 z-10 pb-4">
      <div className="container-custom">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {actions.map((action, i) => (
            <motion.div
              key={action.href + action.label}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
            >
              <Link
                href={action.href}
                className={`group relative flex flex-col items-center text-center p-4 sm:p-5 bg-white rounded-2xl shadow-md hover:shadow-lg border border-neutral-100 ${action.border} transition-all duration-250`}
              >
                {action.badge && (
                  <span className="absolute top-3 right-3 text-[9px] font-bold bg-primary-600 text-white px-1.5 py-0.5 rounded-full leading-none">
                    {action.badge}
                  </span>
                )}
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${action.accent} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200`}
                >
                  <action.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <p className={`text-sm font-semibold text-neutral-800 leading-tight`}>
                  {action.label}
                </p>
                <p className="text-[11px] text-neutral-500 mt-1 leading-snug hidden sm:block">
                  {action.desc}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
