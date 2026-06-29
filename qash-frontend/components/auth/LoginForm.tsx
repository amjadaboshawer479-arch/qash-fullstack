"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { loginAction } from "@/actions/auth.actions";
import { useAuthStore } from "@/stores/auth.store";

interface Props {
  messages: Record<string, Record<string, string>>;
  redirectTo: string;
}

export default function LoginForm({ messages, redirectTo }: Props) {
  const t = (key: string) => {
    const [ns, k] = key.split(".");
    return messages[ns]?.[k] ?? k;
  };

  const router = useRouter();
  const { setUser } = useAuthStore();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await loginAction(formData);
      if (result.errors) {
        setErrors(result.errors);
        toast.error("Please check your credentials");
        return;
      }
      if (result.success && result.user) {
        setUser(result.user);
        toast.success("Welcome back!");
        router.push(redirectTo);
        router.refresh();
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      {/* Logo */}
      <div className="text-center mb-8">
        <img
          src="/images/logo.png"
          alt="Qash"
          className="h-100 mx-auto mb-4 object-contain"
          style={{ filter: "brightness(0)" }}
        />
        <h1
          className="text-6xl font-semibold text-[#f78484] mb-1"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          {t("auth.login")}
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {t("auth.loginSubtitle")}
        </p>
      </div>

      <div
        className="p-8 shadow-sm"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border)",
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[16px] font-semibold tracking-widest uppercase text-[#313131] mb-2">
              {t("auth.email")}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D88F65]" />
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 border text-medium text-[#313131] outline-none transition-colors focus:border-[#D88F65] placeholder-[#D5C9BC]"
                style={{
                  borderColor: "var(--input-border)",
                  backgroundColor: "var(--input-bg)",
                }}
                placeholder="your@email.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-[16px] font-semibold tracking-widest uppercase text-[#313131] mb-2">
              {t("auth.password")}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D88F65]" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                autoComplete="current-password"
                className="w-full pl-10 pr-12 py-3 border text-medium text-[#313131] outline-none transition-colors focus:border-[#D88F65]"
                style={{
                  borderColor: "var(--input-border)",
                  backgroundColor: "var(--input-bg)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#070707] hover:text-[#D88F65]"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>
            )}
            {errors.non_field_errors && (
              <p className="text-red-500 text-xs mt-1">
                {errors.non_field_errors[0]}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full text-white py-3.5 text-medium font-semibold tracking-widest uppercase transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#D88F65" }}
          >
            {isPending ? "Signing In..." : t("auth.login")}
          </button>
        </form>

        <p className="text-center text-medium text-[#070707]/60 mt-6">
          {t("auth.noAccount")}{" "}
          <Link
            href="/register"
            className="text-[#D88F65] hover:underline font-medium"
          >
            {t("auth.register")}
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
