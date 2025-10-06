import { interpret } from "@python/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";
import { RuntimeErrorType } from "@python/executor";
import { Frame } from "@shared/frames";

function expectFrameToBeError(frame: Frame, code: string, type: RuntimeErrorType) {
  expect(frame.code.trim()).toBe(code.trim());
  expect(frame.status).toBe("ERROR");
  expect(frame.error).not.toBeNull();
  expect(frame.error!.category).toBe("RuntimeError");
  expect(frame.error!.type).toBe(type);
}

describe("Python truthiness feature", () => {
  describe("allowTruthiness: true", () => {
    const features = { languageFeatures: { allowTruthiness: true } };

    describe("not operator", () => {
      test("numbers - 0 is falsy", () => {
        const code = `result = "not run"
if not 0:
    result = "falsy"
else:
    result = "truthy"`;
        const { frames, error } = interpret(code, features);
        expect(error).toBeNull();
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe("falsy");
      });

      test("numbers - non-zero is truthy", () => {
        const code = `result = "not run"
if not 42:
    result = "falsy"
else:
    result = "truthy"`;
        const { frames, error } = interpret(code, features);
        expect(error).toBeNull();
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe("truthy");
      });

      test("strings - empty string is falsy", () => {
        const code = `result = "not run"
if not "":
    result = "falsy"
else:
    result = "truthy"`;
        const { frames, error } = interpret(code, features);
        expect(error).toBeNull();
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe("falsy");
      });

      test("strings - non-empty string is truthy", () => {
        const code = `result = "not run"
if not "hello":
    result = "falsy"
else:
    result = "truthy"`;
        const { frames, error } = interpret(code, features);
        expect(error).toBeNull();
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe("truthy");
      });

      test("None is falsy", () => {
        const code = `result = "not run"
if not None:
    result = "falsy"
else:
    result = "truthy"`;
        const { frames, error } = interpret(code, features);
        expect(error).toBeNull();
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe("falsy");
      });
    });

    describe("logical operators", () => {
      test("AND with truthy values", () => {
        const code = `result = 5 and "hello"`;
        const { frames, error } = interpret(code, features);
        expect(error).toBeNull();
        // In Python, 'and' returns the last value if all are truthy
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe("hello");
      });

      test("AND with falsy value", () => {
        const code = `result = 0 and "hello"`;
        const { frames, error } = interpret(code, features);
        expect(error).toBeNull();
        // In Python, 'and' returns the first falsy value
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe(0);
      });

      test("OR with falsy then truthy", () => {
        const code = `result = 0 or "default"`;
        const { frames, error } = interpret(code, features);
        expect(error).toBeNull();
        // In Python, 'or' returns the first truthy value
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe("default");
      });

      test("OR with truthy first", () => {
        const code = `result = "first" or "second"`;
        const { frames, error } = interpret(code, features);
        expect(error).toBeNull();
        // In Python, 'or' returns the first truthy value
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe("first");
      });

      test("AND with complex expressions", () => {
        const code = `x = 3
y = 5
result = x and y`;
        const { frames, error } = interpret(code, features);
        expect(error).toBeNull();
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe(5);
      });

      test("OR with complex expressions", () => {
        const code = `x = 0
y = 10
result = x or y`;
        const { frames, error } = interpret(code, features);
        expect(error).toBeNull();
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe(10);
      });
    });
  });

  describe("allowTruthiness: false (default)", () => {
    describe("not operator", () => {
      test("number with not operator throws error", () => {
        const code = `if not 42:
    x = 1`;
        const { frames } = interpret(code);
        expectFrameToBeError(frames[0], "not 42", "TruthinessDisabled");
        expect(frames[0].error!.message).toBe("TruthinessDisabled: value: number");
      });

      test("string with not operator throws error", () => {
        const code = `if not "hello":
    x = 1`;
        const { frames } = interpret(code);
        expectFrameToBeError(frames[0], 'not "hello"', "TruthinessDisabled");
        expect(frames[0].error!.message).toBe("TruthinessDisabled: value: string");
      });

      test("None with not operator throws error", () => {
        const code = `if not None:
    x = 1`;
        const { frames } = interpret(code);
        expectFrameToBeError(frames[0], "not None", "TruthinessDisabled");
        expect(frames[0].error!.message).toBe("TruthinessDisabled: value: none");
      });

      test("boolean values work correctly", () => {
        const code = `result = "not run"
if not False:
    result = "not false"
if not True:
    result = "not true"
else:
    result = "else branch"`;
        const { frames, error } = interpret(code);
        expect(error).toBeNull();
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe("else branch");
      });
    });

    describe("logical operators", () => {
      test("AND with number on left throws error", () => {
        const code = "result = 5 and True";
        const { frames } = interpret(code);
        expectFrameToBeError(frames[0], "5", "TruthinessDisabled");
        expect(frames[0].error!.message).toBe("TruthinessDisabled: value: number");
      });

      test("AND with string on right throws error", () => {
        const code = 'result = True and "hello"';
        const { frames } = interpret(code);
        expectFrameToBeError(frames[0], '"hello"', "TruthinessDisabled");
        expect(frames[0].error!.message).toBe("TruthinessDisabled: value: string");
      });

      test("OR with number on left throws error", () => {
        const code = "result = 0 or True";
        const { frames } = interpret(code);
        expectFrameToBeError(frames[0], "0", "TruthinessDisabled");
        expect(frames[0].error!.message).toBe("TruthinessDisabled: value: number");
      });

      test("OR with None on left throws error", () => {
        const code = "result = None or True";
        const { frames } = interpret(code);
        expectFrameToBeError(frames[0], "None", "TruthinessDisabled");
        expect(frames[0].error!.message).toBe("TruthinessDisabled: value: none");
      });

      test("AND with booleans works", () => {
        const code = `result1 = True and False
result2 = True and True
result3 = False and True`;
        const { frames, error } = interpret(code);
        expect(error).toBeNull();
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result1.value).toBe(false);
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result2.value).toBe(true);
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result3.value).toBe(false);
      });

      test("OR with booleans works", () => {
        const code = `result1 = True or False
result2 = False or False
result3 = False or True`;
        const { frames, error } = interpret(code);
        expect(error).toBeNull();
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result1.value).toBe(true);
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result2.value).toBe(false);
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result3.value).toBe(true);
      });

      test("Complex boolean expressions work", () => {
        const code = `a = True
b = False
result = (a and not b) or (b and not a)`;
        const { frames, error } = interpret(code);
        expect(error).toBeNull();
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe(true);
      });
    });
  });

  describe("explicit allowTruthiness: false", () => {
    test("truthiness disabled when explicitly set to false", () => {
      const code = "result = 1 and 2";
      const { frames } = interpret(code, { languageFeatures: { allowTruthiness: false } });
      expectFrameToBeError(frames[0], "1", "TruthinessDisabled");
      expect(frames[0].error!.message).toBe("TruthinessDisabled: value: number");
    });
  });
});
