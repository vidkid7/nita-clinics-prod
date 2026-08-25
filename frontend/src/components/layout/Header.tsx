'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu, FiX, FiPhone, FiMail, FiChevronDown,
  FiMapPin, FiCalendar, FiSearch, FiCreditCard,
} from 'react-icons/fi';
import { PatientPortalCTA, PatientPortalMobileRow } from '@/components/layout/PatientPortalCTA';
import { cn } from '@/lib/utils';
import { useSettings } from '@/hooks/useSettings';
import { CartIconButton } from '@/components/cart/CartDrawer';
import { BRAND } from '@/lib/brand';

interface NavigationItem {
  name: string;
  href: string;
  badge?: string;
  children?: { name: string; href: string }[];
}

const navigation: NavigationItem[] = [
  {
    name: 'Our Experts',
    href: '/specialists',
    children: [
      { name: 'Gynecology & Obstetrics', href: '/specialists/gynecology-obstetrics' },
      { name: 'Pediatrician', href: '/specialists/pediatrics' },
      { name: 'Tuberculosis (TB)', href: '/specialists/tuberculosis' },
      { name: 'Orthopedics', href: '/specialists/orthopedics' },
    ],
  },
  {
    name: 'Our Services',
    href: '/services',
    children: [
      { name: 'Laboratory', href: '/services/laboratory' },
      { name: 'Pharmacy', href: '/services/pharmacy' },
      { name: 'Vaccination', href: '/services/vaccination' },
      { name: 'Home Visit', href: '/services/home-visit' },
      { name: 'Online Consultation', href: '/services/online-consultation' },
    ],
  },
  {
    name: 'Check-up',
    href: '/checkup',
    children: [
      { name: 'Health Packages', href: '/checkup/packages' },
      { name: 'TB Check-up', href: '/checkup/tuberculosis' },
      { name: 'Pediatrics Check-up', href: '/checkup/pediatrics' },
      { name: 'Gynecology Check-up', href: '/checkup/gynecology' },
    ],
  },
  { name: 'Health Card', href: '/health-card', badge: 'NEW' },
  { name: 'Our Team', href: '/team' },
];

const mobileSubmenuId = (name: string) =>
  `mobile-submenu-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

export function Header() {
  const { settings } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);
  const dropTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  // ── Desktop dropdown: open instantly, close after 200ms delay ──
  const handleDropEnter = (name: string) => {
    if (dropTimeoutRef.current) { clearTimeout(dropTimeoutRef.current); dropTimeoutRef.current = null; }
    setActiveDropdown(name);
  };
  const handleDropLeave = () => {
    dropTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 200);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setOpenMobileSubmenu(null);
  }, [pathname]);

  // Cleanup dropdown timeout on unmount
  useEffect(() => {
    return () => {
      if (dropTimeoutRef.current) clearTimeout(dropTimeoutRef.current);
    };
  }, []);

  return (
    <>
      {/* ── Top contact bar — dark teal ── */}
      <div className="relative hidden overflow-hidden bg-primary-950 py-2 text-xs text-white md:block">
        <div className="container-custom relative z-10 flex justify-between items-center">
          <div className="flex items-center gap-6 text-primary-100/90">
            <a
              href={`tel:${(settings.phone || '+977014533361').replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors hover:underline decoration-teal-400/60 underline-offset-4"
            >
              <FiPhone className="w-3 h-3" />
              {settings.phone || '+977 01-4533361'}
            </a>
            <a
              href={`mailto:${settings.email || 'info@nitaclinics.com'}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors hover:underline decoration-teal-400/60 underline-offset-4"
            >
              <FiMail className="w-3 h-3" />
              {settings.email || 'info@nitaclinics.com'}
            </a>
            <span className="hidden items-center gap-1.5 text-primary-100/80 lg:flex">
              <FiMapPin className="w-3 h-3" />
              {settings.address?.replace(', Nepal', '') || 'Kathmandu, Nepal'}
            </span>
          </div>
          <div className="flex items-center gap-5 text-primary-100/90">
            {/* Live status chip — pulsing emerald dot */}
            <span className="hidden items-center gap-1.5 text-emerald-300/90 xl:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Open for Care · 24/7
            </span>
            <Link href="/services/laboratory" className="flex items-center gap-1 hover:text-white transition-colors hover:underline decoration-teal-400/60 underline-offset-4">
              <FiSearch className="w-3 h-3" /> Find a Lab Test
            </Link>
            <Link href="/health-card" className="flex items-center gap-1 text-white font-semibold hover:text-primary-100 transition-colors hover:underline decoration-teal-400/60 underline-offset-4">
              <FiCreditCard className="w-3 h-3" /> Health Card
            </Link>
          </div>
        </div>
        {/* Subtle teal accent line */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />
      </div>

      {/* ── Main header — liquid glass ── */}
      <header
        className={cn(
          'sticky top-0 z-50 [overflow-x:clip] border-b border-white/70 bg-white/[0.72] backdrop-blur-2xl transition-all duration-300',
          isScrolled ? 'shadow-[0_18px_44px_-34px_rgba(15,23,42,0.5)]' : 'shadow-[0_8px_30px_-28px_rgba(15,23,42,0.3)]'
        )}
      >
        <div className="container-custom">
          <nav className="flex h-[72px] items-center justify-between gap-3 lg:gap-4">

            {/* Logo */}
            <Link
              href="/"
              className="group flex flex-shrink-0 items-center rounded-2xl px-2 py-1 transition-all duration-300 hover:bg-primary-50/60 hover:shadow-[0_14px_28px_-18px_rgba(1,173,165,0.55)]"
            >
              <div className="relative h-14 w-32 sm:w-36 xl:w-40">
                <Image
                  src={BRAND.logo}
                  alt="Nita Clinic — We Care Your Health"
                  fill
                  className="object-contain object-left transition-transform duration-500 group-hover:scale-[1.03]"
                  priority
                />
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden items-center gap-1 rounded-full border border-primary-100/80 bg-white/85 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_16px_36px_-30px_rgba(15,23,42,0.5),0_0_0_1px_rgba(1,173,165,0.04)] lg:flex">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(item.href + '/'));
                return (
                <div
                  key={item.name}
                  className={cn(
                    'relative shrink-0',
                    item.children && 'pb-3 -mb-3'
                  )}
                  onMouseEnter={() => item.children && handleDropEnter(item.name)}
                  onMouseLeave={handleDropLeave}
                >
                  {item.children ? (
                    <button
                      type="button"
                      onClick={() => setActiveDropdown((prev) => prev === item.name ? null : item.name)}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2 xl:px-2.5 py-2 text-xs xl:text-sm font-semibold transition-all whitespace-nowrap',
                        isActive
                          ? 'bg-primary-600 text-white shadow-[0_12px_28px_-14px_rgba(1,173,165,0.95)]'
                          : 'text-neutral-700 hover:bg-primary-50 hover:text-primary-800'
                      )}
                      aria-expanded={activeDropdown === item.name}
                      aria-haspopup="menu"
                    >
                      {item.name}
                      {item.badge && (
                        <span className="ml-0.5 text-[9px] bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-1.5 py-0.5 rounded-full leading-none font-bold animate-pulse">
                          {item.badge}
                        </span>
                      )}
                      <FiChevronDown
                        className={cn(
                          'w-3.5 h-3.5 transition-transform duration-200',
                          activeDropdown === item.name && 'rotate-180'
                        )}
                        aria-hidden="true"
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2 xl:px-2.5 py-2 text-xs xl:text-sm font-semibold transition-all whitespace-nowrap',
                        isActive
                          ? 'bg-primary-600 text-white shadow-[0_12px_28px_-14px_rgba(1,173,165,0.95)]'
                          : 'text-neutral-700 hover:bg-primary-50 hover:text-primary-800'
                      )}
                    >
                      {item.name}
                      {item.badge && (
                        <span className="ml-0.5 text-[9px] bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-1.5 py-0.5 rounded-full leading-none font-bold animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )}

                  {/* Active page marker — pulsing “you are here” dot */}
                  {isActive && (
                    <span className="pointer-events-none absolute -top-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary-500 animate-pulse" />
                  )}

                  {/* Dropdown */}
                  {item.children && (
                    <AnimatePresence>
                      {activeDropdown === item.name && (
                        <div className="absolute left-0 top-full z-50 w-64" role="menu">
                          <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            transition={{ duration: 0.15 }}
                            className="overflow-hidden rounded-[1.35rem] border border-neutral-100 bg-white/[0.98] p-2 shadow-[0_28px_80px_-38px_rgba(15,23,42,0.65)] backdrop-blur-2xl"
                          >
                            {item.children.map((child) => (
                              <Link
                                key={child.name}
                                href={child.href}
                                className={cn(
                                  'block rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                                  pathname === child.href
                                    ? 'text-primary-700 bg-primary-50 font-semibold'
                                    : 'text-neutral-700 hover:text-primary-700 hover:bg-primary-50'
                                )}
                              >
                                {child.name}
                              </Link>
                            ))}
                          </motion.div>
                        </div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
                );
              })}
            </div>

            {/* Right actions */}
            <div className="flex shrink-0 items-center gap-2 rounded-2xl bg-white/60 p-1 lg:bg-transparent lg:p-0">
              <CartIconButton />
              <div className="hidden lg:block">
                <PatientPortalCTA />
              </div>
              <Link
                href="/appointments/book"
                className="group hidden lg:inline-flex items-center gap-1.5 whitespace-nowrap rounded-2xl bg-primary-600 px-3.5 py-2 text-xs font-bold text-white shadow-[0_12px_30px_-10px_rgba(1,173,165,0.7)] transition-all hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-[0_16px_34px_-10px_rgba(1,173,165,0.85)] xl:text-sm xl:px-4"
              >
                <FiCalendar className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:-rotate-6" />
                Book Appointment
              </Link>
              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden rounded-xl p-2 text-neutral-600 transition-colors hover:bg-primary-50 hover:text-primary-700"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>
            </div>
          </nav>
        </div>

        {/* ── Mobile menu ── */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden border-t border-neutral-100 bg-white/[0.97] shadow-[0_22px_60px_-40px_rgba(15,23,42,0.55)] backdrop-blur-xl"
            >
              <div className="container-custom py-3 space-y-0.5 max-h-[80vh] overflow-y-auto">
                {/* Mobile quick actions */}
                <div className="grid grid-cols-2 gap-2 pb-3 mb-1 border-b border-neutral-100">
                  <Link
                    href="/appointments/book"
                    className="flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-primary-600 px-2 py-2.5 text-xs font-bold text-white shadow-[0_10px_22px_-12px_rgba(1,173,165,0.7)]"
                  >
                    <FiCalendar className="w-3.5 h-3.5 shrink-0" /> Book Appointment
                  </Link>
                  <Link
                    href="/services/laboratory"
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-primary-200 py-2.5 text-xs font-semibold text-primary-700"
                  >
                    <FiSearch className="w-3.5 h-3.5" /> Find a Lab Test
                  </Link>
                  <PatientPortalMobileRow onNavigate={() => setIsMobileMenuOpen(false)} />
                </div>

                {navigation.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/' && pathname.startsWith(item.href + '/'));
                  const isSubmenuOpen = openMobileSubmenu === item.name;
                  const submenuId = mobileSubmenuId(item.name);

                  return (
                  <div key={item.name}>
                    {item.children ? (
                      <button
                        type="button"
                        onClick={() => setOpenMobileSubmenu((prev) => prev === item.name ? null : item.name)}
                        className={cn(
                          'flex w-full items-center justify-between gap-2 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-primary-50 text-primary-700 font-semibold'
                            : 'text-neutral-700 hover:text-primary-700 hover:bg-primary-50'
                        )}
                        aria-expanded={isSubmenuOpen}
                        aria-controls={submenuId}
                      >
                        <span>{item.name}</span>
                        <FiChevronDown
                          className={cn('w-4 h-4 shrink-0 text-neutral-400 transition-transform', isSubmenuOpen && 'rotate-180 text-primary-700')}
                          aria-hidden="true"
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-primary-50 text-primary-700 font-semibold'
                            : 'text-neutral-700 hover:text-primary-700 hover:bg-primary-50'
                        )}
                      >
                        {item.name}
                        {item.badge && (
                          <span className="text-[9px] bg-teal-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )}

                    <AnimatePresence initial={false}>
                      {item.children && isSubmenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="ml-4 overflow-hidden"
                          id={submenuId}
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className={cn(
                                'block rounded-xl px-4 py-2 text-sm transition-colors',
                                pathname === child.href
                                  ? 'text-primary-700 bg-primary-50'
                                  : 'text-neutral-600 hover:text-primary-700 hover:bg-primary-50'
                              )}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Bottom ECG trace — clinical signature ── */}
        <svg
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2.5 w-full text-primary-500/30"
          viewBox="0 0 1440 14"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 9 H430 L460 3 L490 12 L518 5 L546 9 H1440"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="100 20"
            className="animate-ecg-flow"
          />
        </svg>
      </header>
    </>
  );
}
