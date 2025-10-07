import { interpret } from "@javascript/interpreter";
import { describe, test, expect } from "vitest";
import type { TestAugmentedFrame } from "@shared/frames";

describe("User-defined functions", () => {
  describe("Function declarations", () => {
    test("Simple function with no parameters", () => {
      const code = `
        function greet() {
          return "Hello";
        }
        let result = greet();
      `;
      const { frames, error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(true);
      expect(frames).toBeArrayOfSize(2);
      // Frame 0: greet() call with return
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe("Hello");
      // Frame 1: variable declaration
      expect(frames[1].status).toBe("SUCCESS");
      expect((frames[1] as TestAugmentedFrame).variables?.result?.value).toBe("Hello");
    });

    test("Function with parameters", () => {
      const code = `
        function add(a, b) {
          return a + b;
        }
        let result = add(5, 3);
      `;
      const { frames, error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(true);
      expect(frames).toBeArrayOfSize(2);
      expect(frames[0].result?.jikiObject.value).toBe(8);
      expect((frames[1] as TestAugmentedFrame).variables?.result?.value).toBe(8);
    });

    test("Function with void return", () => {
      const code = `
        function doSomething() {
          return;
        }
        let result = doSomething();
      `;
      const { frames, error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(true);
      expect(frames).toBeArrayOfSize(2);
      expect(frames[0].result?.jikiObject.value).toBeUndefined();
      expect((frames[1] as TestAugmentedFrame).variables?.result?.value).toBeUndefined();
    });

    test("Function with no return statement", () => {
      const code = `
        function doNothing() {
          let x = 5;
        }
        let result = doNothing();
      `;
      const { frames, error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(true);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables?.result?.value).toBeUndefined();
    });

    test("Function with multiple statements", () => {
      const code = `
        function calculate(x) {
          let doubled = x * 2;
          let result = doubled + 10;
          return result;
        }
        let answer = calculate(5);
      `;
      const { frames, error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(true);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables?.answer?.value).toBe(20);
    });
  });

  describe("Function scope", () => {
    test("Parameters create new scope", () => {
      const code = `
        function test(a) {
          return a + 1;
        }
        let result = test(5);
      `;
      const { frames, error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(true);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables?.result?.value).toBe(6);
    });

    test("Variables in function don't leak to outer scope", () => {
      const code = `
        function test() {
          let inner = 42;
          return inner;
        }
        test();
        let outer = inner;
      `;
      const { frames, error, success } = interpret(code);
      expect(success).toBe(false);
      expect(frames[frames.length - 1].status).toBe("ERROR");
      expect(frames[frames.length - 1].error?.type).toBe("VariableNotDeclared");
    });
  });

  describe("Syntax errors", () => {
    test("Nested function declaration", () => {
      const code = `
        function outer() {
          function inner() {
            return 42;
          }
        }
      `;
      const { error } = interpret(code);
      expect(error).not.toBeNull();
      expect(error?.type).toBe("NestedFunctionDeclaration");
    });

    test("Missing function name", () => {
      const code = `function () { return 42; }`;
      const { error } = interpret(code);
      expect(error).not.toBeNull();
      expect(error?.type).toBe("MissingFunctionName");
    });

    test("Duplicate parameter names", () => {
      const code = `function test(a, b, a) { return a; }`;
      const { error } = interpret(code);
      expect(error).not.toBeNull();
      expect(error?.type).toBe("DuplicateParameterName");
    });

    test("Missing parentheses after function name", () => {
      const code = `function test { return 42; }`;
      const { error } = interpret(code);
      expect(error).not.toBeNull();
      expect(error?.type).toBe("MissingLeftParenthesisAfterFunctionName");
    });

    test("Missing function body", () => {
      const code = `function test()`;
      const { error } = interpret(code);
      expect(error).not.toBeNull();
      expect(error?.type).toBe("MissingLeftBraceBeforeFunctionBody");
    });
  });

  describe("Runtime errors", () => {
    test("Return outside function", () => {
      const code = `
        function test() {
          return 42;
        }
        return 10;
      `;
      const { frames, error, success } = interpret(code);
      expect(success).toBe(false);
      expect(frames[frames.length - 1].status).toBe("ERROR");
      expect(frames[frames.length - 1].error?.type).toBe("ReturnOutsideFunction");
      expect(error).toBeNull(); // Runtime errors don't set error
    });

    test("Wrong number of arguments", () => {
      const code = `
        function add(a, b) {
          return a + b;
        }
        let result = add(5);
      `;
      const { frames, error, success } = interpret(code);
      expect(success).toBe(false);
      expect(frames[frames.length - 1].status).toBe("ERROR");
      expect(frames[frames.length - 1].error?.type).toBe("InvalidNumberOfArguments");
      expect(error).toBeNull();
    });
  });

  describe("Complex scenarios", () => {
    test("Function calling another function", () => {
      const code = `
        function double(n) {
          return n * 2;
        }
        function quadruple(m) {
          let doubled = double(m);
          return double(doubled);
        }
        let result = quadruple(3);
      `;
      const { frames, error, success } = interpret(code, { languageFeatures: { allowShadowing: true } });
      expect(error).toBeNull();
      expect(success).toBe(true);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables?.result?.value).toBe(12);
    });

    test("Function with conditional return", () => {
      const code = `
        function abs(x) {
          if (x < 0) {
            return -x;
          } else {
            return x;
          }
        }
        let result1 = abs(-5);
        let result2 = abs(5);
      `;
      const { frames, error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(true);
      const finalFrame = frames[frames.length - 1];
      expect((finalFrame as TestAugmentedFrame).variables?.result1?.value).toBe(5);
      expect((finalFrame as TestAugmentedFrame).variables?.result2?.value).toBe(5);
    });

    test("Function with loop", () => {
      const code = `
        function sum(n) {
          let total = 0;
          for (let i = 1; i <= n; i = i + 1) {
            total = total + i;
          }
          return total;
        }
        let result = sum(5);
      `;
      const { frames, error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(true);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables?.result?.value).toBe(15);
    });
  });

  describe("Parameter shadowing with allowShadowing feature", () => {
    test("Parameter shadowing outer variable - allowShadowing: false (default)", () => {
      const code = `
        let x = 5;
        function test(x) {
          return x + 1;
        }
        let result = test(10);
      `;
      const { frames, error, success } = interpret(code);
      expect(success).toBe(false);
      expect(frames[frames.length - 1].status).toBe("ERROR");
      expect(frames[frames.length - 1].error?.type).toBe("ShadowingDisabled");
      expect(frames[frames.length - 1].error?.context?.name).toBe("x");
    });

    test("Parameter shadowing outer variable - allowShadowing: true", () => {
      const code = `
        let x = 5;
        function test(x) {
          return x + 1;
        }
        let result = test(10);
      `;
      const { frames, error, success } = interpret(code, { languageFeatures: { allowShadowing: true } });
      expect(error).toBeNull();
      expect(success).toBe(true);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables?.result?.value).toBe(11);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables?.x?.value).toBe(5); // Outer x unchanged
    });

    test("Multiple parameters, one shadows - allowShadowing: false", () => {
      const code = `
        let a = 1;
        let b = 2;
        function test(a, b, c) {
          return a + b + c;
        }
        test(10, 20, 30);
      `;
      const { frames, error, success } = interpret(code);
      expect(success).toBe(false);
      expect(frames[frames.length - 1].status).toBe("ERROR");
      expect(frames[frames.length - 1].error?.type).toBe("ShadowingDisabled");
      expect(frames[frames.length - 1].error?.context?.name).toBe("a");
    });

    test("Parameter with same name in different functions - should work", () => {
      const code = `
        function add(x) {
          return x + 1;
        }
        function multiply(x) {
          return x * 2;
        }
        let result = add(5);
      `;
      const { frames, error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(true);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables?.result?.value).toBe(6);
    });
  });
});
