import type { Expression } from "../expression";
import type { EvaluationResultExpression } from "../evaluation-result";
import type { DescriptionContext } from "../../shared/frames";
import { describeBinaryExpression } from "./describeBinaryExpression";
import { describeUnaryExpression } from "./describeUnaryExpression";
import { describeSubscriptExpression } from "./describeSubscriptExpression";
import { describeCallExpression } from "./describeCallExpression";
import { formatPyObject } from "./helpers";

export function describeExpression(
  expression: Expression,
  result: EvaluationResultExpression,
  context: DescriptionContext
): string[] {
  switch (result.type) {
    case "BinaryExpression":
      return describeBinaryExpression(expression, result as any, context);

    case "UnaryExpression":
      return describeUnaryExpression(expression, result as any, context);

    case "SubscriptExpression":
      return describeSubscriptExpression(expression, result as any);

    case "CallExpression":
      return describeCallExpression(expression as any, result as any);

    case "IdentifierExpression": {
      const identResult = result as any;
      const value = formatPyObject(identResult.immutableJikiObject);
      return [
        `<li>Python looked up the variable <code>${identResult.name}</code> and found <code>${value}</code>.</li>`,
      ];
    }

    case "LiteralExpression":
    case "GroupingExpression":
      return [];

    default:
      return [];
  }
}
