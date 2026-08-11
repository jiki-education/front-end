import Image from "next/image";
import type { TestimonialsData } from "@/lib/content/types";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import { avatars } from "../testimonials/avatars";
import headingArrow from "./assets/heading-arrow-loop.png";
import styles from "./TestimonialsSection.module.css";
import { StickyNote } from "./testimonials/StickyNote";
import { TestimonialsHeading } from "./testimonials/TestimonialsHeading";

/**
 * Testimonials arrive as a PROP rather than being read here.
 *
 * They are fetched now, not bundled, and this component uses hooks
 * (useLocaleRoutes), which rules out making it async. So the fetch is hoisted to
 * the async page that renders it and the data comes down as a prop, which is the
 * ordinary Next.js split: routes fetch, components render.
 */
export function TestimonialsSection({ testimonials }: { testimonials: TestimonialsData }) {
  const routes = useLocaleRoutes();

  // The lead testimonial is just the first note on the wall now, rather than a
  // separately-styled block above it. Normalised to one shape so the wall does not have
  // to care which kind of testimonial it is holding.
  const notes = [
    { key: `primary-${testimonials.primary.slug}`, ...testimonials.primary },
    ...testimonials.quotes.map((quote) => ({ key: quote.slug, ...quote }))
  ];

  // Two explicit columns rather than CSS multi-column: multicol leaves each note's
  // absolutely-positioned tape behind when it reflows a note into the next column.
  const columns = [notes.filter((_, i) => i % 2 === 0), notes.filter((_, i) => i % 2 === 1)];

  return (
    <section className={styles["testimonial-section"]}>
      <Image src={headingArrow} alt="" aria-hidden="true" className={styles.stitchArrow} />

      <TestimonialsHeading
        heading={testimonials.heading}
        subheading={testimonials.subheading}
        href={routes.testimonials()}
      />

      <div className={styles.wall}>
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className={styles.column}>
            {column.map((note, i) => (
              <StickyNote
                key={note.key}
                text={note.text}
                name={note.name}
                role={note.role}
                avatar={avatars[note.image]}
                index={i * 2 + columnIndex}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
