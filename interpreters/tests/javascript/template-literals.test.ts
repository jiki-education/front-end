import { describe, expect, test } from "vitest";
import type { TestAugmentedFrame } from "@shared/frames";
import { interpret } from "@javascript/interpreter";

describe("Template Literals", () => {
  describe("basic template literals", () => {
    test("empty template literal", () => {
      const result = interpret("``;");
      expect(result.error).toBeNull();
      expect(result.frames).toHaveLength(1);
      expect(result.frames[0].status).toBe("SUCCESS");
      // Note: variables may include builtin objects like console
    });

    test("template literal with only text", () => {
      const result = interpret("`Hello, World!`;");
      expect(result.error).toBeNull();
      expect(result.frames).toHaveLength(1);
      expect(result.frames[0].status).toBe("SUCCESS");
    });

    test("template literal with newlines", () => {
      const result = interpret("`Hello\\nWorld`;");
      expect(result.error).toBeNull();
      expect(result.frames).toHaveLength(1);
      expect(result.frames[0].status).toBe("SUCCESS");
    });
  });

  describe("template literals with interpolation", () => {
    test("template literal with number interpolation", () => {
      const result = interpret("`The answer is ${42}`;");
      expect(result.error).toBeNull();
      expect(result.frames).toHaveLength(1);
      expect(result.frames[0].status).toBe("SUCCESS");
    });

    test("template literal with string interpolation", () => {
      const result = interpret('`Hello, ${"World"}`;');
      expect(result.error).toBeNull();
      expect(result.frames).toHaveLength(1);
      expect(result.frames[0].status).toBe("SUCCESS");
    });

    test("template literal with boolean interpolation", () => {
      const result = interpret("`The value is ${true}`;");
      expect(result.error).toBeNull();
      expect(result.frames).toHaveLength(1);
      expect(result.frames[0].status).toBe("SUCCESS");
    });

    test("template literal with null interpolation", () => {
      const result = interpret("`The value is ${null}`;");
      expect(result.error).toBeNull();
      expect(result.frames).toHaveLength(1);
      expect(result.frames[0].status).toBe("SUCCESS");
    });

    test("template literal with undefined interpolation", () => {
      const result = interpret("`The value is ${undefined}`;");
      expect(result.error).toBeNull();
      expect(result.frames).toHaveLength(1);
      expect(result.frames[0].status).toBe("SUCCESS");
    });
  });

  describe("template literals with variables", () => {
    test("template literal with variable interpolation", () => {
      const result = interpret(`
        let name = "Alice";
        \`Hello, \${name}!\`;
      `);
      expect(result.error).toBeNull();
      expect(result.frames).toHaveLength(2);
      expect(result.frames[0].status).toBe("SUCCESS");
      expect(result.frames[1].status).toBe("SUCCESS");
      expect((result.frames[1] as TestAugmentedFrame).variables.name.value).toBe("Alice");
    });

    test("template literal with multiple variable interpolations", () => {
      const result = interpret(`
        let first = "Alice";
        let last = "Smith";
        \`Hello, \${first} \${last}!\`;
      `);
      expect(result.error).toBeNull();
      expect(result.frames).toHaveLength(3);
      expect(result.frames[2].status).toBe("SUCCESS");
      expect((result.frames[2] as TestAugmentedFrame).variables.first.value).toBe("Alice");
      expect((result.frames[2] as TestAugmentedFrame).variables.last.value).toBe("Smith");
    });

    test("template literal with numeric variable", () => {
      const result = interpret(`
        let age = 25;
        \`I am \${age} years old\`;
      `);
      expect(result.error).toBeNull();
      expect(result.frames).toHaveLength(2);
      expect(result.frames[1].status).toBe("SUCCESS");
      expect((result.frames[1] as TestAugmentedFrame).variables.age.value).toBe(25);
    });
  });

  describe("template literals with expressions", () => {
    test("template literal with arithmetic expression", () => {
      const result = interpret("`The sum is ${2 + 3}`;");
      expect(result.error).toBeNull();
      expect(result.frames).toHaveLength(1);
      expect(result.frames[0].status).toBe("SUCCESS");
    });

    test("template literal with comparison expression", () => {
      const result = interpret("`Is 5 > 3? ${5 > 3}`;");
      expect(result.error).toBeNull();
      expect(result.frames).toHaveLength(1);
      expect(result.frames[0].status).toBe("SUCCESS");
    });

    test("template literal with logical expression", () => {
      const result = interpret("`Result: ${true && false}`;");
      expect(result.error).toBeNull();
      expect(result.frames).toHaveLength(1);
      expect(result.frames[0].status).toBe("SUCCESS");
    });

    test("template literal with grouped expression", () => {
      const result = interpret("`Result: ${(2 + 3) * 4}`;");
      expect(result.error).toBeNull();
      expect(result.frames).toHaveLength(1);
      expect(result.frames[0].status).toBe("SUCCESS");
    });
  });

  describe("template literals with complex interpolations", () => {
    test("template literal with multiple interpolations", () => {
      const result = interpret("`The sum of ${2} and ${3} is ${2 + 3}`;");
      expect(result.error).toBeNull();
      expect(result.frames).toHaveLength(1);
      expect(result.frames[0].status).toBe("SUCCESS");
    });

    test("template literal with mixed text and interpolations", () => {
      const result = interpret(`
        let x = 10;
        let y = 20;
        \`x = \${x}, y = \${y}, sum = \${x + y}\`;
      `);
      expect(result.error).toBeNull();
      expect(result.frames).toHaveLength(3);
      expect(result.frames[2].status).toBe("SUCCESS");
    });

    test("template literal in variable assignment", () => {
      const result = interpret(`
        let name = "Bob";
        let greeting = \`Hello, \${name}!\`;
      `);
      expect(result.error).toBeNull();
      expect(result.frames).toHaveLength(2);
      expect(result.frames[1].status).toBe("SUCCESS");
      expect((result.frames[1] as TestAugmentedFrame).variables.greeting.value).toBe("Hello, Bob!");
    });
  });

  describe("template literal edge cases", () => {
    test("template literal with empty interpolation should work", () => {
      const result = interpret("`Value: ${}`;");
      // This should produce a parse error because the interpolation is empty
      expect(result.error).not.toBeNull();
      expect(result.frames).toHaveLength(0);
    });

    test("template literal with just dollar sign", () => {
      const result = interpret("`Price: $100`;");
      expect(result.error).toBeNull();
      expect(result.frames).toHaveLength(1);
      expect(result.frames[0].status).toBe("SUCCESS");
    });
  });

  describe("template literal errors", () => {
    test("unterminated template literal", () => {
      const result = interpret("`Hello, World");
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("MissingBacktickToTerminateTemplateLiteral");
      expect(result.frames).toHaveLength(0);
    });

    test("template literal with undefined variable", () => {
      const result = interpret("`Hello, ${undefinedVar}!`;");
      expect(result.error).toBeNull();
      expect(result.frames).toHaveLength(1);
      expect(result.frames[0].status).toBe("ERROR");
      expect(result.frames[0].error?.message).toContain("VariableNotDeclared");
    });

    test("template literal with missing closing brace", () => {
      const result = interpret("`Hello, ${world`;");
      expect(result.error).not.toBeNull();
      // Scanner currently reports missing backtick when interpolation is unterminated
      expect(result.error?.message).toContain("MissingBacktickToTerminateTemplateLiteral");
      expect(result.frames).toHaveLength(0);
    });
  });

  describe("template literals in statements", () => {
    test("template literal in if condition (should use truthiness)", () => {
      const result = interpret(
        `
        if (\`hello\`) {
          let x = 1;
        }
      `,
        { languageFeatures: { allowTruthiness: true } }
      );
      expect(result.error).toBeNull();
      expect(result.frames).toHaveLength(2);
      expect(result.frames[0].status).toBe("SUCCESS");
      expect(result.frames[1].status).toBe("SUCCESS");
      expect((result.frames[1] as TestAugmentedFrame).variables.x.value).toBe(1);
    });

    test("template literal in for loop", () => {
      const result = interpret(`
        for (let i = 0; i < 3; i = i + 1) {
          let msg = \`Iteration \${i}\`;
        }
      `);
      expect(result.error).toBeNull();
      // Should have frames for initialization, conditions, loop bodies, and updates
      expect(result.frames.length).toBeGreaterThan(0);
      expect(result.frames[result.frames.length - 1].status).toBe("SUCCESS");
    });

    test("template literal in while loop", () => {
      const result = interpret(`
        let i = 0;
        while (i < 2) {
          let msg = \`Count: \${i}\`;
          i = i + 1;
        }
      `);
      expect(result.error).toBeNull();
      expect(result.frames.length).toBeGreaterThan(0);
      expect(result.frames[result.frames.length - 1].status).toBe("SUCCESS");
    });
  });
});
