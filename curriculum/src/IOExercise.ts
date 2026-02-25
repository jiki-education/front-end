import type { ExternalFunction } from "@jiki/interpreters";
import { formatIdentifier } from "@jiki/interpreters/shared";
import { Exercise } from "./Exercise";
import type { Language } from "./types";

// Base class for IO exercises that test function return values

export abstract class IOExercise extends Exercise {
  static slug: string;
  static availableFunctions: ExternalFunction[];

  static getExternalFunctions(language: Language): ExternalFunction[] {
    return this.availableFunctions.map((f) => ({
      ...f,
      name: formatIdentifier(f.name, language)
    }));
  }
}
