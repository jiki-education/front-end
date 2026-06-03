"use client";

import Image from "next/image";
import Link from "next/link";
import JikiLogo from "@/icons/jiki-logo.svg";
import styles from "./Header.module.css";
import shared from "./shared.module.css";
import rocket from "./rocketLaunch.module.css";
import { useRocketLaunch } from "./hooks/useRocketLaunch";

export function Header() {
  const { launching, handleClick } = useRocketLaunch("/auth/signup");

  return (
    <>
      <div className={`${styles.nav} h-[63px]`} data-nav-fixed>
        <div className={`${shared["lg-container"]} flex flex-row items-center`} data-nav-contents>
          <Link className="flex grow-0 gap-12" href="/">
            <JikiLogo className={styles.logo} />
          </Link>
          <Link className={`ui-btn ui-btn-small ${styles.button} ${styles.loginButton}`} href="/auth/login">
            Log In
          </Link>
          <Link
            className={`ui-btn ui-btn-small ${styles.button} ${styles.enrollButton} ${rocket.bounceOnHover}`}
            href="/auth/signup"
            onClick={handleClick}
          >
            Sign Up{" "}
            <span className={`inline-block align-middle ${rocket.rocketWrapper} ${launching ? rocket.launching : ""}`}>
              <Image
                src="/static/images/landing-page/rocket.svg"
                alt=""
                width={16}
                height={16}
                className={rocket.rocket}
              />
            </span>
          </Link>
        </div>
      </div>
      <div className={`${styles.nav} ${styles["nav-sticky"]}`} data-nav-sticky></div>
    </>
  );
}
