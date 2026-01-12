import { describe, it, expect } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { ExternalFunction } from "@shared/interfaces";
import type { ExecutionContext } from "@javascript/executor";
import { JSNumber, JSString, JSBoolean, type JikiObject } from "@javascript/jsObjects";

describe("JavaScript External Functions", () => {
  it("should call an external function with no arguments", () => {
    const externalFunction: ExternalFunction = {
      name: "getAnswer",
      func: (context: ExecutionContext) => 42,
      description: "returns the answer to everything",
      arity: 0,
    };

    const result = interpret(`getAnswer();`, {
      externalFunctions: [externalFunction],
    });

    expect(result.error).toBeNull();
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].status).toBe("SUCCESS");
  });

  it("should call an external function with arguments", () => {
    const externalFunction: ExternalFunction = {
      name: "add",
      func: (context: ExecutionContext, a: JikiObject, b: JikiObject) => {
        if (!(a instanceof JSNumber) || !(b instanceof JSNumber)) {
          throw new Error("add expects numbers");
        }
        return a.value + b.value;
      },
      description: "adds two numbers",
      arity: 2,
    };

    const result = interpret(`add(3, 5);`, {
      externalFunctions: [externalFunction],
    });

    expect(result.error).toBeNull();
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].status).toBe("SUCCESS");
  });

  it("should call an external function with variable arguments", () => {
    const externalFunction: ExternalFunction = {
      name: "sum",
      func: (context: ExecutionContext, ...args: JikiObject[]) => {
        const sum = args.reduce((acc, arg) => {
          if (!(arg instanceof JSNumber)) {
            throw new Error("sum expects all arguments to be numbers");
          }
          return acc + arg.value;
        }, 0);
        return sum;
      },
      description: "sums all arguments",
      arity: [0, Infinity],
    };

    const result = interpret(`sum(1, 2, 3, 4, 5);`, {
      externalFunctions: [externalFunction],
    });

    expect(result.error).toBeNull();
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].status).toBe("SUCCESS");
  });

  it("should error when calling a non-existent function", () => {
    const result = interpret(`nonExistent();`);

    expect(result.error).toBeNull(); // Runtime errors become frames
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].status).toBe("ERROR");
  });

  it("should error when calling with wrong number of arguments", () => {
    const externalFunction: ExternalFunction = {
      name: "twoArgs",
      func: (context: ExecutionContext, a: JikiObject, b: JikiObject) => {
        if (!(a instanceof JSNumber) || !(b instanceof JSNumber)) {
          throw new Error("twoArgs expects numbers");
        }
        return a.value + b.value;
      },
      description: "needs two arguments",
      arity: 2,
    };

    const result = interpret(`twoArgs(1);`, {
      externalFunctions: [externalFunction],
    });

    expect(result.error).toBeNull(); // Runtime errors become frames
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].status).toBe("ERROR");
  });

  it("should allow external functions to be called in expressions", () => {
    const externalFunction: ExternalFunction = {
      name: "double",
      func: (context: ExecutionContext, n: JikiObject) => {
        if (!(n instanceof JSNumber)) {
          throw new Error("double expects a number");
        }
        return n.value * 2;
      },
      description: "doubles a number",
      arity: 1,
    };

    const result = interpret(`let x = double(5) + 3;`, {
      externalFunctions: [externalFunction],
    });

    expect(result.error).toBeNull();
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].status).toBe("SUCCESS");
  });

  it("should allow external functions to receive variables as arguments", () => {
    const externalFunction: ExternalFunction = {
      name: "multiply",
      func: (context: ExecutionContext, a: JikiObject, b: JikiObject) => {
        if (!(a instanceof JSNumber) || !(b instanceof JSNumber)) {
          throw new Error("multiply expects numbers");
        }
        return a.value * b.value;
      },
      description: "multiplies two numbers",
      arity: 2,
    };

    const result = interpret(
      `
      let x = 3;
      let y = 4;
      multiply(x, y);
    `,
      {
        externalFunctions: [externalFunction],
      }
    );

    expect(result.error).toBeNull();
    expect(result.frames.length).toBeGreaterThan(0);
    // Last frame should be SUCCESS
    expect(result.frames[result.frames.length - 1].status).toBe("SUCCESS");
  });

  it("should respect CallExpression node restrictions", () => {
    const externalFunction: ExternalFunction = {
      name: "test",
      func: (context: ExecutionContext) => 1,
      description: "test function",
      arity: 0,
    };

    const result = interpret(`test();`, {
      externalFunctions: [externalFunction],
      languageFeatures: {
        allowedNodes: ["LiteralExpression", "ExpressionStatement", "IdentifierExpression"], // CallExpression not allowed
      },
    });

    expect(result.error).not.toBeNull();
    expect(result.error?.type).toBe("CallExpressionNotAllowed");
  });

  it("should allow nested function calls", () => {
    const abs: ExternalFunction = {
      name: "abs",
      func: (context: ExecutionContext, n: JikiObject) => {
        if (!(n instanceof JSNumber)) {
          throw new Error("abs expects a number");
        }
        return Math.abs(n.value);
      },
      description: "absolute value",
      arity: 1,
    };

    const max: ExternalFunction = {
      name: "max",
      func: (context: ExecutionContext, a: JikiObject, b: JikiObject) => {
        if (!(a instanceof JSNumber) || !(b instanceof JSNumber)) {
          throw new Error("max expects numbers");
        }
        return Math.max(a.value, b.value);
      },
      description: "maximum of two numbers",
      arity: 2,
    };

    const result = interpret(`max(abs(-5), abs(-3));`, {
      externalFunctions: [abs, max],
    });

    expect(result.error).toBeNull();
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].status).toBe("SUCCESS");
  });

  it("should handle external functions that return strings", () => {
    const externalFunction: ExternalFunction = {
      name: "greet",
      func: (context: ExecutionContext, name: JikiObject) => {
        if (!(name instanceof JSString)) {
          throw new Error("greet expects a string");
        }
        return `Hello, ${name.value}!`;
      },
      description: "greets a person",
      arity: 1,
    };

    const result = interpret(`greet("World");`, {
      externalFunctions: [externalFunction],
    });

    expect(result.error).toBeNull();
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].status).toBe("SUCCESS");
  });

  it("should handle external functions that return booleans", () => {
    const externalFunction: ExternalFunction = {
      name: "isPositive",
      func: (context: ExecutionContext, n: JikiObject) => {
        if (!(n instanceof JSNumber)) {
          throw new Error("isPositive expects a number");
        }
        return n.value > 0;
      },
      description: "checks if positive",
      arity: 1,
    };

    const result = interpret(`isPositive(5);`, {
      externalFunctions: [externalFunction],
    });

    expect(result.error).toBeNull();
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].status).toBe("SUCCESS");
  });

  it("should allow external functions in if conditions", () => {
    const externalFunction: ExternalFunction = {
      name: "isEven",
      func: (context: ExecutionContext, n: JikiObject) => {
        if (!(n instanceof JSNumber)) {
          throw new Error("isEven expects a number");
        }
        return n.value % 2 === 0;
      },
      description: "checks if even",
      arity: 1,
    };

    const result = interpret(
      `
      if (isEven(4)) {
        let x = 1;
      }
    `,
      {
        externalFunctions: [externalFunction],
      }
    );

    expect(result.error).toBeNull();
    expect(result.frames.length).toBeGreaterThan(0);
  });

  describe("Error handling", () => {
    it("should handle LogicError from external functions with educational messages", () => {
      const moveCharacter: ExternalFunction = {
        name: "move",
        func: (context: ExecutionContext, direction: JikiObject) => {
          if (!(direction instanceof JSString)) {
            throw new Error("move expects a string");
          }
          if (direction.value === "off-edge") {
            context.logicError("You can't walk through walls! The character is at the edge of the maze.");
          }
          return "OK";
        },
        description: "Moves the character in a direction",
        arity: 1,
      };

      const result = interpret('move("off-edge");', { externalFunctions: [moveCharacter] });

      expect(result.error).toBeNull(); // Runtime errors don't become parse errors
      expect(result.success).toBe(false);
      expect(result.frames).toHaveLength(1);
      expect(result.frames[0].status).toBe("ERROR");
      expect((result.frames[0] as any).error.type).toBe("LogicErrorInExecution");
      expect((result.frames[0] as any).error.message).toBe(
        "You can't walk through walls! The character is at the edge of the maze."
      );
    });

    it("should catch and report errors thrown by external functions", () => {
      const throwingFunc: ExternalFunction = {
        name: "throwError",
        func: (context: ExecutionContext) => {
          throw new Error("Something went wrong");
        },
        description: "Function that throws an error",
        arity: 0,
      };

      const result = interpret("throwError();", { externalFunctions: [throwingFunc] });

      expect(result.error).toBeNull(); // Runtime errors don't become parse errors
      expect(result.success).toBe(false);
      expect(result.frames).toHaveLength(1);
      expect(result.frames[0].status).toBe("ERROR");
      expect((result.frames[0] as any).error.type).toBe("FunctionExecutionError");
      expect((result.frames[0] as any).error.message).toBe(
        "FunctionExecutionError: function: throwError: message: Something went wrong"
      );
    });

    it("should handle errors with arguments", () => {
      const throwingFunc: ExternalFunction = {
        name: "riskyOperation",
        func: (context: ExecutionContext, value: JikiObject) => {
          if (!(value instanceof JSNumber)) {
            throw new Error("riskyOperation expects a number");
          }
          if (value.value < 0) {
            throw new Error("Negative values not allowed");
          }
          return value.value * 2;
        },
        description: "Function that might throw",
        arity: 1,
      };

      // Should work with valid input
      let result = interpret("riskyOperation(5);", { externalFunctions: [throwingFunc] });
      expect(result.error).toBeNull();
      expect(result.success).toBe(true);
      const frame = result.frames[0] as any;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result?.jikiObject?.value).toBe(10);

      // Should throw with invalid input
      result = interpret("riskyOperation(-5);", { externalFunctions: [throwingFunc] });
      expect(result.error).toBeNull();
      expect(result.success).toBe(false);
      expect(result.frames[0].status).toBe("ERROR");
      expect((result.frames[0] as any).error.type).toBe("FunctionExecutionError");
      expect((result.frames[0] as any).error.message).toBe(
        "FunctionExecutionError: function: riskyOperation: message: Negative values not allowed"
      );
    });
  });

  describe("external function return values - native wrapping", () => {
    it("returns native number, wrapped as JSNumber", () => {
      const externalFunction: ExternalFunction = {
        name: "getNative",
        func: () => 42, // Native number, not JSNumber(42)
        description: "returns native number",
        arity: 0,
      };

      const result = interpret("let x = getNative();", {
        externalFunctions: [externalFunction],
      });

      expect(result.error).toBeNull();
      expect(result.frames.length).toBeGreaterThan(0);
      const frame = result.frames.find(f => f.result?.jikiObject?.value === 42);
      expect(frame?.result?.jikiObject).toBeInstanceOf(JSNumber);
      expect(frame?.result?.jikiObject?.value).toBe(42);
    });

    it("returns native string, wrapped as JSString", () => {
      const externalFunction: ExternalFunction = {
        name: "getString",
        func: () => "hello", // Native string
        description: "returns native string",
        arity: 0,
      };

      const result = interpret("let x = getString();", {
        externalFunctions: [externalFunction],
      });

      expect(result.error).toBeNull();
      const frame = result.frames.find(f => f.result?.jikiObject?.value === "hello");
      expect(frame?.result?.jikiObject).toBeInstanceOf(JSString);
      expect(frame?.result?.jikiObject?.value).toBe("hello");
    });

    it("returns native array, wrapped as JSArray", () => {
      const externalFunction: ExternalFunction = {
        name: "getArray",
        func: () => [1, 2, 3], // Native array
        description: "returns native array",
        arity: 0,
      };

      const result = interpret("let x = getArray();", {
        externalFunctions: [externalFunction],
      });

      expect(result.error).toBeNull();
      const frame = result.frames.find(f => {
        const obj = f.result?.jikiObject;
        return obj && "value" in obj && Array.isArray(obj.value);
      });
      expect(frame?.result?.jikiObject).toBeDefined();
      expect(frame?.result?.jikiObject?.type).toBe("list");
    });

    it("returns undefined, wrapped as JSUndefined", () => {
      const externalFunction: ExternalFunction = {
        name: "returnNothing",
        func: () => undefined,
        description: "returns undefined",
        arity: 0,
      };

      const result = interpret("let x = returnNothing();", {
        externalFunctions: [externalFunction],
      });

      expect(result.error).toBeNull();
      const frame = result.frames.find(f => f.result?.jikiObject?.type === "undefined");
      expect(frame?.result?.jikiObject?.type).toBe("undefined");
    });

    it("returns null, wrapped as JSNull", () => {
      const externalFunction: ExternalFunction = {
        name: "returnNull",
        func: () => null,
        description: "returns null",
        arity: 0,
      };

      const result = interpret("let x = returnNull();", {
        externalFunctions: [externalFunction],
      });

      expect(result.error).toBeNull();
      const frame = result.frames.find(f => f.result?.jikiObject?.type === "null");
      expect(frame?.result?.jikiObject?.type).toBe("null");
    });
  });
});
