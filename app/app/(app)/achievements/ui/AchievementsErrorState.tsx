import { PageHeader } from "@/components/ui-kit/PageHeader";
import MedalIcon from "@static/icons/medal.svg";

interface AchievementsErrorStateProps {
  error: string;
}

export function AchievementsErrorState({ error }: AchievementsErrorStateProps) {
  return (
    <PageHeader
      icon={<MedalIcon />}
      title="Achievements"
      description="Every badge tells a story of your coding journey."
    >
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    </PageHeader>
  );
}
