import { useTranslations } from "next-intl";
import HeaderLayout from "../layout/HeaderLayout";
import type { Testimonial } from "@/lib/content/types";
import styles from "./TestimonialsPage.module.css";
import { TestimonialWall } from "./TestimonialWall";

/**
 * The public /testimonials page.
 *
 * The quotes arrive as a PROP, from the same catalog the landing section reads.
 * They used to be a second, unrelated JSON file bundled into this component,
 * which meant the same testimonials existed twice in two markup conventions and
 * this page could never be translated at all. There is one catalog now, and this
 * page shows the entries the structure's `page` list names, in that order.
 *
 * It shares the landing section's wall, so the notes are laid out and styled in
 * one place; only the copy above them differs — a page title here, a section
 * heading there.
 *
 * `quotes` empty is the honest rendering of a locale that has not translated
 * them. It is never English.
 */
export function TestimonialsPage({ quotes }: { quotes: Testimonial[] }) {
  const t = useTranslations("misc.testimonialsPage");

  return (
    <HeaderLayout>
      <section className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>{t("title")}</h1>
          <p className={styles.subtitle}>{t("subtitle")}</p>
        </header>

        <TestimonialWall notes={quotes} />
      </section>
    </HeaderLayout>
  );
}
