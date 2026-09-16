import React from 'react';

interface MobileStickyProps {
  onOpenOrder: () => void;
  onOpenSimulator: () => void;
}

export const MobileStickyCTA: React.FC<MobileStickyProps> = ({
  onOpenOrder,
  onOpenSimulator,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-3 py-2.5 flex items-center gap-2 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <button
        onClick={onOpenSimulator}
        className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-100 text-slate-700 text-[10px] font-semibold shrink-0 min-w-[65px] hover:bg-slate-200"
      >
        <span className="material-symbols-outlined text-[20px] text-blue-700">touch_app</span>
        <span>Bấm Thử</span>
      </button>

      <a
        href="tel:0877999663"
        className="flex flex-col items-center justify-center p-2 rounded-xl bg-blue-50 text-blue-700 text-[10px] font-semibold shrink-0 min-w-[60px] border border-blue-200"
      >
        <span className="material-symbols-outlined text-[20px]">call</span>
        <span>Hotline</span>
      </a>

      <button
        onClick={onOpenOrder}
        className="flex-1 py-3 px-3 rounded-xl text-white font-bold text-xs sm:text-sm btn-cta-action shadow-lg flex items-center justify-center gap-1.5 active:scale-95"
      >
        <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
        <span className="uppercase tracking-wide">Đặt Hàng Giá Đại Lý</span>
      </button>
    </div>
  );
};
