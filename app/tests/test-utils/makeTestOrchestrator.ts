import Orchestrator from "@/components/coding-exercise/lib/Orchestrator";
import type { ExerciseDefinition, Language } from "@jiki/curriculum";

export function makeTestOrchestrator(
  exercise: ExerciseDefinition,
  opts: { slug?: string; language?: Language } = {}
): Orchestrator {
  return new Orchestrator(
    exercise,
    opts.language ?? "jikiscript",
    { type: "lesson", slug: opts.slug ?? "test-lesson" },
    {}
  );
}
