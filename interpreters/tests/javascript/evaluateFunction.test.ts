import { compile, evaluateFunction } from "@javascript/interpreter";
import { unwrapJSObject } from "@javascript/jikiObjects";
import enMessages from "@javascript/locales/en/translation.json";

describe("evaluateFunction", () => {
  test("compile errors throw (matches JikiScript behavior)", () => {
    const code = `invalid JavaScript syntax @#$`;
    expect(() => evaluateFunction(code, {}, "foo")).toThrow();
  });

  test("function with runtime error", () => {
    const code = `
      function move() {
        foo();
      }
    `;
    expect(compile(code).success).toBe(true); // Sanity check
    const { value, frames, error } = evaluateFunction(code, {}, "move");
    expect(value).toBeUndefined();
    expect(frames.length).toBeGreaterThan(0);
    const errorFrame = frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect(errorFrame!.error).not.toBeNull();
    expect(errorFrame!.error!.category).toBe("RuntimeError");
    expect(errorFrame!.error!.type).toBe("FunctionNotFound");
    expect(error).toBeNull();
  });

  test("later frame with error", () => {
    const code = `
      function move() {
        let x = 1;
        let y = 2;
        foo();
      }
    `;
    const { value, frames, error } = evaluateFunction(code, {}, "move");

    expect(value).toBeUndefined();
    expect(frames.length).toBeGreaterThan(2);
    const errorFrame = frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect(errorFrame!.error).not.toBeNull();
    expect(errorFrame!.error!.category).toBe("RuntimeError");
    expect(errorFrame!.error!.type).toBe("FunctionNotFound");
    expect(error).toBeNull();
  });

  test("missing function", () => {
    const code = `
      function jump() {
      }
    `;
    const { value, frames, error } = evaluateFunction(code, {}, "move");

    expect(value).toBeUndefined();
    expect(frames).toBeArrayOfSize(1);
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error).not.toBeNull();
    expect(frames[0].error!.category).toBe("RuntimeError");
    expect(frames[0].error!.type).toBe("TestedFunctionNotDefined");
    expect(error).toBeNull();
  });

  test("incorrect number of arguments", () => {
    const code = `
      function move(foo) {
      }
    `;
    const { value, frames, error } = evaluateFunction(code, {}, "move", 1, 2);

    expect(value).toBeUndefined();
    expect(frames).toBeArrayOfSize(1);
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error).not.toBeNull();
    expect(frames[0].error!.category).toBe("RuntimeError");
    expect(frames[0].error!.type).toBe("TestedFunctionHasWrongNumberOfParameters");
    expect(frames[0].line).toBe(2);
    expect(error).toBeNull();
  });

  describe("tested function takes the wrong number of inputs", () => {
    const stub = `// Write the twoFer function

function twoFer() {
  return ""
}`;

    function errorFrame(code: string, ...args: any[]) {
      const { frames } = evaluateFunction(code, { localeMessages: enMessages }, "twoFer", ...args);
      return frames.find(f => f.status === "ERROR")!;
    }

    test("explains that the student's function needs an input", () => {
      expect(errorFrame(stub, "Alice").error!.message).toBe(
        "Your `twoFer` function needs to take 1 input, but it currently takes none."
      );
    });

    test("counts both sides when the function takes some inputs", () => {
      const code = `function twoFer(a, b) {
  return ""
}`;
      expect(errorFrame(code, "Alice").error!.message).toBe(
        "Your `twoFer` function needs to take 1 input, but it currently takes 2."
      );
    });

    test("pluralises the inputs the test passes", () => {
      expect(errorFrame(stub, "Alice", "Bob").error!.message).toBe(
        "Your `twoFer` function needs to take 2 inputs, but it currently takes none."
      );
    });

    test("is placed on the student's function declaration", () => {
      const frame = errorFrame(stub, "Alice");
      expect(frame.line).toBe(3);
      expect(frame.error!.location.toCode(stub)).toBe("function twoFer");
    });

    test("keeps its location when the function is declared on line 1", () => {
      const code = `function twoFer() {
  return ""
}`;
      const frame = errorFrame(code, "Alice");
      expect(frame.error!.type).toBe("TestedFunctionHasWrongNumberOfParameters");
      expect(frame.error!.location.toCode(code)).toBe("function twoFer");
    });

    test("system format", () => {
      const { frames } = evaluateFunction(stub, {}, "twoFer", "Alice");
      expect(frames.find(f => f.status === "ERROR")!.error!.message).toBe(
        "TestedFunctionHasWrongNumberOfParameters: function: twoFer: expected: 1: got: 0"
      );
    });
  });

  describe("tested function has a different name", () => {
    function errorFrame(code: string, functionName: string) {
      const { frames } = evaluateFunction(code, { localeMessages: enMessages }, functionName, 15);
      return frames.find(f => f.status === "ERROR")!;
    }

    const code = `// Write the raindrops function

function rainDrops(num) {
  return "Pling"
}`;

    test("names both the expected function and the student's one", () => {
      expect(errorFrame(code, "raindrops").error!.message).toBe(
        "Jiki expects a function called `raindrops` but your function is called `rainDrops`."
      );
    });

    test("is placed on the student's function declaration", () => {
      const frame = errorFrame(code, "raindrops");
      expect(frame.line).toBe(3);
      expect(frame.error!.location.toCode(code)).toBe("function rainDrops");
    });

    test("says the function is missing when nothing is close", () => {
      expect(errorFrame(code, "leap").error!.message).toBe(
        "Jiki's tests need a function called `leap`, but your code doesn't define one."
      );
    });

    test("doesn't suggest a function the student didn't write", () => {
      const external = { name: "raindrop", func: () => undefined, description: "", arity: 1 };
      const { frames } = evaluateFunction(
        "function other() {}",
        { localeMessages: enMessages, externalFunctions: [external] },
        "raindrops",
        15
      );
      expect(frames.find(f => f.status === "ERROR")!.error!.type).toBe("TestedFunctionNotDefined");
    });
  });

  test("incorrect number of arguments inside the function reports the real line", () => {
    const code = `function isPangram(sentence) {
  sentence = sentence.toLowerCase(sentence);
  return sentence;
}`;
    const { frames, error } = evaluateFunction(code, {}, "isPangram", "abc");

    const errorFrame = frames.find(f => f.status === "ERROR");
    expect(errorFrame!.error!.type).toBe("InvalidNumberOfArguments");
    expect(errorFrame!.line).toBe(2);
    expect(error).toBeNull();
  });

  test("continue is caught", () => {
    const code = `
      function move() {
        continue;
      }
    `;
    const { value, frames, error } = evaluateFunction(code, {}, "move");

    expect(value).toBeUndefined();
    expect(frames).toBeArrayOfSize(1);
    expect(frames[0].error!.type).toBe("ContinueOutsideLoop");
    expect(error).toBeNull();
  });

  test("break is caught", () => {
    const code = `
      function move() {
        break;
      }
    `;
    const { value, frames, error } = evaluateFunction(code, {}, "move");

    expect(value).toBeUndefined();
    expect(frames).toBeArrayOfSize(1);
    expect(frames[0].error!.type).toBe("BreakOutsideLoop");
    expect(error).toBeNull();
  });

  test("return outside function is caught", () => {
    const code = `
      function move() {
      }
      return;
    `;
    const { value, frames, error } = evaluateFunction(code, {}, "move");

    expect(frames.length).toBeGreaterThan(0);
    const errorFrame = frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect(errorFrame!.error!.type).toBe("ReturnOutsideFunction");
    expect(error).toBeNull();
  });

  test("function without arguments returning a value", () => {
    const { value, frames } = evaluateFunction(
      `
      function move() {
        return 1;
      }
    `,
      {},
      "move"
    );
    expect(value).toBe(1);
    expect(frames).toBeArrayOfSize(1);
    expect(unwrapJSObject(frames[0].result?.jikiObject)).toBe(1);
  });

  test("function with arguments", () => {
    const { value, frames } = evaluateFunction(
      `
      function add(x, y) {
        return x + y;
      }
    `,
      {},
      "add",
      5,
      3
    );
    expect(value).toBe(8);
    expect(frames).toBeArrayOfSize(1);
  });

  test("function with string arguments", () => {
    const { value } = evaluateFunction(
      `
      function greet(name) {
        return "Hello, " + name;
      }
    `,
      {},
      "greet",
      "World"
    );
    expect(value).toBe("Hello, World");
  });

  test("function with complex arguments - array", () => {
    const { value } = evaluateFunction(
      `
      function sum(numbers) {
        let total = 0;
        for (let i = 0; i < numbers.length; i++) {
          total = total + numbers[i];
        }
        return total;
      }
    `,
      {},
      "sum",
      [1, 2, 3, 4, 5]
    );
    expect(value).toBe(15);
  });

  test("function with complex arguments - object", () => {
    const { value } = evaluateFunction(
      `
      function getProperty(obj, key) {
        return obj[key];
      }
    `,
      {},
      "getProperty",
      { x: 10, y: 20 },
      "x"
    );
    expect(value).toBe(10);
  });

  test("function returning undefined", () => {
    const { value } = evaluateFunction(
      `
      function doNothing() {
      }
    `,
      {},
      "doNothing"
    );
    expect(value).toBeUndefined();
  });

  test("function returning boolean", () => {
    const code = `function isGreater(a, b) {
  return a > b;
}`;
    expect(compile(code).success).toBe(true); // Sanity check

    const { value } = evaluateFunction(code, {}, "isGreater", 5, 3);
    expect(value).toBe(true);

    const { value: value2 } = evaluateFunction(code, {}, "isGreater", 2, 10);
    expect(value2).toBe(false);
  });

  test("function returning array", () => {
    const { value } = evaluateFunction(
      `
      function makeArray(a, b, c) {
        return [a, b, c];
      }
    `,
      {},
      "makeArray",
      1,
      2,
      3
    );
    expect(value).toEqual([1, 2, 3]);
  });

  test("function returning object", () => {
    const { value } = evaluateFunction(
      `
      function makeObject(x, y) {
        return { x: x, y: y };
      }
    `,
      {},
      "makeObject",
      10,
      20
    );
    expect(value).toEqual({ x: 10, y: 20 });
  });

  test("function with let variables", () => {
    const { value } = evaluateFunction(
      `
      function calculate() {
        let a = 5;
        let b = 10;
        return a * b;
      }
    `,
      {},
      "calculate"
    );
    expect(value).toBe(50);
  });

  test("synthetic calling code bypasses allowedNodes restrictions", () => {
    // The function body only uses identifiers (no literals) — it just returns the arg.
    // But the synthetic calling code identity("hello") contains a LiteralExpression
    // for "hello" that must not be blocked by allowedNodes.
    const code = `function identity(x) {
  return x;
}`;
    const { value, error, success } = evaluateFunction(
      code,
      {
        languageFeatures: {
          allowedNodes: [
            "ExpressionStatement",
            "CallExpression",
            "IdentifierExpression",
            "BlockStatement",
            "FunctionDeclaration",
            "ReturnStatement",
          ],
        },
      },
      "identity",
      "hello"
    );
    expect(error).toBeNull();
    expect(success).toBe(true);
    expect(value).toBe("hello");
  });

  test("sayHello with restricted language features", () => {
    const code = `function sayHello(name) {
  return "Hello, " + name + "!";
}`;
    const { value, frames, error, success } = evaluateFunction(
      code,
      {
        externalFunctions: [],
        languageFeatures: {
          maxTotalLoopIterations: 10000,
          allowedNodes: [
            "ExpressionStatement",
            "CallExpression",
            "IdentifierExpression",
            "LiteralExpression",
            "RepeatStatement",
            "BlockStatement",
            "VariableDeclaration",
            "BinaryExpression",
            "GroupingExpression",
            "AssignmentExpression",
            "UnaryExpression",
            "MemberExpression",
            "IfStatement",
            "FunctionDeclaration",
            "ReturnStatement",
            "TemplateLiteralExpression",
          ],
          allowTruthiness: false,
          allowTypeCoercion: false,
          enforceStrictEquality: true,
          allowShadowing: false,
          requireVariableInstantiation: true,
        },
      },
      "sayHello",
      "Aiko"
    );
    expect(error).toBeNull();
    expect(success).toBe(true);
    expect(value).toBe("Hello, Aiko!");
  });

  test("function with const variables", () => {
    const { value } = evaluateFunction(
      `
      function getMessage() {
        const message = "Hello";
        return message;
      }
    `,
      {},
      "getMessage"
    );
    expect(value).toBe("Hello");
  });
});
