import CompleteIcon from "@/icons/complete.svg";
import InProgressIcon from "@/icons/in-progress.svg";
import NotStartedIcon from "@/icons/not-started.svg";
import type { ChallengeData } from "@/lib/api/challenges";
import { ChallengesEmptyState } from "./ChallengesEmptyState";

interface NoChallengesFoundProps {
  challenges: ChallengeData[];
  activeTabId: string;
}

export function NoChallengesFound({ challenges, activeTabId }: NoChallengesFoundProps) {
  if (challenges.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No challenges available yet.</p>
      </div>
    );
  }

  switch (activeTabId) {
    case "in-progress":
      return (
        <ChallengesEmptyState
          variant="purple"
          icon={<InProgressIcon />}
          title="No challenges in progress"
          description={
            'You haven\'t started any challenges yet. Browse available challenges and click "Get started" to begin your first challenge.'
          }
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
            title="All challenges have been started"
            description="Great progress! You've started working on all available challenges. Keep going to complete them."
          />
        );
      }
      return (
        <ChallengesEmptyState
          variant="blue"
          icon={<NotStartedIcon />}
          title="No challenges to start yet"
          description="Challenges will appear here as you unlock them."
        />
      );
    }
    case "complete":
      return (
        <ChallengesEmptyState
          variant="green"
          icon={<CompleteIcon />}
          title="No completed challenges yet"
          description="Complete your first challenge to see it here. Keep working on your in-progress challenges to reach this milestone."
        />
      );
    default:
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No challenges found.</p>
        </div>
      );
  }
}
