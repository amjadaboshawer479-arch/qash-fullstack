import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { getLocale, getMessages } from "@/lib/i18n";
import ProfileClient from "@/components/auth/ProfileClient";
import TestimonialForm from "@/components/profile/TestimonialForm";
import type { User } from "@/types";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  const locale = getLocale(cookieStore);
  const messages = await getMessages(locale);

  const { data: user } = await apiClient<User>("/users/me/", {
    method: "GET",
    cache: "no-store",
  });

  if (!user) redirect("/login");

  return (
    <>
      <ProfileClient user={user} messages={messages} locale={locale} />
      <div className="max-w-2xl mx-auto px-8 pb-10">
        <TestimonialForm locale={locale} messages={messages} />
      </div>
    </>
  );
}
