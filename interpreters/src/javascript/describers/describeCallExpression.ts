import type { DescriptionContext } from "../../shared/frames";
import type { EvaluationResultCallExpression } from "../evaluation-result";
import type { CallExpression } from "../expression";
import { formatJSObject } from "../helpers";
import { describeExpression } from "./describeSteps";

export function describeCallExpression(
  expression: CallExpression,
  result: EvaluationResultCallExpression,
  context: DescriptionContext
): string[] {
  const functionName = result.functionName || "a function";

  const steps: string[] = [];

  // First, describe evaluation of each argument expression (like 1+2)
  const argSteps = expression.args
    .map((arg, idx) => {
      // Get the evaluation steps for this argument expression
      const argResult = result.args?.[idx];
      if (argResult) {
        return describeExpression(arg, argResult, context);
      }
      return [];
    })
    .flat();

  steps.push(...argSteps);

  // Then describe the function lookup
  steps.push(`Looked up the function <code>${functionName}</code>`);

  const resultValue = formatJSObject(result.jikiObject);

  // Finally describe the actual function call with the evaluated arguments
  if (result.args && result.args.length > 0) {
    const argValues = result.args.map(arg => `<code>${formatJSObject(arg.jikiObject)}</code>`).join(", ");
    steps.push(`Called <code>${functionName}</code> with ${argValues} and got <code>${resultValue}</code>`);
  } else {
    steps.push(`Called <code>${functionName}</code> and got <code>${resultValue}</code>`);
  }

  return steps;
}
