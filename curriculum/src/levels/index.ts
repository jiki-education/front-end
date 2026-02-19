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
import { stringManipulation } from "./string-manipulation";
import { stringIteration } from "./string-iteration";
import { methodsAndProperties } from "./methods-and-properties";
import { advancedLists } from "./advanced-lists";
import { lists } from "./lists";
import { dictionaries } from "./dictionaries";
import { multipleFunctions } from "./multiple-functions";
import { everythingLevel } from "./everything";
import type { LanguageFeatureFlags, JavaScriptFeatureFlags, PythonFeatureFlags, JikiScriptFeatureFlags } from "./types";
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
  stringManipulation,
  stringIteration,
  methodsAndProperties,
  advancedLists,
  lists,
  dictionaries,
  multipleFunctions,
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

// Combined type for accumulated language features across all languages.
// Uses intersection so all properties from any language are accessible.
// The `allowedNodes` field is handled separately (it's split out in the Level type).
type LanguageFeatures = Partial<JavaScriptFeatureFlags & PythonFeatureFlags & JikiScriptFeatureFlags>;

// Type for allowedStdlib shape — intersection of JS and Python stdlib types
type AllowedStdlib = NonNullable<Required<JavaScriptFeatureFlags & PythonFeatureFlags>["allowedStdlib"]>;

// Helper to dedupe-merge an array of strings
function accumulateStrings(existing: string[], additions: string[]): string[] {
  const newItems = additions.filter((item) => !existing.includes(item));
  return newItems.length > 0 ? [...existing, ...newItems] : existing;
}

// Helper to deep-merge allowedStdlib (accumulate properties/methods arrays per type)
function accumulateStdlib(existing: AllowedStdlib, additions: AllowedStdlib): AllowedStdlib {
  const result = { ...existing };
  for (const key of Object.keys(additions) as Array<keyof AllowedStdlib>) {
    const typeRestrictions = additions[key];
    if (!typeRestrictions) continue;

    const target = result[key] ?? {};
    if (typeRestrictions.properties) {
      target.properties = accumulateStrings(target.properties ?? [], typeRestrictions.properties);
    }
    if (typeRestrictions.methods) {
      target.methods = accumulateStrings(target.methods ?? [], typeRestrictions.methods);
    }
    result[key] = target;
  }
  return result;
}

// Helper to get combined language features for interpreter (accumulates from all levels up to target)
export function getLanguageFeatures(
  levelId: LevelId | string,
  language: Language
): { allowedNodes?: string[] } & LanguageFeatures {
  const levelIds = getLevelIds();
  const targetIndex = levelIds.indexOf(levelId as LevelId);

  if (targetIndex === -1) {
    return {};
  }

  // Cumulative array-based features (union across levels, deduped)
  let accumulatedNodes: string[] = [];
  let accumulatedGlobals: string[] = [];
  let accumulatedStdlibFunctions: string[] = [];
  let accumulatedStdlib: AllowedStdlib = {};

  // All features including scalars (later levels override via spread)
  let accumulatedFeatures: LanguageFeatures = {};

  // Iterate through all levels up to and including the target
  for (let i = 0; i <= targetIndex; i++) {
    const level = getLevel(levelIds[i]);
    if (!level) continue;

    const features = level.languageFeatures[language];
    if (features === undefined) continue;

    // Accumulate allowed nodes (Jikiscript doesn't use allowedNodes)
    if (language !== "jikiscript" && features.allowedNodes && features.allowedNodes.length > 0) {
      accumulatedNodes = accumulateStrings(accumulatedNodes, features.allowedNodes as string[]);
    }

    const lf: LanguageFeatures | undefined = features.languageFeatures;
    if (lf === undefined) continue;

    // Spread all features (scalar flags get overridden by later levels)
    accumulatedFeatures = { ...accumulatedFeatures, ...lf };

    // Separately accumulate array-based fields
    if ("allowedGlobals" in lf && lf.allowedGlobals) {
      accumulatedGlobals = accumulateStrings(accumulatedGlobals, lf.allowedGlobals);
    }
    if ("allowedStdlibFunctions" in lf && lf.allowedStdlibFunctions) {
      accumulatedStdlibFunctions = accumulateStrings(accumulatedStdlibFunctions, lf.allowedStdlibFunctions);
    }
    if ("allowedStdlib" in lf && lf.allowedStdlib) {
      accumulatedStdlib = accumulateStdlib(accumulatedStdlib, lf.allowedStdlib);
    }
  }

  // Return combined features — cumulative fields override stale values from the spread
  return {
    ...accumulatedFeatures,
    allowedNodes: accumulatedNodes.length > 0 ? accumulatedNodes : undefined,
    ...(accumulatedGlobals.length > 0 ? { allowedGlobals: accumulatedGlobals } : {}),
    ...(accumulatedStdlibFunctions.length > 0 ? { allowedStdlibFunctions: accumulatedStdlibFunctions } : {}),
    ...(Object.keys(accumulatedStdlib).length > 0 ? { allowedStdlib: accumulatedStdlib } : {})
  };
}

// Get accumulated taught concepts for all levels up to and including the target level
export function getTaughtConcepts(levelId: LevelId | string): string[] {
  const levelIds = getLevelIds();
  const targetIndex = levelIds.indexOf(levelId as LevelId);
  if (targetIndex === -1) return [];

  const concepts: string[] = [];
  for (let i = 0; i <= targetIndex; i++) {
    const level = getLevel(levelIds[i]);
    if (!level) continue;
    concepts.push(...level.taughtConcepts);
  }
  return concepts;
}

// Get all level IDs in order (useful for progression)
export function getLevelIds(): LevelId[] {
  return levels.map((level) => level.id) as LevelId[];
}

// Check if a level exists
export function hasLevel(id: string): boolean {
  return levels.some((level) => level.id === id);
}
