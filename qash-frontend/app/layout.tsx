import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Qash — Home Decor & Living",
  description: "Premium home decor, lighting, and artisan pieces for your home",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <head>
        {/* Self-hosted fallback fonts — no Google Fonts CDN dependency */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body
        className="min-h-screen antialiased"
        style={{
          fontFamily: dir === "rtl"
            ? '"Cairo", "Noto Sans Arabic", system-ui, sans-serif'
            : '"Cormorant Garamond", "Playfair Display", Georgia, serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}
