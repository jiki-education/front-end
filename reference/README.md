# Jiki Reference Content Library

This directory contains reference materials for understanding and replicating Jeremy's voice, teaching style, and communication patterns when creating content for Jiki.

## Purpose

When Claude Code generates educational content, blog posts, documentation, or any material for Jiki, it should reference these materials to ensure authentic voice and effective teaching approaches that match Jeremy's established style.

## Directory Structure

```
reference/
├── README.md              # This file
├── CLAUDE.md             # Claude Code usage instructions
│
├── transcripts/          # Source transcripts
│   ├── variables.txt          # JikiScript variables bootcamp session
│   ├── go-course-strings.txt  # Go course strings lesson
│   └── exercism-insiders-*.txt # Community updates
│
├── raw-transcripts/      # Unprocessed source material
│   └── *.txt
│
├── style/                # Style guides extracted from transcripts
│   ├── README.md              # Style guide overview
│   ├── teaching.md            # 14 teaching principles & pedagogy
│   ├── speaking.md            # Linguistic signature & tone
│   ├── writing.md             # Blog writing style & structure
│   ├── scripts.md             # Video script writing guide
│   └── principles.md          # Quick reference checklist
│
├── scripts/              # Production scripts for videos
│   └── variables.md           # Variables lesson script (example)
│
└── generated/            # AI-generated content for review
    └── (content created by Claude for approval)
```

## Quick Start

### For Writing Blog Posts
1. Read `style/writing.md` for structure and formatting
2. Read `style/speaking.md` for linguistic patterns and tone
3. Check `style/principles.md` for quick reference

### For Creating Educational Content
1. Read `style/teaching.md` for pedagogical approach
2. Read `style/speaking.md` for voice and tone
3. Review `transcripts/variables.txt` to see principles in action

### For Writing Video Scripts
1. Read `style/scripts.md` for production script format
2. Review `scripts/variables.md` as an example
3. Apply teaching principles from `style/teaching.md`

### For Understanding Jeremy's Voice
1. Start with `style/README.md` for overview
2. Read `style/speaking.md` for linguistic signature
3. Review actual transcripts to hear the authentic voice

## Key Principles

Jeremy's communication style is characterized by:

- **British English** patterns (whilst, quite, a bit, loads of)
- **Conversational hedging** (I think, maybe, probably, sort of)
- **Inclusive language** ("we" not "you")
- **Emotional honesty** (openly shares difficulty and limitations)
- **Simplicity advocacy** (actively filters complexity)
- **Concrete teaching** (physical metaphors, before/after framing)
- **Patient pacing** (deliberate pauses, anti-rush philosophy)

## Content Types

### Transcripts
Raw source material from live teaching sessions, bootcamp lessons, and community updates. These show Jeremy's authentic voice in different contexts.

**Do not modify transcripts** - they are historical reference material.

### Style Guides
Analyzed patterns extracted from transcripts, organized by:
- **Teaching approach** - How to structure learning
- **Linguistic patterns** - How to sound like Jeremy
- **Writing conventions** - How to format blog posts
- **Script format** - How to write for video production

### Scripts
Production-ready scripts for animated video lessons that apply the style guides in practice.

### Generated Content
Working area for content created by Claude Code before final review and deployment.

## Usage Guidelines

1. **Reference, don't copy** - Use these materials to understand patterns, not to copy verbatim
2. **Context matters** - Different contexts (beginner vs. experienced, teaching vs. community update) require different approaches
3. **Authentic voice** - The goal is to match Jeremy's communication style, not to impersonate
4. **Quality over speed** - Take time to apply the principles thoughtfully

## Contributing

When adding new reference material:

1. **Transcripts** - Add raw transcripts to `raw-transcripts/`, cleaned versions to `transcripts/`
2. **Style analysis** - Update relevant `style/*.md` files with new patterns discovered
3. **Examples** - Add example scripts to `scripts/` directory
4. **Generated content** - Place in `generated/` for review before moving to final location

## See Also

- **[CLAUDE.md](CLAUDE.md)** - Detailed instructions for Claude Code usage
- **[style/README.md](style/README.md)** - Overview of style guides
- **[Parent CLAUDE.md](../CLAUDE.md)** - Monorepo-level instructions
