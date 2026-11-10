import { useState } from "react";
import type { ModalTrigger } from "@/lib/analytics";
import { AccelerateCard } from "./AccelerateCard";
import { NeverGetStuckCard } from "./NeverGetStuckCard";
import { TestimonialsCard } from "./TestimonialsCard";

export interface PremiumUpsellCardProps {
  onUpgradeClick: () => void;
}

interface PremiumUpsellPickerProps {
  // Receives the trigger of the variant that was clicked, so the upgrade funnel
  // can be compared across variants.
  onUpgradeClick: (trigger: ModalTrigger) => void;
}

// The Premium upsell in the dashboard sidebar comes in several variants, so a
// non-Premium learner can see a different pitch on each visit.
export const PREMIUM_UPSELL_VARIANTS = {
  accelerate: AccelerateCard,
  testimonials: TestimonialsCard,
  neverGetStuck: NeverGetStuckCard
} as const;

export type PremiumUpsellVariant = keyof typeof PREMIUM_UPSELL_VARIANTS;

const TRIGGERS = {
  accelerate: "dashboard_sidebar_accelerate",
  testimonials: "dashboard_sidebar_testimonials",
  neverGetStuck: "dashboard_sidebar_never_get_stuck"
} as const satisfies Record<PremiumUpsellVariant, ModalTrigger>;

// Each visit to the dashboard shows the next card in this order, so a learner
// cycles through every pitch rather than seeing the same one each time.
const ROTATION: PremiumUpsellVariant[] = ["accelerate", "testimonials", "neverGetStuck"];

const VISITS_STORAGE_KEY = "dashboard-premium-upsell-visits";

export function PremiumUpsellCard({ onUpgradeClick }: PremiumUpsellPickerProps) {
  // Chosen once per visit, so the card doesn't change while the learner is on the page.
  const [variant] = useState(nextVariant);
  const Card = PREMIUM_UPSELL_VARIANTS[variant];
  return <Card onUpgradeClick={() => onUpgradeClick(TRIGGERS[variant])} />;
}

// The visit count lives in this browser only. With storage blocked (private
// browsing, quota) each visit picks at random, so learners still see a mix.
function nextVariant(): PremiumUpsellVariant {
  let visit: number;
  try {
    visit = Number(localStorage.getItem(VISITS_STORAGE_KEY)) || 0;
    localStorage.setItem(VISITS_STORAGE_KEY, String(visit + 1));
  } catch {
    visit = Math.floor(Math.random() * ROTATION.length);
  }
  return ROTATION[visit % ROTATION.length];
}
