import { JikiObject } from "../../shared/jikiObject";
import type { ExecutionContext } from "../executor";
import type { JSArray } from "./JSList";

// Represents a JavaScript function/method that can be called
export class JSStdLibFunction extends JikiObject {
  constructor(
    public readonly name: string,
    public readonly arity: number | [number, number], // exact or [min, max]
    public readonly fn: (ctx: ExecutionContext, thisObj: JSArray | null, args: JikiObject[]) => JikiObject,
    public readonly description: string
  ) {
    super("function");
  }

  public get value(): any {
    return this.fn;
  }

  public call(ctx: ExecutionContext, thisObj: JSArray | null, args: JikiObject[]): JikiObject {
    return this.fn(ctx, thisObj, args);
  }

  public toString(): string {
    return `[Function: ${this.name}]`;
  }

  public clone(): JSStdLibFunction {
    // Functions are immutable, so return self
    return this;
  }
}
