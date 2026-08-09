# Authoring `<define>` and `<literal>` in curriculum source

**Audience:** anyone (human or a Claude session) editing authored curriculum prose, e.g.
`front-end/curriculum/src/concepts/*/source.md` and
`front-end/curriculum/src/exercises/*/instructions.md`.

This explains **how to decide where to put `<define>`/`<literal>` markup when writing the
English source.** It does not cover how a translation pass expands them: that mechanism is
owned by `translator/global/voice.md` (the canonical spec), with `rules.md` and
`workflow.md` alongside it. Read those for rendering, attributes, and direction. Read this
for the authoring judgement that sits upstream of them.

**The one habit that surfaces every rule in this doc: read each page as a Japanese beginner
who cannot read Latin script (next section). Skip it and you will miss things that look
perfect in English.**

## The core technique: read every page as a Japanese beginner

**This is the single most important habit here. Every rule below is downstream of it, and
the mistakes you will actually make are the ones you make by skipping it.** Do not reason
about the markup in the abstract. Run the page through the reader's eyes.

Before and after you edit, re-read the whole page *in the voice of a Japanese beginner who
cannot read Latin script at all*. To that reader the page is Japanese prose with islands of
unreadable Latin dropped into it: `name`, `for`, `of`, `"green"`, `J-E-R-E-M-Y` are all just
shapes. Go token by token and ask:

- **Can they read this?** If it is Latin script, no. Does the lesson need them to understand
  it right here? If yes, it needs a one-time `<define>` gloss. If it is decorative, leave it.
- **Will a translator change this, and does the lesson survive if they do?** If changing the
  characters breaks the surrounding sentence or the code, it must be `<literal>` (see
  "Load-bearing strings").
- **Does this English word even reach them as English?** Ordinary prose ("letter",
  "position") is translated into Japanese and never seen as Latin, so it needs no gloss.
  Glossing it only pins an English word they will never meet.

Reading in **English** hides all three questions, because in English everything is legible
and nothing gets translated. The bugs are invisible until you actually adopt the Japanese
reader's eyes. That is why this is a technique you *perform*, not a principle you remember.

## Scan before you edit a page

This scan **is** that Japanese read, turned into a checklist. Run it every time. The failure
mode is **silent**: a missing `<literal>` or a wrong `<define>` reads perfectly in English
and only breaks once the page is translated, so you cannot catch it by rereading the English.
Walk the whole file against these, in the Japanese reader's voice:

1. **Every bare Latin token in prose** (a name, a spelled-out word like `J-E-R-E-M-Y`, a
   keyword, an identifier sitting outside a code span): ask *"if a translator rendered this
   into the target language or transliterated it, would the lesson still hold?"* If not, it
   must be `<literal>` (kept verbatim) or a code span. **This is the easiest thing to miss,**
   because English prose hides it.
2. **A string whose exact spelling or length drives the lesson.** See "Load-bearing strings".
3. **Variables, and meaning-carrying literals, in the page's code:** first appearance
   *across the curriculum's teaching order* earns a `<define>`. If the term was already
   `<define>`d on an earlier-taught page, it does not need re-glossing here; check the
   earlier pages before adding a new one. A **proper name** (`"Jeremy"`, `"Jiki"`) is also
   defined, but its `info` steers name *rendering* rather than meaning. See "Which literals
   to define".
4. **A new technical term or construct:** one `<define>`, where the prose introduces it.
5. **Ordinary English words** ("letter", "position", "syntax"): no `<define>`. If it never
   appears as code and translates cleanly, leave it plain.

## What to mark

Mark:

- **Technical terms and concept names being introduced.** `template literals`, `backticks`,
  the `for of` loop. These may be prose (not code) as long as they are genuinely technical.
- **Variables, at the first appearance of each across the curriculum.** `name`, `letter`.
  They appear verbatim in Latin script the reader cannot read, so the first use overall
  earns a gloss of its meaning. A page does not re-gloss a variable already `<define>`d on
  an earlier-taught page.
- **Meaning-carrying literals, at first appearance across the curriculum.** `"green"`,
  `"blue"`, `"hello"`, `"world"`. See "Which literals to define".
- **Proper names, at first appearance across the curriculum.** `"Jeremy"`, `"Jiki"`. Defined
  too, but the `info` steers *rendering*, not meaning. See "Which literals to define".

Do not mark:

- **Ordinary English words that merely sit near code.** "letter" (the everyday word),
  "syntax", "position". Being the first mention does not turn an ordinary word into a term,
  and a word that is translated into the target language (never seen as Latin) needs no gloss.

## Which literals to define

A literal is unreadable Latin to the reader either way, so "can they read it" does not decide
this. Almost every literal that is a word or a name gets a `<define>`; what differs is what
its `info` tells the translator to do.

- **Meaning-carrying literals: gloss the meaning.** `"green"`/`"blue"` are the color values
  the lesson is *about*; `"hello"`/`"world"` are the meaningful words a concatenation example
  glues together. Strip the meaning (exactly what happens to a reader who cannot read them)
  and the example stops teaching. The gloss (`"hello"` → こんにちは) restores the hook. No
  `info` is usually needed; the meaning is obvious to the translator. Still mark it in the
  source even if some languages will not gloss it: a language whose gloss would be a
  near-identical same-script loanword (Hungarian `"hello"` → _helló_) drops the parenthetical
  at expansion time, while Japanese (こんにちは) keeps it. That per-language skip is a
  `voice.md` rule ("Skip a gloss that would teach nothing"), not a source decision.
- **Proper names: steer the rendering with `info`.** A name is not meaningless, and it is not
  the translator's job to guess how to handle it. Define it, and use `info` to say it is a
  name and to invite the language's own conventions, e.g.
  `<define info="say 'the name Jeremy', or use name signifiers such as -san if appropriate in the language">`` `"Jeremy"` ``</define>`.
  Japanese then yields *Jeremy-san*; a language without honorifics just keeps the name. The
  English source stays language-agnostic; each language does the right thing.

The only literals left plain are ordinary translated prose words (above) and load-bearing
literals, which are `<literal>`, not `<define>` (next section).

The quick test: "letter" the word, no; `letter` the variable, yes. `for`/`of` the keywords,
yes. "syntax", no.

## Two kinds of gloss

The gloss differs by what is being marked:

- **Keywords and code identifiers** (`for`, `of`, `let`, `name`). The code stays English
  verbatim, because code cannot be translated. The gloss gives the **meaning** in the target
  language. English stays primary and the meaning goes in brackets. (Per `voice.md`, a code
  identifier's gloss is its meaning, with no "in English" marker.)
- **Variables and literals whose chosen name carries meaning** (`letter` becomes 文字,
  `green`). Gloss the meaning so the reader can follow the worked example.

## `for of`, not `for-of`

It is two keywords, a phrase, not one hyphenated token. So:

- In prose, quote it: `"for of"`. That shows it is a phrase, not two stray words.
- On the `<define>`, keep the English keywords and gloss the **meaning**, not a
  transliteration. Steer the translator with `info=`, e.g.
  `<define info="loops over each element of a collection in turn; keep the keywords, gloss the meaning">`` `for of` ``</define>`.

## Load-bearing strings (`<literal>`)

`<define>` is about tokens the reader needs *explained*. `<literal>` is about tokens that
must not *change at all*, because the lesson is built on their exact form.

A string is **load-bearing** when the lesson depends on its precise spelling or length: an
indexing example that maps `J`=0, `e`=1, `r`=2 relies on the name being spelled
`J-E-R-E-M-Y` with exactly six Latin letters. Translate or transliterate it (ジェレミー) and
the letter count is wrong, the position mapping is gone, and the prose no longer matches the
code. The example silently falls apart in that locale.

When a string is load-bearing:

- **The string literal and any spelled-out form of it are `<literal>`.** A code-spanned
  `"Jeremy"` already stays verbatim, but a **bare, spelled-out** form in prose
  (`J-E-R-E-M-Y`) does not, and is the trap. Wrap it: `<literal>J-E-R-E-M-Y</literal>`.
- **Pin every dependent mention, not just the obvious one.** If the prose also says "your
  initial `J`" or names the string in running text, those break the same way. Protect them
  too.
- **The example name is not localized.** A translator must not swap in a native name, because
  the letter count, the per-position spelling, and every `[n]` result would all have to be
  re-derived by hand for that locale, and will drift. Keep the one running example.

Rule of thumb: if changing the characters would make the surrounding sentence or the code
output wrong, the characters are load-bearing. `<literal>` them, and do not localize the
example.

## Attributes (full spec in `voice.md`)

- `info="..."`: an **advisory** plain-English hint to the translator about what the term
  means. Use it for opaque identifiers. Stripped on expansion, never shown to a reader.
- `en="..."`: **prescriptive** exact English bracket text, honoured verbatim. Use it when
  the bracket must show more than the bare term.

## Placement

- Put the `<define>` at the term's **first meaningful appearance**, the point where the prose
  actually explains it. Mark `let letter` where the "this `let letter` bit" explanation is,
  not on a later stray mention.
- `<define>`s live in **prose, not inside fenced code blocks**. Mark the term where the prose
  introduces it, not in the sample code.
- **Exactly one `<define>` per term.** There is no first-use auto-detection; the author picks
  the single spot (see `voice.md`).
- **Scope is first use across the whole curriculum, not per page.** A term already
  `<define>`d on an earlier-taught page does not get a fresh `<define>` on a later page,
  even though a reader could land on the later page first. Before adding a `<define>`,
  check whether the term is already glossed on a page earlier in the teaching order
  (e.g. `"string"` is formally introduced and glossed in
  `curriculum/src/concepts/strings/source.md`, so `curriculum/src/concepts/variables/source.md`
  does not redefine it). "Nothing new here" in the prose can refer to the *concept* being
  familiar without a fresh `<define>`, because the token was already defined earlier.

## Open questions (as of 2026-07-29)

These surfaced while building the rules and are not yet settled. Do not treat the working
assumptions as law without confirming with iHiD.

*(Resolved 2026-07-29: which literals to define. Meaning-carrying literals are defined with a
meaning gloss; proper names are defined too, with `info` that steers per-language name
rendering (e.g. Japanese -san). See "Which literals to define".)*

*(Resolved 2026-08-05: scope is whole-curriculum, not per-page. A term already `<define>`d on
an earlier-taught page is not re-glossed on a later page. See "Placement".)*

## Canonical sources

- `translator/global/voice.md` — the spec for expanding `<define>`/`<literal>`: attributes,
  direction, format. Authoritative for mechanics.
- `translator/global/rules.md` — the hard constraint that these tags are structural, and are
  expanded and stripped so they never appear in output.
- `translator/global/workflow.md` — where a pass expands and strips them, plus the QA checks.
