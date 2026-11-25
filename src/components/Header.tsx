import cnLogo from '../assets/cn-logo.png';
import avatarCircle from '../assets/avatar-circle.svg';
import arrowDown from '../assets/arrow-down.svg';
import type { ScreenId } from '../types/giftCard';

interface HeaderProps {
  onNavigate: (screen: ScreenId) => void;
}

export function Header({ onNavigate }: HeaderProps) {
  return (
    <header className="bg-white border-b border-[#ebebeb] h-[96px] w-full shrink-0">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-[32px]">
        <div className="flex items-center gap-[32px]">
          <button
            type="button"
            onClick={() => onNavigate('01-available')}
            className="relative h-[48px] w-[171px] shrink-0 overflow-hidden cursor-pointer"
            aria-label="Connect Nigeria Home"
          >
            <img
              src={cnLogo}
              alt="Connect Nigeria"
              className="absolute h-[131.9%] left-[-1.31%] top-[-14.79%] w-[103.27%] max-w-none pointer-events-none"
            />
          </button>

          <nav className="hidden md:flex items-center gap-[4px] font-archivo font-medium text-[16px] text-[#0a1429]">
            <button
              type="button"
              onClick={() => onNavigate('01-available')}
              className="flex items-center gap-[4px] px-[24px] py-[12px] rounded-[16px] hover:bg-[#f4f4f4] transition-colors cursor-pointer"
            >
              <span>Browse</span>
              <img src={arrowDown} alt="" className="size-[24px]" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('01-available')}
              className="px-[24px] py-[12px] rounded-[16px] hover:bg-[#f4f4f4] transition-colors cursor-pointer"
            >
              Articles
            </button>
            <button
              type="button"
              onClick={() => onNavigate('01-available')}
              className="px-[24px] py-[12px] rounded-[16px] hover:bg-[#f4f4f4] transition-colors cursor-pointer"
            >
              CNTV
            </button>
            <button
              type="button"
              onClick={() => onNavigate('12-checkout-enter')}
              className="px-[24px] py-[12px] rounded-[16px] hover:bg-[#f4f4f4] transition-colors cursor-pointer"
            >
              Quote Checkout
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-[16px]">
          <button
            type="button"
            onClick={() => onNavigate('01-available')}
            className="px-[24px] py-[12px] rounded-[12px] font-archivo font-semibold text-[16px] leading-[24px] text-[#0a1429] hover:bg-[#f4f4f4] transition-colors cursor-pointer"
          >
            List Now
          </button>

          <button
            type="button"
            onClick={() => onNavigate('06-active')}
            className="flex items-center gap-[4px] cursor-pointer"
            title="View Active Gift Cards"
          >
            <div className="relative size-[48px] flex items-center justify-center">
              <img src={avatarCircle} alt="" className="absolute inset-0 size-full" />
              <span className="relative font-archivo font-normal text-[20px] leading-[20px] text-white">
                NM
              </span>
            </div>
            <img src={arrowDown} alt="" className="size-[24px]" />
          </button>
        </div>
      </div>
    </header>
  );
}
