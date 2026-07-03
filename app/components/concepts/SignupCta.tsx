import Link from "next/link";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import styles from "./SignupCta.module.css";

export function SignupCta() {
  const routes = useLocaleRoutes();
  return (
    <div className={styles.wrapper}>
      <div className={styles.cta}>
        <h2 className={styles.title}>Ready to Start Your Coding Journey?</h2>
        <p className={styles.subtitle}>
          Join thousands of learners on Jiki. Practice coding exercises, get feedback from mentors, and level up your
          skills — it&apos;s free!
        </p>
        <Link href={routes.authSignup()} className={styles.button}>
          Sign Up For Free
        </Link>
      </div>
    </div>
  );
}
