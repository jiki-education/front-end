import { Environment } from "./environment";
// import { SyntaxError } from "./error";
import { LogicError } from "./error";
import { translate } from "./translator";
import type { Expression } from "./expression";
import {
  LiteralExpression,
  BinaryExpression,
  UnaryExpression,
  GroupingExpression,
  IdentifierExpression,
  ListExpression,
  SubscriptExpression,
  CallExpression,
  AttributeExpression,
  FStringExpression,
} from "./expression";
import type { Location } from "../shared/location";
import type { Statement } from "./statement";
import {
  ExpressionStatement,
  AssignmentStatement,
  IfStatement,
  BlockStatement,
  ForInStatement,
  WhileStatement,
  BreakStatement,
  ContinueStatement,
  FunctionDeclaration,
  ReturnStatement,
} from "./statement";
import type { EvaluationResult, EvaluationResultExpression } from "./evaluation-result";
import type { JikiObject } from "./jikiObjects";
import { TIME_SCALE_FACTOR, type Frame, type FrameExecutionStatus, type TestAugmentedFrame } from "../shared/frames";
import { type ExecutionContext as SharedExecutionContext } from "../shared/interfaces";
import { createBaseExecutionContext } from "../shared/executionContext";
import type { LanguageFeatures, NodeType } from "./interfaces";
import type { EvaluationContext } from "./interpreter";
import cloneDeep from "lodash.clonedeep";
import type { PythonFrame } from "./frameDescribers";
import { describeFrame } from "./frameDescribers";
import { PyCallable, ReturnValue } from "./functions";
import { builtinFunctions } from "./stdlib";
import { PyStdLibFunction } from "./jikiObjects";

// Import individual executors
import { executeLiteralExpression } from "./executor/executeLiteralExpression";
import { executeExpressionStatement } from "./executor/executeExpressionStatement";
import { executeBinaryExpression } from "./executor/executeBinaryExpression";
import { executeUnaryExpression } from "./executor/executeUnaryExpression";
import { executeGroupingExpression } from "./executor/executeGroupingExpression";
import { executeIdentifierExpression } from "./executor/executeIdentifierExpression";
import { executeAssignmentStatement } from "./executor/executeAssignmentStatement";
import { executeIfStatement } from "./executor/executeIfStatement";
import { executeBlockStatement } from "./executor/executeBlockStatement";
import { executeListExpression } from "./executor/executeListExpression";
import { executeSubscriptExpression } from "./executor/executeSubscriptExpression";
import { executeForInStatement } from "./executor/executeForInStatement";
import { executeWhileStatement } from "./executor/executeWhileStatement";
import { executeBreakStatement } from "./executor/executeBreakStatement";
import { executeContinueStatement } from "./executor/executeContinueStatement";
import { executeCallExpression } from "./executor/executeCallExpression";
import { executeFunctionDeclaration } from "./executor/executeFunctionDeclaration";
import { executeReturnStatement } from "./executor/executeReturnStatement";
import { executeAttributeExpression } from "./executor/executeAttributeExpression";
import { executeFStringExpression } from "./executor/executeFStringExpression";

// Execution context for Python stdlib (future use)
export type ExecutionContext = SharedExecutionContext & {
  // Additional Python-specific properties can be added here
  log: (output: string) => void;
};

export type RuntimeErrorType =
  | "InvalidBinaryExpression"
  | "InvalidUnaryExpression"
  | "UndefinedVariable"
  | "UnsupportedOperation"
  | "TypeError"
  | "TruthinessDisabled"
  | "TypeCoercionNotAllowed"
  | "IndexError"
  | "NodeNotAllowed"
  | "FunctionNotFound"
  | "InvalidNumberOfArguments"
  | "FunctionExecutionError"
  | "LogicErrorInExecution"
  | "ReturnOutsideFunction"
  | "AttributeError"
  | "ValueError"
  | "MethodNotYetImplemented"
  | "MethodNotYetAvailable"
  | "MaxIterationsReached";

export class RuntimeError extends Error {
  public category: string = "RuntimeError";

  constructor(
    message: string,
    public location: Location,
    public type: RuntimeErrorType,
    public context?: any
  ) {
    super(message);
    this.name = "RuntimeError";
  }
}

export interface ExecutorResult {
  frames: Frame[];
  error: null; // Always null - runtime errors become frames
  success: boolean;
}

export class Executor {
  private readonly frames: Frame[] = [];
  public readonly logLines: Array<{ time: number; output: string }> = [];
  public time: number = 0;
  private readonly timePerFrame: number = 1;
  private totalLoopIterations = 0;
  private readonly maxTotalLoopIterations: number;
  public environment: Environment;
  public languageFeatures: LanguageFeatures;

  constructor(
    private readonly sourceCode: string,
    context: EvaluationContext
  ) {
    this.environment = new Environment();
    this.languageFeatures = {
      allowTruthiness: false, // Default to false for educational purposes
      allowTypeCoercion: false,
      maxTotalLoopIterations: 10000, // Default limit to prevent infinite loops
      ...context.languageFeatures,
    };
    this.maxTotalLoopIterations = this.languageFeatures.maxTotalLoopIterations ?? 10000;

    // Register builtin functions (like print) as PyStdLibFunction objects
    for (const [name, builtin] of Object.entries(builtinFunctions)) {
      const builtinFunc = new PyStdLibFunction(
        name,
        builtin.arity,
        (_ctx: any, _thisObj: any, args: any[]) => builtin.call(this.getExecutionContext(), args),
        builtin.description
      );
      this.environment.define(name, builtinFunc);
    }

    // Register external functions as PyCallable objects in the environment
    if (context.externalFunctions) {
      for (const func of context.externalFunctions) {
        const callable = new PyCallable(func.name, func.arity, func.func);
        this.environment.define(func.name, callable);
      }
    }
  }

  private assertNodeAllowed(node: Statement | Expression): void {
    // Get the node type name from the constructor
    const nodeType = node.constructor.name as NodeType;

    // If allowedNodes is null or undefined, all nodes are allowed
    if (this.languageFeatures.allowedNodes === null || this.languageFeatures.allowedNodes === undefined) {
      return;
    }

    // Check if this node type is in the allowed list
    if (!this.languageFeatures.allowedNodes.includes(nodeType)) {
      this.error("NodeNotAllowed", node.location, {
        nodeType,
      });
    }
  }

  public execute(statements: Statement[]): ExecutorResult {
    for (const statement of statements) {
      try {
        const success = this.withExecutionContext(() => {
          this.executeStatement(statement);
        });

        if (!success) {
          break;
        }
      } catch (error) {
        if (error instanceof RuntimeError) {
          this.addErrorFrame(error.location, error);
          break;
        }
        throw error;
      }
    }

    return {
      frames: this.frames,
      error: null, // Always null - runtime errors are in frames
      success: !this.frames.find(f => f.status === "ERROR"),
    };
  }

  private withExecutionContext(fn: Function): boolean {
    try {
      fn();
      return true;
    } catch (error) {
      if (error instanceof ReturnValue) {
        // Return outside function - pop the frame and add an error frame
        this.frames.pop();
        const returnError = new RuntimeError(
          "Return statement outside of function",
          error.location,
          "ReturnOutsideFunction"
        );
        this.addErrorFrame(error.location, returnError);
        return false;
      }
      // Re-throw RuntimeErrors to be handled by outer try-catch
      if (error instanceof RuntimeError) {
        throw error;
      }
      throw error;
    }
  }

  public executeFrame<T extends EvaluationResult>(context: Statement | Expression, code: () => T): T {
    const result = code();
    this.addSuccessFrame(context.location, result, context);
    return result;
  }

  public executeStatement(statement: Statement): EvaluationResult | null {
    // Safety check: ensure this node type is allowed
    this.assertNodeAllowed(statement);

    let result: EvaluationResult | null = null;

    try {
      if (statement instanceof ExpressionStatement) {
        result = this.executeFrame(statement, () => executeExpressionStatement(this, statement));
      } else if (statement instanceof AssignmentStatement) {
        result = this.executeFrame(statement, () => executeAssignmentStatement(this, statement));
      } else if (statement instanceof IfStatement) {
        result = executeIfStatement(this, statement);
      } else if (statement instanceof BlockStatement) {
        result = executeBlockStatement(this, statement);
      } else if (statement instanceof ForInStatement) {
        result = executeForInStatement(this, statement);
      } else if (statement instanceof WhileStatement) {
        result = executeWhileStatement(this, statement);
      } else if (statement instanceof BreakStatement) {
        executeBreakStatement(this, statement);
        result = null;
      } else if (statement instanceof ContinueStatement) {
        executeContinueStatement(this, statement);
        result = null;
      } else if (statement instanceof FunctionDeclaration) {
        // Function declarations don't generate frames, just define the function
        executeFunctionDeclaration(this, statement);
        result = null;
      } else if (statement instanceof ReturnStatement) {
        // Return statements generate frames and throw ReturnValue
        executeReturnStatement(this, statement);
        result = null;
      }
    } catch (e: unknown) {
      if (e instanceof LogicError) {
        this.error("LogicErrorInExecution", statement.location, { message: e.message });
      }
      throw e;
    }

    return result;
  }

  public evaluate(expression: Expression): EvaluationResultExpression {
    // Safety check: ensure this node type is allowed
    this.assertNodeAllowed(expression);

    if (expression instanceof LiteralExpression) {
      return executeLiteralExpression(this, expression);
    }

    if (expression instanceof BinaryExpression) {
      return executeBinaryExpression(this, expression);
    }

    if (expression instanceof UnaryExpression) {
      return executeUnaryExpression(this, expression);
    }

    if (expression instanceof GroupingExpression) {
      return executeGroupingExpression(this, expression);
    }

    if (expression instanceof IdentifierExpression) {
      return executeIdentifierExpression(this, expression);
    }

    if (expression instanceof ListExpression) {
      return executeListExpression(this, expression);
    }

    if (expression instanceof SubscriptExpression) {
      return executeSubscriptExpression(this, expression);
    }

    if (expression instanceof CallExpression) {
      return executeCallExpression(this, expression);
    }

    if (expression instanceof AttributeExpression) {
      return executeAttributeExpression(this, expression);
    }

    if (expression instanceof FStringExpression) {
      return executeFStringExpression(this, expression);
    }

    this.error("UnsupportedOperation", expression.location, {
      type: expression.type,
    });
  }

  public addSuccessFrame(location: Location, result: EvaluationResult | null, context?: Statement | Expression): void {
    this.addFrame(location, "SUCCESS", result, undefined, context);
  }

  public addErrorFrame(location: Location, error: RuntimeError, context?: Statement | Expression): void {
    this.addFrame(location, "ERROR", undefined, error, context);
  }

  private addFrame(
    location: Location,
    status: FrameExecutionStatus,
    result?: EvaluationResult | null,
    error?: RuntimeError,
    context?: Statement | Expression
  ): void {
    const frame: PythonFrame = {
      code: location.toCode(this.sourceCode),
      line: location.line,
      status,
      result: result || undefined,
      error,
      time: this.time,
      timeInMs: Math.round(this.time / TIME_SCALE_FACTOR),
      generateDescription: () => describeFrame(frame),
      context: context,
    };

    // In testing mode (but not benchmarks), augment frame with test-only fields
    if (process.env.NODE_ENV === "test" && process.env.RUNNING_BENCHMARKS !== "true") {
      (frame as TestAugmentedFrame).variables = cloneDeep(this.getVariables());
      // Generate description immediately for testing
      (frame as TestAugmentedFrame).description = describeFrame(frame);
    }

    this.frames.push(frame);
    this.time += this.timePerFrame;
  }

  public getVariables(): Record<string, JikiObject> {
    return this.environment.getAllVariables();
  }

  public verifyBoolean(value: JikiObject, location: Location): void {
    // If truthiness is allowed, any value is acceptable
    if (this.languageFeatures.allowTruthiness) {
      return;
    }

    // If truthiness is disabled, only boolean values are allowed
    if (value.type !== "boolean") {
      this.error("TruthinessDisabled", location, {
        value: value.type,
      });
    }
  }

  public guardInfiniteLoop(location: Location): void {
    this.totalLoopIterations++;

    if (this.totalLoopIterations > this.maxTotalLoopIterations) {
      this.error("MaxIterationsReached", location, {
        max: this.maxTotalLoopIterations,
      });
    }
  }

  public error(type: RuntimeErrorType, location: Location, context: any = {}): never {
    let message;
    if (type === "LogicErrorInExecution") {
      message = context.message;
    } else {
      message = translate(`error.runtime.${type}`, context);
    }
    throw new RuntimeError(message, location, type, context);
  }

  public logicError(message: string): never {
    throw new LogicError(message);
  }

  // Get execution context for stdlib functions
  public getExecutionContext(): ExecutionContext {
    return {
      ...createBaseExecutionContext.call(this),
      logicError: this.logicError.bind(this),
      log: this.log.bind(this),
    };
  }

  public log(output: string): void {
    this.logLines.push({ time: this.time, output });
  }
}
