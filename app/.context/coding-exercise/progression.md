# Progression Scoring

Every exercise carries a hidden **progression calculator**: a per-run score that measures how far a student has got, invisibly. It never affects visible pass/fail, task completion, or any UI. Its consumers are analytics (per-exercise funnels, struggle detection) and, later, in-session "stuck" detection that nudges students toward Ask Jiki.

Note on naming: this is a _calculator_, not a test. The exercise-side definition lives in `progressionMetrics.ts` files and the `progressionMetrics` field on the exercise definition (types `ProgressionMetrics`, `ProgressionMetric` in `@jiki/curriculum`).

## Core rule: observe, never re-execute

Progression scoring NEVER runs student code. Each Run click already executes the code once per visible scenario (plus isolated checks). The scenario runners attach their run artifacts to the test results they were already producing:

- `VisualTestResult.exercise`: the post-run exercise instance (halted state on runtime errors, so partial progress is still readable)
- `VisualTestResult.result`: the full `InterpretResult` (assertors, functionCallLog, frames)
- `VisualTestResult.isolatedRuns`: one `{ checkSlug?, passed, exercise, result }` per isolated-check re-run (required, empty array when the scenario has none)
- `IOTestResult.result`: the `InterpretResult` (optional for one domain reason only: the interpreter can throw without producing one)

After the scenario loop, `runTests` assembles these into a `ScenarioRuns` lookup (`createScenarioRuns` in `@jiki/curriculum`) and evaluates the exercise's progression against it (`evaluateProgression` in `components/coding-exercise/lib/test-runner/progression.ts`). Each run view carries a `bonus` flag (from the app's `bonusScenarioSlugs` helper), the single source for both the scenarios baseline and `allPassed()`. If a metric cannot be scored from the scenario runs, the fix is to fix the scenarios, not to add a hidden run.

## The scores object

Every run submits a keyed JSON object (stored as JSONB on `exercise_submissions` server-side):

```json
{ "v": 1, "score": 27, "metrics": { "scenarios": 10, "distance": 5, "used_loop": 10, "precision": 2 } }
```

- `"v"`: the progression version. Bump it whenever the metric list or a metric's meaning changes, so old rows stay interpretable. `0` when the exercise defines no custom progression.
- `"score"`: the precomputed total - the sum of every value in `metrics`.
- `"metrics"`: the keyed breakdown:
  - `"scenarios"`: the framework baseline, no authoring required. Fixed 10-point anchor: `round(passing / total * 10)` over non-bonus scenarios, where passing means status `pass` or `lint_warning`. The number of scenarios an exercise happens to have is irrelevant, solving it is always worth 10.
  - One key per authored **metric**: integer points, weighted (see below).

Syntax-error runs submit `{ "v": ..., "score": 0, "metrics": { ...all zeros } }` (the code never ran).

Keys inside `metrics` are the metric names verbatim, so names are snake_case identifiers. Names must be unique within an exercise, including against the reserved keys (`scenarios`, plus `v`/`score` to avoid confusion); a curriculum test enforces this. Keyed (not positional) storage is deliberate: exercises change regularly, keys stay interpretable.

## Metrics: weighted points against the 10-point anchor

```ts
{ name: "used_loop", maxScore: 1, points: 10, score: (runs, language) => ... }
```

- `score` returns a value in natural units (steps, cells, 0/1, a 0..1 ratio), clamped to `0..maxScore`.
- The submitted value is `round(points * clamped / maxScore)`: integer points.
- `points` is the metric's worth _relative to the fixed 10 for full correctness_. Golf's `used_loop` at 10 points says understanding the loop is worth as much as solving the exercise; `distance` at 5 says half. Natural range size and pedagogical importance are unrelated, so weights are explicit.
- A metric's `score` runs in its own try/catch (a throw scores 0).

Write a metric ONLY for what scenarios cannot measure:

- Partial progress inside a failing scenario (golf at 59/60 steps)
- Understanding-vs-grinding distinctions (used a loop vs 60 pasted lines)
- Post-solve refinement toward a bonus target (see `locMetric`)

Do NOT write metrics that re-derive scenario pass/fail (each run's `passed` is already on the `ScenarioRun`, and re-declaring expected values drifts).

## The progression stdlib

**Principle: an exercise's `progressionMetrics.ts` contains ONLY what is unique to that exercise. Anything two exercises would write identically belongs in the stdlib** (`curriculum/src/exercises/progressionStdlib.ts`).

- `locMetric({ target, points })`: for exercises with a line-count bonus scenario. Scores 0 until the exercise is solved (`runs.allPassed()`); from then on `clamp(target / countLinesOfCode(), 0, 1)` of `points` - points scale up as the code shrinks, full points at or under the target. even-or-odd uses `locMetric({ target: 6, points: 3 })`, matching its six-line bonus check. Exercises without a LOC bonus don't use it.

`ScenarioRuns` provides generic helpers so metrics stay declarative:

- `runs.bySlug(scenarioSlug)`: a scenario's primary (non-isolated) run
- `runs.bySlug(scenarioSlug, checkSlug)`: a named isolated-check run (give the check a `slug` when a metric needs it)
- `runs.allPassed()`: every non-bonus primary run passed (i.e. the exercise is solved; false when nothing ran)
- `runs.anyResult()`: the first available `InterpretResult` - code-shape assertors reflect the parsed code regardless of which run
- `runs.all`: every run, for anything bespoke

## Scenario coupling

Metrics reference runs by scenario slug (`runs.bySlug("roll-ball")`), and isolated-check runs by check slug (`runs.bySlug("responsive-snowman", "size-1")`). This coupling is intentional and loud: the curriculum test asserting the solution scores full marks catches drift when scenarios are renamed or restructured. Bump `v` when that happens.

Metrics reading scenarios with `randomSeed: true` must be seed-agnostic (measure properties, not exact positions).

## Persistence flow

1. On every Run click, the files POST fires immediately (unchanged, fire-and-forget). The create response includes the submission `uuid`.
2. When the run completes, the evaluated scores are PATCHed to `PATCH /internal/exercise_submissions/:uuid` (`updateExerciseSubmissionProgression` in `lib/api/exerciseSubmissions.ts`). Fire-and-forget, silent on failure (console.warn, never a toast), skipped when no uuid is available.
3. No cross-run state is kept client-side. The server holds every run's scores; high-water marks, stall detection, and trends are derived from the per-submission sequence at analysis time.

## Purpose and thresholds (background)

Production data (July 2026) showed raw attempt counts are useless as struggle signals (completer medians range 2 to 32 attempts per exercise) and that completion is flat across struggle bands; the damage from extended struggle shows up in fun ratings and 14-day retention, starting around 2x the exercise's median attempts. Progression scores exist to distinguish productive struggle (score still climbing) from wheel-spinning (score flat across runs), which raw attempt counts cannot see. In-session stuck detection and nudge UI are a later phase, deliberately not part of this mechanism.
