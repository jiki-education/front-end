import { useLocale } from "next-intl";
import Image, { type StaticImageData } from "next/image";
import { getTestimonials } from "@/lib/content/getTestimonials";
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
import headingArrow from "./assets/heading-arrow-loop.png";
import styles from "./TestimonialsSection.module.css";
import { StickyNote } from "./testimonials/StickyNote";
import { TestimonialsHeading } from "./testimonials/TestimonialsHeading";

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

  // The lead testimonial is just the first note on the wall now, rather than a
  // separately-styled block above it. Normalised to one shape so the wall does not have
  // to care which kind of testimonial it is holding.
  const notes = [
    { key: "primary", ...testimonials.primary },
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
                html={note.html}
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
