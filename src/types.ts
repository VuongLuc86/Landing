export type ProductShape = 'rectangular' | 'square';
export type ProductColor = 'champagne' | 'black';

export interface ProductSpecItem {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug?: string;
  tag?: string;
  badge?: string;
  tagColor?: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  warranty?: string;
  promotionNote?: string;
  shortDesc: string;
  imageUrl: string;
  specs: string[];
  detailedSpecs?: ProductSpecItem[];
  features: string[];
  options?: {
    gangs?: number[];
    shapes?: { id: ProductShape; name: string; dimension: string }[];
    colors?: { id: ProductColor; name: string; hex: string }[];
  };
}

export interface ComboPackage {
  id: string;
  name: string;
  subtitle: string;
  tag?: string;
  isPopular?: boolean;
  originalPrice: number;
  price: number;
  discountText: string;
  highlightBenefit: string;
  items: string[];
}

export interface ComparisonRow {
  criteria: string;
  hunonicValue: string;
  hunonicStatus: 'success' | 'highlight' | 'neutral';
  competitorValue: string;
  competitorStatus: 'warning' | 'error' | 'neutral';
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  avatarLetter: string;
  avatarBg: string;
  location: string;
  purchasedItems: string;
  quote: string;
  rating: number;
  verified: boolean;
}

export interface OrderFormData {
  fullName: string;
  phoneNumber: string;
  deliveryAddress: string;
  bundleId: string;
  shapePreference: ProductShape;
  notes: string;
}

export interface RecentOrderToastItem {
  name: string;
  location: string;
  packageName: string;
  timeAgo: string;
}

export interface CsvOrderItem {
  stt: number;
  fullName: string;
  phone: string;
  address: string;
  productName: string;
  orderDate: string;
  amount: number;
  note: string;
}
