import React, { useState } from 'react';
import { Product } from '../types';

interface CustomizerModalProps {
  product: Product | null;
  onClose: () => void;
  onProceedOrder: (config: {
    product: Product;
    shape: string;
    gangs?: number;
    color?: string;
    quantity: number;
  }) => void;
}

export const ProductCustomizerModal: React.FC<CustomizerModalProps> = ({
  product,
  onClose,
  onProceedOrder,
}) => {
  if (!product) return null;

  const [shape, setShape] = useState<'rectangular' | 'square'>('rectangular');
  const [gangs, setGangs] = useState<number>(4);
  const [color, setColor] = useState<'champagne' | 'black'>('champagne');
  const [quantity, setQuantity] = useState<number>(1);

  const hasGangOptions = !!product.options?.gangs;
  const hasShapeOptions = !!product.options?.shapes;
  const hasColorOptions = !!product.options?.colors;

  // Determine current unit price and original price based on selected gang if applicable
  const getGangedPrices = () => {
    if (product.id === 'switch-luxury' && hasGangOptions) {
      // Official Hunonic Luxury prices: 1 gang: 730k (895k), 2 gangs: 765k (920k), 3 gangs: 795k (950k), 4 gangs: 825k (980k)
      const gangMap: Record<number, { price: number; originalPrice: number }> = {
        1: { price: 730000, originalPrice: 895000 },
        2: { price: 765000, originalPrice: 920000 },
        3: { price: 795000, originalPrice: 950000 },
        4: { price: 825000, originalPrice: 980000 },
      };
      return gangMap[gangs] || { price: product.price, originalPrice: product.originalPrice };
    }
    if (product.id === 'switch-smech' && hasGangOptions) {
      // Official Hunonic Smech: 1 gang: 460k, 2 gangs: 485k, 3 gangs: 520k, 4 gangs: 550k
      const gangMap: Record<number, { price: number; originalPrice: number }> = {
        1: { price: 460000, originalPrice: 550000 },
        2: { price: 485000, originalPrice: 580000 },
        3: { price: 520000, originalPrice: 620000 },
        4: { price: 550000, originalPrice: 650000 },
      };
      return gangMap[gangs] || { price: product.price, originalPrice: product.originalPrice };
    }
    return { price: product.price, originalPrice: product.originalPrice };
  };

  const { price: currentUnitPrice, originalPrice: currentUnitOriginalPrice } = getGangedPrices();
  const currentDiscountPercent = Math.round(((currentUnitOriginalPrice - currentUnitPrice) / currentUnitOriginalPrice) * 100);

  const handleOrder = () => {
    onProceedOrder({
      product: {
        ...product,
        price: currentUnitPrice,
        originalPrice: currentUnitOriginalPrice,
        discountPercent: currentDiscountPercent,
      },
      shape: shape === 'rectangular' ? 'Chữ nhật (120x72mm)' : 'Vuông (86x86mm)',
      gangs: hasGangOptions ? gangs : undefined,
      color: hasColorOptions ? (color === 'champagne' ? 'Vàng Champagne' : 'Đen Titan') : undefined,
      quantity,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl border border-slate-200 flex flex-col gap-5 sm:gap-6 relative max-h-[92vh] overflow-y-auto my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                {product.category}
              </span>
              {product.warranty && (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  {product.warranty}
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-2xl font-bold font-heading text-slate-900 mt-0.5">
              {product.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Đóng"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Promotion banner if present */}
        {product.promotionNote && (
          <div className="text-xs text-amber-800 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200/60 font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-amber-600 shrink-0">redeem</span>
            <span>Ưu đãi chính hãng: {product.promotionNote}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 sm:gap-6 items-center">
          {/* Left: Product preview */}
          <div className="sm:col-span-5 bg-slate-50 rounded-2xl p-4 flex flex-col items-center justify-center border border-slate-200">
            <div className="w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  if (product.fallbackImageUrl && !e.currentTarget.src.includes(product.fallbackImageUrl)) {
                    e.currentTarget.src = product.fallbackImageUrl;
                  }
                }}
              />
            </div>
            <div className="mt-3 text-center">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-xl sm:text-2xl font-extrabold text-[#e04b16] font-heading">
                  {(currentUnitPrice * quantity).toLocaleString('vi-VN')}đ
                </span>
                <span className="text-xs text-slate-400 line-through">
                  {(currentUnitOriginalPrice * quantity).toLocaleString('vi-VN')}đ
                </span>
              </div>
              <span className="inline-block mt-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Tiết kiệm {((currentUnitOriginalPrice - currentUnitPrice) * quantity).toLocaleString('vi-VN')}đ (-{currentDiscountPercent}%)
              </span>
            </div>
          </div>

          {/* Right: Options */}
          <div className="sm:col-span-7 flex flex-col gap-3.5">
            {/* Gangs selector */}
            {hasGangOptions && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 flex items-center justify-between">
                  <span>Số nút điều khiển:</span>
                  <span className="text-[11px] font-semibold text-blue-700 lowercase">
                    {product.id === 'switch-luxury'
                      ? '730k (1 nút) • 765k (2 nút) • 795k (3 nút) • 825k (4 nút)'
                      : product.id === 'switch-smech'
                      ? '460k (1 nút) • 485k (2 nút) • 520k (3 nút) • 550k (4 nút)'
                      : ''}
                  </span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((g) => {
                    const gPrice = product.id === 'switch-luxury'
                      ? (g === 1 ? '730k' : g === 2 ? '765k' : g === 3 ? '795k' : '825k')
                      : product.id === 'switch-smech'
                      ? (g === 1 ? '460k' : g === 2 ? '485k' : g === 3 ? '520k' : '550k')
                      : null;

                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGangs(g)}
                        className={`py-2 px-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                          gangs === g
                            ? 'bg-blue-700 text-white shadow-sm ring-2 ring-blue-700/20'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <span>{g} Nút</span>
                        {gPrice && (
                          <span className={`text-[10px] ${gangs === g ? 'text-blue-100' : 'text-slate-500'}`}>
                            {gPrice}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Shape selector */}
            {hasShapeOptions && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Chuẩn hộp đế âm tường:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setShape('rectangular')}
                    className={`p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                      shape === 'rectangular'
                        ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block font-bold">Chữ nhật 120x72mm</span>
                    <span className="text-[10px] text-slate-500">Sino, Panasonic</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShape('square')}
                    className={`p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                      shape === 'square'
                        ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block font-bold">Vuông 86x86mm</span>
                    <span className="text-[10px] text-slate-500">Schneider, EU</span>
                  </button>
                </div>
              </div>
            )}

            {/* Color selector */}
            {hasColorOptions && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Màu viền nhôm Anode:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setColor('champagne')}
                    className={`p-2 rounded-xl text-xs flex items-center gap-2 border transition-all cursor-pointer ${
                      color === 'champagne'
                        ? 'border-[#d4af37] bg-[#fbf5e8] font-bold text-amber-900 ring-2 ring-amber-400/20'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-[#d4af37] shrink-0 shadow-xs" />
                    <span>Vàng Champagne</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setColor('black')}
                    className={`p-2 rounded-xl text-xs flex items-center gap-2 border transition-all cursor-pointer ${
                      color === 'black'
                        ? 'border-slate-800 bg-slate-900 text-white font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-slate-800 shrink-0 shadow-xs" />
                    <span>Đen Titan</span>
                  </button>
                </div>
              </div>
            )}

            {/* If product doesn't have custom shape/color options, show key bullet points */}
            {!hasGangOptions && !hasShapeOptions && !hasColorOptions && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="text-xs font-bold text-slate-700 uppercase block mb-1.5">
                  Đặc điểm nổi bật:
                </span>
                <ul className="flex flex-col gap-1 text-xs text-slate-600">
                  {product.specs.slice(0, 3).map((spec, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-emerald-600 shrink-0">
                        check
                      </span>
                      <span className="line-clamp-1">{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 uppercase">Số lượng đặt mua:</label>
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 py-1 text-sm font-bold text-slate-900 min-w-[36px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="border-t border-slate-100 pt-3 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 sm:py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Quay lại
          </button>
          <button
            type="button"
            onClick={handleOrder}
            className="flex-2 py-2.5 sm:py-3 rounded-xl text-white font-bold text-xs sm:text-sm bg-blue-700 hover:bg-blue-800 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
          >
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>Xác Nhận & Thêm Vào Đơn Hàng</span>
          </button>
        </div>
      </div>
    </div>
  );
};
