import React, { useState, useEffect } from 'react';

interface FlashSaleProps {
  onOpenOrder: () => void;
}

export const FlashSaleBanner: React.FC<FlashSaleProps> = ({ onOpenOrder }) => {
  // 6 hours 24 minutes 15 seconds countdown
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; ms: number }>({
    hours: 6,
    minutes: 24,
    seconds: 15,
    ms: 9,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.ms > 0) {
          return { ...prev, ms: prev.ms - 1 };
        }
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1, ms: 9 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59, ms: 9 };
        }
        if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59, ms: 9 };
        }
        return { hours: 6, minutes: 24, seconds: 15, ms: 9 }; // loop
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full py-8 sm:py-12 bg-[#0a152d] text-white relative overflow-hidden" id="uu-dai">
      {/* Circuit background glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-600/20 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-orange-600/20 blur-[100px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col gap-6 sm:gap-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto">
          <span className="text-xs sm:text-sm text-orange-400 font-bold uppercase tracking-widest flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30">
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            Chương Trình Khuyến Mãi Flash Sale Hôm Nay
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading leading-tight">
            Cơ Hội Sở Hữu Thiết Bị Hunonic Trực Tiếp Từ Nhà Sản Xuất
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Đăng ký hôm nay để nhận ngay mức ưu đãi giảm giá trực tiếp từ nhà máy sản xuất Hunonic Việt Nam cho toàn bộ đơn hàng.
          </p>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 sm:gap-3 pt-1">
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-xl border border-white/20 min-w-[54px] sm:min-w-[64px]">
              <span className="text-lg sm:text-2xl font-black font-heading text-white">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Giờ</span>
            </div>
            <span className="text-lg sm:text-2xl font-bold text-orange-400">:</span>
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-xl border border-white/20 min-w-[54px] sm:min-w-[64px]">
              <span className="text-lg sm:text-2xl font-black font-heading text-white">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Phút</span>
            </div>
            <span className="text-lg sm:text-2xl font-bold text-orange-400">:</span>
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-xl border border-white/20 min-w-[54px] sm:min-w-[64px]">
              <span className="text-lg sm:text-2xl font-black font-heading text-orange-400 digit-tick">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Giây</span>
            </div>
            <span className="text-lg sm:text-2xl font-bold text-orange-400">:</span>
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-xl border border-white/20 min-w-[44px] sm:min-w-[50px]">
              <span className="text-lg sm:text-2xl font-black font-heading text-orange-300">
                {timeLeft.ms}
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">MS</span>
            </div>
          </div>

          {/* Scarcity Progress Bar */}
          <div className="w-full max-w-md flex flex-col gap-1 pt-1">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 led-indicator" />
                Đã có <strong className="text-white font-bold">87/100 suất</strong> nhận ưu đãi
              </span>
              <span className="text-orange-400 font-bold">Chỉ còn 13 suất</span>
            </div>
            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/20">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 animated-stripes transition-all duration-500"
                style={{ width: '87%' }}
              />
            </div>
          </div>
        </div>

        {/* 3 Genuine Benefits Cards (No combo packages) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-stretch">
          {/* Card 1: Ưu đãi trực tiếp */}
          <div className="rounded-2xl p-5 sm:p-6 bg-white/5 backdrop-blur-md border border-white/15 hover:border-blue-400/50 flex flex-col justify-between gap-4 transition-all">
            <div className="flex flex-col gap-3">
              <div className="w-11 h-11 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">percent</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-heading text-white">
                Ưu Đãi Trực Tiếp 15% - 20% Từ Nhà Máy
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Áp dụng giảm giá trực tiếp cho toàn bộ từng sản phẩm đơn lẻ hoặc trọn gói công trình. Đơn giá minh bạch từ kho nhà máy, đã bao gồm thuế VAT.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-orange-400 font-bold">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Tiết kiệm tối đa chi phí đầu tư</span>
            </div>
          </div>

          {/* Card 2: Vận chuyển */}
          <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-b from-blue-900/60 to-slate-900/80 border-2 border-blue-500/60 shadow-xl shadow-blue-950/50 flex flex-col justify-between gap-4 transition-all">
            <div className="flex flex-col gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">local_shipping</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-heading text-white">
                Miễn Phí Vận Chuyển & Đồng Kiểm COD
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Giao hàng nhanh toàn quốc qua Viettel Post. Khách hàng được quyền mở hộp kiểm tra thiết bị, cắm thử hoạt động trước khi thanh toán.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>An tâm 100% khi nhận hàng</span>
            </div>
          </div>

          {/* Card 3: Bảo hành */}
          <div className="rounded-2xl p-5 sm:p-6 bg-white/5 backdrop-blur-md border border-white/15 hover:border-emerald-400/50 flex flex-col justify-between gap-4 transition-all">
            <div className="flex flex-col gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">published_with_changes</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-heading text-white">
                Bảo Hành 24 Tháng — 1 Đổi 1 Tận Nơi
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Bảo hành điện tử chính hãng qua số điện thoại. Lỗi do nhà sản xuất đổi mới ngay lập tức. Đội ngũ kỹ sư hướng dẫn sơ đồ đấu nối 1:1 qua Zalo 24/7.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span>Đổi mới không chờ đợi sửa chữa</span>
            </div>
          </div>
        </div>

        {/* Action Buttons to Products / Order */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href="#san-pham"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-blue-700">inventory_2</span>
            <span>Xem Danh Sách 109+ Thiết Bị & Giá Bán</span>
          </a>

          <button
            onClick={onOpenOrder}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-xs sm:text-sm btn-cta-action shadow-lg transition-all active:scale-98 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
            <span>Đặt Hàng Nhận Chiết Khấu Ngay</span>
          </button>
        </div>
      </div>
    </section>
  );
};
