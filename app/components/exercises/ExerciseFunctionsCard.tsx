"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { marked } from "marked";
import { getExercise, type FunctionInfo } from "@jiki/curriculum";
import { fetchExerciseMessages } from "@/lib/api/exercise-meta";
import { localizeExerciseDefinition } from "@/lib/i18n/localizeExercise";
import styles from "./ExerciseFunctionsCard.module.css";

interface ExerciseFunctionsCardProps {
  slug: string;
}

/**
 * The functions this exercise hands the student, shown as a taste of the API
 * they'll be writing against.
 *
 * The exercise module is the only place these live, so the card loads it
 * client-side after paint rather than dragging the whole exercise (its class,
 * scenarios and animations) into the server render of a marketing page. It
 * renders nothing until it has them, so the sidebar simply grows.
 */
export function ExerciseFunctionsCard({ slug }: ExerciseFunctionsCardProps) {
  const t = useTranslations("exercises.public.functions");
  const locale = useLocale();
  const functions = useExerciseFunctions(slug, locale);

  if (functions.length === 0) {
    return null;
  }

  return (
    <section className={styles.card}>
      <h3 className={styles.header}>{t("heading")}</h3>
      <p className={styles.description}>{t("description")}</p>
      <ul className={styles.list}>
        {functions.map((fn) => (
          <li key={fn.name} className={styles.item}>
            <code className={styles.signature}>{fn.signature}</code>
            <div
              className={styles.functionDescription}
              dangerouslySetInnerHTML={{ __html: marked.parseInline(fn.description) as string }}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

function useExerciseFunctions(slug: string, locale: string): FunctionInfo[] {
  const [functions, setFunctions] = useState<FunctionInfo[]>([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      // The dict resolves the curriculum's keyed description/category strings.
      // A failure here is not worth an error state on a teaser page — the card
      // just doesn't appear.
      const [exercise, messages] = await Promise.all([getExercise(slug), fetchExerciseMessages(slug, locale)]);
      if (cancelled || !exercise) {
        return;
      }
      setFunctions(localizeExerciseDefinition(exercise, messages).functions);
    };

    void load().catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [slug, locale]);

  return functions;
}
