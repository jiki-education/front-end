"use client";

import { useAuthStore } from "@/lib/auth/authStore";
import { SignupCta } from "./SignupCta";

/**
 * The sign-up bar, for pages that render the same markup either way.
 *
 * Auth is read from the store rather than the request, exactly as
 * `SidebarLayout` does: reading the cookie on the server would opt the whole
 * route out of static rendering to decide one band at the bottom of the page.
 */
export function LoggedOutSignupCta() {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
    return null;
  }

  return <SignupCta />;
}
