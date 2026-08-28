import type { JikiObject } from "./jikiObjects";

// Statement result types
export interface EvaluationResultExpressionStatement {
  type: "ExpressionStatement";
  expression: EvaluationResultExpression;
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultVariableDeclaration {
  type: "VariableDeclaration";
  kind: "let" | "const";
  name: string;
  value: EvaluationResultExpression;
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultIfStatement {
  type: "IfStatement";
  condition: EvaluationResultExpression;
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultFunctionDeclaration {
  type: "FunctionDeclaration";
  name: string;
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultReturnStatement {
  type: "ReturnStatement";
  expression?: EvaluationResultExpression;
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultBreakStatement {
  type: "BreakStatement";
  // Break statements don't produce values, these fields are optional
  jikiObject?: undefined;
  immutableJikiObject?: undefined;
}

export interface EvaluationResultContinueStatement {
  type: "ContinueStatement";
  // Continue statements don't produce values, these fields are optional
  jikiObject?: undefined;
  immutableJikiObject?: undefined;
}

export interface EvaluationResultRepeatStatement {
  type: "RepeatStatement";
  count: EvaluationResultExpression | null;
  iteration: number;
  jikiObject?: undefined;
  immutableJikiObject?: undefined;
}

export interface EvaluationResultForOfStatement {
  type: "ForOfStatement";
  variable: string;
  iterable: EvaluationResultExpression;
  currentElement?: JikiObject;
  iteration: number;
  jikiObject?: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultForInStatement {
  type: "ForInStatement";
  variable: string;
  object: EvaluationResultExpression;
  currentKey?: JikiObject;
  iteration: number;
  jikiObject?: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultForStatement {
  type: "ForStatement";
  // null when the for loop omits its condition (`for (;;)`)
  condition: EvaluationResultExpression | null;
  // The update that ran at the end of the *previous* iteration. It is described
  // on this frame (rather than getting a frame of its own) so that each trip
  // round the loop is a single frame on the `for` line.
  update: EvaluationResultExpression | null;
  iteration: number;
  jikiObject?: undefined;
  immutableJikiObject?: undefined;
}

export interface EvaluationResultWhileStatement {
  type: "WhileStatement";
  condition: EvaluationResultExpression;
  jikiObject?: JikiObject;
  immutableJikiObject: JikiObject;
}

// Expression result types
export interface EvaluationResultBinaryExpression {
  type: "BinaryExpression";
  left: EvaluationResultExpression;
  right: EvaluationResultExpression;
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

// Discriminated union on `shortCircuited` so TypeScript narrows `right` on its
// own: when we short-circuit there is no right side, otherwise there always is.
export type EvaluationResultLogicalExpression =
  | {
      type: "LogicalExpression";
      shortCircuited: true;
      left: EvaluationResultExpression;
      right: null;
      jikiObject: JikiObject;
      immutableJikiObject: JikiObject;
    }
  | {
      type: "LogicalExpression";
      shortCircuited: false;
      left: EvaluationResultExpression;
      right: EvaluationResultExpression;
      jikiObject: JikiObject;
      immutableJikiObject: JikiObject;
    };

export interface EvaluationResultUnaryExpression {
  type: "UnaryExpression";
  operand: EvaluationResultExpression;
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultLiteralExpression {
  type: "LiteralExpression";
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultGroupingExpression {
  type: "GroupingExpression";
  inner: EvaluationResultExpression;
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultIdentifierExpression {
  type: "IdentifierExpression";
  name: string;
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
  functionName?: string; // Present when identifier refers to a function
}

export interface EvaluationResultAssignmentExpression {
  type: "AssignmentExpression";
  name: string;
  value: EvaluationResultExpression;
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultArrayExpression {
  type: "ArrayExpression";
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultMemberExpression {
  type: "MemberExpression";
  object: EvaluationResultExpression;
  property: EvaluationResultExpression;
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultDictionaryExpression {
  type: "DictionaryExpression";
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultCallExpression {
  type: "CallExpression";
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
  functionName?: string;
  args?: EvaluationResult[];
}

export interface EvaluationResultTemplateLiteralExpression {
  type: "TemplateLiteralExpression";
  parts: (string | EvaluationResultExpression)[];
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultUpdateExpression {
  type: "UpdateExpression";
  // The operand's value before and after the update. `jikiObject` is the value
  // the *expression* evaluates to (old for postfix, new for prefix), which is
  // not enough to describe what happened to the variable.
  oldValue: JikiObject;
  newValue: JikiObject;
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultNewExpression {
  type: "NewExpression";
  className: string;
  args: EvaluationResultExpression[];
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

// Union types
export type EvaluationResultStatement =
  | EvaluationResultExpressionStatement
  | EvaluationResultVariableDeclaration
  | EvaluationResultIfStatement
  | EvaluationResultFunctionDeclaration
  | EvaluationResultReturnStatement
  | EvaluationResultBreakStatement
  | EvaluationResultContinueStatement
  | EvaluationResultForOfStatement
  | EvaluationResultForInStatement
  | EvaluationResultForStatement
  | EvaluationResultRepeatStatement
  | EvaluationResultWhileStatement;

export type EvaluationResultExpression =
  | EvaluationResultBinaryExpression
  | EvaluationResultLogicalExpression
  | EvaluationResultUnaryExpression
  | EvaluationResultLiteralExpression
  | EvaluationResultGroupingExpression
  | EvaluationResultIdentifierExpression
  | EvaluationResultAssignmentExpression
  | EvaluationResultArrayExpression
  | EvaluationResultMemberExpression
  | EvaluationResultDictionaryExpression
  | EvaluationResultCallExpression
  | EvaluationResultTemplateLiteralExpression
  | EvaluationResultUpdateExpression
  | EvaluationResultNewExpression;

export type EvaluationResult = EvaluationResultStatement | EvaluationResultExpression;
