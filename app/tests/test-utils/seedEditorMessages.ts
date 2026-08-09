import { createTranslator } from "next-intl";
import messages from "@/messages.json";
import { setEditorMessages } from "@/components/coding-exercise/lib/i18n/editorMessages";

/**
 * Seed the editor/test-runner message registry with a real next-intl translator over
 * the `codingExercise` namespace of the English catalog.
 *
 * Call this from any test that asserts on editor/runner copy, so the assertion runs
 * against the actual catalog (including ICU interpolation) rather than the registry's
 * baked-in English fallbacks. Without it, a key renamed or dropped from the catalog
 * would still resolve via DEFAULTS and the drift would go unnoticed.
 *
 * Deliberately not wired into jest.setup.js: this imports `next-intl`, and test files
 * that replace that module wholesale (see InstructionsPanel.test.tsx) would then get an
 * undefined `createTranslator` at setup time.
 */
export function seedEditorMessages(): void {
  setEditorMessages(createTranslator({ locale: "en", messages, namespace: "codingExercise" }));
}
