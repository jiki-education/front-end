import { compile, evaluateFunction } from "@javascript/interpreter";
import { unwrapJSObject } from "@javascript/jikiObjects";

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
    expect(errorFrame!.error!.type).toBe("VariableNotDeclared");
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
    expect(errorFrame!.error!.type).toBe("VariableNotDeclared");
    expect(error).toBeNull();
  });

  test("missing function", () => {
    const code = `
      function m0ve() {
      }
    `;
    const { value, frames, error } = evaluateFunction(code, {}, "move");

    expect(value).toBeUndefined();
    expect(frames).toBeArrayOfSize(1);
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error).not.toBeNull();
    expect(frames[0].error!.category).toBe("RuntimeError");
    expect(frames[0].error!.type).toBe("FunctionNotFound");
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
    expect(frames[0].error!.type).toBe("InvalidNumberOfArguments");
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
