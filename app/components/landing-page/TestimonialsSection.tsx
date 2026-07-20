import { useLocale } from "next-intl";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { getTestimonials } from "@/lib/content/getTestimonials";
import type { Testimonial } from "@/lib/content/types";
import quote from "./assets/quote.webp";
import abhinav from "./assets/testimonials/abhinav.webp";
import drac from "./assets/testimonials/drac.webp";
import fred from "./assets/testimonials/fred.webp";
import giantlemur from "./assets/testimonials/giantlemur.webp";
import github from "./assets/testimonials/github.webp";
import jj from "./assets/testimonials/jj.webp";
import kazzybits from "./assets/testimonials/kazzybits.webp";
import kcash from "./assets/testimonials/kcash.webp";
import laura from "./assets/testimonials/laura.webp";
import lukas from "./assets/testimonials/lukas.webp";
import mArtigiani from "./assets/testimonials/m_artigiani.webp";
import nanouss01 from "./assets/testimonials/nanouss01.webp";
import oleksandra from "./assets/testimonials/oleksandra.webp";
import redrobio from "./assets/testimonials/redrobio.webp";
import ricksn from "./assets/testimonials/ricksn.webp";
import rob from "./assets/testimonials/rob.webp";
import sharpiemath from "./assets/testimonials/sharpiemath.webp";
import shaun from "./assets/testimonials/shaun.webp";
import thom from "./assets/testimonials/thom.webp";
import vignesh from "./assets/testimonials/vignesh.webp";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import styles from "./TestimonialsSection.module.css";
import shared from "./shared.module.css";

// Quote text is authored HTML (only <strong>) and rendered via
// dangerouslySetInnerHTML — a decorative quotation-mark glyph, universal across
// locales, is used as the alt text for the quote-mark images.
const QUOTE_OPEN_ALT = "“";
const QUOTE_CLOSE_ALT = "”";

// Testimonial copy lives in the content package; the presentational avatar assets
// stay here and are looked up by the filename the content references.
const avatars: Record<string, StaticImageData> = {
  "abhinav.webp": abhinav,
  "drac.webp": drac,
  "fred.webp": fred,
  "giantlemur.webp": giantlemur,
  "github.webp": github,
  "jj.webp": jj,
  "kazzybits.webp": kazzybits,
  "kcash.webp": kcash,
  "laura.webp": laura,
  "lukas.webp": lukas,
  "m_artigiani.webp": mArtigiani,
  "nanouss01.webp": nanouss01,
  "oleksandra.webp": oleksandra,
  "redrobio.webp": redrobio,
  "ricksn.webp": ricksn,
  "rob.webp": rob,
  "sharpiemath.webp": sharpiemath,
  "shaun.webp": shaun,
  "thom.webp": thom,
  "vignesh.webp": vignesh
};

export function TestimonialsSection() {
  const locale = useLocale();
  const routes = useLocaleRoutes();
  const testimonials = getTestimonials(locale);
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
              {primary.quote}
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
          <p dangerouslySetInnerHTML={{ __html: data.html }} />
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
