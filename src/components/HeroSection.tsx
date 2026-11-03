import React from 'react';

interface HeroProps {
  onOpenOrder?: () => void;
}

export const HeroSection: React.FC<HeroProps> = () => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#f7f9fb] via-[#f2f4f6] to-[#f7f9fb] py-6 sm:py-10 md:py-12" id="top">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center gap-4 sm:gap-6 z-10">
        {/* Made-in-Vietnam Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs sm:text-sm shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 led-indicator shrink-0" />
          <span className="font-bold tracking-wide uppercase">
            ECOAU • Đại Lý Chính Thức Của HUNONIC Việt Nam
          </span>
        </div>

        {/* Main Headline - Mềm mại, trang nhã, phối màu hài hòa */}
        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-[44px] text-slate-800 tracking-tight leading-snug sm:leading-tight">
          <span className="text-slate-900 font-bold">Tiện Nghi Đẳng Cấp</span>
          <span className="inline-block mx-1.5 sm:mx-2.5 text-blue-400 font-light select-none">•</span>
          <span className="text-blue-700 font-bold">Tiết Kiệm Điện</span>
          <span className="inline-block mx-1.5 sm:mx-2.5 text-blue-400 font-light select-none">•</span>
          <span className="text-slate-800 font-bold">An Toàn Tuyệt Đối</span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          Biến ngôi nhà thông thường thành nhà thông minh chỉ trong{' '}
          <strong className="text-slate-900 font-bold">5 phút tự lắp đặt</strong>. Chuẩn đế âm Sino,
          Panasonic, không cần đục tường kéo lại dây.{' '}
          <strong className="text-blue-700 font-bold">Giá ưu đãi trực tiếp từ nhà sản xuất</strong>.
        </p>

        {/* Feature Value Chips */}
        <div className="flex flex-wrap justify-center gap-2 w-full pt-1">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white shadow-xs border border-slate-200/80 text-xs sm:text-sm font-semibold text-slate-800">
            <span className="material-symbols-outlined text-[18px] text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
            <span>Lắp vừa mọi đế âm sẵn có tại VN</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white shadow-xs border border-slate-200/80 text-xs sm:text-sm font-semibold text-slate-800">
            <span className="material-symbols-outlined text-[18px] text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
            <span>Điều khiển giọng nói và Ứng dụng 100% tiếng Việt</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white shadow-xs border border-slate-200/80 text-xs sm:text-sm font-semibold text-slate-800">
            <span className="material-symbols-outlined text-[18px] text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
            <span>Bảo hành 24 tháng 1 đổi 1 tận nơi</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white shadow-xs border border-slate-200/80 text-xs sm:text-sm font-semibold text-slate-800">
            <span className="material-symbols-outlined text-[18px] text-blue-600" style={{ fontVariationSettings: "'FILL' 1" }}>
              bolt
            </span>
            <span>Phản hồi 0.1s Cloud Server VN</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white shadow-xs border border-slate-200/80 text-xs sm:text-sm font-semibold text-slate-800">
            <span className="material-symbols-outlined text-[18px] text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified_user
            </span>
            <span>Trọn đời miễn phí app (0đ/tháng)</span>
          </div>
        </div>


        {/* Micro Social Proof & Certifications */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 pt-1">
          <div className="flex items-center gap-2">
            <div className="flex text-amber-500">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className="material-symbols-outlined text-[16px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              ))}
            </div>
            <span className="text-xs text-slate-600 font-medium">
              Hơn <strong className="text-slate-900 font-bold">50.000+</strong> thiết bị đang hoạt động
            </span>
          </div>

          <div className="h-3.5 w-px bg-slate-300 hidden sm:block" />

          <div className="flex items-center gap-1.5 text-slate-600 text-xs">
            <span className="material-symbols-outlined text-[16px] text-blue-600">verified</span>
            <span>Đạt chứng chỉ ISO 9001:2015 & TCVN</span>
          </div>
        </div>
      </div>

      {/* MEDIA & SOCIAL PROOF STRIP */}
      <div className="w-full mt-8 sm:mt-10 py-3 sm:py-4 bg-white border-y border-slate-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4 text-slate-500">
          <span className="text-[11px] sm:text-xs uppercase tracking-wider font-bold text-slate-600">
            Được đưa tin & bảo chứng bởi:
          </span>
          <div className="flex flex-wrap items-center gap-4 sm:gap-8 md:gap-10 opacity-85">
            <span className="text-base sm:text-lg font-black tracking-tighter text-slate-800 hover:text-red-700 transition-colors">
              VTV1
            </span>
            <span className="text-base sm:text-lg font-bold tracking-tight text-red-700 hover:opacity-100 transition-opacity">
              VnExpress
            </span>
            <span className="text-base sm:text-lg font-bold text-blue-800 hover:opacity-100 transition-opacity">
              Dân Trí
            </span>
            <span className="text-base sm:text-lg font-bold text-emerald-700 hover:opacity-100 transition-opacity">
              CafeF
            </span>
            <span className="text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-800">
              Cúp Sao Khuê 2023
            </span>
            <span className="text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-800">
              TCVN 6480-1
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
