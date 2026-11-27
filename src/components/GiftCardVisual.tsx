import type { CardArtStyle, CardColorVariant, CardTheme } from '../types/giftCard';
import { formatNaira } from '../data/giftCards';
import cheersImg from '../assets/cards/cheers.png';
import justBecauseImg from '../assets/cards/just-because.png';
import flowersImg from '../assets/cards/flowers.png';
import lagosImg from '../assets/cards/lagos.png';
import congratulationsImg from '../assets/cards/congratulations.png';
import wellDoneImg from '../assets/cards/well-done.png';

interface GiftCardVisualProps {
  amount: number;
  theme: CardTheme;
  artStyle?: CardArtStyle;
  colorVariant?: CardColorVariant;
  subtitle?: string;
  code?: string;
  label?: string;
  className?: string;
}

const DEFAULT_ART_BY_THEME: Record<CardTheme, CardArtStyle> = {
  green: 'lagos',
  peach: 'ankara',
  dark: 'fireworks',
};

const ART_CONFIG: Record<
  CardArtStyle,
  {
    image: string;
    bg: string;
    lightText: boolean;
  }
> = {
  celebration: { image: cheersImg, bg: 'bg-[#fa84be]', lightText: true },
  gift: { image: justBecauseImg, bg: 'bg-[#5f9efd]', lightText: true },
  bouquet: { image: flowersImg, bg: 'bg-[#07090f]', lightText: true },
  lagos: { image: lagosImg, bg: 'bg-[#f6d34a]', lightText: false },
  ankara: { image: congratulationsImg, bg: 'bg-[#74b8a8]', lightText: true },
  fireworks: { image: wellDoneImg, bg: 'bg-[#3b6cf7]', lightText: true },
};

const VARIANT_CONFIG: Record<
  Exclude<CardColorVariant, 'original'>,
  {
    bg: string;
    tint: string;
    lightText: boolean;
  }
> = {
  green: {
    bg: 'bg-[#1f7a17]',
    tint: 'bg-[#2a961f]/55 mix-blend-multiply',
    lightText: true,
  },
  peach: {
    bg: 'bg-[#fce8d7]',
    tint: 'bg-[#ef8c37]/45 mix-blend-soft-light',
    lightText: false,
  },
  dark: {
    bg: 'bg-[#010817]',
    tint: 'bg-[#010817]/65 mix-blend-multiply',
    lightText: true,
  },
  blue: {
    bg: 'bg-[#1d4ed8]',
    tint: 'bg-[#2563eb]/50 mix-blend-multiply',
    lightText: true,
  },
  gold: {
    bg: 'bg-[#f6d34a]',
    tint: 'bg-[#eab308]/40 mix-blend-soft-light',
    lightText: false,
  },
};

export function GiftCardVisual({
  amount,
  theme,
  artStyle,
  colorVariant = 'original',
  subtitle = 'A little thought. A world of possibilities.',
  code,
  label,
  className = '',
}: GiftCardVisualProps) {
  const resolvedArt = artStyle || DEFAULT_ART_BY_THEME[theme];
  const art = ART_CONFIG[resolvedArt];
  const variant = colorVariant !== 'original' ? VARIANT_CONFIG[colorVariant] : null;
  const bgClass = variant ? variant.bg : art.bg;
  const isLightText = variant ? variant.lightText : art.lightText;

  return (
    <div
      className={`relative overflow-hidden flex flex-col justify-between min-h-[196px] p-[22px] rounded-[16px] w-full ${bgClass} shadow-[0_10px_24px_-8px_rgba(1,8,23,0.18)] ring-1 ring-inset ${
        isLightText ? 'ring-white/15 text-white' : 'ring-black/10 text-[#010817]'
      } transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none ${className}`}
    >
      {/* Downloaded Figma illustration */}
      <img
        src={art.image}
        alt=""
        className={`pointer-events-none absolute inset-0 size-full object-cover object-right ${
          variant ? 'opacity-85' : ''
        }`}
      />

      {/* Optional color variant tint */}
      {variant && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 ${variant.tint}`}
        />
      )}

      {/* Left readability scrim so text stays crisp over the illustration */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${
          isLightText
            ? 'bg-gradient-to-r from-black/55 via-black/25 to-transparent'
            : 'bg-gradient-to-r from-white/75 via-white/35 to-transparent'
        }`}
      />

      {/* Top row: Stacked brand mark + Gift Card badge */}
      <div className="relative z-10 flex items-start justify-between gap-2 w-full">
        <div className="flex flex-col leading-[0.95] font-archivo font-bold tracking-[-0.02em]">
          <span className="text-[15px] lowercase">connect</span>
          <span className="text-[15px] lowercase">nigeria</span>
        </div>

        <span
          className={`px-[9px] py-[3px] rounded-full font-archivo font-semibold text-[10px] tracking-[0.06em] uppercase ${
            isLightText
              ? 'bg-black/35 text-white ring-1 ring-white/25'
              : 'bg-white/80 text-[#010817] ring-1 ring-black/10'
          }`}
        >
          Gift Card
        </span>
      </div>

      {/* Middle: Denomination */}
      <div className="relative z-10 my-[14px] flex flex-col gap-[3px]">
        {label && (
          <span
            className={`font-archivo font-medium text-[12px] ${
              isLightText ? 'text-white/90' : 'text-[#010817]/80'
            }`}
          >
            {label}
          </span>
        )}
        <p className="font-archivo font-semibold text-[32px] leading-[1.06] tracking-[-0.02em] tabular-nums drop-shadow-xs">
          {formatNaira(amount)}
        </p>
      </div>

      {/* Bottom: Subtitle + optional code */}
      <div className="relative z-10 flex items-end justify-between gap-3 w-full">
        <p
          className={`font-archivo font-medium text-[12.5px] leading-[1.25] max-w-[210px] ${
            isLightText ? 'text-white/90' : 'text-[#010817]/85'
          }`}
        >
          {subtitle}
        </p>
        {code && (
          <span
            className={`font-archivo font-semibold text-[12px] tracking-[0.05em] px-[8px] py-[3px] rounded-[6px] shrink-0 ${
              isLightText ? 'bg-black/45 text-white' : 'bg-white/85 text-[#010817]'
            }`}
          >
            {code}
          </span>
        )}
      </div>
    </div>
  );
}
