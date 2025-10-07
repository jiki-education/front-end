import { interpret } from "@python/interpreter";
import { describe, test, expect } from "vitest";
import type { TestAugmentedFrame } from "@shared/frames";

describe("User-defined functions", () => {
  describe("Function declarations", () => {
    test("Simple function with no parameters", () => {
      const code = `def greet():
    return "Hello"
result = greet()`;
      const { frames, error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(true);
      expect(frames).toBeArrayOfSize(2);
      // Frame 0: greet() call with return
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe("Hello");
      // Frame 1: variable assignment
      expect(frames[1].status).toBe("SUCCESS");
      expect((frames[1] as TestAugmentedFrame).variables?.result?.value).toBe("Hello");
    });

    test("Function with parameters", () => {
      const code = `def add(a, b):
    return a + b
result = add(5, 3)`;
      const { frames, error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(true);
      expect(frames).toBeArrayOfSize(2);
      expect(frames[0].result?.jikiObject.value).toBe(8);
      expect((frames[1] as TestAugmentedFrame).variables?.result?.value).toBe(8);
    });

    test("Function with void return", () => {
      const code = `def do_something():
    return
result = do_something()`;
      const { frames, error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(true);
      expect(frames).toBeArrayOfSize(2);
      expect(frames[0].result?.jikiObject.value).toBeNull();
      expect((frames[1] as TestAugmentedFrame).variables?.result?.value).toBeNull();
    });

    test("Function with no return statement", () => {
      const code = `def do_nothing():
    x = 5
result = do_nothing()`;
      const { frames, error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(true);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables?.result?.value).toBeNull();
    });

    test("Function with multiple statements", () => {
      const code = `def calculate(x):
    doubled = x * 2
    result = doubled + 10
    return result
answer = calculate(5)`;
      const { frames, error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(true);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables?.answer?.value).toBe(20);
    });
  });

  describe("Function scope", () => {
    test("Parameters create new scope", () => {
      const code = `def test(a):
    return a + 1
result = test(5)`;
      const { frames, error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(true);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables?.result?.value).toBe(6);
    });

    test("Variables in function don't leak to outer scope", () => {
      const code = `def test():
    inner = 42
    return inner
test()
outer = inner`;
      const { frames, error, success } = interpret(code);
      expect(success).toBe(false);
      expect(frames[frames.length - 1].status).toBe("ERROR");
      expect(frames[frames.length - 1].error?.type).toBe("UndefinedVariable");
    });
  });

  describe("Syntax errors", () => {
    test("Missing function name", () => {
      const code = `def ()`;
      const { error } = interpret(code);
      expect(error).not.toBeNull();
      expect(error?.type).toBe("MissingFunctionName");
    });

    test("Duplicate parameter names", () => {
      const code = `def test(a, b, a):
    return a`;
      const { error } = interpret(code);
      expect(error).not.toBeNull();
      expect(error?.type).toBe("DuplicateParameterName");
    });

    test("Missing parentheses after function name", () => {
      const code = `def test:
    return 42`;
      const { error } = interpret(code);
      expect(error).not.toBeNull();
      expect(error?.type).toBe("MissingLeftParenthesisAfterFunctionName");
    });

    test("Missing colon after function signature", () => {
      const code = `def test()
    return 42`;
      const { error } = interpret(code);
      expect(error).not.toBeNull();
      expect(error?.type).toBe("MissingColonAfterFunctionSignature");
    });
  });

  describe("Runtime errors", () => {
    test("Return outside function", () => {
      const code = `def test():
    return 42
return 10`;
      const { frames, error, success } = interpret(code);
      expect(success).toBe(false);
      expect(frames[frames.length - 1].status).toBe("ERROR");
      expect(frames[frames.length - 1].error?.type).toBe("ReturnOutsideFunction");
      expect(error).toBeNull(); // Runtime errors don't set error
    });

    test("Wrong number of arguments", () => {
      const code = `def add(a, b):
    return a + b
result = add(5)`;
      const { frames, error, success } = interpret(code);
      expect(success).toBe(false);
      expect(frames[frames.length - 1].status).toBe("ERROR");
      expect(frames[frames.length - 1].error?.type).toBe("InvalidNumberOfArguments");
      expect(error).toBeNull();
    });
  });

  describe("Complex scenarios", () => {
    test("Function calling another function", () => {
      const code = `def double(x):
    return x * 2
def quadruple(x):
    doubled = double(x)
    return double(doubled)
result = quadruple(3)`;
      const { frames, error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(true);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables?.result?.value).toBe(12);
    });

    test("Function with conditional return", () => {
      const code = `def abs(x):
    if x < 0:
        return -x
    else:
        return x
result1 = abs(-5)
result2 = abs(5)`;
      const { frames, error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(true);
      const finalFrame = frames[frames.length - 1];
      expect((finalFrame as TestAugmentedFrame).variables?.result1?.value).toBe(5);
      expect((finalFrame as TestAugmentedFrame).variables?.result2?.value).toBe(5);
    });

    test("Function with loop", () => {
      const code = `def sum(n):
    total = 0
    for i in [1, 2, 3, 4, 5]:
        total = total + i
    return total
result = sum(5)`;
      const { frames, error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(true);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables?.result?.value).toBe(15);
    });
  });
});
