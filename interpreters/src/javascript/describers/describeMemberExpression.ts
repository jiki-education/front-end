import type { MemberExpression } from "../expression";
import type { EvaluationResultMemberExpression } from "../evaluation-result";

export function describeMemberExpression(
  expression: MemberExpression,
  result: EvaluationResultMemberExpression
): string {
  const jikiObject = result.immutableJikiObject;
  const _objectValue = result.object.immutableJikiObject;
  const indexValue = result.property.immutableJikiObject;

  return `Accessed element at index ${indexValue.toString()} of the list, got ${jikiObject.toString()}`;
}
