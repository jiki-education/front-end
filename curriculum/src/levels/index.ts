import { usingFunctions } from "./using-functions";
import { stringsAndColors } from "./strings-and-colors";
import { repeatLoop } from "./repeat-loop";
import { variablesLevel } from "./variables";
import { basicState } from "./basic-state";
import { functionsThatReturnThings } from "./functions-that-return-things";
import { conditionals } from "./conditionals";
import { complexConditionals } from "./complex-conditionals";
import { conditionalsAndState } from "./conditionals-and-state";
import { makeYourOwnFunctions } from "./make-your-own-functions";
import { addingInputsToYourFunctions } from "./adding-inputs-to-your-functions";
import { addingReturnsToYourFunctions } from "./adding-returns-to-your-functions";
import { stringManipulation } from "./string-manipulation";
import { stringIteration } from "./string-iteration";
import { methodsAndProperties } from "./methods-and-properties";
import { lists } from "./lists";
import { everythingLevel } from "./everything";
import type { LanguageFeatureFlags } from "./types";
import type { Language } from "../types";

// Export types
export * from "./types";

// The levels registry - ordered progression of levels
export const levels = [
  usingFunctions,
  stringsAndColors,
  repeatLoop,
  variablesLevel,
  basicState,
  functionsThatReturnThings,
  conditionals,
  complexConditionals,
  conditionalsAndState,
  makeYourOwnFunctions,
  addingInputsToYourFunctions,
  addingReturnsToYourFunctions,
  stringManipulation,
  stringIteration,
  methodsAndProperties,
  lists,
  everythingLevel
] as const;

export type LevelId = (typeof levels)[number]["id"];

// Helper to get level by ID
export function getLevel(id: LevelId | string) {
  return levels.find((level) => level.id === id);
}

// Helper to get allowed nodes for a language
export function getAllowedNodes(levelId: LevelId | string, language: Language): string[] | undefined {
  const level = getLevel(levelId);
  const features = level?.languageFeatures[language];
  // Jikiscript doesn't use allowedNodes (uses includeList/excludeList instead)
  if (language === "jikiscript") return undefined;
  return features?.allowedNodes;
}

// Helper to get feature flags for a language
export function getFeatureFlags(levelId: LevelId | string, language: Language): LanguageFeatureFlags {
  const level = getLevel(levelId);
  const features = level?.languageFeatures[language];
  return features?.languageFeatures ?? {};
}

// Helper to get combined language features for interpreter (accumulates from all levels up to target)
export function getLanguageFeatures(
  levelId: LevelId | string,
  language: Language
): {
  allowedNodes?: string[];
  excludeList?: string[];
  includeList?: string[];
  allowShadowing?: boolean;
  allowTruthiness?: boolean;
  requireVariableInstantiation?: boolean;
  allowTypeCoercion?: boolean;
  oneStatementPerLine?: boolean;
  enforceStrictEquality?: boolean;
  allowedStdlibFunctions?: string[];
} {
  const levelIds = getLevelIds();
  const targetIndex = levelIds.indexOf(levelId as LevelId);

  if (targetIndex === -1) {
    return {};
  }

  // Start with empty features
  let accumulatedNodes: string[] = [];
  let accumulatedFeatures: {
    excludeList?: string[];
    includeList?: string[];
    allowShadowing?: boolean;
    allowTruthiness?: boolean;
    requireVariableInstantiation?: boolean;
    allowTypeCoercion?: boolean;
    oneStatementPerLine?: boolean;
    enforceStrictEquality?: boolean;
    allowedStdlibFunctions?: string[];
  } = {};

  // Iterate through all levels up to and including the target
  for (let i = 0; i <= targetIndex; i++) {
    const level = getLevel(levelIds[i]);
    if (!level) continue;

    const features = level.languageFeatures[language];
    if (features === undefined) continue;

    // Concatenate allowed nodes (avoiding duplicates)
    // Note: Jikiscript doesn't use allowedNodes (uses includeList/excludeList instead)
    if (language !== "jikiscript" && features.allowedNodes && features.allowedNodes.length > 0) {
      const newNodes = features.allowedNodes.filter((node) => !accumulatedNodes.includes(node));
      accumulatedNodes = [...accumulatedNodes, ...newNodes];
    }

    // Override language features (later levels take precedence)
    if (features.languageFeatures !== undefined) {
      accumulatedFeatures = {
        ...accumulatedFeatures,
        ...features.languageFeatures
      };
    }
  }

  // Return combined features matching interpreter's expected shape
  return {
    allowedNodes: accumulatedNodes.length > 0 ? accumulatedNodes : undefined,
    ...accumulatedFeatures
  };
}

// Get all level IDs in order (useful for progression)
export function getLevelIds(): LevelId[] {
  return levels.map((level) => level.id) as LevelId[];
}

// Check if a level exists
export function hasLevel(id: string): boolean {
  return levels.some((level) => level.id === id);
}
