import { PageHeader } from "@/components/ui-kit/PageHeader";
import MedalIcon from "@static/icons/medal.svg";

export function AchievementsLoadingState() {
  return (
    <PageHeader
      icon={<MedalIcon />}
      title="Achievements"
      description="Every badge tells a story of your coding journey."
    >
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading achievements...</p>
        </div>
      </div>
    </PageHeader>
  );
}
