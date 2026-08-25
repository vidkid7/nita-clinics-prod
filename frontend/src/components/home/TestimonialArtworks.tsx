'use client';

/**
 * Hand-drawn doodle artwork for the home "Patient Stories" testimonials.
 * Same `{ className?, stroke, soft }` signature as ServiceArtworks /
 * SpecialistArtworks so each piece can be tinted per context. `stroke` is the
 * ink colour, `soft` is a translucent under-draw / fill for a sketchy feel.
 */

type ArtProps = {
  className?: string;
  stroke: string;
  soft: string;
};

/** Big hand-drawn quotation mark (double quote, sketchy double-stroke) */
export function DoodleQuote({ className, stroke, soft }: ArtProps) {
  return (
    <svg viewBox="0 0 72 56" fill="none" className={className} aria-hidden="true">
      {/* soft under-draw for a sketchy shadow */}
      <g
        stroke={soft}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
        transform="translate(-1 1)"
      >
        <path d="M30 8 C 18 12, 12 22, 14 32 C 16 39, 21 42, 26 41 C 30 40, 31 34, 28 30 C 26 27, 22 27, 21 30" />
        <path d="M58 8 C 46 12, 40 22, 42 32 C 44 39, 49 42, 54 41 C 58 40, 59 34, 56 30 C 54 27, 50 27, 49 30" />
      </g>
      {/* ink outline */}
      <g stroke={stroke} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M30 8 C 18 12, 12 22, 14 32 C 16 39, 21 42, 26 41 C 30 40, 31 34, 28 30 C 26 27, 22 27, 21 30" />
        <path d="M58 8 C 46 12, 40 22, 42 32 C 44 39, 49 42, 54 41 C 58 40, 59 34, 56 30 C 54 27, 50 27, 49 30" />
      </g>
      <circle cx="16" cy="19" r="1.6" fill={stroke} />
      <circle cx="44" cy="19" r="1.6" fill={stroke} />
    </svg>
  );
}

/** Hand-drawn 5-point star (slightly irregular for a hand-drawn feel) */
export function DoodleStar({ className, stroke, soft }: ArtProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3.2 L14.4 8.7 L20.3 9.3 L15.9 13.4 L17.1 19.2 L12 16.3 L6.9 19.2 L8.1 13.4 L3.7 9.3 L9.6 8.7 Z"
        stroke={stroke}
        strokeWidth="1.7"
        strokeLinejoin="round"
        fill={soft}
      />
      <circle cx="12" cy="11.5" r="1.1" fill={stroke} />
    </svg>
  );
}

/** Hand-drawn heart with a little shine stroke */
export function DoodleHeart({ className, stroke, soft }: ArtProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 19.5 C 12 19.5, 3.2 14.4, 3.2 8.9 C 3.2 5.8, 5.7 3.7, 8.4 3.7 C 10.2 3.7, 11.5 4.7, 12 6.1 C 12.5 4.7, 13.8 3.7, 15.6 3.7 C 18.3 3.7, 20.8 5.8, 20.8 8.9 C 20.8 14.4, 12 19.5, 12 19.5 Z"
        stroke={stroke}
        strokeWidth="1.9"
        strokeLinejoin="round"
        fill={soft}
      />
      <path d="M8.6 8.4 c 0.6 -0.9, 1.8 -0.9, 2.4 0" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** Hand-drawn 4-point sparkle */
export function DoodleSparkle({ className, stroke, soft }: ArtProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 2.5 L13.5 9.5 L20.5 11 L13.5 12.5 L12 19.5 L10.5 12.5 L3.5 11 L10.5 9.5 Z"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill={soft}
      />
    </svg>
  );
}

/** Hand-drawn medical cross / plus */
export function DoodleCross({ className, stroke, soft }: ArtProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 5 V19 M5 12 H19" stroke={soft} strokeWidth="3.6" strokeLinecap="round" transform="translate(0.7 -0.5)" opacity="0.5" />
      <path d="M12 5 V19 M5 12 H19" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/** Sketchy double-ring halo for the patient avatar */
export function SketchyRing({ className, stroke, soft }: ArtProps) {
  return (
    <svg viewBox="0 0 72 72" fill="none" className={className} aria-hidden="true">
      <circle cx="36" cy="36" r="27" stroke={soft} strokeWidth="2.2" strokeDasharray="92 14" strokeLinecap="round" transform="rotate(-14 36 36)" />
      <circle cx="36" cy="36" r="31" stroke={stroke} strokeWidth="1.6" strokeDasharray="120 16" strokeLinecap="round" transform="rotate(10 36 36)" opacity="0.8" />
    </svg>
  );
}
