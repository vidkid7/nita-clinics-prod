'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiLayout, FiLogIn } from 'react-icons/fi';
import { isPatientLoggedIn } from '@/lib/patient-auth';
import { cn } from '@/lib/utils';

function subscribePatientAuth(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('patient-auth-changed', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('patient-auth-changed', callback);
  };
}

export function PatientPortalCTA({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLoggedIn(isPatientLoggedIn());
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn('h-9 w-[7.5rem] rounded-lg bg-neutral-100 animate-pulse', className)}
        aria-hidden
      />
    );
  }

  if (loggedIn) {
    return (
      <Link
        href="/patients/dashboard"
        className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-2xl border border-primary-200 bg-primary-50 px-3 py-2 text-sm font-semibold text-primary-700 transition-all hover:-translate-y-0.5 hover:bg-primary-100 hover:shadow-[0_10px_22px_-14px_rgba(1,173,165,0.45)]',
          className,
        )}
      >
        <FiLayout className="w-4 h-4 shrink-0" />
        My dashboard
      </Link>
    );
  }

  return (
    <Link
      href="/patients/login"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-2xl border border-primary-200 bg-primary-50 px-3 py-2 text-sm font-semibold text-primary-700 transition-all hover:-translate-y-0.5 hover:bg-primary-100 hover:shadow-[0_10px_22px_-14px_rgba(1,173,165,0.45)]',
        className,
      )}
    >
      <FiLogIn className="w-4 h-4 shrink-0" />
      Patient login
    </Link>
  );
}

/** Full-width patient links for the mobile menu grid (2 columns). */
export function PatientPortalMobileRow({ onNavigate }: { onNavigate: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    const sync = () => setLoggedIn(isPatientLoggedIn());
    sync();
    return subscribePatientAuth(sync);
  }, []);

  if (!mounted) return null;

  if (loggedIn) {
    return (
      <Link
        href="/patients/dashboard"
        onClick={onNavigate}
        className="col-span-2 flex items-center justify-center gap-2 border-2 border-primary-200 bg-primary-50 text-primary-800 text-xs font-bold py-2.5 rounded-xl"
      >
        <FiLayout className="w-4 h-4" />
        My patient dashboard
      </Link>
    );
  }

  return (
    <Link
      href="/patients/login"
      onClick={onNavigate}
      className="col-span-2 flex items-center justify-center gap-2 border-2 border-primary-200 bg-primary-50 text-primary-800 text-xs font-bold py-2.5 rounded-xl"
    >
      <FiLogIn className="w-4 h-4" />
      Patient login
    </Link>
  );
}
