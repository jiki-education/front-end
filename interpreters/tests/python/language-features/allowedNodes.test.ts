import { interpret } from "@python/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";
import { SyntaxError } from "@python/error";
import type { NodeType } from "@python/interfaces";
import { changeLanguage } from "@python/translator";

describe("Python allowedNodes feature", () => {
  beforeEach(() => {
    changeLanguage("en");
  });

  describe("allowedNodes: null (default)", () => {
    test("allows all node types when allowedNodes is null", () => {
      const code = `
x = 5
x = x + 1
if x > 5:
    x = 10
for i in [1, 2, 3]:
    x = x + 1
      `.trim();
      const { error, frames } = interpret(code, { languageFeatures: { allowedNodes: null } });
      expect(error).toBeNull();
      expect(frames.length).toBeGreaterThan(0);
    });

    test("allows all node types when allowedNodes is undefined", () => {
      const code = `
x = 5
x = x + 1
if x > 5:
    x = 10
      `.trim();
      const { error, frames } = interpret(code);
      expect(error).toBeNull();
      expect(frames.length).toBeGreaterThan(0);
    });
  });

  describe("allowedNodes: [] (empty array)", () => {
    test("prevents all parsing when allowedNodes is empty", () => {
      const code = `5`;
      const { error, frames } = interpret(code, { languageFeatures: { allowedNodes: [] } });
      expect(error).toBeInstanceOf(SyntaxError);
      expect(error?.type).toBe("ExpressionStatementNotAllowed");
      expect(frames).toHaveLength(0);
    });

    test("cannot even parse literals with empty allowedNodes", () => {
      const code = `42`;
      const { error, frames } = interpret(code, { languageFeatures: { allowedNodes: [] } });
      expect(error).toBeInstanceOf(SyntaxError);
      expect(error?.type).toBe("ExpressionStatementNotAllowed");
      expect(frames).toHaveLength(0);
    });
  });

  describe("Statement restrictions", () => {
    describe("AssignmentStatement", () => {
      test("allows assignments when included", () => {
        const code = `x = 5`;
        const allowedNodes: NodeType[] = ["AssignmentStatement", "LiteralExpression", "IdentifierExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
      });

      test("prevents assignments when not included", () => {
        const code = `x = 5`;
        const allowedNodes: NodeType[] = ["LiteralExpression", "ExpressionStatement"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("AssignmentStatementNotAllowed");
        expect(frames).toHaveLength(0);
      });
    });

    describe("IfStatement", () => {
      test("allows if statements when included", () => {
        const code = `
if True:
    1
        `.trim();
        const allowedNodes: NodeType[] = ["IfStatement", "BlockStatement", "LiteralExpression", "ExpressionStatement"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
      });

      test("prevents if statements when not included", () => {
        const code = `
if True:
    1
        `.trim();
        const allowedNodes: NodeType[] = ["BlockStatement", "LiteralExpression", "ExpressionStatement"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("IfStatementNotAllowed");
        expect(frames).toHaveLength(0);
      });
    });

    describe("ForInStatement", () => {
      test("allows for loops when included", () => {
        const code = `
for i in [1, 2, 3]:
    x = i
        `.trim();
        const allowedNodes: NodeType[] = [
          "ForInStatement",
          "BlockStatement",
          "ListExpression",
          "LiteralExpression",
          "IdentifierExpression",
          "AssignmentStatement",
        ];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
      });

      test("prevents for loops when not included", () => {
        const code = `
for i in [1, 2]:
    x = i
        `.trim();
        const allowedNodes: NodeType[] = ["ListExpression", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("ForInStatementNotAllowed");
        expect(frames).toHaveLength(0);
      });
    });

    describe("BreakStatement", () => {
      test("allows break statements when included", () => {
        const code = `
for i in [1]:
    break
        `.trim();
        const allowedNodes: NodeType[] = [
          "ForInStatement",
          "BreakStatement",
          "BlockStatement",
          "ListExpression",
          "LiteralExpression",
          "IdentifierExpression",
        ];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
      });

      test("prevents break statements when not included", () => {
        const code = `
for i in [1]:
    break
        `.trim();
        const allowedNodes: NodeType[] = ["ForInStatement", "BlockStatement", "ListExpression", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("BreakStatementNotAllowed");
        expect(frames).toHaveLength(0);
      });
    });

    describe("ContinueStatement", () => {
      test("allows continue statements when included", () => {
        const code = `
for i in [1]:
    continue
        `.trim();
        const allowedNodes: NodeType[] = [
          "ForInStatement",
          "ContinueStatement",
          "BlockStatement",
          "ListExpression",
          "LiteralExpression",
          "IdentifierExpression",
        ];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
      });

      test("prevents continue statements when not included", () => {
        const code = `
for i in [1]:
    continue
        `.trim();
        const allowedNodes: NodeType[] = ["ForInStatement", "BlockStatement", "ListExpression", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("ContinueStatementNotAllowed");
        expect(frames).toHaveLength(0);
      });
    });

    describe("BlockStatement", () => {
      test("allows blocks when included", () => {
        const code = `
if True:
    1
        `.trim();
        const allowedNodes: NodeType[] = ["IfStatement", "BlockStatement", "ExpressionStatement", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
      });

      test("prevents blocks when not included", () => {
        const code = `
if True:
    1
        `.trim();
        const allowedNodes: NodeType[] = ["IfStatement", "ExpressionStatement", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("BlockStatementNotAllowed");
        expect(frames).toHaveLength(0);
      });
    });

    describe("ExpressionStatement", () => {
      test("allows expression statements when included", () => {
        const code = `5`;
        const allowedNodes: NodeType[] = ["ExpressionStatement", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
      });

      test("prevents expression statements when not included", () => {
        const code = `5`;
        const allowedNodes: NodeType[] = ["LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("ExpressionStatementNotAllowed");
        expect(frames).toHaveLength(0);
      });
    });
  });

  describe("Expression restrictions", () => {
    describe("LiteralExpression", () => {
      test("allows literals when included", () => {
        const code = `42`;
        const allowedNodes: NodeType[] = ["ExpressionStatement", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
      });

      test("prevents literals when not included", () => {
        const code = `42`;
        const allowedNodes: NodeType[] = ["ExpressionStatement"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("LiteralExpressionNotAllowed");
        expect(frames).toHaveLength(0);
      });

      test("prevents all literal types", () => {
        const testCases = [
          { code: `True`, desc: "boolean True" },
          { code: `False`, desc: "boolean False" },
          { code: `None`, desc: "None" },
          { code: `42`, desc: "number" },
          { code: `"hello"`, desc: "string" },
        ];

        const allowedNodes: NodeType[] = ["ExpressionStatement"];

        for (const { code, desc } of testCases) {
          const { error } = interpret(code, { languageFeatures: { allowedNodes } });
          expect(error).toBeInstanceOf(SyntaxError);
          expect(error?.type).toBe("LiteralExpressionNotAllowed");
        }
      });
    });

    describe("BinaryExpression", () => {
      test("allows binary expressions when included", () => {
        const code = `1 + 2`;
        const allowedNodes: NodeType[] = ["ExpressionStatement", "BinaryExpression", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
      });

      test("prevents binary expressions when not included", () => {
        const code = `1 + 2`;
        const allowedNodes: NodeType[] = ["ExpressionStatement", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("BinaryExpressionNotAllowed");
        expect(frames).toHaveLength(0);
      });

      test("prevents all binary operators", () => {
        const testCases = [
          { code: `1 + 2`, op: "addition" },
          { code: `1 - 2`, op: "subtraction" },
          { code: `1 * 2`, op: "multiplication" },
          { code: `1 / 2`, op: "division" },
          { code: `1 < 2`, op: "less than" },
          { code: `1 > 2`, op: "greater than" },
          { code: `1 <= 2`, op: "less than or equal" },
          { code: `1 >= 2`, op: "greater than or equal" },
          { code: `1 == 2`, op: "equality" },
          { code: `1 != 2`, op: "inequality" },
          { code: `True and False`, op: "logical AND" },
          { code: `True or False`, op: "logical OR" },
        ];

        const allowedNodes: NodeType[] = ["ExpressionStatement", "LiteralExpression"];

        for (const { code, op } of testCases) {
          const { error } = interpret(code, { languageFeatures: { allowedNodes } });
          expect(error).toBeInstanceOf(SyntaxError);
          expect(error?.type).toBe("BinaryExpressionNotAllowed");
        }
      });
    });

    describe("UnaryExpression", () => {
      test("allows unary expressions when included", () => {
        const code = `-5`;
        const allowedNodes: NodeType[] = ["ExpressionStatement", "UnaryExpression", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
      });

      test("prevents unary expressions when not included", () => {
        const code = `-5`;
        const allowedNodes: NodeType[] = ["ExpressionStatement", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("UnaryExpressionNotAllowed");
        expect(frames).toHaveLength(0);
      });

      test("prevents not operator", () => {
        const code = `not True`;
        const allowedNodes: NodeType[] = ["ExpressionStatement", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("UnaryExpressionNotAllowed");
        expect(frames).toHaveLength(0);
      });
    });

    describe("IdentifierExpression", () => {
      test("allows identifiers when included", () => {
        const code = `
x = 5
x
        `.trim();
        const allowedNodes: NodeType[] = [
          "AssignmentStatement",
          "ExpressionStatement",
          "IdentifierExpression",
          "LiteralExpression",
        ];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
      });

      test("prevents identifiers when not included", () => {
        const code = `
x = 5
x
        `.trim();
        const allowedNodes: NodeType[] = ["AssignmentStatement", "ExpressionStatement", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("IdentifierExpressionNotAllowed");
        expect(frames).toHaveLength(0);
      });
    });

    describe("GroupingExpression", () => {
      test("allows grouping when included", () => {
        const code = `(5)`;
        const allowedNodes: NodeType[] = ["ExpressionStatement", "GroupingExpression", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
      });

      test("prevents grouping when not included", () => {
        const code = `(5)`;
        const allowedNodes: NodeType[] = ["ExpressionStatement", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("GroupingExpressionNotAllowed");
        expect(frames).toHaveLength(0);
      });
    });

    describe("ListExpression", () => {
      test("allows lists when included", () => {
        const code = `[1, 2, 3]`;
        const allowedNodes: NodeType[] = ["ExpressionStatement", "ListExpression", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
      });

      test("prevents lists when not included", () => {
        const code = `[1, 2, 3]`;
        const allowedNodes: NodeType[] = ["ExpressionStatement", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("ListExpressionNotAllowed");
        expect(frames).toHaveLength(0);
      });
    });

    describe("SubscriptExpression", () => {
      test("allows subscript access when included", () => {
        const code = `
lst = [1, 2]
lst[0]
        `.trim();
        const allowedNodes: NodeType[] = [
          "AssignmentStatement",
          "ExpressionStatement",
          "ListExpression",
          "SubscriptExpression",
          "IdentifierExpression",
          "LiteralExpression",
        ];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
      });

      test("prevents subscript access when not included", () => {
        const code = `
lst = [1, 2]
lst[0]
        `.trim();
        const allowedNodes: NodeType[] = [
          "AssignmentStatement",
          "ExpressionStatement",
          "ListExpression",
          "IdentifierExpression",
          "LiteralExpression",
        ];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("SubscriptExpressionNotAllowed");
        expect(frames).toHaveLength(0);
      });
    });
  });

  describe("Complex scenarios", () => {
    test("allows only literals and expression statements", () => {
      const allowedNodes: NodeType[] = ["ExpressionStatement", "LiteralExpression"];

      // Should work
      const { error: error1 } = interpret(`5`, { languageFeatures: { allowedNodes } });
      expect(error1).toBeNull();

      // Should fail - needs assignment
      const { error: error2 } = interpret(`x = 5`, { languageFeatures: { allowedNodes } });
      expect(error2?.type).toBe("AssignmentStatementNotAllowed");

      // Should fail - needs binary expression
      const { error: error3 } = interpret(`1 + 2`, { languageFeatures: { allowedNodes } });
      expect(error3?.type).toBe("BinaryExpressionNotAllowed");
    });

    test("allows basic arithmetic only", () => {
      const allowedNodes: NodeType[] = [
        "ExpressionStatement",
        "LiteralExpression",
        "BinaryExpression",
        "GroupingExpression",
      ];

      // Should work
      const { error: error1, frames: frames1 } = interpret(`(1 + 2) * 3`, { languageFeatures: { allowedNodes } });
      expect(error1).toBeNull();
      expect(frames1.length).toBeGreaterThan(0);

      // Should fail - needs assignment
      const { error: error2 } = interpret(`x = 1 + 2`, { languageFeatures: { allowedNodes } });
      expect(error2?.type).toBe("AssignmentStatementNotAllowed");
    });

    test("allows variables but no control flow", () => {
      const allowedNodes: NodeType[] = [
        "AssignmentStatement",
        "ExpressionStatement",
        "IdentifierExpression",
        "LiteralExpression",
        "BinaryExpression",
      ];

      // Should work
      const { error: error1, frames: frames1 } = interpret(
        `
x = 5
x = x + 1
x
      `.trim(),
        { languageFeatures: { allowedNodes } }
      );
      expect(error1).toBeNull();
      expect((frames1[frames1.length - 1] as TestAugmentedFrame).variables.x.value).toBe(6);

      // Should fail - needs if statement
      const { error: error2 } = interpret(
        `
x = 5
if x > 0:
    x = 10
      `.trim(),
        { languageFeatures: { allowedNodes } }
      );
      expect(error2?.type).toBe("IfStatementNotAllowed");
    });

    test("allows control flow but no loops", () => {
      const allowedNodes: NodeType[] = [
        "AssignmentStatement",
        "IfStatement",
        "BlockStatement",
        "ExpressionStatement",
        "BinaryExpression",
        "IdentifierExpression",
        "LiteralExpression",
      ];

      // Should work
      const { error: error1, frames: frames1 } = interpret(
        `
x = 5
if x > 0:
    x = 10
      `.trim(),
        { languageFeatures: { allowedNodes } }
      );
      expect(error1).toBeNull();
      expect((frames1[frames1.length - 1] as TestAugmentedFrame).variables.x.value).toBe(10);

      // Should fail - needs for statement
      const { error: error2 } = interpret(
        `
for i in [1, 2, 3]:
    x = i
      `.trim(),
        { languageFeatures: { allowedNodes } }
      );
      expect(error2?.type).toBe("ForInStatementNotAllowed");
    });
  });
});
