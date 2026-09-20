import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { VIETNAM_PROVINCES } from '../data/vietnamAddressData';
import {
  validateVietnamesePhoneNumber,
  validateVietnameseAddress,
} from '../utils/validationUtils';

interface VisualMiniCartModalProps {
  onViewOrdersFile?: () => void;
}

export const VisualMiniCartModal: React.FC<VisualMiniCartModalProps> = ({ onViewOrdersFile }) => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItemsCount,
    totalPrice,
    totalOriginalPrice,
    totalSavings,
    isCartOpen,
    setIsCartOpen,
    checkoutStep,
    setCheckoutStep,
    customerProfile,
    saveCustomerProfile,
    lastCreatedOrder,
    setLastCreatedOrder,
  } = useCart();

  // Core 3 fields required: Họ tên, Số điện thoại, Địa chỉ nhận hàng
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [streetDetails, setStreetDetails] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank'>('cod');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showAddressPicker, setShowAddressPicker] = useState<boolean>(false);
  const [copiedOrder, setCopiedOrder] = useState<boolean>(false);

  // Auto-fill from persisted profile on open
  useEffect(() => {
    if (isCartOpen) {
      setErrorMessage('');
      if (customerProfile.fullName && !fullName) setFullName(customerProfile.fullName);
      if (customerProfile.phone && !phone) setPhone(customerProfile.phone);
      if (customerProfile.address && !address) setAddress(customerProfile.address);
      if (customerProfile.province && !selectedProvince) setSelectedProvince(customerProfile.province);
      if (customerProfile.district && !selectedDistrict) setSelectedDistrict(customerProfile.district);
    }
  }, [isCartOpen, customerProfile]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  // Auto switch back to cart if items become empty during checkout
  useEffect(() => {
    if (checkoutStep === 'checkout' && cartItems.length === 0) {
      setCheckoutStep('cart');
    }
  }, [checkoutStep, cartItems.length, setCheckoutStep]);

  if (!isCartOpen) return null;

  // Selected province's districts
  const currentProvinceData = VIETNAM_PROVINCES.find((p) => p.name === selectedProvince);
  const availableDistricts = currentProvinceData ? currentProvinceData.districts : [];

  // Quick address suggestion buttons
  const popularCities = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Bình Dương', 'Cần Thơ'];

  const handleApplyQuickCity = (cityName: string) => {
    const matched = VIETNAM_PROVINCES.find((p) => p.name.includes(cityName) || p.nameEn.includes(cityName));
    if (matched) {
      setSelectedProvince(matched.name);
      setSelectedDistrict('');
      updateCombinedAddress(streetDetails, matched.name, '');
    } else {
      setAddress((prev) => (prev ? `${prev}, ${cityName}` : cityName));
    }
  };

  const updateCombinedAddress = (street: string, province: string, district: string) => {
    const parts = [street.trim(), district.trim(), province.trim()].filter(Boolean);
    const combined = parts.join(', ');
    setAddress(combined);
  };

  const handleProvinceChange = (provinceName: string) => {
    setSelectedProvince(provinceName);
    setSelectedDistrict('');
    updateCombinedAddress(streetDetails, provinceName, '');
  };

  const handleDistrictChange = (districtName: string) => {
    setSelectedDistrict(districtName);
    updateCombinedAddress(streetDetails, selectedProvince, districtName);
  };

  const handleStreetChange = (streetVal: string) => {
    setStreetDetails(streetVal);
    if (selectedProvince || selectedDistrict) {
      updateCombinedAddress(streetVal, selectedProvince, selectedDistrict);
    } else {
      setAddress(streetVal);
    }
  };

  // Calculate real-time validation checks
  const phoneValidation = validateVietnamesePhoneNumber(phone);
  const finalAddressString = address.trim() || [streetDetails, selectedDistrict, selectedProvince].filter(Boolean).join(', ');
  const addressValidation = validateVietnameseAddress(finalAddressString, selectedProvince, selectedDistrict);

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (cartItems.length === 0) {
      setErrorMessage('Giỏ hàng của bạn đang trống. Vui lòng chọn sản phẩm.');
      return;
    }

    if (!fullName.trim()) {
      setErrorMessage('Vui lòng nhập Họ và tên người nhận.');
      return;
    }

    // 1. Check Phone Number: Must be real Vietnamese carrier number
    if (!phoneValidation.isValid) {
      setErrorMessage(phoneValidation.message);
      return;
    }

    // 2. Check Address: Must be real location with enough details for courier delivery
    if (!addressValidation.isDeliverable) {
      setErrorMessage(addressValidation.message);
      return;
    }

    setIsSubmitting(true);

    const cleanPhone = phoneValidation.cleanPhone;
    const finalAddress = addressValidation.canonicalAddress || finalAddressString;

    // Save profile for future zero-click autofill
    saveCustomerProfile({
      fullName: fullName.trim(),
      phone: cleanPhone,
      address: finalAddress,
      province: selectedProvince || addressValidation.province,
      district: selectedDistrict || addressValidation.district,
    });

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const dateFormatted = `${day}/${month}/${year}`;
    const code = `HN-${Math.floor(100000 + Math.random() * 900000)}`;

    // Build consolidated product summary for order sheet
    const itemsDescription = cartItems
      .map((item) => {
        const specs = [item.shape, item.gangs ? `${item.gangs} nút` : '', item.color].filter(Boolean).join(' - ');
        return `${item.name} (${specs || 'Chuẩn'}) x${item.quantity}`;
      })
      .join(' + ');

    const payload = {
      fullName: fullName.trim(),
      phone: cleanPhone,
      address: finalAddress,
      productName: itemsDescription,
      amount: totalPrice,
      note: `Thanh toán: ${paymentMethod === 'cod' ? 'COD (Nhận hàng kiểm tra rồi thanh toán)' : 'Chuyển khoản QR'} | Đã gồm VAT 100% & Freeship`,
      orderDate: dateFormatted,
    };

    // Save to Server CSV endpoint
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('Lỗi khi gửi API đơn hàng, lưu dự phòng LocalStorage:', err);
    }

    // Save to browser CSV records for instant file viewer sync
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

    const orderSummary = {
      orderCode: code,
      fullName: fullName.trim(),
      phone: cleanPhone,
      address: finalAddress,
      items: [...cartItems],
      totalPrice,
      totalOriginalPrice,
      totalSavings,
      paymentMethod,
      orderDate: dateFormatted,
    };

    setLastCreatedOrder(orderSummary);
    setIsSubmitting(false);
    clearCart();
    setCheckoutStep('success');
  };

  const copyOrderCode = () => {
    if (lastCreatedOrder?.orderCode) {
      navigator.clipboard.writeText(lastCreatedOrder.orderCode);
      setCopiedOrder(true);
      setTimeout(() => setCopiedOrder(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Dark Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Cart Container: Bottom Sheet on Mobile, Centered Modal on Tablet/Desktop */}
      <div className="relative w-full max-w-xl max-h-[92vh] sm:max-h-[85vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 animate-slideUp sm:animate-zoomIn border border-slate-200">
        {/* Header - Modern E-Commerce Style (LadiPage/EgaShop style) */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white shadow-xs">
              <span className="material-symbols-outlined text-[20px]">
                {checkoutStep === 'success' ? 'check_circle' : 'shopping_bag'}
              </span>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold font-heading flex items-center gap-2 leading-tight">
                {checkoutStep === 'cart' && `Giỏ Hàng Của Bạn (${totalItemsCount})`}
                {checkoutStep === 'checkout' && 'Xác Nhận Đặt Hàng Siêu Tốc (3 Thông Tin)'}
                {checkoutStep === 'success' && 'Đặt Hàng Thành Công!'}
              </h3>
              <p className="text-[11px] text-slate-300">
                {checkoutStep === 'cart' && 'Miễn phí giao hàng toàn quốc • Đã gồm thuế VAT'}
                {checkoutStep === 'checkout' && 'Chỉ mất 5 giây • Kiểm tra hàng trước khi trả tiền (COD)'}
                {checkoutStep === 'success' && 'Điện 365 — Đại Lý Chính Thức HUNONIC'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Đóng giỏ hàng"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Free Shipping & Warranty Progress Banner */}
        {checkoutStep !== 'success' && (
          <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-800">
            <div className="flex items-center gap-1.5 font-semibold">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">local_shipping</span>
              <span>ĐỦ ĐIỀU KIỆN FREESHIP TOÀN QUỐC</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
              Tiết kiệm 35.000đ ship
            </span>
          </div>
        )}

        {/* Step 1: Cart Items List */}
        {checkoutStep === 'cart' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
            {cartItems.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[36px]">remove_shopping_cart</span>
                </div>
                <p className="text-sm font-bold text-slate-700">Giỏ hàng của bạn đang trống</p>
                <p className="text-xs text-slate-500 max-w-xs">
                  Hãy chọn các thiết bị nhà thông minh Hunonic chính hãng với giá ưu đãi đại lý hôm nay.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold cursor-pointer transition-colors"
                >
                  Xem Danh Sách Sản Phẩm
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase text-slate-500">
                    Sản phẩm đã chọn ({totalItemsCount})
                  </span>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-[11px] text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">delete</span>
                    <span>Xóa tất cả</span>
                  </button>
                </div>

                {/* Items loop */}
                <div className="flex flex-col gap-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 flex items-center gap-3 transition-colors"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 sm:w-18 sm:h-18 object-contain rounded-xl bg-white p-1 border border-slate-200 shrink-0"
                        onError={(e) => {
                          e.currentTarget.src = '/images/hunonic/hunonic-cam-ung.jpg';
                        }}
                      />

                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                          {item.name}
                        </h4>

                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-600 font-medium">
                          {item.shape && (
                            <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200">
                              {item.shape}
                            </span>
                          )}
                          {item.gangs && (
                            <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 text-blue-700 font-bold">
                              {item.gangs} nút
                            </span>
                          )}
                          {item.color && (
                            <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200">
                              {item.color}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 pt-0.5">
                          <span className="text-xs sm:text-sm font-black text-[#e04b16] font-heading">
                            {item.price.toLocaleString('vi-VN')} đ
                          </span>
                          {item.originalPrice > item.price && (
                            <span className="text-[11px] text-slate-400 line-through">
                              {item.originalPrice.toLocaleString('vi-VN')} đ
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controller */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                            aria-label="Giảm số lượng"
                          >
                            <span className="material-symbols-outlined text-[14px]">remove</span>
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                            aria-label="Tăng số lượng"
                          >
                            <span className="material-symbols-outlined text-[14px]">add</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-[11px] text-slate-400 hover:text-red-600 transition-colors flex items-center gap-0.5 cursor-pointer"
                          title="Xóa sản phẩm"
                        >
                          <span className="material-symbols-outlined text-[14px]">delete</span>
                          <span>Xóa</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Cost Summary */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col gap-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Tổng tiền hàng ({totalItemsCount} thiết bị):</span>
                    <span className="font-semibold text-slate-800">
                      {totalOriginalPrice.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Ưu đãi đại lý giảm giá:</span>
                      <span>-{totalSavings.toLocaleString('vi-VN')} đ</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Thuế GTGT (VAT):</span>
                    <span className="font-semibold text-emerald-700">Đã bao gồm trong giá</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Phí giao hàng:</span>
                    <span className="font-bold text-emerald-700">0 đ (Miễn phí toàn quốc)</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                    <span className="text-xs font-bold text-slate-900 uppercase">TỔNG THANH TOÁN:</span>
                    <div className="text-right">
                      <span className="text-xl font-black text-[#e04b16] font-heading">
                        {totalPrice.toLocaleString('vi-VN')} đ
                      </span>
                      <p className="text-[10px] text-emerald-700 font-medium">Đã gồm 100% thuế VAT</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 2: Streamlined 3-field Checkout Form */}
        {checkoutStep === 'checkout' && (
          <form onSubmit={handleSubmitCheckout} className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Autofill Badge if restored */}
            {customerProfile.fullName && (
              <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-blue-700">auto_fix_high</span>
                  <span>Đã tự động điền thông tin người nhận của bạn</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setFullName('');
                    setPhone('');
                    setAddress('');
                    setStreetDetails('');
                    setSelectedProvince('');
                    setSelectedDistrict('');
                  }}
                  className="text-blue-600 hover:underline text-[10px] cursor-pointer"
                >
                  Xóa điền mới
                </button>
              </div>
            )}

            {/* Detailed Order Breakdown - hiển thị chi tiết trực tiếp không cần bấm sửa */}
            <div className="rounded-2xl bg-amber-50/85 border border-amber-200/90 p-3.5 text-xs shadow-2xs">
              {/* Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-amber-200/80">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-amber-700">inventory_2</span>
                  <div>
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      Chi tiết đơn hàng ({totalItemsCount} thiết bị)
                    </span>
                    <span className="block text-[10px] text-slate-500 font-normal">
                      Hunonic chính hãng • Giá đã gồm 100% thuế VAT
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm sm:text-base font-black text-[#e04b16] font-heading">
                    {totalPrice.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>

              {/* Danh sách từng sản phẩm chi tiết */}
              <div className="divide-y divide-amber-200/50 max-h-56 overflow-y-auto my-1.5 pr-0.5">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center gap-2.5">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-12 h-12 object-contain rounded-lg bg-white p-1 border border-amber-200/80 shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = '/images/hunonic/hunonic-cam-ung.jpg';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 line-clamp-1 text-xs">
                        {item.name}
                      </div>
                      <div className="flex flex-wrap items-center gap-1 mt-0.5 text-[10px] text-slate-600">
                        {item.shape && (
                          <span className="bg-white px-1.5 py-0.2 rounded border border-amber-200/70">
                            {item.shape}
                          </span>
                        )}
                        {item.gangs && (
                          <span className="bg-white px-1.5 py-0.2 rounded border border-amber-200/70 text-blue-700 font-bold">
                            {item.gangs} nút
                          </span>
                        )}
                        {item.color && (
                          <span className="bg-white px-1.5 py-0.2 rounded border border-amber-200/70">
                            {item.color}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[11px]">
                        <span className="text-[#e04b16] font-bold">
                          {item.price.toLocaleString('vi-VN')} đ
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-slate-500 text-[10px]">
                            x {item.quantity} = {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Nút tăng giảm số lượng trực tiếp tại đây */}
                    <div className="flex items-center border border-amber-300/80 rounded-lg bg-white overflow-hidden shadow-2xs shrink-0">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-amber-100/50 cursor-pointer"
                        aria-label="Giảm số lượng"
                      >
                        <span className="material-symbols-outlined text-[13px]">remove</span>
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-amber-100/50 cursor-pointer"
                        aria-label="Tăng số lượng"
                      >
                        <span className="material-symbols-outlined text-[13px]">add</span>
                      </button>
                    </div>

                    {/* Nút xóa sản phẩm */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-600 p-1 cursor-pointer shrink-0 transition-colors"
                      title="Xóa thiết bị này"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Footer bar of the order detail card */}
              <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <span className="material-symbols-outlined text-[15px]">local_shipping</span>
                  <span>Freeship toàn quốc • Đồng kiểm trước khi nhận</span>
                </span>
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="text-blue-700 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">add_circle</span>
                  <span>Chọn thêm thiết bị</span>
                </button>
              </div>
            </div>

            {/* ONLY 3 MANDATORY CORE FIELDS: TÊN, SỐ ĐIỆN THOẠI, ĐỊA CHỈ */}
            <div className="flex flex-col gap-3">
              {/* Field 1: Họ tên */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  1. Họ và tên người nhận hàng <span className="text-red-500">*</span>
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
                  <label className="block text-xs font-bold text-slate-800">
                    2. Số điện thoại nhận hàng (10 số) <span className="text-red-500">*</span>
                  </label>
                  {phone.trim().length > 0 && phoneValidation.carrier && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">cell_tower</span>
                      <span>Mạng {phoneValidation.carrier}</span>
                    </span>
                  )}
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ví dụ: 0988 123 456"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 bg-white transition-colors ${
                    phone.trim().length > 0
                      ? phoneValidation.isValid
                        ? 'border-emerald-400 focus:ring-emerald-500'
                        : 'border-amber-400 focus:ring-amber-500 bg-amber-50/20'
                      : 'border-slate-300 focus:ring-blue-600'
                  }`}
                />
                {/* Real-time Phone Feedback Badge */}
                {phone.trim().length > 0 && (
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

              {/* Field 3: Địa chỉ nhận hàng & Tự động hóa */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-800">
                    3. Địa chỉ nhận hàng tận nơi <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAddressPicker(!showAddressPicker)}
                    className="text-[11px] font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">map</span>
                    <span>{showAddressPicker ? 'Ẩn bộ chọn Tỉnh/Huyện' : 'Chọn Tỉnh/Huyện nhanh'}</span>
                  </button>
                </div>

                {/* Quick 1-tap City Suggestion Chips */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Gợi ý nhanh:</span>
                  {popularCities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleApplyQuickCity(city)}
                      className={`text-[11px] px-2 py-0.5 rounded-md border font-medium transition-colors cursor-pointer ${
                        address.includes(city) || selectedProvince.includes(city)
                          ? 'bg-blue-100 border-blue-300 text-blue-800 font-bold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      + {city}
                    </button>
                  ))}
                </div>

                {/* Optional Structured Selector for Province & District */}
                {showAddressPicker && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-2 flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Tỉnh / Thành phố:
                        </span>
                        <select
                          value={selectedProvince}
                          onChange={(e) => handleProvinceChange(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-900"
                        >
                          <option value="">-- Chọn Tỉnh / TP --</option>
                          {VIETNAM_PROVINCES.map((p) => (
                            <option key={p.code} value={p.name}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <span className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Quận / Huyện:
                        </span>
                        <select
                          value={selectedDistrict}
                          onChange={(e) => handleDistrictChange(e.target.value)}
                          disabled={!selectedProvince}
                          className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-900 disabled:opacity-50"
                        >
                          <option value="">-- Chọn Quận / Huyện --</option>
                          {availableDistricts.map((d) => (
                            <option key={d.code} value={`${d.prefix} ${d.name}`}>
                              {d.prefix} {d.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <span className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Số nhà, tên đường, thôn/xóm:
                      </span>
                      <input
                        type="text"
                        value={streetDetails}
                        onChange={(e) => handleStreetChange(e.target.value)}
                        placeholder="Số nhà, ngõ/ngách, tên đường..."
                        className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-900"
                      />
                    </div>
                  </div>
                )}

                {/* Main Address Input Box */}
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

                {/* Real-time Address Deliverability Radar */}
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
                            * Cần: Tỉnh/Thành phố + Quận/Huyện + Số nhà hoặc Tên đường/Thôn xóm để đảm bảo giao tận tay.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Payment Method Selector */}
              <div className="pt-2 border-t border-slate-200">
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Hình thức thanh toán:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-2.5 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px] text-emerald-700">payments</span>
                    <span>Thanh toán khi nhận (COD)</span>
                    <span className="text-[10px] text-emerald-600 font-normal">Cắm thử rồi thanh toán</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank')}
                    className={`p-2.5 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer ${
                      paymentMethod === 'bank'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px] text-blue-700">qr_code_2</span>
                    <span>Chuyển khoản VietQR</span>
                    <span className="text-[10px] text-blue-600 font-normal">Quét mã QR ngân hàng</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Step 3: Success Confirmation */}
        {checkoutStep === 'success' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[36px]">verified</span>
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Đã tiếp nhận đơn hàng thành công
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mt-2">
                CẢM ƠN QUÝ KHÁCH {lastCreatedOrder?.fullName?.toUpperCase()}!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Nhân viên kỹ thuật Điện 365 sẽ liên hệ qua số <strong>{lastCreatedOrder?.phone}</strong> để xác nhận và đóng gói gửi ngay.
              </p>
            </div>

            {/* Order Code Box */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 w-full max-w-md flex items-center justify-between text-xs">
              <div className="flex flex-col text-left">
                <span className="text-[11px] text-slate-500">Mã đơn hàng chính thức:</span>
                <span className="text-base font-black text-blue-700 font-mono tracking-wider">
                  {lastCreatedOrder?.orderCode}
                </span>
              </div>
              <button
                type="button"
                onClick={copyOrderCode}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {copiedOrder ? 'check' : 'content_copy'}
                </span>
                <span>{copiedOrder ? 'Đã chép' : 'Sao chép'}</span>
              </button>
            </div>

            {/* Order Details Summary */}
            <div className="w-full max-w-md bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs flex flex-col gap-2">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Địa chỉ nhận hàng:</span>
                <span className="font-semibold text-right max-w-[230px]">{lastCreatedOrder?.address}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Hình thức thanh toán:</span>
                <span className="font-bold text-slate-800">
                  {lastCreatedOrder?.paymentMethod === 'cod' ? 'Thanh toán COD khi nhận hàng' : 'Chuyển khoản QR'}
                </span>
              </div>
              <div className="flex justify-between py-1 text-sm font-bold text-slate-900">
                <span>Tổng tiền (Đã gồm VAT):</span>
                <span className="text-base text-[#e04b16] font-black font-heading">
                  {lastCreatedOrder?.totalPrice?.toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 w-full">
              <button
                type="button"
                onClick={() => {
                  setCheckoutStep('cart');
                  setIsCartOpen(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Hoàn Tất & Tiếp Tục Mua Sắm
              </button>

              {onViewOrdersFile && (
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    onViewOrdersFile();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200 hover:bg-blue-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-blue-700">description</span>
                  <span>Kiểm Tra File Đơn Hàng (orders.csv)</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        {checkoutStep === 'cart' && cartItems.length > 0 && (
          <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="px-3.5 py-3 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
            >
              Tiếp Tục Chọn
            </button>

            <button
              type="button"
              onClick={() => setCheckoutStep('checkout')}
              className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black text-white bg-[#e04b16] hover:bg-[#c93e0e] shadow-lg shadow-orange-500/20 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>TIẾN HÀNH ĐẶT HÀNG NGAY</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        )}

        {checkoutStep === 'checkout' && (
          <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setCheckoutStep('cart')}
              className="px-3.5 py-3 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Quay Lại</span>
            </button>

            <button
              type="button"
              onClick={handleSubmitCheckout}
              disabled={isSubmitting}
              className="flex-1 py-3.5 px-4 rounded-xl text-xs sm:text-sm font-black text-white bg-[#e04b16] hover:bg-[#c93e0e] shadow-lg shadow-orange-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>
                    XÁC NHẬN ĐẶT HÀNG • {totalPrice.toLocaleString('vi-VN')} đ (ĐÃ GỒM VAT)
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
