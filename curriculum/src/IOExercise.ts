import type { ExternalFunction } from "@jiki/interpreters";
import { Exercise } from "./Exercise";

// Base class for IO exercises that test function return values

export abstract class IOExercise extends Exercise {
  static slug: string;
  static availableFunctions: ExternalFunction[];
}
