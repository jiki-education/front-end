---
name: write-blog-post
description: Write a blog post in Jeremy's voice following Jiki's tone guidelines
argument-hint: [topic or title]
disable-model-invocation: true
---

# Write Blog Post

You are helping write a blog post for Jiki in Jeremy's voice. Follow these phases in order.

**Topic**: $ARGUMENTS

---

## Phase 1: Load Context

Before doing anything else, read these files to understand the writing style and post format:

1. **Tone of Voice Guide** (REQUIRED):

   ```
   Read: front-end/content/.context/tone-of-voice.md
   ```

2. **Example Blog Post**:

   ```
   Read: front-end/content/src/posts/blog/the-backstory-of-jiki/en.md
   Read: front-end/content/src/posts/blog/the-backstory-of-jiki/config.json
   ```

3. **Frontmatter Schema**:
   ```
   Read: front-end/content/.context/frontmatter.md
   ```

After reading these files, confirm to the user that you've loaded the context and understand the tone (British calm, hedging, contractions, inclusive "we" language, etc.).

---

## Phase 2: Gather Information

Ask the user to provide as much detail as possible about the blog post. Use the AskUserQuestion tool or direct questions.

### Initial Questions

Ask about:

- **What is this post announcing or explaining?** (Be specific - a new feature, an update, a milestone, a reflection?)
- **What's the story behind this?** (The journey, the decisions made, what was learned along the way - this often produces the most compelling content)
- **Who is the primary audience?** (Existing users, potential learners, the broader community?)
- **What's the core theme?** (e.g., social mobility, making coding accessible, learning by doing)
- **Is there a call to action?** (Sign up, try something, give feedback, spread the word?)

### Follow-up Questions

Based on their answers, ask clarifying questions until you have a clear picture:

- **The journey**: What challenges did you face? What did you learn? What surprised you?
- **Decisions**: What key decisions were made and why? (e.g., pricing, technical choices, scope)
- **Different audiences**: Will the CTA differ for different readers? (e.g., beginners vs experienced devs)
- If announcing a feature: What problem does it solve? How does it work?
- If sharing news: What's the backstory? Why does it matter?
- What tone feels right? (More excited? More reflective? More technical?)

**Keep asking until you feel confident you understand what they want. The best posts come from understanding the full story, not just the announcement.**

---

## Phase 3: Agree on Structure

Based on the information gathered, propose an outline. **Let the story drive the structure** rather than forcing a generic template. A typical structure might be:

```markdown
## Proposed Structure

1. **Opening** - [Greeting + excitement/context]
2. **Background** - [Why this matters / the story behind it]
3. **Main Content** - [The details, broken into logical sections]
4. **Get Involved / Call to Action** - [What readers can do]
5. **Conclusion** - [Forward-looking + gratitude]
```

But the actual structure should emerge from the user's story. For example, "The Backstory of Jiki" used:

- Before Jiki, there was Exercism (the problem)
- Jiki's Journey to fruition (with subsections: experience, bootcamp, foot-guns, i18n, freemium)
- What Jiki is and where I want it to go
- Give it a try

**Key principle**: Identify the core theme early (e.g., social mobility) and ensure later sections connect back to it.

Present the proposed structure with brief notes on what each section will cover.

**Ask the user to approve or suggest changes before writing.**

---

## Phase 4: Write the Post

Once the structure is approved, write the blog post.

### File Structure

Create a new directory with a kebab-case slug based on the title:

```
front-end/content/src/posts/blog/[slug]/
├── config.json
└── en.md
```

### config.json Format

```json
{
  "date": "YYYY-MM-DD",
  "author": "ihid",
  "featured": false,
  "coverImage": "/images/blog/[slug].jpg"
}
```

- Use today's date
- Author is typically "ihid" (Jeremy)
- Set `featured` based on importance (ask if unsure)
- Note: The coverImage path is a placeholder - the user will need to add the actual image

### en.md Format

```markdown
---
title: "Post Title Here"
excerpt: "1-2 sentence summary that captures the essence of the post"
tags: ["relevant", "tags", "here"]
seo:
  description: "SEO meta description (150-160 characters)"
  keywords: ["keyword1", "keyword2", "keyword3"]
---

[Blog post content following the tone-of-voice guidelines]
```

### Writing Checklist

When writing, ensure you:

**Voice**

- [ ] Use contractions (it's, we're, I'm)
- [ ] Use British English (quite, optimising)
- [ ] Use inclusive "we/our" language (say we not I unless it REALLY is just about me)
- [ ] Include some hedging (I think, probably)
- [ ] Show genuine enthusiasm
- [ ] Be honest about challenges
- [ ] Use short, punchy emotional statements where appropriate (e.g., "And that sucks.")

**Structure**

- [ ] Open with greeting ("Hi everyone!")
- [ ] Use clear ## and ### headers
- [ ] Include **bold** for key terms (10-20 instances)
- [ ] Use lists for clarity
- [ ] Connect later sections back to the core theme established early
- [ ] End with call to action
- [ ] Close with gratitude ("Thanks for reading 🙂")

**Calls to Action**

- [ ] Consider different audiences and acknowledge them honestly
- [ ] Example: "If you're a beginner, I hope you enjoy this - tell me where you get stuck"
- [ ] Example: "If you're an experienced dev, this isn't designed for you - it'll feel basic and slow. But for newbies it feels fast and intense!"
- [ ] This honest acknowledgment of different audiences is distinctive and builds trust

**Formatting**

- [ ] Links embedded naturally [text](URL)
- [ ] Code blocks with syntax highlighting if needed
- [ ] 0-3 emoji maximum
- [ ] TL;DR at top if post is long

---

## After Writing

1. Show the user the complete post
2. Ask if they want any changes
3. Remind them to:
   - Add a cover image to `/images/blog/`
   - Update the `coverImage` path in config.json
   - Review and adjust tags/SEO as needed
