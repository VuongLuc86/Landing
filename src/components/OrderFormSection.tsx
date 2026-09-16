import React, { useState, useEffect } from 'react';
import { COMBOS_DATA, PRODUCTS_DATA } from '../data/mockData';
import { ProductShape } from '../types';
import { OrdersFileModal } from './OrdersFileModal';
import { ViettelPostAddressVerifier } from './ViettelPostAddressVerifier';
import { AddressMatchResult } from '../data/vietnamAddressData';

interface OrderFormProps {
  initialBundleId?: string;
  initialCustomConfig?: { color: string; gangs: number; shape: string } | null;
}

export const OrderFormSection: React.FC<OrderFormProps> = ({
  initialBundleId = 'combo-5',
  initialCustomConfig = null,
}) => {
  const [selectedBundle, setSelectedBundle] = useState<string>(initialBundleId);
  const [shape, setShape] = useState<ProductShape>('rectangular');
  const [fullName, setFullName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [addressVerification, setAddressVerification] = useState<AddressMatchResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderConfirmed, setOrderConfirmed] = useState<boolean>(false);
  const [orderCode, setOrderCode] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  useEffect(() => {
    if (initialBundleId) {
      setSelectedBundle(initialBundleId);
    }
  }, [initialBundleId]);

  useEffect(() => {
    if (initialCustomConfig) {
      const configDetails: string[] = [];
      if (initialCustomConfig.color) configDetails.push(`Màu: ${initialCustomConfig.color}`);
      if (initialCustomConfig.gangs) configDetails.push(`${initialCustomConfig.gangs} Nút`);
      if (initialCustomConfig.shape) configDetails.push(`Đế: ${initialCustomConfig.shape}`);
      if (initialCustomConfig.quantity && initialCustomConfig.quantity > 1) {
        configDetails.push(`SL: ${initialCustomConfig.quantity}`);
      }
      setNotes(
        `Chọn mua: ${initialCustomConfig.product.name}${
          configDetails.length > 0 ? ` [${configDetails.join(' | ')}]` : ''
        }`
      );
      if (initialCustomConfig.shape?.includes('Vuông')) {
        setShape('square');
      }
    }
  }, [initialCustomConfig]);

  // Pricing calculation
  const getBundleInfo = () => {
    const combo = COMBOS_DATA.find((c) => c.id === selectedBundle);
    if (combo) return { name: combo.name, price: combo.price, original: combo.originalPrice };

    const product = PRODUCTS_DATA.find((p) => p.id === selectedBundle);
    if (product) return { name: product.name, price: product.price, original: product.originalPrice };

    return { name: 'Combo 5 Thiết Bị', price: 1580000, original: 1980000 };
  };

  const currentInfo = getBundleInfo();
  const discountAmount = Math.max(0, currentInfo.original - currentInfo.price);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên.');
      return;
    }

    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 9 || cleanPhone.length > 11) {
      setErrorMsg('Vui lòng nhập số điện thoại hợp lệ (10 số).');
      return;
    }

    if (!address.trim()) {
      setErrorMsg('Vui lòng nhập địa chỉ nhận hàng để kỹ sư giao hàng.');
      return;
    }

    setIsSubmitting(true);

    const fullNote = notes
      ? `${notes} (Đế: ${shape === 'rectangular' ? 'Chữ nhật' : 'Vuông'})`
      : `Đế: ${shape === 'rectangular' ? 'Chữ nhật' : 'Vuông'}`;

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const dateFormatted = `${day}/${month}/${year}`;

    const payload = {
      fullName: fullName.trim(),
      phone: phoneNumber.trim(),
      address: address.trim(),
      productName: currentInfo.name,
      amount: currentInfo.price,
      note: fullNote,
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

    // Also update client-side storage cache for fallback resilience
    try {
      const existing = localStorage.getItem('hunonic_orders_csv_records');
      const ordersList = existing
        ? JSON.parse(existing)
        : [
            {
              stt: 1,
              fullName: 'Vương Văn Lực',
              phone: '966757585',
              address: '253, Nguyễn Thị Duệ, phường Việt Hòa, tp Hải Phòng',
              productName: 'Bộ Điều Khiển Hồng Ngoại IR',
              orderDate: '16/09/2026',
              amount: 295000,
              note: 'test',
            },
          ];
      const nextStt = ordersList.length > 0 ? Math.max(...ordersList.map((o: any) => o.stt)) + 1 : 1;
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
    setLastUpdated(Date.now());
  };

  return (
    <section className="w-full py-16 lg:py-24 bg-white" id="dat-hang">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col gap-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-3 max-w-3xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs sm:text-sm text-blue-700 uppercase tracking-widest font-extrabold bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
              Điện 365 • Đại Lý Chính Thức Của HUNONIC
            </span>
            <span className="text-slate-300">•</span>
            <a
              href="tel:0877999663"
              className="text-xs sm:text-sm text-blue-800 font-bold hover:underline inline-flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px] text-blue-600">call</span>
              Hotline: 0877.999.663
            </a>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-slate-900 leading-tight">
            Đặt Hàng Trực Tiếp & Điền Đầy Đủ Thông Tin Vào File
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Hệ thống Điện 365 ghi nhận tự động và đối soát trực tiếp vào file dữ liệu đơn hàng chuẩn ({' '}
            <strong className="text-slate-800">STT, Họ tên, SĐT, Địa chỉ, Sản phẩm mua, Ngày tháng năm, Số tiền thanh toán, Ghi chú</strong>
            {' '}) kết nối chuẩn hóa địa chỉ Viettel Post và kiểm tra hàng trước khi thanh toán.
          </p>

          <div className="pt-1 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setIsOrdersModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200 shadow-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-blue-700">description</span>
              <span>Xem File Dữ Liệu Đơn Hàng (orders.csv)</span>
            </button>
            <span className="text-xs text-slate-400">
              (Đã có đơn mẫu khách hàng Vương Văn Lực)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Order Form Card (Left Column) */}
          <div className="lg:col-span-7 bg-[#f7f9fb] p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-lg">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {errorMsg && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">error</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* File Data Mapping Notice */}
              <div className="p-4 bg-blue-50/80 border border-blue-200/90 rounded-2xl flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5 text-blue-900">
                    <span className="material-symbols-outlined text-[18px] text-blue-700">table_chart</span>
                    <span>Quy chuẩn 8 cột dữ liệu khách hàng lưu vào file (orders.csv):</span>
                  </span>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    Chuẩn 100%
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-700 pt-1">
                  <div className="bg-white p-2 rounded-xl border border-blue-100/80 shadow-2xs">
                    <span className="block font-bold text-blue-900">1. STT</span>
                    <span className="text-slate-500 text-[10px]">Tự động tăng dần</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-blue-100/80 shadow-2xs">
                    <span className="block font-bold text-blue-900">2. Họ tên</span>
                    <span className="text-slate-500 text-[10px]">Khách hàng điền</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-blue-100/80 shadow-2xs">
                    <span className="block font-bold text-blue-900">3. SĐT</span>
                    <span className="text-slate-500 text-[10px]">Số điện thoại liên hệ</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-blue-100/80 shadow-2xs">
                    <span className="block font-bold text-blue-900">4. Địa chỉ</span>
                    <span className="text-slate-500 text-[10px]">Số nhà, xã/phường, tỉnh</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-blue-100/80 shadow-2xs">
                    <span className="block font-bold text-blue-900">5. Sản phẩm mua</span>
                    <span className="text-slate-500 text-[10px]">Thiết bị/Gói đặt mua</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-blue-100/80 shadow-2xs">
                    <span className="block font-bold text-blue-900">6. Ngày tháng năm</span>
                    <span className="text-slate-500 text-[10px]">Định dạng DD/MM/YYYY</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-blue-100/80 shadow-2xs">
                    <span className="block font-bold text-blue-900">7. Số tiền thanh toán</span>
                    <span className="text-slate-500 text-[10px]">Tính bằng VNĐ</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-blue-100/80 shadow-2xs">
                    <span className="block font-bold text-blue-900">8. Ghi chú</span>
                    <span className="text-slate-500 text-[10px]">Đế âm, màu, chi tiết</span>
                  </div>
                </div>
              </div>

              {/* Package Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Sản phẩm mua (Cột 5 trong file) *
                </label>
                <select
                  value={selectedBundle}
                  onChange={(e) => setSelectedBundle(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
                >
                  <optgroup label="Gói Combo Ưu Đãi (Khuyên Dùng)">
                    {COMBOS_DATA.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} — {c.price > 0 ? `${c.price.toLocaleString('vi-VN')}đ` : 'Miễn Phí Tư Vấn'} ({c.discountText})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Sản Phẩm Lẻ">
                    {PRODUCTS_DATA.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {p.price.toLocaleString('vi-VN')}đ (-{p.discountPercent}%)
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Shape Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  2. Chuẩn hộp đế âm tường (Ghi nhận vào Cột 8 - Ghi chú)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setShape('rectangular')}
                    className={`p-3.5 rounded-xl text-left border transition-all flex items-center gap-3 cursor-pointer ${
                      shape === 'rectangular'
                        ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold ring-2 ring-blue-500/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-8 h-5 border-2 border-slate-400 rounded-xs shrink-0" />
                    <div>
                      <span className="text-xs sm:text-sm font-bold block">Chữ Nhật (120x72mm)</span>
                      <span className="text-[11px] text-slate-500">Phổ biến Sino, Panasonic</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShape('square')}
                    className={`p-3.5 rounded-xl text-left border transition-all flex items-center gap-3 cursor-pointer ${
                      shape === 'square'
                        ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold ring-2 ring-blue-500/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-6 h-6 border-2 border-slate-400 rounded-xs shrink-0" />
                    <div>
                      <span className="text-xs sm:text-sm font-bold block">Vuông (86x86mm)</span>
                      <span className="text-[11px] text-slate-500">Schneider, Chuẩn EU</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Contact Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    3. Họ và tên (Cột 2 trong file) *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ví dụ: Vương Văn Lực"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    4. Số điện thoại nhận hàng (Cột 3 trong file) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Ví dụ: 0966 757 585"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
                  />
                </div>
              </div>

              {/* Address with Google Maps and Viettel Post matching */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  5. Địa chỉ nhận hàng (Cột 4 trong file) *
                </label>
                <ViettelPostAddressVerifier
                  value={address}
                  onChange={setAddress}
                  onVerificationChange={setAddressVerification}
                />
              </div>

              {/* Auto columns preview: Date and Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-100/80 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-semibold">6. Ngày tháng năm (Cột 6):</span>
                  <span className="font-mono font-bold text-blue-900 bg-white px-2.5 py-1 rounded border border-slate-200">
                    {new Date().toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-semibold">7. Số tiền thanh toán (Cột 7):</span>
                  <span className="font-mono font-black text-[#e04b16] bg-white px-2.5 py-1 rounded border border-slate-200">
                    {currentInfo.price.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  8. Ghi chú đơn hàng (Cột 8 trong file)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao, test thiết bị..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
                />
              </div>

              {/* Submit CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl text-white font-bold text-base btn-cta-action shadow-xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang xử lý đơn hàng...
                    </span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[22px]">local_shipping</span>
                      <span>XÁC NHẬN ĐẶT HÀNG — SHIP COD TOÀN QUỐC</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
                  Kiểm tra trước khi trả tiền
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">cached</span>
                  1 đổi 1 trong 30 ngày
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">shield</span>
                  Bảo hành 24 tháng
                </span>
              </div>
            </form>
          </div>

          {/* Live Order Summary & Inclusions (Right Column) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-[#f2f4f6] p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md flex flex-col gap-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 font-heading">Chi Tiết Đơn Hàng</h3>
                <span className="text-xs text-blue-700 bg-blue-100 font-bold px-2.5 py-1 rounded-full">
                  Flash Sale
                </span>
              </div>

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-semibold">Gói đã chọn:</span>
                  <span className="font-bold text-slate-900">{currentInfo.name}</span>
                </div>

                <div className="flex justify-between items-center text-slate-600 text-xs">
                  <span>Chuẩn đế âm:</span>
                  <span className="font-medium text-slate-800">
                    {shape === 'rectangular' ? 'Đế chữ nhật (120x72mm)' : 'Đế vuông (86x86mm)'}
                  </span>
                </div>

                {currentInfo.original > 0 && (
                  <div className="flex justify-between items-center text-slate-500 text-xs">
                    <span>Giá niêm yết:</span>
                    <span className="line-through">{currentInfo.original.toLocaleString('vi-VN')}đ</span>
                  </div>
                )}

                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-emerald-700 font-semibold text-xs">
                    <span>Chiết khấu Flash Sale:</span>
                    <span>- {discountAmount.toLocaleString('vi-VN')}đ</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-slate-700 text-xs">
                  <span>Phí vận chuyển:</span>
                  <span className="text-emerald-700 font-bold">MIỄN PHÍ (FREESHIP)</span>
                </div>

                <div className="flex justify-between items-center text-slate-700 text-xs">
                  <span>Phí duy trì máy chủ Cloud:</span>
                  <span className="text-emerald-700 font-bold">0đ TRỌN ĐỜI</span>
                </div>

                <div className="pt-4 border-t border-slate-300/80 flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-base">Tổng thanh toán dự kiến:</span>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-black font-heading text-[#e04b16]">
                      {currentInfo.price > 0
                        ? `${currentInfo.price.toLocaleString('vi-VN')}đ`
                        : '0đ (Tư Vấn Miễn Phí)'}
                    </span>
                    <span className="block text-[11px] text-slate-500">
                      (Thanh toán khi nhận hàng - COD)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hunonic Triple Guarantee */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4">
              <span className="text-xs uppercase font-bold text-slate-600 tracking-wider">
                Cam Kết 3 KHÔNG Từ Hunonic
              </span>
              <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>
                    <strong>KHÔNG đục tường kéo dây:</strong> Lắp vừa 100% đế âm hiện hữu của mọi gia đình.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>
                    <strong>KHÔNG thu phí duy trì:</strong> Không ép khách hàng trả phí duy trì hàng tháng.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>
                    <strong>KHÔNG cần đặt cọc:</strong> Giao hàng tận nơi, mở hộp kiểm tra đúng hàng mới thanh toán.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      {orderConfirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 flex flex-col items-center text-center gap-4 relative animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>

            <span className="text-xs uppercase tracking-widest font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Đặt Hàng Thành Công
            </span>

            <h3 className="text-2xl font-bold font-heading text-slate-900">
              Cảm Ơn Quý Khách {fullName}!
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              Mã đơn hàng của bạn là{' '}
              <strong className="text-blue-700 font-mono font-bold text-base px-2 py-0.5 bg-blue-50 rounded border border-blue-200">
                {orderCode}
              </strong>
              . Đội ngũ kỹ sư Hunonic sẽ liên hệ xác nhận đúng chuẩn đế âm và điều phối hàng trong vòng 15 phút.
            </p>

            <div className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Gói sản phẩm:</span>
                <span className="font-bold text-slate-900">{currentInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Số điện thoại:</span>
                <span className="font-bold text-slate-900">{phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Địa chỉ giao hàng:</span>
                <span className="font-bold text-slate-900 truncate max-w-[200px]" title={address}>{address}</span>
              </div>
              <div className="flex justify-between text-emerald-800 bg-emerald-50/70 p-2 rounded-lg border border-emerald-200/60">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                  Viettel Post tiếp nhận:
                </span>
                <span className="font-bold text-right truncate max-w-[170px]" title={addressVerification?.viettelPostHub || 'Bưu cục Viettel Post trung tâm'}>
                  {addressVerification?.viettelPostHub || 'Viettel Post Hub'}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 text-slate-900 font-bold">
                <span>Tổng tiền COD:</span>
                <span className="text-[#e04b16] font-heading text-sm">
                  {currentInfo.price > 0 ? `${currentInfo.price.toLocaleString('vi-VN')}đ` : 'Tư Vấn Miễn Phí'}
                </span>
              </div>
            </div>

            {/* File sync badge */}
            <div className="w-full p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-emerald-600">task_alt</span>
                <span className="font-semibold text-left">Đã ghi nhận họ tên, SĐT, địa chỉ vào file orders.csv</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOrdersModalOpen(true)}
                className="text-emerald-700 font-bold hover:underline shrink-0 text-[11px]"
              >
                Xem file
              </button>
            </div>

            <div className="flex items-center gap-2 w-full pt-1">
              <button
                onClick={() => setIsOrdersModalOpen(true)}
                className="flex-1 py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 border border-slate-300 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">description</span>
                <span>Xem file CSV</span>
              </button>

              <a
                href="tel:0877999663"
                className="flex-1 py-3 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center gap-1 border border-blue-200 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
                <span>0877.999.663</span>
              </a>
            </div>

            <button
              onClick={() => setOrderConfirmed(false)}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors mt-1"
            >
              Hoàn Tất & Tiếp Tục Xem
            </button>
          </div>
        </div>
      )}

      {/* Orders CSV File Viewer Modal */}
      <OrdersFileModal
        isOpen={isOrdersModalOpen}
        onClose={() => setIsOrdersModalOpen(false)}
        lastUpdated={lastUpdated}
      />
    </section>
  );
};
