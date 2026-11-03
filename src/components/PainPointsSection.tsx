import React from 'react';

export const PainPointsSection: React.FC = () => {
  return (
    <section className="w-full py-8 sm:py-12 bg-[#f2f4f6]" id="thuc-trang">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col gap-6 sm:gap-8">


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
                Tiết kiệm điện
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Thiết bị tự động tắt/bật khi không có người hoặc theo lịch trình định sẵn → không còn lãng phí điện do quên tắt đèn, máy điều hòa, quạt.
                <br className="my-1" />
                Giám sát mức tiêu thụ điện theo thời gian thực → dễ nhận biết thiết bị hao điện và điều chỉnh kịp thời
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
              <span className="material-symbols-outlined text-red-600 text-[28px]">security</span>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                Tăng cường an ninh và an toàn cho gia đình
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Camera thông minh, cảm biến chuyển động, cảm biến khói/khí gas gửi cảnh báo ngay về điện thoại khi có sự cố hoặc người lạ xâm nhập, dù bạn đang ở nhà hay đi xa.
                <br className="my-1" />
                Tự động ngắt điện khi có quá tải, rò rỉ điện → phòng tránh hỏa hoạn và tai nạn điện hiệu quả.
                <br className="my-1" />
                Khóa cửa thông minh kiểm soát ai ra vào, xem lịch sử mở cửa, không còn lo mất chìa khóa.
              </p>
            </div>
            <span className="text-xs text-red-700 font-bold uppercase tracking-wide">
              Tất cả đều được báo về điện thoại thông minh của bạn
            </span>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl p-6 bg-red-100/60 flex flex-col justify-between gap-5 shadow-xs hover:shadow-md hover:-translate-y-1.5 transition-all border border-red-300/40 group">
            <div className="flex items-center justify-between">
              <span className="w-12 h-12 rounded-xl bg-red-200/80 text-red-700 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                ✕
              </span>
              <span className="material-symbols-outlined text-red-600 text-[28px]">smartphone</span>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                Tiện lợi, tiết kiệm thời gian và dễ điều khiển từ xa
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Điều khiển tất cả thiết bị từ một ứng dụng trên điện thoại: bật máy điều hòa trước khi về nhà, tắt toàn bộ thiết bị điện khi ra ngoài chỉ với một lần chạm.
                <br className="my-1" />
                Dùng lệnh giọng nói (trợ lý ảo) để điều khiển tay rảnh → rất thuận tiện khi đang bận nấu ăn, chăm con.
                <br className="my-1" />
                Tạo kịch bản tự động: “Chế độ nghỉ ngơi” tự động tắt đèn chính, bật đèn ngủ, khóa cửa khi đi ngủ — không cần điều khiển từng thiết bị.
              </p>
            </div>
            <span className="text-xs text-red-700 font-bold uppercase tracking-wide">
              Điều khiển 1 chạm & rảnh tay giọng nói
            </span>
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl p-6 bg-red-100/60 flex flex-col justify-between gap-5 shadow-xs hover:shadow-md hover:-translate-y-1.5 transition-all border border-red-300/40 group">
            <div className="flex items-center justify-between">
              <span className="w-12 h-12 rounded-xl bg-red-200/80 text-red-700 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                ✕
              </span>
              <span className="material-symbols-outlined text-red-600 text-[28px]">auto_awesome</span>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                Nâng cấp chất lượng cuộc sống
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Dễ dàng mở rộng hệ thống, kết nối nhiều thiết bị cùng nền tảng → không cần thay thế toàn bộ khi nâng cấp.
                <br className="my-1" />
                Tạo không gian sống hiện đại, thoải mái: tự động điều chỉnh độ sáng đèn, nhiệt độ phòng phù hợp với thói quen sinh hoạt.
              </p>
            </div>
            <span className="text-xs text-red-700 font-bold uppercase tracking-wide">
              Không gian hiện đại & Mở rộng linh hoạt
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
