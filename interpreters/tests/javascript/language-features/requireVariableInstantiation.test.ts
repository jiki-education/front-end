import { describe, test, expect } from "vitest";
import type { TestAugmentedFrame } from "@shared/frames";
import { interpret } from "@javascript/interpreter";
import { parse } from "@javascript/parser";

describe("requireVariableInstantiation language feature", () => {
  describe("when requireVariableInstantiation is true (default)", () => {
    test("should throw parse error for uninitialized variable declaration", () => {
      const code = `let x;`;
      const languageFeatures = { requireVariableInstantiation: true };

      expect(() => parse(code, { languageFeatures })).toThrow("MissingInitializerInVariableDeclaration");
    });

    test("should allow initialized variable declaration", () => {
      const code = `let x = 5;`;
      const languageFeatures = { requireVariableInstantiation: true };

      const result = interpret(code, { languageFeatures });
      expect(result.error).toBeNull();
      expect(result.frames.length).toBeGreaterThan(0);
    });

    test("should work with default settings (undefined languageFeatures)", () => {
      const code = `let x;`;

      expect(() => parse(code)).toThrow("MissingInitializerInVariableDeclaration");
    });

    test("should work with empty languageFeatures object", () => {
      const code = `let x;`;
      const languageFeatures = {};

      expect(() => parse(code, languageFeatures)).toThrow("MissingInitializerInVariableDeclaration");
    });
  });

  describe("when requireVariableInstantiation is false", () => {
    test("should allow uninitialized variable declaration", () => {
      const code = `let x;`;
      const languageFeatures = { requireVariableInstantiation: false };

      const result = interpret(code, { languageFeatures });
      expect(result.error).toBeNull();
      expect(result.frames.length).toBe(1);

      const frame = result.frames[0];
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result.jikiObject.value).toBeUndefined();
    });

    test("should still allow initialized variable declaration", () => {
      const code = `let x = 5;`;
      const languageFeatures = { requireVariableInstantiation: false };

      const result = interpret(code, { languageFeatures });
      expect(result.error).toBeNull();
      expect(result.frames.length).toBe(1);

      const frame = result.frames[0];
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result.jikiObject.value).toBe(5);
    });

    test("should allow using uninitialized variable (returns undefined)", () => {
      const code = `
        let x;
        x;
      `;
      const languageFeatures = { requireVariableInstantiation: false };

      const result = interpret(code, { languageFeatures });
      expect(result.error).toBeNull();
      expect(result.frames.length).toBe(2);

      const secondFrame = result.frames[1];
      expect(secondFrame.status).toBe("SUCCESS");
      expect(secondFrame.result.jikiObject.value).toBeUndefined();
    });

    test("should allow updating uninitialized variable", () => {
      const code = `
        let x;
        x = 10;
        x;
      `;
      const languageFeatures = { requireVariableInstantiation: false };

      const result = interpret(code, { languageFeatures });
      expect(result.error).toBeNull();
      expect(result.frames.length).toBe(3);

      const lastFrame = result.frames[2];
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result.jikiObject.value).toBe(10);
    });

    test("should work with multiple uninitialized variables", () => {
      const code = `
        let x;
        let y;
        let z = 5;
      `;
      const languageFeatures = { requireVariableInstantiation: false };

      const result = interpret(code, { languageFeatures });
      expect(result.error).toBeNull();
      expect(result.frames.length).toBe(3);

      expect(result.frames[0].result.jikiObject.value).toBeUndefined();
      expect(result.frames[1].result.jikiObject.value).toBeUndefined();
      expect(result.frames[2].result.jikiObject.value).toBe(5);
    });

    test("should work in blocks with uninitialized variables", () => {
      const code = `
        {
          let x;
          x = 5;
        }
      `;
      const languageFeatures = { requireVariableInstantiation: false };

      const result = interpret(code, { languageFeatures });
      expect(result.error).toBeNull();
      expect(result.frames.length).toBe(2); // declaration, assignment
    });

    test("should work with shadowing and uninitialized variables", () => {
      const code = `
        let x = 10;
        {
          let x;
          x = 20;
        }
      `;
      const languageFeatures = {
        requireVariableInstantiation: false,
        allowShadowing: true,
      };

      const result = interpret(code, { languageFeatures });
      expect(result.error).toBeNull();
      expect(result.frames.length).toBe(3); // outer declaration, inner declaration, assignment
    });

    test("should work in if statements", () => {
      const code = `
        if (true) {
          let x;
          x = 5;
        }
      `;
      const languageFeatures = { requireVariableInstantiation: false };

      const result = interpret(code, { languageFeatures });
      expect(result.error).toBeNull();

      // Find the variable declaration frame
      const declarationFrame = result.frames.find(f => f.result?.type === "VariableDeclaration");
      expect(declarationFrame).toBeDefined();
      expect(declarationFrame?.result.jikiObject.value).toBeUndefined();
    });

    // TODO: Enable when typeof operator is implemented
    // test("should allow operations on uninitialized variables", () => {
    //   const code = `
    //     let x;
    //     typeof x;
    //   `;
    //   const languageFeatures = { requireVariableInstantiation: false };
    //
    //   const result = interpret(code, { languageFeatures });
    //   expect(result.error).toBeNull();
    //
    //   const lastFrame = result.frames[result.frames.length - 1];
    //   expect(lastFrame.result.jikiObject.value).toBe("undefined");
    // });
  });

  describe("frame descriptions", () => {
    test("should have correct description for uninitialized variable", () => {
      const code = `let x;`;
      const languageFeatures = { requireVariableInstantiation: false };

      const result = interpret(code, { languageFeatures });
      expect(result.error).toBeNull();
      expect(result.frames.length).toBeGreaterThan(0);

      const frame = result.frames[0];
      expect(frame).toBeDefined();
      expect((frame as TestAugmentedFrame).description).toBeDefined();
      expect(typeof (frame as TestAugmentedFrame).description).toBe("string");
      expect((frame as TestAugmentedFrame).description).toContain("Declared variable");
      expect((frame as TestAugmentedFrame).description).toContain("<code>x</code>");
      expect((frame as TestAugmentedFrame).description).toContain("undefined");
    });

    test("should have correct description for initialized variable", () => {
      const code = `let x = 42;`;
      const languageFeatures = { requireVariableInstantiation: false };

      const result = interpret(code, { languageFeatures });
      const frame = result.frames[0];

      expect((frame as TestAugmentedFrame).description).toContain("Declared variable");
      expect((frame as TestAugmentedFrame).description).toContain("<code>x</code>");
      expect((frame as TestAugmentedFrame).description).toContain("42");
    });
  });
});
