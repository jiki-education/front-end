import type { ExternalFunction } from "@jiki/interpreters";
import { formatIdentifier } from "@jiki/interpreters/shared";
import { Exercise } from "./Exercise";
import type { AvailableFunction, Language } from "./types";

// Base class for IO exercises that test function return values

export abstract class IOExercise extends Exercise {
  protected abstract get slug(): string;

  abstract availableFunctions: AvailableFunction[];

  getExternalFunctions(language: Language): ExternalFunction[] {
    // Resolve each function's frame-log describer template. A keyed function
    // resolves its `descriptionKey` against this exercise's injected message dict
    // (i18next returns `${argN}`/`${return}` literally, so the interpreter still
    // substitutes them). A not-yet-keyed function keeps its inline `description`.
    return this.availableFunctions.map((f) => ({
      ...f,
      name: formatIdentifier(f.name, language),
      description: f.descriptionKey !== undefined ? this.t(f.descriptionKey) : (f.description ?? "")
    }));
  }
}
