import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export function getLocale(cookieStore: ReadonlyRequestCookies): string {
  return cookieStore.get("NEXT_LOCALE")?.value || "en";
}

export function getCurrency(cookieStore: ReadonlyRequestCookies): string {
  return cookieStore.get("NEXT_CURRENCY")?.value || "JOD";
}

export async function getMessages(locale: string) {
  try {
    return (await import(`../messages/${locale}.json`)).default;
  } catch {
    return (await import("../messages/en.json")).default;
  }
}
