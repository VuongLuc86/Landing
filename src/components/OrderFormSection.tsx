import React, { useState, useEffect } from 'react';
import { COMBOS_DATA, PRODUCTS_DATA, PRODUCT_CATEGORIES } from '../data/mockData';
import { ProductShape } from '../types';
import { useCart } from '../context/CartContext';
import { VIETNAM_PROVINCES } from '../data/vietnamAddressData';
import {
  validateVietnamesePhoneNumber,
  validateVietnameseAddress,
} from '../utils/validationUtils';

interface OrderFormProps {
  initialBundleId?: string;
  onOpenQuickOrderModal?: (target?: any) => void;
  onOpenOrdersFileModal?: () => void;
}

export const OrderFormSection: React.FC<OrderFormProps> = ({
  initialBundleId = 'switch-luxury',
  onOpenQuickOrderModal,
  onOpenOrdersFileModal,
}) => {
  const { customerProfile, saveCustomerProfile, addToCart, setIsCartOpen, setCheckoutStep } = useCart();

  const [selectedBundle, setSelectedBundle] = useState<string>(initialBundleId);
  const [quantity, setQuantity] = useState<number>(1);
  const [shape, setShape] = useState<ProductShape>('rectangular');

  // ONLY 3 CORE FIELDS: Họ tên, Số điện thoại, Địa chỉ nhận hàng
  const [fullName, setFullName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderConfirmed, setOrderConfirmed] = useState<boolean>(false);
  const [orderCode, setOrderCode] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Autofill customer profile
  useEffect(() => {
    if (customerProfile.fullName && !fullName) setFullName(customerProfile.fullName);
    if (customerProfile.phone && !phoneNumber) setPhoneNumber(customerProfile.phone);
    if (customerProfile.address && !address) setAddress(customerProfile.address);
  }, [customerProfile]);

  useEffect(() => {
    if (initialBundleId) {
      setSelectedBundle(initialBundleId);
    }
  }, [initialBundleId]);

  // Pricing calculation
  const getSelectedItem = () => {
    const product = PRODUCTS_DATA.find((p) => p.id === selectedBundle);
    if (product) {
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category,
        image: product.imageUrl,
        fallbackImage: product.fallbackImageUrl,
        isProduct: true,
      };
    }

    const combo = COMBOS_DATA.find((c) => c.id === selectedBundle);
    if (combo) {
      return {
        id: combo.id,
        name: combo.name,
        price: combo.price,
        originalPrice: combo.originalPrice,
        category: 'Gói Combo',
        image: '/images/hunonic/hunonic-cam-ung.jpg',
        fallbackImage: '/images/hunonic/hunonic-cam-ung.jpg',
        isProduct: false,
      };
    }

    const defaultProduct = PRODUCTS_DATA[0];
    return {
      id: defaultProduct.id,
      name: defaultProduct.name,
      price: defaultProduct.price,
      originalPrice: defaultProduct.originalPrice,
      category: defaultProduct.category,
      image: defaultProduct.imageUrl,
      fallbackImage: defaultProduct.fallbackImageUrl,
      isProduct: true,
    };
  };

  const currentItem = getSelectedItem();
  const totalPrice = currentItem.price * quantity;
  const totalOriginalPrice = currentItem.originalPrice * quantity;
  const totalSaved = Math.max(0, totalOriginalPrice - totalPrice);

  const popularCities = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Bình Dương', 'Cần Thơ'];

  const handleQuickCity = (city: string) => {
    if (!address) {
      setAddress(`${city}, `);
    } else if (!address.toLowerCase().includes(city.toLowerCase())) {
      setAddress(`${address.trim()}, ${city}`);
    }
  };

  const handleAddToCart = () => {
    addToCart(
      {
        productId: currentItem.id,
        name: currentItem.name,
        category: currentItem.category,
        price: currentItem.price,
        originalPrice: currentItem.originalPrice,
        imageUrl: currentItem.image,
        shape: shape === 'rectangular' ? 'Đế Chữ nhật' : 'Đế Vuông',
        quantity,
      },
      true
    );
  };

  // Real-time validation checks
  const phoneValidation = validateVietnamesePhoneNumber(phoneNumber);
  const addressValidation = validateVietnameseAddress(address);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên của bạn.');
      return;
    }

    // Check authentic Vietnamese phone number
    if (!phoneValidation.isValid) {
      setErrorMsg(phoneValidation.message);
      return;
    }

    // Check deliverable address
    if (!addressValidation.isDeliverable) {
      setErrorMsg(addressValidation.message);
      return;
    }

    setIsSubmitting(true);

    const cleanPhone = phoneValidation.cleanPhone;
    const finalAddress = addressValidation.canonicalAddress || address.trim();

    // Save profile for future zero-friction orders
    saveCustomerProfile({
      fullName: fullName.trim(),
      phone: cleanPhone,
      address: finalAddress,
      province: addressValidation.province,
      district: addressValidation.district,
    });

    const fullNoteParts = [
      `Đế: ${shape === 'rectangular' ? 'Chữ nhật' : 'Vuông'}`,
      'Thanh toán COD khi nhận hàng',
      'Giá đã gồm VAT & Freeship',
    ].filter(Boolean);

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const dateFormatted = `${day}/${month}/${year}`;

    const payload = {
      fullName: fullName.trim(),
      phone: cleanPhone,
      address: address.trim(),
      productName: `${currentItem.name} - SL: ${quantity}`,
      amount: totalPrice,
      note: fullNoteParts.join(' | '),
      orderDate: dateFormatted,
    };

    // Save to server CSV file
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('Lưu API thất bại, lưu fallback vào localStorage:', err);
    }

    // Save to client-side storage cache for fallback resilience
    try {
      const existing = localStorage.getItem('hunonic_orders_csv_records');
      const ordersList = existing ? JSON.parse(existing) : [];
      const nextStt = ordersList.length > 0 ? Math.max(...ordersList.map((o: any) => o.stt || 0)) + 1 : 1;
      ordersList.push({
        stt: nextStt,
        fullName: payload.fullName,
        phone: payload.phone,
        address: payload.address,
        productName: payload.productName,
        orderDate: payload.orderDate,
        amount: payload.amount,
        note: payload.note,
      });
      localStorage.setItem('hunonic_orders_csv_records', JSON.stringify(ordersList));
    } catch (e) {
      console.error(e);
    }

    setIsSubmitting(false);
    const code = `HN-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderCode(code);
    setOrderConfirmed(true);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(orderCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section className="w-full py-14 lg:py-20 bg-slate-50 border-t border-slate-200" id="dat-hang">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 flex flex-col gap-8">
        {/* Section Header - Clean & Simple */}
        <div className="flex flex-col items-center text-center gap-2.5 max-w-2xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-blue-700 uppercase tracking-widest font-extrabold bg-blue-50 px-3 py-0.5 rounded-full border border-blue-200">
              Điện 365 • Đại Lý Chính Thức HUNONIC
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">verified</span>
              Đã gồm 100% thuế VAT & Miễn phí vận chuyển
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 leading-tight">
            Đặt Hàng Nhanh — Giao Tận Nơi Toàn Quốc
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Form tinh gọn chỉ 3 thông tin cốt lõi (Họ tên, Số điện thoại, Địa chỉ nhận hàng). Nhận hàng kiểm tra thử trước khi thanh toán (COD).
          </p>

          <div className="pt-1 flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setCheckoutStep('cart');
                setIsCartOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-amber-400">shopping_bag</span>
              <span>Mở Popup Giỏ Hàng Mini</span>
            </button>

            {onOpenOrdersFileModal && (
              <button
                type="button"
                onClick={onOpenOrdersFileModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-blue-800 text-xs font-bold border border-slate-300 shadow-2xs transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-blue-700">description</span>
                <span>Xem File Đơn Hàng (orders.csv)</span>
              </button>
            )}
          </div>
        </div>

        {orderConfirmed ? (
          /* Confirmation Success State */
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-200 shadow-md text-center max-w-xl mx-auto flex flex-col items-center gap-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
              ĐẶT HÀNG THÀNH CÔNG!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Cảm ơn anh/chị <strong>{fullName}</strong>. Mã đơn hàng của anh/chị là{' '}
              <strong className="text-blue-700 font-mono text-base">{orderCode}</strong>.
            </p>

            <button
              type="button"
              onClick={copyCode}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">{copiedCode ? 'check' : 'content_copy'}</span>
              <span>{copiedCode ? 'Đã sao chép mã' : 'Sao chép mã đơn'}</span>
            </button>

            <div className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs text-slate-700 flex flex-col gap-2">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Mặt hàng:</span>
                <span className="font-bold text-right text-slate-900">{currentItem.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Số lượng:</span>
                <span className="font-bold">{quantity} thiết bị</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Địa chỉ giao:</span>
                <span className="font-medium text-right">{address}</span>
              </div>
              <div className="flex justify-between py-1 text-sm font-bold text-slate-900">
                <span>Tổng tiền (Đã gồm VAT & Freeship):</span>
                <span className="text-base text-[#e04b16] font-black font-heading">
                  {totalPrice.toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center pt-2">
              <button
                type="button"
                onClick={() => setOrderConfirmed(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Đặt Thêm Đơn Khác
              </button>
              {onOpenOrdersFileModal && (
                <button
                  type="button"
                  onClick={onOpenOrdersFileModal}
                  className="px-4 py-2.5 rounded-xl bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">description</span>
                  <span>Kiểm Tra File orders.csv</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Streamlined Order Card */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-5 sm:p-8 max-w-4xl mx-auto w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Autofill indicator */}
              {customerProfile.fullName && (
                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-blue-700">auto_fix_high</span>
                    <span>Tự động điền trước thông tin từ lần ghé thăm trước</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setFullName('');
                      setPhoneNumber('');
                      setAddress('');
                    }}
                    className="text-blue-600 hover:underline text-[11px] cursor-pointer"
                  >
                    Điền mới
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Left Column: Product selection & Pricing Breakdown */}
                <div className="md:col-span-5 flex flex-col gap-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 uppercase">
                      1. Chọn Thiết Bị Cần Mua:
                    </span>
                  </div>

                  <select
                    value={selectedBundle}
                    onChange={(e) => setSelectedBundle(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    {PRODUCT_CATEGORIES.filter((c) => c.id !== 'tat-ca').map((cat) => {
                      const catProducts = PRODUCTS_DATA.filter((p) => p.categorySlug === cat.id);
                      if (catProducts.length === 0) return null;
                      return (
                        <optgroup key={cat.id} label={`── ${cat.name} (${catProducts.length}) ──`}>
                          {catProducts.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} — {p.price.toLocaleString('vi-VN')}đ (Đã gồm VAT)
                            </option>
                          ))}
                        </optgroup>
                      );
                    })}
                    <optgroup label="── Gói Combo Trọn Gói Tiết Kiệm ──">
                      {COMBOS_DATA.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} — {c.price.toLocaleString('vi-VN')}đ (Đã gồm VAT)
                        </option>
                      ))}
                    </optgroup>
                  </select>

                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-slate-700">
                      Số lượng cần mua:
                    </span>
                    <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">remove</span>
                      </button>
                      <span className="w-10 text-center text-xs font-bold text-slate-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                      </button>
                    </div>
                  </div>

                  {/* Đế âm tường (nếu là công tắc/ổ cắm) */}
                  <div className="pt-2 border-t border-slate-200">
                    <span className="block text-xs font-bold text-slate-700 mb-1.5">
                      Chuẩn đế âm tường:
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setShape('rectangular')}
                        className={`py-1.5 px-2 rounded-xl font-bold text-[11px] cursor-pointer ${
                          shape === 'rectangular'
                            ? 'bg-blue-700 text-white'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        Chữ nhật (Sino)
                      </button>
                      <button
                        type="button"
                        onClick={() => setShape('square')}
                        className={`py-1.5 px-2 rounded-xl font-bold text-[11px] cursor-pointer ${
                          shape === 'square'
                            ? 'bg-blue-700 text-white'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        Vuông (Chuẩn EU)
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart quick button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px] text-blue-700">add_shopping_cart</span>
                    <span>Thêm Vào Giỏ Hàng Chung</span>
                  </button>

                  {/* VAT & Price Calculation Table */}
                  <div className="pt-3 border-t border-slate-200 flex flex-col gap-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Đơn giá (Đã gồm VAT):</span>
                      <span className="font-bold text-slate-800">{currentItem.price.toLocaleString('vi-VN')} đ</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Số lượng:</span>
                      <span className="font-bold text-slate-800">{quantity} thiết bị</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Thuế VAT:</span>
                      <span className="font-semibold text-emerald-700">Đã bao gồm trong giá</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Vận chuyển:</span>
                      <span className="font-bold text-emerald-700">0 đ (Freeship toàn quốc)</span>
                    </div>
                    <div className="pt-2 mt-1 border-t border-slate-200 flex justify-between items-baseline">
                      <span className="text-xs font-black text-slate-900 uppercase">Thành tiền:</span>
                      <span className="text-xl font-black text-[#e04b16] font-heading">
                        {totalPrice.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 text-right font-medium">
                      (Đã bao gồm 100% thuế VAT)
                    </span>
                  </div>
                </div>

                {/* Right Column: STRICTLY 3 MANDATORY CORE FIELDS */}
                <div className="md:col-span-7 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 uppercase">
                      2. Điền 3 Thông Tin Người Nhận Hàng:
                    </span>
                  </div>

                  {/* Field 1: Họ và tên */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      1. Họ và tên người nhận <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ví dụ: Nguyễn Văn An"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    />
                  </div>

                  {/* Field 2: Số điện thoại */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        2. Số điện thoại nhận hàng (10 số) <span className="text-red-500">*</span>
                      </label>
                      {phoneNumber.trim().length > 0 && phoneValidation.carrier && (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">cell_tower</span>
                          <span>Mạng {phoneValidation.carrier}</span>
                        </span>
                      )}
                    </div>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Ví dụ: 0988 123 456"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 bg-white transition-colors ${
                        phoneNumber.trim().length > 0
                          ? phoneValidation.isValid
                            ? 'border-emerald-400 focus:ring-emerald-500'
                            : 'border-amber-400 focus:ring-amber-500 bg-amber-50/20'
                          : 'border-slate-300 focus:ring-blue-600'
                      }`}
                    />
                    {/* Live phone feedback */}
                    {phoneNumber.trim().length > 0 && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                        {phoneValidation.isValid ? (
                          <div className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                            <span className="material-symbols-outlined text-[15px] text-emerald-600">verified</span>
                            <span>{phoneValidation.message}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-amber-700 font-medium text-[11px]">
                            <span className="material-symbols-outlined text-[15px] text-amber-600">error_outline</span>
                            <span>{phoneValidation.message}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Field 3: Địa chỉ nhận hàng & Gợi ý nhanh */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        3. Địa chỉ nhận hàng chi tiết <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[10px] text-slate-400">Giao tận nơi</span>
                    </div>

                    {/* Quick suggestion buttons */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Gợi ý nhanh:</span>
                      {popularCities.map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => handleQuickCity(city)}
                          className={`text-[11px] px-2 py-0.5 rounded-md border font-medium transition-colors cursor-pointer ${
                            address.includes(city)
                              ? 'bg-blue-100 border-blue-300 text-blue-800 font-bold'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          + {city}
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Số nhà, tên đường, thôn/xóm, phường/xã, quận/huyện, tỉnh/thành..."
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 bg-white transition-colors ${
                        address.trim().length > 0
                          ? addressValidation.isDeliverable
                            ? 'border-emerald-400 focus:ring-emerald-500'
                            : 'border-amber-400 focus:ring-amber-500 bg-amber-50/20'
                          : 'border-slate-300 focus:ring-blue-600'
                      }`}
                    />

                    {/* Live Address Deliverability Radar */}
                    {address.trim().length > 0 && (
                      <div className="mt-2">
                        {addressValidation.isDeliverable ? (
                          <div className="p-2.5 bg-emerald-50/90 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2 shadow-2xs">
                            <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0 mt-0.5">
                              local_shipping
                            </span>
                            <div className="flex-1">
                              <div className="font-bold flex items-center gap-1 text-emerald-800">
                                <span>Địa chỉ có thực & Sẵn sàng giao hàng</span>
                                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded font-black">
                                  100% Giao Được
                                </span>
                              </div>
                              <p className="text-[11px] text-emerald-700 mt-0.5">
                                {addressValidation.carrierRoute} • Giao dự kiến: {addressValidation.estimatedDelivery}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2 shadow-2xs">
                            <span className="material-symbols-outlined text-[18px] text-amber-600 shrink-0 mt-0.5">
                              warning
                            </span>
                            <div className="flex-1">
                              <div className="font-bold text-amber-800">
                                Chưa đủ thông tin để bưu tá giao hàng
                              </div>
                              <p className="text-[11px] text-amber-700 mt-0.5">
                                {addressValidation.message}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-1 italic">
                                * Cần: Tỉnh/Thành phố + Quận/Huyện + Số nhà hoặc Tên đường/Thôn xóm để bưu tá giao tận tay.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-4 rounded-xl text-sm sm:text-base font-extrabold text-white bg-[#e04b16] hover:bg-[#c93e0e] shadow-lg shadow-orange-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[20px]">shopping_cart_checkout</span>
                          <span>
                            ĐẶT MUA NGAY • {totalPrice.toLocaleString('vi-VN')} đ (ĐÃ GỒM VAT)
                          </span>
                        </>
                      )}
                    </button>
                    <p className="text-center text-[11px] text-slate-500">
                      Nhận hàng kiểm tra cắm thử ưng ý mới thanh toán tiền (COD) • Miễn phí vận chuyển toàn quốc
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};
