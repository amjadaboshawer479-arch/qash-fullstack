"use client";
import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Camera, Save, User as UserIcon } from "lucide-react";
import {
  updateProfileAction,
  uploadAvatarAction,
} from "@/actions/profile.actions";
import type { User } from "@/types";

interface Props {
  user: User;
  messages: Record<string, Record<string, string>>;
  locale: string;
}

export default function ProfileClient({
  user: initialUser,
  messages,
  locale,
}: Props) {
  const t = (key: string) => {
    const [ns, k] = key.split(".");
    return messages[ns]?.[k] ?? k;
  };
  const [user, setUser] = useState<User>(initialUser);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const isRTL = locale === "ar";

  const inputClass =
    "w-full border py-3 px-4 text-sm text-[#313131] outline-none transition-colors focus:border-[#D88F65] placeholder-[#D5C9BC]";
  const inputStyle = { borderColor: "#E8DED4", backgroundColor: "var(--card-bg)" };
  const labelClass =
    "block text-[16px] font-semibold tracking-widest uppercase text-[#030303] mb-2";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateProfileAction(formData);
      if (result.errors) {
        const flat: Record<string, string> = {};
        for (const [k, msgs] of Object.entries(result.errors))
          flat[k] = msgs[0];
        setErrors(flat);
        toast.error(t("profile.updateFailed"));
      } else if (result.user) {
        setUser(result.user as User);
        toast.success(t("profile.updateSuccess"));
        setErrors({});
      }
    });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const fd = new FormData();
    fd.append("avatar", file);
    const result = await uploadAvatarAction(fd);
    setIsUploading(false);
    if (result.error) toast.error(t("profile.avatarFailed"));
    else if (result.user) {
      setUser(result.user as User);
      toast.success(t("profile.avatarUpdated"));
    }
  };

  return (
    <div style={{ backgroundColor: "var(--bg)" }} className="min-h-screen">
      <div className="max-w-2xl mx-auto px-8 py-10" dir={isRTL ? "rtl" : "ltr"}>
        <h1
          className="text-3xl font-semibold text-[#1A1A1A] mb-8"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          {t("profile.title")}
        </h1>

        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="relative">
            <div
              className="w-24 h-24 overflow-hidden"
              style={{ border: "3px solid #E8DED4" }}
            >
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.first_name || ""}
                  fill
                  className="object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: "#F4F1EA" }}
                >
                  <UserIcon size={40} className="text-[#D5C9BC]" />
                </div>
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={isUploading}
              className="absolute bottom-0 right-0 w-8 h-8 text-white flex items-center justify-center transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#D88F65" }}
            >
              <Camera size={14} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <p className="mt-3 text-[#313131]/60 text-sm">{user.email}</p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white p-8 space-y-5"
          style={{ border: "1px solid #E8DED4" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>{t("profile.firstName")}</label>
              <input
                name="first_name"
                defaultValue={user.first_name || ""}
                className={inputClass}
                style={inputStyle}
              />
              {errors.first_name && (
                <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>{t("profile.lastName")}</label>
              <input
                name="last_name"
                defaultValue={user.last_name || ""}
                className={inputClass}
                style={inputStyle}
              />
              {errors.last_name && (
                <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
              )}
            </div>
          </div>
          <div>
            <label className={labelClass}>{t("profile.phone")}</label>
            <input
              type="tel"
              name="phone"
              defaultValue={user.phone || ""}
              className={inputClass}
              style={inputStyle}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>{t("profile.address")}</label>
            <input
              name="address"
              defaultValue={user.address || ""}
              className={inputClass}
              style={inputStyle}
            />
          </div>
          <div>
            <label className={labelClass}>{t("profile.dateOfBirth")}</label>
            <input
              type="date"
              name="date_of_birth"
              defaultValue={user.date_of_birth || ""}
              className={inputClass}
              style={inputStyle}
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 text-white text-sm font-semibold tracking-widest uppercase px-8 py-3.5 transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#D88F65" }}
          >
            <Save size={15} />
            {isPending ? t("common.saving") : t("profile.saveChanges")}
          </button>
        </motion.form>
      </div>
    </div>
  );
}
