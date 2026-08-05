import Orchestrator from "@/components/coding-exercise/lib/Orchestrator";
import type { ExerciseDefinition, ExerciseLessonSlug, Language } from "@jiki/curriculum";

export function makeTestOrchestrator(
  exercise: ExerciseDefinition,
  opts: { slug?: ExerciseLessonSlug; language?: Language } = {}
): Orchestrator {
  return new Orchestrator({
    exercise,
    language: opts.language ?? "jikiscript",
    context: { type: "lesson", slug: opts.slug ?? "maze-solve-basic" },
    interpreterLocaleMessages: {},
    exerciseLocaleMessages: {},
    contentHash: "",
    onGoToDashboard: () => {},
    levelTitle: "",
    isCompleted: false
  });
}
