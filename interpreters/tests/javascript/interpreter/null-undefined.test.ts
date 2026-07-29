import { describe, expect, test } from "vitest";
import { interpret } from "@javascript/interpreter";

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

    // Comparing against undefined is an error in Jiki (see the "undefined literal"
    // block below). The undefined literal is used inline so the comparison - not
    // the assignment guard - is what fires.
    test("null compared with undefined errors", () => {
      const code = `let strictEqual = null === undefined;`;
      const result = interpret(code);
      expect(result.error).toBe(null);
      expect(result.success).toBe(false);
      const lastFrame = result.frames[result.frames.length - 1];
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("ComparisonWithUndefined");
    });

    test("null == undefined with strict equality enforcement disabled errors", () => {
      const code = `let looseEqual = null == undefined;`;
      const result = interpret(code, { languageFeatures: { enforceStrictEquality: false } });
      expect(result.error).toBe(null);
      expect(result.success).toBe(false);
      const lastFrame = result.frames[result.frames.length - 1];
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("ComparisonWithUndefined");
    });
  });

  describe("undefined literal", () => {
    // Storing undefined in a variable is an error - a variable should always hold
    // an actual value. This matches JikiScript, which has no undefined at all.
    test("assigning undefined errors", () => {
      const code = "let x = undefined;";
      const result = interpret(code);
      expect(result.error).toBe(null);
      expect(result.success).toBe(false);
      const lastFrame = result.frames[result.frames.length - 1];
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("AssignmentToUndefined");
    });

    // Reading past the end of a string/array, a forgotten return, a missing value:
    // undefined is almost always a symptom of a mistake, so comparing with it is an
    // error rather than a silent boolean. This matches Python and JikiScript. The
    // undefined literal is used inline so the comparison fires before any storage.
    test("comparing a value with undefined errors", () => {
      const code = `let result = (5 === undefined);`;
      const result = interpret(code);
      expect(result.error).toBe(null);
      expect(result.success).toBe(false);
      const lastFrame = result.frames[result.frames.length - 1];
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("ComparisonWithUndefined");
    });

    test("comparing two undefined values errors", () => {
      const code = `let same = undefined === undefined;`;
      const result = interpret(code);
      expect(result.error).toBe(null);
      expect(result.success).toBe(false);
      const lastFrame = result.frames[result.frames.length - 1];
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("ComparisonWithUndefined");
    });

    // Comparing the result of a function that returns nothing is a completely
    // normal mistake (unlike conjuring an `undefined` literal), so it gets its own
    // clearer message rather than the generic "open an issue" catch-all.
    test("comparing the result of a non-returning function errors with a specific message", () => {
      const code = `function nothing() {}\nlet r = nothing() === 5;`;
      const result = interpret(code);
      expect(result.error).toBe(null);
      expect(result.success).toBe(false);
      const lastFrame = result.frames[result.frames.length - 1];
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("ComparisonWithUndefinedFromFunction");
    });

    // The error carries the offending function's name so the message can point the
    // student at the specific function to fix. Assert on the structured context
    // (tests run in the "system" language, not English).
    test("the specific error carries the function name as context", () => {
      const code = `function nothing() {}\nlet r = nothing() === 5;`;
      const result = interpret(code);
      const lastFrame = result.frames[result.frames.length - 1];
      expect(lastFrame.error?.type).toBe("ComparisonWithUndefinedFromFunction");
      expect(lastFrame.error?.context?.name).toBe("nothing");
    });

    // The error must highlight the offending operand (the call), not the whole line.
    test("the error is anchored on the undefined operand, not the full comparison", () => {
      const code = `function nothing() {}\nlet r = nothing() === 5;`;
      const result = interpret(code);
      const lastFrame = result.frames[result.frames.length - 1];
      const line2 = code.split("\n")[1];
      const begin = line2.indexOf("nothing()") + 1;
      expect(lastFrame.error?.location.line).toBe(2);
      expect(lastFrame.error?.location.relative.begin).toBe(begin);
      expect(lastFrame.error?.location.relative.end).toBe(begin + "nothing()".length);
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

    // undefined can't be stored, so it's exercised inline via a void function call.
    test("undefined is falsy with truthiness enabled", () => {
      const code = `
        function nothing() {
          let z = 1;
        }
        let result = false;
        if (!nothing()) {
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
        function nothing() {
          let z = 1;
        }
        if (nothing()) {
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

    // Logical operators whose result is an actual value can be stored...
    test("logical operators producing a value can be stored", () => {
      const code = `
        let a = undefined || 10;
        let c = 10 || undefined;
      `;
      const result = interpret(code, { languageFeatures: { allowTruthiness: true } });
      expect(result.error).toBe(null);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1];
      expect((lastFrame as any).variables.a.value).toBe(10);
      expect((lastFrame as any).variables.c.value).toBe(10);
    });

    // ...but ones that short-circuit to undefined cannot.
    test("logical operators producing undefined cannot be stored", () => {
      for (const code of [`let b = undefined && 10;`, `let d = 10 && undefined;`]) {
        const result = interpret(code, { languageFeatures: { allowTruthiness: true } });
        expect(result.error).toBe(null);
        expect(result.success).toBe(false);
        const lastFrame = result.frames[result.frames.length - 1];
        expect(lastFrame.status).toBe("ERROR");
        expect(lastFrame.error?.type).toBe("AssignmentToUndefined");
      }
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

    // undefined can't be stored, so it reaches the template inline via a void call.
    // The interpolated result is a string, so storing that is fine.
    test("undefined in template literal", () => {
      const code = "function nothing() { let z = 1; } let result = `value: ${nothing()}`;";
      const result = interpret(code);
      expect(result.error).toBe(null);
      expect(result.success).toBe(true);
      expect((result.frames[result.frames.length - 1] as any).variables.result.value).toBe("value: undefined");
    });
  });
});
