import { createTranslator } from "next-intl";
import messages from "@/messages/en.json";
import type { CodingExerciseTranslator } from "@/components/coding-exercise/lib/test-results-types";

/**
 * A real next-intl translator over the `codingExercise` namespace of the English
 * catalog. Tests get genuine ICU resolution (including interpolation), so assertions
 * can be written against the actual copy rather than a key or a stub.
 */
export function makeTestTranslator(): CodingExerciseTranslator {
  return createTranslator({ locale: "en", messages, namespace: "codingExercise" });
}
