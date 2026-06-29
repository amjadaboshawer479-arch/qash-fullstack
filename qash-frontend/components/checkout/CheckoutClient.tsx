"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MapPin, Truck, CreditCard, Tag, FileText, ChevronRight } from "lucide-react";
import { checkoutAction } from "@/actions/order.actions";
import { useCartStore } from "@/stores/cart.store";
import type { Cart, ShippingOption, Country, CartItem, CheckoutPayload } from "@/types";
import Image from "next/image";

interface Props {
  cart: Cart;
  shippingOptions: ShippingOption[];
  countries: Country[];
  messages: Record<string, Record<string, string>>;
  locale: string;
  currency: string;
  isAuthenticated?: boolean;
}

export default function CheckoutClient({ cart, shippingOptions, countries, messages, locale, currency, isAuthenticated = false }: Props) {
  const t = (key: string) => {
    const [ns, k] = key.split(".");
    return messages[ns]?.[k] ?? k;
  };

  const router = useRouter();
  const { clearCart } = useCartStore();
  const [isPending, startTransition] = useTransition();
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState<number | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<number | null>(
    shippingOptions[0]?.id ?? null
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isRTL = locale === "ar";

  const subtotal = parseFloat(cart.total_amount ?? "0");
  const shippingCost = shippingOptions.find((s) => s.id === selectedShipping)?.price ?? 0;
  const discount = couponDiscount ?? 0;
  const total = subtotal + parseFloat(String(shippingCost)) - discount;

  const handleCouponApply = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await fetch("/api/promotions/coupons/validate/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal: subtotal.toFixed(2) }),
      });
      const data = await res.json();
      if (data.discount_amount) {
        setCouponDiscount(parseFloat(data.discount_amount));
        toast.success(t("checkout.couponApplied"));
      } else {
        setCouponError(t("checkout.invalidCoupon"));
      }
    } catch {
      setCouponError(t("common.error"));
    } finally {
      setCouponLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload: CheckoutPayload = {
      shipping_address: {
        full_name: formData.get("full_name") as string,
        phone: formData.get("phone") as string,
        address_line: formData.get("address_line") as string,
        city: formData.get("city") as string,
        state: (formData.get("state") as string) || "",
        postal_code: (formData.get("postal_code") as string) || "",
        country: formData.get("country") as string,
      },
      shipping_option: Number(formData.get("shipping_option")) || selectedShipping || 0,
      payment_method: "CASH_ON_DELIVERY",
      notes: (formData.get("notes") as string) || undefined,
      coupon_code: couponCode || undefined,
      guest_email: !isAuthenticated ? ((formData.get("guest_email") as string) || undefined) : undefined,
    };

    startTransition(async () => {
      const result = await checkoutAction(payload);
      if (result.errors) {
        const flatErrors: Record<string, string> = {};
        for (const [k, msgs] of Object.entries(result.errors)) {
          flatErrors[k] = msgs[0] ?? "";
        }
        setErrors(flatErrors);
        toast.error(t("checkout.validationError"));
        return;
      }
      clearCart();
      const orderId = result.order?.id;
      router.push(`/checkout/success?order_id=${orderId}&total=${total.toFixed(2)}`);
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12" dir={isRTL ? "rtl" : "ltr"}>
      <h1 className="text-3xl font-bold text-[#1A1A1A]  font-serif mb-8">
        {t("checkout.title")}
      </h1>

      <form onSubmit={handleSubmit}>
        <input type="hidden" name="shipping_option" value={selectedShipping ?? ""} />
        <input type="hidden" name="payment_method" value="CASH_ON_DELIVERY" />
        {couponCode && couponDiscount && (
          <input type="hidden" name="coupon_code" value={couponCode} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <SectionCard icon={<MapPin className="w-5 h-5" />} title={t("checkout.shippingAddress")}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label={t("checkout.fullName")} name="full_name" error={errors.full_name} required />
                <FormField label={t("checkout.phone")} name="phone" type="tel" error={errors.phone} required />
                <div className="sm:col-span-2">
                  <FormField label={t("checkout.address")} name="address_line" error={errors.address_line} required />
                </div>
                <FormField label={t("checkout.city")} name="city" error={errors.city} required />
                <FormField label={t("checkout.state")} name="state" error={errors.state} />
                <FormField label={t("checkout.postalCode")} name="postal_code" error={errors.postal_code} />
                <div>
                  <label className="block text-sm font-medium text-[#313131]  mb-1">
                    {t("checkout.country")} *
                  </label>
                  <select
                    name="country"
                    required
                    className="w-full border border-[#D5C9BC]  rounded-lg px-3 py-2.5 bg-white  text-[#1A1A1A]  focus:ring-2 focus:ring-[#D88F65] focus:border-transparent outline-none"
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {locale === "ar" ? c.name_ar || c.name : c.name}
                      </option>
                    ))}
                  </select>
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                </div>
              </div>
            </SectionCard>

            {/* Shipping Option */}
            <SectionCard icon={<Truck className="w-5 h-5" />} title={t("checkout.shippingOption")}>
              <div className="space-y-3">
                {shippingOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                      selectedShipping === option.id
                        ? "border-[#D88F65] bg-orange-50 dark:bg-orange-900/10"
                        : "border-[#E8DED4]  hover:border-[#D5C9BC]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping_option_radio"
                        checked={selectedShipping === option.id}
                        onChange={() => setSelectedShipping(option.id)}
                        className="text-[#D88F65]"
                      />
                      <div>
                        <p className="font-medium text-[#1A1A1A] ">
                          {locale === "ar" ? option.name_ar || option.name : option.name}
                        </p>
                        <p className="text-sm text-[#313131]/60 ">
                          {option.estimated_days} {t("checkout.days")}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-[#D88F65]">
                      {currency} {parseFloat(String(option.price)).toFixed(2)}
                    </span>
                  </label>
                ))}
              </div>
            </SectionCard>

            {/* Payment Method */}
            <SectionCard icon={<CreditCard className="w-5 h-5" />} title={t("checkout.paymentMethod")}>
              <label className="flex items-center gap-3 p-4 border-2 border-[#D88F65] bg-orange-50 dark:bg-orange-900/10 rounded-xl">
                <input type="radio" checked readOnly className="text-[#D88F65]" />
                <div>
                  <p className="font-medium text-[#1A1A1A] ">{t("checkout.cashOnDelivery")}</p>
                  <p className="text-sm text-[#313131]/60 ">{t("checkout.cashOnDeliveryDesc")}</p>
                </div>
              </label>
            </SectionCard>

            {/* Coupon */}
            <SectionCard icon={<Tag className="w-5 h-5" />} title={t("checkout.couponCode")}>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder={t("checkout.enterCoupon")}
                  className="flex-1 border border-[#D5C9BC]  rounded-lg px-3 py-2.5 bg-white  text-[#1A1A1A]  focus:ring-2 focus:ring-[#D88F65] outline-none"
                />
                <button
                  type="button"
                  onClick={handleCouponApply}
                  disabled={couponLoading}
                  className="bg-[#D88F65] hover:bg-[#c47d53] text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {couponLoading ? "..." : t("checkout.apply")}
                </button>
              </div>
              {couponError && <p className="text-red-500 text-sm mt-2">{couponError}</p>}
              {couponDiscount && (
                <p className="text-green-600 text-sm mt-2">
                  {t("checkout.discountApplied")}: -{currency} {couponDiscount.toFixed(2)}
                </p>
              )}
            </SectionCard>

            {/* Guest Email — only for unauthenticated users */}
            {!isAuthenticated && (
              <SectionCard icon={<CreditCard className="w-5 h-5" />} title={t("checkout.guest_email") || "Guest Email"}>
                <FormField
                  label={t("checkout.guest_email") || "Email Address"}
                  name="guest_email"
                  type="email"
                  error={errors["guest_email"]}
                  required
                />
              </SectionCard>
            )}

            {/* Notes */}
            <SectionCard icon={<FileText className="w-5 h-5" />} title={t("checkout.orderNotes")}>
              <textarea
                name="notes"
                rows={3}
                placeholder={t("checkout.notesPlaceholder")}
                className="w-full border border-[#D5C9BC]  rounded-lg px-3 py-2.5 bg-white  text-[#1A1A1A]  focus:ring-2 focus:ring-[#D88F65] outline-none resize-none"
              />
            </SectionCard>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white  rounded-2xl p-6 shadow-sm border border-[#E8DED4]  sticky top-24">
              <h2 className="text-xl font-semibold text-[#1A1A1A]  mb-4">
                {t("checkout.orderSummary")}
              </h2>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.items.map((item: CartItem) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-14 h-14 flex-shrink-0">
                      <Image
                        src={item.product?.thumbnail || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"}
                        alt={item.product?.name || ""}
                        fill
                        className="object-cover rounded-lg"
                      />
                      <span className="absolute -top-1 -right-1 bg-[#D88F65] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1A1A1A]  truncate">
                        {locale === "ar" ? item.product?.name_ar || item.product?.name : item.product?.name}
                      </p>
                      <p className="text-sm text-[#313131]/60">
                        {currency} {(parseFloat(item.product?.discount_price || item.product?.base_price || "0") * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#E8DED4]  pt-4 space-y-2">
                <div className="flex justify-between text-[#313131]/70  text-sm">
                  <span>{t("cart.subtotal")}</span>
                  <span>{currency} {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#313131]/70  text-sm">
                  <span>{t("checkout.shipping")}</span>
                  <span>{currency} {parseFloat(String(shippingCost)).toFixed(2)}</span>
                </div>
                {couponDiscount && (
                  <div className="flex justify-between text-green-600 text-sm">
                    <span>{t("checkout.discount")}</span>
                    <span>-{currency} {discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-[#1A1A1A]  pt-2 border-t border-[#E8DED4] ">
                  <span>{t("cart.total")}</span>
                  <span className="text-[#D88F65]">{currency} {total.toFixed(2)}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full mt-6 flex items-center justify-center gap-2 bg-[#D88F65] hover:bg-[#c47d53] disabled:opacity-50 text-white py-3.5 rounded-full font-semibold transition-colors"
              >
                {isPending ? t("common.loading") : t("checkout.placeOrder")}
                {!isPending && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function SectionCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white  rounded-2xl p-6 shadow-sm border border-[#E8DED4] ">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-[#D88F65]">{icon}</span>
        <h2 className="text-lg font-semibold text-[#1A1A1A] ">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function FormField({
  label,
  name,
  type = "text",
  error,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#313131]  mb-1">
        {label} {required && "*"}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full border border-[#D5C9BC]  rounded-lg px-3 py-2.5 bg-white  text-[#1A1A1A]  focus:ring-2 focus:ring-[#D88F65] focus:border-transparent outline-none transition-shadow"
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
