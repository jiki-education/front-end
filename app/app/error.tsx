"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { ErrorPage } from "../components/error-page/ErrorPage";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("misc.errorPage");
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      import("@sentry/nextjs")
        .then((Sentry) => {
          Sentry.captureException(error);
        })
        .catch(() => {
          // Sentry failed to load - nothing we can do
        });
    }
  }, [error]);

  return (
    <ErrorPage
      statusCode={500}
      title={t("serverErrorTitle")}
      message={t("serverErrorMessage")}
      actionLabel={t("serverErrorAction")}
      onAction={reset}
    />
  );
}
