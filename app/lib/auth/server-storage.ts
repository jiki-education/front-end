"use server";

import { cookies } from "next/headers";

/**
 * Server-side auth token check
 * For use in Server Components only
 */
export async function hasServersideAccessToken() {
  const serverCookies = await cookies();
  return serverCookies.has("jiki_access_token");
}
