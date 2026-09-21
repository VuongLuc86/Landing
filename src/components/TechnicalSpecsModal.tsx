import React from 'react';
import { Product } from '../types';

interface TechnicalSpecsModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectForOrder: (product: Product) => void;
}

export const TechnicalSpecsModal: React.FC<TechnicalSpecsModalProps> = ({
  product,
  onClose,
  onSelectForOrder,
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full p-5 sm:p-8 shadow-2xl border border-slate-200 flex flex-col gap-6 relative max-h-[92vh] overflow-y-auto my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex flex-col gap-1 pr-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-md">
                {product.category}
              </span>
              {product.warranty && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Bảo hành {product.warranty}
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mt-1">
              Bảng Thông Số Kỹ Thuật: {product.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
            title="Đóng cửa sổ"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Product Brief Banner */}
        <div className="flex flex-col sm:flex-row gap-5 items-center bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-white shrink-0 border border-slate-200 flex items-center justify-center p-2">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
              onError={(e) => {
                if (product.fallbackImageUrl && !e.currentTarget.src.includes(product.fallbackImageUrl)) {
                  e.currentTarget.src = product.fallbackImageUrl;
                }
              }}
            />
          </div>
          <div className="flex-1 flex flex-col gap-1.5 text-center sm:text-left">
            <h4 className="font-bold text-slate-900 text-base sm:text-lg">{product.name}</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{product.shortDesc}</p>
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-1 flex-wrap">
              <span className="text-xl sm:text-2xl font-black text-[#e04b16] font-heading">
                {product.price.toLocaleString('vi-VN')}đ
              </span>
              <span className="text-sm text-slate-400 line-through">
                {product.originalPrice.toLocaleString('vi-VN')}đ
              </span>
              <span className="text-xs font-bold bg-[#e04b16]/10 text-[#e04b16] px-2 py-0.5 rounded-md">
                Tiết kiệm {product.discountPercent}%
              </span>
            </div>
            {product.promotionNote && (
              <div className="mt-1 text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60 font-medium flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-amber-600">redeem</span>
                <span>Khuyến mãi chính hãng: {product.promotionNote}</span>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Specs Table */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-[20px]">tune</span>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wider">
              Thông Số Kỹ Thuật Chi Tiết (Chuẩn Hunonic)
            </h4>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <tbody>
                {product.detailedSpecs && product.detailedSpecs.length > 0 ? (
                  product.detailedSpecs.map((spec, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70 border-t border-slate-100'}
                    >
                      <td className="py-2.5 px-3 sm:px-4 font-semibold text-slate-700 w-2/5 border-r border-slate-100">
                        {spec.label}
                      </td>
                      <td className="py-2.5 px-3 sm:px-4 text-slate-900 font-medium">{spec.value}</td>
                    </tr>
                  ))
                ) : (
                  product.specs.map((spec, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70 border-t border-slate-100'}
                    >
                      <td className="py-2.5 px-3 sm:px-4 font-semibold text-slate-700 w-2/5 border-r border-slate-100">
                        Mục {idx + 1}
                      </td>
                      <td className="py-2.5 px-3 sm:px-4 text-slate-900 font-medium">{spec}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Features Bullets */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">verified</span>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wider">
              Tính Năng & Lợi Ích Vượt Trội
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {product.features.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60"
              >
                <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">
                  check_circle
                </span>
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Certification & Quality Commitments */}
        <div className="bg-blue-50/60 rounded-xl p-3 sm:p-4 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-900">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-blue-600 text-[26px]">workspace_premium</span>
            <div>
              <span className="font-bold block">100% Nghiên Cứu & Chế Tạo Tại Việt Nam</span>
              <span className="text-blue-700 text-[11px]">
                Đạt chứng nhận hợp quy Viễn Thông & An Toàn Điện lực QCVN
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2 py-1 bg-white rounded border border-blue-200 font-bold text-slate-800 text-[11px]">
              Made in Vietnam
            </span>
            <span className="px-2 py-1 bg-white rounded border border-blue-200 font-bold text-slate-800 text-[11px]">
              Máy Chủ Cloud VN
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 sm:px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onSelectForOrder(product);
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
            <span>Đặt Mua Thiết Bị Này</span>
          </button>
        </div>
      </div>
    </div>
  );
};
