import type { Arity, ExecutionContext } from "../shared/interfaces";
import { JikiObject } from "./jikiObjects";
import type { FunctionDeclaration } from "./statement";
import type { Location } from "../shared/location";
import type { Environment } from "./environment";

export interface Callable {
  arity: Arity | undefined;
  call: (context: ExecutionContext, args: JikiObject[]) => JikiObject;
}

export function isCallable(obj: any): obj is Callable {
  return obj instanceof Object && "arity" in obj && "call" in obj;
}

export class ReturnValue extends Error {
  constructor(
    public value: any,
    public location: Location
  ) {
    super();
  }
}

export class JSCallable extends JikiObject {
  constructor(
    public readonly name: string,
    public readonly arity: Arity | undefined,
    private readonly func: Function
  ) {
    super("callable");
  }

  get value(): Function {
    return this.func;
  }

  call(context: ExecutionContext, args: JikiObject[]): JikiObject {
    return this.func(context, ...args);
  }

  clone(): JSCallable {
    return new JSCallable(this.name, this.arity, this.func);
  }

  toString(): string {
    return `function ${this.name}() { [native code] }`;
  }
}

export class JSUserDefinedFunction extends JSCallable {
  private readonly _closure: Environment | null;

  constructor(
    private readonly declaration: FunctionDeclaration,
    closure: Environment | null = null
  ) {
    // Arity is just the number of parameters (no optional parameters for now)
    super(declaration.name.lexeme, declaration.parameters.length, () => {
      throw new Error("User-defined functions should not call func directly");
    });
    // Store closure as non-enumerable to avoid circular references during cloneDeep
    this._closure = closure;
    Object.defineProperty(this, "_closure", { enumerable: false });
  }

  // Override call to use the declaration's body
  call(_context: ExecutionContext, _args: any[]): any {
    // This will be called by executeCallExpression, which will pass the ExecutionContext
    // The actual execution logic is in executeFunctionDeclaration, but we need to handle it here
    // Actually, we'll handle the execution in executeCallExpression by checking for JSUserDefinedFunction
    // For now, this is a placeholder that will be called by the executor
    throw new Error("JSUserDefinedFunction.call should be handled by executor");
  }

  getDeclaration(): FunctionDeclaration {
    return this.declaration;
  }

  getClosure(): Environment | null {
    return this._closure;
  }

  toString(): string {
    return `function ${this.name}(${this.declaration.parameters.map(p => p.name.lexeme).join(", ")}) { ... }`;
  }
}
