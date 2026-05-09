import Link from "next/link";
import styles from "./SignupSection.module.css";
import shared from "./shared.module.css";

export function SignupSection() {
  return (
    <section className={styles["signup-section"]}>
      <div className={styles["lhs-bg"]}></div>
      <div className={styles["rhs-bg"]}></div>
      <div className={`${shared["lg-container"]} ${styles.inner}`}>
        <h2 className="text-center font-normal">
          Get started - <strong className="font-semibold">it&apos;s free!</strong>
        </h2>
        <p className={`${styles.intro} text-balance`}>
          The <strong className="font-semibold">Coding Fundamentals</strong> curriculum is{" "}
          <strong className="font-semibold">completely free</strong>. No card. No trial. No catch.
        </p>
        <Link href="/auth/signup" className="ui-btn ui-btn-xlarge ui-btn-primary">
          Sign up &amp; start coding &rarr;
        </Link>
      </div>
    </section>
  );
}
