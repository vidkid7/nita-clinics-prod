/**
 * Global liquid / aurora backdrop.
 *
 * A fixed layer of slow-drifting teal blobs + a soft base wash + a faint
 * medical grid. It sits behind the page (-z-10) and bleeds through the
 * translucent glass surfaces (cards, nav, inputs) for the liquid-glass look.
 */
export function LiquidBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Soft teal base wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-100/40 via-white to-primary-50/40" />
      {/* Central teal glow so glass surfaces have colour to refract */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[420px] w-[820px] rounded-full bg-primary-200/40 blur-[120px]" />

      {/* Drifting liquid blobs */}
      <div className="absolute -top-40 -left-24 h-[440px] w-[440px] rounded-full bg-primary-200/60 blur-3xl liquid-drift" />
      <div className="absolute top-1/4 -right-36 h-[480px] w-[480px] rounded-full bg-teal-300/50 blur-3xl liquid-drift [animation-delay:-4s]" />
      <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-primary-300/45 blur-3xl liquid-drift [animation-delay:-8s]" />
      <div className="absolute top-2/3 right-1/4 h-[320px] w-[320px] rounded-full bg-emerald-200/50 blur-3xl liquid-drift [animation-delay:-6s]" />

      {/* Faint clinical grid overlay */}
      <div className="absolute inset-0 medical-grid opacity-50" />
    </div>
  );
}
