import { Fragment } from "react";

/**
 * Render a testimonial's text.
 *
 * The authored form is a deliberately tiny Markdown subset: `**bold**` spans,
 * and blank lines separating paragraphs. Nothing else is supported and nothing
 * else is interpreted.
 *
 * It is rendered element by element rather than through innerHTML. The landing
 * section used to inject `<strong>` markup with dangerouslySetInnerHTML, which
 * was defensible while the only author was us; it is not defensible now that
 * every locale's quotes come out of a translation catalog. A translated string
 * is data, and data does not get handed to innerHTML.
 */
export function renderTestimonialText(text: string) {
  return text.split(/\n\s*\n/).map((paragraph, i) => <p key={i}>{renderBold(paragraph)}</p>);
}

function renderBold(text: string) {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        <Fragment key={i}>{part}</Fragment>
      )
    );
}
