import ExercisePath from "@/components/dashboard/exercise-path/ExercisePath";
import SidebarLayout from "../../../components/layout/SidebarLayout";
import styles from './dashboard.module.css'

export default function DashboardPage() {
  return (
    <SidebarLayout activeItem="learn">
      <div className={styles.mainContent}>
        <ExercisePath />
      </div>
    </SidebarLayout>
  );
}
