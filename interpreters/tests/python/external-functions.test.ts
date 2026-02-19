import { describe, it, expect } from "vitest";
import { interpret } from "@python/interpreter";
import type { ExternalFunction } from "@shared/interfaces";
import type { ExecutionContext } from "@shared/interfaces";

describe("Python External Functions", () => {
  describe("Basic function calls", () => {
    it("should call an external function with no arguments", () => {
      const testFunc: ExternalFunction = {
        name: "test",
        func: (_ctx: ExecutionContext) => 42,
        description: "Test function",
      };

      const result = interpret("test()", { externalFunctions: [testFunc] });

      expect(result.error).toBeNull();
      expect(result.success).toBe(true);
      expect(result.frames).toHaveLength(1);
      expect(result.frames[0].status).toBe("SUCCESS");
      expect((result.frames[0] as any).result.jikiObject.value).toBe(42);
    });

    it("should call an external function with one argument", () => {
      const double: ExternalFunction = {
        name: "double",
        func: (_ctx: ExecutionContext, x: number) => x * 2,
        description: "Doubles a number",
        arity: 1,
      };

      const result = interpret("double(5)", { externalFunctions: [double] });

      expect(result.error).toBeNull();
      expect(result.success).toBe(true);
      expect(result.frames).toHaveLength(1);
      expect((result.frames[0] as any).result.jikiObject.value).toBe(10);
    });

    it("should call an external function with multiple arguments", () => {
      const add: ExternalFunction = {
        name: "add",
        func: (_ctx: ExecutionContext, a: number, b: number) => a + b,
        description: "Adds two numbers",
        arity: 2,
      };

      const result = interpret("add(3, 4)", { externalFunctions: [add] });

      expect(result.error).toBeNull();
      expect(result.success).toBe(true);
      expect(result.frames).toHaveLength(1);
      expect((result.frames[0] as any).result.jikiObject.value).toBe(7);
    });
  });

  describe("Arity checking", () => {
    it("should enforce exact arity", () => {
      const func: ExternalFunction = {
        name: "exactTwo",
        func: (_ctx: ExecutionContext, a: number, b: number) => a + b,
        description: "Requires exactly 2 arguments",
        arity: 2,
      };

      const result = interpret("exactTwo(1)", { externalFunctions: [func] });

      expect(result.success).toBe(false);
      expect(result.frames[0].status).toBe("ERROR");
      expect((result.frames[0] as any).error.type).toBe("InvalidNumberOfArguments");
    });

    it("should enforce variable arity with min and max", () => {
      const func: ExternalFunction = {
        name: "variableArgs",
        func: (_ctx: ExecutionContext, ...args: number[]) => args.reduce((a, b) => a + b, 0),
        description: "Accepts 1-3 arguments",
        arity: [1, 3],
      };

      // Too few arguments
      let result = interpret("variableArgs()", { externalFunctions: [func] });
      expect(result.success).toBe(false);
      expect((result.frames[0] as any).error.type).toBe("InvalidNumberOfArguments");

      // Valid number of arguments
      result = interpret("variableArgs(1, 2)", { externalFunctions: [func] });
      expect(result.success).toBe(true);
      expect((result.frames[0] as any).result.jikiObject.value).toBe(3);

      // Too many arguments
      result = interpret("variableArgs(1, 2, 3, 4)", { externalFunctions: [func] });
      expect(result.success).toBe(false);
      expect((result.frames[0] as any).error.type).toBe("InvalidNumberOfArguments");
    });
  });

  describe("Complex expressions as arguments", () => {
    it("should evaluate expressions before passing to function", () => {
      const double: ExternalFunction = {
        name: "double",
        func: (_ctx: ExecutionContext, x: number) => x * 2,
        description: "Doubles a number",
        arity: 1,
      };

      const result = interpret("double(3 + 2)", { externalFunctions: [double] });

      expect(result.error).toBeNull();
      expect(result.success).toBe(true);
      expect(result.frames).toHaveLength(1);
      expect((result.frames[0] as any).result.jikiObject.value).toBe(10);
    });

    it("should work with variables as arguments", () => {
      const square: ExternalFunction = {
        name: "square",
        func: (_ctx: ExecutionContext, x: number) => x * x,
        description: "Squares a number",
        arity: 1,
      };

      const result = interpret("x = 5\nsquare(x)", { externalFunctions: [square] });

      expect(result.error).toBeNull();
      expect(result.success).toBe(true);
      expect(result.frames).toHaveLength(2);
      expect((result.frames[1] as any).result.jikiObject.value).toBe(25);
    });
  });

  describe("Error handling", () => {
    it("should error when function is not found", () => {
      const result = interpret("nonexistent()");

      expect(result.success).toBe(false);
      expect(result.frames[0].status).toBe("ERROR");
      // When identifier doesn't exist as variable or external function, we get UndefinedVariable
      expect((result.frames[0] as any).error.type).toBe("UndefinedVariable");
    });

    it("should error when trying to call non-function", () => {
      const result = interpret("x = 5\nx()");

      expect(result.success).toBe(false);
      expect(result.frames[1].status).toBe("ERROR");
      expect((result.frames[1] as any).error.type).toBe("TypeError");
    });
  });

  describe("Return value types", () => {
    it("should handle string return values", () => {
      const greet: ExternalFunction = {
        name: "greet",
        func: (_ctx: ExecutionContext, name: string) => `Hello, ${name}!`,
        description: "Greets someone",
        arity: 1,
      };

      const result = interpret('greet("World")', { externalFunctions: [greet] });

      expect(result.error).toBeNull();
      expect(result.success).toBe(true);
      expect((result.frames[0] as any).result.jikiObject.value).toBe("Hello, World!");
    });

    it("should handle boolean return values", () => {
      const isEven: ExternalFunction = {
        name: "isEven",
        func: (_ctx: ExecutionContext, n: number) => n % 2 === 0,
        description: "Checks if number is even",
        arity: 1,
      };

      const result = interpret("isEven(4)", { externalFunctions: [isEven] });

      expect(result.error).toBeNull();
      expect(result.success).toBe(true);
      expect((result.frames[0] as any).result.jikiObject.value).toBe(true);
    });

    it("should handle array return values", () => {
      const range: ExternalFunction = {
        name: "range",
        func: (_ctx: ExecutionContext, n: number) => Array.from({ length: n }, (_, i) => i),
        description: "Creates a range",
        arity: 1,
      };

      const result = interpret("range(3)", { externalFunctions: [range] });

      expect(result.error).toBeNull();
      expect(result.success).toBe(true);
      const returnValue = (result.frames[0] as any).result.jikiObject;
      expect(returnValue.type).toBe("list");
      expect(returnValue.value.map((item: any) => item.value)).toEqual([0, 1, 2]);
    });
  });

  describe("ExecutionContext usage", () => {
    it("should pass ExecutionContext to external functions", () => {
      let receivedContext: ExecutionContext | null = null;

      const checkContext: ExternalFunction = {
        name: "checkContext",
        func: (ctx: ExecutionContext) => {
          receivedContext = ctx;
          return true;
        },
        description: "Checks context",
      };

      const result = interpret("checkContext()", { externalFunctions: [checkContext] });

      expect(result.error).toBeNull();
      expect(result.success).toBe(true);
      expect(receivedContext).not.toBeNull();
      expect(receivedContext).toHaveProperty("fastForward");
      expect(receivedContext).toHaveProperty("getCurrentTimeInMs");
    });
  });

  describe("Error handling", () => {
    it("should handle LogicError from external functions with educational messages", () => {
      const moveCharacter: ExternalFunction = {
        name: "move",
        func: (context: ExecutionContext, direction: string) => {
          if (direction === "off-edge") {
            context.logicError("You can't walk through walls! The character is at the edge of the maze.");
          }
          return "OK";
        },
        description: "Moves the character in a direction",
        arity: 1,
      };

      const result = interpret('move("off-edge")', { externalFunctions: [moveCharacter] });

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
        func: (_ctx: ExecutionContext) => {
          throw new Error("Something went wrong");
        },
        description: "Function that throws an error",
        arity: 0,
      };

      const result = interpret("throwError()", { externalFunctions: [throwingFunc] });

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
        func: (_ctx: ExecutionContext, value: number) => {
          if (value < 0) {
            throw new Error("Negative values not allowed");
          }
          return value * 2;
        },
        description: "Function that might throw",
        arity: 1,
      };

      // Should work with valid input
      let result = interpret("riskyOperation(5)", { externalFunctions: [throwingFunc] });
      expect(result.error).toBeNull();
      expect(result.success).toBe(true);
      expect((result.frames[0] as any).result.jikiObject.value).toBe(10);

      // Should throw with invalid input
      result = interpret("riskyOperation(-5)", { externalFunctions: [throwingFunc] });
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
    it("returns native number, wrapped as PyNumber", () => {
      const getNative: ExternalFunction = {
        name: "get_native",
        func: () => 42, // Native number
        description: "returns native number",
        arity: 0,
      };

      const result = interpret("x = get_native()", { externalFunctions: [getNative] });

      expect(result.error).toBeNull();
      expect(result.success).toBe(true);
      const frame = result.frames.find(f => f.result?.jikiObject?.value === 42);
      expect(frame?.result?.jikiObject?.value).toBe(42);
      expect(frame?.result?.jikiObject?.type).toBe("number");
    });

    it("returns native string, wrapped as PyString", () => {
      const getString: ExternalFunction = {
        name: "get_string",
        func: () => "hello", // Native string
        description: "returns native string",
        arity: 0,
      };

      const result = interpret("x = get_string()", { externalFunctions: [getString] });

      expect(result.error).toBeNull();
      expect(result.success).toBe(true);
      const frame = result.frames.find(f => f.result?.jikiObject?.value === "hello");
      expect(frame?.result?.jikiObject?.value).toBe("hello");
      expect(frame?.result?.jikiObject?.type).toBe("string");
    });

    it("returns native list, wrapped as PyList", () => {
      const getList: ExternalFunction = {
        name: "get_list",
        func: () => [1, 2, 3], // Native array
        description: "returns native list",
        arity: 0,
      };

      const result = interpret("x = get_list()", { externalFunctions: [getList] });

      expect(result.error).toBeNull();
      expect(result.success).toBe(true);
      const frame = result.frames.find(f => {
        const obj = f.result?.jikiObject;
        return obj && "value" in obj && Array.isArray(obj.value);
      });
      expect(frame?.result?.jikiObject).toBeDefined();
      expect(frame?.result?.jikiObject?.type).toBe("list");
    });

    it("returns undefined, wrapped as PyNone", () => {
      const returnNothing: ExternalFunction = {
        name: "return_nothing",
        func: () => undefined,
        description: "returns undefined",
        arity: 0,
      };

      const result = interpret("x = return_nothing()", { externalFunctions: [returnNothing] });

      expect(result.error).toBeNull();
      expect(result.success).toBe(true);
      const frame = result.frames.find(f => f.result?.jikiObject?.type === "none");
      expect(frame?.result?.jikiObject?.type).toBe("none");
      expect(frame?.result?.jikiObject?.value).toBeNull();
    });

    it("returns null, wrapped as PyNone", () => {
      const returnNull: ExternalFunction = {
        name: "return_null",
        func: () => null,
        description: "returns null",
        arity: 0,
      };

      const result = interpret("x = return_null()", { externalFunctions: [returnNull] });

      expect(result.error).toBeNull();
      expect(result.success).toBe(true);
      const frame = result.frames.find(f => f.result?.jikiObject?.type === "none");
      expect(frame?.result?.jikiObject?.type).toBe("none");
      expect(frame?.result?.jikiObject?.value).toBeNull();
    });
  });

  describe("Function name protection", () => {
    it("should error when defining a function with the same name as an external function", () => {
      const move: ExternalFunction = {
        name: "move",
        func: (_ctx: ExecutionContext) => "moved",
        description: "moves the character",
        arity: 0,
      };

      const result = interpret(
        `def move():
    return "override"`,
        { externalFunctions: [move] }
      );

      expect(result.error).toBeNull();
      expect(result.frames).toHaveLength(1);
      expect(result.frames[0].status).toBe("ERROR");
      expect((result.frames[0] as any).error.type).toBe("FunctionAlreadyDefined");
      expect((result.frames[0] as any).error.message).toBe("FunctionAlreadyDefined: name: move");
    });

    it("should error when defining a function named print", () => {
      const result = interpret(
        `def print():
    return 1`
      );

      expect(result.error).toBeNull();
      expect(result.frames).toHaveLength(1);
      expect(result.frames[0].status).toBe("ERROR");
      expect((result.frames[0] as any).error.type).toBe("FunctionAlreadyDefined");
      expect((result.frames[0] as any).error.message).toBe("FunctionAlreadyDefined: name: print");
    });
  });
});
