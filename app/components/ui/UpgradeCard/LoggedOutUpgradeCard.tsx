"use client";

import { useAuthStore } from "@/lib/auth/authStore";
import { UpgradeCard } from "./UpgradeCard";

/**
 * The sign-up card, for pages that render the same markup either way.
 *
 * Auth is read from the store rather than the request, exactly as
 * `SidebarLayout` and `LoggedOutSignupCta` do: reading the cookie on the server
 * would opt the whole route out of static rendering to decide one card in the
 * sidebar.
 */
export function LoggedOutUpgradeCard() {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
    return null;
  }

  return <UpgradeCard />;
}
