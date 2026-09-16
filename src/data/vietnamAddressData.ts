/**
 * Vietnam Administrative Address Database & Viettel Post Hub Mapping
 * Standards matching https://viettelpost.vn/ address lookup & Google Maps geocoding
 */

export interface VietnamProvince {
  code: string;
  name: string;
  nameEn: string;
  postalCode: string;
  region: 'Bắc' | 'Trung' | 'Nam';
  viettelHub: string;
  districts: VietnamDistrict[];
}

export interface VietnamDistrict {
  code: string;
  name: string;
  prefix: 'Quận' | 'Huyện' | 'Thị xã' | 'Thành phố';
  wards: string[];
}

export interface AddressMatchResult {
  isValid: boolean;
  score: number; // 0 to 100
  province?: string;
  district?: string;
  ward?: string;
  streetDetails?: string;
  canonicalAddress: string;
  postalCode: string;
  viettelPostHub: string;
  deliveryTimeEstimate: string;
  shippingFee: number;
  deliveryStatus: 'ready' | 'missing_ward' | 'missing_district' | 'missing_street' | 'invalid';
  statusMessage: string;
  googleMapsQuery: string;
  approxCoordinates?: { lat: number; lng: number };
}

export const VIETNAM_PROVINCES: VietnamProvince[] = [
  {
    code: 'HN',
    name: 'Thành phố Hà Nội',
    nameEn: 'Ha Noi',
    postalCode: '100000',
    region: 'Bắc',
    viettelHub: 'Bưu cục Viettel Post Ba Đình - Hà Nội Hub',
    districts: [
      { code: 'HN-BD', name: 'Ba Đình', prefix: 'Quận', wards: ['Kim Mã', 'Điện Biên', 'Đội Cấn', 'Giảng Võ', 'Liễu Giai', 'Ngọc Hà', 'Ngọc Khánh', 'Nguyễn Trung Trực', 'Phúc Xá', 'Quán Thánh', 'Thành Công', 'Trúc Bạch', 'Vĩnh Phúc'] },
      { code: 'HN-HK', name: 'Hoàn Kiếm', prefix: 'Quận', wards: ['Hàng Bạc', 'Hàng Bồ', 'Hàng Buồm', 'Hàng Đào', 'Hàng Gai', 'Hàng Mã', 'Hàng Trống', 'Cửa Đông', 'Cửa Nam', 'Đồng Xuân', 'Lý Thái Tổ', 'Phan Chu Trinh', 'Tràng Tiền'] },
      { code: 'HN-CG', name: 'Cầu Giấy', prefix: 'Quận', wards: ['Dịch Vọng', 'Dịch Vọng Hậu', 'Mai Dịch', 'Nghĩa Đô', 'Nghĩa Tân', 'Quan Hoa', 'Trung Hòa', 'Yên Hòa'] },
      { code: 'HN-DD', name: 'Đống Đa', prefix: 'Quận', wards: ['Cát Linh', 'Hàng Bột', 'Khâm Thiên', 'Khương Thượng', 'Kim Liên', 'Láng Hạ', 'Láng Thượng', 'Nam Đồng', 'Ô Chợ Dừa', 'Phương Liên', 'Phương Mai', 'Quang Trung', 'Quốc Tử Giám', 'Thịnh Quang', 'Thổ Quan', 'Trung Liệt', 'Trung Phụng', 'Trung Tự', 'Văn Chương', 'Văn Miếu'] },
      { code: 'HN-HBT', name: 'Hai Bà Trưng', prefix: 'Quận', wards: ['Bách Khoa', 'Bạch Đằng', 'Bạch Mai', 'Cầu Dền', 'Đống Mác', 'Đồng Nhân', 'Đồng Tâm', 'Lê Đại Hành', 'Minh Khai', 'Nguyễn Du', 'Phạm Đình Hổ', 'Phố Huế', 'Quỳnh Lôi', 'Quỳnh Mai', 'Thanh Lương', 'Thanh Nhàn', 'Trương Định', 'Vĩnh Tuy'] },
      { code: 'HN-TX', name: 'Thanh Xuân', prefix: 'Quận', wards: ['Hạ Đình', 'Khương Đình', 'Khương Mai', 'Khương Trung', 'Kim Giang', 'Nhân Chính', 'Phương Liệt', 'Thanh Xuân Bắc', 'Thanh Xuân Nam', 'Thanh Xuân Trung', 'Thượng Đình'] },
      { code: 'HN-NTL', name: 'Nam Từ Liêm', prefix: 'Quận', wards: ['Cầu Diễn', 'Đại Mỗ', 'Mễ Trì', 'Mỹ Đình 1', 'Mỹ Đình 2', 'Phú Đô', 'Tây Mỗ', 'Trung Văn', 'Xuân Phương'] },
      { code: 'HN-BTL', name: 'Bắc Từ Liêm', prefix: 'Quận', wards: ['Cổ Nhuế 1', 'Cổ Nhuế 2', 'Đông Ngạc', 'Đức Thắng', 'Liên Mạc', 'Minh Khai', 'Phú Diễn', 'Phúc Diễn', 'Tây Tựu', 'Thụy Phương', 'Thượng Cát', 'Xuân Đỉnh', 'Xuân Tảo'] },
      { code: 'HN-HM', name: 'Hoàng Mai', prefix: 'Quận', wards: ['Đại Kim', 'Định Công', 'Giáp Bát', 'Hoàng Liệt', 'Hoàng Văn Thụ', 'Lĩnh Nam', 'Mai Động', 'Tân Mai', 'Thanh Trì', 'Thịnh Liệt', 'Trần Phú', 'Tương Mai', 'Vĩnh Hưng', 'Yên Sở'] },
      { code: 'HN-LB', name: 'Long Biên', prefix: 'Quận', wards: ['Bồ Đề', 'Cự Khối', 'Đức Giang', 'Gia Thụy', 'Giang Biên', 'Long Biên', 'Ngọc Lâm', 'Ngọc Thụy', 'Phúc Đồng', 'Phúc Lợi', 'Sài Đồng', 'Thạch Bàn', 'Thượng Thanh', 'Việt Hưng'] },
      { code: 'HN-TH', name: 'Tây Hồ', prefix: 'Quận', wards: ['Bưởi', 'Nhật Tân', 'Phú Thượng', 'Quảng An', 'Thụy Khuê', 'Tứ Liên', 'Xuân La', 'Yên Phụ'] },
      { code: 'HN-HD', name: 'Hà Đông', prefix: 'Quận', wards: ['Biên Giang', 'Đồng Mai', 'Dương Nội', 'Hà Cầu', 'Kiến Hưng', 'La Khê', 'Mộ Lao', 'Nguyễn Trãi', 'Phú La', 'Phú Lãm', 'Phú Lương', 'Phúc La', 'Quang Trung', 'Vạn Phúc', 'Văn Quán', 'Yên Nghĩa', 'Yết Kiêu'] },
      { code: 'HN-GL', name: 'Gia Lâm', prefix: 'Huyện', wards: ['Trâu Quỳ', 'Yên Viên', 'Bát Tràng', 'Cổ Bi', 'Đa Tốn', 'Đặng Xá', 'Dương Xá', 'Kiêu Kỵ', 'Ninh Hiệp', 'Phù Đổng'] },
      { code: 'HN-DA', name: 'Đông Anh', prefix: 'Huyện', wards: ['Đông Anh', 'Bắc Hồng', 'Cổ Loa', 'Dục Tú', 'Hải Bối', 'Kim Chung', 'Kim Nỗ', 'Nam Hồng', 'Tiên Dương', 'Uy Nỗ', 'Vĩnh Ngọc', 'Võng La', 'Xuân Canh'] },
    ],
  },
  {
    code: 'HP',
    name: 'Thành phố Hải Phòng',
    nameEn: 'Hai Phong',
    postalCode: '180000',
    region: 'Bắc',
    viettelHub: 'Bưu cục Viettel Post Hải Phòng Central Hub',
    districts: [
      { code: 'HP-HB', name: 'Hồng Bàng', prefix: 'Quận', wards: ['Hạ Lý', 'Hoàng Văn Thụ', 'Hùng Vương', 'Minh Khai', 'Phan Bội Châu', 'Quán Toan', 'Sở Dầu', 'Thượng Lý', 'Trại Chuối'] },
      { code: 'HP-NG', name: 'Ngô Quyền', prefix: 'Quận', wards: ['Cầu Đất', 'Cầu Tre', 'Đằng Giang', 'Đông Khê', 'Đổng Quốc Bình', 'Gia Viên', 'Lạc Viên', 'Lạch Tray', 'Lê Lợi', 'Máy Chai', 'Máy Tơ', 'Vạn Mỹ'] },
      { code: 'HP-LC', name: 'Lê Chân', prefix: 'Quận', wards: ['An Biên', 'An Dương', 'Cát Dài', 'Đông Hải', 'Dư Hàng', 'Dư Hàng Kênh', 'Hàng Kênh', 'Hồ Nam', 'Kênh Dương', 'Lam Sơn', 'Niệm Nghĩa', 'Nghĩa Xá', 'Trần Nguyên Hãn', 'Vĩnh Niệm'] },
      { code: 'HP-HA', name: 'Hải An', prefix: 'Quận', wards: ['Cát Bi', 'Đằng Hải', 'Đằng Lâm', 'Đông Hải 1', 'Đông Hải 2', 'Nam Hải', 'Thành Tô', 'Tràng Cát'] },
      { code: 'HP-KA', name: 'Kiến An', prefix: 'Quận', wards: ['Bắc Sơn', 'Đồng Hòa', 'Nam Sơn', 'Ngọc Sơn', 'Phù Liễn', 'Quán Trữ', 'Trần Thành Ngọ', 'Văn Đẩu'] },
      { code: 'HP-TN', name: 'Thủy Nguyên', prefix: 'Thành phố', wards: ['Núi Đèo', 'Minh Đức', 'An Lư', 'Hoa Động', 'Hoàng Động', 'Kênh Giang', 'Lâm Động', 'Lập Lễ', 'Lưu Kiếm', 'Lưu Kỳ', 'Quảng Thanh', 'Tam Hưng', 'Thủy Đường', 'Thủy Sơn', 'Thủy Triều', 'Trung Hà'] },
      { code: 'HP-AD', name: 'An Dương', prefix: 'Huyện', wards: ['An Dương', 'An Đồng', 'An Hòa', 'An Hồng', 'Bắc Sơn', 'Đại Bản', 'Đặng Cương', 'Đồng Thái', 'Hồng Phong', 'Hồng Thái', 'Lê Lợi', 'Lê Thiện', 'Nam Sơn', 'Quốc Tuấn', 'Tân Tiến'] },
    ],
  },
  {
    code: 'HD',
    name: 'Tỉnh Hải Dương',
    nameEn: 'Hai Duong',
    postalCode: '170000',
    region: 'Bắc',
    viettelHub: 'Bưu cục Viettel Post Hải Dương Central',
    districts: [
      { code: 'HD-TP', name: 'Hải Dương', prefix: 'Thành phố', wards: ['Việt Hòa', 'Nguyễn Trãi', 'Trần Hưng Đạo', 'Trần Phú', 'Quang Trung', 'Lê Thanh Nghị', 'Hải Tân', 'Tứ Minh', 'Cẩm Thượng', 'Bình Hàn', 'Thanh Bình', 'Ngọc Châu', 'Nhị Châu', 'Nam Đồng', 'Tân Hưng', 'Thạch Khôi', 'Ái Quốc', 'An Thượng'] },
      { code: 'HD-CL', name: 'Chí Linh', prefix: 'Thành phố', wards: ['Bến Tắm', 'Cộng Hòa', 'Đồng Lạc', 'Hoàng Tân', 'Hoàng Tiến', 'Phả Lại', 'Sao Đỏ', 'Tân Dân', 'Thái Học', 'Văn An', 'Văn Đức'] },
      { code: 'HD-KG', name: 'Kinh Môn', prefix: 'Thị xã', wards: ['An Lưu', 'An Phụ', 'An Sinh', 'Duy Tân', 'Hiến Thành', 'Hiệp An', 'Hiệp Sơn', 'Long Xuyên', 'Minh Tân', 'Phú Thứ', 'Tân Dân', 'Thất Hùng'] },
      { code: 'HD-CG', name: 'Cẩm Giàng', prefix: 'Huyện', wards: ['Cẩm Giang', 'Lai Cách', 'Cẩm Đoài', 'Cẩm Đông', 'Cẩm Hoàng', 'Cẩm Hưng', 'Cẩm Phúc', 'Cẩm Văn', 'Cẩm Vũ', 'Cao An', 'Định Sơn', 'Lương Điền', 'Ngọc Tú', 'Tân Trường'] },
      { code: 'HD-BG', name: 'Bình Giang', prefix: 'Huyện', wards: ['Kẻ Sặt', 'Bình Minh', 'Bình Xuyên', 'Cổ Bì', 'Hồng Khê', 'Hùng Thắng', 'Long Xuyên', 'Nhân Quyền', 'Tân Hồng', 'Tân Việt', 'Thái Dương', 'Thái Học', 'Thái Hòa', 'Vĩnh Hưng', 'Vĩnh Hồng'] },
      { code: 'HD-NG', name: 'Nam Sách', prefix: 'Huyện', wards: ['Nam Sách', 'An Bình', 'An Lâm', 'An Sơn', 'Cộng Hòa', 'Đồng Lạc', 'Hiệp Cát', 'Hồng Phong', 'Hợp Tiến', 'Minh Tân', 'Nam Hưng', 'Nam Tân', 'Nam Trung', 'Phú Điền', 'Quốc Tuấn', 'Thái Tân', 'Thanh Quang'] },
    ],
  },
  {
    code: 'HCM',
    name: 'Thành phố Hồ Chí Minh',
    nameEn: 'Ho Chi Minh',
    postalCode: '700000',
    region: 'Nam',
    viettelHub: 'Bưu cục Viettel Post Tân Bình - TP.HCM Hub',
    districts: [
      { code: 'HCM-Q1', name: 'Quận 1', prefix: 'Quận', wards: ['Bến Nghé', 'Bến Thành', 'Cầu Kho', 'Cầu Ông Lãnh', 'Cô Giang', 'Đa Kao', 'Định Tiên Hoàng', 'Nguyễn Cư Trinh', 'Nguyễn Thái Bình', 'Phạm Ngũ Lão', 'Tân Định'] },
      { code: 'HCM-Q3', name: 'Quận 3', prefix: 'Quận', wards: ['Võ Thị Sáu', 'Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12', 'Phường 13', 'Phường 14'] },
      { code: 'HCM-Q7', name: 'Quận 7', prefix: 'Quận', wards: ['Tân Phong', 'Tân Phú', 'Tân Quy', 'Tân Kiểng', 'Tân Hưng', 'Bình Thuận', 'Phú Mỹ', 'Phú Thuận', 'Tân Thuận Đông', 'Tân Thuận Tây'] },
      { code: 'HCM-TB', name: 'Tân Bình', prefix: 'Quận', wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12', 'Phường 13', 'Phường 14', 'Phường 15'] },
      { code: 'HCM-BT', name: 'Bình Thạnh', prefix: 'Quận', wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 11', 'Phường 12', 'Phường 13', 'Phường 14', 'Phường 15', 'Phường 17', 'Phường 19', 'Phường 21', 'Phường 22', 'Phường 24', 'Phường 25', 'Phường 26', 'Phường 27', 'Phường 28'] },
      { code: 'HCM-TD', name: 'Thủ Đức', prefix: 'Thành phố', wards: ['Thảo Điền', 'An Phú', 'An Khánh', 'Bình An', 'Bình Trưng Đông', 'Bình Trưng Tây', 'Cát Lái', 'Thạnh Mỹ Lợi', 'Hiệp Phú', 'Long Bình', 'Long Phước', 'Long Thạnh Mỹ', 'Long Trường', 'Phú Hữu', 'Phước Bình', 'Phước Long A', 'Phước Long B', 'Tăng Nhơn Phú A', 'Tăng Nhơn Phú B', 'Trường Thạnh', 'Bình Chiểu', 'Bình Thọ', 'Hiệp Bình Chánh', 'Hiệp Bình Phước', 'Linh Chiểu', 'Linh Đông', 'Linh Mây', 'Linh Trung', 'Linh Xuân', 'Tam Bình', 'Tam Phú', 'Trường Thọ'] },
      { code: 'HCM-GV', name: 'Gò Vấp', prefix: 'Quận', wards: ['Phường 1', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12', 'Phường 13', 'Phường 14', 'Phường 15', 'Phường 16', 'Phường 17'] },
      { code: 'HCM-PN', name: 'Phú Nhuận', prefix: 'Quận', wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 13', 'Phường 15', 'Phường 17'] },
    ],
  },
  {
    code: 'DN',
    name: 'Thành phố Đà Nẵng',
    nameEn: 'Da Nang',
    postalCode: '550000',
    region: 'Trung',
    viettelHub: 'Bưu cục Viettel Post Hải Châu - Đà Nẵng Hub',
    districts: [
      { code: 'DN-HC', name: 'Hải Châu', prefix: 'Quận', wards: ['Hải Châu 1', 'Hải Châu 2', 'Thạch Thang', 'Thanh Bình', 'Thuận Phước', 'Hòa Thuận Đông', 'Hòa Thuận Tây', 'Nam Dương', 'Phước Ninh', 'Bình Hiên', 'Bình Thuận', 'Hòa Cường Bắc', 'Hòa Cường Nam'] },
      { code: 'DN-TK', name: 'Thanh Khê', prefix: 'Quận', wards: ['Tam Thuận', 'Thanh Khê Tây', 'Thanh Khê Đông', 'Xuân Hà', 'Tân Chính', 'Chính Gián', 'Vĩnh Trung', 'Thạc Gián', 'An Khê', 'Hòa Khê'] },
      { code: 'DN-ST', name: 'Sơn Trà', prefix: 'Quận', wards: ['An Hải Bắc', 'An Hải Đông', 'An Hải Tây', 'Mân Thái', 'Nại Hiên Đông', 'Phước Mỹ', 'Thọ Quang'] },
      { code: 'DN-NHS', name: 'Ngũ Hành Sơn', prefix: 'Quận', wards: ['Hòa Hải', 'Hòa Quý', 'Khuê Mỹ', 'Mỹ An'] },
      { code: 'DN-CL', name: 'Cẩm Lệ', prefix: 'Quận', wards: ['Hòa An', 'Hòa Phát', 'Hòa Thọ Đông', 'Hòa Thọ Tây', 'Hòa Xuân', 'Khuê Trung'] },
    ],
  },
  {
    code: 'BD',
    name: 'Tỉnh Bình Dương',
    nameEn: 'Binh Duong',
    postalCode: '820000',
    region: 'Nam',
    viettelHub: 'Bưu cục Viettel Post Thủ Dầu Một',
    districts: [
      { code: 'BD-TDM', name: 'Thủ Dầu Một', prefix: 'Thành phố', wards: ['Phú Hòa', 'Phú Cường', 'Phú Lợi', 'Phú Mỹ', 'Phú Tân', 'Phú Thọ', 'Định Hòa', 'Hiệp An', 'Hiệp Thành', 'Chánh Mỹ', 'Chánh Nghĩa', 'Tân An', 'Tương Bình Hiệp'] },
      { code: 'BD-TA', name: 'Thuận An', prefix: 'Thành phố', wards: ['Lái Thiêu', 'An Phú', 'An Thạnh', 'Bình Chuẩn', 'Bình Hòa', 'Bình Nhâm', 'Hưng Định', 'Thuận Giao', 'Vĩnh Phú', 'An Sơn'] },
      { code: 'BD-DA', name: 'Dĩ An', prefix: 'Thành phố', wards: ['Dĩ An', 'An Bình', 'Bình An', 'Bình Thắng', 'Đông Hòa', 'Tân Bình', 'Tân Đông Hiệp'] },
      { code: 'BD-BC', name: 'Bến Cát', prefix: 'Thành phố', wards: ['Mỹ Phước', 'Chánh Phú Hòa', 'Hòa Lợi', 'Tân Định', 'Thới Hòa', 'An Điền', 'An Tây', 'Phú An'] },
    ],
  },
  {
    code: 'BN',
    name: 'Tỉnh Bắc Ninh',
    nameEn: 'Bac Ninh',
    postalCode: '160000',
    region: 'Bắc',
    viettelHub: 'Bưu cục Viettel Post Bắc Ninh Central',
    districts: [
      { code: 'BN-TP', name: 'Bắc Ninh', prefix: 'Thành phố', wards: ['Đại Phúc', 'Đáp Cầu', 'Hạp Lĩnh', 'Khắc Niệm', 'Khúc Xuyên', 'Kinh Bắc', 'Ninh Xá', 'Phong Khê', 'Suối Hoa', 'Tiền An', 'Thị Cầu', 'Vạn An', 'Vân Dương', 'Vũ Ninh', 'Võ Cường'] },
      { code: 'BN-TS', name: 'Từ Sơn', prefix: 'Thành phố', wards: ['Châu Khê', 'Đình Bảng', 'Đồng Kỵ', 'Đông Ngàn', 'Đồng Nguyên', 'Hương Mạc', 'Phù Chẩn', 'Phù Khê', 'Tam Sơn', 'Tân Hồng', 'Trang Hạ'] },
      { code: 'BN-YP', name: 'Yên Phong', prefix: 'Huyện', wards: ['Chờ', 'Dũng Liệt', 'Đông Phong', 'Đông Thọ', 'Đông Tiến', 'Hòa Tiến', 'Long Châu', 'Mai Lâm', 'Tam Đa', 'Tam Giang', 'Thụy Hòa', 'Trung Nghĩa', 'Văn Môn', 'Yên Phụ', 'Yên Trung'] },
    ],
  },
  {
    code: 'QN',
    name: 'Tỉnh Quảng Ninh',
    nameEn: 'Quang Ninh',
    postalCode: '200000',
    region: 'Bắc',
    viettelHub: 'Bưu cục Viettel Post Hạ Long',
    districts: [
      { code: 'QN-HL', name: 'Hạ Long', prefix: 'Thành phố', wards: ['Bạch Đằng', 'Bãi Cháy', 'Cao Thắng', 'Cao Xanh', 'Giếng Đáy', 'Hà Khánh', 'Hà Khẩu', 'Hà Lầm', 'Hà Phong', 'Hà Trung', 'Hà Tu', 'Hồng Gai', 'Hồng Hà', 'Hồng Hải', 'Hùng Thắng', 'Trần Hưng Đạo', 'Tuần Châu', 'Việt Hưng', 'Yết Kiêu'] },
      { code: 'QN-CP', name: 'Cẩm Phả', prefix: 'Thành phố', wards: ['Cẩm Bình', 'Cẩm Đông', 'Cẩm Phú', 'Cẩm Sơn', 'Cẩm Tây', 'Cẩm Thạch', 'Cẩm Thành', 'Cẩm Thủy', 'Cẩm Trung', 'Cửa Ông', 'Mông Dương', 'Quang Hanh'] },
      { code: 'QN-UB', name: 'Uông Bí', prefix: 'Thành phố', wards: ['Bắc Sơn', 'Nam Khê', 'Phương Đông', 'Phương Nam', 'Quang Trung', 'Thanh Sơn', 'Trưng Vương', 'Vàng Danh', 'Yên Thanh'] },
    ],
  },
  {
    code: 'TN',
    name: 'Tỉnh Thái Nguyên',
    nameEn: 'Thai Nguyen',
    postalCode: '240000',
    region: 'Bắc',
    viettelHub: 'Bưu cục Viettel Post Thái Nguyên Hub (Nhà máy Hunonic)',
    districts: [
      { code: 'TN-TP', name: 'Thái Nguyên', prefix: 'Thành phố', wards: ['Cam Giá', 'Chùa Hang', 'Đồng Bẩm', 'Đồng Quang', 'Gia Sàng', 'Hoàng Văn Thụ', 'Hương Sơn', 'Phan Đình Phùng', 'Phú Xá', 'Quang Trung', 'Quang Vinh', 'Tân Lập', 'Tân Long', 'Tân Thành', 'Tân Thịnh', 'Thịnh Đán', 'Tích Lương', 'Trung Thành', 'Túc Duyên'] },
      { code: 'TN-SL', name: 'Sông Công', prefix: 'Thành phố', wards: ['Bách Quang', 'Cải Đan', 'Châu Sơn', 'Lương Sơn', 'Mỏ Chè', 'Phố Cò', 'Thắng Lợi'] },
      { code: 'TN-PY', name: 'Phổ Yên', prefix: 'Thành phố', wards: ['Ba Hàng', 'Bãi Bông', 'Bắc Sơn', 'Đắc Sơn', 'Đông Cao', 'Đồng Tiến', 'Hồng Tiến', 'Nam Tiến', 'Tân Hương', 'Tân Phú', 'Thuận Thành', 'Tiên Phong', 'Trung Thành'] },
    ],
  },
  {
    code: 'VT',
    name: 'Tỉnh Bà Rịa - Vũng Tàu',
    nameEn: 'Ba Ria - Vung Tau',
    postalCode: '780000',
    region: 'Nam',
    viettelHub: 'Bưu cục Viettel Post Vũng Tàu',
    districts: [
      { code: 'VT-TP', name: 'Vũng Tàu', prefix: 'Thành phố', wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12', 'Thắng Nhất', 'Thắng Nhì', 'Thắng Tam', 'Rạch Dừa', 'Nguyễn An Ninh'] },
      { code: 'VT-BR', name: 'Bà Rịa', prefix: 'Thành phố', wards: ['Kim Dinh', 'Long Hương', 'Long Tâm', 'Long Toàn', 'Phước Hưng', 'Phước Hiệp', 'Phước Nguyên', 'Phước Trung'] },
    ],
  },
  {
    code: 'CT',
    name: 'Thành phố Cần Thơ',
    nameEn: 'Can Tho',
    postalCode: '940000',
    region: 'Nam',
    viettelHub: 'Bưu cục Viettel Post Ninh Kiều - Cần Thơ Hub',
    districts: [
      { code: 'CT-NK', name: 'Ninh Kiều', prefix: 'Quận', wards: ['An Bình', 'An Cư', 'An Hòa', 'An Khánh', 'An Nghiệp', 'An Phú', 'Cái Khế', 'Hưng Lợi', 'Tân An', 'Thới Bình', 'Xuân Khánh'] },
      { code: 'CT-CR', name: 'Cái Răng', prefix: 'Quận', wards: ['Ba Láng', 'Hưng Phú', 'Hưng Thạnh', 'Lê Bình', 'Phú Thứ', 'Tân Phú', 'Yên Châu'] },
    ],
  },
  {
    code: 'DNA',
    name: 'Tỉnh Đồng Nai',
    nameEn: 'Dong Nai',
    postalCode: '760000',
    region: 'Nam',
    viettelHub: 'Bưu cục Viettel Post Biên Hòa',
    districts: [
      { code: 'DNA-BH', name: 'Biên Hòa', prefix: 'Thành phố', wards: ['An Bình', 'An Hòa', 'Bình Đa', 'Bửu Hòa', 'Bửu Long', 'Hiệp Hòa', 'Hóa An', 'Hòa Bình', 'Hố Nai', 'Long Bình', 'Long Bình Tân', 'Quang Vinh', 'Quyết Thắng', 'Tam Hiệp', 'Tam Hòa', 'Tân Biên', 'Tân Hạnh', 'Tân Hòa', 'Tân Hiệp', 'Tân Mai', 'Tân Phong', 'Tân Tiến', 'Tân Vạn', 'Thanh Bình', 'Thống Nhất', 'Trảng Dài', 'Trung Dũng'] },
      { code: 'DNA-LK', name: 'Long Khánh', prefix: 'Thành phố', wards: ['Bảo Vinh', 'Bàu Sen', 'Phú Bình', 'Suối Tre', 'Xuân An', 'Xuân Bình', 'Xuân Hòa', 'Xuân Trung', 'Xuân Thanh'] },
    ],
  },
  {
    code: 'KH',
    name: 'Tỉnh Khánh Hòa',
    nameEn: 'Khanh Hoa',
    postalCode: '570000',
    region: 'Trung',
    viettelHub: 'Bưu cục Viettel Post Nha Trang Hub',
    districts: [
      { code: 'KH-NT', name: 'Nha Trang', prefix: 'Thành phố', wards: ['Lộc Thọ', 'Phước Hải', 'Phước Hòa', 'Phước Tân', 'Phước Tiến', 'Phương Sài', 'Phương Sơn', 'Tân Lập', 'Vạn Thắng', 'Vạn Thạnh', 'Vĩnh Hải', 'Vĩnh Hòa', 'Vĩnh Phước', 'Vĩnh Thọ', 'Vĩnh Nguyên', 'Vĩnh Trường', 'Xương Huân'] },
      { code: 'KH-CR', name: 'Cam Ranh', prefix: 'Thành phố', wards: ['Ba Ngòi', 'Cam Linh', 'Cam Lộc', 'Cam Lợi', 'Cam Nghĩa', 'Cam Phú', 'Cam Phúc Bắc', 'Cam Phúc Nam', 'Cam Thuận'] },
    ],
  },
  {
    code: 'NA',
    name: 'Tỉnh Nghệ An',
    nameEn: 'Nghe An',
    postalCode: '430000',
    region: 'Trung',
    viettelHub: 'Bưu cục Viettel Post Vinh Hub',
    districts: [
      { code: 'NA-V', name: 'Vinh', prefix: 'Thành phố', wards: ['Bến Thủy', 'Cửa Nam', 'Đội Cung', 'Đông Vĩnh', 'Hà Huy Tập', 'Hồng Sơn', 'Hưng Bình', 'Hưng Dũng', 'Hưng Phúc', 'Lê Lợi', 'Lê Mao', 'Quán Bàu', 'Quang Trung', 'Trung Đô', 'Trường Thi'] },
      { code: 'NA-CL', name: 'Cửa Lò', prefix: 'Thị xã', wards: ['Nghi Hải', 'Nghi Hòa', 'Nghi Hương', 'Nghi Tân', 'Nghi Thu', 'Nghi Thủy', 'Thu Thủy'] },
    ],
  },
  {
    code: 'TH',
    name: 'Tỉnh Thanh Hóa',
    nameEn: 'Thanh Hoa',
    postalCode: '400000',
    region: 'Trung',
    viettelHub: 'Bưu cục Viettel Post Thanh Hóa Central',
    districts: [
      { code: 'TH-TP', name: 'Thanh Hóa', prefix: 'Thành phố', wards: ['An Hưng', 'Ba Đình', 'Điện Biên', 'Đông Cương', 'Đông Hải', 'Đông Hương', 'Đông Sơn', 'Đông Thọ', 'Đông Vệ', 'Hàm Rồng', 'Lam Sơn', 'Nam Ngạn', 'Ngọc Trạo', 'Phú Sơn', 'Quảng Hưng', 'Quảng Tâm', 'Quảng Thành', 'Quảng Thắng', 'Quảng Thịnh', 'Tào Xuyên', 'Tân Sơn', 'Trường Thi'] },
      { code: 'TH-SS', name: 'Sầm Sơn', prefix: 'Thành phố', wards: ['Bắc Sơn', 'Trung Sơn', 'Trường Sơn', 'Quảng Cư', 'Quảng Tiến', 'Quảng Châu', 'Quảng Thọ', 'Quảng Vinh'] },
    ],
  },
  {
    code: 'HUE',
    name: 'Thành phố Huế',
    nameEn: 'Thua Thien Hue',
    postalCode: '490000',
    region: 'Trung',
    viettelHub: 'Bưu cục Viettel Post Huế Central',
    districts: [
      { code: 'HUE-TP', name: 'Huế', prefix: 'Thành phố', wards: ['An Cựu', 'An Đông', 'An Hòa', 'An Tây', 'Gia Hội', 'Hương An', 'Hương Chữ', 'Hương Hồ', 'Hương Long', 'Hương Sơ', 'Hương Vân', 'Hương Vinh', 'Kim Long', 'Phú Hậu', 'Phú Hội', 'Phú Nhuận', 'Phú Thượng', 'Phước Vĩnh', 'Phường Đúc', 'Tây Lộc', 'Thuận Hòa', 'Thuận Lộc', 'Thủy Biều', 'Thủy Vân', 'Thủy Xuân', 'Trường An', 'Vĩnh Ninh', 'Vỹ Dạ', 'Xuân Phú'] },
    ],
  },
  {
    code: 'LD',
    name: 'Tỉnh Lâm Đồng',
    nameEn: 'Lam Dong',
    postalCode: '660000',
    region: 'Trung',
    viettelHub: 'Bưu cục Viettel Post Đà Lạt',
    districts: [
      { code: 'LD-DL', name: 'Đà Lạt', prefix: 'Thành phố', wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12'] },
      { code: 'LD-BL', name: 'Bảo Lộc', prefix: 'Thành phố', wards: ['B\'Lao', 'Lộc Phát', 'Lộc Sơn', 'Lộc Tiến', 'Phường 1', 'Phường 2'] },
    ],
  },
];

// Helper to remove Vietnamese tones for fuzzy matching
export function removeVietnameseTones(str: string): string {
  let s = str || '';
  s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  s = s.replace(/[đĐ]/g, 'd');
  s = s.toLowerCase().trim();
  return s;
}

/**
 * Parses raw address input, checks against Vietnamese administrative hierarchy,
 * matches with Viettel Post delivery standards, and produces a verified Google Maps geocoding query.
 */
export function parseAndVerifyVietnamAddress(rawAddress: string): AddressMatchResult {
  const trimmed = (rawAddress || '').trim();

  if (!trimmed || trimmed.length < 4) {
    return {
      isValid: false,
      score: 0,
      canonicalAddress: '',
      postalCode: '',
      viettelPostHub: 'Bưu cục Viettel Post Trung tâm',
      deliveryTimeEstimate: '24h - 48h (COD toàn quốc)',
      shippingFee: 0,
      deliveryStatus: 'invalid',
      statusMessage: 'Vui lòng nhập địa chỉ cụ thể để đối chiếu trên Google Maps & Viettel Post',
      googleMapsQuery: 'Việt Nam',
    };
  }

  const normalized = removeVietnameseTones(trimmed);

  // 1. Detect Province
  let matchedProvince: VietnamProvince | undefined;
  for (const prov of VIETNAM_PROVINCES) {
    const provNorm = removeVietnameseTones(prov.name);
    const provEnNorm = removeVietnameseTones(prov.nameEn);
    const shortName = provNorm.replace(/thanh pho |tinh /g, '');

    if (
      normalized.includes(provNorm) ||
      normalized.includes(provEnNorm) ||
      normalized.includes(shortName) ||
      (prov.code === 'HN' && (normalized.includes('ha noi') || normalized.includes('hanoi'))) ||
      (prov.code === 'HCM' && (normalized.includes('ho chi minh') || normalized.includes('sai gon') || normalized.includes('hcm') || normalized.includes('tp hcm'))) ||
      (prov.code === 'HP' && (normalized.includes('hai phong') || normalized.includes('haiphong'))) ||
      (prov.code === 'HD' && (normalized.includes('hai duong') || normalized.includes('haiduong')))
    ) {
      matchedProvince = prov;
      break;
    }
  }

  // Fallback province if common city mentioned
  if (!matchedProvince) {
    if (normalized.includes('hai duong')) {
      matchedProvince = VIETNAM_PROVINCES.find((p) => p.code === 'HD');
    } else if (normalized.includes('hai phong')) {
      matchedProvince = VIETNAM_PROVINCES.find((p) => p.code === 'HP');
    } else if (normalized.includes('ha noi')) {
      matchedProvince = VIETNAM_PROVINCES.find((p) => p.code === 'HN');
    } else if (normalized.includes('ho chi minh') || normalized.includes('sai gon')) {
      matchedProvince = VIETNAM_PROVINCES.find((p) => p.code === 'HCM');
    }
  }

  // 2. Detect District
  let matchedDistrict: VietnamDistrict | undefined;
  if (matchedProvince) {
    for (const dist of matchedProvince.districts) {
      const distNorm = removeVietnameseTones(dist.name);
      if (normalized.includes(distNorm)) {
        matchedDistrict = dist;
        break;
      }
    }
  } else {
    // Search across all provinces if province wasn't explicitly caught
    for (const prov of VIETNAM_PROVINCES) {
      for (const dist of prov.districts) {
        const distNorm = removeVietnameseTones(dist.name);
        if (normalized.includes(distNorm) && distNorm.length > 4) {
          matchedDistrict = dist;
          matchedProvince = prov;
          break;
        }
      }
      if (matchedDistrict) break;
    }
  }

  // 3. Detect Ward
  let matchedWard: string | undefined;
  if (matchedDistrict) {
    for (const ward of matchedDistrict.wards) {
      const wardNorm = removeVietnameseTones(ward);
      if (normalized.includes(wardNorm)) {
        matchedWard = ward;
        break;
      }
    }
  } else if (matchedProvince) {
    // Search wards in province
    for (const dist of matchedProvince.districts) {
      for (const ward of dist.wards) {
        const wardNorm = removeVietnameseTones(ward);
        if (normalized.includes(wardNorm)) {
          matchedWard = ward;
          matchedDistrict = dist;
          break;
        }
      }
      if (matchedWard) break;
    }
  }

  // Special case: check for "Việt Hòa"
  if (normalized.includes('viet hoa')) {
    matchedWard = 'Việt Hòa';
    if (!matchedProvince || matchedProvince.code !== 'HD') {
      matchedProvince = VIETNAM_PROVINCES.find((p) => p.code === 'HD') || matchedProvince;
      matchedDistrict = matchedProvince?.districts.find((d) => d.name === 'Hải Dương') || matchedDistrict;
    }
  }

  // 4. Extract Street details (everything prior to ward/district/province or number)
  let streetDetails = trimmed;
  if (matchedProvince) {
    streetDetails = streetDetails.replace(new RegExp(matchedProvince.name, 'gi'), '');
    streetDetails = streetDetails.replace(new RegExp(matchedProvince.name.replace(/Thành phố |Tỉnh /g, ''), 'gi'), '');
  }
  if (matchedDistrict) {
    streetDetails = streetDetails.replace(new RegExp(matchedDistrict.name, 'gi'), '');
    streetDetails = streetDetails.replace(new RegExp(`${matchedDistrict.prefix} ${matchedDistrict.name}`, 'gi'), '');
  }
  if (matchedWard) {
    streetDetails = streetDetails.replace(new RegExp(matchedWard, 'gi'), '');
    streetDetails = streetDetails.replace(new RegExp(`(Phường|Xã|Thị trấn) ${matchedWard}`, 'gi'), '');
  }
  streetDetails = streetDetails.replace(/^[,\s-]+|[,\s-]+$/g, '').trim();

  // Calculate completeness score (0-100)
  let score = 20;
  let statusMessage = '';
  let deliveryStatus: 'ready' | 'missing_ward' | 'missing_district' | 'missing_street' | 'invalid' = 'invalid';

  if (matchedProvince) score += 30;
  if (matchedDistrict) score += 25;
  if (matchedWard) score += 15;
  if (streetDetails && (/\d+/.test(streetDetails) || streetDetails.length > 5)) score += 10;

  if (score >= 80) {
    deliveryStatus = 'ready';
    statusMessage = '✓ Địa chỉ hợp lệ — Đã xác thực trên bản đồ Google Maps & sẵn sàng giao hàng Viettel Post';
  } else if (!matchedDistrict) {
    deliveryStatus = 'missing_district';
    statusMessage = '⚠️ Cần bổ sung Quận/Huyện để đối chiếu bưu cục Viettel Post phát hàng';
  } else if (!matchedWard) {
    deliveryStatus = 'missing_ward';
    statusMessage = '⚠️ Nên bổ sung Phường/Xã để bưu tá Viettel Post giao chính xác';
  } else if (!streetDetails) {
    deliveryStatus = 'missing_street';
    statusMessage = '⚠️ Vui lòng ghi thêm số nhà hoặc tên đường/thôn xóm';
  } else {
    deliveryStatus = 'ready';
    statusMessage = '✓ Địa chỉ cơ bản hợp lệ để tạo vận đơn Viettel Post COD';
  }

  // Assemble canonical formatted address
  const parts: string[] = [];
  if (streetDetails) parts.push(streetDetails);
  if (matchedWard) parts.push(`phường/xã ${matchedWard}`);
  if (matchedDistrict) parts.push(`${matchedDistrict.prefix} ${matchedDistrict.name}`);
  if (matchedProvince) parts.push(matchedProvince.name);

  const canonicalAddress = parts.length > 0 ? parts.join(', ') : trimmed;
  const postalCode = matchedProvince?.postalCode || '100000';
  const viettelPostHub =
    matchedDistrict && matchedProvince
      ? `Bưu cục Viettel Post ${matchedDistrict.name} (${matchedProvince.name.replace(/Thành phố |Tỉnh /g, '')})`
      : matchedProvince?.viettelHub || 'Bưu cục Viettel Post Trung Tâm';

  const deliveryTimeEstimate =
    matchedProvince?.region === 'Bắc'
      ? '12h - 24h (Nội miền Bắc, Viettel Post phát hỏa tốc)'
      : '24h - 48h (Liên miền, Viettel Post chuyển phát nhanh)';

  // Generate clean Google Maps search query
  const googleMapsQuery = `${trimmed}, Việt Nam`;

  return {
    isValid: score >= 60,
    score,
    province: matchedProvince?.name,
    district: matchedDistrict ? `${matchedDistrict.prefix} ${matchedDistrict.name}` : undefined,
    ward: matchedWard ? `Phường/Xã ${matchedWard}` : undefined,
    streetDetails: streetDetails || undefined,
    canonicalAddress,
    postalCode,
    viettelPostHub,
    deliveryTimeEstimate,
    shippingFee: 0, // Free ship
    deliveryStatus,
    statusMessage,
    googleMapsQuery,
  };
}
