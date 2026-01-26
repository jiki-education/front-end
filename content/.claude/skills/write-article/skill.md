---
name: write-article
description: Write an evergreen article in Jeremy's voice following Jiki's tone guidelines
argument-hint: [topic or title]
disable-model-invocation: true
---

# Write Article

You are helping write an article for Jiki in Jeremy's voice. Follow these phases in order.

**Topic**: $ARGUMENTS

**Important**: Articles are **evergreen content** - they should be written as if they are true right now and will be updated in the future. Unlike blog posts, they are not point-in-time announcements. Avoid time-specific language like "we just launched", "last week", or "coming soon". Write as if the content is always current.

---

## Phase 1: Load Context

Before doing anything else, read these files to understand the writing style and post format:

1. **Tone of Voice Guide** (REQUIRED):

   ```
   Read: front-end/content/.context/tone-of-voice.md
   ```

2. **Example Article** (for tone and format reference):

   ```
   Read: front-end/content/src/posts/articles/why-is-this-feature-not-implemented/en.md
   Read: front-end/content/src/posts/articles/why-is-this-feature-not-implemented/config.json
   ```

3. **Frontmatter Schema**:
   ```
   Read: front-end/content/.context/frontmatter.md
   ```

After reading these files, confirm to the user that you've loaded the context and understand the tone (British calm, hedging, contractions, inclusive "we" language, etc.).

---

## Phase 2: Gather Information

Ask the user to provide as much detail as possible about the article. Use the AskUserQuestion tool or direct questions.

### Initial Questions

Ask about:

- **What is this article explaining?** (A concept, a how-to guide, a reference document?)
- **Who is the primary audience?** (Total beginners, intermediate learners, potential users?)
- **What are the key points you want to cover?**
- **What should readers be able to do or understand after reading?**
- **Any specific examples, code snippets, or details to include?**

### Follow-up Questions

Based on their answers, ask clarifying questions until you have a clear picture:

- If explaining a concept: What level of prior knowledge should we assume?
- If a how-to guide: What are the steps? What might trip people up?
- If a reference: What's the most important information to highlight?
- What tone feels right? (More instructional? More conversational? More technical?)

**Keep asking until you feel confident you understand what they want.**

---

## Phase 3: Agree on Structure

Based on the information gathered, propose an outline. Articles typically follow a structure like:

```markdown
## Proposed Structure

1. **Introduction** - [What this article covers and who it's for]
2. **Core Content** - [The main explanation, broken into logical sections]
3. **Examples/Details** - [Concrete examples or deeper dives]
4. **Summary/Next Steps** - [Key takeaways and where to go from here]
```

Present the proposed structure with brief notes on what each section will cover.

**Ask the user to approve or suggest changes before writing.**

---

## Phase 4: Write the Article

Once the structure is approved, write the article.

### File Structure

Create a new directory with a kebab-case slug based on the title:

```
front-end/content/src/posts/articles/[slug]/
├── config.json
└── en.md
```

### config.json Format

```json
{
  "date": "YYYY-MM-DD",
  "author": "ihid",
  "featured": false,
  "coverImage": "/images/articles/[slug].jpg"
}
```

- Use today's date (this represents when the article was created, not a publication event)
- Author is typically "ihid" (Jeremy)
- Set `featured` based on importance (ask if unsure)
- Note: The coverImage path is a placeholder - the user will need to add the actual image

### en.md Format

```markdown
---
title: "Article Title Here"
excerpt: "1-2 sentence summary that captures what readers will learn"
tags: ["relevant", "tags", "here"]
seo:
  description: "SEO meta description (150-160 characters)"
  keywords: ["keyword1", "keyword2", "keyword3"]
---

[Article content following the tone-of-voice guidelines]
```

### Writing Checklist

When writing, ensure you:

**Voice**

- [ ] Use contractions (it's, we're, I'm)
- [ ] Use British English (quite, optimising)
- [ ] Use inclusive "we/our" language (say we not I unless it REALLY is just about me)
- [ ] Include some hedging (I think, probably)
- [ ] Be clear and helpful
- [ ] Be honest about complexity or caveats

**Evergreen Content**

- [ ] No time-specific language ("just launched", "last week", "coming soon")
- [ ] Write as if the content is always current
- [ ] Use present tense for facts and features
- [ ] Avoid references to specific dates or events (unless historically relevant)

**Structure**

- [ ] Clear introduction explaining what the article covers
- [ ] Use clear ## and ### headers
- [ ] Include **bold** for key terms (10-20 instances)
- [ ] Use lists for clarity
- [ ] Include examples where helpful
- [ ] End with summary or next steps

**Formatting**

- [ ] Links embedded naturally [text](URL)
- [ ] Code blocks with syntax highlighting if needed
- [ ] 0-3 emoji maximum (less common in articles than blog posts)

---

## After Writing

1. Show the user the complete article
2. Ask if they want any changes
3. Remind them to:
   - Add a cover image to `/images/articles/`
   - Update the `coverImage` path in config.json
   - Review and adjust tags/SEO as needed
