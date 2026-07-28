"use client";

import { marked } from "marked";
import { useTranslations } from "next-intl";
import type { FunctionInfo } from "@jiki/curriculum";
import styles from "./FunctionsView.module.css";

interface FunctionsViewProps {
  functions?: FunctionInfo[];
}

export default function FunctionsView({ functions }: FunctionsViewProps) {
  const t = useTranslations("codingExercise.functionsView");
  if (!functions || functions.length === 0) {
    return <div className={styles.empty}>{t("empty")}</div>;
  }

  return (
    <div className={styles.container}>
      {functions.map((func, index) => (
        <div key={index} className={styles.functionItem}>
          <div className={styles.functionHeader}>
            <h3 className={styles.signature}>{func.signature}</h3>
            <span className={styles.category}>{func.category}</span>
          </div>

          <div className="ui-textual-content ui-textual-content-compact">
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: marked.parse(func.description, { async: false }) }}
            />
          </div>

          {func.examples && func.examples.length > 0 && (
            <div className={styles.examples}>
              <p className={styles.examplesLabel}>{t("examples")}</p>
              <div className={styles.examplesList}>
                {func.examples.map((example, idx) => (
                  <div
                    key={idx}
                    className="ui-textual-content ui-textual-content-compact"
                    dangerouslySetInnerHTML={{
                      __html: marked.parse(`\`\`\`javascript\n${example}\n\`\`\``, { async: false })
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
