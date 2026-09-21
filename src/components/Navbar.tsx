import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  onOpenOrder: (bundleId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenOrder }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItemsCount, setIsCartOpen, setCheckoutStep } = useCart();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      {/* Top Utility Bar - Clean, Professional & Informative */}
      <div className="w-full bg-slate-900 text-slate-300 px-4 py-1.5 border-b border-slate-800/80 text-xs shadow-xs">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-semibold text-[11px] border border-blue-400/20">
              <span className="material-symbols-outlined text-[13px]">verified</span>
              Hunonic Chính Hãng
            </span>
            <span className="text-slate-300 font-normal hidden sm:inline text-[12px]">
              Ưu đãi trực tiếp đến 20% • Giao hàng miễn phí toàn quốc • Bảo hành 24 tháng 1 đổi 1
            </span>
            <span className="text-slate-300 font-normal sm:hidden text-[12px]">
              Ưu đãi đến 20% • Freeship toàn quốc
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs shrink-0 font-medium">
            <a
              href="tel:0877999663"
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[15px] text-emerald-400">call</span>
              <span className="hidden xs:inline text-slate-400">Hotline:</span>
              <span className="font-semibold text-white">0877.999.663</span>
            </a>
            <span className="text-slate-700 hidden md:inline">|</span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-400 text-[11px]">
              <span className="material-symbols-outlined text-[14px] text-blue-400">local_shipping</span>
              Giao nhanh toàn quốc
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="h-16 sm:h-18 max-w-[1280px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 shrink-0 group">
            <img
              src="/images/hunonic/logo-hunonic-ngang.png"
              alt="Điện 365 Đại lý chính thức của HUNONIC"
              className="h-7 sm:h-8 w-auto object-contain group-hover:opacity-90 transition-opacity"
              onError={(e) => {
                e.currentTarget.src = 'https://hunonic.com/wp-content/uploads/2024/05/logo-hunonic-ngang-1-1.png';
              }}
            />
            <div className="hidden sm:flex flex-col border-l border-slate-200 pl-3">
              <span className="text-sm font-bold font-heading text-slate-900 leading-tight">
                Điện 365
              </span>
              <span className="text-[11px] text-blue-700 font-semibold tracking-wide uppercase">
                Đại lý chính thức HUNONIC
              </span>
            </div>
          </a>

          {/* Desktop Nav - Professional, Clean & Simple */}
          <nav className="hidden lg:flex items-center gap-1 text-[14px] font-medium text-slate-700">
            <a
              href="#"
              className="px-3 py-1.5 text-slate-700 hover:text-blue-700 hover:bg-slate-100/70 rounded-lg transition-colors"
            >
              Trang chủ
            </a>
            <a
              href="#san-pham"
              className="px-3 py-1.5 text-slate-700 hover:text-blue-700 hover:bg-slate-100/70 rounded-lg transition-colors"
            >
              Sản phẩm
            </a>
            <a
              href="#thuc-trang"
              className="px-3 py-1.5 text-slate-700 hover:text-blue-700 hover:bg-slate-100/70 rounded-lg transition-colors"
            >
              Giải pháp
            </a>
            <a
              href="#bang-so-sanh"
              className="px-3 py-1.5 text-slate-700 hover:text-blue-700 hover:bg-slate-100/70 rounded-lg transition-colors"
            >
              So sánh
            </a>
            <a
              href="#khach-hang"
              className="px-3 py-1.5 text-slate-700 hover:text-blue-700 hover:bg-slate-100/70 rounded-lg transition-colors"
            >
              Đánh giá
            </a>
            <a
              href="#uu-dai"
              className="px-3 py-1.5 text-slate-700 hover:text-blue-700 hover:bg-slate-100/70 rounded-lg transition-colors"
            >
              Báo giá
            </a>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Cart Icon Trigger */}
            <button
              type="button"
              onClick={() => {
                setCheckoutStep('cart');
                setIsCartOpen(true);
              }}
              className="relative p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Xem giỏ hàng"
            >
              <span className="material-symbols-outlined text-[20px] text-slate-700">shopping_bag</span>
              <span className="hidden sm:inline-block text-xs font-semibold text-slate-800">Giỏ hàng</span>
              {totalItemsCount > 0 && (
                <span className="inline-flex items-center justify-center bg-[#e04b16] text-white text-[11px] font-black rounded-full w-5 h-5 shadow-xs">
                  {totalItemsCount}
                </span>
              )}
            </button>

            <a
              href="tel:0877999663"
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-sm font-semibold transition-colors border border-slate-200/80 hover:border-blue-200"
            >
              <span className="material-symbols-outlined text-[17px] text-emerald-600">call</span>
              <span>0877.999.663</span>
            </a>

            <button
              onClick={() => onOpenOrder()}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-white text-xs sm:text-sm font-semibold bg-[#e04b16] hover:bg-[#c93f0f] shadow-sm hover:shadow-md transition-all active:scale-98"
            >
              <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
              <span className="hidden xs:inline">Đặt hàng ngay</span>
              <span className="xs:hidden">Đặt hàng</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Mở menu điều hướng"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu - Clean & Simple */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-5 py-4 flex flex-col gap-1 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
            <a
              href="#"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 text-slate-800 font-medium hover:text-blue-700 hover:bg-slate-50 rounded-lg flex items-center gap-2.5"
            >
              <span className="material-symbols-outlined text-[20px] text-slate-500">home</span>
              <span>Trang chủ</span>
            </a>
            <a
              href="#san-pham"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 text-slate-800 font-medium hover:text-blue-700 hover:bg-slate-50 rounded-lg flex items-center gap-2.5"
            >
              <span className="material-symbols-outlined text-[20px] text-slate-500">inventory_2</span>
              <span>Sản phẩm</span>
            </a>
            <a
              href="#thuc-trang"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 text-slate-800 font-medium hover:text-blue-700 hover:bg-slate-50 rounded-lg flex items-center gap-2.5"
            >
              <span className="material-symbols-outlined text-[20px] text-slate-500">lightbulb</span>
              <span>Giải pháp</span>
            </a>
            <a
              href="#bang-so-sanh"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 text-slate-800 font-medium hover:text-blue-700 hover:bg-slate-50 rounded-lg flex items-center gap-2.5"
            >
              <span className="material-symbols-outlined text-[20px] text-slate-500">compare</span>
              <span>Bảng so sánh</span>
            </a>
            <a
              href="#khach-hang"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 text-slate-800 font-medium hover:text-blue-700 hover:bg-slate-50 rounded-lg flex items-center gap-2.5"
            >
              <span className="material-symbols-outlined text-[20px] text-slate-500">reviews</span>
              <span>Đánh giá khách hàng</span>
            </a>
            <a
              href="#uu-dai"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 text-slate-800 font-medium hover:text-blue-700 hover:bg-slate-50 rounded-lg flex items-center gap-2.5"
            >
              <span className="material-symbols-outlined text-[20px] text-slate-500">loyalty</span>
              <span>Báo giá & Ưu đãi</span>
            </a>

            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
              <a
                href="tel:0877999663"
                className="w-full py-2.5 px-3 rounded-xl bg-slate-50 text-slate-800 font-semibold flex items-center justify-center gap-2 border border-slate-200 text-sm"
              >
                <span className="material-symbols-outlined text-[18px] text-emerald-600">call</span>
                <span>Hotline: 0877.999.663</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOrder();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-[#e04b16] text-white font-bold flex items-center justify-center gap-2 text-sm shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
                <span>Đặt hàng chính hãng</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};
