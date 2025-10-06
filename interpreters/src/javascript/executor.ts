import { Environment } from "./environment";
import type { Expression } from "./expression";
import type { LanguageFeatures, NodeType } from "./interfaces";
import { LogicError } from "./error";
import {
  LiteralExpression,
  BinaryExpression,
  UnaryExpression,
  GroupingExpression,
  IdentifierExpression,
  AssignmentExpression,
  UpdateExpression,
  TemplateLiteralExpression,
  ArrayExpression,
  MemberExpression,
  DictionaryExpression,
  CallExpression,
} from "./expression";
import { Location } from "../shared/location";
import type { Statement } from "./statement";
import {
  ExpressionStatement,
  VariableDeclaration,
  BlockStatement,
  IfStatement,
  ForStatement,
  WhileStatement,
  FunctionDeclaration,
  ReturnStatement,
  BreakStatement,
  ContinueStatement,
} from "./statement";
import type { EvaluationResult, EvaluationResultExpression } from "./evaluation-result";
import type { JikiObject } from "./jikiObjects";
import { JikiObject as JikiObjectBase } from "../shared/jikiObject";
import { translate } from "./translator";
import { TIME_SCALE_FACTOR, type Frame, type FrameExecutionStatus } from "../shared/frames";
import { type ExecutionContext as SharedExecutionContext } from "../shared/interfaces";
import { createBaseExecutionContext } from "../shared/executionContext";
import type { EvaluationContext } from "./interpreter";
import { describeFrame } from "./frameDescribers";
import cloneDeep from "lodash.clonedeep";
import { JSCallable, ReturnValue } from "./functions";

// Import individual executors
import { executeAssignmentExpression } from "./executor/executeAssignmentExpression";
import { executeLiteralExpression } from "./executor/executeLiteralExpression";
import { executeBinaryExpression } from "./executor/executeBinaryExpression";
import { executeUnaryExpression } from "./executor/executeUnaryExpression";
import { executeGroupingExpression } from "./executor/executeGroupingExpression";
import { executeIdentifierExpression } from "./executor/executeIdentifierExpression";
import { executeUpdateExpression } from "./executor/executeUpdateExpression";
import { executeBlockStatement } from "./executor/executeBlockStatement";
import { executeExpressionStatement } from "./executor/executeExpressionStatement";
import { executeVariableDeclaration } from "./executor/executeVariableDeclaration";
import { executeIfStatement } from "./executor/executeIfStatement";
import { executeForStatement } from "./executor/executeForStatement";
import { executeWhileStatement } from "./executor/executeWhileStatement";
import { executeTemplateLiteralExpression } from "./executor/executeTemplateLiteralExpression";
import { executeArrayExpression } from "./executor/executeArrayExpression";
import { executeMemberExpression } from "./executor/executeMemberExpression";
import { executeDictionaryExpression } from "./executor/executeDictionaryExpression";
import { executeCallExpression } from "./executor/executeCallExpression";
import { executeFunctionDeclaration } from "./executor/executeFunctionDeclaration";
import { executeReturnStatement } from "./executor/executeReturnStatement";
import { executeBreakStatement, BreakFlowControlError } from "./executor/executeBreakStatement";
import { executeContinueStatement, ContinueFlowControlError } from "./executor/executeContinueStatement";
import { JSBuiltinObject, JSStdLibFunction } from "./jikiObjects";
import { consoleMethods } from "./stdlib/console";

// Execution context for JavaScript stdlib
export type ExecutionContext = SharedExecutionContext & {
  log: (output: string) => void;
};

export type RuntimeErrorType =
  | "InvalidBinaryExpression"
  | "InvalidUnaryExpression"
  | "UnsupportedOperation"
  | "VariableNotDeclared"
  | "ShadowingDisabled"
  | "ComparisonRequiresNumber"
  | "TruthinessDisabled"
  | "TypeCoercionNotAllowed"
  | "StrictEqualityRequired"
  | "IndexOutOfRange"
  | "TypeError"
  | "PropertyNotFound"
  | "ArgumentError"
  | "NodeNotAllowed"
  | "FunctionNotFound"
  | "InvalidNumberOfArguments"
  | "FunctionExecutionError"
  | "LogicErrorInExecution"
  | "ReturnOutsideFunction"
  | "BreakOutsideLoop"
  | "ContinueOutsideLoop"
  | "MethodNotYetImplemented"
  | "MethodNotYetAvailable"
  | "NonJikiObjectDetectedInExecution";

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

// InterpretResult type is now defined in interpreter.ts
export interface ExecutorResult {
  frames: Frame[];
  error: null; // Always null - runtime errors become frames
  success: boolean;
}

export class Executor {
  private readonly frames: Frame[] = [];
  public time: number = 0;
  private readonly timePerFrame: number = 1;
  public readonly logLines: Array<{ time: number; output: string }> = [];
  public environment: Environment;
  public languageFeatures: LanguageFeatures;

  constructor(
    private readonly sourceCode: string,
    context: EvaluationContext
  ) {
    this.languageFeatures = {
      allowShadowing: false, // Default to false (shadowing disabled)
      allowTypeCoercion: false, // Default to false (type coercion disabled)
      enforceStrictEquality: true, // Default to true (strict equality required)
      ...context.languageFeatures,
    };
    this.environment = new Environment(this.languageFeatures);

    // Register builtin objects (console, Math, etc.) as JSBuiltinObject in the environment
    const consoleFunctions = new Map<string, JSStdLibFunction>();
    for (const [name, method] of Object.entries(consoleMethods)) {
      const func = new JSStdLibFunction(
        name,
        method.arity,
        (ctx: any, thisObj: any, args: any[]) => method.call(ctx, thisObj, args),
        method.description
      );
      consoleFunctions.set(name, func);
    }
    const consoleObject = new JSBuiltinObject("Console", consoleFunctions);
    this.environment.define("console", consoleObject, Location.unknown);

    // Register external functions as JSCallable objects in the environment
    if (context.externalFunctions) {
      for (const func of context.externalFunctions) {
        const callable = new JSCallable(func.name, func.arity, func.func);
        // External functions don't have source location, use Location.unknown
        this.environment.define(func.name, callable, Location.unknown);
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
      throw new RuntimeError(translate(`error.runtime.NodeNotAllowed`, { nodeType }), node.location, "NodeNotAllowed", {
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
        this.addErrorFrame(
          error.location,
          new RuntimeError(translate(`error.runtime.ReturnOutsideFunction`), error.location, "ReturnOutsideFunction")
        );
        return false;
      }
      if (error instanceof BreakFlowControlError) {
        // Break outside loop - pop the frame and add an error frame
        this.frames.pop();
        this.addErrorFrame(
          error.location,
          new RuntimeError(translate(`error.runtime.BreakOutsideLoop`), error.location, "BreakOutsideLoop")
        );
        return false;
      }
      if (error instanceof ContinueFlowControlError) {
        // Continue outside loop - pop the frame and add an error frame
        this.frames.pop();
        this.addErrorFrame(
          error.location,
          new RuntimeError(translate(`error.runtime.ContinueOutsideLoop`), error.location, "ContinueOutsideLoop")
        );
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

  public executeStatement(statement: Statement): void {
    // Safety check: ensure this node type is allowed
    this.assertNodeAllowed(statement);

    try {
      if (statement instanceof ExpressionStatement) {
        this.executeFrame(statement, () => executeExpressionStatement(this, statement));
      } else if (statement instanceof VariableDeclaration) {
        this.executeFrame(statement, () => executeVariableDeclaration(this, statement));
      } else if (statement instanceof BlockStatement) {
        // Block statements should not generate frames, just execute their contents
        executeBlockStatement(this, statement);
      } else if (statement instanceof IfStatement) {
        executeIfStatement(this, statement);
      } else if (statement instanceof ForStatement) {
        executeForStatement(this, statement);
      } else if (statement instanceof WhileStatement) {
        executeWhileStatement(this, statement);
      } else if (statement instanceof FunctionDeclaration) {
        // Function declarations don't generate frames, just define the function
        executeFunctionDeclaration(this, statement);
      } else if (statement instanceof ReturnStatement) {
        // Return statements generate frames and throw ReturnValue
        executeReturnStatement(this, statement);
      } else if (statement instanceof BreakStatement) {
        // Break statements generate frames and throw BreakFlowControlError
        executeBreakStatement(this, statement);
      } else if (statement instanceof ContinueStatement) {
        // Continue statements generate frames and throw ContinueFlowControlError
        executeContinueStatement(this, statement);
      }
    } catch (e: unknown) {
      if (e instanceof LogicError) {
        this.error("LogicErrorInExecution", statement.location, { message: e.message });
      }
      // Re-throw all exceptions - let outer handlers deal with them
      // Flow control errors bubble up to loop handlers
      throw e;
    }
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

    if (expression instanceof AssignmentExpression) {
      return executeAssignmentExpression(this, expression);
    }

    if (expression instanceof UpdateExpression) {
      return executeUpdateExpression(this, expression);
    }

    if (expression instanceof TemplateLiteralExpression) {
      return executeTemplateLiteralExpression(this, expression);
    }

    if (expression instanceof ArrayExpression) {
      return executeArrayExpression(this, expression);
    }

    if (expression instanceof MemberExpression) {
      return executeMemberExpression(this, expression);
    }

    if (expression instanceof DictionaryExpression) {
      return executeDictionaryExpression(this, expression);
    }

    if (expression instanceof CallExpression) {
      return executeCallExpression(this, expression);
    }

    throw new RuntimeError(
      `Unsupported expression type: ${expression.type}`,
      expression.location,
      "UnsupportedOperation"
    );
  }

  public executeBlock(statements: Statement[], environment: Environment): void {
    // Don't create a new scope if we're already in the same environment
    if (this.environment === environment) {
      for (const statement of statements) {
        this.executeStatement(statement);
      }
      return;
    }

    const previous = this.environment;
    try {
      this.environment = environment;

      for (const statement of statements) {
        this.executeStatement(statement);
      }
    } finally {
      this.environment = previous;
    }
  }

  /**
   * Execute loop body with break handling
   * Catches BreakFlowControlError to exit the loop
   * Note: Public because JavaScript uses modular executor files (unlike JikiScript's single-file visitor pattern)
   */
  public executeLoop(body: () => void): void {
    try {
      body.call(this);
    } catch (e) {
      if (e instanceof BreakFlowControlError) {
        // Break flow control - handled by outer loop, exit normally
        return;
      }
      // Otherwise we have some error that shouldn't be handled here
      throw e;
    }
  }

  /**
   * Execute loop iteration with continue handling
   * Catches ContinueFlowControlError to skip to next iteration
   * Note: Public because JavaScript uses modular executor files (unlike JikiScript's single-file visitor pattern)
   */
  public executeLoopIteration(body: () => void): void {
    try {
      body.call(this);
    } catch (e) {
      if (e instanceof ContinueFlowControlError) {
        // Continue flow control - handled by loop, return to continue to next iteration
        return;
      }
      // Otherwise we have some error that shouldn't be handled here
      throw e;
    }
  }

  public addSuccessFrame(location: Location, result: EvaluationResult, context?: Statement | Expression): void {
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
      result: result || undefined,
      error,
      time: this.time,
      timeInMs: Math.round(this.time / TIME_SCALE_FACTOR),
      generateDescription: () =>
        describeFrame(frame, {
          functionDescriptions: {}, // JavaScript doesn't have external functions yet
        }),
      context: context,
    };

    // In testing mode (but not benchmarks), augment frame with test-only fields
    if (process.env.NODE_ENV === "test" && process.env.RUNNING_BENCHMARKS !== "true") {
      (frame as any).variables = cloneDeep(this.getVariables());
      // Generate description immediately for testing
      (frame as any).description = describeFrame(frame, {
        functionDescriptions: {}, // JavaScript doesn't have external functions yet
      });
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

  public guardNonJikiObject(value: any, location: Location): void {
    // Import JikiObject from shared to check inheritance
    if (value instanceof JikiObjectBase) {
      return;
    }
    this.error("NonJikiObjectDetectedInExecution", location, {
      receivedType: typeof value,
      receivedValue: value,
    });
  }

  public error(type: RuntimeErrorType, location: Location, context?: any): never {
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

  public defineVariable(name: string, value: any, location: Location): void {
    this.environment.define(name, value, location);
  }

  // Get execution context for stdlib functions
  public log(output: string): void {
    this.logLines.push({ time: this.time, output });
  }

  public getExecutionContext(): ExecutionContext {
    return {
      ...createBaseExecutionContext.call(this),
      logicError: this.logicError.bind(this),
      log: this.log.bind(this),
    };
  }
}
