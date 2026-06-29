import { cookies, headers } from "next/headers";
import type { ApiResult } from "@/types";

async function getBaseUrl(): Promise<string> {
  // If explicit env var set, use it
  if (process.env.API_BASE_URL) {
    return process.env.API_BASE_URL;
  }
  // Auto-detect from request host (works for 192.168.x.x, localhost, etc.)
  try {
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const proto = host.includes("localhost") ? "http" : "http";
    return `${proto}://${host}/api`;
  } catch {
    return "http://localhost:3000/api";
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  cache?: RequestCache;
  tags?: string[];
  next?: NextFetchRequestConfig;
};

function flattenErrors(obj: Record<string, unknown>): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  function walk(prefix: string, val: unknown) {
    if (Array.isArray(val)) {
      result[prefix || "non_field_errors"] = val.map(String);
    } else if (val && typeof val === "object") {
      for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
        walk(prefix ? `${prefix}.${k}` : k, v);
      }
    }
  }
  walk("", obj);
  return result;
}

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiResult<T>> {
  const BASE_URL = await getBaseUrl();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const cartToken = cookieStore.get("cart_token")?.value;
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
  const currency = cookieStore.get("NEXT_CURRENCY")?.value || "JOD";

  const reqHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept-Language": locale,
    "X-Currency": currency,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(cartToken ? { "X-Cart-Token": cartToken } : {}),
    ...options.headers,
  };

  const fetchOptions: RequestInit = {
    method: options.method || "GET",
    headers: reqHeaders,
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
    ...(options.cache ? { cache: options.cache } : {}),
    ...(options.tags ? { next: { tags: options.tags } } : {}),
    ...(options.next ? { next: options.next } : {}),
  };

  try {
    const res = await fetch(`${BASE_URL}${path}`, fetchOptions);
    if (res.status === 204) return { data: null as T, error: null };
    const json = await res.json();
    if (!res.ok) {
      if (typeof json === "object" && !Array.isArray(json)) {
        return { data: null, error: flattenErrors(json) };
      }
      return { data: null, error: String(json.detail || "Request failed") };
    }
    return { data: json as T, error: null };
  } catch (err) {
    return { data: null, error: String(err) };
  }
}

export async function apiClientFormData<T>(
  path: string,
  formData: FormData,
  method = "PATCH"
): Promise<ApiResult<T>> {
  const BASE_URL = await getBaseUrl();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
  const currency = cookieStore.get("NEXT_CURRENCY")?.value || "JOD";

  const reqHeaders: Record<string, string> = {
    "Accept-Language": locale,
    "X-Currency": currency,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: reqHeaders,
      body: formData,
    });
    const json = await res.json();
    if (!res.ok) {
      if (typeof json === "object" && !Array.isArray(json)) {
        return { data: null, error: flattenErrors(json) };
      }
      return { data: null, error: String(json.detail || "Request failed") };
    }
    return { data: json as T, error: null };
  } catch (err) {
    return { data: null, error: String(err) };
  }
}
