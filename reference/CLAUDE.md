# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

This is the reference content library for Jiki's frontend monorepo. It contains transcripts, style guides, and example scripts to help Claude generate content that matches Jeremy's voice, teaching style, and communication patterns.

## Structure

```
reference/
├── README.md              # Overview and quick start guide
├── CLAUDE.md             # This file
│
├── transcripts/          # Source transcripts
│   ├── variables.txt          # JikiScript variables bootcamp session
│   ├── go-course-strings.txt  # Go course strings lesson
│   └── exercism-insiders-*.txt # Community updates
│
├── raw-transcripts/      # Unprocessed source material
│
├── style/                # Style guides
│   ├── README.md              # Style guide overview
│   ├── teaching.md            # Teaching philosophy & pedagogy
│   ├── speaking.md            # Linguistic signature & tone
│   ├── writing.md             # Blog writing style
│   ├── scripts.md             # Video script writing guide
│   └── principles.md          # Quick reference
│
├── scripts/              # Production video scripts
│   └── *.md
│
└── generated/            # AI-generated content for review
```

### Content Organization

- **transcripts/** - Verbatim transcripts of teaching sessions and community updates
- **raw-transcripts/** - Unprocessed source material
- **style/** - Analyzed patterns and style guides extracted from transcripts
- **scripts/** - Production-ready scripts for video lessons
- **generated/** - Working area for Claude-generated content before final review

## Working with Reference Content

### Reading Transcripts

Transcript files can be very large (30,000+ tokens). When working with them:

```bash
# Search for specific topics/keywords first
grep -i "keyword" transcripts/*.txt

# Read specific portions using offset/limit with the Read tool
# Example: Read lines 1-100 of a transcript
```

**Transcripts are source material** - Use them to understand authentic voice, but prefer the extracted style guides for practical application.

### Using Style Guides

The `style/` directory contains analyzed patterns extracted from transcripts:

1. **style/teaching.md** - 14 core teaching principles with examples
   - Use when creating educational content or lessons
   - Covers pacing, mental models, scaffolding, etc.

2. **style/speaking.md** - Linguistic signature and tone patterns
   - Use for matching Jeremy's voice at the sentence level
   - Covers word choice, British English, hedging, etc.

3. **style/writing.md** - Blog post structure and formatting
   - Use when writing blog posts or announcements
   - Covers headers, lists, formatting, CTAs, etc.

4. **style/scripts.md** - Video script production format
   - Use when writing scripts for animated lessons
   - Covers format markers, animation cues, active learning patterns

5. **style/principles.md** - Quick reference checklist
   - Use for quick reminders without full context

### Quick Reference by Task

**Writing a blog post:**
```bash
# Read these files in order:
1. style/writing.md    # Structure and formatting
2. style/speaking.md   # Voice and tone
3. style/principles.md # Quick checklist
```

**Creating educational content:**
```bash
# Read these files in order:
1. style/teaching.md   # Pedagogical approach
2. style/speaking.md   # Voice and tone
3. transcripts/variables.txt  # See principles in action
```

**Writing a video script:**
```bash
# Read these files in order:
1. style/scripts.md    # Production format
2. scripts/variables.md # Example script
3. style/teaching.md   # Teaching principles to apply
```

### Use Cases

This reference content should be used when:

1. **Writing blog posts** - Use style/writing.md + style/speaking.md
2. **Creating video scripts** - Use style/scripts.md + style/teaching.md
3. **Generating educational content** - Use style/teaching.md + style/speaking.md
4. **Writing documentation** - Use lighter touch from style/principles.md
5. **Community updates** - Use style/speaking.md for emotional honesty and tone

### Key Characteristics

Jeremy's communication style is characterized by:

- **British English** patterns (whilst, quite, a bit, loads of)
- **Conversational hedging** (I think, maybe, probably, sort of)
- **Inclusive language** ("we" not "you")
- **Emotional honesty** (openly shares difficulty and limitations)
- **Simplicity advocacy** (actively filters complexity)
- **Concrete teaching** (physical metaphors, before/after framing)
- **Patient pacing** (deliberate pauses, anti-rush philosophy)
- **Empathetic transparency** (validates struggle, shares vulnerabilities)

See `style/README.md` for comprehensive overview.

## Important Notes

### Read-Only Content
- **transcripts/** - Do not modify existing transcripts (historical reference)
- **raw-transcripts/** - Do not modify source material
- **style/** - Style guides can be updated as new patterns are discovered

### Editable Content
- **scripts/** - Add new production scripts here
- **generated/** - Working area for new content before review

### General Guidelines
- Transcripts are source material, not executable code
- When citing content, maintain context and accuracy to Jeremy's original message
- Style guides should be updated when new patterns emerge from additional transcripts
- This is part of the larger Jiki monorepo - see parent CLAUDE.md for monorepo structure

## See Also

- **[README.md](README.md)** - Overview and quick start guide
- **[style/README.md](style/README.md)** - Comprehensive style guide overview
- **[Parent CLAUDE.md](../CLAUDE.md)** - Monorepo-level instructions
