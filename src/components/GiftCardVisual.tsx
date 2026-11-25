import type { CardTheme } from '../types/giftCard';
import { formatNaira } from '../data/giftCards';

interface GiftCardVisualProps {
  amount: number;
  theme: CardTheme;
  subtitle?: string;
  className?: string;
}

const THEME_CLASSES: Record<CardTheme, string> = {
  green: 'bg-[#d7f1d3] text-[#010817]',
  peach: 'bg-[#fce8d7] text-[#010817]',
  dark: 'bg-[#010817] text-white',
};

export function GiftCardVisual({
  amount,
  theme,
  subtitle = 'A little thought. A world of possibilities.',
  className = '',
}: GiftCardVisualProps) {
  return (
    <div
      className={`flex flex-col gap-[18px] items-start p-[24px] rounded-[12px] w-full ${THEME_CLASSES[theme]} ${className}`}
    >
      <p className="font-archivo font-medium text-[14px] leading-normal whitespace-pre-wrap w-full">
        {'connect NIGERIA    /    GIFT CARD'}
      </p>
      <p className="font-archivo font-semibold text-[29.03px] leading-normal w-full">
        {formatNaira(amount)}
      </p>
      <p className="font-archivo font-normal text-[14px] leading-[115.625%] w-full">
        {subtitle}
      </p>
    </div>
  );
}
