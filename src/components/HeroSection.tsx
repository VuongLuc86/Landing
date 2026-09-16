import React from 'react';

interface HeroProps {
  onOpenOrder: () => void;
  onOpenSimulator: () => void;
}

export const HeroSection: React.FC<HeroProps> = ({ onOpenOrder, onOpenSimulator }) => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#f7f9fb] via-[#f2f4f6] to-[#f7f9fb] py-10 sm:py-16 md:py-20" id="top">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Narrative Copy */}
        <div className="lg:col-span-6 flex flex-col items-start gap-6 z-10">
          {/* Made-in-Vietnam Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs sm:text-sm shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 led-indicator shrink-0" />
            <span className="font-bold tracking-wide uppercase">
              Điện 365 • Đại Lý Chính Thức Của HUNONIC Việt Nam
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-[56px] text-slate-900 tracking-tight leading-[1.15] font-bold">
            Tiện Nghi Đẳng Cấp •{' '}
            <span className="text-blue-700 underline decoration-blue-500/30 decoration-wavy decoration-2">
              Tiết Kiệm Điện
            </span>{' '}
            • An Toàn Tuyệt Đối
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
            Biến ngôi nhà thông thường thành nhà thông minh chỉ trong{' '}
            <strong className="text-slate-900 font-bold">5 phút tự lắp đặt</strong>. Chuẩn đế âm Sino,
            Panasonic, không cần đục tường kéo lại dây.{' '}
            <strong className="text-blue-700 font-bold">Giá đại lý trực tiếp từ nhà máy</strong>.
          </p>

          {/* 3 Feature Value Chips */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 w-full pt-1">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white shadow-xs border border-slate-200/80 hover:-translate-y-0.5 transition-all text-xs sm:text-sm font-semibold text-slate-800">
              <span className="material-symbols-outlined text-[20px] text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <span>Lắp vừa mọi đế âm sẵn có tại VN</span>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white shadow-xs border border-slate-200/80 hover:-translate-y-0.5 transition-all text-xs sm:text-sm font-semibold text-slate-800">
              <span className="material-symbols-outlined text-[20px] text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <span>Giọng nói Tiếng Việt, Google & Alexa</span>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white shadow-xs border border-slate-200/80 hover:-translate-y-0.5 transition-all text-xs sm:text-sm font-semibold text-slate-800">
              <span className="material-symbols-outlined text-[20px] text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <span>Bảo hành 24 tháng 1 đổi 1 tận nơi</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2 w-full">
            <button
              onClick={onOpenOrder}
              className="inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-4 rounded-xl text-white text-sm sm:text-base font-bold shadow-xl btn-cta-action transition-all group active:scale-95"
            >
              <span className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform">
                shopping_cart
              </span>
              <span>ĐẶT HÀNG NGAY — NHẬN GIÁ ĐẠI LÝ</span>
              <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1.5 transition-transform">
                arrow_forward
              </span>
            </button>

            <button
              onClick={onOpenSimulator}
              className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-white border border-blue-200 text-blue-700 text-sm font-bold hover:bg-blue-50 shadow-xs hover:-translate-y-0.5 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">touch_app</span>
              <span>Thử công tắc 0.1s</span>
            </button>
          </div>

          {/* Micro Social Proof & Certifications */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
            <div className="flex items-center gap-2.5">
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <span className="text-xs sm:text-sm text-slate-600 font-medium">
                Hơn <strong className="text-slate-900 font-bold">50.000+</strong> thiết bị đang hoạt động
              </span>
            </div>

            <div className="h-4 w-px bg-slate-300 hidden sm:block" />

            <div className="flex items-center gap-1.5 text-slate-600 text-xs sm:text-sm">
              <span className="material-symbols-outlined text-[18px] text-blue-600">verified</span>
              <span>Đạt chứng chỉ ISO 9001:2015 & TCVN</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual with Interactive Overlays */}
        <div className="lg:col-span-6 relative flex items-center justify-center">
          <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 via-emerald-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />

          <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-white border border-slate-200 group">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0JOYXPQDCPpLc2e4QLXxGj45-G0X2fK2-n9soT34V2u99QAd4J0gnGvZMfXBF16fW8AlBU-cBasjs-Xgpp7rmsYyLM7d_U7I1RNbOPnDLZy1knscAIViC7Q66pmoQqVzzCwsT6hi87eI2xxrkrGT6jFdHRer9vCrPIQtxUf1q9QXZKG8b-f4S4Do03LiAcDz0vYPrPeOLgyA-V6te4cr7AG8RZ5xY_Qo7KJoeTzkpgT7en-6AngrE"
              alt="Không gian sống thông minh Hunonic sang trọng, sắc nét, hiện đại chuẩn Việt Nam"
              className="w-full h-auto object-cover aspect-square md:aspect-[4/3] group-hover:scale-105 transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
            />

            {/* Overlapping Floating Card Top Left */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 shadow-xl border border-white/70 flex items-center gap-3 hover:scale-105 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 relative">
                <span className="material-symbols-outlined text-[24px]">bolt</span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 led-indicator" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-bold text-slate-900 leading-tight font-heading">
                  Phản hồi 0.1s
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Cloud Server Việt Nam</span>
              </div>
            </div>

            {/* Overlapping Floating Card Bottom Right */}
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-xl border border-white/70 flex items-center gap-3 hover:scale-105 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <span className="material-symbols-outlined text-[24px]">verified_user</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-bold text-emerald-700 leading-tight font-heading">
                  0đ Phí Tháng
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Trọn đời không thu phí app</span>
              </div>
            </div>

            {/* Overlapping Floating Pill Bottom Left */}
            <div className="absolute bottom-4 left-4 hidden sm:flex items-center gap-2 bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-2 rounded-xl shadow-lg text-xs font-semibold">
              <span className="material-symbols-outlined text-[18px] text-amber-400">workspace_premium</span>
              <span>Tự hào Thương hiệu Quốc gia Sao Khuê</span>
            </div>
          </div>
        </div>
      </div>

      {/* MEDIA & SOCIAL PROOF STRIP */}
      <div className="w-full mt-12 sm:mt-16 py-6 bg-white border-y border-slate-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-6 text-slate-500">
          <span className="text-xs uppercase tracking-widest font-bold text-slate-600">
            Được đưa tin & bảo chứng bởi:
          </span>
          <div className="flex flex-wrap items-center gap-6 sm:gap-10 md:gap-12 opacity-85">
            <span className="text-lg sm:text-xl font-black tracking-tighter text-slate-800 hover:text-red-700 transition-colors">
              VTV1
            </span>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-red-700 hover:opacity-100 transition-opacity">
              VnExpress
            </span>
            <span className="text-lg sm:text-xl font-bold text-blue-800 hover:opacity-100 transition-opacity">
              Dân Trí
            </span>
            <span className="text-lg sm:text-xl font-bold text-emerald-700 hover:opacity-100 transition-opacity">
              CafeF
            </span>
            <span className="text-xs sm:text-sm font-bold px-3 py-1 rounded-md bg-slate-100 text-slate-800">
              Cúp Sao Khuê 2023
            </span>
            <span className="text-xs sm:text-sm font-bold px-3 py-1 rounded-md bg-slate-100 text-slate-800">
              TCVN 6480-1
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
