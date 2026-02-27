import Link from "next/link";
import styles from "./ExternalFooter.module.css";

export function ExternalFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.section}>
          <h3 className={styles.heading}>About</h3>
          <div className={styles.links}>
            <Link href="#" className={styles.link}>
              About Jiki
            </Link>
            <Link href="#" className={styles.link}>
              Our team
            </Link>
            <Link href="#" className={styles.link}>
              Contributors
            </Link>
            <Link href="#" className={styles.link}>
              Partners
            </Link>
            <Link href="#" className={styles.link}>
              Individual supporters
            </Link>
          </div>
        </div>
        <div className={styles.section}>
          <h3 className={styles.heading}>Get Involved</h3>
          <div className={styles.links}>
            <Link href="#" className={styles.link}>
              Jiki Insiders
            </Link>
            <Link href="#" className={styles.link}>
              Contribute
            </Link>
            <Link href="#" className={styles.link}>
              Mentor
            </Link>
            <Link href="#" className={styles.link}>
              Donate
            </Link>
          </div>
        </div>
        <div className={styles.section}>
          <h3 className={styles.heading}>Legal</h3>
          <div className={styles.links}>
            <Link href="#" className={styles.link}>
              Terms of usage
            </Link>
            <Link href="#" className={styles.link}>
              Privacy policy
            </Link>
            <Link href="#" className={styles.link}>
              Cookie policy
            </Link>
            <Link href="#" className={styles.link}>
              Code of conduct
            </Link>
            <Link href="#" className={styles.link}>
              Accessibility statement
            </Link>
          </div>
        </div>
        <div className={styles.section}>
          <h3 className={styles.heading}>Keep in Touch</h3>
          <div className={styles.links}>
            <Link href="#" className={styles.link}>
              Jiki&apos;s blog
            </Link>
            <Link href="#" className={styles.link}>
              Discuss on GitHub
            </Link>
            <Link href="#" className={styles.link}>
              Contact us
            </Link>
            <Link href="#" className={styles.link}>
              Report abuse
            </Link>
          </div>
        </div>
        <div className={styles.section}>
          <h3 className={styles.heading}>Get Help</h3>
          <div className={styles.links}>
            <Link href="#" className={styles.link}>
              Jiki&apos;s Docs
            </Link>
            <Link href="#" className={styles.link}>
              Getting started
            </Link>
            <Link href="#" className={styles.link}>
              FAQs
            </Link>
            <Link href="#" className={styles.link}>
              Installing the CLI
            </Link>
            <Link href="#" className={styles.link}>
              Interactive CLI Walkthrough
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <span className={styles.copyright}>&copy; 2026 Jiki</span>
      </div>
    </footer>
  );
}
