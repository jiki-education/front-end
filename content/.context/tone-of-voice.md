# Blog Writing Tone of Voice

This guide documents Jeremy's written blog voice - how he structures posts, uses formatting, opens/closes, and engages readers. Based on analysis of 15+ Exercism blog posts (2019-2024).

---

## Voice Characteristics

### Core Patterns

- **Contractions:** "I'm", "we're", "it's" (never "I am", "we are", "it is")
- **British English:** "optimising", "realisation", "quite", "a bit", "loads of"
- **Some hedging:** "I think", "probably", "quite" (but less than in spoken transcripts)
- **Conversational:** "So yeah", "I guess", "to be honest" (sparingly)
- **Enthusiasm:** Exclamation marks, bold emphasis, genuine excitement
- **Vulnerability:** Shares struggles and limitations openly

### Sentence Level

- **Hedging**: "I think", "maybe", "probably", "sort of"
- **Contractions**: Always ("it's" never "it is")
- **Run-on sentences**: Comma-connected thoughts
- **Self-correction**: Mid-sentence adjustments
- **"So" and "yeah"**: Frequent connectors

### Word Choice

- **British English**: "quite", "a bit", "loads of"
- **Casual qualifiers**: "a little bit", "I don't know"
- **Emotional honesty**: "to be honest", "I feel like"

---

## What Jeremy Would Say vs. What He Wouldn't

### ✅ What Jeremy would say

"So yeah, I think it's probably going to take a bit longer than we'd hoped, maybe three or four hours, but I don't know, that's sort of the nature of this stuff. It's quite tricky work, but I quite enjoy it to be honest."

**Why it works:**

- British English ("quite", "a bit")
- Hedging ("I think", "probably", "sort of")
- Contractions ("it's", "I don't know")
- "So yeah" opener
- Honest about difficulty
- Personal disclosure ("I quite enjoy it to be honest")

### ❌ What Jeremy would NOT say

"The task will require approximately 3-4 hours of focused effort. This represents challenging work, however I find it enjoyable."

**Why it fails:**

- Formal, not conversational
- No hedging or qualifiers
- No contractions
- Stiff language ("however", "represents")
- No vulnerability or personality
- American English tone

---

## Common Phrase Categories

### Opening/Connecting

- "So yeah, I think..."
- "I guess the main thing is..."
- "Let me just..."
- "Okay, so..."

### Hedging

- "I think probably"
- "Maybe I think"
- "Sort of"
- "A little bit"
- "I don't know, maybe"

### British Colloquialisms

- "Quite" (as intensifier)
- "A load of" / "loads of"
- "A bit"
- "Have a look"
- "Have a browse"

### Emotional Honesty

- "To be honest"
- "I think I feel like..."
- "It's been quite difficult"
- "That's what it is"
- "And so it goes"

### Inclusive

- "We're going to..."
- "Let's look at..."
- "Let's have a little look"
- "Our world has changed"

---

## Structure Patterns

### Standard Structure

1. **Opening greeting** - "Hi everyone!" / "Hey everyone!"
2. **Introduction** - Context, excitement, preview
3. **Background** (if needed) - "Some background"
4. **Main content** - Details, examples, explanations
5. **Get Involved / Take Action** - How readers can participate
6. **Conclusion** - Gratitude, forward-looking, closing thoughts

### Header Usage

Headers create clear hierarchy and scannable structure:

- **# Title** - Post title (action-oriented or declarative)
- **## Major sections** - "Introduction", "Background", "Details", "Get Involved", "Conclusion"
- **### Sub-sections** - Breaking down major sections into digestible parts

**Frequency:** Most blog posts have 3-6 major sections (##), with sub-sections (###) used for complex content.

**Naming patterns:**

- Direct and descriptive: "Some background", "Some details"
- Action-oriented: "Get involved", "Help by spreading the word"
- Question-based (less common): "Why our OSS model is broken"

### TL;DR Usage

For longer or complex posts, include TL;DR at the top:

**When to use:**

- Posts over 100 lines
- Posts with policy changes affecting different audiences
- Technical posts where some readers may want just the summary

**Format:** Italic text, 2-4 sentences, audience-specific guidance

**Example:**

```markdown
_TL;DR; We're spending a few months redesigning our volunteering model and
giving our key volunteers a break from the work of reviewing community contributions.
If you use Exercism purely to learn or mentor, there's nothing here you need to know
(although please read if you're interested!).
If you are a track maintainer, wish to contribute to Exercism, or wish to report a
bug/problem, then consider this essential reading 🙂_
```

### Horizontal Rules

Use `---` to separate major sections or create visual breaks.

**When to use:** Between major conceptual shifts, after introductions, before postscripts

---

## Opening Techniques

### 1. Direct Community Greeting

Start with warm, direct address:

- "Hi everyone!"
- "Hey everyone! How's your #12in23 going?"
- "Hello. Welcome."

**Usage:** Nearly every post opens this way. Sets conversational tone immediately.

### 2. Excitement Statement

Express genuine enthusiasm about the content:

- "I'm really excited to let you know that..."
- "We're **really** excited..."
- "I'm really, **really** excited for this."

**Pattern:** "I'm/We're [really/so] excited to [announce/share/tell you]..."

**Formatting note:** Often includes **bold** for emphasis on "really"

### 3. Time/Context Setting

Establish when and why this post matters:

- "from January 2025, we're going to be running..."
- "This week we've launched the new..."
- "At the start of September 2021..."
- "Just over 12 months ago..."

**Usage:** Grounds the post in specific moment, creates urgency or timeline awareness

### 4. Reference to Previous Context

Connect to earlier posts or ongoing narratives:

- "As I mentioned in the '[Post Title](link)' blog post in September..."
- "Following on from [previous announcement]..."
- "You might remember that..."

**Pattern:** Include actual links to previous posts, maintaining narrative continuity

### 5. Problem/Opportunity Framing

Open by establishing what challenge or opportunity the post addresses:

**Pattern:** Personal motivation + problem statement + why it matters

**Example:**

> "I've been wanting to help total beginners for a long time. As I mentioned in the '2M users but no money in the bank' blog post in September, over 95% of people who try to learn to code give up, which I find unacceptable."

### 6. Direct Statement of News

Simply state what's new:

**Pattern:** Hook statement + specific announcement

**Example:**

> "Solving an exercise on Exercism is just the first step. The real learning comes next!
>
> This week we've launched the new 'Dig Deeper' tab on exercises..."

---

## Formatting Conventions

### Bold Usage

Use **bold** liberally for emphasis and key terms:

**What to bold:**

- Key concepts and features: "**Learn to Code Bootcamp**", "**Dig Deeper**"
- Emphasis within sentences: "I'm **really** excited", "over **350** of them"
- Important names: "**TwoFer**", "**Array.Reverse()**"
- Strong statements: "win win win", "utterly fascinating"

**How often:** 10-20 bolded terms/phrases in a typical post

**Anti-pattern:** Don't bold full sentences or large blocks - use for highlights only

### Lists

Use extensively for clarity and scannability:

**Numbered lists** - For sequences, steps, or ordered items:

```markdown
The bootcamp will be in two parts:

1. Learn to code
2. Learn front-end web dev
```

**Bulleted lists** - For collections, features, or unordered items:

```markdown
Pros:

- Faster startup (no JIT compilation step)
- Smaller memory footprint
- No runtime dependencies

Cons:

- Not portable. Bytecode is portable...
```

**Frequency:** Most posts have 3-5 lists; lists break up dense paragraphs

### Code Blocks

**Inline code** - With backticks for terms, commands, short snippets:

```markdown
The `Array.Reverse()` method or use `StringBuilder`
```

**Code blocks** - With language tags for syntax highlighting:

````markdown
```ruby
module TwoFer
  def self.two_fer(name='you')
    "One for #{name}, one for me."
  end
end
```
````

**When to use:**

- Always for code examples
- For terminal commands or output
- For file paths or technical terms needing distinction

### Links

Embed links naturally in flowing text:

**Patterns:**

1. **Descriptive anchor text:**

   ```markdown
   scroll through the **[Bootcamp website](https://bootcamp.exercism.org)**
   ```

2. **Email addresses:**

   ```markdown
   please [let me know](mailto:bootcamp@exercism.org)
   ```

3. **Action-oriented:**

   ```markdown
   [👉🏾 Check it out](https://exercism.org/tracks/csharp/exercises/reverse-string/dig_deeper)
   ```

4. **Forum references:**
   ```markdown
   post your ideas and thoughts [in the forum post](https://forum.exercism.org/t/...)
   ```

**Frequency:** 3-10 links per post, always with context

**Anti-pattern:** Don't use raw URLs - always embed with descriptive text

### Emoji

Use sparingly for personality, not decoration:

**Common usage:**

- **Closing** - "Thanks for reading 🙂"
- **Surprise/emphasis** - "over 350 of them were unique 😲"
- **Action pointer** - "[👉🏾 Check it out]"
- **Enthusiasm** - "Thank you! 💙"

**Frequency:** 0-3 per post

**Placement:** Usually at end of sentences or in links, never mid-sentence randomly

**Tone:** Adds warmth without being excessive or unprofessional

---

## Transition Patterns

### Between Major Sections

Use clear transitional language or headers:

**Explicit transitions:**

- "However!" - Introduces contrast or new information
- "But there's more!" - Adds additional content
- "Meanwhile" - Shifts to parallel information
- "So" - Causal or consequential connection

**Example:**

> "However! Having designed the exercises, and mentored hundreds of thousands of people through them, our team have a pretty good idea..."

### Within Sections

**Sequential:**

- "So firstly...", "We also have...", "Finally..."
- "The first thing...", "The second thing..."

**Additive:**

- "And finally..."
- "We've also got..."
- "On top of that..."

### To Examples

Signal when moving from theory to concrete examples:

- "Let's take an example to show this in action."
- "An example:" (as header)
- "For example, in C#..."

---

## Closing Techniques

### Calls to Action

Most posts end with explicit, actionable requests:

**Patterns:**

1. **Multiple pathways:**

   ```markdown
   ## Help by spreading the word

   [Details]

   ## Help by mentoring

   [Details]
   ```

2. **Direct requests:**
   - "Check it out"
   - "Get involved"
   - "Tell us what you think"
   - "Post your ideas and thoughts in the forum"

3. **Contact information:**
   - Email addresses: "please email me at [address]"
   - Forum links: "start a topic on the forum"
   - Links to sign up or participate

### Gratitude

Nearly always include explicit thanks:

**Patterns:**

- "Thanks for reading 🙂"
- "Thanks for reading :)"
- "Thank you! 💙"
- "I'd massively appreciate your support"

**Placement:** Final sentence or near-final sentence

**Tone:** Genuine, warm, sometimes with emoji for friendliness

### Forward-Looking Statements

Often end by referencing future plans or excitement:

- "I'll be talking lots more about it over the next few months"
- "We're incredibly excited about what's coming next"
- "I hope it'll help a ton of people"
- "It feels like a win win win."

**Pattern:** Expresses optimism and ongoing commitment

### Expression of Values/Impact

Restates why this matters or core mission:

**Example:**

> "I hope it'll help a ton of people, help us refine a product I've passionate about, and bring a little money into Exercism to keep us afloat. It feels like a win win win."

**Pattern:** Personal investment + community benefit + practical outcomes

---

## Title Patterns

### Action-Oriented

Titles with active verbs:

- "Introducing 48in24"
- "Introducing Community Comments"
- "Introducing Representers"
- "Announcing Exercism Research"
- "Freeing our Maintainers"
- "Redesigning Tracks in Partnership with..."

**Pattern:** "[Verb]ing [noun/feature]"

### Declarative/Direct

Simple, clear statements:

- "Bootcamp"
- "Dig Deeper"
- "Exercism v3 has Launched"
- "Contribution Guidelines - Nov 2023"

**Pattern:** Feature name or clear fact statement

### Themed/Playful

Monthly or themed content:

- "Functional February"
- "Mechanical March"
- "Jurassic July"
- "Mindshifting May"

**Pattern:** [Adjective] [Month] - alliterative, playful

### Question Format (Rare)

Occasionally uses questions:

- "Was Exercism v2 Worth It?"
- "What's New in v3 with Angelika"

**Pattern:** Direct question or conversational phrase

### Technical/Specific

For deep-dive content:

- "14 Increasingly Strange Ways to Solve Hello World"
- "Concurrency & Parallelism in Elixir"
- "Unicode Matching in Elixir"
- "Coding Intentionally in Bash: Grains"

**Pattern:** Descriptive technical topic

---

## Engagement Strategies

### Community Involvement

Posts frequently include ways for community to participate:

1. **Spreading the word:**
   - Affiliate schemes
   - Social sharing
   - Telling friends

2. **Contributing:**
   - Mentoring/supporting
   - Creating content
   - Providing feedback

3. **Direct contact:**
   - Email addresses provided
   - Forum links included
   - Specific people named

### Feedback Requests

Explicitly ask for reader input:

- "tell us what you think"
- "post your ideas and thoughts in the forum"
- "If you've any thoughts, please start a topic on the forum!"

**Pattern:** Makes participation feel valued and accessible

### Recognition and Gratitude

Name specific contributors and community members:

- "Thanks to our community of maintainers..."
- "Thank you as well to Bobahop for complaining loudly enough"
- "happy birthday to Aaron"

**Pattern:** Specific recognition builds community connection

### Affiliate/Incentive Programs

When relevant, include participation incentives:

**Example:**

> "We're setting up an affiliate scheme where your friends or followers can get a 20% discount, and you get a 20% 'commission' on the sale..."

---

## Length and Depth

### Short Updates (50-100 lines)

**When:** Quick announcements, simple features, brief updates

**Structure:** Minimal - greeting, announcement, details, call to action

### Medium Posts (100-300 lines)

**When:** Feature introductions, monthly updates, moderate announcements

**Structure:** Introduction, multiple sections with examples, call to action

### Long Posts (300+ lines)

**When:** Major policy changes, complex explanations, comprehensive guides

**Structure:** TL;DR, detailed sections, examples, postscripts

### Depth Indicators

**Go deep when:**

- Major policy changes affecting different audiences
- Complex technical concepts requiring examples
- Transparency about difficult decisions
- Comprehensive feature explanations

**Stay high-level when:**

- Simple announcements
- Quick updates
- Time-sensitive news
- Pointing to other detailed resources

---

## Red Flags (What to Avoid)

### ❌ Formal Language

- "However", "therefore", "thus", "subsequently"
- "One must", "it is important to note"
- Writing out contractions: "it is", "we are"

### ❌ Overly Confident/Dogmatic

- "You should always..."
- "The best way is..."
- "Never do X" (without nuance)
- Missing hedging entirely

### ❌ Impersonal

- "You will...", "Your code..."
- "The user should..."
- No personal disclosure or vulnerability

### ❌ American English (when writing as Jeremy)

- "color" instead of "colour"
- "optimize" instead of "optimise"
- "very" instead of "quite"

---

## Quick Reference Checklist

### Structure

- [ ] Clear ## and ### header hierarchy
- [ ] Opening greeting ("Hi everyone!")
- [ ] Introduction with context/excitement
- [ ] Main content in organized sections
- [ ] TL;DR if post is long or affects multiple audiences
- [ ] "Get Involved" or similar action section
- [ ] Conclusion with gratitude

### Formatting

- [ ] **Bold** for key terms and emphasis (10-20 instances)
- [ ] Bulleted or numbered lists for clarity (3-5 lists)
- [ ] Code blocks with syntax highlighting (if technical)
- [ ] Links embedded naturally [descriptive text](URL)
- [ ] 0-3 emoji for personality (usually closing)
- [ ] Horizontal rules for major section breaks (if needed)

### Voice

- [ ] Use contractions (it's, we're, I'm)
- [ ] British English (quite, optimising)
- [ ] Inclusive "we/our" language
- [ ] Some hedging (I think, probably) but less than transcripts
- [ ] Genuine enthusiasm and excitement
- [ ] Vulnerability and honesty about challenges
- [ ] Specific numbers and concrete examples

### Engagement

- [ ] Clear call to action
- [ ] Multiple participation pathways (if applicable)
- [ ] Email addresses or forum links
- [ ] Express gratitude to community
- [ ] "Thanks for reading" (usually with emoji)
- [ ] Forward-looking statement about future

### Opening Uses One or More of:

- [ ] Direct greeting
- [ ] Excitement statement
- [ ] Time/context setting
- [ ] Reference to previous post/context
- [ ] Problem/opportunity framing

### Closing Includes:

- [ ] Call to action
- [ ] Gratitude
- [ ] Forward-looking statement
- [ ] Expression of impact/values

---

## Examples from Actual Posts

### Example 1: Opening

```markdown
# Bootcamp

Hi everyone!

I'm really excited to let you know that from January 2025, we're going to be
running a **[Learn to Code Bootcamp](https://bootcamp.exercism.org)**!

## Some background

I've been wanting to help total beginners for a long time.
As I mentioned in the "[2M users but no money in the bank](link)" blog post in September,
over 95% of people who try to learn to code give up, which I find unacceptable.
```

**Breakdown:**

- ✅ Direct greeting
- ✅ Excitement statement with bold
- ✅ Link embedded naturally
- ✅ Reference to previous post
- ✅ Problem framing with specific statistic

### Example 2: Call to Action

```markdown
## Get involved

Over the next few weeks, you'll start to see the Dig Deeper tab appearing
across exercises around the site.

If you'd like to contribute an Approach, an exercise article, or tell us about
your videos so we can add them, get in touch with jonathan@exercism.org and
he'll help you get started.

And finally, tell us what you think and post your ideas and thoughts in the
forum post!
```

**Breakdown:**

- ✅ Clear header
- ✅ What's happening (context)
- ✅ How to participate (email)
- ✅ Multiple engagement paths
- ✅ Specific person named for contact

### Example 3: Closing

```markdown
## Conclusion

I'm really, **really** excited for this.
I hope it'll help a ton of people, help us refine a product I've passionate about,
and bring a little money into Exercism to keep us afloat.
It feels like a win win win.

I'll be talking lots more about it over the next few months, but in the meantime,
I'd massively appreciate your support in spreading the word and generating some hype!

Thanks for reading 🙂
```

**Breakdown:**

- ✅ Genuine enthusiasm with bold emphasis
- ✅ Impact statement (helps people + refines product + brings money)
- ✅ Forward-looking (next few months)
- ✅ Specific request (spread word, generate hype)
- ✅ Gratitude with emoji
