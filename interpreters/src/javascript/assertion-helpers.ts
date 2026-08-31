import {
  Expression,
  CallExpression,
  AssignmentExpression,
  MemberExpression,
  ArrayExpression,
  LiteralExpression,
  BinaryExpression,
  LogicalExpression,
  UnaryExpression,
} from "./expression";
import {
  type Statement,
  VariableDeclaration,
  BlockStatement,
  IfStatement,
  ForStatement,
  WhileStatement,
  RepeatStatement,
  ForOfStatement,
  ForInStatement,
  FunctionDeclaration,
} from "./statement";

/**
 * Extract all CallExpression nodes from an AST tree
 * Uses the children() method to recursively traverse the tree
 */
export function extractCallExpressions(tree: Statement[] | Expression[]): CallExpression[] {
  return extractExpressions(tree, CallExpression);
}

/**
 * Generic recursive AST tree traversal to extract specific expression types
 * Traverses using the children() method that all Statement and Expression nodes implement
 *
 * @param tree - Array of Statement or Expression nodes to search
 * @param type - Constructor of the Expression type to extract
 * @returns Array of matching expressions found in the tree
 */
export function extractExpressions<T extends Expression>(
  tree: Statement[] | Expression[],
  type: new (...args: any[]) => T
): T[] {
  // Filter null/undefined, then map to results and flatten
  return (
    tree
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      .filter(obj => obj)
      .map((elem: Statement | Expression) => {
        const res = elem instanceof type ? [elem] : [];
        return res.concat(extractExpressions<T>(elem.children(), type));
      })
      .flat()
  );
}

import camelCase from "lodash/camelCase";

export function snakeToCamel(s: string): string {
  return camelCase(s);
}

export function extractVariableAssignments(statements: Statement[]): Array<{ name: string; value: Expression }> {
  const results: Array<{ name: string; value: Expression }> = [];
  for (const stmt of statements) {
    if (stmt instanceof VariableDeclaration && stmt.initializer) {
      results.push({ name: stmt.name.lexeme, value: stmt.initializer });
    }

    // Find AssignmentExpression nodes in this statement's expression children
    const assignExprs = extractExpressions([stmt], AssignmentExpression);
    for (const expr of assignExprs) {
      if (!(expr.target instanceof MemberExpression)) {
        results.push({ name: expr.target.lexeme, value: expr.value });
      }
    }

    // Recurse into sub-statements
    for (const sub of getSubStatements(stmt)) {
      results.push(...extractVariableAssignments([sub]));
    }
  }
  return results;
}

function getSubStatements(stmt: Statement): Statement[] {
  if (stmt instanceof BlockStatement) {
    return stmt.statements;
  }
  if (stmt instanceof IfStatement) {
    const result = [stmt.thenBranch];
    if (stmt.elseBranch) {
      result.push(stmt.elseBranch);
    }
    return result;
  }
  if (stmt instanceof ForStatement) {
    const result: Statement[] = [stmt.body];
    if (stmt.init && !(stmt.init instanceof Expression)) {
      result.push(stmt.init);
    }
    return result;
  }
  if (stmt instanceof WhileStatement) {
    return [stmt.body];
  }
  if (stmt instanceof RepeatStatement) {
    return [stmt.body];
  }
  if (stmt instanceof ForOfStatement) {
    return [stmt.body];
  }
  if (stmt instanceof ForInStatement) {
    return [stmt.body];
  }
  if (stmt instanceof FunctionDeclaration) {
    return stmt.body;
  }
  return [];
}

/**
 * AST node types that introduce a loop. Used to measure loop nesting depth.
 */
const LOOP_STATEMENT_TYPES = new Set([
  "ForStatement",
  "WhileStatement",
  "RepeatStatement",
  "ForOfStatement",
  "ForInStatement",
]);

/**
 * The deepest chain of nested loops in the tree. A single loop is depth 1;
 * a loop directly inside another loop is depth 2; code with no loops is 0.
 * Non-loop statements (if/blocks/function bodies) are transparent - a loop
 * nested inside an `if` inside a loop still counts as depth 2.
 */
export function maxLoopNestingDepth(statements: Statement[]): number {
  let max = 0;
  for (const stmt of statements) {
    const inner = maxLoopNestingDepth(getSubStatements(stmt));
    const here = LOOP_STATEMENT_TYPES.has(stmt.type) ? 1 + inner : inner;
    max = Math.max(max, here);
  }
  return max;
}

/**
 * AST node types that introduce a level of nesting. Loops plus `if` - the
 * constructs that indent a student's code and make it harder to follow.
 */
const NESTING_STATEMENT_TYPES = new Set([...LOOP_STATEMENT_TYPES, "IfStatement"]);

/**
 * The bodies of every branch in an `if` / `else if` / `else` chain, flattened.
 * An `else if` is parsed as an IfStatement in the parent's elseBranch, but it
 * reads as a continuation of the same decision rather than a deeper level, so
 * maxNestingDepth measures the whole chain at a single depth. An `if` inside a
 * braced `else { ... }` is a BlockStatement and so is genuinely nested.
 */
function chainedIfBodies(stmt: IfStatement): Statement[] {
  const bodies: Statement[] = [stmt.thenBranch];
  let elseBranch = stmt.elseBranch;
  while (elseBranch instanceof IfStatement) {
    bodies.push(elseBranch.thenBranch);
    elseBranch = elseBranch.elseBranch;
  }
  if (elseBranch) {
    bodies.push(elseBranch);
  }
  return bodies;
}

/**
 * The deepest chain of nested loops and ifs in the tree. A single loop or if is
 * depth 1; an if inside a loop is depth 2; code with neither is 0. Blocks are
 * transparent (they are already the body of the construct that opened them),
 * and an `else if` chain counts once however many branches it has.
 *
 * Function declarations are only legal at the top level in this language, so
 * each function body is measured from zero and the result is the deepest of
 * them. Contrast maxLoopNestingDepth, which counts loops alone.
 */
export function maxNestingDepth(statements: Statement[]): number {
  let max = 0;
  for (const stmt of statements) {
    let here: number;
    if (stmt instanceof IfStatement) {
      here = 1 + maxNestingDepth(chainedIfBodies(stmt));
    } else if (NESTING_STATEMENT_TYPES.has(stmt.type)) {
      here = 1 + maxNestingDepth(getSubStatements(stmt));
    } else {
      here = maxNestingDepth(getSubStatements(stmt));
    }
    max = Math.max(max, here);
  }
  return max;
}

/**
 * Recursively collect all statements whose AST node type matches `type`
 * (e.g. "RepeatStatement", "IfStatement"). Recurses through sub-statements
 * via getSubStatements, mirroring extractExpressions for the statement side.
 */
export function extractStatementsByType(statements: Statement[], type: string): Statement[] {
  const results: Statement[] = [];
  for (const stmt of statements) {
    if (stmt.type === type) {
      results.push(stmt);
    }
    for (const sub of getSubStatements(stmt)) {
      results.push(...extractStatementsByType([sub], type));
    }
  }
  return results;
}

/**
 * The "argument" expressions of a statement, used to match against an args
 * pattern. Only statements with a meaningful arg slot are defined here; all
 * others have no args. RepeatStatement's arg is its optional count, so
 * `repeat()` has zero args and `repeat(n)` has one.
 */
export function statementArguments(stmt: Statement): Expression[] {
  if (stmt instanceof RepeatStatement) {
    return stmt.count ? [stmt.count] : [];
  }
  return [];
}

/**
 * Find statements of `type` whose arguments match `args`.
 *
 * - `args` omitted → any statement of that type (arguments ignored).
 * - `args.length` must equal the statement's arity.
 * - each slot: `undefined` matches anything; any other value requires the
 *   argument to be a literal equal to it.
 */
export function findMatchingStatements(statements: Statement[], type: string, args?: Array<unknown>): Statement[] {
  const matches = extractStatementsByType(statements, type);
  if (args === undefined) {
    return matches;
  }
  return matches.filter(stmt => {
    const stmtArgs = statementArguments(stmt);
    if (stmtArgs.length !== args.length) {
      return false;
    }
    return args.every((expected, i) => {
      if (expected === undefined) {
        return true;
      }
      const arg = stmtArgs[i];
      return arg instanceof LiteralExpression && arg.value === expected;
    });
  });
}

// Keywords that can only ever continue a preceding block, never start a
// statement of their own. A line beginning with one of these attaches to the
// `}` above it.
const BRACE_CONTINUATION_KEYWORDS = /^(?:else|catch|finally)\b/;

export function countLinesOfCode(sourceCode: string): number {
  const lines = sourceCode.split("\n");
  let inMultiLineComment = false;

  const countedLines: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "") {
      continue;
    }

    if (trimmed.includes("/*")) {
      inMultiLineComment = true;
    }
    if (inMultiLineComment) {
      if (trimmed.includes("*/")) {
        inMultiLineComment = false;
      }
      continue;
    }

    if (trimmed.startsWith("//")) {
      continue;
    }
    countedLines.push(trimmed);
  }

  // `} else {` and a `}` / `else {` split across two lines express the same
  // structure, so the joint costs one line either way. Without this, the LOC
  // bonuses would quietly reward brace style over structure, and a student
  // writing either form would be scored on how they hit return rather than on
  // what they wrote.
  return countedLines.filter((trimmed, i) => {
    if (trimmed !== "}") {
      return true;
    }
    if (i + 1 >= countedLines.length) {
      return true;
    }
    return !BRACE_CONTINUATION_KEYWORDS.test(countedLines[i + 1]);
  }).length;
}

export function extractFunctionDeclarations(statements: Statement[]): FunctionDeclaration[] {
  const results: FunctionDeclaration[] = [];
  for (const stmt of statements) {
    if (stmt instanceof FunctionDeclaration) {
      results.push(stmt);
    }
    for (const sub of getSubStatements(stmt)) {
      results.push(...extractFunctionDeclarations([sub]));
    }
  }
  return results;
}

export function extractMethodCalls(statements: Statement[]): { methodName: string }[] {
  const calls = extractCallExpressions(statements);
  return calls
    .filter(
      call =>
        call.callee instanceof MemberExpression &&
        !call.callee.computed &&
        call.callee.property instanceof LiteralExpression &&
        typeof call.callee.property.value === "string"
    )
    .map(call => ({
      methodName: (call.callee as MemberExpression).property as LiteralExpression,
    }))
    .map(({ methodName }) => ({ methodName: methodName.value as string }));
}

export function countArrayExpressions(statements: Statement[]): number {
  return extractExpressions(statements, ArrayExpression).length;
}

/**
 * Extract the lexemes of all operators used in the AST tree.
 * Covers binary/logical operators (e.g. "&&", "+", "===") and unary operators (e.g. "!", "-").
 */
export function extractOperators(tree: Statement[] | Expression[]): string[] {
  const binary = extractExpressions(tree, BinaryExpression).map(expr => expr.operator.lexeme);
  const logical = extractExpressions(tree, LogicalExpression).map(expr => expr.operator.lexeme);
  const unary = extractExpressions(tree, UnaryExpression).map(expr => expr.operator.lexeme);
  return [...binary, ...logical, ...unary];
}

export function extractCallExpressionsExcludingFunctionBody(
  statements: Statement[],
  excludeFuncName: string
): CallExpression[] {
  const results: CallExpression[] = [];
  for (const stmt of statements) {
    if (stmt instanceof FunctionDeclaration && stmt.name.lexeme === excludeFuncName) {
      continue;
    }
    results.push(...extractCallExpressions([stmt]));
  }
  return results;
}

/**
 * Extract all CallExpression nodes that appear inside the body of the function
 * named `funcName`. Returns [] if no function with that name is declared.
 */
export function extractCallExpressionsWithinFunctionBody(statements: Statement[], funcName: string): CallExpression[] {
  const fn = extractFunctionDeclarations(statements).find(fd => fd.name.lexeme === funcName);
  if (!fn) {
    return [];
  }
  return extractCallExpressions(fn.body);
}
