/**
 * LLM Metadata Registry
 *
 * This file provides access to LLM-specific metadata for exercises.
 * It will NOT be included in app bundles due to tree-shaking (app never imports it).
 * Only llm-chat-proxy should import and use these functions.
 */

// Import LLM metadata for all exercises
// NOTE: Add new exercises here as they're created
import { llmMetadata as acronymLLM } from "./exercises/acronym/llm-metadata";
import { llmMetadata as anagramLLM } from "./exercises/anagram/llm-metadata";
import { llmMetadata as formalDinnerLLM } from "./exercises/formal-dinner/llm-metadata";
import { llmMetadata as mazeSolveBasicLLM } from "./exercises/maze-solve-basic/llm-metadata";
import { llmMetadata as sproutingFlowerLLM } from "./exercises/sprouting-flower/llm-metadata";
import { llmMetadata as penguinLLM } from "./exercises/penguin/llm-metadata";
import { llmMetadata as scrollAndShootLLM } from "./exercises/scroll-and-shoot/llm-metadata";
import { llmMetadata as jumbledHouseLLM } from "./exercises/jumbled-house/llm-metadata";
import { llmMetadata as buildWallLLM } from "./exercises/build-wall/llm-metadata";
import { llmMetadata as finishWallLLM } from "./exercises/finish-wall/llm-metadata";
import { llmMetadata as fixWallLLM } from "./exercises/fix-wall/llm-metadata";
import { llmMetadata as structuredHouseLLM } from "./exercises/structured-house/llm-metadata";

// Common LLM metadata type
export interface LLMMetadata {
  description: string;
  tasks: Record<string, { description: string }>;
}

/**
 * Registry mapping exercise slugs to their LLM metadata
 */
const llmMetadataRegistry = {
  acronym: acronymLLM,
  anagram: anagramLLM,
  "formal-dinner": formalDinnerLLM,
  "maze-solve-basic": mazeSolveBasicLLM,
  "sprouting-flower": sproutingFlowerLLM,
  penguin: penguinLLM,
  "scroll-and-shoot": scrollAndShootLLM,
  "jumbled-house": jumbledHouseLLM,
  "build-wall": buildWallLLM,
  "finish-wall": finishWallLLM,
  "fix-wall": fixWallLLM,
  "structured-house": structuredHouseLLM
} as const;

/**
 * Get LLM metadata for an exercise by slug
 *
 * @param slug - Exercise slug (e.g., "acronym")
 * @returns LLM metadata for the exercise, or undefined if not found
 *
 * @example
 * const llmMeta = getLLMMetadata("acronym");
 * if (llmMeta) {
 *   console.log(llmMeta.description); // Exercise-level LLM guidance
 *   console.log(llmMeta.tasks["create-acronym-function"].description); // Task-specific guidance
 * }
 */
export function getLLMMetadata(slug: string): LLMMetadata | undefined {
  return llmMetadataRegistry[slug as keyof typeof llmMetadataRegistry];
}
