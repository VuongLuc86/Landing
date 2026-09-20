import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { PRODUCTS_DATA, COMBOS_DATA, PRODUCT_CATEGORIES } from '../data/mockData';
import {
  validateVietnamesePhoneNumber,
  validateVietnameseAddress,
} from '../utils/validationUtils';

export interface QuickOrderTarget {
  product?: Product | null;
  bundleId?: string | null;
  shape?: string;
  gangs?: number;
  color?: string;
  quantity?: number;
}

interface QuickOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  target?: QuickOrderTarget | null;
  onViewOrdersFile?: () => void;
}

export const QuickOrderModal: React.FC<QuickOrderModalProps> = ({
  isOpen,
  onClose,
  target,
  onViewOrdersFile,
}) => {
  // Available selectable items (both products and combos)
  const [selectedItemId, setSelectedItemId] = useState<string>('switch-luxury');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedGangs, setSelectedGangs] = useState<number>(4);
  const [selectedShape, setSelectedShape] = useState<string>('Chữ nhật (120x72mm)');
  const [selectedColor, setSelectedColor] = useState<string>('Đen Huyền Bí');
  
  // Customer information fields (Tên, SĐT, Địa chỉ)
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank'>('cod');

  // Status handling
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const [createdOrderCode, setCreatedOrderCode] = useState<string>('');
  const [submittedOrderSummary, setSubmittedOrderSummary] = useState<any>(null);

  // Sync with incoming target when opened
  useEffect(() => {
    if (!isOpen) return;

    setErrorMessage('');
    setOrderSuccess(false);

    if (target?.product) {
      setSelectedItemId(target.product.id);
      if (target.quantity && target.quantity > 0) setQuantity(target.quantity);
      if (target.gangs) setSelectedGangs(target.gangs);
      if (target.shape) setSelectedShape(target.shape);
      if (target.color) setSelectedColor(target.color);
    } else if (target?.bundleId) {
      setSelectedItemId(target.bundleId);
      if (target.quantity && target.quantity > 0) setQuantity(target.quantity);
      if (target.shape) setSelectedShape(target.shape);
      if (target.color) setSelectedColor(target.color);
    }
  }, [isOpen, target]);

  if (!isOpen) return null;

  // Identify currently selected item (Product or Combo)
  const currentProduct = PRODUCTS_DATA.find((p) => p.id === selectedItemId);
  const currentCombo = COMBOS_DATA.find((c) => c.id === selectedItemId);

  const itemName = currentProduct?.name || currentCombo?.name || 'Thiết bị thông minh Hunonic';
  const itemUnitPrice = currentProduct ? currentProduct.price : currentCombo ? currentCombo.price : 490000;
  const itemOriginalPrice = currentProduct ? currentProduct.originalPrice : currentCombo ? currentCombo.originalPrice : 650000;
  const itemImage = currentProduct?.imageUrl || '/images/hunonic/hunonic-cam-ung.jpg';
  const itemFallbackImage = currentProduct?.fallbackImageUrl || '/images/hunonic/hunonic-cam-ung.jpg';
  const itemWarranty = currentProduct?.warranty || '24 Tháng (1 Đổi 1)';
  const itemCategory = currentProduct?.category || 'Gói Combo Ưu Đãi';

  // VAT calculations: Prices are VAT-inclusive
  const totalPrice = itemUnitPrice * quantity;
  const totalOriginalPrice = itemOriginalPrice * quantity;
  const totalSaved = Math.max(0, totalOriginalPrice - totalPrice);

  // Calculate options details string
  const hasOptions = currentProduct?.options && (currentProduct.options.gangs || currentProduct.options.shapes || currentProduct.options.colors);
  const optionsSummary: string[] = [];
  if (currentProduct?.options?.gangs) optionsSummary.push(`${selectedGangs} nút`);
  if (currentProduct?.options?.shapes) optionsSummary.push(selectedShape);
  if (currentProduct?.options?.colors) optionsSummary.push(selectedColor);
  const optionsString = optionsSummary.length > 0 ? optionsSummary.join(' • ') : '';

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(99, prev + delta)));
  };

  const handleQuickAddress = (city: string) => {
    if (!address) {
      setAddress(`${city}, `);
    } else if (!address.toLowerCase().includes(city.toLowerCase())) {
      setAddress(`${address.trim()}, ${city}`);
    }
  };

  // Real-time validation checks
  const phoneValidation = validateVietnamesePhoneNumber(phone);
  const addressValidation = validateVietnameseAddress(address);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Vui lòng điền họ và tên của bạn.');
      return;
    }

    if (!phoneValidation.isValid) {
      setErrorMessage(phoneValidation.message);
      return;
    }

    if (!addressValidation.isDeliverable) {
      setErrorMessage(addressValidation.message);
      return;
    }

    setIsSubmitting(true);

    const cleanPhone = phoneValidation.cleanPhone;
    const finalAddress = addressValidation.canonicalAddress || address.trim();

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const dateFormatted = `${day}/${month}/${year}`;

    const orderCode = `HN-${Math.floor(100000 + Math.random() * 900000)}`;

    const fullProductName = optionsString
      ? `${itemName} [${optionsString}] - SL: ${quantity}`
      : `${itemName} - SL: ${quantity}`;

    const fullNoteParts = [
      note.trim(),
      `Phương thức: ${paymentMethod === 'cod' ? 'COD (Nhận hàng kiểm tra rồi thanh toán)' : 'Chuyển khoản QR'}`,
      'Giá đã bao gồm VAT',
      addressValidation.carrierRoute ? `Bưu cục: ${addressValidation.carrierRoute}` : '',
    ].filter(Boolean);

    const payload = {
      fullName: fullName.trim(),
      phone: cleanPhone,
      address: finalAddress,
      productName: fullProductName,
      amount: totalPrice,
      note: fullNoteParts.join(' | '),
      orderDate: dateFormatted,
    };

    // Save to Server CSV
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('Lưu API đơn hàng thất bại, kích hoạt lưu dự phòng localStorage:', err);
    }

    // Save to local storage for instant sync and offline resilience
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
    setCreatedOrderCode(orderCode);
    setSubmittedOrderSummary({
      code: orderCode,
      name: fullName.trim(),
      phone: cleanPhone,
      address: address.trim(),
      product: fullProductName,
      quantity,
      unitPrice: itemUnitPrice,
      totalPrice,
      paymentMethod: paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng (QR)',
    });
    setOrderSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-7 shadow-2xl border border-slate-200 flex flex-col gap-5 relative max-h-[92vh] overflow-y-auto my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="flex flex-col gap-1 pr-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-extrabold text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                ĐIỆN 365 • ĐẠI LÝ CHÍNH THỨC HUNONIC
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                <span className="material-symbols-outlined text-[13px]">verified</span>
                Đã gồm thuế VAT & Freeship
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900 mt-1">
              Bảng Đặt Mua Thiết Bị Thông Minh HUNONIC
            </h3>
            <p className="text-xs text-slate-500">
              Kiểm tra hàng trước khi thanh toán • Bảo hành đổi mới 24 tháng • Hotline hỗ trợ:{' '}
              <a href="tel:0877999663" className="text-blue-700 font-bold hover:underline">
                0877.999.663
              </a>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
            title="Đóng bảng mua hàng"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {orderSuccess && submittedOrderSummary ? (
          /* SUCCESS CONFIRMATION STATE */
          <div className="flex flex-col gap-5 py-2">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 sm:p-6 text-center flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-[32px]">done_all</span>
              </div>
              <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase">
                Ghi nhận đơn hàng thành công
              </span>
              <h4 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                CẢM ƠN QUÝ KHÁCH: {submittedOrderSummary.name.toUpperCase()}!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md">
                Mã đơn hàng: <strong className="text-blue-700 font-mono text-base">{submittedOrderSummary.code}</strong>.
                Kỹ sư của Điện 365 sẽ gọi điện thoại tới số <strong className="text-slate-800">{submittedOrderSummary.phone}</strong>{' '}
                để đối soát thông tin và đóng gói chuyển phát nhanh Viettel Post.
              </p>
            </div>

            {/* Order Summary Details Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
              <div className="bg-slate-100/90 px-4 py-2.5 border-b border-slate-200 font-bold text-xs text-slate-700 uppercase flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-blue-600">receipt_long</span>
                <span>Chi Tiết Đơn Hàng Đã Ghi Vào File (orders.csv)</span>
              </div>
              <div className="p-4 flex flex-col gap-2.5 text-xs text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Sản phẩm đặt mua:</span>
                  <span className="font-bold text-right text-slate-900 max-w-[65%]">{submittedOrderSummary.product}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Số lượng:</span>
                  <span className="font-bold">{submittedOrderSummary.quantity} thiết bị</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Địa chỉ nhận hàng:</span>
                  <span className="font-medium text-right max-w-[65%]">{submittedOrderSummary.address}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Hình thức thanh toán:</span>
                  <span className="font-semibold text-emerald-700">{submittedOrderSummary.paymentMethod}</span>
                </div>
                <div className="flex justify-between py-2 text-sm">
                  <span className="font-bold text-slate-900">Tổng tiền thanh toán (Đã gồm VAT):</span>
                  <span className="font-black text-[#e04b16] text-lg font-heading">
                    {submittedOrderSummary.totalPrice.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              {onViewOrdersFile && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onViewOrdersFile();
                  }}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">description</span>
                  <span>Xem File Dữ Liệu Đơn Hàng (orders.csv)</span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-black transition-colors cursor-pointer text-center"
              >
                Hoàn Tất & Đóng
              </button>
            </div>
          </div>
        ) : (
          /* REGULAR FORM STATE */
          <form onSubmit={handleSubmitOrder} className="flex flex-col gap-5">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 1. PRODUCT SELECTION & QUANTITY CARD */}
            <div className="bg-slate-50 rounded-2xl p-3.5 sm:p-4 border border-slate-200 flex flex-col gap-3.5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
                {/* Thumbnail */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white border border-slate-200 p-1.5 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                  <img
                    src={itemImage}
                    alt={itemName}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      if (itemFallbackImage && !e.currentTarget.src.includes(itemFallbackImage)) {
                        e.currentTarget.src = itemFallbackImage;
                      }
                    }}
                  />
                </div>

                {/* Info & Selector */}
                <div className="flex-1 flex flex-col gap-1 w-full">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-blue-700 uppercase bg-blue-100/60 px-2 py-0.5 rounded">
                      {itemCategory}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                      {itemWarranty}
                    </span>
                  </div>

                  {/* Product dropdown selector to allow switching */}
                  <select
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    className="w-full text-xs sm:text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer mt-0.5"
                  >
                    {PRODUCT_CATEGORIES.filter((c) => c.id !== 'tat-ca').map((cat) => {
                      const catProducts = PRODUCTS_DATA.filter((p) => p.categorySlug === cat.id);
                      if (catProducts.length === 0) return null;
                      return (
                        <optgroup key={cat.id} label={`── ${cat.name} (${catProducts.length}) ──`}>
                          {catProducts.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} - {p.price.toLocaleString('vi-VN')}đ (Đã gồm VAT)
                            </option>
                          ))}
                        </optgroup>
                      );
                    })}
                    <optgroup label="── Gói Combo Trọn Gói ──">
                      {COMBOS_DATA.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} - {c.price.toLocaleString('vi-VN')}đ (Đã gồm VAT)
                        </option>
                      ))}
                    </optgroup>
                  </select>

                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xs text-slate-500">Đơn giá:</span>
                    <span className="text-base font-extrabold text-[#e04b16] font-heading">
                      {itemUnitPrice.toLocaleString('vi-VN')} đ
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      {itemOriginalPrice.toLocaleString('vi-VN')} đ
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      Đã gồm thuế VAT
                    </span>
                  </div>
                </div>
              </div>

              {/* Gangs & Shape Options if available */}
              {hasOptions && (
                <div className="pt-2 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {currentProduct?.options?.gangs && (
                    <div>
                      <span className="block text-[11px] font-bold text-slate-600 mb-1">Số nút:</span>
                      <div className="flex gap-1">
                        {currentProduct.options.gangs.map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setSelectedGangs(g)}
                            className={`flex-1 py-1 rounded text-center font-bold text-xs cursor-pointer ${
                              selectedGangs === g ? 'bg-blue-700 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {g}N
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentProduct?.options?.shapes && (
                    <div>
                      <span className="block text-[11px] font-bold text-slate-600 mb-1">Kiểu đế:</span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedShape('Chữ nhật (120x72mm)')}
                          className={`flex-1 py-1 px-1 rounded text-center font-bold text-[11px] cursor-pointer ${
                            selectedShape.includes('Chữ nhật') ? 'bg-blue-700 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          Chữ nhật
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedShape('Vuông (86x86mm)')}
                          className={`flex-1 py-1 px-1 rounded text-center font-bold text-[11px] cursor-pointer ${
                            selectedShape.includes('Vuông') ? 'bg-blue-700 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          Vuông
                        </button>
                      </div>
                    </div>
                  )}

                  {currentProduct?.options?.colors && (
                    <div>
                      <span className="block text-[11px] font-bold text-slate-600 mb-1">Màu sắc:</span>
                      <div className="flex gap-1">
                        {currentProduct.options.colors.map((col) => (
                          <button
                            key={col.id}
                            type="button"
                            onClick={() => setSelectedColor(col.name)}
                            className={`flex-1 py-1 px-1 rounded text-center font-bold text-[11px] cursor-pointer ${
                              selectedColor === col.name ? 'bg-blue-700 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {col.name.replace(' Huyền Bí', '').replace(' Thanh Lịch', '').replace(' Champagne', '')}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity Selector */}
              <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    Số lượng cần mua:
                  </span>
                  <div className="flex items-center border border-slate-300 rounded-xl bg-white shadow-2xs overflow-hidden">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">remove</span>
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
                      className="w-12 h-8 text-center text-sm font-bold text-slate-900 border-x border-slate-200 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(1)}
                      className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                    </button>
                  </div>
                </div>

                {/* Fast Quantity presets */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-[11px] text-slate-400">Chọn nhanh:</span>
                  {[1, 2, 3, 5].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setQuantity(q)}
                      className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        quantity === q
                          ? 'bg-blue-700 text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. BẢNG TÍNH TIỀN MINH BẠCH (VAT INCLUDED PRICING TABLE) */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50/40 overflow-hidden">
              <div className="bg-blue-900 text-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-amber-300">calculate</span>
                  <span>Bảng Chi Tiết Giá & Thành Tiền (Đã Gồm VAT)</span>
                </span>
                <span className="text-[11px] text-blue-200 font-normal">Quy chuẩn hóa đơn VAT</span>
              </div>

              <div className="p-3.5 flex flex-col gap-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-blue-100">
                  <span className="text-slate-600">Đơn giá niêm yết (1 thiết bị):</span>
                  <span className="font-bold text-slate-900">{itemUnitPrice.toLocaleString('vi-VN')} đ (Đã gồm VAT)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-blue-100">
                  <span className="text-slate-600">Số lượng hàng đặt mua:</span>
                  <span className="font-bold text-slate-900">{quantity} thiết bị</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-blue-100">
                  <span className="text-slate-600">Thuế giá trị gia tăng (VAT 8% - 10%):</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    ĐÃ BAO GỒM TRONG ĐƠN GIÁ
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-blue-100">
                  <span className="text-slate-600">Phí vận chuyển giao hàng:</span>
                  <span className="font-bold text-emerald-700">0 đ (MIỄN PHÍ TOÀN QUỐC)</span>
                </div>
                {totalSaved > 0 && (
                  <div className="flex justify-between items-center py-1 border-b border-blue-100 text-emerald-700 font-medium">
                    <span>Tổng ưu đãi tiết kiệm cho đợt này:</span>
                    <span>-{totalSaved.toLocaleString('vi-VN')} đ</span>
                  </div>
                )}

                {/* Final Total Amount - Highlighted */}
                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 bg-white p-2.5 rounded-xl border border-blue-200 shadow-2xs">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      TỔNG THÀNH TIỀN THANH TOÁN:
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700">
                      ĐÃ BAO GỒM 100% THUẾ VAT • KHÔNG PHÁT SINH PHÍ
                    </span>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xl sm:text-2xl font-black text-[#e04b16] font-heading block">
                      {totalPrice.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. THÔNG TIN KHÁCH HÀNG (TÊN, SĐT, ĐỊA CHỈ) */}
            <div className="flex flex-col gap-3.5">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-blue-700">person_pin</span>
                <span>Thông Tin Người Nhận Hàng</span>
              </span>

              {/* Tên & Số điện thoại */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    1. Họ và tên người nhận <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
                      person
                    </span>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ví dụ: Nguyễn Văn An"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      2. Số điện thoại nhận hàng <span className="text-red-500">*</span>
                    </label>
                    {phone.trim().length > 0 && phoneValidation.carrier && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        {phoneValidation.carrier}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
                      phone_in_talk
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ví dụ: 0988 123 456"
                      className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border focus:outline-none transition-colors ${
                        phone.trim().length > 0
                          ? phoneValidation.isValid
                            ? 'border-emerald-400 focus:ring-2 focus:ring-emerald-100'
                            : 'border-amber-400 bg-amber-50/20 focus:ring-2 focus:ring-amber-100'
                          : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                      }`}
                    />
                  </div>
                  {/* Live phone feedback */}
                  {phone.trim().length > 0 && (
                    <div className="mt-1 text-[11px]">
                      {phoneValidation.isValid ? (
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          {phoneValidation.message}
                        </span>
                      ) : (
                        <span className="text-amber-700 font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">error_outline</span>
                          {phoneValidation.message}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Địa chỉ nhận hàng */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    3. Địa chỉ nhận hàng chi tiết <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Giao hàng toàn quốc</span>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
                    location_on
                  </span>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Số nhà, tên đường, thôn/xóm, phường/xã, quận/huyện, tỉnh/thành phố..."
                    className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border focus:outline-none transition-colors ${
                      address.trim().length > 0
                        ? addressValidation.isDeliverable
                          ? 'border-emerald-400 focus:ring-2 focus:ring-emerald-100'
                          : 'border-amber-400 bg-amber-50/20 focus:ring-2 focus:ring-amber-100'
                        : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                    }`}
                  />
                </div>

                {/* Quick Province helper pills */}
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-[11px]">
                  <span className="text-slate-400">Điền nhanh tỉnh/thành:</span>
                  {['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Quảng Ninh', 'Cần Thơ', 'Bình Dương'].map(
                    (city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => handleQuickAddress(city)}
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                      >
                        +{city}
                      </button>
                    )
                  )}
                </div>

                {/* Real-time Address Deliverability Radar */}
                {address.trim().length > 0 && (
                  <div className="mt-2">
                    {addressValidation.isDeliverable ? (
                      <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-emerald-600 shrink-0 mt-0.5">
                          verified
                        </span>
                        <div>
                          <div className="font-bold">Địa chỉ có thực & Đủ điều kiện giao hàng</div>
                          <div className="text-[11px] text-emerald-700">
                            {addressValidation.carrierRoute} • Giao dự kiến: {addressValidation.estimatedDelivery}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-amber-600 shrink-0 mt-0.5">
                          warning
                        </span>
                        <div>
                          <div className="font-bold">{addressValidation.message}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            * Cần ghi rõ: Số nhà hoặc tên đường/thôn xóm + Quận/Huyện + Tỉnh/Thành
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Payment method */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Hình thức thanh toán:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-blue-600 bg-blue-50/60 font-bold text-blue-950'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-blue-600"
                    />
                    <div className="flex flex-col">
                      <span>Nhận hàng rồi thanh toán (COD)</span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        Mở hộp cắm thử ưng ý mới gửi tiền
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'bank'
                        ? 'border-blue-600 bg-blue-50/60 font-bold text-blue-950'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'bank'}
                      onChange={() => setPaymentMethod('bank')}
                      className="text-blue-600"
                    />
                    <div className="flex flex-col">
                      <span>Chuyển khoản VietQR</span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        Nhân viên sẽ gửi mã QR khi gọi xác nhận
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Optional note */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ghi chú cho kỹ thuật viên (tùy chọn):
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ví dụ: Giao giờ hành chính, cần kỹ sư gọi hướng dẫn đấu dây..."
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Action Button */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-2xl text-sm sm:text-base font-extrabold text-white bg-[#e04b16] hover:bg-[#c93e0e] shadow-lg shadow-orange-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">shopping_cart_checkout</span>
                    <span>
                      XÁC NHẬN ĐẶT HÀNG • {totalPrice.toLocaleString('vi-VN')} đ (ĐÃ GỒM VAT)
                    </span>
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-slate-500">
                🔒 Thông tin được bảo mật 100%. Kỹ sư Điện 365 sẽ liên hệ trong 5-10 phút để xác nhận đơn hàng.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
