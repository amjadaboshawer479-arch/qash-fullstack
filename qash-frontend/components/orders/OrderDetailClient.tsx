"use client";
import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Package, MapPin, Truck, CreditCard, AlertCircle, ArrowLeft } from "lucide-react";
import { cancelOrderAction } from "@/actions/order.actions";
import type { Order } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  PENDING:   "bg-amber-50 text-amber-700 border border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border border-blue-200",
  SHIPPED:   "bg-purple-50 text-purple-700 border border-purple-200",
  DELIVERED: "bg-green-50 text-green-700 border border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border border-red-200",
};

interface Props {
  order: Order;
  messages: Record<string, Record<string, string>>;
  locale: string;
  currency: string;
}

export default function OrderDetailClient({ order: initialOrder, messages, locale, currency }: Props) {
  const t = (key: string) => {
    const [ns, k] = key.split(".");
    return messages[ns]?.[k] ?? k;
  };

  const [order, setOrder] = useState<Order>(initialOrder);
  const [isPending, startTransition] = useTransition();
  const isRTL = locale === "ar";

  const handleCancel = () => {
    startTransition(async () => {
      const result = await cancelOrderAction(order.id);
      if (result.error) { toast.error(result.error); return; }
      setOrder({ ...order, status: "CANCELLED" });
      toast.success(t("orders.cancelled"));
    });
  };

  return (
    <div style={{ backgroundColor: "var(--bg)" }} className="min-h-screen">
      <div className="max-w-4xl mx-auto px-8 py-10" dir={isRTL ? "rtl" : "ltr"}>
        {/* Back */}
        <Link href="/orders" className="inline-flex items-center gap-2 text-[#313131]/60 hover:text-[#313131] text-sm mb-8 transition-colors">
          <ArrowLeft size={16} />
          {t("orders.backToOrders")}
        </Link>

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <h1
              className="text-2xl font-semibold text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              {t("orders.orderNumber")} #{order.order_number || order.id}
            </h1>
            <p className="text-[#313131]/60 text-sm mt-1">
              {new Date(order.created_at).toLocaleDateString(locale === "ar" ? "ar-JO" : "en-US", {
                weekday: "long", year: "numeric", month: "long", day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`text-xs font-medium px-3 py-1.5 ${STATUS_COLORS[order.status] || STATUS_COLORS.PENDING}`}>
              {t(`orders.${order.status}`) || order.status}
            </span>
            {order.status === "PENDING" && (
              <button
                onClick={handleCancel}
                disabled={isPending}
                className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 transition-colors disabled:opacity-50"
              >
                <AlertCircle size={12} />
                {t("orders.cancelOrder")}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6" style={{ border: "1px solid #E8DED4" }}>
              <div className="flex items-center gap-2 mb-5">
                <Package size={18} className="text-[#D88F65]" />
                <h2 className="font-semibold text-[#1A1A1A]">{t("orders.items")}</h2>
              </div>
              <div className="space-y-4">
                {order.items?.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex gap-4">
                    <div className="relative w-16 h-16 shrink-0 bg-[#F4F1EA]">
                      <Image src={item.product?.thumbnail || "/images/p-table-lamp.png"} alt={item.product?.name || ""} fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#313131] text-sm truncate">{locale === "ar" && (item.product as any)?.name_ar ? (item.product as any).name_ar : item.product?.name}</p>
                      <p className="text-[#313131]/60 text-xs mt-0.5">{item.quantity} × {currency} {parseFloat(item.unit_price || "0").toFixed(2)}</p>
                    </div>
                    <p className="font-medium text-[#D88F65] text-sm whitespace-nowrap">
                      {currency} {parseFloat((item as any).line_total || item.total_price || String(item.quantity * parseFloat(item.unit_price || '0'))).toFixed(2)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary sidebar */}
          <div className="space-y-4">
            {/* Shipping Address */}
            <div className="bg-white p-5" style={{ border: "1px solid #E8DED4" }}>
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={16} className="text-[#D88F65]" />
                <h3 className="font-semibold text-[#1A1A1A] text-sm">{t("checkout.shippingAddress")}</h3>
              </div>
              {order.shipping_address ? (
                <div className="text-xs text-[#313131]/70 space-y-0.5">
                  <p className="font-medium text-[#313131]">{order.shipping_address.full_name}</p>
                  <p>{order.shipping_address.address_line}</p>
                  <p>{order.shipping_address.city}{order.shipping_address.state ? `, ${order.shipping_address.state}` : ""}</p>
                  <p>{order.shipping_address.country}</p>
                  <p>{order.shipping_address.phone}</p>
                </div>
              ) : (
                <p className="text-xs text-[#313131]/60">{t("orders.guestOrder")}</p>
              )}
            </div>

            {/* Shipping Method */}
            <div className="bg-white p-5" style={{ border: "1px solid #E8DED4" }}>
              <div className="flex items-center gap-2 mb-3">
                <Truck size={16} className="text-[#D88F65]" />
                <h3 className="font-semibold text-[#1A1A1A] text-sm">{t("checkout.shippingOption")}</h3>
              </div>
              <p className="text-xs text-[#313131]/70">
                {locale === "ar" ? (order.shipping_option as any)?.name_ar || (order.shipping_option as any)?.name : (order.shipping_option as any)?.name}
              </p>
            </div>

            {/* Total */}
            <div className="bg-white p-5" style={{ border: "1px solid #E8DED4" }}>
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={16} className="text-[#D88F65]" />
                <h3 className="font-semibold text-[#1A1A1A] text-sm">{t("cart.summary")}</h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#313131]/70">
                  <span>{t("cart.subtotal")}</span>
                  <span>{currency} {parseFloat(order.subtotal || order.total_amount).toFixed(2)}</span>
                </div>
                {order.shipping_cost && (
                  <div className="flex justify-between text-[#313131]/70">
                    <span>{t("checkout.shipping")}</span>
                    <span>{currency} {parseFloat(order.shipping_cost).toFixed(2)}</span>
                  </div>
                )}
                {order.discount_amount && parseFloat(order.discount_amount) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{t("checkout.discount")}</span>
                    <span>-{currency} {parseFloat(order.discount_amount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-[#1A1A1A] pt-2 border-t border-[#E8DED4]">
                  <span>{t("cart.total")}</span>
                  <span className="text-[#D88F65]">{currency} {parseFloat(order.total_amount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
