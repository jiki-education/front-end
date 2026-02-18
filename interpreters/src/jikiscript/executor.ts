import type { Arity } from "./functions";
import { ReturnValue, isCallable } from "./functions";
import { Environment } from "./environment";
import { RuntimeError, type RuntimeErrorType, isRuntimeError, LogicError } from "./error";
import type {
  ListExpression,
  BinaryExpression,
  FunctionCallExpression,
  Expression,
  FunctionLookupExpression,
  GetElementExpression,
  GroupingExpression,
  LogicalExpression,
  SetElementExpression,
  UnaryExpression,
  VariableLookupExpression,
  DictionaryExpression,
  MethodCallExpression,
  InstantiationExpression,
  ClassLookupExpression,
  AccessorExpression,
  ThisExpression,
} from "./expression";
import { LiteralExpression } from "./expression";
import { Location, Span } from "./location";
import type {
  BlockStatement,
  FunctionStatement,
  IfStatement,
  RepeatStatement,
  ReturnStatement,
  Statement,
  SetVariableStatement,
  ChangeVariableStatement,
  RepeatForeverStatement,
  LogStatement,
  ChangeElementStatement,
  ForeachStatement,
  BreakStatement,
  ContinueStatement,
  ChangePropertyStatement,
  ClassStatement,
  SetPropertyStatement,
} from "./statement";
import { FunctionCallStatement, MethodCallStatement } from "./statement";
import type { Token } from "./token";
import type {
  EvaluationResult,
  EvaluationResultBinaryExpression,
  EvaluationResultFunctionCallExpression,
  EvaluationResultChangeElementStatement,
  EvaluationResultDictionaryExpression,
  EvaluationResultExpression,
  EvaluationResultForeachStatement,
  EvaluationResultFunctionLookupExpression,
  EvaluationResultGetElementExpression,
  EvaluationResultGroupingExpression,
  EvaluationResultListExpression,
  EvaluationResultLiteralExpression,
  EvaluationResultLogicalExpression,
  EvaluationResultRepeatStatement,
  EvaluationResultSetElementExpression,
  EvaluationResultUnaryExpression,
  EvaluationResultVariableLookupExpression,
  EvaluationResultMethodCallExpression,
  EvaluationResultInstantiationExpression,
  EvaluationResultClassLookupExpression,
  EvaluationResultGetterExpression,
  EvaluationResultThisExpression,
} from "./evaluation-result";
import { translate } from "./translator";
import cloneDeep from "lodash.clonedeep";
import type { CallableCustomFunction } from "./interpreter";
import type { InterpretResult } from "../shared/interfaces";
import type { LanguageFeatures } from "./interpreter";

import { timeToMs, type Frame, type FrameExecutionStatus, type TestAugmentedFrame } from "../shared/frames";
import { type ExecutionContext as SharedExecutionContext } from "../shared/interfaces";
import { createBaseExecutionContext } from "../shared/executionContext";
import { describeFrame } from "./frameDescribers";
import { executeFunctionCallExpression } from "./executor/executeFunctionCallExpression";
import { executeIfStatement } from "./executor/executeIfStatement";
import didYouMean from "didyoumean";
import {
  extractFunctionCallExpressions,
  extractVariableAssignments,
  formatJikiObject,
  countLinesOfCode,
  extractFunctionStatements,
  extractMethodCallExpressions,
  countListExpressions,
  extractFunctionCallExpressionsExcludingBody,
} from "./helpers";
import { executeBinaryExpression } from "./executor/executeBinaryExpression";
import * as Jiki from "./jikiObjects";
import { executeMethodCallExpression } from "./executor/executeMethodCallExpression";
import { executeInstantiationExpression } from "./executor/executeInstantiationExpression";
import { executeGetterExpression } from "./executor/executeGetterExpression";
import { executeClassStatement } from "./executor/executeClassStatement";
import { executeSetVariableStatement } from "./executor/executeSetVariableStatement";
import { executeSetPropertyStatement } from "./executor/executeSetPropertyStatement";
import { executeChangeVariableStatement } from "./executor/executeChangeVariableStatement";
import { executeContinueStatement, ContinueFlowControlError } from "./executor/executeContinueStatement";
import { executeBreakStatement, BreakFlowControlError } from "./executor/executeBreakStatement";
import { executeLogStatement } from "./executor/executeLogStatement";
import { executeBlockStatement } from "./executor/executeBlockStatement";
import { executeFunctionStatement } from "./executor/executeFunctionStatement";
import { executeReturnStatement } from "./executor/executeReturnStatement";
import { executeListExpression } from "./executor/executeListExpression";
import { executeDictionaryExpression } from "./executor/executeDictionaryExpression";
import { executeThisExpression } from "./executor/executeThisExpression";
import { executeLiteralExpression } from "./executor/executeLiteralExpression";
import { executeVariableLookupExpression } from "./executor/executeVariableLookupExpression";
import { executeUnaryExpression } from "./executor/executeUnaryExpression";
import { executeLogicalExpression } from "./executor/executeLogicalExpression";
import { executeGroupingExpression } from "./executor/executeGroupingExpression";
import { executeFunctionCallStatement } from "./executor/executeFunctionCallStatement";
import { executeMethodCallStatement } from "./executor/executeMethodCallStatement";
import { executeFunctionLookupExpression } from "./executor/executeFunctionLookupExpression";
import { executeClassLookupExpression } from "./executor/executeClassLookupExpression";
import { executeChangePropertyStatement } from "./executor/executeChangePropertyStatement";
import { createRandomFn } from "../shared/random";

export type ExecutionContext = SharedExecutionContext & {
  evaluate: Function;
  executeBlock: Function;
  logicError: (message: string) => never;
  withThis: Function;
  contextualThis: Jiki.Instance | null;
  languageFeatures: LanguageFeatures;
};

export interface ExternalFunction {
  name: string;
  func: Function;
  description: string;
  arity?: Arity;
}

export class Executor {
  [key: string]: any; // Allow dynamic method access
  private readonly frames: Frame[] = [];
  public readonly logLines: Array<{ time: number; timeInMs: number; output: string }> = [];
  public time: number = 0;
  private readonly timePerFrame: number;
  private totalLoopIterations = 0;
  private readonly maxTotalLoopIterations: number = 0;
  public customFunctionDefinitionMode: boolean;
  private readonly addSuccessFrames: boolean;

  private readonly globals = new Environment();
  public environment = this.globals;

  private readonly externalFunctionDescriptions: Record<string, string> = {};

  // This tracks variables for each statement, so we can output
  // the changes in the frame descriptions
  protected functionCallLog: Record<string, Record<any, number>> = {};
  protected functionCallStack: String[] = [];
  public contextualThis: Jiki.Instance | null = null;
  public randomFn: () => number;
  public _exerciseFinished: boolean = false;

  constructor(
    private readonly sourceCode: string,
    private readonly languageFeatures: LanguageFeatures,
    private readonly externalFunctions: ExternalFunction[],
    private readonly customFunctions: CallableCustomFunction[],
    private readonly classes: Jiki.Class[],
    randomFn?: () => number
  ) {
    this.randomFn = randomFn || createRandomFn();
    for (let externalFunction of externalFunctions) {
      const func = externalFunction.func;

      // The first value passed to the function is the interpreter
      // so we discount that when working out the user's arity.
      // TODO: We need to consider default params here
      const arity = externalFunction.arity || [func.length - 1, func.length - 1];
      const call = (context: ExecutionContext, args: any[]) => func(context, ...args);

      const callable = {
        arity: arity,
        call: call,
      };

      this.globals.define(externalFunction.name, callable as any);
    }

    for (let customFunction of customFunctions) {
      this.globals.define(customFunction.name, customFunction as any);
    }

    this.externalFunctionDescriptions = this.externalFunctions.reduce((acc: Record<string, string>, fn) => {
      acc[fn.name] = fn.description;
      return acc;
    }, {});

    for (let jikiClass of classes) {
      this.globals.define(jikiClass.name, jikiClass);
    }

    this.timePerFrame = this.languageFeatures.timePerFrame;
    this.maxTotalLoopIterations = this.languageFeatures.maxTotalLoopIterations;

    this.customFunctionDefinitionMode = this.languageFeatures.customFunctionDefinitionMode;

    this.addSuccessFrames = this.languageFeatures.addSuccessFrames;
  }

  // Environment wrapper methods
  public defineVariable(name: string, value: any): void {
    this.environment.define(name, value);
  }

  public updateVariable(name: Token, value: any): void {
    this.environment.updateVariable(name, value);
  }

  public getVariable(name: Token): any {
    return this.environment.get(name);
  }

  public variableInScope(name: Token): boolean {
    return this.environment.inScope(name);
  }

  public logicError(message: string) {
    throw new LogicError(message);
  }

  // The Return boolean represents whether this has been successful
  // or created an error frame.
  private withExecutionContext(fn: Function): boolean {
    try {
      fn();
    } catch (error) {
      if (error instanceof ReturnValue) {
        // Remove the last frame and replace it with an error frame
        // This saves us having to pass the context down to where
        // the error is thrown.
        this.frames.pop();
        this.addErrorFrame(
          error.location,
          this.buildError("UnexpectedReturnStatementOutsideOfFunction", error.location)
        );
        return false;
      }
      if (error instanceof ContinueFlowControlError) {
        // Remove the last frame and replace it with an error frame
        // This saves us having to pass the context down to where
        // the error is thrown.
        this.frames.pop();
        this.addErrorFrame(
          error.location,
          this.buildError("UnexpectedContinueStatementOutsideOfLoop", error.location, {
            lexeme: error.lexeme,
          })
        );
        return false;
      }
      if (error instanceof BreakFlowControlError) {
        // Remove the last frame and replace it with an error frame
        // This saves us having to pass the context down to where
        // the error is thrown.
        this.frames.pop();
        this.addErrorFrame(error.location, this.buildError("UnexpectedBreakStatementOutsideOfLoop", error.location));
        return false;
      }
      throw error;
    }
    return true;
  }

  public execute(statements: Statement[]): InterpretResult {
    for (const statement of statements) {
      try {
        const res = this.withExecutionContext(() => {
          this.executeStatement(statement);
        });
        if (!res) {
          break;
        }
      } catch (error) {
        if (isRuntimeError(error)) {
          this.addErrorFrame(error.location, error);
          break;
        }

        throw error;
      }
    }

    return {
      frames: this.frames,
      logLines: this.logLines,
      success: true,
      error: null,
      meta: {
        functionCallLog: this.functionCallLog,
        statements: statements,
        sourceCode: this.sourceCode,
      },

      assertors: {
        assertAllArgumentsAreVariables: () => {
          return extractFunctionCallExpressions(statements).every((expr: FunctionCallExpression) => {
            return expr.args.every((arg: Expression) => {
              return !(arg instanceof LiteralExpression);
            });
          });
        },
        assertNoLiteralNumberAssignments: (exclude: string[]) => {
          return extractVariableAssignments(statements).every(({ name, value }) => {
            if (exclude.includes(name)) {
              return true;
            }
            return !(value instanceof LiteralExpression && typeof value.value === "number");
          });
        },
        countLinesOfCode: () => countLinesOfCode(this.sourceCode),
        assertMaxLinesOfCode: (limit: number) => countLinesOfCode(this.sourceCode) <= limit,
        assertFunctionDefined: (name: string) => {
          return extractFunctionStatements(statements).some(fs => fs.name.lexeme === name);
        },
        assertMethodCalled: (methodName: string) => {
          return extractMethodCallExpressions(statements).some(mc => mc.methodName.lexeme === methodName);
        },
        countArrayLiterals: () => countListExpressions(statements),
        assertFunctionCalledOutsideOwnDefinition: (funcName: string) => {
          const callsOutside = extractFunctionCallExpressionsExcludingBody(statements, funcName);
          return callsOutside.some(call => call.callee.name.lexeme === funcName);
        },
      },
    };
  }

  public log(output: string): void {
    this.logLines.push({ time: this.time, timeInMs: timeToMs(this.time), output });
  }

  public evaluateSingleExpression(statement: Statement) {
    try {
      if (!(statement instanceof FunctionCallStatement || statement instanceof MethodCallStatement)) {
        this.error("InvalidExpressionEvaluation", Location.unknown, {
          statement: statement,
        });
      }

      // TODO: Also start/end the statement management
      // Do not execute here, as this is the only expression without
      // a result that's allowed, so it needs to be called manually
      let result: EvaluationResultFunctionCallExpression | EvaluationResultMethodCallExpression | undefined;
      if (statement instanceof FunctionCallStatement) {
        this.withExecutionContext(() => {
          result = this.visitFunctionCallExpression(statement.expression);
        });
      } else {
        this.withExecutionContext(() => {
          result = this.visitMethodCallExpression(statement.expression);
        });
      }

      return {
        value: result ? Jiki.unwrapJikiObject(result.jikiObject) : undefined,
        jikiObject: result?.jikiObject,
        frames: this.frames,
        logLines: this.logLines,
        success: true,
        error: null,
        meta: {
          functionCallLog: this.functionCallLog,
          statements: [statement],
          sourceCode: this.sourceCode,
        },
      };
    } catch (error) {
      if (isRuntimeError(error)) {
        if (
          error.location.line === 1 &&
          (error.type === "FunctionNotFoundInScope" || error.type === "FunctionNotFoundWithSimilarNameSuggestion")
        ) {
          const newError = this.buildError("StateErrorExpectedFunctionNotFoundInScope", statement.location, {
            name: error.context.name,
          });

          this.addErrorFrame(newError.location, newError);
        } else if (
          error.location.line === 1 &&
          (error.type === "RangeErrorTooFewArgumentsForFunctionCall" ||
            error.type === "RangeErrorTooManyArgumentsForFunctionCall")
        ) {
          const newError = this.buildError("StateErrorExpectedFunctionHasWrongArgumentCount", statement.location, {
            name: error.context.name,
          });

          this.addErrorFrame(newError.location, newError);
        } else {
          this.addErrorFrame(error.location, error);
        }
        return {
          value: undefined,
          frames: this.frames,
          logLines: this.logLines,
          success: false,
          error: null,
          meta: {
            functionCallLog: this.functionCallLog,
            statements: [statement],
            sourceCode: this.sourceCode,
          },
        };
      }

      throw error;
    }
  }

  public executeBlock(statements: Statement[], blockEnvironment: Environment): void {
    // Don't
    if (this.environment === blockEnvironment) {
      for (const statement of statements) {
        this.executeStatement(statement);
      }
      return;
    }

    const previous: Environment = this.environment;
    try {
      this.environment = blockEnvironment;

      for (const statement of statements) {
        this.executeStatement(statement);
      }
    } finally {
      this.environment = previous;
    }
  }
  public executeFrame<T extends EvaluationResult>(context: Statement | Expression, code: () => T): T {
    const result = code();
    this.addSuccessFrame(context.location, result, context);
    return result;
  }

  public visitFunctionCallStatement(statement: FunctionCallStatement): void {
    executeFunctionCallStatement(this, statement);
  }
  public visitMethodCallStatement(statement: MethodCallStatement): void {
    executeMethodCallStatement(this, statement);
  }

  public visitSetVariableStatement(statement: SetVariableStatement): void {
    executeSetVariableStatement(this, statement);
  }

  public visitSetPropertyStatement(statement: SetPropertyStatement): void {
    executeSetPropertyStatement(this, statement);
  }

  public visitChangeVariableStatement(statement: ChangeVariableStatement): void {
    executeChangeVariableStatement(this, statement);
  }

  public visitChangeElementStatement(statement: ChangeElementStatement): void {
    const obj = this.evaluate(statement.object);
    if (obj.jikiObject instanceof Jiki.List) {
      this.visitChangeListElementStatement(statement, obj as EvaluationResultListExpression);
      return;
    }
    if (obj.jikiObject instanceof Jiki.Dictionary) {
      this.visitChangeDictionaryElementStatement(statement, obj as EvaluationResultDictionaryExpression);
      return;
    }
    this.error("InvalidChangeTargetNotModifiable", statement.object.location);
  }
  public visitChangePropertyStatement(statement: ChangePropertyStatement): void {
    executeChangePropertyStatement(this, statement);
  }

  public visitChangeDictionaryElementStatement(
    statement: ChangeElementStatement,
    dictionary: EvaluationResultDictionaryExpression
  ): void {
    this.executeFrame<EvaluationResultChangeElementStatement>(statement, () => {
      const field = this.evaluate(statement.field);
      this.verifyString(field.jikiObject, statement.field);
      const value = this.evaluate(statement.value);

      // Do the update
      const oldValue = Jiki.unwrapJikiObject(dictionary.jikiObject.getProperty(field.jikiObject.value));
      dictionary.jikiObject.setProperty(field.jikiObject.value, value.jikiObject);

      return {
        type: "ChangeElementStatement",
        object: dictionary,
        field,
        value,
        oldValue,
      };
    });
  }

  public visitContinueStatement(statement: ContinueStatement): void {
    executeContinueStatement(this, statement);
  }

  public visitBreakStatement(statement: BreakStatement): void {
    executeBreakStatement(this, statement);
  }

  public visitChangeListElementStatement(
    statement: ChangeElementStatement,
    list: EvaluationResultListExpression
  ): void {
    this.executeFrame<EvaluationResultChangeElementStatement>(statement, () => {
      const index = this.evaluate(statement.field);
      this.verifyNumber(index.jikiObject, statement.field);
      this.guardOutofBoundsIndex(list.jikiObject, index.jikiObject, statement.field.location, "change");

      const value = this.evaluate(statement.value);

      // Do the update
      const oldValue = Jiki.unwrapJikiObject(list.jikiObject.getElement(index.jikiObject.value - 1));
      list.jikiObject.setElement(index.jikiObject.value - 1, value.jikiObject);

      return {
        type: "ChangeElementStatement",
        object: list,
        field: index,
        value,
        oldValue,
      };
    });
  }

  public visitIfStatement(statement: IfStatement): void {
    executeIfStatement(this, statement);
  }

  public visitLogStatement(statement: LogStatement): void {
    executeLogStatement(this, statement);
  }

  public visitBlockStatement(statement: BlockStatement): void {
    executeBlockStatement(this, statement);
  }

  public visitClassStatement(statement: ClassStatement): void {
    executeClassStatement(this, statement);
  }

  public visitFunctionStatement(statement: FunctionStatement): void {
    executeFunctionStatement(this, statement);
  }

  public visitReturnStatement(statement: ReturnStatement): void {
    executeReturnStatement(this, statement);
  }

  visitListExpression(expression: ListExpression): EvaluationResult {
    return executeListExpression(this, expression);
  }

  visitDictionaryExpression(expression: DictionaryExpression): EvaluationResultDictionaryExpression {
    return executeDictionaryExpression(this, expression);
  }

  private retrieveCounterVariableNameForLoop(
    statement: ForeachStatement | RepeatStatement | RepeatForeverStatement
  ): string | null {
    if (statement.counter === null) {
      return null;
    }

    this.guardDefinedName(statement.counter);
    return statement.counter.lexeme;
  }

  visitForeachStatement(statement: ForeachStatement): void {
    const iterable = this.evaluate(statement.iterable);
    if (iterable.jikiObject instanceof Jiki.List) {
      if (statement.secondElementName) {
        this.error("UnexpectedForeachSecondElementNameInLoop", statement.secondElementName.location, {
          type: "list",
        });
      }
    } else if (iterable.jikiObject instanceof Jiki.String) {
      if (statement.secondElementName) {
        this.error("UnexpectedForeachSecondElementNameInLoop", statement.secondElementName.location, {
          type: "string",
        });
      }
    } else if (iterable.jikiObject instanceof Jiki.Dictionary) {
      if (!statement.secondElementName) {
        this.error("MissingForeachSecondElementNameInDeclaration", statement.iterable.location);
      }
    } else {
      this.error("ForeachLoopTargetNotIterable", statement.iterable.location, {
        value: formatJikiObject(iterable.jikiObject),
      });
    }

    this.guardDefinedName(statement.elementName);
    if (statement.secondElementName) {
      this.guardDefinedName(statement.secondElementName);
    }

    const counterVariableName = this.retrieveCounterVariableNameForLoop(statement);

    if (iterable.jikiObject.value.length === 0) {
      this.executeFrame<EvaluationResultForeachStatement>(statement, () => {
        return {
          type: "ForeachStatement",
          index: 0,
          elementName: statement.elementName.lexeme,
          iterable,
        };
      });
    }

    this.executeLoop(() => {
      let iteration = 0;
      for (let temporaryVariableValue of iterable.jikiObject.value) {
        iteration++;
        this.guardInfiniteLoop(statement.location);

        const temporaryVariableNames: string[] = [];

        // If we're in a dictionary, then we'll have two variables.
        let secondTemporaryVariableName: string | undefined;
        let secondTemporaryVariableValue: Jiki.JikiObject | undefined;
        if (statement.secondElementName) {
          [temporaryVariableValue, secondTemporaryVariableValue] = temporaryVariableValue;
          secondTemporaryVariableName = statement.secondElementName.lexeme;
          temporaryVariableNames.push(secondTemporaryVariableName);
          if (secondTemporaryVariableValue) {
            this.environment.define(secondTemporaryVariableName, secondTemporaryVariableValue);
          }
        }

        // Handle the normal path
        // Because we're using keys that can be strings here,
        // guard in case we need to wrap them as Jiki strings!
        if (typeof temporaryVariableValue === "string") {
          temporaryVariableValue = new Jiki.String(temporaryVariableValue);
        }
        const temporaryVariableName = statement.elementName.lexeme;
        temporaryVariableNames.push(temporaryVariableName);
        this.environment.define(temporaryVariableName, temporaryVariableValue);

        this.executeFrame<EvaluationResultForeachStatement>(statement, () => {
          return {
            type: "ForeachStatement",
            elementName: statement.elementName.lexeme,
            index: iteration,
            iterable,
            temporaryVariableValue,
            secondTemporaryVariableValue,
          };
        });

        this.executeLoopIteration(statement.body, iteration, temporaryVariableNames, counterVariableName);
      }
    });
  }

  private executeLoop(body: () => void): void {
    try {
      body.call(this);
    } catch (e) {
      // If we've got a control flow error, don't do anything.
      if (e instanceof BreakFlowControlError) {
        // Break flow control - handled by outer loop
      }

      // Otherwise we have some error that shouldn't be handled here,
      // so get out of dodge!
      else {
        throw e;
      }
    }
  }

  private executeLoopIteration(
    body: Statement[],
    iteration: number,
    temporaryVariableNames: string[],
    counterVariableName: string | null
  ): void {
    if (counterVariableName) {
      this.environment.define(counterVariableName, new Jiki.Number(iteration));
    }

    try {
      this.executeBlock(body, this.environment);
    } catch (e) {
      // If we've got a control flow error, don't do anything.
      if (e instanceof ContinueFlowControlError) {
        // Continue flow control - handled by outer loop
      }

      // Otherwise we have some error that shouldn't be handled here,
      // so get out of dodge!
      else {
        throw e;
      }
    } finally {
      temporaryVariableNames.forEach(name => {
        this.environment.undefine(name);
      });
      if (counterVariableName) {
        this.environment.undefine(counterVariableName);
      }
    }
  }

  public visitRepeatStatement(statement: RepeatStatement): void {
    const countResult = this.evaluate(statement.count);
    const count = countResult.jikiObject;
    const counterVariableName = this.retrieveCounterVariableNameForLoop(statement);

    if (!(count instanceof Jiki.Number)) {
      this.error("RangeErrorRepeatCountMustBeNumericValue", statement.count.location, {
        count,
      });
    }

    if (count.value < 0) {
      this.error("RangeErrorRepeatCountMustBeNonNegative", statement.count.location, {
        count,
      });
    }

    if (count.value > this.maxTotalLoopIterations) {
      this.error("RangeErrorRepeatCountTooHighForExecution", statement.count.location, {
        count,
        max: this.maxTotalLoopIterations,
      });
    }

    if (count.value === 0) {
      this.executeFrame<EvaluationResultRepeatStatement>(statement, () => {
        return {
          type: "RepeatStatement",
          count: countResult,
          iteration: 0,
        };
      });
    }

    this.executeLoop(() => {
      let iteration = 0;
      while (iteration < count.value) {
        iteration++;
        this.guardInfiniteLoop(statement.keyword.location);

        if (counterVariableName) {
          this.environment.define(counterVariableName, new Jiki.Number(iteration));
        }

        this.executeFrame<EvaluationResultRepeatStatement>(statement, () => {
          return {
            type: "RepeatStatement",
            count: countResult,
            iteration,
          };
        });

        this.executeLoopIteration(statement.body, iteration, [], counterVariableName);

        // Delay repeat for things like animations
        this.time += this.languageFeatures.repeatDelay;
      }
    });
  }

  public visitRepeatForeverStatement(statement: RepeatForeverStatement): void {
    var iteration = 0; // Count is a guard against infinite looping
    const counterVariableName = this.retrieveCounterVariableNameForLoop(statement);

    this.executeLoop(() => {
      while (true) {
        iteration++;
        if (iteration >= this.maxTotalLoopIterations) {
          this.error("StateErrorInfiniteLoopDetectedInExecution", statement.keyword.location);
        }

        this.guardInfiniteLoop(statement.location);
        this.executeLoopIteration(statement.body, iteration, [], counterVariableName);

        if (this._exerciseFinished) {
          break;
        }

        // Delay repeat for things like animations
        this.time += this.languageFeatures.repeatDelay;
      }
    });
  }

  public visitFunctionCallExpression(expression: FunctionCallExpression): EvaluationResultFunctionCallExpression {
    return executeFunctionCallExpression(this, expression);
  }
  public visitMethodCallExpression(expression: MethodCallExpression): EvaluationResultMethodCallExpression {
    return executeMethodCallExpression(this, expression);
  }
  public visitInstantiationExpression(expression: InstantiationExpression): EvaluationResultInstantiationExpression {
    return executeInstantiationExpression(this, expression);
  }
  public visitAccessorExpression(expression: AccessorExpression): EvaluationResultGetterExpression {
    return executeGetterExpression(this, expression);
  }

  public visitThisExpression(expression: ThisExpression): EvaluationResultThisExpression {
    return executeThisExpression(this, expression);
  }

  public visitLiteralExpression(expression: LiteralExpression): EvaluationResultLiteralExpression {
    return executeLiteralExpression(this, expression);
  }

  public visitVariableLookupExpression(expression: VariableLookupExpression): EvaluationResultVariableLookupExpression {
    return executeVariableLookupExpression(this, expression);
  }

  public visitFunctionLookupExpression(expression: FunctionLookupExpression): EvaluationResultFunctionLookupExpression {
    return executeFunctionLookupExpression(this, expression);
  }

  public visitClassLookupExpression(expression: ClassLookupExpression): EvaluationResultClassLookupExpression {
    return executeClassLookupExpression(this, expression);
  }

  public visitUnaryExpression(expression: UnaryExpression): EvaluationResultUnaryExpression {
    return executeUnaryExpression(this, expression);
  }

  public visitBinaryExpression(expression: BinaryExpression): EvaluationResultBinaryExpression {
    return executeBinaryExpression(this, expression);
  }

  public visitLogicalExpression(expression: LogicalExpression): EvaluationResultLogicalExpression {
    return executeLogicalExpression(this, expression);
  }

  public visitGroupingExpression(expression: GroupingExpression): EvaluationResultGroupingExpression {
    return executeGroupingExpression(this, expression);
  }

  public visitGetElementExpression(expression: GetElementExpression): EvaluationResultGetElementExpression {
    const obj = this.evaluate(expression.obj) as EvaluationResult;
    if (obj.jikiObject instanceof Jiki.String) {
      return this.visitGetElementExpressionForString(expression, obj as EvaluationResultLiteralExpression);
    }
    if (obj.jikiObject instanceof Jiki.List || obj.jikiObject instanceof Jiki.String) {
      return this.visitGetElementExpressionForList(expression, obj as EvaluationResultListExpression);
    }
    if (obj.jikiObject instanceof Jiki.Dictionary) {
      return this.visitGetElementExpressionForDictionary(expression, obj as EvaluationResultDictionaryExpression);
    }

    this.error("InvalidIndexGetterTargetNotIndexable", expression.location, {
      expression,
      type: typeof obj.jikiObject,
    });
  }
  public visitGetElementExpressionForDictionary(
    expression: GetElementExpression,
    obj: EvaluationResultDictionaryExpression
  ): EvaluationResultGetElementExpression {
    const key = this.evaluate(expression.field);

    this.verifyString(key.jikiObject, expression.field);
    this.guardMissingDictionaryKey(obj.jikiObject, key.jikiObject, expression.location);

    const value = obj.jikiObject.getProperty(key.jikiObject.value);
    if (!value) {
      throw new Error(`Dictionary key not found: ${key.jikiObject.value}`);
    }

    return {
      type: "GetElementExpression",
      obj: obj,
      expression: `${expression.obj.location.toCode(this.sourceCode)}[${key.jikiObject}]`,
      field: key,
      jikiObject: value,
      immutableJikiObject: value.clone(),
    };
  }

  public visitGetElementExpressionForList(
    expression: GetElementExpression,
    obj: EvaluationResultListExpression
  ): EvaluationResultGetElementExpression {
    const idx = this.evaluate(expression.field);
    // TODO: Maybe a custom error message here about array indexes
    // or string indexes needing to be numbers?
    this.verifyNumber(idx.jikiObject, expression.field);

    this.guardOutofBoundsIndex(obj.jikiObject, idx.jikiObject, expression.field.location, "get");

    const value = obj.jikiObject.getElement(idx.jikiObject.value - 1); // 0-index
    if (!value) {
      throw new Error(`List element not found at index: ${idx.jikiObject.value}`);
    }

    return {
      type: "GetElementExpression",
      obj: obj,
      expression: `${expression.obj.location.toCode(this.sourceCode)}[${idx.jikiObject}]`,
      field: idx,
      jikiObject: value,
      immutableJikiObject: value.clone(),
    };
  }

  public visitGetElementExpressionForString(
    expression: GetElementExpression,
    obj: EvaluationResultLiteralExpression
  ): EvaluationResultGetElementExpression {
    const idx = this.evaluate(expression.field);
    // TODO: Maybe a custom error message here about array indexes
    // or string indexes needing to be numbers?
    this.verifyNumber(idx.jikiObject, expression.field);

    this.guardOutofBoundsIndex(obj.jikiObject, idx.jikiObject, expression.field.location, "get");

    // Extra using 0-index
    // Then wrap the new object
    const value = new Jiki.String(obj.jikiObject.value[idx.jikiObject.value - 1]);

    return {
      type: "GetElementExpression",
      obj: obj,
      expression: `${expression.obj.location.toCode(this.sourceCode)}[${idx.jikiObject}]`,
      field: idx,
      jikiObject: value,
      immutableJikiObject: value.clone(),
    };
  }

  public visitSetElementExpression(expression: SetElementExpression): EvaluationResultSetElementExpression {
    const obj = this.evaluate(expression.obj);

    if (obj.jikiObject instanceof Jiki.List && expression.field.type === "NUMBER") {
      return this.visitSetElementExpressionForList(expression, obj as EvaluationResultListExpression);
    } else if (obj.jikiObject instanceof Jiki.Dictionary && expression.field.type === "STRING") {
      return this.visitSetElementExpressionForDictionary(expression, obj as EvaluationResultDictionaryExpression);
    }

    this.error("InvalidChangeTargetNotModifiable", expression.location, {
      expression,
      obj,
    });
  }

  public visitSetElementExpressionForList(
    expression: SetElementExpression,
    list: EvaluationResultListExpression
  ): EvaluationResultSetElementExpression {
    const value = this.evaluate(expression.value);
    list.jikiObject.setElement(expression.field.literal, value.jikiObject);

    return {
      type: "SetElementExpression",
      obj: list,
      jikiObject: value.jikiObject,
      field: expression.field.literal,
      expression: `${expression.obj.location.toCode(this.sourceCode)}[${expression.field.lexeme}]`,
    };
  }

  public visitSetElementExpressionForDictionary(
    expression: SetElementExpression,
    dict: EvaluationResultDictionaryExpression
  ): EvaluationResultSetElementExpression {
    const value = this.evaluate(expression.value);
    dict.jikiObject.setProperty(expression.field.literal, value.jikiObject);

    return {
      type: "SetElementExpression",
      obj: dict,
      jikiObject: value.jikiObject,
      field: expression.field.literal,
      expression: `${expression.obj.location.toCode(this.sourceCode)}[${expression.field.lexeme}]`,
    };
  }

  public guardUncalledFunction(value: any, expr: Expression): void {
    if (isCallable(value)) {
      this.error("UnexpectedUncalledFunctionInExpression", expr.location, {
        name: (expr as VariableLookupExpression).name.lexeme,
      });
    }
  }

  public verifyLiteral(value: Jiki.JikiObject, expr: Expression): void {
    if (value instanceof Jiki.Number) {
      return;
    }
    if (value instanceof Jiki.String) {
      return;
    }
    if (value instanceof Jiki.Boolean) {
      return;
    }

    this.guardUncalledFunction(value, expr);

    if (value instanceof Jiki.List) {
      this.error("TypeErrorCannotCompareListObjects", expr.location, {
        value: formatJikiObject(value),
      });
    }
    this.error("TypeErrorCannotCompareIncomparableTypes", expr.location, {
      value: formatJikiObject(value),
    });
  }

  public verifyNumber(value: Jiki.JikiObject, expr: Expression): void {
    if (value instanceof Jiki.Number) {
      return;
    }

    this.guardUncalledFunction(value, expr);

    this.error("TypeErrorOperandMustBeNumericValue", expr.location, {
      value: formatJikiObject(value),
    });
  }
  public verifyString(value: Jiki.JikiObject, expr: Expression): void {
    if (value instanceof Jiki.String) {
      return;
    }
    this.guardUncalledFunction(value, expr);

    this.error("TypeErrorOperandMustBeStringValue", expr.location, {
      value: formatJikiObject(value),
    });
  }
  public verifyBoolean(value: Jiki.JikiObject, expr: Expression): void {
    if (value instanceof Jiki.Boolean) {
      return;
    }

    this.error("TypeErrorOperandMustBeBooleanValue", expr.location, {
      value: formatJikiObject(value),
    });
  }

  public executeStatement(statement: Statement): void {
    try {
      if (this.time > this.languageFeatures.maxTotalExecutionTime) {
        const location = new Location(
          statement.location.line,
          new Span(statement.location.relative.begin, statement.location.relative.begin + 1),
          new Span(statement.location.absolute.begin, statement.location.absolute.begin + 1)
        );
        this.error("StateErrorMaxTotalExecutionTimeExceeded", location);
      }

      const method = `visit${statement.type}`;
      this[method](statement);
    } catch (e) {
      if (e instanceof LogicError) {
        this.error("LogicErrorInExecution", statement.location, { message: e.message });
      }
      throw e;
    }
  }

  public evaluate(expression: Expression): EvaluationResultExpression {
    const method = `visit${expression.type}`;
    const evaluationResult = this[method](expression);
    this.guardNull(evaluationResult.jikiObject, expression.location);
    this.guardNoneJikiObject(evaluationResult.jikiObject, expression.location);
    return evaluationResult;
  }

  public lookupVariable(name: Token): any {
    let variable = this.environment.get(name);
    if (variable !== undefined) {
      return variable;
    }

    // Check where we've got a global
    if (this.globals.inScope(name)) {
      // If we have then we're using a function as a variable
      // (ie we've missed the paranetheses)
      if (isCallable(this.globals.get(name))) {
        this.error("MissingParenthesesForFunctionCallInvocation", name.location, {
          name: name.lexeme,
        });
      }

      // Otherwise we're accessing a global variable when we shouldn't
      this.error("VariableNotAccessibleInFunctionScope", name.location, {
        name: name.lexeme,
      });
    }

    // Otherwise we have no idea what this is
    this.error("VariableNotDeclared", name.location, {
      name: name.lexeme,
      didYouMean: {
        variable: didYouMean(name.lexeme, Object.keys(this.environment.variables())),
        function: didYouMean(name.lexeme, Object.keys(this.environment.functions())),
      },
    });
  }

  public lookupFunction(name: Token): any {
    let fn = this.environment.get(name);
    if (fn === undefined) {
      fn = this.globals.get(name);
    }
    if (fn === undefined) {
      this.error("FunctionNotFoundInScope", name.location, {
        name: name.lexeme,

        didYouMean: {
          variable: didYouMean(name.lexeme, Object.keys(this.environment.variables())),
          function: didYouMean(name.lexeme, Object.keys(this.environment.functions())),
        },
      });
    }
    return fn;
  }
  public lookupClass(name: Token): any {
    const klass = this.globals.get(name);
    if (klass === undefined) {
      this.error("ClassNotFoundInScope", name.location, {
        name: name.lexeme,
        // TOOD: Add did you mean
      });
    }
    return klass;
  }

  private guardOutofBoundsIndex(
    obj: Jiki.List | Jiki.JikiString,
    idx: Jiki.Number,
    location: Location,
    getOrChange: "get" | "change"
  ) {
    if (idx.value === 0) {
      this.error("RangeErrorArrayIndexIsZeroBased", location);
    }
    const length = obj instanceof Jiki.List ? obj.length : obj.value.length;
    if (idx.value <= length) {
      return;
    }

    // Set to IndexOutOfBoundsInGet or IndexOutOfBoundsInSet
    // by capitalzing the first letter of get or set
    const errorType: "IndexOutOfRangeForArrayAccess" | "IndexOutOfRangeForArrayModification" =
      getOrChange === "get" ? "IndexOutOfRangeForArrayAccess" : "IndexOutOfRangeForArrayModification";

    const dataType = obj instanceof Jiki.List ? "list" : "string";
    this.error(errorType, location, {
      index: idx.value,
      length: obj.value.length,
      dataType,
    });
  }

  private guardMissingDictionaryKey(dictionary: Jiki.Dictionary, key: Jiki.JikiString, location: Location) {
    if (dictionary.value.has(key.value)) {
      return;
    }

    this.error("MissingDictionaryKeyInAccess", location, {
      key: formatJikiObject(key),
    });
  }

  public guardDefinedName(name: Token) {
    if (this.environment.inScope(name)) {
      if (isCallable(this.environment.get(name))) {
        this.error("DuplicateFunctionDeclarationInScope", name.location, {
          name: name.lexeme,
        });
      }
      this.error("VariableAlreadyDeclaredInScope", name.location, {
        name: name.lexeme,
      });
    }
  }

  public guardDefinedClass(name: Token) {
    if (this.globals.inScope(name)) {
      this.error("ClassAlreadyDefinedInScope", name.location, { name: name.lexeme });
    }
  }

  private guardInfiniteLoop(loc: Location) {
    this.totalLoopIterations++;

    if (this.totalLoopIterations > this.maxTotalLoopIterations) {
      this.error("StateErrorMaxIterationsReachedInLoop", loc, {
        max: this.maxTotalLoopIterations,
      });
    }
  }
  private guardNull(value: any, location: Location) {
    if (value !== null && value !== undefined) {
      return;
    }
    this.error("ExpressionEvaluatedToNullValue", location);
  }

  public guardNoneJikiObject(value: any, location: Location) {
    if (value instanceof Jiki.JikiObject) {
      return;
    }
    this.error("NonJikiObjectDetectedInExecution", location);
  }

  public addSuccessFrame(location: Location, result: EvaluationResult, context?: Statement | Expression): void {
    if (!this.addSuccessFrames) {
      return;
    }

    this.addFrame(location, "SUCCESS", result, undefined, context);
  }

  public addErrorFrame(location: Location, error: RuntimeError, context?: Statement | Expression): void {
    this.addFrame(location, "ERROR", undefined, error, context);
  }

  private addFrame(
    location: Location,
    status: FrameExecutionStatus,
    result?: EvaluationResult,
    error?: RuntimeError,
    context?: Statement | Expression
  ): void {
    const frame: Frame = {
      code: location.toCode(this.sourceCode),
      line: location.line,
      status,
      result,
      error,
      // The interpeter time is in microseconds.
      // The timeInMs is in milliseconds for animations.
      time: this.time,
      timeInMs: timeToMs(this.time),
      generateDescription: () =>
        describeFrame(frame, {
          functionDescriptions: this.externalFunctionDescriptions,
        }),
      context: context,
    };
    // In testing mode (but not benchmarks), augment frame with test-only fields
    if (process.env.NODE_ENV === "test" && process.env.RUNNING_BENCHMARKS !== "true") {
      (frame as TestAugmentedFrame).variables = cloneDeep(this.environment.variables());
      // Generate description immediately for testing
      (frame as TestAugmentedFrame).description = describeFrame(frame, {
        functionDescriptions: this.externalFunctionDescriptions,
      });
    }

    this.frames.push(frame);

    this.time += this.timePerFrame;
  }

  public addFunctionCallToLog(name: string, args: any[]) {
    const unwrappedArgs = Jiki.unwrapJikiObject(args);
    // The ||= operator is the idiomatic way to initialize an object property if it doesn't exist
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    this.functionCallLog[name] ||= {};
    this.functionCallLog[name][JSON.stringify(unwrappedArgs)] ||= 0;
    this.functionCallLog[name][JSON.stringify(unwrappedArgs)] += 1;
  }

  public addFunctionToCallStack(name: string, expression: FunctionCallExpression | MethodCallExpression) {
    this.functionCallStack.push(name);

    if (this.functionCallStack.filter(n => n === name).length > 5) {
      this.error("StateErrorInfiniteRecursionDetectedInFunction", expression.location);
    }
  }

  public popCallStack() {
    this.functionCallStack.pop();
  }

  public addClass(klass: Jiki.Class) {
    this.globals.define(klass.name, klass);
  }

  public getExecutionContext(): ExecutionContext {
    return {
      ...createBaseExecutionContext.call(this),
      executeBlock: this.executeBlock.bind(this),
      evaluate: this.evaluate.bind(this),
      logicError: this.logicError.bind(this) as (message: string) => never,
      withThis: this.withThis.bind(this),
      contextualThis: this.contextualThis,
      languageFeatures: this.languageFeatures,
    };
  }

  public withThis(newThis: Jiki.Instance | null, fn: () => any) {
    const oldThis = this.contextualThis;
    try {
      this.contextualThis = newThis;
      return fn();
    } finally {
      this.contextualThis = oldThis;
    }
  }

  public error(type: RuntimeErrorType, location: Location, context: any = {}): never {
    throw this.buildError(type, location, context);
  }

  private buildError(type: RuntimeErrorType, location: Location, context: any = {}): RuntimeError {
    // Unwrap context values from jiki objects
    context = Jiki.unwrapJikiObject(context);

    let message;
    if (type === "LogicErrorInExecution") {
      message = context.message;
    } else {
      message = translate(`error.runtime.${type}`, context);
    }

    return new RuntimeError(message, location, type, context);
  }
}
