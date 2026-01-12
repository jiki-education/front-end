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
import { llmMetadata as basicMovementLLM } from "./exercises/basic-movement/llm-metadata";
import { llmMetadata as mazeSolveBasicLLM } from "./exercises/maze-solve-basic/llm-metadata";
import { llmMetadata as sproutingFlowerLLM } from "./exercises/sprouting-flower/llm-metadata";
import { llmMetadata as penguinLLM } from "./exercises/penguin/llm-metadata";
import { llmMetadata as scrollAndShootLLM } from "./exercises/scroll-and-shoot/llm-metadata";

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
  "basic-movement": basicMovementLLM,
  "maze-solve-basic": mazeSolveBasicLLM,
  "sprouting-flower": sproutingFlowerLLM,
  penguin: penguinLLM,
  "scroll-and-shoot": scrollAndShootLLM
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
