import type { Arity, ExecutionContext } from "../shared/interfaces";
import { JikiObject, PyStdLibFunction } from "./jikiObjects";
import type { FunctionDeclaration } from "./statement";
import type { Location } from "../shared/location";

export interface Callable {
  arity: Arity | undefined;
  call: (context: ExecutionContext, args: any[]) => any;
}

export function isCallable(obj: any): obj is Callable {
  return (obj instanceof Object && "arity" in obj && "call" in obj) || obj instanceof PyStdLibFunction;
}

export class PyCallable extends JikiObject {
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

  call(context: ExecutionContext, args: any[]): any {
    return this.func(context, ...args);
  }

  clone(): PyCallable {
    return new PyCallable(this.name, this.arity, this.func);
  }

  toString(): string {
    return `<function ${this.name}>`;
  }
}

export class ReturnValue extends Error {
  constructor(
    public value: any,
    public location: Location
  ) {
    super();
  }
}

export class PyUserDefinedFunction extends PyCallable {
  constructor(private readonly declaration: FunctionDeclaration) {
    super(declaration.name.lexeme, declaration.parameters.length, () => {
      throw new Error("User-defined functions should not call func directly");
    });
  }

  getDeclaration(): FunctionDeclaration {
    return this.declaration;
  }

  toString(): string {
    return `<function ${this.name}>`;
  }
}
