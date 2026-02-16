import {
  type ExecutionContext,
  type ExternalFunction,
  type Shared,
  isNumber,
  isList,
  isString
} from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";

type LetterState = "correct" | "present" | "absent";

const COMMON_WORDS = [
  "which",
  "about",
  "there",
  "their",
  "would",
  "these",
  "other",
  "words",
  "colly",
  "could",
  "write",
  "first",
  "water",
  "after",
  "where",
  "right",
  "think",
  "three",
  "years",
  "place",
  "sound",
  "great",
  "again",
  "still",
  "every",
  "small",
  "found",
  "those",
  "never",
  "under",
  "might",
  "while",
  "house",
  "world",
  "below",
  "asked",
  "going",
  "large",
  "until",
  "along",
  "shall",
  "being",
  "often",
  "earth",
  "began",
  "since",
  "study",
  "night",
  "light",
  "above",
  "paper",
  "parts",
  "young",
  "story",
  "point",
  "times",
  "heard",
  "whole",
  "white",
  "given",
  "means",
  "tonic",
  "music",
  "miles",
  "thing",
  "today",
  "later",
  "using",
  "money",
  "lines",
  "order",
  "group",
  "among",
  "learn",
  "known",
  "space",
  "table",
  "early",
  "trees",
  "short",
  "hands",
  "state",
  "black",
  "shown",
  "stood",
  "front",
  "voice",
  "kinds",
  "makes",
  "comes",
  "close",
  "power",
  "lived",
  "vowel",
  "taken",
  "built",
  "heart",
  "ready",
  "quite",
  "class",
  "woman",
  "women",
  "queen",
  "horse",
  "shows",
  "piece",
  "green",
  "stand",
  "birds",
  "start",
  "river",
  "tried",
  "least",
  "field",
  "whose",
  "girls",
  "leave",
  "added",
  "color",
  "third",
  "hours",
  "moved",
  "plant",
  "doing",
  "names",
  "forms",
  "heavy",
  "ideas",
  "cried",
  "check",
  "floor",
  "begin",
  "woman",
  "alone",
  "plane",
  "spell",
  "watch",
  "carry",
  "wrote",
  "clear",
  "named",
  "books",
  "child",
  "glass",
  "human",
  "takes",
  "party",
  "build",
  "seems",
  "blood",
  "sides",
  "seven",
  "mouth",
  "solve",
  "north",
  "value",
  "death",
  "maybe",
  "happy",
  "tells",
  "gives",
  "looks",
  "shape",
  "lives",
  "steps",
  "areas",
  "senes",
  "sense",
  "speak",
  "force",
  "ocean",
  "speed",
  "metal",
  "south",
  "grass",
  "scale",
  "cells",
  "clamp",
  "swabs",
  "wussy",
  "swift",
  "swine",
  "swiss",
  "swigs",
  "swims",
  "twice",
  "magic"
];

export default class WordleExercise extends VisualExercise {
  protected get slug() {
    return "wordle";
  }

  // Row states: up to 6 rows, each with 5 letter states
  rowStates: LetterState[][] = [];
  private targetWord: string = "";

  constructor() {
    super();
  }

  availableFunctions: ExternalFunction[] = [];

  getState() {
    return {};
  }

  // --- Setup methods (called from scenario setup) ---

  public setTargetWord(word: string) {
    this.targetWord = word;
  }

  public statesForRow(idx: number): LetterState[] {
    return this.rowStates[idx] ?? [];
  }

  // --- Exercise functions (provided to student code) ---

  protected colorRow(_executionCtx: ExecutionContext, rowIdx: Shared.JikiObject, states: Shared.JikiObject) {
    if (!isNumber(rowIdx) || !isList(states)) return;
    const stateValues = states.value.map((s: Shared.JikiObject) => {
      if (isString(s)) return s.value as LetterState;
      return "absent" as LetterState;
    });
    this.rowStates[rowIdx.value - 1] = stateValues;
  }

  protected addWord(
    _executionCtx: ExecutionContext,
    rowIdx: Shared.JikiObject,
    _word: Shared.JikiObject,
    states: Shared.JikiObject
  ) {
    if (!isNumber(rowIdx) || !isList(states)) return;
    const stateValues = states.value.map((s: Shared.JikiObject) => {
      if (isString(s)) return s.value as LetterState;
      return "absent" as LetterState;
    });
    this.rowStates[rowIdx.value - 1] = stateValues;
  }

  protected getTargetWord(_executionCtx: ExecutionContext): string {
    return this.targetWord;
  }

  protected getCommonWords(_executionCtx: ExecutionContext): string[] {
    return [...COMMON_WORDS];
  }
}
