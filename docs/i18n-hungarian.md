# Hungarian Translation Guide & Glossary

Repo-wide guide for translating Jiki content into Hungarian. Lives at the monorepo root
(`docs/i18n-hungarian.md`) so it's reachable from every package — `curriculum`, `content`, `app`.
Refine this as we go — it's the source of truth for future translations so they stay consistent.

First target is concept content (`curriculum/src/concepts/[name]/en.md` → `hu.md`), but the
glossary and style rules apply to any Hungarian text across the repo.

> **Skill:** the `translate-hungarian` skill
> (`.claude/skills/translate-hungarian/SKILL.md`, at the repo root so it's reachable from every
> package) drives the translation workflow and loads this document as its source of truth. This doc holds the _knowledge_; the skill holds the
> _procedure_. Keep translation rules here, not in the skill — the skill only points at this file,
> so refining rules here never makes the skill stale.

> Status: **draft**. Decisions here were seeded from the `if` concept and refined by Aron.
> Anything marked 🟡 is still unsettled and needs Aron's call.

---

## 1. Core principles

1. **Hungarian-first for concepts, English for code.** _Programming-jargon_ terms get a natural
   Hungarian equivalent, with the English term in parentheses **once — at the very first occurrence
   in the file, and never again**: _függvény (function)_ the first time, then just _függvény_
   everywhere after. Repeating the English on every mention makes the text tiring to read; don't
   do it.
   - **Clarify only heavily programming-specific jargon.** The English-in-parens is _only_ for
     terms that are genuinely programming vocabulary — words a reader specifically needs to map to
     the English they'll meet in code/docs (_változó/variable_, _függvény/function_, _kulcsszó/
     keyword_, _logikai érték/Boolean_). **Do NOT clarify ordinary words** that merely happen to
     appear in a technical sentence, even if the English source treated them as a term:
     _összehasonlítás_ (comparison), _érték_ (value), _szám_ (number), _feltétel_ (condition) all
     stand alone — no English needed. Test: "is this a word a non-programmer already knows?" If
     yes, don't clarify. When unsure, lean toward **not** clarifying — under-clarifying reads far
     better than over-clarifying. Glossary rows carry the `(English)` only for terms that pass
     this test.
2. **Some terms stay English by convention.** `string`, `scope`, and `Boolean` are ones we say in
   Hungarian too — keep them English throughout. For each, give the Hungarian name **once**, at
   first appearance (_karakterlánc_ for string; _hatókör_/_láthatóság_ for scope; _logikai érték_
   for Boolean), then use the English word. Note the difference from the jargon clarifier (§1.1):
   these stay _English_ with a one-time Hungarian gloss; jargon terms stay _Hungarian_ with a
   one-time English gloss. Anything that is real JavaScript — keywords (`if`, `let`, `return`),
   function/variable names (`askAge`, `age`), operators — always stays English and inside
   backticks, exactly as in the source.
3. **Informal "te" address.** Second person informal throughout, matching the chatty, friendly
   English voice ("maybe you're a bouncer…" → „mondjuk te vagy a kidobó…"). Never _ön_.
4. **Translate meaning, not word order — re-pace for Hungarian.** This is the single biggest
   quality lever, and where machine-ish translations fail. Do **not** map English clause-by-clause;
   that produces grammatically-correct Hungarian with the **emphasis in the wrong place**. Instead:
   read a whole English _paragraph_, understand what each sentence is really emphasising, then
   rebuild it in Hungarian putting that emphasis in the Hungarian focus position. See **§2 —
   Information structure & emphasis**. Workflow: translate a paragraph, then re-read your Hungarian
   out loud and ask "does the stress land on the right word?" — if not, reorder.
5. **Never touch the code scaffolding.** Frontmatter _keys_, code blocks, and inline backticked
   code are copied verbatim. Only `title` / `description` values, prose, **and `<img>` `alt` text**
   get translated. See §5.

---

## 2. Information structure & emphasis (the pacing fix)

Hungarian and English decide "what's important in this sentence" using **different machinery**.
English has fixed subject–verb–object order and signals emphasis with **stress/intonation** and
cleft constructions ("it's _X_ that…"). Hungarian has **free word order** precisely so that word
_position_ carries the emphasis. If you keep English order, the grammar is fine but the **focus
lands on the wrong word** — that's the "weirdly paced, emphasis in the wrong place" feeling.

### The one rule that fixes most of it: focus goes immediately before the verb

The **most important / newest / contrastive** element in a Hungarian clause goes **directly in
front of the finite verb** (the "focus position"). Everything already-known (the topic) goes
first; the verb and the rest trail after.

> **Topic (old info) → FOCUS (the point) → verb → rest**

When you translate a sentence, ask: **"what is this sentence actually asserting / contrasting?"**
That element must sit right before the verb. If a bland verb (teszünk, van, használjuk) ends up in
focus, you've almost certainly mis-paced it.

### Before / after (from the `if` concept)

| English | ❌ English-order (mis-paced) | ✅ Hungarian focus |
|---|---|---|
| "We put some information in the brackets." | Teszünk némi információt a zárójelek közé. | A zárójelek közé írunk valamit. _(brackets = topic, the placing is the point)_ |
| "hello with a capital H is not equal to hello with a small h" | A „hello" nagy H-val nem egyenlő a „hello" kis h-val. | A nagy H-s „hello" **nem ugyanaz**, mint a kis h-s. _(the contrast is capital-vs-small; put it in focus)_ |
| "we use **three** equal signs in a row" | Három egyenlőségjelet írunk egymás után. | **Három** egyenlőségjelet írunk egymás után. _(három is the surprising bit; keep it glued to the verb, don't bury it in a subordinate clause)_ |
| "This one is a bit different from what you're used to." | Ez utóbbi kicsit más, mint amit megszoktál. | Ez viszont **kicsit másképp** működik, mint amit megszoktál. _(másképp = the point, before the verb)_ |

### Concrete techniques

- **Front the topic, not the subject.** Start the sentence with what's already being talked about
  (often not the grammatical subject). "In these situations we'll use `if`" →
  „Ezekben a helyzetekben az `if` kulcsszót használjuk" — the situation is old info, `if` is the
  new point and sits before the verb. ✅ (this one we already got right.)
- **English clefts → Hungarian focus-fronting, not literal.** "It's the capital H that makes them
  different" → „A nagy H **teszi** őket különbözővé" — not „Az a helyzet, hogy…".
- **Negation pulls focus.** Hungarian _nem_ immediately precedes the focused element:
  „**nem ugyanaz**", „**nem** a méret számít". Put _nem_ right before the word being denied, not
  drifting mid-clause.
- **Attach descriptive clauses with a relative pronoun (_ami_/_amely_/_aki_).** Hungarian can't
  juxtapose a noun and a describing clause the way English can with a colon or a dropped
  relativizer. If a clause _describes_ or _acts on_ a just-mentioned thing, link it explicitly:
  - ❌ „És van még egy: azt ellenőrzi, hogy két dolog ugyanaz-e." _(colon-juxtaposition, feels
    broken)_
  - ✅ „És van még egy, **ami** azt ellenőrzi, hogy két dolog ugyanaz-e." _(the `ami` binds the
    clause to `egy`)_

  Use **ami** for things (default), **amely** in more formal registers, **aki** for people.
  Rule of thumb: if in English you could insert "which/that/who" (even where English omits it),
  Hungarian **requires** the _ami/amely/aki_. A colon or comma alone won't carry it.
- **Set up a `hogy`-clause with an explicit correlative pronoun (_azt_/_annyit_/_arra_/_abból_…).**
  Same family as the _ami_ rule: where English introduces a subordinate clause with a bare colon
  or a dropped object ("Just remember: three equal signs"), Hungarian needs a pronoun in the main
  clause that _points forward_ to the `hogy`-clause. A bare verb + colon feels truncated.
  - ❌ „Csak jegyezd meg: összehasonlításhoz három egyenlőségjel kell." _(missing object; feels
    like a dropped subject)_
  - ✅ „Csak **azt** jegyezd meg, **hogy** összehasonlításhoz három egyenlőségjel kell."
  - ✅ „Csak **annyit** jegyezz meg, **hogy** …" _(annyit = "just this much")_
  - ✅ „**Mindebből azt** jegyezd meg, **hogy** …" _(also ties the takeaway back to the preceding
    explanation — nice for summary sentences)_

  The correlative agrees with the verb's case frame: _megjegyez valamit_ → **azt/annyit**;
  _emlékszik valamire_ → **arra**; _következik valamiből_ → **abból**. Pattern: **pronoun + verb,
  hogy + clause**. If your sentence has a verb that takes an object/complement but the object is a
  whole clause, insert the correlative pronoun — don't let a colon stand in for it.
- **Give conditions a full predicate — don't leave a bare demonstrative.** English can compress a
  condition to a bare "this": _"If this, then do this. Else if this, do that."_ In Hungarian a bare
  „Ha ez, akkor…" feels unfinished — a condition is a **statement (állítás)** that is true or
  false, so it needs an explicit predicate (usually _igaz_, or a spelled-out claim).
  - ❌ „Ha ez, akkor csináld ezt. Különben ha ez, csináld azt."
  - ✅ „Ha ez **igaz**, akkor csináld ezt. Ha pedig ez **az állítás igaz**, csináld ezt."

  General principle: where English treats a condition as a bare pointer, restore the predicate that
  makes it a complete spoken statement. („Három kisebb, mint öt. Ez igaz." is already correct — the
  predicate _kisebb, mint_ is present and _Ez igaz_ completes it.) See the _statement (logical
  claim) → állítás_ glossary row.
- **Don't stack subordinate clauses the way English does.** English chains "…, which means…, so
  that…". Hungarian reads better as **shorter, re-ordered sentences**. Break a long English
  sentence into two Hungarian ones if it lets the focus breathe.
- **Given-before-new.** Old/known info leftward, new/important info rightward toward the verb.
  A sentence that opens with brand-new information usually feels abrupt in Hungarian.
- **Read it aloud.** Hungarian focus == where your voice naturally stresses. If the stress your
  ear wants doesn't match the pre-verb slot, reorder until it does.

### Anti-patterns (smells that you tracked English order)

- The clause **starts with the verb** (teszünk…, van…, használjuk…) when the sentence isn't
  actually about the _action_ → move the real focus before the verb.
- A **filler verb sits in focus** while the interesting noun trails after it.
- Long **comma-chained** sentence mirroring English subordination → split and reorder.
- **`nem`** floating in the middle of a clause instead of hugging the denied word.

---

## 3. Glossary

First mention in a file: **Hungarian (English)**. Every mention after that: **Hungarian only**.
The English-in-parens appears exactly once per file, at first occurrence — see §1.

"Clarify?" = does this term get the `(English)` on first use (§1)? **yes** = programming jargon;
**no** = ordinary word, stands alone.

| English | Hungarian | Clarify? | Status | Notes |
|---|---|---|---|---|
| if statement | elágazás (if statement) | yes | ✅ | jargon; plural _elágazások_ used in title |
| keyword | kulcsszó (keyword) | yes | ✅ | |
| variable | változó (variable) | yes | ✅ | |
| function | függvény (function) | yes | ✅ | |
| condition | feltétel | no | ✅ | ordinary word; stands alone |
| comparison | összehasonlítás | no | ✅ | ordinary word; stands alone |
| value | érték | no | ✅ | ordinary word |
| number | szám | no | ✅ | ordinary word |
| string | **string** | (kept English) | ✅ | keep English — we say _string_ in HU too. **Exception:** in the string concept itself, mention **once** that it's called _karakterlánc_, then use _string_. |
| scope | **scope** | (kept English) | ✅ | keep English (same as _string_). **Exception:** in the scope concept, mention **once** that it's called _hatókör_ (or _láthatóság_), then use _scope_. |
| Boolean | **Boolean** | (kept English) | ✅ | keep English (same as _string_). **Exception:** on first appearance, explain it means _logikai érték_, then use _Boolean_. |
| true / false | igaz / hamis | no | ✅ | not capitalised in prose |
| code block | kódblokk | no | ✅ | |
| to return (a value) | visszaad | no | ✅ | „30-at ad vissza" |
| to run / execute (code) | lefuttat / lefut | no | ✅ | |
| character | karakter | no | ✅ | |

### Brackets

Default to plain **zárójel**. When a _specific_ bracket matters, name it **and** show the glyph in
a code tag right after: _szögletes zárójel (`[]`)_. This may not be textbook Hungarian CS
terminology, but it's unambiguous and reads naturally.

| Glyph | Hungarian | Notes |
|---|---|---|
| `()` | zárójel · kerek zárójel (`()`) | plain _zárójel_ by default; add _kerek_ + glyph only when disambiguating |
| `[]` | szögletes zárójel (`[]`) | |
| `{}` | kapcsos zárójel (`{}`) | |
| `<>` | csúcsos zárójel (`<>`) | or _hegyes zárójel_ |

Example: _hogy meghívj egy függvényt, írd le a függvény azonosítóját, utána tegyél egy nyitó és
egy csukó zárójelet (`()`)._

### Terms encountered / decided ahead

Worked out ahead of time so future concepts stay consistent. Mark ✅ once actually used in a file;
🟡 = provisional, revisit on first real use.

| English | Hungarian | Status | Notes |
|---|---|---|---|
| array | tömb (array) | 🟡 | standard HU term |
| loop | ciklus (loop) | 🟡 | _ciklus_ is the established word, not _hurok_ |
| for loop | `for` ciklus | 🟡 | keep `for` in backticks (real keyword) + _ciklus_ |
| while loop | `while` ciklus | 🟡 | as above |
| dictionary | szótár (dictionary) | 🟡 | |
| method | metódus (method) | 🟡 | |
| property | tulajdonság (property) | 🟡 | |
| parameter | paraméter (parameter) | 🟡 | |
| argument | argumentum (argument) | 🟡 | _argumentum_ over _paraméter_ when the call-site value is meant |
| object | objektum (object) | 🟡 | |
| index | index | 🟡 | same word; no parens needed |
| statement (executable code) | utasítás (statement) | 🟡 | the imperative sense — a line of code that _does_ something and gets executed (`if`/`for`/assignment statement). Standard HU CS term (BME/ELTE). "a program utasítások sorozata". |
| statement (logical claim) | állítás | 🟡 | the proposition sense — a claim that is true or false; also a test **assertion** (assert). E.g. `if` prose: „Három kisebb, mint öt. Ez igaz." → these are _állítások_. Pick by meaning, not by the English word. |
| expression | kifejezés (expression) | 🟡 | |
| operator | operátor (operator) | 🟡 | |
| integer | egész szám (integer) | 🟡 | |
| float / decimal | tizedes tört (float) | 🟡 | or _lebegőpontos szám_ if the floating-point nature matters |
| assignment | értékadás (assignment) | 🟡 | |
| to assign | hozzárendel | 🟡 | |
| nested | egymásba ágyazott | 🟡 | e.g. _egymásba ágyazott ciklus_ = nested loop |
| iteration | iteráció (iteration) | 🟡 | verb _iterál_; „végigmegy rajta" also natural |
| element | elem (element) | 🟡 | array element = _tömb eleme_ |
| to call (a function) | meghív | 🟡 | _függvényt meghív_ |
| to define (a function) | definiál / létrehoz | 🟡 | |
| return value | visszatérési érték | 🟡 | |
| input (to a function) | bemenet (input) | 🟡 | |
| output | kimenet (output) | 🟡 | |
| loop body | ciklusmag / ciklus törzse | 🟡 | |
| condition is true/false | a feltétel igaz / hamis | 🟡 | |

---

## 4. Style & register notes

- **NEVER use an em-dash (—).** This is absolute, no exceptions, in all Hungarian output. Where
  the English uses an em-dash, prefer a **comma** for a middle-injected clause (an aside dropped
  into the middle of a sentence) — that's the natural Hungarian default. A **hyphen (-)** is also
  allowed in the positions you'd use an em-dash, if it reads better; just never the em-dash glyph.
  The hyphen also keeps its normal jobs (compound words, case suffixes on code/numbers:
  „`repeat`-et", „30-at").
- **Analogies/metaphors:** keep them literal when they carry meaning. "put this in the box" →
  „tedd ezt a dobozba". Don't over-formalise.
- **"technical-sounding word" / jargon** → „száraz technikai szakkifejezés" (or similar). Use
  this register when the English pokes fun at a scary-sounding term, e.g. Boolean → „ez is egy
  ilyen száraz technikai szakkifejezés, de valójában nagyon egyszerű".
- **Number-with-suffix agreement:** attach Hungarian case suffixes to numerals per vowel harmony
  — „30-at ad vissza", „12-t ad vissza", „21 éves vagy idősebb".
- **Quotes:** use Hungarian quotation marks „…" (low-high) for prose emphasis, not "…".
- **Rhetorical asides** ("So what do these conditions look like?") → keep them as natural
  Hungarian rhetorical questions („Na de hogy néznek ki ezek a feltételek?").
- 🟡 **Jiki (the character):** currently referred to with the definite-article/name inflection
  „Jikinek", „Jiki". Confirm this reads well.

---

## 5. Mechanics — what to translate vs. leave alone

**Translate:**
- `title` and `description` frontmatter _values_
- All prose
- **`<img>` `alt` text** — localise it. Hungarian alt text helps Hungarian SEO. Translate only
  the `alt=` value; leave `src`, `class`, `width`, `height` untouched.

**Copy verbatim (do NOT translate):**
- Frontmatter _keys_ (`title:`, `description:`)
- Everything inside ` ```code``` ` fenced blocks
- Inline code in `backticks` (`if`, `askAge`, `age`, …)
- `<img>` tag _attributes other than `alt`_ (`src`, `class`, `width`, `height`)

**File layout:** `hu.md` sits beside `en.md` in the same concept folder. Same structure, same
order of blocks — only the human-language text differs.

---

## 6. Decisions & open questions

**Settled:**
1. English-in-parens appears **once per file, at first occurrence** (§1). _Open follow-up:_ once
   per file for now — revisit whether to drop it entirely for terms the learner has already met in
   earlier concepts.
2. `string` stays English; _karakterlánc_ mentioned once, only in the string concept (§3).
3. `<img>` `alt` text **is** localised — for Hungarian SEO (§5).
4. Brackets: plain _zárójel_, specific bracket named + glyph in a code tag (§3 Brackets).

**Still open (🟡):**
5. Any house terms already used elsewhere in Hungarian Jiki content (blog/articles `hu.md`) we
   should match rather than reinvent? → worth a sweep of `content/src/posts/**/hu.md`.
6. All 🟡 rows in the "encountered / decided ahead" table are provisional — confirm on first real
   use.
7. Jiki-name inflection („Jikinek", „Jiki") — confirm it reads well.

---

## 7. Translation log

Track each concept as it's done so we can re-sweep for consistency after glossary changes.

| Concept | File | Status | Notes |
|---|---|---|---|
| if | `curriculum/src/concepts/if/hu.md` | round 5 | r2 focus re-pace; r3 jargon-only clarifiers + `ami`; r4 correlative pronoun; r5 Boolean moved to stay-English (glossed _logikai érték_ once) |
| else | `curriculum/src/concepts/else/hu.md` | round 2 | skill-driven draft; r2 gave conditions full predicates („Ha ez igaz…" not „Ha ez…") per new §2 rule; „else ág", „útelágazás" |
