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
import { llmMetadata as afterPartyLLM } from "./exercises/after-party/llm-metadata";
import { llmMetadata as anagramLLM } from "./exercises/anagram/llm-metadata";
import { llmMetadata as chopShopLLM } from "./exercises/chop-shop/llm-metadata";
import { llmMetadata as guestListLLM } from "./exercises/guest-list/llm-metadata";
import { llmMetadata as hammingLLM } from "./exercises/hamming/llm-metadata";
import { llmMetadata as formalDinnerLLM } from "./exercises/formal-dinner/llm-metadata";
import { llmMetadata as drivingTestLLM } from "./exercises/driving-test/llm-metadata";
import { llmMetadata as mazeSolveBasicLLM } from "./exercises/maze-solve-basic/llm-metadata";
import { llmMetadata as sproutingFlowerLLM } from "./exercises/sprouting-flower/llm-metadata";
import { llmMetadata as penguinLLM } from "./exercises/penguin/llm-metadata";
import { llmMetadata as scrollAndShootLLM } from "./exercises/scroll-and-shoot/llm-metadata";
import { llmMetadata as spaceInvadersSolveBasicLLM } from "./exercises/space-invaders-solve-basic/llm-metadata";
import { llmMetadata as spaceInvadersRepeatLLM } from "./exercises/space-invaders-repeat/llm-metadata";
import { llmMetadata as jumbledHouseLLM } from "./exercises/jumbled-house/llm-metadata";
import { llmMetadata as buildWallLLM } from "./exercises/build-wall/llm-metadata";
import { llmMetadata as finishWallLLM } from "./exercises/finish-wall/llm-metadata";
import { llmMetadata as fixWallLLM } from "./exercises/fix-wall/llm-metadata";
import { llmMetadata as structuredHouseLLM } from "./exercises/structured-house/llm-metadata";
import { llmMetadata as nucleotideCountLLM } from "./exercises/nucleotide-count/llm-metadata";
import { llmMetadata as mealPrepLLM } from "./exercises/meal-prep/llm-metadata";
import { llmMetadata as matchingSocksLLM } from "./exercises/matching-socks/llm-metadata";
import { llmMetadata as reverseStringLLM } from "./exercises/reverse-string/llm-metadata";
import { llmMetadata as proteinTranslationLLM } from "./exercises/protein-translation/llm-metadata";
import { llmMetadata as pangramLLM } from "./exercises/pangram/llm-metadata";
import { llmMetadata as sunsetLLM } from "./exercises/sunset/llm-metadata";
import { llmMetadata as rainbowLLM } from "./exercises/rainbow/llm-metadata";
import { llmMetadata as rnaTranscriptionLLM } from "./exercises/rna-transcription/llm-metadata";
import { llmMetadata as scrabbleScoreLLM } from "./exercises/scrabble-score/llm-metadata";
import { llmMetadata as twoFerLLM } from "./exercises/two-fer/llm-metadata";
import { llmMetadata as sunshineLLM } from "./exercises/sunshine/llm-metadata";
import { llmMetadata as foxyFaceLLM } from "./exercises/foxy-face/llm-metadata";
import { llmMetadata as cloudRainSunLLM } from "./exercises/cloud-rain-sun/llm-metadata";
import { llmMetadata as golfRollingBallLoopLLM } from "./exercises/golf-rolling-ball-loop/llm-metadata";
import { llmMetadata as golfShotCheckerLLM } from "./exercises/golf-shot-checker/llm-metadata";
import { llmMetadata as golfRollingBallManualLLM } from "./exercises/golf-rolling-ball-manual/llm-metadata";

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
  "after-party": afterPartyLLM,
  anagram: anagramLLM,
  "chop-shop": chopShopLLM,
  "guest-list": guestListLLM,
  hamming: hammingLLM,
  "formal-dinner": formalDinnerLLM,
  "driving-test": drivingTestLLM,
  "maze-solve-basic": mazeSolveBasicLLM,
  "sprouting-flower": sproutingFlowerLLM,
  penguin: penguinLLM,
  "scroll-and-shoot": scrollAndShootLLM,
  "space-invaders-solve-basic": spaceInvadersSolveBasicLLM,
  "space-invaders-repeat": spaceInvadersRepeatLLM,
  "jumbled-house": jumbledHouseLLM,
  "build-wall": buildWallLLM,
  "finish-wall": finishWallLLM,
  "fix-wall": fixWallLLM,
  "structured-house": structuredHouseLLM,
  "nucleotide-count": nucleotideCountLLM,
  "meal-prep": mealPrepLLM,
  "matching-socks": matchingSocksLLM,
  "reverse-string": reverseStringLLM,
  "protein-translation": proteinTranslationLLM,
  pangram: pangramLLM,
  sunset: sunsetLLM,
  rainbow: rainbowLLM,
  "rna-transcription": rnaTranscriptionLLM,
  "scrabble-score": scrabbleScoreLLM,
  "two-fer": twoFerLLM,
  sunshine: sunshineLLM,
  "foxy-face": foxyFaceLLM,
  "cloud-rain-sun": cloudRainSunLLM,
  "golf-rolling-ball-loop": golfRollingBallLoopLLM,
  "golf-shot-checker": golfShotCheckerLLM,
  "golf-rolling-ball-manual": golfRollingBallManualLLM
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
