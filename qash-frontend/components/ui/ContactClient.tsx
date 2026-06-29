"use client";
import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { submitContactAction } from "@/actions/contact.actions";

interface Props {
  messages: Record<string, Record<string, string>>;
  locale: string;
}

export default function ContactClient({ messages, locale }: Props) {
  const t = (key: string) => {
    const [ns, k] = key.split(".");
    return messages[ns]?.[k] ?? k;
  };
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isRTL = locale === "ar";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    startTransition(async () => {
      const result = await submitContactAction(formData);
      if (result.errors) {
        const flat: Record<string, string> = {};
        for (const [k, msgs] of Object.entries(result.errors)) {
          flat[k] = (msgs as string[])[0];
        }
        setErrors(flat);
      } else {
        toast.success(t("contact.success"));
        form.reset();
        setErrors({});
      }
    });
  };

  const inputClass = "w-full border py-3 px-4 text-sm text-[#313131] outline-none transition-colors focus:border-[#D88F65] placeholder-[#D5C9BC]";
  const inputStyle = { borderColor: "#E8DED4", backgroundColor: "var(--card-bg)" };
  const labelClass = "block text-[11px] font-semibold tracking-widest uppercase text-[#313131] mb-2";

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1
          className="text-4xl font-semibold text-[#1A1A1A] mb-2"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          {t("contact.title")}
        </h1>
        <p className="text-[#313131]/60 text-sm mb-10">{t("contact.subtitle")}</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10">
        {/* Info */}
        <div className="space-y-5">
          {[
            { icon: <Mail size={18} />, label: t("contact.email"), value: "hello@qash.store" },
            { icon: <Phone size={18} />, label: t("contact.phone"), value: "+962 6 000 0000" },
            { icon: <MapPin size={18} />, label: t("contact.address"), value: "Amman, Jordan" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4"
            >
              <div
                className="w-10 h-10 flex items-center justify-center shrink-0 text-white"
                style={{ backgroundColor: "#D88F65" }}
              >
                {item.icon}
              </div>
              <div>
                <p className="text-[11px] font-semibold tracking-widest uppercase text-[#313131]/60 mb-0.5">
                  {item.label}
                </p>
                <p className="text-[#313131] text-sm font-medium">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2"
        >
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8" style={{ border: "1px solid #E8DED4" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t("contact.name")} *</label>
                <input name="name" required className={inputClass} style={inputStyle} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className={labelClass}>{t("contact.email")} *</label>
                <input type="email" name="email" required className={inputClass} style={inputStyle} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className={labelClass}>{t("contact.phone")}</label>
                <input type="tel" name="phone" className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className={labelClass}>{t("contact.location")}</label>
                <input name="location" className={inputClass} style={inputStyle} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>{t("contact.subject")} *</label>
                <input name="subject" required className={inputClass} style={inputStyle} />
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>{t("contact.message")} *</label>
                <textarea name="message" required rows={5} className={`${inputClass} resize-none`} style={inputStyle} />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 text-white text-sm font-semibold tracking-widest uppercase px-8 py-3.5 transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#D88F65" }}
            >
              <Send size={15} />
              {isPending ? "Sending..." : t("contact.send")}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
