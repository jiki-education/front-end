import type { JikiObject } from "./jikiObjects";
import type { LanguageFeatures } from "./interfaces";
import type { Location } from "../shared/location";
import { RuntimeError } from "./executor";
import { translate } from "./translator";

interface VariableMetadata {
  value: JikiObject;
  isConst: boolean;
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

  public define(name: string, value: JikiObject, location: Location, isConst: boolean = false): void {
    // Check for shadowing if disabled
    if (!this.languageFeatures.allowShadowing) {
      if (this.isDefinedInEnclosingScope(name)) {
        const message = translate(`error.runtime.ShadowingDisabled`, { name });
        throw new RuntimeError(message, location, "ShadowingDisabled", { name });
      }
    }
    this.variables.set(name, { value, isConst });
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
