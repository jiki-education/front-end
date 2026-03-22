import type { Description, DescriptionContext, FrameWithResult } from "../../shared/frames";
import type { EvaluationResultCallExpression } from "../evaluation-result";
import type { CallExpression } from "../expression";
import { formatJSObject } from "../helpers";
import { JSUndefined } from "../jsObjects/JSUndefined";
import { describeExpression } from "./describeSteps";

export function describeCallExpression(frame: FrameWithResult, context: DescriptionContext): Description {
  const expression = frame.context as CallExpression;
  const result = frame.result as EvaluationResultCallExpression;

  const steps = describeCallExpressionSteps(expression, result, context);
  const functionName = result.functionName || "a function";
  const summary = `<p>Jiki used <code>${functionName}</code>.</p>`;
  return { result: summary, steps };
}

export function describeCallExpressionSteps(
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
      steps.push(`<li>Jiki used <code>console.log</code>, which printed a blank line</li>`);
    } else if (argValues.length === 1) {
      steps.push(
        `<li>Jiki used <code>console.log</code> with ${argValues[0]}, which printed <code>${output}</code></li>`
      );
    } else if (argValues.length === 2) {
      steps.push(
        `<li>Jiki used <code>console.log</code> with ${argValues[0]} and ${argValues[1]}, which printed <code>${output}</code></li>`
      );
    } else {
      const lastArg = argValues[argValues.length - 1];
      const otherArgs = argValues.slice(0, -1);
      steps.push(
        `<li>Jiki used <code>console.log</code> with ${otherArgs.join(", ")} and ${lastArg}, which printed <code>${output}</code></li>`
      );
    }
    return steps;
  }

  // Then describe the function lookup
  steps.push(`<li>Looked up the function <code>${functionName}</code></li>`);

  // Omit "and got undefined" for void functions
  let retText = "";
  if (!(result.jikiObject instanceof JSUndefined)) {
    const resultValue = formatJSObject(result.jikiObject);
    retText = ` and got <code>${resultValue}</code>`;
  }

  // Build args text, appending return value if present
  let argsText = "";
  if (result.args && result.args.length > 0) {
    const argValues = result.args.map(arg => `<code>${formatJSObject(arg.jikiObject)}</code>`).join(", ");
    argsText = ` with ${argValues}`;
  }
  steps.push(`<li>Called <code>${functionName}</code>${argsText}${retText}</li>`);

  return steps;
}
