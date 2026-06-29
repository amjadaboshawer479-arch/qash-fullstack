"use client";
import { useState, useTransition, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { updateCartItemAction, removeCartItemAction, clearCartAction } from "@/actions/cart.actions";
import { useCartStore } from "@/stores/cart.store";
import type { Cart, CartItem } from "@/types";

interface Props {
  initialCart: Cart | null;
  messages: Record<string, Record<string, string>>;
  locale: string;
  currency: string;
}

export default function CartPageClient({ initialCart, messages, locale, currency }: Props) {
  const [cart, setCart] = useState<Cart | null>(initialCart);
  const [isPending, startTransition] = useTransition();
  const [coupon, setCoupon] = useState("");
  const { setItemCount, clearCart } = useCartStore();
  const isRTL = locale === "ar";

  function updateCount(c: Cart | null) {
    const count = c?.items?.reduce((s, i) => s + i.quantity, 0) || 0;
    setItemCount(count);
  }

  // Sync cart count with server on mount
  useEffect(() => {
    const count = initialCart?.items?.reduce((s, i) => s + i.quantity, 0) || 0;
    setItemCount(count);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleUpdate(item: CartItem, delta: number) {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    startTransition(async () => {
      const r = await updateCartItemAction(item.id, newQty);
      if (r.error) { toast.error(r.error); return; }
      if (r.cart) { setCart(r.cart); updateCount(r.cart); }
    });
  }

  function handleRemove(itemId: number) {
    startTransition(async () => {
      const r = await removeCartItemAction(itemId);
      if (r.error) { toast.error(r.error); return; }
      if (r.cart) { setCart(r.cart); updateCount(r.cart); toast.success("Item removed"); }
    });
  }

  function handleClear() {
    startTransition(async () => {
      const r = await clearCartAction();
      if (r.error) { toast.error(r.error); return; }
      setCart(null);
      clearCart();
      toast.success("Cart cleared");
    });
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div style={{ backgroundColor: "var(--bg)" }} className="min-h-screen px-8 py-16 flex flex-col items-center justify-center">
        <ShoppingBag size={64} className="text-[#D5C9BC] mb-6" />
        <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-2" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>
          {locale === "ar" ? "سلتك فارغة" : "Your cart is empty"}
        </h2>
        <p className="text-[#313131]/60 text-sm mb-8">
          {locale === "ar" ? "أضف بعض المنتجات للبدء" : "Add some products to get started"}
        </p>
        <Link
          href="/products"
          className="text-white text-sm font-medium px-8 py-3 rounded-full transition-colors"
          style={{ backgroundColor: "#88B0BE" }}
        >
          {locale === "ar" ? "تصفح المنتجات" : "Browse Products"}
        </Link>
      </div>
    );
  }

  const subtotal = parseFloat(cart.total_amount || "0");

  return (
    <div style={{ backgroundColor: "var(--bg)" }} className="min-h-screen">
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Title — SVG shows "Yoqart" calligraphy text (using product name style) */}
        <div className="flex items-center justify-between mb-8">
          <h1
            className="text-3xl font-semibold text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            {locale === "ar" ? "سلة التسوق" : "Shopping Cart"}
          </h1>
          <button
            onClick={handleClear}
            disabled={isPending}
            className="text-xs text-[#313131]/50 hover:text-red-500 transition-colors"
          >
            Clear all
          </button>
        </div>

        {/* SVG layout: items on left (up to x=836), summary on right */}
        <div className="flex gap-8">
          {/* LEFT: Cart Items */}
          <div className="flex-1">
            {/* Divider line below header — SVG has horizontal lines at y=416,563,710 */}
            <div className="border-b border-[#E8DED4]" />
            
            {cart.items.map((item: CartItem, idx: number) => {
              const name = locale === "ar" && (item.product as any)?.name_ar
                ? (item.product as any).name_ar
                : item.product?.name || "Product";
              const price = item.unit_price || item.product?.discount_price || item.product?.base_price || "0";
              // SVG product thumbnails at x=106, 105×105
              const thumb = item.product?.thumbnail;

              return (
                <div key={item.id}>
                  <div className="flex gap-5 py-5">
                    {/* Thumbnail — SVG: 105×105 */}
                    <div className="relative shrink-0 bg-[#F4F1EA]" style={{ width: "clamp(80px,10vw,105px)", height: "clamp(80px,10vw,105px)" }}>
                      {thumb ? (
                        <Image src={thumb} alt={name} fill className="object-cover" sizes="105px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag size={24} className="text-[#D5C9BC]" />
                        </div>
                      )}
                    </div>

                    {/* Item info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3
                          className="text-[#313131] font-medium text-sm leading-tight"
                          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                        >
                          {name}
                        </h3>
                        <button
                          onClick={() => handleRemove(item.id)}
                          disabled={isPending}
                          className="text-[#313131]/40 hover:text-red-500 transition-colors ml-2 shrink-0"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {item.variation && (
                        <p className="text-xs text-[#313131]/50 mb-1">
                          {item.variation.attribute?.name}: {locale === "ar" && (item.variation as any).value_ar ? (item.variation as any).value_ar : item.variation.value}
                        </p>
                      )}

                      <p className="text-[#D88F65] font-semibold text-sm mb-3">
                        {currency} {parseFloat(price).toFixed(2)}
                      </p>

                      {/* Quantity — SVG: circles with +/- at cx=529,599 r=15 fill=#D9D9D9 */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleUpdate(item, -1)}
                          disabled={isPending || item.quantity <= 1}
                          className="w-[30px] h-[30px] rounded-full flex items-center justify-center font-medium text-[#313131] disabled:opacity-30 transition-opacity"
                          style={{ backgroundColor: "#D9D9D9" }}
                        >
                          −
                        </button>
                        <span className="text-[#313131] font-medium text-sm w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdate(item, 1)}
                          disabled={isPending}
                          className="w-[30px] h-[30px] rounded-full flex items-center justify-center font-medium text-[#313131] transition-opacity"
                          style={{ backgroundColor: "#D9D9D9" }}
                        >
                          +
                        </button>
                        <span className="text-[#313131]/50 text-xs ml-2">
                          Total: {currency} {(parseFloat(price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="border-b border-[#E8DED4] opacity-40" />
                </div>
              );
            })}
          </div>

          {/* SVG: vertical divider at x=836 */}
          <div className="w-px bg-[#313131]/20 self-stretch hidden lg:block" />

          {/* RIGHT: Order Summary — SVG right panel starts at x=862 */}
          <div className="hidden lg:block shrink-0" style={{ width: "min(357px, 100%)" }}>
            <h2
              className="text-xl font-semibold text-[#1A1A1A] mb-6"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              {locale === "ar" ? "ملخص الطلب" : "Order Summary"}
            </h2>

            {/* SVG: lines at y=345 and y=525 (dividers in summary) */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-[#313131]/70">{locale === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
                <span className="text-[#313131] font-medium">{currency} {subtotal.toFixed(2)}</span>
              </div>
              <div className="border-t border-[#E8DED4] pt-3 flex justify-between text-sm">
                <span className="text-[#313131]/70">{locale === "ar" ? "الشحن" : "Shipping"}</span>
                <span className="text-[#313131]/60 text-xs">{locale === "ar" ? "يحسب عند الدفع" : "Calculated at checkout"}</span>
              </div>
              <div className="border-t border-[#E8DED4] pt-3 flex justify-between">
                <span className="text-[#1A1A1A] font-semibold">{locale === "ar" ? "المجموع" : "Total"}</span>
                <span className="text-[#D88F65] font-bold text-lg">{currency} {subtotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Coupon input — SVG: rect x=864 y=611 w=355 h=44 rx=12 fill=#EEEEEE */}
            <div className="mb-4">
              <div
                className="flex items-center px-4"
                style={{ backgroundColor: "#EEEEEE", borderRadius: 12, height: 44 }}
              >
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder={locale === "ar" ? "كود الخصم" : "Coupon code"}
                  className="flex-1 bg-transparent text-sm text-[#313131] outline-none placeholder-[#313131]/40"
                />
                {coupon && (
                  <button
                    className="text-[#D88F65] text-xs font-medium ml-2"
                    onClick={() => toast.info("Enter coupon at checkout")}
                  >
                    Apply
                  </button>
                )}
              </div>
            </div>

            {/* Checkout button — SVG: x=862 y=677 w=357 h=56 rx=28 fill=#88B0BE */}
            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 text-white font-medium text-sm tracking-wide w-full transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#88B0BE", borderRadius: 28, height: 56 }}
            >
              {locale === "ar" ? "إتمام الشراء" : "Proceed to Checkout"}
            </Link>

            <Link
              href="/products"
              className="block text-center text-[#313131]/50 text-xs mt-4 hover:text-[#D88F65] transition-colors"
            >
              {locale === "ar" ? "مواصلة التسوق" : "Continue Shopping"}
            </Link>
          </div>
        </div>

        {/* Mobile summary */}
        <div className="lg:hidden mt-8 p-6 rounded-2xl" style={{ backgroundColor: "#F4F1EA" }}>
          <div className="flex justify-between mb-3">
            <span className="font-semibold text-[#1A1A1A]">Total</span>
            <span className="font-bold text-[#D88F65] text-lg">{currency} {subtotal.toFixed(2)}</span>
          </div>
          <Link
            href="/checkout"
            className="flex items-center justify-center gap-2 text-white font-medium text-sm w-full py-4 rounded-full"
            style={{ backgroundColor: "#88B0BE" }}
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
