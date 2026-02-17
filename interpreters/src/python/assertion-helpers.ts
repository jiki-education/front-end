import type { Expression } from "./expression";
import { CallExpression, SubscriptExpression } from "./expression";
import {
  type Statement,
  AssignmentStatement,
  BlockStatement,
  IfStatement,
  ForInStatement,
  WhileStatement,
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
