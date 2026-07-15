import { PageHeader } from "@/components/ui-kit/PageHeader";
import { useTranslations } from "next-intl";
import MedalIcon from "@/icons/medal.svg";

export function AchievementsLoadingState() {
  const t = useTranslations("achievements");
  return (
    <PageHeader icon={<MedalIcon />} title={t("title")} description={t("description")}>
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t("loading")}</p>
        </div>
      </div>
    </PageHeader>
  );
}
