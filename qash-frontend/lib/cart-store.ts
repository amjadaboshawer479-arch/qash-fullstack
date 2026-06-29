// Shared in-memory cart store — persists within Next.js server process
// All cart API routes import from here

export type CartItem = {
  id: number;
  product: Record<string, unknown>;
  variation: null;
  combination: null;
  quantity: number;
  unit_price: string;
  total_price: string;
};

export type CartData = {
  id: string;
  user: null;
  cart_token: string;
  is_active: boolean;
  items: CartItem[];
  total_amount: string;
  currency_info: { code: string; symbol: string; exchange_rate: string };
  created_at: string;
  updated_at: string;
};

// Use globalThis to persist across Next.js hot reloads
const g = globalThis as unknown as { __qashCartStore?: Map<string, CartData> };
if (!g.__qashCartStore) g.__qashCartStore = new Map<string, CartData>();
export const CART_STORE = g.__qashCartStore;

export function getCart(key: string): CartData {
  if (!CART_STORE.has(key)) {
    CART_STORE.set(key, {
      id: "cart-001", user: null, cart_token: key, is_active: true,
      items: [], total_amount: "0.00",
      currency_info: { code: "JOD", symbol: "JD", exchange_rate: "1.000" },
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    });
  }
  return CART_STORE.get(key)!;
}

export function saveCart(key: string, cart: CartData): CartData {
  const total = cart.items.reduce((s, i) => s + parseFloat(i.total_price), 0);
  cart.total_amount = total.toFixed(2);
  cart.updated_at = new Date().toISOString();
  CART_STORE.set(key, cart);
  return cart;
}

export function cartKey(req: Request): string {
  return (req as unknown as { headers: Headers }).headers.get("X-Cart-Token") || "default";
}
