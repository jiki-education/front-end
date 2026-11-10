import type { ModalTrigger } from "@/lib/analytics";
import { AccelerateCard } from "./AccelerateCard";
import { NeverGetStuckCard } from "./NeverGetStuckCard";
import { TestimonialsCard } from "./TestimonialsCard";
import { ChallengesUpsellCard } from "../ChallengesUpsellCard";

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
  neverGetStuck: NeverGetStuckCard,
  challenges: ChallengesUpsellCard
} as const;

export type PremiumUpsellVariant = keyof typeof PREMIUM_UPSELL_VARIANTS;

const TRIGGERS = {
  accelerate: "dashboard_sidebar_accelerate",
  testimonials: "dashboard_sidebar_testimonials",
  neverGetStuck: "dashboard_sidebar_never_get_stuck",
  challenges: "dashboard_sidebar_challenges"
} as const satisfies Record<PremiumUpsellVariant, ModalTrigger>;

export function PremiumUpsellCard({ onUpgradeClick }: PremiumUpsellPickerProps) {
  const variant = pickVariant();
  const Card = PREMIUM_UPSELL_VARIANTS[variant];
  return <Card onUpgradeClick={() => onUpgradeClick(TRIGGERS[variant])} />;
}

// Rotation between the variants is not switched on yet, so every visit gets
// the Never get stuck card.
function pickVariant(): PremiumUpsellVariant {
  return "neverGetStuck";
}
