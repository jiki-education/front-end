import { useTranslations } from "next-intl";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
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

interface QuoteData {
  textKey: string;
  name: string;
  roleKey?: string;
  img: StaticImageData;
}

// Names/handles are proper nouns and stay verbatim; roleKey resolves under landing.testimonials.
const QUOTES: QuoteData[] = [
  { textKey: "fred", name: "Fred", roleKey: "roleTotalBeginner", img: fred },
  { textKey: "shaun", name: "Shaun", roleKey: "roleAbsoluteBeginner", img: shaun },
  { textKey: "lucas", name: "Lucas", roleKey: "roleTotalBeginner", img: lukas },
  { textKey: "nolan", name: "Nolan Lounsbery", roleKey: "roleBeginner", img: giantlemur },
  { textKey: "redrobio", name: "@RedRobio", roleKey: "roleJuniorDeveloper", img: redrobio },
  { textKey: "matt", name: "Matt", roleKey: "rolePythonDev", img: github },
  { textKey: "abhinav", name: "@abhinav", roleKey: "roleBeginner", img: abhinav },
  { textKey: "laura", name: "Laura", roleKey: "roleWasInTutorialHell", img: laura },
  { textKey: "oleksandra2", name: "Oleksandra", roleKey: "roleBeginner", img: github },
  { textKey: "kazzybits", name: "@Kazzybits", roleKey: "roleBeginner", img: kazzybits },
  { textKey: "vignesh", name: "Vignesh", roleKey: "roleIntermediateDev", img: vignesh },
  { textKey: "rick", name: "Rick", roleKey: "roleBeginner", img: ricksn },
  { textKey: "artigiani", name: "@m_artigiani", img: mArtigiani },
  { textKey: "robert", name: "Robert", roleKey: "roleJuniorDeveloper", img: rob },
  { textKey: "karen", name: "Karen", roleKey: "roleBeginner", img: github },
  { textKey: "kcash", name: "@kcash", roleKey: "roleIntermediateDev", img: kcash },
  { textKey: "drac", name: "Cpt Drac", roleKey: "roleTotalBeginner", img: drac },
  { textKey: "jj", name: "@JJ", roleKey: "roleJuniorDeveloper", img: jj },
  { textKey: "nanouss", name: "@nanouss01", roleKey: "roleBeginner", img: nanouss01 },
  { textKey: "thom", name: "Thom Chittom", roleKey: "roleBeginner", img: thom },
  { textKey: "chris", name: "Chris", roleKey: "roleSerialBeginner", img: sharpiemath }
];

export function TestimonialsSection() {
  const t = useTranslations("landing.testimonials");
  const routes = useLocaleRoutes();
  return (
    <section className={styles["testimonial-section"]}>
      <div className={shared["lg-container"]}>
        <h2>{t("heading")}</h2>
        <p className={styles.subheading}>
          {t("subheadingPrefix")}
          <Link className="underline font-semibold" href={routes.testimonials()}>
            {t("subheadingLink")}
          </Link>
        </p>
        <div className={styles["primary-quote"]}>
          <div className={styles.words}>
            <Image className={`${styles.mark} ${styles["left-mark"]}`} src={quote} alt={t("quoteOpenAlt")} />
            <span>
              {t("primaryQuote")}
              <Image className={`${styles.mark} ${styles["right-mark"]}`} src={quote} alt={t("quoteCloseAlt")} />
            </span>
          </div>
          <div className={styles.person}>
            <div className={styles.text}>
              <div className={styles.name}>{t("primaryName")}</div>
              <div className={styles.description}>{t("primaryRole")}</div>
            </div>
            <Image src={oleksandra} alt={t("primaryName")} />
          </div>
        </div>
        <div className={styles.quotes}>
          {QUOTES.map((q) => (
            <Quote key={q.textKey} data={q} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Quote({ data }: { data: QuoteData }) {
  const t = useTranslations("landing.testimonials");
  return (
    <div className={styles.quote}>
      <div className={styles.words}>
        <Image className={`${styles.mark} ${styles["left-mark"]}`} src={quote} alt={t("quoteOpenAlt")} />
        <span>
          <p>
            {t.rich(data.textKey as Parameters<typeof t.rich>[0], { strong: (chunks) => <strong>{chunks}</strong> })}
          </p>
          <Image className={`${styles.mark} ${styles["right-mark"]}`} src={quote} alt={t("quoteCloseAlt")} />
        </span>
      </div>
      <div className={styles.person}>
        <div className={styles.stars}></div>
        <div className="flex flex-row items-center justify-end gap-8">
          <div className={styles.text}>
            <div className={styles.name}>{data.name}</div>
            <div className={styles.description}>{data.roleKey ? t(data.roleKey as Parameters<typeof t>[0]) : ""}</div>
          </div>
          <Image src={data.img} alt={data.name} />
        </div>
      </div>
    </div>
  );
}
