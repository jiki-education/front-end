import Link from "next/link";
import { ErrorRobot } from "./ErrorRobot";
import styles from "./ErrorPage.module.css";

interface ErrorPageContentProps {
  variant: "notFound" | "serverError";
  title: string;
  message: string;
  actionLabel: string;
  actionHref?: string;
  onAction?: () => void;
}

export function ErrorPageContent({
  variant,
  title,
  message,
  actionLabel,
  actionHref,
  onAction
}: ErrorPageContentProps) {
  return (
    <>
      <div className={styles.logo}>JIKI</div>

      <ErrorRobot variant={variant} />

      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{message}</p>

      {actionHref ? (
        <Link href={actionHref} className={`ui-btn ui-btn-default ui-btn-primary ${styles.button}`}>
          {actionLabel} &rarr;
        </Link>
      ) : (
        <button onClick={onAction} className={`ui-btn ui-btn-default ui-btn-primary ${styles.button}`}>
          {actionLabel} &rarr;
        </button>
      )}
    </>
  );
}

interface ErrorPageProps {
  statusCode: 404 | 500;
  title: string;
  message: string;
  actionLabel: string;
  actionHref?: string;
  onAction?: () => void;
}

export function ErrorPage({ statusCode, title, message, actionLabel, actionHref, onAction }: ErrorPageProps) {
  const variant = statusCode === 404 ? "notFound" : "serverError";

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <ErrorPageContent
          variant={variant}
          title={title}
          message={message}
          actionLabel={actionLabel}
          actionHref={actionHref}
          onAction={onAction}
        />
      </div>
    </div>
  );
}
