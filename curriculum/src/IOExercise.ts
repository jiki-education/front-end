import type { ExternalFunction } from "@jiki/interpreters";
import { jikiscript, javascript, python } from "@jiki/interpreters";
import { Exercise } from "./Exercise";
import type { Language } from "./types";

const interpreters = { jikiscript, javascript, python };

// Base class for IO exercises that test function return values

export abstract class IOExercise extends Exercise {
  static slug: string;
  static availableFunctions: ExternalFunction[];

  static getExternalFunctions(language: Language): ExternalFunction[] {
    return this.availableFunctions.map((f) => ({
      ...f,
      name: interpreters[language].formatIdentifier(f.name)
    }));
  }
}
