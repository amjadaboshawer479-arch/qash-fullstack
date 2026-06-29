"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { subscribeNewsletterAction } from "@/actions/contact.actions";
import { toast } from "sonner";

type Messages = Record<string, Record<string, string>>;

export default function Footer({ messages }: { messages: Messages }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const footer = messages.footer || {};

  async function handleSubscribe(e?: React.FormEvent) {
    e?.preventDefault();
    if (!email || !email.includes("@")) { toast.error("Please enter a valid email"); return; }
    setLoading(true);
    const result = await subscribeNewsletterAction(email);
    setLoading(false);
    if (result.success) { toast.success("Subscribed successfully!"); setEmail(""); }
    else toast.error(result.error || "Failed to subscribe");
  }

  return (
    <footer>
      {/* ── Main footer bg section — rounded top rx=46 #F4F1EA ── */}
      <div style={{ borderRadius: "40px 40px 0 0", backgroundColor: "var(--surface)" }}>
        <div className="px-5 sm:px-8 lg:px-12 xl:px-16 pt-10 sm:pt-12 pb-6 sm:pb-8">
          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Image
                src="/images/logo.png"
                alt="Qash"
                width={80}
                height={28}
                className="object-contain mb-3"
                style={{ maxHeight: 28, width: "auto" }}
              />
              <p className="text-[#313131] text-[12px] leading-relaxed opacity-60 max-w-[180px]">
                {footer.tagline || "Curated home decor for inspired living"}
              </p>
            </div>

            {/* Shop */}
            <div>
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#1E1E1E] mb-3 sm:mb-4">
                {footer.quick_links || "Shop"}
              </p>
              <ul className="space-y-2">
                {[
                  { href: "/categories",                  label: "All Products"  },
                  { href: "/categories?tab=lighting",     label: "Lighting"      },
                  { href: "/categories?tab=rugs",         label: "Rugs"          },
                  { href: "/categories?tab=bags",         label: "Bags"          },
                  { href: "/categories?tab=wall-decor",   label: "Wall Decor"    },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[#313131] text-[12px] opacity-60 hover:opacity-100 hover:text-[#D88F65] transition-all">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Info */}
            <div>
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#1E1E1E] mb-3 sm:mb-4">
                {footer.info || "Info"}
              </p>
              <ul className="space-y-2">
                {[
                  { href: "/contact-us", label: "Contact Us"  },
                  { href: "/orders",     label: "Track Order" },
                  { href: "/login",      label: "My Account"  },
                  { href: "/register",   label: "Sign Up"     },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[#313131] text-[12px] opacity-60 hover:opacity-100 hover:text-[#D88F65] transition-all">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="col-span-2 md:col-span-1">
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#1E1E1E] mb-3 sm:mb-4">
                {footer.newsletter || "Newsletter"}
              </p>
              <p className="text-[#313131] text-[12px] opacity-60 mb-3 leading-relaxed">
                Subscribe for new arrivals & exclusive offers
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 min-w-0 border px-3 py-2 text-[12px] outline-none transition-colors focus:border-[#D88F65]"
                  style={{ borderColor: "#D5C9BC", backgroundColor: "var(--card-bg)" }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="shrink-0 text-white text-[11px] font-semibold px-3 py-2 transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: "#D88F65" }}
                >
                  {loading ? "..." : "Send"}
                </button>
              </form>
            </div>
          </div>

          {/* Bottom bar — SVG: line stroke=#A4A4A4, arrow, orange rect */}
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5"
            style={{ borderTop: "1px solid rgba(0,0,0,0.1)" }}
          >
            <p className="text-[#313131] text-[11px] opacity-40 order-2 sm:order-1">
              © {new Date().getFullYear()} Qash. All rights reserved.
            </p>
            <div className="flex items-center gap-3 order-1 sm:order-2">
              {/* SVG line x=774-1096 stroke=#A4A4A4 */}
              <div className="h-px w-20 sm:w-32" style={{ backgroundColor: "#A4A4A4" }} />
              {/* Arrow */}
              <svg width="20" height="10" viewBox="0 0 20 10" fill="none" aria-hidden="true">
                <path d="M0 5H16M16 5L12 1.5M16 5L12 8.5" stroke="#1E1E1E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {/* SVG orange rect x=1111 y=3707 w=143 h=33 fill=#D88E63 */}
              <div
                className="flex items-center justify-center text-white text-[11px] font-medium tracking-wide"
                style={{ backgroundColor: "#D88E63", height: 32, width: 130, minWidth: 100 }}
              >
                Follow Us
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer image strip — SVG: h=286 ─────────────────── */}
      <div className="relative w-full overflow-hidden" style={{ height: "clamp(140px, 20vw, 240px)" }}>
        <Image
          src="/images/p-rugs.png"
          alt="Qash Home Decor"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.35)" }} />
      </div>
    </footer>
  );
}
