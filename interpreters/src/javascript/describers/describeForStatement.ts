import type { EvaluationResultExpression, EvaluationResultForStatement } from "../evaluation-result";
import type { EvaluationResultBinaryExpression, EvaluationResultUpdateExpression } from "../evaluation-result";
import type { Description, FrameWithResult } from "../../shared/frames";
import type { DescriptionContext } from "./types";
import type { ForStatement } from "../statement";
import type { Expression } from "../expression";
import { BinaryExpression, UpdateExpression } from "../expression";
import { describeExpression } from "./describeSteps";
import { summariseBinaryExpression } from "./describeBinaryExpression";
import { codeTag, formatJSObject } from "../helpers";

export function describeForStatement(frame: FrameWithResult, context: DescriptionContext): Description {
  const statement = frame.context as ForStatement;
  const result = frame.result as EvaluationResultForStatement;

  const steps = [...describeHeader(statement, result, context), outcomeStep(result, context)];

  return { result: describeResult(result, context), steps };
}

function describeResult(result: EvaluationResultForStatement, context: DescriptionContext): string {
  // A for loop with no condition (`for (;;)`) always runs its body.
  if (result.condition === null) {
    return context.t("description.forStatement.result_no_condition");
  }

  return result.condition.immutableJikiObject.value
    ? context.t("description.forStatement.result_true")
    : context.t("description.forStatement.result_false");
}

function outcomeStep(result: EvaluationResultForStatement, context: DescriptionContext): string {
  if (result.condition === null) {
    return context.t("description.forStatement.step_no_condition");
  }

  return result.condition.immutableJikiObject.value
    ? context.t("description.forStatement.step_true")
    : context.t("description.forStatement.step_false");
}

// The header is deliberately terse: the update and the condition check collapse
// into a single step, and the condition's operand lookups are dropped entirely.
// They repeat on every iteration and say nothing the comparison doesn't already
// show ("got the box called idx and took 6 out of it" right after "increased idx
// from 5 to 6"), so they were noise in the scrubber rather than explanation.
function describeHeader(
  statement: ForStatement,
  result: EvaluationResultForStatement,
  context: DescriptionContext
): string[] {
  const update = updateClause(statement, result);
  const condition =
    statement.condition && result.condition ? conditionSummary(statement.condition, result.condition) : null;

  // The common case: `i++` against a comparison, merged into one sentence.
  if (update && condition) {
    return [
      context.t(
        update.direction === "INCREMENT"
          ? "description.forStatement.step_increased_evaluated"
          : "description.forStatement.step_decreased_evaluated",
        { ...update.values, ...condition }
      ),
    ];
  }

  return [...updateSteps(statement, result, context), ...conditionStep(statement, result, context)];
}

// `i++` / `i--` has no describer of its own (it never used to generate a frame),
// and it is the only update shape compact enough to fold into the merged step.
function updateClause(statement: ForStatement, result: EvaluationResultForStatement) {
  if (!result.update || !(statement.update instanceof UpdateExpression)) {
    return null;
  }

  const expression = statement.update;
  const updateResult = result.update as EvaluationResultUpdateExpression;

  return {
    direction: expression.operator.type,
    values: {
      name: codeTag(expression.operand.name.lexeme, expression.operand.location),
      oldValue: codeTag(formatJSObject(updateResult.oldValue), expression.location),
      newValue: codeTag(formatJSObject(updateResult.newValue), expression.location),
    },
  };
}

// Only a comparison reads well inlined ("evaluated `6 < 6`"). Anything else falls
// back to its own describer's top-level step.
function conditionSummary(expression: Expression, result: EvaluationResultExpression) {
  if (!(expression instanceof BinaryExpression)) {
    return null;
  }

  const { expr, value } = summariseBinaryExpression(expression, result as EvaluationResultBinaryExpression);
  return {
    expr: codeTag(expr, expression.location),
    value: codeTag(value, expression.location),
  };
}

function updateSteps(
  statement: ForStatement,
  result: EvaluationResultForStatement,
  context: DescriptionContext
): string[] {
  if (!result.update || !statement.update) {
    return [];
  }

  const update = updateClause(statement, result);
  if (update) {
    return [
      context.t(
        update.direction === "INCREMENT"
          ? "description.forStatement.step_increased"
          : "description.forStatement.step_decreased",
        update.values
      ),
    ];
  }

  // Anything else in the update slot (e.g. `i = i + 1`) has a normal describer.
  return describeExpression(statement.update, result.update, context);
}

// Just the top-level step - an expression describer always ends with the
// sentence that summarises the whole expression, and the sub-steps are the
// lookups we're dropping.
function conditionStep(
  statement: ForStatement,
  result: EvaluationResultForStatement,
  context: DescriptionContext
): string[] {
  if (!statement.condition || !result.condition) {
    return [];
  }

  const steps = describeExpression(statement.condition, result.condition, context);
  return steps.length > 0 ? [steps[steps.length - 1]] : [];
}
