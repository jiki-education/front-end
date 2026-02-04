import { JikiObject } from "../../shared/jikiObject";
import type { PyStdLibFunction } from "./PyStdLibFunction";

/**
 * PyBuiltinModule represents global builtin modules like random.
 * These modules have methods that are registered at initialization.
 * Unlike user objects, builtin module methods cannot be reassigned or deleted.
 */
export class PyBuiltinModule extends JikiObject {
  private readonly methods: Map<string, PyStdLibFunction>;
  private readonly moduleName: string;

  constructor(name: string, methods: Map<string, PyStdLibFunction>) {
    super("builtin-module");
    this.moduleName = name;
    this.methods = methods;
  }

  public getMethod(name: string): PyStdLibFunction | undefined {
    return this.methods.get(name);
  }

  public get value(): Map<string, PyStdLibFunction> {
    return this.methods;
  }

  public toString(): string {
    return `<module '${this.moduleName}'>`;
  }

  public clone(): PyBuiltinModule {
    // Builtin modules are immutable - return self
    return this;
  }

  public pythonTypeName(): string {
    return "module";
  }
}
