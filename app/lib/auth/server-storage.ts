import { cookies } from "next/headers";
import { REFRESH_TOKEN_KEY } from "./storage";

/**
 * Retrieve stored JWT access token from cookie
 */
export async function hasServersideAccessToken() {
  const serverCookies = await cookies();
  return !!serverCookies.get(REFRESH_TOKEN_KEY);
}
