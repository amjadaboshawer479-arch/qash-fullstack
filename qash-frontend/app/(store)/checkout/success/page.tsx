import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { cookies } from "next/headers";
import { getLocale, getMessages } from "@/lib/i18n";

interface Props {
  searchParams: Promise<{ order_id?: string; total?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { order_id, total } = await searchParams;
  const cookieStore = await cookies();
  const locale = getLocale(cookieStore);
  const messages = await getMessages(locale);
  const t = (key: string) => {
    const [ns, k] = key.split(".");
    return messages[ns]?.[k] ?? k;
  };

  return (
    <div style={{ backgroundColor: "#FFFAF6" }} className="min-h-[70vh] flex items-center justify-center px-8">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 flex items-center justify-center" style={{ backgroundColor: "#F4F1EA" }}>
            <CheckCircle className="w-10 h-10 text-[#D88F65]" />
          </div>
        </div>
        <h1
          className="text-3xl font-semibold text-[#1A1A1A] mb-3"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          {t("checkout.orderPlaced")}
        </h1>
        {order_id && (
          <p className="text-[#313131]/70 mb-2 text-sm">
            {t("checkout.orderNumber")}: <span className="font-semibold text-[#D88F65]">#{order_id}</span>
          </p>
        )}
        {total && (
          <p className="text-[#313131]/70 mb-8 text-sm">
            {t("checkout.orderTotal")}: <span className="font-semibold text-[#313131]">{total}</span>
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/orders"
            className="text-white text-sm font-medium px-8 py-3 transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#D88F65" }}
          >
            {t("checkout.viewOrders")}
          </Link>
          <Link
            href="/"
            className="text-[#313131] text-sm font-medium px-8 py-3 transition-colors hover:text-[#D88F65]"
            style={{ border: "1px solid #E8DED4" }}
          >
            {t("common.backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
