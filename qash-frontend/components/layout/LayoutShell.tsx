"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

type Messages = Record<string, Record<string, string>>;

interface Props {
  children: React.ReactNode;
  locale: string;
  currency: string;
  messages: Messages;
  currencies: Array<{ code: string; symbol: string; name: string }>;
}

// Pages that should NOT have the Navbar/Footer
const AUTH_PAGES = ["/login", "/register","/verify-email"];

export default function LayoutShell({ children, locale, currency, messages, currencies }: Props) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PAGES.includes(pathname);

  if (isAuthPage) {
    // Auth pages: no navbar, no footer, no padding
    return (
      <main style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
        {children}
      </main>
    );
  }

  return (
    <>
      <Navbar locale={locale} currency={currency} messages={messages} currencies={currencies} />
      <main className="pt-14" style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
        {children}
      </main>
      <Footer messages={messages} />
    </>
  );
}
