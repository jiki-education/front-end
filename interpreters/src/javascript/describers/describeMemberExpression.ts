import type { MemberExpression } from "../expression";
import type { EvaluationResultMemberExpression } from "../evaluation-result";
import type { DescriptionContext } from "./types";

export function describeMemberExpression(
  expression: MemberExpression,
  result: EvaluationResultMemberExpression,
  context: DescriptionContext
): string {
  const jikiObject = result.immutableJikiObject;
  const objectValue = result.object.immutableJikiObject;
  const indexValue = result.property.immutableJikiObject;

  if (objectValue.type === "string") {
    return context.t("description.memberExpression.string", {
      index: indexValue.toString(),
      value: jikiObject.toDisplayString(),
    });
  }

  return context.t("description.memberExpression.list", {
    index: indexValue.toString(),
    value: jikiObject.toDisplayString(),
  });
}
