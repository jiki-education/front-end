import { cookies } from "next/headers";
import { ACCESS_TOKEN_COOKIE_NAME } from "./cookie-storage";

/**
 * Retrieve stored JWT access token from cookie
 */
export async function hasServersideAccessToken() {
  const serverCookies = await cookies();
  return !!serverCookies.get(ACCESS_TOKEN_COOKIE_NAME);
}
