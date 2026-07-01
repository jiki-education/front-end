import { useTranslations } from "next-intl";
import { ErrorPage } from "../components/error-page/ErrorPage";

export default function NotFound() {
  const t = useTranslations("misc.errorPage");
  return (
    <ErrorPage
      statusCode={404}
      title={t("notFoundTitle")}
      message={t("notFoundMessage")}
      actionLabel={t("notFoundAction")}
      actionHref="/"
    />
  );
}
