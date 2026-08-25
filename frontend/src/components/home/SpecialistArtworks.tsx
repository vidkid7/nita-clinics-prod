'use client';

/**
 * Hand-drawn style medical illustrations for the home "Specialist Clinics" cards.
 * Stroke-based line art (sketchbook doodle feel) that takes the card's accent
 * colour via `stroke` and a soft tint via `soft`. Small elements carry the
 * health-themed CSS animations defined in globals.css.
 */

type ArtProps = {
  className?: string;
  stroke: string;
  soft: string;
};

/** Gynecology & Obstetrics — blooming flower with a heartbeat centre */
export function FlowerDrawing({ className, stroke, soft }: ArtProps) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden="true">
      {/* radiating petals */}
      <g stroke={stroke} strokeWidth="5" strokeLinecap="round">
        <path d="M100 42 v28" />
        <path d="M100 130 v28" />
        <path d="M42 100 h28" />
        <path d="M130 100 h28" />
        <path d="M59 59 l20 20" />
        <path d="M121 121 l20 20" />
        <path d="M141 59 l-20 20" />
        <path d="M79 121 l-20 20" />
      </g>
      {/* centre */}
      <circle cx="100" cy="100" r="13" stroke={stroke} strokeWidth="5" />
      <circle cx="100" cy="100" r="6" fill={soft} />
      {/* heart at centre */}
      <path
        d="M100 100 c -2.6 -3.6, -6.4 -1, -6.4 1.9 c 0 3.2, 6.4 6.2, 6.4 6.2 c 0 0, 6.4 -3, 6.4 -6.2 c 0 -2.9, -3.8 -5.5, -6.4 -1.9 Z"
        fill={stroke}
        className="heart-beat"
      />
      {/* sparkles */}
      <path d="M34 46 l2.2 5.4 5.4 2.2 -5.4 2.2 -2.2 5.4 -2.2 -5.4 -5.4 -2.2 5.4 -2.2 Z" fill={stroke} className="spark-float" />
      <path d="M164 54 l2.2 5.4 5.4 2.2 -5.4 2.2 -2.2 5.4 -2.2 -5.4 -5.4 -2.2 5.4 -2.2 Z" fill={stroke} className="spark-float anim-delay-2" />
      <circle cx="42" cy="152" r="4" stroke={stroke} strokeWidth="3" className="spark-float anim-delay-3" />
      <circle cx="158" cy="146" r="5" stroke={stroke} strokeWidth="3" className="spark-float anim-delay-2" />
    </svg>
  );
}

/** Pediatrics — a cute baby with a heartbeat heart badge */
export function BabyDrawing({ className, stroke, soft }: ArtProps) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden="true">
      {/* head */}
      <circle cx="100" cy="88" r="33" stroke={stroke} strokeWidth="5" />
      {/* curl */}
      <path d="M118 62 C 128 56, 132 66, 123 70" stroke={stroke} strokeWidth="5" strokeLinecap="round" />
      {/* closed happy eyes */}
      <path d="M86 86 c 4 -4, 9 -4, 13 0" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
      <path d="M101 86 c 4 -4, 9 -4, 13 0" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
      {/* cheeks */}
      <circle cx="80" cy="96" r="4" fill={soft} />
      <circle cx="120" cy="96" r="4" fill={soft} />
      {/* smile */}
      <path d="M90 100 c 5 5, 15 5, 20 0" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
      {/* body / onesie */}
      <path d="M78 118 C 84 142, 116 142, 122 118" stroke={stroke} strokeWidth="5" strokeLinejoin="round" />
      <path d="M78 118 C 72 134, 74 148, 88 152" stroke={stroke} strokeWidth="5" strokeLinecap="round" />
      <path d="M122 118 C 128 134, 126 148, 112 152" stroke={stroke} strokeWidth="5" strokeLinecap="round" />
      {/* feet */}
      <path d="M84 152 c -6 2, -10 8, -6 12 M116 152 c 6 2, 10 8, 6 12" stroke={stroke} strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      {/* heart badge */}
      <path
        d="M100 132 c -3 -3.8, -7.4 -1, -7.4 2.2 c 0 3.6, 7.4 7, 7.4 7 c 0 0, 7.4 -3.4, 7.4 -7 c 0 -3.2, -4.4 -6, -7.4 -2.2 Z"
        fill={stroke}
        className="heart-beat"
      />
      {/* star + sparkles */}
      <path d="M34 48 l2.2 5.4 5.4 2.2 -5.4 2.2 -2.2 5.4 -2.2 -5.4 -5.4 -2.2 5.4 -2.2 Z" fill={stroke} className="spark-float" />
      <circle cx="164" cy="54" r="4" stroke={stroke} strokeWidth="3" className="spark-float anim-delay-2" />
      <circle cx="38" cy="150" r="5" stroke={stroke} strokeWidth="3" className="spark-float anim-delay-3" />
      <path d="M160 150 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6 Z" fill={stroke} className="spark-float anim-delay-2" />
    </svg>
  );
}

/** Tuberculosis — chest X-ray film with lungs, characteristic apical
 *  mottling/granuloma pattern, and a "TB" stamp badge */
export function LungsDrawing({ className, stroke, soft }: ArtProps) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden="true">
      {/* X-ray film frame */}
      <rect
        x="28"
        y="40"
        width="144"
        height="120"
        rx="8"
        stroke={stroke}
        strokeWidth="5"
        fill="white"
        fillOpacity="0.04"
      />

      {/* film corner registration marks */}
      <g stroke={stroke} strokeWidth="3" strokeLinecap="round">
        <path d="M40 50 V58 H48" />
        <path d="M160 50 V58 H152" />
        <path d="M40 150 V142 H48" />
        <path d="M160 150 V142 H152" />
      </g>

      {/* trachea */}
      <path d="M100 52 V72" stroke={stroke} strokeWidth="5" strokeLinecap="round" />
      <path d="M93 60 H107" stroke={stroke} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      {/* main bronchi split */}
      <path d="M100 72 C 92 78, 86 86, 80 94" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
      <path d="M100 72 C 108 78, 114 86, 120 94" stroke={stroke} strokeWidth="4" strokeLinecap="round" />

      {/* left lung silhouette */}
      <path
        d="M80 94 C 56 96, 46 114, 48 132 C 50 148, 60 156, 76 156 C 88 156, 94 148, 92 138 C 90 124, 86 110, 84 100 C 83 96, 81 94, 80 94 Z"
        stroke={stroke}
        strokeWidth="4.5"
        strokeLinejoin="round"
        fill="white"
        fillOpacity="0.04"
      />
      {/* right lung silhouette */}
      <path
        d="M120 94 C 144 96, 154 114, 152 132 C 150 148, 140 156, 124 156 C 112 156, 106 148, 108 138 C 110 124, 114 110, 116 100 C 117 96, 119 94, 120 94 Z"
        stroke={stroke}
        strokeWidth="4.5"
        strokeLinejoin="round"
        fill="white"
        fillOpacity="0.04"
      />

      {/* characteristic TB mottling — soft apical + diffuse granulomas */}
      <g fill={stroke}>
        <circle cx="60" cy="114" r="2" opacity="0.6" />
        <circle cx="68" cy="122" r="2.5" opacity="0.7" />
        <circle cx="55" cy="130" r="2" opacity="0.6" />
        <circle cx="70" cy="134" r="2" opacity="0.65" />
        <circle cx="78" cy="144" r="1.8" opacity="0.55" />
        <circle cx="60" cy="146" r="1.8" opacity="0.55" />
        <circle cx="84" cy="124" r="2" opacity="0.6" />
        <circle cx="50" cy="120" r="1.6" opacity="0.5" />
        <circle cx="140" cy="114" r="2" opacity="0.6" />
        <circle cx="132" cy="122" r="2.5" opacity="0.7" />
        <circle cx="145" cy="130" r="2" opacity="0.6" />
        <circle cx="130" cy="134" r="2" opacity="0.65" />
        <circle cx="122" cy="144" r="1.8" opacity="0.55" />
        <circle cx="140" cy="146" r="1.8" opacity="0.55" />
        <circle cx="116" cy="124" r="2" opacity="0.6" />
        <circle cx="150" cy="120" r="1.6" opacity="0.5" />
      </g>

      {/* primary apical TB lesion (upper-lobe predilection) */}
      <circle cx="68" cy="118" r="9" fill={stroke} opacity="0.22" />
      <circle cx="68" cy="118" r="5" fill={stroke} opacity="0.45" />
      <circle cx="68" cy="118" r="2" fill={stroke} opacity="0.85" />

      {/* "TB" stamp badge bottom-right */}
      <g transform="translate(150, 150)">
        <circle r="13" fill={stroke} />
        <text
          x="0"
          y="4"
          textAnchor="middle"
          fontSize="11"
          fontWeight="900"
          fill="white"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          TB
        </text>
      </g>

      {/* sparkles */}
      <path
        d="M22 64 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6 Z"
        fill={stroke}
        className="spark-float"
      />
      <path
        d="M180 70 l1.4 3.4 3.4 1.4 -3.4 1.4 -1.4 3.4 -1.4 -3.4 -3.4 -1.4 3.4 -1.4 Z"
        fill={stroke}
        className="spark-float anim-delay-2"
      />
      <circle cx="180" cy="118" r="3" stroke={stroke} strokeWidth="2" className="spark-float anim-delay-3" />
      <circle cx="20" cy="172" r="3" stroke={stroke} strokeWidth="2" className="spark-float anim-delay-2" />
    </svg>
  );
}

/** Orthopedics — a stylised bone / joint with a pulse spark */
export function OrthoDrawing({ className, stroke, soft }: ArtProps) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden="true">
      {/* femur / long bone */}
      <path
        d="M100 34 C 100 44, 100 50, 96 68 C 92 88, 88 104, 94 118 C 98 128, 100 132, 100 140 C 100 132, 102 128, 106 118 C 112 104, 108 88, 104 68 C 100 50, 100 44, 100 34 Z"
        stroke={stroke}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {/* joint knuckles (epicondyles) */}
      <ellipse cx="100" cy="140" rx="16" ry="9" stroke={stroke} strokeWidth="5" />
      <ellipse cx="100" cy="34" rx="16" ry="9" stroke={stroke} strokeWidth="5" />
      {/* joint capsule highlight */}
      <circle cx="100" cy="140" r="5" fill={soft} />
      <circle cx="100" cy="34" r="5" fill={soft} />
      {/* small joint dots */}
      <circle cx="89" cy="142" r="2.5" fill={soft} />
      <circle cx="111" cy="142" r="2.5" fill={soft} />
      <circle cx="89" cy="32" r="2.5" fill={soft} />
      <circle cx="111" cy="32" r="2.5" fill={soft} />
      {/* pulse line behind */}
      <path
        d="M40 100 H92 L98 86 L106 112 L112 96 L118 100 H176"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
        className="heart-beat"
      />
      {/* sparkles */}
      <path d="M34 46 l2.2 5.4 5.4 2.2 -5.4 2.2 -2.2 5.4 -2.2 -5.4 -5.4 -2.2 5.4 -2.2 Z" fill={stroke} className="spark-float" />
      <circle cx="164" cy="54" r="4" stroke={stroke} strokeWidth="3" className="spark-float anim-delay-2" />
      <circle cx="44" cy="160" r="5" stroke={stroke} strokeWidth="3" className="spark-float anim-delay-3" />
      <path d="M166 150 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6 Z" fill={stroke} className="spark-float anim-delay-2" />
    </svg>
  );
}
