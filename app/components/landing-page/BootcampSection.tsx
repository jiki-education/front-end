"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import BuildIcon from "./icons/build.svg";
import CalendarIcon from "./icons/calendar.svg";
import CodersMindIcon from "./icons/coders-mind.svg";
import ConfidenceIcon from "./icons/confidence.svg";
import UnderstandingIcon from "./icons/understanding.svg";
import certificate from "./assets/certificate.webp";
import certificateArrow from "./assets/certificate-arrow.webp";
import jeremyLivestream from "./assets/jeremy-livestream.webp";
import linkedin from "./assets/linkedin.webp";
import part1 from "./assets/part-1.webp";
import penguin from "./assets/penguin.webp";
import wordle from "./assets/wordle.webp";
import styles from "./BootcampSection.module.css";
import shared from "./shared.module.css";
import { useArrowAnimation } from "./hooks/useArrowAnimations";
import { useConfetti } from "./hooks/useConfetti";

export function BootcampSection() {
  const t = useTranslations("landing.bootcamp");
  const routes = useLocaleRoutes();
  const strong = (chunks: React.ReactNode) => <strong>{chunks}</strong>;
  const highlight = (chunks: React.ReactNode) => (
    <span className={`rough-highlight ${styles.highlight}`}>{chunks}</span>
  );
  const portfolioArrowRef = useArrowAnimation<HTMLDivElement>("portfolio-arrow");
  const buildingSectionArrowRef = useArrowAnimation<HTMLDivElement>("building-section-arrow");
  const certificateArrowRef = useArrowAnimation<HTMLDivElement>("certificate-arrow");
  const confettiRef = useConfetti();

  return (
    <section className={styles.bootcamp} data-bootcamp-section>
      <div className={shared["lg-container"]}>
        <div className={`${styles.container} ${styles.syllabus}`}>
          <div className={styles.tag}>{t("tagWhatWeCover")}</div>
          <h2>{t.rich("menuHeading", { strong })}</h2>
          <p className={styles.intro}>{t.rich("menuIntro", { strong })}</p>
          <div className={styles.sections}>
            <div className={styles.section}>
              <div className={styles.row}>
                <div className={styles.lhs}>
                  <h3 className={styles.subHeading}>
                    {t("part1Heading")}
                    <span className="ui-emoji">🧑‍🔬</span>
                    <div className={styles.bubble}>{t("part1Bubble")}</div>
                  </h3>
                  <div className={styles["part-intro"]}>{t.rich("part1Intro", { highlight })}</div>
                  <ul>
                    <li>
                      <UnderstandingIcon width={20} height={20} />
                      <div className={styles.text}>
                        {t.rich("part1Item1Prefix", { strong })}
                        <Link href={routes.concepts()} className={styles.underline}>
                          {t("part1Item1Link")}
                        </Link>
                        {t("part1Item1Suffix")}
                      </div>
                    </li>
                    <li>
                      <ConfidenceIcon width={20} height={20} />
                      <div className={styles.text}>{t.rich("part1Item2", { strong })}</div>
                    </li>
                    <li>
                      <CodersMindIcon width={20} height={20} />
                      <div className={styles.text}>{t.rich("part1Item3", { strong })}</div>
                    </li>
                    <li>
                      <BuildIcon width={20} height={20} />
                      <div className={styles.text}>{t.rich("part1Item4", { strong })}</div>
                    </li>
                  </ul>
                </div>
                <div className={styles.rhs}>
                  <div className={`${styles.dates} ${styles["h3-sideheading"]} ${styles.relative}`}>
                    <CalendarIcon width={20} height={20} />
                    {t("part1Duration")}
                  </div>
                  <Image className={styles.part1Img} src={part1} alt={t("part1Alt")} width={350} height={350} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={shared["lg-container"]}>
        <div className={`${styles.subcontainer} ${styles["portfolio-subsection"]} ${styles.relative}`}>
          <div className={styles["portfolio-arrow"]} ref={portfolioArrowRef}></div>
          <div className={styles.levelsHeader}>
            <h2 className={styles.headingGrow}>{t.rich("levelsHeading", { strong })}</h2>
            <div className={styles["h3-sideheading"]}>{t("levelsSideheading")}</div>
          </div>
          <p className={styles.levelsIntro}>{t("levelsIntro")}</p>
          <p className={styles.levelsSubIntro}>{t.rich("levelsSubIntro", { strong })}</p>
          <div className={styles.levels}>
            <div className={styles.level}>
              <Image src={penguin} alt={t("penguinAlt")} width={400} height={300} />
              <h4>{t.rich("level2", { strong })}</h4>
            </div>
            <div className={styles.level}>
              <video
                src="/static/images/landing-page/golf-29474.mp4"
                aria-label={t("golfLabel")}
                width={400}
                height={300}
                autoPlay
                muted
                loop
                playsInline
              />
              <h4>{t.rich("level3", { strong })}</h4>
            </div>
            <div className={styles.level}>
              <video
                src="/static/images/landing-page/flower-22e43.mp4"
                aria-label={t("flowerLabel")}
                width={400}
                height={300}
                autoPlay
                muted
                loop
                playsInline
              />
              <h4>{t.rich("flowerLevel", { strong })}</h4>
            </div>
            <div className={styles.level}>
              <video
                src="/static/images/landing-page/space-invaders-74644.mp4"
                aria-label={t("spaceInvadersLabel")}
                width={400}
                height={300}
                autoPlay
                muted
                loop
                playsInline
              />
              <h4>{t.rich("level7", { strong })}</h4>
            </div>
            <div className={styles.level}>
              <video
                src="/static/images/landing-page/wall-017cd.mp4"
                aria-label={t("wallLabel")}
                width={400}
                height={300}
                autoPlay
                muted
                loop
                playsInline
              />
              <h4>{t.rich("level10", { strong })}</h4>
            </div>
            <div className={styles.level}>
              <Image src={wordle} alt={t("wordleAlt")} width={400} height={300} />
              <h4>{t.rich("level12", { strong })}</h4>
            </div>
            <div className={styles.level}>
              <video
                src="/static/images/landing-page/tic-tac-toe-736a8.mp4"
                aria-label={t("ticTacToeLabel")}
                width={400}
                height={300}
                autoPlay
                muted
                loop
                playsInline
              />
              <h4>{t.rich("level14", { strong })}</h4>
            </div>
            <div className={styles.level}>
              <video
                src="/static/images/landing-page/maze-59a6d.mp4"
                aria-label={t("mazeLabel")}
                autoPlay
                muted
                loop
                playsInline
              />
              <h4>{t.rich("level16", { strong })}</h4>
            </div>
            {/* Intentional empty cell — spacer to align the next tile in the grid */}
            <div className={styles.level}></div>
            <div className={styles.level}>
              <video
                src="/static/images/landing-page/dreaming-house-eeda7.mp4"
                aria-label={t("dreamingHouseLabel")}
                autoPlay
                muted
                loop
                playsInline
              />
              <h4>{t.rich("level20", { strong })}</h4>
            </div>
            <div className={styles.level}>
              <video
                src="/static/images/landing-page/breakout-bcaa3.mp4"
                aria-label={t("breakoutLabel")}
                autoPlay
                muted
                loop
                playsInline
              />
              <h4>{t.rich("levelEnd", { strong })}</h4>
            </div>
          </div>
        </div>
      </div>
      <div className={shared["lg-container"]}>
        <div className={`${styles.container} ${styles.syllabus} ${styles["building-subsection"]} ${styles.relative}`}>
          <div className={styles["building-section-arrow"]} ref={buildingSectionArrowRef}></div>

          <div className={styles.tag}>{t("tagWhatWeCover")}</div>
          <h2 className={styles.centered}>{t.rich("buildingHeading", { strong })}</h2>
          <p className={styles.intro}>{t("buildingIntro")}</p>
          <div className={styles.sections}>
            <div className={styles.section}>
              <div className={styles.row}>
                <div className={styles.lhs}>
                  <h3 className={styles.subHeading}>
                    {t.rich("part2Heading", { strong })}
                    <div className={styles.bubble}>{t("part2Bubble")}</div>
                  </h3>
                  <div className={styles["part-intro"]}>{t.rich("part2Intro", { highlight })}</div>
                  <ul>
                    <li>
                      <UnderstandingIcon width={20} height={20} />
                      <div className={styles.text}>{t.rich("part2Item1", { strong })}</div>
                    </li>
                    <li>
                      <ConfidenceIcon width={20} height={20} />
                      <div className={styles.text}>{t.rich("part2Item2", { strong })}</div>
                    </li>
                    <li>
                      <CodersMindIcon width={20} height={20} />
                      <div className={styles.text}>{t.rich("part2Item3", { strong })}</div>
                    </li>
                  </ul>
                </div>
                <div className={styles.rhs}>
                  <div className={`${styles.dates} ${styles["h3-sideheading"]} ${styles.relative}`}>
                    <CalendarIcon width={20} height={20} />
                    {t("part2Duration")}
                  </div>
                  <Image
                    className={styles.part2Img}
                    src={jeremyLivestream}
                    alt={t("jeremyLivestreamAlt")}
                    width={900}
                    height={851}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={shared["lg-container"]}>
        <div className={styles.subcontainer}>
          <div className={styles["certificate-arrow"]} ref={certificateArrowRef}></div>
          <div className={styles["certificate-subsection"]}>
            <div className={styles.certificateRow}>
              <div className={`${styles.lhs} ${styles.colStart}`}>
                <div className={styles.bubble}>{t("certificateBubble")}</div>
                <h3 className={styles.subHeading}>{t("certificateHeading")}</h3>
                <p className={styles.certPara}>{t("certificatePara1")}</p>
                <p className={styles.certParaLast}>{t("certificatePara2")}</p>
              </div>
              <Image className={styles.certificateArrowImg} src={certificateArrow} alt="" />
              <div className={styles.certificateCol}>
                <Image
                  className={styles.certificateImg}
                  style={{ boxShadow: "0 0 20px rgba(0,0,0,0.4)" }}
                  src={certificate}
                  alt={t("certificateAlt")}
                />
              </div>
            </div>
            <div className={styles.linkedin} ref={confettiRef}>
              <Image src={linkedin} alt={t("linkedinAlt")} />
              <span>{t("linkedinShare")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
