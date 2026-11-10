import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

const FEATURE_KEYS = [
  "featureAi",
  "featureChallenges",
  "featureLivestreams",
  "featureDeepDives",
  "featureCertificates",
  "featureAdFree",
  "featureEarlyAccess"
] as const;

// Everything Premium includes, in the order the upgrade modal lists it. Every
// list of Premium's features reads from here, so they cannot drift apart.
export function usePremiumFeatures(): { key: string; content: ReactNode }[] {
  const t = useTranslations("modals.premiumUpgrade");
  const strong = (chunks: ReactNode) => <strong>{chunks}</strong>;
  return FEATURE_KEYS.map((key) => ({ key, content: t.rich(key, { strong }) }));
}
