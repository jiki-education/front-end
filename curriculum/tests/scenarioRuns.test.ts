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
});
