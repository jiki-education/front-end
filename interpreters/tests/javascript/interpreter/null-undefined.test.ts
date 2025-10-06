import { describe, expect, test } from "vitest";
import { interpret } from "../../../src/javascript/interpreter";

describe("JavaScript Interpreter: null and undefined", () => {
  describe("null literal", () => {
    test("null assignment", () => {
      const code = "let x = null;";
      const result = interpret(code);
      expect(result.error).toBe(null);
      expect(result.success).toBe(true);
      expect(result.frames).toHaveLength(1);
      expect((result.frames[0] as any).variables.x.toString()).toBe("null");
      expect((result.frames[0] as any).variables.x.value).toBe(null);
    });

    test("null in expressions", () => {
      const code = `
        let a = null;
        let b = 5;
        let result = (a === null);
      `;
      const result = interpret(code);
      expect(result.error).toBe(null);
      expect(result.success).toBe(true);
      expect((result.frames[result.frames.length - 1] as any).variables.result.value).toBe(true);
    });

    test("null comparison", () => {
      const code = `
        let x = null;
        let y = null;
        let same = x === y;
      `;
      const result = interpret(code);
      expect(result.error).toBe(null);
      expect(result.success).toBe(true);
      expect((result.frames[result.frames.length - 1] as any).variables.same.value).toBe(true);
    });

    test("null vs undefined", () => {
      const code = `
        let a = null;
        let b = undefined;
        let strictEqual = a === b;
      `;
      const result = interpret(code);
      expect(result.error).toBe(null);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1];
      expect((lastFrame as any).variables.strictEqual.value).toBe(false);
    });

    test("null == undefined with strict equality enforcement disabled", () => {
      const code = `
        let a = null;
        let b = undefined;
        let looseEqual = a == b;
      `;
      const result = interpret(code, { languageFeatures: { enforceStrictEquality: false } });
      expect(result.error).toBe(null);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1];
      expect((lastFrame as any).variables.looseEqual.value).toBe(true);
    });
  });

  describe("undefined literal", () => {
    test("undefined assignment", () => {
      const code = "let x = undefined;";
      const result = interpret(code);
      expect(result.error).toBe(null);
      expect(result.success).toBe(true);
      expect(result.frames).toHaveLength(1);
      expect((result.frames[0] as any).variables.x.toString()).toBe("undefined");
      expect((result.frames[0] as any).variables.x.value).toBe(undefined);
    });

    test("undefined in expressions", () => {
      const code = `
        let a = undefined;
        let b = 5;
        let result = (a === undefined);
      `;
      const result = interpret(code);
      expect(result.error).toBe(null);
      expect(result.success).toBe(true);
      expect((result.frames[result.frames.length - 1] as any).variables.result.value).toBe(true);
    });

    test("undefined comparison", () => {
      const code = `
        let x = undefined;
        let y = undefined;
        let same = x === y;
      `;
      const result = interpret(code);
      expect(result.error).toBe(null);
      expect(result.success).toBe(true);
      expect((result.frames[result.frames.length - 1] as any).variables.same.value).toBe(true);
    });

    test("uninitialized variable with requireVariableInstantiation disabled", () => {
      const code = "let x;";
      const result = interpret(code, { languageFeatures: { requireVariableInstantiation: false } });
      expect(result.error).toBe(null);
      expect(result.success).toBe(true);
      expect(result.frames).toHaveLength(1);
      expect((result.frames[0] as any).variables.x.value).toBe(undefined);
    });
  });

  describe("null and undefined with truthiness", () => {
    test("null is falsy with truthiness enabled", () => {
      const code = `
        let x = null;
        let result = false;
        if (!x) {
          result = true;
        }
      `;
      const result = interpret(code, { languageFeatures: { allowTruthiness: true } });
      expect(result.error).toBe(null);
      expect(result.success).toBe(true);
      expect((result.frames[result.frames.length - 1] as any).variables.result.value).toBe(true);
    });

    test("undefined is falsy with truthiness enabled", () => {
      const code = `
        let x = undefined;
        let result = false;
        if (!x) {
          result = true;
        }
      `;
      const result = interpret(code, { languageFeatures: { allowTruthiness: true } });
      expect(result.error).toBe(null);
      expect(result.success).toBe(true);
      expect((result.frames[result.frames.length - 1] as any).variables.result.value).toBe(true);
    });

    test("null in if statement with truthiness disabled should error", () => {
      const code = `
        let x = null;
        if (x) {
          let y = 1;
        }
      `;
      const result = interpret(code, { languageFeatures: { allowTruthiness: false } });
      expect(result.error).toBe(null);
      expect(result.success).toBe(false);
      expect(result.frames[result.frames.length - 1].status).toBe("ERROR");
      expect(result.frames[result.frames.length - 1].error?.type).toBe("TruthinessDisabled");
    });

    test("undefined in if statement with truthiness disabled should error", () => {
      const code = `
        let x = undefined;
        if (x) {
          let y = 1;
        }
      `;
      const result = interpret(code, { languageFeatures: { allowTruthiness: false } });
      expect(result.error).toBe(null);
      expect(result.success).toBe(false);
      expect(result.frames[result.frames.length - 1].status).toBe("ERROR");
      expect(result.frames[result.frames.length - 1].error?.type).toBe("TruthinessDisabled");
    });
  });

  describe("null and undefined with operators", () => {
    test("null with logical operators", () => {
      const code = `
        let a = null || 5;
        let b = null && 5;
        let c = 5 || null;
        let d = 5 && null;
      `;
      const result = interpret(code, { languageFeatures: { allowTruthiness: true } });
      expect(result.error).toBe(null);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1];
      expect((lastFrame as any).variables.a.value).toBe(5);
      expect((lastFrame as any).variables.b.value).toBe(null);
      expect((lastFrame as any).variables.c.value).toBe(5);
      expect((lastFrame as any).variables.d.value).toBe(null);
    });

    test("undefined with logical operators", () => {
      const code = `
        let a = undefined || 10;
        let b = undefined && 10;
        let c = 10 || undefined;
        let d = 10 && undefined;
      `;
      const result = interpret(code, { languageFeatures: { allowTruthiness: true } });
      expect(result.error).toBe(null);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1];
      expect((lastFrame as any).variables.a.value).toBe(10);
      expect((lastFrame as any).variables.b.value).toBe(undefined);
      expect((lastFrame as any).variables.c.value).toBe(10);
      expect((lastFrame as any).variables.d.value).toBe(undefined);
    });
  });

  describe("null and undefined type coercion", () => {
    test("null + number with type coercion enabled", () => {
      const code = "let x = null + 5;";
      const result = interpret(code, { languageFeatures: { allowTypeCoercion: true } });
      expect(result.error).toBe(null);
      expect(result.success).toBe(true);
      expect((result.frames[0] as any).variables.x.value).toBe(5); // null coerces to 0
    });

    test("null + number with type coercion disabled", () => {
      const code = "let x = null + 5;";
      const result = interpret(code, { languageFeatures: { allowTypeCoercion: false } });
      expect(result.error).toBe(null);
      expect(result.success).toBe(false);
      expect(result.frames[0].status).toBe("ERROR");
      expect(result.frames[0].error?.type).toBe("TypeCoercionNotAllowed");
    });

    test("undefined + number with type coercion enabled", () => {
      const code = "let x = undefined + 5;";
      const result = interpret(code, { languageFeatures: { allowTypeCoercion: true } });
      expect(result.error).toBe(null);
      expect(result.success).toBe(true);
      expect((result.frames[0] as any).variables.x.toString()).toBe("NaN");
    });

    test("undefined + number with type coercion disabled", () => {
      const code = "let x = undefined + 5;";
      const result = interpret(code, { languageFeatures: { allowTypeCoercion: false } });
      expect(result.error).toBe(null);
      expect(result.success).toBe(false);
      expect(result.frames[0].status).toBe("ERROR");
      expect(result.frames[0].error?.type).toBe("TypeCoercionNotAllowed");
    });

    test("null + string with type coercion enabled", () => {
      const code = 'let x = null + "test";';
      const result = interpret(code, { languageFeatures: { allowTypeCoercion: true } });
      expect(result.error).toBe(null);
      expect(result.success).toBe(true);
      expect((result.frames[0] as any).variables.x.value).toBe("nulltest");
    });

    test("undefined + string with type coercion enabled", () => {
      const code = 'let x = undefined + "test";';
      const result = interpret(code, { languageFeatures: { allowTypeCoercion: true } });
      expect(result.error).toBe(null);
      expect(result.success).toBe(true);
      expect((result.frames[0] as any).variables.x.value).toBe("undefinedtest");
    });
  });

  describe("null and undefined in template literals", () => {
    test("null in template literal", () => {
      const code = "let x = null; let result = `value: ${x}`;";
      const result = interpret(code);
      expect(result.error).toBe(null);
      expect(result.success).toBe(true);
      expect((result.frames[result.frames.length - 1] as any).variables.result.value).toBe("value: null");
    });

    test("undefined in template literal", () => {
      const code = "let x = undefined; let result = `value: ${x}`;";
      const result = interpret(code);
      expect(result.error).toBe(null);
      expect(result.success).toBe(true);
      expect((result.frames[result.frames.length - 1] as any).variables.result.value).toBe("value: undefined");
    });
  });
});
