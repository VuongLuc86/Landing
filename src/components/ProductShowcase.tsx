import React, { useState, useMemo } from 'react';
import { PRODUCTS_DATA, PRODUCT_CATEGORIES } from '../data/mockData';
import { Product } from '../types';
import { TechnicalSpecsModal } from './TechnicalSpecsModal';
import { useCart } from '../context/CartContext';

interface ProductShowcaseProps {
  onSelectProduct: (product: Product) => void;
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  onSelectProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('tat-ca');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'discount'>('price-desc');
  const [visibleCount, setVisibleCount] = useState<number>(24);
  const [viewingSpecsProduct, setViewingSpecsProduct] = useState<Product | null>(null);
  const { addToCart, openCheckoutWithItem } = useCart();

  const filteredProducts = useMemo(() => {
    const list = PRODUCTS_DATA.filter((p) => {
      const matchesCategory = selectedCategory === 'tat-ca' || p.categorySlug === selectedCategory;
      if (!matchesCategory) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        p.specs.some((s) => s.toLowerCase().includes(q))
      );
    });

    return list.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
      return b.price - a.price; // Sắp xếp thiết bị đắt tiền nhất lên trước
    });
  }, [selectedCategory, searchQuery, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <section className="w-full py-8 sm:py-12 bg-white" id="san-pham">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col gap-6 sm:gap-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Danh Mục Thiết Bị Chính Hãng Hunonic Việt Nam</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-slate-900 leading-tight">
            Sản Phẩm, Thông Số Kỹ Thuật & Giá Bán Ưu Đãi Trực Tiếp
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
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setVisibleCount(24);
                }}
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

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(24);
              }}
              placeholder="Tìm kiếm theo tên thiết bị, công tắc, camera, ổ cắm, cửa cuốn..."
              className="w-full pl-10 pr-9 py-2 rounded-xl text-xs sm:text-sm bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium text-slate-800 placeholder-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setVisibleCount(24);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                title="Xóa tìm kiếm"
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 justify-between sm:justify-end">
            <span className="text-xs text-slate-500 font-semibold shrink-0">
              {filteredProducts.length} sản phẩm
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="price-desc">Giá: Cao đến Thấp (Đắt nhất trước)</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="discount">Ưu Đãi Nhiều Nhất</option>
              <option value="default">Mặc Định Nổi Bật</option>
            </select>
          </div>
        </div>

        {/* Empty Search State */}
        {displayedProducts.length === 0 && (
          <div className="text-center py-16 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <span className="material-symbols-outlined text-[48px] text-slate-400 mb-2">search_off</span>
            <h3 className="text-lg font-bold text-slate-800">Không tìm thấy thiết bị phù hợp</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Không có sản phẩm nào khớp với từ khóa "{searchQuery}". Vui lòng thử từ khóa khác hoặc chọn danh mục khác.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('tat-ca');
                setVisibleCount(24);
              }}
              className="mt-4 px-4 py-2 bg-blue-700 text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition-colors cursor-pointer"
            >
              Xem Tất Cả 109 Sản Phẩm
            </button>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {displayedProducts.map((product) => {
            const isTopRated = product.id === 'switch-luxury' || product.id === 'breaker-notec' || product.id === 'switch-smech';

            return (
              <div
                key={product.id}
                className={`rounded-2xl bg-white p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group border ${
                  isTopRated
                    ? 'border-blue-400/80 ring-2 ring-blue-500/10'
                    : 'border-slate-200/90 hover:border-blue-300'
                }`}
              >
                <div>
                  {/* Top Metadata Header (Category, Hot Tag, Genuine Warranty) - completely separate from image */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold uppercase tracking-wider">
                        {product.category}
                      </span>
                      {product.tag && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300/80 text-[11px] font-bold flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[13px] text-amber-600">local_fire_department</span>
                          <span>{product.tag}</span>
                        </span>
                      )}
                    </div>

                    {product.warranty && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-bold flex items-center gap-1 shrink-0">
                        <span className="material-symbols-outlined text-[12px] text-emerald-600">verified</span>
                        <span>{product.warranty}</span>
                      </span>
                    )}
                  </div>

                  {/* Image Container - 100% unobscured, clean canvas */}
                  <div className="relative w-full rounded-xl overflow-hidden bg-slate-50 aspect-square flex items-center justify-center p-4 border border-slate-100/90 group-hover:bg-slate-50/60 transition-colors">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={(e) => {
                        if (product.fallbackImageUrl && !e.currentTarget.src.includes(product.fallbackImageUrl)) {
                          e.currentTarget.src = product.fallbackImageUrl;
                        }
                      }}
                    />
                  </div>

                  {/* Feature Badge & 3D Demo Link Row */}
                  <div className="flex items-center justify-between gap-2 mt-2.5 min-h-[1.75rem]">
                    {product.badge ? (
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] text-blue-600">check</span>
                        <span>{product.badge}</span>
                      </span>
                    ) : (
                      <div />
                    )}
                  </div>

                  {/* Product Details Section */}
                  <div className="flex flex-col gap-2 mt-3">
                    {/* Full Product Name - Always clearly visible without overlap */}
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading group-hover:text-blue-700 transition-colors min-h-[2.85rem] line-clamp-2 leading-snug">
                      {product.name}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-slate-500 min-h-[2.5rem] line-clamp-2 leading-relaxed">
                      {product.shortDesc}
                    </p>

                    {/* Price & Discount Row */}
                    <div className="flex items-baseline gap-2 pt-1 flex-wrap">
                      <span className="text-xl sm:text-2xl font-black text-[#e04b16] font-heading">
                        {product.price.toLocaleString('vi-VN')}đ
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        {product.originalPrice.toLocaleString('vi-VN')}đ
                      </span>
                      <span className="px-1.5 py-0.5 rounded-md bg-red-50 text-[#e04b16] border border-red-200/80 text-[11px] font-bold">
                        -{product.discountPercent}%
                      </span>
                    </div>

                    {/* Dealer Promotion Note - Full visibility */}
                    {product.promotionNote && (
                      <div className="mt-1 text-xs text-amber-900 bg-amber-50/90 px-2.5 py-1.5 rounded-lg border border-amber-200/70 flex items-start gap-1.5 font-medium leading-relaxed">
                        <span className="material-symbols-outlined text-[15px] text-amber-600 shrink-0 mt-0.5">
                          redeem
                        </span>
                        <span>{product.promotionNote}</span>
                      </div>
                    )}

                    {/* Key Specs Highlights */}
                    <div className="border-t border-slate-100 pt-3 mt-1">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1.5">
                        Thông số chính:
                      </span>
                      <ul className="flex flex-col gap-1.5 text-xs text-slate-600">
                        {product.specs.slice(0, 3).map((spec, index) => (
                          <li key={index} className="flex items-start gap-1.5">
                            <span
                              className="material-symbols-outlined text-[15px] text-emerald-600 shrink-0 mt-0.5"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              check_circle
                            </span>
                            <span className="leading-snug">{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons: View Specs, Add to Cart & Buy Now */}
                <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setViewingSpecsProduct(product)}
                      className="inline-flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/90 transition-colors border border-slate-200 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px] text-slate-600">tune</span>
                      <span>Thông Số</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        addToCart(
                          {
                            productId: product.id,
                            name: product.name,
                            category: product.category,
                            price: product.price,
                            originalPrice: product.originalPrice,
                            imageUrl: product.imageUrl,
                            shape: product.options?.shapes?.[0]?.name ? 'Đế Chữ nhật' : undefined,
                            gangs: product.options?.gangs?.[0] || 4,
                            color: 'Đen Huyền Bí',
                            quantity: 1,
                            warranty: product.warranty,
                          },
                          true
                        )
                      }
                      className="inline-flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] text-blue-700">add_shopping_cart</span>
                      <span>Thêm Vào Giỏ</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      openCheckoutWithItem({
                        productId: product.id,
                        name: product.name,
                        category: product.category,
                        price: product.price,
                        originalPrice: product.originalPrice,
                        imageUrl: product.imageUrl,
                        shape: product.options?.shapes?.[0]?.name ? 'Đế Chữ nhật' : undefined,
                        gangs: product.options?.gangs?.[0] || 4,
                        color: 'Đen Huyền Bí',
                        quantity: 1,
                        warranty: product.warranty,
                      })
                    }
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#e04b16] hover:bg-[#c93e0e] transition-all shadow-md active:scale-98 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[17px]">flash_on</span>
                    <span>Mua Ngay (Đã Gồm VAT)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More & Pagination Buttons */}
        {filteredProducts.length > visibleCount && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 24)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">expand_more</span>
              <span>
                Xem Thêm 24 Sản Phẩm (Còn {filteredProducts.length - visibleCount} / {filteredProducts.length})
              </span>
            </button>

            <button
              type="button"
              onClick={() => setVisibleCount(filteredProducts.length)}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold border border-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Xem Tất Cả ({filteredProducts.length} Sản Phẩm)</span>
            </button>
          </div>
        )}

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
