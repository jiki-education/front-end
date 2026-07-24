# The Stuckometer: Progression Scoring, Evidence and Roadmap

This is the complete record of the progression/stuckometer project: why it exists, what the production data showed, every major design decision (including the rejected alternatives and why), what is built, and what comes next. The mechanism itself is specified in `progression.md`; this document is the surrounding picture.

## 1. Goal

Increase Ask Jiki trial by intervening at the moment of genuine struggle, without spoiling the pedagogical value of wrestling with an exercise. The driving metrics: ~70-80% of Premium signups use Ask Jiki first, but only ~5% of activated users ever try it. Ask Jiki is a passive tab; nobody browses tabs when frustrated. The moment of being stuck is when both usage intent and conversion intent peak, and (at project start) we did nothing with it: only 8% of high-struggle sessions opened a conversation.

## 2. Evidence (bastion analysis, July 2026)

All figures from production data via read-only `rails r` scripts (kept at `~/Desktop/stuck_analysis*.rb` and `morale_analysis.rb` on iHiD's machine).

**Raw attempt counts are useless as struggle signals.** Median completer attempts range from 2 (bouncer) to 32 (jumbled-house) per exercise; p90s hit 60-100 on drawing exercises. Running tests is the feedback loop itself. Any fixed attempt threshold fires on everyone or no one.

**Struggle does not cause quitting.** Completion is flat (94-97%) across low/mid/high attempt bands. Of ~3,600 abandoned sessions, nearly half quit at 0-1 attempts (a landing/onboarding problem, concentrated on the first exercise). The median engaged abandoner quits at or below the completer median attempts; the wall-hitters (p75 at 30, p90 at 71 attempts) quit far past it.

**The damage from extended struggle is fun and retention, not completion.** Fun ratings hold at ~3.6-3.7 through median struggle and collapse only in the tail (fun=1 raters had median 31 attempts; difficulty-5 raters average fun 2.73 vs 3.84 for difficulty-1). Fourteen-day retention falls monotonically with struggle depth (23.7% for <=1x median attempts down to 16.4% for 4x+). Short-term progression to the next exercise is unharmed (flat ~95%).

**Struggle drives Ask Jiki organically, but coverage is tiny.** Chat usage by struggle band: 0% (low), 1% (mid), 8% (high). About 17,700 high-struggle sessions never touched the tab: the target population.

**"Abandoned" needs a 14-day definition.** ~20-25% of sessions that look dead at 48h resurrect and complete. Completers almost never pause mid-exercise (only 2.4% ever sat silent 48h+), and the dataset was young enough that stricter cutoffs are right-censored.

**Completion ratings: the scale semantics matter.** Difficulty is "Too easy / Easy / Just right / Hard / Too hard" (3 is the ideal; both ends are complaints). Fun is an emoji scale where 1 is explicitly "Frustrating". Ratings are only collected at completion (survivorship built in).

**Ratings-based morale was evaluated and ruled OUT as a trigger/churn lever.** Forward lift looked promising (last fun=1: 8.1% next-exercise abandonment vs ~3% base; last difficulty=5: 45% next-exercise struggle). But case-control attribution killed it: 37.7% of in-exercise abandons happen with no rating history at all (2.6x controls); the union of every rating signal covers loss cohorts no better than controls (ratio 0.71 in-exercise, 1.08 for vanishing); and there is no erosion trajectory before vanishing (parallel drift for vanishers and continuers). Two residual, low-stakes uses survive: difficulty 4-5 strongly predicts next-exercise struggle (worth feeding Jiki's tone and possibly a nudge-threshold tweak), and a "bored" state (difficulty <= 2 and fun <= 3) has a 1.4x vanish lift that might inform future pacing features. Nothing else.

**The productive-struggle cohort is visible in data.** Students who rate "Hard" (not "Too hard") struggle more than anyone except the frustrated yet vanish least. Do not intervene on struggle alone; intervene on lack of progress.

## 3. Decisions and rejected alternatives

**Detect stuckness by score stall, not attempt counts.** Stuck = the progression score's high-water mark has not grown for X runs. Rejected: attempt-count gates calibrated on completer medians (survivorship-biased; roughly half of engaged abandoners quit before ever reaching the gate). Only a small engagement floor remains (~3 runs / 2 minutes before any signal can fire).

**Progression observes; it never executes.** Metrics evaluate against the scenario runs each Run click already performs (artifacts attached to the test results). Rejected in turn: per-metric dedicated hidden runs (cost, especially per-case IO runs), a single budgeted extra run, and an escape hatch for special setups. If a metric cannot be scored from scenario runs, the scenarios need fixing.

**One number, with a keyed breakdown.** The purpose is a high-water mark, so each run produces a single weighted score; the per-metric contributions ride along for diagnosis. Rejected: milestone indices (max-index vs prefix-rule ambiguity), boolean-only points (invisible partial progress, e.g. golf at 59/60 steps), raw unweighted vectors (no ranking of understanding over grinding), and a separate gauges concept (collapsed into metrics once weighting was settled).

**Weights are explicit and anchored.** Solving the exercise (all non-bonus scenarios) is always worth 10, normalised regardless of scenario count. Metric points are set relative to that anchor, so the headline concept (e.g. `used_loop` at 10) can outrank trial-and-error proximity (`distance` at 5). Natural range size and pedagogical importance are unrelated.

**Keyed JSONB, not positional encoding.** Exercises change regularly; keys stay interpretable, and `v` guards semantic changes.

**Two-request persistence.** The code files POST fires immediately (student submissions are never delayed or blocked by scoring); the evaluated scores PATCH the created submission afterwards. Rejected: bundling scores into the create (delayed the upload behind the run) and a deferred-promise bridge (needless complexity).

**No client-side cross-run state yet.** The server holds every run's scores; stall detection and calibration derive from the submission sequence. Trigger-phase state gets designed when triggers ship.

**Stdlib over bespoke.** An exercise's `progressionMetrics.ts` contains only what is unique to that exercise; shared logic lives in the progression stdlib and `ScenarioRuns` helpers. See `progression.md`.

## 4. What is built (this branch, PR #864)

- The full mechanism: curriculum types, evaluator, runner artifact plumbing, submission decoration. Spec: `progression.md`.
- `progressionMetrics` on **every published exercise** (levels 1-10 plus hello, two-fer, raindrops), authored per family: path-progress and loop-leverage (maze, space-invaders), components-in-place (drawing), value-independent derivation checks (relational), distinct-state gradients (animation), uses-the-return-value (functions-that-return-things), operator/engagement signals (conditionals), concept signals (IO). Each has a test: solution scores full marks, stub ~0, meaningful intermediates score partial credit.
- `/audit-exercise` Check 12 enforces presence and quality for future exercises.

**API side (jiki/api, separate PRs):** the submission create response returns the submission `uuid`; `PATCH /internal/exercise_submissions/:uuid` accepts `progression_scores` into a JSONB column. Malformed scores must never block a submission.

## 5. What comes next (the trigger phase, deliberately not built yet)

1. **Accumulate.** Scores flow with every submission once this branch and the API changes deploy.
2. **Calibrate X from abandoners.** Compare completers' longest mid-exercise score stalls against abandoners' final stalls, per exercise; pick the stall length that discriminates. Until then a global X of ~5-6 runs is the placeholder. (Calibrate on the population we are trying to help, not on survivors.)
3. **Client trigger state**, feature-flagged, telemetry-only first: session best score and runs-since-growth in the orchestrator, logging "would have fired" so firing rates can be sanity-checked before anything is shown.
4. **The nudge ladder**, A/B tested: first a subtle glow on the "Talk to Jiki" tab at stall; then a dismissible inline line in the failing test result ("Stuck on this one? Ask Jiki, it's free"). One inline nudge per exercise, ever; everything resets when the score grows or the student opens chat themselves; never a modal; never auto-open; nothing before the engagement floor. A resurrection variant: reopening an exercise left failing 24h+ ago offers "want Jiki to look at where you left off?".
5. **Pre-loaded chat context.** Opening via the nudge hands Jiki the failing scenario, the last error, and the metric breakdown ("has distance, missing used_loop"), so it opens with a diagnosis rather than "how can I help?".
6. **Measure.** Primary: Ask Jiki trial rate in stalled sessions (baseline 8%). Guardrails: fun/difficulty ratings and time-to-complete on nudged vs control. Completion rate is expected not to move and is not the goal.

Separately ticketed, not this project: the zero-attempt bounce on the first exercise (the single largest abandonment pool; an onboarding problem no stuck-detection can reach).
