/**
 * The search index pipeline: the third thing whose bytes both repos must agree
 * on, and the only one that needs no prose/structure split.
 *
 * A search index is built ENTIRELY from translated copy: title, excerpt, seo
 * description and seo keywords. There is no locale-invariant half to separate
 * out, so unlike the concept and post indexes this does not split, it MOVES. The
 * i18n repo builds and publishes it whole.
 *
 * That makes it byte-sensitive in exactly the way the renderers are. A lunr
 * index is a serialised data structure whose bytes depend on the lunr version,
 * its tokeniser and its pipeline, so two builders on different versions produce
 * different bytes for identical input, the filename hash moves, and the
 * front-end computes a URL nothing was written to. So the version is pinned
 * exactly here, beside the renderers, for the same reason.
 */

import lunr from "lunr";

/** One entry in a search index, as both repos must construct it. */
export interface SearchItem {
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  keywords: string;
}

export interface SearchIndex {
  index: object;
  items: Array<{ slug: string; title: string; excerpt: string }>;
}

/**
 * Build the exact search index Jiki serves for one locale and content type.
 *
 * Field order and boosts are part of the byte contract: lunr serialises its
 * inverted index in insertion order, so adding a field, reordering two, or
 * changing a boost rewrites the bytes of every index.
 *
 * `items` carries only what the results list renders, which is why it is a
 * narrower shape than the input.
 */
export function buildSearchIndex(items: SearchItem[]): SearchIndex {
  const index = lunr(function (this: lunr.Builder) {
    this.ref("slug");
    this.field("title", { boost: 10 });
    this.field("excerpt", { boost: 5 });
    this.field("description", { boost: 4 });
    this.field("keywords", { boost: 3 });

    for (const item of items) {
      this.add(item);
    }
  });

  return {
    index: index.toJSON(),
    items: items.map((item) => ({ slug: item.slug, title: item.title, excerpt: item.excerpt }))
  };
}
