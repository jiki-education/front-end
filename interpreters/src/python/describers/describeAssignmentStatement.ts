import type { EvaluationResultAssignmentStatement } from "../evaluation-result";
import type { Description, DescriptionContext } from "../../shared/frames";
import { formatPyObject } from "./helpers";
import type { AssignmentStatement } from "../statement";
import { describeExpression } from "./describeSteps";
import type { FrameWithResult } from "../frameDescribers";

export function describeAssignmentStatement(frame: FrameWithResult, context: DescriptionContext): Description {
  const statement = frame.context as AssignmentStatement;
  const frameResult = frame.result as EvaluationResultAssignmentStatement;
  const value = formatPyObject(frameResult.immutableJikiObject);

  // Check if it's a subscript assignment
  if ((frameResult as any).target?.type === "SubscriptExpression") {
    const target = (frameResult as any).target;
    const indexValue = formatPyObject(target.index?.immutableJikiObject);
    const objectName = (frameResult as any).objectName || "list";

    const result = `<p>Python assigned <code>${value}</code> to index <code>${indexValue}</code> of <code>${objectName}</code>.</p>`;
    const steps = [
      ...describeExpression(statement.initializer, frameResult.value, context),
      `<li>Python assigned <code>${value}</code> to <code>${objectName}[${indexValue}]</code>.</li>`,
    ];

    return { result, steps };
  }

  const result = `<p>Python assigned <code>${value}</code> to the variable <code>${frameResult.name}</code>.</p>`;
  const steps = [
    ...describeExpression(statement.initializer, frameResult.value, context),
    `<li>Python stored <code>${value}</code> in the variable <code>${frameResult.name}</code>.</li>`,
  ];

  return { result, steps };
}
