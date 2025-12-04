# Blog Writing Style: Structure, Format & Engagement

This guide documents Jeremy's written blog voice - how he structures posts, uses formatting, opens/closes, and engages readers. While his core linguistic patterns remain consistent across all formats, his blog writing shows distinct structural and organizational patterns optimized for the written medium.

**Sources:**
Analysis of 15+ blog posts from the Exercism blog (2019-2024), including:
- bootcamp.md - Announcement with community calls to action
- dig-deeper.md - Feature introduction with examples
- freeing-our-maintainers.md - Transparent community update with TL;DR
- mechanical-march.md - Technical content with education focus
- september-2024-restructure.md - Business update
- exercism-v3-has-launched.md - Major announcement
- And 9 others covering various contexts

---

## Purpose

This guide complements [speaking.md](speaking.md) and [teaching.md](teaching.md), which document Jeremy's voice from transcript analysis. Use this when writing:
- Blog posts
- Announcements
- Feature introductions
- Community updates
- Technical articles

**Key distinction:** Transcripts capture spontaneous spoken patterns; blogs show how Jeremy adapts his voice to structured written communication while maintaining authenticity.

---

## Key Differences from Spoken Voice

While Jeremy's core voice remains consistent, blog writing differs from transcripts in several ways:

### Similarities (Maintained)
- ✅ British English (quite, whilst, a bit, loads of)
- ✅ Contractions everywhere (it's, we're, I'm)
- ✅ Inclusive "we/our" language
- ✅ Emotional honesty and vulnerability
- ✅ Enthusiasm and genuine excitement
- ✅ Concrete examples and specific numbers
- ✅ Community focus and gratitude

### Differences (Adapted for Writing)
- **More structured** - Clear headings and organized sections vs stream-of-consciousness
- **Less hedging** - Still present but reduced ("I think", "maybe") compared to frequent spoken hedging
- **More declarative** - Stronger statements while maintaining warmth
- **Fewer fillers** - Less "so yeah", "I don't know", "sort of" than in transcripts
- **Strategic formatting** - Intentional use of bold, lists, code blocks, links
- **Deliberate pacing** - Section breaks and headers control flow vs verbal pauses
- **Action-oriented** - Explicit calls to action and participation pathways

---

## Structure Patterns

### Section Organization

Blog posts typically follow clear organizational patterns:

**Standard structure:**
1. **Opening greeting** - "Hi everyone!" / "Hey everyone!"
2. **Introduction** - Context, excitement, preview
3. **Background** (if needed) - "Some background"
4. **Main content** - Details, examples, explanations
5. **Get Involved / Take Action** - How readers can participate
6. **Conclusion** - Gratitude, forward-looking, closing thoughts

**Example from bootcamp.md:**
```markdown
# Bootcamp

Hi everyone!

[Opening excitement]

## Some background
[Context setting]

## Some details
[Main content]

## Help by spreading the word
[Action 1]

## Help by mentoring
[Action 2]

## Conclusion
[Closing thoughts]
```

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

**Example from freeing-our-maintainers.md:**
```markdown
_TL;DR; We're spending a few months redesigning our volunteering model and
giving our key volunteers a break from the work of reviewing community contributions.
If you use Exercism purely to learn or mentor, there's nothing here you need to know
(although please read if you're interested!).
If you are a track maintainer, wish to contribute to Exercism, or wish to report a
bug/problem, then consider this essential reading 🙂_
```

**When to use:**
- Posts over 100 lines
- Posts with policy changes affecting different audiences
- Technical posts where some readers may want just the summary

**Format:** Italic text, 2-4 sentences, audience-specific guidance

### Horizontal Rules

Use `---` to separate major sections or create visual breaks:

```markdown
## Introduction
[Content]

---

## Main Content
[Content]
```

**When to use:** Between major conceptual shifts, after introductions, before postscripts

---

## Opening Techniques

Blog posts typically use one or more of these opening patterns:

### 1. Direct Community Greeting

Start with warm, direct address:

**Examples:**
- "Hi everyone!"
- "Hey everyone! How's your #12in23 going?"
- "Hello. Welcome."

**Usage:** Nearly every post opens this way. Sets conversational tone immediately.

### 2. Excitement Statement

Express genuine enthusiasm about the content:

**Examples:**
- "I'm really excited to let you know that..."
- "We're **really** excited..."
- "I'm really, **really** excited for this."

**Pattern:** "I'm/We're [really/so] excited to [announce/share/tell you]..."

**Formatting note:** Often includes **bold** for emphasis on "really"

### 3. Time/Context Setting

Establish when and why this post matters:

**Examples:**
- "from January 2025, we're going to be running..."
- "This week we've launched the new..."
- "At the start of September 2021..."
- "Just over 12 months ago..."

**Usage:** Grounds the post in specific moment, creates urgency or timeline awareness

### 4. Reference to Previous Context

Connect to earlier posts or ongoing narratives:

**Examples:**
- "As I mentioned in the '[Post Title](link)' blog post in September..."
- "Following on from [previous announcement]..."
- "You might remember that..."

**Pattern:** Include actual links to previous posts, maintaining narrative continuity

### 5. Problem/Opportunity Framing

Open by establishing what challenge or opportunity the post addresses:

**Example from bootcamp.md:**
> "I've been wanting to help total beginners for a long time. As I mentioned in the '2M users but no money in the bank' blog post in September, over 95% of people who try to learn to code give up, which I find unacceptable."

**Pattern:** Personal motivation + problem statement + why it matters

### 6. Direct Statement of News

Simply state what's new:

**Example from dig-deeper.md:**
> "Solving an exercise on Exercism is just the first step. The real learning comes next!
>
> This week we've launched the new 'Dig Deeper' tab on exercises..."

**Pattern:** Hook statement + specific announcement

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

**Example from bootcamp.md:**
> "I'm really, **really** excited for this."

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

Use for technical content:

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

**Example from dig-deeper.md:**
> "However! Having designed the exercises, and mentored hundreds of thousands of people through them, our team have a pretty good idea..."

### Within Sections

**Sequential:**
- "So firstly...", "We also have...", "Finally..."
- "The first thing...", "The second thing..."

**Additive:**
- "And finally..."
- "We've also got..."
- "On top of that..."

**Example from mechanical-march.md:**
> "So firstly, the featured languages... We also have five featured exercises... We've also got lots of fun things bubbling away..."

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

**Example from dig-deeper.md:**
> "If you'd like to contribute an Approach, an exercise article, or tell us about your videos so we can add them, get in touch with jonathan@exercism.org and he'll help you get started.
>
> And finally, tell us what you think and post your ideas and thoughts in the forum post!"

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

**Examples:**
- "I'll be talking lots more about it over the next few months"
- "We're incredibly excited about what's coming next"
- "I hope it'll help a ton of people"
- "It feels like a win win win."

**Pattern:** Expresses optimism and ongoing commitment

### Expression of Values/Impact

Restates why this matters or core mission:

**Example from bootcamp.md:**
> "I hope it'll help a ton of people, help us refine a product I've passionate about, and bring a little money into Exercism to keep us afloat. It feels like a win win win."

**Pattern:** Personal investment + community benefit + practical outcomes

---

## Title Patterns

Blog post titles follow clear conventions:

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

**Patterns:**

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

**Example from bootcamp.md:**
> "There are two ways that you can help!"

Then outlines each pathway with details

### Feedback Requests

Explicitly ask for reader input:

- "tell us what you think"
- "post your ideas and thoughts in the forum"
- "If you've any thoughts, please start a topic on the forum!"

**Pattern:** Makes participation feel valued and accessible

### Recognition and Gratitude

Name specific contributors and community members:

**Examples:**
- "Thanks to our community of maintainers..."
- "Thank you as well to Bobahop for complaining loudly enough"
- "happy birthday to Aaron"

**Pattern:** Specific recognition builds community connection

### Affiliate/Incentive Programs

When relevant, include participation incentives:

**Example from bootcamp.md:**
> "We're setting up an affiliate scheme where your friends or followers can get a 20% discount, and you get a 20% 'commission' on the sale..."

---

## Length and Depth

### Short Updates (50-100 lines)

**When:** Quick announcements, simple features, brief updates

**Structure:** Minimal - greeting, announcement, details, call to action

**Example:** "sorry-for-the-wait.md" (6 lines)

### Medium Posts (100-300 lines)

**When:** Feature introductions, monthly updates, moderate announcements

**Structure:** Introduction, multiple sections with examples, call to action

**Examples:** bootcamp.md (73 lines), dig-deeper.md (84 lines)

### Long Posts (300+ lines)

**When:** Major policy changes, complex explanations, comprehensive guides

**Structure:** TL;DR, detailed sections, examples, postscripts

**Example:** freeing-our-maintainers.md (116 lines with Postfix section)

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

## Voice Consistency Patterns

While adapted for writing, blogs maintain Jeremy's core voice:

### Still Present

- **Contractions:** "I'm", "we're", "it's" (never "I am", "we are", "it is")
- **British English:** "optimising", "programme", "realisation"
- **Some hedging:** "I think", "probably", "quite" (but less than transcripts)
- **Conversational:** "So yeah", "I guess", "to be honest" (sparingly)
- **Enthusiasm:** Exclamation marks, bold emphasis, genuine excitement
- **Vulnerability:** Shares struggles and limitations openly

**Example from freeing-our-maintainers.md:**
> "We've historically tried to build Exercism with an Open Source Software (OSS) model of having maintainers who review contributions from the wider community. This has caused us a lot of problems and caused frustration for both maintainers and contributors."

**Note:** Honest about problems without being overly hedged

### Adapted for Writing

- **Fewer fillers:** Less "so yeah", "I don't know", "sort of" than spoken
- **More structured:** Clear sections vs stream-of-consciousness
- **Stronger statements:** More declarative, less tentative
- **Strategic pauses:** Headers and sections vs verbal pauses
- **Polished:** Edited for clarity while maintaining authenticity

---

## Examples from Actual Posts

### Example 1: Opening (from bootcamp.md)

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

### Example 2: List Usage (from mechanical-march.md)

```markdown
Pros:
- Faster startup (no JIT compilation step)
- Smaller memory footprint (no runtime being loaded...)

Cons:
- Not portable. Bytecode is portable...
```

**Breakdown:**
- ✅ Clear pros/cons format
- ✅ Technical but accessible language
- ✅ Bulleted for scannability

### Example 3: Call to Action (from dig-deeper.md)

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

### Example 4: Closing (from bootcamp.md)

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

---

## Quick Reference Checklist

When writing a blog post as Jeremy:

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
- [ ] British English (quite, whilst, optimising)
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

## How This Complements Other Style Guides

**Use together:**

1. **writing.md** (this file) → Structure, formatting, organization
2. **speaking.md** → Linguistic patterns, word choices, sentence construction
3. **teaching.md** → Pedagogical approach (for educational blog posts)
4. **principles.md** → Quick reference for all contexts

**For a blog post:**
- Start with writing.md for overall structure and formatting
- Reference speaking.md for sentence-level voice patterns
- Add teaching.md principles if content is educational
- Use principles.md for quick checklist review

---

## Summary

Jeremy's blog writing maintains his authentic voice while adapting to the written medium through:

1. **Clear structure** - Headers, sections, organized flow
2. **Strategic formatting** - Bold, lists, code, links, minimal emoji
3. **Strong opening** - Greeting + excitement + context
4. **Actionable closing** - Multiple CTAs + gratitude + forward-looking
5. **Community focus** - Participation pathways, recognition, accessibility
6. **Maintained authenticity** - Contractions, British English, vulnerability, enthusiasm
7. **Adapted polish** - Less hedging, stronger statements, edited clarity

The result: Blog posts that feel personal and conversational while being well-organized and actionable.
