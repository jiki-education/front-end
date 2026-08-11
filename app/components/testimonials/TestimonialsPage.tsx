import { useTranslations } from "next-intl";
import Image from "next/image";
import type { Testimonial } from "@/lib/content/types";
import quote from "../landing-page/assets/quote.webp";
import shared from "../landing-page/shared.module.css";
import HeaderLayout from "../layout/HeaderLayout";
import styles from "./TestimonialsPage.module.css";
import { avatars } from "./avatars";
import { renderTestimonialText } from "./text";

/**
 * The public /testimonials page.
 *
 * The quotes arrive as a PROP, from the same catalog the landing section reads.
 * They used to be a second, unrelated JSON file bundled into this component,
 * which meant the same testimonials existed twice in two markup conventions and
 * this page could never be translated at all. There is one catalog now, and this
 * page shows the entries the structure's `page` list names, in that order.
 *
 * `quotes` empty is the honest rendering of a locale that has not translated
 * them. It is never English.
 */
export function TestimonialsPage({ quotes }: { quotes: Testimonial[] }) {
  const t = useTranslations("misc.testimonialsPage");
  return (
    <HeaderLayout>
      <section className={styles.page}>
        <div className={shared["lg-container"]}>
          <header className={styles.header}>
            <h1>{t("title")}</h1>
            <p className={styles.subtitle}>{t("subtitle")}</p>
          </header>
          <div className={styles.quotes}>
            {quotes.map((testimonial) => (
              <Quote key={testimonial.slug} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>
    </HeaderLayout>
  );
}

function Quote({ testimonial }: { testimonial: Testimonial }) {
  const t = useTranslations("misc.testimonialsPage");
  return (
    <div className={styles.quote}>
      <div className={styles.words}>
        <Image className={`${styles.mark} ${styles["left-mark"]}`} src={quote} alt={t("quoteOpenAlt")} />
        <span>
          {renderTestimonialText(testimonial.text)}
          <Image className={`${styles.mark} ${styles["right-mark"]}`} src={quote} alt={t("quoteCloseAlt")} />
        </span>
      </div>
      <div className={styles.person}>
        <div className={styles.stars}></div>
        <div className={styles.personRow}>
          <div className={styles.text}>
            <div className={styles.name}>{testimonial.name}</div>
            <div className={styles.description}>{testimonial.role}</div>
          </div>
          <Image src={avatars[testimonial.image]} alt={testimonial.name} />
        </div>
      </div>
    </div>
  );
}
