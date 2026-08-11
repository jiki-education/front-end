/**
 * Frontmatter parsing, which became part of the byte contract.
 *
 * This package originally, and deliberately, did NOT parse frontmatter: it never
 * reached the rendered HTML, so the two repos were free to parse it differently
 * (the front-end with gray-matter, i18n with a zero-dependency reader) and
 * neither choice could move a byte.
 *
 * That stopped being true when the post and concept metadata indexes split into
 * a locale-invariant half and a translated half. The translated half is
 * published by i18n and it carries `seo` (a nested mapping) and `tags` (a
 * sequence) straight from frontmatter into a content-hashed artifact. A
 * minimal reader that returns those as raw strings does not produce
 * slightly-different metadata, it produces an artifact at a different hash, so
 * the front-end computes a URL nothing was written to.
 *
 * So the moment frontmatter reached the bytes, it had to come here, on exactly
 * the same terms as the renderers: one implementation, one pinned parser, both
 * repos importing it.
 */

import matter from "gray-matter";

export interface Frontmatter {
  /** The parsed frontmatter mapping. Nested mappings and sequences keep their shape. */
  data: Record<string, unknown>;
  /** The Markdown body, with the frontmatter block removed. */
  body: string;
}

/** Split a Markdown file into its frontmatter data and its body. */
export function parseFrontmatter(source: string): Frontmatter {
  const parsed = matter(source);
  return { data: parsed.data as Record<string, unknown>, body: parsed.content };
}
