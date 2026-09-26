import "server-only";
import { defaultContent, type SiteContent } from "./content";
export function databaseReady() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
export async function db(path: string, init: RequestInit = {}) {
  if (!databaseReady()) throw new Error("Storage is not configured");
  return fetch(`${process.env.SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    signal: AbortSignal.timeout(10000),
  });
}
export async function getContent(): Promise<SiteContent> {
  if (!databaseReady()) return defaultContent;
  try {
    const res = await db("site_content?id=eq.main&select=content");
    if (!res.ok) return defaultContent;
    const rows = await res.json();
    return rows[0]?.content ?? defaultContent;
  } catch {
    return defaultContent;
  }
}
export async function isAdmin(token: string) {
  if (!databaseReady() || !token) return false;
  try {
    const res = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return false;
    return (await res.json()).app_metadata?.igcs_admin === true;
  } catch {
    return false;
  }
}
