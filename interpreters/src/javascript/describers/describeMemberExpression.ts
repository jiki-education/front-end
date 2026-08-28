import type { MemberExpression } from "../expression";
import type { EvaluationResultMemberExpression } from "../evaluation-result";
import type { DescriptionContext } from "./types";
import { codeTag, formatJSObject } from "../helpers";

export function describeMemberExpression(
  expression: MemberExpression,
  result: EvaluationResultMemberExpression,
  context: DescriptionContext
): string {
  const objectValue = result.object.immutableJikiObject;
  const indexValue = result.property.immutableJikiObject;

  const index = indexValue.toString();
  const value = codeTag(formatJSObject(result.immutableJikiObject), expression.location);

  // `obj.prop` reads a property, not an index - describing `guess.length` as
  // "the character at index length in the string" is nonsense.
  if (!expression.computed) {
    const name = codeTag(indexValue.toString(), expression.location);
    if (objectValue.type === "string") {
      return context.t("description.memberExpression.property_string", { name, value });
    }
    if (objectValue.type === "list") {
      return context.t("description.memberExpression.property_array", { name, value });
    }
    return context.t("description.memberExpression.property", { name, value });
  }

  if (objectValue.type === "string") {
    return context.t("description.memberExpression.string", { index, value });
  }

  return context.t("description.memberExpression.array", { index, value });
}
