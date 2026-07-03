import Link from "next/link";
import { useTranslations } from "next-intl";
import type { LessonStatus } from "@/lib/api/lesson-progress";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import { LessonIcon } from "@/components/icons/LessonIcon";
import styles from "./RelatedExercises.module.css";

interface ExerciseItem {
  slug: string;
  title: string;
}

interface RelatedExercisesProps {
  exercises: ExerciseItem[];
  getStatus: (slug: string) => LessonStatus;
  isAuthenticated: boolean;
}

export function RelatedExercises({ exercises, getStatus, isAuthenticated }: RelatedExercisesProps) {
  const routes = useLocaleRoutes();
  const t = useTranslations("concepts.relatedExercises");
  if (exercises.length === 0) {
    return null;
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.header}>{t("heading")}</h3>
      <p className={styles.description}>{t("description")}</p>
      {!isAuthenticated && (
        <p className={styles.signupPrompt}>
          {t.rich("signupPrompt", {
            link: (chunks) => (
              <Link href={routes.authSignup()} className={styles.signupLink}>
                {chunks}
              </Link>
            )
          })}
        </p>
      )}
      <div className={styles.list}>
        {exercises.map((ex) => (
          <ExerciseItem key={ex.slug} exercise={ex} status={getStatus(ex.slug)} />
        ))}
      </div>
    </div>
  );
}

function ExerciseItem({ exercise, status }: { exercise: ExerciseItem; status: LessonStatus }) {
  const t = useTranslations("concepts.relatedExercises");
  const stateClass = statusToClass(status);
  const className = `${styles.item} ${stateClass}`;

  if (status === "locked") {
    return (
      <span className={className} title={t("locked")}>
        <LessonIcon slug={exercise.slug} width={48} height={48} />
        <span className={styles.itemName}>{exercise.title}</span>
      </span>
    );
  }

  return (
    <Link href={`/lesson/${exercise.slug}`} className={className}>
      <LessonIcon slug={exercise.slug} width={48} height={48} />
      <span className={styles.itemName}>{exercise.title}</span>
    </Link>
  );
}

function statusToClass(status: LessonStatus): string {
  switch (status) {
    case "completed":
      return styles.completed;
    case "started":
      return styles.inProgress;
    case "not_started":
      return styles.available;
    case "locked":
      return styles.locked;
    default:
      status satisfies never;
      return styles.available;
  }
}
