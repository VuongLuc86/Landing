import React, { useState } from 'react';
import { PRODUCTS_DATA, PRODUCT_CATEGORIES } from '../data/mockData';
import { Product } from '../types';
import { TechnicalSpecsModal } from './TechnicalSpecsModal';

interface ProductShowcaseProps {
  onSelectProduct: (product: Product) => void;
  onOpenSimulator: () => void;
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  onSelectProduct,
  onOpenSimulator,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('tat-ca');
  const [viewingSpecsProduct, setViewingSpecsProduct] = useState<Product | null>(null);

  const filteredProducts =
    selectedCategory === 'tat-ca'
      ? PRODUCTS_DATA
      : PRODUCTS_DATA.filter((p) => p.categorySlug === selectedCategory);

  return (
    <section className="w-full py-16 lg:py-24 bg-white" id="san-pham">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col gap-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Danh Mục Thiết Bị Chính Hãng Hunonic Việt Nam</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-slate-900 leading-tight">
            Sản Phẩm, Thông Số Kỹ Thuật & Giá Bán Ưu Đãi Đại Lý
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            Tất cả thiết bị được nghiên cứu, lập trình phần mềm và sản xuất 100% tại Việt Nam. Vừa vặn hoàn hảo mọi hộp đế âm tiêu chuẩn chữ nhật Sino, Panasonic & chuẩn vuông EU.
          </p>
        </div>

        {/* Category Tabs Navigation matching hunonic.com */}
        <div className="w-full flex items-center justify-start lg:justify-center overflow-x-auto pb-2 scrollbar-none gap-2 sm:gap-3">
          {PRODUCT_CATEGORIES.map((cat) => {
            const count =
              cat.id === 'tat-ca'
                ? PRODUCTS_DATA.length
                : PRODUCTS_DATA.filter((p) => p.categorySlug === cat.id).length;
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-blue-700 text-white shadow-md shadow-blue-700/25 scale-[1.02]'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                <span>{cat.name}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {filteredProducts.map((product) => {
            const isTopRated = product.id === 'switch-luxury' || product.id === 'breaker-notec';

            return (
              <div
                key={product.id}
                className={`rounded-2xl bg-white p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative border ${
                  isTopRated
                    ? 'border-blue-400/60 ring-1 ring-blue-500/10'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                {/* Top Badge Tag */}
                {product.tag && (
                  <div className="absolute -top-3 left-4 px-3 py-0.5 rounded-full bg-[#e04b16] text-white text-[11px] font-bold shadow-md uppercase tracking-wider flex items-center gap-1 z-10">
                    <span className="material-symbols-outlined text-[13px]">local_fire_department</span>
                    <span>{product.tag}</span>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  {/* Image Container with Badge */}
                  <div className="relative w-full rounded-xl overflow-hidden bg-slate-50 aspect-square flex items-center justify-center p-3 border border-slate-100">
                    {product.badge && (
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-white text-[10px] font-bold shadow-xs z-10 bg-slate-900/80 backdrop-blur-xs">
                        {product.badge}
                      </span>
                    )}

                    {product.warranty && (
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold shadow-xs z-10 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">verified</span>
                        <span>{product.warranty}</span>
                      </span>
                    )}

                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />

                    {/* Quick simulator button for touch switch */}
                    {product.id === 'switch-luxury' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenSimulator();
                        }}
                        className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-bold shadow-md flex items-center gap-1 hover:bg-blue-700 transition-colors cursor-pointer"
                        title="Bấm trải nghiệm công tắc cảm ứng"
                      >
                        <span className="material-symbols-outlined text-[14px]">touch_app</span>
                        <span>Bấm thử 3D</span>
                      </button>
                    )}
                  </div>

                  {/* Header & Pricing */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-semibold text-blue-700">{product.category}</span>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>
                        <span className="font-bold text-slate-700 text-xs">5.0</span>
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading group-hover:text-blue-700 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {product.shortDesc}
                    </p>

                    {/* Price & Savings */}
                    <div className="flex items-baseline gap-2 pt-1 flex-wrap">
                      <span className="text-lg sm:text-xl font-extrabold text-[#e04b16] font-heading">
                        {product.price.toLocaleString('vi-VN')}đ
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        {product.originalPrice.toLocaleString('vi-VN')}đ
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-red-100 text-[#e04b16] text-[11px] font-bold">
                        -{product.discountPercent}%
                      </span>
                    </div>

                    {/* Dealer promotion note */}
                    {product.promotionNote && (
                      <div className="mt-1 text-[11px] text-amber-800 bg-amber-50/80 px-2 py-1 rounded border border-amber-200/50 flex items-center gap-1 font-medium">
                        <span className="material-symbols-outlined text-[13px] text-amber-600 shrink-0">
                          redeem
                        </span>
                        <span className="line-clamp-1">{product.promotionNote}</span>
                      </div>
                    )}
                  </div>

                  {/* Specifications List */}
                  <div className="border-t border-slate-100 pt-3">
                    <ul className="flex flex-col gap-1.5 text-xs text-slate-600">
                      {product.specs.slice(0, 3).map((spec, index) => (
                        <li key={index} className="flex items-start gap-1.5">
                          <span
                            className="material-symbols-outlined text-[15px] text-emerald-600 shrink-0 mt-0.5"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            check_circle
                          </span>
                          <span className="leading-tight line-clamp-1">{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Action Buttons: View Specs & Order */}
                <div className="pt-4 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setViewingSpecsProduct(product)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/90 transition-colors border border-slate-200 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-slate-600">info</span>
                    <span>Xem Thông Số Kỹ Thuật</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectProduct(product)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 transition-all shadow-md active:scale-98 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
                    <span>Đặt Hàng / Tùy Chọn</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Notice: Official 365 Dealership Commitment */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 text-white flex flex-col lg:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
              <span className="material-symbols-outlined text-[28px] text-amber-400">verified_user</span>
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold font-heading">
                Cam Kết Từ Điện 365 — Đại Lý Chính Thức Của HUNONIC
              </h4>
              <p className="text-xs sm:text-sm text-blue-100">
                100% hàng chính hãng, kích hoạt bảo hành điện tử 24 tháng theo số điện thoại, hỗ trợ kỹ thuật tận tình 24/7.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#dat-hang"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-extrabold text-xs sm:text-sm shadow-md transition-transform hover:scale-105"
            >
              Nhận Báo Giá Toàn Bộ Hệ Thống
            </a>
          </div>
        </div>
      </div>

      {/* Technical Specs Datasheet Modal */}
      <TechnicalSpecsModal
        product={viewingSpecsProduct}
        onClose={() => setViewingSpecsProduct(null)}
        onSelectForOrder={(product) => onSelectProduct(product)}
      />
    </section>
  );
};
