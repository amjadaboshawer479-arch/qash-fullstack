// ─── Auth & User ────────────────────────────────────────────────────────────
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  address: string | null;
  date_of_birth: string | null;
  avatar: string | null;
  is_active: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  tokens: AuthTokens;
}

// ─── Pagination ──────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ─── Categories ──────────────────────────────────────────────────────────────
export interface Category {
  id: number;
  name: string;
  name_ar: string;
  slug: string;
  image: string | null;
  featured?: boolean;
  parent: number | null;
  children?: Pick<Category, "id" | "name" | "name_ar" | "slug">[];
  product_count?: number;
}

// ─── Products ────────────────────────────────────────────────────────────────
export interface ProductAttribute {
  id: number;
  name: string;
  name_ar: string;
}

export interface FilterValue {
  id: number;
  value: string;
  value_ar: string;
}

export interface ProductFilter {
  id: number;
  name: string;
  name_ar: string;
  values: FilterValue[];
}

export interface ProductVariation {
  id: number;
  attribute: ProductAttribute;
  value: string;
  value_ar: string;
  stock: number;
}

export interface ProductCombinationAttribute {
  attribute: ProductAttribute;
  value: string;
  value_ar: string;
}

export interface ProductCombination {
  id: number;
  label?: string;
  attributes: ProductCombinationAttribute[];
  stock: number;
}

export interface ProductGalleryItem {
  id: number;
  image: string | null;
  video: string | null;
  order: number;
}

export interface CurrencyInfo {
  code: string;
  symbol: string;
  exchange_rate: string;
}

export interface Product {
  id: number;
  name: string;
  name_ar: string;
  slug: string;
  thumbnail: string | null;
  description: string;
  description_ar: string;
  base_price: string;
  discount_price: string | null;
  has_discount: boolean;
  is_available: boolean;
  best_seller: boolean;
  /** inventory_mode: "simple" | "variation" | "combination" */
  inventory_mode: string;
  product_stock: number;
  categories: Pick<Category, "id" | "name" | "slug">[];
  brand: string | null;
  gallery: ProductGalleryItem[];
  available_variations: ProductVariation[];
  available_combinations: ProductCombination[];
  currency_info: CurrencyInfo;
  created_at: string;
  updated_at: string;
}

export interface ProductListItem {
  id: number;
  name: string;
  name_ar?: string;
  slug: string;
  thumbnail: string | null;
  base_price: string;
  discount_price: string | null;
  has_discount: boolean;
  best_seller?: boolean;
  is_available?: boolean;
}

export interface ProductFilters {
  search?: string;
  categories?: string;
  category_slug?: string;
  best_seller?: string;
  price_min?: string;
  price_max?: string;
  filter_values?: string;
  ordering?: string;
  page?: string;
  page_size?: string;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
// API spec: GET /cart/my-cart/ returns:
// { id, user, cart_token, is_active, items[], total_amount, currency_info, created_at, updated_at }
export interface CartItemVariation {
  id: number;
  attribute: ProductAttribute;
  value: string;
  value_ar?: string;
  stock: number;
}

export interface CartItem {
  id: number;
  product: ProductListItem;
  variation: CartItemVariation | null;
  combination: { id: number; attributes: ProductCombinationAttribute[] } | null;
  quantity: number;
  unit_price: string;
  total_price: string;
}

export interface Cart {
  id: string | number;
  user: number | null;
  cart_token: string;
  is_active: boolean;
  items: CartItem[];
  total_amount: string;
  currency_info: CurrencyInfo;
  created_at: string;
  updated_at: string;
}

export interface AddToCartPayload {
  product_id: number;
  quantity: number;
  variation_id?: number;
  combination_id?: number;
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────
// API spec: GET /wishlist/ returns array (not paginated)
// POST /wishlist/add-product/ { product_id }
// POST /wishlist/remove-product/ { product_id }
export interface WishlistItem {
  id: number;
  product: ProductListItem;
  added_at: string;
}

// ─── Orders ───────────────────────────────────────────────────────────────────
export type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type PaymentStatus = "UNPAID" | "PAID" | "FAILED";

export interface ShippingAddress {
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface ShippingOption {
  id: number;
  name: string;
  name_ar: string;
  price: string;
  estimated_days: number;
  is_active: boolean;
}

export interface OrderItem {
  id: number;
  product: ProductListItem;
  variation: { attribute: string; value: string } | null;
  combination: { id: number; attributes: ProductCombinationAttribute[] } | null;
  quantity: number;
  unit_price: string;
  total_price: string;
}

export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string;
  items: OrderItem[];
  shipping_address: ShippingAddress;
  shipping_option: ShippingOption;
  coupon_code: string | null;
  discount_amount: string;
  subtotal: string;
  shipping_cost: string;
  total_amount: string;
  notes: string;
  guest_email: string | null;
  created_at: string;
  updated_at: string;
}

export interface CheckoutPayload {
  shipping_address: ShippingAddress;
  shipping_option: number;
  payment_method: "CASH_ON_DELIVERY";
  notes?: string;
  coupon_code?: string;
  guest_email?: string;
}

export interface CheckoutResponse {
  id: number;
  order_number: string;
  status: OrderStatus;
  total_amount: string;
  discount_amount: string;
  created_at: string;
}

// ─── Logistics ────────────────────────────────────────────────────────────────
export interface Country {
  code: string;
  name: string;
  name_ar: string;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  exchange_rate: string;
}

// ─── CMS ──────────────────────────────────────────────────────────────────────
export interface Swiper {
  id: number;
  title: string;
  title_ar: string;
  subtitle: string;
  subtitle_ar: string;
  image: string;
  link: string;
  is_active: boolean;
  order: number;
}

export interface CMSSection {
  id: number;
  title: string;
  title_ar: string;
  products: ProductListItem[];
  is_active: boolean;
  order: number;
}

export interface OfferSection {
  id: number;
  title: string;
  title_ar: string;
  image: string;
  link: string;
  is_active: boolean;
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
export interface TestimonialUser {
  id: number;
  username: string;
  avatar: string | null;
}

export interface Testimonial {
  id: number;
  user: TestimonialUser;
  title: string;
  content: string;
  rating: number;
  is_approved: boolean;
  created_at: string;
}

// ─── Coupon ───────────────────────────────────────────────────────────────────
export interface CouponValidation {
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: string;
  discount_amount: string;
  minimum_order_amount: string;
  valid_until: string;
}

// ─── API Response ─────────────────────────────────────────────────────────────
export type ApiResult<T> =
  | { data: T; error: null }
  | { data: null; error: Record<string, string[]> | string };
