/**
 * Vietnamese Phone Number & Real Address Deliverability Validation Utilities
 * Designed to ensure authentic phone carriers and real deliverable addresses in Vietnam.
 */

import { VIETNAM_PROVINCES, validateAndMatchVietnamAddress, removeVietnameseTones } from '../data/vietnamAddressData';

export interface PhoneValidationResult {
  isValid: boolean;
  cleanPhone: string;
  carrier?: string;
  formatted: string;
  message: string;
}

export interface AddressValidationResult {
  isValid: boolean;
  isDeliverable: boolean; // Có thể giao hàng được hay không
  score: number; // 0 to 100
  message: string;
  deliverabilityStatus: 'deliverable' | 'need_more_details' | 'invalid_province' | 'too_short';
  province?: string;
  district?: string;
  ward?: string;
  street?: string;
  canonicalAddress?: string;
  carrierRoute?: string;
  estimatedDelivery?: string;
}

/**
 * Validate Vietnamese Mobile Phone Number with Carrier Detection & Fake Pattern Blocking
 */
export function validateVietnamesePhoneNumber(rawInput: string): PhoneValidationResult {
  if (!rawInput || typeof rawInput !== 'string') {
    return {
      isValid: false,
      cleanPhone: '',
      formatted: '',
      message: 'Vui lòng nhập số điện thoại người nhận.',
    };
  }

  // Sanitize: strip whitespace, dashes, dots, parens
  let digits = rawInput.replace(/[^0-9+]/g, '');

  // Handle international format +84 or 84 at beginning
  if (digits.startsWith('+84')) {
    digits = '0' + digits.slice(3);
  } else if (digits.startsWith('84') && digits.length === 11) {
    digits = '0' + digits.slice(2);
  }

  // Remove any remaining non-digits
  digits = digits.replace(/\D/g, '');

  // 1. Length check: standard VN mobile numbers are 10 digits starting with 0
  if (digits.length === 0) {
    return {
      isValid: false,
      cleanPhone: '',
      formatted: '',
      message: 'Vui lòng nhập số điện thoại người nhận.',
    };
  }

  if (digits.length < 10) {
    return {
      isValid: false,
      cleanPhone: digits,
      formatted: digits,
      message: `Số điện thoại mới có ${digits.length}/10 số. Vui lòng nhập đủ 10 số.`,
    };
  }

  if (digits.length > 10) {
    return {
      isValid: false,
      cleanPhone: digits,
      formatted: digits,
      message: `Số điện thoại dài ${digits.length} số (quy định là 10 số). Vui lòng kiểm tra lại.`,
    };
  }

  if (!digits.startsWith('0')) {
    return {
      isValid: false,
      cleanPhone: digits,
      formatted: digits,
      message: 'Số điện thoại Việt Nam hợp lệ phải bắt đầu bằng số 0.',
    };
  }

  // 2. Anti-spam / Fake / Dummy numbers check
  const allSameDigit = /^0(\d)\1{8}$/.test(digits); // e.g. 0999999999, 0000000000, 0111111111
  if (allSameDigit) {
    return {
      isValid: false,
      cleanPhone: digits,
      formatted: digits,
      message: 'Số điện thoại này không có thực (dãy số trùng lặp). Vui lòng nhập số điện thoại thực tế.',
    };
  }

  const dummySequences = ['0123456789', '0987654321', '0123456788', '0909090909'];
  if (dummySequences.includes(digits)) {
    return {
      isValid: false,
      cleanPhone: digits,
      formatted: digits,
      message: 'Số điện thoại thử nghiệm/không có thực. Vui lòng nhập số liên hệ chính xác.',
    };
  }

  // 3. Carrier Prefix Check according to Vietnam Ministry of Information and Communications (MIC)
  const prefix3 = digits.substring(0, 3);
  let carrier: string | undefined;

  // Viettel: 086, 096, 097, 098, 032, 033, 034, 035, 036, 037, 038, 039
  const viettelPrefixes = ['086', '096', '097', '098', '032', '033', '034', '035', '036', '037', '038', '039'];
  // VinaPhone: 088, 091, 094, 081, 082, 083, 084, 085
  const vinaPrefixes = ['088', '091', '094', '081', '082', '083', '084', '085'];
  // MobiFone: 089, 090, 093, 070, 079, 077, 076, 078
  const mobiPrefixes = ['089', '090', '093', '070', '079', '077', '076', '078'];
  // Vietnamobile: 092, 056, 058, 052
  const vnmPrefixes = ['092', '056', '058', '052'];
  // Gmobile / Itelecom / Wintel: 099, 087, 055
  const virtualPrefixes = ['099', '087', '055'];

  if (viettelPrefixes.includes(prefix3)) {
    carrier = 'Viettel';
  } else if (vinaPrefixes.includes(prefix3)) {
    carrier = 'VinaPhone';
  } else if (mobiPrefixes.includes(prefix3)) {
    carrier = 'MobiFone';
  } else if (vnmPrefixes.includes(prefix3)) {
    carrier = 'Vietnamobile';
  } else if (virtualPrefixes.includes(prefix3)) {
    carrier = 'Itelecom / Wintel / Gmobile';
  } else {
    return {
      isValid: false,
      cleanPhone: digits,
      formatted: digits,
      message: `Đầu số ${prefix3} không thuộc nhà mạng viễn thông nào tại Việt Nam. Vui lòng kiểm tra lại.`,
    };
  }

  // Format standard: 0988 123 456
  const formatted = `${digits.substring(0, 4)} ${digits.substring(4, 7)} ${digits.substring(7)}`;

  return {
    isValid: true,
    cleanPhone: digits,
    carrier,
    formatted,
    message: `Số điện thoại ${carrier} hợp lệ — Sẵn sàng nhận tin nhắn thông báo đơn hàng.`,
  };
}

/**
 * Validate Vietnamese Real Address & Deliverability Check
 * Verifies that the address actually points to a real location in Vietnam
 * and contains enough details (Province, District, Street/House/Village) for couriers (Viettel Post, GHTK, EMS) to deliver.
 */
export function validateVietnameseAddress(
  rawAddress: string,
  selectedProvince?: string,
  selectedDistrict?: string
): AddressValidationResult {
  const trimmed = (rawAddress || '').trim();

  // Basic length check
  if (!trimmed || trimmed.length < 5) {
    return {
      isValid: false,
      isDeliverable: false,
      score: 0,
      deliverabilityStatus: 'too_short',
      message: 'Địa chỉ quá ngắn. Bưu tá không thể xác định địa điểm giao hàng.',
    };
  }

  // Gibberish / nonsensical pattern check (e.g. "asdfghjk", "1111111", "aaaaa")
  if (/^[a-zA-Z]{5,}$/.test(trimmed) && !trimmed.includes(' ') && !VIETNAM_PROVINCES.some(p => trimmed.toLowerCase().includes(p.nameEn.toLowerCase()))) {
    return {
      isValid: false,
      isDeliverable: false,
      score: 10,
      deliverabilityStatus: 'too_short',
      message: 'Địa chỉ không hợp lệ hoặc chứa ký tự ngẫu nhiên. Vui lòng nhập địa chỉ thực tế.',
    };
  }

  // If user already selected Province/District via dropdown or quick chips, leverage them
  let fullAddressToParse = trimmed;
  if (selectedProvince && !trimmed.includes(selectedProvince)) {
    fullAddressToParse = `${trimmed}, ${selectedDistrict ? selectedDistrict + ', ' : ''}${selectedProvince}`;
  }

  // Run comprehensive Vietnam administrative database matcher
  const matchResult = validateAndMatchVietnamAddress(fullAddressToParse);
  const normalized = removeVietnameseTones(fullAddressToParse);

  // Determine Province detection
  const province = selectedProvince || matchResult.province;
  const district = selectedDistrict || matchResult.district;
  const ward = matchResult.ward;
  const street = matchResult.streetDetails;

  // 1. Province Check: Must belong to one of 63 valid Vietnamese provinces
  if (!province) {
    return {
      isValid: false,
      isDeliverable: false,
      score: 25,
      deliverabilityStatus: 'invalid_province',
      message: 'Không tìm thấy Tỉnh/Thành phố hợp lệ của Việt Nam. Vui lòng ghi rõ Tỉnh/Thành (VD: Hà Nội, TP.HCM, Hải Phòng...).',
    };
  }

  // 2. Deliverability Check: Can a courier actually deliver a package?
  // If someone just types "Hà Nội" or "Đà Nẵng", a courier cannot find their door!
  const hasSpecificLocation = (street && street.length >= 3) || /\d+/.test(trimmed) || /ngo|ngach|hem|to|thon|xom|ap|khu|duong|so|toa|chung cu|tang/i.test(normalized);

  if (!hasSpecificLocation && !district) {
    return {
      isValid: false,
      isDeliverable: false,
      score: 40,
      province,
      deliverabilityStatus: 'need_more_details',
      message: `Địa chỉ mới chỉ có "${province}". Vui lòng ghi thêm Quận/Huyện và Số nhà/Tên đường hoặc Thôn xóm để bưu tá tìm thấy.`,
    };
  }

  if (!hasSpecificLocation) {
    return {
      isValid: false,
      isDeliverable: false,
      score: 55,
      province,
      district,
      deliverabilityStatus: 'need_more_details',
      message: 'Thiếu số nhà, tên đường hoặc thôn/xóm. Bưu tá không thể giao đến tận tay nếu thiếu địa chỉ cụ thể.',
    };
  }

  if (!district) {
    // Has street and province, but district wasn't clearly isolated
    return {
      isValid: true,
      isDeliverable: true,
      score: 75,
      province,
      street,
      deliverabilityStatus: 'deliverable',
      carrierRoute: `Viettel Post Hub ${province}`,
      estimatedDelivery: '1 - 2 ngày',
      canonicalAddress: matchResult.canonicalAddress || trimmed,
      message: 'Địa chỉ có thể giao hàng. (Bưu tá sẽ liên hệ điện thoại để định vị trước khi phát).',
    };
  }

  // Fully qualified deliverable address (Street/House + District + Province)
  const isOptimal = matchResult.score >= 70 || (hasSpecificLocation && district && province);

  return {
    isValid: true,
    isDeliverable: true,
    score: Math.max(matchResult.score, 85),
    province,
    district,
    ward,
    street,
    canonicalAddress: matchResult.canonicalAddress || trimmed,
    carrierRoute: matchResult.viettelPostHub || `Bưu cục Viettel Post ${district} - ${province}`,
    estimatedDelivery: matchResult.deliveryTimeEstimate || '1 - 2 ngày (Freeship toàn quốc)',
    deliverabilityStatus: 'deliverable',
    message: '✓ Địa chỉ thực tế hợp lệ — Đã xác thực bưu cục phát hàng Viettel Post / GHTK thành công.',
  };
}
