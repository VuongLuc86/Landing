import { Product, ComboPackage, ComparisonRow, Testimonial, RecentOrderToastItem } from '../types';
import { HUNONIC_26_PRODUCTS } from './hunonic26Products';

export interface ProductCategoryItem {
  id: string;
  name: string;
  icon: string;
}

export const PRODUCT_CATEGORIES: ProductCategoryItem[] = [
  { id: 'tat-ca', name: 'Tất Cả Sản Phẩm', icon: 'grid_view' },
  { id: 'cong-tac-cam-ung', name: 'Công Tắc Cảm Ứng', icon: 'touch_app' },
  { id: 'cong-tac-thong-minh', name: 'Công Tắc Thông Minh', icon: 'toggle_on' },
  { id: 'thiet-bi-an-toan-dien', name: 'Thiết Bị An Toàn Điện', icon: 'offline_bolt' },
  { id: 'cam-bien-thong-minh', name: 'Cảm Biến Thông Minh', icon: 'sensors' },
  { id: 'bo-dieu-khien-trung-tam', name: 'Bộ Điều Khiển Trung Tâm', icon: 'hub' },
  { id: 'thiet-bi-an-ninh', name: 'Thiết Bị An Ninh', icon: 'security' },
];

export const checkMatchesCategory = (p: Product, catId: string): boolean => {
  if (catId === 'tat-ca') return true;
  const name = p.name.toLowerCase();
  const slug = (p.categorySlug || '').toLowerCase();
  const desc = (p.shortDesc || '').toLowerCase();

  if (catId === 'cong-tac-thong-minh') {
    return (
      slug === 'cong-tac' ||
      name.includes('công tắc') ||
      name.includes('datic') ||
      name.includes('đui đèn') ||
      name.includes('door') ||
      name.includes('neo')
    );
  }
  if (catId === 'cong-tac-cam-ung') {
    return (
      name.includes('cảm ứng') ||
      name.includes('datic') ||
      name.includes('csl') ||
      name.includes('door') ||
      name.includes('neo')
    );
  }
  if (catId === 'thiet-bi-an-ninh') {
    return (
      slug === 'khoa-thong-minh' ||
      name.includes('khóa') ||
      name.includes('tadolock') ||
      name.includes('chuông') ||
      name.includes('door sensor') ||
      name.includes('cảm biến cửa')
    );
  }
  if (catId === 'thiet-bi-an-toan-dien') {
    return (
      slug === 'aptomat' ||
      slug === 'an-toan-dien' ||
      name.includes('công tơ') ||
      name.includes('entec') ||
      name.includes('chống giật') ||
      name.includes('csl') ||
      desc.includes('chống giật')
    );
  }
  if (catId === 'cam-bien-thong-minh') {
    return (
      name.includes('cảm biến') ||
      name.includes('sensor') ||
      name.includes('hpr') ||
      name.includes('pir')
    );
  }
  if (catId === 'bo-dieu-khien-trung-tam') {
    return (
      name.includes('ir smart') ||
      name.includes('hồng ngoại') ||
      name.includes('chuông') ||
      name.includes('neo r6') ||
      name.includes('ngữ cảnh') ||
      name.includes('đui đèn') ||
      name.includes('door') ||
      name.includes('cửa cuốn') ||
      slug.includes('cua-cuon')
    );
  }
  return slug === catId;
};

// Exactly 26 products requested by user from Hunonic catalog
export const PRODUCTS_DATA: Product[] = HUNONIC_26_PRODUCTS;

export const COMBOS_DATA: ComboPackage[] = [
  {
    id: 'combo-3',
    name: 'Combo 3 Thiết Bị',
    subtitle: 'Gói Khởi Động',
    originalPrice: 2290000,
    price: 1680000,
    discountText: 'TIẾT KIỆM 610.000đ + TẶNG SƠ ĐỒ LẮP ĐẶT',
    highlightBenefit: 'Phù hợp nâng cấp phòng ngủ hoặc phòng khách nhỏ',
    items: [
      '2 Công tắc cảm ứng thông minh Hunonic WiFi',
      '1 Bộ điều khiển hồng ngoại IR Smart',
      'Tặng tài liệu hướng dẫn lắp đặt chuẩn kỹ thuật',
      'Miễn phí tài khoản Cloud máy chủ trọn đời',
    ],
  },
  {
    id: 'combo-5',
    name: 'Combo 5 Thiết Bị',
    subtitle: 'Gói Tiêu Chuẩn Toàn Diện',
    tag: 'Bán Chạy Nhất',
    isPopular: true,
    originalPrice: 3458000,
    price: 2580000,
    discountText: 'TIẾT KIỆM 878.000đ + FREESHIP TOÀN QUỐC',
    highlightBenefit: 'Đầy đủ công tắc cảm ứng, bộ hồng ngoại và cảm biến an ninh',
    items: [
      '3 Công tắc cảm ứng thông minh Hunonic (tùy chọn nút)',
      '1 Cảm biến hiện diện Hunonic HPr hoặc cảm biến cửa',
      '1 Bộ điều khiển hồng ngoại IR Smart Pro 360°',
      'Miễn phí giao hàng COD toàn quốc',
      'Bảo hành 24 tháng 1 đổi 1 tận nơi',
    ],
  },
  {
    id: 'combo-expert',
    name: 'Hỗ Trợ Kỹ Sư 1:1',
    subtitle: 'Đặc Quyền Khách Hàng',
    originalPrice: 0,
    price: 0,
    discountText: 'BẢO HÀNH 2 NĂM 1 ĐỔI 1',
    highlightBenefit: 'Tư vấn chọn mặt vuông hay chữ nhật theo đúng đế âm nhà bạn',
    items: [
      'Kỹ sư khảo sát trực tiếp hoặc qua video call',
      'Lên sơ đồ đấu nối chi tiết từng phòng',
      'Hỗ trợ cấu hình ngữ cảnh tự động (Về nhà, Đi ngủ)',
      'Cam kết thiết bị vừa 100% đế âm hiện có',
    ],
  },
];

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    criteria: 'Phí duy trì hàng tháng (App / Cloud)',
    hunonicValue: '✅ 0đ VĨNH VIỄN (MIỄN PHÍ)',
    hunonicStatus: 'success',
    competitorValue: '⚠️ Bắt buộc 50k – 150k / tháng',
    competitorStatus: 'error',
    icon: 'payments',
  },
  {
    criteria: 'Máy chủ điều khiển (Cloud Server)',
    hunonicValue: '✅ Đặt tại Việt Nam (0.1s phản hồi)',
    hunonicStatus: 'success',
    competitorValue: 'Đặt tại Trung Quốc/Mỹ (chậm, hay mất kết nối)',
    competitorStatus: 'warning',
    icon: 'dns',
  },
  {
    criteria: 'Chính sách bảo hành',
    hunonicValue: '✅ 24 Tháng 1 đổi 1 tận nhà',
    hunonicStatus: 'success',
    competitorValue: 'Chỉ 6 - 12 tháng, gửi đi bảo hành lâu',
    competitorStatus: 'warning',
    icon: 'verified_user',
  },
  {
    criteria: 'Yêu cầu Hub trung tâm',
    hunonicValue: '❌ Không cần — Tiết kiệm tối đa',
    hunonicStatus: 'highlight',
    competitorValue: '⚠️ Bắt buộc Hub đắt đỏ 800k - 2.500.000đ',
    competitorStatus: 'error',
    icon: 'router',
  },
  {
    criteria: 'Thi công, lắp đặt',
    hunonicValue: '✅ Chuẩn đế âm Việt Nam (5 phút xong)',
    hunonicStatus: 'success',
    competitorValue: '❌ Phải đục tường, kéo lại dây phiền phức',
    competitorStatus: 'error',
    icon: 'build',
  },
  {
    criteria: 'Giá thành đầu tư',
    hunonicValue: '✅ Giá tốt nhất thị trường',
    hunonicStatus: 'highlight',
    competitorValue: 'Đắt gấp 2.5 – 4 lần qua nhiều tầng trung gian',
    competitorStatus: 'warning',
    icon: 'sell',
  },
];

export const COMMITMENTS = [
  {
    icon: 'store',
    title: 'Phân phối chính hãng',
    desc: 'Hỗ trợ lắp đặt tận nhà tại hơn 40 tỉnh thành toàn quốc',
    accentColor: 'text-primary bg-blue-50',
  },
  {
    icon: 'verified_user',
    title: 'Bảo hành 2 năm',
    desc: 'Chính sách bảo hành điện tử nhanh chóng, 1 đổi 1 trong 30 ngày',
    accentColor: 'text-emerald-700 bg-emerald-50',
  },
  {
    icon: 'sync',
    title: 'Đổi mới linh hoạt',
    desc: 'Đổi trả ngay nếu sản phẩm không vừa ý hoặc phát sinh lỗi',
    accentColor: 'text-blue-700 bg-sky-50',
  },
  {
    icon: 'support_agent',
    title: 'Kỹ thuật 24/7',
    desc: 'Video call trực tiếp cùng kỹ sư hướng dẫn đấu nối từng dây',
    accentColor: 'text-amber-700 bg-amber-50',
  },
  {
    icon: 'design_services',
    title: 'Tư vấn miễn phí',
    desc: 'Lên bản vẽ bố trí thiết bị tối ưu chi phí cho ngôi nhà bạn',
    accentColor: 'text-purple-700 bg-purple-50',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Anh Tuấn',
    avatarLetter: 'T',
    avatarBg: 'bg-primary text-white',
    location: 'TP. Hải Dương',
    purchasedItems: 'Đã lắp 6 công tắc cảm ứng Hunonic',
    quote:
      'Lắp đặt dễ hơn tôi nghĩ rất nhiều, tự tháo công tắc cũ rồi gắn công tắc Hunonic chỉ mất chừng 5 phút mỗi cái. Ứng dụng tiếng Việt mượt mà, không thu đồng phí tháng nào. Tháng vừa rồi tiền điện nhà tôi giảm gần 20% nhờ tính năng hẹn giờ bình nóng lạnh và đèn sân.',
    rating: 5,
    verified: true,
  },
  {
    id: 't-2',
    name: 'Chị Lan',
    avatarLetter: 'L',
    avatarBg: 'bg-[#c83700] text-white',
    location: 'Lê Chân, Hải Phòng',
    purchasedItems: 'Căn hộ chung cư 3 phòng ngủ',
    quote:
      'Điều khiển giọng nói phản hồi siêu nhạy, nói qua loa Google tiếng Việt là đèn và điều hòa tự bật tức thì. Nhà mình có con nhỏ nên việc điều khiển khóa an toàn trên app làm mình rất yên tâm. Giá ưu đãi trực tiếp rẻ hơn rất nhiều so với gói báo giá 30 triệu từ bên ngoài.',
    rating: 5,
    verified: true,
  },
];

export const RECENT_ORDERS_TOAST: RecentOrderToastItem[] = [
  { name: 'Anh Lực', location: 'Việt Hòa, Hải Phòng', packageName: 'Bộ Điều Khiển Hồng Ngoại IR', timeAgo: 'Vừa xong' },
  { name: 'Anh Nam', location: 'Hải Châu, Đà Nẵng', packageName: 'Công tắc cảm ứng WiFi Hunonic', timeAgo: '2 phút trước' },
  { name: 'Chị Thảo', location: 'Quận 1, TP.HCM', packageName: 'Công tắc cảm ứng Hunonic Datic', timeAgo: '3 phút trước' },
  { name: 'Anh Hoàng', location: 'Đống Đa, Hà Nội', packageName: 'Công tơ điện HUNONIC ENTEC', timeAgo: '5 phút trước' },
  { name: 'Anh Dũng', location: 'Hồng Bàng, Hải Phòng', packageName: 'Cảm Biến Hiện Diện HPr Âm Trần', timeAgo: '7 phút trước' },
  { name: 'Chị Mai', location: 'Ninh Kiều, Cần Thơ', packageName: 'Khóa Thông Minh TADOLock TDL 21', timeAgo: '9 phút trước' },
];
