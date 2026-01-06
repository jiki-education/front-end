import type { ExternalFunction } from "@jiki/interpreters";

// Base class for IO exercises that test function return values

export abstract class IOExercise {
  static slug: string;
  static availableFunctions: ExternalFunction[];
}
