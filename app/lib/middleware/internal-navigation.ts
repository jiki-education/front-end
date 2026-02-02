import type { NextRequest } from "next/server";
import type { NextResponse } from "next/server";

export const INTERNAL_NAV_COOKIE = "internal-nav";

/**
 * Sets or clears the internal navigation cookie based on the Referer header.
 * This is used by loading.tsx to delay showing the loading state for internal navigations,
 * avoiding a flash of loading UI for quick page transitions within the site.
 */
export function setInternalNavigationCookie(request: NextRequest, response: NextResponse): void {
  const referer = request.headers.get("referer");
  const isInternalNavigation = referer?.includes("jiki.io") ?? false;

  if (isInternalNavigation) {
    response.cookies.set(INTERNAL_NAV_COOKIE, "1", {
      maxAge: 10,
      httpOnly: true,
      sameSite: "strict"
    });
  } else {
    response.cookies.delete(INTERNAL_NAV_COOKIE);
  }
}
