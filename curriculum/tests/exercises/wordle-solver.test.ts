import { describe, it, expect } from "vitest";
import { runExerciseTests } from "../runScenarioTest";
import solverExercise from "../../src/exercises/wordle-solver";
import messages from "../../src/exercises/wordle-solver/messages.json";
import { createTranslator } from "../../src/i18n/translator";

// A solver that never learns from grey letters: it only honours green squares,
// so its third guess in the "sense" scenario is "where", which reuses the "h"
// its first guess had already ruled out.
const ignoresAbsent = `
let squares = ["", "", "", "", ""]

function fits(word) {
  for (let idx = 0; idx < 5; idx++) {
    if (squares[idx] !== "" && word[idx] !== squares[idx]) {
      return false
    }
  }
  return true
}

function chooseWord(used) {
  for (const candidate of commonWords()) {
    if (fits(candidate) && !used.includes(candidate)) {
      return candidate
    }
  }
}

function solveWordle() {
  let used = []
  for (let row = 1; row <= 6; row++) {
    let word = chooseWord(used)
    used.push(word)
    let states = guess(word)
    let won = true
    for (let idx = 0; idx < 5; idx++) {
      if (states[idx] === "correct") {
        squares[idx] = word[idx]
      } else {
        won = false
      }
    }
    if (won) {
      break
    }
  }
}
`;

describe("wordle-solver", () => {
  it("javascript reference solution passes every scenario", async () => {
    const slug = "wordle-solver";
    const solution = (await import(`../../src/exercises/${slug}/solution.javascript?raw`)).default;
    const results = runExerciseTests(solverExercise, solution, "javascript");
    expect(results.length).toBe(9);
    for (const result of results) {
      expect(result.status, JSON.stringify(result.expects, null, 2)).toBe("pass");
    }
  });

  it("explains the wrong word in terms of what earlier guesses had shown", () => {
    const scenario = solverExercise.scenarios.filter((s) => s.slug === "present-4");
    const [result] = runExerciseTests({ ...solverExercise, scenarios: scenario }, ignoresAbsent, "javascript");
    expect(result.status).toBe("fail");
    // The harness runs without a message dict, so the raw key comes back.
    const failure = result.expects.find((e) => !e.pass);
    expect(failure?.errorHtml).toBe("checks.guessUsesAbsent");

    const t = createTranslator(messages);
    expect(t("checks.guessUsesAbsent", { row: 3, word: "WHERE", letter: "H" })).toBe(
      'Guess 3 was "WHERE", but an earlier guess had already shown that "H" isn\'t in the word.'
    );
  });
});
