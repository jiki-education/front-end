import { describe, expect, it } from "vitest";
import { createScenarioRuns } from "../src/exercises/scenarioRuns";
import type { ScenarioRun } from "../src/exercises/types";

function run(overrides: Partial<ScenarioRun>): ScenarioRun {
  return {
    scenarioSlug: "shape",
    passed: true,
    result: null,
    ...overrides
  };
}

describe("createScenarioRuns", () => {
  const primary = run({ scenarioSlug: "shape" });
  const namedIsolated = run({ scenarioSlug: "shape", isolated: true, checkSlug: "size-1", passed: false });
  const unnamedIsolated = run({ scenarioSlug: "shape", isolated: true });
  const other = run({ scenarioSlug: "other" });
  const runs = createScenarioRuns([namedIsolated, primary, unnamedIsolated, other]);

  it("exposes every run via all", () => {
    expect(runs.all).toEqual([namedIsolated, primary, unnamedIsolated, other]);
  });

  it("bySlug(scenarioSlug) returns the primary run, never an isolated one", () => {
    expect(runs.bySlug("shape")).toBe(primary);
    expect(runs.bySlug("other")).toBe(other);
  });

  it("bySlug(scenarioSlug, checkSlug) returns the named isolated run", () => {
    expect(runs.bySlug("shape", "size-1")).toBe(namedIsolated);
  });

  it("returns undefined for unknown scenario or check slugs", () => {
    expect(runs.bySlug("missing")).toBeUndefined();
    expect(runs.bySlug("shape", "size-5")).toBeUndefined();
    expect(runs.bySlug("other", "size-1")).toBeUndefined();
  });

  describe("allPassed", () => {
    it("is true when every non-bonus primary run passed", () => {
      expect(
        createScenarioRuns([run({ passed: true }), run({ scenarioSlug: "other", passed: true })]).allPassed()
      ).toBe(true);
    });

    it("is false when any non-bonus primary run failed", () => {
      expect(
        createScenarioRuns([run({ passed: true }), run({ scenarioSlug: "other", passed: false })]).allPassed()
      ).toBe(false);
    });

    it("ignores bonus runs and isolated runs", () => {
      const collection = createScenarioRuns([
        run({ passed: true }),
        run({ scenarioSlug: "bonus-1", bonus: true, passed: false }),
        run({ scenarioSlug: "shape", isolated: true, passed: false })
      ]);

      expect(collection.allPassed()).toBe(true);
    });

    it("is false when there are no non-bonus primary runs", () => {
      expect(createScenarioRuns([]).allPassed()).toBe(false);
      expect(createScenarioRuns([run({ bonus: true, passed: true })]).allPassed()).toBe(false);
    });
  });

  describe("anyResult", () => {
    it("returns the first available InterpretResult", () => {
      const result = { frames: [] } as unknown as NonNullable<ScenarioRun["result"]>;
      const collection = createScenarioRuns([run({ result: null }), run({ scenarioSlug: "other", result })]);

      expect(collection.anyResult()).toBe(result);
    });

    it("returns undefined when no run produced a result", () => {
      expect(createScenarioRuns([run({ result: null })]).anyResult()).toBeUndefined();
    });
  });
});
