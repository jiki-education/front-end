import type { MemberExpression } from "../expression";
import type { EvaluationResultMemberExpression } from "../evaluation-result";

export function describeMemberExpression(
  expression: MemberExpression,
  result: EvaluationResultMemberExpression
): string {
  const jikiObject = result.immutableJikiObject;
  const objectValue = result.object.immutableJikiObject;
  const indexValue = result.property.immutableJikiObject;

  if (objectValue.type === "string") {
    return `Accessed character at index ${indexValue.toString()} of the string, got ${jikiObject.toString()}`;
  }

  return `Accessed element at index ${indexValue.toString()} of the list, got ${jikiObject.toString()}`;
}
