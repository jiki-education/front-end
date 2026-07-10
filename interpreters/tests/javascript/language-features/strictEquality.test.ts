import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("JavaScript strict equality feature", () => {
  describe("enforceStrictEquality: true (default)", () => {
    const features = { enforceStrictEquality: true };

    test("using == is a syntax error (StrictEqualityRequired)", () => {
      const code = `let result = 5 == "5";`;
      const { frames, error } = interpret(code, { languageFeatures: features });
      // Loose equality is rejected at parse time, so there are no frames.
      expect(frames).toHaveLength(0);
      expect(error).not.toBeNull();
      expect(error!.type).toBe("StrictEqualityRequired");
      expect(error!.message).toBe("StrictEqualityRequired");
      // The error highlights only the `==` operator, not the whole expression.
      expect(error!.location.relative.begin).toBe(16);
      expect(error!.location.relative.end).toBe(18);
    });

    test("using != is a syntax error (StrictInequalityRequired)", () => {
      const code = `let result = 5 != "5";`;
      const { frames, error } = interpret(code, { languageFeatures: features });
      // Loose inequality is rejected at parse time, so there are no frames.
      expect(frames).toHaveLength(0);
      expect(error).not.toBeNull();
      expect(error!.type).toBe("StrictInequalityRequired");
      expect(error!.message).toBe("StrictInequalityRequired");
      // The error highlights only the `!=` operator, not the whole expression.
      expect(error!.location.relative.begin).toBe(16);
      expect(error!.location.relative.end).toBe(18);
    });

    test("using === works correctly with same types", () => {
      const code = `let result = 5 === 5;`;
      const { frames, error } = interpret(code, { languageFeatures: features });
      expect(error).toBeNull();
      expect(frames[0].status).toBe("SUCCESS");
      expect((frames[0] as TestAugmentedFrame).variables.result.value).toBe(true);
    });

    test("using === works correctly with different types", () => {
      const code = `let result = 5 === "5";`;
      const { frames, error } = interpret(code, { languageFeatures: features });
      expect(error).toBeNull();
      expect(frames[0].status).toBe("SUCCESS");
      expect((frames[0] as TestAugmentedFrame).variables.result.value).toBe(false);
    });

    test("using !== works correctly with same types", () => {
      const code = `let result = 5 !== 5;`;
      const { frames, error } = interpret(code, { languageFeatures: features });
      expect(error).toBeNull();
      expect(frames[0].status).toBe("SUCCESS");
      expect((frames[0] as TestAugmentedFrame).variables.result.value).toBe(false);
    });

    test("using !== works correctly with different types", () => {
      const code = `let result = 5 !== "5";`;
      const { frames, error } = interpret(code, { languageFeatures: features });
      expect(error).toBeNull();
      expect(frames[0].status).toBe("SUCCESS");
      expect((frames[0] as TestAugmentedFrame).variables.result.value).toBe(true);
    });

    test("strict equality with strings", () => {
      const code = `
        let a = "hello" === "hello";
        let b = "hello" !== "world";
        let c = "5" === 5;
      `;
      const { frames, error } = interpret(code, { languageFeatures: features });
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1];
      expect((lastFrame as TestAugmentedFrame).variables.a.value).toBe(true);
      expect((lastFrame as TestAugmentedFrame).variables.b.value).toBe(true);
      expect((lastFrame as TestAugmentedFrame).variables.c.value).toBe(false);
    });

    test("strict equality with booleans", () => {
      const code = `
        let a = true === true;
        let b = false !== true;
        let c = true === 1;
      `;
      const { frames, error } = interpret(code, { languageFeatures: features });
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1];
      expect((lastFrame as TestAugmentedFrame).variables.a.value).toBe(true);
      expect((lastFrame as TestAugmentedFrame).variables.b.value).toBe(true);
      expect((lastFrame as TestAugmentedFrame).variables.c.value).toBe(false);
    });

    test("strict equality with null and undefined", () => {
      const code = `
        let a = null === null;
        let b = undefined === undefined;
        let c = null === undefined;
        let d = null !== undefined;
      `;
      const { frames, error } = interpret(code, { languageFeatures: features });
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1];
      expect((lastFrame as TestAugmentedFrame).variables.a.value).toBe(true);
      expect((lastFrame as TestAugmentedFrame).variables.b.value).toBe(true);
      expect((lastFrame as TestAugmentedFrame).variables.c.value).toBe(false);
      expect((lastFrame as TestAugmentedFrame).variables.d.value).toBe(true);
    });
  });

  describe("enforceStrictEquality: false", () => {
    const features = { enforceStrictEquality: false };

    test("using == works with type coercion", () => {
      const code = `let result = 5 == "5";`;
      const { frames, error } = interpret(code, { languageFeatures: features });
      expect(error).toBeNull();
      expect(frames[0].status).toBe("SUCCESS");
      expect((frames[0] as TestAugmentedFrame).variables.result.value).toBe(true);
    });

    test("using != works with type coercion", () => {
      const code = `let result = 5 != "6";`;
      const { frames, error } = interpret(code, { languageFeatures: features });
      expect(error).toBeNull();
      expect(frames[0].status).toBe("SUCCESS");
      expect((frames[0] as TestAugmentedFrame).variables.result.value).toBe(true);
    });

    test("using === still works strictly", () => {
      const code = `let result = 5 === "5";`;
      const { frames, error } = interpret(code, { languageFeatures: features });
      expect(error).toBeNull();
      expect(frames[0].status).toBe("SUCCESS");
      expect((frames[0] as TestAugmentedFrame).variables.result.value).toBe(false);
    });

    test("using !== still works strictly", () => {
      const code = `let result = 5 !== "5";`;
      const { frames, error } = interpret(code, { languageFeatures: features });
      expect(error).toBeNull();
      expect(frames[0].status).toBe("SUCCESS");
      expect((frames[0] as TestAugmentedFrame).variables.result.value).toBe(true);
    });

    test("loose equality with type coercion examples", () => {
      const code = `
        let a = 0 == false;
        let b = "" == false;
        let c = null == undefined;
        let d = "5" == 5;
        let e = true == 1;
      `;
      const { frames, error } = interpret(code, { languageFeatures: features });
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1];
      expect((lastFrame as TestAugmentedFrame).variables.a.value).toBe(true);
      expect((lastFrame as TestAugmentedFrame).variables.b.value).toBe(true);
      expect((lastFrame as TestAugmentedFrame).variables.c.value).toBe(true);
      expect((lastFrame as TestAugmentedFrame).variables.d.value).toBe(true);
      expect((lastFrame as TestAugmentedFrame).variables.e.value).toBe(true);
    });

    test("both loose and strict equality in same code", () => {
      const code = `
        let loose = 5 == "5";
        let strict = 5 === "5";
        let looseNot = 5 != "5";
        let strictNot = 5 !== "5";
      `;
      const { frames, error } = interpret(code, { languageFeatures: features });
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1];
      expect((lastFrame as TestAugmentedFrame).variables.loose.value).toBe(true);
      expect((lastFrame as TestAugmentedFrame).variables.strict.value).toBe(false);
      expect((lastFrame as TestAugmentedFrame).variables.looseNot.value).toBe(false);
      expect((lastFrame as TestAugmentedFrame).variables.strictNot.value).toBe(true);
    });
  });

  describe("complex expressions with strict equality", () => {
    test("strict equality in if conditions with enforceStrictEquality: true", () => {
      const code = `
        let result = "";
        if (5 === 5) {
          result = "equal";
        }
        if ("hello" !== "world") {
          result = result + " different";
        }
      `;
      const { frames, error } = interpret(code, { languageFeatures: { enforceStrictEquality: true } });
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1];
      expect((lastFrame as TestAugmentedFrame).variables.result.value).toBe("equal different");
    });

    test("strict equality with variables", () => {
      const code = `
        let x = 10;
        let y = "10";
        let z = 10;
        let a = x === y;
        let b = x === z;
        let c = x !== y;
        let d = x !== z;
      `;
      const { frames, error } = interpret(code, { languageFeatures: { enforceStrictEquality: true } });
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1];
      expect((lastFrame as TestAugmentedFrame).variables.a.value).toBe(false);
      expect((lastFrame as TestAugmentedFrame).variables.b.value).toBe(true);
      expect((lastFrame as TestAugmentedFrame).variables.c.value).toBe(true);
      expect((lastFrame as TestAugmentedFrame).variables.d.value).toBe(false);
    });

    test("chained comparisons with strict equality", () => {
      const code = `
        let a = 5;
        let b = 5;
        let c = "5";
        let result1 = (a === b) && (b !== c);
        let result2 = (a === b) || (a === c);
      `;
      const { frames, error } = interpret(code, { languageFeatures: { enforceStrictEquality: true } });
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1];
      expect((lastFrame as TestAugmentedFrame).variables.result1.value).toBe(true);
      expect((lastFrame as TestAugmentedFrame).variables.result2.value).toBe(true);
    });
  });

  describe("default behavior", () => {
    test("default enforces strict equality (enforceStrictEquality: true)", () => {
      const code = `let result = 5 == "5";`;
      const { frames, error } = interpret(code); // No features specified, should use default
      expect(frames).toHaveLength(0);
      expect(error).not.toBeNull();
      expect(error!.type).toBe("StrictEqualityRequired");
    });

    test("strict operators work by default", () => {
      const code = `
        let a = 5 === 5;
        let b = 5 !== "5";
      `;
      const { frames, error } = interpret(code); // No features specified
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1];
      expect((lastFrame as TestAugmentedFrame).variables.a.value).toBe(true);
      expect((lastFrame as TestAugmentedFrame).variables.b.value).toBe(true);
    });
  });
});
