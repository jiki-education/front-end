import type { Frame, DescriptionContext, Description } from "../shared/frames";
import type { EvaluationResult } from "./evaluation-result";
import type { Statement } from "./statement";
import type { Expression } from "./expression";
import { describeExpressionStatement } from "./describers/describeExpressionStatement";
import { describeVariableDeclaration } from "./describers/describeVariableDeclaration";
import { describeIfStatement } from "./describers/describeIfStatement";
import { describeCallExpression } from "./describers/describeCallExpression";
import { describeReturnStatement } from "./describers/describeReturnStatement";
import { describeBreakStatement } from "./describers/describeBreakStatement";
import { describeContinueStatement } from "./describers/describeContinueStatement";

// JavaScript-specific frame extending the shared base
export interface JavaScriptFrame extends Frame {
  result?: EvaluationResult;
  context?: Statement | Expression;
}

export type FrameWithResult = JavaScriptFrame & { result: EvaluationResult };

function isFrameWithResult(frame: JavaScriptFrame): frame is FrameWithResult {
  return !!frame.result;
}

const defaultMessage = `<p>There is no information available for this line. Show us your code in Discord and we'll improve this!</p>`;

export function describeFrame(frame: JavaScriptFrame, context?: DescriptionContext): string {
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
  <h3>Steps JavaScript Took</h3>
  <ul>
    ${description.steps.join("\n")}
  </ul>
  `.trim();
}

function generateDescription(frame: FrameWithResult, context: DescriptionContext): Description | null {
  switch (frame.result.type) {
    case "ExpressionStatement":
      return describeExpressionStatement(frame, context);
    case "VariableDeclaration":
      return describeVariableDeclaration(frame, context);
    case "IfStatement":
      return describeIfStatement(frame, context);
    case "CallExpression": {
      const steps = describeCallExpression(frame.context as any, frame.result as any, context);
      const result = `<p>JavaScript called a function.</p>`;
      return { result, steps: steps.map(s => `<li>${s}</li>`) };
    }
    case "ReturnStatement":
      return describeReturnStatement(frame, context);
    case "BreakStatement":
      return describeBreakStatement(frame, context);
    case "ContinueStatement":
      return describeContinueStatement(frame, context);
    case "FunctionDeclaration":
    case "LiteralExpression":
    case "BinaryExpression":
    case "UnaryExpression":
    case "GroupingExpression":
    case "IdentifierExpression":
    case "AssignmentExpression":
    case "UpdateExpression":
    case "TemplateLiteralExpression":
    case "ArrayExpression":
    case "MemberExpression":
    case "DictionaryExpression":
      // These types don't generate frames with descriptions
      return null;
  }
}
