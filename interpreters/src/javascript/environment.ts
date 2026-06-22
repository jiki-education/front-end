import type { JikiObject } from "./jikiObjects";
import type { LanguageFeatures } from "./interfaces";
import type { Location } from "../shared/location";
import { RuntimeError } from "./executor";
import { translate } from "./translator";

interface VariableMetadata {
  value: JikiObject;
  isConst: boolean;
  // True when the binding was introduced by a student `let`/`const` declaration,
  // as opposed to an injected built-in (console, Math, secret constants, etc.).
  // Only lexical bindings trigger same-scope redeclaration errors, mirroring real
  // JS where `let console = 1` is legal but `let x = 1; let x = 2;` is not.
  isLexical: boolean;
}

export class Environment {
  private readonly variables: Map<string, VariableMetadata> = new Map();
  public readonly id: string;
  private readonly languageFeatures: LanguageFeatures;

  constructor(
    languageFeatures: LanguageFeatures,
    private readonly enclosing: Environment | null = null
  ) {
    this.id = Math.random().toString(36).substring(7);
    this.languageFeatures = languageFeatures;
  }

  public define(
    name: string,
    value: JikiObject,
    location: Location,
    isConst: boolean = false,
    isLexical: boolean = false
  ): void {
    // A lexical declaration (`let`/`const`) cannot redeclare another lexical
    // binding in the same scope. This matches real JavaScript, which raises a
    // SyntaxError for `let x = 1; let x = 2;`.
    if (isLexical) {
      const existing = this.variables.get(name);
      if (existing?.isLexical) {
        const message = translate(`error.runtime.VariableAlreadyDeclared`, { name });
        throw new RuntimeError(message, location, "VariableAlreadyDeclared", { name });
      }
    }

    // Check for shadowing if disabled
    if (!this.languageFeatures.allowShadowing) {
      if (this.isDefinedInEnclosingScope(name)) {
        const message = translate(`error.runtime.ShadowingDisabled`, { name });
        throw new RuntimeError(message, location, "ShadowingDisabled", { name });
      }
    }
    this.variables.set(name, { value, isConst, isLexical });
  }

  public isDefinedInEnclosingScope(name: string): boolean {
    if (this.enclosing === null) {
      return false;
    }

    // Check if the variable is defined in any enclosing scope
    if (this.enclosing.variables.has(name)) {
      return true;
    }

    return this.enclosing.isDefinedInEnclosingScope(name);
  }

  public get(name: string): JikiObject | undefined {
    const metadata = this.variables.get(name);
    if (metadata) {
      return metadata.value;
    }

    if (this.enclosing !== null) {
      return this.enclosing.get(name);
    }

    return undefined;
  }

  public update(name: string, value: JikiObject, location: Location): boolean {
    const metadata = this.variables.get(name);
    if (metadata) {
      // Check if variable is const
      if (metadata.isConst) {
        const message = translate(`error.runtime.AssignmentToConstant`, { name });
        throw new RuntimeError(message, location, "AssignmentToConstant", { name });
      }
      this.variables.set(name, { ...metadata, value });
      return true;
    }

    if (this.enclosing !== null) {
      return this.enclosing.update(name, value, location);
    }

    // Variable not found in any scope
    return false;
  }

  // Returns the nearest enclosing environment (including self) that defines `name`,
  // or null if the name isn't defined anywhere in the chain.
  public getDefiningEnvironment(name: string): Environment | null {
    if (this.variables.has(name)) {
      return this;
    }
    if (this.enclosing !== null) {
      return this.enclosing.getDefiningEnvironment(name);
    }
    return null;
  }

  public getAllVariables(): Record<string, JikiObject> {
    const result: Record<string, JikiObject> = {};

    // Get variables from enclosing scopes first (so local variables can override)
    if (this.enclosing !== null) {
      Object.assign(result, this.enclosing.getAllVariables());
    }

    // Add variables from this scope
    for (const [name, metadata] of this.variables) {
      result[name] = metadata.value;
    }

    return result;
  }
}
