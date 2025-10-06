import { beforeAll } from "vitest";
import { changeLanguage as changeJikiScriptLanguage } from "@jikiscript/translator";
import { changeLanguage as changeJavaScriptLanguage } from "@javascript/translator";
import { changeLanguage as changePythonLanguage } from "@python/translator";

beforeAll(async () => {
  await changeJikiScriptLanguage("system");
  await changeJavaScriptLanguage("system");
  await changePythonLanguage("system");
});
