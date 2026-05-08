import styles from "./SignupSection.module.css";
import shared from "./shared.module.css";

export function SignupSection() {
  return (
    <section className={styles["signup-section"]}>
      <div className={styles["lhs-bg"]}></div>
      <div className={styles["rhs-bg"]}></div>
      <div className={shared["lg-container"]}>
        <h2 className="text-center font-normal">
          Join the <strong className="font-semibold">Waiting List</strong>
        </h2>
        <p className={`${styles.intro} text-balance`}>
          We&apos;ll be opening up the course starting in March 2026. The first 1,000 signups get{" "}
          <strong className="font-semibold">free Premium access</strong> for the year!
        </p>
        <hr className="mx-auto mb-20 border-[#ddd] max-w-[500px]" />
        <p className="text-20 mb-24 text-center">Please sign into Exercism to continue.</p>
        {/* External link to the Exercism Rails app — not a Next.js route. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className="btn mx-auto w-fit block" href="/users/sign_in?return_to=%2Fjiki">
          Sign In to Exercism
        </a>
      </div>
    </section>
  );
}
