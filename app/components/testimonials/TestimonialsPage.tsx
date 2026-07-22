import { useTranslations } from "next-intl";
import Image, { type StaticImageData } from "next/image";
import quote from "../landing-page/assets/quote.webp";
import abhinav from "../landing-page/assets/testimonials/abhinav.webp";
import drac from "../landing-page/assets/testimonials/drac.webp";
import fred from "../landing-page/assets/testimonials/fred.webp";
import giantlemur from "../landing-page/assets/testimonials/giantlemur.webp";
import github from "../landing-page/assets/testimonials/github.webp";
import jj from "../landing-page/assets/testimonials/jj.webp";
import kazzybits from "../landing-page/assets/testimonials/kazzybits.webp";
import kcash from "../landing-page/assets/testimonials/kcash.webp";
import laura from "../landing-page/assets/testimonials/laura.webp";
import lukas from "../landing-page/assets/testimonials/lukas.webp";
import mArtigiani from "../landing-page/assets/testimonials/m_artigiani.webp";
import nanouss01 from "../landing-page/assets/testimonials/nanouss01.webp";
import oleksandra from "../landing-page/assets/testimonials/oleksandra.webp";
import redrobio from "../landing-page/assets/testimonials/redrobio.webp";
import ricksn from "../landing-page/assets/testimonials/ricksn.webp";
import rob from "../landing-page/assets/testimonials/rob.webp";
import sharpiemath from "../landing-page/assets/testimonials/sharpiemath.webp";
import shaun from "../landing-page/assets/testimonials/shaun.webp";
import thom from "../landing-page/assets/testimonials/thom.webp";
import vignesh from "../landing-page/assets/testimonials/vignesh.webp";
import shared from "../landing-page/shared.module.css";
import HeaderLayout from "../layout/HeaderLayout";
import styles from "./TestimonialsPage.module.css";
import testimonials from "./testimonials.json";

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

interface Testimonial {
  text: string;
  name: string;
  role: string;
  image: string;
}

export function TestimonialsPage() {
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
            {(testimonials as Testimonial[]).map((t, i) => (
              <Quote key={i} testimonial={t} />
            ))}
          </div>
        </div>
      </section>
    </HeaderLayout>
  );
}

function Quote({ testimonial }: { testimonial: Testimonial }) {
  const t = useTranslations("misc.testimonialsPage");
  const avatar = avatars[testimonial.image];
  return (
    <div className={styles.quote}>
      <div className={styles.words}>
        <Image className={`${styles.mark} ${styles["left-mark"]}`} src={quote} alt={t("quoteOpenAlt")} />
        <span>
          {renderParagraphs(testimonial.text)}
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
          <Image src={avatar} alt={testimonial.name} />
        </div>
      </div>
    </div>
  );
}

function renderParagraphs(text: string) {
  return text.split("\n\n").map((para, i) => <p key={i}>{renderBold(para)}</p>);
}

function renderBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}
