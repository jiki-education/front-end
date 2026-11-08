import { useTranslations } from "next-intl";
import { formatPrice } from "@/lib/pricing";
import type { SubscriptionDetails } from "@/types/subscription";

/**
 * A legacy subscriber's renewal price with its interval, e.g. "£7.99/month".
 * The amount comes from the subscription itself, so it matches what Stripe
 * charges even if the user's country now maps to a different currency.
 * Returns null when the API hasn't stored the amount yet.
 */
export function useSubscriptionPrice(subscription: SubscriptionDetails | null): string | null {
  const t = useTranslations("settings.subscriptionStatus");

  if (!subscription || subscription.amount_in_cents === null || !subscription.currency) {
    return null;
  }

  const price = formatPrice(subscription.amount_in_cents, subscription.currency);
  return subscription.interval === "annual" ? t("pricePerYear", { price }) : t("pricePerMonth", { price });
}
