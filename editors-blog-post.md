# "The History of the Text Editor" — temporarily disabled

The blog post at `content/src/posts/blog/the-history-of-the-text-editor/` has
been pulled from the site for now. Its files were **not** deleted — only its
entry in the generated content index, and a reference to it from another
piece of content, were removed. Both are captured below so it can be
reinstated later.

## 1. How the post is hidden

`app/scripts/generate-content-cache.js` excludes it by slug via a
`DISABLED_SLUGS` map, so it never makes it into the generated blog index or
gets a static page built:

```js
// Content temporarily pulled from the site without deleting its files. See
// editors-blog-post.md (repo root) for why and how to bring it back.
const DISABLED_SLUGS = {
  blog: ["the-history-of-the-text-editor"]
};
```

used inside `processContentDir`:

```js
const disabledSlugs = DISABLED_SLUGS[type] ?? [];
const slugDirs = fs
  .readdirSync(contentDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !disabledSlugs.includes(d.name));
```

**To re-enable:** delete the `DISABLED_SLUGS` constant (and the
`disabledSlugs` filter clause it feeds, reverting to the original
`.filter((d) => d.isDirectory())`), then run `pnpm run content:generate`.

## 2. Reference removed from the "Using a Code Editor" guide

`content/src/posts/guides/using-a-code-editor/en.md` had a "P.S." pointer to
the post, removed from directly under the introduction paragraph:

```md
(P.S. If you want the longer story of the history of text editors from punch cards to today, I wrote about [the history of the text editor](/blog/the-history-of-the-text-editor)).
```

`content/src/posts/guides/using-a-code-editor/hu.md` had the equivalent line,
removed from just above the "## The one we recommend" heading:

```md
If you want the longer story of how these tools came to be, we wrote about [the history of the text editor](/blog/the-history-of-the-text-editor).
```

**To re-enable:** re-add the relevant line back into each file in roughly
the same spot (after the intro paragraph in `en.md`, before "The one we
recommend" in `hu.md`).
