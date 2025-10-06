import type { Location } from "./location";

export type DisabledLanguageFeatureErrorType =
  | "DisabledFeatureExcludeListViolation"
  | "DisabledFeatureIncludeListViolation";

export type SyntaxErrorType =
  | "DuplicateParameterNameInFunctionDeclaration"
  | "ExceededMaximumNumberOfParametersInFunction"
  | "InvalidAssignmentTargetExpression"
  | "InvalidClassNameInInstantiationExpression"
  | "InvalidFunctionNameExpression"
  | "InvalidNestedFunctionDeclaration"
  | "InvalidNumericVariableNameStartingWithDigit"
  | "InvalidStatementCannotAssignToConstant"
  | "InvalidTemplateLiteralExpression"
  | "InvalidVariableNameExpression"
  | "MalformedNumberContainingAlphabetCharacters"
  | "MalformedNumberEndingWithDecimalPoint"
  | "MalformedNumberStartingWithZero"
  | "MalformedNumberWithMultipleDecimalPoints"
  | "MiscapitalizedKeywordInStatement"
  | "MissingBacktickToTerminateTemplateLiteral"
  | "MissingByAfterIndexedKeyword"
  | "MissingClassNameInDeclaration"
  | "MissingColonAfterDictionaryKey"
  | "MissingCommaAfterParametersInFunction"
  | "MissingCommaBetweenDictionaryElements"
  | "MissingCommaBetweenFunctionParameters"
  | "MissingCommaBetweenListElements"
  | "MissingConstantNameInDeclaration"
  | "MissingDoAfterRepeatStatementCondition"
  | "MissingDoAfterWhileStatementCondition"
  | "MissingDotAfterThisKeyword"
  | "MissingDoToStartElseBody"
  | "MissingDoToStartFunctionBody"
  | "MissingDoToStartIfBody"
  | "MissingDoubleQuoteToStartStringLiteral"
  | "MissingDoubleQuoteToTerminateStringLiteral"
  | "MissingEachAfterForKeyword"
  | "MissingElementNameAfterForeachKeyword"
  | "MissingEndAfterBlockStatement"
  | "MissingEndOfLine"
  | "MissingExpressionInStatement"
  | "MissingFieldNameOrIndexAfterLeftBracket"
  | "MissingFieldNameOrIndexAfterOpeningBracket"
  | "MissingFunctionNameInDeclaration"
  | "MissingIfConditionAfterIfKeyword"
  | "MissingIndexNameAfterIndexedByKeywords"
  | "MissingLeftParenthesisAfterDoWhileKeyword"
  | "MissingLeftParenthesisAfterForeachKeyword"
  | "MissingLeftParenthesisAfterFunctionCall"
  | "MissingLeftParenthesisAfterFunctionName"
  | "MissingLeftParenthesisAfterMethodCall"
  | "MissingLeftParenthesisAfterWhileKeyword"
  | "MissingLeftParenthesisBeforeIfCondition"
  | "MissingLeftParenthesisInInstantiationExpression"
  | "MissingLetInForeachCondition"
  | "MissingMethodNameAfterDotOperator"
  | "MissingMethodNameInDeclaration"
  | "MissingOfAfterElementNameInForeach"
  | "MissingParameterNameInFunctionDeclaration"
  | "MissingPropertyNameAfterDot"
  | "MissingRightBraceAfterDictionaryElements"
  | "MissingRightBraceToTerminatePlaceholder"
  | "MissingRightBracketAfterExpression"
  | "MissingRightBracketAfterFieldNameOrIndex"
  | "MissingRightBracketAfterListElements"
  | "MissingRightParenthesisAfterDoWhileCondition"
  | "MissingRightParenthesisAfterExpression"
  | "MissingRightParenthesisAfterExpressionWithPotentialTypo"
  | "MissingRightParenthesisAfterForeachElement"
  | "MissingRightParenthesisAfterFunctionCall"
  | "MissingRightParenthesisAfterFunctionParameters"
  | "MissingRightParenthesisAfterIfCondition"
  | "MissingRightParenthesisAfterMethodCall"
  | "MissingRightParenthesisAfterWhileCondition"
  | "MissingRightParenthesisInInstantiationExpression"
  | "MissingSecondElementNameAfterForeachKeyword"
  | "MissingStatementInBlock"
  | "MissingStringAsKeyInDictionary"
  | "MissingTimesInRepeatStatement"
  | "MissingToAfterChangeKeyword"
  | "MissingToAfterVariableNameToChangeValue"
  | "MissingToAfterVariableNameToInitializeValue"
  | "MissingVariableNameInDeclaration"
  | "MissingWhileBeforeDoWhileCondition"
  | "MissingWithBeforeParametersInFunction"
  | "PointlessStatementWithNoEffect"
  | "PotentialMissingParenthesesForFunctionCall"
  | "SyntaxErrorGeneric"
  | "UnexpectedChainedEqualityExpression"
  | "UnexpectedClosingBracket"
  | "UnexpectedElseWithoutMatchingIf"
  | "UnexpectedEqualsForAssignmentUseSetInstead"
  | "UnexpectedEqualsForEqualityUseIsInstead"
  | "UnexpectedIfInBinaryExpression"
  | "UnexpectedKeywordInExpression"
  | "UnexpectedSpaceInIdentifierName"
  | "UnexpectedTokenAfterAccessModifier"
  | "UnexpectedTokenAfterParametersInFunction"
  | "UnexpectedTokenInStatement"
  | "UnexpectedTrailingCommaInList"
  | "UnexpectedVisibilityModifierInsideMethod"
  | "UnexpectedVisibilityModifierOutsideClass"
  | "UnknownCharacterInSource";

export type SemanticErrorType =
  | "DuplicateVariableNameInScope"
  | "InvalidPostfixOperandExpression"
  | "InvalidReturnStatementAtTopLevel"
  | "InvalidVariableUsedInOwnInitializer";

export type RuntimeErrorType =
  | "AccessorUsedOnNonInstanceObject"
  | "ClassAlreadyDefinedInScope"
  | "ClassCannotBeUsedAsVariableReference"
  | "ClassNotFoundInScope"
  | "ConstructorDidNotSetRequiredProperty"
  | "CustomFunctionErrorInExecution"
  | "DuplicateFunctionDeclarationInScope"
  | "ExpressionEvaluatedToNullValue"
  | "ForeachLoopTargetNotIterable"
  | "FunctionCallTypeMismatchError"
  | "FunctionCannotBeNamespacedReference"
  | "FunctionNotFoundInScope"
  | "FunctionNotFoundWithSimilarNameSuggestion"
  | "GetterMethodNotFoundOnObject"
  | "IndexOutOfRangeForArrayAccess"
  | "IndexOutOfRangeForArrayModification"
  | "InvalidBinaryExpressionOperation"
  | "InvalidChangeTargetNotModifiable"
  | "InvalidExpressionEvaluation"
  | "InvalidIndexGetterTargetNotIndexable"
  | "InvalidLiteralTypeInExpression"
  | "InvalidNumberOfArgumentsWithOptionalParameters"
  | "InvalidUnaryOperatorForOperand"
  | "LogicErrorInExecution"
  | "MethodNotFoundOnObjectInstance"
  | "MethodUsedAsGetterInsteadOfCall"
  | "MissingDictionaryKeyInAccess"
  | "MissingForeachSecondElementNameInDeclaration"
  | "MissingParenthesesForFunctionCallInvocation"
  | "NonCallableTargetInvocationAttempt"
  | "NonJikiObjectDetectedInExecution"
  | "PropertyAlreadySetInConstructor"
  | "PropertySetterUsedOnNonPropertyTarget"
  | "RangeErrorArrayIndexIsZeroBased"
  | "RangeErrorRepeatCountMustBeNonNegative"
  | "RangeErrorRepeatCountMustBeNumericValue"
  | "RangeErrorRepeatCountTooHighForExecution"
  | "RangeErrorTooFewArgumentsForFunctionCall"
  | "RangeErrorTooManyArgumentsForFunctionCall"
  | "RangeErrorWrongNumberOfArgumentsInConstructorCall"
  | "RuntimeErrorCouldNotEvaluateFunctionCall"
  | "RuntimeErrorCouldNotFindFunctionReference"
  | "SetterMethodNotFoundOnObject"
  | "StateErrorCannotStoreNullValueFromFunction"
  | "StateErrorCannotStoreNullValueInVariable"
  | "StateErrorExpectedFunctionHasWrongArgumentCount"
  | "StateErrorExpectedFunctionNotFoundInScope"
  | "StateErrorInfiniteLoopDetectedInExecution"
  | "StateErrorInfiniteRecursionDetectedInFunction"
  | "StateErrorMaxIterationsReachedInLoop"
  | "StateErrorMaxTotalExecutionTimeExceeded"
  | "ThisKeywordUsedOutsideOfMethodContext"
  | "TypeErrorCannotCompareIncomparableTypes"
  | "TypeErrorCannotCompareListObjects"
  | "TypeErrorCannotCompareObjectInstances"
  | "TypeErrorOperandMustBeBooleanValue"
  | "TypeErrorOperandMustBeNumericValue"
  | "TypeErrorOperandMustBeStringValue"
  | "TypeErrorOperandsMustBeTwoNumbersOrTwoStrings"
  | "UnexpectedBreakStatementOutsideOfLoop"
  | "UnexpectedChangeOfFunctionReference"
  | "UnexpectedChangeOfMethodReference"
  | "UnexpectedContinueStatementOutsideOfLoop"
  | "UnexpectedEqualsOperatorForEqualityComparison"
  | "UnexpectedForeachSecondElementNameInLoop"
  | "UnexpectedObjectArgumentForCustomFunctionCall"
  | "UnexpectedPrivateGetterAccessAttempt"
  | "UnexpectedPrivateMethodAccessAttempt"
  | "UnexpectedPrivateSetterAccessAttempt"
  | "UnexpectedReturnStatementOutsideOfFunction"
  | "UnexpectedUncalledFunctionInExpression"
  | "VariableAlreadyDeclaredInScope"
  | "VariableCannotBeNamespacedReference"
  | "VariableNotAccessibleInFunctionScope"
  | "VariableNotDeclared";

export type StaticErrorType = DisabledLanguageFeatureErrorType | SemanticErrorType | SyntaxErrorType;

export type ErrorType = StaticErrorType | RuntimeErrorType;

export type ErrorCategory = "SyntaxError" | "SemanticError" | "DisabledLanguageFeatureError" | "RuntimeError";

export abstract class FrontendError<T extends ErrorType> extends Error {
  constructor(
    public message: string,
    public location: Location,
    public type: T,
    public context?: any
  ) {
    super(message);
  }

  public get category() {
    return this.constructor.name;
  }
}

export type StaticError = SyntaxError | SemanticError | RuntimeError;

export class SyntaxError extends FrontendError<SyntaxErrorType> {}

export class SemanticError extends FrontendError<SemanticErrorType> {}

export class DisabledLanguageFeatureError extends FrontendError<DisabledLanguageFeatureErrorType> {}

export class RuntimeError extends FrontendError<RuntimeErrorType> {}

export class LogicError extends Error {}

interface FunctionCallTypeMismatchErrorContext {
  argIdx: number;
  expectedType: string;
  value: string;
}
export class FunctionCallTypeMismatchError {
  constructor(public context: FunctionCallTypeMismatchErrorContext) {}
}

export function isStaticError(obj: any): obj is StaticError {
  return isSyntaxError(obj) || isSemanticError(obj) || isDisabledLanguageFeatureError(obj);
}

export function isSyntaxError(obj: any): obj is SyntaxError {
  return obj instanceof SyntaxError;
}

export function isSemanticError(obj: any): obj is SemanticError {
  return obj instanceof SemanticError;
}

export function isDisabledLanguageFeatureError(obj: any): obj is DisabledLanguageFeatureError {
  return obj instanceof DisabledLanguageFeatureError;
}

export function isRuntimeError(obj: any): obj is RuntimeError {
  return obj instanceof RuntimeError;
}
