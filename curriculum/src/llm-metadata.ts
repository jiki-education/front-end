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
import { llmMetadata as alphanumericLLM } from "./exercises/alphanumeric/llm-metadata";
import { llmMetadata as anagramLLM } from "./exercises/anagram/llm-metadata";
import { llmMetadata as chopShopLLM } from "./exercises/chop-shop/llm-metadata";
import { llmMetadata as collatzConjectureLLM } from "./exercises/collatz-conjecture/llm-metadata";
import { llmMetadata as guestListLLM } from "./exercises/guest-list/llm-metadata";
import { llmMetadata as hammingLLM } from "./exercises/hamming/llm-metadata";
import { llmMetadata as formalDinnerLLM } from "./exercises/formal-dinner/llm-metadata";
import { llmMetadata as drivingTestLLM } from "./exercises/driving-test/llm-metadata";
import { llmMetadata as evenOrOddLLM } from "./exercises/even-or-odd/llm-metadata";
import { llmMetadata as mazeSolveBasicLLM } from "./exercises/maze-solve-basic/llm-metadata";
import { llmMetadata as sproutingFlowerLLM } from "./exercises/sprouting-flower/llm-metadata";
import { llmMetadata as penguinLLM } from "./exercises/penguin/llm-metadata";
import { llmMetadata as scrollAndShootLLM } from "./exercises/scroll-and-shoot/llm-metadata";
import { llmMetadata as spaceInvadersSolveBasicLLM } from "./exercises/space-invaders-solve-basic/llm-metadata";
import { llmMetadata as spaceInvadersRepeatLLM } from "./exercises/space-invaders-repeat/llm-metadata";
import { llmMetadata as spaceInvadersNestedRepeatLLM } from "./exercises/space-invaders-nested-repeat/llm-metadata";
import { llmMetadata as spaceInvadersConditionalLLM } from "./exercises/space-invaders-conditional/llm-metadata";
import { llmMetadata as jumbledHouseLLM } from "./exercises/jumbled-house/llm-metadata";
import { llmMetadata as bouncerLLM } from "./exercises/bouncer/llm-metadata";
import { llmMetadata as bouncerWristbandsLLM } from "./exercises/bouncer-wristbands/llm-metadata";
import { llmMetadata as bouncerDressCodeLLM } from "./exercises/bouncer-dress-code/llm-metadata";
import { llmMetadata as buildWallLLM } from "./exercises/build-wall/llm-metadata";
import { llmMetadata as finishWallLLM } from "./exercises/finish-wall/llm-metadata";
import { llmMetadata as fixWallLLM } from "./exercises/fix-wall/llm-metadata";
import { llmMetadata as structuredHouseLLM } from "./exercises/structured-house/llm-metadata";
import { llmMetadata as nucleotideLLM } from "./exercises/nucleotide/llm-metadata";
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
import { llmMetadata as golfRollingBallStateLLM } from "./exercises/golf-rolling-ball-state/llm-metadata";
import { llmMetadata as golfShotCheckerLLM } from "./exercises/golf-shot-checker/llm-metadata";
import { llmMetadata as plantTheFlowersLLM } from "./exercises/plant-the-flowers/llm-metadata";
import { llmMetadata as plantTheFlowersScenariosLLM } from "./exercises/plant-the-flowers-scenarios/llm-metadata";
import { llmMetadata as processGuessLLM } from "./exercises/process-guess/llm-metadata";
import { llmMetadata as processGameLLM } from "./exercises/process-game/llm-metadata";
import { llmMetadata as wordleSolverLLM } from "./exercises/wordle-solver/llm-metadata";
import { llmMetadata as snowmanLLM } from "./exercises/snowman/llm-metadata";
import { llmMetadata as trafficLightsLLM } from "./exercises/traffic-lights/llm-metadata";
import { llmMetadata as relationalSnowmanLLM } from "./exercises/relational-snowman/llm-metadata";
import { llmMetadata as relationalSunLLM } from "./exercises/relational-sun/llm-metadata";
import { llmMetadata as relationalTrafficLightsLLM } from "./exercises/relational-traffic-lights/llm-metadata";
import { llmMetadata as cityscapeSkyscraperLLM } from "./exercises/cityscape-skyscraper/llm-metadata";
import { llmMetadata as cityscapeSkylineLLM } from "./exercises/cityscape-skyline/llm-metadata";
import { llmMetadata as rainbowSplodgesLLM } from "./exercises/rainbow-splodges/llm-metadata";
import { llmMetadata as digitalClockLLM } from "./exercises/digital-clock/llm-metadata";
import { llmMetadata as rockPaperScissorsDetermineWinnerLLM } from "./exercises/rock-paper-scissors-determine-winner/llm-metadata";
import { llmMetadata as mazeAutomatedSolveLLM } from "./exercises/maze-automated-solve/llm-metadata";
import { llmMetadata as mazeTurnAroundLLM } from "./exercises/maze-turn-around/llm-metadata";
import { llmMetadata as rainbowBallLLM } from "./exercises/rainbow-ball/llm-metadata";
import { llmMetadata as triangleLLM } from "./exercises/triangle/llm-metadata";
import { llmMetadata as raindropsLLM } from "./exercises/raindrops/llm-metadata";
import { llmMetadata as isbnVerifierLLM } from "./exercises/isbn-verifier/llm-metadata";
import { llmMetadata as lunchboxLLM } from "./exercises/lunchbox/llm-metadata";
import { llmMetadata as starsLLM } from "./exercises/stars/llm-metadata";
import { llmMetadata as wordCountLLM } from "./exercises/word-count/llm-metadata";
import { llmMetadata as extractWordsLLM } from "./exercises/extract-words/llm-metadata";
import { llmMetadata as helloLLM } from "./exercises/hello/llm-metadata";
import { llmMetadata as threeLetterAcronymLLM } from "./exercises/three-letter-acronym/llm-metadata";
import { llmMetadata as tileRackLLM } from "./exercises/tile-rack/llm-metadata";
import { llmMetadata as tileSearchLLM } from "./exercises/tile-search/llm-metadata";
import { llmMetadata as signPriceLLM } from "./exercises/sign-price/llm-metadata";
import { llmMetadata as nicheNamedPartyLLM } from "./exercises/niche-named-party/llm-metadata";
import { llmMetadata as lowerPangramLLM } from "./exercises/lower-pangram/llm-metadata";
import { llmMetadata as caesarCipherLLM } from "./exercises/caesar-cipher/llm-metadata";
import { llmMetadata as mazeWalkLLM } from "./exercises/maze-walk/llm-metadata";
import { llmMetadata as battleProceduresLLM } from "./exercises/battle-procedures/llm-metadata";
import { llmMetadata as weatherSymbolsPart1LLM } from "./exercises/weather-symbols-part-1/llm-metadata";
import { llmMetadata as weatherSymbolsPart2LLM } from "./exercises/weather-symbols-part-2/llm-metadata";
import { llmMetadata as ticTacToeLLM } from "./exercises/tic-tac-toe/llm-metadata";
import { llmMetadata as lookupTimeLLM } from "./exercises/lookup-time/llm-metadata";
import { llmMetadata as alienDetectorLLM } from "./exercises/alien-detector/llm-metadata";
import { llmMetadata as sieveLLM } from "./exercises/sieve/llm-metadata";
import { llmMetadata as spotifyLLM } from "./exercises/spotify/llm-metadata";
import { llmMetadata as llmResponseLLM } from "./exercises/llm-response/llm-metadata";
import { llmMetadata as leapLLM } from "./exercises/leap/llm-metadata";

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
  alphanumeric: alphanumericLLM,
  anagram: anagramLLM,
  "chop-shop": chopShopLLM,
  "collatz-conjecture": collatzConjectureLLM,
  "guest-list": guestListLLM,
  hamming: hammingLLM,
  "formal-dinner": formalDinnerLLM,
  "driving-test": drivingTestLLM,
  "even-or-odd": evenOrOddLLM,
  "maze-solve-basic": mazeSolveBasicLLM,
  "sprouting-flower": sproutingFlowerLLM,
  penguin: penguinLLM,
  "scroll-and-shoot": scrollAndShootLLM,
  "space-invaders-solve-basic": spaceInvadersSolveBasicLLM,
  "space-invaders-repeat": spaceInvadersRepeatLLM,
  "space-invaders-nested-repeat": spaceInvadersNestedRepeatLLM,
  "space-invaders-conditional": spaceInvadersConditionalLLM,
  "jumbled-house": jumbledHouseLLM,
  bouncer: bouncerLLM,
  "bouncer-wristbands": bouncerWristbandsLLM,
  "bouncer-dress-code": bouncerDressCodeLLM,
  "build-wall": buildWallLLM,
  "finish-wall": finishWallLLM,
  "fix-wall": fixWallLLM,
  "structured-house": structuredHouseLLM,
  nucleotide: nucleotideLLM,
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
  "golf-rolling-ball-state": golfRollingBallStateLLM,
  "golf-shot-checker": golfShotCheckerLLM,
  "plant-the-flowers": plantTheFlowersLLM,
  "plant-the-flowers-scenarios": plantTheFlowersScenariosLLM,
  "process-guess": processGuessLLM,
  "process-game": processGameLLM,
  "wordle-solver": wordleSolverLLM,
  snowman: snowmanLLM,
  "traffic-lights": trafficLightsLLM,
  "relational-snowman": relationalSnowmanLLM,
  "relational-sun": relationalSunLLM,
  "relational-traffic-lights": relationalTrafficLightsLLM,
  "cityscape-skyscraper": cityscapeSkyscraperLLM,
  "cityscape-skyline": cityscapeSkylineLLM,
  "rainbow-splodges": rainbowSplodgesLLM,
  "digital-clock": digitalClockLLM,
  "rock-paper-scissors-determine-winner": rockPaperScissorsDetermineWinnerLLM,
  "maze-automated-solve": mazeAutomatedSolveLLM,
  "maze-turn-around": mazeTurnAroundLLM,
  "rainbow-ball": rainbowBallLLM,
  triangle: triangleLLM,
  raindrops: raindropsLLM,
  "isbn-verifier": isbnVerifierLLM,
  lunchbox: lunchboxLLM,
  stars: starsLLM,
  "word-count": wordCountLLM,
  "extract-words": extractWordsLLM,
  hello: helloLLM,
  "three-letter-acronym": threeLetterAcronymLLM,
  "tile-rack": tileRackLLM,
  "tile-search": tileSearchLLM,
  "sign-price": signPriceLLM,
  "niche-named-party": nicheNamedPartyLLM,
  "lower-pangram": lowerPangramLLM,
  "caesar-cipher": caesarCipherLLM,
  "maze-walk": mazeWalkLLM,
  "battle-procedures": battleProceduresLLM,
  "weather-symbols-part-1": weatherSymbolsPart1LLM,
  "weather-symbols-part-2": weatherSymbolsPart2LLM,
  "tic-tac-toe": ticTacToeLLM,
  "lookup-time": lookupTimeLLM,
  "alien-detector": alienDetectorLLM,
  sieve: sieveLLM,
  spotify: spotifyLLM,
  "llm-response": llmResponseLLM,
  leap: leapLLM
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
