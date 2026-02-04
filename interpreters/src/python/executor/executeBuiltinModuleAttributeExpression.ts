import type { EvaluationResultExpression, EvaluationResultAttributeExpression } from "../evaluation-result";
import type { Executor } from "../executor";
import type { AttributeExpression } from "../expression";
import type { PyBuiltinModule } from "../jikiObjects/PyBuiltinModule";
import { PyString } from "../jikiObjects";

// Type-specific handler for builtin modules (like random)
export function executeBuiltinModuleAttributeExpression(
  executor: Executor,
  expression: AttributeExpression,
  objectResult: EvaluationResultExpression,
  builtinModule: PyBuiltinModule
): EvaluationResultAttributeExpression {
  const attributeName = expression.attribute.lexeme;
  const method = builtinModule.getMethod(attributeName);

  if (!method) {
    executor.error("AttributeError", expression.location, {
      attribute: attributeName,
      type: "module",
    });
  }

  const propertyResult = {
    type: "IdentifierExpression" as const,
    name: attributeName,
    jikiObject: new PyString(attributeName),
    immutableJikiObject: new PyString(attributeName),
  };

  return {
    type: "AttributeExpression",
    object: objectResult,
    property: propertyResult,
    jikiObject: method,
    immutableJikiObject: method.clone(),
  };
}
