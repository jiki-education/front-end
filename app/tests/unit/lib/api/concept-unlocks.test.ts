import { expandUnlocked } from "@/lib/api/concept-unlocks";
import type { ConceptMeta } from "@/types/concepts";

type MiniConcept = Pick<ConceptMeta, "slug" | "parentSlug">;

const concepts: MiniConcept[] = [
  { slug: "functions", parentSlug: null },
  { slug: "using-functions", parentSlug: "functions" },
  { slug: "using-functions-with-inputs", parentSlug: "functions" },
  { slug: "loops", parentSlug: null },
  { slug: "repeat", parentSlug: "loops" }
];

describe("expandUnlocked", () => {
  it("unlocks a parent category when one of its children is unlocked", () => {
    const result = expandUnlocked(concepts, ["using-functions"]);
    expect(result.has("using-functions")).toBe(true);
    expect(result.has("functions")).toBe(true);
  });

  it("does not unlock children when only the parent is unlocked", () => {
    const result = expandUnlocked(concepts, ["functions"]);
    expect(result.has("functions")).toBe(true);
    expect(result.has("using-functions")).toBe(false);
    expect(result.has("using-functions-with-inputs")).toBe(false);
  });

  it("leaves a category locked when none of its children are unlocked", () => {
    const result = expandUnlocked(concepts, ["repeat"]);
    expect(result.has("loops")).toBe(true);
    expect(result.has("functions")).toBe(false);
  });

  it("returns an empty set for no unlocks", () => {
    expect(expandUnlocked(concepts, []).size).toBe(0);
  });

  it("tolerates unlocked slugs that are not in the concept list", () => {
    const result = expandUnlocked(concepts, ["unknown-slug"]);
    expect(result.has("unknown-slug")).toBe(true);
    expect(result.size).toBe(1);
  });
});
