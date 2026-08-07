"use client";

import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import TypeScriptIcon from "../icons/tech/typescript.svg";
import PythonIcon from "../icons/tech/python.svg";
import RubyIcon from "../icons/tech/ruby.svg";
import NextjsIcon from "../icons/tech/nextjs.svg";
import ClaudeIcon from "../icons/tech/claude.svg";
import CloudflareIcon from "../icons/tech/cloudflare.svg";
import GithubIcon from "../icons/tech/github.svg";
import MuxIcon from "../icons/tech/mux.svg";
import styles from "./TechRow.module.css";

// Product names, so these are deliberately not translated.
const TECHNOLOGIES = [
  { name: "TypeScript", Icon: TypeScriptIcon },
  { name: "Python", Icon: PythonIcon },
  { name: "Ruby", Icon: RubyIcon },
  { name: "Next.js", Icon: NextjsIcon },
  { name: "Claude", Icon: ClaudeIcon },
  { name: "Cloudflare", Icon: CloudflareIcon },
  { name: "GitHub", Icon: GithubIcon },
  { name: "Mux", Icon: MuxIcon }
];

// The logos start drained of colour and fill in one at a time. The stagger is a
// transition-delay per item rather than a chain of timers, so every item is scheduled by
// the same single class toggle and they cannot drift apart.
export function TechRow({ lit }: { lit: boolean }) {
  const t = useTranslations("landing.twoHalves");

  return (
    <div className={styles.tech}>
      <h3 className={styles.label}>{t("techLabel")}</h3>
      <ul className={`${styles.langs} ${lit ? styles.lit : ""}`}>
        {TECHNOLOGIES.map(({ name, Icon }, i) => (
          <li key={name} className={styles.lang} style={{ "--i": i } as CSSProperties}>
            <span className={styles.langIcon}>
              <Icon aria-hidden="true" focusable="false" />
            </span>
            <span className={styles.langName}>{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
