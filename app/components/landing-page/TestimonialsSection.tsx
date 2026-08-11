import Image from "next/image";
import Link from "next/link";
import type { Testimonial, TestimonialsData } from "@/lib/content/types";
import quote from "./assets/quote.webp";
import { avatars } from "../testimonials/avatars";
import { renderTestimonialText } from "../testimonials/text";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import styles from "./TestimonialsSection.module.css";
import shared from "./shared.module.css";

// A decorative quotation-mark glyph, universal across locales, is used as the
// alt text for the quote-mark images.
const QUOTE_OPEN_ALT = "“";
const QUOTE_CLOSE_ALT = "”";

/**
 * Testimonials arrive as a PROP rather than being read here.
 *
 * They are fetched now, not bundled, and this component uses hooks
 * (useLocaleRoutes), which rules out making it async. So the fetch is hoisted to
 * the async page that renders it and the data comes down as a prop, which is the
 * ordinary Next.js split: routes fetch, components render.
 *
 * The people, their avatars and the order of the grid come from the
 * locale-invariant structure; the words come from that locale's catalog. Both
 * are joined before they get here, so this file has no idea a translation
 * exists. A locale with no catalog never renders this component at all.
 */
export function TestimonialsSection({ testimonials }: { testimonials: TestimonialsData }) {
  const routes = useLocaleRoutes();
  const { primary } = testimonials;

  return (
    <section className={styles["testimonial-section"]}>
      <div className={shared["lg-container"]}>
        <h2>{testimonials.heading}</h2>
        <p className={styles.subheading}>
          <Subheading text={testimonials.subheading} href={routes.testimonials()} />
        </p>
        <div className={styles["primary-quote"]}>
          <div className={styles.words}>
            <Image className={`${styles.mark} ${styles["left-mark"]}`} src={quote} alt={QUOTE_OPEN_ALT} />
            <span>
              {primary.text}
              <Image className={`${styles.mark} ${styles["right-mark"]}`} src={quote} alt={QUOTE_CLOSE_ALT} />
            </span>
          </div>
          <div className={styles.person}>
            <div className={styles.text}>
              <div className={styles.name}>{primary.name}</div>
              <div className={styles.description}>{primary.role}</div>
            </div>
            <Image src={avatars[primary.image]} alt={primary.name} />
          </div>
        </div>
        <div className={styles.quotes}>
          {testimonials.quotes.map((q) => (
            <Quote key={q.slug} data={q} />
          ))}
        </div>
      </div>
    </section>
  );
}

// The subheading is a single editorial sentence containing one <link>…</link>
// span (kept intact so the whole sentence stays translatable). Split it into
// before/link/after and wrap the link text in a locale-aware <Link>.
function Subheading({ text, href }: { text: string; href: string }) {
  const match = text.match(/^([\s\S]*)<link>([\s\S]*)<\/link>([\s\S]*)$/);
  if (!match) {
    return <>{text}</>;
  }
  const [, before, linkText, after] = match;
  return (
    <>
      {before}
      <Link className={styles.subheadingLink} href={href}>
        {linkText}
      </Link>
      {after}
    </>
  );
}

function Quote({ data }: { data: Testimonial }) {
  return (
    <div className={styles.quote}>
      <div className={styles.words}>
        <Image className={`${styles.mark} ${styles["left-mark"]}`} src={quote} alt={QUOTE_OPEN_ALT} />
        <span>
          {renderTestimonialText(data.text)}
          <Image className={`${styles.mark} ${styles["right-mark"]}`} src={quote} alt={QUOTE_CLOSE_ALT} />
        </span>
      </div>
      <div className={styles.person}>
        <div className={styles.stars}></div>
        <div className={styles.personRow}>
          <div className={styles.text}>
            <div className={styles.name}>{data.name}</div>
            <div className={styles.description}>{data.role}</div>
          </div>
          <Image src={avatars[data.image]} alt={data.name} />
        </div>
      </div>
    </div>
  );
}
