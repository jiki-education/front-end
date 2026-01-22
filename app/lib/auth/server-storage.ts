"use server";

import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE_NAME } from "./cookie-config";

/**
 * Server-side session cookie check
 * For use in Server Components only
 */
export async function hasAuthenticationCookie() {
  const serverCookies = await cookies();
  return serverCookies.has(AUTHENTICATION_COOKIE_NAME);
}
