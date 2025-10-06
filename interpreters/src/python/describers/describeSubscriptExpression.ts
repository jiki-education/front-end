import type { Expression } from "../expression";
import type { EvaluationResultSubscriptExpression } from "../evaluation-result";
import { PyNumber } from "../jikiObjects";
import { formatPyObject } from "./helpers";

export function describeSubscriptExpression(
  expression: Expression,
  result: EvaluationResultSubscriptExpression
): string[] {
  const objectDesc = formatPyObject(result.object.immutableJikiObject);
  const indexDesc = formatPyObject(result.index.immutableJikiObject);
  const elementDesc = formatPyObject(result.immutableJikiObject);

  // Special case for integer indices (most common)
  if (result.index.jikiObject instanceof PyNumber && result.index.jikiObject.isInteger()) {
    const index = result.index.jikiObject.value;

    if (index < 0) {
      return [
        `<li>Python accessed element at index <code>${index}</code> (counting from the end) of <code>${objectDesc}</code> to get <code>${elementDesc}</code>.</li>`,
      ];
    }
    return [
      `<li>Python accessed element at index <code>${index}</code> of <code>${objectDesc}</code> to get <code>${elementDesc}</code>.</li>`,
    ];
  }

  // General case for expression indices
  return [
    `<li>Python accessed element at index <code>${indexDesc}</code> of <code>${objectDesc}</code> to get <code>${elementDesc}</code>.</li>`,
  ];
}
