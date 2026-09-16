import React, { useState, useEffect } from 'react';
import { COMBOS_DATA } from '../data/mockData';

interface FlashSaleProps {
  onSelectCombo: (comboId: string) => void;
}

export const FlashSaleBanner: React.FC<FlashSaleProps> = ({ onSelectCombo }) => {
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
    <section className="w-full py-16 lg:py-24 bg-[#0a152d] text-white relative overflow-hidden" id="uu-dai">
      {/* Circuit background glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-600/20 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-orange-600/20 blur-[100px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col gap-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto">
          <span className="text-xs sm:text-sm text-orange-400 font-bold uppercase tracking-widest flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30">
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            Chương Trình Khuyến Mãi Giới Hạn
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading leading-tight">
            Flash Sale Hôm Nay — Cơ Hội Duy Nhất Trong Tháng
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Đăng ký sớm nhận ngay chiết khấu đại lý trực tiếp từ tổng kho nhà máy Hunonic.
          </p>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 sm:gap-3 pt-2">
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md px-3 sm:px-4 py-2 rounded-xl border border-white/20 min-w-[58px] sm:min-w-[68px]">
              <span className="text-xl sm:text-3xl font-black font-heading text-white">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Giờ</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-orange-400">:</span>
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md px-3 sm:px-4 py-2 rounded-xl border border-white/20 min-w-[58px] sm:min-w-[68px]">
              <span className="text-xl sm:text-3xl font-black font-heading text-white">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Phút</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-orange-400">:</span>
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md px-3 sm:px-4 py-2 rounded-xl border border-white/20 min-w-[58px] sm:min-w-[68px]">
              <span className="text-xl sm:text-3xl font-black font-heading text-orange-400 digit-tick">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Giây</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-orange-400">:</span>
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md px-3 sm:px-4 py-2 rounded-xl border border-white/20 min-w-[48px] sm:min-w-[54px]">
              <span className="text-xl sm:text-3xl font-black font-heading text-orange-300">
                {timeLeft.ms}
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">MS</span>
            </div>
          </div>

          {/* Scarcity Progress Bar */}
          <div className="w-full max-w-md flex flex-col gap-1.5 pt-2">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 led-indicator" />
                Đã có <strong className="text-white font-bold">87/100 suất</strong> đăng ký
              </span>
              <span className="text-orange-400 font-bold">Chỉ còn 13 suất cuối</span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/20">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 animated-stripes transition-all duration-500"
                style={{ width: '87%' }}
              />
            </div>
          </div>
        </div>

        {/* 3 Combo Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {COMBOS_DATA.map((combo) => {
            const isFeatured = !!combo.isPopular;

            return (
              <div
                key={combo.id}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all relative ${
                  isFeatured
                    ? 'bg-gradient-to-b from-blue-900/90 to-slate-900 border-2 border-blue-500 shadow-2xl shadow-blue-500/20 md:-translate-y-3'
                    : 'bg-white/5 backdrop-blur-md border border-white/15 hover:border-white/30'
                }`}
              >
                {/* Popular Tag */}
                {combo.tag && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#e04b16] text-white text-xs font-bold shadow-lg uppercase tracking-wider flex items-center gap-1 whitespace-nowrap">
                    <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                    <span>{combo.tag}</span>
                  </div>
                )}

                <div className="flex flex-col gap-6">
                  {/* Header */}
                  <div>
                    <span className="text-xs font-bold text-blue-300 uppercase tracking-wider block">
                      {combo.subtitle}
                    </span>
                    <h3 className="text-2xl font-bold font-heading text-white mt-1">
                      {combo.name}
                    </h3>
                    <p className="text-xs text-slate-300 mt-2">{combo.highlightBenefit}</p>
                  </div>

                  {/* Pricing */}
                  {combo.price > 0 ? (
                    <div className="flex flex-col gap-1 pb-4 border-b border-white/10">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black font-heading text-white">
                          {combo.price.toLocaleString('vi-VN')}đ
                        </span>
                        <span className="text-sm text-slate-400 line-through">
                          {combo.originalPrice.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                      <span className="text-xs font-bold text-orange-400">
                        {combo.discountText}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1 pb-4 border-b border-white/10">
                      <span className="text-2xl font-black font-heading text-emerald-400">
                        Miễn Phí Khảo Sát & Tư Vấn
                      </span>
                      <span className="text-xs font-bold text-orange-400">
                        {combo.discountText}
                      </span>
                    </div>
                  )}

                  {/* Feature Items List */}
                  <ul className="flex flex-col gap-3 text-sm text-slate-200">
                    {combo.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span
                          className="material-symbols-outlined text-[20px] text-emerald-400 shrink-0 mt-0.5"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Action Button */}
                <div className="pt-8">
                  <button
                    onClick={() => onSelectCombo(combo.id)}
                    className={`w-full py-4 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                      isFeatured
                        ? 'text-white btn-cta-action'
                        : 'bg-white text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {combo.price > 0 ? 'shopping_bag' : 'support_agent'}
                    </span>
                    <span>{combo.price > 0 ? 'CHỌN GÓI NÀY' : 'ĐĂNG KÝ TƯ VẤN 1:1'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
