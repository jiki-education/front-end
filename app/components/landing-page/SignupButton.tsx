"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import RocketIcon from "./icons/rocket.svg";
import styles from "./SignupButton.module.css";
import rocket from "./rocketLaunch.module.css";
import { useRocketLaunch } from "./hooks/useRocketLaunch";

interface SignupButtonProps {
  className?: string;
}

export function SignupButton({ className = "" }: SignupButtonProps) {
  const t = useTranslations("landing.signupButton");
  const ctaLaunch = useRocketLaunch("/auth/signup");

  return (
    <Link
      href="/auth/signup"
      className={["ui-btn", styles.btn, rocket.bounceOnHover, className].join(" ")}
      onClick={ctaLaunch.handleClick}
    >
      <span>
        {t("signUp")}
        <span className={styles.free}>{t("free")}</span>
      </span>
      <span
        className={`inline-block align-middle ${rocket.rocketWrapper} ${rocket.rocketWrapperLg} ${ctaLaunch.launching ? rocket.launching : ""}`}
      >
        <RocketIcon width={32} height={32} className={rocket.rocket} />
      </span>
    </Link>
  );
}
