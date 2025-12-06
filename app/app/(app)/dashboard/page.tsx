import ExercisePath from "@/components/dashboard/exercise-path/ExercisePath";
import ProjectsSidebar from "@/components/dashboard/projects-sidebar/ProjectsSidebar";
import SidebarLayout from "../../../components/layout/SidebarLayout";
import styles from "./dashboard.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Jiki",
  description: "Track your learning progress, continue coding exercises, and view your achievements."
};

export default function DashboardPage() {
  return (
    <SidebarLayout activeItem="learn">
      <div className={styles.dashboardContainer}>
        <div className={styles.mainContent}>
          <ExercisePath />
        </div>
        <ProjectsSidebar />
      </div>
    </SidebarLayout>
  );
}
