"use client";

import { useAuthStore } from "@/lib/auth/authStore";
import ExternalButtons from "./ExternalButtons";
import InternalButtons from "./InternalButtons";

// Picks the header based on client auth state. Isolated as a client component so
// HeaderLayout itself can stay a server component (and render the server-side
// LocaleBanner).
export function Buttons() {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <InternalButtons /> : <ExternalButtons />;
}
