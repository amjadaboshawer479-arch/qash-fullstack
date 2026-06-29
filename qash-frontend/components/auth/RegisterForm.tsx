"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import { registerAction } from "@/actions/auth.actions";
import { useAuthStore } from "@/stores/auth.store";

interface Props {
  messages: Record<string, Record<string, string>>;
  locale: string;
}

export default function RegisterForm({ messages, locale }: Props) {
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
      const result = await registerAction(formData);
      if (result.errors) {
        setErrors(result.errors);
        toast.error("Please check the form");
        return;
      }
      if (result.success && result.user) {
        setUser(result.user);
        toast.success("Account created! Please verify your email.");
        const email = formData.get("email") as string;
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      }
    });
  };

  const inputClass =
    "w-full py-3 border text-sm outline-none transition-colors focus:border-[#D88F65] placeholder-[#D5C9BC]";
  const inputStyle = {
    borderColor: "var(--input-border)",
    backgroundColor: "var(--input-bg)",
  };
  const labelClass =
    "block text-[16px] font-semibold tracking-widest uppercase mb-2";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="text-center mb-8">
        <img
          src="/images/logo.png"
          alt="Qash"
          className="h-100 mx-auto mb-4 object-contain"
          style={{ filter: "brightness(0)" }}
        />
        <h1
          className="text-6xl font-semibold text-[#1A1A1A] mb-1"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          {t("auth.createAccount")}
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {t("auth.registerSubtitle")}
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
          {/* First Name + Last Name — side by side */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className={labelClass}>{t("auth.firstName")}</label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 "
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  type="text"
                  name="first_name"
                  required
                  className={`${inputClass} pl-10 pr-4`}
                  style={inputStyle}
                />
              </div>
              {errors.first_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.first_name[0]}
                </p>
              )}
            </div>

            <div className="flex-1">
              <label className={labelClass}>{t("auth.lastName")}</label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 "
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  type="text"
                  name="last_name"
                  required
                  className={`${inputClass} pl-10 pr-4`}
                  style={inputStyle}
                />
              </div>
              {errors.last_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.last_name[0]}
                </p>
              )}
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className={labelClass}>{t("auth.phone")}</label>
            <div className="relative">
              <Phone
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 "
                style={{ color: "var(--text-muted)" }}
              />
              <input
                type="tel"
                name="phone"
                required
                autoComplete="tel"
                className={`${inputClass} pl-10 pr-4`}
                style={inputStyle}
                placeholder="07XXXXXXXX"
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone[0]}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>{t("auth.email")}</label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 "
                style={{ color: "var(--text-muted)" }}
              />
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className={`${inputClass} pl-10 pr-4`}
                style={inputStyle}
                placeholder="your@email.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>{t("auth.password")}</label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 "
                style={{ color: "var(--text-muted)" }}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                autoComplete="new-password"
                className={`${inputClass} pl-10 pr-12`}
                style={inputStyle}
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
          </div>

          {errors.non_field_errors && (
            <p className="text-red-500 text-medium text-center">
              {errors.non_field_errors[0]}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full text-white py-3.5 text-medium font-semibold tracking-widest uppercase transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#D88F65" }}
          >
            {isPending ? "Creating Account..." : t("auth.createAccount")}
          </button>
        </form>

        <p className="text-center text-medium text-[#020202]/60 mt-6">
          {t("auth.hasAccount")}{" "}
          <Link
            href="/login"
            className="text-[#D88F65] hover:underline font-medium"
          >
            {t("auth.login")}
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
