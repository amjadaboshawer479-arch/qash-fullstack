import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";
import { getLocale, getCurrency, getMessages } from "@/lib/i18n";
import type { Order } from "@/types";
import { Package, ChevronRight } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  PENDING:   "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-blue-50 text-blue-700",
  SHIPPED:   "bg-purple-50 text-purple-700",
  DELIVERED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-700",
};

export default async function OrdersPage({ searchParams }: { searchParams?: Promise<{ page?: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  const locale = getLocale(cookieStore);
  const currency = getCurrency(cookieStore);
  const messages = await getMessages(locale);
  const t = (key: string) => {
    const [ns, k] = key.split(".");
    return messages[ns]?.[k] ?? k;
  };

  const sp = await searchParams ?? {};
  const page = parseInt(sp.page || "1");
  const { data } = await apiClient<{ results: Order[]; count: number; next: string | null; previous: string | null }>(
    `/orders/?page=${page}&page_size=10`, { cache: "no-store" }
  );
  const orders = data?.results ?? [];
  const totalPages = data?.count ? Math.ceil(data.count / 10) : 1;

  return (
    <div style={{ backgroundColor: "var(--bg)" }} className="min-h-screen" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-4xl mx-auto px-8 py-10">
        <h1
          className="text-3xl font-semibold text-[#1A1A1A] mb-8"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          {t("orders.title")}
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="text-[#D5C9BC] mx-auto mb-4" />
            <p className="text-[#313131]/60 mb-6">{t("orders.empty")}</p>
            <Link
              href="/categories"
              className="text-white text-sm font-medium px-8 py-3 inline-block transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#D88F65" }}
            >
              {t("orders.startShopping")}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="flex items-center justify-between bg-white p-6 hover:shadow-sm transition-shadow group"
                style={{ border: "1px solid #E8DED4" }}
              >
                <div>
                  <p className="font-semibold text-[#1A1A1A] text-sm">
                    {t("orders.orderNumber")} #{order.order_number || order.id}
                  </p>
                  <p className="text-[#313131]/60 text-xs mt-1">
                    {new Date(order.created_at).toLocaleDateString(locale === "ar" ? "ar-JO" : "en-US", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-medium px-3 py-1 ${STATUS_COLORS[order.status] || STATUS_COLORS.PENDING}`}>
                    {t(`orders.${order.status}`) || order.status}
                  </span>
                  <span className="font-semibold text-[#D88F65]">
                    {currency} {parseFloat(order.total_amount).toFixed(2)}
                  </span>
                  <ChevronRight size={16} className="text-[#D5C9BC] group-hover:text-[#D88F65] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {page > 1 && (
            <a href={`/orders?page=${page - 1}`} className="w-9 h-9 rounded-full border border-[#D5C9BC] flex items-center justify-center text-sm text-[#313131] hover:border-[#D88F65] hover:text-[#D88F65] transition-colors">‹</a>
          )}
          {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
            const p = i + 1;
            return (
              <a key={p} href={`/orders?page=${p}`}
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors border"
                style={p === page ? { backgroundColor: "#88B0BE", color: "white", borderColor: "#88B0BE" } : { borderColor: "#D5C9BC", color: "#313131" }}
              >{p}</a>
            );
          })}
          {page < totalPages && (
            <a href={`/orders?page=${page + 1}`} className="w-9 h-9 rounded-full border border-[#D5C9BC] flex items-center justify-center text-sm text-[#313131] hover:border-[#D88F65] hover:text-[#D88F65] transition-colors">›</a>
          )}
        </div>
      )}
    </div>
  );
}
