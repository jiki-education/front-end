import BetaTag from "@/components/common/BetaTag";
import ChallengesSidebar from "@/components/dashboard/challenges-sidebar/ChallengesSidebar";
import ExercisePath from "@/components/dashboard/exercise-path/ExercisePath";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import SidebarLayout from "../../../components/layout/SidebarLayout";
import styles from "./dashboard.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seo.dashboard");
  return { title: t("title"), description: t("description") };
}

export default function DashboardPage() {
  return (
    <SidebarLayout activeItem="learn">
      <BetaTag />
      <div className={styles.dashboardContainer}>
        <div className={styles.mainContent}>
          <ExercisePath />
        </div>
        <ChallengesSidebar />
      </div>
    </SidebarLayout>
  );
}
