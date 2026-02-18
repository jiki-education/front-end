import type { Location } from "./location";
import { JikiObject } from "./jikiObjects";
import type { Statement } from "./statement";
import { SetVariableStatement, ChangeVariableStatement, FunctionStatement } from "./statement";
import type { Expression } from "./expression";
import { FunctionCallExpression, MethodCallExpression, ListExpression } from "./expression";

export function formatJikiObject(value?: any): string {
  if (value === undefined) {
    return "";
  }

  if (value instanceof JikiObject) {
    return value.toString();
  }

  return JSON.stringify(value);
}

export function codeTag(code: string | JikiObject, location: Location): string {
  // console.log(code)

  let parsedCode: string;
  if (code instanceof JikiObject) {
    parsedCode = code.toString();
  } else {
    parsedCode = code;
  }

  const from = location.absolute.begin;
  const to = location.absolute.end;
  return `<code data-hl-from="${from}" data-hl-to="${to}">${parsedCode}</code>`;
}

export function extractFunctionCallExpressions(tree: Statement[] | Expression[]): FunctionCallExpression[] {
  return extractExpressions(tree, FunctionCallExpression);
}

export function extractExpressions<T extends Expression>(
  tree: Statement[] | Expression[],
  type: new (...args: any[]) => T
): T[] {
  // Remove null and undefined then map to the subtrees and
  // eventually to the call expressions.
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

export function extractVariableAssignments(
  tree: (Statement | Expression)[]
): Array<{ name: string; value: Expression }> {
  const results: Array<{ name: string; value: Expression }> = [];
  for (const node of tree) {
    if (node instanceof SetVariableStatement) {
      results.push({ name: node.name.lexeme, value: node.value });
    }
    if (node instanceof ChangeVariableStatement) {
      results.push({ name: node.name.lexeme, value: node.value });
    }
    results.push(...extractVariableAssignments(node.children()));
  }
  return results;
}

export function countLinesOfCode(sourceCode: string): number {
  const lines = sourceCode.split("\n");

  return lines.filter(line => {
    const trimmed = line.trim();
    if (trimmed === "") {
      return false;
    }
    if (trimmed.startsWith("//")) {
      return false;
    }
    return true;
  }).length;
}

export function extractFunctionStatements(tree: (Statement | Expression)[]): FunctionStatement[] {
  const results: FunctionStatement[] = [];
  for (const node of tree) {
    if (node instanceof FunctionStatement) {
      results.push(node);
    }
    results.push(...extractFunctionStatements(node.children()));
  }
  return results;
}

export function extractMethodCallExpressions(tree: (Statement | Expression)[]): MethodCallExpression[] {
  return extractExpressions(tree, MethodCallExpression);
}

export function countListExpressions(tree: (Statement | Expression)[]): number {
  return extractExpressions(tree, ListExpression).length;
}

export function extractFunctionCallExpressionsExcludingBody(
  tree: (Statement | Expression)[],
  excludeFuncName: string
): FunctionCallExpression[] {
  const results: FunctionCallExpression[] = [];
  for (const node of tree) {
    if (node instanceof FunctionStatement && node.name.lexeme === excludeFuncName) {
      continue;
    }
    if (node instanceof FunctionCallExpression) {
      results.push(node);
    }
    results.push(...extractFunctionCallExpressionsExcludingBody(node.children(), excludeFuncName));
  }
  return results;
}
