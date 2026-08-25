'use client';

/**
 * Hand-drawn style medical illustrations for the home "Our Services" cards.
 * Each drawing is stroke-based line art (like a sketchbook doodle) that takes
 * the card's accent colour via `stroke` and a soft tint via `soft`.
 * Small elements carry health-themed CSS animations (see globals.css).
 */

type ArtProps = {
  className?: string;
  stroke: string;
  soft: string;
};

/** Lab tests — microscope with floating sample cells + scanning beam */
export function MicroscopeDrawing({ className, stroke, soft }: ArtProps) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden="true">
      {/* floating cells */}
      <g stroke={stroke} strokeWidth="3" strokeLinecap="round">
        <circle cx="34" cy="52" r="6" className="spark-float" />
        <circle cx="164" cy="70" r="4" className="spark-float anim-delay-2" />
        <circle cx="150" cy="34" r="5" className="spark-float anim-delay-3" />
        <circle cx="28" cy="150" r="5" className="spark-float anim-delay-3" />
        <circle cx="168" cy="158" r="6" className="spark-float anim-delay-2" />
      </g>
      {/* eyepiece */}
      <path d="M80 48 L102 32 L112 48 L92 60 Z" stroke={stroke} strokeWidth="4" strokeLinejoin="round" />
      <path d="M72 58 L80 48" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
      <circle cx="94" cy="44" r="9" stroke={soft} strokeWidth="6" opacity="0.8" />
      {/* body tube */}
      <path d="M92 60 L82 96 L104 110 L114 94 Z" stroke={stroke} strokeWidth="4" strokeLinejoin="round" />
      {/* arm */}
      <path d="M78 104 C 62 134, 72 156, 94 164" stroke={stroke} strokeWidth="5" strokeLinecap="round" />
      {/* base */}
      <path d="M62 164 L138 164 C 150 160, 154 148, 149 136 L145 124" stroke={stroke} strokeWidth="5" strokeLinecap="round" />
      {/* stage */}
      <path d="M50 118 L110 130" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
      <path d="M54 134 L114 146" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
      {/* objective lens */}
      <rect x="99" y="110" width="11" height="18" rx="3" stroke={stroke} strokeWidth="4" />
      {/* specimen slide */}
      <rect x="78" y="128" width="24" height="8" rx="4" stroke={stroke} strokeWidth="3" opacity="0.75" />
      <circle cx="90" cy="132" r="2.5" fill={stroke} />
      {/* scanning beam */}
      <g className="svg-scan">
        <line x1="44" y1="122" x2="150" y2="122" stroke={stroke} strokeWidth="2.5" strokeDasharray="5 7" opacity="0.7" />
      </g>
      <circle cx="104" cy="119" r="3" fill={soft} />
    </svg>
  );
}

/** Women's health — lotus bloom with a heart centre + drifting petals */
export function LotusDrawing({ className, stroke, soft }: ArtProps) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden="true">
      {/* outer petals */}
      <path d="M100 102 C 82 78, 60 88, 68 110 C 74 126, 90 130, 100 122 Z" stroke={stroke} strokeWidth="4" strokeLinejoin="round" />
      <path d="M100 102 C 118 78, 140 88, 132 110 C 126 126, 110 130, 100 122 Z" stroke={stroke} strokeWidth="4" strokeLinejoin="round" />
      {/* inner petals */}
      <path d="M100 110 C 88 90, 70 100, 78 118 C 84 130, 96 134, 100 126 Z" stroke={stroke} strokeWidth="4" strokeLinejoin="round" />
      <path d="M100 110 C 112 90, 130 100, 122 118 C 116 130, 104 134, 100 126 Z" stroke={stroke} strokeWidth="4" strokeLinejoin="round" />
      {/* centre */}
      <circle cx="100" cy="116" r="9" stroke={stroke} strokeWidth="4" />
      <circle cx="100" cy="116" r="3.5" fill={soft} />
      {/* heart */}
      <path d="M100 116 c -3 -3.4, -7 -1, -7 1.8 c 0 3, 7 5.8, 7 5.8 c 0 0, 7 -2.8, 7 -5.8 c 0 -2.8, -4 -5.2, -7 -1.8 Z" fill={stroke} className="heart-beat" />
      {/* drifting petals */}
      <path d="M40 74 c -4 -8, -11 -6, -12 1 c -1 6, 4 10, 12 7 Z" stroke={stroke} strokeWidth="3" strokeLinejoin="round" className="spark-float" />
      <path d="M160 84 c -4 -8, -11 -6, -12 1 c -1 6, 4 10, 12 7 Z" stroke={stroke} strokeWidth="3" strokeLinejoin="round" className="spark-float anim-delay-2" />
      {/* sparkles */}
      <path d="M34 128 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5 Z" fill={stroke} className="spark-float anim-delay-3" />
      <path d="M166 56 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z" fill={stroke} className="spark-float anim-delay-2" />
    </svg>
  );
}

/** Family medicine — heartbeat heart with an animated ECG trace */
export function HeartEcgDrawing({ className, stroke, soft }: ArtProps) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden="true">
      {/* heart */}
      <path d="M100 172 C 46 132, 40 76, 72 52 C 92 40, 100 54, 100 54 C 100 54, 108 40, 128 52 C 160 76, 154 132, 100 172 Z" stroke={stroke} strokeWidth="5" strokeLinejoin="round" className="heart-beat" />
      <path d="M100 168 C 52 130, 48 80, 74 60 C 90 48, 100 58, 100 58 C 100 58, 110 48, 126 60 C 152 80, 148 130, 100 168 Z" fill={soft} opacity="0.35" />
      {/* ECG trace */}
      <path d="M52 98 L80 98 L88 80 L96 120 L104 90 L112 106 L120 98 L148 98" stroke={stroke} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="animate-ecg-flow" strokeDasharray="60 15" opacity="0.9" />
      {/* pulse dot */}
      <circle cx="100" cy="176" r="5" fill={stroke} className="pulse-dot" />
      <circle cx="30" cy="60" r="4" stroke={stroke} strokeWidth="3" className="spark-float" />
      <path d="M170 92 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z" fill={stroke} className="spark-float anim-delay-2" />
    </svg>
  );
}

/** Health card — membership card with a medical cross + sparkles */
export function HealthCardDrawing({ className, stroke, soft }: ArtProps) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden="true">
      {/* card */}
      <rect x="38" y="60" width="124" height="80" rx="16" stroke={stroke} strokeWidth="5" />
      <rect x="42" y="64" width="116" height="72" rx="13" fill={soft} opacity="0.25" />
      {/* chip */}
      <rect x="54" y="76" width="24" height="18" rx="5" stroke={stroke} strokeWidth="3" opacity="0.65" />
      <path d="M66 76 v18 M54 85 h24" stroke={stroke} strokeWidth="1.5" opacity="0.5" />
      {/* medical cross */}
      <path d="M97 80 h6 v10 h10 v6 h-10 v10 h-6 v-10 h-10 v-6 h10 Z" fill={stroke} className="heart-beat" />
      {/* holo stripes */}
      <path d="M58 124 h84" stroke={stroke} strokeWidth="3" strokeLinecap="round" opacity="0.4" />
      <path d="M70 132 h60" stroke={stroke} strokeWidth="2" strokeLinecap="round" opacity="0.25" />
      {/* sparkles */}
      <path d="M34 40 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z" fill={stroke} className="spark-float" />
      <path d="M164 44 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z" fill={stroke} className="spark-float anim-delay-2" />
      <circle cx="166" cy="150" r="4" stroke={stroke} strokeWidth="3" className="spark-float anim-delay-3" />
    </svg>
  );
}

/** Imaging & ultrasound — transducer probe with pulsing sound waves */
export function UltrasoundDrawing({ className, stroke, soft }: ArtProps) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden="true">
      {/* probe */}
      <path d="M64 38 h72 v20 a 36 36 0 0 1 -72 0 Z" stroke={stroke} strokeWidth="5" strokeLinejoin="round" />
      <path d="M72 30 h56" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
      <path d="M70 46 h60" stroke={stroke} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      {/* sound waves */}
      <g className="wave-pulse">
        <path d="M60 92 a 40 40 0 0 0 80 0" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
      </g>
      <g className="wave-pulse anim-delay-2">
        <path d="M52 112 a 48 48 0 0 0 96 0" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
      </g>
      <g className="wave-pulse anim-delay-3">
        <path d="M44 132 a 56 56 0 0 0 112 0" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
      </g>
      {/* target crosshair */}
      <circle cx="100" cy="102" r="22" stroke={stroke} strokeWidth="3" strokeDasharray="4 6" className="svg-scan" opacity="0.6" />
      <path d="M100 88 v-8 M100 124 v8 M78 102 h-8 M130 102 h8" stroke={stroke} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <circle cx="100" cy="102" r="4" fill={soft} stroke={stroke} strokeWidth="2" />
    </svg>
  );
}

/** Vaccination — syringe with a falling droplet + rising bubbles */
export function SyringeDrawing({ className, stroke, soft }: ArtProps) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden="true">
      {/* barrel */}
      <path d="M122 40 L58 104 L82 128 L146 64 Z" stroke={stroke} strokeWidth="5" strokeLinejoin="round" />
      <path d="M122 40 L58 104 L70 116 L134 52 Z" fill={soft} opacity="0.5" />
      {/* measure lines */}
      <path d="M74 92 L84 82 M86 102 L96 92" stroke={stroke} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      {/* plunger */}
      <path d="M134 52 L154 32" stroke={stroke} strokeWidth="5" strokeLinecap="round" />
      <path d="M142 24 L164 46 L154 54 L132 32 Z" stroke={stroke} strokeWidth="4" strokeLinejoin="round" />
      {/* needle */}
      <path d="M58 104 L40 122 L54 136 L72 118 Z" stroke={stroke} strokeWidth="4" strokeLinejoin="round" fill={soft} />
      {/* droplet */}
      <path d="M80 150 c 0 0, -9 13, -9 18 a 9 9 0 0 0 18 0 c 0 -5, -9 -18, -9 -18 Z" fill={soft} stroke={stroke} strokeWidth="3" className="drop-fall" />
      {/* bubbles */}
      <circle cx="150" cy="74" r="5" stroke={stroke} strokeWidth="3" className="spark-float" />
      <circle cx="38" cy="52" r="4" stroke={stroke} strokeWidth="3" className="spark-float anim-delay-2" />
      <path d="M164 112 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z" fill={stroke} className="spark-float anim-delay-3" />
    </svg>
  );
}

/** Pharmacy — capsule pill with a medical cross + floating sparkles */
export function PillDrawing({ className, stroke, soft }: ArtProps) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden="true">
      {/* capsule body (rotated) */}
      <g transform="rotate(-30 100 100)">
        {/* left half (light) */}
        <path d="M44 84 a 16 16 0 0 1 16 -16 h48 v32 h-48 a 16 16 0 0 1 -16 -16 Z" stroke={stroke} strokeWidth="5" strokeLinejoin="round" fill={soft} fillOpacity="0.55" />
        {/* right half (outline) */}
        <path d="M108 68 h48 a 16 16 0 0 1 16 16 a 16 16 0 0 1 -16 16 h-48 Z" stroke={stroke} strokeWidth="5" strokeLinejoin="round" />
        {/* divider highlight */}
        <path d="M108 64 v36" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
        {/* shine */}
        <path d="M58 80 q 4 -4 12 -4" stroke={stroke} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        <path d="M124 80 q 4 -4 12 -4" stroke={stroke} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      </g>
      {/* medical cross on left half */}
      <g transform="translate(82 96)">
        <path d="M-3 -8 h6 v5 h5 v6 h-5 v5 h-6 v-5 h-5 v-6 h5 Z" fill={stroke} className="heart-beat" />
      </g>
      {/* floating mini pills */}
      <g className="spark-float">
        <rect x="30" y="50" width="22" height="10" rx="5" stroke={stroke} strokeWidth="3" transform="rotate(-20 41 55)" />
      </g>
      <g className="spark-float anim-delay-2">
        <rect x="148" y="48" width="22" height="10" rx="5" stroke={stroke} strokeWidth="3" transform="rotate(20 159 53)" />
      </g>
      {/* sparkles */}
      <path d="M30 130 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z" fill={stroke} className="spark-float anim-delay-3" />
      <path d="M170 132 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z" fill={stroke} className="spark-float" />
      <circle cx="166" cy="166" r="4" stroke={stroke} strokeWidth="3" className="spark-float anim-delay-2" />
      <circle cx="36" cy="170" r="4" stroke={stroke} strokeWidth="3" className="spark-float anim-delay-3" />
    </svg>
  );
}
