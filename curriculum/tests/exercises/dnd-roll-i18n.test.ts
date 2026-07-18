import { describe, it, expect, beforeEach, vi } from "vitest";
import type { ExecutionContext, Shared } from "@jiki/interpreters";
import DndRollExercise from "../../src/exercises/dnd-roll/Exercise";
import { scenarios } from "../../src/exercises/dnd-roll/scenarios";
import enDict from "../../src/exercises/dnd-roll/locales/en/translation.json";
import huDict from "../../src/exercises/dnd-roll/locales/hu/translation.json";

/**
 * Proves the logic-error seam end to end: the exercise resolves its own messages
 * through the injected single-locale dict and passes finished, localized strings
 * to `logicError`. The interpreter (mocked here) just relays them. The dict is
 * injected via `setMessages` (as the app does from R2) — the exercise never sees
 * a locale code.
 */

function createMockExecutionContext(): ExecutionContext {
  return {
    getCurrentTimeInMs: vi.fn(() => 0),
    fastForward: vi.fn(),
    logicError: vi.fn()
  } as unknown as ExecutionContext;
}

function num(value: number): Shared.Number {
  return { type: "number", value } as Shared.Number;
}

function str(value: string): Shared.String {
  return { type: "string", value } as Shared.String;
}

describe("dnd-roll logicError i18n", () => {
  let ctx: ExecutionContext;

  beforeEach(() => {
    ctx = createMockExecutionContext();
  });

  describe("en", () => {
    let exercise: DndRollExercise;

    beforeEach(() => {
      exercise = new DndRollExercise();
      exercise.setMessages(enDict);
    });

    it("interpolates the unknown-dice message with the requested sides", () => {
      // 7-sided die is not in DICE, so roll() raises the unknownDice logic error.
      (exercise as unknown as { roll: (c: ExecutionContext, s: Shared.JikiObject) => number }).roll(ctx, num(7));

      expect(ctx.logicError).toHaveBeenCalledWith("Sorry - Jiki doesn't have a 7 sided dice handy!");
    });

    it("resolves the announce type-guard message", () => {
      (exercise as unknown as { announce: (c: ExecutionContext, v: Shared.JikiObject) => void }).announce(
        ctx,
        str("nope")
      );

      expect(ctx.logicError).toHaveBeenCalledWith("You can only announce a number");
    });

    it("resolves the strike type-guard messages", () => {
      const strike = (
        exercise as unknown as {
          strike: (c: ExecutionContext, a: Shared.JikiObject, d: Shared.JikiObject) => void;
        }
      ).strike;

      strike.call(exercise, ctx, str("x"), num(5));
      expect(ctx.logicError).toHaveBeenCalledWith("Attack must be a number");

      strike.call(exercise, ctx, num(5), str("x"));
      expect(ctx.logicError).toHaveBeenCalledWith("Damage must be a number");
    });
  });

  describe("hu", () => {
    let exercise: DndRollExercise;

    beforeEach(() => {
      exercise = new DndRollExercise();
      exercise.setMessages(huDict);
    });

    it("resolves the unknown-dice message in Hungarian", () => {
      (exercise as unknown as { roll: (c: ExecutionContext, s: Shared.JikiObject) => number }).roll(ctx, num(7));

      expect(ctx.logicError).toHaveBeenCalledWith("Sajnálom, Jikinek nincs kéznél 7 oldalú dobókockája!");
    });

    it("resolves the announce type-guard message in Hungarian", () => {
      (exercise as unknown as { announce: (c: ExecutionContext, v: Shared.JikiObject) => void }).announce(
        ctx,
        str("nope")
      );

      expect(ctx.logicError).toHaveBeenCalledWith("Csak számot jelenthetsz be");
    });

    it("resolves the strike type-guard messages in Hungarian", () => {
      const strike = (
        exercise as unknown as {
          strike: (c: ExecutionContext, a: Shared.JikiObject, d: Shared.JikiObject) => void;
        }
      ).strike;

      strike.call(exercise, ctx, str("x"), num(5));
      expect(ctx.logicError).toHaveBeenCalledWith("A támadásnak számnak kell lennie");

      strike.call(exercise, ctx, num(5), str("x"));
      expect(ctx.logicError).toHaveBeenCalledWith("A sebzésnek számnak kell lennie");
    });
  });
});

/**
 * Proves the scenario `errorHtml` seam: `rollExpectations` builds each failure
 * message through `exercise.t(...)` against the injected dict, so the app's test
 * runner surfaces localized, interpolated check messages (not raw keys). We drive
 * the exercise to specific failing states and assert the resolved English/Hungarian
 * `errorHtml`.
 */
describe("dnd-roll scenario errorHtml i18n", () => {
  const scenario = scenarios[0];

  function makeExercise(dict: Record<string, unknown>): DndRollExercise {
    const exercise = new DndRollExercise();
    exercise.setMessages(dict);
    // Fix the reference rolls so interpolated expected values are deterministic:
    // attack (d20) = 15, base damage (d12) = 8, bonus (d10) = 3, total damage = 11.
    exercise.setupRolls({ 20: 15, 12: 8, 10: 3 });
    return exercise;
  }

  describe("en", () => {
    it("resolves the announcement-count check with the actual count interpolated", () => {
      const exercise = makeExercise(enDict);
      // No announcements made -> first expect (announcementCount) fails with got=0.
      const expects = scenario.expectations(exercise);

      expect(expects[0].pass).toBe(false);
      expect(expects[0].errorHtml).toBe("Expected 3 announcements but got 0. Make sure you announce each roll.");
    });

    it("resolves the wrong-attack check with both interpolated values", () => {
      const exercise = makeExercise(enDict);
      exercise.announcements = [15, 8, 3];
      exercise.struck = true;
      exercise.strikeAttack = 10;
      exercise.strikeDamage = 11;

      const wrongAttack = scenario.expectations(exercise).find((e) => !e.pass);
      expect(wrongAttack?.errorHtml).toBe(
        "Expected the attack to be 15 but got 10. Pass the attack roll to <code>strike()</code>."
      );
    });

    it("resolves the wrong-damage check with the sum breakdown interpolated", () => {
      const exercise = makeExercise(enDict);
      exercise.announcements = [15, 8, 3];
      exercise.struck = true;
      exercise.strikeAttack = 15;
      exercise.strikeDamage = 99;

      const wrongDamage = scenario.expectations(exercise).find((e) => !e.pass);
      expect(wrongDamage?.errorHtml).toBe(
        "Expected total damage to be 11 (8 + 3) but got 99. Add the base damage and bonus together."
      );
    });
  });

  describe("hu", () => {
    it("resolves the wrong-damage check in Hungarian", () => {
      const exercise = makeExercise(huDict);
      exercise.announcements = [15, 8, 3];
      exercise.struck = true;
      exercise.strikeAttack = 15;
      exercise.strikeDamage = 99;

      const wrongDamage = scenario.expectations(exercise).find((e) => !e.pass);
      expect(wrongDamage?.errorHtml).toBe(
        "Az összes sebzés 11 (8 + 3) kellett volna legyen, de 99 lett. Add össze az alap sebzést és a bónuszt."
      );
    });
  });
});
