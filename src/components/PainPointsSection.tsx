import React from 'react';

export const PainPointsSection: React.FC = () => {
  return (
    <section className="w-full py-8 sm:py-12 bg-[#f2f4f6]" id="thuc-trang">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col gap-6 sm:gap-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto">
          <span className="text-xs sm:text-sm text-red-700 uppercase tracking-widest flex items-center gap-1.5 font-bold">
            <span className="material-symbols-outlined text-[18px]">warning</span>
            Thực trạng nhức nhối hàng ngày
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-slate-900 leading-tight">
            Bạn Có Đang Mệt Mỏi Với Những Bất Tiện Này?
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Hệ thống điện truyền thống không chỉ gây lãng phí hàng triệu đồng hóa đơn điện mỗi tháng mà
            còn tiềm ẩn rủi ro chập cháy khi vắng nhà.
          </p>
        </div>

        {/* 4 Problem Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="rounded-2xl p-6 bg-red-100/60 flex flex-col justify-between gap-5 shadow-xs hover:shadow-md hover:-translate-y-1.5 transition-all border border-red-300/40 group">
            <div className="flex items-center justify-between">
              <span className="w-12 h-12 rounded-xl bg-red-200/80 text-red-700 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                ✕
              </span>
              <span className="material-symbols-outlined text-red-600 text-[28px]">electric_bolt</span>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                Quên tắt bình nóng lạnh, bàn ủi
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ra khỏi nhà hay đi công tác luôn thấp thỏm không biết đã tắt thiết bị công suất cao chưa.
                Hóa đơn tiền điện tăng vọt không kiểm soát.
              </p>
            </div>
            <span className="text-xs text-red-700 font-bold uppercase tracking-wide">
              Lãng phí hàng triệu đồng
            </span>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl p-6 bg-red-100/60 flex flex-col justify-between gap-5 shadow-xs hover:shadow-md hover:-translate-y-1.5 transition-all border border-red-300/40 group">
            <div className="flex items-center justify-between">
              <span className="w-12 h-12 rounded-xl bg-red-200/80 text-red-700 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                ✕
              </span>
              <span className="material-symbols-outlined text-red-600 text-[28px]">bed</span>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                Bất tiện đêm khuya
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Đang nằm ngủ ấm cúng phải mò mẫm dậy trong bóng tối tìm công tắc tắt đèn cầu thang, sân
                vườn hoặc điều chỉnh lại nhiệt độ điều hòa.
              </p>
            </div>
            <span className="text-xs text-red-700 font-bold uppercase tracking-wide">
              Gây mất giấc ngủ sâu
            </span>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl p-6 bg-red-100/60 flex flex-col justify-between gap-5 shadow-xs hover:shadow-md hover:-translate-y-1.5 transition-all border border-red-300/40 group">
            <div className="flex items-center justify-between">
              <span className="w-12 h-12 rounded-xl bg-red-200/80 text-red-700 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                ✕
              </span>
              <span className="material-symbols-outlined text-red-600 text-[28px]">family_restroom</span>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                Nỗi lo an toàn cho trẻ & người già
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ổ cắm cơ thông thường tiềm ẩn nguy cơ giật điện khi trẻ em nghịch ngợm. Không có cảm biến
                cảnh báo rò rỉ điện hay chập cháy từ xa.
              </p>
            </div>
            <span className="text-xs text-red-700 font-bold uppercase tracking-wide">
              Nguy cơ cháy nổ tiềm ẩn
            </span>
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl p-6 bg-red-100/60 flex flex-col justify-between gap-5 shadow-xs hover:shadow-md hover:-translate-y-1.5 transition-all border border-red-300/40 group">
            <div className="flex items-center justify-between">
              <span className="w-12 h-12 rounded-xl bg-red-200/80 text-red-700 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                ✕
              </span>
              <span className="material-symbols-outlined text-red-600 text-[28px]">price_change</span>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                Hàng ngoại đắt đỏ & Thu phí tháng
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Thiết bị ngoại nhập đòi hỏi Hub trung tâm 2-3 triệu, đục phá tường sửa dây và ép người dùng
                đóng phí duy trì phần mềm hàng tháng.
              </p>
            </div>
            <span className="text-xs text-red-700 font-bold uppercase tracking-wide">
              Chi phí tốn kém vô lý
            </span>
          </div>
        </div>

        {/* Solution Banner Highlight */}
        <div className="relative overflow-hidden rounded-3xl bg-blue-700 text-white p-8 lg:p-12 shadow-xl shimmer-container">
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex flex-col gap-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm self-start">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span className="text-xs uppercase tracking-wider font-bold">
                  Đột Phá Công Nghệ Thuần Việt — Hunonic
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-[32px] font-bold font-heading leading-tight">
                HUNONIC Giải Quyết Mọi Vấn Đề: Mua 1 Lần — Dùng Trọn Đời — 0đ Phí Duy Trì!
              </h3>

              <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
                Chỉ cần thay thế mặt công tắc và cắm trực tiếp ổ cắm. Sử dụng hệ thống máy chủ Cloud đặt tại
                trung tâm dữ liệu Viettel & VNPT Việt Nam với tốc độ phản hồi 0.1s tức thì và tính bảo mật
                tuyệt đối.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 shrink-0 w-full lg:w-auto">
              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 hover:bg-white/20 transition-all">
                <div className="relative">
                  <span className="material-symbols-outlined text-[32px] text-amber-300">speed</span>
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 led-indicator" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-bold font-heading">0.1 Giây</span>
                  <span className="text-xs text-blue-100">Tốc độ phản hồi cực nhanh</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 hover:bg-white/20 transition-all">
                <div className="relative">
                  <span className="material-symbols-outlined text-[32px] text-emerald-300">lock</span>
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 led-indicator" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-bold font-heading">Bảo Mật 100%</span>
                  <span className="text-xs text-blue-100">Máy chủ tại Việt Nam</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
