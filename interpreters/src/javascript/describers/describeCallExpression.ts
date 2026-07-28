import type { Description, FrameWithResult } from "../../shared/frames";
import type { DescriptionContext } from "./types";
import type { EvaluationResultCallExpression } from "../evaluation-result";
import type { CallExpression } from "../expression";
import { formatJSObject } from "../helpers";
import { JSUndefined } from "../jsObjects/JSUndefined";
import { describeExpression } from "./describeSteps";

export function describeCallExpression(frame: FrameWithResult, context: DescriptionContext): Description {
  const expression = frame.context as CallExpression;
  const result = frame.result as EvaluationResultCallExpression;

  const steps = describeCallExpressionSteps(expression, result, context);
  const functionName = result.functionName || context.t("description.common.defaultFunctionName");
  const summary = context.t("description.callExpression.summary", { functionName });
  return { result: summary, steps };
}

export function describeCallExpressionSteps(
  expression: CallExpression,
  result: EvaluationResultCallExpression,
  context: DescriptionContext
): string[] {
  const functionName = result.functionName || context.t("description.common.defaultFunctionName");

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

  // Special handling for console.log() - show what it outputs
  if (functionName === "log") {
    // Get the actual output by converting JikiObjects to strings (without quotes for strings)
    const output =
      result.args && result.args.length > 0
        ? result.args.map(arg => arg.immutableJikiObject?.toString() ?? "").join(" ")
        : "";

    const argValues =
      result.args && result.args.length > 0
        ? result.args
            .filter(arg => arg.immutableJikiObject !== undefined)
            .map(arg => `<code>${formatJSObject(arg.immutableJikiObject)}</code>`)
        : [];

    if (argValues.length === 0) {
      steps.push(context.t("description.callExpression.logBlank"));
    } else if (argValues.length === 1) {
      steps.push(context.t("description.callExpression.logOne", { arg0: argValues[0], output }));
    } else if (argValues.length === 2) {
      steps.push(
        context.t("description.callExpression.logTwo", {
          arg0: argValues[0],
          arg1: argValues[1],
          output,
        })
      );
    } else {
      const lastArg = argValues[argValues.length - 1];
      const otherArgs = argValues.slice(0, -1);
      steps.push(
        context.t("description.callExpression.logMany", {
          otherArgs: otherArgs.join(", "),
          lastArg,
          output,
        })
      );
    }
    return steps;
  }

  // Omit "and got undefined" for void functions
  const hasReturn = !(result.jikiObject instanceof JSUndefined);
  const ret = hasReturn ? formatJSObject(result.jikiObject) : "";

  // Build args text
  const hasArgs = !!(result.args && result.args.length > 0);
  const args = hasArgs ? result.args!.map(arg => `<code>${formatJSObject(arg.jikiObject)}</code>`).join(", ") : "";

  // Single, student-friendly step consistent with JikiScript/Python ("used the X
  // function") and the statement summary — rather than the old low-level
  // "Looked up the function X" + "Called X" pair.
  let usedKey: string;
  if (hasArgs && hasReturn) {
    usedKey = "description.callExpression.usedFunctionWithArgsAndReturn";
  } else if (hasArgs) {
    usedKey = "description.callExpression.usedFunctionWithArgs";
  } else if (hasReturn) {
    usedKey = "description.callExpression.usedFunctionWithReturn";
  } else {
    usedKey = "description.callExpression.usedFunction";
  }
  steps.push(context.t(usedKey, { functionName, args, ret }));

  return steps;
}
