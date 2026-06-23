import Link from "next/link";
import styles from "./SignupCta.module.css";

export function SignupCta() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.cta}>
        <h2 className={styles.title}>Ready to Start Your Coding Journey?</h2>
        <p className={styles.subtitle}>
          Join thousands of learners on Jiki. Practice coding exercises, get feedback from mentors, and level up your
          skills — it&apos;s free!
        </p>
        <Link href="/auth/signup" className={styles.button}>
          Sign Up For Free
        </Link>
      </div>
    </div>
  );
}
