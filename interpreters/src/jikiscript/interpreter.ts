import { RuntimeError, type RuntimeErrorType, type StaticError } from "./error";
import type { Expression } from "./expression";
import { Location } from "./location";
import { Parser } from "./parser";
import { Executor } from "./executor";
import type { Statement } from "./statement";
import type { TokenType } from "./token";
import { translate } from "./translator";
import type { ExecutionContext, ExternalFunction } from "./executor";
import type { CompilationResult } from "../shared/errors";
import type { InterpretResult } from "../shared/interfaces";
import type { Arity } from "./functions";
import * as Jiki from "./jikiObjects";
import { StdlibFunctionsForLibrary, filteredStdLibFunctions } from "./stdlib";

export interface FrameContext {
  result: any;
  expression?: Expression;
  statement?: Statement;
}

export interface SomethingWithLocation {
  location: Location;
}

export class CustomFunctionError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export type Toggle = "ON" | "OFF";

export interface LanguageFeatures {
  includeList?: TokenType[];
  excludeList?: TokenType[];
  allowedStdlibFunctions?: string[]; // Which stdlib functions are available (e.g., ['concatenate', 'to_upper_case'])
  timePerFrame: number;
  repeatDelay: number;
  maxTotalLoopIterations: number;
  maxRepeatUntilGameOverIterations: number;
  maxTotalExecutionTime: number;
  allowGlobals: boolean;
  customFunctionDefinitionMode: boolean;
  addSuccessFrames: boolean;
}

export interface InputLanguageFeatures {
  includeList?: TokenType[];
  excludeList?: TokenType[];
  allowedStdlibFunctions?: string[]; // Which stdlib functions are available (e.g., ['concatenate', 'to_upper_case'])
  timePerFrame?: number;
  repeatDelay?: number;
  maxTotalLoopIterations?: number;
  maxRepeatUntilGameOverIterations?: number;
  maxTotalExecutionTime?: number;
  allowGlobals?: boolean;
  customFunctionDefinitionMode?: boolean;
  addSuccessFrames?: boolean;
}

// Export as JikiScriptLanguageFeatures for use in shared interfaces
export type JikiScriptLanguageFeatures = LanguageFeatures;

export interface CustomFunction {
  name: string;
  arity: Arity;
  code: string;
}
export interface CallableCustomFunction {
  name: string;
  arity: Arity;
  call: () => any;
}

export interface EvaluationContext {
  externalFunctions?: ExternalFunction[];
  customFunctions?: CustomFunction[];
  classes?: Jiki.Class[];
  languageFeatures?: InputLanguageFeatures;
  state?: Record<string, any>;
  wrapTopLevelStatements?: boolean;
}

export type EvaluateFunctionResult = InterpretResult & {
  value: any;
  jikiObject?: Jiki.JikiObject;
};

export function compile(sourceCode: string, context: EvaluationContext = {}): CompilationResult {
  return new Interpreter(sourceCode, context).compile();
}
export function interpret(sourceCode: string, context: EvaluationContext = {}): InterpretResult {
  const interpreter = new Interpreter(sourceCode, context);
  const compileResult = interpreter.compile();
  if (!compileResult.success) {
    return {
      frames: [],
      logLines: [],
      success: false,
      error: compileResult.error,
      meta: {
        functionCallLog: {},
        statements: [],
      },
    };
  }
  return interpreter.execute();
}

export function evaluateFunction(
  sourceCode: string,
  context: EvaluationContext = {},
  functionCall: string,
  ...args: any[]
): EvaluateFunctionResult {
  const interpreter = new Interpreter(sourceCode, context);
  const compileResult = interpreter.compile();
  if (!compileResult.success) {
    throw compileResult.error;
  }
  return interpreter.evaluateFunction(functionCall, ...args);
}
export function evaluateExpression(
  sourceCode: string,
  context: EvaluationContext = {},
  expression: string,
  ...args: any[]
): EvaluateFunctionResult {
  const interpreter = new Interpreter(sourceCode, context);
  const compileResult = interpreter.compile();
  if (!compileResult.success) {
    throw compileResult.error;
  }
  return interpreter.evaluateExpression(expression, ...args);
}

export class Interpreter {
  private readonly parser: Parser;

  private readonly state: Record<string, any> = {};
  private readonly languageFeatures: LanguageFeatures;
  private readonly externalFunctions: ExternalFunction[] = [];
  private readonly customFunctions: CallableCustomFunction[] = [];
  private readonly classes: Jiki.Class[] = [];
  private readonly wrapTopLevelStatements = false;

  private statements: Statement[] = [];

  constructor(
    private readonly sourceCode: string,
    context: EvaluationContext
  ) {
    // Set the instance variables based on the context that's been passed in.
    if (context.state !== undefined) {
      this.state = context.state;
    }
    this.externalFunctions = context.externalFunctions ? context.externalFunctions : [];

    this.customFunctions = this.parseCustomFunctions(context.customFunctions ? context.customFunctions : []);
    this.classes = context.classes ? context.classes : [];

    this.languageFeatures = {
      includeList: undefined,
      excludeList: undefined,
      timePerFrame: 1,
      repeatDelay: 0,
      maxRepeatUntilGameOverIterations: 100,
      maxTotalLoopIterations: 10000,
      maxTotalExecutionTime: 10000000, // 10 seconds (in microseconds)
      allowGlobals: false,
      customFunctionDefinitionMode: false,
      addSuccessFrames: true,
      ...context.languageFeatures,
    };

    // Auto-merge stdlib functions if allowedStdlibFunctions is provided
    if (this.languageFeatures.allowedStdlibFunctions) {
      const filteredStdlib = filteredStdLibFunctions(this.languageFeatures.allowedStdlibFunctions);
      this.externalFunctions = [...filteredStdlib, ...this.externalFunctions];
    }

    this.parser = new Parser(
      this.externalFunctions.map(f => f.name),
      this.languageFeatures,
      this.wrapTopLevelStatements
    );
  }

  private parseCustomFunctions(customFunctions: CustomFunction[]): CallableCustomFunction[] {
    // This is wildly deeply recursive so be careful!
    if (customFunctions.length === 0) {
      return [];
    }

    customFunctions = customFunctions.reduce((acc, fn) => {
      if (!acc.some(existingFn => existingFn.name === fn.name)) {
        acc.push(fn);
      }
      return acc;
    }, [] as CustomFunction[]);

    const code = customFunctions.map(fn => fn.code).join("\n");
    const interpreter = new Interpreter(code, {
      languageFeatures: {
        customFunctionDefinitionMode: true,
        maxTotalLoopIterations: 100000,
        addSuccessFrames: false,
      },
      externalFunctions: StdlibFunctionsForLibrary,
    });
    interpreter.compile();

    return customFunctions.map(customFunction => {
      const call = (_: ExecutionContext, args: any[]) => {
        const nakedArgs = args.map((arg: any) => {
          // TODO: Need to check for lists etc too
          if (arg instanceof Jiki.Instance) {
            this.error("UnexpectedObjectArgumentForCustomFunctionCall", Location.unknown);
          }
          return Jiki.unwrapJikiObject(arg);
        });
        const res = interpreter.evaluateFunction(customFunction.name, ...nakedArgs);
        if (res.error) {
          throw new CustomFunctionError(res.error.message);
        } else if (res.frames.at(-1)?.error) {
          throw new CustomFunctionError(res.frames.at(-1)!.error!.message);
        }

        return res.jikiObject;
      };
      return { ...customFunction, call } as unknown as CallableCustomFunction;
    });
  }

  public compile(): CompilationResult {
    try {
      this.statements = this.parser.parse(this.sourceCode);
      return { success: true };
    } catch (error: unknown) {
      return { success: false, error: error as StaticError };
    }
  }

  public execute(): InterpretResult {
    const executor = new Executor(
      this.sourceCode,
      this.languageFeatures,
      this.externalFunctions,
      this.customFunctions,
      this.classes,
      this.state
    );
    return executor.execute(this.statements);
  }

  public evaluateFunction(name: string, ...args: any[]): EvaluateFunctionResult {
    const callingCode = `${name}(${args.map(arg => JSON.stringify(arg)).join(", ")})`;

    // Create a new parser with wrapTopLevelStatements set to false
    // and use it to generate the calling statements.
    const callingStatements = new Parser(
      this.externalFunctions.map(f => f.name),
      this.languageFeatures,
      false
    ).parse(callingCode);

    if (callingStatements.length !== 1) {
      this.error("RuntimeErrorCouldNotEvaluateFunctionCall", Location.unknown, {
        callingStatements,
      });
    }

    const executor = new Executor(
      this.sourceCode,
      this.languageFeatures,
      this.externalFunctions,
      this.customFunctions,
      this.classes
    );
    const generalExec = executor.execute(this.statements);
    const exprExec = executor.evaluateSingleExpression(callingStatements[0]);

    return {
      ...exprExec,
      meta: {
        ...exprExec.meta,
        statements: generalExec.meta.statements,
      },
    };
  }

  public evaluateExpression(expression: string, ..._args: any[]): EvaluateFunctionResult {
    // Create a new parser with wrapTopLevelStatements set to false
    // and use it to generate the calling statements.
    const callingStatements = new Parser(
      this.externalFunctions.map(f => f.name),
      this.languageFeatures,
      false
    ).parse(expression);

    if (callingStatements.length !== 1) {
      this.error("RuntimeErrorCouldNotEvaluateFunctionCall", Location.unknown, {
        callingStatements,
      });
    }

    const executor = new Executor(
      this.sourceCode,
      this.languageFeatures,
      this.externalFunctions,
      this.customFunctions,
      this.classes
    );
    const generalExec = executor.execute(this.statements);
    const exprExec = executor.evaluateSingleExpression(callingStatements[0]);

    return {
      ...exprExec,
      meta: {
        ...exprExec.meta,
        statements: generalExec.meta.statements,
      },
    };
  }

  private error(type: RuntimeErrorType, location: Location, context: any = {}): never {
    // Unwrap context values from jiki objects
    context = Jiki.unwrapJikiObject(context);
    throw new RuntimeError(translate(`error.runtime.${type}`, context), location, type, context);
  }
}
