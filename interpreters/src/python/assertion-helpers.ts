import type { Expression } from "./expression";
import { CallExpression, SubscriptExpression, AttributeExpression, ListExpression } from "./expression";
import {
  type Statement,
  AssignmentStatement,
  BlockStatement,
  IfStatement,
  ForInStatement,
  WhileStatement,
  FunctionDeclaration,
} from "./statement";

export function formatIdentifier(name: string): string {
  return name;
}

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

export function extractVariableAssignments(statements: Statement[]): Array<{ name: string; value: Expression }> {
  const results: Array<{ name: string; value: Expression }> = [];
  for (const stmt of statements) {
    if (stmt instanceof AssignmentStatement && !(stmt.target instanceof SubscriptExpression)) {
      results.push({ name: stmt.target.lexeme, value: stmt.initializer });
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
  if (stmt instanceof ForInStatement) {
    return stmt.body;
  }
  if (stmt instanceof WhileStatement) {
    return stmt.body;
  }
  if (stmt instanceof FunctionDeclaration) {
    return stmt.body;
  }
  return [];
}

export function countLinesOfCode(sourceCode: string): number {
  const lines = sourceCode.split("\n");

  return lines.filter(line => {
    const trimmed = line.trim();
    if (trimmed === "") {
      return false;
    }
    if (trimmed.startsWith("#")) {
      return false;
    }
    return true;
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

function extractExpressionsDeep<T extends Expression>(statements: Statement[], type: new (...args: any[]) => T): T[] {
  const results: T[] = [];
  for (const stmt of statements) {
    results.push(...extractExpressions([stmt], type));
    for (const sub of getSubStatements(stmt)) {
      results.push(...extractExpressionsDeep([sub], type));
    }
  }
  return results;
}

function extractCallExpressionsDeep(statements: Statement[]): CallExpression[] {
  return extractExpressionsDeep(statements, CallExpression);
}

export function extractMethodCalls(statements: Statement[]): { methodName: string }[] {
  const calls = extractCallExpressionsDeep(statements);
  return calls
    .filter(call => call.callee instanceof AttributeExpression)
    .map(call => ({
      methodName: (call.callee as AttributeExpression).attribute.lexeme,
    }));
}

export function countListExpressions(statements: Statement[]): number {
  return extractExpressionsDeep(statements, ListExpression).length;
}

export function extractCallExpressionsDeepExcluding(
  statements: Statement[],
  excludeFuncName: string
): CallExpression[] {
  const results: CallExpression[] = [];
  for (const stmt of statements) {
    if (stmt instanceof FunctionDeclaration && stmt.name.lexeme === excludeFuncName) {
      continue;
    }
    results.push(...extractCallExpressions([stmt]));
    for (const sub of getSubStatements(stmt)) {
      results.push(...extractCallExpressionsDeepExcluding([sub], excludeFuncName));
    }
  }
  return results;
}
