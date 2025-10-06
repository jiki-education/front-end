import { JikiObject } from "../../shared/jikiObject";
import type { JSStdLibFunction } from "./JSStdLibFunction";

/**
 * JSBuiltinObject represents global builtin objects like console, Math, JSON, etc.
 * These objects have properties and methods that are registered at initialization.
 * Unlike user dictionaries, builtin object properties cannot be reassigned or deleted.
 */
export class JSBuiltinObject extends JikiObject {
  private readonly methods: Map<string, JSStdLibFunction>;
  private readonly objectName: string;

  constructor(name: string, methods: Map<string, JSStdLibFunction>) {
    super("builtin-object");
    this.objectName = name;
    this.methods = methods;
  }

  public getMethod(name: string): JSStdLibFunction | undefined {
    return this.methods.get(name);
  }

  public get value(): Map<string, JSStdLibFunction> {
    return this.methods;
  }

  public toString(): string {
    return `[object ${this.objectName}]`;
  }

  public clone(): JSBuiltinObject {
    // Builtin objects are immutable - return self
    return this;
  }
}
