import React from 'react';
import { COMMITMENTS, TESTIMONIALS } from '../data/mockData';

export const ReviewsAndCommitments: React.FC = () => {
  return (
    <section className="w-full py-16 lg:py-24 bg-white" id="khach-hang">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col gap-16">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1 text-amber-500">
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-slate-900 leading-tight">
            Đã Có 5.000+ Gia Đình Tin Dùng HUNONIC
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Sự an tâm và hài lòng của khách hàng là bảo chứng vững chắc nhất cho uy tín và chất lượng
            của Hunonic.
          </p>
        </div>

        {/* 5 Golden Commitments Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {COMMITMENTS.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#f2f4f6] flex flex-col gap-3 hover:-translate-y-1 transition-transform border border-slate-200"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.accentColor}`}
              >
                <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              </div>
              <span className="text-sm font-bold text-slate-900">{item.title}</span>
              <span className="text-xs text-slate-600 leading-relaxed">{item.desc}</span>
            </div>
          ))}
        </div>

        {/* 2 Real Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="p-8 rounded-3xl bg-white shadow-md flex flex-col justify-between gap-6 relative hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-200"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                  {t.verified && (
                    <span className="ml-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                      Đã xác minh mua hàng
                    </span>
                  )}
                </div>

                <p className="text-base sm:text-lg text-slate-800 italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg font-heading shadow-xs ${t.avatarBg}`}
                >
                  {t.avatarLetter}
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-slate-900 font-heading">{t.name}</span>
                  <span className="text-xs sm:text-sm text-slate-500">
                    {t.location} • {t.purchasedItems}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
