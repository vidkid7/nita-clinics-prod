interface ArtProps {
  className?: string;
  stroke: string;
  soft: string;
}

/* Hand-drawn right arrow — used on "Read Article" */
export function DoodleArrow({ className, stroke, soft }: ArtProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <g stroke={soft} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" transform="translate(-1 1)">
        <path d="M4 12 H18 M13 5.5 L19 12 L13 18.5" />
      </g>
      <g stroke={stroke} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12 H18 M13 5.5 L19 12 L13 18.5" />
      </g>
    </svg>
  );
}

/* Hand-drawn open book — health education / check-up */
export function DoodleBook({ className, stroke, soft }: ArtProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <g stroke={soft} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" transform="translate(-1 1)">
        <path d="M4 6.5 C 9 4, 14.5 4, 16 7.5 C 17.5 4, 23 4, 28 6.5 L 28 23.5 C 23 21, 17.5 21, 16 24.5 C 14.5 21, 9 21, 4 23.5 Z" />
        <path d="M16 7.5 V24.5" />
      </g>
      <g stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6.5 C 9 4, 14.5 4, 16 7.5 C 17.5 4, 23 4, 28 6.5 L 28 23.5 C 23 21, 17.5 21, 16 24.5 C 14.5 21, 9 21, 4 23.5 Z" />
        <path d="M16 7.5 V24.5" />
        <path d="M7.5 11.5 C 10 10.3, 12.5 10.3, 14 11.5 M7.5 14.5 C 10 13.3, 12.5 13.3, 14 14.5" strokeLinecap="round" opacity="0.55" strokeWidth="1.4" />
        <path d="M18 11.5 C 19.5 10.3, 22 10.3, 24.5 11.5 M18 14.5 C 19.5 13.3, 22 13.3, 24.5 14.5" strokeLinecap="round" opacity="0.55" strokeWidth="1.4" />
      </g>
    </svg>
  );
}

/* Hand-drawn shield with cross — preventive protection */
export function DoodleShield({ className, stroke, soft }: ArtProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <g stroke={soft} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" transform="translate(-1 1)">
        <path d="M12 2.8 L19 5.6 V11 C 19 15.6, 16 19.2, 12 21.2 C 8 19.2, 5 15.6, 5 11 V5.6 Z" />
        <path d="M12 8.2 V15.8 M8.2 12 H15.8" />
      </g>
      <g stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.8 L19 5.6 V11 C 19 15.6, 16 19.2, 12 21.2 C 8 19.2, 5 15.6, 5 11 V5.6 Z" />
        <path d="M12 8.2 V15.8 M8.2 12 H15.8" />
      </g>
    </svg>
  );
}
