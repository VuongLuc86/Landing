import React from 'react';
import { useCart } from '../context/CartContext';

interface MobileStickyProps {
  onOpenOrder: () => void;
  onOpenSimulator: () => void;
}

export const MobileStickyCTA: React.FC<MobileStickyProps> = ({
  onOpenOrder,
  onOpenSimulator,
}) => {
  const { totalItemsCount, setIsCartOpen, setCheckoutStep } = useCart();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-2 flex items-center gap-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      <button
        type="button"
        onClick={onOpenSimulator}
        className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-slate-100 text-slate-700 text-[10px] font-semibold shrink-0 min-w-[54px] hover:bg-slate-200 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[18px] text-blue-700">touch_app</span>
        <span>Bấm Thử</span>
      </button>

      <a
        href="tel:0877999663"
        className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-blue-50 text-blue-700 text-[10px] font-semibold shrink-0 min-w-[54px] border border-blue-200"
      >
        <span className="material-symbols-outlined text-[18px]">call</span>
        <span>Hotline</span>
      </a>

      {/* Mini Cart Button */}
      <button
        type="button"
        onClick={() => {
          setCheckoutStep('cart');
          setIsCartOpen(true);
        }}
        className="relative flex flex-col items-center justify-center p-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-slate-800 text-[10px] font-bold shrink-0 min-w-[58px] border border-amber-200 cursor-pointer"
      >
        <div className="relative">
          <span className="material-symbols-outlined text-[20px] text-[#e04b16]">shopping_bag</span>
          {totalItemsCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-[#e04b16] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {totalItemsCount}
            </span>
          )}
        </div>
        <span>Giỏ Hàng</span>
      </button>

      {/* Main Buy Now CTA */}
      <button
        type="button"
        onClick={onOpenOrder}
        className="flex-1 py-2.5 px-2 rounded-xl text-white font-black text-xs btn-cta-action shadow-lg flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[18px]">flash_on</span>
        <span className="uppercase tracking-tight">Mua Ngay (Đã gồm VAT)</span>
      </button>
    </div>
  );
};
