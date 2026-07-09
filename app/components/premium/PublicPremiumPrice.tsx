"use client";

import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/auth/authStore";
import { useExternalPremiumPrices } from "@/lib/hooks/useExternalPremiumPrices";
import { formatMonthlyPrice } from "@/lib/pricing";

export function PublicPremiumPrice() {
  const t = useTranslations("premium.publicPrice");
  const user = useAuthStore((state) => state.user);
  // Authenticated users already carry their geolocated prices on the user
  // object, so only logged-out visitors need the public pricing lookup.
  const publicPrices = useExternalPremiumPrices({ enabled: !user });

  const prices = user?.premium_prices ?? publicPrices;
  if (!prices) {
    return <>{t("unavailable")}</>;
  }

  return <>{formatMonthlyPrice(prices)}</>;
}
