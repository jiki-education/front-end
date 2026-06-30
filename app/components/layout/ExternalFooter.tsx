import { useTranslations } from "next-intl";
import Link from "next/link";
import { YOUTUBE_URL } from "@/lib/constants/social";
import styles from "./ExternalFooter.module.css";

export function ExternalFooter() {
  const t = useTranslations("layout.footer");

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.section}>
          <h3 className={styles.heading}>{t("about.heading")}</h3>
          <div className={styles.links}>
            <Link href="/blog/the-backstory-of-jiki" className={styles.link}>
              {t("about.aboutJiki")}
            </Link>
            <Link href="/testimonials" className={styles.link}>
              {t("about.testimonials")}
            </Link>
            <Link href="/articles/who-makes-runs-jiki" className={styles.link}>
              {t("about.ourTeam")}
            </Link>
            <Link href="/premium" className={styles.link}>
              {t("about.premium")}
            </Link>
            <Link href="/roadmap" className={styles.link}>
              {t("about.roadmap")}
            </Link>
          </div>
        </div>
        <div className={styles.section}>
          <h3 className={styles.heading}>{t("legal.heading")}</h3>
          <div className={styles.links}>
            <Link href="/articles/terms-of-service" className={styles.link}>
              {t("legal.termsOfUsage")}
            </Link>
            <Link href="/articles/privacy-policy" className={styles.link}>
              {t("legal.privacyPolicy")}
            </Link>
            <Link href="/articles/cookie-policy" className={styles.link}>
              {t("legal.cookiePolicy")}
            </Link>
            <Link href="/articles/code-of-conduct" className={styles.link}>
              {t("legal.codeOfConduct")}
            </Link>
            <Link href="/articles/accessibility" className={styles.link}>
              {t("legal.accessibility")}
            </Link>
          </div>
        </div>
        <div className={styles.section}>
          <h3 className={styles.heading}>{t("keepInTouch.heading")}</h3>
          <div className={styles.links}>
            <Link href="/blog" className={styles.link}>
              {t("keepInTouch.blog")}
            </Link>
            <Link href={YOUTUBE_URL} className={styles.link} target="_blank" rel="noopener noreferrer">
              {t("keepInTouch.youtube")}
            </Link>
            <Link href="/articles/report-abuse" className={styles.link}>
              {t("keepInTouch.reportAbuse")}
            </Link>
            <Link href="/sitemap.xml" className={styles.link}>
              {t("keepInTouch.sitemap")}
            </Link>
          </div>
        </div>
        <div className={styles.section}>
          <h3 className={styles.heading}>{t("getHelp.heading")}</h3>
          <div className={styles.links}>
            <Link href="/articles" className={styles.link}>
              {t("getHelp.helpCenter")}
            </Link>
            <Link href="/articles/faqs" className={styles.link}>
              {t("getHelp.faqs")}
            </Link>
            <Link href="/articles/support" className={styles.link}>
              {t("getHelp.contactUs")}
            </Link>
            <Link href="https://jiki.instatus.com/" className={styles.link} target="_blank" rel="noopener noreferrer">
              {t("getHelp.siteStatus")}
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <span className={styles.copyright}>{t("copyright", { year: 2026 })}</span>
      </div>
    </footer>
  );
}
