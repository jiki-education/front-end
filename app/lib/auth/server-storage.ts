"use server";

import { cookies } from "next/headers";
import { ACCESS_TOKEN_COOKIE_NAME } from "./actions";

/**
 * Server-side auth token check
 * For use in Server Components only
 */
export async function hasServersideAccessToken() {
  const serverCookies = await cookies();
  return serverCookies.has(ACCESS_TOKEN_COOKIE_NAME);
}
