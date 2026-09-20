# Open Graph / Social Card Review

A review of the site's Open Graph and Twitter card metadata, prompted by an
external OG-checker report. This documents how our meta tags are assembled, what
the checker flagged, and the recommended fixes.

## How the meta tags are assembled

Metadata is layered across two files, with Next.js merging them per-route:

- **`app/layout.tsx`** (root) sets the base metadata for every page:
  - `metadataBase` (from `SITE_URL`)
  - the Open Graph image (`/static/images/og-image.png`, 1200×630)
  - `twitter.card: "summary_large_image"`

  It does **not** set `openGraph.siteName`, `openGraph.title`, or
  `openGraph.description`.

- **`app/(hybrid)/[locale]/page.tsx`** (homepage) overrides `title` and
  `description` from the `seo.home` i18n keys:
  - title → "Jiki - Learn to Code the Fun Way"
  - description → "The best way to learn to code and build in the LLM-era! By
    the team behind Exercism"

  (See `messages/en.json` → `seo.home`.)

Next.js auto-populates `og:title`, `og:description`, `twitter:title`, and
`twitter:description` from the page `title`/`description` when the OG object
doesn't specify them. That is why the checker sees those fields present and
passing even though we never set them explicitly.

## What passes

The checker confirmed all of the following are correct:

- `og:title` / `title` — "Jiki - Learn to Code the Fun Way" (32 chars)
- `og:description` / `description` (83 chars)
- `og:image` — loads cleanly, 1200×630, ~113 KB PNG
- `twitter:card` — `summary_large_image`
- `twitter:title`, `twitter:description`, `twitter:image` — all present

## Issues flagged

### 1. `og:site_name` is missing

We never set `openGraph.siteName`, so no `<meta property="og:site_name">` is
emitted. Platforms like Discord render the site name above the card title;
without it the card reads as anonymous.

**Fix** — one line in the root `openGraph` block in `app/layout.tsx`, so every
page inherits it:

```ts
openGraph: {
  siteName: "Jiki",
  images: [{ url: "/static/images/og-image.png", width: 1200, height: 630, alt: "Jiki - learn to code" }]
}
```

Low-risk, clearly worth doing.

### 2. OG image has no conversion text

The current image (`public/static/images/og-image.png`) is just the JIKI
wordmark and mascot on a white background. When shared on Discord/Slack/X the
card shows the logo but no headline, value proposition, or CTA to sell the
click.

This is a design asset change rather than a code change. Recommended direction
for a new 1200×630 asset:

- A short headline in the image itself, e.g. "Learn to Code the Fun Way".
- An optional sub-line / CTA reinforcing the value proposition.
- A coloured background instead of white — white tends to blend into
  light-themed card UIs, so the card doesn't stand out in a feed.

Owner: brand/design.

## Not flagged, but worth considering

`twitter.site` / `twitter.creator` (the `@handle`) aren't set. Not required,
but a cheap add for attribution on X cards if Jiki has an X handle.

## Summary

| Item                     | Status  | Action                                |
| ------------------------ | ------- | ------------------------------------- |
| `og:site_name`           | Missing | Add `siteName: "Jiki"` in root layout |
| OG image conversion text | Weak    | New 1200×630 asset (design)           |
| `twitter:site`/`creator` | Missing | Optional — add handle if one exists   |
| Everything else          | Passing | None                                  |
