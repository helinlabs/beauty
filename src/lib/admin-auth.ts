"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "admin_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface Session {
  email: string;
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Session;
    if (!parsed.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const locale = String(formData.get("locale") ?? "ko");

  // 데모: 비어있지 않으면 통과
  if (!email || !password) {
    redirect(`/${locale}/admin-login?error=invalid`);
  }

  const store = await cookies();
  store.set(COOKIE_NAME, encodeURIComponent(JSON.stringify({ email })), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });

  redirect(`/${locale}/admin/reservations`);
}

export async function logoutAction(locale: string) {
  const store = await cookies();
  store.delete(COOKIE_NAME);
  redirect(`/${locale}/admin-login`);
}
