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

const STATE_COLORS: Record<LetterState, string> = {
  correct: "rgb(106, 170, 100)",
  present: "rgb(201, 180, 88)",
  absent: "rgb(120, 124, 126)"
};

const NUM_ROWS = 6;
const NUM_COLS = 5;

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

  rowStates: LetterState[][] = [];
  private targetWord: string = "";
  private guessRows: HTMLElement[] = [];

  constructor() {
    super();
    this.view.classList.add("exercise-wordle");
    this.populateView();
  }

  availableFunctions: ExternalFunction[] = [];

  getState() {
    return {};
  }

  protected populateView() {
    const container = document.createElement("div");
    container.classList.add("container");
    this.view.appendChild(container);

    const board = document.createElement("div");
    board.classList.add("board");
    container.appendChild(board);

    for (let row = 0; row < NUM_ROWS; row++) {
      const rowEl = document.createElement("div");
      rowEl.classList.add("guess");
      for (let col = 0; col < NUM_COLS; col++) {
        const letter = document.createElement("div");
        letter.classList.add("letter", `letter-${row}-${col}`);
        letter.style.color = "rgba(255,255,255,0)";
        letter.style.backgroundColor = "rgb(211,211,211)";
        rowEl.appendChild(letter);
      }
      board.appendChild(rowEl);
      this.guessRows.push(rowEl);
    }
  }

  // --- Setup methods (called from scenario setup) ---

  public setTargetWord(word: string) {
    this.targetWord = word;
  }

  public statesForRow(idx: number): LetterState[] {
    return this.rowStates[idx] ?? [];
  }

  // Pre-fill rows with guess letters during scenario setup (no animation).
  public drawGuesses(words: string[]) {
    words.forEach((word, idx) => this.drawGuessImmediate(idx, word));
  }

  public drawGuess(rowIdx: number, word: string) {
    this.drawGuessImmediate(rowIdx, word);
  }

  private drawGuessImmediate(rowIdx: number, word: string) {
    const row = this.guessRows[rowIdx];
    const letters = row.getElementsByClassName("letter");
    for (let i = 0; i < NUM_COLS; i++) {
      const letter = letters[i] as HTMLElement;
      letter.textContent = (word[i] ?? "").toLowerCase();
      letter.style.color = "rgba(255,255,255,1)";
    }
  }

  // --- Exercise functions (provided to student code) ---

  protected colorRow(executionCtx: ExecutionContext, rowIdx: Shared.JikiObject, states: Shared.JikiObject) {
    if (!isNumber(rowIdx) || !isList(states)) return;
    const stateValues = states.value.map((s: Shared.JikiObject) => {
      if (isString(s)) return s.value as LetterState;
      return "absent" as LetterState;
    });
    const idx = rowIdx.value - 1;
    this.rowStates[idx] = stateValues;
    this.animateColorRow(executionCtx, idx, stateValues);
  }

  protected addWord(
    executionCtx: ExecutionContext,
    rowIdx: Shared.JikiObject,
    word: Shared.JikiObject,
    states: Shared.JikiObject
  ) {
    if (!isNumber(rowIdx) || !isList(states)) return;
    const wordValue = isString(word) ? word.value : "";
    const stateValues = states.value.map((s: Shared.JikiObject) => {
      if (isString(s)) return s.value as LetterState;
      return "absent" as LetterState;
    });
    const idx = rowIdx.value - 1;
    this.rowStates[idx] = stateValues;
    this.animateDrawGuess(executionCtx, idx, wordValue);
    this.animateColorRow(executionCtx, idx, stateValues);
  }

  protected getTargetWord(_executionCtx: ExecutionContext): string {
    return this.targetWord;
  }

  protected getCommonWords(_executionCtx: ExecutionContext): string[] {
    return [...COMMON_WORDS];
  }

  private animateDrawGuess(executionCtx: ExecutionContext, rowIdx: number, word: string) {
    for (let col = 0; col < NUM_COLS; col++) {
      const char = (word[col] ?? "").toLowerCase();
      this.animations.push({
        targets: `#${this.view.id} .letter-${rowIdx}-${col}`,
        offset: executionCtx.getCurrentTimeInMs(),
        duration: 1,
        transformations: {
          innerHTML: char,
          color: "rgba(255,255,255,1)"
        }
      });
    }
    executionCtx.fastForward(1);
  }

  private animateColorRow(executionCtx: ExecutionContext, rowIdx: number, states: LetterState[]) {
    states.forEach((state, col) => {
      if (col >= NUM_COLS) return;
      const backgroundColor = STATE_COLORS[state];
      this.animations.push({
        targets: `#${this.view.id} .letter-${rowIdx}-${col}`,
        offset: executionCtx.getCurrentTimeInMs(),
        duration: 1,
        transformations: {
          backgroundColor,
          color: "rgb(255,255,255)"
        }
      });
    });
    executionCtx.fastForward(1);
  }
}
