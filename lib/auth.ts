import { cookies } from "next/headers";

export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

export function isAuthenticated(): boolean {
  const store = cookies();
  return store.get(SESSION_COOKIE)?.value === "1";
}
