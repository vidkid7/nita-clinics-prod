import { cn } from '@/lib/utils';

interface EcgDividerProps {
  tone?: 'light' | 'dark';
  className?: string;
}

/**
 * Decorative ECG heartbeat line divider used between sections.
 * Draws in on scroll via the `.ecg-line` animation.
 */
export function EcgDivider({ tone = 'light', className }: EcgDividerProps) {
  const isDark = tone === 'dark';
  return (
    <div className={cn('pointer-events-none flex w-full justify-center py-2', className)} aria-hidden="true">
      <svg
        className="w-40 md:w-56"
        height="32"
        viewBox="0 0 400 32"
        fill="none"
      >
        <path
          className="ecg-line"
          d="M0,16 L120,16 L145,16 L158,6 L172,26 L186,6 L198,16 L280,16 L300,16 L312,10 L324,22 L336,12 L346,16 L400,16"
          stroke={isDark ? 'rgba(255,255,255,0.5)' : '#01ada5'}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
