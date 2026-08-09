"use client";

import { useTranslations } from "next-intl";
import CodeIcon from "../icons/credentials/code.svg";
import PeopleIcon from "../icons/credentials/people.svg";
import GlobeIcon from "../icons/credentials/globe.svg";
import styles from "./CredentialBadges.module.css";

const BADGES = [
  { key: "badgeDeveloper", Icon: CodeIcon },
  { key: "badgeTeacher", Icon: PeopleIcon },
  { key: "badgeMission", Icon: GlobeIcon }
] as const;

// Each badge carries its own icon in its own colour, sitting slightly askew so the row
// reads as three stickers rather than three buttons.
export function CredentialBadges() {
  const t = useTranslations("landing.meetJeremy");

  return (
    <p className={styles.row}>
      {BADGES.map(({ key, Icon }) => (
        <span key={key} className={styles.badge}>
          <Icon aria-hidden="true" focusable="false" />
          {t(key)}
        </span>
      ))}
    </p>
  );
}
