# Script Writing Style Guide

This guide documents how to write educational video scripts for Jiki lessons. These are production scripts that combine narration with detailed animation and production cues.

**Key principle**: These are production documents for a video team, not transcripts of what Jeremy would say live. They need to be tighter, more structured, and more directive than conversational teaching.

---

## Script vs. Transcript: Critical Differences

### Transcripts (what NOT to write)
- Conversational, meandering flow
- "And then... and so... and now let's..."
- Narrated pauses: "Just take a second to think about this..."
- Everything explained through speech
- Long, comprehensive coverage of multiple concepts
- Stream of consciousness teaching style

### Scripts (what TO write)
- Structured, modular sections
- Production cues and timing marks
- Production pauses: `[Pause for 2 seconds]`
- Visual and audio working together
- Focused on ONE core concept per lesson
- Intentionally designed instruction

**Remember**: Live teaching transcripts (like variables.txt) show Jeremy's teaching PHILOSOPHY and VOICE. Scripts should capture that philosophy in a tighter, production-ready format.

---

## Format Markers

Use specific production markers to indicate what should happen on screen:

### `[TALKING HEAD]`
- Jeremy speaking directly to camera
- Use for: concept introductions, transitions, conclusions
- Keep segments short (30-60 seconds)

### `[ANIMATION: detailed description]`
- Animated scene with voiceover
- **Must include**:
  - Specific scene setting: `[ANIMATION: Jiki in a coffee shop...]`
  - Character dialogue in quotes: `"Hi, what's your name"` `"I'm Sarah"`
  - Camera directions: `Close up on Jiki`, `Pan across shelves`, `Zoom in to box`
  - Timing jumps: `5 days later...`, `Meanwhile...`
  - Emotional/visual beats: `Jiki sweating`, `question mark in thought bubble`, `face goes red`
  - UI elements: `(put this as instruction in top right)`
  - Enough detail for animator to execute without guessing

### `[CODE BLOCK]`
- Code displayed on screen with voiceover explanation
- Always use proper markdown code blocks with language
- Include comments in the code itself
- Show progressive examples (don't show everything at once)

### `[SLIDE]`
- Presentation-style slide with text/bullets
- Specify what appears and when: `[SLIDE to the RHS with three bullet points appearing]`
- Use for: lists, key concepts, structured information

### Production Notes
- `[Pause for X seconds]` - Silent pause for thinking
- `[Machine should have speech bubble...]` - Implementation details
- `[Show X, then Y]` - Sequencing instructions

**Bad example:**
```
[ANIMATION: Jiki does some stuff with boxes]
```

**Good example:**
```
[ANIMATION: Jiki in his warehouse. He writes "Sarah" on paper, gets an empty box, writes "name" on the label, puts paper in box, places box on shelf. Close up on the box showing the label clearly.]
```

---

## Lesson Structure

### Start High-Level, Then Zoom In

1. **Concept First** - What is this about in human terms?
2. **Relatable Problem** - Human experience everyone understands
3. **Solution** - How we solve it in real life
4. **Technical Metaphor** - How the computer does it
5. **Syntax** - The actual code
6. **Practice** - Active learning check

**Example from variables script:**
1. Concept: Memory - computers need to remember things
2. Problem: Forgetting someone's name at a coffee shop (embarrassing!)
3. Solution: Writing it down on paper
4. Metaphor: Jiki's boxes and shelves
5. Syntax: `let name = "Sarah"`
6. Practice: "Take a moment to imagine what Jiki will do..."

### Keep Lessons Focused and Modular

- **One lesson = One core concept**
- Don't try to cover everything
- End with a promise: "We'll come back and look at how we update variables..."
- Better to have 3 short focused lessons than 1 comprehensive one
- Each section should be self-contained (2-3 minutes max)

**Bad scope**: Creating variables, changing variables, using variables, relationships, complex examples
**Good scope**: Creating variables and using them (save changing for next lesson)

---

## Active Learning Pattern

Use this pattern to engage learners:

1. **Challenge**: Pose a question or thinking task
2. **Pause**: Give explicit time to think
3. **Reveal**: Show the answer/explanation

**Template:**
```
What will happen when he processes the second line of code?

[Pause for a couple of seconds]

It's going to involve both a box and a machine. Think about how they'll work together...

[Pause for a couple of seconds]

OK, so he'll go to the shelves and tries to find a box with the label of "name"...
```

**Not this** (passive explanation):
```
And I want you to really think about what's happening here. Just visualize Jiki
going to the shelves. He's finding the box. He's getting the value out. And then
he's using the greet machine...
```

### Challenge Types
- "Take a moment to imagine what Jiki will do..."
- "What do you think happens next?"
- "Did you get it right?"
- Always follow with `[Pause]` marker, then reveal

---

## Narration Style

### Brevity Over Verbosity

Scripts should be **tighter** than live teaching transcripts.

**Transcript style (too verbose):**
```
And I really want you to understand this, because this is quite crucial. The box
can only hold one thing at a time. So, when we change what's in the box, the old
value gets taken out and thrown away. It's gone forever. And I really want you to
get this, because...
```

**Script style (tighter):**
```
It's very important here to understand that the box can only hold one thing at a
time. When we change it, the old value gets thrown away. It's gone forever.
```

### Use Production Notes, Not Narrated Instructions

**Don't narrate timing:**
- ❌ "Just take a second now and really think that through..."
- ✅ `[Pause for 2 seconds]`

**Don't narrate what's visible:**
- ❌ "You can see on the screen here that..."
- ✅ `[CODE BLOCK]` with code shown

**Don't over-explain what animation shows:**
- ❌ "And you'll see Jiki walking over to the shelf, and he's looking at the boxes, and he's reading the labels..."
- ✅ "Jiki finds the box labeled 'name'" + `[ANIMATION: Jiki at shelves, scanning labels, pulling out "name" box]`

### Maintain Jeremy's Voice (But Tighter)

**Keep from Jeremy's style:**
- Conversational tone (not formal)
- British English naturally (quite, a bit, whilst)
- Some hedging, but less than live teaching
- Inclusive "we/our" language
- Warmth and encouragement
- Personal experience when relevant

**Example - Right balance:**
```
Memory is one of the most important concepts in programming. In the old days we had
to do a lot of very manual work to save things for later, but now-a-days it's pretty
straightforward. You just need to understand a few concepts, and you'll be set!
```

This is conversational and encouraging (Jeremy's voice) but direct and efficient (script style).

---

## Code Presentation

### Progressive Examples

Show code building up, not all at once.

**Step 1 - Create:**
```javascript
// Remember something
let name = "Sarah"
```

**Step 2 - Use:**
```javascript
// Remember something
let name = "Sarah"

// Use a greet function to say hello to
// someone using their name.
greet(name)
```

**Step 3 - Variation:**
```javascript
// Remember something
let cute_red_cat = "Sarah"

// Use a greet function to say hello to
// someone using their name.
greet(cute_red_cat)
```

### Code Block Format

Always use:
- Proper markdown code blocks with language specified
- Comments explaining what's happening
- Meaningful variable names (unless demonstrating a point)
- Simple, clear examples
- One concept per code block

```javascript
// Good - clear, commented, simple
let name = "Sarah"
greet(name)
```

Not:
```javascript
// Bad - too much at once, no comments
let name = "Sarah"
let age = 25
let city = "London"
greet(name)
console.log(age)
if (city === "London") { ... }
```

---

## Animation Descriptions

### Include Specific Details

Animators need concrete direction. Don't leave them guessing.

**Too vague:**
```
[ANIMATION: Jiki does something with a box]
```

**Better:**
```
[ANIMATION: Jiki gets a piece of paper and writes "Sarah" on it. Then he gets an
empty box and writes "name" on the label. He puts the paper in the box and places
it on the shelf.]
```

**Even better (with emotional beats):**
```
[ANIMATION: Jiki in a coffee shop. Asks name. "Hi, what's your name". "I'm Sarah".
Jiki writes down Sarah and puts it in his pocket then says "Hi Sarah".

JUMP: 5 days later.

Sarah says "Oh, hi again Jiki!". Jiki says "Oh hi...". Close up on Jiki getting
the paper out of his pocket, checking it, looking relieved, then saying "...Sarah!"]
```

### Dialogue in Animations

- Use quotes for specific dialogue: `"Hi, what's your name"`
- Keep it simple and natural
- Show, don't just describe: `Sarah says "X"` not `Sarah tells him her name`

### Camera and Visual Directions

Specify:
- **Camera work**: `Close up on`, `Pan across`, `Zoom in to`
- **Emotional states**: `Jiki sweating`, `looking relieved`, `confused expression`
- **Visual effects**: `question mark in thought bubble`, `face goes red`, `speech bubble saying "Hello, Sarah!"`
- **UI elements**: `(put this as instruction top right)`, `[Show code on left side of screen]`
- **Timing**: `[Pause for 2 seconds]`, `5 days later...`

---

## Section Structure

### Use Numbered Sections with Clear Headers

```markdown
## Section 1: Opening - Real World Memory

[TALKING HEAD]

Narration here...

## Section 2: Introduction

[TALKING HEAD]

Narration here...

## Section 3: Saving/Retrieving Warehouse

[ANIMATION: ...]

Narration here...
```

### Typical Lesson Flow

1. **Opening** - Hook with relatable problem/concept
2. **Introduction** - What we'll learn (numbered list)
3. **Core Teaching** - 2-4 focused sections on the concept
4. **Practice/Quiz** - Active learning check
5. **Conclusion** - Validation, reassurance, what's next

### Section Length

- Talking head segments: 30-60 seconds
- Animation segments: 1-2 minutes
- Code explanations: 1-2 minutes
- Total lesson: 5-10 minutes max
- If you need more, split into multiple lessons

---

## Teaching Principles (From teaching.md)

### Apply These, But In Script Format

1. **Concrete Mental Models**
   - Use the warehouse metaphor consistently
   - But show it visually, don't over-narrate it

2. **Before/After State**
   - "Right now, there's nothing on the shelves..."
   - "After this line, there's a box labeled 'name' with 'Sarah' inside"
   - Keep it brief

3. **Simplicity Advocacy**
   - One concept at a time
   - Don't mention advanced topics
   - "It's very important here to understand..." (then one clear point)

4. **Empathetic Transparency**
   - "Nearly everyone misses a little step when they're thinking about this at first"
   - "With practice your visualization will get really good"
   - Validate struggle, encourage practice

5. **Deliberate Pacing**
   - Use `[Pause]` markers
   - Challenge → Pause → Reveal pattern
   - Don't rush through concepts

6. **Metacognitive Scaffolding**
   - "When you see the word 'let', think: 'We're making a new box'"
   - Teach the internal narrative
   - Make thinking visible through the challenge-reveal pattern

---

## Common Mistakes to Avoid

### ❌ Writing Like a Transcript
```
So, let's start by thinking about something that happens in everyday life. And I
really want you to sort of imagine this. Imagine Jiki is at a party, right, and
he meets someone new. And he asks them their name, and they say, "Hi, I'm Sarah."
And Jiki thinks, okay, I want to remember this for later...
```

### ✅ Writing Like a Script
```
[TALKING HEAD]

In this lesson, we're starting to look at the idea of memory.

[ANIMATION: Jiki at a party meeting someone. "Hi, what's your name" "I'm Sarah"]

Imagine you're at a party, and someone tells you their name...
```

### ❌ Over-Explaining Visuals
```
And you'll see on the screen here that Jiki is walking over to the shelf, and he's
looking at all the different boxes, reading each label one by one, and then he finds
the one that says "name" and he picks it up...
```

### ✅ Trusting Animation + Concise Narration
```
Jiki finds the box labeled "name".

[ANIMATION: Jiki at shelves, scanning labels, pulling out "name" box]
```

### ❌ Trying to Cover Everything
Lesson includes: creating variables, changing variables, using variables, variable scope, naming conventions, const vs let, template literals, etc.

### ✅ Focused Scope
Lesson covers: What variables are (boxes), how to create them (`let`), how to use them. Ends with: "In the next lesson, we'll look at how to change variables!"

### ❌ Passive Explanation
```
And I want you to really visualize this. Jiki is going to the box, and he's opening
it up, and he's taking out the paper with Sarah on it, and he's throwing that away,
and then he's writing Ahmed on a new piece of paper...
```

### ✅ Active Learning
```
What will Jiki do when he sees this line of code?

[Pause for 2 seconds]

He'll find the box labeled "name", open it up, take out "Sarah", and throw it away.
Then he'll write "Ahmed" on fresh paper and put that in instead.
```

---

## Checklist for a Good Script

Before submitting a script, verify:

### Structure
- [ ] Numbered sections with clear headers
- [ ] Starts with high-level concept before technical details
- [ ] One focused teaching goal (not trying to cover everything)
- [ ] Modular sections (each 1-3 minutes)
- [ ] Total length appropriate (5-10 minutes)

### Format
- [ ] Specific markers: `[TALKING HEAD]`, `[ANIMATION: detailed]`, `[CODE BLOCK]`, `[SLIDE]`
- [ ] Animation descriptions include enough detail (dialogue, camera, emotions, timing)
- [ ] Production notes use brackets `[Pause for X seconds]`, not narration
- [ ] Code blocks properly formatted with comments

### Teaching
- [ ] Uses active learning pattern (challenge → pause → reveal)
- [ ] Includes practice/quiz moment
- [ ] Maintains concrete metaphor (warehouse/boxes)
- [ ] Validates struggle and encourages practice
- [ ] Teaches internal narrative ("When you see X, think Y")

### Style
- [ ] Tighter than transcript (not verbose)
- [ ] Conversational but direct (Jeremy's voice, script format)
- [ ] Trusts visuals (doesn't over-narrate what's shown)
- [ ] British English natural
- [ ] Inclusive "we" language

### Scope
- [ ] One core concept, well-taught
- [ ] Doesn't go too deep too fast
- [ ] Ends with clear next step or promise
- [ ] Could be followed by related focused lessons

---

## Example: Good Script Opening

```markdown
## Section 1: Opening - The Problem

[TALKING HEAD]

In this lesson, we're starting to look at the idea of memory.

A computer's memory is just like our memory! If we want to be able to retrieve
some piece of information later, we need to be able to remember it in the first place.

[ANIMATION: Jiki in a coffee shop. "Hi, what's your name?" "I'm Sarah." "Hi Sarah!"

JUMP: 5 days later.

Sarah: "Oh, hi again Jiki!" Jiki: "Oh hi..." Close up on Jiki sweating with question
mark in thought bubble. Face goes red.]

Imagine you're at a coffee shop, and someone tells you their name. It sort of
magically floats into our brain and stays there... Or maybe it doesn't - maybe we
really wanted to remember that name, but we forgot it...

[ANIMATION: Same scene replayed. But this time Jiki writes "Sarah" on paper and
puts it in his pocket. 5 days later, when he sees Sarah, he pulls out the paper,
checks it, looks relieved, then says "...Sarah!"]

When we're coding, we don't have this problem. In computer land, when someone tells
us their name, we always write it down and keep it for later. When we need it again,
we find the piece of paper we wrote it on, and get the answer for definite.

Rather than relying on the magic of our brains, we actively tell the computer to
keep a record of everything. It's a little less magical than our brains, but a lot
more reliable!

## Section 2: Introduction

[TALKING HEAD]

Memory is one of the most important concepts in programming. In the old days we had
to do a lot of very manual work to save things for later, but now-a-days it's pretty
straightforward. You just need to understand a few concepts, and you'll be set!

[SLIDE to the RHS with three bullet points appearing]

We need to know three things:
1. How to remember things
2. How to retrieve things we know
3. How to change the things we know
```

This opening:
- ✅ Starts with concept (memory)
- ✅ Uses relatable problem (forgetting a name)
- ✅ Shows solution before technical detail
- ✅ Specific animation descriptions with dialogue and camera work
- ✅ Tight narration that trusts the visuals
- ✅ Sets up clear learning objectives
- ✅ Jeremy's voice but script-appropriate

---

## Summary

**Write scripts, not transcripts.**

- **Structured** (numbered sections, clear markers)
- **Visual** (detailed animation cues, trust the visuals)
- **Focused** (one concept per lesson)
- **Active** (challenge → pause → reveal)
- **Tight** (conversational but efficient)
- **Directive** (production document for a team)

Apply Jeremy's teaching philosophy, but in a production-ready format.
