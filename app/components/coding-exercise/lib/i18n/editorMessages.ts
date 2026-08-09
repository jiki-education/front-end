// UI-message registry for the plain-.ts editor + test-runner layer.
//
// CodeMirror extensions (breakpoint gutter, end-of-line info widget) and the
// test-runner scenario modules build DOM/HTML strings outside any React or
// async context, so they cannot call next-intl's `useTranslations`/
// `getTranslations`. This is the "pass-a-key" indirection from
// `.context/i18n.md`: these modules resolve keys through this registry, which a
// React component (with `useTranslations("codingExercise")`) seeds once per
// exercise load via `setEditorMessages`.
//
// English defaults are baked in so behaviour is correct before seeding and in
// unit tests that never mount the provider.

type EditorMessageKey =
  | "informationWidget.errorHeading"
  | "informationWidget.closeAriaLabel"
  | "breakpoint.addBreakpoint"
  | "breakpoint.removeBreakpoint"
  | "testRunner.runtimeErrorAbove"
  | "testRunner.codeThrewError"
  | "testRunner.codeThrewErrorWithDetail"
  | "testRunner.codeCheckError"
  | "testRunner.ioError";

// Values may carry ICU params ({detail}); a plain function keeps the registry
// framework-agnostic and mirrors next-intl's `(key, values) => string` shape.
type Translate = (key: EditorMessageKey, values?: Record<string, string>) => string;

const DEFAULTS: Record<EditorMessageKey, (values?: Record<string, string>) => string> = {
  "informationWidget.errorHeading": () => "Oops, something went wrong!",
  "informationWidget.closeAriaLabel": () => "Close tooltip",
  "breakpoint.addBreakpoint": () => "Add breakpoint",
  "breakpoint.removeBreakpoint": () => "Remove breakpoint",
  "testRunner.runtimeErrorAbove": () =>
    "Your code hit an error while it was running. Fix the error message above to continue.",
  "testRunner.codeThrewError": () => "Your code threw an error while running.",
  "testRunner.codeThrewErrorWithDetail": (v) => `Your code threw an error while running. (${v?.detail ?? ""})`,
  "testRunner.codeCheckError": (v) => `Code check error: ${v?.detail ?? ""}`,
  "testRunner.ioError": (v) => `<p>Error: ${v?.detail ?? ""}</p>`
};

let translate: Translate | null = null;

/**
 * Seed the registry with a live translator. Call once from a React component
 * that holds `useTranslations("codingExercise")`. Passing a translator scoped to
 * the `codingExercise` namespace means keys here are the leaf paths below it.
 */
export function setEditorMessages(t: Translate): void {
  translate = t;
}

/** Resolve an editor/test-runner message, falling back to English defaults. */
export function editorMessage(key: EditorMessageKey, values?: Record<string, string>): string {
  if (translate) {
    return translate(key, values);
  }
  return DEFAULTS[key](values);
}
