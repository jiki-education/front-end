"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import liveQaSession from "../assets/live-qa-session.webp";
import DatabasesIcon from "../icons/topics/databases.svg";
import AuthIcon from "../icons/topics/auth.svg";
import FrontendBackendIcon from "../icons/topics/frontend-backend.svg";
import ApisIcon from "../icons/topics/apis.svg";
import DeploymentIcon from "../icons/topics/deployment.svg";
import LlmIntegrationIcon from "../icons/topics/llm-integration.svg";
import { RoughHighlight } from "../RoughHighlight";
import styles from "./LearnToBuildCard.module.css";

const BULLETS = ["livestreams", "technologies", "portfolio"] as const;

const TOPICS = [
  { key: "databases", Icon: DatabasesIcon },
  { key: "auth", Icon: AuthIcon },
  { key: "frontendBackend", Icon: FrontendBackendIcon },
  { key: "apis", Icon: ApisIcon },
  { key: "deployment", Icon: DeploymentIcon },
  { key: "llmIntegration", Icon: LlmIntegrationIcon }
] as const;

export function LearnToBuildCard() {
  const t = useTranslations("landing.learnToBuild");

  return (
    <div className={styles.card}>
      <div className={styles.inner}>
        <h3 className={styles.heading}>
          {t.rich("heading", { word: (chunks) => <span className={styles.buildWord}>{chunks}</span> })}
        </h3>

        <p className={styles.intro}>
          {t.rich("intro", { highlight: (chunks) => <RoughHighlight>{chunks}</RoughHighlight> })}
        </p>

        <div className={styles.wrap}>
          <ul className={styles.bullets}>
            {BULLETS.map((key) => (
              <li key={key}>
                <span className={styles.lead}>{t(`${key}Lead`)}</span>
                <span className={styles.detail}>
                  {t.rich(`${key}Detail`, { strong: (chunks) => <strong>{chunks}</strong> })}
                </span>
              </li>
            ))}
          </ul>

          <div className={styles.panel}>
            <Image
              className={styles.panelImage}
              src={liveQaSession}
              alt={t("liveQaAlt")}
              sizes="(max-width: 900px) 100vw, 620px"
            />
          </div>
        </div>

        <div className={styles.techBlock}>
          <h4 className={styles.topicsLabel}>{t("topicsLabel")}</h4>
          <ul className={styles.pills}>
            {TOPICS.map(({ key, Icon }) => (
              <li key={key} className={styles.pill}>
                <Icon className={styles.pillIcon} aria-hidden="true" focusable="false" />
                {t(key)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
