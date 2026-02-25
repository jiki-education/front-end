import type { Language } from "@jiki/curriculum";
import type { CompilationResult, InterpretResult } from "@jiki/interpreters/shared";

export interface Interpreter {
  compile: (sourceCode: string, context?: any) => CompilationResult;
  interpret: (sourceCode: string, context?: any) => InterpretResult;
  evaluateFunction: (sourceCode: string, context: any, functionCall: string, ...args: any[]) => any;
  formatIdentifier: (name: string) => string;
}

export async function getInterpreter(language: Language): Promise<Interpreter> {
  switch (language) {
    case "jikiscript":
      return await import("@jiki/interpreters/jikiscript");
    case "javascript":
      return await import("@jiki/interpreters/javascript");
    case "python":
      return await import("@jiki/interpreters/python");
    default:
      throw new Error(`Unknown language: ${language}`);
  }
}
