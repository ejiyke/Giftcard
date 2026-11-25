import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'disabled';
  children: ReactNode;
}

export function ActionButton({
  variant = 'primary',
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || variant === 'disabled';

  const variantClasses =
    variant === 'disabled'
      ? 'bg-[#bce8b6] border border-[#bce8b6] text-[#6c727f] cursor-not-allowed'
      : variant === 'primary'
      ? 'bg-[#35bb25] border border-[#35bb25] text-[#010817] hover:bg-[#2fa820] cursor-pointer'
      : 'bg-white border border-[#d0d5dd] text-[#010817] hover:bg-[#f9fafb] cursor-pointer';

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={`inline-flex items-center justify-center gap-[8px] px-[18px] py-[10px] rounded-[12px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] font-inter font-semibold text-[16px] leading-[24px] whitespace-nowrap transition-colors ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
