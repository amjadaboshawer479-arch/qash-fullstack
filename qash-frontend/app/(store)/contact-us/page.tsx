import { cookies } from "next/headers";
import { getLocale, getMessages } from "@/lib/i18n";
import ContactClient from "@/components/ui/ContactClient";
import Image from "next/image";

export default async function ContactPage() {
  const cookieStore = await cookies();
  const locale = getLocale(cookieStore);
  const messages = await getMessages(locale);

  return (
    <div style={{ backgroundColor: "var(--bg)" }}>
      {/* Mini hero */}
      <div className="relative w-full overflow-hidden" style={{ height: 200 }}>
        <Image src="/images/product-master-bed.png" alt="Contact" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1
            className="text-white text-4xl font-semibold"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            {locale === "ar" ? "تواصل معنا" : "Contact Us"}
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <ContactClient messages={messages} locale={locale} />
      </div>
    </div>
  );
}
