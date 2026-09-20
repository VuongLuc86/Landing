import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  onOpenOrder: (bundleId?: string) => void;
  onOpenSimulator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenOrder, onOpenSimulator }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItemsCount, setIsCartOpen, setCheckoutStep } = useCart();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      {/* Top Banner */}
      <div className="w-full bg-[#c83700] text-[#ffeae5] px-4 py-2 text-center flex items-center justify-center gap-2 shadow-sm text-xs sm:text-sm">
        <span className="material-symbols-outlined text-[18px] text-amber-300 animate-bounce">bolt</span>
        <span className="font-bold tracking-wide uppercase">
          ⚡ FLASH SALE ĐẠI LÝ HÔM NAY — GIẢM TỚI 20% + FREESHIP TOÀN QUỐC + BẢO HÀNH 24 THÁNG 1 ĐỔI 1
        </span>
        <span className="material-symbols-outlined text-[18px] text-amber-300 hidden sm:inline-block">local_shipping</span>
      </div>

      {/* Main Header */}
      <header className="w-full bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <div className="h-20 max-w-[1280px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 shrink-0 group">
            <img
              src="https://hunonic.com/wp-content/uploads/2024/05/logo-hunonic-ngang-1-1.png"
              alt="Điện 365 Đại lý chính thức của HUNONIC"
              className="h-8 sm:h-9 w-auto object-contain group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = '/images/hunonic/logo-hunonic-ngang.png';
              }}
            />
            <div className="hidden sm:flex flex-col border-l border-slate-200 pl-3">
              <span className="text-sm font-black font-heading text-slate-900 leading-tight">
                Điện 365
              </span>
              <span className="text-[11px] text-blue-700 font-bold tracking-wide uppercase">
                Đại lý chính thức của HUNONIC
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-1 text-[14px] font-medium text-slate-700">
            <a
              href="#"
              className="px-3 py-2 text-slate-600 hover:text-blue-700 transition-colors rounded-lg hover:bg-slate-50"
            >
              Trang chủ
            </a>
            <a
              href="#thuc-trang"
              className="px-3 py-2 text-slate-600 hover:text-blue-700 transition-colors rounded-lg hover:bg-slate-50"
            >
              Vấn đề & Giải pháp
            </a>
            <button
              onClick={onOpenSimulator}
              className="px-3 py-2 text-blue-700 font-semibold hover:text-blue-800 transition-colors rounded-lg hover:bg-blue-50 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px]">touch_app</span>
              <span>Trải nghiệm thử</span>
            </button>
            <a
              href="#san-pham"
              className="px-3 py-2 text-slate-600 hover:text-blue-700 transition-colors rounded-lg hover:bg-slate-50"
            >
              Sản phẩm chính hãng
            </a>
            <a
              href="#bang-so-sanh"
              className="px-3 py-2 text-slate-600 hover:text-blue-700 transition-colors rounded-lg hover:bg-slate-50"
            >
              So sánh vượt trội
            </a>
            <a
              href="#khach-hang"
              className="px-3 py-2 text-slate-600 hover:text-blue-700 transition-colors rounded-lg hover:bg-slate-50"
            >
              Đánh giá
            </a>
            <a
              href="#uu-dai"
              className="px-3 py-2 text-slate-600 hover:text-blue-700 transition-colors rounded-lg hover:bg-slate-50"
            >
              Báo giá đại lý
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
              className="relative p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Xem giỏ hàng"
            >
              <span className="material-symbols-outlined text-[22px] text-slate-800">shopping_bag</span>
              <span className="hidden sm:inline-block text-xs font-bold">Giỏ Hàng</span>
              {totalItemsCount > 0 && (
                <span className="inline-flex items-center justify-center bg-[#e04b16] text-white text-[11px] font-black rounded-full w-5 h-5 shadow-xs">
                  {totalItemsCount}
                </span>
              )}
            </button>

            <a
              href="tel:0877999663"
              className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 text-blue-700 text-sm font-semibold hover:bg-blue-100/70 transition-colors border border-blue-200/50 group"
            >
              <span className="material-symbols-outlined text-[18px] group-hover:rotate-12 transition-transform">
                call
              </span>
              <span>0877.999.663</span>
            </a>

            <button
              onClick={() => onOpenOrder()}
              className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-2.5 rounded-xl text-white text-xs sm:text-sm font-bold shadow-lg btn-cta-action transition-all hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">flash_on</span>
              <span className="hidden xs:inline">ĐẶT HÀNG — GIÁ ĐẠI LÝ</span>
              <span className="xs:hidden">ĐẶT HÀNG</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
              aria-label="Toggle Navigation"
            >
              <span className="material-symbols-outlined text-[26px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-b border-slate-200 px-6 py-4 flex flex-col gap-3 shadow-xl">
            <a
              href="#"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-slate-700 font-medium hover:text-blue-600"
            >
              Trang chủ
            </a>
            <a
              href="#thuc-trang"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-slate-700 font-medium hover:text-blue-600"
            >
              Vấn đề & Giải pháp
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSimulator();
              }}
              className="py-2 text-blue-700 font-bold flex items-center gap-2 text-left"
            >
              <span className="material-symbols-outlined text-[20px]">touch_app</span>
              <span>Trải nghiệm dùng thử công tắc cảm ứng</span>
            </button>
            <a
              href="#san-pham"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-slate-700 font-medium hover:text-blue-600"
            >
              Sản phẩm chính hãng
            </a>
            <a
              href="#bang-so-sanh"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-slate-700 font-medium hover:text-blue-600"
            >
              So sánh vượt trội
            </a>
            <a
              href="#khach-hang"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-slate-700 font-medium hover:text-blue-600"
            >
              Đánh giá khách hàng
            </a>
            <a
              href="#uu-dai"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-slate-700 font-medium hover:text-blue-600"
            >
              Báo giá đại lý & Ưu đãi
            </a>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <a href="tel:0877999663" className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">call</span>
                Hotline: 0877.999.663
              </a>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};
