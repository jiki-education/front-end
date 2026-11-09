import { nextStepAfter } from "@/lib/modal/modals/hooks/useExerciseCompletionModal";
import type { CompletionResponseData } from "@/components/coding-exercise/lib/types";

const concept: CompletionResponseData = { type: "concept_unlocked", data: { concept_slug: "loops" } };
const challenge: CompletionResponseData = {
  type: "challenge_unlocked",
  data: { challenge: { slug: "space-invaders" } }
};
const upsell: CompletionResponseData = { type: "ask_jiki_upsell", data: {} };

describe("nextStepAfter", () => {
  it("goes straight to completed after rating when there are no events", () => {
    expect(nextStepAfter("difficulty-rating", [])).toBe("completed");
  });

  it("shows the upsell after rating when it is the only event", () => {
    expect(nextStepAfter("difficulty-rating", [upsell])).toBe("ask-jiki-upsell");
  });

  it("shows unlocks before the upsell", () => {
    const events = [upsell, challenge, concept];

    expect(nextStepAfter("difficulty-rating", events)).toBe("concept-unlocked");
    expect(nextStepAfter("concept-unlocked", events)).toBe("challenge-unlocked");
    expect(nextStepAfter("challenge-unlocked", events)).toBe("ask-jiki-upsell");
    expect(nextStepAfter("ask-jiki-upsell", events)).toBe("completed");
  });

  it("skips the upsell when the API did not send it", () => {
    expect(nextStepAfter("concept-unlocked", [concept])).toBe("completed");
  });
});
