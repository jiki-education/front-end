import { usingFunctions } from "./using-functions";
import { fundamentalsLevel } from "./fundamentals";
import { variablesLevel } from "./variables";
import type { LanguageFeatureFlags } from "./types";

// Export types
export * from "./types";

// The levels registry - ordered progression of levels
export const levels = [
  usingFunctions,
  fundamentalsLevel,
  variablesLevel
  // Future levels will be added here:
  // controlFlowLevel,
  // loopsLevel,
  // functionsLevel,
  // arraysLevel,
  // objectsLevel,
] as const;

export type LevelId = (typeof levels)[number]["id"];

// Helper to get level by ID
export function getLevel(id: LevelId | string) {
  return levels.find((level) => level.id === id);
}

// Helper to get allowed nodes for a language
export function getAllowedNodes(levelId: LevelId | string, language: "javascript" | "python"): string[] | undefined {
  const level = getLevel(levelId);
  const features = level?.languageFeatures[language];
  return features?.allowedNodes;
}

// Helper to get feature flags for a language
export function getFeatureFlags(levelId: LevelId | string, language: "javascript" | "python"): LanguageFeatureFlags {
  const level = getLevel(levelId);
  const features = level?.languageFeatures[language];
  return features?.languageFeatures ?? {};
}

// Helper to get combined language features for interpreter (accumulates from all levels up to target)
export function getLanguageFeatures(
  levelId: LevelId | string,
  language: "javascript" | "python"
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
  } = {};

  // Iterate through all levels up to and including the target
  for (let i = 0; i <= targetIndex; i++) {
    const level = getLevel(levelIds[i]);
    if (!level) continue;

    const features = level.languageFeatures[language];
    if (features === undefined) continue;

    // Concatenate allowed nodes (avoiding duplicates)
    if (features.allowedNodes !== undefined && features.allowedNodes.length > 0) {
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
