import React, { useState, useMemo } from 'react';
import { PRODUCTS_DATA, PRODUCT_CATEGORIES, checkMatchesCategory } from '../data/mockData';
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
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'discount'>('default');
  const [visibleCount, setVisibleCount] = useState<number>(30);
  const [viewingSpecsProduct, setViewingSpecsProduct] = useState<Product | null>(null);
  const { addToCart, openCheckoutWithItem } = useCart();

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'tat-ca': PRODUCTS_DATA.length,
    };
    for (const cat of PRODUCT_CATEGORIES) {
      if (cat.id === 'tat-ca') continue;
      counts[cat.id] = PRODUCTS_DATA.filter((p) => checkMatchesCategory(p, cat.id)).length;
    }
    return counts;
  }, []);

  const filteredProducts = useMemo(() => {
    const list = PRODUCTS_DATA.filter((p) => {
      const matchesCategory = checkMatchesCategory(p, selectedCategory);
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

    return [...list].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
      return 0; // Giữ nguyên thứ tự danh mục chuẩn Hunonic
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
            <span>Danh Mục Thiết Bị Chính Hãng Hunonic Việt Nam ({PRODUCTS_DATA.length} Sản Phẩm)</span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            Tất cả thiết bị được nghiên cứu, lập trình phần mềm và sản xuất 100% tại Việt Nam. Vừa vặn hoàn hảo mọi hộp đế âm tiêu chuẩn chữ nhật Sino, Panasonic & chuẩn vuông EU.
          </p>
        </div>

        {/* Main 2-Column Section: Sidebar Category Navigation like https://hunonic.com/thiet-bi-dien-thong-minh/ */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* Left Sidebar Category Navigation (Matches hunonic.com screenshot) */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs sticky top-24">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3 px-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-emerald-600">category</span>
                  Danh Mục Sản Phẩm
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {PRODUCTS_DATA.length}
                </span>
              </h3>
              <nav className="flex flex-col gap-1.5" aria-label="Danh mục sản phẩm">
                {PRODUCT_CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  const count = categoryCounts[cat.id] ?? 0;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setVisibleCount(24);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all cursor-pointer font-medium text-sm sm:text-base flex items-center justify-between gap-2 ${
                        isActive
                          ? 'bg-gradient-to-r from-[#62d98c] to-[#88e8aa] text-[#153e26] font-bold shadow-sm scale-[1.01]'
                          : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold shrink-0 ${
                          isActive
                            ? 'bg-emerald-900/15 text-[#153e26]'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Right Area: Search, Controls, Products Grid */}
          <div className="flex-1 w-full min-w-0 flex flex-col gap-6">
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
                  placeholder="Tìm kiếm thiết bị, công tắc, camera, ổ cắm..."
                  className="w-full pl-10 pr-9 py-2 rounded-xl text-xs sm:text-sm bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-slate-800 placeholder-slate-400"
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

              <div className="flex items-center gap-2 justify-end">
                {/* Lựa chọn theo sản phẩm (Dropdown selector matching focus mode) */}
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setVisibleCount(24);
                  }}
                  className="text-xs sm:text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer max-w-[190px] truncate"
                  title="Lựa chọn theo sản phẩm"
                >
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({categoryCounts[cat.id] ?? 0})
                    </option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs sm:text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
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
                  className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  Xem Tất Cả 109 Sản Phẩm
                </button>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
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
