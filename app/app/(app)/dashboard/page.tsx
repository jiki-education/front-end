import BetaTag from "@/components/common/BetaTag";
import ExercisePath from "@/components/dashboard/exercise-path/ExercisePath";
import ProjectsSidebar from "@/components/dashboard/projects-sidebar/ProjectsSidebar";
import SidebarLayout from "../../../components/layout/SidebarLayout";
import styles from "./dashboard.module.css";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

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
        <ProjectsSidebar />
      </div>
    </SidebarLayout>
  );
}
