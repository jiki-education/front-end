import type { EvaluationResultVariableLookupExpression } from "../evaluation-result";
import type { VariableLookupExpression } from "../expression";
import type { DescriptionContext } from "../../shared/frames";
import { codeTag, formatJikiObject } from "../helpers";

export function describeVariableLookupExpression(
  expression: VariableLookupExpression,
  result: EvaluationResultVariableLookupExpression,
  _context: DescriptionContext
) {
  const name = result.name;
  const value = formatJikiObject(result.immutableJikiObject);
  return [
    `<li>Jiki got the box called ${codeTag(name, expression.location)} off the shelves and took ${codeTag(
      value,
      expression.location
    )} out of it.</li>`,
  ];
}
