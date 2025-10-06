import type {
  EvaluationResult,
  EvaluationResultBinaryExpression,
  EvaluationResultGroupingExpression,
  EvaluationResultUnaryExpression,
  EvaluationResultArrayExpression,
  EvaluationResultMemberExpression,
  EvaluationResultAssignmentExpression,
  EvaluationResultDictionaryExpression,
  EvaluationResultCallExpression,
} from "../evaluation-result";
import type { EvaluationResultTemplateLiteralExpression } from "../evaluation-result";
import type { Expression } from "../expression";
import {
  GroupingExpression,
  BinaryExpression,
  UnaryExpression,
  TemplateLiteralExpression,
  ArrayExpression,
  MemberExpression,
  AssignmentExpression,
  DictionaryExpression,
  CallExpression,
} from "../expression";
import type { DescriptionContext } from "../../shared/frames";
import { describeBinaryExpression } from "./describeBinaryExpression";
import { describeGroupingExpression } from "./describeGroupingExpression";
import { describeUnaryExpression } from "./describeUnaryExpression";
import { describeTemplateLiteralExpression } from "./describeTemplateLiteralExpression";
import { describeArrayExpression } from "./describeArrayExpression";
import { describeMemberExpression } from "./describeMemberExpression";
import { describeAssignmentExpression } from "./describeAssignmentExpression";
import { describeDictionaryExpression } from "./describeDictionaryExpression";
import { describeCallExpression } from "./describeCallExpression";

export function describeExpression(
  expression: Expression,
  result: EvaluationResult,
  context: DescriptionContext
): string[] {
  if (expression instanceof BinaryExpression) {
    return describeBinaryExpression(expression, result as EvaluationResultBinaryExpression, context);
  }
  if (expression instanceof GroupingExpression) {
    return describeGroupingExpression(expression, result as EvaluationResultGroupingExpression, context);
  }
  if (expression instanceof UnaryExpression) {
    return describeUnaryExpression(expression, result as EvaluationResultUnaryExpression, context);
  }
  if (expression instanceof TemplateLiteralExpression) {
    return describeTemplateLiteralExpression(expression, result as EvaluationResultTemplateLiteralExpression, context);
  }
  if (expression instanceof ArrayExpression) {
    return [describeArrayExpression(expression, result as EvaluationResultArrayExpression)];
  }
  if (expression instanceof MemberExpression) {
    return [describeMemberExpression(expression, result as EvaluationResultMemberExpression)];
  }
  if (expression instanceof AssignmentExpression) {
    return [describeAssignmentExpression(expression, result as EvaluationResultAssignmentExpression)];
  }
  if (expression instanceof DictionaryExpression) {
    return describeDictionaryExpression(result as EvaluationResultDictionaryExpression, expression, null as any);
  }
  if (expression instanceof CallExpression) {
    return describeCallExpression(expression, result as EvaluationResultCallExpression, context);
  }

  return [];
}
