import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  VIETNAM_PROVINCES,
  parseAndVerifyVietnamAddress,
  AddressMatchResult,
  removeVietnameseTones,
  VietnamProvince,
  VietnamDistrict,
} from '../data/vietnamAddressData';

interface ViettelPostAddressVerifierProps {
  value: string;
  onChange: (address: string) => void;
  onVerificationChange?: (result: AddressMatchResult) => void;
}

export const ViettelPostAddressVerifier: React.FC<ViettelPostAddressVerifierProps> = ({
  value,
  onChange,
  onVerificationChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showCascadingPicker, setShowCascadingPicker] = useState(false);
  const [showMapPreview, setShowMapPreview] = useState(true);
  const [mapType, setMapType] = useState<'m' | 'k'>('m'); // 'm' = normal map, 'k' = satellite
  const [onlineSuggestions, setOnlineSuggestions] = useState<Array<{ displayName: string }>>([]);
  const [isLoadingOnline, setIsLoadingOnline] = useState(false);

  // Cascading picker state
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<string>('HN');
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [streetDetailInput, setStreetDetailInput] = useState<string>('');

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Parse and match address against Vietnam administrative hierarchy & Viettel Post standards
  const verification: AddressMatchResult = useMemo(() => {
    return parseAndVerifyVietnamAddress(value);
  }, [value]);

  useEffect(() => {
    if (onVerificationChange) {
      onVerificationChange(verification);
    }
  }, [verification, onVerificationChange]);

  // Selected province & district in cascading picker
  const currentProvince: VietnamProvince | undefined = useMemo(() => {
    return VIETNAM_PROVINCES.find((p) => p.code === selectedProvinceCode) || VIETNAM_PROVINCES[0];
  }, [selectedProvinceCode]);

  const currentDistrict: VietnamDistrict | undefined = useMemo(() => {
    return currentProvince?.districts.find((d) => d.code === selectedDistrictCode);
  }, [currentProvince, selectedDistrictCode]);

  // Handle outside click to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced online geocoding lookup
  useEffect(() => {
    if (!value || value.length < 4) {
      setOnlineSuggestions([]);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      setIsLoadingOnline(true);
      try {
        const res = await fetch(`/api/address-lookup?q=${encodeURIComponent(value)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.suggestions && data.suggestions.length > 0) {
            setOnlineSuggestions(data.suggestions.slice(0, 4));
          } else {
            setOnlineSuggestions([]);
          }
        }
      } catch (e) {
        setOnlineSuggestions([]);
      } finally {
        setIsLoadingOnline(false);
      }
    }, 450);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [value]);

  // Local administrative suggestions based on input
  const localSuggestions = useMemo(() => {
    const term = removeVietnameseTones(value);
    if (!term || term.length < 2) return [];

    const results: Array<{ title: string; subtitle: string; full: string }> = [];

    for (const prov of VIETNAM_PROVINCES) {
      const provMatch = removeVietnameseTones(prov.name).includes(term);
      for (const dist of prov.districts) {
        const distMatch = removeVietnameseTones(dist.name).includes(term);
        for (const ward of dist.wards) {
          const wardMatch = removeVietnameseTones(ward).includes(term);
          if (wardMatch || distMatch || provMatch) {
            results.push({
              title: `Phường/Xã ${ward}, ${dist.prefix} ${dist.name}`,
              subtitle: `${prov.name} • Viettel Post: ${prov.postalCode}`,
              full: `${ward}, ${dist.prefix} ${dist.name}, ${prov.name}`,
            });
            if (results.length >= 6) return results;
          }
        }
      }
    }

    return results;
  }, [value]);

  const handleSelectSuggestion = (suggested: string) => {
    // If value had street number/details in front, keep it
    const parts = value.split(',');
    const potentialStreet = parts[0]?.trim();
    if (potentialStreet && /\d+/.test(potentialStreet) && !suggested.includes(potentialStreet)) {
      onChange(`${potentialStreet}, ${suggested}`);
    } else {
      onChange(suggested);
    }
    setIsDropdownOpen(false);
  };

  const handleApplyCascadingAddress = () => {
    if (!currentProvince) return;
    const parts: string[] = [];
    if (streetDetailInput.trim()) {
      parts.push(streetDetailInput.trim());
    }
    if (selectedWard) {
      parts.push(`Phường/Xã ${selectedWard}`);
    }
    if (currentDistrict) {
      parts.push(`${currentDistrict.prefix} ${currentDistrict.name}`);
    }
    parts.push(currentProvince.name);

    const fullAddr = parts.join(', ');
    onChange(fullAddr);
    setShowCascadingPicker(false);
  };

  const googleMapsEmbedUrl = useMemo(() => {
    const query = verification.googleMapsQuery || `${value}, Vietnam`;
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=${mapType}&z=15&ie=UTF8&iwloc=&output=embed`;
  }, [verification.googleMapsQuery, value, mapType]);

  const googleMapsExternalUrl = useMemo(() => {
    const query = verification.googleMapsQuery || `${value}, Vietnam`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }, [verification.googleMapsQuery, value]);

  return (
    <div ref={containerRef} className="flex flex-col gap-2.5 w-full">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[18px] text-red-600">location_on</span>
          <span>Địa chỉ giao hàng (Đối chiếu Google Maps & Viettel Post) *</span>
        </label>

        <button
          type="button"
          onClick={() => setShowCascadingPicker(!showCascadingPicker)}
          className="text-[11px] font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 hover:underline"
        >
          <span className="material-symbols-outlined text-[15px]">tune</span>
          <span>{showCascadingPicker ? 'Ẩn bộ chọn' : 'Chọn Tỉnh / Huyện / Xã'}</span>
        </button>
      </div>

      {/* Input container with live autocomplete */}
      <div className="relative w-full">
        <div className="relative flex items-center">
          <input
            type="text"
            required
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => {
              if (value.length >= 2) setIsDropdownOpen(true);
            }}
            placeholder="Ví dụ: 253 Nguyễn Thị Duệ, phường Việt Hòa, Hải Phòng (hoặc gõ tên đường, quận, tỉnh)"
            className="w-full pl-10 pr-24 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-xs"
          />

          {/* Left pin icon */}
          <div className="absolute left-3 flex items-center pointer-events-none text-slate-400">
            <span className="material-symbols-outlined text-[20px] text-red-500">pin_drop</span>
          </div>

          {/* Right badge & clear button */}
          <div className="absolute right-2.5 flex items-center gap-1.5">
            {isLoadingOnline && (
              <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            )}
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setIsDropdownOpen(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                title="Xóa địa chỉ"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
            <span className="text-[10px] uppercase font-bold tracking-tight bg-orange-100 text-orange-800 px-2 py-0.5 rounded-md border border-orange-200 shrink-0">
              Viettel Post
            </span>
          </div>
        </div>

        {/* Autocomplete Suggestions Dropdown */}
        {isDropdownOpen && (localSuggestions.length > 0 || onlineSuggestions.length > 0) && (
          <div className="absolute z-40 left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden max-h-72 overflow-y-auto">
            <div className="p-2 bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-blue-600">search</span>
                Gợi ý địa chỉ khớp bản đồ & bưu cục
              </span>
              <span className="text-slate-400">Bấm để chọn</span>
            </div>

            {/* Local database matches */}
            {localSuggestions.map((item, idx) => (
              <button
                key={`local-${idx}`}
                type="button"
                onClick={() => handleSelectSuggestion(item.full)}
                className="w-full px-4 py-2.5 text-left hover:bg-blue-50/70 border-b border-slate-100 flex items-start gap-2.5 transition-colors group"
              >
                <span className="material-symbols-outlined text-[18px] text-slate-400 group-hover:text-blue-600 shrink-0 mt-0.5">
                  location_city
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-900 truncate">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{item.subtitle}</div>
                </div>
                <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-sm shrink-0 font-medium">
                  Chuẩn hóa
                </span>
              </button>
            ))}

            {/* Online Nominatim geocoding matches */}
            {onlineSuggestions.map((item, idx) => (
              <button
                key={`online-${idx}`}
                type="button"
                onClick={() => handleSelectSuggestion(item.displayName)}
                className="w-full px-4 py-2 text-left hover:bg-emerald-50/70 border-b border-slate-100 flex items-start gap-2.5 transition-colors group"
              >
                <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0 mt-0.5">
                  map
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-800 truncate">
                    {item.displayName}
                  </div>
                  <div className="text-[10px] text-slate-400">Tọa độ GPS Google Maps xác nhận</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3-Tier Cascading Selector (Tỉnh -> Huyện -> Xã) like Viettel Post Web */}
      {showCascadingPicker && (
        <div className="p-4 rounded-2xl bg-white border-2 border-blue-200 shadow-md flex flex-col gap-3 transition-all animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
              <span className="material-symbols-outlined text-[18px] text-blue-600">account_tree</span>
              <span>Bộ Chọn 3 Cấp Hành Chính Chuẩn Bưu Chính Viettel Post</span>
            </div>
            <button
              type="button"
              onClick={() => setShowCascadingPicker(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Province */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                1. Tỉnh / Thành phố
              </label>
              <select
                value={selectedProvinceCode}
                onChange={(e) => {
                  setSelectedProvinceCode(e.target.value);
                  setSelectedDistrictCode('');
                  setSelectedWard('');
                }}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {VIETNAM_PROVINCES.map((prov) => (
                  <option key={prov.code} value={prov.code}>
                    {prov.name}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                2. Quận / Huyện / Thị xã
              </label>
              <select
                value={selectedDistrictCode}
                onChange={(e) => {
                  setSelectedDistrictCode(e.target.value);
                  setSelectedWard('');
                }}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Chọn Quận / Huyện --</option>
                {currentProvince?.districts.map((dist) => (
                  <option key={dist.code} value={dist.code}>
                    {dist.prefix} {dist.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Ward */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                3. Phường / Xã
              </label>
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                disabled={!selectedDistrictCode}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="">-- Chọn Phường / Xã --</option>
                {currentDistrict?.wards.map((ward) => (
                  <option key={ward} value={ward}>
                    Phường/Xã {ward}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Street details */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              4. Số nhà, tên đường, ngõ ngách, thôn xóm
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={streetDetailInput}
                onChange={(e) => setStreetDetailInput(e.target.value)}
                placeholder="Ví dụ: Số 253 đường Nguyễn Thị Duệ, KĐT Nam Cường..."
                className="flex-1 px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleApplyCascadingAddress}
                className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shrink-0 shadow-sm transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">check</span>
                <span>Áp Dụng Địa Chỉ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Verification & Google Maps Cross-Check Card */}
      {value && value.length >= 3 && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-3 mt-1">
          {/* Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  verification.isValid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {verification.isValid ? 'verified' : 'priority_high'}
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Đối Chiếu Địa Chỉ Viettel Post & Google Maps</span>
                  <span
                    className={`text-[10px] px-2 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                      verification.isValid
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {verification.isValid ? 'Khớp Bưu Chính 100%' : 'Cần Xác Nhận'}
                  </span>
                </div>
                <div
                  className={`text-[11px] font-medium ${
                    verification.isValid ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {verification.statusMessage}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={googleMapsExternalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                <span>Mở Google Maps</span>
              </a>

              <button
                type="button"
                onClick={() => setShowMapPreview(!showMapPreview)}
                className="text-[11px] font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {showMapPreview ? 'expand_less' : 'map'}
                </span>
                <span>{showMapPreview ? 'Thu gọn map' : 'Xem bản đồ'}</span>
              </button>
            </div>
          </div>

          {/* Delivery & Routing Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-0.5">
                <span className="material-symbols-outlined text-[14px] text-red-500">store</span>
                Bưu cục Viettel Post phát:
              </div>
              <div className="font-bold text-slate-800 truncate" title={verification.viettelPostHub}>
                {verification.viettelPostHub}
              </div>
              <div className="text-[10px] text-slate-500">Mã bưu chính: {verification.postalCode}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-0.5">
                <span className="material-symbols-outlined text-[14px] text-blue-600">schedule</span>
                Thời gian giao dự kiến:
              </div>
              <div className="font-bold text-slate-800">{verification.deliveryTimeEstimate}</div>
              <div className="text-[10px] text-emerald-600 font-semibold">✓ Phát tận nhà toàn quốc</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-0.5">
                <span className="material-symbols-outlined text-[14px] text-emerald-600">local_shipping</span>
                Cước phí & Thanh toán:
              </div>
              <div className="font-bold text-emerald-700">0đ (Miễn Phí Vận Chuyển)</div>
              <div className="text-[10px] text-slate-500">Thu tiền COD khi nhận & test hàng</div>
            </div>
          </div>

          {/* Embedded Google Maps Live Preview */}
          {showMapPreview && (
            <div className="w-full rounded-xl overflow-hidden border border-slate-200 relative bg-slate-100 shadow-inner">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800 text-white text-[11px]">
                <div className="flex items-center gap-1.5 font-medium truncate pr-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span className="text-slate-300">Vị trí giao hàng trên Google Maps:</span>
                  <span className="font-bold text-white truncate">{value}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setMapType(mapType === 'm' ? 'k' : 'm')}
                    className="px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-[10px] font-medium text-slate-200 transition-colors"
                  >
                    {mapType === 'm' ? '🛰️ Vệ tinh' : '🗺️ Bản đồ'}
                  </button>
                </div>
              </div>

              <div className="w-full h-48 sm:h-56 bg-slate-200">
                <iframe
                  title="Google Maps Delivery Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer"
                  src={googleMapsEmbedUrl}
                />
              </div>

              <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-600 flex items-center justify-between">
                <span>📍 Tọa độ bưu phẩm được định vị để bưu tá Viettel Post gọi điện trước khi giao</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">check_circle</span>
                  Bảo đảm đúng địa chỉ
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
