import type { CardTheme } from '../types/giftCard';
import { formatNaira } from '../data/giftCards';

interface GiftCardVisualProps {
  amount: number;
  theme: CardTheme;
  subtitle?: string;
  code?: string;
  label?: string;
  className?: string;
}

const THEME_CONFIG: Record<
  CardTheme,
  {
    container: string;
    badge: string;
    divider: string;
    patternStroke: string;
    accentDot: string;
    mutedText: string;
  }
> = {
  green: {
    container:
      'bg-gradient-to-br from-[#e2f6df] via-[#d7f1d3] to-[#c4e9bf] text-[#010817] ring-1 ring-inset ring-[#35bb25]/20 shadow-[0_8px_24px_-8px_rgba(1,8,23,0.10)]',
    badge: 'bg-white/70 text-[#010817] ring-1 ring-[#35bb25]/25',
    divider: 'bg-[#010817]/10',
    patternStroke: '#259b17',
    accentDot: 'bg-[#35bb25]',
    mutedText: 'text-[#010817]/70',
  },
  peach: {
    container:
      'bg-gradient-to-br from-[#fef0e4] via-[#fce8d7] to-[#f8d7bc] text-[#010817] ring-1 ring-inset ring-[#ef8c37]/25 shadow-[0_8px_24px_-8px_rgba(1,8,23,0.10)]',
    badge: 'bg-white/70 text-[#010817] ring-1 ring-[#ef8c37]/30',
    divider: 'bg-[#010817]/10',
    patternStroke: '#d9731e',
    accentDot: 'bg-[#ef8c37]',
    mutedText: 'text-[#010817]/70',
  },
  dark: {
    container:
      'bg-gradient-to-br from-[#0d1930] via-[#010817] to-[#071124] text-white ring-1 ring-inset ring-white/10 shadow-[0_12px_28px_-8px_rgba(1,8,23,0.45)]',
    badge: 'bg-white/10 text-white ring-1 ring-white/15',
    divider: 'bg-white/15',
    patternStroke: '#35bb25',
    accentDot: 'bg-[#35bb25]',
    mutedText: 'text-white/70',
  },
};

export function GiftCardVisual({
  amount,
  theme,
  subtitle = 'A little thought. A world of possibilities.',
  code,
  label,
  className = '',
}: GiftCardVisualProps) {
  const styles = THEME_CONFIG[theme];

  return (
    <div
      className={`relative overflow-hidden flex flex-col justify-between min-h-[196px] p-[24px] rounded-[16px] w-full transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none ${styles.container} ${className}`}
    >
      {/* Subtle geometric guilloché-inspired corner motif */}
      <svg
        aria-hidden="true"
        viewBox="0 0 220 220"
        fill="none"
        className="pointer-events-none absolute -right-10 -top-10 size-[210px] opacity-[0.14]"
      >
        <circle cx="140" cy="80" r="36" stroke={styles.patternStroke} strokeWidth="1.25" />
        <circle cx="140" cy="80" r="60" stroke={styles.patternStroke} strokeWidth="1.25" />
        <circle cx="140" cy="80" r="84" stroke={styles.patternStroke} strokeWidth="1.25" />
        <circle
          cx="140"
          cy="80"
          r="108"
          stroke={styles.patternStroke}
          strokeWidth="1"
          strokeDasharray="4 6"
        />
      </svg>

      {/* Top row: Brand mark + Gift Card seal */}
      <div className="relative z-10 flex items-center justify-between gap-3 w-full">
        <div className="flex items-center gap-[8px]">
          <span className={`inline-block size-[8px] rounded-full ${styles.accentDot}`} />
          <span className="font-archivo font-semibold text-[13px] tracking-[0.04em]">
            connect <span className="font-bold tracking-[0.08em]">NIGERIA</span>
          </span>
        </div>

        <span
          className={`px-[10px] py-[4px] rounded-full font-archivo font-medium text-[11px] tracking-[0.06em] uppercase backdrop-blur-xs ${styles.badge}`}
        >
          Gift Card
        </span>
      </div>

      {/* Middle: Hero denomination */}
      <div className="relative z-10 my-[16px] flex flex-col gap-[4px]">
        {label && (
          <span className={`font-archivo font-normal text-[12px] ${styles.mutedText}`}>
            {label}
          </span>
        )}
        <p className="font-archivo font-semibold text-[34px] leading-[1.08] tracking-[-0.02em] tabular-nums">
          {formatNaira(amount)}
        </p>
      </div>

      {/* Bottom: Hairline rule + tagline / code */}
      <div className="relative z-10 flex flex-col gap-[10px] w-full">
        <div className={`h-px w-full ${styles.divider}`} />
        <div className="flex items-center justify-between gap-3">
          <p className={`font-archivo font-normal text-[13px] leading-[1.3] ${styles.mutedText}`}>
            {subtitle}
          </p>
          {code && (
            <span className="font-archivo font-semibold text-[13px] tracking-[0.06em] shrink-0">
              {code}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
