"use client";
import { Toaster } from "sonner";
import { createContext, useContext, useEffect, useState } from "react";

// Dark mode context
const DarkModeContext = createContext<{
  isDark: boolean;
  toggle: () => void;
}>({ isDark: false, toggle: () => {} });

export function useDarkMode() {
  return useContext(DarkModeContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  // Initialize from localStorage (no hydration mismatch)
  useEffect(() => {
    const stored = localStorage.getItem("qash-dark-mode");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = stored ? stored === "true" : prefersDark;
    setIsDark(dark);
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  function toggle() {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("qash-dark-mode", String(next));
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  }

  return (
    <DarkModeContext.Provider value={{ isDark, toggle }}>
      {children}
      <Toaster position="top-right" richColors closeButton />
    </DarkModeContext.Provider>
  );
}
