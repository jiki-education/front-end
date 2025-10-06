import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";
import { RuntimeErrorType } from "@javascript/executor";
import { Frame } from "@shared/frames";

function expectFrameToBeError(frame: Frame, code: string, type: RuntimeErrorType) {
  expect(frame.code.trim()).toBe(code.trim());
  expect(frame.status).toBe("ERROR");
  expect(frame.error).not.toBeNull();
  expect(frame.error!.category).toBe("RuntimeError");
  expect(frame.error!.type).toBe(type);
}

describe("JavaScript truthiness feature", () => {
  describe("allowTruthiness: true", () => {
    const features = { allowTruthiness: true };

    describe("if statements", () => {
      test("numbers - 0 is falsy", () => {
        const code = `
          let result = "not run";
          if (0) {
            result = "truthy";
          } else {
            result = "falsy";
          }
        `;
        const { frames, error } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe("falsy");
      });

      test("numbers - non-zero is truthy", () => {
        const code = `
          let result = "not run";
          if (42) {
            result = "truthy";
          } else {
            result = "falsy";
          }
        `;
        const { frames, error } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe("truthy");
      });

      test("strings - empty string is falsy", () => {
        const code = `
          let result = "not run";
          if ("") {
            result = "truthy";
          } else {
            result = "falsy";
          }
        `;
        const { frames, error } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe("falsy");
      });

      test("strings - non-empty string is truthy", () => {
        const code = `
          let result = "not run";
          if ("hello") {
            result = "truthy";
          } else {
            result = "falsy";
          }
        `;
        const { frames, error } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe("truthy");
      });

      test("null is falsy", () => {
        const code = `
          let result = "not run";
          if (null) {
            result = "truthy";
          } else {
            result = "falsy";
          }
        `;
        const { frames, error } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe("falsy");
      });

      test("undefined is falsy", () => {
        const code = `
          let result = "not run";
          if (undefined) {
            result = "truthy";
          } else {
            result = "falsy";
          }
        `;
        const { frames, error } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe("falsy");
      });
    });

    describe("logical operators", () => {
      test("AND with truthy values", () => {
        const code = `let result = 5 && "hello";`;
        const { frames, error } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe("hello");
      });

      test("AND with falsy value", () => {
        const code = `let result = 0 && "hello";`;
        const { frames, error } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe(0);
      });

      test("OR with falsy then truthy", () => {
        const code = `let result = 0 || "default";`;
        const { frames, error } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe("default");
      });

      test("OR with truthy first", () => {
        const code = `let result = "first" || "second";`;
        const { frames, error } = interpret(code, { languageFeatures: features });
        expect(error).toBeNull();
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe("first");
      });
    });
  });

  describe("allowTruthiness: false (default)", () => {
    describe("if statements", () => {
      test("number in condition throws error", () => {
        const code = "if (42) { let x = 1; }";
        const { frames } = interpret(code);
        expectFrameToBeError(frames[0], "42", "TruthinessDisabled");
        expect(frames[0].error!.message).toBe("TruthinessDisabled: value: number");
      });

      test("string in condition throws error", () => {
        const code = 'if ("hello") { let x = 1; }';
        const { frames } = interpret(code);
        expectFrameToBeError(frames[0], '"hello"', "TruthinessDisabled");
        expect(frames[0].error!.message).toBe("TruthinessDisabled: value: string");
      });

      test("null in condition throws error", () => {
        const code = "if (null) { let x = 1; }";
        const { frames } = interpret(code);
        expectFrameToBeError(frames[0], "null", "TruthinessDisabled");
        expect(frames[0].error!.message).toBe("TruthinessDisabled: value: null");
      });

      test("undefined in condition throws error", () => {
        const code = "if (undefined) { let x = 1; }";
        const { frames } = interpret(code);
        expectFrameToBeError(frames[0], "undefined", "TruthinessDisabled");
        expect(frames[0].error!.message).toBe("TruthinessDisabled: value: undefined");
      });

      test("boolean values work correctly", () => {
        const code = `
          let result = "not run";
          if (true) {
            result = "true branch";
          }
          if (false) {
            result = "false branch";
          } else {
            result = "else branch";
          }
        `;
        const { frames, error } = interpret(code);
        expect(error).toBeNull();
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe("else branch");
      });

      test("comparison expressions work", () => {
        const code = `
          let result = "not run";
          if (5 > 3) {
            result = "comparison true";
          }
        `;
        const { frames, error } = interpret(code);
        expect(error).toBeNull();
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe("comparison true");
      });
    });

    describe("logical operators", () => {
      test("AND with number on left throws error", () => {
        const code = "let result = 5 && true;";
        const { frames } = interpret(code);
        expectFrameToBeError(frames[0], "5", "TruthinessDisabled");
        expect(frames[0].error!.message).toBe("TruthinessDisabled: value: number");
      });

      test("AND with string on right throws error", () => {
        const code = 'let result = true && "hello";';
        const { frames } = interpret(code);
        expectFrameToBeError(frames[0], '"hello"', "TruthinessDisabled");
        expect(frames[0].error!.message).toBe("TruthinessDisabled: value: string");
      });

      test("OR with number on left throws error", () => {
        const code = "let result = 0 || true;";
        const { frames } = interpret(code);
        expectFrameToBeError(frames[0], "0", "TruthinessDisabled");
        expect(frames[0].error!.message).toBe("TruthinessDisabled: value: number");
      });

      test("OR with null on left throws error", () => {
        const code = "let result = null || true;";
        const { frames } = interpret(code);
        expectFrameToBeError(frames[0], "null", "TruthinessDisabled");
        expect(frames[0].error!.message).toBe("TruthinessDisabled: value: null");
      });

      test("AND with booleans works", () => {
        const code = `
          let result1 = true && false;
          let result2 = true && true;
          let result3 = false && true;
        `;
        const { frames, error } = interpret(code);
        expect(error).toBeNull();
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result1.value).toBe(false);
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result2.value).toBe(true);
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result3.value).toBe(false);
      });

      test("OR with booleans works", () => {
        const code = `
          let result1 = true || false;
          let result2 = false || false;
          let result3 = false || true;
        `;
        const { frames, error } = interpret(code);
        expect(error).toBeNull();
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result1.value).toBe(true);
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result2.value).toBe(false);
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result3.value).toBe(true);
      });
    });
  });

  describe("explicit allowTruthiness: false", () => {
    test("truthiness disabled when explicitly set to false", () => {
      const code = "if (1) { let x = 5; }";
      const { frames } = interpret(code, { languageFeatures: { allowTruthiness: false } });
      expectFrameToBeError(frames[0], "1", "TruthinessDisabled");
      expect(frames[0].error!.message).toBe("TruthinessDisabled: value: number");
    });
  });
});
