import Link from "next/link";
import { useTranslations } from "next-intl";
import type { LessonStatus } from "@/lib/api/lesson-progress";
import { lessonPath } from "@/lib/i18n/routes";
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
  const t = useTranslations("concepts.relatedExercises");
  if (exercises.length === 0) {
    return null;
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.header}>{t("heading")}</h3>
      <p className={styles.description}>{t("description")}</p>
      <div className={styles.list}>
        {exercises.map((ex) => (
          <ExerciseItem key={ex.slug} exercise={ex} status={getStatus(ex.slug)} isAuthenticated={isAuthenticated} />
        ))}
      </div>
    </div>
  );
}

function ExerciseItem({
  exercise,
  status,
  isAuthenticated
}: {
  exercise: ExerciseItem;
  status: LessonStatus;
  isAuthenticated: boolean;
}) {
  const routes = useLocaleRoutes();
  const t = useTranslations("concepts.relatedExercises");
  const stateClass = statusToClass(status);
  const className = `${styles.item} ${stateClass}`;

  // Nothing is locked to a logged-out visitor: they have no progress to gate on,
  // so every exercise points at its public teaser page rather than at the
  // exercise itself, which would only bounce them to sign up.
  if (!isAuthenticated) {
    return (
      <Link href={routes.exercise(exercise.slug)} className={`${styles.item} ${styles.available}`}>
        <LessonIcon slug={exercise.slug} width={48} height={48} />
        <span className={styles.itemName}>{exercise.title}</span>
      </Link>
    );
  }

  if (status === "locked") {
    return (
      <span className={className} title={t("locked")}>
        <LessonIcon slug={exercise.slug} width={48} height={48} />
        <span className={styles.itemName}>{exercise.title}</span>
      </span>
    );
  }

  return (
    <Link href={lessonPath(exercise.slug)} className={className}>
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
