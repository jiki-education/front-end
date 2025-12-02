import ExercisePath from "@/components/dashboard/exercise-path/ExercisePath";
import InfoPanel from "@/components/dashboard/info-panel/InfoPanel";
import SidebarLayout from "../../../components/layout/SidebarLayout";

export default function DashboardPage() {
  return (
    <SidebarLayout activeItem="dashboard">
      <div className="flex">
        <main className="flex-1 p-6">
          <ExercisePath />
        </main>
        <InfoPanel />
      </div>
    </SidebarLayout>
  );
}
