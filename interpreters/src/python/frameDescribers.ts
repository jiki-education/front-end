import type { Frame, DescriptionContext, Description } from "../shared/frames";
import type { EvaluationResult } from "./evaluation-result";
import type { Statement } from "./statement";
import type { Expression } from "./expression";
import { describeAssignmentStatement } from "./describers/describeAssignmentStatement";
import { describeExpressionStatement } from "./describers/describeExpressionStatement";
import { describeIfStatement } from "./describers/describeIfStatement";
import { describeBlockStatement } from "./describers/describeBlockStatement";
import { describeForInStatement } from "./describers/describeForInStatement";
import { describeWhileStatement } from "./describers/describeWhileStatement";
import { describeBreakStatement } from "./describers/describeBreakStatement";
import { describeContinueStatement } from "./describers/describeContinueStatement";
import { describeReturnStatement } from "./describers/describeReturnStatement";

// Python-specific frame extending the shared base
export interface PythonFrame extends Frame {
  result?: EvaluationResult;
  context?: Statement | Expression;
}

export type FrameWithResult = PythonFrame & { result: EvaluationResult };

function isFrameWithResult(frame: PythonFrame): frame is FrameWithResult {
  return !!frame.result;
}

const defaultMessage = `<p>There is no information available for this line. Show us your code in Discord and we'll improve this!</p>`;

export function describeFrame(frame: PythonFrame, context?: DescriptionContext): string {
  if (!isFrameWithResult(frame)) {
    return defaultMessage;
  }

  const actualContext: DescriptionContext = context ?? { functionDescriptions: {} };

  let description: Description | null = null;
  try {
    description = generateDescription(frame, actualContext);
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      throw e;
    }
    return defaultMessage;
  }
  if (description === null) {
    return defaultMessage;
  }

  return `
  <h3>What happened</h3>
  ${description.result}
  <hr/>
  <h3>Steps Python Took</h3>
  <ul>
    ${description.steps.join("\n")}
  </ul>
  `.trim();
}

function generateDescription(frame: FrameWithResult, context: DescriptionContext): Description | null {
  if (frame.status === "ERROR") {
    return {
      result: `<p>Error: ${frame.error?.message || "Unknown error"}</p>`,
      steps: [],
    };
  }

  switch (frame.result.type) {
    case "AssignmentStatement":
      return describeAssignmentStatement(frame, context);

    case "ExpressionStatement":
      return describeExpressionStatement(frame, context);

    case "IfStatement":
      return describeIfStatement(frame, context);

    case "BlockStatement":
      return describeBlockStatement(frame, context);

    case "ForInStatement":
      return describeForInStatement(frame, context);

    case "WhileStatement":
      return describeWhileStatement(frame, context);

    case "BreakStatement":
      return describeBreakStatement(frame, context);

    case "ContinueStatement":
      return describeContinueStatement(frame, context);

    case "ReturnStatement":
      return describeReturnStatement(frame, context);

    case "FunctionDeclaration":
    case "LiteralExpression":
    case "BinaryExpression":
    case "UnaryExpression":
    case "GroupingExpression":
    case "IdentifierExpression":
    case "SubscriptExpression":
    case "CallExpression":
    case "AttributeExpression":
    case "ListExpression":
      // These types don't generate frames with descriptions
      return null;
  }
}
