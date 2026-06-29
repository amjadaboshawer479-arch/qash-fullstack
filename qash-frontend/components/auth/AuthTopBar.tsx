"use client";
import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "@/providers";
import { setLocaleCookie, setCurrencyCookie } from "@/actions/auth.actions";

interface Props {
  locale: string;
  currency?: string;
}

export default function AuthTopBar({ locale, currency = "JOD" }: Props) {
  const { isDark, toggle } = useDarkMode();

  return (
    <div
      className="fixed top-0 right-0 z-50 flex items-center gap-3 px-4 py-2"
      style={{ backgroundColor: "transparent" }}
    >
      {/* Dark mode */}
      <button
        onClick={toggle}
        className="p-2 rounded-full transition-colors hover:bg-black/10"
        style={{ color: isDark ? "#E09A74" : "#D88F65" }}
        aria-label="Toggle dark mode"
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Language */}
      <div className="flex gap-1">
        {["en", "ar"].map((l) => (
          <button
            key={l}
            onClick={async () => { await setLocaleCookie(l); window.location.reload(); }}
            className="text-[11px] font-semibold px-2 py-1 rounded transition-colors"
            style={{
              backgroundColor: locale === l ? "#D88F65" : "transparent",
              color: locale === l ? "white" : "#D88F65",
              border: "1px solid #D88F65",
            }}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Currency */}
      <div className="flex gap-1">
        {["JOD", "USD"].map((c) => (
          <button
            key={c}
            onClick={async () => { await setCurrencyCookie(c); window.location.reload(); }}
            className="text-[11px] font-semibold px-2 py-1 rounded transition-colors"
            style={{
              backgroundColor: currency === c ? "#88B0BE" : "transparent",
              color: currency === c ? "white" : "#88B0BE",
              border: "1px solid #88B0BE",
            }}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
