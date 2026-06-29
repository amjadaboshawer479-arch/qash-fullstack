import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getLocale, getMessages } from "@/lib/i18n";
import VerifyEmailClient from "@/components/auth/Verifyemailclient";

interface Props {
  searchParams: Promise<{ email?: string }>;
}

export default async function VerifyEmailPage({ searchParams }: Props) {
  const sp = await searchParams;
  const email = sp.email || "";
  if (!email) redirect("/register");

  const cookieStore = await cookies();
  const locale = getLocale(cookieStore);
  const messages = await getMessages(locale);

  return (
    <VerifyEmailClient email={email} messages={messages} locale={locale} />
  );
}
