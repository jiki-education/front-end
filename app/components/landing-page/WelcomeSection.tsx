"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import ArrowIcon from "./icons/arrow-1.svg";
import RocketIcon from "./icons/rocket.svg";
import withRhodri from "./assets/with-rhodri.webp";
import styles from "./WelcomeSection.module.css";
import shared from "./shared.module.css";
import { MonthlyPrice } from "./MonthlyPrice";
import { useRoughAnnotations } from "./hooks/useRoughAnnotations";
import { useWavingHand } from "./hooks/useWavingHand";
import { useArrowAnimation } from "./hooks/useArrowAnimations";
import { useRocketLaunch } from "./hooks/useRocketLaunch";
import rocket from "./rocketLaunch.module.css";
import { SignupButton } from "./SignupButton";

export function WelcomeSection() {
  const t = useTranslations("landing.welcome");
  const routes = useLocaleRoutes();
  const annotationsRef = useRoughAnnotations();
  const wavingHandRef = useWavingHand();
  const rhodriRef = useArrowAnimation<HTMLSpanElement>("rhodri");
  const ctaLaunch = useRocketLaunch(routes.authSignup());

  // Rich-text tag renderers preserving the prose's inline markup.
  const strong = (chunks: React.ReactNode) => <strong>{chunks}</strong>;
  const highlight = (chunks: React.ReactNode) => <span className="rough-highlight">{chunks}</span>;
  const strongHighlight = (chunks: React.ReactNode) => <strong className="rough-highlight">{chunks}</strong>;
  const you = (chunks: React.ReactNode) => <span className="intro-you">{chunks}</span>;

  return (
    <section className={styles.welcome} ref={annotationsRef}>
      <div className={shared["md-container"]}>
        <div className={styles.introBlock}>
          <div className={styles.introInner}>
            <h2>
              <span className={`${styles.headingHighlight} intro-aspiring-coder rough-highlight`}>
                {t("headingHighlight")}
              </span>
              {t("headingRest")}
            </h2>
            <p>{t.rich("para1", { strong })}</p>
            <p>{t.rich("para2", { strong, highlight })}</p>
            <p>
              {t.rich("para3", {
                strong,
                highlight,
                strongHighlight,
                you
              })}
            </p>
            <div className={styles.arrowWrap}>
              <ArrowIcon className={styles["bootcamp-arrow-1"]} width={80} height={168} />
            </div>
          </div>
        </div>

        <h3>
          {t.rich("hiThere", {
            wave: (chunks) => (
              <span className={styles["waving-hand"]} ref={wavingHandRef}>
                {chunks}
              </span>
            ),
            highlight: (chunks) => <div className={`${styles.inline} rough-highlight`}>{chunks}</div>
          })}
        </h3>
        <p>{t.rich("para4", { strong })}</p>
        <p>{t.rich("para5", { strong })}</p>
        <h3>
          {t.rich("heading2", {
            strong,
            highlight: (chunks) => <span className={`${styles.inline} rough-highlight`}>{chunks}</span>
          })}
        </h3>
        <p>{t.rich("para6", { strong })}</p>
        <p>
          {t.rich("para7", {
            strong,
            strongHighlight: (chunks) => <strong className={`${styles.inline} rough-highlight`}>{chunks}</strong>
          })}
        </p>
        <p>{t.rich("para8", { strong })}</p>
        <h3>
          {t.rich("heading3", {
            highlight: (chunks) => <span className={`${styles.inline} rough-highlight`}>{chunks}</span>
          })}
        </h3>
        <p>{t.rich("para9", { strong })}</p>
        <div className={styles.rhodriCard}>
          <div className={styles.rhodriFrame} style={{ boxShadow: "0 0 10px 0 rgba(0,0,0,0.5)" }}>
            <Image className={styles.rhodriImg} src={withRhodri} alt={t("rhodriAlt")} width={300} height={400} />
            <div className={styles.rhodriCaption}>
              <span className={styles.captionShort}>{t("captionShort")}</span>
              <span className={styles.captionLong}>{t("captionLong")}</span>
            </div>
          </div>
        </div>
        <p className={styles.paraSpaced}>
          {t("para10Prefix")}
          <span className={styles.eventuallyShort}>{t("para10Eventually")}</span>
          <span className={styles.eventuallyLong}>
            <span className={`rough-underline ${styles.nowrap}`} id="eventually-underline">
              {t("para10Eventually")}
            </span>
            <span className={styles["rhodri-arrow"]} ref={rhodriRef}></span>
          </span>
        </p>
        <p>{t("para11")}</p>
        <p>{t.rich("para12", { strong })}</p>
        <h3>{t.rich("heading4", { highlight })}</h3>
        <p>{t.rich("para13", { strong })}</p>
        <ol className={styles.list}>
          <li>{t.rich("listItem1", { strong })}</li>
          <li>{t.rich("listItem2", { strong })}</li>
        </ol>
        <p>{t.rich("para14", { strong })}</p>
        <div className={styles.videoGrid}>
          <video
            className={styles.video}
            src="/static/images/landing-page/space-invaders.mp4"
            aria-label={t("spaceInvadersLabel")}
            width={400}
            height={300}
            autoPlay
            muted
            loop
            playsInline
          />
          <video
            className={styles.video}
            src="/static/images/landing-page/tic-tac-toe.mp4"
            aria-label={t("ticTacToeLabel")}
            width={400}
            height={300}
            autoPlay
            muted
            loop
            playsInline
          />
          <video
            className={styles.video}
            src="/static/images/landing-page/breakout.mp4"
            aria-label={t("breakoutLabel")}
            width={400}
            height={300}
            autoPlay
            muted
            loop
            playsInline
          />
          <video
            className={styles.video}
            src="/static/images/landing-page/maze.mp4"
            aria-label={t("mazeLabel")}
            width={400}
            height={300}
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
        <h3 className={styles.sectionHeading}>{t("heading5")}</h3>
        <p>{t.rich("para15", { highlight: strongHighlight })}</p>
        <p>
          {t.rich("para16Prefix", { strong })}
          <strong>
            <MonthlyPrice />
            {t("para16PerMonth")}
          </strong>
          {t("para16Suffix")}
        </p>
        <p>
          {t("para17Prefix")}
          <Link href={routes.authSignup()} className={styles.inlineLink}>
            {t("para17Link")}
          </Link>
        </p>
        <div className={styles.ctaRow}>
          <span className={`${styles.ctaPointer} ${styles.ctaPointerRight}`} aria-hidden="true">
            👉
          </span>
          <Link
            href={routes.authSignup()}
            className={`ui-btn ui-btn-xlarge ui-btn-primary ${rocket.bounceOnHover}`}
            onClick={ctaLaunch.handleClick}
          >
            {t("ctaButton")}
            <span
              className={`${rocket.rocketWrapper} ${rocket.rocketWrapperLg} ${ctaLaunch.launching ? rocket.launching : ""}`}
            >
              <RocketIcon width={32} height={32} className={rocket.rocket} />
            </span>
          </Link>
          <span className={`${styles.ctaPointer} ${styles.ctaPointerLeft}`} aria-hidden="true">
            👈
          </span>
        </div>
        <div className={styles.ctaRowCompact}>
          <SignupButton />
        </div>
      </div>
    </section>
  );
}
