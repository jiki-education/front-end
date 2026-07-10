import type { ChallengeData } from "@/lib/api/challenges";
import { useDelayedLoading } from "@/lib/hooks/useDelayedLoading";
import Link from "next/link";
import styles from "../ChallengesSidebar.module.css";
import { ChallengeCard } from "./ChallengeCard";
import { EmptyChallengesState } from "./EmptyChallengesState";
import { RecentChallengesSkeleton } from "./RecentChallengesSkeleton";

interface RecentChallengesProps {
  challenges: ChallengeData[];
  unlockedCount: number;
  onChallengeClick?: (challengeId: string) => void;
  onViewAllClick?: () => void;
  loading?: boolean;
}

export function RecentChallenges({ challenges, unlockedCount, loading }: RecentChallengesProps) {
  const shouldShowSkeleton = useDelayedLoading(loading ?? false);

  // If loading, show skeleton
  if (shouldShowSkeleton) {
    return <RecentChallengesSkeleton />;
  }

  // If no challenges, show empty state without wrapper
  if (challenges.length === 0) {
    return <EmptyChallengesState />;
  }

  // If has challenges, show them in section box
  return (
    <div className={styles.sectionBox}>
      <div className={styles.sectionTitle}>
        Recent Challenges
        {unlockedCount > 0 && <span className={styles.unlockedCount}>{unlockedCount} unlocked</span>}
      </div>

      <div className={styles.challengeCards}>
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.slug} challenge={challenge} />
        ))}
      </div>

      <Link href="/challenges" className={styles.viewAllBtn}>
        View All Challenges
      </Link>
    </div>
  );
}
