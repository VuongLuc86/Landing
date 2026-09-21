import React from 'react';

interface HeroProps {
  onOpenOrder: () => void;
}

export const HeroSection: React.FC<HeroProps> = ({ onOpenOrder }) => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#f7f9fb] via-[#f2f4f6] to-[#f7f9fb] py-6 sm:py-10 md:py-12" id="top">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Column: Narrative Copy */}
        <div className="lg:col-span-6 flex flex-col items-start gap-4 sm:gap-5 z-10">
          {/* Made-in-Vietnam Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs sm:text-sm shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 led-indicator shrink-0" />
            <span className="font-bold tracking-wide uppercase">
              Điện 365 • Đại Lý Chính Thức Của HUNONIC Việt Nam
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
          <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
            Biến ngôi nhà thông thường thành nhà thông minh chỉ trong{' '}
            <strong className="text-slate-900 font-bold">5 phút tự lắp đặt</strong>. Chuẩn đế âm Sino,
            Panasonic, không cần đục tường kéo lại dây.{' '}
            <strong className="text-blue-700 font-bold">Giá ưu đãi trực tiếp từ nhà sản xuất</strong>.
          </p>

          {/* 3 Feature Value Chips */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full pt-1">
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
              <span>Giọng nói Tiếng Việt, Google & Alexa</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white shadow-xs border border-slate-200/80 text-xs sm:text-sm font-semibold text-slate-800">
              <span className="material-symbols-outlined text-[18px] text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <span>Bảo hành 24 tháng 1 đổi 1 tận nơi</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1 w-full">
            <button
              onClick={onOpenOrder}
              className="inline-flex items-center justify-center gap-2.5 px-5 sm:px-7 py-3.5 rounded-xl text-white text-xs sm:text-sm font-bold shadow-lg btn-cta-action transition-all group active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
                shopping_cart
              </span>
              <span>ĐẶT HÀNG NGAY — NHẬN ƯU ĐÃI TRỰC TIẾP</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>

            <a
              href="#san-pham"
              className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-300 text-xs sm:text-sm font-semibold hover:bg-blue-50/50 shadow-2xs transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-blue-600">inventory_2</span>
              <span>Xem 109+ Thiết Bị</span>
            </a>
          </div>

          {/* Micro Social Proof & Certifications */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 pt-1">
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

        {/* Right Column: Hero Visual with Interactive Overlays */}
        <div className="lg:col-span-6 relative flex items-center justify-center">
          <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 via-emerald-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />

          <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl bg-white border border-slate-200 group">
            <img
              src="https://hunonic.com/wp-content/uploads/2022/11/nha-thong-minh-hunonic.jpg"
              alt="Không gian sống thông minh Hunonic sang trọng, sắc nét, hiện đại chuẩn Việt Nam"
              className="w-full h-auto object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = '/images/hunonic/nha-thong-minh-hunonic.jpg';
              }}
            />

            {/* Overlapping Floating Card Top Left */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-lg border border-white/70 flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 relative shrink-0">
                <span className="material-symbols-outlined text-[20px] sm:text-[24px]">bolt</span>
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 led-indicator" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight font-heading">
                  Phản hồi 0.1s
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Cloud Server VN</span>
              </div>
            </div>

            {/* Overlapping Floating Card Bottom Right */}
            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-lg border border-white/70 flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <span className="material-symbols-outlined text-[20px] sm:text-[24px]">verified_user</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-emerald-700 leading-tight font-heading">
                  0đ Phí Tháng
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Trọn đời miễn phí app</span>
              </div>
            </div>

            {/* Overlapping Floating Pill Bottom Left */}
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 hidden sm:flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-lg shadow-md text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px] text-amber-400">workspace_premium</span>
              <span>Sao Khuê 2023</span>
            </div>
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
