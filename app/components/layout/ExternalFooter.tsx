import Link from "next/link";
import styles from "./ExternalFooter.module.css";

export function ExternalFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.section}>
          <h3 className={styles.heading}>About</h3>
          <div className={styles.links}>
            <Link href="/blog/the-backstory-of-jiki" className={styles.link}>
              About Jiki
            </Link>
            <Link href="/testimonials" className={styles.link}>
              Testimonials
            </Link>
            <Link href="/articles/who-makes-runs-jiki" className={styles.link}>
              Our team
            </Link>
            <Link href="/premium" className={styles.link}>
              Jiki Premium
            </Link>
          </div>
        </div>
        <div className={styles.section}>
          <h3 className={styles.heading}>Legal</h3>
          <div className={styles.links}>
            <Link href="/articles/terms-of-service" className={styles.link}>
              Terms of usage
            </Link>
            <Link href="/articles/privacy-policy" className={styles.link}>
              Privacy policy
            </Link>
            <Link href="/articles/cookie-policy" className={styles.link}>
              Cookie policy
            </Link>
            <Link href="/articles/code-of-conduct" className={styles.link}>
              Code of conduct
            </Link>
            <Link href="/articles/accessibility" className={styles.link}>
              Accessibility statement
            </Link>
          </div>
        </div>
        <div className={styles.section}>
          <h3 className={styles.heading}>Keep in Touch</h3>
          <div className={styles.links}>
            <Link href="/blog" className={styles.link}>
              Jiki&apos;s blog
            </Link>
            <Link href="#" className={styles.link}>
              Jiki&apos;s YouTube Channel
            </Link>
            <Link href="/articles/support" className={styles.link}>
              Contact us
            </Link>
            <Link href="/articles/report-abuse" className={styles.link}>
              Report abuse
            </Link>
          </div>
        </div>
        <div className={styles.section}>
          <h3 className={styles.heading}>Get Help</h3>
          <div className={styles.links}>
            <Link href="/articles" className={styles.link}>
              Help Center
            </Link>
            <Link href="#" className={styles.link}>
              Getting started
            </Link>
            <Link href="#" className={styles.link}>
              FAQs
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <span className={styles.copyright}>&copy; 2026 Jiki Ltd</span>
      </div>
    </footer>
  );
}
