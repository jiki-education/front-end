import { beforeAll } from "vitest";
import { changeLanguage as changeJikiScriptLanguage } from "@jikiscript/translator";
import { changeLanguage as changePythonLanguage } from "@python/translator";

// The JavaScript interpreter no longer has a global language: the active locale's
// message dict is injected per run via `EvaluationContext.localeMessages`, and it
// defaults to the `system` pseudo-locale when nothing is injected — so JS tests get
// `system` for free. Tests that assert English inject `{ localeMessages: enMessages }`.
beforeAll(async () => {
  await changeJikiScriptLanguage("system");
  await changePythonLanguage("system");
});
