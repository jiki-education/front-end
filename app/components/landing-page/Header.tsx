import Image from "next/image";
import styles from "./Header.module.css";
import shared from "./shared.module.css";

export function Header() {
  return (
    <>
      <div className={`${styles.nav} h-[64px]`} data-nav-fixed>
        <div className={`${shared["lg-container"]} flex flex-row items-center`} data-nav-contents>
          <a className="flex flex-1 gap-12" href="/">
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
              <span className="hidden md:inline-block ml-4">· Learn to Code</span>
            </div>
          </a>
          <a className={`${styles.button} ${styles.loginButton}`} href="/auth/login">
            Log In
          </a>
          <a className={`${styles.button} ${styles.enrollButton}`} href="#signup-section">
            Join the Waiting List →
          </a>
        </div>
      </div>
      <div className={`${styles.nav} ${styles["nav-sticky"]}`} data-nav-sticky></div>
    </>
  );
}
