import { useState } from 'react';
import { SCREEN_LIST } from '../data/giftCards';
import type { ScreenId } from '../types/giftCard';

interface ScreenExplorerBarProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
}

export function ScreenExplorerBar({
  currentScreen,
  onSelectScreen,
}: ScreenExplorerBarProps) {
  const [open, setOpen] = useState(false);
  const current = SCREEN_LIST.find((s) => s.id === currentScreen);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="w-[340px] max-h-[70vh] overflow-y-auto rounded-[12px] border border-[#d0d5dd] bg-white p-3 shadow-xl">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#ebebeb]">
            <span className="font-archivo font-semibold text-[14px] text-[#010817]">
              All 18 Figma Screens
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[12px] text-[#6c727f] hover:text-[#010817] cursor-pointer"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 gap-1">
            {SCREEN_LIST.map((item) => {
              const active = item.id === currentScreen;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectScreen(item.id);
                    setOpen(false);
                  }}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-[8px] text-left text-[13px] font-archivo transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#d7f1d3] text-[#010817] font-semibold'
                      : 'text-[#344054] hover:bg-[#f4f4f4]'
                  }`}
                >
                  <span className="inline-block w-[22px] text-[#6c727f] font-medium">
                    {item.code}
                  </span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-[#010817] px-4 py-2 text-[13px] font-archivo font-medium text-white shadow-lg hover:bg-[#0a1429] transition-colors cursor-pointer"
      >
        <span className="inline-block size-2 rounded-full bg-[#35bb25]" />
        <span>
          Screen {current?.code}: {current?.label}
        </span>
        <span className="text-[#98a2b3]">{open ? '▼' : '▲'}</span>
      </button>
    </div>
  );
}
