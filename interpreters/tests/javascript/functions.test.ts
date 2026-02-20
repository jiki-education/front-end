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

    test("Function with string concatenation parameter", () => {
      const code = `
        function sayHello(name) {
          return "Hello, " + name + "!";
        }
        let result = sayHello("World");
      `;
      const { frames, error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(true);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables?.result?.value).toBe("Hello, World!");
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

    test("Function can read global variables", () => {
      const code = `
        let greeting = "Hello";
        function greet(name) {
          return greeting + " " + name;
        }
        let result = greet("World");
      `;
      const { frames, error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(true);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables?.result?.value).toBe("Hello World");
    });

    test("Same parameter name in separate functions is not shadowing", () => {
      const code = `
        function add(x) {
          return x + 1;
        }
        function multiply(x) {
          return x * 2;
        }
        let a = add(5);
        let b = multiply(3);
      `;
      const { frames, error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(true);
      const finalFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(finalFrame.variables?.a?.value).toBe(6);
      expect(finalFrame.variables?.b?.value).toBe(6);
    });

    test("Calling a function from another function with the same param name is not shadowing", () => {
      const code = `
        function inner(n) {
          return n * 2;
        }
        function outer(n) {
          return inner(n) + 1;
        }
        let result = outer(5);
      `;
      const { frames, error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(true);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables?.result?.value).toBe(11);
    });

    test("Nested function call as argument with same param name is not shadowing", () => {
      const code = `
        function double(n) {
          return n * 2;
        }
        function addOne(n) {
          return n + 1;
        }
        let result = addOne(double(5));
      `;
      const { frames, error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(true);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables?.result?.value).toBe(11);
    });

    test("Mutual recursion with same param name is not shadowing", () => {
      const code = `
        function isEven(n) {
          if (n === 0) { return true; }
          return isOdd(n - 1);
        }
        function isOdd(n) {
          if (n === 0) { return false; }
          return isEven(n - 1);
        }
        let result = isEven(4);
      `;
      const { frames, error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(true);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables?.result?.value).toBe(true);
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
      const { frames, error, success } = interpret(code);
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

    test("Passing function result as argument to another function", () => {
      const code = `
        function toUpper(str) {
          return str.toUpperCase();
        }
        function wrap(str) {
          return "[" + str + "]";
        }
        let result = wrap(toUpper("hello"));
      `;
      const { frames, error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(true);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables?.result?.value).toBe("[HELLO]");
    });

    test("Three-function pipeline with shared parameter names", () => {
      const code = `
function codonsToProteins(codons) {
  let map = {
    AUG: "Methionine",
    UUU: "Phenylalanine",
    UCU: "Serine",
    UAA: "STOP"
  };
  let proteins = [];
  for (const codon of codons) {
    if (map[codon] === "STOP") {
      break;
    }
    proteins.push(map[codon]);
  }
  return proteins;
}

function rnaToCodons(rna) {
  let result = [];
  let current = "";
  let counter = 0;
  for (const letter of rna) {
    counter = counter + 1;
    current = current + letter;
    if (counter % 3 === 0 && current !== "") {
      result.push(current);
      current = "";
    }
  }
  return result;
}

function translateRna(rna) {
  return codonsToProteins(rnaToCodons(rna));
}

let result = translateRna("AUGUUUUCU");
      `;
      const { frames, error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(true);
      const finalFrame = frames[frames.length - 1] as TestAugmentedFrame;
      const resultArr = finalFrame.variables?.result?.value as any[];
      expect(resultArr).toHaveLength(3);
      expect(resultArr[0]._value ?? resultArr[0].value).toBe("Methionine");
      expect(resultArr[1]._value ?? resultArr[1].value).toBe("Phenylalanine");
      expect(resultArr[2]._value ?? resultArr[2].value).toBe("Serine");
    });

    test("Function called multiple times with different args", () => {
      const code = `
        function factorial(n) {
          let result = 1;
          for (let i = 2; i <= n; i = i + 1) {
            result = result * i;
          }
          return result;
        }
        let a = factorial(5);
        let b = factorial(3);
        let c = factorial(1);
      `;
      const { frames, error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(true);
      const finalFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(finalFrame.variables?.a?.value).toBe(120);
      expect(finalFrame.variables?.b?.value).toBe(6);
      expect(finalFrame.variables?.c?.value).toBe(1);
    });
  });

  describe("Variable shadowing (allowShadowing feature)", () => {
    test("Parameter shadowing outer variable - blocked when disabled", () => {
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

    test("Parameter shadowing outer variable - allowed when enabled", () => {
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
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables?.x?.value).toBe(5);
    });

    test("Multiple parameters shadowing outer variables - blocked when disabled", () => {
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

    test("Let inside function body shadowing outer variable - blocked when disabled", () => {
      const code = `
        let count = 10;
        function test() {
          let count = 20;
          return count;
        }
        let result = test();
      `;
      const { frames, error, success } = interpret(code);
      expect(success).toBe(false);
      expect(frames[frames.length - 1].status).toBe("ERROR");
      expect(frames[frames.length - 1].error?.type).toBe("ShadowingDisabled");
      expect(frames[frames.length - 1].error?.context?.name).toBe("count");
    });

    test("Let inside function body shadowing outer variable - allowed when enabled", () => {
      const code = `
        let count = 10;
        function test() {
          let count = 20;
          return count;
        }
        let result = test();
      `;
      const { frames, error, success } = interpret(code, { languageFeatures: { allowShadowing: true } });
      expect(error).toBeNull();
      expect(success).toBe(true);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables?.result?.value).toBe(20);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables?.count?.value).toBe(10);
    });
  });
});
