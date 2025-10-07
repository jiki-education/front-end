import { describe, expect, it } from "vitest";
import { interpret } from "../../src/python/interpreter";
import { Parser } from "@python/parser";

function parse(code: string) {
  const parser = new Parser();
  return parser.parse(code);
}

interface TestAugmentedFrame {
  status: "SUCCESS" | "ERROR";
  result?: any;
  variables?: Record<string, any>;
  description?: string;
  error?: {
    type: string;
    message?: string;
    context?: any;
  };
}

describe("Python f-strings", () => {
  describe("basic f-strings", () => {
    it("should handle empty f-string", () => {
      const code = `result = f""`;
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("");
    });

    it("should handle f-string with only text", () => {
      const code = `result = f"hello world"`;
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("hello world");
    });

    it("should handle f-string with escape sequences", () => {
      const code = String.raw`result = f"line1\nline2"`;
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      // Python interpreter stores escape sequences as literal characters (not processed)
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("line1\\nline2");
    });
  });

  describe("simple interpolation", () => {
    it("should interpolate integers", () => {
      const code = `
x = 42
result = f"value is {x}"
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("value is 42");
    });

    it("should interpolate floats", () => {
      const code = `
x = 3.14
result = f"pi is {x}"
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("pi is 3.14");
    });

    it("should interpolate strings", () => {
      const code = `
name = "Alice"
result = f"Hello {name}"
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("Hello Alice");
    });

    it("should interpolate booleans", () => {
      const code = `
flag = True
result = f"flag is {flag}"
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("flag is True");
    });

    it("should interpolate None", () => {
      const code = `
x = None
result = f"value is {x}"
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("value is None");
    });
  });

  describe("multiple interpolations", () => {
    it("should handle multiple interpolations in one f-string", () => {
      const code = `
x = 5
y = 10
result = f"x={x} and y={y}"
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("x=5 and y=10");
    });

    it("should handle consecutive interpolations", () => {
      const code = `
a = "hello"
b = "world"
result = f"{a}{b}"
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("helloworld");
    });

    it("should handle three or more interpolations", () => {
      const code = `
a = 1
b = 2
c = 3
result = f"{a} + {b} = {c}"
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("1 + 2 = 3");
    });
  });

  describe("expression interpolation", () => {
    it("should interpolate arithmetic expressions", () => {
      const code = `
x = 5
result = f"x + 3 = {x + 3}"
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("x + 3 = 8");
    });

    it("should interpolate comparison expressions", () => {
      const code = `
x = 5
result = f"x > 3 is {x > 3}"
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("x > 3 is True");
    });

    it("should interpolate logical expressions", () => {
      const code = `
a = True
b = False
result = f"a and b = {a and b}"
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("a and b = False");
    });

    it("should interpolate literal values directly", () => {
      const code = `result = f"literal is {42}"`;
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("literal is 42");
    });
  });

  describe("complex cases", () => {
    it("should handle lists in f-strings", () => {
      const code = `
items = [1, 2, 3]
result = f"items: {items}"
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("items: [1, 2, 3]");
    });

    it("should handle list indexing in f-strings", () => {
      const code = `
items = [10, 20, 30]
result = f"first: {items[0]}"
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("first: 10");
    });
  });

  describe("escaped braces", () => {
    it("should handle escaped braces with no interpolation", () => {
      const code = `result = f"{{value}}"`;
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("{value}");
    });

    it("should handle mixed escaped braces and interpolation", () => {
      const code = `
x = 5
result = f"{x} {{literal}}"
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("5 {literal}");
    });

    it("should handle closing brace escape", () => {
      const code = `result = f"}}"`;
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("}");
    });

    it("should handle multiple escaped braces", () => {
      const code = `result = f"{{a}} {{b}}"`;
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("{a} {b}");
    });

    it("should handle escaped braces before interpolation", () => {
      const code = `
x = 10
result = f"{{prefix}}{x}"
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("{prefix}10");
    });

    it("should handle escaped braces after interpolation", () => {
      const code = `
x = 10
result = f"{x}{{suffix}}"
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("10{suffix}");
    });

    it("should handle triple braces as escape plus interpolation start", () => {
      const code = `
x = 5
result = f"{{{x}}}"
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("{5}");
    });

    it("should handle quadruple braces", () => {
      const code = `result = f"{{{{}}}}"`;
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("{{}}");
    });

    it("should handle mixed single and double closing braces", () => {
      const code = `result = f"}a}}b}c"`;
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("}a}b}c");
    });
  });

  describe("quotes in expressions", () => {
    it("should handle double-quoted strings in interpolations", () => {
      const code = `
def get_message():
    return "hello"

result = f"Message: {get_message()}"
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("Message: hello");
    });

    it("should handle single-quoted strings in interpolations", () => {
      const code = `result = f"Value: {'test'}"`;
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("Value: test");
    });
  });

  describe("nested and complex expressions", () => {
    it("should handle nested list access in interpolation", () => {
      const code = `
matrix = [[1, 2], [3, 4]]
result = f"Value: {matrix[0][1]}"
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("Value: 2");
    });

    it("should handle complex arithmetic in interpolation", () => {
      const code = `
x = 10
y = 3
result = f"Result: {(x + y) * 2 - 5}"
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("Result: 21");
    });

    it("should handle nested function calls in interpolation", () => {
      const code = `
def add(a, b):
    return a + b

def multiply(a, b):
    return a * b

result = f"Answer: {multiply(add(2, 3), 4)}"
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("Answer: 20");
    });

    it("should handle string method calls in interpolation", () => {
      const code = `
name = "world"
result = f"Hello {name.upper()}"
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("Hello WORLD");
    });
  });

  describe("error handling", () => {
    it("should report error for undefined variable in f-string", () => {
      const code = `result = f"value is {undefined_var}"`;
      const result = interpret(code);
      expect(result.success).toBe(false);

      const errorFrame = result.frames.find(f => (f as TestAugmentedFrame).status === "ERROR");
      expect(errorFrame).toBeDefined();
      expect((errorFrame as TestAugmentedFrame).error?.type).toBe("UndefinedVariable");
    });

    it("should report error for missing closing brace", () => {
      expect(() => parse(`result = f"value is {x"`)).toThrow("MissingRightBraceInFString");
    });

    it("should report error for unterminated f-string", () => {
      expect(() => parse(`result = f"unterminated`)).toThrow("UnterminatedFString");
    });
  });

  describe("integration with statements", () => {
    it("should work in assignment statements", () => {
      const code = `
name = "Bob"
greeting = f"Hello, {name}!"
result = greeting
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("Hello, Bob!");
    });

    it("should work in function calls", () => {
      const code = `
def greet(message):
    return message

name = "Charlie"
result = greet(f"Hi {name}")
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("Hi Charlie");
    });

    it("should work in list literals", () => {
      const code = `
x = 1
y = 2
messages = [f"first: {x}", f"second: {y}"]
result = messages[0]
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("first: 1");
    });
  });
});
