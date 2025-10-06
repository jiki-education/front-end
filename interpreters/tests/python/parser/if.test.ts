import { Parser } from "@python/parser";
import { IfStatement, BlockStatement } from "@python/statement";
import { BinaryExpression, LiteralExpression } from "@python/expression";

describe("Python Parser - If Statements", () => {
  let parser: Parser;

  beforeEach(() => {
    parser = new Parser({});
  });

  test("parses simple if statement", () => {
    const code = `if True:
    x = 1`;

    const statements = parser.parse(code);

    expect(statements).toHaveLength(1);
    expect(statements[0]).toBeInstanceOf(IfStatement);

    const ifStmt = statements[0] as IfStatement;
    expect(ifStmt.condition).toBeInstanceOf(LiteralExpression);
    expect((ifStmt.condition as LiteralExpression).value).toBe(true);

    expect(ifStmt.thenBranch).toBeInstanceOf(BlockStatement);
    const block = ifStmt.thenBranch as BlockStatement;
    expect(block.statements).toHaveLength(1);

    expect(ifStmt.elseBranch).toBeNull();
  });

  test("parses if statement with multiple statements in block", () => {
    const code = `if True:
    x = 1
    y = 2
    z = 3`;

    const statements = parser.parse(code);

    expect(statements).toHaveLength(1);
    const ifStmt = statements[0] as IfStatement;
    const block = ifStmt.thenBranch as BlockStatement;
    expect(block.statements).toHaveLength(3);
  });

  test("parses if statement with expression condition", () => {
    const code = `if x > 5:
    y = 10`;

    const statements = parser.parse(code);

    expect(statements).toHaveLength(1);
    const ifStmt = statements[0] as IfStatement;
    expect(ifStmt.condition).toBeInstanceOf(BinaryExpression);

    const condition = ifStmt.condition as BinaryExpression;
    expect(condition.operator.type).toBe("GREATER");
  });

  test("handles nested if statements", () => {
    const code = `if True:
    if False:
        x = 1`;

    const statements = parser.parse(code);

    expect(statements).toHaveLength(1);
    const outerIf = statements[0] as IfStatement;
    const outerBlock = outerIf.thenBranch as BlockStatement;
    expect(outerBlock.statements).toHaveLength(1);

    const innerIf = outerBlock.statements[0] as IfStatement;
    expect(innerIf).toBeInstanceOf(IfStatement);
    const innerBlock = innerIf.thenBranch as BlockStatement;
    expect(innerBlock.statements).toHaveLength(1);
  });

  test("throws error for missing colon", () => {
    const code = `if True
    x = 1`;

    expect(() => parser.parse(code)).toThrow("MissingColon");
  });

  test("throws error for missing indentation", () => {
    const code = `if True:
x = 1`;

    expect(() => parser.parse(code)).toThrow("MissingIndent");
  });

  test("throws error for incorrect indentation level", () => {
    const code = `if True:
   x = 1`; // 3 spaces instead of 4

    expect(() => parser.parse(code)).toThrow("Indentation must be a multiple of 4 spaces.");
  });

  test("handles empty lines in blocks", () => {
    const code = `if True:
    x = 1

    y = 2`;

    const statements = parser.parse(code);

    expect(statements).toHaveLength(1);
    const ifStmt = statements[0] as IfStatement;
    const block = ifStmt.thenBranch as BlockStatement;
    expect(block.statements).toHaveLength(2);
  });

  test("handles complex condition expressions", () => {
    const code = `if x > 5 and y < 10:
    z = 15`;

    const statements = parser.parse(code);

    expect(statements).toHaveLength(1);
    const ifStmt = statements[0] as IfStatement;
    expect(ifStmt.condition).toBeInstanceOf(BinaryExpression);

    const condition = ifStmt.condition as BinaryExpression;
    expect(condition.operator.type).toBe("AND");
  });

  test("parses if-else statement", () => {
    const code = `if True:
    x = 1
else:
    x = 2`;

    const statements = parser.parse(code);

    expect(statements).toHaveLength(1);
    const ifStmt = statements[0] as IfStatement;
    expect(ifStmt.condition).toBeInstanceOf(LiteralExpression);
    expect(ifStmt.thenBranch).toBeInstanceOf(BlockStatement);
    expect(ifStmt.elseBranch).toBeInstanceOf(BlockStatement);

    const elseBlock = ifStmt.elseBranch as BlockStatement;
    expect(elseBlock.statements).toHaveLength(1);
  });

  test("throws error for else without colon", () => {
    const code = `if True:
    x = 1
else
    x = 2`;

    expect(() => parser.parse(code)).toThrow("MissingColon");
  });

  test("parses if-elif-else chain", () => {
    const code = `if False:
    x = 1
elif True:
    x = 2
else:
    x = 3`;

    const statements = parser.parse(code);

    expect(statements).toHaveLength(1);
    const outerIf = statements[0] as IfStatement;

    // The elif should be parsed as a nested if in the else branch
    expect(outerIf.elseBranch).toBeInstanceOf(IfStatement);

    const elifIf = outerIf.elseBranch as IfStatement;
    expect(elifIf.condition).toBeInstanceOf(LiteralExpression);
    expect((elifIf.condition as LiteralExpression).value).toBe(true);
    expect(elifIf.elseBranch).toBeInstanceOf(BlockStatement);
  });

  test("parses multiple elif statements", () => {
    const code = `if False:
    x = 1
elif False:
    x = 2
elif True:
    x = 3`;

    const statements = parser.parse(code);

    expect(statements).toHaveLength(1);
    const outerIf = statements[0] as IfStatement;

    // First elif
    expect(outerIf.elseBranch).toBeInstanceOf(IfStatement);
    const firstElif = outerIf.elseBranch as IfStatement;

    // Second elif
    expect(firstElif.elseBranch).toBeInstanceOf(IfStatement);
    const secondElif = firstElif.elseBranch as IfStatement;

    expect((secondElif.condition as LiteralExpression).value).toBe(true);
  });
});
