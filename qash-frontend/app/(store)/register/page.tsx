import { cookies } from "next/headers";
import { getLocale, getCurrency, getMessages } from "@/lib/i18n";
import RegisterForm from "@/components/auth/RegisterForm";
import AuthTopBar from "@/components/auth/AuthTopBar";
import Image from "next/image";

export default async function RegisterPage() {
  const cookieStore = await cookies();
  const locale = getLocale(cookieStore);
  const currency = getCurrency(cookieStore);
  const messages = await getMessages(locale);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative" style={{ backgroundColor: "var(--bg)" }}>
      {/* Auth top bar — dark mode + lang + currency always accessible */}
      <AuthTopBar locale={locale} currency={currency} />
      {/* Left: image */}
      <div className="hidden lg:flex flex-1 relative">
        <Image src="/images/hero-living-room.png" alt="Qash" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      {/* Right: form */}
      <div className="w-full lg:max-w-lg flex items-center justify-center px-5 sm:px-8 py-10 lg:py-16">
        <RegisterForm messages={messages} locale={locale} />
      </div>
    </div>
  );
}
