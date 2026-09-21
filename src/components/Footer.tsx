import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & Origin */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img
                src="https://hunonic.com/wp-content/uploads/2024/05/logo-hunonic-ngang-1-1.png"
                alt="Điện 365 Đại lý chính thức của HUNONIC"
                className="h-8 w-auto object-contain brightness-0 invert"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = '/images/hunonic/logo-hunonic-ngang.png';
                }}
              />
              <div className="flex flex-col border-l border-slate-700 pl-3">
                <span className="text-sm font-black font-heading text-white">Điện 365</span>
                <span className="text-[11px] text-blue-400 font-bold uppercase">Đại Lý Chính Thức HUNONIC</span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Nhà thông minh thuần Việt hàng đầu. Sản phẩm được nghiên cứu, phát triển và làm chủ công nghệ hoàn toàn tại Việt Nam.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 led-indicator" />
              <span>Máy chủ Cloud đặt tại Viettel IDC & VNPT Data</span>
            </div>
          </div>

          {/* Col 2: Headquarters & Factory */}
          <div className="flex flex-col gap-3 text-xs">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
              Tổng Kho & Nhà Máy
            </h4>
            <p className="text-slate-300">
              <strong>Nhà máy sản xuất:</strong> Khu Công Nghiệp Yên Bình, TP. Phổ Yên, Thái Nguyên
            </p>
            <p className="text-slate-300">
              <strong>Văn phòng kỹ thuật Hà Nội:</strong> Tòa nhà văn phòng Hunonic, Nam Từ Liêm, Hà Nội
            </p>
            <p className="text-slate-300">
              <strong>Chi nhánh miền Nam:</strong> Quận Tân Bình, TP. Hồ Chí Minh
            </p>
          </div>

          {/* Col 3: Support & Hotline */}
          <div className="flex flex-col gap-3 text-xs">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
              Hỗ Trợ Kỹ Thuật 24/7
            </h4>
            <p className="text-slate-300">
              <strong>Hotline Đặt Hàng:</strong>{' '}
              <a href="tel:0877999663" className="text-blue-400 hover:underline">
                0877.999.663
              </a>
            </p>
            <p className="text-slate-300">
              <strong>Tư vấn kỹ thuật:</strong>{' '}
              <a href="tel:0877999663" className="text-blue-400 hover:underline">
                0877.999.663
              </a>
            </p>
            <p className="text-slate-300">
              <strong>Email:</strong> hotro@hunonic.com
            </p>
            <p className="text-slate-300">
              <strong>Thời gian làm việc:</strong> 8:00 - 21:00 (Cả Thứ 7, CN)
            </p>
          </div>

          {/* Col 4: Quality Standard */}
          <div className="flex flex-col gap-3 text-xs">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
              Chứng Nhận Chất Lượng
            </h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-semibold">
                TCVN 6480-1
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-semibold">
                ISO 9001:2015
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-semibold">
                Cúp Sao Khuê
              </span>
            </div>
            <p className="text-slate-400 text-[11px] pt-1">
              Cam kết bảo hành 24 tháng 1 đổi 1 tận nơi. Miễn phí nâng cấp phần mềm trọn đời.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Điện 365 — Đại lý chính thức của HUNONIC Việt Nam. Nhà thông minh của người Việt.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Chính sách bảo hành</span>
            <span>•</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Chính sách đổi trả</span>
            <span>•</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Bảo mật thông tin</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
