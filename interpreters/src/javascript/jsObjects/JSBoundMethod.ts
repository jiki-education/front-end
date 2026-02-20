import { JikiObject } from "../../shared/jikiObject";
import type { ExecutionContext } from "../executor";
import type { Arity } from "../../shared/interfaces";
import type { JSInstance } from "./JSInstance";
import type { JSMethod } from "./JSClass";
import { JSUndefined } from "./JSUndefined";

export class JSBoundMethod extends JikiObject {
  public readonly arity: Arity;
  public readonly name: string;

  constructor(
    private readonly instance: JSInstance,
    private readonly method: JSMethod
  ) {
    super("bound-method");
    this.arity = method.arity;
    this.name = method.name;
  }

  call(context: ExecutionContext, args: JikiObject[]): JikiObject {
    const result = this.method.fn(context, this.instance, ...args);
    if (result === undefined) {
      return new JSUndefined();
    }
    return result;
  }

  get value(): string {
    return `[bound method ${this.name}]`;
  }

  toString(): string {
    return `function ${this.name}() { [bound] }`;
  }

  clone(): JSBoundMethod {
    return this; // Bound methods are not mutable
  }
}
