import { describe, it, expect } from "vitest";
import { createTranslator } from "../../src/i18n/translator";

/**
 * Mechanism-level proof for the curriculum translator. `createTranslator(dict)`
 * builds a fresh, isolated translator bound to ONE injected locale dict — no
 * global state, no namespaces, no locale switching. Locale selection is entirely
 * app-side (it injects the right dict); the translator only ever sees strings.
 */

describe("createTranslator", () => {
  it("resolves keys and interpolates `{{var}}`", () => {
    const t = createTranslator({ greeting: "Hello {{name}}" });
    expect(t("greeting", { name: "Ada" })).toBe("Hello Ada");
  });

  it("does not escape HTML/`<code>` in messages or interpolations", () => {
    const t = createTranslator({ markup: "Call <code>{{fn}}</code> here." });
    expect(t("markup", { fn: "roll()" })).toBe("Call <code>roll()</code> here.");
  });

  it("resolves nested dotted keys", () => {
    const t = createTranslator({ errors: { unknownDice: "No {{sides}}-sided dice" } });
    expect(t("errors.unknownDice", { sides: 7 })).toBe("No 7-sided dice");
  });

  it("returns the key gracefully for a missing key", () => {
    const t = createTranslator({ greeting: "Hi" });
    expect(t("nope.missing")).toBe("nope.missing");
  });

  it("is constructable from an empty/undefined dict and returns the key", () => {
    const empty = createTranslator({});
    expect(empty("anything")).toBe("anything");

    const none = createTranslator();
    expect(none("anything")).toBe("anything");
  });

  it("keeps independent translators isolated (no cross-dict interference)", () => {
    const a = createTranslator({ msg: "from A" });
    const b = createTranslator({ msg: "from B" });

    expect(a("msg")).toBe("from A");
    expect(b("msg")).toBe("from B");
  });
});
