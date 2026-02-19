import { describe, it, expect } from "vitest";
import { interpret } from "@javascript/interpreter";

describe("allowedGlobals", () => {
  it("all globals available when allowedGlobals is not set", () => {
    const result = interpret(`
      console.log("hi");
      let x = Math.randomInt(1, 1);
      let y = Number("42");
    `);
    expect(result.success).toBe(true);
  });

  it("allows only listed globals", () => {
    const result = interpret(`let x = Number("42");`, {
      languageFeatures: { allowedGlobals: ["Number"] },
    });
    expect(result.success).toBe(true);
    expect((result.frames[0] as any).variables.x.value).toBe(42);
  });

  it("blocks console when not in allowedGlobals", () => {
    const result = interpret(`console.log("hi");`, {
      languageFeatures: { allowedGlobals: ["Number"] },
    });
    expect(result.success).toBe(false);
    expect(result.frames[0].status).toBe("ERROR");
    expect(result.frames[0].error?.type).toBe("VariableNotDeclared");
  });

  it("blocks Math when not in allowedGlobals", () => {
    const result = interpret(`let x = Math.randomInt(1, 1);`, {
      languageFeatures: { allowedGlobals: ["console"] },
    });
    expect(result.success).toBe(false);
    expect(result.frames[0].status).toBe("ERROR");
    expect(result.frames[0].error?.type).toBe("VariableNotDeclared");
  });

  it("blocks Number when not in allowedGlobals", () => {
    const result = interpret(`let x = Number("42");`, {
      languageFeatures: { allowedGlobals: ["console", "Math"] },
    });
    expect(result.success).toBe(false);
    expect(result.frames[0].status).toBe("ERROR");
    expect(result.frames[0].error?.type).toBe("VariableNotDeclared");
  });

  it("blocks all globals with empty list", () => {
    const result = interpret(`console.log("hi");`, {
      languageFeatures: { allowedGlobals: [] },
    });
    expect(result.success).toBe(false);
    expect(result.frames[0].status).toBe("ERROR");
    expect(result.frames[0].error?.type).toBe("VariableNotDeclared");
  });
});
