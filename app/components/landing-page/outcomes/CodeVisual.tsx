"use client";

import { useTranslations } from "next-intl";
import styles from "./CodeVisual.module.css";

// A snippet of unfamiliar code with one line marked up. The code itself is a literal
// sample, so it stays as-is; only the handwritten note beside it is translated.
export function CodeVisual() {
  const t = useTranslations("landing.outcomes");

  return (
    <>
      <div className={styles.code}>
        <div className={styles.bar} aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <pre>
          <span className={styles.kw}>for</span> (<span className={styles.kw}>let</span> idx ={" "}
          <span className={styles.str}>1</span>; idx &lt;= <span className={styles.str}>6</span>; idx++) {"{\n"}
          {"  "}
          <span className={styles.kw}>const</span> guess = <span className={styles.fn}>chooseWord</span>(knowledge)
          {"\n"}
          {"  knowledge = "}
          <span className={styles.fn}>process</span>(knowledge, idx, guess){"\n"}
          <span className={styles.hit}>
            {"  "}
            <span className={styles.kw}>if</span> (knowledge[<span className={styles.str}>&quot;won&quot;</span>]) {"{"}
          </span>
          {"    "}
          <span className={styles.kw}>break</span>
          {"\n  }\n}"}
        </pre>
      </div>

      <span className={styles.anno}>{t.rich("codeNote", { em: (chunks) => <em>{chunks}</em> })}</span>
      <svg className={styles.arrow} viewBox="0 0 72 24" aria-hidden="true">
        <path d="M70 4C52 4 30 6 4 18" />
        {/* Barbs are set symmetrically about the curve's tangent at the tip (-24.8deg),
            not about the horizontal - squared off to the horizontal they read as a bent
            tick rather than an arrowhead. */}
        <path d="M4 18l9 0.2M4 18l5.7-7" />
      </svg>
    </>
  );
}
