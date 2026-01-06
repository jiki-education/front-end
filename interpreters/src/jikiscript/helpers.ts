import type { Location } from "./location";
import { JikiObject } from "./jikiObjects";
import type { Statement } from "./statement";
import type { Expression } from "./expression";
import { FunctionCallExpression } from "./expression";

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


export function extractFunctionCallExpressions(
  tree: Statement[] | Expression[]
): FunctionCallExpression[] {
  return extractExpressions(tree, FunctionCallExpression)
}

export function extractExpressions<T extends Expression>(
  tree: Statement[] | Expression[],
  type: new (...args: any[]) => T
): T[] {
  // Remove null and undefined then map to the subtrees and
  // eventually to the call expressions.
  return tree
    .filter((obj) => obj)
    .map((elem: Statement | Expression) => {
      const res = elem instanceof type ? [elem] : []
      return res.concat(extractExpressions<T>(elem.children(), type))
    })
    .flat()
}