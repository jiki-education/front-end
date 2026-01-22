"use server";

import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "./cookie-config";

/**
 * Server-side session cookie check
 * For use in Server Components only
 */
export async function hasSessionCookie() {
  const serverCookies = await cookies();
  return serverCookies.has(SESSION_COOKIE_NAME);
}
