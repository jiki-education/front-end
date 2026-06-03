"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./SignupButton.module.css";
import rocket from "./rocketLaunch.module.css";
import { useRocketLaunch } from "./hooks/useRocketLaunch";

interface SignupButtonProps {
  className?: string;
}

export function SignupButton({ className = "" }: SignupButtonProps) {
  const ctaLaunch = useRocketLaunch("/auth/signup");

  return (
    <Link
      href="/auth/signup"
      className={["ui-btn", styles.btn, rocket.bounceOnHover, className].join(" ")}
      onClick={ctaLaunch.handleClick}
    >
      <span>
        Sign Up<span className={styles.free}> (it&apos;s free!)</span>
      </span>
      <span
        className={`inline-block align-middle ${rocket.rocketWrapper} ${rocket.rocketWrapperLg} ${ctaLaunch.launching ? rocket.launching : ""}`}
      >
        <Image src="/static/images/landing-page/rocket.svg" alt="" width={32} height={32} className={rocket.rocket} />
      </span>
    </Link>
  );
}
