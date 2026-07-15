import CompleteIcon from "@/icons/complete.svg";
import InProgressIcon from "@/icons/in-progress.svg";
import NotStartedIcon from "@/icons/not-started.svg";
import type { ChallengeData } from "@/lib/api/challenges";
import { useTranslations } from "next-intl";
import { ChallengesEmptyState } from "./ChallengesEmptyState";

interface NoChallengesFoundProps {
  challenges: ChallengeData[];
  activeTabId: string;
}

export function NoChallengesFound({ challenges, activeTabId }: NoChallengesFoundProps) {
  const t = useTranslations("challenges.empty");

  if (challenges.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{t("noneAvailable")}</p>
      </div>
    );
  }

  switch (activeTabId) {
    case "in-progress":
      return (
        <ChallengesEmptyState
          variant="purple"
          icon={<InProgressIcon />}
          title={t("inProgressTitle")}
          description={t("inProgressDescription")}
        />
      );
    case "not-started": {
      const hasAnyProgress = challenges.some(
        (challenge) => challenge.status === "started" || challenge.status === "completed"
      );
      if (hasAnyProgress) {
        return (
          <ChallengesEmptyState
            variant="blue"
            icon={<NotStartedIcon />}
            title={t("allStartedTitle")}
            description={t("allStartedDescription")}
          />
        );
      }
      return (
        <ChallengesEmptyState
          variant="blue"
          icon={<NotStartedIcon />}
          title={t("noneToStartTitle")}
          description={t("noneToStartDescription")}
        />
      );
    }
    case "complete":
      return (
        <ChallengesEmptyState
          variant="green"
          icon={<CompleteIcon />}
          title={t("completedTitle")}
          description={t("completedDescription")}
        />
      );
    default:
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t("noneFound")}</p>
        </div>
      );
  }
}
