import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";
import shared from "./shared.module.css";

export function Header() {
  return (
    <>
      <div className={`${styles.nav} h-[64px]`} data-nav-fixed>
        <div className={`${shared["lg-container"]} flex flex-row items-center`} data-nav-contents>
          <Link className="flex flex-1 gap-12" href="/">
            <Image
              className={styles["exercism-face"]}
              src="/static/images/landing-page/exercism-face-light.svg"
              alt="Exercism"
              width={28}
              height={24}
              data-exercism-face
            />
            <div className="content mr-auto">
              <strong>Jiki</strong>
              <span className="hidden md:inline-block ml-4">· Coding in the LLM era</span>
            </div>
          </Link>
          <Link className={`${styles.button} ${styles.loginButton}`} href="/auth/login">
            Log In
          </Link>
          <Link className={`${styles.button} ${styles.enrollButton}`} href="/auth/signup">
            Sign Up{" "}
            <Image
              src="/static/images/landing-page/rocket.svg"
              alt=""
              width={16}
              height={16}
              className="inline-block align-middle"
            />
          </Link>
        </div>
      </div>
      <div className={`${styles.nav} ${styles["nav-sticky"]}`} data-nav-sticky></div>
    </>
  );
}
