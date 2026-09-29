# SQL Track Plan (WIP)

> **Status:** Early design exploration. Nothing here is committed to. This document captures the investigation into what a Jiki SQL track could look like, covering pedagogy, exercise design, and the technical shape across the curriculum, interpreters, and app packages.

## The core insight

What makes the existing track work is that **students watch their code execute**. The timeline scrubber, the frame-by-frame animation, the visual world that reacts. The JS exercises are never "print the answer". They are "make something happen and see it".

SQL has an equivalent magic trick that almost nobody exploits: **animating what the database does with your query**. Rows are physical things. A `WHERE` clause is a filter you can watch rows fail. A `JOIN` is matchmaking. A `GROUP BY` is sorting cards into piles that then collapse into one card each. Every stage of a query is an animation, and it maps directly onto the existing timeline/frames architecture.

That is the track's identity: not "write SQL, see a results grid" (every SQL tutorial ever), but **"write SQL and watch the database think"**.

This also solves SQL's single biggest teaching problem in one move: logical execution order. Students eternally struggle with why `FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT` runs in that order when it is written in a different order. If scrubbing the timeline literally shows `FROM` loading the rows first and `SELECT` picking columns near the _end_, that misconception never forms.

## The pedagogical shift: lean into it, don't hide it

The JS track teaches imperative thinking: tell Jiki what to do, step by step. SQL is declarative: describe what you want. That is a genuinely different mental model and it should be the explicit narrative of the opening video. The framing writes itself from existing exercises:

> "In Coding Fundamentals you were the bouncer. You stood at the door and ran your `if` statement on each guest, one at a time. Tonight 500 people are coming. You can't stand at the door anymore. You need to hand the database the guest list and _describe who gets in_."

Continuity with the existing Jiki universe is the track's biggest asset. The student already knows the bouncer, the party, the golf course, Spotify, the space invaders, the wordle solver. Now they meet the same worlds _at scale_, which is honestly the true story of why SQL exists. Nearly every exercise below is a sequel to one they solved imperatively, which quietly delivers the "here's why declarative wins for data" argument through experience rather than assertion.

The test applied to every exercise idea: does it use SQL to answer a question someone would actually want answered, and is there something to watch? Explicitly avoided:

- Anything where SQL is a puppet-string for imperative behaviour ("SELECT 5 to move a character 5 steps").
- Anything that is a spreadsheet with no world attached (employees/salaries, the eternally boring default). Every table below is a _place_ with inhabitants that render, because that is what the animation system wants anyway.

## Level progression and exercise catalogue

### Level: selecting-data (`SELECT`, `WHERE`, `ORDER BY`, `LIMIT`)

- **bouncer-at-scale** — the anchor exercise. 500 guest avatars queue outside the club. `SELECT * FROM guests WHERE age >= 18` and the bouncer waves through the matching avatars while the rest slink off. Later scenarios add the wristband and dress-code rules from the JS track as compound `WHERE` clauses. Same world, same rules, new superpower.
- **wordle-solver-sql** — a `words` table of five-letter words. Each Wordle clue becomes a `WHERE` condition: green letter = `SUBSTR(word, 3, 1) = 'a'`, grey letter = `word NOT LIKE '%e%'`. Each scenario is a game state; the student narrows 5,000 words down to one, and the animation shows the wall of words thinning with each condition. A direct sequel to the JS wordle exercises, and it is _actually how you would cheat at Wordle with SQL_.
- **space-invaders-leaderboard** — the arcade machine's high-score table. `ORDER BY score DESC LIMIT 10` builds the leaderboard on screen, rows physically re-sorting. Sneaks in the "ORDER BY runs before LIMIT" lesson.

### Level: asking-questions (aggregates: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`)

- **gold-panning-ledger** — a season of gold-panning results. Total haul, best day, average per day. Rows pour into a single collapsing card. Teaches that an aggregate eats the whole table and returns one row.
- **spotify-stats** — the student's tracks table. Longest song, total listening time, how many artists. Sets up the grouping level.
- **stock-market-analyst** — continuation of the stock-market exercise: `MIN`/`MAX`/`AVG` over price history, "what was the best day". (Window functions are out of scope here; simple aggregates over date ranges work.)

### Level: grouping (`GROUP BY`, `HAVING`)

- **spotify-playlists** — songs per artist, artists with more than three songs (`HAVING`), total duration per playlist. The bucket-sort animation earns its keep here: cards fly into artist piles, each pile squashes into a summary card.
- **matching-socks-sql** — sequel to matching-socks: `GROUP BY colour, pattern HAVING COUNT(*) % 2 = 1` finds the odd socks. Visual: socks pair up in their buckets, the lonely ones stay on screen.
- **niche-named-party** — count guests per name, find duplicate-name collisions for the name-tag printer.

### Level: joining (`JOIN`, foreign keys, `LEFT JOIN`)

- **seating-plan** — guests, tables, RSVPs. JOIN guests to their assigned tables and watch avatars walk to their seats. `LEFT JOIN` reveals the ghosts: guests with no seat, and (reversed) empty seats. LEFT JOIN as "keep the lonely rows" is very animatable.
- **owners-bouquets-shop** — the florist from the JS track grows into a real shop: orders, order_items, flowers, stock. Which orders can't be fulfilled? JOIN order lines to inventory and watch bouquets assemble or fail.
- **spotify-full** — tracks, artists, albums, plays as separate tables. "Most played artist this month" needs two joins. This is the moment SQL stops being a fancy filter and becomes a _question-answering machine_.

### Level: changing-data (`INSERT`, `UPDATE`, `DELETE`)

- **chop-shop-till** — run the shop: sales come in (`INSERT`), stock decrements (`UPDATE`), discontinued items go (`DELETE` with `WHERE`). The shelf visual updates live.
- **the-forgotten-where** — a deliberate set-piece lesson. The student is asked to give one loyal customer a discount, and a scenario engineers them (or Jiki, in the video) into running `UPDATE customers SET discount = 50` without a `WHERE`. Every row on screen flashes and changes at once. Horror. Then teach transactions and `ROLLBACK` as the undo. Every working developer has this scar; giving students the disaster in a sandbox, animated, is both hilarious and the single most valuable safety lesson in SQL.
- **fix-the-save-game** — a corrupted game save (the student's own space-invaders profile): wrong scores, duplicated rows, a mis-spelled name. Surgical `UPDATE`s and `DELETE`s to repair it. Data-cleaning framed as rescue.

### Level: everything (capstone arc)

- **the-after-party-mystery** — a multi-lesson detective story in the style of SQL Murder Mystery (a format with a proven track record, rebuilt in the Jiki universe with Jiki's characters). Something went wrong at the after-party: the trophy is missing, or someone ate the winner's cake. Witnesses table, door-log table, alibis, phone records. Each lesson unlocks new tables; every technique from the track gets used because the _story_ demands it, not because the exercise says "now use a JOIN". Interviewing a witness = querying their statement rows. The final accusation is a query that returns exactly one row, and the reveal animates. This is the track's tic-tac-toe/caesar-cipher equivalent and the thing students would tell their friends about.

### Bonus concept: NULL and three-valued logic

SQL's genuinely weird corner has a natural home as a bouncer scenario: some guests have unknown ages. `WHERE age >= 18` doesn't let them in, but neither does `WHERE age < 18` keep them out of the "under-18" list. The avatar literally standing in limbo between the two groups is the best available explanation of NULL.

## Technical shape

### Interpreter engine (from the interpreters-side analysis)

The wiring changes across the three packages are mechanical: a SQL branch in roughly ten switch/union sites (`curriculum/src/types.ts` `Language` union is the source of truth; then `getInterpreter`, `editorExtensions` plus a `@codemirror/lang-sql` dependency, the language picker UI, and a handful of hardcoded literal unions). None of that is hard.

Building the engine in-house rather than embedding sql.js/SQLite-WASM is the right call, and the reason is the whole value proposition: a real engine is a black box that returns results, not _frames_. The Jiki engine needs frame-by-frame introspection of the logical pipeline (this table loaded, this row rejected by WHERE, these rows grouped), which means `@jiki/interpreters` grows a SQL member with a scanner/parser/executor and a tiny relational engine. No query planner, just honest logical execution. Optionally cross-check results against real SQLite in tests for correctness parity, the same way interpreters cross-validate today.

Estimated effort by layer (from the interpreters analysis):

| Layer                                                                   | Effort                                        | Notes                                            |
| ----------------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------ |
| Interpreter engine (scanner/parser/executor + tiny relational engine)   | Large (~4–5k LOC, ~150 tests, well-templated) | The bulk of the work                             |
| Friendly errors + i18n                                                  | Medium                                        | Highest pedagogical payoff, infra already exists |
| App wiring (switches, CodeMirror SQL mode)                              | Small                                         | Frame layer is already agnostic                  |
| App: result-set table render mode                                       | Medium                                        | The one genuinely new UI piece                   |
| Curriculum: new query exercise type, seed-table fixtures, SQL assertors | Medium–Large                                  | The real conceptual work, not mechanical         |

### The two genuine mismatches with the current stack

1. **The exercise/execution contract assumes imperative code.** The scenario runner drives exercises via `interpret(studentCode)` and especially `evaluateFunction(code, ctx, functionName, ...args)`. SQL has no functions. A SQL exercise is "here's a database, write a query, we check the result set". That is a new exercise type in the curriculum, with seed tables replacing `getExternalFunctions`/`getExternalClasses` as the input a scenario provides, and result-set assertions replacing the imperative assertor bag.
2. **`InterpretResult.assertors` is a hardcoded JS-centric interface** in `shared/interfaces.ts`. It needs widening so SQL doesn't stub out a dozen meaningless imperative assertions. Preferred shape: make `InterpretResult` generic over an assertor interface per language family, rather than merely relaxing the union, because the SQL assertor set has different _semantics_ (see below), not just different names.

### Curriculum side: two exercise types, not one

The result-set table must not become the identity of the track. "Query in, result-set out" is the correct execution contract but the wrong headline; the thing that justifies a custom engine is that frames let the _world_ react. So the new exercise type splits the same way the curriculum already splits:

- **`QueryExercise`** — result-set in, result-set out. The analogue of IO exercises. Cheap to author, right for drill-style exercises.
- **`VisualQueryExercise`** — where the interesting exercises live. The result-set table render mode is the floor, not the feature.

### The missing contract piece: who drives the animations?

In the current model the _exercise_ produces animations in response to the student's code calling external functions. SQL has no function calls, so that channel is gone. The engine's phase-per-frame pipeline provides the replacement: **the exercise subscribes to execution events instead of exposing functions.** Where an imperative exercise has `availableFunctions`, a visual SQL exercise has seed tables going in and hooks coming back:

- `onRowScanned(row, ctx)`
- `onRowFiltered(row, kept, ctx)`
- `onGroupFormed(key, rows, ctx)`
- `onRowsJoined(left, right, ctx)`
- `onResultEmitted(row, ctx)`

Each hook receives the execution context for `getCurrentTimeInMs()` exactly like today. The exercise pushes animations from those hooks and the whole timeline/scrubbing system works unchanged.

**This event/hook interface between executor and exercise is the seam both packages have to agree on, and the only genuinely novel contract in the whole build.** It should be designed before the engine's executor is written, not after.

### Scenarios: different seed data is the anti-hardcoding mechanism

`evaluateFunction(code, ctx, fn, ...args)` does have a SQL analogue: running the same query against a _different database_ is exactly "call the function with different args". A student who hardcodes `SELECT 'Aron'` passes scenario one and fails the scenario where a different guest is the answer. This is the same trick `isolatedChecks`/`secretConstants` play for responsiveness in relational-traffic-lights, just with seed rows instead of injected constants.

So the scenario shape barely changes: `setup` seeds tables instead of positioning a ball, expectations compare result sets. One authoring rule to write down from day one: **every SQL scenario ships at least two seed datasets, one visible, one hidden.**

### SQL assertors

Same principle as the existing rule: the engine has the AST, curriculum never regexes the query string. Beyond the obvious (`assertResultSetEquals`, `assertUsesWhere`, `assertNoSelectStar`, `assertJoins`), the set the curriculum will lean on hard:

- `assertOrdered` vs set-equality comparison — whether row order matters must be per-scenario, otherwise every pre-ORDER-BY exercise is flaky.
- `assertMaxJoins(n)`
- `assertNoSubqueries` — level-gating in assertion form.
- `assertUsesAlias`

### Frame granularity at scale

The pitch exercises deliberately use big tables (500 guests, 5,000 Wordle words) because scale is SQL's raison d'être. But row-per-frame at 500 rows is an unwatchable timeline. The engine needs a granularity dial:

- Row-level frames below some threshold (~20 rows) for the teaching moments.
- Batched phase-level frames above it.
- Ideally "row-level for rows the exercise marks interesting".

Wordle-solver is the stress test: the wall of 5,000 words must visibly _thin_ per WHERE clause without emitting 5,000 frames. This affects the frame-emission design, so it belongs in the standalone prototype, not discovered later.

### Levels

The level system's allowed-AST-nodes concept transfers verbatim. Level 1 permits `SELECT`/`FROM`/`WHERE` nodes only; `JOIN` doesn't parse until the joining level, with a friendly educational error, exactly like now. This should be stated as a requirement on the engine's parser: node restrictions in, educational error out.

### Wiring cautions

- Adding `"sql"` to the `Language` union must not imply every existing exercise grows a `stub.sql`. Language support needs to be declarable per exercise (or per exercise type) rather than assumed universal.
- The frame layer in the app is already language-agnostic; the result-set table panel is the one genuinely new UI piece.

## Recommended first slice

Prototype the engine standalone, but make the vertical slice a _named exercise_, not an abstract feature set. Build **bouncer-at-scale** end to end:

1. Seed table of guests.
2. `SELECT * FROM guests WHERE age >= 18 ORDER BY name` through the phase-per-frame pipeline.
3. Avatars reacting via the event hooks.
4. Result-set panel rendering.
5. Two seed datasets (one hidden) with result-set assertions.

That forces every contract question (events, granularity, assertors, scenario shape) to get answered by a concrete demo, and it is simultaneously the demo that sells the track. Read-only `SELECT` with `WHERE`/`ORDER BY`/`LIMIT` is a complete, teachable v1 and lines up exactly with the proposed `selecting-data` level, so the curriculum and engine v1 align with no wasted work.

## Open questions

- **Track placement**: SQL-after-JS is the natural sequencing (students have variables, conditionals, and data-shape intuition, so the track can move fast), and the sequel-exercise structure depends on it. But it means the track leans on Coding Fundamentals graduates rather than standing alone. Probably the right trade; decide deliberately.
- **Dialect**: presumably a SQLite-flavoured subset (matches the cross-validation story), but confirm before the parser exists.
- **How the after-party mystery is structured** as lessons/projects (multi-lesson arc is new territory for the exercise model).
- **Whether `QueryExercise` and `VisualQueryExercise` share a base**, and where the seed-data fixtures live relative to `scenarios.ts`.
