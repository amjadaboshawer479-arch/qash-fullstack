"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search, X, ChevronDown, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { useAuthStore } from "@/stores/auth.store";
import { useState, useRef, useEffect } from "react";
import {
  logoutAction,
  setLocaleCookie,
  setCurrencyCookie,
} from "@/actions/auth.actions";
import { useWishlistStore } from "@/stores/wishlist.store";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useDarkMode } from "@/providers";
import { Moon, Sun } from "lucide-react";

type Messages = Record<string, Record<string, string>>;

export default function Navbar({
  locale,
  currency,
  messages,
  currencies,
}: {
  locale: string;
  currency: string;
  messages: Messages;
  currencies?: Array<{ code: string; symbol: string; name: string }>;
}) {
  const nav = messages.nav || {};
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, clearCart } = useCartStore();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const { clearWishlist } = useWishlistStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const isAr = locale === "ar";
  const { isDark, toggle: toggleDark } = useDarkMode();
  const currencyList =
    currencies && currencies.length > 0
      ? currencies.map((c) => c.code)
      : ["JOD", "USD", "EUR", "SAR", "AED"];

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Prevent body scroll when sidebar open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  async function handleLogout() {
    clearAuth();
    clearWishlist();
    clearCart();
    await logoutAction();
    // logoutAction already redirects to /login via server redirect
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/categories?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  }

  const sidebarLinks = [
    { href: "/", label: isAr ? "الرئيسية" : "Home" },
    {
      href: "/categories",
      label: isAr ? "الفئات والمنتجات" : "Categories & Products",
    },
    { href: "/cart", label: isAr ? "سلة التسوق" : "Cart" },
    { href: "/wishlist", label: isAr ? "المفضلة" : "Favourites" },
    { href: "/contact-us", label: isAr ? "تواصل معنا" : "Contact Us" },
  ];
  // Links that require authentication
  const requiresAuth = (href: string) =>
    [
      "/",
      "/categories",
      "/cart",
      "/wishlist",
      "/contact-us",
      "/profile",
      "/orders",
      "/checkout",
    ].includes(href) ||
    href.startsWith("/categories") ||
    href.startsWith("/products");

  return (
    <>
      {/* ─────────────── MAIN NAVBAR ─────────────────────────── */}
      <header
        className="fixed top-0 inset-x-0 z-50"
        style={{ backgroundColor: "#D88F65", height: 56 }}
      >
        <div
          className="h-full w-full flex items-center"
          style={{
            paddingLeft: "max(12px, 2.5vw)",
            paddingRight: "max(12px, 2.5vw)",
          }}
        >
          {/* ── LEFT: hamburger | search | cart | "Categories & Products" ── */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            {/* Hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-white hover:text-white/80 transition-colors p-1 shrink-0"
              aria-label="Open menu"
            >
              <svg
                width="20"
                height="14"
                viewBox="0 0 20 14"
                fill="none"
                aria-hidden="true"
              >
                <rect y="0" width="20" height="2" rx="1" fill="white" />
                <rect y="6" width="20" height="2" rx="1" fill="white" />
                <rect y="12" width="20" height="2" rx="1" fill="white" />
              </svg>
            </button>

            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-white hover:text-white/80 transition-colors p-1 shrink-0"
              aria-label="Search"
            >
              <Search size={18} strokeWidth={1.8} />
            </button>

            {/* Cart — only clickable when authenticated */}
            {isAuthenticated ? (
              <Link
                href="/cart"
                className="relative text-white hover:text-white/80 transition-colors p-1 shrink-0"
                aria-label="Cart"
              >
                <ShoppingCart size={18} strokeWidth={1.8} />
                {itemCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 rounded-full flex items-center justify-center text-[9px] font-bold leading-none"
                    style={{
                      width: 15,
                      height: 15,
                      backgroundColor: "white",
                      color: "#D88F65",
                    }}
                  >
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </Link>
            ) : (
              <span
                className="relative text-white/40 p-1 shrink-0 cursor-not-allowed"
                aria-label="Cart"
              >
                <ShoppingCart size={18} strokeWidth={1.8} />
              </span>
            )}

            {/* "Categories & Products" — visible sm and up, only when auth */}
            {isAuthenticated ? (
              <Link
                href="/categories"
                className="hidden sm:block text-white text-[13px] font-medium whitespace-nowrap hover:text-white/80 transition-colors ml-1"
                style={{ fontFamily: "inherit" }}
              >
                {isAr ? "الفئات والمنتجات" : "Categories & Products"}
              </Link>
            ) : (
              <span
                className="hidden sm:block text-white/40 text-[13px] font-medium whitespace-nowrap ml-1 cursor-not-allowed"
                style={{ fontFamily: "inherit" }}
              >
                {isAr ? "الفئات والمنتجات" : "Categories & Products"}
              </span>
            )}
          </div>

          {/* ── CENTER: Logo pill ─────────────────────────────── */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 flex-shrink-0"
            style={{ zIndex: 1 }}
          >
            <div
              className="flex items-center justify-center "
              style={{
                paddingLeft: 18,
                paddingRight: 18,
                height: 38,
              }}
            >
              <Image
                src="/images/logo.png"
                alt="Qash"
                width={240}
                height={80}
                className="object-contain"
                priority
                style={{
                  maxHeight: 240,
                  width: "auto",
                  filter: "brightness(0) invert(1)",
                }}
              />
            </div>
          </Link>

          {/* ── RIGHT: auth buttons + lang/currency ──────────── */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-end min-w-0">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              className="text-white/80 hover:text-white transition-colors p-1 shrink-0"
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDark ? (
                <Sun size={16} strokeWidth={1.8} />
              ) : (
                <Moon size={16} strokeWidth={1.8} />
              )}
            </button>

            {isAuthenticated ? (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="flex items-center gap-1 text-white text-[12px] font-medium px-2.5 py-1.5 rounded-full hover:bg-white/15 transition-colors max-w-[120px]">
                    <span className="truncate">
                      {user?.first_name || user?.username || "Account"}
                    </span>
                    <ChevronDown size={11} className="shrink-0" />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="bg-white rounded-xl shadow-xl p-1 z-[200] min-w-[160px]"
                    sideOffset={8}
                    align="end"
                  >
                    <DropdownMenu.Item asChild>
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2.5 rounded-lg text-[13px] text-[#313131] hover:bg-orange-50 outline-none cursor-pointer"
                      >
                        {nav.profile || "My Profile"}
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <Link
                        href="/orders"
                        className="flex items-center px-4 py-2.5 rounded-lg text-[13px] text-[#313131] hover:bg-orange-50 outline-none cursor-pointer"
                      >
                        {nav.orders || "My Orders"}
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <Link
                        href="/wishlist"
                        className="flex items-center px-4 py-2.5 rounded-lg text-[13px] text-[#313131] hover:bg-orange-50 outline-none cursor-pointer"
                      >
                        {nav.wishlist || "Favourites"}
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="my-1 h-px bg-[#E8DED4]" />
                    <DropdownMenu.Item
                      onSelect={handleLogout}
                      className="px-4 py-2.5 rounded-lg text-[13px] text-red-500 hover:bg-red-50 cursor-pointer outline-none"
                    >
                      {nav.logout || "Sign Out"}
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            ) : (
              <>
                {/* "Log In" — plain text, hidden on very small screens */}
                <Link
                  href="/login"
                  className="hidden xs:block text-white text-[12px] font-medium px-2 py-1 hover:text-white/80 transition-colors whitespace-nowrap"
                >
                  {nav.login || "Log In"}
                </Link>
                {/* "Sign Up" — outlined pill */}
                <Link
                  href="/register"
                  className="text-white text-[12px] font-medium px-3 py-1.5 rounded-full border border-white/60 hover:bg-white/10 transition-colors whitespace-nowrap"
                >
                  {nav.register || "Sign Up"}
                </Link>
              </>
            )}

            {/* Language — compact, only lg+ */}
            <div className="hidden lg:flex items-center gap-1.5 ml-1 border-l border-white/30 pl-2">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="flex items-center gap-0.5 text-white/80 hover:text-white text-[11px] font-medium uppercase">
                    {locale}
                    <ChevronDown size={9} />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="bg-white rounded-xl shadow-xl p-1 z-[200] min-w-[100px]"
                    sideOffset={8}
                    align="end"
                  >
                    {["en", "ar"].map((l) => (
                      <DropdownMenu.Item
                        key={l}
                        onSelect={async () => {
                          await setLocaleCookie(l);
                          window.location.reload();
                        }}
                        className={`px-4 py-2 rounded-lg text-[13px] cursor-pointer outline-none hover:bg-orange-50 ${locale === l ? "text-[#D88F65] font-semibold" : "text-[#313131]"}`}
                      >
                        {l === "en" ? "English" : "العربية"}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>

              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="flex items-center gap-0.5 text-white/80 hover:text-white text-[11px] font-medium">
                    {currency}
                    <ChevronDown size={9} />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="bg-white rounded-xl shadow-xl p-1 z-[200] min-w-[80px]"
                    sideOffset={8}
                    align="end"
                  >
                    {currencyList.map((c) => (
                      <DropdownMenu.Item
                        key={c}
                        onSelect={async () => {
                          await setCurrencyCookie(c);
                          window.location.reload();
                        }}
                        className={`px-4 py-2 rounded-lg text-[13px] cursor-pointer outline-none hover:bg-orange-50 ${currency === c ? "text-[#D88F65] font-semibold" : "text-[#313131]"}`}
                      >
                        {c}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          </div>
        </div>

        {/* ── SEARCH BAR (dropdown) ──────────────────────────── */}
        {searchOpen && (
          <div
            className="absolute top-full left-0 right-0 px-6 py-2.5 shadow-lg"
            style={{ backgroundColor: "var(--brand-deep)" }}
          >
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 max-w-2xl mx-auto"
            >
              <div className="flex-1 flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-2 focus-within:border-white/60 transition-colors">
                <Search size={15} className="text-white/70 shrink-0" />
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? "ابحث عن منتج..." : "Search products..."}
                  className="flex-1 bg-transparent text-white placeholder-white/60 text-sm outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="text-white/80 hover:text-white p-1 transition-colors shrink-0"
              >
                <X size={18} />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* ─────────────── SIDEBAR OVERLAY ─────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] transition-opacity"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ─────────────── SIDEBAR PANEL ───────────────────────── */}
      <aside
        className="fixed top-0 bottom-0 z-[70] flex flex-col transition-transform duration-300 ease-out shadow-2xl"
        style={{
          left: isAr ? "auto" : 0,
          right: isAr ? 0 : "auto",
          width: "min(300px, 82vw)",
          backgroundColor: "#D88F65",
          transform: sidebarOpen
            ? "translateX(0)"
            : isAr
              ? "translateX(100%)"
              : "translateX(-100%)",
        }}
        aria-hidden={!sidebarOpen}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/20 shrink-0">
          <Image
            src="/images/logo.png"
            alt="Qash"
            width={80}
            height={24}
            className="object-contain"
            style={{
              filter: "brightness(0) invert(1)",
              maxHeight: 22,
              width: "auto",
            }}
          />
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white/80 hover:text-white transition-colors p-1"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-2">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center px-5 py-3.5 text-[14px] font-medium transition-colors border-b border-white/10 last:border-0 ${
                pathname === link.href
                  ? "text-white bg-white/15"
                  : "text-white/85 hover:text-white hover:bg-white/10"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {/* Auth links */}
          <div className="mt-2 border-t border-white/20 pt-2">
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center px-5 py-3.5 text-[14px] font-medium text-white/85 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  {nav.profile || "My Profile"}
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center px-5 py-3.5 text-[14px] font-medium text-white/85 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  {nav.orders || "My Orders"}
                </Link>
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center w-full px-5 py-3.5 text-[14px] font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {nav.logout || "Sign Out"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center px-5 py-3.5 text-[14px] font-medium text-white/85 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  {nav.login || "Log In"}
                </Link>
                <Link
                  href="/register"
                  className="flex items-center px-5 py-3.5 text-[14px] font-medium text-white/85 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  {nav.register || "Sign Up"}
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Language & currency at bottom */}
        <div className="px-5 py-4 border-t border-white/20 shrink-0 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white/60 text-[11px] uppercase tracking-wide w-16 shrink-0">
              Language
            </span>
            <div className="flex gap-2">
              {["en", "ar"].map((l) => (
                <button
                  key={l}
                  onClick={async () => {
                    await setLocaleCookie(l);
                    window.location.reload();
                  }}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors ${locale === l ? "bg-white text-[#D88F65]" : "text-white/80 border border-white/40 hover:bg-white/10"}`}
                >
                  {l === "en" ? "EN" : "AR"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white/60 text-[11px] uppercase tracking-wide w-16 shrink-0">
              Currency
            </span>
            <div className="flex gap-1.5 flex-wrap">
              {currencyList.slice(0, 3).map((c) => (
                <button
                  key={c}
                  onClick={async () => {
                    await setCurrencyCookie(c);
                    window.location.reload();
                  }}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors ${currency === c ? "bg-white text-[#D88F65]" : "text-white/80 border border-white/40 hover:bg-white/10"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
