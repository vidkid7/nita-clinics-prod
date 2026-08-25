'use client';

import { cn } from '@/lib/utils';

interface HealthCardVisualProps {
  displayName: string;
  cardNumber: string;
  validUntil: string;
  tierLabel?: string;
  statusLabel?: string;
  className?: string;
  showStatus?: boolean;
}

/** Shared turquoise physical-card face used by the member card and promotions. */
export function HealthCardVisual({
  displayName,
  cardNumber,
  validUntil,
  tierLabel = 'HEALTH+',
  statusLabel = 'CARD ACTIVE',
  className,
  showStatus = true,
}: HealthCardVisualProps) {
  return (
    <div className={cn('w-full', className)}>
      <div
        className="relative aspect-[1.586/1] w-full overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#22c9bd_0%,#39d2c1_48%,#24b7b5_100%)] px-5 py-5 text-[#063f46] shadow-[0_28px_60px_-24px_rgba(3,109,113,0.8)] ring-1 ring-white/30 sm:px-7 sm:py-7"
      >
        {/* Medical line-art atmosphere */}
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border border-white/20" />
        <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full border border-white/15" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full border border-white/15" />
        <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.7)_1px,transparent_0)] [background-size:18px_18px]" />
        <div className="pointer-events-none absolute right-[8%] top-[22%] text-4xl font-light text-white/30">☆</div>
        <div className="pointer-events-none absolute bottom-[12%] left-[8%] text-2xl text-white/25">✧</div>
        <div className="pointer-events-none absolute bottom-[10%] right-[10%] text-3xl text-white/25">♡</div>

        <div className="relative flex h-full flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="mt-1 text-3xl font-light leading-none text-[#087e80]" aria-hidden="true">+</span>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.28em] text-[#126b70]/80 sm:text-[10px]">NITA CLINIC</p>
                <p className="mt-0.5 text-[15px] font-extrabold leading-tight text-[#063f46] sm:text-lg">Smart Health Card</p>
              </div>
            </div>
            <span className="mt-1 text-2xl font-light leading-none text-[#087e80]" aria-hidden="true">›</span>
          </div>

          <div className="relative mt-6 h-10 w-[4.25rem] overflow-hidden rounded-lg bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 shadow-inner ring-1 ring-amber-700/30 sm:mt-7 sm:h-11 sm:w-16">
            <div className="grid h-full grid-cols-2 grid-rows-3">
              {Array.from({ length: 6 }).map((_, index) => <span key={index} className="border-b border-r border-amber-700/25" />)}
            </div>
            <span className="pointer-events-none absolute inset-1.5 rounded border border-amber-700/40 sm:inset-2" />
          </div>

          <svg className="mt-5 h-7 w-full sm:mt-6 sm:h-8" viewBox="0 0 420 40" preserveAspectRatio="none" aria-label="Heartbeat line">
            <path d="M0 24 H80 M100 24 H128 L151 11 L175 31 L198 17 L224 24 H365 M384 24 H420" fill="none" stroke="#087e80" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <div className="mt-auto flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#126b70]/75">Card Holder</p>
              <p className="truncate text-xl font-medium leading-tight text-[#063f46] sm:text-[22px]">{displayName}</p>
              <p className="mt-1 truncate font-mono text-[9px] font-semibold tracking-[0.16em] text-[#126b70]/70 sm:text-[10px]">{cardNumber}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#126b70]/75">Valid Until</p>
              <p className="text-base font-bold leading-tight text-[#063f46] sm:text-lg">{validUntil}</p>
              <span className="mt-1 inline-flex rounded-md bg-[#087e80] px-2 py-1 text-[8px] font-black tracking-[0.12em] text-teal-100" aria-label={`${tierLabel} membership tier`}>
                {tierLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {showStatus && (
        <div className="mt-5 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-300/60 bg-teal-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-teal-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {statusLabel}
          </span>
        </div>
      )}
    </div>
  );
}

export default HealthCardVisual;
