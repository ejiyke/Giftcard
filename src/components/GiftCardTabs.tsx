import type { ScreenId } from '../types/giftCard';

interface GiftCardTabsProps {
  activeTab: 'available' | 'active' | 'used' | 'gift';
  availableCount: number;
  activeCount: number;
  usedCount: number;
  onSelectTab: (screen: ScreenId) => void;
}

export function GiftCardTabs({
  activeTab,
  availableCount,
  activeCount,
  usedCount,
  onSelectTab,
}: GiftCardTabsProps) {
  const tabs: {
    key: 'available' | 'active' | 'used' | 'gift';
    label: string;
    count?: number;
    target: ScreenId;
  }[] = [
    { key: 'available', label: 'Available', count: availableCount, target: '01-available' },
    {
      key: 'active',
      label: 'Active',
      count: activeCount,
      target: activeCount === 0 ? '18-empty-active' : '06-active',
    },
    { key: 'used', label: 'Inactive/Used', count: usedCount, target: '10-inactive-used' },
    { key: 'gift', label: 'Gift a card', target: '19-gift-select' },
  ];

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-wrap gap-[24px] md:gap-[32px] items-start w-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onSelectTab(tab.target)}
              className={`flex gap-[4px] h-[40px] items-center cursor-pointer transition-colors ${
                isActive ? 'border-b-2 border-[#ef8c37]' : 'border-b-2 border-transparent'
              }`}
            >
              <span
                className={`font-archivo font-semibold text-[16px] leading-[24px] whitespace-nowrap ${
                  isActive ? 'text-[#0a1429]' : 'text-[#6c727f] hover:text-[#0a1429]'
                }`}
              >
                {tab.label}
              </span>
              {typeof tab.count === 'number' && (
                <span className="bg-[#ef8c37] px-[6px] py-[4px] rounded-[30px] font-archivo font-normal text-[14px] leading-[14px] text-[#010817] text-center">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="bg-[#ebebeb] h-px w-full mt-[0px]" />
    </div>
  );
}
