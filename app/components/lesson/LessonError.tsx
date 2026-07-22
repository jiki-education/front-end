"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";

export default function LessonError({ error }: { error: string }) {
  const router = useRouter();
  const routes = useLocaleRoutes();
  const t = useTranslations("lesson");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-red-600 mb-4">{t("error.message", { error })}</p>
        <button
          onClick={() => router.push(routes.dashboard())}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t("backToDashboard")}
        </button>
      </div>
    </div>
  );
}
