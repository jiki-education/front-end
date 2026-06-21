"use client";

import BetaTag from "@/components/common/BetaTag";
import { useAuthStore } from "@/lib/auth/authStore";

/**
 * The concept pages are visible to logged-out visitors, who should not see the
 * beta banner. Renders BetaTag only for authenticated users.
 */
export default function ConceptsBetaTag() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    return null;
  }
  return <BetaTag />;
}
