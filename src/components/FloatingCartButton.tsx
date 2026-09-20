import React from 'react';
import { useCart } from '../context/CartContext';

export const FloatingCartButton: React.FC = () => {
  const { totalItemsCount, totalPrice, setIsCartOpen, setCheckoutStep, cartAnimationKey } = useCart();

  if (totalItemsCount === 0) return null;

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-40 flex items-center">
      <button
        type="button"
        key={cartAnimationKey}
        onClick={() => {
          setCheckoutStep('cart');
          setIsCartOpen(true);
        }}
        className="group relative flex items-center gap-2.5 bg-[#e04b16] hover:bg-[#c93e0e] text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer animate-bounce-short border-2 border-white/80"
        aria-label="Xem giỏ hàng"
      >
        <div className="relative flex items-center justify-center">
          <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
          {/* Badge count */}
          <span className="absolute -top-2.5 -right-2.5 bg-yellow-400 text-slate-950 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-[#e04b16]">
            {totalItemsCount}
          </span>
        </div>

        <div className="hidden sm:flex flex-col text-left leading-tight pr-1">
          <span className="text-[10px] uppercase font-bold text-orange-200">Giỏ Hàng</span>
          <span className="text-xs font-black font-heading tracking-wide">
            {totalPrice.toLocaleString('vi-VN')} đ
          </span>
        </div>
      </button>
    </div>
  );
};
