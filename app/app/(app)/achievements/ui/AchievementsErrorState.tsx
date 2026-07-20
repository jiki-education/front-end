import { PageHeader } from "@/components/ui-kit/PageHeader";
import { useTranslations } from "next-intl";
import MedalIcon from "@/icons/medal.svg";

interface AchievementsErrorStateProps {
  error: string;
}

export function AchievementsErrorState({ error }: AchievementsErrorStateProps) {
  const t = useTranslations("achievements");
  return (
    <PageHeader icon={<MedalIcon />} title={t("title")} description={t("description")}>
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{t("error", { error })}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t("retry")}
          </button>
        </div>
      </div>
    </PageHeader>
  );
}
