import {
  Expression,
  CallExpression,
  AssignmentExpression,
  MemberExpression,
  ArrayExpression,
  LiteralExpression,
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

export function snakeToCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
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
      result.push(stmt.init as unknown as Statement);
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
  if (stmt instanceof FunctionDeclaration) {
    return stmt.body;
  }
  return [];
}

export function countLinesOfCode(sourceCode: string): number {
  const lines = sourceCode.split("\n");
  let inMultiLineComment = false;

  return lines.filter(line => {
    const trimmed = line.trim();
    if (trimmed === "") {
      return false;
    }

    if (trimmed.includes("/*")) {
      inMultiLineComment = true;
    }
    if (inMultiLineComment) {
      if (trimmed.includes("*/")) {
        inMultiLineComment = false;
      }
      return false;
    }

    if (trimmed.startsWith("//")) {
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
