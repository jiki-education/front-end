"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type { LoginCredentials, SignupData, User } from "@/types/auth";

const COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  // Note: Using 'strict' for better security. If OAuth redirects fail (cookies not sent
  // during cross-site navigation), switch back to 'lax'
  sameSite: "strict" as const,
  domain: process.env.NODE_ENV === "production" ? ".jiki.io" : ".local.jiki.io",
  path: "/"
};

// This is a very long cookie, but the actual JWT inside only lives for
// few minutes. This allows us to check for the presence of the cookie
// to see if the user SHOULD be logged in, but we still have the security
// of the short-lived JWT inside it.
const ACCESS_TOKEN_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds
const REFRESH_TOKEN_MAX_AGE = 5 * 365 * 24 * 60 * 60; // 5 years in seconds

interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Clear authentication cookies and revalidate routes
 */
async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();

  // Delete with same domain/path used to set them
  cookieStore.delete({
    name: "jiki_access_token",
    domain: COOKIE_CONFIG.domain,
    path: COOKIE_CONFIG.path
  });
  cookieStore.delete({
    name: "jiki_refresh_token",
    domain: COOKIE_CONFIG.domain,
    path: COOKIE_CONFIG.path
  });

  // Clear Next.js cache to ensure fresh renders
  revalidatePath("/", "layout");
}

export async function loginAction(credentials: LoginCredentials): Promise<AuthResult> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: credentials })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error?.message || "Login failed" };
    }

    // Extract JWT from Authorization header
    const authHeader = response.headers.get("Authorization");
    const accessToken = authHeader?.replace("Bearer ", "");

    const data = await response.json();
    const refreshToken = data.refresh_token;

    if (!accessToken || !refreshToken) {
      return { success: false, error: "Invalid response from server" };
    }

    // Set httpOnly cookies
    const cookieStore = await cookies();

    cookieStore.set("jiki_access_token", accessToken, {
      ...COOKIE_CONFIG,
      maxAge: ACCESS_TOKEN_MAX_AGE
    });

    cookieStore.set("jiki_refresh_token", refreshToken, {
      ...COOKIE_CONFIG,
      maxAge: REFRESH_TOKEN_MAX_AGE
    });

    // Revalidate to update server components with new auth state
    revalidatePath("/", "layout");

    return { success: true, user: data.user };
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function signupAction(userData: SignupData): Promise<AuthResult> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: userData })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error?.message || "Signup failed" };
    }

    const authHeader = response.headers.get("Authorization");
    const accessToken = authHeader?.replace("Bearer ", "");

    const data = await response.json();
    const refreshToken = data.refresh_token;

    if (!accessToken || !refreshToken) {
      return { success: false, error: "Invalid response from server" };
    }

    const cookieStore = await cookies();

    cookieStore.set("jiki_access_token", accessToken, {
      ...COOKIE_CONFIG,
      maxAge: ACCESS_TOKEN_MAX_AGE
    });

    cookieStore.set("jiki_refresh_token", refreshToken, {
      ...COOKIE_CONFIG,
      maxAge: REFRESH_TOKEN_MAX_AGE
    });

    // Revalidate to update server components with new auth state
    revalidatePath("/", "layout");

    return { success: true, user: data.user };
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function googleLoginAction(code: string): Promise<AuthResult> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error?.message || "Google login failed" };
    }

    const authHeader = response.headers.get("Authorization");
    const accessToken = authHeader?.replace("Bearer ", "");

    const data = await response.json();
    const refreshToken = data.refresh_token;

    if (!accessToken || !refreshToken) {
      return { success: false, error: "Invalid response from server" };
    }

    const cookieStore = await cookies();

    cookieStore.set("jiki_access_token", accessToken, {
      ...COOKIE_CONFIG,
      maxAge: ACCESS_TOKEN_MAX_AGE
    });

    cookieStore.set("jiki_refresh_token", refreshToken, {
      ...COOKIE_CONFIG,
      maxAge: REFRESH_TOKEN_MAX_AGE
    });

    // Revalidate to update server components with new auth state
    revalidatePath("/", "layout");

    return { success: true, user: data.user };
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function refreshTokenAction(): Promise<AuthResult> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("jiki_refresh_token")?.value;

    if (!refreshToken) {
      return { success: false, error: "No refresh token" };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken })
    });

    if (!response.ok) {
      await clearAuthCookies();
      return { success: false, error: "Refresh failed" };
    }

    const authHeader = response.headers.get("Authorization");
    const newAccessToken = authHeader?.replace("Bearer ", "");

    if (!newAccessToken) {
      return { success: false, error: "Invalid refresh response" };
    }

    // Update access token cookie
    cookieStore.set("jiki_access_token", newAccessToken, {
      ...COOKIE_CONFIG,
      maxAge: ACCESS_TOKEN_MAX_AGE
    });

    // Revalidate to update server components with refreshed auth state
    revalidatePath("/", "layout");

    const data = await response.json();
    return { success: true, user: data.user };
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();

  // Try to call Rails logout endpoint (best effort)
  try {
    const accessToken = cookieStore.get("jiki_access_token")?.value;
    if (accessToken) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });
    }
  } catch {
    // Silently fail - we'll clear cookies anyway
  }

  // Always clear cookies regardless of API response
  await clearAuthCookies();
}

export async function logoutFromAllDevicesAction(): Promise<void> {
  const cookieStore = await cookies();

  // Try to call Rails logout/all endpoint (best effort)
  try {
    const accessToken = cookieStore.get("jiki_access_token")?.value;
    if (accessToken) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout/all`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });
    }
  } catch {
    // Silently fail - we'll clear cookies anyway
  }

  // Always clear cookies regardless of API response
  await clearAuthCookies();
}
