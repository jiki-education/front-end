import type { JikiObject } from "./jikiObjects";

export class Environment {
  private readonly values: Map<string, JikiObject> = new Map();
  public readonly id: string;

  constructor(private readonly enclosing: Environment | null = null) {
    this.id = Math.random().toString(36).substring(7);
  }

  public define(name: string, value: JikiObject): void {
    this.values.set(name, value);
  }

  public get(name: string): JikiObject | undefined {
    if (this.values.has(name)) {
      return this.values.get(name);
    }

    if (this.enclosing !== null) {
      return this.enclosing.get(name);
    }

    return undefined;
  }

  public update(name: string, value: JikiObject): void {
    if (this.values.has(name)) {
      this.values.set(name, value);
      return;
    }

    if (this.enclosing !== null) {
      this.enclosing.update(name, value);
      return;
    }

    // Variable not found in any scope
    throw new Error(`Variable '${name}' is not defined`);
  }

  public getAllVariables(): Record<string, JikiObject> {
    const result: Record<string, JikiObject> = {};

    // Get variables from enclosing scopes first (so local variables can override)
    if (this.enclosing !== null) {
      Object.assign(result, this.enclosing.getAllVariables());
    }

    // Add variables from this scope
    for (const [name, value] of this.values) {
      result[name] = value;
    }

    return result;
  }
}
