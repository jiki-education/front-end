"use client";

import { useAuthStore } from "@/lib/auth/authStore";
import { formatPremiumPrice } from "@/lib/pricing";

// The one-off Premium price for the signed-in user's country. Renders nothing
// before the user has loaded.
export function PremiumPrice() {
  const user = useAuthStore((state) => state.user);
  if (!user) {
    return <></>;
  }

  return <>{formatPremiumPrice(user.premium_prices)}</>;
}
