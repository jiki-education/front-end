import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";
import { SyntaxError } from "@javascript/error";
import type { NodeType } from "@javascript/interfaces";

describe("JavaScript allowedNodes feature", () => {
  describe("allowedNodes: null (default)", () => {
    test("allows all node types when allowedNodes is null", () => {
      const code = `
        let x = 5;
        x = x + 1;
        if (x > 5) {
          x = 10;
        }
        for (let i = 0; i < 3; i = i + 1) {
          x = x + 1;
        }
      `;
      const { error, frames } = interpret(code, { languageFeatures: { allowedNodes: null } });
      expect(error).toBeNull();
      expect(frames.length).toBeGreaterThan(0);
    });

    test("allows all node types when allowedNodes is undefined", () => {
      const code = `
        let x = 5;
        x = x + 1;
        if (x > 5) {
          x = 10;
        }
      `;
      const { error, frames } = interpret(code);
      expect(error).toBeNull();
      expect(frames.length).toBeGreaterThan(0);
    });
  });

  describe("allowedNodes: [] (empty array)", () => {
    test("prevents all parsing when allowedNodes is empty", () => {
      const code = `5;`;
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
    describe("VariableDeclaration", () => {
      test("allows variable declarations when included", () => {
        const code = `let x = 5;`;
        const allowedNodes: NodeType[] = ["VariableDeclaration", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
      });

      test("prevents variable declarations when not included", () => {
        const code = `let x = 5;`;
        const allowedNodes: NodeType[] = ["LiteralExpression", "ExpressionStatement"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("VariableDeclarationNotAllowed");
        expect(frames).toHaveLength(0);
      });
    });

    describe("IfStatement", () => {
      test("allows if statements when included", () => {
        const code = `if (true) { 1; }`;
        const allowedNodes: NodeType[] = ["IfStatement", "BlockStatement", "LiteralExpression", "ExpressionStatement"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
      });

      test("prevents if statements when not included", () => {
        const code = `if (true) { 1; }`;
        const allowedNodes: NodeType[] = ["BlockStatement", "LiteralExpression", "ExpressionStatement"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("IfStatementNotAllowed");
        expect(frames).toHaveLength(0);
      });
    });

    describe("ForStatement", () => {
      test("allows for loops when included", () => {
        const code = `for (let i = 0; i < 3; i = i + 1) { }`;
        const allowedNodes: NodeType[] = [
          "ForStatement",
          "VariableDeclaration",
          "BlockStatement",
          "LiteralExpression",
          "IdentifierExpression",
          "BinaryExpression",
          "AssignmentExpression",
        ];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
      });

      test("prevents for loops when not included", () => {
        const code = `for (let i = 0; i < 3; i = i + 1) { }`;
        const allowedNodes: NodeType[] = ["VariableDeclaration", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("ForStatementNotAllowed");
        expect(frames).toHaveLength(0);
      });
    });

    describe("WhileStatement", () => {
      test("allows while loops when included", () => {
        const code = `while (false) { }`;
        const allowedNodes: NodeType[] = ["WhileStatement", "BlockStatement", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
      });

      test("prevents while loops when not included", () => {
        const code = `while (false) { }`;
        const allowedNodes: NodeType[] = ["BlockStatement", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("WhileStatementNotAllowed");
        expect(frames).toHaveLength(0);
      });
    });

    describe("BlockStatement", () => {
      test("allows blocks when included", () => {
        const code = `{ 1; }`;
        const allowedNodes: NodeType[] = ["BlockStatement", "ExpressionStatement", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
      });

      test("prevents blocks when not included", () => {
        const code = `{ 1; }`;
        const allowedNodes: NodeType[] = ["ExpressionStatement", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("BlockStatementNotAllowed");
        expect(frames).toHaveLength(0);
      });
    });

    describe("ExpressionStatement", () => {
      test("allows expression statements when included", () => {
        const code = `5;`;
        const allowedNodes: NodeType[] = ["ExpressionStatement", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
      });

      test("prevents expression statements when not included", () => {
        const code = `5;`;
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
        const code = `42;`;
        const allowedNodes: NodeType[] = ["ExpressionStatement", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
      });

      test("prevents literals when not included", () => {
        const code = `42;`;
        const allowedNodes: NodeType[] = ["ExpressionStatement"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("LiteralExpressionNotAllowed");
        expect(frames).toHaveLength(0);
      });

      test("prevents all literal types", () => {
        const testCases = [
          { code: `true;`, desc: "boolean true" },
          { code: `false;`, desc: "boolean false" },
          { code: `null;`, desc: "null" },
          { code: `undefined;`, desc: "undefined" },
          { code: `42;`, desc: "number" },
          { code: `"hello";`, desc: "string" },
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
        const code = `1 + 2;`;
        const allowedNodes: NodeType[] = ["ExpressionStatement", "BinaryExpression", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
      });

      test("prevents binary expressions when not included", () => {
        const code = `1 + 2;`;
        const allowedNodes: NodeType[] = ["ExpressionStatement", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("BinaryExpressionNotAllowed");
        expect(frames).toHaveLength(0);
      });

      test("prevents all binary operators", () => {
        const testCases = [
          { code: `1 + 2;`, op: "addition" },
          { code: `1 - 2;`, op: "subtraction" },
          { code: `1 * 2;`, op: "multiplication" },
          { code: `1 / 2;`, op: "division" },
          { code: `1 < 2;`, op: "less than" },
          { code: `1 > 2;`, op: "greater than" },
          { code: `1 <= 2;`, op: "less than or equal" },
          { code: `1 >= 2;`, op: "greater than or equal" },
          { code: `1 == 2;`, op: "equality" },
          { code: `1 != 2;`, op: "inequality" },
          { code: `true && false;`, op: "logical AND" },
          { code: `true || false;`, op: "logical OR" },
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
        const code = `-5;`;
        const allowedNodes: NodeType[] = ["ExpressionStatement", "UnaryExpression", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
      });

      test("prevents unary expressions when not included", () => {
        const code = `-5;`;
        const allowedNodes: NodeType[] = ["ExpressionStatement", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("UnaryExpressionNotAllowed");
        expect(frames).toHaveLength(0);
      });
    });

    describe("AssignmentExpression", () => {
      test("allows assignments when included", () => {
        const code = `let x = 5; x = 10;`;
        const allowedNodes: NodeType[] = [
          "VariableDeclaration",
          "ExpressionStatement",
          "AssignmentExpression",
          "IdentifierExpression",
          "LiteralExpression",
        ];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.x.value).toBe(10);
      });

      test("prevents assignments when not included", () => {
        const code = `let x = 5; x = 10;`;
        const allowedNodes: NodeType[] = [
          "VariableDeclaration",
          "ExpressionStatement",
          "IdentifierExpression",
          "LiteralExpression",
        ];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("AssignmentExpressionNotAllowed");
      });
    });

    describe("UpdateExpression", () => {
      test("allows update expressions when included", () => {
        const code = `let x = 5; x++;`;
        const allowedNodes: NodeType[] = [
          "VariableDeclaration",
          "ExpressionStatement",
          "UpdateExpression",
          "IdentifierExpression",
          "LiteralExpression",
        ];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
        expect((frames[frames.length - 1] as TestAugmentedFrame).variables.x.value).toBe(6);
      });

      test("prevents prefix increment when not included", () => {
        const code = `let x = 5; ++x;`;
        const allowedNodes: NodeType[] = [
          "VariableDeclaration",
          "ExpressionStatement",
          "IdentifierExpression",
          "LiteralExpression",
        ];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("UpdateExpressionNotAllowed");
      });

      test("prevents postfix decrement when not included", () => {
        const code = `let x = 5; x--;`;
        const allowedNodes: NodeType[] = [
          "VariableDeclaration",
          "ExpressionStatement",
          "IdentifierExpression",
          "LiteralExpression",
        ];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("UpdateExpressionNotAllowed");
      });
    });

    describe("IdentifierExpression", () => {
      test("allows identifiers when included", () => {
        const code = `let x = 5; x;`;
        const allowedNodes: NodeType[] = [
          "VariableDeclaration",
          "ExpressionStatement",
          "IdentifierExpression",
          "LiteralExpression",
        ];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
      });

      test("prevents identifiers when not included", () => {
        const code = `let x = 5; x;`;
        const allowedNodes: NodeType[] = ["VariableDeclaration", "ExpressionStatement", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("IdentifierExpressionNotAllowed");
      });
    });

    describe("GroupingExpression", () => {
      test("allows grouping when included", () => {
        const code = `(5);`;
        const allowedNodes: NodeType[] = ["ExpressionStatement", "GroupingExpression", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
      });

      test("prevents grouping when not included", () => {
        const code = `(5);`;
        const allowedNodes: NodeType[] = ["ExpressionStatement", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("GroupingExpressionNotAllowed");
        expect(frames).toHaveLength(0);
      });
    });

    describe("ArrayExpression", () => {
      test("allows arrays when included", () => {
        const code = `[1, 2, 3];`;
        const allowedNodes: NodeType[] = ["ExpressionStatement", "ArrayExpression", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
      });

      test("prevents arrays when not included", () => {
        const code = `[1, 2, 3];`;
        const allowedNodes: NodeType[] = ["ExpressionStatement", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("ArrayExpressionNotAllowed");
        expect(frames).toHaveLength(0);
      });
    });

    describe("DictionaryExpression", () => {
      test("allows objects when included", () => {
        const code = `({ x: 5, y: 10 });`; // Object literal needs parentheses at statement level
        const allowedNodes: NodeType[] = [
          "ExpressionStatement",
          "GroupingExpression",
          "DictionaryExpression",
          "LiteralExpression",
        ];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
      });

      test("prevents objects when not included", () => {
        const code = `let obj = { x: 5 };`; // Use in variable declaration to avoid ambiguity
        const allowedNodes: NodeType[] = ["VariableDeclaration", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("DictionaryExpressionNotAllowed");
        expect(frames).toHaveLength(0);
      });
    });

    describe("IndexExpression (bracket notation)", () => {
      test("allows bracket access when included", () => {
        const code = `let arr = [1, 2]; arr[0];`;
        const allowedNodes: NodeType[] = [
          "VariableDeclaration",
          "ExpressionStatement",
          "ArrayExpression",
          "IndexExpression",
          "IdentifierExpression",
          "LiteralExpression",
        ];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
      });

      test("prevents bracket notation when not included", () => {
        const code = `let arr = [1, 2]; arr[0];`;
        const allowedNodes: NodeType[] = [
          "VariableDeclaration",
          "ExpressionStatement",
          "ArrayExpression",
          "IdentifierExpression",
          "LiteralExpression",
        ];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("IndexExpressionNotAllowed");
      });

      test("allows string bracket access when included", () => {
        const code = `let s = "hello"; s[0];`;
        const allowedNodes: NodeType[] = [
          "VariableDeclaration",
          "ExpressionStatement",
          "IndexExpression",
          "IdentifierExpression",
          "LiteralExpression",
        ];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
      });

      test("allows bracket access without dot access", () => {
        // IndexExpression allowed, MemberExpression NOT allowed
        const code = `let arr = [1, 2]; arr[0];`;
        const allowedNodes: NodeType[] = [
          "VariableDeclaration",
          "ExpressionStatement",
          "ArrayExpression",
          "DictionaryExpression",
          "IndexExpression",
          "IdentifierExpression",
          "LiteralExpression",
        ];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);

        // But dot notation should be blocked
        const code2 = `let obj = { x: 5 }; obj.x;`;
        const { error: error2 } = interpret(code2, { languageFeatures: { allowedNodes } });
        expect(error2).toBeInstanceOf(SyntaxError);
        expect(error2?.type).toBe("MemberExpressionNotAllowed");
      });
    });

    describe("MemberExpression (dot notation)", () => {
      test("allows dot access when included", () => {
        const code = `let obj = { x: 5 }; obj.x;`;
        const allowedNodes: NodeType[] = [
          "VariableDeclaration",
          "ExpressionStatement",
          "DictionaryExpression",
          "MemberExpression",
          "IdentifierExpression",
          "LiteralExpression",
        ];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
      });

      test("prevents dot notation when not included", () => {
        const code = `let obj = { x: 5 }; obj.x;`;
        const allowedNodes: NodeType[] = [
          "VariableDeclaration",
          "ExpressionStatement",
          "DictionaryExpression",
          "IdentifierExpression",
          "LiteralExpression",
        ];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("MemberExpressionNotAllowed");
      });

      test("allows dot access without bracket access", () => {
        // MemberExpression allowed, IndexExpression NOT allowed
        const code = `let obj = { x: 5 }; obj.x;`;
        const allowedNodes: NodeType[] = [
          "VariableDeclaration",
          "ExpressionStatement",
          "DictionaryExpression",
          "MemberExpression",
          "IdentifierExpression",
          "LiteralExpression",
        ];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);

        // But bracket notation should be blocked
        const code2 = `let arr = [1, 2]; arr[0];`;
        const allowedNodes2: NodeType[] = [
          "VariableDeclaration",
          "ExpressionStatement",
          "ArrayExpression",
          "MemberExpression",
          "IdentifierExpression",
          "LiteralExpression",
        ];
        const { error: error2 } = interpret(code2, { languageFeatures: { allowedNodes: allowedNodes2 } });
        expect(error2).toBeInstanceOf(SyntaxError);
        expect(error2?.type).toBe("IndexExpressionNotAllowed");
      });
    });

    describe("TemplateLiteralExpression", () => {
      test("allows template literals when included", () => {
        const code = "`hello world`;";
        const allowedNodes: NodeType[] = ["ExpressionStatement", "TemplateLiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeNull();
        expect(frames.length).toBeGreaterThan(0);
      });

      test("prevents template literals when not included", () => {
        const code = "`hello`;";
        const allowedNodes: NodeType[] = ["ExpressionStatement", "LiteralExpression"];
        const { error, frames } = interpret(code, { languageFeatures: { allowedNodes } });
        expect(error).toBeInstanceOf(SyntaxError);
        expect(error?.type).toBe("TemplateLiteralExpressionNotAllowed");
        expect(frames).toHaveLength(0);
      });
    });
  });

  describe("Complex scenarios", () => {
    test("allows only literals and expression statements", () => {
      const allowedNodes: NodeType[] = ["ExpressionStatement", "LiteralExpression"];

      // Should work
      const { error: error1 } = interpret(`5;`, { languageFeatures: { allowedNodes } });
      expect(error1).toBeNull();

      // Should fail - needs identifier
      const { error: error2 } = interpret(`let x = 5;`, { languageFeatures: { allowedNodes } });
      expect(error2?.type).toBe("VariableDeclarationNotAllowed");

      // Should fail - needs binary expression
      const { error: error3 } = interpret(`1 + 2;`, { languageFeatures: { allowedNodes } });
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
      const { error: error1, frames: frames1 } = interpret(`(1 + 2) * 3;`, { languageFeatures: { allowedNodes } });
      expect(error1).toBeNull();
      expect(frames1.length).toBeGreaterThan(0);

      // Should fail - needs variable declaration
      const { error: error2 } = interpret(`let x = 1 + 2;`, { languageFeatures: { allowedNodes } });
      expect(error2?.type).toBe("VariableDeclarationNotAllowed");
    });

    test("allows variables but no control flow", () => {
      const allowedNodes: NodeType[] = [
        "VariableDeclaration",
        "ExpressionStatement",
        "AssignmentExpression",
        "IdentifierExpression",
        "LiteralExpression",
        "BinaryExpression",
      ];

      // Should work
      const { error: error1, frames: frames1 } = interpret(
        `
        let x = 5;
        x = x + 1;
        x;
      `,
        { languageFeatures: { allowedNodes } }
      );
      expect(error1).toBeNull();
      expect((frames1[frames1.length - 1] as TestAugmentedFrame).variables.x.value).toBe(6);

      // Should fail - needs if statement
      const { error: error2 } = interpret(
        `
        let x = 5;
        if (x > 0) { x = 10; }
      `,
        { languageFeatures: { allowedNodes } }
      );
      expect(error2?.type).toBe("IfStatementNotAllowed");
    });

    test("allows control flow but no loops", () => {
      const allowedNodes: NodeType[] = [
        "VariableDeclaration",
        "IfStatement",
        "BlockStatement",
        "ExpressionStatement",
        "AssignmentExpression",
        "BinaryExpression",
        "IdentifierExpression",
        "LiteralExpression",
      ];

      // Should work
      const { error: error1, frames: frames1 } = interpret(
        `
        let x = 5;
        if (x > 0) {
          x = 10;
        }
      `,
        { languageFeatures: { allowedNodes } }
      );
      expect(error1).toBeNull();
      expect((frames1[frames1.length - 1] as TestAugmentedFrame).variables.x.value).toBe(10);

      // Should fail - needs for statement
      const { error: error2 } = interpret(
        `
        for (let i = 0; i < 3; i = i + 1) { }
      `,
        { languageFeatures: { allowedNodes } }
      );
      expect(error2?.type).toBe("ForStatementNotAllowed");

      // Should fail - needs while statement
      const { error: error3 } = interpret(
        `
        while (false) { }
      `,
        { languageFeatures: { allowedNodes } }
      );
      expect(error3?.type).toBe("WhileStatementNotAllowed");
    });
  });
});
