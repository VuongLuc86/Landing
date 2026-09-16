import React from 'react';
import { COMPARISON_ROWS } from '../data/mockData';

export const ComparisonTable: React.FC = () => {
  return (
    <section className="w-full py-16 lg:py-24 bg-[#f2f4f6]" id="bang-so-sanh">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col gap-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto">
          <span className="text-xs sm:text-sm text-blue-700 uppercase tracking-widest font-bold">
            Lựa Chọn Thông Thái Cho Gia Đình
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-slate-900 leading-tight">
            Bảng So Sánh Vượt Trội
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Minh bạch tuyệt đối giữa thiết bị thuần Việt Hunonic và các thương hiệu trôi nổi/ngoại nhập
            trên thị trường.
          </p>
        </div>

        {/* Clean Comparison Container */}
        <div className="w-full overflow-x-auto rounded-3xl bg-white shadow-xl border border-slate-200">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="py-5 px-6 font-bold text-slate-900 w-1/3 font-heading text-base sm:text-lg">
                  Tiêu chuẩn so sánh
                </th>
                <th className="py-5 px-6 font-bold text-white bg-blue-700 w-1/3 text-center rounded-t-2xl shadow-inner font-heading text-base sm:text-lg">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 led-indicator" />
                    <span>HUNONIC Smart Home</span>
                  </div>
                </th>
                <th className="py-5 px-6 font-bold text-slate-600 w-1/3 text-center font-heading text-base sm:text-lg">
                  Thiết bị ngoại nhập / Khác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {COMPARISON_ROWS.map((row, index) => (
                <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4.5 px-6 text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[20px] text-slate-500">
                      {row.icon}
                    </span>
                    <span>{row.criteria}</span>
                  </td>

                  <td className="py-4.5 px-6 text-center text-sm sm:text-base font-bold text-emerald-800 bg-blue-50/40">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-xs ${
                        row.hunonicStatus === 'highlight'
                          ? 'bg-orange-100 text-[#e04b16]'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {row.hunonicValue}
                    </span>
                  </td>

                  <td className="py-4.5 px-6 text-center text-xs sm:text-sm font-medium">
                    <span
                      className={
                        row.competitorStatus === 'error'
                          ? 'text-red-600 font-bold'
                          : 'text-slate-600'
                      }
                    >
                      {row.competitorValue}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
