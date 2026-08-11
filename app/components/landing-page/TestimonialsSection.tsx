import Image from "next/image";
import type { TestimonialsData } from "@/lib/content/types";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import { TestimonialWall } from "../testimonials/TestimonialWall";
import headingArrow from "./assets/heading-arrow-loop.png";
import styles from "./TestimonialsSection.module.css";
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
  // separately-styled block above it.
  const notes = [testimonials.primary, ...testimonials.quotes];

  return (
    <section className={styles["testimonial-section"]}>
      <Image src={headingArrow} alt="" aria-hidden="true" className={styles.stitchArrow} />

      <TestimonialsHeading
        heading={testimonials.heading}
        subheading={testimonials.subheading}
        href={routes.testimonials()}
      />

      <TestimonialWall notes={notes} />
    </section>
  );
}
