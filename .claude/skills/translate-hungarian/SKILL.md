---
name: translate-hungarian
description: Translate Jiki content into Hungarian (curriculum concepts and exercise instructions, content blog posts and articles, or any en.md → hu.md), following the project's Hungarian translation guide and glossary. Use when asked to translate something to Hungarian, produce a hu.md, or extend Hungarian coverage.
argument-hint: [concept-slug or path to en.md]
disable-model-invocation: false
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# Translate to Hungarian

You are translating Jiki content into Hungarian. **All translation rules, the glossary, and the
style/emphasis guidance live in one living document — you do not carry them in this skill.** Read
that document first, every time, and follow it exactly.

**Target**: $ARGUMENTS

---

## Phase 1: Load the guide (REQUIRED — do this first, every time)

Read the full guide before translating anything:

- **`docs/i18n-hungarian.md`** (repo root)

This is the single source of truth. It is actively refined, so **re-read it each run** rather than
relying on memory. It contains, among other things:

- the terminology system (real code / stay-English terms / Hungarian-with-gloss jargon / plain words),
- the glossary table (with the `Clarify?` column),
- §2 information-structure rules (focus-before-verb, `ami`/relative-clause linking, correlative
  pronouns for `hogy`-clauses),
- the punctuation rule (never an em-dash),
- the mechanics of what to translate vs. copy verbatim.

If anything in this skill ever conflicts with the guide, **the guide wins.**

## Phase 2: Locate the source

- A **concept**: `curriculum/src/concepts/<slug>/en.md` → produce `hu.md` beside it.
- An **exercise instruction**: `curriculum/src/exercises/<slug>/instructions/en.md` → produce
  `hu.md` beside it.
- A **blog post / article**: `content/src/posts/{blog,articles}/<slug>/en.md` → produce `hu.md`
  beside it. (Note: `content` has its own `/translate` command for blog/article; prefer this skill
  when you want the shared Hungarian guide applied consistently.)
- Or an explicit `en.md` path given as the argument.

All paths are relative to the repo root (`front-end/`).

Read the English source in full. If a `hu.md` already exists, treat this as a revision pass, not a
fresh translation.

## Phase 3: Translate

Follow the guide. In brief (the guide is authoritative):

- Translate only the human-language fields: frontmatter `title`/`description` **values**, prose,
  and `<img>` `alt` text. Copy everything else verbatim — frontmatter keys, fenced code blocks,
  inline backticked code, and all `<img>` attributes except `alt`.
- Apply the terminology system and glossary. Gloss each term **once**, at first use, per the
  `Clarify?` policy — never repeat the gloss.
- **Re-pace for Hungarian** (§2). Do not map English clause order; put the emphasis in the
  Hungarian focus position. Read each paragraph aloud in your head and check the stress lands right.
- **Never use an em-dash.**

## Phase 4: Self-check before finishing

Verify against the guide's anti-patterns:

- [ ] No em-dash (`—`) anywhere in the output.
- [ ] Every glossed term is glossed exactly once (first occurrence only).
- [ ] No clarifier on ordinary words — only on genuine programming jargon.
- [ ] Stay-English terms (string, scope, Boolean) kept English, Hungarian name given once.
- [ ] Descriptive clauses linked with `ami`/`amely`/`aki`; `hogy`-clauses set up with a
      correlative pronoun (`azt`/`annyit`/…), not a bare colon.
- [ ] Code blocks, inline code, and `<img>` attributes (except `alt`) are byte-identical to `en.md`.
- [ ] Focus/emphasis checked paragraph by paragraph.

## Phase 5: Log it

Append a row to the **translation log** (§7) in `docs/i18n-hungarian.md` recording the file and a
one-line note on what was done.

## New terms

If you hit a term not in the glossary, **decide it, use it, and add a row** to `docs/i18n-hungarian.md`
(with the `Clarify?` call and a note). Mark it 🟡 until a human confirms. Don't silently invent a
term without recording it — consistency across concepts depends on the glossary staying complete.

## Git

Do not commit, branch, or push unless explicitly asked. Leave the new/edited files in the working
tree.
