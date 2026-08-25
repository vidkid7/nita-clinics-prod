'use client';

/**
 * Physical-style health card for Nita Clinic members.
 *
 * Renders a realistic, credit-card-sized identity card (1.586:1 aspect ratio)
 * with a flip-to-back interaction, tier-aware theming, and a print mode that
 * is friendly for actual pickup. Designed for the patient portal but reusable
 * anywhere a card needs to be displayed.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope,
  Shield,
  Heart,
  Building2,
  BadgeCheck,
  Phone,
  Globe,
  MapPin,
  AlertCircle,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { HealthCardVisual } from './HealthCardVisual';

/* ──────────────────────────────────────────────────────────────────────────
   Tier metadata — name, icon, gradient, accent. Mirrors backend enum values.
────────────────────────────────────────────────────────────────────────── */
const TIER_META: Record<
  string,
  {
    label: string;
    short: string;
    icon: LucideIcon;
    /** base gradient for the card body */
    gradient: string;
    /** soft inner panel */
    panel: string;
    /** tier-specific chip */
    chip: string;
    /** accent ring */
    ring: string;
  }
> = {
  licensed_doctors: {
    label: "Doctor's Card",
    short: 'DOCTOR',
    icon: Stethoscope,
    gradient:
      'bg-[linear-gradient(135deg,#0c4a6e_0%,#075985_45%,#0e7490_100%)]',
    panel: 'bg-white/[0.08] border border-white/15',
    chip: 'bg-amber-300 text-amber-900',
    ring: 'ring-amber-300/40',
  },
  doctor: {
    label: "Doctor's Card",
    short: 'DOCTOR',
    icon: Stethoscope,
    gradient:
      'bg-[linear-gradient(135deg,#0c4a6e_0%,#075985_45%,#0e7490_100%)]',
    panel: 'bg-white/[0.08] border border-white/15',
    chip: 'bg-amber-300 text-amber-900',
    ring: 'ring-amber-300/40',
  },
  family: {
    label: "Doctor's Family",
    short: 'FAMILY',
    icon: Heart,
    gradient:
      'bg-[linear-gradient(135deg,#9d174d_0%,#be185d_45%,#c026d3_100%)]',
    panel: 'bg-white/[0.10] border border-white/15',
    chip: 'bg-rose-200 text-rose-900',
    ring: 'ring-rose-200/40',
  },
  doctor_family: {
    label: "Doctor's Family",
    short: 'FAMILY',
    icon: Heart,
    gradient:
      'bg-[linear-gradient(135deg,#9d174d_0%,#be185d_45%,#c026d3_100%)]',
    panel: 'bg-white/[0.10] border border-white/15',
    chip: 'bg-rose-200 text-rose-900',
    ring: 'ring-rose-200/40',
  },
  partner_staff: {
    label: 'Partner Staff',
    short: 'PARTNER',
    icon: Building2,
    gradient:
      'bg-[linear-gradient(135deg,#065f46_0%,#047857_45%,#0d9488_100%)]',
    panel: 'bg-white/[0.10] border border-white/15',
    chip: 'bg-emerald-200 text-emerald-900',
    ring: 'ring-emerald-200/40',
  },
  general_public: {
    label: 'General Public',
    short: 'PUBLIC',
    icon: BadgeCheck,
    gradient:
      'bg-[linear-gradient(135deg,#1e3a8a_0%,#1d4ed8_45%,#0ea5e9_100%)]',
    panel: 'bg-white/[0.10] border border-white/15',
    chip: 'bg-sky-200 text-sky-900',
    ring: 'ring-sky-200/40',
  },
};

const DEFAULT_TIER = TIER_META.general_public;

function tierKey(t?: string | null): string {
  if (!t) return 'general_public';
  const k = t.toLowerCase();
  return TIER_META[k] ? k : 'general_public';
}

function formatHolderName(t?: string | null): string {
  if (!t) return 'Health Card';
  return t
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ──────────────────────────────────────────────────────────────────────────
   Types
────────────────────────────────────────────────────────────────────────── */
export interface HealthCardData {
  fullName?: string;
  applicantName?: string;
  name?: string;
  holderType?: string;
  cardType?: string;
  email?: string;
  phone?: string;
  cardNumber?: string;
  /** Accepts validUntil, validTo, or computed from validFrom + 1y */
  validUntil?: string;
  validFrom?: string;
  validTo?: string;
  /** Optional identity document number printed on the card */
  documentNumber?: string;
  /** Optional NMC number for doctor tier */
  nmcRegistrationId?: string;
  /** Optional issuing date — defaults to today if not set */
  issuedAt?: string;
  createdAt?: string;
  status?: string;
  /** Optional verification mark for previews or issued cards with a QR value. */
  qrValue?: string;
}

interface HealthCardProps {
  data: HealthCardData;
  className?: string;
  /** When true, hides the "Tap to flip" hint and disables back view (good for print). */
  static?: boolean;
  /** Clinic phone (shown on back of card) */
  helpline?: string;
  /** Clinic website (shown on back of card) */
  website?: string;
  /** Clinic address (shown on back of card) */
  address?: string;
}

/* ──────────────────────────────────────────────────────────────────────────
   Component
────────────────────────────────────────────────────────────────────────── */
export function HealthCard({
  data,
  className,
  static: staticMode = false,
  helpline = '+977 01-4533361',
  website = 'www.nitaclinics.com',
  address = 'Bhimselgola-9, Nepal',
}: HealthCardProps) {
  const [flipped, setFlipped] = useState(false);

  const tier = TIER_META[tierKey(data.holderType || data.cardType)] ?? DEFAULT_TIER;
  const displayName = data.fullName || data.applicantName || data.name || 'Cardholder';

  const cardNumber = (data.cardNumber || 'NITA-0000-0000-0000').toUpperCase();

  // Derive valid-from / valid-thru.
  const issuedAt = data.issuedAt || data.createdAt || new Date().toISOString();
  const validThru = data.validUntil
    ? new Date(data.validUntil)
    : data.validTo
      ? new Date(data.validTo)
      : new Date(new Date(issuedAt).setFullYear(new Date(issuedAt).getFullYear() + 1));

  const statusLabel = data.status === 'approved' || data.status === 'collected' ? 'CARD ACTIVE' : 'MEMBERSHIP';

  /* ── Sub-elements ────────────────────────────────────────────────────── */

  const CardFace = (
    <HealthCardVisual
      displayName={displayName}
      cardNumber={cardNumber}
      validUntil={format(validThru, 'MM/yy')}
      tierLabel="HEALTH+"
      statusLabel={statusLabel}
    />
  );

  const CardBack = (
    <div
      className={cn(
        'relative w-full aspect-[1.586/1] rounded-2xl overflow-hidden text-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)] ring-1 ring-white/10',
        tier.gradient,
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay" style={{
        backgroundImage: 'linear-gradient(115deg, transparent 0%, transparent 35%, rgba(255,255,255,0.25) 48%, transparent 60%, transparent 100%)'
      }} />

      {/* Magstripe-style signature strip */}
      <div className="absolute top-7 inset-x-0 h-9 bg-white/85" />

      <div className="absolute top-[60%] inset-x-0 px-5 sm:px-6 -translate-y-1/2 space-y-3">
        {/* Signature line */}
        <div className="bg-white/95 rounded-md px-3 py-2 text-neutral-800">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[7px] sm:text-[8px] font-bold uppercase tracking-[0.22em] text-neutral-500">
                Authorised Signature
              </p>
              <p className="font-handwriting text-[12px] sm:text-[14px] italic mt-1 text-neutral-700 leading-none pb-1">
                Nita Clinic
              </p>
            </div>
            <div className="text-right">
              <p className="text-[7px] sm:text-[8px] font-bold uppercase tracking-[0.22em] text-neutral-500">
                CVV
              </p>
              <p className="font-mono text-[12px] sm:text-[14px] font-bold mt-1 text-neutral-800">
                {cardNumber.slice(-3)}
              </p>
            </div>
          </div>
        </div>

        {/* Contact grid */}
        <div className="grid grid-cols-3 gap-2 text-white/90">
          <div className="flex items-center gap-1.5">
            <Phone className="h-3 w-3 flex-shrink-0" />
            <span className="text-[9px] sm:text-[10px] font-semibold truncate">{helpline}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="h-3 w-3 flex-shrink-0" />
            <span className="text-[9px] sm:text-[10px] font-semibold truncate">{website}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="text-[9px] sm:text-[10px] font-semibold truncate">{address}</span>
          </div>
        </div>
      </div>

      {/* Bottom fine print */}
      <div className="absolute inset-x-0 bottom-0 px-5 sm:px-6 pb-3">
        <p className="text-[7px] sm:text-[8px] text-white/65 leading-relaxed">
          This card is non-transferable. Present it at reception to claim
          membership benefits. Loss or theft must be reported to the clinic
          immediately. Benefits are subject to Nita Clinic's membership policy.
        </p>
      </div>
    </div>
  );

  /* ── Layout ──────────────────────────────────────────────────────────── */

  if (staticMode) {
    return (
      <div className={cn('w-full max-w-md', className)}>
        <div className="space-y-3">
          {CardFace}
          {CardBack}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full max-w-md [perspective:1400px]', className)}>
      <button
        type="button"
        onClick={() => setFlipped((p) => !p)}
        className="block w-full text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30 rounded-2xl"
        aria-label={flipped ? 'Show card front' : 'Show card back'}
      >
        <div className="relative w-full [transform-style:preserve-3d] transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)]"
             style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)' }}>
          {/* Front */}
          <div className="[backface-visibility:hidden]">
            {CardFace}
          </div>
          {/* Back */}
          <div className="[backface-visibility:hidden] [transform:rotateY(180deg)] absolute inset-0">
            {CardBack}
          </div>
        </div>
      </button>

      <AnimatePresence>
        <motion.p
          key="hint"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-3 text-center text-[11px] text-neutral-400"
        >
          {flipped ? (
            <span className="inline-flex items-center gap-1">
              <Shield className="h-3 w-3" /> Tap to return to the front
            </span>
          ) : (
            <span className="inline-flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> Tap to see card details
            </span>
          )}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export default HealthCard;
