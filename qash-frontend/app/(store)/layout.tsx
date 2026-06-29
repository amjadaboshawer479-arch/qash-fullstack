import { cookies } from "next/headers";
import { Providers } from "@/providers";
import LayoutShell from "@/components/layout/LayoutShell";

async function getMessages(locale: string) {
  try { return (await import(`../../messages/${locale}.json`)).default; }
  catch { return (await import("../../messages/en.json")).default; }
}

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
  const currency = cookieStore.get("NEXT_CURRENCY")?.value || "JOD";
  const messages = await getMessages(locale);

  // Fetch available currencies from API
  let currencies: Array<{ code: string; symbol: string; name: string }> = [];
  try {
    const currRes = await fetch(
      `${process.env.API_BASE_URL || "http://localhost:3000/api"}/logistics/currencies/`,
      { next: { revalidate: 3600 } }
    );
    if (currRes.ok) {
      const data = await currRes.json();
      currencies = data.results ?? [];
    }
  } catch { /* use defaults */ }
  if (!currencies.length) {
    currencies = [
      { code: "JOD", symbol: "JD", name: "Jordanian Dinar" },
      { code: "USD", symbol: "$",  name: "US Dollar"       },
      { code: "EUR", symbol: "€",  name: "Euro"            },
      { code: "SAR", symbol: "SR", name: "Saudi Riyal"     },
      { code: "AED", symbol: "د.إ",name: "UAE Dirham"      },
    ];
  }

  return (
    <Providers>
      <LayoutShell locale={locale} currency={currency} messages={messages} currencies={currencies}>
        {children}
      </LayoutShell>
    </Providers>
  );
}
