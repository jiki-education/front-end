import { JikiObject } from "../../shared/jikiObject";
import type { ExecutionContext } from "../executor";
import type { PyList } from "../jikiObjects";

// Represents a Python function/method that can be called
export class PyStdLibFunction extends JikiObject {
  constructor(
    public readonly name: string,
    public readonly arity: number | [number, number], // exact or [min, max]
    public readonly fn: (ctx: ExecutionContext, thisObj: PyList | null, args: JikiObject[]) => JikiObject,
    public readonly description: string
  ) {
    super("function");
  }

  public get value(): any {
    return this.fn;
  }

  public call(ctx: ExecutionContext, thisObj: PyList | null, args: JikiObject[]): JikiObject {
    return this.fn(ctx, thisObj, args);
  }

  public toString(): string {
    return `<function ${this.name}>`;
  }

  public clone(): PyStdLibFunction {
    // Functions are guaranteed to be immutable - they have no mutable state.
    // All properties (name, arity, fn, description) are readonly and cannot change
    // after construction. The function behavior (fn) is deterministic and doesn't
    // maintain any internal state. Therefore, returning self is safe and efficient,
    // following the pattern established in the shared architecture for immutable objects.
    return this;
  }

  public pythonTypeName(): string {
    return "function";
  }
}
