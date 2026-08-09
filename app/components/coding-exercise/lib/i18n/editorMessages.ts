// UI-message registry for the plain-.ts editor + test-runner layer.
//
// CodeMirror extensions (breakpoint gutter, end-of-line info widget) and the
// test-runner scenario modules build DOM/HTML strings outside any React or
// async context, so they cannot call next-intl's `useTranslations`/
// `getTranslations`. This is the "pass-a-key" indirection from
// `.context/i18n.md`: these modules resolve keys through this registry, which a
// React component (with `useTranslations("codingExercise")`) seeds on every
// render via `setEditorMessages`.
//
// Resolution happens per call rather than at construction time, so a locale
// change reaches strings that would otherwise be baked into long-lived objects.
// The gutter markers matter most here: they are created once and reused for
// every redraw, so an eagerly-resolved title would stay frozen at mount locale.
//
// English defaults are baked in so behaviour is correct before seeding.

type EditorMessageKey =
  | "informationTooltip.errorHeading"
  | "informationTooltip.closeAriaLabel"
  | "breakpointGutter.addBreakpoint"
  | "breakpointGutter.removeBreakpoint"
  | "testResults.runtimeError"
  | "testResults.isolatedCheckError"
  | "testResults.isolatedCheckErrorDetail"
  | "testResults.codeCheckError"
  | "testResults.ioError";

// Values may carry ICU params ({message}); a plain function keeps the registry
// framework-agnostic and mirrors next-intl's `(key, values) => string` shape.
type Translate = (key: EditorMessageKey, values?: Record<string, string>) => string;

const DEFAULTS: Record<EditorMessageKey, (values?: Record<string, string>) => string> = {
  "informationTooltip.errorHeading": () => "Oops, something went wrong!",
  "informationTooltip.closeAriaLabel": () => "Close tooltip",
  "breakpointGutter.addBreakpoint": () => "Add breakpoint",
  "breakpointGutter.removeBreakpoint": () => "Remove breakpoint",
  "testResults.runtimeError": () =>
    "Your code hit an error while it was running. Fix the error message above to continue.",
  "testResults.isolatedCheckError": () => "Your code threw an error while running.",
  "testResults.isolatedCheckErrorDetail": (v) => `Your code threw an error while running. (${v?.message ?? ""})`,
  "testResults.codeCheckError": (v) => `Code check error: ${v?.message ?? ""}`,
  "testResults.ioError": (v) => `<p>Error: ${v?.message ?? ""}</p>`
};

let translate: Translate | null = null;

/**
 * Seed the registry with a live translator. Called from a React component that
 * holds `useTranslations("codingExercise")`. Passing a translator scoped to the
 * `codingExercise` namespace means keys here are the leaf paths below it.
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
